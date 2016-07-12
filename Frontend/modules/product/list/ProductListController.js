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
    "dojo/text!modules/product/list/ProductListView.html",
    "mvc/ListController",
    "dijit/registry",
    "/models/product/Records.js",
    "/modules/product/list/ProductListModel.js"
], function(declare, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, template, ListController, registry) {
    return declare("custom.ProductListController", [_WidgetBase, _TemplatedMixin, ListController, _WidgetsInTemplateMixin], {
        templateString: template,
    	  entity: "Product",
    	  
    	  constructor: function(){
    	  	this.inherited(arguments);
    	  	this.model = new ProductListModel();
    	  	this._connections = [];
    	  	this.loadOnScroll = false;
    	  },
    	  
    	  handleDoubleClick : function(){
          	this.openProductDetail();
    	  },
    	  
    	  openProductDetail: function(){
    	  	 var properties = getPopupProperties(500, 700, 'modules/product/detail/ProductDetailController', this, LANGUAGE.PRODUCT_DETAIL);
    	     this.showPopup(properties);
    	  },
    	  
    	  openNewDetail: function(){
      		var properties = getPopupProperties(350, 600, 'modules/product/detail/ProductDetailController', this, LANGUAGE.PRODUCT_DETAIL);
    	  	properties.values = null;
    	  	properties.newEntity = true;
    		this.showPopup(properties);
    	  },
    });
   });