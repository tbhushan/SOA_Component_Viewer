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

function kanbancomponent_setupdragevents() {
		//Make cards draggable
	$("table.kanbancomponent .card").draggable({ 
        revert:  function(dropped) {
           var dropped = dropped && dropped[0].id == "droppable";
           //if(!dropped) alert("I'm reverting!");
           return !dropped;
        } 
    }).each(function() {
        var top = $(this).position().top;
        var left = $(this).position().left;
        $(this).data('orgTop', top);
        $(this).data('orgLeft', left);
    });
	
	//Make main cells droppable
	$("table.kanbancomponent tr.mainrow td").droppable({
		hoverClass: "ui-state-active",
		drop: function( event, ui ) {
			var td_dropped_into = $(this);
			var status_of_td_dropped_into = td_dropped_into.data("status");
			var data_item_being_dropped_pos = $(ui.draggable[0]).data("data_pos");
			var data_item_being_dropped = kanbancomponent_chart_obj.data[data_item_being_dropped_pos];
			var orig_list = data_item_being_dropped.status;
			
			if (orig_list==status_of_td_dropped_into) {
				//Dragging within SAME list
				console.log("SAME LIST");
				return;
			};
			
			//Dragging from one list to the other
			//In this case always add to the bottom of the list

			//Update data
			data_item_being_dropped.status=status_of_td_dropped_into;
			
			td_dropped_into.append(knabancomponent_getcardHTML({data_pos:data_item_being_dropped_pos, obj: data_item_being_dropped}));
			//Make appended card draggable
			kanbancomponent_setupdragevents();
			
			//Delete floating object
			ui.draggable.remove();
			
			
			console.log("TODO CALLBACK UPDATE LIST Move " + data_item_being_dropped.text + " from " + orig_list + " to " + status_of_td_dropped_into);
		}	
	});
};

//called after html is in document
function kanbancomponent_init() {
	//Set all table widths high so they all end up with the same width
	$("table.kanbancomponent tr.headrow th").width(10000);
	
	//kanbancomponent_setupdragevents();
	
	$("table.kanbancomponent tr.mainrow td ").sortable({
		start: function() {
			$("table.kanbancomponent tr.mainrow td ").removeClass('ui-state-active');
			$(this).addClass('ui-state-active');
		},
		over: function() {
			$("table.kanbancomponent tr.mainrow td ").removeClass('ui-state-active');
			$(this).addClass('ui-state-active');
		},
		stop: function() {
			$("table.kanbancomponent tr.mainrow td ").removeClass('ui-state-active');
		},
		connectWith: "table.kanbancomponent tr.mainrow td"
	});
	//$("table.kanbancomponent .card").disableSelection();

};


function kanbancomponent_getcolumn_html() {
	var html = "";
	return html;
};