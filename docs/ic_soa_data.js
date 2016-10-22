"use strict";

function ic_soa_data_getSheetID() {
	return '1u_DNhV7NO16uHZSP1KeYfAorW9tvwD9gbbYsCRp07G8';
};
function ic_soa_data_getListsRange() {
	return 'Data!A2:A';
};

function ic_soa_data_getSheetList() {
	var ret = [];
	ret.push("EDF");
	ret.push("INT");
	ret.push("PRES");
	return ret;
};

function ic_soa_data_getSheetMetrics() {
	var ret = {};
	
	ret["EDF"] = {
		datarange: 'EDFList!A2:F',
		sheet_name: 'EDFList',
		css_tag: 'RED',
		indexcol: 1,
		toprow: 2,
		namecol: 2,
		listcol: 3,
		tagscol: 5,
		uidcol: 0,
		source_sys_col: 4
	};
	ret["INT"] = {
		datarange: 'Integration!A2:G',
		sheet_name: 'Integration',
		css_tag: 'GREEN',
		indexcol: 1,
		toprow: 2,
		namecol: 4,
		listcol: 5,
		tagscol: 6,
		uidcol: 0,
		target_sys_col: 3,
		source_edf_col: 2
	};
	ret["PRES"] = {
		datarange: 'Presentation!A2:H',
		sheet_name: 'Presentation',
		css_tag: 'BLUE',
		toprow: 2,
		uidcol: 0,
		indexcol: 1,
		namecol: 3,
		listcol: 4,
		tagscol: 5,
		provider_sys_col: 6,
		known_client_col: 7,
		rawnamecol: 2
	};
	
	return ret;
};

function ic_soa_data_getDataObject(sheetList, sheetMetrics, googleAPIResult, numPre) {
	//numPre - number of ranges in the result before the sheets
	//   sheets must be at the end

	var EDFkeys = [];
	var EDFs = {};

	var INTkeys = [];
	var INTs = {};

	var PRESkeys = [];
	var PRESs = {};

	var SYSTEMkeys = [];
	var SYSTEMs = {};

	//console.log(googleAPIResult);
	//Can't rely on result to match it with Sheet
	//So assuming the order matches the order in getSheetList

	if (googleAPIResult.length != (sheetList.length + numPre)) {
		report_error("Bad response");
		return;
	};

	var range = googleAPIResult[0 + numPre]; //0 = EDF
	var cur_sheet_metrics = sheetMetrics[sheetList[0]];
	if (range.values.length > 0) {
		for (i = 0; i < range.values.length; i++) {
			var row = range.values[i];
			var source_system = row[cur_sheet_metrics.source_sys_col];
			EDFkeys.push(row[cur_sheet_metrics.uidcol]);
			EDFs[row[cur_sheet_metrics.uidcol]] = {
				uid: row[cur_sheet_metrics.uidcol],
				name: row[cur_sheet_metrics.namecol],
				status: row[cur_sheet_metrics.listcol],
				tags: row[cur_sheet_metrics.tagscol],
				sheet_row: (i+cur_sheet_metrics.toprow),
				order: row[cur_sheet_metrics.indexcol],
				source_system: source_system,
			}
			if (typeof(SYSTEMs[source_system])=="undefined") {
				SYSTEMkeys.push(source_system);
				SYSTEMs[source_system] = {
					uid: source_system,
					name: source_system
				}
			}
		}
	} else {
		console.log(response);
		report_error("Bad Data in " + cur_sheet + " range");
		return;
	}

	range = googleAPIResult[1 + numPre]; //0 = EDF
	cur_sheet_metrics = sheetMetrics[sheetList[1]];
	if (range.values.length > 0) {
		for (i = 0; i < range.values.length; i++) {
			var row = range.values[i];
			var target_system = row[cur_sheet_metrics.target_sys_col];
			INTkeys.push(row[cur_sheet_metrics.uidcol]);
			INTs[row[cur_sheet_metrics.uidcol]] = {
				uid: row[cur_sheet_metrics.uidcol],
				name: row[cur_sheet_metrics.namecol],
				status: row[cur_sheet_metrics.listcol],
				tags: row[cur_sheet_metrics.tagscol],
				sheet_row: (i+cur_sheet_metrics.toprow),
				order: row[cur_sheet_metrics.indexcol],
				target_system: target_system,
				source_edf: row[cur_sheet_metrics.source_edf_col],
			}
			if (typeof(SYSTEMs[target_system])=="undefined") {
				SYSTEMkeys.push(target_system);
				SYSTEMs[target_system] = {
					uid: target_system,
					name: target_system
				}
			}
		}
	} else {
		console.log(response);
		report_error("Bad Data in " + cur_sheet + " range");
		return;
	}

	range = googleAPIResult[2 + numPre]; //0 = PRES
	cur_sheet_metrics = sheetMetrics[sheetList[2]];
	if (range.values.length > 0) {
		for (i = 0; i < range.values.length; i++) {
			var row = range.values[i];
			var provider_system = row[cur_sheet_metrics.provider_sys_col];

			//Load known clients
			var known_clients = [];
			var comma_seperated_list_of_clients = row[cur_sheet_metrics.known_client_col];
			if (typeof(comma_seperated_list_of_clients)!="undefined") {
				var client_array = comma_seperated_list_of_clients.split(",");
				for(var i = 0; i < client_array.length; i++) {
					known_clients.push(client_array[i].trim());
				}
			};
			for(var i = 0; i < known_clients.length; i++) {
				if (typeof(SYSTEMs[known_clients[i]])=="undefined") {
					//Add known clients to SYSTEMs array
					SYSTEMkeys.push(known_clients[i]);
					SYSTEMs[known_clients[i]] = {
						uid: known_clients[i],
						name: known_clients[i]
					}
				};
			};

			PRESkeys.push(row[cur_sheet_metrics.uidcol]);
			PRESs[row[cur_sheet_metrics.uidcol]] = {
				uid: row[cur_sheet_metrics.uidcol],
				name: row[cur_sheet_metrics.namecol],
				status: row[cur_sheet_metrics.listcol],
				tags: row[cur_sheet_metrics.tagscol],
				sheet_row: (i+cur_sheet_metrics.toprow),
				order: row[cur_sheet_metrics.indexcol],
				provider_system: provider_system,
				rawname: row[cur_sheet_metrics.rawnamecol],
				known_clients: known_clients,
			}
			if (typeof(SYSTEMs[provider_system])=="undefined") {
				SYSTEMkeys.push(provider_system);
				SYSTEMs[provider_system] = {
					uid: provider_system,
					name: provider_system
				}
			}
		}
	} else {
		console.log(response);
		report_error("Bad Data in " + cur_sheet + " range");
		return;
	}

	return {
		EDFkeys: EDFkeys,
		EDFs: EDFs,
		INTkeys: INTkeys,
		INTs: INTs,
		SYSTEMkeys: SYSTEMkeys,
		SYSTEMs: SYSTEMs,
		PRESkeys: PRESkeys,
		PRESs: PRESs 
	};
};

//Given the name of an edf return it's object from dataobjects
function ic_soa_data_getEDFFromName(edfName, dataObjects) {
	for (var cur_do = 0; cur_do < dataObjects.EDFkeys.length; cur_do++) {
		if (dataObjects.EDFs[dataObjects.EDFkeys[cur_do]].name==edfName) return dataObjects.EDFs[dataObjects.EDFkeys[cur_do]];
	}
	//console.log("Failed to find edf named " + edfName);
	return undefined;
}

//Given the name of a system return it's object from dataobjects
function ic_soa_data_getSystemFromName(systemName, dataObjects) {
	for (var cur_do = 0; cur_do < dataObjects.SYSTEMkeys.length; cur_do++) {
		if (dataObjects.SYSTEMs[dataObjects.SYSTEMkeys[cur_do]].name==systemName) return dataObjects.SYSTEMs[dataObjects.SYSTEMkeys[cur_do]];
	}
	//console.log("Failed to find edf named " + edfName);
	return undefined;
}


