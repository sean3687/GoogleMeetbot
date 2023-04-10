import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { executablePath } from 'puppeteer';
import fs from 'fs';
import AudioRecorder from 'node-audiorecorder';
import * as PuppeteerScreenRecorder from 'puppeteer-screen-recorder'
import RecordRTC from 'recordrtc';

import { getStream } from "puppeteer-stream";

const file = fs.createWriteStream("./test.webm");

// 1. Browser setting
puppeteer.use(StealthPlugin());
(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
    devtools: false,
    args: [
      "--window-size=1920,1080",
      "--window-position=1921,0",
      "--autoplay-policy=no-user-gesture-required",
    ],
    ignoreDefaultArgs: ["--mute-audio"],
    executablePath: executablePath(),
  });

  const page = await browser.newPage();
  const navigationPromise = page.waitForNavigation();
  const context = browser.defaultBrowserContext();

  await context.overridePermissions(
    "https://meet.google.com/", ["microphone", "camera", "notifications"]
  );

  // 1a. going to Meet after signing in
  await page.waitForTimeout(2500);
  await page.goto('https://meet.google.com/vne-fijx-xee' + '?hl=en', {
    waitUntil: 'networkidle0',
    timeout: 10000,
  });

  await navigationPromise;

  await page.waitForSelector('input[aria-label="Your name"]', {
    visible: true,
    timeout: 50000,
    hidden: false,
  });

  // 1b. turn off cam using Ctrl+E
  await page.waitForTimeout(1000);
  await page.keyboard.down('ControlLeft');
  await page.keyboard.press('KeyE');
  await page.keyboard.up('ControlLeft');
  await page.waitForTimeout(1000);

  //1c. turn off mic using Ctrl+D
  await page.waitForTimeout(1000);
  await page.keyboard.down('ControlLeft');
  await page.keyboard.press('KeyD');
  await page.keyboard.up('ControlLeft');
  await page.waitForTimeout(1000);

  //1d. click on input field to enter name
  await page.click(`input[aria-label="Your name"]`);

  //1d. enter name
  await page.type(`input[aria-label="Your name"]`, 'Bot');

  //1e. click on ask to join button
  await page.click(
    `button[class="VfPpkd-LgbsSe VfPpkd-LgbsSe-OWXEXe-k8QpJ VfPpkd-LgbsSe-OWXEXe-dgl2Hf nCP5yc AjY5Oe DuMIQc LQeN7 jEvJdc QJgqC"]`
  );
  


  setTimeout(async () => {
    await recorder.stop();
    await stream.destroy();
    file.close();
    console.log("finished");
    await browser.close();
  }, 15000)

})();