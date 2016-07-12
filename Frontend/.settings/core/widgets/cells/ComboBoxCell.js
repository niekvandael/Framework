/**
 * 
 */
define(["dojox/grid/cells/dijit", 
         "dojo/_base/declare",
         "cefetraWidgets/ComboBox",
         "dojo/parser",
         "dijit/registry",
         "dojo/_base/lang"], function(dijit, declare, NumberTextBox, parser, registry, lang){
	var NumberTextBoxCell = declare("ComboBoxCell", dojox.grid.cells._Widget, {
      _destroyOnRemove: true,
      widgetClass: custom.NumberTextBox,
      
      getValue: function(){
  			var e = this.widget;
  			// make sure to apply the displayed value
  			e.set('displayedValue', e.get('displayedValue'));
  			return e.get('value');
  		},
  		
  		setValue: function(inRowIndex, inValue){
  			if(this.widget){
  				this.widget.constraints = this.widgetProps.constraints;
  				this.widget.setMessages();
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
	
	NumberTextBoxCell.markupFactory = function(node, cell){
		dojox.grid.cells._Widget.markupFactory(node, cell);
	};
	
	return NumberTextBoxCell;
});