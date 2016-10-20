"use strict";

/* This file is for the drawing functions for soa flows */
/*Cords in form
var cord{x:100,y:100};
*/
var conectorPointSpacing = 4;

//Called once and put into each SVG 
function ic_soa_svg_getMarkers() {
	var ret = "";
	ret += '<marker id="triangle" ';
	ret += 'viewBox="0 0 10 10" refX="8" refY="5"  ';
	ret += 'markerUnits="strokeWidth" ';
	ret += 'markerWidth="4" markerHeight="4" ';
	ret += 'orient="auto"> ';
	ret += '<path d="M 0 0 L 10 5 L 0 10 z" /> ';
	ret += '</marker> ';
	return ret;
};

function ic_soa_svg_drawPoint(cord) {
	return '<circle cx="' + cord.x + '" cy="' + cord.y + '" r="1" stroke="black" fill="black" stroke-width="1" />';
};

//Return the HTML for a system
function ic_soa_svg_drawSystem(name, cord, link) {
	var system_width=100;
	
	var ay = 10;
	var ty = 20;
	
	var ret = "";
	//ret += ic_soa_svg_drawPoint(cord);
	
	ret += '<ellipse class="system" cx="' + (cord.x) + '" cy="' + (cord.y + (ty+ay)) + '" rx="' + (system_width/2) + '" ry="' + (ay) + '" />';
	ret += '<rect class="system" x="' + (cord.x - (system_width/2)) + '" y="' + (cord.y - (ty+ay)) + '" width="' + system_width + '" height="' + (2*(ay+ty)) + '" />';
	
	//Text looks better if it isn't exactly in the middle of the object - this brings it down a touch
	if (typeof(link)=="undefined") {	
		ret += '<text class="system" x="' + cord.x + '" y="' + (cord.y - ty + ((ty + ty + ay + ay)/2)) + '" >' + name + '</text>';
	} else {
		ret += '<text class="system link" x="' + cord.x + '" y="' + (cord.y - ty + ((ty + ty + ay + ay)/2)) + '" onclick="' + link + '">' + name + '</text>';
	};
	
	ret += '<ellipse class="system" cx="' + (cord.x) + '" cy="' + (cord.y - (ty+ay)) + '" rx="' + (system_width/2) + '" ry="' + (ay) + '" />';
	ret += '<line class="system" x1="' + (cord.x - (system_width/2)) + '" y1="' + (cord.y - (ty+ay)) + '" x2="' + (cord.x - (system_width/2)) + '" y2="' + (cord.y + (ty + ay)) + '"/>';
	ret += '<line class="system" x1="' + (cord.x + (system_width/2)) + '" y1="' + (cord.y - (ty+ay)) + '" x2="' + (cord.x + (system_width/2)) + '" y2="' + (cord.y + (ty + ay)) + '"/>';
	return ret;
};
//Return the connectorPointLocation of System
function ic_soa_svg_System_conectorPointLocation(cord, typ) {
	if (typ=="left") {
		return {x:(cord.x-(50 + conectorPointSpacing)), y:cord.y }
	};
	if (typ=="right") {
		return {x:(cord.x+(50 + conectorPointSpacing)), y:cord.y }
	};
	return cord; //default to center
};

//Return the HTML for an EDF
function ic_soa_svg_drawEDF(name, cord, link) {
	var ret = "";
	var edf_width=300;
	var ay = 20;
	
	ret += '<ellipse class="edf" cx="' + (cord.x) + '" cy="' + cord.y + '" rx="' + (edf_width/2) + '" ry="' + (ay) + '" />';
	if (typeof(link)=="undefined") {
		ret += '<text class="edf" x="' + cord.x + '" y="' + cord.y + '" >';
		ret += name;
		ret += "</text>";
	} else {
		ret += '<text class="edf link" x="' + cord.x + '" y="' + cord.y + '" onclick="' + link + '">';
		ret += name;
		ret += "</text>";
	};
	
	return ret;
}
function ic_soa_svg_EDF_conectorPointLocation(cord, typ) {
	if (typ=="left") {
		return {x:(cord.x-(150 + conectorPointSpacing)), y:cord.y }
	};
	if (typ=="right") {
		return {x:(cord.x+(150 + conectorPointSpacing)), y:cord.y }
	};
	return cord; //default to center
};

function ic_soa_svg_getpointsstring(points) {
	var ret = "";
	for (var key in points) {
		ret += points[key].x + "," + points[key].y + " ";
	};
	return ret;
};

//Return the HTML for an Integration
function ic_soa_svg_drawIntegration(name, cord, link) {
	var ret = "";
	var int_width=400;
	var ay = 15;
	
	var ax = 50;
	
	var left_x = (cord.x - (int_width/2));
	var right_x = (cord.x + (int_width/2));
	
	var points = [];
	points.push({x:left_x, y:cord.y});
	points.push({x:left_x+ax, y:(cord.y-ay)});
	points.push({x:right_x-ax, y:(cord.y-ay)});
	points.push({x:right_x, y:(cord.y)});
	points.push({x:right_x-ax, y:(cord.y+ay)});
	points.push({x:left_x+ax, y:(cord.y+ay)});
	points.push({x:left_x, y:cord.y});
	
	ret += '<polygon class="int" points="' + ic_soa_svg_getpointsstring(points) + '" />';
	
	if (typeof(link)=="undefined") {	
		ret += '<text class="int" x="' + cord.x + '" y="' + cord.y + '" >' + name + '</text>';
	} else {
		ret += '<text class="int link" x="' + cord.x + '" y="' + cord.y + '" onclick="' + link + '">' + name + '</text>';
	}
	
	return ret;
};
function ic_soa_svg_Integration_conectorPointLocation(cord, typ) {
	if (typ=="right") {
		return {x:(cord.x+(200 + conectorPointSpacing)), y:cord.y }
	};
	if (typ=="left") {
		return {x:(cord.x-(200 + conectorPointSpacing)), y:cord.y }
	};
	return cord; //default to center
};


function ic_soa_svg_drawArrow(start,end) {
	var ret = "";
	ret += '<line class="arrow" x1="' + start.x + '" y1="' + start.y + '" x2="' + end.x + '" y2="' + end.y + '"/>';
	return ret;
};

function ic_soa_svg_drawIntegrationWithTarget(name, targ_sys_name, cord, int_link, sys_link) {
	var ret = "";
	var int_pos = {x:(cord.x),y:(cord.y)};
	var sys_pos = {x:(cord.x+350),y:(cord.y)};
	ret += ic_soa_svg_drawIntegration(name,int_pos, int_link);
	ret += ic_soa_svg_drawSystem(targ_sys_name,sys_pos,sys_link);
	ret += ic_soa_svg_drawArrow(ic_soa_svg_Integration_conectorPointLocation(int_pos,"right"), ic_soa_svg_System_conectorPointLocation(sys_pos,"left"));
	return ret;
}

