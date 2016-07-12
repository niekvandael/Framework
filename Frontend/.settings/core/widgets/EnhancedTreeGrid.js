/**
 * CREATED BY KHU ON 14 jul. 2015 14:04:08

 * Package    : widgets
 * Filename   : EnhancedTreeGrid.js
*/

define([
         "dojo/_base/declare", 
         "dojox/grid/TreeGrid",
         "dojo/on"
     ], function(declare, TreeGrid, on){
         declare("custom.EnhancedTreeGrid", [TreeGrid], {
        	 fastScroll:	false, 
        	 keepSelection: true,
        	 columnReordering: true,
        	 widgetInTemplate : true,
        	 keepRows: 10000,
        	 rowsPerPage: 50,
//        	 plugins: {
//             selector: {
//                 row: true    //If you'd like to disable row selection, just add this.
//             }
//        	 },
        	 style: "height:100% !important",
        	 noDataMessage: LANGUAGE.NO_DATA_FOUND,
        	 
        	 markupFactory:function(_c,_d,_e,_f){ 
        		 return dojox.grid.TreeGrid.markupFactory(_c,_d,_e,dojo.partial(dojox.grid.DataGrid.cell_markupFactory,_f)); 
           },
           
	         resize: function(){
	        	 this.inherited(arguments);
	        	 this.domNode.style.height = "100%";
	         },
	         
	         postCreate: function(){
	        	 this.own(
	        		on(this, 'CellClick', function(){
	        			//console.log('do nothing at all');
	        		})
	        	 );
	        	 this.own(
	        	 on(this, 'CellFocus', function(){
	        			//console.log('do nothing at all 1');
	        		})
	        	 );
	        	 this.own(
	        	 on(this, 'ContentEvent', function(){
	        			//console.log('do nothing at all 2');
	        		})
	        	 );
	        	 this.inherited(arguments);
	         }
        });
});