browser-extensions:
	npm run build

check-apikey:
		curl 'http://artifact-index-e2e:9696//v2/instance' \
		  -H 'authority: api.stage-new.polyswarm.network' \
		  -H 'accept: */*' \
		  -H 'accept-language: pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7' \
		  -H 'authorization: 11111111111111111111111111111111' \
		  -H 'sec-ch-ua: "Chromium";v="104", " Not A;Brand";v="99", "Google Chrome";v="104"' \
		  -H 'sec-ch-ua-mobile: ?0' \
		  -H 'sec-ch-ua-platform: "Linux"' \
		  -H 'sec-fetch-dest: empty' \
		  -H 'sec-fetch-mode: cors' \
		  -H 'sec-fetch-site: none' \
		  -H 'user-agent: Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.5112.79 Safari/537.36' \
		  --compressed ;

produce-telemetry:
		curl 'http://artifact-index-e2e:9696//v3/telemetry/' \
          -H 'authority: api.stage-new.polyswarm.network' \
          -H 'accept: */*' \
          -H 'accept-language: pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7' \
          -H 'authorization: 11111111111111111111111111111111' \
          -H 'content-type: application/json' \
          -H 'origin: chrome-extension://hagikoogphpeogkjbillinmoaephfddg' \
          -H 'sec-fetch-dest: empty' \
          -H 'sec-fetch-mode: cors' \
          -H 'sec-fetch-site: none' \
          -H 'user-agent: Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.5112.79 Safari/537.36' \
          --data-raw '{"resolutions":[{"type":"Resolution","attributes":{"host_name":"pudim.com.br","ip_address":"54.207.20.104"}}]}' \
          --compressed ;

