const {chromium}=require('playwright');
const fs=require('node:fs');
const assert=require('node:assert/strict');
const path=require('node:path');
const source=fs.readFileSync(path.join(__dirname,'../js/data.js'),'utf8');
(async()=>{
 const browser=await chromium.launch({channel:'msedge',headless:true});
 try{
  for(const width of [375,1440]){
   for(const count of [0,1,4]){
    const page=await browser.newPage({viewport:{width,height:950},reducedMotion:'reduce'});
    const errors=[];page.on('pageerror',e=>errors.push(e.message));
    // Fotos repetidas são fixtures de teste, nunca gravadas no portfólio real.
    const fixture=Array.from({length:count},(_,i)=>({id:'test-'+i,title:'Teste '+i,image:'assets/img/folder_barbearia.jpg'}));
    await page.route('**/js/data.js',r=>r.fulfill({contentType:'text/javascript',body:source+'\nwindow.IGUANA_PROJECTS='+JSON.stringify(fixture)+';'}));
    await page.goto('http://127.0.0.1:8765/#portfolio',{waitUntil:'domcontentloaded'});
    assert.equal(await page.locator('.portfolio-slide').count(),count);
    assert.equal(await page.locator('[data-carousel-controls]').isVisible(),count>1);
    if(count>1){
     const active=()=>page.locator('.portfolio-slide.is-active').getAttribute('aria-label');
     await page.locator('[data-carousel-next]').click();
     await page.waitForFunction(()=>document.querySelector('.portfolio-slide.is-active').getAttribute('aria-label')==='2 de 4');
     await page.locator('[data-carousel-track]').focus();
     await page.keyboard.press('End');assert.equal(await active(),'4 de 4');
     assert.equal(await page.locator('[data-carousel-next]').isDisabled(),true);
     await page.keyboard.press('Home');assert.equal(await active(),'1 de 4');
     await page.locator('.portfolio-dot').nth(2).click();
     assert.equal(await active(),'3 de 4');
     await page.setViewportSize({width:width===375?1024:375,height:950});
     await page.waitForFunction(()=>{
      const t=document.querySelector('[data-carousel-track]'),s=document.querySelector('.portfolio-slide.is-active');
      return Math.abs((s.offsetLeft+s.offsetWidth/2)-(t.scrollLeft+t.clientWidth/2))<3;
     });
     assert.equal(await active(),'3 de 4');
     await page.locator('[data-carousel-track]').evaluate(t=>t.scrollTo({left:0,behavior:'instant'}));
     await page.waitForFunction(()=>document.querySelector('.portfolio-slide.is-active').getAttribute('aria-label')==='1 de 4');
    }
    assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
    assert.deepEqual(errors,[]);await page.close();
   }
  }
  const page=await browser.newPage({viewport:{width:1440,height:950}});
  await page.route('**/js/data.js',r=>r.fulfill({contentType:'text/javascript',body:source+'\nwindow.IGUANA_PROJECTS=Array.from({length:4},(_,i)=>({title:"Teste "+i,image:"assets/img/folder_barbearia.jpg"}));'}));
  await page.goto('http://127.0.0.1:8765/#portfolio',{waitUntil:'domcontentloaded'});
  await page.locator('[data-carousel-next]').click();
  await page.waitForFunction(()=>{const t=document.querySelector('[data-carousel-track]'),s=t.children[1];return Math.abs(s.offsetLeft+s.offsetWidth/2-t.scrollLeft-t.clientWidth/2)<3;});
  await page.locator('[data-motion-toggle]').click();
  assert.equal(await page.locator('html').getAttribute('class'),'motion-paused');
  await page.locator('#inicio').scrollIntoViewIfNeeded();
  assert.equal(await page.locator('.hero-visual .mascot-img').evaluate(e=>getComputedStyle(e).animationPlayState),'paused');
  await page.locator('[data-motion-toggle]').click();
  await page.locator('#inicio').scrollIntoViewIfNeeded();
  await page.waitForFunction(()=>getComputedStyle(document.querySelector('.hero-visual .mascot-img')).animationPlayState==='running');
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.waitForFunction(()=>document.querySelector('[data-motion-toggle]').disabled);
  assert.equal(await page.locator('[data-motion-toggle]').isDisabled(),true);
  console.log('PASS: 0/1/4 photos, mobile/desktop, buttons, keyboard, dots, swipe-equivalent scrolling, resize, animated centering, pause and reduced motion.');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exit(1)});
