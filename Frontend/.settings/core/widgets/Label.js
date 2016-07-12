/**
 * CREATED BY NVD ON 10 dec. 2014 15:31:04

 * Package    : widgets
 * Filename   : HtmlLabel.js
*/

define([
    'dojo/_base/declare', 
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
    "dojo/parser",
    "dojo/text!js/../custom/templates/Label.html",
    "dojo/ready"
], function(declare, _WidgetBase, _TemplatedMixin, parser, template, ready){
	return declare('custom.Label', [_WidgetBase, _TemplatedMixin], {
		templateString: template,
		id: "",
		
		 label: "unknown",
         _setLabelAttr: { node: "labelNode", type: "innerHTML" }
	});
	ready(function(){
		parser.parse();
	});
});