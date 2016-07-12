 /**
 * CREATED BY NVD ON 1-apr.-2014 13:57:41
 *
 * Package    : core/js
 * Filename   : common.js
 */

"use strict";

// array with lookups necessary to destroy after tab close
var _lookups = [];
var _comboboxes = [];
var _infobusses = [];
var _contextmenus = [];
var _contextmenuLinks = [];

var globalIdentifier = "";

function encodeURIObject(obj) {
    for (var propt in obj) {
        obj[propt] = encodeURIComponent(obj[propt]);
    }
    return obj;
}

function decodeURIObject(obj) {
    for (var propt in obj) {
        obj[propt] = decodeURIComponent(obj[propt]);
    }
    return obj;
}

function encodeObject(obj) {
    require(["dojox/html/entities"], function(entity) {
        for (var property in obj) {
            if (obj.hasOwnProperty(property)) {
                if (typeof obj[property] == "object")
                    encodeObject(obj[property]);
                else {
                    if (typeof obj[property] == 'string' && obj[property] != "" && obj[property] != null && obj[property].indexOf("&") == -1 && obj[property] != undefined && obj[property] != 0) {
                        obj[property] = entity.encode(obj[property]);
                    }
                }
            
            }
        }
    });
}

function decodeObject(obj) {
    require(["dojox/html/entities"], function(entity) {
        for (var property in obj) {
            if (obj.hasOwnProperty(property)) {
                if (typeof obj[property] == "object")
                    decodeObject(obj[property]);
                else {
                    if (typeof obj[property] == 'string' && obj[property] != "" && obj[property] != null && obj[property] != undefined && obj[property] != 0) {
                        obj[property] = entity.decode(obj[property]);
                    }
                }
            
            }
        }
    });
}
;

function namespace(namespaceString) {
    var parts = namespaceString.split('.'), parent = window, currentPart = '';
    
    for (var i = 0, length = parts.length; i < length; i++) {
        currentPart = parts[i];
        parent[currentPart] = parent[currentPart] || {};
        parent = parent[currentPart];
    }
    
    currentPart = null;
    parts = null;
    
    return parent;
}

function removeBackendValidators(controller) {
    for (var field in controller.model.getEmptyModel()) {
        getDijitWidgetById(controller.id + field, function(fld) {
            if (fld != undefined) {
                if (fld.hasBackendError) {
                    fld.validator = fld.originalValidator;
                    fld.originalValidator = null;
                    fld.hasBackendError = false;
                }
            }
        });
    }
}
;

function mapErrorMessages(errors, fields, identifier) {
    var translatedErrors = new Array();
    for (var j = 0; j < errors.length; j++) {
        getDijitWidgetById(identifier + errors[j].location_field_name.toLowerCase(), function(fld) {
            var translatedError = getErrorMessage(errors[j]);
            translatedErrors.push(translatedError);
            
            if (fld != undefined) {
                fld.invalidMessage = translatedError;
                fld.isValid();
                
                dijit.showTooltip(fld.get("invalidMessage"), fld.domNode, fld.get("tooltipPosition"), !fld.isLeftToRight());
                
                var originalValidator = fld.validator;
                fld.validator = function() {
                    return false;
                };
                fld.validate();
                fld.originalValidator = originalValidator;
                fld.hasBackendError = true;
                
                fld.focus();
            }
        });
    }

    // Show dialog containing the errors
    showErrorMessageDialog(translatedErrors, errors);
}
;

function getErrorMessage(errorObject) {
    var translatedMessage = setErrorCodeVariables(errorObject, LANGUAGE[errorObject.error_code.replace(/ /g, '_')]);
    if (translatedMessage === undefined) {
        return errorObject.error;
    }
    
    return translatedMessage;
}

function setErrorCodeVariables(error, translatedError) {
    if (translatedError === undefined) {
        //Error is missing in languagefile
        var errorStringified = JSON.stringify(error);
        var errorRecord = {
            error: "ERROR NOT SET: " + errorStringified
        };
        callErrorWebService(errorRecord);
        
        return error.error_code;
    }
    var counter = 0;
    var idx = 0;
    while (idx != -1) {
        idx = translatedError.indexOf("{", idx + 1);
        counter++;
    }
    for (var i = 0; i < counter; i++) {
        var errorIdx = "error_variable_" + (i + 1);
        translatedError = translatedError.replace("{" + i + "}", translateField(error[errorIdx]));
    }
    
    return translatedError;
}
function translateField(fieldName, insertQuotes) {
    if (fieldName === undefined) {
        return "";
    }
    
    if (fieldName.indexOf("{translate}") > -1) {
        var quotes = "'";
        fieldName = fieldName.replace("{translate}", "");
        return quotes + LANGUAGE[fieldName] + quotes;
    }
    
    return fieldName;
}

function setRecordFromTo(fromRecord, toRecord) {
    for (var field in fromRecord) {
        if (field in toRecord) {
            toRecord[field] = fromRecord[field];
        }
    }
}

function setModel(model, controller, fieldPrefix) {
    if (fieldPrefix == undefined) {
        fieldPrefix = "";
    }
    require(["dijit/registry"], function(registry) {
        for (var field in model) {
            var fld = registry.byId(controller.id + fieldPrefix + field);
            if (fld != undefined) {
                var found = false;
                if (!found && ~fld.declaredClass.toLowerCase().indexOf("utcdatetextbox")) {
                    fld.set("value", new Date(model[field]));
                    found = true;
                };
                
                if (!found && ~fld.declaredClass.toLowerCase().indexOf("numbertextbox")) {
                	if (fieldPrefix.toLowerCase() !== "search"){
	                    var value = model[field];
	                    fld.set("value", value);
                	}
                  found = true;
                };
                
                if (!found && ~fld.declaredClass.toLowerCase().indexOf("combobox")) {
                    var objItem = fld.store.get(model[field]);
                    fld.set("item", objItem);
                    found = true;
                };
                
                if (!found && ~fld.declaredClass.toLowerCase().indexOf("filteringselect")) {
                  var objItem = fld.store.get(model[field]);
                  fld.set("item", objItem);
                  found = true;
                };
                
                if (!found && ~fld.declaredClass.toLowerCase().indexOf("validationtextbox")) {
                    fld.set("value", model[field]);
                    found = true;
                };
                
                if (!found && ~fld.declaredClass.toLowerCase().indexOf("lookupfield")) {
                  fld.set("value", model[field]);
                  found = true;
                };
                
                if (!found && ~fld.declaredClass.toLowerCase().indexOf("checkbox")) {
                    var checked = false;
                    if (model[field] == "Y") {
                        checked = true;
                    }
                    fld.set("checked", checked);
                    found = true;
                };
                
                if (!found && ~fld.declaredClass.toLowerCase().indexOf("radiobuttongroup")) {
                    fld.set("value", model[field]);
                    found = true;
                  };
                
                if(!found && ~fld.declaredClass.toLowerCase().indexOf("textarea")){
                	fld.set("value", model[field]);
                	found = true;
                }
                
                if (!found) {
                    throw new "Undefined field: " + fld.declaredClass;
                }
            
            }
        }
    });
}

function setDefaultStartup() {
    require(["dijit/registry"], function(registry) {
        registry.byId('newButton').onClick();
    });
}

function setConnection(element, action, functionName, hitch, tab) {
    require(["dojo/on", "dijit/registry", "dojo/_base/lang"], function(on, registry, lang) {
        var con = on(registry.byId(element), action, lang.hitch(hitch, functionName));
        _connections.push({
            "tab": tab,
            con: con
        });
    });
}

function setPopupConnection(widget, action, functionName, hitch, connections) {
    require(["dojo/on", "dijit/registry", "dojo/_base/lang"], function(on, registry, lang) {
        var con = on(registry.byId(widget), action, lang.hitch(hitch, functionName));
        connections.push(con);
    });
}

function destroyConnections(_connections) {
    for (var i = _connections.length; i--; ) {
        _connections[i].remove();
        _connections.splice(i, 1);
    }
}

function getListHeight(detailHeight, container) {
    container = container || undefined;
    var totalHeight = 0;
    
    require(["dojo/window"], function(win) {
        totalHeight = win.getBox().h;
    });
    
    return totalHeight - 115;
}

function getContainerHeight(controller, defaultHeight) {
    var key = controller.identifier + controller.view.containerId + '.height';
    var setting = window.models.getSetting(key);
    if (setting != undefined) {
        return setting + "px";
    }
    
    return defaultHeight;
}

function getSearchCriteriaSettings(controller) {
    var settings = [];
    var index = 0;
    for (var searchField in controller.model.getSearchRecord()) {
        getDijitWidgetById(controller.identifier + "search" + searchField, function(widget) {
            if (widget != undefined) {
                var setting = {
                    key: controller.identifier + "search" + searchField,
                    value: widget.get("value"),
                    username: window.models.getusername(),
                    attribute: "value"
                };
                settings[index] = setting;
                index++;
            }
        });
    }
    return settings;
}

function getFieldSettings(controller) {
    var settings = new Array();
    
    for (var field in controller.model.getDetailModel()) {
        getDijitWidgetById(controller.identifier + field, function(fld) {
            if (fld != undefined) {
                var disabled = fld.get("disabled");
                var value = fld.get("value");
                
                if (disabled) {
                    value = "";
                }
                
                var setting = {
                    key: controller.identifier + field,
                    value: value,
                    username: window.models.getusername(),
                    attribute: "value"
                };
                
                if ((typeof setting.value == "number" && isNaN(setting.value)) || typeof setting.value == "undefined") {
                    setting.value = "";
                }
                settings.push(setting);
            }
        });
    }
    ;
    return (settings);
}
;

function getContentPaneSetting(controller, styleSetting) {
    var setting = {};
    getDijitWidgetById(controller.identifier + controller.view.containerId, function(element) {
        var key = element.id + "." + styleSetting;
        var value = dojo.getStyle(element.domNode, styleSetting);
        setting = createSetting(key, value);
    });
    return setting;
}

function createSetting(key, value) {
    var setting = {
        key: key,
        value: value,
        username: window.models.getusername(),
        attribute: "value"
    };
    
    return setting;
}

function getListSettings(controller) {
    var setting = {};
    require(["dijit/registry"], function(registry) {
        if (controller.view.listId != undefined) {
            
            var list = registry.byId(controller.view.listId);
            var temp = list.getColumnTogglingItems();
            
            var gridStructure = [];

            // Loop reordered columns (only displayname is available at this level)
            for (var i = 0; i < temp.length; i++) 
            {
                // Loop original columns (displayname + fieldnames are available at this level)
                for (var j = 0; j < list.structure.length; j++) {
                    var width = temp[i]._gridCell.unitWidth;
                    
                    if (temp[i].label == list.structure[j].name) {
                        var structure = {};
                        structure.field = list.structure[j].field;
                        structure.width = width;
                        structure.name = list.structure[j].name;
                        gridStructure.push(structure);
                        break;
                    }
                }
            }
            
            var gStructure = JSON.stringify(gridStructure);
            setting = {
                key: controller.view.listId,
                value: gStructure,
                username: window.models.getusername(),
                attribute: "structure"
            };
        }
    });
    return setting;
}

function commit(controller) {
    if (controller.model.getSearchRecord != undefined) {
      commitRecord(controller, controller.model.getSearchRecord(), "search");
    }
    
    if (controller.model.getDetailModel != undefined) {
      commitRecord(controller, controller.model.getDetailModel());
    }
}

function publish(controller, skipPublish) {
    if (controller.model.getSearchRecord != undefined) {
        if (controller.onPublish != undefined && skipPublish == false) {
            controller.onPublish(controller, controller.model.getListModel());
        }
        
        publishRecord(controller, controller.model.getSearchRecord(), "search");
        setGrid(controller.id + "grid", controller);
    }

    if (controller.model.getDetailModel != undefined) {
        if (controller.onPublish != undefined) {
            controller.onPublish(controller, controller.model.getDetailModel());
        }
        publishRecord(controller, controller.model.getDetailModel());
    }

    if(typeof controller.postPublish == "function"){
    	controller.postPublish();
    }
}
;

function commitRecord(controller, record, prefix) {
	var prefix = prefix ? prefix : "";
	for (var field in record) {
    getDijitWidgetById(controller.id + prefix + field, function(fld) {
      if (fld != undefined) {
    	if(fld.store == undefined){
    		if(!(record[field] == null && fld.get("value") == "")){
              	record[field] = fld.get("value");
    		}
    	} else {
    		if(fld.get("item") != null){
    			record[field] = fld.get("item").id;
    		}
    	}
      	
      	// Dependent combo's get changed on DOM events: the value may not be set yet
      	if(fld.dependent && record[field] == ""){
      		record[field] = fld.domNode.getAttribute('iv');
      	}
      	
      	// set null flags
    		if (typeof record['null_' + field] !== "undefined"){
    			// when field is numeric but value isn't, the value is empty, or the value is null, the expression is true
    			if ((isNaN(fld.get('value')) && ~fld.declaredClass.indexOf("NumberTextBox")) || fld.get('value') === "" || fld.get('value') === null){
      			record[field] = "";
      			record["null_"+field] = CONFIG.NULL_VALUE_TRUE;
      		} else{
      			record["null_"+field] = CONFIG.NULL_VALUE_FALSE;
      		}
    		}
    		
    		// set null flags
    		if (typeof record['modified_' + field] !== "undefined"){
      			record["modified_"+field] = CONFIG.NULL_VALUE_TRUE;
    		}
      }
    });
  };
}

function publishRecord(controller, record, prefix) {
	var prefix = prefix ? prefix : "";
  
  for (var field in record) {
      getDijitWidgetById(controller.id + prefix + field, function(fld) {
          if (fld != undefined) {
              fld.set("value", record[field]);
              
              if(~fld.declaredClass.toLowerCase().indexOf("custom.combobox") || ~fld.declaredClass.toLowerCase().indexOf("custom.filteringselect")){
                  if(!fld.store.LOADED === undefined && !fld.store.LOADED){
                	  fld.set("value", record[field]);
                  } else {
                	  if(fld.store.LOADED == false){ // !fld.store.LOADED will result in true for value 'false' and 'undefined', we only need value 'false'
                    	  fld.domNode.setAttribute("iv", record[field]);
                	  } else {
                		  // When no 'LOADED' attribute exists (undefined != false): store is always loaded since it's not retrieved from backend
                		  // When 'LOADED' is true: it can get set
                    	  fld.set("item", fld.store.get(record[field]));
                	  }
                  }
                } else {
              	 // date fields
                //  fld.set("value", record[field].name);
                }
              
              if (~fld.declaredClass.toLowerCase().indexOf("utcdatetextbox") && ~fld.declaredClass.toLowerCase().indexOf("combobox")) {
                  fld.store.data.forEach(function(entry) {
                      if (entry.id == record[field]) {
                          fld.set("value", entry.name);
                          return;
                      }
                  });
               }
          }
      });
  };
}


function showErrors(errors, controller, action) {
    if (errors.length > 0) {
        mapErrorMessages(errors, controller, controller.identifier);
        setPageInformation(controller.id, LANGUAGE.PAGEINFORMATION_INVALID, COLOR.RED);
        return true;
    }
    
    publish(controller);
    return false;
};

function setPopupValues(controller, data) {
    var widget = controller.identifier + data.id;
    getDijitWidgetById(widget, function(widget) {
        if (data.value != "") {
            setValue(widget, data.value);
        }
    });
}
;

function setPopupConnections(data, self) {
    require(["dijit/registry", "dojo/on"], function(registry, on) {
        var selectButton = data.date + "select";
        var searchButton = data.date + "search";
        var resetButton = data.date + "reset";
        var popup = data.identifier + "lookup_" + data.date;
        var tab = data.identifier.split(".")[0];
        
        setConnection(selectButton, 'click', 'selectAction', self, tab);
        setConnection(searchButton, 'click', 'searchAction', self, tab);
        setConnection(resetButton, 'click', 'resetAction', self, tab);
        setConnection(popup, 'hide', 'close', self, tab);
        setConnection(popup, 'show', 'show', self, tab);
    });
}
;

function setListConnection(list, self) {
    setConnection(list, 'RowDblClick', 'selectAction', self, list.split(".")[0]);
}

function updateListAfterDetailUpdate(controller, callbackData) {
    if (typeof callbackData.result == "undefined" || callbackData.result == 403 || typeof callbackData == "undefined") {
        console.warn("Callback data not valid. Possible cause is a permission issue.");
        return;
    }
    require(["dijit/registry", "cefetraWidgets/ErrorDialog"], function(registry, ErrorDialog) {
        var actionCode = callbackData.result[1]['detail_action_code'];
        if (actionCode == CONFIG.READ) {
            return;
        }
        var grid = registry.byId(controller.view.listId);
        var row = grid.getItem(grid.selection.selectedIndex);
        
        if (row === null && actionCode == CONFIG.UPDATE) {
            // Set the information
            new ErrorDialog({
                message: LANGUAGE.PAGEINFORMATION_GRID_NOT_UPDATED_NO_ROW_SELECTED,
                onHide: function() {
                    this.destroyRecursive();
                }
            }).show();
            return;
        }
        
        if (actionCode == CONFIG.UPDATE) {
            for (var item in callbackData.result[1]) {
                grid.store.setValue(row, item, callbackData.result[1][item]);
            }
        } else if (actionCode == CONFIG.CREATE) {
            callbackData.result[1]["uniqueId"] = controller.model.getListModel().length;
            controller.model.LIST.detail_data.push(callbackData.result[1]);
            grid.store.newItem(callbackData.result[1]);
        }
    });
}
;

function cloneObject(obj) {
    var newObj = {};
    
    for (var key in obj) {
        newObj[key] = obj[key];
    }
    
    return newObj;
}

function clone(from, to) {
    if (from == null || typeof from != "object")
        return from;
    if (from.constructor != Object && from.constructor != Array)
        return from;
    if (from.constructor == Date || from.constructor == RegExp || from.constructor == Function || 
    from.constructor == String || from.constructor == Number || from.constructor == Boolean)
        return new from.constructor(from);
    
    to = to || new from.constructor();
    
    for (var name in from) 
    {
        to[name] = typeof to[name] == "undefined" ? clone(from[name], null) : to[name];
    }
    
    return to;
}

function createMenuItem(item, tab, rowIndex) {
    var menuItem = undefined;
    require(["dojo/on", "dijit/MenuItem", "dijit/registry"], function(on, MenuItem, registry) {
        menuItem = new MenuItem({
            label: item.label,
            target: item.gridId
        });
        
        var click = on(menuItem, "click", function(e) {
            var grid = registry.byId(item.gridId);
            var selectedItems = grid.selection.getSelected();
            
            if (selectedItems.length == 0) {
                selectedItems.push(grid.getItem(rowIndex));
            }
            
            for (var i = 0; i < selectedItems.length; i++) {
                selectedItems[i] = transformListRecord(selectedItems[i]);
            }
            
            item.targetFunction(e, this, item.controller, selectedItems);
        });
        
        _contextmenuLinks.push({
            "tab": tab,
            con: click
        });
    });
    
    return menuItem;
}


// TODO
function getCSVmenuItem(gridId, tab, rowIndex) {
    var menuItem = undefined;
    require(["dojo/on", "dijit/registry", "dijit/Menu", "dijit/MenuItem"], function(on, registry, Menu, MenuItem) {
        menuItem = new MenuItem({
            label: LANGUAGE.CSV_EXPORT,
            target: gridId
        });
        
        var csvItem = on(menuItem, "click", function(e) {
            var grid = registry.byId(registry.byId(e.target.id.replace("_text", "")).target);
            
            var items = grid.selection.getSelected();
            if (items.length == 0) {
                items.push(grid.getItem(rowIndex));
            }
            
            var structure = getGridStructureForExport(grid.structure);
            structure = encodeURIComponent(JSON.stringify(structure));
            var data = [];
            if (items.length) {
                for (var i = 0; i < items.length; i++) {
                    var temp = clone(items[i]);
                    delete temp._S, temp._RI, temp._0;
                    data.push(temp);
                }
                encodeObject(data);
                post('/core/php/generateCSV.php?title=' + registry.byId(mainTabContainer).selectedChildWidget.title + "&structure=" + JSON.stringify(structure), data);
                window.doNotShowConfirmation = true;
                document.getElementById("hiddenFormAttr").remove();
                document.getElementById("csvForm").remove();
            } else {
                setPageInformation(LANGUAGE.SELECT_AT_LEAST_1_ROW, COLOR.RED);
            }
        });
        _contextmenuLinks.push({
            "tab": tab,
            con: csvItem
        });
    });
    
    return menuItem;
}

function createContextMenu(gridId, data, defaultItems) {
	
    var pMenu = null;
    var tab = gridId.split(".")[0];
    
    require(["dojo/on", "dijit/registry", "dijit/Menu", "dijit/MenuItem"], function(on, registry, Menu, MenuItem) {
        var context = on(registry.byId(gridId), "rowContextMenu", function(e) {
            pMenu = new Menu({
                targetNodeIds: [gridId]
            });
            
            pMenu.addChild(getCSVmenuItem(gridId, tab, e.rowIndex));
            
            for (var i = 0; i < data.length; i++) {
                pMenu.addChild(createMenuItem(data[i], tab, e.rowIndex));
            }
            
            for (var i = 0; i < data.length; i++) {
                data[i].gridId = gridId;
                createMenuItem(data[i], tab);
                _contextmenus.push({
                    "tab": tab,
                    menu: pMenu
                });
            }
        });
        _connections.push({
            "tab": tab,
            con: context
        });
    });
}

function post(path, data, method, id) {
    if (id = undefined) {
        id = "csvForm";
    }
    ;
    
    require(["dojox/html/entities"], function(entity) {
        method = method || "post"; // Set method to post by default if not specified.
        var form = document.createElement("form");
        var hiddenField = document.createElement("input");
        
        form.setAttribute("method", method);
        form.setAttribute("action", path);
        form.setAttribute("id", id);
        
        hiddenField.setAttribute("type", "hidden");
        hiddenField.setAttribute("name", "data");
        hiddenField.setAttribute("value", JSON.stringify(data));
        hiddenField.setAttribute("id", "hiddenFormAttr");
        
        form.appendChild(hiddenField);
        
        document.body.appendChild(form);
        form.submit();
    });
}

function setDetailData(id, detailController) {
    require(["dijit/registry", "dojo/on"], function(registry, on) {
        var grid = on(registry.byId(id), "rowClick", function(evt) {
            var selection = evt.grid.selection.getSelected()[0];
            detailController.setDetail(selection);
        });
        
        _connections.push({
            "tab": detailController.parentContainer.split(".")[0],
            con: grid
        });
    });
}

function makeDraggable() {
    require(["dojo/dom", "dojo/dnd/Moveable"], function(dom, Moveable) {
        new Moveable(dom.byId('currency'));
    
    });
}

function addDnDSupportForTabContainer() {
    require(["dijit/registry", "dojo/dnd/Source"], function(registry, Source) {
    //		dojo.forEach(registry.byId("mainTabContainer").tablist.containerNode.children, function(node) {
    //			dojo.removeClass(node, "dojoDndItem");
    //			dojo.addClass(node, "dojoDndItem");
    //	    });
    //	    var dndSource = new Source(registry.byId("mainTabContainer").tablist.containerNode, {
    //	        withHandles: false,
    //	        horizontal: true
    //	    });
    });

}

function mapLookupToController(lookupId, controller) {
    getDijitWidgetById(lookupId, function(lookup) {
        lookup.controller = controller;
    });

}

function hideLookup(popup) {
    getDijitWidgetById(popup, function(widget) {
        widget.hide();
    });
}

function showLookup(popup) {
    getDijitWidgetById(popup, function(widget) {
        widget.show();
    });
}

function destroyLookup(connections, popup, parentContainer) {
    for (var i = connections.length; i--; ) {
        connections[i].remove();
        connections.splice(i, 1);
    }
    
    for (var i = _connections.length; i--; ) {
        if (parentContainer.split(".")[0] == _connections[i].tab) {
            _connections[i].con.remove();
            _connections.splice(i, 1);
        }
    }
    
    getDijitWidgetById(popup, function(widget) {
        widget.destroyRecursive();
    });
}

function initiateLookup(data, me) {
    setPopupConnections(data, me);
    setListConnection(me.listController.view.listId, me);
}

function addChangeTitleTooltip (widgetId){
	return;
	var titleWidget = document.getElementById(widgetId);
	
		require(["dijit/Tooltip", "dojo/domReady!"], function(Tooltip){
	    new Tooltip({
	        connectId: [titleWidget],
	        label: "<input onKeyUp='changeTitle(this)' type='text' value='" + titleWidget.innerHTML + "'/>"
	    });
	});
}

function changeTitle(e){
	var widget = e.target;
	
  var value = widget.textContent;
  var parent = widget.parentElement;
  
  var input = document.createElement('input');
  input.value = widget.innerHTML;
  input.onblur = setLabelBack;
  
  parent.appendChild(input);
  parent.removeChild(widget);
  
  input.select();
}

function setLabelBack(e){
	var widget = e.target;
	var label = document.createElement('div');
	label.innerText = widget.value;
	label.ondblclick=changeTitle;
	
	widget.parentElement.appendChild(label);
	widget.parentElement.removeChild(widget);
}

function buildBorderContainer(id, widgetId, title) {
    require([widgetId, "dojox/layout/Dock", "dijit/layout/BorderContainer", "dijit/registry"], function(Controller, Dock, BorderContainer, registry){
    	var bc = new BorderContainer({
    		style: {'width':'100%','height':'100%'}, 
  			title: "<div onDblClick='changeTitle(event)'>" + title + "</div>",
  			id: id,
  			closable: true,
  			selected: true,
  			liveSplitters: false
    	}).placeAt(mainTabContainer);
    	
    	addChangeTitleTooltip("maincontainer_title_" + id);
    	
    	// select tab - this event must fire before focus is set
    	registry.byId(mainTabContainer).selectChild(bc);
    	
    	var dock = new Dock({
    		id: id + ".dockBar",
    		region: bottom,
    		style: {'height':'32px', 'width':'100%', 'position':'absolute','bottom':'0px', 'left':'0px'},
    		openPopups: {},
    	}).placeAt(bc.id);
    	
    	;
    	new Controller({
				region: center,
				style: {"height":"calc(100% - 50px)"},
				dock: dock,
			}).placeAt(bc.id);
    });
}

function buildContentPane(height, id) {
    // build a container with just 1 area to place widgets
    
    var bc = new ContentPane();
    bc.prototype.setStyle([[STYLE.HEIGHT, height], [STYLE.WIDTH, "100%"]]);
    bc.prototype.setId(id + ".inner");
    bc.prototype.setPlaceAt(id);
    bc.toScreen();
    bc = {};
    
    return (id + ".inner");
}

function lookupSetValue(controller) {
    var gridId = controller.listController.view.listId;
    
    var grid = null;
    var editableGrid = null;
    getDijitWidgetById(gridId, function(widget) {
        grid = widget;
    });
    
    if (grid.selection.getSelected().length != 1) {
        showErrorMessageDialog([LANGUAGE.RECORD_LOOKUP_ERROR_SELECT_1_ROW]);
        return false;
    }
    
    var selected = transformListRecord(grid.selection.getSelected()[0]);
    
    for (var element in controller.data.selectionMapping) {
        var toWidget = null;
        
        getDijitWidgetById(controller.data.selectionMapping[element].widgetId, function(widget) {
            toWidget = widget;
        });
        
        var value = selected[controller.data.selectionMapping[element].lookupId];
        getDijitWidgetById(controller.data.selectionMapping[element].gridId, function(widget) {
            editableGrid = widget;
        });
        if (editableGrid != null) {
            var item = editableGrid.getItem(editableGrid.focus.rowIndex);
            if (item[editableGrid.focus.cell.field][0] != value) {
                editableGrid.selection.setSelected(editableGrid.focus.rowIndex, true);
            }
            editableGrid.store.setValue(item, editableGrid.focus.cell.field, value);
        } else {
            toWidget.set('value', value);
        }
    }
    
    if (isFunction(controller.popupSelectionListener)) {
        controller.popupSelectionListener(selected);
    }
    
    return true;
}

function isFunction(functionToCheck) {
    var getType = {};
    return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
}

function transformListRecord(record) {
    var newRecord = {};
    
    for (var item in record) {
        newRecord[item] = record[item][0];
    }
    
    return newRecord;
}

function showErrorMessageDialog(translatedErrors, errorObjects) {
	var message = "";
    for (var i = 0; i < translatedErrors.length; i++) {
    	if(errorObjects != undefined){
    		var error = LANGUAGEFUNCTIONS.getSpecialErrorMessage(translatedErrors[i], errorObjects[i]);
    	} else {
    		var error = translatedErrors[i];
    	}
    	if(error == ""){
    		error = errorObjects[i].error;
    	}
        message = message + "<li>" + error + "</li>";
	}
    
    require(["cefetraWidgets/ErrorDialog"], function(errorDialog) {
        new errorDialog({
            message: message,
            onHide: function() {
                this.destroyRecursive();
            }
        }).show();
    });
}

function showAuthorizationMessage(message) {
    require(["cefetraWidgets/ErrorDialog"], function(errorDialog) {
        new errorDialog({
            message: "<li>" + message + "</li>",
            onHide: function() {
                this.destroyRecursive();
            }
        }).show();
    });
}

function setDialogSearchValues(values, controller) {
    for (var key in values) {
        var currentValue = "";
        getDijitWidgetById(values[key].widgetId, function(widget) {
            currentValue = widget.get("value");
        });
        
        if (currentValue != "") {
            controller.listController.model.getSearchRecord()[values[key].lookupId] = currentValue;
        } else {
            if ('defaultValue' in values[key]) {
                controller.listController.model.getSearchRecord()[values[key].lookupId] = values[key].defaultValue;
            }
        }
    }
    
    publish(controller.listController);
}
;

function addToComboBoxArray(id) {
    _comboboxes.push({
        "tab": id.split(".")[0],
        id: id
    });
}

function publishListener(module, data) {
    require(["dojo/topic"], function(topic) {
        topic.publish(module, {data: data});
    });
}

function subscribe(subscription, controller) {
    require(["dojo/topic"], function(topic) {
        var temp = topic.subscribe(subscription, function(e) {
            controller.setData(e.data);
        });
        _infobusses.push({
            tab: subscription,
            con: temp
        });
    });
}

function getDefaultDateFormat(date) {
    if (date == undefined) {
        date = new Date();
    }
    
    if (typeof date.getMonth != 'function') {
        return date;
    }
    
    if (date.getTime() == -3600000) {
        date = new Date();
    }
    
    var dd = date.getDate().toString();
    var mm = (date.getMonth() + 1).toString();
    var yyyy = date.getFullYear().toString();
    
    if (dd.length == 1) {
        dd = "" + "0" + dd;
    }
    
    if (mm.length == 1) {
        mm = "" + "0" + mm;
    }
    
    return yyyy + "-" + mm + "-" + dd;
}

function getStartupData() {
    var temp = window.startupData;
    delete window.startupData;
    return temp;
}

function setStartupData(data, listController, detailController) {
    if (data == undefined) {
        return;
    }
    
    if (listController != undefined) {
        listController.model.resetSearchRecord();
        for (var key in data.searchRecord) {
            listController.model.getSearchRecord()[key] = data.searchRecord[key];
        }
        publish(listController);
    }
    
    if (detailController != undefined) {
        // TODO
        publish(detailController);
    }

}

function getProductType(comboBox, id) {
    require(["dijit/registry"], function(registry) {
        var prodfam = registry.byId(id);
        var combobox = registry.byId(comboBox);
        
        if (typeof prodfam === "undefined" || typeof combobox === "undefined"){
        	return;
        }
        
        COMBOBOX.CHPTHBL.LOADED = false;
        COMBOBOX.getCHPTHBLComboValues(prodfam.get("value"), function() {
            combobox.store = COMBOBOX.CHPTHBL;
            combobox.loadAndOpenDropDown();
        });
    });
}

function getProductSubType(comboBox, id) {
    require(["dijit/registry"], function(registry) {
        var prodfamval = registry.byId(id).get('value');
        var combobox = registry.byId(comboBox);
        
        COMBOBOX.CHPSTBL.LOADED = false;
        COMBOBOX.getCHPSTBLComboValues(prodfamval, function() {
            combobox.store = COMBOBOX.CHPSTBL;
            combobox.loadAndOpenDropDown();
        });
    });
}

function handleEditableGridFields(controller) {
    getDijitWidgetById(controller.view.listId, function(widget) {
        var grid = widget;
        grid.canEdit = function(cell, row) {
            var current = grid.getItem(row);
            if (((current.lastupdate[0] == "" || current.lastupdatedby == "") && controller.model.editableExtraFields.indexOf(cell.field) > -1) || 
            (current.lastupdate[0] != "" && controller.model.editableFields.indexOf(cell.field) > -1)) {
                return true;
            }
            return false;
        };
    });
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function callHTML(identifier, parentContainer, height, controller, fileNameAbbriv) {
      var view = "modules/" + identifier.replace(/\./g,'/') + parentContainer.split('.')[0] + capitalizeFirstLetter(identifier.split('.')[2]) + "View";
      
      require([view], function(View){
    	  controller.view = new View({id:parentContainer + "." + identifier}).placeAt(parentContainer);
      });
      
}

function createHtmlView(region, listId, containerId) {
    return {
        region: region,
        listId: listId,
        containerId: containerId
    };
}

function setNullValues(obj) {
    for (var objKey in obj) {
        if (objKey.indexOf('null_') != -1) {
            var recordValue = objKey.replace('null_', '');
            
            if (obj[recordValue] == '') {
                obj[objKey] = 'Y';
            } else {
                obj[objKey] = 'N';
            }
            
            if (obj[recordValue] == Number.NaN) {
                obj[objKey] = 'Y';
                obj[recordValue] = 0;
            }
        
        }
    }
    return obj;
}

function addOption(widgetId, displayValue, value) {
    require(["dojo/_base/window"], function(win) {
        getDojoWidgetById(widgetId, function(widget) {
            var option = win.doc.createElement('option');
            option.innerHTML = displayValue;
            option.value = value;
            widget.appendChild(option);
        });
    });
}

function removeAllOptions(id) {
    document.getElementById(id).options.length = 0;
}

function getAllOptions(id) {
    var select = document.getElementById(id);
    var values = [];
    for (var i = 0; i < select.length; i++) {
        values.push(select.options[i].value);
    }
    return values;
}

function getSelectedOptions(id) {
    var select = document.getElementById(id);
    var values = [];
    for (var i = 0; i < select.length; i++) {
        if (select.options[i].selected) {
            values.push({value: select.options[i].value,text: select.options[i].text});
        }
    }
    return values;
}

function removeSelectedOptions(id) {
    var select = document.getElementById(id);
    for (var i = select.options.length; i--; ) {
        if (select.options[i].selected) {
            select.remove(i);
        }
    }
}

function setCallbackMessage(callback, successMessage, iFailedMessage) {
    var failedMessage = iFailedMessage || LANGUAGE.RECORD_SOMETHING_WENT_WRONG;
    if (callback.result == 200) {
        setPageInformation(successMessage, COLOR.GREEN);
    } else {
        setPageInformation(failedMessage, COLOR.RED);
        throw new Error("Oops! Something went wrong.");
    }
}

function updateGridLocalChanges(listController, detail, action) {
    require(["dijit/registry", "cefetraWidgets/ErrorDialog"], function(registry, ErrorDialog) {
        var grid = registry.byId(listController.view.listId);
        var row = grid.getItem(grid.selection.selectedIndex);
        
        if (row === null && action == CONFIG.UPDATE) {
            // Set the information
            new ErrorDialog({
                message: LANGUAGE.PAGEINFORMATION_GRID_NOT_UPDATED_NO_ROW_SELECTED,
                onHide: function() {
                    this.destroyRecursive();
                }
            }).show();
            return;
        }
        
        if (action == CONFIG.UPDATE) {
            for (var item in detail) {
                grid.store.setValue(row, item, detail[item]);
            }
        } else if (action == CONFIG.CREATE) {
            detail["uniqueId"] = listController.model.getListModel().length;
            listController.model.LIST.detail_data.push(detail);
            grid.store.newItem(detail);
        }
    });
}
function getMenu() {
    require(["dojo/request/xhr", "dojo/json", "dijit/registry", "dijit/layout/ContentPane", "cefetraWidgets/CustomMenuItem"], function(xhr, JSON, registry, ContentPane, CustomMenuItem) {
        xhr.post("/core/php/web/WebserviceLocal.php", {
            data: {
                model: {},
                method: "getMenuItems",
                entity: "MENU"
            }
        }).then(function(data) {
            var tempData = null;
            try {
                tempData = JSON.parse(data);
            } catch (exception) {
                tempData = {"result": "403","message": LANGUAGE.CALLBACK_JSON_ERROR};
            }
            
            var ul = document.getElementById("mainmenu");
            
            for (var prop in tempData) {
                // create ul for menu items
                var ulMenuItem = document.createElement("ul"), 
                	  parentLi = document.createElement("li"),
                	  href = document.createElement("a");
                
                href.appendChild(document.createTextNode(prop));
                href.setAttribute("href", "#");
                
                // Set text for main menu item
                parentLi.appendChild(href);
                ul.appendChild(parentLi);
                
                parentLi.appendChild(ulMenuItem);
                
                for (var mi in tempData[prop]) {
                    var childMenuItem = document.createElement("li"),
                    		href = document.createElement("a");
                    
                    href.appendChild(document.createTextNode(tempData[prop][mi].menu_item));
                    href.setAttribute("id", tempData[prop][mi].entity.substr(0, 3) + tempData[prop][mi].entity);
                    href.setAttribute("href", "#");
                    
                    childMenuItem.appendChild(href);
                    ulMenuItem.appendChild(childMenuItem);
                    setMenuAction(tempData[prop][mi]);
                }
                
                for (var mi in tempData[prop]) {
                 addFavoritesMenuItem(tempData[prop][mi].entity.substr(0, 3) + tempData[prop][mi].entity);
                }
            }
            tempData = null; // NEVER EVER REMOVE THIS LINE OTHERWISE THE WHOLE APPLICATION WILL LEAK
        }, function(error) {
            callErrorWebService(error.response);
            tempData = null; // NEVER EVER REMOVE THIS LINE OTHERWISE THE WHOLE APPLICATION WILL LEAK
        });
    });
}

function isWeb() {
    var full = window.location.host;
    var parts = full.split('.');
    var sub = parts[0];
    
    if (sub.indexOf("web") > -1) {
        return true;
    }
    return false;
}

function setMenuAction(menuItem) {
    require(["dojo/dom", "dojo/on"], function(dom, on) {
        if (dom.byId(menuItem.entity.substr(0, 3) + menuItem.entity) != undefined) {
            on(
            		dom.byId(menuItem.entity.substr(0, 3) + menuItem.entity), 
            "click", 
            function(e) {
                var id = menuItem.entity;
                if (detectWidgetAlreadyOpen(id)) {
                    window.startupData = e.data;
                    return;
                };
                
                buildBorderContainer(id, menuItem.link, menuItem.entity);
            });
        }
    });
}

function removeAllPanels() {
    removePanel(centerPanel);
    removePanel(bottomPanel);
    removePanel(rightPanel);
}

function removePanel(id) {
    require(["dijit/registry"], function(registry) {
        var panel = registry.byId(id);
        if (panel) {
            registry.byId(mainLayout).removeChild(panel);
            panel.destroyRecursive();
        }
    });
}

function detectWidgetAlreadyOpen(id) {
	 var open = false;
    require(["dijit/registry"], function(registry) {
        if (typeof registry.byId(id) != "undefined") {
            registry.byId(mainTabContainer).selectChild(id);
            
            if (CONFIG.DEBUG) {
                console.warn("showPanel --> " + id + " is already open.");
            }
            
            open = true;
        }
    });
    return open;
}

function closeWidget(widget) {
    var that = this;
    require(["dijit/registry"], function(registry) {
        for (var i = _connections.length; i--; ) {
            if (that.id == _connections[i].tab) {
                _connections[i].con.remove();
                _connections.splice(i, 1);
            }
        }
        
        for (var i = _contextmenuLinks.length; i--; ) {
            if (that.id == _contextmenuLinks[i].tab) {
                _contextmenuLinks[i].con.remove();
                _contextmenuLinks.splice(i, 1);
            }
        }
        
        for (var i = _contextmenus.length; i--; ) {
            if (that.id == _contextmenus[i].tab) {
                _contextmenus[i].menu.destroyRecursive();
                _contextmenus.splice(i, 1);
            }
        }
        
        for (var i = _lookups.length; i--; ) {
            if (that.id == _lookups[i].tab) {
                if (registry.byId(_lookups[i].id) != undefined) {
                    var lookup = registry.byId(_lookups[i].id);

                    // Delete the lookup's controller
                    if (lookup.controller != undefined) {
                        lookup.controller.destroy();
                        delete lookup.controller;
                    }

                    // Delete the lookup-node from the DOM
                    if (lookup != undefined) {
                        lookup.destroyRecursive();
                    }
                }
                _lookups.splice(i, 1);
            }
        }
        
        for (var i = _infobusses.length; i--; ) {
            if (that.id == _infobusses[i].tab && _infobusses[i].con != undefined) {
                _infobusses[i].con.remove();
                _infobusses.splice(i, 1);
            }
        }
        
        for (var i = _comboboxes.length; i--; ) {
            if (that.id == _comboboxes[i].tab) {
                if (registry.byId(_comboboxes[i].id) != undefined) {
                    registry.byId(_comboboxes[i].id).destroyRecursive();
                }
                _comboboxes.splice(i, 1);
            }
        }
        
        for (var i = _dialogs.length; i--; ) {
            if (that.id == _dialogs[i].tab) {
                if (registry.byId(_dialogs[i].id) != undefined) {
                    registry.byId(_dialogs[i].id)._onKeyDown = null;
                    registry.byId(_dialogs[i].id).destroyRecursive();
                }
                _dialogs.splice(i, 1);
            }
        }
        
        widget.removeChild(that);
        registry.byId(that.id).destroyRecursive();
        var buttons = {"new": true,"save": true,"delete": true,"reset": true,"search": true};
        for (var property in buttons) {
            registry.byId(property + "Button").set("disabled", false);
        }
    });
}

function showPanel(_package, entity, isDetail) {
	var file = "Detail";
	if(isDetail === undefined){
		file = "List";
	}
	
}

function setPlaceholders(id) {
    var html = document.getElementById(id).innerHTML;
    
    var temp = html.match(/{([A-Za-z\d]+)}/gi);
    
    for (var i = 0; i < temp.length; i++) {
        document.getElementById(temp[i]).innerHTML = LANGUAGE[temp[i].substr(1, 
        temp[i].length - 2)];
    }
};

/**
 * Get the properties for the popup window.
 * 
 * @param height
 * The height of the popup window. (NOTE: No 'px' is needed)
 * @param width
 * The width of the popup window. (NOTE: No 'px' is needed)
 * @param sceenId
 * The identification of the popup window
 * @param controller
 * The controller instance in which the popup is triggered. (General purposes)
 * @param event
 * The event that triggers the popup, only used to give the popup a title.
 */
function getPopupProperties(height, width, screenId, controller, title){
	var row = getSelectedRows(controller.id + "grid", true);
	
	if (row === undefined){
		setPageInformation(controller.id, LANGUAGE.SELECT_ONLY_ONE_ROW, COLOR.RED);
		return;
	}
	
	var properties = {
		'popupHeight' : height+'px',
		'popupWidth' : width+'px',
		'style' : {
			'width' : '100%',
			'height' : '100%',
		},
		
		'values' : unBox(row[0]),
		'parentId' : controller.id,
		'parentEntity' : controller.entity,
		'resizable': false,
		'title': (typeof title !== "undefined") ? title : "",
		'screenId' : screenId,
		'controller': controller,
		'newEntity': false,
		'doServiceCall': true
	};
	
	return properties;
};

function unBox(values){
	var returnValues = {};
	for (var key in values) {
		if(isArray(values[key])){
			returnValues[key] = values[key][0];
		}
		
		if(key.substring(0, 1) == "_"){ // dojo un-jsonable data
			delete returnValues[key];
		}
		
	}
	return returnValues;
}

function isArray(obj){
	if( Object.prototype.toString.call( obj ) === '[object Array]' ) {
    return true;
	}
	return false;
}

/**
 * Cleaner function to open a popup.
 * Used in combination with getPopupProperties.
 * 
 * @param props
 * The properties of the popup screen.
 */
function openPopup(props){
	models.getSettingsForEntity(props.controller.entity);
	
	var controller = props.controller;
	
	if(!controller.hasOwnProperty('parentId')){
	    controller.parentId = controller.id;
	}
	
	require(["cefetraWidgets/ConstraintFloatingPane", "dijit/registry", props.screenId, "dojo/domReady!"], function(Dialog, registry, Widget){
		// create the widget and pass the properties
		var widget = new Widget({
    	showDockBar: props.dockBar,
    	style: props.style,
    	// props.parentId gives the direct parent. Root parent is needed to set the bounds for the popup.
    	//parentId: props.parentId,
    	parentId: controller.parentId,
    	directParent: props.parentId,
    	values: props.values,
    	dock: controller.dock,
    	screenId: props.screenId,
    	doServiceCall: props.doServiceCall
    });
		
		var entitySettings = models.getSettingsForEntity(widget.entity);

		var width 	= entitySettings[widget.entity + ".floatingPane." + "width"] 		? entitySettings[widget.entity + ".floatingPane." + "width"].value 		: props.popupWidth;
		var height 	= entitySettings[widget.entity + ".floatingPane." + "height"] 	? entitySettings[widget.entity + ".floatingPane." + "height"].value 	: props.popupHeight;
		var top 		= entitySettings[widget.entity + ".floatingPane." + "top"] 	 		? entitySettings[widget.entity + ".floatingPane." + "top"].value  		: '40px';
		var left 		= entitySettings[widget.entity + ".floatingPane." + "left"] 		? entitySettings[widget.entity + ".floatingPane." + "left"].value 		: '40px';
		
		var newTop = parseInt(top.replace("px", "")) - 40 + "px"; 
		var newLeft = parseInt(left.replace("px", "")) - 205 + "px"; 

		var dialog = new Dialog({
	        title: 		props.title, 
	        content: 	widget,
	        dockTo: 	controller.dock,	// TODO: why 2 docks ?
	        dock: 		controller.dock,
	        region: 	'center',
	        style: 
	        	'position:' + 'absolute' + ';' +
	        	'top:' + newTop + ';' +
	        	'left:' +newLeft  + ';' +
	        	'width:' + width  + ';' +
	        	'height:' + height  + ';' +
	        	'white-space:nowrap' + ';'
		}).placeAt(controller.parentId);
	    dialog.bringToTop();
	    dialog.show();
	    registry.byId(controller.parentId).popupId = dialog.id;
	    
	    if (!controller['lookup']){
	    	controller.dock.openPopups[props.screenId] = dialog.id;
	    }
	    
	    if (props.newEntity){
	    	widget.newAction();
	    }
	    
	    publish(widget);
	});
};

/**
 * Refreshen a popup without destroying it.
 * 
 * @param props
 * The properties of the popup screen.
 */
function refreshPopup(props){
	var id = props.controller.dock.openPopups[props.screenId];
	require(["cefetraWidgets/ConstraintFloatingPane", "dijit/registry", props.screenId, "dojo/domReady!"], function(Dialog, registry, Widget){
		var dialog = registry.byId(id);
		
		dialog.show();
		dialog.bringToTop();
		

		if (typeof dialog != "undefined") {
			var widget = new Widget({
					showDockBar : props.dockBar,
					style : props.style,
					parentId : props.controller.parentId,
					values : props.values,
					dock : props.controller.dock,
					screenId : props.screenId,
		    	doServiceCall: props.doServiceCall
				});
			if (props.newEntity) {
					widget.newAction();
			}

			dialog.set('content', widget);
			
			publish(widget);
		};
		
		/**
		 * // previous listcontroller will get destroyed, and therefor deleted from
		 * the 'openPopups'
		 * if(!props.controller.dock.openPopups.hasOwnProperty(props.screenId)){
		 * props.controller.dock.openPopups[props.screenId] =
		 * props.controller.popupId; }
		 */
	});
};

// TODO
function createCSV(controller){
	var row = getSelectedRows(controller.id + "grid", true);
	
	require(["dijit/registry"], function(registry){
		
		var grid = registry.byId(controller.id + "grid");
		var items = grid.selection.getSelected();
		var structure = getGridStructureForExport(grid.structure);
		structure = encodeURIComponent(JSON.stringify(structure));
		var data = [];
		
    if (items.length) {
        for (var i = 0; i < items.length; i++) {
            var temp = clone(items[i]);
            delete temp._S, temp._RI, temp._0;
            data.push(temp);
        }
        encodeObject(data);

        var htmlObject = document.createElement('div');
				htmlObject.innerHTML = registry.byId(mainTabContainer).selectedChildWidget.title;
				
				post('/core/php/generateCSV.php?title=' + htmlObject.textContent + "&structure=" + JSON.stringify(structure), data);
        window.doNotShowConfirmation = true;
        //document.getElementById("hiddenFormAttr").remove();
        //document.getElementById("csvForm").remove();
    } else {
        // TODO: No rows selected, error msg!
    }
		
		
		
	});
}

function popupResized(e){
	
}

function destroyOnClose(id){
	getDijitWidgetById(id, function(widget){
		_contextmenus.push({
      "tab": id.split('.')[0],
      menu: widget
		});
	});
}

function saveDetailSettings(screen){
	var properties = {};
	var prefixSearchFields 		= "";
	
	// fields
	for (var property in screen.model.getDetailModel()) {
	   var key;
	   var value;
		if (screen.model.getDetailModel().hasOwnProperty(property)) {
    		key = screen.entity + "." + prefixSearchFields + property;
	    	getDijitWidgetById(screen.id + prefixSearchFields + property, function(widget){
	    		if(widget != undefined){
		    		 value = widget.get("value");
		    	   if((typeof value == "number" && !isNaN(value)) || (typeof value == "string" && value != "")){
			    		 addSetting(key,value);
			    	   properties[key] = value;
		    	   } else {
		    	  	 addSetting(key,"");
			    	   properties[key] = "";
		    	   }
	    		}
	    	});
	    }
	}
	
	savePopupProperties(screen, properties);
	
	commitSettings(screen);
}

function saveListSettings(screen, listId){
	if(listId === undefined){ listId = "grid"; };
	
	var prefixSearchFields 		= "search";
	var prefixColumnOrdering 	= "columnPosition";
	var prefixColumnWidth 		= "columnWidth";
	
	var properties = {};
	
	// searchfields
	for (var property in screen.model.getSearchRecord()) {
	   var key;
	   var value;
		if (screen.model.getSearchRecord().hasOwnProperty(property)) {
    		key = screen.entity + "." + prefixSearchFields + property;
	    	getDijitWidgetById(screen.id + prefixSearchFields + property, function(widget){
	    		if(widget != undefined){
		    		value = widget.get("value");
		    	    addSetting(key,value);
		    	    properties[key] = value;
	    		}
	    	});
	    }
	}

	// List settings
	getDijitWidgetById(screen.id + listId, function(widget){
		for (var columnIndex in widget.layout.cells){

			// Column ordering
			var key = screen.entity + "." + prefixColumnOrdering + "." + widget.layout.cells[columnIndex].field;
			var value = columnIndex;
			addSetting(key,value);
			properties[key] = value;
			
			// Column width
			key = screen.entity + "." + prefixColumnWidth + "." + widget.layout.cells[columnIndex].field;
			value =  widget.layout.cells[columnIndex].unitWidth;
			
			if(value.indexOf("%") == -1){ // unmodified columnlength's return percentages (do not save)
				addSetting(key,value);
				properties[key] = value;
			}
		}
	});
	
	savePopupProperties(screen, properties);
	
	commitSettings(screen);
}

function savePopupProperties(screen, properties){
		var floatingPane = screen.domNode.parentNode;
		var tries = 0;
		while((floatingPane['className'] != 'dojoxFloatingPane dijitContentPane dojoxFloatingPaneFg')){
			floatingPane = floatingPane.parentNode;
			tries++;
			if(tries > 5){
				return;
			}
		}
		
		var attributes = ['top', 'left', 'width', 'height'];
		for (var i = 0; i < attributes.length; i++) {
			var key = screen.entity + ".floatingPane." + attributes[i];
			var value = floatingPane.style[attributes[i]];
			addSetting(key,value);
			properties[key] = value;
		}

}

function addSetting(key,value){
	window.models.updateSettings([{'key' : key, 'value' : value}]);
};

function commitSettings(controller){
	callWebservice("isettingsservice", "saveSettings", [window.models.getSettingsToCommit(), window.models.getProgramReturnRec()], "SettingsService", controller, 'saveSettingsCallback');
};

function setListSettings(controller){
	var entitySettings = models.getSettingsForEntity(controller.entity);
	
	// do not set the default search fields when the widget is a lookup
	if (!controller.lookup){
		// set search fields
	    for (var element in controller.model.getSearchRecord()){
	 	   if(entitySettings[controller.entity + ".search" + element] != undefined){
	 		   controller.model.KEY_BEGIN[element] = entitySettings[controller.entity + ".search" + element].value;
		   }
	    }
	}
    // set grid
    getDijitWidgetById(controller.id + "grid", function(widget){
    	if(widget === undefined){
        console.log(controller.id + "grid is undefined!" );
        return;
    	}
    	var nrOfColumns = widget.structure[0].cells[0].length;
    	var newStructure = new Array(nrOfColumns);
    	var structureset = false;
      
      // check if entitySettings - columnWidth contain just 'nrOfColumns' items (if not, do not apply settings)
      var nrOfSavedColumns = 0;
      for(var setting in entitySettings){
	  	 if(setting.includes(".columnPosition.")){
	  		 nrOfSavedColumns++;
	  	 }
      }
      
      if(nrOfSavedColumns != nrOfColumns){
      	if(nrOfSavedColumns > 0){
        	console.log("Settings flush for " + controller.entity + " is recommended. Settings are ignored due to changed columns. (saved: " + nrOfSavedColumns + " / found: " + nrOfColumns + ")");
      	}
      	return;
      }
      
    	for (var i = 0; i < widget.layout.cells.length; i++) {
    		var fieldName = widget.layout.cells[i].field;
    		for(var setting in entitySettings){
    			if(controller.entity + ".columnWidth." + fieldName == setting){
    				 widget.structure[0].cells[0][i].unitWidth = entitySettings[setting].value;
    				 widget.structure[0].cells[0][i].width = entitySettings[setting].value;
    			}
    			
    			if(controller.entity + ".columnPosition." + fieldName == setting){
    				var index = entitySettings[setting].value;
    				newStructure[index] = widget.structure[0].cells[0][i];
    				structureset = true;
    			}
    		}
    		widget.layout.cells[i].view.update();
		}
    	if(structureset){
    		// Check if structure contains an undefined column
    		for (var i = 0, l = newStructure.length; i < l; i++) {
    	    if (typeof(newStructure[i])=='undefined') {
          	console.log("Settings flush for " + controller.entity + " is recommended. Settings are ignored due to changed field at index " + i + ".");
          	return;    	    };
    		};  
    	
    		widget.set('structure', newStructure);
    	}
    });
};

function _____doNew(controller){
	doNewAction(controller);
	return;
	
    require(["dijit/registry"], function(registry) {
		
    	// Set action create
    	controller.model.action = CONFIG.CREATE;
    	
		// Get a default model
		var model = controller.model.getEmptyModel();
		
		// Set defaults from record
		for (var item in model) {
	        if (model.hasOwnProperty(item)) {
	            var field = registry.byId(controller.id + item);
	            if(field != undefined){
	            	field.set("value", model[item]);
	            }
	         }
	     };
		
		// Set defaults from settings
	 	setDetailSettings(controller);
	 	
	});
}

function setDetailSettings(screen){
	// TODO
};


function setComboboxDefaultValue(subcombo){
	var widgetId = subcombo.INITIALCOMBOBOX;
	var widget = null;
	getDijitWidgetById(widgetId, function(w){ 
		widget = w;	
	});
	
	if(widget != undefined && widget.domNode.getAttribute('iv') != undefined){
		widget.set('item', widget.store.get(widget.domNode.getAttribute('iv')));
	}
	
	if(subcombo.INITIALController.comboLoaded != undefined){
		subcombo.INITIALController.comboLoaded();
	}
};

function setNewDataInWidget(searchValue, instances, resultSet, entity){
	var widget = null;
	
	for(var prop in instances){
		if(instances[prop] == searchValue){
			var widgetId = prop;
			
			require(["dijit/registry"], function(registry) {
				widget = registry.byId(widgetId);
				
		    // check widget.dependencies
		    console.log(entity);
		    if(typeof widget.dependencies != 'undefined')
				for (var i = 0; i < widget.dependencies.length; i++) {
					if(widget.dependencies[i].method.indexOf(entity) != -1){
			  		var dependentWidget = registry.byId(widget.dependencies[i].id);
			  		dependentWidget.store = resultSet;
			  		dependentWidget.set("value", dependentWidget.domNode.getAttribute("iv"));
			  		dependentWidget.domNode.removeAttribute("iv");
				}
			}
		  });
			delete instances[prop];
		}
	}
};

function getValueByFieldRecursive(data, field){
	if (typeof data === "object" || isArray(data)){		
		for (var val in data){
			if (data[val].hasOwnProperty(field)){
				return data[val][field];
			} 
			if (getValueByFieldRecursive(data[val], field) != undefined){
				return getValueByFieldRecursive(data[val], field);
			} 
			getValueByFieldRecursive(data[val], field);
		}
	}
}

function setModelValueRecursive(model, data){
	if (typeof data === "object" || isArray(data)){		
		for (var val in data){
			if (data[val].hasOwnProperty(field)){
				model[field] = data[val][field];
				return model;
			} 
			if (setModelValueRecursive(data[val], field) != undefined){
				setModelValueRecursive(data[val], field);
				return model;
			} 
			setModelValueRecursive(data[val], field);
			return model;
		}
	}
	return model;
}

function setValueKeepType(from, to){
	if(typeof from == "number"){
		if(to == ""){
			return 0;
		}
		return parseFloat(to);
	}
	
	return to;
}

function calculateAddSubstract(posNums, negNums, precision){
	var result = 0;
	
	// Handle positive numbers
	if(posNums.length != undefined){
		for(var i = 0; i < posNums.length; i++){
			result = Number(result + posNums[i]).toFixed(precision);
		}
	}else{
		result = Number(result + posNums).toFixed(precision);
	}
	
	// Handle negative numbers
	if(negNums.length != undefined){
		for(var i = 0; i < negNums.length; i++){
			result = Number(result - negNums[i]).toFixed(precision);
		}
	}else{
		result = Number(result - negNums).toFixed(precision);
	}
	
	return Number(result).toFixed(precision);
}

function deepTrim(obj) {
    for (var prop in obj) {
        var value = obj[prop], type = typeof value;
        if (value != null && (type == "string" || type == "object") && obj.hasOwnProperty(prop)) {
            if (type == "object") {
                deepTrim(obj[prop]);
            } else {
            	obj[prop] != ' ' && (obj[prop] = obj[prop].trim());
            }
        }
    }
}

function createChart(data){
	require(["dijit/registry",
	         "dojox/charting/Chart", 
	         "dojox/charting/axis2d/Default", 
	         "dojox/charting/plot2d/"+data.type, 
	         "dojox/charting/themes/PlotKit/green", 
	         "dojox/charting/themes/PlotKit/blue", 
	         "dojox/charting/action2d/MoveSlice",
	         "dojox/charting/widget/SelectableLegend",
	         "dojox/charting/widget/Legend",
	        ],
	    function(registry, Chart, Default, ChartType, green, blue, MoveSlice, SelectableLegend, Legend){
			  var target = document.getElementById(data.targetId);
			  target.innerHTML = "";
			  
			  var chart = new Chart(data.targetId);
		      chart.addPlot("default", {type: ChartType});
		      chart.setTheme(blue);
		      chart.addAxis("x", {
		    	  min: 0,
		    	  majorTickStep: 1,
		    	  minorTickStep: 1,
		          labels: data.labels,
		          fixUpper: "major"
		      } );
		      chart.addAxis("y", {
		    	  vertical: true, 
		    	  natural: true, 
		    	  dropLabels: true, 
		    	  majorTickStep: 0,
		    	  minorTickStep: 0,
		    	  });
		      
		      if(data.type == "Pie"){
		    	// Create array of data
		    	  var result = new Array();
			      for (var serie in data.data) {
			    	  result.push(data.data[serie]);
				      chart.addSeries(serie, result);
			      }
		    	  
		      }
			      
		      if(data.type == "ClusteredBars"){
			      for (var serie in data.data) {
			    	  if( Object.prototype.toString.call( data.data ) === '[object Array]' ) {
					     	chart.addSeries(serie, data.data[serie]);
			    		} else {
						     chart.addSeries(serie, [data.data[serie]]);
			    		}
			      }
		      }
		      
		      new MoveSlice(chart,"default");
		      chart.render();
		      
		      if(data.legendId){
				  var legendTarget = registry.byId(data.legendId+"_child");
				  if(legendTarget != null){
					  legendTarget.destroyRecursive();
				  }
				  
			      var legend = document.getElementById(data.legendId);
			      var legendChild = document.createElement("div");
			      legendChild.id = data.legendId + "_child";
			      legend.appendChild(legendChild);
			      
		    	  new SelectableLegend({
		              chart: chart,
		              outline: false,
		              horizontal: false
		          }, data.legendId + "_child");
		      }
	});
}
