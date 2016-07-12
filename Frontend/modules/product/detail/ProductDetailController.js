/**
 * CREATED BY GENERATOR ON 2015/05/04 12:39:53 @ v 4.0
 * 
 * Package : refer.cur.detail
 */
define([ "dojo/_base/declare", 
         "dijit/_WidgetBase", 
         "dijit/_TemplatedMixin",
		'dijit/_WidgetsInTemplateMixin',
		"dojo/text!modules/product/detail/ProductDetailView.html",
		"mvc/DetailController", 
		"/models/product/Records.js",
		"/modules/product/detail/ProductDetailModel.js"
		], function(declare,
		_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, template,
		DetailController) {
	return declare("custom.ProductDetailView", [ _WidgetBase, _TemplatedMixin, DetailController, _WidgetsInTemplateMixin ], {
		templateString : template,
		entity : "Product",
			
		constructor : function() {
			this.inherited(arguments);
			this.model = new ProductDetailModel();
			this._connections = [];
			this.keyFields = ["PRODUCTCODE"];
		}
	});
});
