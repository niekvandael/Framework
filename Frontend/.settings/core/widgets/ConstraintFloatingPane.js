/**
 * CREATED BY NVD ON 19 Jun 2014 16:24:44

 * Package    : core/widgets
 * Filename   : ConstraintFloatingPane.js
*/

define([
    'dojo/_base/declare', 
    'dojox/layout/FloatingPane',
    'dijit/_WidgetsInTemplateMixin',
    'dojo/dnd/move',
    'dojo/_base/html',
    "dojo/dom",
    "dojo/dom-style",
    "dojo/on",
    "dojo/keys",
    "dojo/_base/lang",
    "dojo/dom-geometry",
    "dojo/_base/fx",
    "dijit/registry",
    "dojo/window"
], function(declare,  FloatingPane, _WidgetsInTemplateMixin, move, html, dom, style, on, keys, lang, domGeom, baseFx, registry, windowUtil){
	return declare('custom.ConstraintFloatingPane', [FloatingPane, _WidgetsInTemplateMixin], {
		resizable: true,
		ownSize: null,
		maxable: true,
		
		postCreate: function() {
      this.inherited(arguments);
      this.moveable = new move.parentConstrainedMoveable (this.domNode, {
      	handle: this.focusNode,
      	area: 'content',
      	within: true,
        constraints: function() {
          return html.coords(dom.ById('container'));
        }
      });
     
      style.set(this.domNode, 'max-height', parseInt(style.get(registry.byId('mainTabContainer').selectedChildWidget.domNode.children[2], 'height') - 10) + 'px');
      style.set(this.domNode, 'max-width', parseInt(style.get(registry.byId('mainTabContainer').selectedChildWidget.domNode.children[2], 'width') - 10) + 'px');
      
      this.own(on(this.domNode, 'keyup', lang.hitch(this, "handleKeys")));
      this.own(on(this.domNode, 'mouseup', lang.hitch(this, "handleMove")));
		},
		
		resize: function(oldValue){
			this.inherited(arguments);
			if (this.containerNode.clientWidth <= 0 && !this._isDocked && !oldValue){
				this.resize(this.ownSize);
			} else{
				this.getNewSize();
			}
		},
		
		getNewSize: function(){
			var axis = html.marginBox(this.domNode);
			var contentBox = domGeom.getContentBox(this.domNode);
			if (axis.l > 0 && axis.t > 0 && contentBox.w > 0 && contentBox.h > 0){
				this.ownSize = {x:axis.l, y:axis.t, w: contentBox.w, h: contentBox.h};
			}
		},
		
		handleMove: function(){
			this.getNewSize();
		},
		
		bringToTop: function(e){
			this.inherited(arguments);
			if (!this.focused){
				this.setFocus(this.content.id);
				if(e != undefined){
					e.stopPropagation();
					e.preventDefault();
				}

			}
		},
		
		show: function(){
			// Default show function overridden due to a bug fix
			
			baseFx.fadeIn({node:this.domNode, duration:this.duration,
				beforeBegin: lang.hitch(this,function(){
					this.domNode.style.display = "";
					this.domNode.style.visibility = "visible";
					if (this.dockTo && this.dockable) { this.dockTo._positionDock(null); }
					if (typeof callback == "function") { callback(); }
					this._isDocked = false;
					if (this._dockNode) {
						this._dockNode.destroy();
						this._dockNode = null;
					}
				})
			}).play();
			
			// BUGFIX: The position of the popup is not the same when you reopen a popup
			var axis = html.marginBox(this.domNode);
			var contentBox = domGeom.getContentBox(this.domNode);
			this.resize({x:axis.l, y:axis.t, w: contentBox.w, h: contentBox.h});
			// end of BUGFIX
			this._onShow(); // lazy load trigger
			this.setFocus(this.content.id);
		},
		
		startup: function(){
			this.inherited(arguments);
			// use following line if you want a min-width/height setting per screen
			this._resizeHandle.set("minSize", {'w':100,'h':100});
		},
		
		handleKeys: function(e){
			var charOrCode = e.charCode || e.keyCode;
  		if(keys.ESCAPE !== charOrCode){
  			return;
  		}
  		this.destroyRecursive();
		},
		
		setFocus: function(controllerId){
			var widget = registry.byId(controllerId);
			
			if (widget && widget.setFocusLastFocusedWidget){
      	registry.byId(controllerId).setFocusLastFocusedWidget();
      }
		},
		
		maximize: function(){
			this.inherited(arguments);
			var newWindow = windowUtil.getBox();
			newWindow.h = parseInt(style.get(registry.byId('mainTabContainer').selectedChildWidget.domNode.children[2], 'height') - 10);
			newWindow.w = parseInt(style.get(registry.byId('mainTabContainer').selectedChildWidget.domNode.children[2], 'width') - 10);
			this.resize(newWindow);
		},
		
		uninitialize: function(){
			// on a lookup(detail) a dock is not defined
			if (this["dock"]){
				var screenId = this.content.screenId;
				var openPopups = this.dock.openPopups;
				
				if(screenId in openPopups){
					delete openPopups[screenId];
				}
			}
			
			// when it's a main view no parentId will be available. Normally this is impossible because this widget will create a popup
			if (this.content["directParent"]){
				this.setFocus(this.content.directParent);
			}
			this.inherited(arguments);
		}
	});
});