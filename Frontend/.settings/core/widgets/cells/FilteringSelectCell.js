/**
 * 
 */
define(["dojox/grid/cells/dijit", 
         "dojo/_base/declare",
         "cefetraWidgets/FilteringSelect",
         "dojo/parser",
         "dijit/registry",
         "dojo/_base/lang",
         "dojo/dom-attr"], function(dijit, declare, NumberTextBox, parser, registry, lang, domAttr){
	var Cell = declare("FilteringSelectCell", dojox.grid.cells._Widget, {
      _destroyOnRemove: true,
      widgetClass: custom.FilteringSelect,
      
      getValue: function(){
  			var e = this.widget;
  			// make sure to apply the displayed value
  			e.set('displayedValue', e.get('displayedValue'));
  			return e.get('value');
  		},
  		
  		createWidget: function(inNode, inDatum, inRowIndex){
  			this.rowIndex = inRowIndex;
  			return new this.widgetClass(this.getWidgetProps(inDatum), inNode);
  		},
  		
  		getWidgetProps: function(inDatum){
  			var store = null;
  			if (this.dependent && this.dependent === "true"){
  				// get the dependent value
  				var parentCellValue = getCellValue(this.grid.getItem(this.rowIndex), this.parent);
  				// evaluate the right method with the correct search criteria
  				store = COMBOBOX[this.method](parentCellValue);
  			} else if(this.dependent && (this.parent === "" || this.method === "")){
  				console.debug("Did you forgot to set the parent or method?");
  			}
  			
  			if (!this.store && !this.dependent){
  				console.debug("Did you forgot to set the store or do you want to have a dependent combobox? Don't forget to set \"dependent='true'\"");
  			} else{
  				store = eval(this.store);
  			}
  			
  			return lang.mixin({}, this.widgetProps||{}, {
  				value: inDatum,
  				store: store
  			});
  		}
	});
	
	// do not use the default markup factory because our widgetProps is a function(store:COMBOBOX.doSomething()) and 
	// therefore the eval will fail(controller will be the window object)
	Cell.markupFactory = function(node, cell){
		dojox.grid.cells._Widget.markupFactory(node, cell);
		cell.store = lang.trim(domAttr.get(node, "store")||"");
		cell.widgetid = lang.trim(domAttr.get(node, "id")||"");
		cell.dependent = lang.trim(domAttr.get(node, "dependent")||"");
		cell.parent = lang.trim(domAttr.get(node, "parent")||"");
		cell.method = lang.trim(domAttr.get(node, "method")||"");
	};
	
	return Cell;
});