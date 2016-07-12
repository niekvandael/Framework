/**
 * CREATED BY NVD ON 19 Jun 2014 16:24:44

 * Package    : core/widgets
 * Filename   : ConfirmDialog.js
*/

define([
    'dojo/_base/declare', 
    'dijit/Dialog',
    'dijit/_WidgetsInTemplateMixin',
    "dojo/text!js/../custom/templates/ConfirmDialog.html",
    'dijit/form/Button'
], function(declare,  Dialog, _WidgetsInTemplateMixin, template){
	return declare('custom.ConfirmDialog', [Dialog, _WidgetsInTemplateMixin], {
		title: 'Confirm',
		templateString: template,

		constructor: function(options){
			if (options.message) {
				this.content = options.message;
			}
		}

	});
});