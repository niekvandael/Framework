/**
 * CREATED BY NVD ON 1-apr.-2014 13:57:41
 *
 * Package    : core/widgets
 * Filename   : CustomMenuItem.js
 */

/**
 * Custom TitlePane (only difference is that the toggle function is disabled).
 */
define([
         "dojo/_base/declare", 
         "dijit/_WidgetBase",
         "dijit/_TemplatedMixin",
         "dijit/_WidgetsInTemplateMixin",
         "dojo/text!js/../custom/templates/LookupField.html",
         "dijit/form/ValidationTextBox",
         "dijit/registry",
         "dojo/parser",
         "dijit/Dialog",
         "dijit/_AttachMixin"
     ], function(declare, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, template, ValidationTextBox, registry, parser, Dialog, _AttachMixin){
		return declare("custom.LookupField", [ValidationTextBox, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, _AttachMixin], {
				templateString : template,
				widgetsInTemplate : true,
				i18n: LANGUAGE,
				width: '1200px',
				height: '600px',
				controller: null,
				selectOnClick: true,
				uppercase: true,
				
				showPopup : function() {
					if(this.disabled === true) return;
					
					var title = LANGUAGE.SELECT + " ";
					
					var labels = document.getElementsByTagName('LABEL');
					for (var i = 0; i < labels.length; i++) {
						if(labels[i].htmlFor == this.id + ""){
							title += labels[i].innerHTML;
							break;
						}
					}
					
					var id = this.id; 
					width = this.width; 
					height = this.height; 
					fields = this.fields; 
					mainControllerId = this.mainControllerId;
					val = this.val;
					displayVal = this.displayVal;
					numeric = this.numeric;
					
					if(typeof registry.byId(this.id + "_popupDialog") != "undefined"){
						registry.byId(this.id + "_popupDialog").destroyRecursive();
					}
					
					require([this.controller], function(View){
						var widget = new View({lookup: true, fields: fields, mainControllerId: mainControllerId, dialogId: id + "_popupDialog"});
						
						var popup = new Dialog({
							content: widget,
							title: title,
							id: id + "_popupDialog",
							style: {'padding':0, 'width':width, 'height':height},
							className: 'lookupDialog',
							layout: function(){
					    }
						});
						popup.show();
					});
				},
				
				postCreate: function(){
					// check if the current screen is a lookup and if the parent controller is the same as the current controller
					// when they are the same disable the lookup function to prevent an infinite lookup structure
					if (registry.byId(this.mainControllerId).lookup && ~this.controller.indexOf(this.mainControllerId.split('_')[1])){
						this.lookupAction.style.display = 'none';
					}
				},
				
				handleKeys: function(e){
					var character = String.fromCharCode(e.keyCode).toLowerCase();
    	  	if (!e.altKey){
    	  		return;
    	  	}
    	  	
    	  	if (character === "o"){
						this.showPopup();
					}
				},
				
				destroy: function(){
					this.inherited(arguments);
					if(typeof registry.byId(this.id + "_popupDialog") != "undefined"){
						registry.byId(this.id + "_popupDialog").destroyRecursive();
					}
				}
			});
		parser.parse();
});