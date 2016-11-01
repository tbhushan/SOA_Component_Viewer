"use strict";
var rjmlib_ui_selectionbox_globalcallbackPass = null;
var rjmlib_ui_selectionbox_globalcallbackFN = null;
var rjmlib_ui_selectionbox_globalsel_list = null;

function rjmlib_ui_init() {
	var ret = "<div id=\"rjmlib_ui_questionbox\" title=\"Dialog Title\">"
	ret += "<p>Some Message</p>";
	ret += "</div>"
	$("body").append(ret);
	$( "#rjmlib_ui_questionbox" ).dialog({
		autoOpen: false,
		width: 400
	});
	//work around - BUG if first dialog has more than one button Open and close the dialog with ONE button seems
	//to avoid this for some reason
	var buts = [];
	buts.push({
			text: "Ok",
			click: function() {$( this ).dialog( "close" );}
	});
	$( "#rjmlib_ui_questionbox" ).dialog('option', 'buttons', buts);
	$( "#rjmlib_ui_questionbox" ).dialog( "open" ); 
	$( "#rjmlib_ui_questionbox" ).dialog( "close" );
	//End of workaround
	
	var ret = "<div id=\"rjmlib_ui_selectionbox\" title=\"Dialog Title\">"
	ret += "<p>Please select</p><br><table></table>";
	ret += "</div>"
	$("body").append(ret);	
	$( "#rjmlib_ui_selectionbox" ).dialog({
		autoOpen: false,
		width: 500
	});
	
	$(document).on('click.rjmlib_ui', "a[href$='#rjmlib_ui_selectionbox_sellink']", function(event) {
		$("#rjmlib_ui_selectionbox").dialog( "close" );
		rjmlib_ui_selectionbox_globalcallbackFN(
			rjmlib_ui_selectionbox_globalsel_list[$(this).closest("tr").data("currow")],
			rjmlib_ui_selectionbox_globalcallbackPass,
			false
		);
		event.preventDefault();			  	
	});
	$(document).on('click.rjmlib_ui', "a[href$='#rjmlib_ui_selectionbox_selcreatelink']", function(event) {
		var ent = $(this).closest("tr").find("input").val();
		if (ent.length==0) return;
	  	$("#rjmlib_ui_selectionbox").dialog( "close" );
		rjmlib_ui_selectionbox_globalcallbackFN(
			ent,
			rjmlib_ui_selectionbox_globalcallbackPass,
			true
		);	  	
		event.preventDefault();			  	
	});
	
	var ret = "<div id=\"rjmlib_ui_textareainputbox\" title=\"Dialog Title\">"
	ret += "<p>Prompt...</p><br><textarea cols=80 rows=15></textarea>";
	ret += "</div>"
	$("body").append(ret);	
	$( "#rjmlib_ui_textareainputbox" ).dialog({
		autoOpen: false,
		width: 800
	});
	$("#rjmlib_ui_textareainputbox textarea").keypress(rjmlib_ui_textareainputboxKeypress);
};

function rjmlib_ui_questionbox_isopen() {
	if ($("#rjmlib_ui_questionbox").dialog( "isOpen" )==true) return true;
	return false;
}

function rjmlib_ui_questionbox(str, title, yestxt, yesfn, notxt, nofn, canceltxt, cancelfn) {
	if ($("#rjmlib_ui_questionbox").dialog( "isOpen" )==true) {
		alert("ERROR in rjmlib_ui_questionbox SECOND DIALOG LAUNCHED - " + str);
		return;
	};
	
	title = typeof title !== 'undefined' ? title : "Dialog";
	$( "#rjmlib_ui_questionbox" ).dialog('option', 'title', title);
	$( "#rjmlib_ui_questionbox p" ).text(str);
	
	var buts = [];

	if (typeof(yestxt) != 'undefined') {
		buts.push({
				text: yestxt,
				click: function() {$( this ).dialog( "close" ); yesfn();}
			});
	} else {
		buts.push({
				text: "Ok",
				click: function() {$( this ).dialog( "close" );}
			});
	};

	if (typeof(notxt) != 'undefined') {
	buts.push({
				text: notxt,
				click: function() {$( this ).dialog( "close" ); nofn();}
			});
	};
	if (typeof(canceltxt) != 'undefined') {
		buts.push({
				text: canceltxt,
				click: function() {$( this ).dialog( "close" ); cancelfn();}
			});
	};
	$( "#rjmlib_ui_questionbox" ).dialog('option', 'buttons', buts);
	
	$( "#rjmlib_ui_questionbox" ).dialog( "open" );
};

function rjmlib_ui_selectionbox(str, title, sel_list, callbackFN, callbackPass, not_in_list_prompt) {
	if ($("#rjmlib_ui_selectionbox").dialog( "isOpen" )==true) {
		alert("ERROR in rjmlib_ui_selectionbox SECOND DIALOG LAUNCHED - " + str);
		return;
	};
	rjmlib_ui_selectionbox_globalcallbackPass = callbackPass;
	rjmlib_ui_selectionbox_globalcallbackFN = callbackFN;
	
	title = typeof title !== 'undefined' ? title : "Dialog";
	$( "#rjmlib_ui_selectionbox" ).dialog('option', 'title', title);
	$( "#rjmlib_ui_selectionbox p" ).text(str);
	
	var tbl = $( "#rjmlib_ui_selectionbox table" );
	tbl.children().remove();
	
	var cols = [];
	if (typeof(sel_list)=="undefined") {
		cols.push("Value");
	} else {
		var obj = sel_list[0];
		var row = "<tr>";
		for (var prop in obj) {
		  // important check that this is objects own property 
		  // not from prototype prop inherited
		  if(obj.hasOwnProperty(prop)){
			if (prop.substr(0,8)!="__Hide__") {
				row += "<th>" + prop + "</th>";
				cols.push(prop);
			}
		  }
		}	
		row += "<td></td></tr>";
		tbl.append(row);
	}
	
	
	for (var currow in sel_list) {
		row = "<tr data-currow=\"" + currow + "\">";
		for (var col in cols) {
			row += "<td>" + sel_list[currow][cols[col]] + "</td>";
		};
		row += "<td><a href=\"#rjmlib_ui_selectionbox_sellink\">Select</a></td>";
		tbl.append(row);
	};
	
	if (typeof(not_in_list_prompt)!="undefined") {
		if (not_in_list_prompt.length>0) {
			row = "<tr><td colspan=\"" + cols.length + "\">";
			row += "<input type=\"text\">";
			row += "</td><td>";
			row += "<a href=\"#rjmlib_ui_selectionbox_selcreatelink\">" + not_in_list_prompt + "</a>";
			row += "</td></tr>";
			tbl.append(row);
		};
	};
	

	var buts = [];
	buts.push({
			text: "Cancel",
			click: function() {$( this ).dialog( "close" );}
		});

	$( "#rjmlib_ui_selectionbox" ).dialog('option', 'buttons', buts);
	$( "#rjmlib_ui_selectionbox" ).dialog( "open" );
	
	rjmlib_ui_selectionbox_globalsel_list = sel_list;

	//Events added by generic on event
	
};

/*
buts is an array of objects one for each button
id:   //identifier of option pressed
text:
fn:   (res,butID,passback)

Example:
	rjmlib_ui_textareainputbox(
		"New Password", //prompt, 
		"Reset password for " + userName, //title, 
		"", //defaultVal, 
		[
			{
				id: "submit",
				text: "Submit",
				fn: function (password,butID,userName) {
					rjmlib_ui_questionbox("You pressed OK - and input " + password + " for " + userName)
				}
			},
			{
				id: "cancel",
				text: "Cancel",
				fn: function (password,butID,userName) {
					//Cancel - do nothing
				}
			}
		], //buts, 
		userName, //passback
		40, //cols
		1 //rows
	);
*/
var rjmlib_ui_textareainputbox_globalbuts = [];
var rjmlib_ui_textareainputbox_rows = 0;
function rjmlib_ui_textareainputboxKeypress(event) {
	if (rjmlib_ui_textareainputbox_rows==1) {
		if(event.which == '13') {
			return false;
		}
	}
	return true;
}
function rjmlib_ui_textareainputbox(prompt, title, defaultVal, buts, passback, cols, rows) {
	cols = typeof cols !== 'undefined' ? cols : 80;
	rows = typeof rows !== 'undefined' ? rows : 15;
	if ($("#rjmlib_ui_textareainputbox").dialog( "isOpen" )==true) {
		alert("ERROR in rjmlib_ui_textareainputbox SECOND DIALOG LAUNCHED - " + prompt);
		return;
	};
	
	title = typeof title !== 'undefined' ? title : "Dialog";
	$( "#rjmlib_ui_textareainputbox" ).dialog('option', 'title', title);
	$( "#rjmlib_ui_textareainputbox p" ).text(prompt);
	$( "#rjmlib_ui_textareainputbox textarea" ).val(defaultVal);
	$( "#rjmlib_ui_textareainputbox textarea" ).attr('cols',cols);
	$( "#rjmlib_ui_textareainputbox textarea" ).attr('rows',rows);

	rjmlib_ui_textareainputbox_globalbuts = buts;
	
	var buts_to_add = [];
	for (var c=0;c<buts.length;c++) {
		buts_to_add.push({
			text: buts[c].text,
			click: function(event) {
				var res = $( "#rjmlib_ui_textareainputbox textarea" ).val();
				$( this ).dialog( "close" ); 
				var row = rjmlib_ui_textareainputbox_globalbuts[$(event.target.closest("button")).data("index")];
				row.fn(
					res,
					row.id, 
					passback
				);
			},
			"data-index": c
		});
	};
	
	$( "#rjmlib_ui_textareainputbox" ).dialog('option', 'buttons', buts_to_add);
	rjmlib_ui_textareainputbox_rows = rows;
	$( "#rjmlib_ui_textareainputbox" ).dialog( "open" );
	
}


