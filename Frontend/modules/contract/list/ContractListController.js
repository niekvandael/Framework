/**
 * CREATED BY NVD ON 2015/04/22 09:12:36 @ v 3.0
 *
 * Package    : refer.cur.list
 */

define([
    "dojo/_base/declare",
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
    'dijit/_WidgetsInTemplateMixin',
    "dojo/text!modules/contract/list/ContractListView.html",
    "mvc/ListController",
    "dojo/request/xhr",
    "/models/contract/Records.js",
    "/modules/contract/list/ContractListModel.js"
], function(declare, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, template, ListController, xhr) {
    return declare("custom.contractListController", [_WidgetBase, _TemplatedMixin, ListController, _WidgetsInTemplateMixin], {
        templateString: template,
    	  entity: "contract",
    	  searchOnStartup: false,
    	  
    	  constructor: function(){
    	  	this.inherited(arguments);
    	  	this.model = new contractListModel();
    	  	this._connections = [];
    	  },
    	  
    	  handleDoubleClick: function(){
    	  	//this.openCHCURBDDetailView();
    	  },
    	  
    	  serviceCall: function(){
    	  	var self = this;
    	  	xhr.get("/modules/contract/list/data.json").then(function(data){
    	  		self.callback(JSON.parse(data));
    	  	});
    	  },
    	  
    	  callback: function(callbackData){
    	  	// check whether the widget is destroyed, if the widget is destroyed cancel every operation
    	  	if (this._destroyed){
    	  		console.debug("Widget '" + this.entity + "' closed before callback");
    	  		return;
    	  	}
    	  	// TODO hide loader when there is no remaining servicecall
    	  	this.countWebcalls--;
    	  	if (this.countWebcalls == 0){
    	  		this.setLoader("hidden");
    	  	}
    	  	
    	  	// format data so the treeGrid can work with it
    	  	var formattedData = this.formatToTreeGridData(callbackData.result);
    	  	
    	  	this.model.setListModel(callbackData.result);
    	  	// the model isn't the right one, overwrite it with the right model
    	  	this.model.LIST.contract_detail_data = formattedData;
    	  	
    	    setTreeGrid(this.id + this.gridId, this);
    	  },
    	  
    	  // format the data to fit in the treeGrid's needs.
    	  formatToTreeGridData: function(oData){
    	  	// original data
    	  	var data = oData[1].contract_detail_data;
    	  	var contractObj = {};
    	  	for(var i = 0; i < data.length; i++){
    	  		// if contract isn't already added to the contractObj.
    	  		if(contractObj[data[i].poskey] == undefined){
    	  			var contract = {
    	  					label: data[i].ctr_no,
    	  					ctr_no: data[i].ctr_no,
    	  					poskey: data[i].poskey,
    	  					subcontract: []
    	  			};
    	  			data[i].label = data[i].contract;
    	  			var numberArray = [data[i].delivered, data[i].fixed, data[i].released_qty];
    	  			data[i].forward_qty = Number(calculateAddSubstract(data[i].total, numberArray, 2));
    	  			contract.subcontract.push(data[i]);
    	  			contractObj[contract.poskey] = contract;
    	  		}else{
    	  			var contract = contractObj[data[i].poskey];
    	  			data[i].label = data[i].contract;
    	  			var numberArray = [data[i].delivered, data[i].fixed, data[i].released_qty];
    	  			data[i].forward_qty = Number(calculateAddSubstract(data[i].total, numberArray, 2));
    	  			contract.subcontract.push(data[i]);
    	  		}
    	  	}
    	  	
    	  	// iterate over the contract object
    	  	var contract = [];
    	  	for(var prop in contractObj){
    	  		contractObj[prop].subContractCount = contractObj[prop].subcontract.length;
    	  		contractObj[prop].emptyValue = "";
    	  		if(contractObj.hasOwnProperty(prop)){
    	  			contract.push(contractObj[prop]);
    	  		}
    	  	}
    	  	
    	  	return contract;
    	  }
    });
});