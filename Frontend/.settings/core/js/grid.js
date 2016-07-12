/**
 * CREATED BY NVD ON 1-apr.-2014 13:57:41
 * 
 * Package : core/js Filename : gridActions.js
 */

"use strict";

function getGrid(listController){
	var grid = undefined;
	require([ "dijit/registry", "dojo/on" ], function(registry, on) {
		grid = registry.byId(listController.id + "grid");
	});
	
	return grid;
}

function selectAllRows(listController, deselect){
	var grid = undefined;
	require([ "dijit/registry", "dojo/on" ], function(registry, on) {
		grid = registry.byId(listController.id + "grid");
	});
	
	if(deselect){
		grid.selection.deselectAll();
	} else {
		for (var i = 0; i < grid.store._arrayOfAllItems.length; i++) {
			grid.selection.setSelected(i, true); 
		}
	}
}

function setGrid(id, listController) {
	if(listController.onPublish != undefined){
		listController.onPublish(listController.model.getListModel(), listController);
	}

	require([ "dijit/registry", "dojo/on", "dojo/data/ItemFileWriteStore" ], function(registry, on, ItemFileWriteStore) {
    	var grid = registry.byId(id);
    	if (grid == null){
    		console.warn("Screen closed before grid data could be loaded.");
    		return;
    	}
    	
		if (grid.store != null && !listController.clearOnSearch){
			
			// Get the current selection
			var selections = grid.selection.getSelected();
			
			grid.selection.clear();
			if(grid.store == undefined || listController.model.getCurrentPageNumber() == 1 || typeof listController.model.getCurrentPageNumber() === 'undefined'){		
				
				for (var i = 0; i <  listController.model.getListModel().length; i++) {
					 listController.model.getListModel()[i]["uniqueId"] = i;
				}
				var store = new ItemFileWriteStore({
    			    data : {
    				items : listController.model.getListModel(),
    				identifier: "uniqueId"
    			    }
    			});
				
    			grid.setStore(store);
    			
    			grid.selection.setSelected(selections);
    			
			} else {
				var result_count = 0;
				if (typeof listController.model.returnedLength !== "undefined"){
					result_count = listController.model.returnedLength;
				} else if (typeof listController.model.LIST.result_count !== "undefined"){
					result_count = listController.model.LIST.result_count;
				} else {
					console.warn("grid.js - 40 - result_count not set, 0 is default value");
				}
				for (var i = listController.model.getListModel().length - result_count; i < listController.model.getListModel().length; i++) {
					listController.model.getListModel()[i]["uniqueId"] = i;
					var element = listController.model.getListModel()[i];
					grid.store.newItem(element);
				}
				grid.finishedLoading = true;
				setTimeout(function() {
				var lastIndex = grid.scroller.lastVisibleRow - 1;
				grid.focus.setFocusIndex( lastIndex, 0 );
				}, 10);
			}
		} else{
			if(listController.model.getListModel() == undefined){
				return; // No result from service yet
			}
		
			for (var i = 0; i <  listController.model.getListModel().length; i++) {
				 listController.model.getListModel()[i]["uniqueId"] = i;
			}
			var store = new dojo.data.ItemFileWriteStore({
			    data : {
				items : listController.model.getListModel(),
				identifier: "uniqueId"
			    }
			});
			grid.setStore(store);
			grid.finishedLoading = true;
			createConnections(id, listController);
		}
		
		// Enable / disable cells depending on column
		if(typeof listController["editableCell"] != 'undefined'){
	      debugger;
	      var rows = grid.structure[0].cells;
			listController.editableCell();
			
		}
		
		setTimeout(function() { 
			var focusRow = grid.rowCount-50;
			
			if(focusRow > 0){ 
				grid.selection.setSelected(focusRow, true); 
			}
			
			if(listController.model != undefined){
	    	listController.model.isRetrieving = false;
			}
		}, 10); 
		return false;
    });
}

function setTreeGrid(id, listController) {
	
	if(listController.onPublish != undefined){
		listController.onPublish(listController.model.getListModel(), listController);
	}

	require([ "dijit/registry", "dojo/on", "dojo/data/ItemFileWriteStore" ], function(registry, on, ItemFileWriteStore) {
  	var grid = registry.byId(id);
  	if (grid == null){
  		console.warn("Screen closed before grid data could be loaded.");
  		return;
  	}
  	
		if (grid.store != null && !listController.clearOnSearch){
			grid.selection.clear();
			if(grid.store == undefined || listController.model.getCurrentPageNumber() == 1 || typeof listController.model.getCurrentPageNumber() === 'undefined'){
				var data = {
						identifier: "label",
						label: "label",
						items: listController.model.getListModel()
				};
				
				var store = new dojo.data.ItemFileWriteStore({
			    data: data
				});
  			
				grid.setStore(store);
			} else {
				console.warn("not yet implemented!");
				var result_count = 0;
				if (typeof listController.model.returnedLength !== "undefined"){
					result_count = listController.model.returnedLength;
				} else if (typeof listController.model.LIST.result_count !== "undefined"){
					result_count = listController.model.LIST.result_count;
				} else {
					console.warn("grid.js - 40 - result_count not set, 0 is default value");
				}
				for (var i = listController.model.getListModel().length - result_count; i < listController.model.getListModel().length; i++) {
					listController.model.getListModel()[i]["uniqueId"] = i;
					var element = listController.model.getListModel()[i];
					grid.store.newItem(element);
				}
				grid.finishedLoading = true;
				setTimeout(function() {
				var lastIndex = grid.scroller.lastVisibleRow - 1;
				grid.focus.setFocusIndex( lastIndex, 0 );
				}, 10);
			}
		} else{
			var data = {
					identifier: "label",
					label: "label",
					items: listController.model.getListModel()
			};
			
			var store = new dojo.data.ItemFileWriteStore({
		    data: data
			});
			
			grid.setStore(store);
			grid.finishedLoading = true;
			createConnections(id, listController);
		}
		
		setTimeout(function() { 
			var focusRow = grid.rowCount-50;
			
			if(focusRow > 0){ 
				grid.selection.setSelected(focusRow, true); 
			}
			
			if(listController.model != undefined){
	    	listController.model.isRetrieving = false;
			}
		}, 10); 
		return false;
    });
}

function createConnections(listId, listController){
	require([ "dijit/registry", "dojo/on" ], function(registry, on) {
		var grid = registry.byId(listId);
		
		if(!listController.loadOnScroll){
			grid.finishedLoading = true;
		};
		
		var gridScrollConnection = on(grid, "mousewheel", function(e) {
			if (!grid.finishedLoading || !listController.model.canGoDown()){
				return;
			}
			var scroller = grid.scroller;
			if (e.wheelDeltaY < 0 && scroller.lastVisibleRow+20 >= scroller.rowCount && !listController.model.isRetrieving || !listController.model.canGoDown()) {
				grid.finishedLoading = false;
	    	listController.model.isRetrieving = true;
	    	loadExtraData(listController);
	    }
		}); 
		
		var gridScrollConnectionFirefox = on(grid, "DOMMouseScroll", function(e) {
			if (!grid.finishedLoading || !listController.model.canGoDown()){
				return;
			}
			var scroller = (grid.scroller);
			if (e.wheelDeltaY < 0 && scroller.lastVisibleRow+20 >= scroller.rowCount && !listController.model.isRetrieving || !listController.model.canGoDown()) {
				grid.finishedLoading = false;
		    	listController.model.isRetrieving = true;
		    	loadExtraData(listController);
		    }
		});
		
		var gridScrollbar = on(grid.views.views[0].scrollboxNode, "scroll", function(e) {
				var gridScrollbarMouseUp = on.once(grid.views.views[0].scrollboxNode, "mouseup", function(e){
					var scroller = grid.scroller;
					if ((scroller.lastVisibleRow + 20) >= scroller.rowCount && !listController.model.isRetrieving || !listController.model.canGoDown()) {
						if (!grid.finishedLoading || !listController.model.canGoDown()){
							return;
						}
						grid.finishedLoading = false;
				    listController.model.isRetrieving = true;
				    	
				    	// Necessary check otherwise third party scripts will throw undefined errors(KEY_NEXT) 
				    	if (typeof listController.model.REQUEST === "undefined"){
				    		loadExtraData(listController);
				    	}
				    }
				});

				listController._connections.push(gridScrollbarMouseUp);
		});
		
		var arrowDown = on(window, "keydown", function(event){
			if (!grid.finishedLoading || !listController.model.canGoDown()){
				return;
			}

			if ((event.keyCode == 40 || event.keyCode == 34) && listController.method != CONFIG.UPDATE_EDITABLE_LIST && grid._focused && !listController.model.canGoDown()) {
				// ARROW DOWN(40) + PAGE DOWN(34)
				if ((grid.scroller.lastVisibleRow) > (grid.rowCount) - 10) {
					grid.finishedLoading = false;
					loadExtraData(listController);
			    }
			}
		});
		
		var doubleClick = on(grid, "rowDblClick", function(event){
			if (listController.lookup){
				listController.selectAction();
			} else{
				listController.handleDoubleClick(event);
			}
		});
		
		var contextMenu = on(grid, "cellContextMenu", function(event){
			// check with typeof because first row is '0'
			if (typeof event.rowIndex !== "undefined"){
				grid.selection.setSelected(event.rowIndex, true);
				grid.focus.setFocusIndex(event.rowIndex, event.cellIndex);
			}
			grid.onRowContextMenu(event);
		});
		
		listController._connections.push(gridScrollConnection);
		listController._connections.push(gridScrollConnectionFirefox);
		listController._connections.push(arrowDown);
		listController._connections.push(gridScrollbar);
		listController._connections.push(doubleClick);
		listController._connections.push(contextMenu);
	});
}

function loadExtraData(listController){
	listController.model.incrementPageNumber();
	
	if(listController.model.canScrollDown() != "NO"){
		listController.serviceCall();
	};
	listController.model.currentPage++;
}

function deleteSelectedRow(grid) {
    // Delete the selected row
	getDijitWidgetById(grid, function(grid) {
    	grid.removeSelectedRows();
    });

}

function onSingleSelection(listController, detailController, fieldMappings) {
	require([ "dojo/on", "dijit/registry" ], function(on, registry) {
		var grid = registry.byId(listController.id + "grid");
	   
	    var click = on(grid, "rowClick", function(evt){
          var selection = evt.grid.getItem(grid.selection.selectedIndex);
          
          var model = detailController.model.getEmptyModel();
          for (var field in model) {
        	  if (selection != null && selection.hasOwnProperty(field)){
        		  model[field] = selection[field][0];
        	  }
          }
          if(fieldMappings != undefined){
	          for(field in fieldMappings){
	        	  model[field] = selection[fieldMappings[field]][0];
	          }
          }
          
          detailController.model.setDetailModel(model);
          publish(detailController, true); // Publish, but skip onPublish function (will get executed on callback)
          
          detailController.callWS(CONFIG.READ_RECORD);
          disableFields(detailController, true, false);

        });
	    
	    _connections.push({
		    "tab" : listController.parentContainer.split(".")[0],
		    con : click
		});
    });
}

function updateEditableGrid(listController){
	
	require([ "dojo/on", "dijit/registry" ], function(on, registry) {
		var grid = registry.byId(listController.id + listController.gridId);
		
		if(grid === undefined || grid.editable === undefined || !grid.editable) return;
		
		var oldRow = "";
		var applyEdit = on(grid, "applyCellEdit", function(value, row, field){
			var currentRow = grid.getItem(row);
			// Check if value is a date, if so: format it
			if (getGridWidgetType(grid, field) == "DateTimeTextBox"){
				value = getDefaultDateFormat(value);
			}
			
			// Check if values has changed
			if (oldRow[field] != value){
				grid.store.setValue(currentRow, field, value);
				grid.selection.setSelected(row, true);
			}
			
			if (listController.applyCellEditHook){
				listController.applyCellEditHook(value, row, field, oldRow);
			}
		});
		
		var startEdit = on(grid, "startEdit", function(cell, row){
			oldRow = clone(grid.getItem(row));
		});
		
		listController._connections.push(applyEdit);
		listController._connections.push(startEdit);
	});
}

function getGridWidgetType(grid, field){
	for (var i = 0; i < grid.structure.length; i++){
		if (grid.structure[i].field == field){
			if (grid.structure[i].widgetClass != undefined){
				return grid.structure[i].widgetClass.superclass.declaredClass.split("_")[1];
			} 
			return false;
		}
	}
}

//function getSelectedRows(controller){
//	getDijitWidgetById(controller.id + controller.gridId, function(grid){
//		var items 		= grid.selection.getSelected();
//		var row = 0;
//		items = clone(items);
//		if (items.length === 0){
//			setPageInformation(LANGUAGE.SELECT_AT_LEAST_1_ROW, COLOR.RED);
//			return;
//		}
//			
//		var keys = new Array();
//		for(var k = 0; k < grid.selection.selected.length; k++){
//			if (grid.selection.selected[k]){
//				keys.push(k);
//			}
//		}
//			
//		for (var i = 0; i < items.length; i++){
//			if (items[i]){
//				var row = keys[i];
//			}
//			
//			try {
//				delete items[i]._0;
//				delete items[i]._RI;
//				delete items[i]._S;
//	
//				
//				if (items[i].detail_action_code[0] != CONFIG.CREATE){
//					items[i].detail_action_code[0] = CONFIG.UPDATE;
//				}
//				
//				for (var prop in items[i]){
//					items[i][prop] = items[i][prop][0];
//					if (prop === "detail_refresh_join"){
//						items[i][prop] = row;	
//					}
//				}
//			
//			} catch (e) {
//				// TODO: handle exception
//			}
//		}
//		return items;
//	});
//}

function insertNewRow(controller, callback){
	controller[callback](controller);
}

function mapProductTypes(listId, comboId){
	require([ "dijit/registry" ], function(registry) {
		
		var combobox = registry.byId(comboId);
		var grid 		= registry.byId(listId);
		var prodfamid 	= grid.getItem(grid.focus.rowIndex).prodfamid[0];
		
		COMBOBOX.CHPTHBL.LOADED = false;
		COMBOBOX.getCHPTHBLComboValues(prodfamid, function(){
			combobox.store = COMBOBOX.CHPTHBL; 
			combobox.loadAndOpenDropDown();	
		});		
	});
}

function mapProductSubtypes(listId, comboId){
	require([ "dijit/registry" ], function(registry) {
		
		var combobox = registry.byId(comboId);
		var grid 		= registry.byId(listId);
		var prodfamid 	= grid.getItem(grid.focus.rowIndex).prodfamid[0];
		
		COMBOBOX.CHPSTBL.LOADED = false;
		COMBOBOX.getCHPSTBLComboValues(prodfamid, function(){
			combobox.store = COMBOBOX.CHPSTBL; 
			combobox.loadAndOpenDropDown();	
		});		
	});
}

function clearList(listId){
	require([ "dijit/registry" ], function(registry) {
		var list = registry.byId(listId);
		if (list != undefined){
			list.setStore(null);
		}
	});
}


function getNextUniqueIndex(store){
	if(store === null){
		return 0;
	}
	
	var maxIdx = 0;
	for (var i = 0; i < store._arrayOfAllItems.length; i++) {
		if(store._arrayOfAllItems[i] != null || store._arrayOfAllItems[i] != undefined){
			var current = store._arrayOfAllItems[i]["uniqueId"][0];
			if(current > maxIdx){maxIdx = current;};
		}
	}
	return ++maxIdx;
}

function addItem(list, item){
	if(list.store == null){
		list.setStore(new dojo.data.ItemFileWriteStore({
		    data : {
				items : [item],
				identifier: "uniqueId"
		    }
		}));
	} else {
		list.store.save();
		list.store.newItem(item);
	}
}

function deleteSelected(list){
	 var items = list.selection.getSelected();
     if(items.length){
         dojo.forEach(items, function(selectedItem){
             if(selectedItem !== null){
                 list.store.deleteItem(selectedItem);
             }
         }); 
     } 
}

function getGridStructureForExport(inStructure){
	var fields = [],
		row = "",
		structure = inStructure;
	
	// when html view is used, get the cells.
	if (typeof inStructure[0].cells !== "undefined"){
		structure = inStructure[0].cells[0];
	}
	
	for (var i = 0; i < structure.length; i++){
		row = {"field" : structure[i].field, "name" : structure[i].name};
		fields.push(row);
	}
	return fields;
}

function updateListCallback(controller, callbackData){
	// get the updated grid
	var grid 		= null,
		hasErrors 	= false;
	
	require(["dijit/registry", "dojo/on"], function(registry, on){
		grid = registry.byId(controller.id + "grid");
	});
	
	// model has to be empty otherwise you will have duplicate, old input
	if (typeof controller.model.deleteDetailData != "undefined"){
		controller.model.deleteDetailData();
	}
	var translatedErrors = new Array();

	// Show errors if necessary
	if(!Object.prototype.toString.call( callbackData ) === '[object Object]' && callbackData.message != undefined) {
			translatedErrors.push(callbackData.message);
		} else {
			for (var i = 0; i < callbackData.result[1].length; i++) {
				
				var rowIndex = callbackData.result[1][i].control_row_index;
				var errors = callbackData.result[1][i].errors;
				
				for (var j = 0; j < errors.length; j++) {
					hasErrors = true;
					var translatedError =  LANGUAGEFUNCTIONS.getSpecialErrorMessage(errors[j].error_code, errors[j]);
					translatedErrors.push(LANGUAGE.ROW + " " + (parseInt(rowIndex)) + ": " + translatedError);
				}
			}
		
		// select lines that are not saved correctly
		grid.selection.clear();
		
		for (var i = 0; i < callbackData.result[1].length; i++) {
			var rowIdx = callbackData.result[1][i].control_row_index;
			var nrOfErrors = callbackData.result[1][i].errors.length;
			if(nrOfErrors > 0){
				grid.selection.setSelected(rowIdx, false);
			} else {
				grid.selection.setSelected(rowIdx, true);
			}
		}
		
		// delete selected items from model (not list as publish will take care of that)
		 var items = grid.selection.getSelected();
		 if(items.length){
	    dojo.forEach(items, function(selectedItem){
	        if(selectedItem !== null){
	            
	            // Delete from model
	            var selectedItemAsString = JSON.stringify(unBox(selectedItem));
	            var modelItemAsString = undefined;
	            for (var i = 0; i < controller.model.getListModel().length; i++) {
	            	modelItemAsString = JSON.stringify(unBox(controller.model.getListModel()[i]));
	            	
	            	if(selectedItemAsString == modelItemAsString){
	            		// Delete found item from model if JSON matches
	            		controller.model.LIST.detail_data.splice(i, 1);
	            		break;
	            	}
				}
	            
	            // 	Delete from widget causes list to not render any rows in some cases (e.g. CSV import)
	            //  grid.store.deleteItem(selectedItem);
	
	        }
	    }); 
		 } 
		
		// Set new data in model
	  	controller.model.updateListModel(callbackData.result[0] , controller);

	  	// Set new data into grid
	  	publish(controller);
	  	
	}
	if (hasErrors){
		showErrorMessageDialog(translatedErrors);
	}

}

function getSelectedGridRow(grid, field){
	return (grid.selection.getSelected().length === 1) ? grid.selection.getSelected()[0][field][0] : "";
}

function getLastGridRow(grid){
	return grid.getItem(grid.store._arrayOfAllItems.length - 1);
} 

function getNewInsertRowIndex(grid){
	return grid.store._arrayOfAllItems.length + 1;
}

function selectNewItems(grid){
	grid.store.fetch({query: {wpcseqno:0}, onComplete: function(data){
		var counter = 0;
		for (var i = 0; i < grid.store._arrayOfAllItems.length; i++) {
			if(grid.store._arrayOfAllItems[i] != null){
				counter++;
			}
		}
		grid.selection.setSelected(counter-1, true);
	}});
}

function addFormatter(inColumns){
	var columns = inColumns;
	if( Array.isArray(columns[0]) ) {
		  columns = inColumns[0];
	}
	
	for(var i=0 ; i<columns.length ; i++){
		// If numericFormat is true a numeric value will be formatted with 2 decimals
		if (columns[i].numericFormat != true){
			continue;
		}
		if (columns[i].customFormatter != true){
			columns[i].formatter = function(item, row, cell, a, b , c ,d ,e ,f) {
				setEditableCellAttributes(item, row, cell);
	    			if(isNaN(item)){
	    				return "<div width='100%' style='float:left'>" + item + "</div>";
	    			} 
	    			
    				var color = "";
    				if (item < 0){
    					color = " color : red;";
    				}
    				var places = 2;
    				if(cell._props.places != undefined){
    					places = cell._props.places;
    				}
    				require(["dojo/number"], function(number){
    					  // Returns a string, in locale format, with 2 decimal places
    					  item = number.format(item, {
    					    places: places
    					  });
    				});
    				
    				return "<div width='100%' style='float:right; " + color + "'>" + item + "</div>";
	    			
			};
		} else {
			delete columns[i].customFormatter;
		}
	}
};

function getCellValue(row, field){
	return row[field][0];
}

function getStoreLength(store){
	var size = 0;
	store.fetch({query: {}, onBegin: function(inSize){
		size = inSize;
	}, start: 0, count: 0});
	return size;
};

function disableRows(grid){
	grid.canEdit = function(inCell, inRowIndex) {
		// when using the enter key the inCell may be undefined
		if (typeof inCell == "undefined"){return;}
    if (inCell.widgetProps && inCell.widgetProps.disabledRows && ~inCell.widgetProps.disabledRows.indexOf(inRowIndex)){
    	if (grid.rowSelectCell && grid.rowSelectCell.setDisabled){
    		setTimeout(function(){grid.rowSelectCell.setDisabled(inRowIndex, true);},0);
    	}
    	return false;
    } 
    return true;
	};
};

function clearStore(grid){
	require(["dojo/data/ItemFileWriteStore"], function(ItemFileWriteStore){
		grid.setStore(new ItemFileWriteStore({data: {  identifier: "",  items: []}}));
	});
};

function commitEditableGrid(store, model){
	store.fetch({
		query: {}, 
		onComplete: function(items){
			var listModel = model.getListModel();
			for (var prop in items){
				var row = items[prop];
				for (var modProp in listModel[prop]){
					// update the model
					listModel[prop][modProp] = row[modProp][0] ? row[modProp] : row[modProp];
				}
			}
		}
	});
};