/**
 * CREATED BY NVD ON 19 Jun 2014 16:24:44

 * Package    : core/widgets
 * Filename   : ConfirmDialog.js
*/

define([
    'dojo/_base/declare', 
    'dijit/Dialog',
    'dijit/_WidgetsInTemplateMixin',
    "dojo/text!js/../custom/templates/ErrorDialog.html",
], function(declare,  Dialog, _WidgetsInTemplateMixin, template){
	return declare('custom.ErrorDialog', [Dialog, _WidgetsInTemplateMixin], {
		title: LANGUAGE.ERROR_ICON_DIALOG + LANGUAGE.ERROR_DIALOG_TITLE,
		templateString: template,
		constructor: function(options){
			if (options.message) {
				this.content = options.message;
			}
		}

	});
});