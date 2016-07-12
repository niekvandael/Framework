/**
 * CREATED BY NVD ON 20 may. 2015 11:25:35
 * 
 * Package : /core/widgets Filename : ListActionBar.js
 */

define(["dojo/_base/declare",
        "dijit/_WidgetBase",
        "dijit/_TemplatedMixin",
        "dojo/text!js/../custom/templates/ListActionBar.html",
        ], function(declare, _WidgetBase, _TemplatedMixin, template) {
					declare("custom.ListActionBar", [_WidgetBase, _TemplatedMixin], {
						templateString: template,
						i18n: LANGUAGE,
						
						startup: function(){
							this.inherited(arguments);
							this.addButtons();
							this.removeButtons();
						},
						
						/*
						 * Function to add custom buttons. Use following syntax:
						 * 
						 * [{
						 * 	action:"yourAction",  // This is the action defined in your listController
						 *  title:"labelofyourbutton", // This is the visible label/text of the button
						 *  buttonId:"idofthebutton", // Necessary to en/disable buttons
						 *  shortcut:"setyourletter" // Mnemonic
						 * }]
						 * 
						 * example: customButtons:[{action:'doGuy',title:'cool',buttonId:'guy',shortcut:'g'}]
						*/
						
						addButtons: function(){
							if (typeof this.customButtons === "undefined"){return;}
							for (var prop in this.customButtons){
								var row = this.customButtons[prop];
								if (row === null){return;}
								this.addButton(row);
							}
						},
						
						addButton: function(element){
							new custom.Button({
								onClick:element.action,
								title:element.title,
								buttonId: element.buttonId,
								shortcut:element.shortcut,
								attachScope: this.attachScope,
								style: 'margin-right: 3px',
							}).placeAt(this.parentId+"customButtonsContainer");
						},
						
						/*
						 * Function to remove buttons from the screen. Use following syntax:
						 * 
						 * Available buttons: "newButton", "searchButton", "resetButton", "variableButton"
						 * 
						 * example: deleteButtons:["newButton", "variableButton"]
						*/
						removeButtons: function(){
							for (var prop in this.deleteButtons){
								this.removeButton(this.deleteButtons[prop]);
							}
						},
						
						removeButton: function(button){
							this.attachScope[button].style.display = 'none';
						}
					});
});