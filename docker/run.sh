#! /bin/sh

set -ex

APPLICATION=${APPLICATION:-web}
PORT=${PORT}

if [ "$APPLICATION" == "web" ] && [ -z "$PORT" ]; then
  echo "The environment variable PORT must be provided." && exit 1
fi

case "$APPLICATION" in
  web) exec yarn serve -p $PORT ;;
  build) exec make browser-extensions ;;
  test) exec yarn test:ci ;;
  debug) exec sleep infinity ;;
  *) echo "The environment variable APPLICATION must be provided." && exit 1 ;;
esac
