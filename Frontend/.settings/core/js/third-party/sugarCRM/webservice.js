/**
 * CREATED BY NVD ON 21 okt. 2014 11:32:35

 * Package    : js/third-party
 * Filename   : webservice.js
*/

/**
 * @param {string} bindingName Add the binding name
 * @param {string} method The method that you need to call
 * @param {string} model The model send with the request
 * @param {string} service The service that you need to call in the URL
 * @param {string} callback Callback function
 * @param {string} error Error callback
 * @returns {json} data The response object
 */
function callSugarCRMWebservice(model, obj, callback, errorCallback) {
	document.getElementById("loader").style.visibility = "visible";
	window.doNotShowConfirmation = true;
	require([ "dojo/request/xhr", "dojo/json" ], function(xhr, JSON) {
		var mod = JSON.stringify(model);
		xhr.post("/core/php/third-party/sugarCRM/Webservice.php", {
			data : {
				data : mod
			},
			headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
		}).then(function(data) {
			document.getElementById("loader").style.visibility = "hidden";
			obj[callback](JSON.parse(data));
			obj = model	= null; // NEVER EVER REMOVE THIS LINE OTHERWISE THE WHOLE APPLICATION WILL LEAK
		}, function(error) {
			document.getElementById("loader").style.visibility = "hidden";
			callErrorWebService(error.response);
			obj = model= null; // NEVER EVER REMOVE THIS LINE OTHERWISE THE WHOLE APPLICATION WILL LEAK
		});
		json = null;
	});
}