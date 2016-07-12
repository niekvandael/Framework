/**
 * 
 */
define(["dojox/grid/cells/dijit", 
         "dojo/_base/declare",
         "cefetraWidgets/ValidationTextBox",
         "dojo/parser",
         "dijit/registry",
         "dojo/_base/lang"], function(dijit, declare, ValidationTextBox, parser, registry, lang){
	var ValidationTextBoxCell = declare("ValidationTextBoxCell", dojox.grid.cells._Widget, {
      _destroyOnRemove: true,
      widgetClass: custom.ValidationTextBox,
      
      getValue: function(){
  			var e = this.widget;
  			// make sure to apply the displayed value
  			e.set('displayedValue', e.get('displayedValue'));
  			return e.get('value');
  		},
  		
  		setValue: function(inRowIndex, inValue){
  			if(this.widget){
  				this.widget.set('value', inValue);
  			}else{
  				this.inherited(arguments);
  			}
  		},

      formatEditing: function(inDatum, inRowIndex){
  			this.needFormatNode(inDatum, inRowIndex);
				return "<div>"+inDatum+"</div>";
  		},
	});
	
	ValidationTextBoxCell.markupFactory = function(node, cell){
		dojox.grid.cells._Widget.markupFactory(node, cell);
	};
	
	return ValidationTextBoxCell;
});