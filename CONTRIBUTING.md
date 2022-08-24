# PolySwarm NectarNet Browser Extension

This repository is the source tree for the PolySwarm browser extension for the NectarNet Program.
If you want to help us improve this browser extension, follow the guidance in this document.

# Chrome Extension Development

Our Chrome extension based off this
[boilerplate](https://github.com/lxieyang/chrome-extension-boilerplate-react).

## General

- [Getting Started Guide](https://developer.chrome.com/docs/extensions/mv3/getstarted/)

## Getting Running

See the original boilerplate's [README.md](https://github.com/lxieyang/chrome-extension-boilerplate-react/blob/master/README.md#procedures) for instructions on how to
use `npm start` and load a development version of the extension in your local chrome browser from
the `build` folder.

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

## Debug in Chrome

Google provides a [guide](https://developer.chrome.com/docs/extensions/mv3/tut_debugging/) for debugging Chrome Extensions.
If you want to Debug the background script in Chrome [this](https://dev.to/wataash/chrome-attach-debug-with-webstorm-328p) is a good guide.

## Submitting Changes

To submit changes to this project, first fork this project into your own GitHub account.
In your own account, create a branch based off of `master` with your changes in it.
Then create a Pull Request, in this parent repo, against `master` with your changes.
In the Pull Request description, provide details about what your changes are intended to do.

## Creating a Release

PolySwarm staff will manage tagging, versioning, and releases.

We use GitHub Actions to build and create releases automatically on push of a new tag.

```
$ npm version patch
v1.0.1
$ git push origin v1.0.1
```

Anytime a new version is to be released, make sure to update the following:

1. The [Rewards](https://docs.polyswarm.io/consumers/rewards/#browser-extension) page in the PolySwarm docs.
2. The `README.md` file in this repository.

# Safari Extension Development

COMING SOON...

# Other Notes

Our Google analytics indicate that 95% of our browser traffic to `.io` and `.network` is
from Chrome & Safari.
