/**
 * CREATED BY NVD ON 10 dec. 2014 14:54:29

 * Package    : widgets
 * Filename   : EnhancedGrid.js
*/

define([
         "dojo/_base/declare", 
         "dojox/grid/EnhancedGrid",
         "dojo/on",
         "dojox/grid/enhanced/plugins/Selector"
     ], function(declare, EnhancedGrid, on){
         declare("custom.EnhancedGrid", [EnhancedGrid], {
        	 fastScroll:	false, 
        	 keepSelection: true,
        	 columnReordering: true,
        	 widgetInTemplate : true,
        	 keepRows: 10000,
        	 rowsPerPage: 50,
        	 plugins: {
             selector: {
                 row: true    //If you'd like to disable row selection, just add this.
             }
        	 },
        	 style: "height:100% !important",
        	 noDataMessage: LANGUAGE.NO_DATA_FOUND,
        	 
        	 markupFactory:function(_c,_d,_e,_f){ 
        		 return dojox.grid._Grid.markupFactory(_c,_d,_e,dojo.partial(dojox.grid.DataGrid.cell_markupFactory,_f)); 
           },
           
           set: function(attr, val){
        	   this.inherited(arguments);
           },
           
	         resize: function(){
	        	 this.inherited(arguments);
	        	 this.domNode.style.height = "100%";
	         },
	         
	         onMoveColumn: function(){
	        	 this.resize();
	        	 this.inherited(arguments);
	         }
        });
});