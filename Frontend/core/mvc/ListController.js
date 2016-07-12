/**
 * CREATED BY NVD ON 2015/04/22 09:12:36 @ v 3.0
 * 
 * Package : core/widgets
 */
define([ "dojo/_base/declare", "dijit/registry", "dojo/dom", "dojo/query", "dojo/_base/lang", "dijit/focus", "dijit/_FocusMixin", "dojo/on", "/libraries/validation.js" ], function(declare, registry, dom, query, lang, focusUtil, _FocusMixin, on) {
	return declare("custom.ListController", [ _FocusMixin ], {
		widgetsInTemplate : true,
		i18n : LANGUAGE,
		constraint : VALIDATION,
		method : CONFIG.GET_LIST_DATA,
		lookup : false,
		variableAction : 'saveSettingsAction',
		variableLabel : LANGUAGE.SAVE_SETTINGS,
		gridId : "grid",
		totalCombosRetrieved : 0,
		unloadedCombos : 0,
		combosLoadedAction : undefined,
		lastFocusedElement : null,
		focusHandler : null,
		countWebcalls : 0,
		searchOnStartup : true,
		loadOnScroll : true,
		// enable all buttons in callback?
		enableButtons : true,
		// disable all buttons before servicecall?
		disableButtons : true,
		// Show the search criteria
		showSearchCriteria : true,
		// show the grid's menu
		showMenu : true,
		// show the action bar
		showActionBar : true,
		// padding for the container
		containerPadding : 70,
		// Publish progress?
		progressIndicator : false,
		progressIntervalId : null,
		stopInterval : false,
		// custom startup function
		customStartup : false,
		// Update procedures only inherit the fields, but it's possible to apply the
		// searchrecord for addiontal handling information
		getServiceModelForUpdate : false,
		// Use this list as CSV upload module
		isCSV : false,
		// Default name for searchcriteria
		searchCriteria : "searchcriteria",
		// Default name for list action bar
		listActionBar : "ListActionBar",
		// Check whether the source is a cell(editable grid)
		cell : false,
		// Select action callback for lookups
		selectCallback: undefined,
		// ignore service result
		ignoreServiceResult: false,
		// Custom callblack
		customCallback: undefined,
	    // hide 'no data found' errors when entity references other entity
	    hideNoDataFoundErrors:false,

		postMixInProperties : function() {
			renderTemplate(this);

			this.inherited(arguments);
			if (this.lookup) {
				this.variableAction = 'selectAction';
				this.variableLabel = LANGUAGE.SELECT;
			}
		},

		resize : function() {
			var children = this.getChildren();
			for (var i = 0; i < children.length; i++) {
				if (children[i].resize) {
					if (~children[i].id.indexOf('constraintFloatingPane')) {
						children[i].resize(arguments[0]);
					} else {
						children[i].resize();
					}
				}
			}
			this.inherited(arguments);
		},

		getProgress : function() {
			this.progressIntervalId = window.setInterval(function() {
				getDijitWidgetById(window["progress"], function(controller) {
					if (controller.stopInterval) {
						window.clearInterval(this.progressIntervalId);
					} else {
						controller.progressAction();
					}
				});
			}, 10000);
		},

		postCreate : function() {
			updateEditableGrid(this);
		},

		startup : function() {
			this.inherited(arguments);
			
			if (this.searchOnStartup){
				this.setLoader("visible");
			}
			
			// implement your custom startup function in your controller
			if (this.customStartup) {
				return;
			}
			
			// set default list settings
			setListSettings(this);
			
			// check if widget is a lookup
			if (this.lookup) {
				this.setValuesForLookup();
				this.setValuesForList();
				this.searchAction();
			} else {
				this.setValuesForList();
				if (this.searchOnStartup) {
					this.searchAction();
				}
			}

			if (!this.showSearchCriteria) {
				this.hideSearchCriteria();
			}

			if (!this.showActionBar) {
				this.hideListActionBar();
			}

			this.focusFirstElement();

			if (CONFIG.DEBUG) {
				console.log(this.entity); // TODO DELETE : DEBUG PURPOSES
			}

			if (typeof this.postStartupHook == "function") {
				this.postStartupHook();
			}
		},

		hideSearchCriteria : function() {
			var widget = registry.byId(this.id + this.searchCriteria);
			if (!widget) {
				console.warn("searchcriteria is set to hidden but no item had been found: " + this.id + this.searchCriteria);
			} else {
				widget.domNode.style.display = "none";
			}
		},

		hideListActionBar : function() {
			var widget = registry.byId(this.id + this.listActionBar);
			if (!widget) {
				console.warn("Actionbar widget is not found, id: " + this.id + this.listActionBar);
			} else {
				widget.domNode.style.display = "none";
			}
		},

		_onFocus : function() {
			var self = this;
			if (!this.focusHandler) {
				this.own(self.focusHandler = focusUtil.watch("curNode", function(name, oldValue, newValue) {
					var temp = registry.getEnclosingWidget(newValue);
					if (!temp) {
						return;
					}
					var widget = registry.getEnclosingWidget(newValue).hasOwnProperty('grid') ? registry.getEnclosingWidget(newValue).grid : registry.getEnclosingWidget(newValue);
					if (widget.id.indexOf(self.id) > -1) {
						if (newValue !== null) {
							self.lastFocusedElement = newValue;
						}
					}
				}));
			}
			this.inherited(arguments);
		},

		setFocusLastFocusedWidget : function() {
			try {
				this.lastFocusedElement.focus();
			} catch (ex) {
				console.log("ListController | Something went wrong while setting the focus: ", ex.toString());
			}
		},

		focusFirstElement : function() {
			var nodes = query("tr > td [widgetid]", this.id);

			for (var i = 0; i < nodes.length; i++) {
				var node = nodes[i];
				if (node === null || typeof node.id === "undefined") {
					continue;
				}
				var widget = registry.byId(node.id.replace("widget_", ""));
				if (typeof widget !== "undefined" && widget !== null) {
					if (widget.get('disabled') !== true) {
						widget.focus();
						break;
					}
				}
			}
		},

		openNewDetail : function() {
			console.log("Did you forgot to implement an 'openNewDetail' function in your list controller?");
		},

		serviceCall : function(items) {
			if (this.countWebcalls == 0) {
				this.setLoader("visible");
			}
			this.countWebcalls++;

			// Get the correct model / callback
			var model = this.model.getServiceModel(items);
			
			var callback = "callback";

			if (this.method == CONFIG.UPDATE_EDITABLE_LIST) {
				model = this.model.getServiceModelForUpdate(this.getSelectedRows(), this.useSearchRecordInUpdateProcedure);
				callback = "callbackUpdatable";
			}

			if (this.method == CONFIG.GET_PROGRESS) {
				model = this.model.getServiceModelForProgress();
				callback = "callbackProgress";
			}
			
			if (this.method == CONFIG.CUSTOM_ACTION && this.customCallback != undefined) {
				callback = "customCallbackIntermediate";
			}
			
			if(model[4] != undefined && model[4].detail_data != undefined && items != undefined){
				model[4].detail_data = items;
			}
			
			callWebservice("", this.method, model, this.entity + "Service", this, callback);
		},

		customCallbackIntermediate : function(callbackData){
			this.ignoreServiceResult = false;
			this.setLoader("hidden");
			
			this.customCallback(callbackData);
			this.customCallback = undefined;
		},
		
		getSelectedRows : function() {
			var grid = null;
			getDijitWidgetById(this.id + this.gridId, function(widget) {
				grid = widget;
			});

			if (grid.plugins.indirectSelection) {
				return getSelectedRows(this.id + this.gridId);
			}
			
			var selections = cloneObject(grid.selection.getSelected());
			var result = new Array();
			for (var prop in selections) { 
			    var element = unBox(selections[prop] );
			    result.push(element);
			}
			
			return result;
		},
		getSelectedRowsAsReference : function (){
			var grid = null;
			getDijitWidgetById(this.id + this.gridId, function(widget) {
				grid = widget;
			});

			if (grid.plugins.indirectSelection) {
				return getSelectedRows(this.id + this.gridId);
			}
			
			return grid.selection.getSelected();
		},
		setLoader : function(state) {
			var id = this.id + 'loader';
			if (document.getElementById(id) !== null) {
				document.getElementById(id).style.visibility = state;
			}
		},

		callback : function(callbackData) {
			// check whether the widget is destroyed, if the widget is destroyed
			// cancel every operation
			if (this._destroyed) {
				console.debug("Widget '" + this.entity + "' closed before callback");
				return;
			}
			// hide loader when there is no remaining servicecall
			this.countWebcalls--;
			if (this.countWebcalls == 0) {
				this.setLoader("hidden");
			}
			
			if (callbackData.result == 403){
				return;
			}
			
			if(!this.ignoreServiceResult){
				this.model.setListModel(callbackData.result);
			}
			this.ignoreServiceResult = false;
			
			if(!this.hideNoDataFoundErrors){
				showErrors(callbackData.result[0].errors, this);
			} else {
				// showErrors will apply a publish
				publish(this);
			}

			if (typeof this.postCallbackHook !== "undefined") {
				this.postCallbackHook(callbackData);
			}
		},

		callbackUpdatable : function(callbackData) {
			if(this.ignoreServiceResult){
				this.ignoreServiceResult = false;
			}
			
			updateListCallback(this, callbackData);
			
			// hide loader when there is no remaining servicecall
			this.countWebcalls--;
			if (this.countWebcalls == 0) {
				this.setLoader("hidden");
			}
		},

		callbackProgress : function(callbackData) {
			var items = callbackData.result.split("/");
			if (items[0] === items[1]) {
				this.stopInterval = true;
			}

			// publish to screen
			setPageInformation(this.id, LANGUAGE.PROGRESS + ": " + callbackData.result, COLOR.BLACK);
		},

		searchAction : function() {
			this.disableAllButtons();
			if (this.isCombosLoaded()) {
				doSearch(this);
			} else {
				this.combosLoadedAction = this.searchAction;
			}
			
			removeSelection(this);
		},

		saveAction : function() {
			this.disableAllButtons();
			doEditableSave(this);

			if (typeof this.postSaveAction == "function") {
				this.postSaveAction();
			}
		},

		progressAction : function() {
			commit(this);

			this.method = CONFIG.GET_PROGRESS;
			this.serviceCall();
		},

		handleKeys : function(e) {
			var character = String.fromCharCode(e.keyCode).toLowerCase();
			if (!e.altKey) {
				return;
			}

			switch (character) {
			case 'a':
				this.searchAction();
				break;
			case 't':
				this.resetAction();
				break;
			case 'v':
				this.saveSettingsAction();
				break;
			case 'c':
				this.selectAction();
				break;
			case 'k':
				this.focusGrid();
				break;
			}
			;

			e.stopPropagation();
			e.preventDefault();
		},

		focusGrid : function() {
			var grid = registry.byId(this.id + this.gridId);
			if (grid.rowCount > 0) {
				grid.selection.setSelected(0, true);
				grid.focus.setFocusIndex(0, 0);
			}
		},

		isCombosLoaded : function() {
			if (this.unloadedCombos == undefined || this.unloadedCombos == 0) {
				return true;
			}
			return false;
		},

		addUnloadedCombo : function() {
			this.totalCombosRetrieved++;
			this.unloadedCombos++;
			setPageInformation(this.id, LANGUAGEFUNCTIONS.genericMessage(LANGUAGE.NUMBER_OF_UNLOADED_COMBOS, [ (this.totalCombosRetrieved - this.unloadedCombos), this.totalCombosRetrieved ]), COLOR.BLACK);
		},

		// Executes when a combobox is loaded for this controller
		comboLoaded : function() {
			setPageInformation(this.id, LANGUAGEFUNCTIONS.genericMessage(LANGUAGE.NUMBER_OF_UNLOADED_COMBOS, [ (this.totalCombosRetrieved - this.unloadedCombos) + 1, this.totalCombosRetrieved ]), COLOR.BLACK);
			this.unloadedCombos--;
			if (this.combosLoadedAction != undefined && this.unloadedCombos == 0) {
				this.combosLoadedAction(this);
			}
		},

		handleDoubleClick : function(e) {
			console.warn("Implement handleDoubleClick in your controller");
		},

		resetAction : function() {
			this.disableAllButtons();
			if(this.preResetAction != undefined){
				this.preResetAction();
			}
			doReset(this);
			this.searchAction();
		},

		selectAction : function() {
			if(isFunction(this.selectCallback)){
				this.selectCallback(getSelectedRows(this.id + "grid", false));
			}
			
			if (typeof this.fields !== "undefined" && this.fields.length > 0) {
				var grid = registry.byId(this.id + this.gridId),
				parentController = registry.byId(this.mainControllerId);
				for ( var prop in this.fields) {
					var obj = this.fields[prop];
					var column = obj.column || obj.source,
						  parentControllerField = registry.byId(this.mainControllerId + obj.source);
					if(obj.searchonly){continue;};
					// set the lookup values
					if (obj.source != undefined) {
						// check if the lookup is a cell. when this is the case, get the selected row to set the return value
						if (this.cell){
							var mainController = registry.byId(this.mainControllerId),
							mainControllerGrid = registry.byId(this.mainControllerId + mainController.gridId);
					
							if (mainControllerGrid){
								registry.byId(obj.source).set('value', getSelectedGridRow(grid, column));
								mainControllerGrid.edit.start(mainControllerGrid.focus.cell, mainControllerGrid.focus.rowIndex, true);
							} else {
								console.debug("Grid not found");
							}
						} else {
							parentControllerField.set('value', getSelectedGridRow(grid, column));
						}
					}
					if (obj.displayColumn != undefined) {
						parentControllerField.set('displayValue', getSelectedGridRow(grid, obj.displayColumn));
					}
				}
			}
			
			registry.byId(this.dialogId).destroyRecursive();
		},

		// Lookup will search for defined fields
		setValuesForLookup : function() {
			if (typeof this.fields !== "undefined" && this.fields.length > 0) {
				for ( var prop in this.fields) {
					var obj = this.fields[prop];
					if (obj.target != null) {
						if (obj.source != null) {
							// map a field from the model
							if (this.cell){
								var mainControllerId = this.mainControllerId;
								this.mainControllerId = "";
							}
							registry.byId(this.id + obj.target).set('value', registry.byId(this.mainControllerId + obj.source).get('value'));
							if (this.cell){
								this.mainControllerId = mainControllerId;
							}
						}
						if (obj.value != null) {
							// set a default value
							var toField = registry.byId(this.id + obj.target);
							if (toField.declaredClass === "custom.ComboBox" || toField.declaredClass === "custom.FilteringSelect") {
								toField.set("item", toField.store.get(obj.value));
							} else {
								toField.set("value", obj.value);
							}
						}
					}
				}
			}
		},

		// From list > detail will set all fields by default
		setValuesForList : function() {
			if (this.values != null) {
				for ( var prop in this.values) {
					this.model.KEY_BEGIN[prop] = this.values[prop];
				}
			}
			if (!this.lookup)
				publish(this);
		},

		saveSettingsAction : function() {
			if (document.getElementById(this.id + 'loader') != null) {
				document.getElementById(this.id + 'loader').style.visibility = "visible";
			}
			this.disableAllButtons();
			saveListSettings(this);
		},

		saveSettingsCallback : function() {
			window.models.saveSuccessfull();
			if (document.getElementById(this.id + 'loader') != null) {
				document.getElementById(this.id + 'loader').style.visibility = "hidden";
			}
		},

		showPopup : function(properties, callback) {
			var Dock;
		    require(["dojox/layout/Dock"], function(_Dock){
		    	Dock = _Dock;
		    });
		    
			// Check if screen is lookup, when it's a lookup alter the dock
			if(properties.controller.dock === undefined){
				properties.controller.dock = new Dock({
		    		id: properties.controller.getParent().id + ".dockBar",
		    		region: bottom,
		    		style: {'height':'32px', 'width':'100%', 'position':'absolute','bottom':'0px', 'left':'0px'},
		    		openPopups: {}
		    	});
			}
			if (!properties.controller["lookup"] && (properties.screenId in properties.controller.dock.openPopups)) {
				refreshPopup(properties, callback, this);
			} else {
				openPopup(properties, callback, this);
			}
		},

		disableAllButtons : function() {
			var actionbar = null;
			if (dom.byId(this.id + 'ListActionBar')) {
				actionbar = dom.byId(this.id + 'ListActionBar');
			}
			
			if(actionbar != null){
				var buttons = actionbar.getElementsByTagName("button");
				for (var i = 0; i < buttons.length; i++) {
					buttons[i].setAttribute('disabled', 'disabled');
				}
			}
		},

		enableAllButtons : function() {
			var actionbar = null;
			if (dom.byId(this.id + 'ListActionBar')) {
				actionbar = dom.byId(this.id + 'ListActionBar');
			}
			
			if(actionbar != null){
				var buttons = actionbar.getElementsByTagName("button");
				for (var i = 0; i < buttons.length; i++) {
					buttons[i].removeAttribute('disabled');
				}
			}
		},

		setSearchButton : function(isDisabled) {
			if (dom.byId(this.id + 'searchButton')) {
				dom.byId(this.id + 'searchButton').disabled = isDisabled;
			}
		},

		setResetButton : function(isDisabled) {
			if (dom.byId(this.id + 'resetButton')) {
				dom.byId(this.id + 'resetButton').disabled = isDisabled;
			}
		},

		setVariableButton : function(isDisabled) {
			if (dom.byId(this.id + 'variableButton')) {
				dom.byId(this.id + 'variableButton').disabled = isDisabled;
			}
		},

		setNewButton : function(isDisabled) {
			if (dom.byId(this.id + 'newButton')) {
				dom.byId(this.id + 'newButton').disabled = isDisabled;
			}
		},

		uninitialize : function() {
			this.inherited(arguments);
			this.model = null;
			this.lastFocusedElement = null;
			this.focusHandler = null;
			delete this.model;
			for ( var con in this._connections) {
				if (typeof this._connections[con] !== "undefined" && typeof this._connections[con].remove === "function") {
					this._connections[con].remove();
				}
			}
			if (this._childWidgets !== undefined) {
				for ( var child in this._childWidgets) {
					child.destoryRecursive();
				}
				delete this._childWidgets;
			}
		},

		exportCSV : function() {
			createCSV(this);
		},

		addLine : function(model, _publish) {
			var newLine = this.model.getListItem();
			
			// Copy items from model to newLine
			for (var item in newLine) {
				if(model[item] != undefined){
					newLine[item] = model[item];
				}
			}
			
			newLine.detail_action_code = CONFIG.CREATE;
			newLine.isNewLine = true;
			
			// hook to set custom default detail values
			if (this.addLineHook){
				newLine = this.addLineHook(newLine);
			}
			
			if (this.onAddLine != undefined) {
				newLine = this.onAddLine(newLine);
			}
			
			for (var i = 0; i < this.model.LIST.detail_data.length; i++) {
				this.model.LIST.detail_data[i] = unBox(this.model.LIST.detail_data[i]);
			}
			this.model.LIST.detail_data.unshift(newLine);
			
			if(_publish != false){
				publish(this);
			}
		},

		deleteSelectedItems : function() {
			var grid = null;

			getDijitWidgetById(this.id + "grid", function(widget) {
				grid = widget;
			});
			var items = grid.selection.getSelected();

			for (var i = 0; i < items.length; i++) {
				this.deleteItem(items[i]);
			}
		},

		deleteItem : function(item) {
			var grid = null;

			getDijitWidgetById(this.id + "grid", function(widget) {
				grid = widget;
			});

			item.detail_action_code = CONFIG.DELETE;
			var item = unBox(cloneObject(item));


			// find equal element in model
			for (var j = 0; j < this.model.LIST.detail_data.length; j++) {
				var model_element = JSON.stringify(unBox(this.model.LIST.detail_data[j]));
				var store_element = JSON.stringify(unBox(item));

				if (model_element == store_element) {
					// delete element in model
					this.model.LIST.detail_data.splice(j, 1);
				}
			}
			
			item['detail_refresh_join'] = -1;
			this.model.DELETED_ITEMS.push(item);
			
			publish(this);
		},

		clear : function() {
			this.model.LIST.detail_data = [];
			publish(this);
		},

		deleteLine : function(obj) {
			var listController = this;
			require([ "dojo/dom", "dojo/_base/lang", "cefetraWidgets/ConfirmDialog" ], function(dom, lang, ConfirmDialog) {
				new ConfirmDialog({
					message : LANGUAGE.DELETE_CONFIRMATION_MESSAGE_LIST,
					onExecute : function() {
						listController.deleteItem(obj.item);
					}
				}).show();
			});
		},

		deleteLines : function(obj) {
			// Check if there are any lines selected
			var grid = null;
			getDijitWidgetById(this.id + "grid", function(widget) {
				grid = widget;
			});

			// selection could contain null values
			var tempItems = grid.selection.getSelected();
			var items = new Array();
			for (var i = 0; i < tempItems.length; i++) {
				if (tempItems[i] != null) {
					items.push(tempItems[i]);
				}
			}

			if (items.length == 0) {
				var screenId = null;
				if (this.parentController != undefined) {
					screenId = this.parentController.id;
				} else {
					screenId = this.id;
				}
				setPageInformation(screenId, LANGUAGE.PLEASE_SELECT_AT_LEAST_ONE_ROW_TO_DELETE, COLOR.RED);
				return;
			}

			var listController = this;
			require([ "dojo/dom", "dojo/_base/lang", "cefetraWidgets/ConfirmDialog" ], function(dom, lang, ConfirmDialog) {
				new ConfirmDialog({
					message : LANGUAGE.DELETE_CONFIRMATION_MESSAGE_LIST_MULTI,
					onExecute : function() {
						listController.deleteSelectedItems();
					}
				}).show();
			});
		},
		
		selectChangedItems: function(){
			var grid = getGrid(this);
			if(grid.store != null){
				
				grid.selection.clearOnlyOnScreen = true;
				grid.selection.clear();
				grid.selection.clearOnlyOnScreen = false;

				for (var i = 0; i < this.model.getListModel().length; i++) {
					var item = unBox(this.model.getListModel()[i]);
					if(item.detail_action_code == CONFIG.UPDATE || (item.detail_action_code == CONFIG.CREATE || item.isNewLine)){
						grid.selection.setSelected(i, true);
					}else{
						grid.selection.setSelected(i, false);
					}
				}
			}
		},
		
		customAction: function(actionCode, items, ignoreServiceResult, customCallback){
			if(ignoreServiceResult){
				this.ignoreServiceResult = true;
			}
			
			if(customCallback != undefined){
				this.customCallback = customCallback;
			}
			
			for (var i = 0; i < items.length; i++) {
				items[i].detail_action_code = actionCode;
			}
			this.method = CONFIG.CUSTOM_ACTION;
			this.serviceCall(items);
		},
		
		setData: function(data, append){
			if(!Array.isArray(data)){
				data = [data];
			}
			if(!append){
				this.model.LIST.detail_data = data;
			} else {
				var toAdd = new Array();
				for (var j = 0; j < data.length; j++) {
					var skip = false;
					for (var i = 0; i < this.model.LIST.detail_data.length; i++) {
						if(equalObjects(this.model.LIST.detail_data[i], data[j])){
							skip = true;
						}
					}
					
					if(!skip){
						toAdd.push(data[j]);
					}
				}
				for (var i = 0; i < toAdd.length; i++) {
					this.model.LIST.detail_data.push(unBox(toAdd[i]));
				}
				
			}
			publish(this);
		},
		
		getData: function(){
			return this.model.LIST.detail_data;
		}
		
	});
});