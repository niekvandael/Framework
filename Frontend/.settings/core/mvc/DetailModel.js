/**
 * CREATED BY NVD ON 1 okt. 2014 09:41:39

 * Package    : mvc
 * Filename   : DetailModel.js
*/

"use strict";

/**
 * @name DetailModel
 * @classdesc Base class for every detail model
 */

var DetailModel = (function(){/* Declaration of detail model */});

DetailModel.prototype.getServiceModel = function(){
	return [window.models.CH000S0W_COMMON, window.models.CH000SEW_SYS_ERROR, window.models.CH000S0W_COMM, setNullValues(this.DETAIL), window.models.getProgramReturnRec()];
};

DetailModel.prototype.getDetailModel = function(){
	return this.DETAIL;
};

DetailModel.prototype.setDetailModel = function(model, errors){
	var hasErrors = errors || 0; 
	
	if (hasErrors == 0){
		if(JSON.stringify(model) === JSON.stringify(this.getEmptyModel())){
	        this.action = CONFIG.CREATE;
	    } else {
	        this.action = CONFIG.UPDATE;
		}
		this.DETAIL = model;
	} else{
		console.warn("Errors returned from backend");
	}
};

DetailModel.prototype.setCustomAction = function(action){
	this.action = action;
  this.DETAIL.detail_action_code = action;
};

DetailModel.prototype.getValue = function(key){
	return DETAIL[key];
};
