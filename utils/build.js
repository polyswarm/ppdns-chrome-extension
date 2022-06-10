// Do this as the first thing so that any code reading it knows the right env.
process.env.BABEL_ENV = 'production';
process.env.NODE_ENV = 'production';
process.env.ASSET_PATH = '/';

var webpack = require('webpack'),
  config = require('../webpack.config'),
  ffConfig = require('../webpack.ff.config');

delete config.chromeExtensionBoilerplate;
delete ffConfig.chromeExtensionBoilerplate;

config.mode = ffConfig.mode = 'production';

webpack(config, function (err) {
  if (err) throw err;
});

webpack(ffConfig, function (err) {
  if (err) throw err;
});
