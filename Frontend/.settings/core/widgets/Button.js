/**
 * CREATED BY NVD ON 10 dec. 2014 14:54:29

 * Package    : widgets
 * Filename   : Button.js
*/

define([
         "dojo/_base/declare", 
         "dijit/_WidgetBase",
         "dijit/_TemplatedMixin",
         "dijit/_AttachMixin",
         "dojo/text!js/../custom/templates/Button.html",
         "dojo/on",
         "dijit/registry"
     ], function(declare, _WidgetBase, _TemplatedMixin, _AttachMixin, template, on, registry){
         declare("custom.Button", [_WidgetBase, _TemplatedMixin, _AttachMixin], {
        	 	templateString: template,
        	 	
        	 	postCreate: function(){
        	 		this.clickAction();
        	 		this.setShortcut();
        	  	this.inherited(arguments);
        	 	},
        	 	
        	 	setShortcut: function(){
        	 		var self = this,
    	 				scope = (registry.byId(this.parentId)) ? registry.byId(this.parentId) : self.attachScope;
    	 				if (this.shortcut){
	        	 		this.own(
	        	 				on(this.attachScope.customButton, 'keyup', function(e){
	        	 					var character = String.fromCharCode(e.keyCode).toLowerCase();
	        	    	  	if (!e.altKey){
	        	    	  		return;
	        	    	  	}
	        	    	  	
	        	    	  	if (character === self.shortcut.toLowerCase()){
	        	    	  		scope[self.onClick]((self.row)?self.row:null);
	        	    	  	};
	        	    	  	e.stopPropagation();
	        	    	  	e.preventDefault();
	        	 				})
	        	 		);
    	 				}
        	 	},
        	 	
        	 	clickAction: function(){
        	 		var self = this,
        	 				scope = (registry.byId(this.parentId)) ? registry.byId(this.parentId) : self.attachScope;
        	 		
        	 		this.own(
        	 				on(this.attachScope.customButton, 'click', function(e){
        	 					scope[self.onClick]((self.row)?self.row:null);
        	 					e.stopPropagation();
              	  	e.preventDefault();
        	 				})
        	 		);
        	 	}
        });
});