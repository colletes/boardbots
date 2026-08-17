const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('BROWSER LOG:', msg.text()));
  page.on('pageerror', error => console.error('BROWSER ERROR:', error.message));

  await page.goto('file://' + __dirname + '/tools/dice_roller_v1.html');
  
  // Wait a bit for init
  await new Promise(r => setTimeout(r, 2000));
  
  // Set count of d6 to 1
  await page.evaluate(() => {
    window.incDie(6, 1);
  });
  
  // Click Roll
  console.log("Rolling...");
  await page.evaluate(() => {
    window.rollDice();
  });
  
  await new Promise(r => setTimeout(r, 4000));
  
  await browser.close();
})();
