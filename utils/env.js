// tiny wrapper with default env vars
module.exports = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: process.env.PORT || 3111,
  AI_BASE_URL: process.env.AI_BASE_URL || 'http://artifact-index-e2e:9696',
};
