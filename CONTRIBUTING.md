# PPDNS Chrome Extension

This is the source tree for the PolySwarm Chrome extension based off this
[boilerplate](https://github.com/lxieyang/chrome-extension-boilerplate-react).

# Chrome Extension Development

## General

All development is done with Webstorm so we don't have fight with PyCharm and configuring it for JS.

[Guide](https://developer.chrome.com/docs/extensions/mv3/getstarted/)
Looks like extensions also works in [Safari](https://discussions.apple.com/thread/252038865#:~:text=Answer%3A%20A%3A-,Answer%3A%20A%3A,and%20click%20on%20Safari%20extensions.)
too.
[Intellij](https://stackoverflow.com/questions/13997468/how-do-i-use-webstorm-for-chrome-extension-development) support for
code completion on chrome variable will be helpful in extension development.

If you want to Debug the background script in chrome [here](https://dev.to/wataash/chrome-attach-debug-with-webstorm-328p) is a good guide.

## Getting Running

Run configs are available in `webstorm/runconfigs`.
See the original boilerplate [readme](README.orig.md) for instructions on how to
use `npm start` and load a development version of the extension in your local chrome browser from
the [build](build) folder.

## Requirements

- [Node.js](https://nodejs.org/) >= **14**
- Chrome

## Setup development environment

1. Run `npm install` to install the dependencies.
2. Run `npm start`
3. Load your extension on Chrome following:
   1. Access `chrome://extensions/`
   2. Check `Developer mode`
   3. Click on `Load unpacked extension`
   4. Select the `build` folder.

# Debug in Chrome

https://developer.chrome.com/docs/extensions/mv3/tut_debugging/

# User Data

It appears from Google analytics that 95% of our browser traffic to `.io` and `.network` is
comprised of Chrome & Safari. Therefore, we'll ignore firefox for the moment.
