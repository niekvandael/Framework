define([
         "dojo/_base/declare", 
         "dijit/form/CheckBox"
     ], function(declare, CheckBox){
         declare("custom.CheckBox", [CheckBox], {
           
         set: function(attr, val) {
        	 if(attr == "value"){
          	 val = (val == "Y" ? true : false);
        	 }
        	 
           this.inherited(arguments);
         },
         
         get: function(attr) {
        	 if(attr == "value"){
        		 attr = "checked";
             var val = this.inherited(arguments);
          	 return (val == true ? "Y" : "N");
        	 }
        	 
         }
        	
        });
});