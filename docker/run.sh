#! /bin/sh

set -ex

APPLICATION=${APPLICATION:-build}
PORT=${PORT}

if [ "$APPLICATION" == "web" ] && [ -z "$PORT" ]; then
  echo "The environment variable PORT must be provided." && exit 1
fi

case "$APPLICATION" in
  web) exec npm run start -p $PORT ;;
  build) exec make browser-extensions ;;
  test) exec npm run test ;;
  debug) exec sleep infinity ;;
  *) echo "The environment variable APPLICATION must be provided." && exit 1 ;;
esac
