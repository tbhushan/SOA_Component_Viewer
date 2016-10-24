"use strict";	

function getPRESHtml(uid) {
	var ret = "";
	var curPRES = dataObjects.PRESs[uid];
	if (typeof(curPRES)=="undefined") {
		console.log("ERROR no Presentation Service with uid " + uid);
		return;
	}

	var client_systems_to_draw = curPRES.known_clients;
	var svg_height = client_systems_to_draw.length * 100;
	if (svg_height<100) svg_height = 100;


	ret += GetMenu();
	
	ret += "<h1>Presentation Service: " + curPRES.name + " (" + curPRES.status + ")</h1>";

	var provider_system_pos = {x:100, y:(svg_height/2)};
	var pres_pos = {x:500, y:(svg_height/2)};
	var provider_system_object = ic_soa_data_getSystemFromName(curPRES.provider_system, dataObjects);

	ret += "<svg class=\"ic_soa_svg\" style=\"width: 1300; height: " + svg_height + ";\">";
	ret += ic_soa_svg_getMarkers();

	ret += ic_soa_svg_drawSystem(curPRES.provider_system,provider_system_pos,"javascript:displaySYSTEM('" + provider_system_object.uid + "')");
	ret += ic_soa_svg_drawPresentationService(curPRES.name,pres_pos);
	ret += ic_soa_svg_drawSyncServiceCall(ic_soa_svg_System_conectorPointLocation(provider_system_pos,"right"), ic_soa_svg_PresentationService_conectorPointLocation(pres_pos,"left"));

	var client_system_pos = {x:900, y:50};
	for (var cur_do = 0; cur_do < client_systems_to_draw.length; cur_do++) {
		var client_system_object = ic_soa_data_getSystemFromName(client_systems_to_draw[cur_do],dataObjects);
		ret += ic_soa_svg_drawSystem(
			client_system_object.name,
			client_system_pos,
			"javascript:displaySYSTEM('" + client_system_object.uid + "')"
		);
		ret += ic_soa_svg_drawSyncServiceCall( ic_soa_svg_PresentationService_conectorPointLocation(pres_pos,"right"),ic_soa_svg_System_conectorPointLocation(client_system_pos,"left"));
		client_system_pos.y = client_system_pos.y + 100;
	}


	ret += "</svg>";

	return ret;
};
function displayPRES(uid) {
	document.getElementById('MAIN').innerHTML = getPRESHtml(uid);
	document.getElementById('MAIN').style.display = 'inline';
};