/**
 * CREATED BY NVD ON 2015/04/22 09:12:36 @ v 3.0
 *
 * Package    : core/widgets
 */
define([
    "dojo/_base/declare",
    "dijit/registry",
    "dojo/dom",
    "dojo/query",
    "dojo/_base/lang",
    "dijit/focus",
    "dijit/_FocusMixin",
    "dojo/on",
    "/libraries/validation.js"
], function(declare, registry, dom, query, lang, focusUtil, _FocusMixin, on) {
    return declare("custom.ListController", [_FocusMixin], {
        widgetsInTemplate: true,
    	  i18n: LANGUAGE,
    	  constraint: VALIDATION,
    	  method: CONFIG.GET_LIST_DATA,
    	  lookup: false,
    	  variableAction: 'saveSettingsAction',
    	  variableLabel: LANGUAGE.SAVE_SETTINGS,
    	  gridId: "grid",
    	  totalCombosRetrieved:0,
    	  unloadedCombos: 0,
    	  combosLoadedAction: undefined,
    	  lastFocusedElement: null,
    	  focusHandler: null,
    	  countWebcalls: 0,
    	  searchOnStartup: true,
    	  loadOnScroll: true,
    	  // enable all buttons in callback?
    	  enableButtons: true,
    	  // disable all buttons before servicecall?
    	  disableButtons: true,
    	  // Show the search criteria
    	  showSearchCriteria: true,
    	  //show the grid's menu
    	  showMenu:true,
    	  //show the action bar
    	  showActionBar:true,
    	  //padding for the container
    	  containerPadding: 70,
    	  //Publish progress?
    	  progressIndicator: false,
    	  progressIntervalId: null,
    	  stopInterval: false,
    	  // Update procedures only inherit the fields, but it's possible to apply the searchrecord for addiontal handling information
    	  getServiceModelForUpdate: false,
    	  
    	  postMixInProperties: function(){
    	  	this.inherited(arguments);
    	  	if (this.lookup){
    	  		this.variableAction = 'selectAction';
    	  		this.variableLabel = LANGUAGE.SELECT;
    	  	}
    	  },
    	  
    	  resize: function(){
    	  	var children = this.getChildren();
    	  	for (var i = 0; i < children.length; i++){
    	  		if (children[i].resize){
    	  			if (~children[i].id.indexOf('constraintFloatingPane')){
    	  				children[i].resize(arguments[0]);
    	  			} else{
    	  				children[i].resize();
    	  			}
    	  		}
    	  	}
    	  	this.inherited(arguments);
    	  },
    	  

    	  getProgress: function(){
    		  this.progressIntervalId = window.setInterval(function(){
    	   		getDijitWidgetById(window["progress"], function(controller){
    	   			if(controller.stopInterval){
    	   				window.clearInterval(this.progressIntervalId);
    	   			} else {
    	   				controller.progressAction();
    	   			}
    	   		});
    	    	}, 10000);
    	  },
    	  
    	  postCreate: function(){
    		updateEditableGrid(this);
    	  },
    	  
    	  startup: function(){
    	  	this.inherited(arguments);
    	  	
    	  	setListSettings(this);
    	  	
    	  	if (this.lookup){
    	  		this.setValuesForLookup();
    	  	} else {
	  			this.setValuesForList();

    	  		if(this.searchOnStartup){
    	  			this.searchAction();
    	  		}
    	  	}
    	  	
    	  	var id = this.id;
    	  	if(!this.showSearchCriteria){
				getDijitWidgetById(this.id + "searchcriteria", function(widget){
					if(widget === undefined){
						console.warn("searchcriteria is set to hidden but no item had been found: " + id + "searchcriteria");
					} else{
						widget.domNode.style.display = "none";
					}
				});
    	  	}
    	  	
    	  	if(!this.showMenu){
				getDijitWidgetById(this.id + "grid", function(widget){
					if(widget === undefined){
						console.warn("Menu is set to hidden but no item had been found: " + id + "grid");
					} else{
						widget.docontextmenu = function(){};
						widget.dodblclick = function(){};
					}
				});
			}
    	  	
    	  	if(!this.showActionBar){
				getDijitWidgetById(this.id + "ListActionBar", function(widget){
					if(widget === undefined){
						console.warn("Actionbar is not found for widget");
					} else{
						widget.domNode.style.display = "none";
					}
				});
    	  	}
    	  	
    	  	this.focusFirstElement();
    	  	
    	  	if(CONFIG.DEBUG){
    	  		console.log(this.entity); // TODO DELETE : DEBUG PURPOSES
    	  	}
    	  	
    	  	if(typeof this.postStartupHook == "function"){
    	  		this.postStartupHook();
    	  	}
    	  },
    	  
    	  _onFocus: function(){
    	  	var self = this;
    	  	if (!this.focusHandler){
	    	  	this.own(
	    	  			self.focusHandler = focusUtil.watch("curNode", function(name, oldValue, newValue){
	    	  				var temp = registry.getEnclosingWidget(newValue);
	    	  				if (!temp){
	    	  					return;
	    	  				}
	    	  				var widget = registry.getEnclosingWidget(newValue).hasOwnProperty('grid') ? registry.getEnclosingWidget(newValue).grid : registry.getEnclosingWidget(newValue);
	    	  				if (widget.id.indexOf(self.id) > -1){
	    	  					if (newValue !== null){
		    	  					self.lastFocusedElement = newValue;
	    	  					}
	    	  				}
	    	  			})
	    	  	);
    	  	}
    	  	this.inherited(arguments);
    	  },
    	  
    	  setFocusLastFocusedWidget: function(){
    	  	try{
    	  		this.lastFocusedElement.focus();
    	  	} catch(ex){
    	  		console.log("ListController | Something went wrong while setting the focus: ", ex.toString());
    	  	}
    	  },
    	  
    	  focusFirstElement: function(){
    	  	var nodes = query("tr > td [widgetid]", this.id);
    	  	
    	  	for (var i = 0; i < nodes.length; i++){
    	  		var node = nodes[i];
    	  		if (node === null || typeof node.id === "undefined"){
    	  			continue;
    	  		}
    	  		var widget = registry.byId(node.id.replace("widget_", ""));
    	  		if (typeof widget !== "undefined" && widget !== null){
    	  			if (widget.get('disabled') !== true){
    	  				widget.focus();
    	  				break;
    	  			}
    	  		}
    	  	}
    	  },
    	  
    	  openNewDetail: function(){
    	  	console.log("Did you forgot to implement an 'openNewDetail' function in your list controller?");
    	  },
    	  
    	  serviceCall: function(){
    	  	if (this.countWebcalls == 0){
    	  		this.setLoader("visible");
    	  	}
    	  	this.countWebcalls++;
    	  	
    	  	// Get the correct model / callback
    	  	var model = this.model.getServiceModel();; 
    	  	var callback = "callback";
    	  	
    	  	if(this.method == CONFIG.UPDATE_EDITABLE_LIST){
    	  		model = this.model.getServiceModelForUpdate(this.getSelectedRows(), this.useSearchRecordInUpdateProcedure);  	  
    	  		callback = "callbackUpdatable";
    	  	}
    	  	
    	  	if(this.method == CONFIG.GET_PROGRESS){
    	  		model = this.model.getServiceModelForProgress();
    	  		callback = "callbackProgress";
    	  	}
    	  	
    	  	callWebservice("", this.method, model, this.entity + "Service", this, callback);
    	  },
    	  
    	  getSelectedRows: function(){
    	  	var grid = null;
    	  	getDijitWidgetById(this.id + this.gridId, function(widget){
    	  		grid = widget;
    	  	});
    	  	
    	  	if(grid.plugins.indirectSelection){
    	  		return getSelectedRows(this.id + this.gridId);
    	  	}
    	  	
  	  		return null;
    	  },
    	  
    	  setLoader: function(state){
    	  	var id = this.id + 'loader';
    	  	if (document.getElementById(id) !== null){
    	  		document.getElementById(id).style.visibility = state;
    	  	}
    	  },
    	  
    	  callback: function(callbackData){
    	  	// check whether the widget is destroyed, if the widget is destroyed cancel every operation
    	  	if (this._destroyed){
    	  		console.debug("Widget '" + this.entity + "' closed before callback");
    	  		return;
    	  	}
    	  	// hide loader when there is no remaining servicecall
    	  	this.countWebcalls--;
    	  	if (this.countWebcalls == 0){
    	  		this.setLoader("hidden");
    	  	}
    	  	
    	  	this.model.setListModel(callbackData.result);
    	    setGrid(this.id + this.gridId, this);
    	    
    	    
    	    if(typeof this.postCallbackHook !== "undefined"){
    	    	this.postCallbackHook(callbackData);
    	    }
    	    
    	    // resize grid when available. This is needed for window resizing
//    	    if(registry.byId(this.id+this.gridId)){
//    	    	registry.byId(this.id+this.gridId).resize();
//    	    }
    	  },
    	  
    	  callbackUpdatable: function(callbackData){
    	  	updateListCallback(this, callbackData);
    	    setGrid(this.id + this.gridId, this);
  	  		this.setLoader("hidden");
    	  },
    	  
    	  callbackProgress: function(callbackData){
    		  var items = callbackData.result.split("/");
    		  if(items[0] === items[1]){
    			  this.stopInterval = true;
    		  }
    		  
    		  // publish to screen
  	    	  setPageInformation(this.id, LANGUAGE.PROGRESS + ": " + callbackData.result, COLOR.BLACK);
    	  },
    	  
    	  searchAction: function(){
    	  	this.disableAllButtons();
    		  if(this.isCombosLoaded()){
    	    	  doSearch(this);
    		  } else {
    			  this.combosLoadedAction = this.searchAction;
    		  }
    	  },
    	  
    	  saveAction: function(){
    	  	this.disableAllButtons();
    	  	doEditableSave(this);
    	  	
    	  	if(typeof this.postSaveAction == "function"){
    	  		this.postSaveAction();
    	  	}
    	  },
    	  
    	  progressAction: function(){
			commit(this);
			
			this.method = CONFIG.GET_PROGRESS;
			this.serviceCall();
    	  },
    	  
    	  handleKeys: function(e){
    	  	var character = String.fromCharCode(e.keyCode).toLowerCase();
    	  	if (!e.altKey){
    	  		return;
    	  	}
    	  	
    	  	switch (character){
	    	  	case 'a':this.searchAction(); break;
	    	  	case 't':this.resetAction();break;
	    	  	case 'v':this.saveSettingsAction();break;
	    	  	case 'c':this.selectAction();break;
	    	  	case 'k':this.focusGrid();break;
    	  	};
    	  	
    	  	e.stopPropagation();
    	  	e.preventDefault();
    	  },
    	  
    	  focusGrid: function(){
    	  	var grid = registry.byId(this.id+this.gridId);
    	  	if (grid.rowCount > 0){
    	  		grid.selection.setSelected(0, true);
    	  		grid.focus.setFocusIndex( 0, 0 );
    	  	}
    	  },
    	  
    	  isCombosLoaded: function(){
    		  if(this.unloadedCombos == undefined || this.unloadedCombos == 0){
    			  return true;
    		  }
			  return false;
    	  },
    	  
    	  addUnloadedCombo: function(){
    	  	this.totalCombosRetrieved++;
    	  	this.unloadedCombos++;
    	  	setPageInformation(this.id, LANGUAGEFUNCTIONS.genericMessage(LANGUAGE.NUMBER_OF_UNLOADED_COMBOS, [(this.totalCombosRetrieved - this.unloadedCombos), this.totalCombosRetrieved]), COLOR.BLACK);
    	  },
    	  
    	  // Executes when a combobox is loaded for this controller
    	  comboLoaded: function(){
    	  	setPageInformation(this.id, LANGUAGEFUNCTIONS.genericMessage(LANGUAGE.NUMBER_OF_UNLOADED_COMBOS, [(this.totalCombosRetrieved - this.unloadedCombos) + 1, this.totalCombosRetrieved]), COLOR.BLACK);
    		  this.unloadedCombos--;
    		  if(this.combosLoadedAction != undefined ||  this.unloadedCombos == 0){
    			  this.combosLoadedAction(this);
    		  }
    	  },
    	  
    	  handleDoubleClick: function(e){
    	  	console.warn("Implement handleDoubleClick in your controller");
    	  },
    	  
    	  resetAction: function(){
    	  	this.disableAllButtons();
    	  	doReset(this);
    	  	this.searchAction();
    	  },
    	  
    	  selectAction: function(){
    	  	if (typeof this.fields !== "undefined" && this.fields.length > 0){
    	  		var grid = registry.byId(this.id + this.gridId);
	    	  	for (var prop in this.fields){
	    	  		var obj = this.fields[prop];
	    	  		var column = obj.column || obj.source; 
	    	  		// set the lookup values
	    	  		if(obj.source != undefined){
	    	  			registry.byId(this.mainControllerId + obj.source).set('value', getSelectedGridRow(grid, column));
	    	  		}
	    	  		if(obj.displayColumn != undefined){
	    	  			registry.byId(this.mainControllerId + obj.source).set('displayValue', getSelectedGridRow(grid, obj.displayColumn));
	    	  		}
	  	  		}
    	  	}
  	  		registry.byId(this.dialogId).destroyRecursive();
    	  },
    	  
    	  // Lookup will search for defined fields
    	  setValuesForLookup: function(){
    	  	if (typeof this.fields !== "undefined" && this.fields.length > 0){
	    	  	for (var prop in this.fields){
	    	  		var obj = this.fields[prop];
	    	  		if (obj.target != null){
	    	  			if(obj.source != null){
	    	  				// map a field from the model
	    	  				registry.byId(this.id + obj.target).set('value', registry.byId(this.mainControllerId + obj.source).get('value'));
	    	  			}
	    	  			if(obj.value != null){
	    	  				// set a default value
	    	  				var toField = registry.byId(this.id + obj.target);
	    	  				if(toField.declaredClass === "custom.ComboBox" || toField.declaredClass === "custom.FilteringSelect"){
	    	  					toField.set("item", toField.store.get(obj.value));
	    	  				} else {
	    	  					toField.set("value", obj.value);
	    	  				}
	    	  			}
	    	  		}
	  	  		}
	    	  	this.searchAction();
    	  	}
    	  },
    	  
    	  // From list > detail will set all fields by default
    	  setValuesForList: function(){
      			if(this.values != null){
      				 for (var prop in this.values){
      	    	  		this.model.KEY_BEGIN[prop] = this.values[prop];
      	  	  		}				
      			}
      			
      			publish(this);
    	  },

    	  saveSettingsAction: function(){
    	  		if(document.getElementById(this.id + 'loader') != null){
    	  			document.getElementById(this.id + 'loader').style.visibility = "visible";
    	  		}
      	  	this.disableAllButtons();
      	  	saveListSettings(this);
    	  },
    	  
    	  saveSettingsCallback : function(){
    	  	window.models.saveSuccessfull();
    	  	if(document.getElementById(this.id + 'loader') != null){
    	  		document.getElementById(this.id + 'loader').style.visibility = "hidden";
    	  	}
    	  },
    	  
    	  showPopup: function(properties){
    	  	// Check if screen is lookup, when it's a lookup alter the dock
				  if(!properties.controller["lookup"] && (properties.screenId in properties.controller.dock.openPopups)){
					  refreshPopup(properties);
				  }else{
					  openPopup(properties);
				  }  
    	  },
    	  
    	  disableAllButtons: function(){
    	  	this.setSearchButton(true);
    	  	this.setResetButton(true);
    	  	this.setVariableButton(true);
    	  	this.setNewButton(true);
    	  },
    	  
    	  enableAllButtons: function(){
    	  	this.setSearchButton(false);
    	  	this.setResetButton(false);
    	  	this.setVariableButton(false);
    	  	this.setNewButton(false);
    	  },
    	  
    	  setSearchButton: function(isDisabled){
    	  	if (dom.byId(this.id+'searchButton')){
    	  		dom.byId(this.id+'searchButton').disabled = isDisabled;
    	  	}
    	  },
    	  
    	  setResetButton: function(isDisabled){
    	  	if (dom.byId(this.id+'resetButton')){
    	  		dom.byId(this.id+'resetButton').disabled = isDisabled;
    	  	}
    	  },
    	  
    	  setVariableButton: function(isDisabled){
    	  	if (dom.byId(this.id+'variableButton')){
    	  		dom.byId(this.id+'variableButton').disabled = isDisabled;
    	  	}
    	  },
    	  
    	  setNewButton: function(isDisabled){
    	  	if (dom.byId(this.id+'newButton')){
    	  		dom.byId(this.id+'newButton').disabled = isDisabled;
    	  	}
    	  },
    	  
    	  uninitialize: function(){    		
    	  	this.inherited(arguments);
    	  	this.model = null;
    	  	this.lastFocusedElement = null;
    	  	this.focusHandler = null;
    	  	delete this.model;
    	  	for (var con in this._connections){
    	  		if (typeof this._connections[con] !== "undefined" && typeof this._connections[con].remove === "function"){
    	  			this._connections[con].remove();
    	  		}
    	  	}
    	  	if(this._childWidgets !== undefined){
      	  	for (var child in this._childWidgets){
      	  		child.destoryRecursive();
      	  	}
      	  	delete this._childWidgets;
    	  	}
    	  },
    	  
    	  exportCSV: function(){
    	  	createCSV(this);
    	  },
    	  
    	  addLine: function(e){
    		  var newLine = this.model.getListItem();
    		  newLine.detail_action_code = CONFIG.CREATE;
    		  
    		  if(this.onAddLine != undefined){
    			  newLine = this.onAddLine(newLine);
    		  }
    		  
    		  this.model.LIST.detail_data.push(newLine);

    		  publish(this);
    	  },
    	  
    	  deleteLine: function(e){
    		  var grid = null;
    		  
    		  getDijitWidgetById(this.id + "grid", function(widget){
    			grid = widget;  
    		  });
    		  
    		  var items = grid.selection.getSelected();
    		  for (var i = 0; i < items.length; i++) { 
    			  // element in store
    			  if(items[i] !== null){
    				  
    				  if(items[i].detail_action_code != CONFIG.CREATE){
    					  // new items that are getting deleted (non-existing entities on backend) 
    					  //  shouldn't get passed to backend procedure
    					  items[i].detail_action_code = CONFIG.DELETE;
    				  	  this.model.DELETED_ITEMS.push(unBox(cloneObject(items[i])));
    				  }
    				  
    				  // find equal element in model
    				  for (var j = 0; j < this.model.LIST.detail_data.length; j++) { 
    	    			  var model_element = JSON.stringify(unBox(this.model.LIST.detail_data[j]));
    	    			  var store_element = JSON.stringify(unBox(items[i]));
    	    			  
    	    			  if(model_element == store_element){
    	    				  // delete element in model
    	    				  this.model.LIST.detail_data.splice(j,1);
    	    			  }
    	    		  }
	               } 
    		  }
    		  
    		  publish(this);
    	  }
    });
});