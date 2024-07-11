
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
    // TODO: Launch the browser;
    browser = await puppeteer.launch({
        headless: false,
        args: [
            `--disable-extensions-except=${EXTENSION_PATH}`,
            `--load-extension=${EXTENSION_PATH}`,
        ],
    })
});

afterEach(async () => {
    // TODO: Close the browser;
    await browser.close();
    browser = undefined;
});

test('dummy test to ensure test infra correctness', async () => {
    const page = await browser.newPage();

    // await page.goto(`chrome-extension://${EXTENSION_ID}/popup.html`);
    await page.goto(`http://httpbin.org`);
});
