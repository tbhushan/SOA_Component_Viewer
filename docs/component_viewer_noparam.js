"use strict";	

function getNOPARAMHtml() {
	var ret = "";
	
	ret += "<table><tr>";
	ret += "<td colspan=\"5\">";
	ret += GetMenu();
	ret += "<h1>Component Viewer</h1>";
	ret += "</td></tr><tr class=\"main\">";

	ret += "<td valign=\"top\"><h2>Systems</h1>";
	ret += "<ul>";
	for (var cur_do = 0; cur_do < dataObjects.SYSTEMkeys.length; cur_do++) {
		var cur_sys = dataObjects.SYSTEMs[dataObjects.SYSTEMkeys[cur_do]];
		ret += "<li><a href=\"javascript:displaySYSTEM('" + cur_sys.name + "');\">" + cur_sys.name + "</a></li>";
	}
	ret += "</ul></td>";

	ret += "<td valign=\"top\"><h2>EDFs</h1>";
	ret += "<ul>";
	for (var cur_do = 0; cur_do < dataObjects.EDFkeys.length; cur_do++) {
		var cur_edf = dataObjects.EDFs[dataObjects.EDFkeys[cur_do]];
		ret += "<li><a href=\"javascript:displayEDF('" + cur_edf.uid + "')\">" + cur_edf.name + "</a></li>";
	}
	ret += "</ul></td>";

	ret += "<td valign=\"top\"><h2>Integrations</h1>";
	ret += "<ul>";
	for (var cur_do = 0; cur_do < dataObjects.INTkeys.length; cur_do++) {
		var cur_int = dataObjects.INTs[dataObjects.INTkeys[cur_do]];
		ret += "<li><a href=\"javascript:displayINT('" + cur_int.uid + "')\">" + cur_int.name + "</a></li>";
	}
	ret += "</ul></td>";

	ret += "<td valign=\"top\"><h2>Presentation Services</h1>";
	ret += "<ul>";
	for (var cur_do = 0; cur_do < dataObjects.PRESkeys.length; cur_do++) {
		var cur_int = dataObjects.PRESs[dataObjects.PRESkeys[cur_do]];
		ret += "<li><a href=\"javascript:displayPRES('" + cur_int.uid + "')\">" + cur_int.name + "</a></li>";
	}
	ret += "</ul></td>";

	ret += "<td valign=\"top\"><h2>Point 2 Point Integrations</h1>";
	ret += "<ul>";
	for (var cur_do = 0; cur_do < dataObjects.POINTkeys.length; cur_do++) {
		var cur_p2p = dataObjects.POINTs[dataObjects.POINTkeys[cur_do]];
		ret += "<li><a href=\"javascript:displayPOINT('" + cur_p2p.uid + "')\">" + cur_p2p.name + "</a></li>";
	}
	ret += "</ul></td>";

	ret += "<tr>";
	ret += "<td colspan=5>";

	ret += "<h1>Components grouped by TAG</h1><table class=\"kanbancomponent\"><tr>";
	for (var key in dataObjects.TAGs) {
		ret += "<th>" + key + "</th>"; 
	};
	ret += "</tr><tr>";
	var sm = ic_soa_data_getSheetMetrics();

	for (var key in dataObjects.TAGs) {
		ret += "<td valign=\"top\">";
		ret += displayItemsWithTag(key,sm);
		ret += "</td>";
	};
	ret += "</tr></table>";

	ret += "</td>";
	ret += "</tr>";

	
	ret += "</tr>";
	ret += "</table>";
	return ret;
};
function displayItemsWithTag(tag,sm) {
	var ret = "";
	//Complete misuse of this funciton
	for (cur_do = 0; cur_do < dataObjects.EDFkeys.length; cur_do++) {
		var cur = dataObjects.EDFs[dataObjects.EDFkeys[cur_do]];
		if (ic_soa_data_istaginlist(tag, cur.tags)) {
			ret += knabancomponent_getcardHTML({
				data_obj: {
					$css: sm["EDF"].css_tag,
					text: "<a href=\"javascript:displayEDF('" + cur.uid + "')\">" + cur.name + "</a>",
					tags: cur.tags,
				},
				data_pos: -1,
			},false);
		};
	}
	for (var cur_do = 0; cur_do < dataObjects.INTkeys.length; cur_do++) {
		var cur = dataObjects.INTs[dataObjects.INTkeys[cur_do]];
		if (ic_soa_data_istaginlist(tag, cur.tags)) {
			ret += knabancomponent_getcardHTML({
				data_obj: {
					$css: sm["INT"].css_tag,
					text: "<a href=\"javascript:displayINT('" + cur.uid + "')\">" + cur.name + "</a>",
					tags: cur.tags,
				},
				data_pos: -1,
			},false);
		};
	}
	for (var cur_do = 0; cur_do < dataObjects.PRESkeys.length; cur_do++) {
		var cur = dataObjects.PRESs[dataObjects.PRESkeys[cur_do]];
		if (ic_soa_data_istaginlist(tag, cur.tags)) {
			ret += knabancomponent_getcardHTML({
				data_obj: {
					$css: sm["PRES"].css_tag,
					text: "<a href=\"javascript:displayPRES('" + cur.uid + "')\">" + cur.name + "</a>",
					tags: cur.tags,
				},
				data_pos: -1,
			},false);
		};
	}
	for (var cur_do = 0; cur_do < dataObjects.POINTkeys.length; cur_do++) {
		var cur = dataObjects.POINTs[dataObjects.POINTkeys[cur_do]];
		if (ic_soa_data_istaginlist(tag, cur.tags)) {
			ret += knabancomponent_getcardHTML({
				data_obj: {
					$css: sm["POINT"].css_tag,
					text: "<a href=\"javascript:displayPOINT('" + cur.uid + "')\">" + cur.name + "</a>",
					tags: cur.tags,
				},
				data_pos: -1,
			},false);
		};
	}


	return ret;
};
function displayNOPARAM() {
	$("#MAIN").html(getNOPARAMHtml());
	$("#MAIN").css("display","inline");
};
