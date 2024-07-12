
const crypto = require('crypto');
const path = require('node:path');
const puppeteer = require('puppeteer');

const EXTENSION_PATH = './build';
let EXTENSION_ID;

let browser;

/// Generates the Extension ID for Chrome-ish from its instalation path dir
// Produced from samples in C++ and Python.
// Samples From: https://stackoverflow.com/questions/26053434/how-is-the-chrome-extension-id-of-an-unpacked-extension-generated
function getExtensionId(extensionPath) {
    absolutePath = path.resolve(extensionPath);

    // Calculate the SHA256 hash of the path
    const hash = crypto.createHash('sha256').update(absolutePath, 'utf8').digest('hex');

    // Take the first 32 characters of the hexadecimal hash
    let extensionId = '';
    for (let i = 0; i < 32; i++) {
      // Convert each hex character to its decimal ASCII value, add 97 (ASCII for 'a'),
      // and convert the result back to a character.
      extensionId += String.fromCharCode(parseInt(hash[i], 16) + 97);
    }

    console.log(`Extension ID detected: ${extensionId} <- ${absolutePath}`);
    return extensionId;
}

EXTENSION_ID = getExtensionId(EXTENSION_PATH);

beforeEach(async () => {
    // Launch the browser;
    browser = await puppeteer.launch({
        headless: 'new', // false,
        args: [
            `--disable-extensions-except=${EXTENSION_PATH}`,
            `--load-extension=${EXTENSION_PATH}`,
        ],
    })
});

afterEach(async () => {
    // Close the browser;
    browser && await browser.close();
});

test('ensure that the extension is installed correctly', async () => {
    const userPage = await browser.newPage();

    const workerTarget = await browser.waitForTarget(
        target => target.type() === 'service_worker' && target.url().endsWith('background.bundle.js')
    );
    const extensionWorker = await workerTarget.worker();

    let serviceWorker = await extensionWorker.evaluate(() => {
        return this.serviceWorker;
    });

    // Successifully installed the Service Worker of the extension?
    expect(serviceWorker).not.toBeUndefined();

    userPage.once('load', () => console.log('Page loaded!'));

    await userPage.goto(`http://httpbin.org`);
    await userPage.goto(`http://pudim.com.br`);

    // TODO: Test that no buffer was sent.

    await userPage.goto(`http://yahoo.com`);
    await userPage.goto(`http://polyswarm.network`);

    // TODO: Test that some buffer was sent.

    // Test that the serviceWorker had not died:
    serviceWorker = await extensionWorker.evaluate(() => {
        return this.serviceWorker;
    });
    expect(serviceWorker).not.toBeUndefined();

}, 60*1000);


// Some development helper
function _sleep(ms) {
    return new Promise((resolve) => setTimeout(() => resolve(), ms));
}
