"use strict";
	
var board_CLIENT_ID = '1079972761471-j4b2l90p0rpkrkplf1j6avkue436c74p.apps.googleusercontent.com';

var board_SCOPES = ["https://www.googleapis.com/auth/spreadsheets"];

var board_onAuthFn;

function board_checkAuth(onAuthFn) {
board_onAuthFn = onAuthFn;
gapi.auth.authorize(
  {
	'client_id': board_CLIENT_ID,
	'scope': board_SCOPES.join(' '),
	'immediate': true
  }, board_handleAuthResult);
}	  

/**
* Handle response from authorization server.
*
* @param {Object} authResult Authorization result.
*/
function board_handleAuthResult(authResult) {
if (authResult && !authResult.error) {
  // Hide auth UI, then load client library.
  var authorizeDiv = document.getElementById('board_authorize-div');
  if (typeof(authorizeDiv)!="undefined") {
	  if (null!=authorizeDiv) authorizeDiv.style.display = 'none';
  };
  var discoveryUrl = 'https://sheets.googleapis.com/$discovery/rest?version=v4';
  gapi.client.load(discoveryUrl).then(board_onAuthFn);
} else {
  // Show auth UI, allowing the user to initiate authorization by
  // clicking authorize button.
  document.write("<div id=\"board_authorize-div\"><span>Authorize access to Google Sheets API</span><button id=\"board_authorize-button\" onclick=\"board_handleAuthClick(event)\">Authorize</button></div>");
}
}
	  
/*
Get data from a spreadsheet
 return call to respfn with array of arranges
*/
function board_getDataRangesFromSheet(spreadsheetId,ranges,respfn) {
	gapi.client.sheets.spreadsheets.values.batchGet({
		spreadsheetId: spreadsheetId,
		ranges: ranges,
	}).then(function(response) {
		if (response.status!=200) {
			//TODO Caller supply error handler
			console.log("ERROR");
			return;
		};
		respfn(response.result.valueRanges);
	});
};

function board_handleAuthClick(event) {
	gapi.auth.authorize(
		{client_id: board_CLIENT_ID, scope: board_SCOPES, immediate: false},
		board_handleAuthResult
	);
	return false;
}

function board_columnToLetter(column)
{
  column=column+1;
  
  var temp, letter = '';
  while (column > 0)
  {
    temp = (column - 1) % 26;
    letter = String.fromCharCode(temp + 65) + letter;
    column = (column - temp - 1) / 26;
  }
  return letter;
}

var board_saveBatch = [];
function board_prepare_saveBatch() {
	board_saveBatch = [];
};
function board_append_saveBatch(saveObj) {
	board_saveBatch.push(saveObj);
};
function board_execute_saveBatch(spreadsheetId) {
	var batchUpdateData = {
		"valueInputOption": "RAW",
		"data": board_saveBatch
	};
	gapi.client.sheets.spreadsheets.values.batchUpdate({
		spreadsheetId: spreadsheetId,
		resource: batchUpdateData,
	}).then(function(response) {
		if (response.status!=200) {
			//TODO Caller supply error handler
			console.log("ERROR");
			return;
		};
		//No Confirmation call
	})	
};



