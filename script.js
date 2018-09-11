const recalculate = function () {
	
	//Original code written in C by /u/Darker7
	//Original code: https://pastebin.com/5fxgNb6z
	//Original post: https://old.reddit.com/r/Trimps/comments/9ep5u2/how_to_fuel_most_efficiently/
	
	//Ported to JavaScript, cleaned up and docummented by /u/PatPL
	
	//====
	// Output objects setup
	
	const outputMinObject = document.getElementById ("minZoneOutput");
	const outputMaxObject = document.getElementById ("maxZoneOutput");
	
	//====
	// Input validation & parsing
	
	let supplyLevel = document.getElementById ("supplyInput");
	let fuellingZones = document.getElementById ("fuellingInput");
	let fuellingLimit = document.getElementById ("limitInput");
	
	//Checks whether input value passed HTML validation (is a number and is not empty)
	if (!supplyLevel.checkValidity () || !fuellingZones.checkValidity () || !fuellingLimit.checkValidity ()) {
		outputMinObject.innerHTML = "Invalid";
		outputMaxObject.innerHTML = "Input";
		
		return;
	}
	
	//Parsing into int
	supplyLevel = parseInt (supplyLevel.value);
	fuellingZones = parseInt (fuellingZones.value);
	fuellingLimit = parseInt (fuellingLimit.value);
	
	//====
	// Tauntimp bonus
	
	//Data as of Trimps v4.91
	const singleTauntimpMultiplier = 1.003;
	const tauntimpSpawnChance = 0.03;
	
	//I believe that cell 100 (blimp/Improbability etc.) can never be an import, so i'll exclude it
	const averageTauntimpsPerZone = 0.03 * 99;
	
	const baseTauntimpMultiplier = singleTauntimpMultiplier ** averageTauntimpsPerZone;
	
	//====
	// Main calculations
	
	let maxSupplyOffset = supplyLevel * 2; //How many zones into magma do we gain fuel per magma cell
	let maxSupplyZone = 230 + maxSupplyOffset; //Up to which world zone do we gain fuel per magma cell
	//Fuel variables are multiplied by 100 to stay in integers. Value 20 in variable means 0.2 units of Fuel
	let maxFuelPerCell = 20 + maxSupplyOffset; //Maximum possible fuel gain per magma cell
	let currentFuelPerCell = maxFuelPerCell - 1; //"Current" fuel gain per magma cell (It decreases by 1 later on every while loop iteration)
	let Tauntbonus_add = 1.0; //Average tauntimp bonus gained during fuelling (?)
	let Tauntbonus_subtract = 1.0; //not sure what it is
	let n = 0 // How many zones before maxSupplyZone do we want to start fuelling
	let sum_new = 0; //Looks like it is the amount of fuel gained after fuelling, but it includes multiplying by tauntimps
	let sum_old = 0;
	
	//This loop probably checks average tauntimp bonus after all fuelling zones and fuel gained
	//Looks like it assumes you already passed your maxSupplyZone during fuelling
	for (let i = 0; i < fuellingZones; ++i) {
		sum_new += maxFuelPerCell * Tauntbonus_add;
		Tauntbonus_add *= baseTauntimpMultiplier;
	}
	
	//I will need some more time to understand this, maybe will do later.
	//For now i'll leave it as it is.
	while (sum_new > sum_old) {
		sum_old = sum_new;
		
		sum_new = sum_new - (maxFuelPerCell * Tauntbonus_subtract) + (currentFuelPerCell * Tauntbonus_add);
		
		--currentFuelPerCell;
		Tauntbonus_add *= baseTauntimpMultiplier;
		Tauntbonus_subtract *= baseTauntimpMultiplier;
		
		++n;
		
		if (n > fuellingZones) {
			--maxFuelPerCell;
		}
		
		
		if (n > maxSupplyOffset) {
			break;
		}
	}
	
	--n;
	
	if (fuellingZones > fuellingLimit - 230) {
		n = maxSupplyOffset;
	} else if (maxSupplyZone - n + fuellingZones > fuellingLimit) {
		n = -fuellingLimit + fuellingZones + maxSupplyZone;
	}
	
	outputMinObject.innerHTML = maxSupplyZone - n;
	outputMaxObject.innerHTML = maxSupplyZone - n + fuellingZones;
	
	return;
}