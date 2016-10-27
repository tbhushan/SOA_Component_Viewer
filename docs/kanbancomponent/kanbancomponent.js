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

function knabancomponent_getcardHTML(data_row) {
	var html = "";
	html += '<div class="card ' + data_row.obj.$css + '" data-data_pos="' + data_row.data_pos + '">';
	html += data_row.obj.text;
	if (typeof(data_row.obj.tags)!="undefined") {
		html += '<hr><div class="tag">';
		html += data_row.obj.tags + '</div>';
	};
	//html += ' (' + obj.$order + ')'; //DEBUG LINE TO DISPLAY ORDER
	html += '</div>';
	return html;
};

function kanbancomponent_getCardsForList(listName) {
	var res = [];
	
	for (var i=0; i<kanbancomponent_chart_obj.data.length; i++) {
		if (kanbancomponent_chart_obj.data[i].status==listName) {
			res.push({data_pos:i, obj: kanbancomponent_chart_obj.data[i]});
		};
	};
	
	res.sort(function(a,b){
		var aa=0;
		var bb=0;
		if (typeof(aa)!="undefined") aa = parseInt(a.obj.$order);
		if (typeof(bb)!="undefined") bb = parseInt(b.obj.$order);
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
		html += '<td data-status="' + kanbancomponent_chart_obj.list[i].header + '">';
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
	
	$("table.kanbancomponent tr.mainrow td ").sortable({
		start: function() {
			$("table.kanbancomponent tr.mainrow td ").removeClass('ui-state-active');
			$(this).addClass('ui-state-active');
		},
		over: function() {
			$("table.kanbancomponent tr.mainrow td ").removeClass('ui-state-active');
			$(this).addClass('ui-state-active');
		},
		stop: function(event, ui) {
			$("table.kanbancomponent tr.mainrow td ").removeClass('ui-state-active');

			var data_item_being_dropped_pos = $(ui.item[0]).data("data_pos");
			var data_item_being_dropped = kanbancomponent_chart_obj.data[data_item_being_dropped_pos];

			var column_being_droped_into = $(ui.item[0].closest("td"));

			var orig_status = $($(this)[0]).data("status");
			var new_Status = column_being_droped_into.data("status");


			console.log("TODO CALLBACK UPDATE LIST Move " + data_item_being_dropped.text + " from " + orig_status + " to " + new_Status);

			//TODO Change data item status
			//TODO Go through new status column and set the order property of each item

		},
		connectWith: "table.kanbancomponent tr.mainrow td"
	});
	//$("table.kanbancomponent .card").disableSelection();

};


function kanbancomponent_getcolumn_html() {
	var html = "";
	return html;
};
