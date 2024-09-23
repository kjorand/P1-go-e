const fs = require('fs/promises');

const P1_HOST  = process.env.P1_HOST ?? null;
const GOE_HOST = process.env.GOE_HOST ?? null;

const DYNAMIC_FILE = process.env.DYNAMIC_FILE ?? null;

const RELAY_DELAY = process.env.RELAY_DELAY ?? 1000;
const DYNAMIC_DELAY_MULTIPLIER = process.env.DYNAMIC_DELAY_MULTIPLIER ?? 64;
const LOG_DELAY_MULTIPLIER = process.env.LOG_DELAY_MULTIPLIER ?? 16;

if(GOE_HOST === null || P1_HOST === null){
	console.log("Both go-e and P1 IPs must be provided");
	console.log("Terminating");
	process.exitCode = 1;
	return "Both go-e and P1 IPs must be provided";
}

let dynamic = {
	'offset': 0
}

let counter = -1;

console.log("Starting monitoring power and updating go-e");

setInterval(() => {
	counter += 1;
	if(DYNAMIC_FILE !== null && DYNAMIC_FILE.length > 0 && counter % DYNAMIC_DELAY_MULTIPLIER === 0){
		fs.readFile(DYNAMIC_FILE)
			.then((data) => {
				return JSON.parse(data);
			})
			.catch((e) => {
				console.error("Error in reading dynamic");
				console.error(e);
				return null;
			})?.then((ob)=>{
				if(ob?.OFFSET){
					dynamic.offset = ob.OFFSET;
					console.log(`offset is now : ${dynamic.offset}`);
				}
			});
	}
	fetch(`http://${P1_HOST}/api/v1/data`)
		.catch(e=>{
			console.error("Error in fetching");
			console.error(e);
		})?.then((response)=>{
			if(response?.ok){
				return response.json()
			}
			console.error(`Error fetching P1 values : ${response}`);
			return null;
		})?.then((jsonResult)=>{
			const power = jsonResult.active_power_w;
			const transmitPower = parseInt(power) + dynamic.offset;
			if(counter % LOG_DELAY_MULTIPLIER === 0){
				console.log(`Current power : ${power} [W] (transmitted ${transmitPower} [W] to go-e)`);
			}
			return fetch(`http://${GOE_HOST}/api/set?ids={"pGrid":${transmitPower}}`);
		}).catch(e=>{
			console.error("Error in setting");
			console.error(e);
		})?.then((response)=>{
			if(response?.ok){
				return response.json()
			}
			console.error(`Error setting Go-e values : ${response}`);
			return null;
		})?.then((jsonResult)=>{
			if(counter % 16 === 0){
				console.log(`Go-e response : ${JSON.stringify(jsonResult)}`);
			}
		});
}, RELAY_DELAY);
