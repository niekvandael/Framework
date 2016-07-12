/**
 * CREATED BY GENERATOR ON 2015/05/04 12:39:53 @ v 4.0
 *
 * Package    : refer.cur.list
 */
define([
    "dojo/_base/declare",
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
    'dijit/_WidgetsInTemplateMixin',
    "dojo/text!modules/employee/list/EmployeeListView.html",
    "mvc/ListController",
    "dijit/registry",
    "/models/employee/Records.js",
    "/modules/employee/list/EmployeeListModel.js"
], function(declare, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, template, ListController, registry) {
    return declare("custom.EmployeeListController", [_WidgetBase, _TemplatedMixin, ListController, _WidgetsInTemplateMixin], {
        templateString: template,
    	  entity: "Employee",
    	  
    	  constructor: function(){
    	  	this.inherited(arguments);
    	  	this.model = new EmployeeListModel();
    	  	this._connections = [];
    	  	this.loadOnScroll = false;
    	  },
    	  
    	  handleDoubleClick : function(){
          	this.openEmployeeDetail();
    	  },
    	  
    	  openEmployeeDetail: function(){
    	  	 var properties = getPopupProperties(350, 600, 'modules/employee/detail/EmployeeDetailController', this, LANGUAGE.EMPLOYEE_DETAIL);
    	     this.showPopup(properties);
    	  },
    	  
    	  openOrders: function(){
     	  	 var properties = getPopupProperties(350, 600, 'modules/order/list/OrderListController', this, LANGUAGE.ORDERS_FOR + getSelectedRow(this).LASTNAME);
    	     this.showPopup(properties);
    	  },
    	  
    	  postStartupHook: function(){
    		if(this.lookup){
    			var graphics = document.getElementById(this.id + "graphics");
    			graphics.style.display = "none";
    	  	}
    	  },
    	  
    	openNewDetail: function(){
      		var properties = getPopupProperties(350, 600, 'modules/employee/detail/EmployeeDetailController', this, LANGUAGE.EMPLOYEE_DETAIL);
    	  	properties.values = null;
    	  	properties.newEntity = true;
    		this.showPopup(properties);
    	  },
    	  
    	  postCallbackHook: function(){
    		  if(this.lookup) return;		// NOT FOR LOOKUPS
    		  
    		  // Calculate # of employees per office
    		  var totals = {};
    		  var array = new Array();
    		  
    		  for (var i = 0; i < this.model.LIST.detail_data.length; i++) { 
    			  var item = this.model.LIST.detail_data[i];
    			  if(totals[this.model.LIST.detail_data[i].OFFICECITY] == undefined){
    				  totals[this.model.LIST.detail_data[i].OFFICECITY] = 0;
    			  }
    			  
    			  totals[this.model.LIST.detail_data[i].OFFICECITY]++;
    		  }
    		  
    		  for (var property in totals) {
    			  array.push(totals[property]);
    		  }
    		  
    		  createChart({
    			  title: "# of employees per office",
    			  type: "ClusteredBars",
    			  targetId: this.id+ "candleSticksChart",
    			  data: totals,
    			  legendId: this.id + "legend1",
    		  });
    		  
    		  createChart({
    			  title: "# of employees per office",
    			  type: "Pie",
    			  targetId: this.id + "pieChart",
    			  data: totals,
    			  legendId: this.id + "legend2",
    		  });
    		  // End: calculate # of employees per office
    	  }
    	  
    });
   });