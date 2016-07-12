/**
 * CREATED BY NVD ON 22 sep. 2014 13:29:59

 * Package    : js
 * Filename   : webservice.js
*/

"use strict";

/**
 * @param {string} bindingName Add the binding name
 * @param {string} method The method that you need to call
 * @param {string} model The model send with the request
 * @param {string} service The service that you need to call in the URL
 * @param {string} callback Callback function
 * @param {string} error Error callback
 * @returns {json} data The response object
 */
function callWebservice(bindingName, method, model, service, obj, callback, errorCallback) {
	//showLoader();
	require([ "dojo/request/xhr", "dojo/json" ], function(xhr, JSON) {
// current database does not inherit entities: lot's of comparations will fail if entities are provided here
//		encodeObject(model);
		if (typeof obj !== "undefined" && typeof obj.disableAllButtons !== "undefined" && obj.disableButtons){
			obj.disableAllButtons();
		}
		var json = JSON.stringify({
			"bindingName" : bindingName,
			"method" : method,
			"params" : model
		});
		xhr.post("/core/php/WebserviceController.php?action=callWebservice", {
			data : {
				data: json,
				service: service
			}
		}).then(function(data) {
			var tempData = null;
			try {
				tempData = JSON.parse(data);
			} catch (exception) {
				tempData = {"result":"403","message":LANGUAGE.CALLBACK_JSON_ERROR.replace("{0}", data)};
			}	
			
			if (tempData.result == 403){
				showAuthorizationMessage(tempData.message);
			}
			deepTrim(tempData);
			if(obj != undefined){
				if (typeof obj.enableAllButtons !== "undefined" && obj.enableButtons){
					obj.enableAllButtons();
				}
				obj[callback](tempData);
				obj = model	= tempData = null; // NEVER EVER REMOVE THIS LINE OTHERWISE THE WHOLE APPLICATION WILL LEAK
			} else {
				callback(tempData);
			}
		}, function(error) {
			callErrorWebService(error.response);
			obj = model	= tempData = null; // NEVER EVER REMOVE THIS LINE OTHERWISE THE WHOLE APPLICATION WILL LEAK
		});
		// ERROR KAS01
		json = null;
	});
}

/**
 * @param {string} bindingName Add the binding name
 * @param {string} method The method that you need to call
 * @param {string} model The model send with the request
 * @param {string} service The service that you need to call in the URL
 * @param {string} callback Callback function
 * @param {string} error Error callback
 * @returns {json} data The response object
 */
function loadFileService(loc, hash) {
	showLoader();
	
	window.doNotShowConfirmation = true;
	
	var data = {
		loc: loc,
		hash: hash
	};
		
	post("/core/php/FileLoader.php",data,"","PDFDownlaod");

	hideLoader();
}

var loaderCounter = 0;
function showLoader(){
	++loaderCounter == 1 ? document.getElementById("loader").style.visibility = "visible" : loaderCounter;
}

function hideLoader(){
	--loaderCounter == 0 ? 
			document.getElementById("loader").style.visibility = "hidden" : loaderCounter;
}

function callErrorService(method, obj, callback){
	// Not existing
	return;
	
	require([ "dojo/request/xhr", "dojo/json", "dojo/_base/lang", "dojo/Deferred", "dojox/html/entities" ], function(xhr, lang, Deferred, entity) {
			xhr.get(CONFIG.SERVER + "/logger/Logger.php", {
				query : {cmd : method},
			}).then(function(data) {
				data = JSON.parse(data);
				decodeObject(data);
				obj[callback](data);
				obj	= null; // NEVER EVER REMOVE THIS LINE OTHERWISE THE WHOLE APPLICATION WILL LEAK
			}, function(error) {
				callErrorWebService(error.response);
			});
	});
}

function callErrorWebService(error){
	require([ "dojo/request/xhr", "dojo/json", "dojo/_base/lang" ], function(xhr, JSON, lang) {
		var json = JSON.stringify({
			"error" : error
		});
		xhr.post(CONFIG.SERVER + "/logger/Logger.php", {
			data : {
				error 		: json,
				username 	: window.models.getProgramReturnRec().username
			},
			handleAs : "json",
		}).then(function(data) {
			setPageInformation(LANGUAGE.ERROR_OCCURRED, COLOR.RED);
		});
	});
}

function basicCallback(controller, callbackData){
	if (typeof callbackData.result == "undefined" || callbackData.result == 403 || typeof callbackData == "undefined"){
		console.warn("Callback data not valid. Possible cause is a permission issue.");
		return;
	}
	switch (callbackData.result[1].detail_action_code) {
	    case CONFIG.CREATE:
	    	controller.model.setDetailModel(callbackData.result[1], callbackData.result[0].errors.length);
	    	if(!showErrors(callbackData.result[0].errors, controller)){
	    		setPageInformation(controller.id, LANGUAGE.RECORD_SUCCESFULLY_CREATED, COLOR.BLACK);
	    		disableFields(controller, true, true);
	    	};
	    	break;
	    case CONFIG.READ:
	    	// HIER GAAT HET MIS
	    	if(callbackData.result[0].errors.length == 0){
		    	controller.model.setDetailModel(callbackData.result[1], callbackData.result[0].errors.length);
		    	publish(controller);
		    	setPageInformation(controller.id, LANGUAGE.RECORD_SUCCESFULLY_READ, COLOR.BLACK);
		    	
		      disableFields(controller, true, true);
			    break;
	    	}
	    	
    		// Show errors and do not open screen
    		showErrors(callbackData.result[0].errors, controller);
    		break;

	    case CONFIG.UPDATE:
	    	controller.model.setDetailModel(callbackData.result[1], callbackData.result[0].errors.length);
	    	if(!showErrors(callbackData.result[0].errors, controller)){
	    		setPageInformation(controller.id, LANGUAGE.RECORD_SUCCESFULLY_ALTERED, COLOR.BLACK);
	    	};
	      disableFields(controller, true, true);

		    break;
	    case CONFIG.DELETE:
	    	if(callbackData.result[0].errors == 0){
	    		setPageInformation(controller.id, LANGUAGE.RECORD_SUCCESFULLY_DELETED, COLOR.BLACK);
	    	} else {
	    		setPageInformation(controller.id, LANGUAGE.RECORD_SOMETHING_WENT_WRONG, COLOR.RED);
	    	};
	      disableFields(controller, false, false);

		    break;
			
	    default:
	    	controller.model.setDetailModel(callbackData.result[1], callbackData.result[0].errors.length);
	    	if(!showErrors(callbackData.result[0].errors, controller)){
	    		setPageInformation(controller.id, LANGUAGE.ACTION_SUCCEEDED, COLOR.BLACK);
	    	};
		    break;
    }
};

function callLocalService(entity, method, model, obj, callback, errorCallback) {
	showLoader();
	require([ "dojo/request/xhr", "dojo/json" ], function(xhr, JSON) {
		encodeObject(model);
		var json = JSON.stringify(model);
		
		xhr.post("/core/php/web/WebserviceLocal.php", {
			data : {
				model: json,
				method: method,
				entity: entity
			}
		}).then(function(data) {
			var tempData = null;
			hideLoader();
			try {
				tempData = JSON.parse(data);
			} catch (exception) {
				tempData = {"result":"403","message":LANGUAGE.CALLBACK_JSON_ERROR};
			}
			
			if (tempData.result == 403){
				showAuthorizationMessage(tempData.message);
			}
			
			obj[callback](tempData);
			obj = model	= tempData = null; // NEVER EVER REMOVE THIS LINE OTHERWISE THE WHOLE APPLICATION WILL LEAK
		}, function(error) { 
			hideLoader();
			callErrorWebService(error.response);
			obj = model	= tempData = null; // NEVER EVER REMOVE THIS LINE OTHERWISE THE WHOLE APPLICATION WILL LEAK
		});
		json = null;
	});
}


/** 
 * @param props {object}: object properties: url{string}, controller{object}, callback{string} 
 * @returns string
 */
function getXML(props){
	require(["dojo/request/xhr"], function(xhr) {
		xhr.get(props.url).then(function(response){
			try{
				props.controller[props.callback](response);
			} catch(ex){
				console.warn('Did you forget to set the controller or callback?');
			}
		});
	});
}

/** 
 * @param props {object}: object properties: url{string}, data{xml request}, controller{object}, callback{string} 
 * @returns xml
 */
function postSOAPRequest(props){
	require(["dojo/request/xhr"], function(xhr) {
		xhr.post(props.url+"?method="+props.method, {data:{data:props.data},  headers: {'Content-Type': 'application/x-www-form-urlencoded', 'Access-Control-Allow-Origin':'*', 'X-Requested-With':null, 'Origin':''}}).then(function(response){
			try{
				props.controller[props.callback](response);
			} catch(ex){
				console.warn('Did you forget to set the controller or callback?');
			}
		});
	});
}