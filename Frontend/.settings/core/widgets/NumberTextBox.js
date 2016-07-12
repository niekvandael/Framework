/**
 * CREATED BY NVD ON 13 jan. 2015 11:25:35
 * 
 * Package : CustomSystem/core/widgets Filename : NumberTextBox.js
 */

define(["dojo/_base/declare", "dijit/form/NumberTextBox"],
		function(declare, NumberTextBox) {
			return declare("custom.NumberTextBox", [NumberTextBox], {
				required : true,
				selectOnClick : true,
				intermediateChanges: true,
				
				startup: function(){
					this.setMessages();
					this.inherited(arguments);
				},
				
				setMessages: function(){
					this.rangeMessage = LANGUAGEFUNCTIONS.getRangeMessage(this.constraints);
					this.invalidMessage = LANGUAGEFUNCTIONS.getErrorMessage(this.constraints);
				}
			});
		});