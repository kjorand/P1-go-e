# P1-go-e
Simple nodeJS project to link a Home-Wizard P1 and a go-e to use PV-Surplus

## Requirements
It requires a PC with `node.js`. For "production" use I suggest using `pm2` which can be installed simply by :
```sh
npm i -g pm2
```

Of course, both the go-e charger (with local API v2 enabled) and Home Wizard P1 must also be present and set up (on the same subnet, ideally).

## Setup
Aside from the aforementioned requirements, cloning this repo and setting up the `P1_HOST` and `GOE_HOST` with their respective local IPs in the `.env` file should be enough to get you started. [example : `P1_HOST="192.168.1.5"`]

> [!IMPORTANT]
> If using `pm2` it is crucial to have at least `P1_HOST` and `GOE_HOST`. PM2 will handle the error message and since the program will exit, PM2 will automatically restart it ... infinitely

## Start
You can start a simple instance by :
```sh
npm run start
```

... or a PM2 instance (recommended) via
```sh
npm run start_pm2
```

> [!NOTE]
> Both those versions are run with a `--watch` argument ... letting them take into account any modification made to the files ... that includes any update to the script; so with any update

## Acknowledgement
This little script was written with the help of :
- The [go-e github](https://github.com/goecharger/go-eCharger-API-v2/blob/main/introduction-en.md)
- The [HomeWizard doc](https://api-documentation.homewizard.com/docs/endpoints/api-v1-data/)
