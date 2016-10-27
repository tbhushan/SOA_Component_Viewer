"use strict";

function report_error(err) {
	console.log(err);
	alert(err);
	return;
};

function loadDataIntoKanbanComponent() {
	//statusList
	
	var listToLoad = [];
	for (i = 0; i < statusList.length; i++) {
		listToLoad.push({ header:statusList[i], body:{ view:"kanbanlist", status:statusList[i], multiselect: true }});
	}
	kanbancomponent_setList(listToLoad);

	kanbancomponent_resetdata();	
	var sm = ic_soa_data_getSheetList();
	
	for (var cur_sheet = 0; cur_sheet < sm.length; cur_sheet++) {
		var cur_sheet_data = sheet_data[sm[cur_sheet]];
		var data = [];
		if ("EDF"==sm[cur_sheet]) {
			for (cur_do = 0; cur_do < dataObjects.EDFkeys.length; cur_do++) {
				var cur_edf = dataObjects.EDFs[dataObjects.EDFkeys[cur_do]];
				data.push(
					{ 
						id: (1000 * cur_sheet) + cur_edf.uid, 
						text:cur_edf.name, 
						status: cur_edf.status, 
						$css: cur_sheet_data.css_tag, 
						tags: cur_edf.tags, 
						sheet_row: cur_edf.sheet_row,
						sheet_data_item: cur_sheet,
						$order: cur_edf.order,
						view_link: "http://localhost:8000/component_viewer.html?mode=EDF&name=" + cur_edf.name
					}
				);
			};
		} else if ("INT"==sm[cur_sheet]) {
			for (var cur_do = 0; cur_do < dataObjects.INTkeys.length; cur_do++) {
				var cur_int = dataObjects.INTs[dataObjects.INTkeys[cur_do]];
				data.push(
					{ 
						id: (1000 * cur_sheet) + cur_int.uid, 
						text:cur_int.name, 
						status: cur_int.status, 
						$css: cur_sheet_data.css_tag, 
						tags: cur_int.tags, 
						sheet_row: cur_int.sheet_row,
						sheet_data_item: cur_sheet,
						$order: cur_int.order,
						view_link: undefined //"http://localhost:8000/component_viewer.html?mode=INT&name=" + row[cur_sheet_data.namecol]
					}
				);
			};
		} else {
			console.log("Unknown sheet - " + sm[cur_sheet] + " kanban cards not loaded for this sheet");
		};
		kanbancomponent_appenddata(data);
	} //for cur_sheet	
	
};

function getKANBANHtml() {
	loadDataIntoKanbanComponent();

	var ret = "";
	ret += '<table border=0 height="100%" width="100%"><tr><td>';
	ret += GetMenu();
	ret += '</td></tr><tr height="100%"><td>';
	
	
	ret += kanbancomponent_create(null,null);
	
	ret += '</td></tr></table>';
	
	return ret;
};

function displayKANBAN() {
	document.getElementById('MAIN').innerHTML = getKANBANHtml();
	document.getElementById('MAIN').style.display = 'inline';
	kanbancomponent_init();
	
};