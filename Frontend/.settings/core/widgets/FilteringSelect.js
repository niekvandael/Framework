/**
 * CREATED BY NVD ON 10 dec. 2014 14:54:29

 * Package    : widgets
 * Filename   : FilteringSelect.js
*/

define([
         "dojo/_base/declare", 
         "dijit/form/FilteringSelect"
     ], function(declare, FilteringSelect){
         declare("custom.FilteringSelect", [FilteringSelect], {
             required : false,
             selectOnClick : true,
             setFocus: false,
             dependent: false,
             
             startup: function(){
            	 if (this.setFocus){
            		 var self = this;
            		 setTimeout(function(){self.focus();},0);
            	 }
            	 this.inherited(arguments);
             },
             
             set: function(attr, val){
            	 // Set the initial value (on combobox load)
            	 if(attr == "value" && this.dependent && this.domNode.getAttribute("iv") == null){
            		 this.domNode.setAttribute("iv", val);
            	 };
            	 
            	 this.inherited(arguments);
             },
             
             get: function(attr){
            	 var val = this.inherited(arguments);
            	 
            	 return val;
             }
        });
});