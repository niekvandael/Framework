/**
 * CREATED BY GENERATOR ON 2015/05/04 12:39:53 @ v 4.0
 * 
 * Package : refer.cur.detail
 */
define([ "dojo/_base/declare", 
         "dijit/_WidgetBase", 
         "dijit/_TemplatedMixin",
		'dijit/_WidgetsInTemplateMixin',
		"dojo/text!modules/employee/detail/EmployeeDetailView.html",
		"mvc/DetailController", 
		"/models/employee/Records.js",
		"/modules/employee/detail/EmployeeDetailModel.js"
		], function(declare,
		_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, template,
		DetailController) {
	return declare("custom.EmployeeDetailView", [ _WidgetBase, _TemplatedMixin, DetailController, _WidgetsInTemplateMixin ], {
		templateString : template,
		entity : "Employee",
			
		constructor : function() {
			this.inherited(arguments);
			this.model = new EmployeeDetailModel();
			this._connections = [];
			this.keyFields = ["EMPLOYEENUMBER"];
		}
	});
});
