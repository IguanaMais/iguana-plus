const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
(async () => {
 const browser = await chromium.launch({channel:'msedge',headless:true});
 const page = await browser.newPage({viewport:{width:1440,height:1000},reducedMotion:'reduce'});
 const errors=[], missing=[];
 page.on('pageerror', e=>errors.push(e.message));
 page.on('response', r=>{if(r.url().startsWith('http://127.0.0.1')&&r.status()>=400)missing.push(r.url());});
 await page.goto('http://127.0.0.1:8765');
 await page.locator('.service-card').first().waitFor();
 assert.equal(await page.locator('.service-card').count(),6);
 assert.equal(await page.locator('.project-card').count(),6);
 assert.equal(await page.locator('a[href="#"]').count(),0);
 for(const network of ['instagram','linkedin']){
  const urls=await page.locator(`[data-${network}]`).evaluateAll(es=>es.map(e=>e.href));
  assert.equal(urls.length,2); assert.equal(urls[0],urls[1]);
 }
 for(const filter of await page.locator('.filter-btn').all()){
  await filter.click();
  assert.equal(await filter.getAttribute('aria-pressed'),'true');
  const category=await filter.textContent();
  const expected=await page.evaluate(c=>window.IGUANA_PROJECTS.filter(p=>c==='Todos'||p.category===c).length,category);
  assert.equal(await page.locator('.project-card').count(),expected);
 }
 await page.getByRole('button',{name:'Todos',exact:true}).click();
 await page.locator('#chat-toggle').click();
 await page.getByRole('button',{name:'💻 Desenvolvimento de sites',exact:true}).click();
 await page.getByRole('button',{name:'Quero saber mais',exact:true}).click();
 assert.equal(await page.locator('.chat-message').count(),2);
 assert.equal(await page.locator('#chat-widget').evaluate(e=>getComputedStyle(e).visibility),'visible');
 await page.keyboard.press('Escape');
 assert.equal(await page.locator('#chat-toggle').getAttribute('aria-expanded'),'false');
 await page.locator('.form-submit').click();
 assert.equal(await page.locator('[aria-invalid=true]').count(),6);
 await page.locator('#f-nome').fill('Teste local');
 await page.locator('#f-empresa').fill('Teste');
 await page.locator('#f-email').fill('errado');
 await page.locator('#f-whatsapp').fill('abc');
 await page.locator('#f-servico').selectOption({label:'Desenvolvimento Web'});
 await page.locator('#f-mensagem').fill('Validação local sem envio.');
 await page.locator('.form-submit').click();
 assert.equal(await page.locator('[aria-invalid=true]').count(),2);
 await page.locator('#f-email').fill('teste@example.com');
 await page.locator('#f-whatsapp').fill('(11) 99999-9999');
 let count=0, mode='failure';
 await page.route('https://api.web3forms.com/submit',async route=>{
  count++;
  const body=route.request().postData();
  assert.ok(body.includes('replyto')); assert.ok(body.includes('teste@example.com'));
  await new Promise(r=>setTimeout(r,150));
  if(mode==='network')return route.abort();
  await route.fulfill({status:mode==='http'?503:200,contentType:'application/json',body:JSON.stringify({success:mode==='success'})});
 });
 for(const m of ['failure','http','network','success']){
  mode=m;
  await page.locator('.form-submit').click();
  assert.equal(await page.locator('.form-submit').isDisabled(),true);
  await page.locator('form').evaluate(f=>f.dispatchEvent(new Event('submit',{cancelable:true})));
  await page.waitForFunction(()=>!document.querySelector('.form-submit').disabled);
  assert.equal(await page.locator('.form-status').getAttribute('class'),m==='success'?'form-status visible success':'form-status visible error-msg');
  assert.equal(await page.locator('#f-nome').inputValue(),m==='success'?'':'Teste local');
 }
 assert.equal(count,4);
 for(const width of [320,375,768,880,900,1024,1440]){
  await page.setViewportSize({width,height:900});
  await page.evaluate(()=>window.scrollTo(0,0));
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`Overflow at ${width}`);
  if(width<=880){
   await page.locator('.menu-toggle').click();
   assert.equal(await page.locator('.mobile-panel').evaluate(e=>e.inert),false);
   await page.keyboard.press('Escape');
   assert.equal(await page.locator('.mobile-panel').evaluate(e=>e.inert),true);
   await page.locator('.menu-toggle').click();
   await page.locator('.mobile-panel a[href="#contato"]').click();
   assert.equal(await page.locator('.menu-toggle').getAttribute('aria-expanded'),'false');
  }
  await page.locator('#chat-toggle').click();
  const box=await page.locator('#chat-widget').boundingBox();
  assert.ok(box.x>=0&&box.x+box.width<=width&&box.y>=0,`Chat outside ${width}`);
  await page.locator('#chat-close').click();
 }
 await page.setViewportSize({width:375,height:812});
 await page.evaluate(()=>window.scrollTo(0,0));
 await page.locator('#chat-toggle').click();
 await page.locator('#chat-close').click();
 await page.setViewportSize({width:1440,height:1000});
 await page.locator('#portfolio').scrollIntoViewIfNeeded();
 await page.reload();
 await page.route('**/assets/data/chat.json',r=>r.fulfill({status:503,body:'Unavailable'}));
 await page.locator('#chat-toggle').click();
 await page.getByRole('link',{name:'Falar no WhatsApp',exact:true}).waitFor();
 await page.unroute('**/assets/data/chat.json');
 await page.locator('#chat-close').click();
 await page.locator('#chat-toggle').click();
 await page.getByRole('button',{name:'💻 Desenvolvimento de sites',exact:true}).waitFor();
 assert.equal(errors.length,0,errors.join('\n'));
 assert.equal(missing.filter(u=>!u.endsWith('/chat.json')).length,0,missing.join('\n'));
 console.log('PASS: render, local assets, social links, all filters, chat navigation/fallback/retry, form validation/success/API errors/network error/duplicate prevention, keyboard menu, responsive 320–1440px.');
 await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
