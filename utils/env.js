// tiny wrapper with default env vars
module.exports = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: process.env.PORT || 3111,
  POLYSWARM_API_URL:
    process.env.POLYSWARM_API_URL || 'http://artifact-index-e2e:9696',
  BATCH_SIZE: process.env.BATCH_SIZE || 10,
};
