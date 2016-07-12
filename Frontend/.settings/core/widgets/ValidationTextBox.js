/**
 * CREATED BY NVD ON 10 dec. 2014 14:54:29

 * Package    : widgets
 * Filename   : HtmlValidationTextBox.js
*/

define([
         "dojo/_base/declare", 
         "dijit/form/ValidationTextBox"
     ], function(declare, ValidationTextbox){
         declare("custom.ValidationTextBox", [ValidationTextbox], {
             required : true,
             selectOnClick : true,
             isDate: false,
             dateValue: null,
             
             set: function(attr, val){
            	 this.inherited(arguments);
            	 // set displayvalue will call get-value
            	 if(this.isDate && (attr == "value" || attr == "displayedValue")){
            		 this.dateValue = val;
            		 this._setValueAttr(val, true, format.dateTimeFormatter(val));
            	 }
             },
             
             get: function(attr){
            	 if(this.isDate && attr == "value"){
            		 return this.dateValue;
            	 }
            	 
            	return this.inherited(arguments);
             }
        });
});