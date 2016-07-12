/**
 * CREATED BY NVD ON 7-apr.-2014 10:15:10
 *
 * Package    : core/js
 * Filename   : actions.js
 */
"use strict";

var _connections = [],
	_dialogs	 = [];

function handleNew(controller){
	
	  if (controller.editable === false){
		  doNew(controller);
	  } else {
		  insertNewRow(controller);
	  }
};

function doNew(ctlr){
		var basicController = ctlr;
		
		// Remove backend valdators
		removeBackendValidators(basicController);
		
		// Reset all fields
		disableFields(basicController, false, true);
		
		// Set default-model values
		var model = basicController.model.getEmptyModel();
		
		basicController.model.setDetailModel(model);
		setModel(model, basicController);
		 
		// set usersettings in model
		setDetailUserSettings(ctlr);
		
		// check if controller contains a hook
		if(ctlr.newActionHook != undefined){
			ctlr.newActionHook();
		}
};

function disableFields(controller, disableKeyFields, focusFirstDetailField){ 
	var focusSet = false;
	for (var field in controller.model.getEmptyModel()) {
		getDijitWidgetById(controller.id + field, function(fld) {
			if(fld != undefined){
				 var disabled = false;
				  if(controller.disabledFields.indexOf(field) != -1){
				      disabled = true;
				  }

/* **********************************************************************
*   nonUpdatableFields are not implemented yet !!! TODO
*
*				  if(controller.nonUpdatableFields != undefined && !disabled && controller.model.action == CONFIG.UPDATE && controller.record.nonUpdatableFields.indexOf(field) != -1){
*					  disabled = true;
*				  }
*************************************************************************/				  
				  if(disableKeyFields){
    				  if(controller.keyFields.indexOf(field) != -1){
    				      disabled = true;
    				  }
				  }
				  
				  if(fld.get("disabled") && !disabled){
				  	if(!disableKeyFields && controller.keyFields.indexOf(field) != -1){
				  		disabled = false;
				  	}else{
				  		disabled = true;
				  	}
				  }
				  
				  fld.set("disabled", disabled);
				  
				  // Get temp value
				  var value = fld.get("value");
				  var displayedValue = fld.get("displayedValue");
				  // Reset error messages, but will also delete the value
				  if(typeof fld.reset === "function"){
				  	fld.reset();
				  }
				  
				  // Set temp value in original widget
				  if(typeof fld._setValueAttr === "function"){
				  	fld._setValueAttr(value, true, displayedValue);
				  }
				  
				  if(focusFirstDetailField){
					  if(!focusSet && !fld.get("disabled")){
						  fld.focus();
						  focusSet = true;
					  }	  
				  };

			}
		});
	}
		
};

function handleSave(controller, doCommit){
  if (controller.editable === false){
	  doSave(controller, doCommit);
  } else {
	  doEditableSave(controller);
  }
};

function doSave(controller, doCommit){
  removeBackendValidators(controller);

  
	require(["dijit/registry", "dojox/html/entities"], function(registry, entity){	 
		var form = registry.byId(controller.id + "form");
		var valid = form.validate();
		var validationErrors = new Array();
		var	focusField = null;
		var field = "";
    
		for (field in controller.model.getDetailModel()) {
			  field = registry.byId(controller.id + field);
			  if(field != undefined){
				  if(field.isValid != undefined && !field.isValid()){
				  	// Get the label for the field
				  	var label = field.textbox.labels.length > 0 ? field.textbox.labels[0].innerHTML : field.id.replace(controller.id, "");
				  	
					  validationErrors.push(label + " : " + field.message.split("<br")[0]);
					  valid = false;
			   	}
			  }
			}

    	  if (!valid){
    		  if (focusField != null){
	    		  focusField.focus();
	    		  focusField = null;
    		  }
   			  //setPageInformation(LANGUAGE.PAGEINFORMATION_INVALID, COLOR.RED);
   			  showErrorMessageDialog(validationErrors);
	    		setPageInformation(controller.id, LANGUAGE.VALIDATION_FAILED, COLOR.RED);
    	  } else {
    	  	if(doCommit){
      	  	controller.disableAllButtons();
      	  	// use the hook in the function below to dis/enable buttons
      	  	controller.disableButtonsSaveAction();
      	  	
      	  	controller.method = getSaveMethod(controller.model.action);
          	controller.serviceCall();
    	  	} else {
    	  		// show validation succeeded
  	    		setPageInformation(controller.id, LANGUAGE.VALIDATION_SUCCEEDED, COLOR.BLACK);
    	  	}
    	  }
		
	});
};

function getSaveMethod(action){
	if(action == CONFIG.UPDATE){
		return CONFIG.UPDATE_RECORD;
	}
	
	if(action == CONFIG.CREATE){
		return CONFIG.CREATE_RECORD;
	}
	return undefined;
}

function handleDelete(listController, detailController) {
	if(detailController === undefined){
		handleDeleteInGrid(listController, detailController);
	} else if (listController !== undefined && detailController !== undefined) {
		handledeleteInDetail(listController, detailController);
	}
}

//function handledeleteInDetail(listController, detailController){
function handledeleteInDetail(detailController){
	require(["dojo/dom", "dojo/_base/lang", "cefetraWidgets/ConfirmDialog" ], function(dom, lang, ConfirmDialog) {
				new ConfirmDialog({
					message: LANGUAGE.DELETE_CONFIRMATION_MESSAGE_DETAIL,
					onExecute: function(){
						detailController.disableAllButtons();
				  	// use the hook in the function below to dis/enable buttons
				  	detailController.disableButtonsDeleteAction();
				  	
						detailController.method = CONFIG.DELETE_RECORD;
						detailController.serviceCall();
						doNew(detailController);
					},
				}).show();
	});
}

function handleDeleteInGrid(listController, detailController){
	require([ "dojo/on", "dojo/dom", "dijit/registry", "dojo/_base/lang", "cefetraWidgets/ConfirmDialog" ], function(on, dom, registry, lang, ConfirmDialog) {
		var click = on(registry.byId("deleteButton"), "click", function() {
			if (registry.byId('mainTabContainer').selectedChildWidget.id == listController.record.tab) {
				new ConfirmDialog({
					message: LANGUAGE.DELETE_CONFIRMATION_MESSAGE,
					onBlur: function(){
						this.destroyRecursive();
					},
					onExecute: function(){
						var grid = null;
						getDijitWidgetById(listController.view.listId, function(widget){
							grid = widget;
							var items 		= grid.selection.getSelected();
							items = clone(items);
							if (items.length === 0){
								setPageInformation(LANGUAGE.SELECT_AT_LEAST_1_ROW, COLOR.RED);
								return;
							}
								
							for (var i = 0; i < items.length; i++){
									if(items[i] == null){
										items.splice(i, 1);
										i--;
										continue;
									}
									
									if (items[i]._0 != undefined){
										var row = clone(items[i]._0);
									}
									delete items[i]._0;
									delete items[i]._RI;
									delete items[i]._S;
									if (items[i].detail_action_code[0] != CONFIG.CREATE){
										items[i].detail_action_code[0] = CONFIG.DELETE;
									}
									
									for (var prop in items[i]){
										items[i][prop] = items[i][prop][0];
										if (prop === "detail_refresh_join"){
											items[i][prop] = row;	
										}
									
										if(prop === "detail_action_code"){
											if(items[i][prop] === CONFIG.CREATE){
												items.splice(i, 1);
												i--;
												break;
											}
										}
									}
								}
								
								if(items.length > 0){
									listController.callUpdateEditableGridWS(CONFIG.UPDATE_EDITABLE_LIST, items);
								}
								items = null;
								row = null;
							grid.removeSelectedRows();
						});
					}
				}).show();
			}
		});
		_connections.push({
			"tab" : listController.record.tab,
			con : click
		});
	});
}

function serviceCallbackError (data) {
	setPageInformation(LANGUAGE.RECORD_SOMETHING_WENT_WRONG, COLOR.RED);
};

function handleSaveSettings(data){
	require(["dojo/on", "dijit/registry"], function(on, registry){
		  var click = on(registry.byId("saveSettingsButton"), "click",  function(){
				  saveSettingsInDatabase(data.getSettings());
		   });
		  var tab = data.hasOwnProperty('record') ? data.record.tab : data.tab;
		  _connections.push({"tab" : tab, con: click});
	});
}


function getSettings(){
    var model = [window.models.getusername(), window.models.getProgramReturnRec()];
    callWebservice("isettingsservice", "getSettings", model, "SettingsService", window, "getSettingsCallback");
};

function getSettingsCallback( settings ){
	window.models.setSettings(settings.result);
    decodeObject(window.models.getSettings());
	buildFavorites();
};

function getFavoriteSettings(){
	var favorites = "";
	require(["dijit/registry", "dojo/_base/array"], function(registry, array){
		array.forEach(document.getElementById("favoriteMenuitems").children, function(item, i){
			favorites = favorites + item.id + ";";
		});
	});
	
	var setting = {	
			key: "favorites", 
			value: JSON.stringify(favorites),
	};
	return setting;
};

function setDefaultSearchCriteria(controller){
	var newSearchRecord = controller.model.getNewKeyBegin();
	setModel(newSearchRecord, controller, "search");
}

function getColumnSetting(id){
	return eval(window.models.getSetting(id));
}

function getGridSettings(columns, id){
    if(columns == "" || id == "unknown"){
    	return columns;
    }
	if( Array.isArray(columns[0]) ) {
		var columns = columns[0];
	}
    
    var settingsColumnObj = getColumnSetting(id);
    
    if(settingsColumnObj === undefined){
    	return columns;
    }
    
    var sortedColumns = new Array();
    var unFoundColumns = new Array();
    
	for (var i = 0; i < settingsColumnObj.length; i++) {
		  for (var j = 0; j < columns.length; j++) {
				if(settingsColumnObj[i].field == columns[j].field){
					for (var key in settingsColumnObj[i]) {
						columns[j][key] = settingsColumnObj[i][key];
					}
					sortedColumns.push(columns[j]);
					break;
				}
				
				if(j == columns.length-1){
					unFoundColumns.push(columns[j]);
					break;
				}
		  }
	  }
	  
	return sortedColumns.concat(unFoundColumns);

};

function setEditableCellAttributes(item, row, cell){
	if(cell.grid.canEdit(cell, row) && cell.hasOwnProperty('editable')){
		cell.customClasses.push("editableCell");
	}	
}

function doSearch(controller){
	commit(controller);
	
	controller.method = CONFIG.GET_LIST_DATA;
	controller.serviceCall();
}

function doReset(controller){
	controller.model.setPageNumber(1);
	controller.model.KEY_BEGIN = controller.model.getNewKeyBegin();
	publish(controller);
}

function doEditableSave(controller){
	commit(controller);
	
	controller.method = CONFIG.UPDATE_EDITABLE_LIST;
	controller.serviceCall();
	
	if(controller.progressIndicator){
	  	window["progress"] = controller.id;
	  	controller.getProgress();
	}
}

function addToFavoritesAndSave(menuItem){
	if(menuItem != undefined){
		addToFavorites(menuItem);
	}
	
    callWebservice("isettingsservice", "saveSettings", [[getFavoriteSettings()], window.models.getProgramReturnRec()], "SettingsService", window, "saveFavoritesCallback");
}

function doProgress(controller){
	commit(controller);
	
	controller.method = CONFIG.GET_PROGRESS;
	controller.serviceCall();
}

function saveFavoritesCallback(){
	// TO IMPLEMENT IF NECESSARY
};

function addToFavorites(menuItem){
	require(["dijit/registry", "cefetraWidgets/CustomMenuItem",  "dojo/on"], function(registry, CustomMenuItem, on){
		if(registry.byId("favorite_" + menuItem.id) != undefined){
			return;
		}
		
		new custom.CustomMenuItem({
			title: menuItem.title + "<div style='float:left; margin-top: 2px;' class='dijitEditorIcon dijitEditorIconDelete iconHover' id=close_favorite_" + menuItem.id + " onClick='deleteFavoriteItem(this);'></div>",
			open : false,
			id	 : "favorite_" + menuItem.id,
			toggleable : false,
			enableHover: true,
			style : {"cursor" : "pointer !important"}
		}).placeAt("favoriteMenuitems");
		
		on(registry.byId("favorite_" + menuItem.id), "click", function(){
			on.emit(menuItem.domNode, 'click', {});
		});
	});
}

function deleteFavoriteItem(element){
	window.event.stopPropagation();
	window.event.preventDefault();
	
	require(["dijit/registry"], function(registry){
		registry.byId(element.id.replace("close_","")).destroy();
	});
	
	addToFavoritesAndSave();
}

function addFavoritesMenuItem(menuItemName){
	require(["dijit/registry", "dijit/Menu", "dijit/MenuItem"], function(registry, Menu, MenuItem){
	    var pMenu;
	    pMenu = new Menu({
	        targetNodeIds: [menuItemName]
	    });
	    pMenu.addChild(new MenuItem({
	        label: LANGUAGE.ADD_TO_FAVORITES,
	        onClick: function(){addToFavoritesAndSave(registry.byId(menuItemName));}
	    }));
	   pMenu.startup();	
	});
}

function buildFavorites(){
	if(window.models.getSetting("favorites") != undefined){
		require(["dojo/_base/array", "dijit/registry"], function(array, registry){
			 array.forEach(window.models.getSetting("favorites").split(";"), function(item, i){
				 item = item.replace("\"","");
				 item = item.replace("favorite_","");
				 if(registry.byId(item) != undefined){
					 addToFavorites(registry.byId(item));
				 }
			  });
		});
	}
}

function openScreen(screenId, data, controller, selection, allowMultipleSelections){
	if(!allowMultipleSelections && selection.length != 1){
		setPageInformation(LANGUAGE.SELECT_ONLY_ONE_ROW, COLOR.RED);
		return;
	}
	
	if(allowMultipleSelections && selection.length < 1){
		setPageInformation(LANGUAGE.SELECT_AT_LEAST_1_ROW, COLOR.RED);
		return;
	}
	
	
	getDojoWidgetById(screenId, function(target){
		require(["dojo/on"], function(on){
		    var con = on.emit(target, "click", {
		        bubbles: true,
		        cancelable: true,
		        data: data,
		    });
		});
	});
}

function subscribeEvents(subscription, controller){
	subscribe(subscription, controller);
}

function mapRadioButtonsToEvent(radioButtons, event, scope){
	for (var i = 0; i < radioButtons.length; i++) { 
		var buttonId = radioButtons[i];
		var radioButton = null;
		
		getDijitWidgetById(buttonId, function(field){
			radioButton = field;
		});	
		
		require(["dojo/on"], function(on){
			on(radioButton, "change", function(e){
				if(this.checked){
					scope[event](this.value, scope);
				}
			});
		});
	}
}

function setClickAction(id, scope, action){
	require(["dijit/registry", "dojo/on", "dojo/_base/lang"], function(registry, on, lang){
		var click = on(registry.byId(id), "click", lang.hitch(scope, action));
		_connections.push({"tab" : id.split('.')[0], con: click});
	});
}

function setDetailUserSettings(controller){
	var entitySettings = models.getSettingsForEntity(controller.entity);

	var registry = null;
	require(["dijit/registry"], function(_registry){
		registry = _registry;
	});
	
	for (var prop in controller.model.getDetailModel()) {
		var field = registry.byId(controller.id + prop);
		var val = entitySettings[controller.entity + "." + prop];

		if(field != undefined && val != undefined){
				field.set("value", val.value);
		}
	}
}

function copyAction(controller){
	var model = clone(controller.model.DETAIL);
	controller.newAction();
	controller.model.DETAIL = model;
	controller.model.DETAIL.lastupdatedby = "";
	controller.model.DETAIL.lastupdate = "";
	publish(controller);
}