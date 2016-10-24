"use strict";	

function getINTHtml(uid) {
	var ret = "";
	var curINT = dataObjects.INTs[uid];
	if (typeof(curINT)=="undefined") {
		console.log("ERROR no Integration with uid " + uid);
		return;
	}

	var edf_pos = {x:180, y:50};
	var int_pos = {x:700, y:50};
	
	ret += GetMenu();
	
	ret += "<h1>Integration: " + curINT.name + " (" + curINT.status + ")</h1>";
	ret += "<svg class=\"ic_soa_svg\" style=\"width: 1300; height: 100;\">";
	ret += ic_soa_svg_getMarkers();
	
	var src_edf_obj = ic_soa_data_getEDFFromName(curINT.source_edf, dataObjects);
	//console.log(src_edf_obj);
	
	ret += ic_soa_svg_drawEDF(curINT.source_edf,edf_pos,"javascript:displayEDF('" + src_edf_obj.uid + "')");

	var target_system_object = ic_soa_data_getSystemFromName(curINT.target_system,dataObjects);
	
	ret += ic_soa_svg_drawIntegrationWithTarget(
		curINT.name,
		curINT.target_system,
		int_pos,
		undefined,
		"javascript:displaySYSTEM('" + target_system_object.uid + "')"
	);
	ret += ic_soa_svg_drawArrow( ic_soa_svg_EDF_conectorPointLocation(edf_pos,"right"),ic_soa_svg_Integration_conectorPointLocation(int_pos,"left"));
	
	ret += "</svg>";
	return ret;
};
function displayINT(uid) {
	document.getElementById('MAIN').innerHTML = getINTHtml(uid);
	document.getElementById('MAIN').style.display = 'inline';
};
