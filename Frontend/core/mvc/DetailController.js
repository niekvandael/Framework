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
    "dijit/focus",
    "dijit/_FocusMixin",
    "/libraries/validation.js"
], function(declare, registry, dom, query, focusUtil, _FocusMixin) {
	return declare("custom.DetailController", [_FocusMixin], {
		// do we use Dojo widgets in our template? We use them all the time! ;)
    widgetsInTemplate: true,
    // set the language file for every widget
	  i18n: LANGUAGE,
	  // set our default constraints
	  constraint: VALIDATION,
	  // default service action
	  method: CONFIG.READ_RECORD,
	  editable: false,
	  // which fields are disabled by default?
	  disabledFields: ["status", "lastupdate", "lastupdatedby", "statusadr", "lastupdatedbyadr", "lastupdateadr", "last_updated_by", "last_update"],
	  // the fields below may not be updated
	  nonUpdatableFields: [],
	  // set the keyfields
	  keyFields: [],
	  // property to count the unloaded comboboxes on the current screen
	  unloadedCombos: 0,
	  // after the comboboxes are loaded perform this action
	  combosLoadedAction: undefined,
	  // total comboboxes loaded
	  totalCombosRetrieved: 0,
	  lastFocusedElement: null,
	  focusHandler: null,
	  // perfom a search on startup?
	  searchOnStartup: true,
	  // enable all buttons in callback?
	  enableButtons: true,
	  // disable all buttons before servicecall?
	  disableButtons: true,
	  // show the actionbar
	  showActionBar: true,
	  // custom startup function
	  customStartup : false,
	  // show webservice data even when errors occur
	  showDataOnError:false,
	  // hide 'no data found' errors when entity references other entity
	  hideNoDataFoundErrors:false,
	  
	  startup: function(){
	  	this.inherited(arguments);
	  	// implement your custom startup function in your controller
			if (this.customStartup) {
				return;
			}
	  	this.setDefaultValues();
	  	disableFields(this, true, true);
	  	// if data is passed(eg. row of previous listview) and a search on startup and a service call has to be performed
	  	if(typeof this.values !== 'undefined' && this.values !== null && this.searchOnStartup && this.doServiceCall){
	  		this.serviceCall();
	  	}
	  	this.focusFirstElement();
	  	
	  	if(CONFIG.DEBUG){
	  		console.log(this.entity); // TODO DELETE : DEBUG PURPOSES
	  	}
	  	
	  	if(!this.showActionBar){
			getDijitWidgetById(this.id + "DetailActionBar", function(widget){
				if(widget === undefined){
					console.warn("Actionbar is not found for widget");
				} else{
					widget.domNode.style.display = "none";
				}
			});
	  	}
		  
	  	if(typeof this.postStartupHook == "function"){
	  		this.postStartupHook();
	  	}
	  },
	  
	  resize: function(){
	  	var children = this.getChildren();
	  	for (var i = 0; i < children.length; i++){
	  		if (children[i].resize){
	  			children[i].resize();
	  		}
	  	}
	  	this.inherited(arguments);
	  },
	  
	  setDefaultValues: function(){
			if (typeof this.values != undefined){
				for (var prop in this.values){
					if(registry.byId(this.id + prop) != undefined){
						if(isArray(this.values[prop])){
							registry.byId(this.id + prop).set("value", this.values[prop][0]);
						} else {
							registry.byId(this.id + prop).set("value", this.values[prop]);
						}
					}
					
					// Set value in record if exists
					for(var prop in this.values){
						if(this.model.DETAIL.hasOwnProperty(prop)){
							this.model.DETAIL[prop] = this.values[prop];
						}
					}	
				};
			} else{
				console.warn("this.values is not set");
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
	  				this.lastFocusedElement = widget;
	  				break;
	  			}
	  		}
	  	}
	  },
	  
	  serviceCall: function(){
	  	this.setLoader("visible");
	  	commit(this);
	  	if (this.serviceCallHook){
	  		this.serviceCallHook();
	  	}
	  	
	  	// Reset all errors before calling
	  	window.models.CH000S0W_COMMON.errors = [];
	  	
	  	callWebservice("", this.method, this.model.getServiceModel(), this.entity + "Service", this, 'callback');
	  },
	  
	  setLoader: function(state){
	  	var id = this.id + 'loader';
	  	if (document.getElementById(id) !== null){
	  		document.getElementById(id).style.visibility = state;
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
	  	setPageInformation(this.id, LANGUAGEFUNCTIONS.genericMessage(LANGUAGE.NUMBER_OF_UNLOADED_COMBOS, [(this.totalCombosRetrieved - this.unloadedCombos) + 1, this.totalCombosRetrieved]), COLOR.BLACK);
	  },
	  
	  // Executes when a combobox is loaded for this controller
	  comboLoaded: function(){
	  	setPageInformation(this.id, LANGUAGEFUNCTIONS.genericMessage(LANGUAGE.NUMBER_OF_UNLOADED_COMBOS, [(this.totalCombosRetrieved - this.unloadedCombos) + 1, this.totalCombosRetrieved]), COLOR.BLACK);
		  this.unloadedCombos--;
		  
		  // Eerst this.unloadedCombos != 0, bij general company data worden dan 8 comboboxes geladen,
		  // maar als de laatste combobox geladen is (this.unloadedCombos) wodt er niet meer teruggekeerd naar de refresh en wordt er ook geen data opgehaald uit de backend.
		  if(this.combosLoadedAction != undefined && this.unloadedCombos == 0){
			  this.combosLoadedAction(this);
		  }
	  },
	  
	  callback: function(callbackData){
	  	// check whether the widget is destroyed, if the widget is destroyed cancel every operation
	  	if (this._destroyed){
	  		console.debug("Widget '" + this.entity + "' closed before callback");
	  		return;
	  	}
	  	this.setLoader("hidden");
	  	
	  	if(this.customCallback == undefined){
	  		basicCallback(this, callbackData);
	  	} else {
	  		this.customCallback(this, callbackData);
	  		if(this.isCustomAction){
	  			delete this.customCallback;
	  			this.isCustomAction = false;
	  		}
	  	}
	  	
	  	if(this.callbackHook != undefined){
	  		this.callbackHook();
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
	  		console.log("DetailController | Something went wrong while setting the focus: ", ex.toString());
	  	}
	  },
	  
	  handleKeys: function(e){
	  	var character = String.fromCharCode(e.keyCode).toLowerCase();
	  	if (!e.altKey){
	  		return;
	  	}
	  	
	  	switch (character){
  	  	case 'r':this.refreshAction(); break;
  	  	case 'n':this.newAction();break;
  	  	case 's':this.saveAction();break;
  	  	case 'd':this.deleteAction();break;
	  	};
	  	
	  	e.stopPropagation();
	  	e.preventDefault();
	  },
	  
	  newAction: function(){
	  	if(typeof this.preNewAction == "function"){
	  		this.preNewAction();
	  	}
	  	
	  	this.method = CONFIG.CREATE_RECORD;
	  	// use the hook in the function below to dis/enable buttons
	  	// New and Delete button is automatically disabled
	  	this.disableButtonsNewAction();
	  	handleNew(this);
		
	  	if(typeof this.postNewAction == "function"){
	  		this.postNewAction();
	  	}
	  },
	  
	  checkAction: function(){
	  	var valid = handleSave(this, false);
	  	if(valid){
	  		commit(this);
	  	}
	  	return valid;
	  },
	  
	  saveAction: function(){
		  if(this.preSaveAction != undefined){
			  this.preSaveAction();
		  }
		  handleSave(this, true);
	  },
	  
	  deleteAction: function(){
	  	this.method = CONFIG.DELETE_RECORD;
		handledeleteInDetail(this);
	  },
	  
	  refreshAction: function(){
	  	if(this.isCombosLoaded()){
    	  this.method = CONFIG.READ_RECORD;
    	  this.disableAllButtons();
    	  // use the hook in the function below to dis/enable buttons
  	  	this.disableButtonsRefreshAction();
  	  	this.serviceCall();
	  	} else {
	  		this.combosLoadedAction = this.refreshAction;
	  	}
	  },
	  
	  disableButtonsSaveAction: function(){
	  	if(typeof this.disableButtonsSaveActionHook !== "undefined"){
	  		this.disableButtonsSaveActionHook();
	  	}
	  },
	  
	  disableButtonsRefreshAction: function(){
	  	if(typeof this.disableButtonsRefreshActionHook !== "undefined"){
	  		this.disableButtonsRefreshActionHook();
	  	}
	  },
	  
	  disableButtonsDeleteAction: function(){
	  	if(typeof this.disableButtonsDeleteActionHook !== "undefined"){
	  		this.disableButtonsDeleteActionHook();
	  	}
	  },
	  
	  disableButtonsNewAction: function(){
	  	if(typeof this.disableButtonsNewActionHook !== "undefined"){
	  		this.disableButtonsNewActionHook();
	  	}
	  	
	  	this.setNewButton(false);
	  	this.setDeleteButton(true);
	  	this.saveSettingsButton(false);
	  },
	  
	  disableAllButtons: function(){
			var actionbar = null;
			if (dom.byId(this.id + 'DetailActionBar')) {
				actionbar = dom.byId(this.id + 'DetailActionBar');
			}
			
			if(actionbar != null){
				var buttons = actionbar.getElementsByTagName("button");
				for (var i = 0; i < buttons.length; i++) {
					buttons[i].setAttribute('disabled', 'disabled');
				}
			}
	  },
	  
	  enableAllButtons: function(){
			var actionbar = null;
			if (dom.byId(this.id + 'DetailActionBar')) {
				actionbar = dom.byId(this.id + 'DetailActionBar');
			}
			
			if(actionbar != null){
				var buttons = actionbar.getElementsByTagName("button");
				for (var i = 0; i < buttons.length; i++) {
					buttons[i].removeAttribute('disabled');
				}
			}
	  },
	  
	  setRefreshButton: function(isDisabled){
	  	if (dom.byId(this.id+'refreshButton')){
	  		dom.byId(this.id+'refreshButton').disabled = isDisabled;
	  	}
	  },
	  
	  setDeleteButton: function(isDisabled){
	  	if (dom.byId(this.id+'deleteButton')){
	  		dom.byId(this.id+'deleteButton').disabled = isDisabled;
	  	}
	  },
	  
	  setNewButton: function(isDisabled){
	  	if (dom.byId(this.id+'newButton')){
	  		dom.byId(this.id+'newButton').disabled = isDisabled;
	  	}
	  },
	  
	  setSaveButton: function(isDisabled){
	  	if (dom.byId(this.id+'saveButton')){
	  		dom.byId(this.id+'saveButton').disabled = isDisabled;
	  	}
	  },
	  
	  saveSettingsButton: function(isDisabled){
	  	if (dom.byId(this.id+'saveSettingsButton')){
	  		dom.byId(this.id+'saveSettingsButton').disabled = isDisabled;
	  	}
	  },
	  
	  uninitialize: function(){
	  	this.model = null;
	  	this.lastFocusedElement = null;
	  	this.focusHandler = null;
	  	this.inherited(arguments);
	  },
	  	
	  saveSettings: function(){
	  	document.getElementById(this.id + 'loader').style.visibility = "visible";
	  	this.disableAllButtons();
	  	saveDetailSettings(this);
	  },
	  
	  saveSettingsCallback : function(){
	  	window.models.saveSuccessfull();
	  	document.getElementById(this.id + 'loader').style.visibility = "hidden";
	  },
	  
	  close : function(){
		  var floatingPaneId = this.domNode.parentNode.parentNode.parentNode.id;
		  getDijitWidgetById(floatingPaneId, function(widget){
			 widget.destroyRecursive(); 
		  });
	  },
	  
	  isValid : function(){
		  return this.checkAction();
	  },
	  
	  parentSearch : function(){
	  	registry.byId(this.parentId).searchAction();
	  },
	  
	  showPopup : function(properties, callback) {
			// Check if screen is lookup, when it's a lookup alter the dock
			if (!properties.controller["lookup"] && (properties.screenId in properties.controller.dock.openPopups)) {
				refreshPopup(properties, callback, this);
			} else {
				openPopup(properties, callback, this);
			}
	  },
		customAction: function(actionCode, customCallback){
			this.isCustomAction = true;
			if(customCallback != undefined){
				this.customCallback = customCallback;
			}
			
			this.model.DETAIL.detail_action_code = actionCode;
			
			this.method = CONFIG.CUSTOM_ACTION;
			this.serviceCall();
		},	
	  postMixInProperties : function() {
			renderTemplate(this);
			this.inherited(arguments);
		},
		
	});
});