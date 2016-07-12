/**
 * CREATED BY GENERATOR ON 2015/05/04 12:39:53 @ v 4.0
 * 
 * Package : refer.cur.detail
 */
define([ "dojo/_base/declare", 
         "dijit/_WidgetBase", 
         "dijit/_TemplatedMixin",
		'dijit/_WidgetsInTemplateMixin',
		"dojo/text!modules/order/detail/OrderDetailView.html",
		"mvc/DetailController", 
		"/models/order/Records.js",
		"/modules/order/detail/OrderDetailModel.js"
		], function(declare,
		_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, template,
		DetailController) {
	return declare("custom.OrderDetailView", [ _WidgetBase, _TemplatedMixin, DetailController, _WidgetsInTemplateMixin ], {
		templateString : template,
		entity : "Order",
			
		constructor : function() {
			this.inherited(arguments);
			this.model = new OrderDetailModel();
			this._connections = [];
			this.keyFields = ["ORDERNUMBER"];
		}
	});
});
