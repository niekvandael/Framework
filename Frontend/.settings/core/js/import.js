/**
 * CREATED BY NVD ON 19 feb. 2015 14:12:09

 * Package    : CustomSystem/core/js
 * Filename   : import.js
*/

"use-strict";

var Import = (function(){});

// CSV import
var CSV = {
		getCSVButton : "btnImportCsv",
		getCSVFile : "txtCsv",
		id : "unknown",
		downloadButton : "newFile",
		downloadButtonAvailable : false,
		callback : "importCSVFile"
};

Import.prototype.setCSVEvents = function(parent, id){
	parent.CSV = CSV;
	
	var lang 			= null;
	var on 				= null;
	
	var inputField 		= null;
	var goButton 		= null;
	var downloadButton 	= null;
	// get he dojo components
	require(["dojo/on", "dojo/_base/lang"], function(dojoOn, dojoLang){
		lang = dojoLang;
		on 	 = dojoOn;
	});
	
	// get the go-button
	getDijitWidgetById(id + parent.CSV.getCSVButton, function(btn){
		goButton = btn;
	});
	
	// get the inputfield
	inputField = document.getElementById(id + parent.CSV.getCSVFile);
	
	// get the downloadButton
	if (parent.CSV.downloadButtonAvailable){
		getDijitWidgetById(id + parent.CSV.downloadButton, function(btn){
			downloadButton = btn;
		});
	}
	
	goButton.on("click", lang.hitch(parent, parent.CSV.callback));
	//inputField.onchange = this.setDelimiter;
	
};