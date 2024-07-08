const puppeteer = require('puppeteer');
const { textSpanContainsPosition } = require('typescript');

const EXTENSION_PATH = './build';
const EXTENSION_ID = 'DEADBEEF';

let browser;

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
