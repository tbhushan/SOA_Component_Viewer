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
	//html += ' (ORDER=' + data_row.obj.$order + ')'; //DEBUG LINE TO DISPLAY ORDER
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
		if (a.obj.$order<b.obj.$order) return -1;
		if (a.obj.$order>b.obj.$order) return 1;
		return 0;
	});
	
	return res;
};

//Called in create function to populate undefined orders and change their types to int
function kanbancomponent_cleanOrders() {
	var default_order = 9999;
	for (var c=0;c<kanbancomponent_chart_obj.data.length;c++) {
		if (typeof(kanbancomponent_chart_obj.data[c].$order)=="undefined") {
			kanbancomponent_chart_obj.data[c].$order = default_order;
		} else {
			kanbancomponent_chart_obj.data[c].$order = parseInt(kanbancomponent_chart_obj.data[c].$order);
			if(isNaN(kanbancomponent_chart_obj.data[c].$order)) {
				kanbancomponent_chart_obj.data[c].$order = default_order;
			} else {
				if (typeof(kanbancomponent_chart_obj.data[c].$order)=="undefined") {
					kanbancomponent_chart_obj.data[c].$order = default_order;
				};
			};
		};
	};
}

//Main function called to create kanban component. output is HTML
// limited to one component per page
function kanbancomponent_create(onAfterDrop, onListItemDblClick) {
	var html = "";
	kanbancomponent_chart_obj.onAfterDrop = onAfterDrop;
	kanbancomponent_chart_obj.onListItemDblClick = onListItemDblClick;
	
	kanbancomponent_cleanOrders();
	
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

			var changed = false;
			if (orig_status!=new_Status) {
				changed = true;
				//Change data item status
				data_item_being_dropped.status = new_Status;
			};
			
			//Go through new status column and set the order property of each item
			var cards_in_new_list = column_being_droped_into.find("div.card");
			for (var i=0;i<cards_in_new_list.length;i++) {
				var data_item = kanbancomponent_chart_obj.data[$(cards_in_new_list[i]).data("data_pos")];
				if (data_item.$order!=i) {
					changed = true;
					data_item.$order=i;
					//console.log(data_item.text + " " + data_item.$order);
				};
			};

			if (changed) {
				if (typeof(kanbancomponent_chart_obj.onAfterDrop)!="undefined") {
					kanbancomponent_chart_obj.onAfterDrop(new_Status,data_item_being_dropped_pos,kanbancomponent_chart_obj.data);
				}
			};
			
		},
		connectWith: "table.kanbancomponent tr.mainrow td"
	});

	$(document).on('dblclick.kanbancomponent', "table.kanbancomponent tr.mainrow td div.card", function (event) {
		if (typeof(kanbancomponent_chart_obj.onListItemDblClick)!="undefined") {
			kanbancomponent_chart_obj.onListItemDblClick($($(this)[0]).data("data_pos"),kanbancomponent_chart_obj.data);
		};
		event.preventDefault();
	}
	);
	
};


function kanbancomponent_getcolumn_html() {
	var html = "";
	return html;
};
