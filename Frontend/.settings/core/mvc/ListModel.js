/**
 * CREATED BY NVD ON 1 okt. 2014 09:13:43

 * Package    : mvc
 * Filename   : ListModel.js
*/

"use strict";

/**
 * @name ListModel
 * @classdesc Base class for every list model
 */

var ListModel = (function(){/* Declaration of list model */
	this.incrementIndex = 0;
	this.DELETED_ITEMS = new Array();
});

/*
 * Set the list model : service callback
 */
ListModel.prototype.setListModel = function( model ){
	// Should be coded differently...
	if(model.length == 2 && typeof model[1] === "string"){
		// progress indicator
		return;
	}
	
    if(model == 403){
    	// incorrect model: probably a server status or response code
    	return;
    }
    
    if(this.KEY_NEXT == null || model.length == 1){
    	// no key next
    	this.returnedLength = model.length;
        this.LIST.detail_data = model;
    } else {
    	// key next exists
    	this.KEY_NEXT = model[0];
        this.returnedLength = model[1].length;
        
        if(model[0].control_page_number == undefined || model[0].control_page_number == 1){
            this.LIST.detail_data = model[1];
        } else {
            this.LIST.detail_data = this.LIST.detail_data.concat(model[1]);
        }
    }
};

/*
 * Set the list model : service callback
 */
ListModel.prototype.updateListModel = function( model , controller){
	var newItems = new Array();
	if(model.length != this.LIST.detail_data.length){
		console.warn("length of returned objects to equal to send objects!");
	}
	
	for (var i = 0; i < this.LIST.detail_data.length; i++) {
		newItems.push(model[i]);
		newItems[i]["uniqueId"] = this.LIST.detail_data[i].uniqueId;
	}
	
	this.setListModel(newItems);
};

/*
 * Set the list model : service call
 */
ListModel.prototype.getServiceModel = function(){
	if(this.KEY_NEXT != null){
	    return [window.models.CH000S0W_COMMON, 
	            window.models.CH000SEW_SYS_ERROR, 
	            window.models.CH000S0W_COMM, 
	            this.KEY_BEGIN, 
	            this.KEY_NEXT, 
	            this.getNewList(), 
	            window.models.getProgramReturnRec()
	   ];
	};
	
    return [window.models.CH000S0W_COMMON, 
            window.models.CH000SEW_SYS_ERROR, 
            window.models.CH000S0W_COMM, 
            this.KEY_BEGIN, 
            this.getNewList(), 
            window.models.getProgramReturnRec()
	   ];
};

/*
 * Set the list model : service call for update
 */

ListModel.prototype.getServiceModelForUpdate = function(data, useSearchRecordInUpdateProcedure){
	if(data == null){
		return this.getServiceModelForUpdateAllRows(useSearchRecordInUpdateProcedure);
	}
	return this.getServiceModelForUpdateSubSelect(data, useSearchRecordInUpdateProcedure);
};

ListModel.prototype.getServiceModelForUpdateSubSelect = function(data, useSearchRecordInUpdateProcedure){
	var list = new Array();
	for (var i = 0; i < data.length; i++) {
		var item = this.getListItem();
		if(data[i] == null){
			continue;
		}
		var element = unBox(data[i]);

		for (var field in item) {
			item[field] = setValueKeepType(item[field], element[field]);
		}
		
		item["detail_refresh_join"] = element.uniqueId;
		item.detail_action_code = CONFIG.UPDATE;
		list.push(item);
	};
		
	// merge deleted rows
	Array.prototype.push.apply(list, this.DELETED_ITEMS);
	
	if(useSearchRecordInUpdateProcedure){
		return [this.KEY_BEGIN, list, window.models.getProgramReturnRec()];
	}
	return [list, window.models.getProgramReturnRec()];
	
};


ListModel.prototype.getServiceModelForUpdateAllRows = function(useSearchRecordInUpdateProcedure){
	var list = new Array();
	for (var i = 0; i < this.LIST.detail_data.length; i++) {
		var item = this.getListItem();
		var element = unBox(this.LIST.detail_data[i]);

		for (var field in item) {
			item[field] = setValueKeepType(item[field], element[field]);
		}
		
		item["detail_refresh_join"] = i;
		list.push(item);
	}
	
	// merge deleted rows
	Array.prototype.push.apply(list, this.DELETED_ITEMS);
	
	if(useSearchRecordInUpdateProcedure){
		return [this.KEY_BEGIN, list, window.models.getProgramReturnRec()];
	} 
	return [list, window.models.getProgramReturnRec()];
	
};

ListModel.prototype.getServiceModelForProgress = function(){
    return [window.models.getProgramReturnRec()];
};

ListModel.prototype.removeIndex = function(index){
	if (this.LIST.detail_data.length >= index){
		this.LIST.detail_data[index] = null;
		this.LIST.detail_data.splice(index, 1);
	}
};


ListModel.prototype.setPageNumber = function(page){
	if (typeof this.KEY_NEXT !== "undefined"){
		this.KEY_NEXT.control_page_number = page;
	}
};

ListModel.prototype.incrementPageNumber = function(){
	if (typeof this.KEY_NEXT !== "undefined"){
		this.KEY_NEXT.control_page_number++;
	}
};

ListModel.prototype.getListModel = function (){
	if(this.LIST.detail_data != undefined){
	    return(this.LIST.detail_data.slice(0));
	}
};

ListModel.prototype.canScrollDown = function(){
	if (typeof this.KEY_NEXT !== "undefined"){
		return this.KEY_NEXT.control_can_go_down;
	}
};

ListModel.prototype.getCurrentPageNumber = function(){
	if (typeof this.KEY_NEXT !== "undefined"){
		return this.KEY_NEXT.control_page_number;
	}
	return 1;
};

ListModel.prototype.getSearchRecord = function(){
    return this.KEY_BEGIN;
};

ListModel.prototype.resetSearchRecord = function(){
	this.KEY_BEGIN = this.getNewKeyBegin();
};

ListModel.prototype.increment = function(){
	return ++this.incrementIndex;
};

ListModel.prototype.getItemByUniqueId = function(uniqueId){
	for (var i = 0; i < this.getListModel().length; i++) {
		var row = this.getListModel()[i];
		if(row.uniqueId[0] === uniqueId){
			return row;
		}
	}
	
	return false;
};

ListModel.prototype.canGoDown = function(){
	// Key next does not exist
	if(typeof this.KEY_NEXT === 'undefined' || typeof this.KEY_NEXT.control_can_go_down === 'undefined'){
		return false;
	}
	
	// Key next does exist
	if(~this.KEY_NEXT.control_can_go_down.indexOf('NO')){
		return false;
	}
	
	return true;
};