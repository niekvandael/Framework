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

DetailModel.prototype.getModel = function(){
	return this.getDetailModel();
};

DetailModel.prototype.getDetailModel = function(){
	return this.DETAIL;
};

DetailModel.prototype.setDetailModel = function(model, errors){
	if(JSON.stringify(model) === JSON.stringify(this.getEmptyModel())){
        this.action = CONFIG.CREATE;
    } else {
    	if(errors == 0){
    		this.action = CONFIG.UPDATE;
    	}
	}
	this.DETAIL = model;
	this.ORIGINAL_DETAIL = cloneObject(this.DETAIL);
};

DetailModel.prototype.setCustomAction = function(action){
	this.action = action;
  this.DETAIL.detail_action_code = action;
};

DetailModel.prototype.getValue = function(key){
	return DETAIL[key];
};

DetailModel.prototype.isModified = function(field){
	if(this.ORIGINAL_DETAIL === undefined){
		return true;
	}
	
	if(this.ORIGINAL_DETAIL[field] != this.DETAIL[field]){
		return true;
	}
};

DetailModel.prototype.hasModifications = function(){
	for(var field in this.DETAIL){
		if(field.indexOf("null_") != -1 || field.indexOf("modified_") != -1){
			return false;
		}
		
		if(this.isModified(field)){
			return true;
		}
	}
	return false;
};
