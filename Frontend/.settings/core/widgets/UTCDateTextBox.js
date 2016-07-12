/**
 * CREATED BY NVD ON 8 aug. 2014 09:08:55

 * Package    : core/widgets
 * Filename   : UTCDateTextBox.js
*/

define(["dojo/_base/declare", "dijit/form/DateTextBox"], 
		function(declare, DateTextBox) {
    function isValidDate(value) {
        return value instanceof Date && isFinite(value.getTime());
    }
    function toUTCDate(value) {
        if (isValidDate(value)) {
            value = new Date(
                Date.UTC(value.getFullYear(), value.getMonth(), value.getDate())
            );
        }
        value = convertDateForServer(value);
        return value;
    }
    return declare("custom.UTCDateTextBox", [DateTextBox], {
    	postCreate: function() {
            this.inherited(arguments);
            this.set('constraints', {
                datePattern : 'dd-MMM-yyyy'
            });
        },
        
        _getValueAttr : function() {
            return toUTCDate(this.inherited("_getValueAttr", arguments));
        },
        
        set: function(attr, val){
        	if(attr == "value"){
        		if(val == ""){
        			val = undefined;
        		}
        	}
					this.inherited(arguments);
        }
    });
});