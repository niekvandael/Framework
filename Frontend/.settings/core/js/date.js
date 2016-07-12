/**
 * CREATED BY NVD ON 23 sep. 2014 12:55:11

 * Package    : js
 * Filename   : date.js
*/

"use strict";

function getTodaysDate(){
	return new Date();
}

function convertDateForServer(date){
	if (date == null || date == undefined || Object.prototype.toString.call(date) !== '[object Date]'){
		return null;
	}
	return date.getFullYear() + '-' + ('0' + (date.getMonth()+1)).slice(-2) + '-' + ('0' + date.getDate()).slice(-2);
}

function getLocaleDateFormat(value){
	if (value === ""){
		return value;
	} 
	var lang= window.navigator.userLanguage || window.navigator.language;

	var date = new Date(value);

	var options = {
	   year: "numeric",
	   month: "2-digit",
	   day: "2-digit"
	};

	return date.toLocaleDateString(lang, options);
}