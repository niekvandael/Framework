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
    "dojo/text!modules/order/list/OrderListView.html",
    "mvc/ListController",
    "dijit/registry",
    "/models/order/Records.js",
    "/modules/order/list/OrderListModel.js"
], function(declare, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, template, ListController, registry) {
    return declare("custom.OrderListController", [_WidgetBase, _TemplatedMixin, ListController, _WidgetsInTemplateMixin], {
        templateString: template,
    	  entity: "Order",
    	  
    	  constructor: function(){
    	  	this.inherited(arguments);
    	  	this.model = new OrderListModel();
    	  	this._connections = [];
    	  	this.loadOnScroll = false;
    	  },
    	  
    	  handleDoubleClick : function(){
          	this.openOrderDetail();
    	  },
    	  
    	  openOrderDetail: function(){
    	  	 var properties = getPopupProperties(500, 700, 'modules/order/detail/OrderDetailController', this, LANGUAGE.ORDER_DETAIL);
    	     this.showPopup(properties);
    	  },
    	  
    	  postStartupHook: function(){
    		if(this.lookup){
    			var graphics = document.getElementById(this.id + "graphics");
    			graphics.style.display = "none";
    	  	}
    	  },
    	  
    	  postCallbackHook: function(){
    		  if(this.lookup) return;		// NOT FOR LOOKUPS
    		  
    		  debugger; // TODO
    	  },
    	  
      	openNewDetail: function(){
      		var properties = getPopupProperties(350, 600, 'modules/order/detail/OrderDetailController', this, LANGUAGE.ORDER_DETAIL);
    	  	properties.values = null;
    	  	properties.newEntity = true;
    		this.showPopup(properties);
    	  },
    	  
    	  
    });
   });