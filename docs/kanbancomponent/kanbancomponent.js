"use strict";

/*
Kan Ban Component created by Robert Metcalf

- requires JQuery
*/

var kanbancomponent_chart_obj = {
	list: [],
	data: []
};

/*
Setup the list to use
*/
function kanbancomponent_setList(list) {
	kanbancomponent_chart_obj.list = list;	
};

/*
Setup the data
*/
function kanbancomponent_resetdata() {
	kanbancomponent_chart_obj.data = [];
};
function kanbancomponent_appenddata(data_to_append) {
	Array.prototype.push.apply(kanbancomponent_chart_obj.data,data_to_append);
};

function knabancomponent_getcardHTML(obj) {
	var html = "";
	html += '<div class="card ' + obj.$css + '">';
	html += obj.text;
	if (typeof(obj.tags)!="undefined") {
		html += '<hr><div class="tag">';
		html += obj.tags + '</div>';
	};
	//html += ' (' + obj.$order + ')'; //DEBUG LINE TO DISPLAY ORDER
	html += '</div>';
	return html;
};

function kanbancomponent_getCardsForList(listName) {
	var res = [];
	
	for (var i=0; i<kanbancomponent_chart_obj.data.length; i++) {
		if (kanbancomponent_chart_obj.data[i].status==listName) {
			res.push(kanbancomponent_chart_obj.data[i]);
		};
	};
	
	res.sort(function(a,b){
		var aa=0;
		var bb=0;
		if (typeof(aa)!="undefined") aa = parseInt(a.$order);
		if (typeof(bb)!="undefined") bb = parseInt(b.$order);
		//if (typeof(aa)=="undefined") aa = 0;
		//if (typeof(bb)=="undefined") bb = 0;
		if (a.$order=="") aa = 0;
		if (b.$order=="") bb = 0;
		if (aa<bb) return -1;
		if (aa>bb) return 1;
		return 0;
	});
	
	return res;
};

//Main function called to create kanban component. output is HTML
// limited to one component per page
function kanbancomponent_create(onAfterDrop, onListItemDblClick) {
	var html = "";
	
	
	html += '<table class="kanbancomponent">';
	html += '<tr class="headrow">';
	for (var i = 0; i < kanbancomponent_chart_obj.list.length; i++) {
		html += '<th>' + kanbancomponent_chart_obj.list[i].header + '</th>';
	};
	html += '</tr><tr class="mainrow">';
	//ROWS
	for (var i = 0; i < kanbancomponent_chart_obj.list.length; i++) {
		html += '<td>';
		var cl = kanbancomponent_getCardsForList(kanbancomponent_chart_obj.list[i].header);
		for (var j = 0; j < cl.length; j++) {
			html += knabancomponent_getcardHTML(cl[j]);
		};
		html += '</td>';
	};
	html += '</tr>';
	html += '</table>';
	
	return html;
}

//called after html is in document
function kanbancomponent_init() {
	//Set all table widths high so they all end up with the same width
	$("table.kanbancomponent tr.headrow th").width(10000);
};


function kanbancomponent_getcolumn_html() {
	var html = "";
	return html;
};