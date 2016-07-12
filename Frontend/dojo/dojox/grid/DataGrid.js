 /*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/

/*
	This is an optimized version of Dojo, built for deployment and not for
	development. To get sources and documentation, please visit:

		http://dojotoolkit.org
*/

//>>built
require({cache: {"dojo/string": function() {
            define(["./_base/kernel", "./_base/lang"], function(_1, _2) {
                var _3 = /[&<>'"\/]/g;
                var _4 = {"&": "&amp;","<": "&lt;",">": "&gt;","\"": "&quot;","'": "&#x27;","/": "&#x2F;"};
                var _5 = {};
                _2.setObject("dojo.string", _5);
                _5.escape = function(_6) {
                    if (!_6) {
                        return "";
                    }
                    return _6.replace(_3, function(c) {
                        return _4[c];
                    });
                };
                _5.rep = function(_7, _8) {
                    if (_8 <= 0 || !_7) {
                        return "";
                    }
                    var _9 = [];
                    for (; ; ) {
                        if (_8 & 1) {
                            _9.push(_7);
                        }
                        if (!(_8 >>= 1)) {
                            break;
                        }
                        _7 += _7;
                    }
                    return _9.join("");
                };
                _5.pad = function(_a, _b, ch, _c) {
                    if (!ch) {
                        ch = "0";
                    }
                    var _d = String(_a), _e = _5.rep(ch, Math.ceil((_b - _d.length) / ch.length));
                    return _c ? _d + _e : _e + _d;
                };
                _5.substitute = function(_f, map, _10, _11) {
                    _11 = _11 || _1.global;
                    _10 = _10 ? _2.hitch(_11, _10) : function(v) {
                        return v;
                    };
                    return _f.replace(/\$\{([^\s\:\}]+)(?:\:([^\s\:\}]+))?\}/g, function(_12, key, _13) {
                        var _14 = _2.getObject(key, false, map);
                        if (_13) {
                            _14 = _2.getObject(_13, false, _11).call(_11, _14, key);
                        }
                        return _10(_14, key).toString();
                    });
                };
                _5.trim = String.prototype.trim ? _2.trim : function(str) {
                    str = str.replace(/^\s+/, "");
                    for (var i = str.length - 1; i >= 0; i--) {
                        if (/\S/.test(str.charAt(i))) {
                            str = str.substring(0, i + 1);
                            break;
                        }
                    }
                    return str;
                };
                return _5;
            });
        },"dijit/a11y": function() {
            define(["dojo/_base/array", "dojo/dom", "dojo/dom-attr", "dojo/dom-style", "dojo/_base/lang", "dojo/sniff", "./main"], function(_15, dom, _16, _17, _18, has, _19) {
                var _1a;
                var _1b = {_isElementShown: function(_1c) {
                        var s = _17.get(_1c);
                        return (s.visibility != "hidden") && (s.visibility != "collapsed") && (s.display != "none") && (_16.get(_1c, "type") != "hidden");
                    },hasDefaultTabStop: function(_1d) {
                        switch (_1d.nodeName.toLowerCase()) {
                            case "a":
                                return _16.has(_1d, "href");
                            case "area":
                            case "button":
                            case "input":
                            case "object":
                            case "select":
                            case "textarea":
                                return true;
                            case "iframe":
                                var _1e;
                                try {
                                    var _1f = _1d.contentDocument;
                                    if ("designMode" in _1f && _1f.designMode == "on") {
                                        return true;
                                    }
                                    _1e = _1f.body;
                                } catch (e1) {
                                    try {
                                        _1e = _1d.contentWindow.document.body;
                                    } catch (e2) {
                                        return false;
                                    }
                                }
                                return _1e && (_1e.contentEditable == "true" || (_1e.firstChild && _1e.firstChild.contentEditable == "true"));
                            default:
                                return _1d.contentEditable == "true";
                        }
                    },effectiveTabIndex: function(_20) {
                        if (_16.get(_20, "disabled")) {
                            return _1a;
                        } else {
                            if (_16.has(_20, "tabIndex")) {
                                return +_16.get(_20, "tabIndex");
                            } else {
                                return _1b.hasDefaultTabStop(_20) ? 0 : _1a;
                            }
                        }
                    },isTabNavigable: function(_21) {
                        return _1b.effectiveTabIndex(_21) >= 0;
                    },isFocusable: function(_22) {
                        return _1b.effectiveTabIndex(_22) >= -1;
                    },_getTabNavigable: function(_23) {
                        var _24, _25, _26, _27, _28, _29, _2a = {};
                        function _2b(_2c) {
                            return _2c && _2c.tagName.toLowerCase() == "input" && _2c.type && _2c.type.toLowerCase() == "radio" && _2c.name && _2c.name.toLowerCase();
                        }
                        ;
                        var _2d = _1b._isElementShown, _2e = _1b.effectiveTabIndex;
                        var _2f = function(_30) {
                            for (var _31 = _30.firstChild; _31; _31 = _31.nextSibling) {
                                if (_31.nodeType != 1 || (has("ie") <= 9 && _31.scopeName !== "HTML") || !_2d(_31)) {
                                    continue;
                                }
                                var _32 = _2e(_31);
                                if (_32 >= 0) {
                                    if (_32 == 0) {
                                        if (!_24) {
                                            _24 = _31;
                                        }
                                        _25 = _31;
                                    } else {
                                        if (_32 > 0) {
                                            if (!_26 || _32 < _27) {
                                                _27 = _32;
                                                _26 = _31;
                                            }
                                            if (!_28 || _32 >= _29) {
                                                _29 = _32;
                                                _28 = _31;
                                            }
                                        }
                                    }
                                    var rn = _2b(_31);
                                    if (_16.get(_31, "checked") && rn) {
                                        _2a[rn] = _31;
                                    }
                                }
                                if (_31.nodeName.toUpperCase() != "SELECT") {
                                    _2f(_31);
                                }
                            }
                        };
                        if (_2d(_23)) {
                            _2f(_23);
                        }
                        function rs(_33) {
                            return _2a[_2b(_33)] || _33;
                        }
                        ;
                        return {first: rs(_24),last: rs(_25),lowest: rs(_26),highest: rs(_28)};
                    },getFirstInTabbingOrder: function(_34, doc) {
                        var _35 = _1b._getTabNavigable(dom.byId(_34, doc));
                        return _35.lowest ? _35.lowest : _35.first;
                    },getLastInTabbingOrder: function(_36, doc) {
                        var _37 = _1b._getTabNavigable(dom.byId(_36, doc));
                        return _37.last ? _37.last : _37.highest;
                    }};
                1 && _18.mixin(_19, _1b);
                return _1b;
            });
        },"dojo/dnd/autoscroll": function() {
            define(["../_base/lang", "../sniff", "../_base/window", "../dom-geometry", "../dom-style", "../window"], function(_38, has, win, _39, _3a, _3b) {
                var _3c = {};
                _38.setObject("dojo.dnd.autoscroll", _3c);
                _3c.getViewport = _3b.getBox;
                _3c.V_TRIGGER_AUTOSCROLL = 32;
                _3c.H_TRIGGER_AUTOSCROLL = 32;
                _3c.V_AUTOSCROLL_VALUE = 16;
                _3c.H_AUTOSCROLL_VALUE = 16;
                var _3d, doc = win.doc, _3e = Infinity, _3f = Infinity;
                _3c.autoScrollStart = function(d) {
                    doc = d;
                    _3d = _3b.getBox(doc);
                    var _40 = win.body(doc).parentNode;
                    _3e = Math.max(_40.scrollHeight - _3d.h, 0);
                    _3f = Math.max(_40.scrollWidth - _3d.w, 0);
                };
                _3c.autoScroll = function(e) {
                    var v = _3d || _3b.getBox(doc), _41 = win.body(doc).parentNode, dx = 0, dy = 0;
                    if (e.clientX < _3c.H_TRIGGER_AUTOSCROLL) {
                        dx = -_3c.H_AUTOSCROLL_VALUE;
                    } else {
                        if (e.clientX > v.w - _3c.H_TRIGGER_AUTOSCROLL) {
                            dx = Math.min(_3c.H_AUTOSCROLL_VALUE, _3f - _41.scrollLeft);
                        }
                    }
                    if (e.clientY < _3c.V_TRIGGER_AUTOSCROLL) {
                        dy = -_3c.V_AUTOSCROLL_VALUE;
                    } else {
                        if (e.clientY > v.h - _3c.V_TRIGGER_AUTOSCROLL) {
                            dy = Math.min(_3c.V_AUTOSCROLL_VALUE, _3e - _41.scrollTop);
                        }
                    }
                    window.scrollBy(dx, dy);
                };
                _3c._validNodes = {"div": 1,"p": 1,"td": 1};
                _3c._validOverflow = {"auto": 1,"scroll": 1};
                _3c.autoScrollNodes = function(e) {
                    var b, t, w, h, rx, ry, dx = 0, dy = 0, _42, _43;
                    for (var n = e.target; n; ) {
                        if (n.nodeType == 1 && (n.tagName.toLowerCase() in _3c._validNodes)) {
                            var s = _3a.getComputedStyle(n), _44 = (s.overflow.toLowerCase() in _3c._validOverflow), _45 = (s.overflowX.toLowerCase() in _3c._validOverflow), _46 = (s.overflowY.toLowerCase() in _3c._validOverflow);
                            if (_44 || _45 || _46) {
                                b = _39.getContentBox(n, s);
                                t = _39.position(n, true);
                            }
                            if (_44 || _45) {
                                w = Math.min(_3c.H_TRIGGER_AUTOSCROLL, b.w / 2);
                                rx = e.pageX - t.x;
                                if (has("webkit") || has("opera")) {
                                    rx += win.body().scrollLeft;
                                }
                                dx = 0;
                                if (rx > 0 && rx < b.w) {
                                    if (rx < w) {
                                        dx = -w;
                                    } else {
                                        if (rx > b.w - w) {
                                            dx = w;
                                        }
                                    }
                                    _42 = n.scrollLeft;
                                    n.scrollLeft = n.scrollLeft + dx;
                                }
                            }
                            if (_44 || _46) {
                                h = Math.min(_3c.V_TRIGGER_AUTOSCROLL, b.h / 2);
                                ry = e.pageY - t.y;
                                if (has("webkit") || has("opera")) {
                                    ry += win.body().scrollTop;
                                }
                                dy = 0;
                                if (ry > 0 && ry < b.h) {
                                    if (ry < h) {
                                        dy = -h;
                                    } else {
                                        if (ry > b.h - h) {
                                            dy = h;
                                        }
                                    }
                                    _43 = n.scrollTop;
                                    n.scrollTop = n.scrollTop + dy;
                                }
                            }
                            if (dx || dy) {
                                return;
                            }
                        }
                        try {
                            n = n.parentNode;
                        } catch (x) {
                            n = null;
                        }
                    }
                    _3c.autoScroll(e);
                };
                return _3c;
            });
        },"dojox/grid/_View": function() {
            define(["dojo", "dijit/registry", "../main", "dojo/_base/declare", "dojo/_base/array", "dojo/_base/lang", "dojo/_base/connect", "dojo/_base/sniff", "dojo/query", "dojo/_base/window", "dojo/text!./resources/View.html", "dojo/dnd/Source", "dijit/_Widget", "dijit/_TemplatedMixin", "dojox/html/metrics", "./util", "dojo/_base/html", "./_Builder", "dojo/dnd/Avatar", "dojo/dnd/Manager"], function(_47, _48, _49, _4a, _4b, _4c, _4d, has, _4e, win, _4f, _50, _51, _52, _53, _54, _55, _56, _57, _58) {
                var _59 = function(_5a, _5b) {
                    return _5a.style.cssText == undefined ? _5a.getAttribute("style") : _5a.style.cssText;
                };
                var _5c = _4a("dojox.grid._View", [_51, _52], {defaultWidth: "18em",viewWidth: "",templateString: _4f,classTag: "dojoxGrid",marginBottom: 0,rowPad: 2,_togglingColumn: -1,_headerBuilderClass: _56._HeaderBuilder,_contentBuilderClass: _56._ContentBuilder,postMixInProperties: function() {
                        this.rowNodes = {};
                    },postCreate: function() {
                        this.connect(this.scrollboxNode, "onscroll", "doscroll");
                        _54.funnelEvents(this.contentNode, this, "doContentEvent", ["mouseover", "mouseout", "click", "dblclick", "contextmenu", "mousedown"]);
                        _54.funnelEvents(this.headerNode, this, "doHeaderEvent", ["dblclick", "mouseover", "mouseout", "mousemove", "mousedown", "click", "contextmenu"]);
                        this.content = new this._contentBuilderClass(this);
                        this.header = new this._headerBuilderClass(this);
                        if (!this.grid.isLeftToRight()) {
                            this.headerNodeContainer.style.width = "";
                        }
                    },destroy: function() {
                        _55.destroy(this.headerNode);
                        delete this.headerNode;
                        for (var i in this.rowNodes) {
                            this._cleanupRowWidgets(this.rowNodes[i]);
                            _55.destroy(this.rowNodes[i]);
                        }
                        this.rowNodes = {};
                        if (this.source) {
                            this.source.destroy();
                        }
                        this.inherited(arguments);
                    },focus: function() {
                        if (has("ie") || has("webkit") || has("opera")) {
                            this.hiddenFocusNode.focus();
                        } else {
                            this.scrollboxNode.focus();
                        }
                    },setStructure: function(_5d) {
                        var vs = (this.structure = _5d);
                        if (vs.width && !isNaN(vs.width)) {
                            this.viewWidth = vs.width + "em";
                        } else {
                            this.viewWidth = vs.width || (vs.noscroll ? "auto" : this.viewWidth);
                        }
                        this._onBeforeRow = vs.onBeforeRow || function() {
                        };
                        this._onAfterRow = vs.onAfterRow || function() {
                        };
                        this.noscroll = vs.noscroll;
                        if (this.noscroll) {
                            this.scrollboxNode.style.overflow = "hidden";
                        }
                        this.simpleStructure = Boolean(vs.cells.length == 1);
                        this.testFlexCells();
                        this.updateStructure();
                    },_cleanupRowWidgets: function(_5e) {
                        if (_5e) {
                            _4b.forEach(_4e("[widgetId]", _5e).map(_48.byNode), function(w) {
                                if (w._destroyOnRemove) {
                                    w.destroy();
                                    delete w;
                                } else {
                                    if (w.domNode && w.domNode.parentNode) {
                                        w.domNode.parentNode.removeChild(w.domNode);
                                    }
                                }
                            });
                        }
                    },onBeforeRow: function(_5f, _60) {
                        this._onBeforeRow(_5f, _60);
                        if (_5f >= 0) {
                            this._cleanupRowWidgets(this.getRowNode(_5f));
                        }
                    },onAfterRow: function(_61, _62, _63) {
                        this._onAfterRow(_61, _62, _63);
                        var g = this.grid;
                        _4b.forEach(_4e(".dojoxGridStubNode", _63), function(n) {
                            if (n && n.parentNode) {
                                var lw = n.getAttribute("linkWidget");
                                var _64 = window.parseInt(_55.attr(n, "cellIdx"), 10);
                                var _65 = g.getCell(_64);
                                var w = _48.byId(lw);
                                if (w) {
                                    n.parentNode.replaceChild(w.domNode, n);
                                    if (!w._started) {
                                        w.startup();
                                    }
                                    _47.destroy(n);
                                } else {
                                    n.innerHTML = "";
                                }
                            }
                        }, this);
                    },testFlexCells: function() {
                        this.flexCells = false;
                        for (var j = 0, row; (row = this.structure.cells[j]); j++) {
                            for (var i = 0, _66; (_66 = row[i]); i++) {
                                _66.view = this;
                                this.flexCells = this.flexCells || _66.isFlex();
                            }
                        }
                        return this.flexCells;
                    },updateStructure: function() {
                        this.header.update();
                        this.content.update();
                    },getScrollbarWidth: function() {
                        var _67 = this.hasVScrollbar();
                        var _68 = _55.style(this.scrollboxNode, "overflow");
                        if (this.noscroll || !_68 || _68 == "hidden") {
                            _67 = false;
                        } else {
                            if (_68 == "scroll") {
                                _67 = true;
                            }
                        }
                        return (_67 ? _53.getScrollbar().w : 0);
                    },getColumnsWidth: function() {
                        var h = this.headerContentNode;
                        return h && h.firstChild ? (h.firstChild.offsetWidth || _55.style(h.firstChild, "width")) : 0;
                    },setColumnsWidth: function(_69) {
                        this.headerContentNode.firstChild.style.width = _69 + "px";
                        if (this.viewWidth) {
                            this.viewWidth = _69 + "px";
                        }
                    },getWidth: function() {
                        return this.viewWidth || (this.getColumnsWidth() + this.getScrollbarWidth()) + "px";
                    },getContentWidth: function() {
                        return Math.max(0, _55._getContentBox(this.domNode).w - this.getScrollbarWidth()) + "px";
                    },render: function() {
                        this.scrollboxNode.style.height = "";
                        this.renderHeader();
                        if (this._togglingColumn >= 0) {
                            this.setColumnsWidth(this.getColumnsWidth() - this._togglingColumn);
                            this._togglingColumn = -1;
                        }
                        var _6a = this.grid.layout.cells;
                        var _6b = _4c.hitch(this, function(_6c, _6d) {
                            !this.grid.isLeftToRight() && (_6d = !_6d);
                            var inc = _6d ? -1 : 1;
                            var idx = this.header.getCellNodeIndex(_6c) + inc;
                            var _6e = _6a[idx];
                            while (_6e && _6e.getHeaderNode() && _6e.getHeaderNode().style.display == "none") {
                                idx += inc;
                                _6e = _6a[idx];
                            }
                            if (_6e) {
                                return _6e.getHeaderNode();
                            }
                            return null;
                        });
                        if (this.grid.columnReordering && this.simpleStructure) {
                            if (this.source) {
                                this.source.destroy();
                            }
                            var _6f = "dojoxGrid_bottomMarker";
                            var _70 = "dojoxGrid_topMarker";
                            if (this.bottomMarker) {
                                _55.destroy(this.bottomMarker);
                            }
                            this.bottomMarker = _55.byId(_6f);
                            if (this.topMarker) {
                                _55.destroy(this.topMarker);
                            }
                            this.topMarker = _55.byId(_70);
                            if (!this.bottomMarker) {
                                this.bottomMarker = _55.create("div", {"id": _6f,"class": "dojoxGridColPlaceBottom"}, win.body());
                                this._hide(this.bottomMarker);
                                this.topMarker = _55.create("div", {"id": _70,"class": "dojoxGridColPlaceTop"}, win.body());
                                this._hide(this.topMarker);
                            }
                            this.arrowDim = _55.contentBox(this.bottomMarker);
                            var _71 = _55.contentBox(this.headerContentNode.firstChild.rows[0]).h;
                            this.source = new _50(this.headerContentNode.firstChild.rows[0], {horizontal: true,accept: ["gridColumn_" + this.grid.id],viewIndex: this.index,generateText: false,onMouseDown: _4c.hitch(this, function(e) {
                                    this.header.decorateEvent(e);
                                    if ((this.header.overRightResizeArea(e) || this.header.overLeftResizeArea(e)) && this.header.canResize(e) && !this.header.moveable) {
                                        this.header.beginColumnResize(e);
                                    } else {
                                        if (this.grid.headerMenu) {
                                            this.grid.headerMenu.onCancel(true);
                                        }
                                        if (e.button === (has("ie") < 9 ? 1 : 0)) {
                                            _50.prototype.onMouseDown.call(this.source, e);
                                        }
                                    }
                                }),onMouseOver: _4c.hitch(this, function(e) {
                                    var src = this.source;
                                    if (src._getChildByEvent(e)) {
                                        _50.prototype.onMouseOver.apply(src, arguments);
                                    }
                                }),_markTargetAnchor: _4c.hitch(this, function(_72) {
                                    var src = this.source;
                                    if (src.current == src.targetAnchor && src.before == _72) {
                                        return;
                                    }
                                    if (src.targetAnchor && _6b(src.targetAnchor, src.before)) {
                                        src._removeItemClass(_6b(src.targetAnchor, src.before), src.before ? "After" : "Before");
                                    }
                                    _50.prototype._markTargetAnchor.call(src, _72);
                                    var _73 = _72 ? src.targetAnchor : _6b(src.targetAnchor, src.before);
                                    var _74 = 0;
                                    if (!_73) {
                                        _73 = src.targetAnchor;
                                        _74 = _55.contentBox(_73).w + this.arrowDim.w / 2 + 2;
                                    }
                                    var pos = _55.position(_73, true);
                                    var _75 = Math.floor(pos.x - this.arrowDim.w / 2 + _74);
                                    _55.style(this.bottomMarker, "visibility", "visible");
                                    _55.style(this.topMarker, "visibility", "visible");
                                    _55.style(this.bottomMarker, {"left": _75 + "px","top": (_71 + pos.y) + "px"});
                                    _55.style(this.topMarker, {"left": _75 + "px","top": (pos.y - this.arrowDim.h) + "px"});
                                    if (src.targetAnchor && _6b(src.targetAnchor, src.before)) {
                                        src._addItemClass(_6b(src.targetAnchor, src.before), src.before ? "After" : "Before");
                                    }
                                }),_unmarkTargetAnchor: _4c.hitch(this, function() {
                                    var src = this.source;
                                    if (!src.targetAnchor) {
                                        return;
                                    }
                                    if (src.targetAnchor && _6b(src.targetAnchor, src.before)) {
                                        src._removeItemClass(_6b(src.targetAnchor, src.before), src.before ? "After" : "Before");
                                    }
                                    this._hide(this.bottomMarker);
                                    this._hide(this.topMarker);
                                    _50.prototype._unmarkTargetAnchor.call(src);
                                }),destroy: _4c.hitch(this, function() {
                                    _4d.disconnect(this._source_conn);
                                    _4d.unsubscribe(this._source_sub);
                                    _50.prototype.destroy.call(this.source);
                                    if (this.bottomMarker) {
                                        _55.destroy(this.bottomMarker);
                                        delete this.bottomMarker;
                                    }
                                    if (this.topMarker) {
                                        _55.destroy(this.topMarker);
                                        delete this.topMarker;
                                    }
                                }),onDndCancel: _4c.hitch(this, function() {
                                    _50.prototype.onDndCancel.call(this.source);
                                    this._hide(this.bottomMarker);
                                    this._hide(this.topMarker);
                                })});
                            this._source_conn = _4d.connect(this.source, "onDndDrop", this, "_onDndDrop");
                            this._source_sub = _4d.subscribe("/dnd/drop/before", this, "_onDndDropBefore");
                            this.source.startup();
                        }
                    },_hide: function(_76) {
                        _55.style(_76, {top: "-10000px","visibility": "hidden"});
                    },_onDndDropBefore: function(_77, _78, _79) {
                        if (_58.manager().target !== this.source) {
                            return;
                        }
                        this.source._targetNode = this.source.targetAnchor;
                        this.source._beforeTarget = this.source.before;
                        var _7a = this.grid.views.views;
                        var _7b = _7a[_77.viewIndex];
                        var _7c = _7a[this.index];
                        if (_7c != _7b) {
                            _7b.convertColPctToFixed();
                            _7c.convertColPctToFixed();
                        }
                    },_onDndDrop: function(_7d, _7e, _7f) {
                        if (_58.manager().target !== this.source) {
                            if (_58.manager().source === this.source) {
                                this._removingColumn = true;
                            }
                            return;
                        }
                        this._hide(this.bottomMarker);
                        this._hide(this.topMarker);
                        var _80 = function(n) {
                            return n ? _55.attr(n, "idx") : null;
                        };
                        var w = _55.marginBox(_7e[0]).w;
                        if (_7d.viewIndex !== this.index) {
                            var _81 = this.grid.views.views;
                            var _82 = _81[_7d.viewIndex];
                            var _83 = _81[this.index];
                            if (_82.viewWidth && _82.viewWidth != "auto") {
                                _82.setColumnsWidth(_82.getColumnsWidth() - w);
                            }
                            if (_83.viewWidth && _83.viewWidth != "auto") {
                                _83.setColumnsWidth(_83.getColumnsWidth());
                            }
                        }
                        var stn = this.source._targetNode;
                        var stb = this.source._beforeTarget;
                        !this.grid.isLeftToRight() && (stb = !stb);
                        var _84 = this.grid.layout;
                        var idx = this.index;
                        delete this.source._targetNode;
                        delete this.source._beforeTarget;
                        _84.moveColumn(_7d.viewIndex, idx, _80(_7e[0]), _80(stn), stb);
                    },renderHeader: function() {
                        this.headerContentNode.innerHTML = this.header.generateHtml(this._getHeaderContent);
                        if (this.flexCells) {
                            this.contentWidth = this.getContentWidth();
                            this.headerContentNode.firstChild.style.width = this.contentWidth;
                        }
                        _54.fire(this, "onAfterRow", [-1, this.structure.cells, this.headerContentNode]);
                    },_getHeaderContent: function(_85) {
                        var n = _85.name || _85.grid.getCellName(_85);
                        if (/^\s+$/.test(n)) {
                            n = "&nbsp;";
                        }
                        var ret = ["<div class=\"dojoxGridSortNode"];
                        if (_85.index != _85.grid.getSortIndex()) {
                            ret.push("\">");
                        } else {
                            ret = ret.concat([" ", _85.grid.sortInfo > 0 ? "dojoxGridSortUp" : "dojoxGridSortDown", "\"><div class=\"dojoxGridArrowButtonChar\">", _85.grid.sortInfo > 0 ? "&#9650;" : "&#9660;", "</div><div class=\"dojoxGridArrowButtonNode\" role=\"presentation\"></div>", "<div class=\"dojoxGridColCaption\">"]);
                        }
                        ret = ret.concat([n, "</div></div>"]);
                        return ret.join("");
                    },resize: function() {
                        this.adaptHeight();
                        this.adaptWidth();
                    },hasHScrollbar: function(_86) {
                        var _87 = this._hasHScroll || false;
                        if (this._hasHScroll == undefined || _86) {
                            if (this.noscroll) {
                                this._hasHScroll = false;
                            } else {
                                var _88 = _55.style(this.scrollboxNode, "overflow");
                                if (_88 == "hidden") {
                                    this._hasHScroll = false;
                                } else {
                                    if (_88 == "scroll") {
                                        this._hasHScroll = true;
                                    } else {
                                        this._hasHScroll = (this.scrollboxNode.offsetWidth - this.getScrollbarWidth() < this.contentNode.offsetWidth);
                                    }
                                }
                            }
                        }
                        if (_87 !== this._hasHScroll) {
                            this.grid.update();
                        }
                        return this._hasHScroll;
                    },hasVScrollbar: function(_89) {
                        var _8a = this._hasVScroll || false;
                        if (this._hasVScroll == undefined || _89) {
                            if (this.noscroll) {
                                this._hasVScroll = false;
                            } else {
                                var _8b = _55.style(this.scrollboxNode, "overflow");
                                if (_8b == "hidden") {
                                    this._hasVScroll = false;
                                } else {
                                    if (_8b == "scroll") {
                                        this._hasVScroll = true;
                                    } else {
                                        this._hasVScroll = (this.scrollboxNode.scrollHeight > this.scrollboxNode.clientHeight);
                                    }
                                }
                            }
                        }
                        if (_8a !== this._hasVScroll) {
                            this.grid.update();
                        }
                        return this._hasVScroll;
                    },convertColPctToFixed: function() {
                        var _8c = false;
                        this.grid.initialWidth = "";
                        var _8d = _4e("th", this.headerContentNode);
                        var _8e = _4b.map(_8d, function(c, _8f) {
                            var w = c.style.width;
                            _55.attr(c, "vIdx", _8f);
                            if (w && w.slice(-1) == "%") {
                                _8c = true;
                            } else {
                                if (w && w.slice(-2) == "px") {
                                    return window.parseInt(w, 10);
                                }
                            }
                            return _55.contentBox(c).w;
                        });
                        if (_8c) {
                            _4b.forEach(this.grid.layout.cells, function(_90, idx) {
                                if (_90.view == this) {
                                    var _91 = _90.view.getHeaderCellNode(_90.index);
                                    if (_91 && _55.hasAttr(_91, "vIdx")) {
                                        var _92 = window.parseInt(_55.attr(_91, "vIdx"));
                                        this.setColWidth(idx, _8e[_92]);
                                        _55.removeAttr(_91, "vIdx");
                                    }
                                }
                            }, this);
                            return true;
                        }
                        return false;
                    },adaptHeight: function(_93) {
                        if (!this.grid._autoHeight) {
                            var h = (this.domNode.style.height && parseInt(this.domNode.style.height.replace(/px/, ""), 10)) || this.domNode.clientHeight;
                            var _94 = this;
                            var _95 = function() {
                                var v;
                                for (var i = 0; i < _94.grid.views.views.length; ++i) {
                                    v = _94.grid.views.views[i];
                                    if (v !== _94 && v.hasHScrollbar()) {
                                        return true;
                                    }
                                }
                                return false;
                            };
                            if (_93 || (this.noscroll && _95())) {
                                h -= _53.getScrollbar().h;
                            }
                            _54.setStyleHeightPx(this.scrollboxNode, h);
                        }
                        this.hasVScrollbar(true);
                    },adaptWidth: function() {
                        if (this.flexCells) {
                            this.contentWidth = this.getContentWidth();
                            this.headerContentNode.firstChild.style.width = this.contentWidth;
                        }
                        var w = this.scrollboxNode.offsetWidth - this.getScrollbarWidth();
                        if (!this._removingColumn) {
                            w = Math.max(w, this.getColumnsWidth()) + "px";
                        } else {
                            w = Math.min(w, this.getColumnsWidth()) + "px";
                            this._removingColumn = false;
                        }
                        var cn = this.contentNode;
                        cn.style.width = w;
                        this.hasHScrollbar(true);
                    },setSize: function(w, h) {
                        var ds = this.domNode.style;
                        var hs = this.headerNode.style;
                        if (w) {
                            ds.width = w;
                            hs.width = w;
                        }
                        ds.height = (h >= 0 ? h + "px" : "");
                    },renderRow: function(_96) {
                        var _97 = this.createRowNode(_96);
                        this.buildRow(_96, _97);
                        return _97;
                    },createRowNode: function(_98) {
                        var _99 = document.createElement("div");
                        _99.className = this.classTag + "Row";
                        if (this instanceof _49.grid._RowSelector) {
                            _55.attr(_99, "role", "presentation");
                        } else {
                            _55.attr(_99, "role", "row");
                            if (this.grid.selectionMode != "none") {
                                _99.setAttribute("aria-selected", "false");
                            }
                        }
                        _99[_54.gridViewTag] = this.id;
                        _99[_54.rowIndexTag] = _98;
                        this.rowNodes[_98] = _99;
                        return _99;
                    },buildRow: function(_9a, _9b) {
                        this.buildRowContent(_9a, _9b);
                        this.styleRow(_9a, _9b);
                    },buildRowContent: function(_9c, _9d) {
                        _9d.innerHTML = this.content.generateHtml(_9c, _9c);
                        if (this.flexCells && this.contentWidth) {
                            _9d.firstChild.style.width = this.contentWidth;
                        }
                        _54.fire(this, "onAfterRow", [_9c, this.structure.cells, _9d]);
                    },rowRemoved: function(_9e) {
                        if (_9e >= 0) {
                            this._cleanupRowWidgets(this.getRowNode(_9e));
                        }
                        this.grid.edit.save(this, _9e);
                        delete this.rowNodes[_9e];
                    },getRowNode: function(_9f) {
                        return this.rowNodes[_9f];
                    },getCellNode: function(_a0, _a1) {
                        var row = this.getRowNode(_a0);
                        if (row) {
                            return this.content.getCellNode(row, _a1);
                        }
                    },getHeaderCellNode: function(_a2) {
                        if (this.headerContentNode) {
                            return this.header.getCellNode(this.headerContentNode, _a2);
                        }
                    },styleRow: function(_a3, _a4) {
                        _a4._style = _59(_a4);
                        this.styleRowNode(_a3, _a4);
                    },styleRowNode: function(_a5, _a6) {
                        if (_a6) {
                            this.doStyleRowNode(_a5, _a6);
                        }
                    },doStyleRowNode: function(_a7, _a8) {
                        this.grid.styleRowNode(_a7, _a8);
                    },updateRow: function(_a9) {
                        var _aa = this.getRowNode(_a9);
                        if (_aa) {
                            _aa.style.height = "";
                            this.buildRow(_a9, _aa);
                        }
                        return _aa;
                    },updateRowStyles: function(_ab) {
                        this.styleRowNode(_ab, this.getRowNode(_ab));
                    },lastTop: 0,firstScroll: 0,_nativeScroll: false,doscroll: function(_ac) {
                        if (has("ff") >= 13 || has("chrome")) {
                            this._nativeScroll = true;
                        }
                        var _ad = this.grid.isLeftToRight();
                        if (this.firstScroll < 2) {
                            if ((!_ad && this.firstScroll == 1) || (_ad && this.firstScroll === 0)) {
                                var s = _55.marginBox(this.headerNodeContainer);
                                if (has("ie")) {
                                    this.headerNodeContainer.style.width = s.w + this.getScrollbarWidth() + "px";
                                } else {
                                    if (has("mozilla")) {
                                        this.headerNodeContainer.style.width = s.w - this.getScrollbarWidth() + "px";
                                        this.scrollboxNode.scrollLeft = _ad ? this.scrollboxNode.clientWidth - this.scrollboxNode.scrollWidth : this.scrollboxNode.scrollWidth - this.scrollboxNode.clientWidth;
                                    }
                                }
                            }
                            this.firstScroll++;
                        }
                        this.headerNode.scrollLeft = this.scrollboxNode.scrollLeft;
                        var top = this.scrollboxNode.scrollTop;
                        if (top !== this.lastTop) {
                            this.grid.scrollTo(top);
                        }
                        this._nativeScroll = false;
                    },setScrollTop: function(_ae) {
                        this.lastTop = _ae;
                        if (!this._nativeScroll) {
                            this.scrollboxNode.scrollTop = _ae;
                        }
                        return this.scrollboxNode.scrollTop;
                    },doContentEvent: function(e) {
                        if (this.content.decorateEvent(e)) {
                            this.grid.onContentEvent(e);
                        }
                    },doHeaderEvent: function(e) {
                        if (this.header.decorateEvent(e)) {
                            this.grid.onHeaderEvent(e);
                        }
                    },dispatchContentEvent: function(e) {
                        return this.content.dispatchEvent(e);
                    },dispatchHeaderEvent: function(e) {
                        return this.header.dispatchEvent(e);
                    },setColWidth: function(_af, _b0) {
                        this.grid.setCellWidth(_af, _b0 + "px");
                    },update: function() {
                        if (!this.domNode) {
                            return;
                        }
                        this.content.update();
                        this.grid.update();
                        var _b1 = this.scrollboxNode.scrollLeft;
                        this.scrollboxNode.scrollLeft = _b1;
                        this.headerNode.scrollLeft = _b1;
                    }});
                var _b2 = _4a("dojox.grid._GridAvatar", _57, {construct: function() {
                        var dd = win.doc;
                        var a = dd.createElement("table");
                        a.cellPadding = a.cellSpacing = "0";
                        a.className = "dojoxGridDndAvatar";
                        a.style.position = "absolute";
                        a.style.zIndex = 1999;
                        a.style.margin = "0px";
                        var b = dd.createElement("tbody");
                        var tr = dd.createElement("tr");
                        var td = dd.createElement("td");
                        var img = dd.createElement("td");
                        tr.className = "dojoxGridDndAvatarItem";
                        img.className = "dojoxGridDndAvatarItemImage";
                        img.style.width = "16px";
                        var _b3 = this.manager.source, _b4;
                        if (_b3.creator) {
                            _b4 = _b3._normalizedCreator(_b3.getItem(this.manager.nodes[0].id).data, "avatar").node;
                        } else {
                            _b4 = this.manager.nodes[0].cloneNode(true);
                            var _b5, _b6;
                            if (_b4.tagName.toLowerCase() == "tr") {
                                _b5 = dd.createElement("table");
                                _b6 = dd.createElement("tbody");
                                _b6.appendChild(_b4);
                                _b5.appendChild(_b6);
                                _b4 = _b5;
                            } else {
                                if (_b4.tagName.toLowerCase() == "th") {
                                    _b5 = dd.createElement("table");
                                    _b6 = dd.createElement("tbody");
                                    var r = dd.createElement("tr");
                                    _b5.cellPadding = _b5.cellSpacing = "0";
                                    r.appendChild(_b4);
                                    _b6.appendChild(r);
                                    _b5.appendChild(_b6);
                                    _b4 = _b5;
                                }
                            }
                        }
                        _b4.id = "";
                        td.appendChild(_b4);
                        tr.appendChild(img);
                        tr.appendChild(td);
                        _55.style(tr, "opacity", 0.9);
                        b.appendChild(tr);
                        a.appendChild(b);
                        this.node = a;
                        var m = _58.manager();
                        this.oldOffsetY = m.OFFSET_Y;
                        m.OFFSET_Y = 1;
                    },destroy: function() {
                        _58.manager().OFFSET_Y = this.oldOffsetY;
                        this.inherited(arguments);
                    }});
                var _b7 = _58.manager().makeAvatar;
                _58.manager().makeAvatar = function() {
                    var src = this.source;
                    if (src.viewIndex !== undefined && !_55.hasClass(win.body(), "dijit_a11y")) {
                        return new _b2(this);
                    }
                    return _b7.call(_58.manager());
                };
                return _5c;
            });
        },"dijit/CheckedMenuItem": function() {
            define(["dojo/_base/declare", "dojo/dom-class", "./MenuItem", "dojo/text!./templates/CheckedMenuItem.html", "./hccss"], function(_b8, _b9, _ba, _bb) {
                return _b8("dijit.CheckedMenuItem", _ba, {baseClass: "dijitMenuItem dijitCheckedMenuItem",templateString: _bb,checked: false,_setCheckedAttr: function(_bc) {
                        this.domNode.setAttribute("aria-checked", _bc ? "true" : "false");
                        this._set("checked", _bc);
                    },iconClass: "",role: "menuitemcheckbox",checkedChar: "&#10003;",onChange: function() {
                    },_onClick: function(evt) {
                        if (!this.disabled) {
                            this.set("checked", !this.checked);
                            this.onChange(this.checked);
                        }
                        this.onClick(evt);
                    }});
            });
        },"dojo/hccss": function() {
            define(["require", "./_base/config", "./dom-class", "./dom-style", "./has", "./domReady", "./_base/window"], function(_bd, _be, _bf, _c0, has, _c1, win) {
                has.add("highcontrast", function() {
                    var div = win.doc.createElement("div");
                    div.style.cssText = "border: 1px solid; border-color:red green; position: absolute; height: 5px; top: -999px;" + "background-image: url(\"" + (_be.blankGif || _bd.toUrl("./resources/blank.gif")) + "\");";
                    win.body().appendChild(div);
                    var cs = _c0.getComputedStyle(div), _c2 = cs.backgroundImage, hc = (cs.borderTopColor == cs.borderRightColor) || (_c2 && (_c2 == "none" || _c2 == "url(invalid-url:)"));
                    if (has("ie") <= 8) {
                        div.outerHTML = "";
                    } else {
                        win.body().removeChild(div);
                    }
                    return hc;
                });
                _c1(function() {
                    if (has("highcontrast")) {
                        _bf.add(win.body(), "dj_a11y");
                    }
                });
                return has;
            });
        },"dijit/_WidgetBase": function() {
            define(["require", "dojo/_base/array", "dojo/aspect", "dojo/_base/config", "dojo/_base/connect", "dojo/_base/declare", "dojo/dom", "dojo/dom-attr", "dojo/dom-class", "dojo/dom-construct", "dojo/dom-geometry", "dojo/dom-style", "dojo/has", "dojo/_base/kernel", "dojo/_base/lang", "dojo/on", "dojo/ready", "dojo/Stateful", "dojo/topic", "dojo/_base/window", "./Destroyable", "dojo/has!dojo-bidi?./_BidiMixin", "./registry"], function(_c3, _c4, _c5, _c6, _c7, _c8, dom, _c9, _ca, _cb, _cc, _cd, has, _ce, _cf, on, _d0, _d1, _d2, win, _d3, _d4, _d5) {
                has.add("dijit-legacy-requires", !_ce.isAsync);
                has.add("dojo-bidi", false);
                if (has("dijit-legacy-requires")) {
                    _d0(0, function() {
                        var _d6 = ["dijit/_base/manager"];
                        _c3(_d6);
                    });
                }
                var _d7 = {};
                function _d8(obj) {
                    var ret = {};
                    for (var _d9 in obj) {
                        ret[_d9.toLowerCase()] = true;
                    }
                    return ret;
                }
                ;
                function _da(_db) {
                    return function(val) {
                        _c9[val ? "set" : "remove"](this.domNode, _db, val);
                        this._set(_db, val);
                    };
                }
                ;
                function _dc(a, b) {
                    return a === b || (a !== a && b !== b);
                }
                ;
                var _dd = _c8("dijit._WidgetBase", [_d1, _d3], {id: "",_setIdAttr: "domNode",lang: "",_setLangAttr: _da("lang"),dir: "",_setDirAttr: _da("dir"),"class": "",_setClassAttr: {node: "domNode",type: "class"},_setTypeAttr: null,style: "",title: "",tooltip: "",baseClass: "",srcNodeRef: null,domNode: null,containerNode: null,ownerDocument: null,_setOwnerDocumentAttr: function(val) {
                        this._set("ownerDocument", val);
                    },attributeMap: {},_blankGif: _c6.blankGif || _c3.toUrl("dojo/resources/blank.gif"),_introspect: function() {
                        var _de = this.constructor;
                        if (!_de._setterAttrs) {
                            var _df = _de.prototype, _e0 = _de._setterAttrs = [], _e1 = (_de._onMap = {});
                            for (var _e2 in _df.attributeMap) {
                                _e0.push(_e2);
                            }
                            for (_e2 in _df) {
                                if (/^on/.test(_e2)) {
                                    _e1[_e2.substring(2).toLowerCase()] = _e2;
                                }
                                if (/^_set[A-Z](.*)Attr$/.test(_e2)) {
                                    _e2 = _e2.charAt(4).toLowerCase() + _e2.substr(5, _e2.length - 9);
                                    if (!_df.attributeMap || !(_e2 in _df.attributeMap)) {
                                        _e0.push(_e2);
                                    }
                                }
                            }
                        }
                    },postscript: function(_e3, _e4) {
                        this.create(_e3, _e4);
                    },create: function(_e5, _e6) {
                        this._introspect();
                        this.srcNodeRef = dom.byId(_e6);
                        this._connects = [];
                        this._supportingWidgets = [];
                        if (this.srcNodeRef && (typeof this.srcNodeRef.id == "string")) {
                            this.id = this.srcNodeRef.id;
                        }
                        if (_e5) {
                            this.params = _e5;
                            _cf.mixin(this, _e5);
                        }
                        this.postMixInProperties();
                        if (!this.id) {
                            this.id = _d5.getUniqueId(this.declaredClass.replace(/\./g, "_"));
                            if (this.params) {
                                delete this.params.id;
                            }
                        }
                        this.ownerDocument = this.ownerDocument || (this.srcNodeRef ? this.srcNodeRef.ownerDocument : document);
                        this.ownerDocumentBody = win.body(this.ownerDocument);
                        _d5.add(this);
                        this.buildRendering();
                        var _e7;
                        if (this.domNode) {
                            this._applyAttributes();
                            var _e8 = this.srcNodeRef;
                            if (_e8 && _e8.parentNode && this.domNode !== _e8) {
                                _e8.parentNode.replaceChild(this.domNode, _e8);
                                _e7 = true;
                            }
                            this.domNode.setAttribute("widgetId", this.id);
                        }
                        this.postCreate();
                        if (_e7) {
                            delete this.srcNodeRef;
                        }
                        this._created = true;
                    },_applyAttributes: function() {
                        var _e9 = {};
                        for (var key in this.params || {}) {
                            _e9[key] = this._get(key);
                        }
                        _c4.forEach(this.constructor._setterAttrs, function(key) {
                            if (!(key in _e9)) {
                                var val = this._get(key);
                                if (val) {
                                    this.set(key, val);
                                }
                            }
                        }, this);
                        for (key in _e9) {
                            this.set(key, _e9[key]);
                        }
                    },postMixInProperties: function() {
                    },buildRendering: function() {
                        if (!this.domNode) {
                            this.domNode = this.srcNodeRef || this.ownerDocument.createElement("div");
                        }
                        if (this.baseClass) {
                            var _ea = this.baseClass.split(" ");
                            if (!this.isLeftToRight()) {
                                _ea = _ea.concat(_c4.map(_ea, function(_eb) {
                                    return _eb + "Rtl";
                                }));
                            }
                            _ca.add(this.domNode, _ea);
                        }
                    },postCreate: function() {
                    },startup: function() {
                        if (this._started) {
                            return;
                        }
                        this._started = true;
                        _c4.forEach(this.getChildren(), function(obj) {
                            if (!obj._started && !obj._destroyed && _cf.isFunction(obj.startup)) {
                                obj.startup();
                                obj._started = true;
                            }
                        });
                    },destroyRecursive: function(_ec) {
                        this._beingDestroyed = true;
                        this.destroyDescendants(_ec);
                        this.destroy(_ec);
                    },destroy: function(_ed) {
                        this._beingDestroyed = true;
                        this.uninitialize();
                        function _ee(w) {
                            if (w.destroyRecursive) {
                                w.destroyRecursive(_ed);
                            } else {
                                if (w.destroy) {
                                    w.destroy(_ed);
                                }
                            }
                        }
                        ;
                        _c4.forEach(this._connects, _cf.hitch(this, "disconnect"));
                        _c4.forEach(this._supportingWidgets, _ee);
                        if (this.domNode) {
                            _c4.forEach(_d5.findWidgets(this.domNode, this.containerNode), _ee);
                        }
                        this.destroyRendering(_ed);
                        _d5.remove(this.id);
                        this._destroyed = true;
                    },destroyRendering: function(_ef) {
                        if (this.bgIframe) {
                            this.bgIframe.destroy(_ef);
                            delete this.bgIframe;
                        }
                        if (this.domNode) {
                            if (_ef) {
                                _c9.remove(this.domNode, "widgetId");
                            } else {
                                _cb.destroy(this.domNode);
                            }
                            delete this.domNode;
                        }
                        if (this.srcNodeRef) {
                            if (!_ef) {
                                _cb.destroy(this.srcNodeRef);
                            }
                            delete this.srcNodeRef;
                        }
                    },destroyDescendants: function(_f0) {
                        _c4.forEach(this.getChildren(), function(_f1) {
                            if (_f1.destroyRecursive) {
                                _f1.destroyRecursive(_f0);
                            }
                        });
                    },uninitialize: function() {
                        return false;
                    },_setStyleAttr: function(_f2) {
                        var _f3 = this.domNode;
                        if (_cf.isObject(_f2)) {
                            _cd.set(_f3, _f2);
                        } else {
                            if (_f3.style.cssText) {
                                _f3.style.cssText += "; " + _f2;
                            } else {
                                _f3.style.cssText = _f2;
                            }
                        }
                        this._set("style", _f2);
                    },_attrToDom: function(_f4, _f5, _f6) {
                        _f6 = arguments.length >= 3 ? _f6 : this.attributeMap[_f4];
                        _c4.forEach(_cf.isArray(_f6) ? _f6 : [_f6], function(_f7) {
                            var _f8 = this[_f7.node || _f7 || "domNode"];
                            var _f9 = _f7.type || "attribute";
                            switch (_f9) {
                                case "attribute":
                                    if (_cf.isFunction(_f5)) {
                                        _f5 = _cf.hitch(this, _f5);
                                    }
                                    var _fa = _f7.attribute ? _f7.attribute : (/^on[A-Z][a-zA-Z]*$/.test(_f4) ? _f4.toLowerCase() : _f4);
                                    if (_f8.tagName) {
                                        _c9.set(_f8, _fa, _f5);
                                    } else {
                                        _f8.set(_fa, _f5);
                                    }
                                    break;
                                case "innerText":
                                    _f8.innerHTML = "";
                                    _f8.appendChild(this.ownerDocument.createTextNode(_f5));
                                    break;
                                case "innerHTML":
                                    _f8.innerHTML = _f5;
                                    break;
                                case "class":
                                    _ca.replace(_f8, _f5, this[_f4]);
                                    break;
                            }
                        }, this);
                    },get: function(_fb) {
                        var _fc = this._getAttrNames(_fb);
                        return this[_fc.g] ? this[_fc.g]() : this._get(_fb);
                    },set: function(_fd, _fe) {
                        if (typeof _fd === "object") {
                            for (var x in _fd) {
                                this.set(x, _fd[x]);
                            }
                            return this;
                        }
                        var _ff = this._getAttrNames(_fd), _100 = this[_ff.s];
                        if (_cf.isFunction(_100)) {
                            var _101 = _100.apply(this, Array.prototype.slice.call(arguments, 1));
                        } else {
                            var _102 = this.focusNode && !_cf.isFunction(this.focusNode) ? "focusNode" : "domNode", tag = this[_102] && this[_102].tagName, _103 = tag && (_d7[tag] || (_d7[tag] = _d8(this[_102]))), map = _fd in this.attributeMap ? this.attributeMap[_fd] : _ff.s in this ? this[_ff.s] : ((_103 && _ff.l in _103 && typeof _fe != "function") || /^aria-|^data-|^role$/.test(_fd)) ? _102 : null;
                            if (map != null) {
                                this._attrToDom(_fd, _fe, map);
                            }
                            this._set(_fd, _fe);
                        }
                        return _101 || this;
                    },_attrPairNames: {},_getAttrNames: function(name) {
                        var apn = this._attrPairNames;
                        if (apn[name]) {
                            return apn[name];
                        }
                        var uc = name.replace(/^[a-z]|-[a-zA-Z]/g, function(c) {
                            return c.charAt(c.length - 1).toUpperCase();
                        });
                        return (apn[name] = {n: name + "Node",s: "_set" + uc + "Attr",g: "_get" + uc + "Attr",l: uc.toLowerCase()});
                    },_set: function(name, _104) {
                        var _105 = this[name];
                        this[name] = _104;
                        if (this._created && !_dc(_105, _104)) {
                            if (this._watchCallbacks) {
                                this._watchCallbacks(name, _105, _104);
                            }
                            this.emit("attrmodified-" + name, {detail: {prevValue: _105,newValue: _104}});
                        }
                    },_get: function(name) {
                        return this[name];
                    },emit: function(type, _106, _107) {
                        _106 = _106 || {};
                        if (_106.bubbles === undefined) {
                            _106.bubbles = true;
                        }
                        if (_106.cancelable === undefined) {
                            _106.cancelable = true;
                        }
                        if (!_106.detail) {
                            _106.detail = {};
                        }
                        _106.detail.widget = this;
                        var ret, _108 = this["on" + type];
                        if (_108) {
                            ret = _108.apply(this, _107 ? _107 : [_106]);
                        }
                        if (this._started && !this._beingDestroyed) {
                            on.emit(this.domNode, type.toLowerCase(), _106);
                        }
                        return ret;
                    },on: function(type, func) {
                        var _109 = this._onMap(type);
                        if (_109) {
                            return _c5.after(this, _109, func, true);
                        }
                        return this.own(on(this.domNode, type, func))[0];
                    },_onMap: function(type) {
                        var ctor = this.constructor, map = ctor._onMap;
                        if (!map) {
                            map = (ctor._onMap = {});
                            for (var attr in ctor.prototype) {
                                if (/^on/.test(attr)) {
                                    map[attr.replace(/^on/, "").toLowerCase()] = attr;
                                }
                            }
                        }
                        return map[typeof type == "string" && type.toLowerCase()];
                    },toString: function() {
                        return "[Widget " + this.declaredClass + ", " + (this.id || "NO ID") + "]";
                    },getChildren: function() {
                        return this.containerNode ? _d5.findWidgets(this.containerNode) : [];
                    },getParent: function() {
                        return _d5.getEnclosingWidget(this.domNode.parentNode);
                    },connect: function(obj, _10a, _10b) {
                        return this.own(_c7.connect(obj, _10a, this, _10b))[0];
                    },disconnect: function(_10c) {
                        _10c.remove();
                    },subscribe: function(t, _10d) {
                        return this.own(_d2.subscribe(t, _cf.hitch(this, _10d)))[0];
                    },unsubscribe: function(_10e) {
                        _10e.remove();
                    },isLeftToRight: function() {
                        return this.dir ? (this.dir == "ltr") : _cc.isBodyLtr(this.ownerDocument);
                    },isFocusable: function() {
                        return this.focus && (_cd.get(this.domNode, "display") != "none");
                    },placeAt: function(_10f, _110) {
                        var _111 = !_10f.tagName && _d5.byId(_10f);
                        if (_111 && _111.addChild && (!_110 || typeof _110 === "number")) {
                            _111.addChild(this, _110);
                        } else {
                            var ref = _111 && ("domNode" in _111) ? (_111.containerNode && !/after|before|replace/.test(_110 || "") ? _111.containerNode : _111.domNode) : dom.byId(_10f, this.ownerDocument);
                            _cb.place(this.domNode, ref, _110);
                            if (!this._started && (this.getParent() || {})._started) {
                                this.startup();
                            }
                        }
                        return this;
                    },defer: function(fcn, _112) {
                        var _113 = setTimeout(_cf.hitch(this, function() {
                            if (!_113) {
                                return;
                            }
                            _113 = null;
                            if (!this._destroyed) {
                                _cf.hitch(this, fcn)();
                            }
                        }), _112 || 0);
                        return {remove: function() {
                                if (_113) {
                                    clearTimeout(_113);
                                    _113 = null;
                                }
                                return null;
                            }};
                    }});
                if (has("dojo-bidi")) {
                    _dd.extend(_d4);
                }
                return _dd;
            });
        },"dojo/dnd/common": function() {
            define(["../sniff", "../_base/kernel", "../_base/lang", "../dom"], function(has, _114, lang, dom) {
                var _115 = lang.getObject("dojo.dnd", true);
                _115.getCopyKeyState = function(evt) {
                    return evt[has("mac") ? "metaKey" : "ctrlKey"];
                };
                _115._uniqueId = 0;
                _115.getUniqueId = function() {
                    var id;
                    do {
                        id = _114._scopeName + "Unique" + (++_115._uniqueId);
                    } while (dom.byId(id));
                    return id;
                };
                _115._empty = {};
                _115.isFormElement = function(e) {
                    var t = e.target;
                    if (t.nodeType == 3) {
                        t = t.parentNode;
                    }
                    return " a button textarea input select option ".indexOf(" " + t.tagName.toLowerCase() + " ") >= 0;
                };
                return _115;
            });
        },"dojox/main": function() {
            define(["dojo/_base/kernel"], function(dojo) {
                return dojo.dojox;
            });
        },"dojo/touch": function() {
            define(["./_base/kernel", "./aspect", "./dom", "./dom-class", "./_base/lang", "./on", "./has", "./mouse", "./domReady", "./_base/window"], function(dojo, _116, dom, _117, lang, on, has, _118, _119, win) {
                var ios4 = has("ios") < 5;
                var _11a = has("pointer-events") || has("MSPointer"), _11b = (function() {
                    var _11c = {};
                    for (var type in {down: 1,move: 1,up: 1,cancel: 1,over: 1,out: 1}) {
                        _11c[type] = has("MSPointer") ? "MSPointer" + type.charAt(0).toUpperCase() + type.slice(1) : "pointer" + type;
                    }
                    return _11c;
                })();
                var _11d = has("touch-events");
                var _11e, _11f, _120 = false, _121, _122, _123, _124, _125, _126;
                var _127;
                function _128(_129, _12a, _12b) {
                    if (_11a && _12b) {
                        return function(node, _12c) {
                            return on(node, _12b, _12c);
                        };
                    } else {
                        if (_11d) {
                            return function(node, _12d) {
                                var _12e = on(node, _12a, function(evt) {
                                    _12d.call(this, evt);
                                    _127 = (new Date()).getTime();
                                }), _12f = on(node, _129, function(evt) {
                                    if (!_127 || (new Date()).getTime() > _127 + 1000) {
                                        _12d.call(this, evt);
                                    }
                                });
                                return {remove: function() {
                                        _12e.remove();
                                        _12f.remove();
                                    }};
                            };
                        } else {
                            return function(node, _130) {
                                return on(node, _129, _130);
                            };
                        }
                    }
                }
                ;
                function _131(node) {
                    do {
                        if (node.dojoClick !== undefined) {
                            return node;
                        }
                    } while (node = node.parentNode);
                }
                ;
                function _132(e, _133, _134) {
                    var _135 = _131(e.target);
                    _11f = !e.target.disabled && _135 && _135.dojoClick;
                    if (_11f) {
                        _120 = (_11f == "useTarget");
                        _121 = (_120 ? _135 : e.target);
                        if (_120) {
                            e.preventDefault();
                        }
                        _122 = e.changedTouches ? e.changedTouches[0].pageX - win.global.pageXOffset : e.clientX;
                        _123 = e.changedTouches ? e.changedTouches[0].pageY - win.global.pageYOffset : e.clientY;
                        _124 = (typeof _11f == "object" ? _11f.x : (typeof _11f == "number" ? _11f : 0)) || 4;
                        _125 = (typeof _11f == "object" ? _11f.y : (typeof _11f == "number" ? _11f : 0)) || 4;
                        if (!_11e) {
                            _11e = true;
                            function _136(e) {
                                if (_120) {
                                    _11f = dom.isDescendant(win.doc.elementFromPoint((e.changedTouches ? e.changedTouches[0].pageX - win.global.pageXOffset : e.clientX), (e.changedTouches ? e.changedTouches[0].pageY - win.global.pageYOffset : e.clientY)), _121);
                                } else {
                                    _11f = _11f && (e.changedTouches ? e.changedTouches[0].target : e.target) == _121 && Math.abs((e.changedTouches ? e.changedTouches[0].pageX - win.global.pageXOffset : e.clientX) - _122) <= _124 && Math.abs((e.changedTouches ? e.changedTouches[0].pageY - win.global.pageYOffset : e.clientY) - _123) <= _125;
                                }
                            }
                            ;
                            win.doc.addEventListener(_133, function(e) {
                                _136(e);
                                if (_120) {
                                    e.preventDefault();
                                }
                            }, true);
                            win.doc.addEventListener(_134, function(e) {
                                _136(e);
                                if (_11f) {
                                    _126 = (new Date()).getTime();
                                    var _137 = (_120 ? _121 : e.target);
                                    if (_137.tagName === "LABEL") {
                                        _137 = dom.byId(_137.getAttribute("for")) || _137;
                                    }
                                    var src = (e.changedTouches) ? e.changedTouches[0] : e;
                                    var _138 = document.createEvent("MouseEvents");
                                    _138._dojo_click = true;
                                    _138.initMouseEvent("click", true, true, e.view, e.detail, src.screenX, src.screenY, src.clientX, src.clientY, e.ctrlKey, e.altKey, e.shiftKey, e.metaKey, 0, null);
                                    setTimeout(function() {
                                        on.emit(_137, "click", _138);
                                        _126 = (new Date()).getTime();
                                    }, 0);
                                }
                            }, true);
                            function _139(type) {
                                win.doc.addEventListener(type, function(e) {
                                    if (!e._dojo_click && (new Date()).getTime() <= _126 + 1000 && !(e.target.tagName == "INPUT" && _117.contains(e.target, "dijitOffScreen"))) {
                                        e.stopPropagation();
                                        e.stopImmediatePropagation && e.stopImmediatePropagation();
                                        if (type == "click" && (e.target.tagName != "INPUT" || e.target.type == "radio" || e.target.type == "checkbox") && e.target.tagName != "TEXTAREA" && e.target.tagName != "AUDIO" && e.target.tagName != "VIDEO") {
                                            e.preventDefault();
                                        }
                                    }
                                }, true);
                            }
                            ;
                            _139("click");
                            _139("mousedown");
                            _139("mouseup");
                        }
                    }
                }
                ;
                var _13a;
                if (_11a) {
                    _119(function() {
                        win.doc.addEventListener(_11b.down, function(evt) {
                            _132(evt, _11b.move, _11b.up);
                        }, true);
                    });
                } else {
                    if (_11d) {
                        _119(function() {
                            _13a = win.body();
                            win.doc.addEventListener("touchstart", function(evt) {
                                _127 = (new Date()).getTime();
                                var _13b = _13a;
                                _13a = evt.target;
                                on.emit(_13b, "dojotouchout", {relatedTarget: _13a,bubbles: true});
                                on.emit(_13a, "dojotouchover", {relatedTarget: _13b,bubbles: true});
                                _132(evt, "touchmove", "touchend");
                            }, true);
                            function _13c(evt) {
                                var _13d = lang.delegate(evt, {bubbles: true});
                                if (has("ios") >= 6) {
                                    _13d.touches = evt.touches;
                                    _13d.altKey = evt.altKey;
                                    _13d.changedTouches = evt.changedTouches;
                                    _13d.ctrlKey = evt.ctrlKey;
                                    _13d.metaKey = evt.metaKey;
                                    _13d.shiftKey = evt.shiftKey;
                                    _13d.targetTouches = evt.targetTouches;
                                }
                                return _13d;
                            }
                            ;
                            on(win.doc, "touchmove", function(evt) {
                                _127 = (new Date()).getTime();
                                var _13e = win.doc.elementFromPoint(evt.pageX - (ios4 ? 0 : win.global.pageXOffset), evt.pageY - (ios4 ? 0 : win.global.pageYOffset));
                                if (_13e) {
                                    if (_13a !== _13e) {
                                        on.emit(_13a, "dojotouchout", {relatedTarget: _13e,bubbles: true});
                                        on.emit(_13e, "dojotouchover", {relatedTarget: _13a,bubbles: true});
                                        _13a = _13e;
                                    }
                                    if (!on.emit(_13e, "dojotouchmove", _13c(evt))) {
                                        evt.preventDefault();
                                    }
                                }
                            });
                            on(win.doc, "touchend", function(evt) {
                                _127 = (new Date()).getTime();
                                var node = win.doc.elementFromPoint(evt.pageX - (ios4 ? 0 : win.global.pageXOffset), evt.pageY - (ios4 ? 0 : win.global.pageYOffset)) || win.body();
                                on.emit(node, "dojotouchend", _13c(evt));
                            });
                        });
                    }
                }
                var _13f = {press: _128("mousedown", "touchstart", _11b.down),move: _128("mousemove", "dojotouchmove", _11b.move),release: _128("mouseup", "dojotouchend", _11b.up),cancel: _128(_118.leave, "touchcancel", _11a ? _11b.cancel : null),over: _128("mouseover", "dojotouchover", _11b.over),out: _128("mouseout", "dojotouchout", _11b.out),enter: _118._eventHandler(_128("mouseover", "dojotouchover", _11b.over)),leave: _118._eventHandler(_128("mouseout", "dojotouchout", _11b.out))};
                1 && (dojo.touch = _13f);
                return _13f;
            });
        },"dojox/grid/cells/_base": function() {
            define(["dojo/_base/kernel", "dojo/_base/declare", "dojo/_base/lang", "dojo/_base/event", "dojo/_base/connect", "dojo/_base/array", "dojo/_base/sniff", "dojo/dom", "dojo/dom-attr", "dojo/dom-construct", "dijit/_Widget", "../util"], function(dojo, _140, lang, _141, _142, _143, has, dom, _144, _145, _146, util) {
                var _147 = _140("dojox.grid._DeferredTextWidget", _146, {deferred: null,_destroyOnRemove: true,postCreate: function() {
                        if (this.deferred) {
                            this.deferred.addBoth(lang.hitch(this, function(text) {
                                if (this.domNode) {
                                    this.domNode.innerHTML = text;
                                }
                            }));
                        }
                    }});
                var _148 = function(_149) {
                    try {
                        util.fire(_149, "focus");
                        util.fire(_149, "select");
                    } catch (e) {
                    }
                };
                var _14a = function() {
                    setTimeout(lang.hitch.apply(dojo, arguments), 0);
                };
                var _14b = _140("dojox.grid.cells._Base", null, {styles: "",classes: "",editable: false,alwaysEditing: false,formatter: null,defaultValue: "...",value: null,hidden: false,noresize: false,draggable: true,_valueProp: "value",_formatPending: false,constructor: function(_14c) {
                        this._props = _14c || {};
                        lang.mixin(this, _14c);
                        if (this.draggable === undefined) {
                            this.draggable = true;
                        }
                    },_defaultFormat: function(_14d, _14e) {
                        var s = this.grid.formatterScope || this;
                        var f = this.formatter;
                        if (f && s && typeof f == "string") {
                            f = this.formatter = s[f];
                        }
                        var v = (_14d != this.defaultValue && f) ? f.apply(s, _14e) : _14d;
                        if (typeof v == "undefined") {
                            return this.defaultValue;
                        }
                        if (v && v.addBoth) {
                            v = new _147({deferred: v}, _145.create("span", {innerHTML: this.defaultValue}));
                        }
                        if (v && v.declaredClass && v.startup) {
                            return "<div class='dojoxGridStubNode' linkWidget='" + v.id + "' cellIdx='" + this.index + "'>" + this.defaultValue + "</div>";
                        }
                        return v;
                    },format: function(_14f, _150) {
                        var f, i = this.grid.edit.info, d = this.get ? this.get(_14f, _150) : (this.value || this.defaultValue);
                        d = (d && d.replace && this.grid.escapeHTMLInData) ? d.replace(/&/g, "&amp;").replace(/</g, "&lt;") : d;
                        if (this.editable && (this.alwaysEditing || (i.rowIndex == _14f && i.cell == this))) {
                            return this.formatEditing(i.value ? i.value : d, _14f);
                        } else {
                            return this._defaultFormat(d, [d, _14f, this]);
                        }
                    },formatEditing: function(_151, _152) {
                    },getNode: function(_153) {
                        return this.view.getCellNode(_153, this.index);
                    },getHeaderNode: function() {
                        return this.view.getHeaderCellNode(this.index);
                    },getEditNode: function(_154) {
                        return (this.getNode(_154) || 0).firstChild || 0;
                    },canResize: function() {
                        var uw = this.unitWidth;
                        return uw && (uw !== "auto");
                    },isFlex: function() {
                        var uw = this.unitWidth;
                        return uw && lang.isString(uw) && (uw == "auto" || uw.slice(-1) == "%");
                    },applyEdit: function(_155, _156) {
                        if (this.getNode(_156)) {
                            this.grid.edit.applyCellEdit(_155, this, _156);
                        }
                    },cancelEdit: function(_157) {
                        this.grid.doCancelEdit(_157);
                    },_onEditBlur: function(_158) {
                        if (this.grid.edit.isEditCell(_158, this.index)) {
                            this.grid.edit.apply();
                        }
                    },registerOnBlur: function(_159, _15a) {
                        if (this.commitOnBlur) {
                            _142.connect(_159, "onblur", function(e) {
                                setTimeout(lang.hitch(this, "_onEditBlur", _15a), 250);
                            });
                        }
                    },needFormatNode: function(_15b, _15c) {
                        this._formatPending = true;
                        _14a(this, "_formatNode", _15b, _15c);
                    },cancelFormatNode: function() {
                        this._formatPending = false;
                    },_formatNode: function(_15d, _15e) {
                        if (this._formatPending) {
                            this._formatPending = false;
                            if (!has("ie")) {
                                dom.setSelectable(this.grid.domNode, true);
                            }
                            this.formatNode(this.getEditNode(_15e), _15d, _15e);
                        }
                    },formatNode: function(_15f, _160, _161) {
                        if (has("ie")) {
                            _14a(this, "focus", _161, _15f);
                        } else {
                            this.focus(_161, _15f);
                        }
                    },dispatchEvent: function(m, e) {
                        if (m in this) {
                            return this[m](e);
                        }
                    },getValue: function(_162) {
                        return this.getEditNode(_162)[this._valueProp];
                    },setValue: function(_163, _164) {
                        var n = this.getEditNode(_163);
                        if (n) {
                            n[this._valueProp] = _164;
                        }
                    },focus: function(_165, _166) {
                        _148(_166 || this.getEditNode(_165));
                    },save: function(_167) {
                        this.value = this.value || this.getValue(_167);
                    },restore: function(_168) {
                        this.setValue(_168, this.value);
                    },_finish: function(_169) {
                        dom.setSelectable(this.grid.domNode, false);
                        this.cancelFormatNode();
                    },apply: function(_16a) {
                        this.applyEdit(this.getValue(_16a), _16a);
                        this._finish(_16a);
                    },cancel: function(_16b) {
                        this.cancelEdit(_16b);
                        this._finish(_16b);
                    }});
                _14b.markupFactory = function(node, _16c) {
                    var _16d = lang.trim(_144.get(node, "formatter") || "");
                    if (_16d) {
                        _16c.formatter = lang.getObject(_16d) || _16d;
                    }
                    var get = lang.trim(_144.get(node, "get") || "");
                    if (get) {
                        _16c.get = lang.getObject(get);
                    }
                    var _16e = function(attr, cell, _16f) {
                        var _170 = lang.trim(_144.get(node, attr) || "");
                        if (_170) {
                            cell[_16f || attr] = !(_170.toLowerCase() == "false");
                        }
                    };
                    _16e("sortDesc", _16c);
                    _16e("editable", _16c);
                    _16e("alwaysEditing", _16c);
                    _16e("noresize", _16c);
                    _16e("draggable", _16c);
                    var _171 = lang.trim(_144.get(node, "loadingText") || _144.get(node, "defaultValue") || "");
                    if (_171) {
                        _16c.defaultValue = _171;
                    }
                    var _172 = function(attr, cell, _173) {
                        var _174 = lang.trim(_144.get(node, attr) || "") || undefined;
                        if (_174) {
                            cell[_173 || attr] = _174;
                        }
                    };
                    _172("styles", _16c);
                    _172("headerStyles", _16c);
                    _172("cellStyles", _16c);
                    _172("classes", _16c);
                    _172("headerClasses", _16c);
                    _172("cellClasses", _16c);
                };
                var Cell = _14b.Cell = _140("dojox.grid.cells.Cell", _14b, {constructor: function() {
                        this.keyFilter = this.keyFilter;
                    },keyFilter: null,formatEditing: function(_175, _176) {
                        this.needFormatNode(_175, _176);
                        return "<input class=\"dojoxGridInput\" type=\"text\" value=\"" + _175 + "\">";
                    },formatNode: function(_177, _178, _179) {
                        this.inherited(arguments);
                        this.registerOnBlur(_177, _179);
                    },doKey: function(e) {
                        if (this.keyFilter) {
                            var key = String.fromCharCode(e.charCode);
                            if (key.search(this.keyFilter) == -1) {
                                _141.stop(e);
                            }
                        }
                    },_finish: function(_17a) {
                        this.inherited(arguments);
                        var n = this.getEditNode(_17a);
                        try {
                            util.fire(n, "blur");
                        } catch (e) {
                        }
                    }});
                Cell.markupFactory = function(node, _17b) {
                    _14b.markupFactory(node, _17b);
                    var _17c = lang.trim(_144.get(node, "keyFilter") || "");
                    if (_17c) {
                        _17b.keyFilter = new RegExp(_17c);
                    }
                };
                var _17d = _14b.RowIndex = _140("dojox.grid.cells.RowIndex", Cell, {name: "Row",postscript: function() {
                        this.editable = false;
                    },get: function(_17e) {
                        return _17e + 1;
                    }});
                _17d.markupFactory = function(node, _17f) {
                    Cell.markupFactory(node, _17f);
                };
                var _180 = _14b.Select = _140("dojox.grid.cells.Select", Cell, {options: null,values: null,returnIndex: -1,constructor: function(_181) {
                        this.values = this.values || this.options;
                    },formatEditing: function(_182, _183) {
                        this.needFormatNode(_182, _183);
                        var h = ["<select class=\"dojoxGridSelect\">"];
                        for (var i = 0, o, v; ((o = this.options[i]) !== undefined) && ((v = this.values[i]) !== undefined); i++) {
                            v = v.replace ? v.replace(/&/g, "&amp;").replace(/</g, "&lt;") : v;
                            o = o.replace ? o.replace(/&/g, "&amp;").replace(/</g, "&lt;") : o;
                            h.push("<option", (_182 == v ? " selected" : ""), " value=\"" + v + "\"", ">", o, "</option>");
                        }
                        h.push("</select>");
                        return h.join("");
                    },_defaultFormat: function(_184, _185) {
                        var v = this.inherited(arguments);
                        if (!this.formatter && this.values && this.options) {
                            var i = _143.indexOf(this.values, v);
                            if (i >= 0) {
                                v = this.options[i];
                            }
                        }
                        return v;
                    },getValue: function(_186) {
                        var n = this.getEditNode(_186);
                        if (n) {
                            var i = n.selectedIndex, o = n.options[i];
                            return this.returnIndex > -1 ? i : o.value || o.innerHTML;
                        }
                    }});
                _180.markupFactory = function(node, cell) {
                    Cell.markupFactory(node, cell);
                    var _187 = lang.trim(_144.get(node, "options") || "");
                    if (_187) {
                        var o = _187.split(",");
                        if (o[0] != _187) {
                            cell.options = o;
                        }
                    }
                    var _188 = lang.trim(_144.get(node, "values") || "");
                    if (_188) {
                        var v = _188.split(",");
                        if (v[0] != _188) {
                            cell.values = v;
                        }
                    }
                };
                var _189 = _14b.AlwaysEdit = _140("dojox.grid.cells.AlwaysEdit", Cell, {alwaysEditing: true,_formatNode: function(_18a, _18b) {
                        this.formatNode(this.getEditNode(_18b), _18a, _18b);
                    },applyStaticValue: function(_18c) {
                        var e = this.grid.edit;
                        e.applyCellEdit(this.getValue(_18c), this, _18c);
                        e.start(this, _18c, true);
                    }});
                _189.markupFactory = function(node, cell) {
                    Cell.markupFactory(node, cell);
                };
                var Bool = _14b.Bool = _140("dojox.grid.cells.Bool", _189, {_valueProp: "checked",formatEditing: function(_18d, _18e) {
                        return "<input class=\"dojoxGridInput\" type=\"checkbox\"" + (_18d ? " checked=\"checked\"" : "") + " style=\"width: auto\" />";
                    },doclick: function(e) {
                        if (e.target.tagName == "INPUT") {
                            this.applyStaticValue(e.rowIndex);
                        }
                    }});
                Bool.markupFactory = function(node, cell) {
                    _189.markupFactory(node, cell);
                };
                return _14b;
            });
        },"dojo/Stateful": function() {
            define(["./_base/declare", "./_base/lang", "./_base/array", "./when"], function(_18f, lang, _190, when) {
                return _18f("dojo.Stateful", null, {_attrPairNames: {},_getAttrNames: function(name) {
                        var apn = this._attrPairNames;
                        if (apn[name]) {
                            return apn[name];
                        }
                        return (apn[name] = {s: "_" + name + "Setter",g: "_" + name + "Getter"});
                    },postscript: function(_191) {
                        if (_191) {
                            this.set(_191);
                        }
                    },_get: function(name, _192) {
                        return typeof this[_192.g] === "function" ? this[_192.g]() : this[name];
                    },get: function(name) {
                        return this._get(name, this._getAttrNames(name));
                    },set: function(name, _193) {
                        if (typeof name === "object") {
                            for (var x in name) {
                                if (name.hasOwnProperty(x) && x != "_watchCallbacks") {
                                    this.set(x, name[x]);
                                }
                            }
                            return this;
                        }
                        var _194 = this._getAttrNames(name), _195 = this._get(name, _194), _196 = this[_194.s], _197;
                        if (typeof _196 === "function") {
                            _197 = _196.apply(this, Array.prototype.slice.call(arguments, 1));
                        } else {
                            this[name] = _193;
                        }
                        if (this._watchCallbacks) {
                            var self = this;
                            when(_197, function() {
                                self._watchCallbacks(name, _195, _193);
                            });
                        }
                        return this;
                    },_changeAttrValue: function(name, _198) {
                        var _199 = this.get(name);
                        this[name] = _198;
                        if (this._watchCallbacks) {
                            this._watchCallbacks(name, _199, _198);
                        }
                        return this;
                    },watch: function(name, _19a) {
                        var _19b = this._watchCallbacks;
                        if (!_19b) {
                            var self = this;
                            _19b = this._watchCallbacks = function(name, _19c, _19d, _19e) {
                                var _19f = function(_1a0) {
                                    if (_1a0) {
                                        _1a0 = _1a0.slice();
                                        for (var i = 0, l = _1a0.length; i < l; i++) {
                                            _1a0[i].call(self, name, _19c, _19d);
                                        }
                                    }
                                };
                                _19f(_19b["_" + name]);
                                if (!_19e) {
                                    _19f(_19b["*"]);
                                }
                            };
                        }
                        if (!_19a && typeof name === "function") {
                            _19a = name;
                            name = "*";
                        } else {
                            name = "_" + name;
                        }
                        var _1a1 = _19b[name];
                        if (typeof _1a1 !== "object") {
                            _1a1 = _19b[name] = [];
                        }
                        _1a1.push(_19a);
                        var _1a2 = {};
                        _1a2.unwatch = _1a2.remove = function() {
                            var _1a3 = _190.indexOf(_1a1, _19a);
                            if (_1a3 > -1) {
                                _1a1.splice(_1a3, 1);
                            }
                        };
                        return _1a2;
                    }});
            });
        },"dijit/_CssStateMixin": function() {
            define(["dojo/_base/array", "dojo/_base/declare", "dojo/dom", "dojo/dom-class", "dojo/has", "dojo/_base/lang", "dojo/on", "dojo/domReady", "dojo/touch", "dojo/_base/window", "./a11yclick", "./registry"], function(_1a4, _1a5, dom, _1a6, has, lang, on, _1a7, _1a8, win, _1a9, _1aa) {
                var _1ab = _1a5("dijit._CssStateMixin", [], {hovering: false,active: false,_applyAttributes: function() {
                        this.inherited(arguments);
                        _1a4.forEach(["disabled", "readOnly", "checked", "selected", "focused", "state", "hovering", "active", "_opened"], function(attr) {
                            this.watch(attr, lang.hitch(this, "_setStateClass"));
                        }, this);
                        for (var ap in this.cssStateNodes || {}) {
                            this._trackMouseState(this[ap], this.cssStateNodes[ap]);
                        }
                        this._trackMouseState(this.domNode, this.baseClass);
                        this._setStateClass();
                    },_cssMouseEvent: function(_1ac) {
                        if (!this.disabled) {
                            switch (_1ac.type) {
                                case "mouseover":
                                case "MSPointerOver":
                                case "pointerover":
                                    this._set("hovering", true);
                                    this._set("active", this._mouseDown);
                                    break;
                                case "mouseout":
                                case "MSPointerOut":
                                case "pointerout":
                                    this._set("hovering", false);
                                    this._set("active", false);
                                    break;
                                case "mousedown":
                                case "touchstart":
                                case "MSPointerDown":
                                case "pointerdown":
                                case "keydown":
                                    this._set("active", true);
                                    break;
                                case "mouseup":
                                case "dojotouchend":
                                case "MSPointerUp":
                                case "pointerup":
                                case "keyup":
                                    this._set("active", false);
                                    break;
                            }
                        }
                    },_setStateClass: function() {
                        var _1ad = this.baseClass.split(" ");
                        function _1ae(_1af) {
                            _1ad = _1ad.concat(_1a4.map(_1ad, function(c) {
                                return c + _1af;
                            }), "dijit" + _1af);
                        }
                        ;
                        if (!this.isLeftToRight()) {
                            _1ae("Rtl");
                        }
                        var _1b0 = this.checked == "mixed" ? "Mixed" : (this.checked ? "Checked" : "");
                        if (this.checked) {
                            _1ae(_1b0);
                        }
                        if (this.state) {
                            _1ae(this.state);
                        }
                        if (this.selected) {
                            _1ae("Selected");
                        }
                        if (this._opened) {
                            _1ae("Opened");
                        }
                        if (this.disabled) {
                            _1ae("Disabled");
                        } else {
                            if (this.readOnly) {
                                _1ae("ReadOnly");
                            } else {
                                if (this.active) {
                                    _1ae("Active");
                                } else {
                                    if (this.hovering) {
                                        _1ae("Hover");
                                    }
                                }
                            }
                        }
                        if (this.focused) {
                            _1ae("Focused");
                        }
                        var tn = this.stateNode || this.domNode, _1b1 = {};
                        _1a4.forEach(tn.className.split(" "), function(c) {
                            _1b1[c] = true;
                        });
                        if ("_stateClasses" in this) {
                            _1a4.forEach(this._stateClasses, function(c) {
                                delete _1b1[c];
                            });
                        }
                        _1a4.forEach(_1ad, function(c) {
                            _1b1[c] = true;
                        });
                        var _1b2 = [];
                        for (var c in _1b1) {
                            _1b2.push(c);
                        }
                        tn.className = _1b2.join(" ");
                        this._stateClasses = _1ad;
                    },_subnodeCssMouseEvent: function(node, _1b3, evt) {
                        if (this.disabled || this.readOnly) {
                            return;
                        }
                        function _1b4(_1b5) {
                            _1a6.toggle(node, _1b3 + "Hover", _1b5);
                        }
                        ;
                        function _1b6(_1b7) {
                            _1a6.toggle(node, _1b3 + "Active", _1b7);
                        }
                        ;
                        function _1b8(_1b9) {
                            _1a6.toggle(node, _1b3 + "Focused", _1b9);
                        }
                        ;
                        switch (evt.type) {
                            case "mouseover":
                            case "MSPointerOver":
                            case "pointerover":
                                _1b4(true);
                                break;
                            case "mouseout":
                            case "MSPointerOut":
                            case "pointerout":
                                _1b4(false);
                                _1b6(false);
                                break;
                            case "mousedown":
                            case "touchstart":
                            case "MSPointerDown":
                            case "pointerdown":
                            case "keydown":
                                _1b6(true);
                                break;
                            case "mouseup":
                            case "MSPointerUp":
                            case "pointerup":
                            case "dojotouchend":
                            case "keyup":
                                _1b6(false);
                                break;
                            case "focus":
                            case "focusin":
                                _1b8(true);
                                break;
                            case "blur":
                            case "focusout":
                                _1b8(false);
                                break;
                        }
                    },_trackMouseState: function(node, _1ba) {
                        node._cssState = _1ba;
                    }});
                _1a7(function() {
                    function _1bb(evt, _1bc, _1bd) {
                        if (_1bd && dom.isDescendant(_1bd, _1bc)) {
                            return;
                        }
                        for (var node = _1bc; node && node != _1bd; node = node.parentNode) {
                            if (node._cssState) {
                                var _1be = _1aa.getEnclosingWidget(node);
                                if (_1be) {
                                    if (node == _1be.domNode) {
                                        _1be._cssMouseEvent(evt);
                                    } else {
                                        _1be._subnodeCssMouseEvent(node, node._cssState, evt);
                                    }
                                }
                            }
                        }
                    }
                    ;
                    var body = win.body(), _1bf;
                    on(body, _1a8.over, function(evt) {
                        _1bb(evt, evt.target, evt.relatedTarget);
                    });
                    on(body, _1a8.out, function(evt) {
                        _1bb(evt, evt.target, evt.relatedTarget);
                    });
                    on(body, _1a9.press, function(evt) {
                        _1bf = evt.target;
                        _1bb(evt, _1bf);
                    });
                    on(body, _1a9.release, function(evt) {
                        _1bb(evt, _1bf);
                        _1bf = null;
                    });
                    on(body, "focusin, focusout", function(evt) {
                        var node = evt.target;
                        if (node._cssState && !node.getAttribute("widgetId")) {
                            var _1c0 = _1aa.getEnclosingWidget(node);
                            if (_1c0) {
                                _1c0._subnodeCssMouseEvent(node, node._cssState, evt);
                            }
                        }
                    });
                });
                return _1ab;
            });
        },"dojo/dnd/Moveable": function() {
            define(["../_base/array", "../_base/declare", "../_base/lang", "../dom", "../dom-class", "../Evented", "../on", "../topic", "../touch", "./common", "./Mover", "../_base/window"], function(_1c1, _1c2, lang, dom, _1c3, _1c4, on, _1c5, _1c6, dnd, _1c7, win) {
                var _1c8 = _1c2("dojo.dnd.Moveable", [_1c4], {handle: "",delay: 0,skip: false,constructor: function(node, _1c9) {
                        this.node = dom.byId(node);
                        if (!_1c9) {
                            _1c9 = {};
                        }
                        this.handle = _1c9.handle ? dom.byId(_1c9.handle) : null;
                        if (!this.handle) {
                            this.handle = this.node;
                        }
                        this.delay = _1c9.delay > 0 ? _1c9.delay : 0;
                        this.skip = _1c9.skip;
                        this.mover = _1c9.mover ? _1c9.mover : _1c7;
                        this.events = [on(this.handle, _1c6.press, lang.hitch(this, "onMouseDown")), on(this.handle, "dragstart", lang.hitch(this, "onSelectStart")), on(this.handle, "selectstart", lang.hitch(this, "onSelectStart"))];
                    },markupFactory: function(_1ca, node, Ctor) {
                        return new Ctor(node, _1ca);
                    },destroy: function() {
                        _1c1.forEach(this.events, function(_1cb) {
                            _1cb.remove();
                        });
                        this.events = this.node = this.handle = null;
                    },onMouseDown: function(e) {
                        if (this.skip && dnd.isFormElement(e)) {
                            return;
                        }
                        if (this.delay) {
                            this.events.push(on(this.handle, _1c6.move, lang.hitch(this, "onMouseMove")), on(this.handle, _1c6.release, lang.hitch(this, "onMouseUp")));
                            this._lastX = e.pageX;
                            this._lastY = e.pageY;
                        } else {
                            this.onDragDetected(e);
                        }
                        e.stopPropagation();
                        e.preventDefault();
                    },onMouseMove: function(e) {
                        if (Math.abs(e.pageX - this._lastX) > this.delay || Math.abs(e.pageY - this._lastY) > this.delay) {
                            this.onMouseUp(e);
                            this.onDragDetected(e);
                        }
                        e.stopPropagation();
                        e.preventDefault();
                    },onMouseUp: function(e) {
                        for (var i = 0; i < 2; ++i) {
                            this.events.pop().remove();
                        }
                        e.stopPropagation();
                        e.preventDefault();
                    },onSelectStart: function(e) {
                        if (!this.skip || !dnd.isFormElement(e)) {
                            e.stopPropagation();
                            e.preventDefault();
                        }
                    },onDragDetected: function(e) {
                        new this.mover(this.node, e, this);
                    },onMoveStart: function(_1cc) {
                        _1c5.publish("/dnd/move/start", _1cc);
                        _1c3.add(win.body(), "dojoMove");
                        _1c3.add(this.node, "dojoMoveItem");
                    },onMoveStop: function(_1cd) {
                        _1c5.publish("/dnd/move/stop", _1cd);
                        _1c3.remove(win.body(), "dojoMove");
                        _1c3.remove(this.node, "dojoMoveItem");
                    },onFirstMove: function() {
                    },onMove: function(_1ce, _1cf) {
                        this.onMoving(_1ce, _1cf);
                        var s = _1ce.node.style;
                        s.left = _1cf.l + "px";
                        s.top = _1cf.t + "px";
                        this.onMoved(_1ce, _1cf);
                    },onMoving: function() {
                    },onMoved: function() {
                    }});
                return _1c8;
            });
        },"dojox/grid/Selection": function() {
            define(["dojo/_base/declare", "dojo/_base/array", "dojo/_base/lang", "dojo/dom-attr"], function(_1d0, _1d1, lang, _1d2) {
                return _1d0("dojox.grid.Selection", null, {constructor: function(_1d3) {
                        this.grid = _1d3;
                        this.selected = [];
                        this.setMode(_1d3.selectionMode);
                    },mode: "extended",selected: null,updating: 0,selectedIndex: -1,rangeStartIndex: -1,setMode: function(mode) {
                        if (this.selected.length) {
                            this.deselectAll();
                        }
                        if (mode != "extended" && mode != "multiple" && mode != "single" && mode != "none") {
                            this.mode = "extended";
                        } else {
                            this.mode = mode;
                        }
                    },onCanSelect: function(_1d4) {
                        return this.grid.onCanSelect(_1d4);
                    },onCanDeselect: function(_1d5) {
                        return this.grid.onCanDeselect(_1d5);
                    },onSelected: function(_1d6) {
                    },onDeselected: function(_1d7) {
                    },onChanging: function() {
                    },onChanged: function() {
                    },isSelected: function(_1d8) {
                        if (this.mode == "none") {
                            return false;
                        }
                        return this.selected[_1d8];
                    },getFirstSelected: function() {
                        if (!this.selected.length || this.mode == "none") {
                            return -1;
                        }
                        for (var i = 0, l = this.selected.length; i < l; i++) {
                            if (this.selected[i]) {
                                return i;
                            }
                        }
                        return -1;
                    },getNextSelected: function(_1d9) {
                        if (this.mode == "none") {
                            return -1;
                        }
                        for (var i = _1d9 + 1, l = this.selected.length; i < l; i++) {
                            if (this.selected[i]) {
                                return i;
                            }
                        }
                        return -1;
                    },getSelected: function() {
                        var _1da = [];
                        for (var i = 0, l = this.selected.length; i < l; i++) {
                            if (this.selected[i]) {
                                _1da.push(i);
                            }
                        }
                        return _1da;
                    },getSelectedCount: function() {
                        var c = 0;
                        for (var i = 0; i < this.selected.length; i++) {
                            if (this.selected[i]) {
                                c++;
                            }
                        }
                        return c;
                    },_beginUpdate: function() {
                        if (this.updating === 0) {
                            this.onChanging();
                        }
                        this.updating++;
                    },_endUpdate: function() {
                        this.updating--;
                        if (this.updating === 0) {
                            this.onChanged();
                        }
                    },select: function(_1db) {
                        if (this.mode == "none") {
                            return;
                        }
                        if (this.mode != "multiple") {
                            this.deselectAll(_1db);
                            this.addToSelection(_1db);
                        } else {
                            this.toggleSelect(_1db);
                        }
                    },addToSelection: function(_1dc) {
                        if (this.mode == "none") {
                            return;
                        }
                        if (lang.isArray(_1dc)) {
                            _1d1.forEach(_1dc, this.addToSelection, this);
                            return;
                        }
                        _1dc = Number(_1dc);
                        if (this.selected[_1dc]) {
                            this.selectedIndex = _1dc;
                        } else {
                            if (this.onCanSelect(_1dc) !== false) {
                                this.selectedIndex = _1dc;
                                var _1dd = this.grid.getRowNode(_1dc);
                                if (_1dd) {
                                    _1d2.set(_1dd, "aria-selected", "true");
                                }
                                this._beginUpdate();
                                this.selected[_1dc] = true;
                                this.onSelected(_1dc);
                                this._endUpdate();
                            }
                        }
                    },deselect: function(_1de) {
                        if (this.mode == "none") {
                            return;
                        }
                        if (lang.isArray(_1de)) {
                            _1d1.forEach(_1de, this.deselect, this);
                            return;
                        }
                        _1de = Number(_1de);
                        if (this.selectedIndex == _1de) {
                            this.selectedIndex = -1;
                        }
                        if (this.selected[_1de]) {
                            if (this.onCanDeselect(_1de) === false) {
                                return;
                            }
                            var _1df = this.grid.getRowNode(_1de);
                            if (_1df) {
                                _1d2.set(_1df, "aria-selected", "false");
                            }
                            this._beginUpdate();
                            delete this.selected[_1de];
                            this.onDeselected(_1de);
                            this._endUpdate();
                        }
                    },setSelected: function(_1e0, _1e1) {
                        this[(_1e1 ? "addToSelection" : "deselect")](_1e0);
                    },toggleSelect: function(_1e2) {
                        if (lang.isArray(_1e2)) {
                            _1d1.forEach(_1e2, this.toggleSelect, this);
                            return;
                        }
                        this.setSelected(_1e2, !this.selected[_1e2]);
                    },_range: function(_1e3, inTo, func) {
                        var s = (_1e3 >= 0 ? _1e3 : inTo), e = inTo;
                        if (s > e) {
                            e = s;
                            s = inTo;
                        }
                        for (var i = s; i <= e; i++) {
                            func(i);
                        }
                    },selectRange: function(_1e4, inTo) {
                        this._range(_1e4, inTo, lang.hitch(this, "addToSelection"));
                    },deselectRange: function(_1e5, inTo) {
                        this._range(_1e5, inTo, lang.hitch(this, "deselect"));
                    },insert: function(_1e6) {
                        this.selected.splice(_1e6, 0, false);
                        if (this.selectedIndex >= _1e6) {
                            this.selectedIndex++;
                        }
                    },remove: function(_1e7) {
                        this.selected.splice(_1e7, 1);
                        if (this.selectedIndex >= _1e7) {
                            this.selectedIndex--;
                        }
                    },deselectAll: function(_1e8) {
                        for (var i in this.selected) {
                            if ((i != _1e8) && (this.selected[i] === true)) {
                                this.deselect(i);
                            }
                        }
                    },clickSelect: function(_1e9, _1ea, _1eb) {
                        if (this.mode == "none") {
                            return;
                        }
                        this._beginUpdate();
                        if (this.mode != "extended") {
                            this.select(_1e9);
                        } else {
                            if (!_1eb || this.rangeStartIndex < 0) {
                                this.rangeStartIndex = _1e9;
                            }
                            if (!_1ea) {
                                this.deselectAll(_1e9);
                            }
                            if (_1eb) {
                                this.selectRange(this.rangeStartIndex, _1e9);
                            } else {
                                if (_1ea) {
                                    this.toggleSelect(_1e9);
                                } else {
                                    this.addToSelection(_1e9);
                                }
                            }
                        }
                        this._endUpdate();
                    },clickSelectEvent: function(e) {
                        this.clickSelect(e.rowIndex, dojo.isCopyKey(e), e.shiftKey);
                    },clear: function() {
                        this._beginUpdate();
                        this.deselectAll();
                        this._endUpdate();
                    }});
            });
        },"dojox/grid/_Grid": function() {
            define(["dojo/_base/kernel", "../main", "dojo/_base/declare", "./_Events", "./_Scroller", "./_Layout", "./_View", "./_ViewManager", "./_RowManager", "./_FocusManager", "./_EditManager", "./Selection", "./_RowSelector", "./util", "dijit/_Widget", "dijit/_TemplatedMixin", "dijit/CheckedMenuItem", "dojo/text!./resources/_Grid.html", "dojo/string", "dojo/_base/array", "dojo/_base/lang", "dojo/_base/sniff", "dojox/html/metrics", "dojo/_base/html", "dojo/query", "dojo/dnd/common", "dojo/i18n!dijit/nls/loading"], function(dojo, _1ec, _1ed, _1ee, _1ef, _1f0, _1f1, _1f2, _1f3, _1f4, _1f5, _1f6, _1f7, util, _1f8, _1f9, _1fa, _1fb, _1fc, _1fd, lang, has, _1fe, html, _1ff) {
                if (!dojo.isCopyKey) {
                    dojo.isCopyKey = dojo.dnd.getCopyKeyState;
                }
                var _200 = _1ed("dojox.grid._Grid", [_1f8, _1f9, _1ee], {templateString: _1fb,classTag: "dojoxGrid",rowCount: 5,keepRows: 75,rowsPerPage: 25,autoWidth: false,initialWidth: "",autoHeight: "",rowHeight: 0,autoRender: true,defaultHeight: "15em",height: "",structure: null,elasticView: -1,singleClickEdit: false,selectionMode: "extended",rowSelector: "",columnReordering: false,headerMenu: null,placeholderLabel: "GridColumns",selectable: false,_click: null,loadingMessage: "<span class='dojoxGridLoading'>${loadingState}</span>",errorMessage: "<span class='dojoxGridError'>${errorState}</span>",noDataMessage: "",escapeHTMLInData: true,formatterScope: null,editable: false,summary: "",_setSummaryAttr: "domNode",sortInfo: 0,_placeholders: null,_layoutClass: _1f0,buildRendering: function() {
                        this.inherited(arguments);
                        if (!this.domNode.getAttribute("tabIndex")) {
                            this.domNode.tabIndex = "0";
                        }
                        this.createScroller();
                        this.createLayout();
                        this.createViews();
                        this.createManagers();
                        this.createSelection();
                        this.connect(this.selection, "onSelected", "onSelected");
                        this.connect(this.selection, "onDeselected", "onDeselected");
                        this.connect(this.selection, "onChanged", "onSelectionChanged");
                        _1fe.initOnFontResize();
                        this.connect(_1fe, "onFontResize", "textSizeChanged");
                        util.funnelEvents(this.domNode, this, "doKeyEvent", util.keyEvents);
                        if (this.selectionMode != "none") {
                            this.domNode.setAttribute("aria-multiselectable", this.selectionMode == "single" ? "false" : "true");
                        }
                        html.addClass(this.domNode, this.classTag);
                        if (!this.isLeftToRight()) {
                            html.addClass(this.domNode, this.classTag + "Rtl");
                        }
                        if (this.rowHeight > 0) {
                            html.addClass(this.viewsNode, this.classTag + "FixedRowHeight");
                        }
                    },postMixInProperties: function() {
                        this.inherited(arguments);
                        var _201 = dojo.i18n.getLocalization("dijit", "loading", this.lang);
                        this.loadingMessage = _1fc.substitute(this.loadingMessage, _201);
                        this.errorMessage = _1fc.substitute(this.errorMessage, _201);
                        if (this.srcNodeRef && this.srcNodeRef.style.height) {
                            this.height = this.srcNodeRef.style.height;
                        }
                        this._setAutoHeightAttr(this.autoHeight, true);
                        this.lastScrollTop = this.scrollTop = 0;
                    },postCreate: function() {
                        this._placeholders = [];
                        this._setHeaderMenuAttr(this.headerMenu);
                        this._setStructureAttr(this.structure);
                        this._click = [];
                        this.inherited(arguments);
                        if (this.domNode && this.autoWidth && this.initialWidth) {
                            this.domNode.style.width = this.initialWidth;
                        }
                        if (this.domNode && !this.editable) {
                            html.attr(this.domNode, "aria-readonly", "true");
                        }
                    },destroy: function() {
                        this.domNode.onReveal = null;
                        this.domNode.onSizeChange = null;
                        delete this._click;
                        if (this.scroller) {
                            this.scroller.destroy();
                            delete this.scroller;
                        }
                        this.edit.destroy();
                        delete this.edit;
                        this.views.destroyViews();
                        if (this.focus) {
                            this.focus.destroy();
                            delete this.focus;
                        }
                        if (this.headerMenu && this._placeholders.length) {
                            _1fd.forEach(this._placeholders, function(p) {
                                p.unReplace(true);
                            });
                            this.headerMenu.unBindDomNode(this.viewsHeaderNode);
                        }
                        this.inherited(arguments);
                    },_setAutoHeightAttr: function(ah, _202) {
                        if (typeof ah == "string") {
                            if (!ah || ah == "false") {
                                ah = false;
                            } else {
                                if (ah == "true") {
                                    ah = true;
                                } else {
                                    ah = window.parseInt(ah, 10);
                                }
                            }
                        }
                        if (typeof ah == "number") {
                            if (isNaN(ah)) {
                                ah = false;
                            }
                            if (ah < 0) {
                                ah = true;
                            } else {
                                if (ah === 0) {
                                    ah = false;
                                }
                            }
                        }
                        this.autoHeight = ah;
                        if (typeof ah == "boolean") {
                            this._autoHeight = ah;
                        } else {
                            if (typeof ah == "number") {
                                this._autoHeight = (ah >= this.get("rowCount"));
                            } else {
                                this._autoHeight = false;
                            }
                        }
                        if (this._started && !_202) {
                            this.render();
                        }
                    },_getRowCountAttr: function() {
                        return this.updating && this.invalidated && this.invalidated.rowCount != undefined ? this.invalidated.rowCount : this.rowCount;
                    },textSizeChanged: function() {
                        this.render();
                    },sizeChange: function() {
                        this.update();
                    },createManagers: function() {
                        this.rows = new _1f3(this);
                        this.focus = new _1f4(this);
                        this.edit = new _1f5(this);
                    },createSelection: function() {
                        this.selection = new _1f6(this);
                    },createScroller: function() {
                        this.scroller = new _1ef();
                        this.scroller.grid = this;
                        this.scroller.renderRow = lang.hitch(this, "renderRow");
                        this.scroller.removeRow = lang.hitch(this, "rowRemoved");
                    },createLayout: function() {
                        this.layout = new this._layoutClass(this);
                        this.connect(this.layout, "moveColumn", "onMoveColumn");
                    },onMoveColumn: function() {
                        this.update();
                    },onResizeColumn: function(_203) {
                    },createViews: function() {
                        this.views = new _1f2(this);
                        this.views.createView = lang.hitch(this, "createView");
                    },createView: function(_204, idx) {
                        var c = lang.getObject(_204);
                        var view = new c({grid: this,index: idx});
                        this.viewsNode.appendChild(view.domNode);
                        this.viewsHeaderNode.appendChild(view.headerNode);
                        this.views.addView(view);
                        html.attr(this.domNode, "align", this.isLeftToRight() ? "left" : "right");
                        return view;
                    },buildViews: function() {
                        for (var i = 0, vs; (vs = this.layout.structure[i]); i++) {
                            this.createView(vs.type || _1ec._scopeName + ".grid._View", i).setStructure(vs);
                        }
                        this.scroller.setContentNodes(this.views.getContentNodes());
                    },_setStructureAttr: function(_205) {
                        var s = _205;
                        if (s && lang.isString(s)) {
                            dojo.deprecated("dojox.grid._Grid.set('structure', 'objVar')", "use dojox.grid._Grid.set('structure', objVar) instead", "2.0");
                            s = lang.getObject(s);
                        }
                        this.structure = s;
                        if (!s) {
                            if (this.layout.structure) {
                                s = this.layout.structure;
                            } else {
                                return;
                            }
                        }
                        this.views.destroyViews();
                        this.focus.focusView = null;
                        if (s !== this.layout.structure) {
                            this.layout.setStructure(s);
                        }
                        this._structureChanged();
                    },setStructure: function(_206) {
                        dojo.deprecated("dojox.grid._Grid.setStructure(obj)", "use dojox.grid._Grid.set('structure', obj) instead.", "2.0");
                        this._setStructureAttr(_206);
                    },getColumnTogglingItems: function() {
                        var _207, _208 = [];
                        _207 = _1fd.map(this.layout.cells, function(cell) {
                            if (!cell.menuItems) {
                                cell.menuItems = [];
                            }
                            var self = this;
                            var item = new _1fa({label: cell.name,checked: !cell.hidden,_gridCell: cell,onChange: function(_209) {
                                    if (self.layout.setColumnVisibility(this._gridCell.index, _209)) {
                                        var _20a = this._gridCell.menuItems;
                                        if (_20a.length > 1) {
                                            _1fd.forEach(_20a, function(item) {
                                                if (item !== this) {
                                                    item.setAttribute("checked", _209);
                                                }
                                            }, this);
                                        }
                                        _209 = _1fd.filter(self.layout.cells, function(c) {
                                            if (c.menuItems.length > 1) {
                                                _1fd.forEach(c.menuItems, "item.set('disabled', false);");
                                            } else {
                                                c.menuItems[0].set("disabled", false);
                                            }
                                            return !c.hidden;
                                        });
                                        if (_209.length == 1) {
                                            _1fd.forEach(_209[0].menuItems, "item.set('disabled', true);");
                                        }
                                    }
                                },destroy: function() {
                                    var _20b = _1fd.indexOf(this._gridCell.menuItems, this);
                                    this._gridCell.menuItems.splice(_20b, 1);
                                    delete this._gridCell;
                                    _1fa.prototype.destroy.apply(this, arguments);
                                }});
                            cell.menuItems.push(item);
                            if (!cell.hidden) {
                                _208.push(item);
                            }
                            return item;
                        }, this);
                        if (_208.length == 1) {
                            _208[0].set("disabled", true);
                        }
                        return _207;
                    },_setHeaderMenuAttr: function(menu) {
                        if (this._placeholders && this._placeholders.length) {
                            _1fd.forEach(this._placeholders, function(p) {
                                p.unReplace(true);
                            });
                            this._placeholders = [];
                        }
                        if (this.headerMenu) {
                            this.headerMenu.unBindDomNode(this.viewsHeaderNode);
                        }
                        this.headerMenu = menu;
                        if (!menu) {
                            return;
                        }
                        this.headerMenu.bindDomNode(this.viewsHeaderNode);
                        if (this.headerMenu.getPlaceholders) {
                            this._placeholders = this.headerMenu.getPlaceholders(this.placeholderLabel);
                        }
                    },setHeaderMenu: function(menu) {
                        dojo.deprecated("dojox.grid._Grid.setHeaderMenu(obj)", "use dojox.grid._Grid.set('headerMenu', obj) instead.", "2.0");
                        this._setHeaderMenuAttr(menu);
                    },setupHeaderMenu: function() {
                        if (this._placeholders && this._placeholders.length) {
                            _1fd.forEach(this._placeholders, function(p) {
                                if (p._replaced) {
                                    p.unReplace(true);
                                }
                                p.replace(this.getColumnTogglingItems());
                            }, this);
                        }
                    },_fetch: function(_20c) {
                        this.setScrollTop(0);
                    },getItem: function(_20d) {
                        return null;
                    },showMessage: function(_20e) {
                        if (_20e) {
                            this.messagesNode.innerHTML = _20e;
                            this.messagesNode.style.display = "";
                        } else {
                            this.messagesNode.innerHTML = "";
                            this.messagesNode.style.display = "none";
                        }
                    },_structureChanged: function() {
                        this.buildViews();
                        if (this.autoRender && this._started) {
                            this.render();
                        }
                    },hasLayout: function() {
                        return this.layout.cells.length;
                    },resize: function(_20f, _210) {
                        this._pendingChangeSize = _20f;
                        this._pendingResultSize = _210;
                        this.sizeChange();
                    },_getPadBorder: function() {
                        this._padBorder = this._padBorder || html._getPadBorderExtents(this.domNode);
                        return this._padBorder;
                    },_getHeaderHeight: function() {
                        var vns = this.viewsHeaderNode.style, t = vns.display == "none" ? 0 : this.views.measureHeader();
                        vns.height = t + "px";
                        this.views.normalizeHeaderNodeHeight();
                        return t;
                    },_resize: function(_211, _212) {
                        _211 = _211 || this._pendingChangeSize;
                        _212 = _212 || this._pendingResultSize;
                        delete this._pendingChangeSize;
                        delete this._pendingResultSize;
                        if (!this.domNode) {
                            return;
                        }
                        var pn = this.domNode.parentNode;
                        if (!pn || pn.nodeType != 1 || !this.hasLayout() || pn.style.visibility == "hidden" || pn.style.display == "none") {
                            return;
                        }
                        var _213 = this._getPadBorder();
                        var hh = undefined;
                        var h;
                        if (this._autoHeight) {
                            this.domNode.style.height = "auto";
                        } else {
                            if (typeof this.autoHeight == "number") {
                                h = hh = this._getHeaderHeight();
                                h += (this.scroller.averageRowHeight * this.autoHeight);
                                this.domNode.style.height = h + "px";
                            } else {
                                if (this.domNode.clientHeight <= _213.h) {
                                    if (pn == document.body) {
                                        this.domNode.style.height = this.defaultHeight;
                                    } else {
                                        if (this.height) {
                                            this.domNode.style.height = this.height;
                                        } else {
                                            this.fitTo = "parent";
                                        }
                                    }
                                }
                            }
                        }
                        if (_212) {
                            _211 = _212;
                        }
                        if (!this._autoHeight && _211) {
                            html.marginBox(this.domNode, _211);
                            this.height = this.domNode.style.height;
                            delete this.fitTo;
                        } else {
                            if (this.fitTo == "parent") {
                                h = this._parentContentBoxHeight = (this._parentContentBoxHeight > 0 ? this._parentContentBoxHeight : html._getContentBox(pn).h);
                                this.domNode.style.height = Math.max(0, h) + "px";
                            }
                        }
                        var _214 = _1fd.some(this.views.views, function(v) {
                            return v.flexCells;
                        });
                        if (!this._autoHeight && (h || html._getContentBox(this.domNode).h) === 0) {
                            this.viewsHeaderNode.style.display = "none";
                        } else {
                            this.viewsHeaderNode.style.display = "block";
                            if (!_214 && hh === undefined) {
                                hh = this._getHeaderHeight();
                            }
                        }
                        if (_214) {
                            hh = undefined;
                        }
                        this.adaptWidth();
                        this.adaptHeight(hh);
                        this.postresize();
                    },adaptWidth: function() {
                        var _215 = (!this.initialWidth && this.autoWidth);
                        var w = _215 ? 0 : this.domNode.clientWidth || (this.domNode.offsetWidth - this._getPadBorder().w), vw = this.views.arrange(1, w);
                        this.views.onEach("adaptWidth");
                        if (_215) {
                            this.domNode.style.width = vw + "px";
                        }
                    },adaptHeight: function(_216) {
                        var t = _216 === undefined ? this._getHeaderHeight() : _216;
                        var h = (this._autoHeight ? -1 : Math.max(this.domNode.clientHeight - t, 0) || 0);
                        this.views.onEach("setSize", [0, h]);
                        this.views.onEach("adaptHeight");
                        if (!this._autoHeight) {
                            var _217 = 0, _218 = 0;
                            var _219 = _1fd.filter(this.views.views, function(v) {
                                var has = v.hasHScrollbar();
                                if (has) {
                                    _217++;
                                } else {
                                    _218++;
                                }
                                return (!has);
                            });
                            if (_217 > 0 && _218 > 0) {
                                _1fd.forEach(_219, function(v) {
                                    v.adaptHeight(true);
                                });
                            }
                        }
                        if (this.autoHeight === true || h != -1 || (typeof this.autoHeight == "number" && this.autoHeight >= this.get("rowCount"))) {
                            this.scroller.windowHeight = h;
                        } else {
                            this.scroller.windowHeight = Math.max(this.domNode.clientHeight - t, 0);
                        }
                    },startup: function() {
                        if (this._started) {
                            return;
                        }
                        this.inherited(arguments);
                        if (this.autoRender) {
                            this.render();
                        }
                    },render: function() {
                        if (!this.domNode) {
                            return;
                        }
                        if (!this._started) {
                            return;
                        }
                        if (!this.hasLayout()) {
                            this.scroller.init(0, this.keepRows, this.rowsPerPage);
                            return;
                        }
                        this.update = this.defaultUpdate;
                        this._render();
                    },_render: function() {
                        this.scroller.init(this.get("rowCount"), this.keepRows, this.rowsPerPage);
                        this.prerender();
                        this.setScrollTop(0);
                        this.postrender();
                    },prerender: function() {
                        this.keepRows = this._autoHeight ? 0 : this.keepRows;
                        this.scroller.setKeepInfo(this.keepRows);
                        this.views.render();
                        this._resize();
                    },postrender: function() {
                        this.postresize();
                        this.focus.initFocusView();
                        html.setSelectable(this.domNode, this.selectable);
                    },postresize: function() {
                        if (this._autoHeight) {
                            var size = Math.max(this.views.measureContent()) + "px";
                            this.viewsNode.style.height = size;
                        }
                    },renderRow: function(_21a, _21b) {
                        this.views.renderRow(_21a, _21b, this._skipRowRenormalize);
                    },rowRemoved: function(_21c) {
                        this.views.rowRemoved(_21c);
                    },invalidated: null,updating: false,beginUpdate: function() {
                        this.invalidated = [];
                        this.updating = true;
                    },endUpdate: function() {
                        this.updating = false;
                        var i = this.invalidated, r;
                        if (i.all) {
                            this.update();
                        } else {
                            if (i.rowCount != undefined) {
                                this.updateRowCount(i.rowCount);
                            } else {
                                for (r in i) {
                                    this.updateRow(Number(r));
                                }
                            }
                        }
                        this.invalidated = [];
                    },defaultUpdate: function() {
                        if (!this.domNode) {
                            return;
                        }
                        if (this.updating) {
                            this.invalidated.all = true;
                            return;
                        }
                        this.lastScrollTop = this.scrollTop;
                        this.prerender();
                        this.scroller.invalidateNodes();
                        this.setScrollTop(this.lastScrollTop);
                        this.postrender();
                    },update: function() {
                        this.render();
                    },updateRow: function(_21d) {
                        _21d = Number(_21d);
                        if (this.updating) {
                            this.invalidated[_21d] = true;
                        } else {
                            this.views.updateRow(_21d);
                            this.scroller.rowHeightChanged(_21d);
                        }
                    },updateRows: function(_21e, _21f) {
                        _21e = Number(_21e);
                        _21f = Number(_21f);
                        var i;
                        if (this.updating) {
                            for (i = 0; i < _21f; i++) {
                                this.invalidated[i + _21e] = true;
                            }
                        } else {
                            for (i = 0; i < _21f; i++) {
                                this.views.updateRow(i + _21e, this._skipRowRenormalize);
                            }
                            this.scroller.rowHeightChanged(_21e);
                        }
                    },updateRowCount: function(_220) {
                        if (this.updating) {
                            this.invalidated.rowCount = _220;
                        } else {
                            this.rowCount = _220;
                            this._setAutoHeightAttr(this.autoHeight, true);
                            if (this.layout.cells.length) {
                                this.scroller.updateRowCount(_220);
                            }
                            this._resize();
                            if (this.layout.cells.length) {
                                this.setScrollTop(this.scrollTop);
                            }
                        }
                    },updateRowStyles: function(_221) {
                        this.views.updateRowStyles(_221);
                    },getRowNode: function(_222) {
                        if (this.focus.focusView && !(this.focus.focusView instanceof _1f7)) {
                            return this.focus.focusView.rowNodes[_222];
                        } else {
                            for (var i = 0, _223; (_223 = this.views.views[i]); i++) {
                                if (!(_223 instanceof _1f7)) {
                                    return _223.rowNodes[_222];
                                }
                            }
                        }
                        return null;
                    },rowHeightChanged: function(_224) {
                        this.views.renormalizeRow(_224);
                        this.scroller.rowHeightChanged(_224);
                    },fastScroll: true,delayScroll: false,scrollRedrawThreshold: (has("ie") ? 100 : 50),scrollTo: function(_225) {
                        if (!this.fastScroll) {
                            this.setScrollTop(_225);
                            return;
                        }
                        var _226 = Math.abs(this.lastScrollTop - _225);
                        this.lastScrollTop = _225;
                        if (_226 > this.scrollRedrawThreshold || this.delayScroll) {
                            this.delayScroll = true;
                            this.scrollTop = _225;
                            this.views.setScrollTop(_225);
                            if (this._pendingScroll) {
                                window.clearTimeout(this._pendingScroll);
                            }
                            var _227 = this;
                            this._pendingScroll = window.setTimeout(function() {
                                delete _227._pendingScroll;
                                _227.finishScrollJob();
                            }, 200);
                        } else {
                            this.setScrollTop(_225);
                        }
                    },finishScrollJob: function() {
                        this.delayScroll = false;
                        this.setScrollTop(this.scrollTop);
                    },setScrollTop: function(_228) {
                        this.scroller.scroll(this.views.setScrollTop(_228));
                    },scrollToRow: function(_229) {
                        this.setScrollTop(this.scroller.findScrollTop(_229) + 1);
                    },styleRowNode: function(_22a, _22b) {
                        if (_22b) {
                            this.rows.styleRowNode(_22a, _22b);
                        }
                    },_mouseOut: function(e) {
                        this.rows.setOverRow(-2);
                    },getCell: function(_22c) {
                        return this.layout.cells[_22c];
                    },setCellWidth: function(_22d, _22e) {
                        this.getCell(_22d).unitWidth = _22e;
                    },getCellName: function(_22f) {
                        return "Cell " + _22f.index;
                    },canSort: function(_230) {
                    },sort: function() {
                    },getSortAsc: function(_231) {
                        _231 = _231 == undefined ? this.sortInfo : _231;
                        return Boolean(_231 > 0);
                    },getSortIndex: function(_232) {
                        _232 = _232 == undefined ? this.sortInfo : _232;
                        return Math.abs(_232) - 1;
                    },setSortIndex: function(_233, _234) {
                        var si = _233 + 1;
                        if (_234 != undefined) {
                            si *= (_234 ? 1 : -1);
                        } else {
                            if (this.getSortIndex() == _233) {
                                si = -this.sortInfo;
                            }
                        }
                        this.setSortInfo(si);
                    },setSortInfo: function(_235) {
                        if (this.canSort(_235)) {
                            this.sortInfo = _235;
                            this.sort();
                            this.update();
                        }
                    },doKeyEvent: function(e) {
                        e.dispatch = "do" + e.type;
                        this.onKeyEvent(e);
                    },_dispatch: function(m, e) {
                        if (m in this) {
                            return this[m](e);
                        }
                        return false;
                    },dispatchKeyEvent: function(e) {
                        this._dispatch(e.dispatch, e);
                    },dispatchContentEvent: function(e) {
                        this.edit.dispatchEvent(e) || e.sourceView.dispatchContentEvent(e) || this._dispatch(e.dispatch, e);
                    },dispatchHeaderEvent: function(e) {
                        e.sourceView.dispatchHeaderEvent(e) || this._dispatch("doheader" + e.type, e);
                    },dokeydown: function(e) {
                        this.onKeyDown(e);
                    },doclick: function(e) {
                        if (e.cellNode) {
                            this.onCellClick(e);
                        } else {
                            this.onRowClick(e);
                        }
                    },dodblclick: function(e) {
                        if (e.cellNode) {
                            this.onCellDblClick(e);
                        } else {
                            this.onRowDblClick(e);
                        }
                    },docontextmenu: function(e) {
                    		var len = e.grid.selection.getSelected().length;
	                      if (len < 2){
	                          this.onRowClick(e);                
	                      }
	                      
                        if (e.cellNode) {
                            this.onCellContextMenu(e);
                        } else {
                            this.onRowContextMenu(e);
                        }
                    },doheaderclick: function(e) {
                        if (e.cellNode) {
                            this.onHeaderCellClick(e);
                        } else {
                            this.onHeaderClick(e);
                        }
                    },doheaderdblclick: function(e) {
                        if (e.cellNode) {
                            this.onHeaderCellDblClick(e);
                        } else {
                            this.onHeaderDblClick(e);
                        }
                    },doheadercontextmenu: function(e) {
                        if (e.cellNode) {
                            this.onHeaderCellContextMenu(e);
                        } else {
                            this.onHeaderContextMenu(e);
                        }
                    },doStartEdit: function(_236, _237) {
                        this.onStartEdit(_236, _237);
                    },doApplyCellEdit: function(_238, _239, _23a) {
                        this.onApplyCellEdit(_238, _239, _23a);
                    },doCancelEdit: function(_23b) {
                        this.onCancelEdit(_23b);
                    },doApplyEdit: function(_23c) {
                        this.onApplyEdit(_23c);
                    },addRow: function() {
                        this.updateRowCount(this.get("rowCount") + 1);
                    },removeSelectedRows: function() {
                        if (this.allItemsSelected) {
                            this.updateRowCount(0);
                        } else {
                            this.updateRowCount(Math.max(0, this.get("rowCount") - this.selection.getSelected().length));
                        }
                        this.selection.clear();
                    }});
                _200.markupFactory = function(_23d, node, ctor, _23e) {
                    var _23f = function(n) {
                        var w = html.attr(n, "width") || "auto";
                        if ((w != "auto") && (w.slice(-2) != "em") && (w.slice(-1) != "%")) {
                            w = parseInt(w, 10) + "px";
                        }
                        return w;
                    };
                    if (!_23d.structure && node.nodeName.toLowerCase() == "table") {
                        _23d.structure = _1ff("> colgroup", node).map(function(cg) {
                            var sv = html.attr(cg, "span");
                            var v = {noscroll: (html.attr(cg, "noscroll") == "true") ? true : false,__span: (!!sv ? parseInt(sv, 10) : 1),cells: []};
                            if (html.hasAttr(cg, "width")) {
                                v.width = _23f(cg);
                            }
                            return v;
                        });
                        if (!_23d.structure.length) {
                            _23d.structure.push({__span: Infinity,cells: []});
                        }
                        _1ff("thead > tr", node).forEach(function(tr, _240) {
                            var _241 = 0;
                            var _242 = 0;
                            var _243;
                            var _244 = null;
                            _1ff("> th", tr).map(function(th) {
                                if (!_244) {
                                    _243 = 0;
                                    _244 = _23d.structure[0];
                                } else {
                                    if (_241 >= (_243 + _244.__span)) {
                                        _242++;
                                        _243 += _244.__span;
                                        var _245 = _244;
                                        _244 = _23d.structure[_242];
                                    }
                                }
                                var cell = {name: lang.trim(html.attr(th, "name") || th.innerHTML),colSpan: parseInt(html.attr(th, "colspan") || 1, 10),type: lang.trim(html.attr(th, "cellType") || ""),id: lang.trim(html.attr(th, "id") || "")};
                                _241 += cell.colSpan;
                                var _246 = html.attr(th, "rowspan");
                                if (_246) {
                                    cell.rowSpan = _246;
                                }
                                if (html.hasAttr(th, "width")) {
                                    cell.width = _23f(th);
                                }
                                if (html.hasAttr(th, "relWidth")) {
                                    cell.relWidth = window.parseInt(html.attr(th, "relWidth"), 10);
                                }
                                if (html.hasAttr(th, "hidden")) {
                                    cell.hidden = (html.attr(th, "hidden") == "true" || html.attr(th, "hidden") === true);
                                }
                                if (_23e) {
                                    _23e(th, cell);
                                }
                                cell.type = cell.type ? lang.getObject(cell.type) : _1ec.grid.cells.Cell;
                                if (cell.type && cell.type.markupFactory) {
                                    cell.type.markupFactory(th, cell);
                                }
                                if (!_244.cells[_240]) {
                                    _244.cells[_240] = [];
                                }
                                _244.cells[_240].push(cell);
                            });
                        });
                    }
                    return new ctor(_23d, node);
                };
                return _200;
            });
        },"dojo/dnd/Selector": function() {
            define(["../_base/array", "../_base/declare", "../_base/kernel", "../_base/lang", "../dom", "../dom-construct", "../mouse", "../_base/NodeList", "../on", "../touch", "./common", "./Container"], function(_247, _248, _249, lang, dom, _24a, _24b, _24c, on, _24d, dnd, _24e) {
                var _24f = _248("dojo.dnd.Selector", _24e, {constructor: function(node, _250) {
                        if (!_250) {
                            _250 = {};
                        }
                        this.singular = _250.singular;
                        this.autoSync = _250.autoSync;
                        this.selection = {};
                        this.anchor = null;
                        this.simpleSelection = false;
                        this.events.push(on(this.node, _24d.press, lang.hitch(this, "onMouseDown")), on(this.node, _24d.release, lang.hitch(this, "onMouseUp")));
                    },singular: false,getSelectedNodes: function() {
                        var t = new _24c();
                        var e = dnd._empty;
                        for (var i in this.selection) {
                            if (i in e) {
                                continue;
                            }
                            t.push(dom.byId(i));
                        }
                        return t;
                    },selectNone: function() {
                        return this._removeSelection()._removeAnchor();
                    },selectAll: function() {
                        this.forInItems(function(data, id) {
                            this._addItemClass(dom.byId(id), "Selected");
                            this.selection[id] = 1;
                        }, this);
                        return this._removeAnchor();
                    },deleteSelectedNodes: function() {
                        var e = dnd._empty;
                        for (var i in this.selection) {
                            if (i in e) {
                                continue;
                            }
                            var n = dom.byId(i);
                            this.delItem(i);
                            _24a.destroy(n);
                        }
                        this.anchor = null;
                        this.selection = {};
                        return this;
                    },forInSelectedItems: function(f, o) {
                        o = o || _249.global;
                        var s = this.selection, e = dnd._empty;
                        for (var i in s) {
                            if (i in e) {
                                continue;
                            }
                            f.call(o, this.getItem(i), i, this);
                        }
                    },sync: function() {
                        _24f.superclass.sync.call(this);
                        if (this.anchor) {
                            if (!this.getItem(this.anchor.id)) {
                                this.anchor = null;
                            }
                        }
                        var t = [], e = dnd._empty;
                        for (var i in this.selection) {
                            if (i in e) {
                                continue;
                            }
                            if (!this.getItem(i)) {
                                t.push(i);
                            }
                        }
                        _247.forEach(t, function(i) {
                            delete this.selection[i];
                        }, this);
                        return this;
                    },insertNodes: function(_251, data, _252, _253) {
                        var _254 = this._normalizedCreator;
                        this._normalizedCreator = function(item, hint) {
                            var t = _254.call(this, item, hint);
                            if (_251) {
                                if (!this.anchor) {
                                    this.anchor = t.node;
                                    this._removeItemClass(t.node, "Selected");
                                    this._addItemClass(this.anchor, "Anchor");
                                } else {
                                    if (this.anchor != t.node) {
                                        this._removeItemClass(t.node, "Anchor");
                                        this._addItemClass(t.node, "Selected");
                                    }
                                }
                                this.selection[t.node.id] = 1;
                            } else {
                                this._removeItemClass(t.node, "Selected");
                                this._removeItemClass(t.node, "Anchor");
                            }
                            return t;
                        };
                        _24f.superclass.insertNodes.call(this, data, _252, _253);
                        this._normalizedCreator = _254;
                        return this;
                    },destroy: function() {
                        _24f.superclass.destroy.call(this);
                        this.selection = this.anchor = null;
                    },onMouseDown: function(e) {
                        if (this.autoSync) {
                            this.sync();
                        }
                        if (!this.current) {
                            return;
                        }
                        if (!this.singular && !dnd.getCopyKeyState(e) && !e.shiftKey && (this.current.id in this.selection)) {
                            this.simpleSelection = true;
                            if (_24b.isLeft(e)) {
                                e.stopPropagation();
                                e.preventDefault();
                            }
                            return;
                        }
                        if (!this.singular && e.shiftKey) {
                            if (!dnd.getCopyKeyState(e)) {
                                this._removeSelection();
                            }
                            var c = this.getAllNodes();
                            if (c.length) {
                                if (!this.anchor) {
                                    this.anchor = c[0];
                                    this._addItemClass(this.anchor, "Anchor");
                                }
                                this.selection[this.anchor.id] = 1;
                                if (this.anchor != this.current) {
                                    var i = 0, node;
                                    for (; i < c.length; ++i) {
                                        node = c[i];
                                        if (node == this.anchor || node == this.current) {
                                            break;
                                        }
                                    }
                                    for (++i; i < c.length; ++i) {
                                        node = c[i];
                                        if (node == this.anchor || node == this.current) {
                                            break;
                                        }
                                        this._addItemClass(node, "Selected");
                                        this.selection[node.id] = 1;
                                    }
                                    this._addItemClass(this.current, "Selected");
                                    this.selection[this.current.id] = 1;
                                }
                            }
                        } else {
                            if (this.singular) {
                                if (this.anchor == this.current) {
                                    if (dnd.getCopyKeyState(e)) {
                                        this.selectNone();
                                    }
                                } else {
                                    this.selectNone();
                                    this.anchor = this.current;
                                    this._addItemClass(this.anchor, "Anchor");
                                    this.selection[this.current.id] = 1;
                                }
                            } else {
                                if (dnd.getCopyKeyState(e)) {
                                    if (this.anchor == this.current) {
                                        delete this.selection[this.anchor.id];
                                        this._removeAnchor();
                                    } else {
                                        if (this.current.id in this.selection) {
                                            this._removeItemClass(this.current, "Selected");
                                            delete this.selection[this.current.id];
                                        } else {
                                            if (this.anchor) {
                                                this._removeItemClass(this.anchor, "Anchor");
                                                this._addItemClass(this.anchor, "Selected");
                                            }
                                            this.anchor = this.current;
                                            this._addItemClass(this.current, "Anchor");
                                            this.selection[this.current.id] = 1;
                                        }
                                    }
                                } else {
                                    if (!(this.current.id in this.selection)) {
                                        this.selectNone();
                                        this.anchor = this.current;
                                        this._addItemClass(this.current, "Anchor");
                                        this.selection[this.current.id] = 1;
                                    }
                                }
                            }
                        }
                        e.stopPropagation();
                        e.preventDefault();
                    },onMouseUp: function() {
                        if (!this.simpleSelection) {
                            return;
                        }
                        this.simpleSelection = false;
                        this.selectNone();
                        if (this.current) {
                            this.anchor = this.current;
                            this._addItemClass(this.anchor, "Anchor");
                            this.selection[this.current.id] = 1;
                        }
                    },onMouseMove: function() {
                        this.simpleSelection = false;
                    },onOverEvent: function() {
                        this.onmousemoveEvent = on(this.node, _24d.move, lang.hitch(this, "onMouseMove"));
                    },onOutEvent: function() {
                        if (this.onmousemoveEvent) {
                            this.onmousemoveEvent.remove();
                            delete this.onmousemoveEvent;
                        }
                    },_removeSelection: function() {
                        var e = dnd._empty;
                        for (var i in this.selection) {
                            if (i in e) {
                                continue;
                            }
                            var node = dom.byId(i);
                            if (node) {
                                this._removeItemClass(node, "Selected");
                            }
                        }
                        this.selection = {};
                        return this;
                    },_removeAnchor: function() {
                        if (this.anchor) {
                            this._removeItemClass(this.anchor, "Anchor");
                            this.anchor = null;
                        }
                        return this;
                    }});
                return _24f;
            });
        },"dijit/registry": function() {
            define(["dojo/_base/array", "dojo/_base/window", "./main"], function(_255, win, _256) {
                var _257 = {}, hash = {};
                var _258 = {length: 0,add: function(_259) {
                        if (hash[_259.id]) {
                            throw new Error("Tried to register widget with id==" + _259.id + " but that id is already registered");
                        }
                        hash[_259.id] = _259;
                        this.length++;
                    },remove: function(id) {
                        if (hash[id]) {
                            delete hash[id];
                            this.length--;
                        }
                    },byId: function(id) {
                        return typeof id == "string" ? hash[id] : id;
                    },byNode: function(node) {
                        return hash[node.getAttribute("widgetId")];
                    },toArray: function() {
                        var ar = [];
                        for (var id in hash) {
                            ar.push(hash[id]);
                        }
                        return ar;
                    },getUniqueId: function(_25a) {
                        var id;
                        do {
                            id = _25a + "_" + (_25a in _257 ? ++_257[_25a] : _257[_25a] = 0);
                        } while (hash[id]);
                        return _256._scopeName == "dijit" ? id : _256._scopeName + "_" + id;
                    },findWidgets: function(root, _25b) {
                        var _25c = [];
                        function _25d(root) {
                            for (var node = root.firstChild; node; node = node.nextSibling) {
                                if (node.nodeType == 1) {
                                    var _25e = node.getAttribute("widgetId");
                                    if (_25e) {
                                        var _25f = hash[_25e];
                                        if (_25f) {
                                            _25c.push(_25f);
                                        }
                                    } else {
                                        if (node !== _25b) {
                                            _25d(node);
                                        }
                                    }
                                }
                            }
                        }
                        ;
                        _25d(root);
                        return _25c;
                    },_destroyAll: function() {
                        _256._curFocus = null;
                        _256._prevFocus = null;
                        _256._activeStack = [];
                        _255.forEach(_258.findWidgets(win.body()), function(_260) {
                            if (!_260._destroyed) {
                                if (_260.destroyRecursive) {
                                    _260.destroyRecursive();
                                } else {
                                    if (_260.destroy) {
                                        _260.destroy();
                                    }
                                }
                            }
                        });
                    },getEnclosingWidget: function(node) {
                        while (node) {
                            var id = node.nodeType == 1 && node.getAttribute("widgetId");
                            if (id) {
                                return hash[id];
                            }
                            node = node.parentNode;
                        }
                        return null;
                    },_hash: hash};
                _256.registry = _258;
                return _258;
            });
        },"dijit/_AttachMixin": function() {
            define(["require", "dojo/_base/array", "dojo/_base/connect", "dojo/_base/declare", "dojo/_base/lang", "dojo/mouse", "dojo/on", "dojo/touch", "./_WidgetBase"], function(_261, _262, _263, _264, lang, _265, on, _266, _267) {
                var _268 = lang.delegate(_266, {"mouseenter": _265.enter,"mouseleave": _265.leave,"keypress": _263._keypress});
                var _269;
                var _26a = _264("dijit._AttachMixin", null, {constructor: function() {
                        this._attachPoints = [];
                        this._attachEvents = [];
                    },buildRendering: function() {
                        this.inherited(arguments);
                        this._attachTemplateNodes(this.domNode);
                        this._beforeFillContent();
                    },_beforeFillContent: function() {
                    },_attachTemplateNodes: function(_26b) {
                        var node = _26b;
                        while (true) {
                            if (node.nodeType == 1 && (this._processTemplateNode(node, function(n, p) {
                                return n.getAttribute(p);
                            }, this._attach) || this.searchContainerNode) && node.firstChild) {
                                node = node.firstChild;
                            } else {
                                if (node == _26b) {
                                    return;
                                }
                                while (!node.nextSibling) {
                                    node = node.parentNode;
                                    if (node == _26b) {
                                        return;
                                    }
                                }
                                node = node.nextSibling;
                            }
                        }
                    },_processTemplateNode: function(_26c, _26d, _26e) {
                        var ret = true;
                        var _26f = this.attachScope || this, _270 = _26d(_26c, "dojoAttachPoint") || _26d(_26c, "data-dojo-attach-point");
                        if (_270) {
                            var _271, _272 = _270.split(/\s*,\s*/);
                            while ((_271 = _272.shift())) {
                                if (lang.isArray(_26f[_271])) {
                                    _26f[_271].push(_26c);
                                } else {
                                    _26f[_271] = _26c;
                                }
                                ret = (_271 != "containerNode");
                                this._attachPoints.push(_271);
                            }
                        }
                        var _273 = _26d(_26c, "dojoAttachEvent") || _26d(_26c, "data-dojo-attach-event");
                        if (_273) {
                            var _274, _275 = _273.split(/\s*,\s*/);
                            var trim = lang.trim;
                            while ((_274 = _275.shift())) {
                                if (_274) {
                                    var _276 = null;
                                    if (_274.indexOf(":") != -1) {
                                        var _277 = _274.split(":");
                                        _274 = trim(_277[0]);
                                        _276 = trim(_277[1]);
                                    } else {
                                        _274 = trim(_274);
                                    }
                                    if (!_276) {
                                        _276 = _274;
                                    }
                                    this._attachEvents.push(_26e(_26c, _274, lang.hitch(_26f, _276)));
                                }
                            }
                        }
                        return ret;
                    },_attach: function(node, type, func) {
                        type = type.replace(/^on/, "").toLowerCase();
                        if (type == "dijitclick") {
                            type = _269 || (_269 = _261("./a11yclick"));
                        } else {
                            type = _268[type] || type;
                        }
                        return on(node, type, func);
                    },_detachTemplateNodes: function() {
                        var _278 = this.attachScope || this;
                        _262.forEach(this._attachPoints, function(_279) {
                            delete _278[_279];
                        });
                        this._attachPoints = [];
                        _262.forEach(this._attachEvents, function(_27a) {
                            _27a.remove();
                        });
                        this._attachEvents = [];
                    },destroyRendering: function() {
                        this._detachTemplateNodes();
                        this.inherited(arguments);
                    }});
                lang.extend(_267, {dojoAttachEvent: "",dojoAttachPoint: ""});
                return _26a;
            });
        },"dojo/uacss": function() {
            define(["./dom-geometry", "./_base/lang", "./domReady", "./sniff", "./_base/window"], function(_27b, lang, _27c, has, _27d) {
                var html = _27d.doc.documentElement, ie = has("ie"), _27e = has("opera"), maj = Math.floor, ff = has("ff"), _27f = _27b.boxModel.replace(/-/, ""), _280 = {"dj_quirks": has("quirks"),"dj_opera": _27e,"dj_khtml": has("khtml"),"dj_webkit": has("webkit"),"dj_safari": has("safari"),"dj_chrome": has("chrome"),"dj_gecko": has("mozilla"),"dj_ios": has("ios"),"dj_android": has("android")};
                if (ie) {
                    _280["dj_ie"] = true;
                    _280["dj_ie" + maj(ie)] = true;
                    _280["dj_iequirks"] = has("quirks");
                }
                if (ff) {
                    _280["dj_ff" + maj(ff)] = true;
                }
                _280["dj_" + _27f] = true;
                var _281 = "";
                for (var clz in _280) {
                    if (_280[clz]) {
                        _281 += clz + " ";
                    }
                }
                html.className = lang.trim(html.className + " " + _281);
                _27c(function() {
                    if (!_27b.isBodyLtr()) {
                        var _282 = "dj_rtl dijitRtl " + _281.replace(/ /g, "-rtl ");
                        html.className = lang.trim(html.className + " " + _282 + "dj_rtl dijitRtl " + _281.replace(/ /g, "-rtl "));
                    }
                });
                return has;
            });
        },"dojo/window": function() {
            define(["./_base/lang", "./sniff", "./_base/window", "./dom", "./dom-geometry", "./dom-style", "./dom-construct"], function(lang, has, _283, dom, geom, _284, _285) {
                has.add("rtl-adjust-position-for-verticalScrollBar", function(win, doc) {
                    var body = _283.body(doc), _286 = _285.create("div", {style: {overflow: "scroll",overflowX: "visible",direction: "rtl",visibility: "hidden",position: "absolute",left: "0",top: "0",width: "64px",height: "64px"}}, body, "last"), div = _285.create("div", {style: {overflow: "hidden",direction: "ltr"}}, _286, "last"), ret = geom.position(div).x != 0;
                    _286.removeChild(div);
                    body.removeChild(_286);
                    return ret;
                });
                has.add("position-fixed-support", function(win, doc) {
                    var body = _283.body(doc), _287 = _285.create("span", {style: {visibility: "hidden",position: "fixed",left: "1px",top: "1px"}}, body, "last"), _288 = _285.create("span", {style: {position: "fixed",left: "0",top: "0"}}, _287, "last"), ret = geom.position(_288).x != geom.position(_287).x;
                    _287.removeChild(_288);
                    body.removeChild(_287);
                    return ret;
                });
                var _289 = {getBox: function(doc) {
                        doc = doc || _283.doc;
                        var _28a = (doc.compatMode == "BackCompat") ? _283.body(doc) : doc.documentElement, _28b = geom.docScroll(doc), w, h;
                        if (has("touch")) {
                            var _28c = _289.get(doc);
                            w = _28c.innerWidth || _28a.clientWidth;
                            h = _28c.innerHeight || _28a.clientHeight;
                        } else {
                            w = _28a.clientWidth;
                            h = _28a.clientHeight;
                        }
                        return {l: _28b.x,t: _28b.y,w: w,h: h};
                    },get: function(doc) {
                        if (has("ie") && _289 !== document.parentWindow) {
                            doc.parentWindow.execScript("document._parentWindow = window;", "Javascript");
                            var win = doc._parentWindow;
                            doc._parentWindow = null;
                            return win;
                        }
                        return doc.parentWindow || doc.defaultView;
                    },scrollIntoView: function(node, pos) {
                        try {
                            node = dom.byId(node);
                            var doc = node.ownerDocument || _283.doc, body = _283.body(doc), html = doc.documentElement || body.parentNode, isIE = has("ie"), isWK = has("webkit");
                            if (node == body || node == html) {
                                return;
                            }
                            if (!(has("mozilla") || isIE || isWK || has("opera") || has("trident")) && ("scrollIntoView" in node)) {
                                node.scrollIntoView(false);
                                return;
                            }
                            var _28d = doc.compatMode == "BackCompat", _28e = Math.min(body.clientWidth || html.clientWidth, html.clientWidth || body.clientWidth), _28f = Math.min(body.clientHeight || html.clientHeight, html.clientHeight || body.clientHeight), _290 = (isWK || _28d) ? body : html, _291 = pos || geom.position(node), el = node.parentNode, _292 = function(el) {
                                return (isIE <= 6 || (isIE == 7 && _28d)) ? false : (has("position-fixed-support") && (_284.get(el, "position").toLowerCase() == "fixed"));
                            }, self = this, _293 = function(el, x, y) {
                                if (el.tagName == "BODY" || el.tagName == "HTML") {
                                    self.get(el.ownerDocument).scrollBy(x, y);
                                } else {
                                    x && (el.scrollLeft += x);
                                    y && (el.scrollTop += y);
                                }
                            };
                            if (_292(node)) {
                                return;
                            }
                            while (el) {
                                if (el == body) {
                                    el = _290;
                                }
                                var _294 = geom.position(el), _295 = _292(el), rtl = _284.getComputedStyle(el).direction.toLowerCase() == "rtl";
                                if (el == _290) {
                                    _294.w = _28e;
                                    _294.h = _28f;
                                    if (_290 == html && isIE && rtl) {
                                        _294.x += _290.offsetWidth - _294.w;
                                    }
                                    if (_294.x < 0 || !isIE || isIE >= 9) {
                                        _294.x = 0;
                                    }
                                    if (_294.y < 0 || !isIE || isIE >= 9) {
                                        _294.y = 0;
                                    }
                                } else {
                                    var pb = geom.getPadBorderExtents(el);
                                    _294.w -= pb.w;
                                    _294.h -= pb.h;
                                    _294.x += pb.l;
                                    _294.y += pb.t;
                                    var _296 = el.clientWidth, _297 = _294.w - _296;
                                    if (_296 > 0 && _297 > 0) {
                                        if (rtl && has("rtl-adjust-position-for-verticalScrollBar")) {
                                            _294.x += _297;
                                        }
                                        _294.w = _296;
                                    }
                                    _296 = el.clientHeight;
                                    _297 = _294.h - _296;
                                    if (_296 > 0 && _297 > 0) {
                                        _294.h = _296;
                                    }
                                }
                                if (_295) {
                                    if (_294.y < 0) {
                                        _294.h += _294.y;
                                        _294.y = 0;
                                    }
                                    if (_294.x < 0) {
                                        _294.w += _294.x;
                                        _294.x = 0;
                                    }
                                    if (_294.y + _294.h > _28f) {
                                        _294.h = _28f - _294.y;
                                    }
                                    if (_294.x + _294.w > _28e) {
                                        _294.w = _28e - _294.x;
                                    }
                                }
                                var l = _291.x - _294.x, t = _291.y - _294.y, r = l + _291.w - _294.w, bot = t + _291.h - _294.h;
                                var s, old;
                                if (r * l > 0 && (!!el.scrollLeft || el == _290 || el.scrollWidth > el.offsetHeight)) {
                                    s = Math[l < 0 ? "max" : "min"](l, r);
                                    if (rtl && ((isIE == 8 && !_28d) || isIE >= 9)) {
                                        s = -s;
                                    }
                                    old = el.scrollLeft;
                                    _293(el, s, 0);
                                    s = el.scrollLeft - old;
                                    _291.x -= s;
                                }
                                if (bot * t > 0 && (!!el.scrollTop || el == _290 || el.scrollHeight > el.offsetHeight)) {
                                    s = Math.ceil(Math[t < 0 ? "max" : "min"](t, bot));
                                    old = el.scrollTop;
                                    _293(el, 0, s);
                                    s = el.scrollTop - old;
                                    _291.y -= s;
                                }
                                el = (el != _290) && !_295 && el.parentNode;
                            }
                        } catch (error) {
                            console.error("scrollIntoView: " + error);
                            node.scrollIntoView(false);
                        }
                    }};
                1 && lang.setObject("dojo.window", _289);
                return _289;
            });
        },"dojo/dnd/Mover": function() {
            define(["../_base/array", "../_base/declare", "../_base/lang", "../sniff", "../_base/window", "../dom", "../dom-geometry", "../dom-style", "../Evented", "../on", "../touch", "./common", "./autoscroll"], function(_298, _299, lang, has, win, dom, _29a, _29b, _29c, on, _29d, dnd, _29e) {
                return _299("dojo.dnd.Mover", [_29c], {constructor: function(node, e, host) {
                        this.node = dom.byId(node);
                        this.marginBox = {l: e.pageX,t: e.pageY};
                        this.mouseButton = e.button;
                        var h = (this.host = host), d = node.ownerDocument;
                        function _29f(e) {
                            e.preventDefault();
                            e.stopPropagation();
                        }
                        ;
                        this.events = [on(d, _29d.move, lang.hitch(this, "onFirstMove")), on(d, _29d.move, lang.hitch(this, "onMouseMove")), on(d, _29d.release, lang.hitch(this, "onMouseUp")), on(d, "dragstart", _29f), on(d.body, "selectstart", _29f)];
                        _29e.autoScrollStart(d);
                        if (h && h.onMoveStart) {
                            h.onMoveStart(this);
                        }
                    },onMouseMove: function(e) {
                        _29e.autoScroll(e);
                        var m = this.marginBox;
                        this.host.onMove(this, {l: m.l + e.pageX,t: m.t + e.pageY}, e);
                        e.preventDefault();
                        e.stopPropagation();
                    },onMouseUp: function(e) {
                        if (has("webkit") && has("mac") && this.mouseButton == 2 ? e.button == 0 : this.mouseButton == e.button) {
                            this.destroy();
                        }
                        e.preventDefault();
                        e.stopPropagation();
                    },onFirstMove: function(e) {
                        var s = this.node.style, l, t, h = this.host;
                        switch (s.position) {
                            case "relative":
                            case "absolute":
                                l = Math.round(parseFloat(s.left)) || 0;
                                t = Math.round(parseFloat(s.top)) || 0;
                                break;
                            default:
                                s.position = "absolute";
                                var m = _29a.getMarginBox(this.node);
                                var b = win.doc.body;
                                var bs = _29b.getComputedStyle(b);
                                var bm = _29a.getMarginBox(b, bs);
                                var bc = _29a.getContentBox(b, bs);
                                l = m.l - (bc.l - bm.l);
                                t = m.t - (bc.t - bm.t);
                                break;
                        }
                        this.marginBox.l = l - this.marginBox.l;
                        this.marginBox.t = t - this.marginBox.t;
                        if (h && h.onFirstMove) {
                            h.onFirstMove(this, e);
                        }
                        this.events.shift().remove();
                    },destroy: function() {
                        _298.forEach(this.events, function(_2a0) {
                            _2a0.remove();
                        });
                        var h = this.host;
                        if (h && h.onMoveStop) {
                            h.onMoveStop(this);
                        }
                        this.events = this.node = this.host = null;
                    }});
            });
        },"dojox/grid/_EditManager": function() {
            define(["dojo/_base/lang", "dojo/_base/array", "dojo/_base/declare", "dojo/_base/connect", "dojo/_base/sniff", "./util"], function(lang, _2a1, _2a2, _2a3, has, util) {
                return _2a2("dojox.grid._EditManager", null, {constructor: function(_2a4) {
                        this.grid = _2a4;
                        this.connections = !has("ie") ? [] : [_2a3.connect(document.body, "onfocus", lang.hitch(this, "_boomerangFocus"))];
                        this.connections.push(_2a3.connect(this.grid, "onBlur", this, "apply"));
                        this.connections.push(_2a3.connect(this.grid, "prerender", this, "_onPreRender"));
                    },info: {},destroy: function() {
                        _2a1.forEach(this.connections, _2a3.disconnect);
                    },cellFocus: function(_2a5, _2a6) {
                        if (this.grid.singleClickEdit || this.isEditRow(_2a6)) {
                            this.setEditCell(_2a5, _2a6);
                        } else {
                            this.apply();
                        }
                        if (this.isEditing() || (_2a5 && _2a5.editable && _2a5.alwaysEditing)) {
                            this._focusEditor(_2a5, _2a6);
                        }
                    },rowClick: function(e) {
                        if (this.isEditing() && !this.isEditRow(e.rowIndex)) {
                            this.apply();
                        }
                    },styleRow: function(_2a7) {
                        if (_2a7.index == this.info.rowIndex) {
                            _2a7.customClasses += " dojoxGridRowEditing";
                        }
                    },dispatchEvent: function(e) {
                        var c = e.cell, ed = (c && c["editable"]) ? c : 0;
                        return ed && ed.dispatchEvent(e.dispatch, e);
                    },isEditing: function() {
                        return this.info.rowIndex !== undefined;
                    },isEditCell: function(_2a8, _2a9) {
                        return (this.info.rowIndex === _2a8) && (this.info.cell.index == _2a9);
                    },isEditRow: function(_2aa) {
                        return this.info.rowIndex === _2aa;
                    },setEditCell: function(_2ab, _2ac) {
                        if (!this.isEditCell(_2ac, _2ab.index) && this.grid.canEdit && this.grid.canEdit(_2ab, _2ac)) {
                            this.start(_2ab, _2ac, this.isEditRow(_2ac) || _2ab.editable);
                        }
                    },_focusEditor: function(_2ad, _2ae) {
                        util.fire(_2ad, "focus", [_2ae]);
                    },focusEditor: function() {
                        if (this.isEditing()) {
                            this._focusEditor(this.info.cell, this.info.rowIndex);
                        }
                    },_boomerangWindow: 500,_shouldCatchBoomerang: function() {
                        return this._catchBoomerang > new Date().getTime();
                    },_boomerangFocus: function() {
                        if (this._shouldCatchBoomerang()) {
                            this.grid.focus.focusGrid();
                            this.focusEditor();
                            this._catchBoomerang = 0;
                        }
                    },_doCatchBoomerang: function() {
                        if (has("ie")) {
                            this._catchBoomerang = new Date().getTime() + this._boomerangWindow;
                        }
                    },start: function(_2af, _2b0, _2b1) {
                        if (!this._isValidInput()) {
                            return;
                        }
                        this.grid.beginUpdate();
                        this.editorApply();
                        if (this.isEditing() && !this.isEditRow(_2b0)) {
                            this.applyRowEdit();
                            this.grid.updateRow(_2b0);
                        }
                        if (_2b1) {
                            this.info = {cell: _2af,rowIndex: _2b0};
                            this.grid.doStartEdit(_2af, _2b0);
                            this.grid.updateRow(_2b0);
                        } else {
                            this.info = {};
                        }
                        this.grid.endUpdate();
                        this.grid.focus.focusGrid();
                        this._focusEditor(_2af, _2b0);
                        this._doCatchBoomerang();
                    },_editorDo: function(_2b2) {
                        var c = this.info.cell;
                        if (c && c.editable) {
                            c[_2b2](this.info.rowIndex);
                        }
                    },editorApply: function() {
                        this._editorDo("apply");
                    },editorCancel: function() {
                        this._editorDo("cancel");
                    },applyCellEdit: function(_2b3, _2b4, _2b5) {
                        if (this.grid.canEdit(_2b4, _2b5)) {
                            this.grid.doApplyCellEdit(_2b3, _2b5, _2b4.field);
                        }
                    },applyRowEdit: function() {
                        this.grid.doApplyEdit(this.info.rowIndex, this.info.cell.field);
                    },apply: function() {
                        if (this.isEditing() && this._isValidInput()) {
                            this.grid.beginUpdate();
                            this.editorApply();
                            this.applyRowEdit();
                            this.info = {};
                            this.grid.endUpdate();
                            this.grid.focus.focusGrid();
                            this._doCatchBoomerang();
                        }
                    },cancel: function() {
                        if (this.isEditing()) {
                            this.grid.beginUpdate();
                            this.editorCancel();
                            this.info = {};
                            this.grid.endUpdate();
                            this.grid.focus.focusGrid();
                            this._doCatchBoomerang();
                        }
                    },save: function(_2b6, _2b7) {
                        var c = this.info.cell;
                        if (this.isEditRow(_2b6) && (!_2b7 || c.view == _2b7) && c.editable) {
                            c.save(c, this.info.rowIndex);
                        }
                    },restore: function(_2b8, _2b9) {
                        var c = this.info.cell;
                        if (this.isEditRow(_2b9) && c.view == _2b8 && c.editable) {
                            c.restore(this.info.rowIndex);
                        }
                    },_isValidInput: function() {
                        var w = (this.info.cell || {}).widget;
                        if (!w || !w.isValid) {
                            return true;
                        }
                        w.focused = true;
                        return w.isValid(true);
                    },_onPreRender: function() {
                        if (this.isEditing()) {
                            this.info.value = this.info.cell.getValue();
                        }
                    }});
            });
        },"dojox/grid/DataSelection": function() {
            define(["dojo/_base/declare", "./_SelectionPreserver", "./Selection"], function(_2ba, _2bb, _2bc) {
                return _2ba("dojox.grid.DataSelection", _2bc, {constructor: function(grid) {
                        if (grid.keepSelection) {
                            this.preserver = new _2bb(this);
                        }
                    },destroy: function() {
                        if (this.preserver) {
                            this.preserver.destroy();
                        }
                    },getFirstSelected: function() {
                        var idx = _2bc.prototype.getFirstSelected.call(this);
                        if (idx == -1) {
                            return null;
                        }
                        return this.grid.getItem(idx);
                    },getNextSelected: function(_2bd) {
                        var _2be = this.grid.getItemIndex(_2bd);
                        var idx = _2bc.prototype.getNextSelected.call(this, _2be);
                        if (idx == -1) {
                            return null;
                        }
                        return this.grid.getItem(idx);
                    },getSelected: function() {
                        var _2bf = [];
                        for (var i = 0, l = this.selected.length; i < l; i++) {
                            if (this.selected[i]) {
                                _2bf.push(this.grid.getItem(i));
                            }
                        }
                        return _2bf;
                    },addToSelection: function(_2c0) {
                        if (this.mode == "none") {
                            return;
                        }
                        var idx = null;
                        if (typeof _2c0 == "number" || typeof _2c0 == "string") {
                            idx = _2c0;
                        } else {
                            idx = this.grid.getItemIndex(_2c0);
                        }
                        _2bc.prototype.addToSelection.call(this, idx);
                    },deselect: function(_2c1) {
                        if (this.mode == "none") {
                            return;
                        }
                        var idx = null;
                        if (typeof _2c1 == "number" || typeof _2c1 == "string") {
                            idx = _2c1;
                        } else {
                            idx = this.grid.getItemIndex(_2c1);
                        }
                        _2bc.prototype.deselect.call(this, idx);
                    },deselectAll: function(_2c2) {
                        var idx = null;
                        if (_2c2 || typeof _2c2 == "number") {
                            if (typeof _2c2 == "number" || typeof _2c2 == "string") {
                                idx = _2c2;
                            } else {
                                idx = this.grid.getItemIndex(_2c2);
                            }
                            _2bc.prototype.deselectAll.call(this, idx);
                        } else {
                            this.inherited(arguments);
                        }
                    }});
            });
        },"dojox/grid/_ViewManager": function() {
            define(["dojo/_base/declare", "dojo/_base/sniff", "dojo/dom-class"], function(_2c3, has, _2c4) {
                return _2c3("dojox.grid._ViewManager", null, {constructor: function(_2c5) {
                        this.grid = _2c5;
                    },defaultWidth: 200,views: [],resize: function() {
                        this.onEach("resize");
                    },render: function() {
                        this.onEach("render");
                    },addView: function(_2c6) {
                        _2c6.idx = this.views.length;
                        this.views.push(_2c6);
                    },destroyViews: function() {
                        for (var i = 0, v; v = this.views[i]; i++) {
                            v.destroy();
                        }
                        this.views = [];
                    },getContentNodes: function() {
                        var _2c7 = [];
                        for (var i = 0, v; v = this.views[i]; i++) {
                            _2c7.push(v.contentNode);
                        }
                        return _2c7;
                    },forEach: function(_2c8) {
                        for (var i = 0, v; v = this.views[i]; i++) {
                            _2c8(v, i);
                        }
                    },onEach: function(_2c9, _2ca) {
                        _2ca = _2ca || [];
                        for (var i = 0, v; v = this.views[i]; i++) {
                            if (_2c9 in v) {
                                v[_2c9].apply(v, _2ca);
                            }
                        }
                    },normalizeHeaderNodeHeight: function() {
                        var _2cb = [];
                        for (var i = 0, v; (v = this.views[i]); i++) {
                            if (v.headerContentNode.firstChild) {
                                _2cb.push(v.headerContentNode);
                            }
                        }
                        this.normalizeRowNodeHeights(_2cb);
                    },normalizeRowNodeHeights: function(_2cc) {
                        var h = 0;
                        var _2cd = [];
                        if (this.grid.rowHeight) {
                            h = this.grid.rowHeight;
                        } else {
                            if (_2cc.length <= 1) {
                                return;
                            }
                            for (var i = 0, n; (n = _2cc[i]); i++) {
                                if (!_2c4.contains(n, "dojoxGridNonNormalizedCell")) {
                                    _2cd[i] = n.firstChild.offsetHeight;
                                    h = Math.max(h, _2cd[i]);
                                }
                            }
                            h = (h >= 0 ? h : 0);
                            if ((has("mozilla") || has("ie") > 8) && h) {
                                h++;
                            }
                        }
                        for (i = 0; (n = _2cc[i]); i++) {
                            if (_2cd[i] != h) {
                                n.firstChild.style.height = h + "px";
                            }
                        }
                    },resetHeaderNodeHeight: function() {
                        for (var i = 0, v, n; (v = this.views[i]); i++) {
                            n = v.headerContentNode.firstChild;
                            if (n) {
                                n.style.height = "";
                            }
                        }
                    },renormalizeRow: function(_2ce) {
                        var _2cf = [];
                        for (var i = 0, v, n; (v = this.views[i]) && (n = v.getRowNode(_2ce)); i++) {
                            n.firstChild.style.height = "";
                            _2cf.push(n);
                        }
                        this.normalizeRowNodeHeights(_2cf);
                    },getViewWidth: function(_2d0) {
                        return this.views[_2d0].getWidth() || this.defaultWidth;
                    },measureHeader: function() {
                        this.resetHeaderNodeHeight();
                        this.forEach(function(_2d1) {
                            _2d1.headerContentNode.style.height = "";
                        });
                        var h = 0;
                        this.forEach(function(_2d2) {
                            h = Math.max(_2d2.headerNode.offsetHeight, h);
                        });
                        return h;
                    },measureContent: function() {
                        var h = 0;
                        this.forEach(function(_2d3) {
                            h = Math.max(_2d3.domNode.offsetHeight, h);
                        });
                        return h;
                    },findClient: function(_2d4) {
                        var c = this.grid.elasticView || -1;
                        if (c < 0) {
                            for (var i = 1, v; (v = this.views[i]); i++) {
                                if (v.viewWidth) {
                                    for (i = 1; (v = this.views[i]); i++) {
                                        if (!v.viewWidth) {
                                            c = i;
                                            break;
                                        }
                                    }
                                    break;
                                }
                            }
                        }
                        if (c < 0) {
                            c = Math.floor(this.views.length / 2);
                        }
                        return c;
                    },arrange: function(l, w) {
                        var i, v, vw, len = this.views.length, self = this;
                        var c = (w <= 0 ? len : this.findClient());
                        var _2d5 = function(v, l) {
                            var ds = v.domNode.style;
                            var hs = v.headerNode.style;
                            if (!self.grid.isLeftToRight()) {
                                ds.right = l + "px";
                                if (has("ff") < 4) {
                                    hs.right = l + v.getScrollbarWidth() + "px";
                                } else {
                                    hs.right = l + "px";
                                }
                                if (!has("webkit") && hs.width != "auto") {
                                    hs.width = parseInt(hs.width, 10) - v.getScrollbarWidth() + "px";
                                }
                            } else {
                                ds.left = l + "px";
                                hs.left = l + "px";
                            }
                            ds.top = 0 + "px";
                            hs.top = 0;
                        };
                        for (i = 0; (v = this.views[i]) && (i < c); i++) {
                            vw = this.getViewWidth(i);
                            v.setSize(vw, 0);
                            _2d5(v, l);
                            if (v.headerContentNode && v.headerContentNode.firstChild) {
                                vw = v.getColumnsWidth() + v.getScrollbarWidth();
                            } else {
                                vw = v.domNode.offsetWidth;
                            }
                            l += vw;
                        }
                        i++;
                        var r = w;
                        for (var j = len - 1; (v = this.views[j]) && (i <= j); j--) {
                            vw = this.getViewWidth(j);
                            v.setSize(vw, 0);
                            vw = v.domNode.offsetWidth;
                            r -= vw;
                            _2d5(v, r);
                        }
                        if (c < len) {
                            v = this.views[c];
                            vw = Math.max(1, r - l);
                            v.setSize(vw + "px", 0);
                            _2d5(v, l);
                        }
                        return l;
                    },renderRow: function(_2d6, _2d7, _2d8) {
                        var _2d9 = [];
                        for (var i = 0, v, n, _2da; (v = this.views[i]) && (n = _2d7[i]); i++) {
                            _2da = v.renderRow(_2d6);
                            n.appendChild(_2da);
                            _2d9.push(_2da);
                        }
                        if (!_2d8) {
                            this.normalizeRowNodeHeights(_2d9);
                        }
                    },rowRemoved: function(_2db) {
                        this.onEach("rowRemoved", [_2db]);
                    },updateRow: function(_2dc, _2dd) {
                        for (var i = 0, v; v = this.views[i]; i++) {
                            v.updateRow(_2dc);
                        }
                        if (!_2dd) {
                            this.renormalizeRow(_2dc);
                        }
                    },updateRowStyles: function(_2de) {
                        this.onEach("updateRowStyles", [_2de]);
                    },setScrollTop: function(_2df) {
                        var top = _2df;
                        for (var i = 0, v; v = this.views[i]; i++) {
                            top = v.setScrollTop(_2df);
                            if (has("ie") && v.headerNode && v.scrollboxNode) {
                                v.headerNode.scrollLeft = v.scrollboxNode.scrollLeft;
                            }
                        }
                        return top;
                    },getFirstScrollingView: function() {
                        for (var i = 0, v; (v = this.views[i]); i++) {
                            if (v.hasHScrollbar() || v.hasVScrollbar()) {
                                return v;
                            }
                        }
                        return null;
                    }});
            });
        },"dijit/_OnDijitClickMixin": function() {
            define(["dojo/on", "dojo/_base/array", "dojo/keys", "dojo/_base/declare", "dojo/has", "./a11yclick"], function(on, _2e0, keys, _2e1, has, _2e2) {
                var ret = _2e1("dijit._OnDijitClickMixin", null, {connect: function(obj, _2e3, _2e4) {
                        return this.inherited(arguments, [obj, _2e3 == "ondijitclick" ? _2e2 : _2e3, _2e4]);
                    }});
                ret.a11yclick = _2e2;
                return ret;
            });
        },"dojox/grid/util": function() {
            define(["../main", "dojo/_base/lang", "dojo/dom"], function(_2e5, lang, dom) {
                var dgu = lang.getObject("grid.util", true, _2e5);
                dgu.na = "...";
                dgu.rowIndexTag = "gridRowIndex";
                dgu.gridViewTag = "gridView";
                dgu.fire = function(ob, ev, args) {
                    var fn = ob && ev && ob[ev];
                    return fn && (args ? fn.apply(ob, args) : ob[ev]());
                };
                dgu.setStyleHeightPx = function(_2e6, _2e7) {
                    if (_2e7 >= 0) {
                        var s = _2e6.style;
                        var v = _2e7 + "px";
                        if (_2e6 && s["height"] != v) {
                            s["height"] = v;
                        }
                    }
                };
                dgu.mouseEvents = ["mouseover", "mouseout", "mousedown", "mouseup", "click", "dblclick", "contextmenu"];
                dgu.keyEvents = ["keyup", "keydown", "keypress"];
                dgu.funnelEvents = function(_2e8, _2e9, _2ea, _2eb) {
                    var evts = (_2eb ? _2eb : dgu.mouseEvents.concat(dgu.keyEvents));
                    for (var i = 0, l = evts.length; i < l; i++) {
                        _2e9.connect(_2e8, "on" + evts[i], _2ea);
                    }
                };
                dgu.removeNode = function(_2ec) {
                    _2ec = dom.byId(_2ec);
                    _2ec && _2ec.parentNode && _2ec.parentNode.removeChild(_2ec);
                    return _2ec;
                };
                dgu.arrayCompare = function(inA, inB) {
                    for (var i = 0, l = inA.length; i < l; i++) {
                        if (inA[i] != inB[i]) {
                            return false;
                        }
                    }
                    return (inA.length == inB.length);
                };
                dgu.arrayInsert = function(_2ed, _2ee, _2ef) {
                    if (_2ed.length <= _2ee) {
                        _2ed[_2ee] = _2ef;
                    } else {
                        _2ed.splice(_2ee, 0, _2ef);
                    }
                };
                dgu.arrayRemove = function(_2f0, _2f1) {
                    _2f0.splice(_2f1, 1);
                };
                dgu.arraySwap = function(_2f2, inI, inJ) {
                    var _2f3 = _2f2[inI];
                    _2f2[inI] = _2f2[inJ];
                    _2f2[inJ] = _2f3;
                };
                return dgu;
            });
        },"dijit/a11yclick": function() {
            define(["dojo/keys", "dojo/mouse", "dojo/on", "dojo/touch"], function(keys, _2f4, on, _2f5) {
                function _2f6(e) {
                    if ((e.keyCode === keys.ENTER || e.keyCode === keys.SPACE) && !/input|button|textarea/i.test(e.target.nodeName)) {
                        for (var node = e.target; node; node = node.parentNode) {
                            if (node.dojoClick) {
                                return true;
                            }
                        }
                    }
                }
                ;
                var _2f7;
                on(document, "keydown", function(e) {
                    if (_2f6(e)) {
                        _2f7 = e.target;
                        e.preventDefault();
                    } else {
                        _2f7 = null;
                    }
                });
                on(document, "keyup", function(e) {
                    if (_2f6(e) && e.target == _2f7) {
                        _2f7 = null;
                        on.emit(e.target, "click", {cancelable: true,bubbles: true,ctrlKey: e.ctrlKey,shiftKey: e.shiftKey,metaKey: e.metaKey,altKey: e.altKey,_origType: e.type});
                    }
                });
                var _2f8 = function(node, _2f9) {
                    node.dojoClick = true;
                    return on(node, "click", _2f9);
                };
                _2f8.click = _2f8;
                _2f8.press = function(node, _2fa) {
                    var _2fb = on(node, _2f5.press, function(evt) {
                        if (evt.type == "mousedown" && !_2f4.isLeft(evt)) {
                            return;
                        }
                        _2fa(evt);
                    }), _2fc = on(node, "keydown", function(evt) {
                        if (evt.keyCode === keys.ENTER || evt.keyCode === keys.SPACE) {
                            _2fa(evt);
                        }
                    });
                    return {remove: function() {
                            _2fb.remove();
                            _2fc.remove();
                        }};
                };
                _2f8.release = function(node, _2fd) {
                    var _2fe = on(node, _2f5.release, function(evt) {
                        if (evt.type == "mouseup" && !_2f4.isLeft(evt)) {
                            return;
                        }
                        _2fd(evt);
                    }), _2ff = on(node, "keyup", function(evt) {
                        if (evt.keyCode === keys.ENTER || evt.keyCode === keys.SPACE) {
                            _2fd(evt);
                        }
                    });
                    return {remove: function() {
                            _2fe.remove();
                            _2ff.remove();
                        }};
                };
                _2f8.move = _2f5.move;
                return _2f8;
            });
        },"dijit/hccss": function() {
            define(["dojo/dom-class", "dojo/hccss", "dojo/domReady", "dojo/_base/window"], function(_300, has, _301, win) {
                _301(function() {
                    if (has("highcontrast")) {
                        _300.add(win.body(), "dijit_a11y");
                    }
                });
                return has;
            });
        },"dojox/grid/cells": function() {
            define(["../main", "./cells/_base"], function(_302) {
                return _302.grid.cells;
            });
        },"dijit/_TemplatedMixin": function() {
            define(["dojo/cache", "dojo/_base/declare", "dojo/dom-construct", "dojo/_base/lang", "dojo/on", "dojo/sniff", "dojo/string", "./_AttachMixin"], function(_303, _304, _305, lang, on, has, _306, _307) {
                var _308 = _304("dijit._TemplatedMixin", _307, {templateString: null,templatePath: null,_skipNodeCache: false,searchContainerNode: true,_stringRepl: function(tmpl) {
                        var _309 = this.declaredClass, _30a = this;
                        return _306.substitute(tmpl, this, function(_30b, key) {
                            if (key.charAt(0) == "!") {
                                _30b = lang.getObject(key.substr(1), false, _30a);
                            }
                            if (typeof _30b == "undefined") {
                                throw new Error(_309 + " template:" + key);
                            }
                            if (_30b == null) {
                                return "";
                            }
                            return key.charAt(0) == "!" ? _30b : this._escapeValue("" + _30b);
                        }, this);
                    },_escapeValue: function(val) {
                        return val.replace(/["'<>&]/g, function(val) {
                            return {"&": "&amp;","<": "&lt;",">": "&gt;","\"": "&quot;","'": "&#x27;"}[val];
                        });
                    },buildRendering: function() {
                        if (!this._rendered) {
                            if (!this.templateString) {
                                this.templateString = _303(this.templatePath, {sanitize: true});
                            }
                            var _30c = _308.getCachedTemplate(this.templateString, this._skipNodeCache, this.ownerDocument);
                            var node;
                            if (lang.isString(_30c)) {
                                node = _305.toDom(this._stringRepl(_30c), this.ownerDocument);
                                if (node.nodeType != 1) {
                                    throw new Error("Invalid template: " + _30c);
                                }
                            } else {
                                node = _30c.cloneNode(true);
                            }
                            this.domNode = node;
                        }
                        this.inherited(arguments);
                        if (!this._rendered) {
                            this._fillContent(this.srcNodeRef);
                        }
                        this._rendered = true;
                    },_fillContent: function(_30d) {
                        var dest = this.containerNode;
                        if (_30d && dest) {
                            while (_30d.hasChildNodes()) {
                                dest.appendChild(_30d.firstChild);
                            }
                        }
                    }});
                _308._templateCache = {};
                _308.getCachedTemplate = function(_30e, _30f, doc) {
                    var _310 = _308._templateCache;
                    var key = _30e;
                    var _311 = _310[key];
                    if (_311) {
                        try {
                            if (!_311.ownerDocument || _311.ownerDocument == (doc || document)) {
                                return _311;
                            }
                        } catch (e) {
                        }
                        _305.destroy(_311);
                    }
                    _30e = _306.trim(_30e);
                    if (_30f || _30e.match(/\$\{([^\}]+)\}/g)) {
                        return (_310[key] = _30e);
                    } else {
                        var node = _305.toDom(_30e, doc);
                        if (node.nodeType != 1) {
                            throw new Error("Invalid template: " + _30e);
                        }
                        return (_310[key] = node);
                    }
                };
                if (has("ie")) {
                    on(window, "unload", function() {
                        var _312 = _308._templateCache;
                        for (var key in _312) {
                            var _313 = _312[key];
                            if (typeof _313 == "object") {
                                _305.destroy(_313);
                            }
                            delete _312[key];
                        }
                    });
                }
                return _308;
            });
        },"dojox/html/metrics": function() {
            define(["dojo/_base/kernel", "dojo/_base/lang", "dojo/_base/sniff", "dojo/ready", "dojo/_base/unload", "dojo/_base/window", "dojo/dom-geometry"], function(_314, lang, has, _315, _316, _317, _318) {
                var dhm = lang.getObject("dojox.html.metrics", true);
                var _319 = lang.getObject("dojox");
                dhm.getFontMeasurements = function() {
                    var _31a = {"1em": 0,"1ex": 0,"100%": 0,"12pt": 0,"16px": 0,"xx-small": 0,"x-small": 0,"small": 0,"medium": 0,"large": 0,"x-large": 0,"xx-large": 0};
                    if (has("ie")) {
                        _317.doc.documentElement.style.fontSize = "100%";
                    }
                    var div = _317.doc.createElement("div");
                    var ds = div.style;
                    ds.position = "absolute";
                    ds.left = "-100px";
                    ds.top = "0";
                    ds.width = "30px";
                    ds.height = "1000em";
                    ds.borderWidth = "0";
                    ds.margin = "0";
                    ds.padding = "0";
                    ds.outline = "0";
                    ds.lineHeight = "1";
                    ds.overflow = "hidden";
                    _317.body().appendChild(div);
                    for (var p in _31a) {
                        ds.fontSize = p;
                        _31a[p] = Math.round(div.offsetHeight * 12 / 16) * 16 / 12 / 1000;
                    }
                    _317.body().removeChild(div);
                    div = null;
                    return _31a;
                };
                var _31b = null;
                dhm.getCachedFontMeasurements = function(_31c) {
                    if (_31c || !_31b) {
                        _31b = dhm.getFontMeasurements();
                    }
                    return _31b;
                };
                var _31d = null, _31e = {};
                dhm.getTextBox = function(text, _31f, _320) {
                    var m, s;
                    if (!_31d) {
                        m = _31d = _317.doc.createElement("div");
                        var c = _317.doc.createElement("div");
                        c.appendChild(m);
                        s = c.style;
                        s.overflow = "scroll";
                        s.position = "absolute";
                        s.left = "0px";
                        s.top = "-10000px";
                        s.width = "1px";
                        s.height = "1px";
                        s.visibility = "hidden";
                        s.borderWidth = "0";
                        s.margin = "0";
                        s.padding = "0";
                        s.outline = "0";
                        _317.body().appendChild(c);
                    } else {
                        m = _31d;
                    }
                    m.className = "";
                    s = m.style;
                    s.borderWidth = "0";
                    s.margin = "0";
                    s.padding = "0";
                    s.outline = "0";
                    if (arguments.length > 1 && _31f) {
                        for (var i in _31f) {
                            if (i in _31e) {
                                continue;
                            }
                            s[i] = _31f[i];
                        }
                    }
                    if (arguments.length > 2 && _320) {
                        m.className = _320;
                    }
                    m.innerHTML = text;
                    var box = _318.position(m);
                    box.w = m.parentNode.scrollWidth;
                    return box;
                };
                var _321 = {w: 16,h: 16};
                dhm.getScrollbar = function() {
                    return {w: _321.w,h: _321.h};
                };
                dhm._fontResizeNode = null;
                dhm.initOnFontResize = function(_322) {
                    var f = dhm._fontResizeNode = _317.doc.createElement("iframe");
                    var fs = f.style;
                    fs.position = "absolute";
                    fs.width = "5em";
                    fs.height = "10em";
                    fs.top = "-10000px";
                    fs.display = "none";
                    if (has("ie")) {
                        f.onreadystatechange = function() {
                            if (f.contentWindow.document.readyState == "complete") {
                                f.onresize = f.contentWindow.parent[_319._scopeName].html.metrics._fontresize;
                            }
                        };
                    } else {
                        f.onload = function() {
                            f.contentWindow.onresize = f.contentWindow.parent[_319._scopeName].html.metrics._fontresize;
                        };
                    }
                    f.setAttribute("src", "javascript:'<html><head><script>if(\"loadFirebugConsole\" in window){window.loadFirebugConsole();}</script></head><body></body></html>'");
                    _317.body().appendChild(f);
                    dhm.initOnFontResize = function() {
                    };
                };
                dhm.onFontResize = function() {
                };
                dhm._fontresize = function() {
                    dhm.onFontResize();
                };
                _316.addOnUnload(function() {
                    var f = dhm._fontResizeNode;
                    if (f) {
                        if (has("ie") && f.onresize) {
                            f.onresize = null;
                        } else {
                            if (f.contentWindow && f.contentWindow.onresize) {
                                f.contentWindow.onresize = null;
                            }
                        }
                        dhm._fontResizeNode = null;
                    }
                });
                _315(function() {
                    try {
                        var n = _317.doc.createElement("div");
                        n.style.cssText = "top:0;left:0;width:100px;height:100px;overflow:scroll;position:absolute;visibility:hidden;";
                        _317.body().appendChild(n);
                        _321.w = n.offsetWidth - n.clientWidth;
                        _321.h = n.offsetHeight - n.clientHeight;
                        _317.body().removeChild(n);
                        delete n;
                    } catch (e) {
                    }
                    if ("fontSizeWatch" in _314.config && !!_314.config.fontSizeWatch) {
                        dhm.initOnFontResize();
                    }
                });
                return dhm;
            });
        },"dojox/grid/_Builder": function() {
            define(["../main", "dojo/_base/array", "dojo/_base/lang", "dojo/_base/window", "dojo/_base/event", "dojo/_base/sniff", "dojo/_base/connect", "dojo/dnd/Moveable", "dojox/html/metrics", "./util", "dojo/_base/html", "dojo/dom-geometry"], function(_323, _324, lang, win, _325, has, _326, _327, _328, util, html, _329) {
                var dg = _323.grid;
                var _32a = function(td) {
                    return td.cellIndex >= 0 ? td.cellIndex : _324.indexOf(td.parentNode.cells, td);
                };
                var _32b = function(tr) {
                    return tr.rowIndex >= 0 ? tr.rowIndex : _324.indexOf(tr.parentNode.childNodes, tr);
                };
                var _32c = function(_32d, _32e) {
                    return _32d && ((_32d.rows || 0)[_32e] || _32d.childNodes[_32e]);
                };
                var _32f = function(node) {
                    for (var n = node; n && n.tagName != "TABLE"; n = n.parentNode) {
                    }
                    return n;
                };
                var _330 = function(_331, _332) {
                    for (var n = _331; n && _332(n); n = n.parentNode) {
                    }
                    return n;
                };
                var _333 = function(_334) {
                    var name = _334.toUpperCase();
                    return function(node) {
                        return node.tagName != name;
                    };
                };
                var _335 = util.rowIndexTag;
                var _336 = util.gridViewTag;
                var _337 = dg._Builder = lang.extend(function(view) {
                    if (view) {
                        this.view = view;
                        this.grid = view.grid;
                    }
                }, {view: null,_table: "<table class=\"dojoxGridRowTable\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\" role=\"presentation\"",getTableArray: function() {
                        var html = [this._table];
                        if (this.view.viewWidth) {
                            html.push([" style=\"width:", this.view.viewWidth, ";\""].join(""));
                        }
                        html.push(">");
                        return html;
                    },generateCellMarkup: function(_338, _339, _33a, _33b) {
                        var _33c = [], html;
                        if (_33b) {
                            var _33d = _338.index != _338.grid.getSortIndex() ? "" : _338.grid.sortInfo > 0 ? "aria-sort=\"ascending\"" : "aria-sort=\"descending\"";
                            if (!_338.id) {
                                _338.id = this.grid.id + "Hdr" + _338.index;
                            }
                            html = ["<th tabIndex=\"-1\" aria-readonly=\"true\" role=\"columnheader\"", _33d, " id=\"", _338.id, "\""];
                        } else {
                            var _33e = this.grid.editable && !_338.editable ? "aria-readonly=\"true\"" : "";
                            html = ["<td tabIndex=\"-1\" role=\"gridcell\"", _33e];
                        }
                        if (_338.colSpan) {
                            html.push(" colspan=\"", _338.colSpan, "\"");
                        }
                        if (_338.rowSpan) {
                            html.push(" rowspan=\"", _338.rowSpan, "\"");
                        }
                        html.push(" class=\"dojoxGridCell ");
                        if (_338.classes) {
                            html.push(_338.classes, " ");
                        }
                        if (_33a) {
                            html.push(_33a, " ");
                        }
                        _33c.push(html.join(""));
                        _33c.push("");
                        html = ["\" idx=\"", _338.index, "\" style=\""];
                        if (_339 && _339[_339.length - 1] != ";") {
                            _339 += ";";
                        }
                        html.push(_338.styles, _339 || "", _338.hidden ? "display:none;" : "");
                        if (_338.unitWidth) {
                            html.push("width:", _338.unitWidth, ";");
                        }
                        _33c.push(html.join(""));
                        _33c.push("");
                        html = ["\""];
                        if (_338.attrs) {
                            html.push(" ", _338.attrs);
                        }
                        html.push(">");
                        _33c.push(html.join(""));
                        _33c.push("");
                        _33c.push(_33b ? "</th>" : "</td>");
                        return _33c;
                    },isCellNode: function(_33f) {
                        return Boolean(_33f && _33f != win.doc && html.attr(_33f, "idx"));
                    },getCellNodeIndex: function(_340) {
                        return _340 ? Number(html.attr(_340, "idx")) : -1;
                    },getCellNode: function(_341, _342) {
                        for (var i = 0, row; ((row = _32c(_341.firstChild, i)) && row.cells); i++) {
                            for (var j = 0, cell; (cell = row.cells[j]); j++) {
                                if (this.getCellNodeIndex(cell) == _342) {
                                    return cell;
                                }
                            }
                        }
                        return null;
                    },findCellTarget: function(_343, _344) {
                        var n = _343;
                        while (n && (!this.isCellNode(n) || (n.offsetParent && _336 in n.offsetParent.parentNode && n.offsetParent.parentNode[_336] != this.view.id)) && (n != _344)) {
                            n = n.parentNode;
                        }
                        return n != _344 ? n : null;
                    },baseDecorateEvent: function(e) {
                        e.dispatch = "do" + e.type;
                        e.grid = this.grid;
                        e.sourceView = this.view;
                        e.cellNode = this.findCellTarget(e.target, e.rowNode);
                        e.cellIndex = this.getCellNodeIndex(e.cellNode);
                        e.cell = (e.cellIndex >= 0 ? this.grid.getCell(e.cellIndex) : null);
                    },findTarget: function(_345, _346) {
                        var n = _345;
                        while (n && (n != this.domNode) && (!(_346 in n) || (_336 in n && n[_336] != this.view.id))) {
                            n = n.parentNode;
                        }
                        return (n != this.domNode) ? n : null;
                    },findRowTarget: function(_347) {
                        return this.findTarget(_347, _335);
                    },isIntraNodeEvent: function(e) {
                        try {
                            return (e.cellNode && e.relatedTarget && html.isDescendant(e.relatedTarget, e.cellNode));
                        } catch (x) {
                            return false;
                        }
                    },isIntraRowEvent: function(e) {
                        try {
                            var row = e.relatedTarget && this.findRowTarget(e.relatedTarget);
                            return !row && (e.rowIndex == -1) || row && (e.rowIndex == row.gridRowIndex);
                        } catch (x) {
                            return false;
                        }
                    },dispatchEvent: function(e) {
                        if (e.dispatch in this) {
                            return this[e.dispatch](e);
                        }
                        return false;
                    },domouseover: function(e) {
                        if (e.cellNode && (e.cellNode != this.lastOverCellNode)) {
                            this.lastOverCellNode = e.cellNode;
                            this.grid.onMouseOver(e);
                        }
                        this.grid.onMouseOverRow(e);
                    },domouseout: function(e) {
                        if (e.cellNode && (e.cellNode == this.lastOverCellNode) && !this.isIntraNodeEvent(e, this.lastOverCellNode)) {
                            this.lastOverCellNode = null;
                            this.grid.onMouseOut(e);
                            if (!this.isIntraRowEvent(e)) {
                                this.grid.onMouseOutRow(e);
                            }
                        }
                    },domousedown: function(e) {
                        if (e.cellNode) {
                            this.grid.onMouseDown(e);
                        }
                        this.grid.onMouseDownRow(e);
                    },_getTextDirStyle: function(_348, _349, _34a) {
                        return "";
                    }});
                var _34b = dg._ContentBuilder = lang.extend(function(view) {
                    _337.call(this, view);
                }, _337.prototype, {update: function() {
                        this.prepareHtml();
                    },prepareHtml: function() {
                        var _34c = this.grid.get, _34d = this.view.structure.cells;
                        for (var j = 0, row; (row = _34d[j]); j++) {
                            for (var i = 0, cell; (cell = row[i]); i++) {
                                cell.get = cell.get || (cell.value == undefined) && _34c;
                                cell.markup = this.generateCellMarkup(cell, cell.cellStyles, cell.cellClasses, false);
                                if (!this.grid.editable && cell.editable) {
                                    this.grid.editable = true;
                                }
                            }
                        }
                    },generateHtml: function(_34e, _34f) {
                        var html = this.getTableArray(), v = this.view, dir, _350 = v.structure.cells, item = this.grid.getItem(_34f);
                        util.fire(this.view, "onBeforeRow", [_34f, _350]);
                        for (var j = 0, row; (row = _350[j]); j++) {
                            if (row.hidden || row.header) {
                                continue;
                            }
                            html.push(!row.invisible ? "<tr>" : "<tr class=\"dojoxGridInvisible\">");
                            for (var i = 0, cell, m, cc, cs; (cell = row[i]); i++) {
                                m = cell.markup;
                                cc = cell.customClasses = [];
                                cs = cell.customStyles = [];
                                m[5] = cell.format(_34f, item);
                                m[1] = cc.join(" ");
                                m[3] = cs.join(";");
                                dir = cell.textDir || this.grid.textDir;
                                if (dir) {
                                    m[3] += this._getTextDirStyle(dir, cell, _34f);
                                }
                                html.push.apply(html, m);
                            }
                            html.push("</tr>");
                        }
                        html.push("</table>");
                        return html.join("");
                    },decorateEvent: function(e) {
                        e.rowNode = this.findRowTarget(e.target);
                        if (!e.rowNode) {
                            return false;
                        }
                        e.rowIndex = e.rowNode[_335];
                        this.baseDecorateEvent(e);
                        e.cell = this.grid.getCell(e.cellIndex);
                        return true;
                    }});
                var _351 = dg._HeaderBuilder = lang.extend(function(view) {
                    this.moveable = null;
                    _337.call(this, view);
                }, _337.prototype, {_skipBogusClicks: false,overResizeWidth: 4,minColWidth: 1,update: function() {
                        if (this.tableMap) {
                            this.tableMap.mapRows(this.view.structure.cells);
                        } else {
                            this.tableMap = new dg._TableMap(this.view.structure.cells);
                        }
                    },generateHtml: function(_352, _353) {
                        var dir, html = this.getTableArray(), _354 = this.view.structure.cells;
                        util.fire(this.view, "onBeforeRow", [-1, _354]);
                        for (var j = 0, row; (row = _354[j]); j++) {
                            if (row.hidden) {
                                continue;
                            }
                            html.push(!row.invisible ? "<tr>" : "<tr class=\"dojoxGridInvisible\">");
                            for (var i = 0, cell, _355; (cell = row[i]); i++) {
                                cell.customClasses = [];
                                cell.customStyles = [];
                                if (this.view.simpleStructure) {
                                    if (cell.draggable) {
                                        if (cell.headerClasses) {
                                            if (cell.headerClasses.indexOf("dojoDndItem") == -1) {
                                                cell.headerClasses += " dojoDndItem";
                                            }
                                        } else {
                                            cell.headerClasses = "dojoDndItem";
                                        }
                                    }
                                    if (cell.attrs) {
                                        if (cell.attrs.indexOf("dndType='gridColumn_") == -1) {
                                            cell.attrs += " dndType='gridColumn_" + this.grid.id + "'";
                                        }
                                    } else {
                                        cell.attrs = "dndType='gridColumn_" + this.grid.id + "'";
                                    }
                                }
                                _355 = this.generateCellMarkup(cell, cell.headerStyles, cell.headerClasses, true);
                                _355[5] = (_353 != undefined ? _353 : _352(cell));
                                _355[3] = cell.customStyles.join(";");
                                dir = cell.textDir || this.grid.textDir;
                                if (dir) {
                                    _355[3] += this._getTextDirStyle(dir, cell, _353);
                                }
                                _355[1] = cell.customClasses.join(" ");
                                html.push(_355.join(""));
                            }
                            html.push("</tr>");
                        }
                        html.push("</table>");
                        return html.join("");
                    },getCellX: function(e) {
                        var n, x, pos;
                        n = _330(e.target, _333("th"));
                        if (n) {
                            pos = _329.position(n);
                            x = e.clientX - pos.x;
                        } else {
                            x = e.layerX;
                        }
                        return x;
                    },decorateEvent: function(e) {
                        this.baseDecorateEvent(e);
                        e.rowIndex = -1;
                        e.cellX = this.getCellX(e);
                        return true;
                    },prepareResize: function(e, mod) {
                        do {
                            var i = e.cellIndex;
                            e.cellNode = (i ? e.cellNode.parentNode.cells[i + mod] : null);
                            e.cellIndex = (e.cellNode ? this.getCellNodeIndex(e.cellNode) : -1);
                        } while (e.cellNode && e.cellNode.style.display == "none");
                        return Boolean(e.cellNode);
                    },canResize: function(e) {
                        if (!e.cellNode || e.cellNode.colSpan > 1) {
                            return false;
                        }
                        var cell = this.grid.getCell(e.cellIndex);
                        return !cell.noresize && cell.canResize();
                    },overLeftResizeArea: function(e) {
                        if (html.hasClass(win.body(), "dojoDndMove")) {
                            return false;
                        }
                        if (has("ie")) {
                            var tN = e.target;
                            if (html.hasClass(tN, "dojoxGridArrowButtonNode") || html.hasClass(tN, "dojoxGridArrowButtonChar") || html.hasClass(tN, "dojoxGridColCaption")) {
                                return false;
                            }
                        }
                        if (this.grid.isLeftToRight()) {
                            return (e.cellIndex > 0) && (e.cellX > 0 && e.cellX < this.overResizeWidth) && this.prepareResize(e, -1);
                        }
                        var t = e.cellNode && (e.cellX > 0 && e.cellX < this.overResizeWidth);
                        return t;
                    },overRightResizeArea: function(e) {
                        if (html.hasClass(win.body(), "dojoDndMove")) {
                            return false;
                        }
                        if (has("ie")) {
                            var tN = e.target;
                            if (html.hasClass(tN, "dojoxGridArrowButtonNode") || html.hasClass(tN, "dojoxGridArrowButtonChar") || html.hasClass(tN, "dojoxGridColCaption")) {
                                return false;
                            }
                        }
                        if (this.grid.isLeftToRight()) {
                            return e.cellNode && (e.cellX >= e.cellNode.offsetWidth - this.overResizeWidth);
                        }
                        return (e.cellIndex > 0) && (e.cellX >= e.cellNode.offsetWidth - this.overResizeWidth) && this.prepareResize(e, -1);
                    },domousemove: function(e) {
                        if (!this.moveable) {
                            var c = (this.overRightResizeArea(e) ? "dojoxGridColResize" : (this.overLeftResizeArea(e) ? "dojoxGridColResize" : ""));
                            if (c && !this.canResize(e)) {
                                c = "dojoxGridColNoResize";
                            }
                            html.toggleClass(e.sourceView.headerNode, "dojoxGridColNoResize", (c == "dojoxGridColNoResize"));
                            html.toggleClass(e.sourceView.headerNode, "dojoxGridColResize", (c == "dojoxGridColResize"));
                            if (c) {
                                _325.stop(e);
                            }
                        }
                    },domousedown: function(e) {
                        if (!this.moveable) {
                            if ((this.overRightResizeArea(e) || this.overLeftResizeArea(e)) && this.canResize(e)) {
                                this.beginColumnResize(e);
                            } else {
                                this.grid.onMouseDown(e);
                                this.grid.onMouseOverRow(e);
                            }
                        }
                    },doclick: function(e) {
                        if (this._skipBogusClicks) {
                            _325.stop(e);
                            return true;
                        }
                        return false;
                    },colResizeSetup: function(e, _356) {
                        var _357 = html.contentBox(e.sourceView.headerNode);
                        if (_356) {
                            this.lineDiv = document.createElement("div");
                            var vw = html.position(e.sourceView.headerNode, true);
                            var _358 = html.contentBox(e.sourceView.domNode);
                            var l = e.pageX;
                            if (!this.grid.isLeftToRight() && has("ie") < 8) {
                                l -= _328.getScrollbar().w;
                            }
                            html.style(this.lineDiv, {top: vw.y + "px",left: l + "px",height: (_358.h + _357.h) + "px"});
                            html.addClass(this.lineDiv, "dojoxGridResizeColLine");
                            this.lineDiv._origLeft = l;
                            win.body().appendChild(this.lineDiv);
                        }
                        var _359 = [], _35a = this.tableMap.findOverlappingNodes(e.cellNode);
                        for (var i = 0, cell; (cell = _35a[i]); i++) {
                            _359.push({node: cell,index: this.getCellNodeIndex(cell),width: cell.offsetWidth});
                        }
                        var view = e.sourceView;
                        var adj = this.grid.isLeftToRight() ? 1 : -1;
                        var _35b = e.grid.views.views;
                        var _35c = [];
                        for (var j = view.idx + adj, _35d; (_35d = _35b[j]); j = j + adj) {
                            _35c.push({node: _35d.headerNode,left: window.parseInt(_35d.headerNode.style.left)});
                        }
                        var _35e = view.headerContentNode.firstChild;
                        var drag = {scrollLeft: e.sourceView.headerNode.scrollLeft,view: view,node: e.cellNode,index: e.cellIndex,w: html.contentBox(e.cellNode).w,vw: _357.w,table: _35e,tw: html.contentBox(_35e).w,spanners: _359,followers: _35c};
                        return drag;
                    },beginColumnResize: function(e) {
                        this.moverDiv = document.createElement("div");
                        html.style(this.moverDiv, {position: "absolute",left: 0});
                        win.body().appendChild(this.moverDiv);
                        html.addClass(this.grid.domNode, "dojoxGridColumnResizing");
                        var m = (this.moveable = new _327(this.moverDiv));
                        var drag = this.colResizeSetup(e, true);
                        m.onMove = lang.hitch(this, "doResizeColumn", drag);
                        _326.connect(m, "onMoveStop", lang.hitch(this, function() {
                            this.endResizeColumn(drag);
                            if (drag.node.releaseCapture) {
                                drag.node.releaseCapture();
                            }
                            this.moveable.destroy();
                            delete this.moveable;
                            this.moveable = null;
                            html.removeClass(this.grid.domNode, "dojoxGridColumnResizing");
                        }));
                        if (e.cellNode.setCapture) {
                            e.cellNode.setCapture();
                        }
                        m.onMouseDown(e);
                    },doResizeColumn: function(_35f, _360, _361) {
                        var _362 = _361.l;
                        var data = {deltaX: _362,w: _35f.w + (this.grid.isLeftToRight() ? _362 : -_362),vw: _35f.vw + _362,tw: _35f.tw + _362};
                        this.dragRecord = {inDrag: _35f,mover: _360,leftTop: _361};
                        if (data.w >= this.minColWidth) {
                            if (!_360) {
                                this.doResizeNow(_35f, data);
                            } else {
                                html.style(this.lineDiv, "left", (this.lineDiv._origLeft + data.deltaX) + "px");
                            }
                        }
                    },endResizeColumn: function(_363) {
                        if (this.dragRecord) {
                            var _364 = this.dragRecord.leftTop;
                            var _365 = this.grid.isLeftToRight() ? _364.l : -_364.l;
                            _365 += Math.max(_363.w + _365, this.minColWidth) - (_363.w + _365);
                            if (has("webkit") && _363.spanners.length) {
                                _365 += html._getPadBorderExtents(_363.spanners[0].node).w;
                            }
                            var data = {deltaX: _365,w: _363.w + _365,vw: _363.vw + _365,tw: _363.tw + _365};
                            this.doResizeNow(_363, data);
                            delete this.dragRecord;
                        }
                        html.destroy(this.lineDiv);
                        html.destroy(this.moverDiv);
                        html.destroy(this.moverDiv);
                        delete this.moverDiv;
                        this._skipBogusClicks = true;
                        _363.view.update();
                        this._skipBogusClicks = false;
                        this.grid.onResizeColumn(_363.index);
                    },doResizeNow: function(_366, data) {
                        _366.view.convertColPctToFixed();
                        if (_366.view.flexCells && !_366.view.testFlexCells()) {
                            var t = _32f(_366.node);
                            if (t) {
                                (t.style.width = "");
                            }
                        }
                        var i, s, sw, f, fl;
                        for (i = 0; (s = _366.spanners[i]); i++) {
                            sw = s.width + data.deltaX;
                            if (sw > 0) {
                                s.node.style.width = sw + "px";
                                _366.view.setColWidth(s.index, sw);
                            }
                        }
                        if (this.grid.isLeftToRight() || !has("ie")) {
                            for (i = 0; (f = _366.followers[i]); i++) {
                                fl = f.left + data.deltaX;
                                f.node.style.left = fl + "px";
                            }
                        }
                        _366.node.style.width = data.w + "px";
                        _366.view.setColWidth(_366.index, data.w);
                        _366.view.headerNode.style.width = data.vw + "px";
                        _366.view.setColumnsWidth(data.tw);
                        if (!this.grid.isLeftToRight()) {
                            _366.view.headerNode.scrollLeft = _366.scrollLeft + data.deltaX;
                        }
                    }});
                dg._TableMap = lang.extend(function(rows) {
                    this.mapRows(rows);
                }, {map: null,mapRows: function(_367) {
                        var _368 = _367.length;
                        if (!_368) {
                            return;
                        }
                        this.map = [];
                        var row;
                        for (var k = 0; (row = _367[k]); k++) {
                            this.map[k] = [];
                        }
                        for (var j = 0; (row = _367[j]); j++) {
                            for (var i = 0, x = 0, cell, _369, _36a; (cell = row[i]); i++) {
                                while (this.map[j][x]) {
                                    x++;
                                }
                                this.map[j][x] = {c: i,r: j};
                                _36a = cell.rowSpan || 1;
                                _369 = cell.colSpan || 1;
                                for (var y = 0; y < _36a; y++) {
                                    for (var s = 0; s < _369; s++) {
                                        this.map[j + y][x + s] = this.map[j][x];
                                    }
                                }
                                x += _369;
                            }
                        }
                    },dumpMap: function() {
                        for (var j = 0, row, h = ""; (row = this.map[j]); j++, h = "") {
                            for (var i = 0, cell; (cell = row[i]); i++) {
                                h += cell.r + "," + cell.c + "   ";
                            }
                        }
                    },getMapCoords: function(_36b, _36c) {
                        for (var j = 0, row; (row = this.map[j]); j++) {
                            for (var i = 0, cell; (cell = row[i]); i++) {
                                if (cell.c == _36c && cell.r == _36b) {
                                    return {j: j,i: i};
                                }
                            }
                        }
                        return {j: -1,i: -1};
                    },getNode: function(_36d, _36e, _36f) {
                        var row = _36d && _36d.rows[_36e];
                        return row && row.cells[_36f];
                    },_findOverlappingNodes: function(_370, _371, _372) {
                        var _373 = [];
                        var m = this.getMapCoords(_371, _372);
                        for (var j = 0, row; (row = this.map[j]); j++) {
                            if (j == m.j) {
                                continue;
                            }
                            var rw = row[m.i];
                            var n = (rw ? this.getNode(_370, rw.r, rw.c) : null);
                            if (n) {
                                _373.push(n);
                            }
                        }
                        return _373;
                    },findOverlappingNodes: function(_374) {
                        return this._findOverlappingNodes(_32f(_374), _32b(_374.parentNode), _32a(_374));
                    }});
                return {_Builder: _337,_HeaderBuilder: _351,_ContentBuilder: _34b};
            });
        },"dojox/grid/_Scroller": function() {
            define(["dijit/registry", "dojo/_base/declare", "dojo/_base/lang", "./util", "dojo/_base/html"], function(_375, _376, lang, util, html) {
                var _377 = function(_378) {
                    var i = 0, n, p = _378.parentNode;
                    while ((n = p.childNodes[i++])) {
                        if (n == _378) {
                            return i - 1;
                        }
                    }
                    return -1;
                };
                var _379 = function(_37a) {
                    if (!_37a) {
                        return;
                    }
                    dojo.forEach(_375.toArray(), function(w) {
                        if (w.domNode && html.isDescendant(w.domNode, _37a, true)) {
                            w.destroy();
                        }
                    });
                };
                var _37b = function(_37c) {
                    var node = html.byId(_37c);
                    return (node && node.tagName ? node.tagName.toLowerCase() : "");
                };
                var _37d = function(_37e, _37f) {
                    var _380 = [];
                    var i = 0, n;
                    while ((n = _37e.childNodes[i])) {
                        i++;
                        if (_37b(n) == _37f) {
                            _380.push(n);
                        }
                    }
                    return _380;
                };
                var _381 = function(_382) {
                    return _37d(_382, "div");
                };
                return _376("dojox.grid._Scroller", null, {constructor: function(_383) {
                        this.setContentNodes(_383);
                        this.pageHeights = [];
                        this.pageNodes = [];
                        this.stack = [];
                    },rowCount: 0,defaultRowHeight: 32,keepRows: 100,contentNode: null,scrollboxNode: null,defaultPageHeight: 0,keepPages: 10,pageCount: 0,windowHeight: 0,firstVisibleRow: 0,lastVisibleRow: 0,averageRowHeight: 0,page: 0,pageTop: 0,init: function(_384, _385, _386) {
                        switch (arguments.length) {
                            case 3:
                                this.rowsPerPage = _386;
                            case 2:
                                this.keepRows = _385;
                            case 1:
                                this.rowCount = _384;
                            default:
                                break;
                        }
                        this.defaultPageHeight = (this.grid.rowHeight > 0 ? this.grid.rowHeight : this.defaultRowHeight) * this.rowsPerPage;
                        this.pageCount = this._getPageCount(this.rowCount, this.rowsPerPage);
                        this.setKeepInfo(this.keepRows);
                        this.invalidate();
                        if (this.scrollboxNode) {
                            this.scrollboxNode.scrollTop = 0;
                            this.scroll(0);
                            this.scrollboxNode.onscroll = lang.hitch(this, "onscroll");
                        }
                    },_getPageCount: function(_387, _388) {
                        return _387 ? (Math.ceil(_387 / _388) || 1) : 0;
                    },destroy: function() {
                        this.invalidateNodes();
                        delete this.contentNodes;
                        delete this.contentNode;
                        delete this.scrollboxNode;
                    },setKeepInfo: function(_389) {
                        this.keepRows = _389;
                        this.keepPages = !this.keepRows ? this.keepPages : Math.max(Math.ceil(this.keepRows / this.rowsPerPage), 2);
                    },setContentNodes: function(_38a) {
                        this.contentNodes = _38a;
                        this.colCount = (this.contentNodes ? this.contentNodes.length : 0);
                        this.pageNodes = [];
                        for (var i = 0; i < this.colCount; i++) {
                            this.pageNodes[i] = [];
                        }
                    },getDefaultNodes: function() {
                        return this.pageNodes[0] || [];
                    },invalidate: function() {
                        this._invalidating = true;
                        this.invalidateNodes();
                        this.pageHeights = [];
                        this.height = (this.pageCount ? (this.pageCount - 1) * this.defaultPageHeight + this.calcLastPageHeight() : 0);
                        this.resize();
                        this._invalidating = false;
                    },updateRowCount: function(_38b) {
                        this.invalidateNodes();
                        this.rowCount = _38b;
                        var _38c = this.pageCount;
                        if (_38c === 0) {
                            this.height = 1;
                        }
                        this.pageCount = this._getPageCount(this.rowCount, this.rowsPerPage);
                        if (this.pageCount < _38c) {
                            for (var i = _38c - 1; i >= this.pageCount; i--) {
                                this.height -= this.getPageHeight(i);
                                delete this.pageHeights[i];
                            }
                        } else {
                            if (this.pageCount > _38c) {
                                this.height += this.defaultPageHeight * (this.pageCount - _38c - 1) + this.calcLastPageHeight();
                            }
                        }
                        this.resize();
                    },pageExists: function(_38d) {
                        return Boolean(this.getDefaultPageNode(_38d));
                    },measurePage: function(_38e) {
                        if (this.grid.rowHeight) {
                            return ((_38e + 1) * this.rowsPerPage > this.rowCount ? this.rowCount - _38e * this.rowsPerPage : this.rowsPerPage) * this.grid.rowHeight;
                        }
                        var n = this.getDefaultPageNode(_38e);
                        return (n && n.innerHTML) ? n.offsetHeight : undefined;
                    },positionPage: function(_38f, _390) {
                        for (var i = 0; i < this.colCount; i++) {
                            this.pageNodes[i][_38f].style.top = _390 + "px";
                        }
                    },repositionPages: function(_391) {
                        var _392 = this.getDefaultNodes();
                        var last = 0;
                        for (var i = 0; i < this.stack.length; i++) {
                            last = Math.max(this.stack[i], last);
                        }
                        var n = _392[_391];
                        var y = (n ? this.getPageNodePosition(n) + this.getPageHeight(_391) : 0);
                        for (var p = _391 + 1; p <= last; p++) {
                            n = _392[p];
                            if (n) {
                                if (this.getPageNodePosition(n) == y) {
                                    return;
                                }
                                this.positionPage(p, y);
                            }
                            y += this.getPageHeight(p);
                        }
                    },installPage: function(_393) {
                        for (var i = 0; i < this.colCount; i++) {
                            this.contentNodes[i].appendChild(this.pageNodes[i][_393]);
                        }
                    },preparePage: function(_394, _395) {
                        var p = (_395 ? this.popPage() : null);
                        for (var i = 0; i < this.colCount; i++) {
                            var _396 = this.pageNodes[i];
                            var _397 = (p === null ? this.createPageNode() : this.invalidatePageNode(p, _396));
                            _397.pageIndex = _394;
                            _396[_394] = _397;
                        }
                    },renderPage: function(_398) {
                        var _399 = [];
                        var i, j;
                        for (i = 0; i < this.colCount; i++) {
                            _399[i] = this.pageNodes[i][_398];
                        }
                        for (i = 0, j = _398 * this.rowsPerPage; (i < this.rowsPerPage) && (j < this.rowCount); i++, j++) {
                            this.renderRow(j, _399);
                        }
                    },removePage: function(_39a) {
                        for (var i = 0, j = _39a * this.rowsPerPage; i < this.rowsPerPage; i++, j++) {
                            this.removeRow(j);
                        }
                    },destroyPage: function(_39b) {
                        for (var i = 0; i < this.colCount; i++) {
                            var n = this.invalidatePageNode(_39b, this.pageNodes[i]);
                            if (n) {
                                html.destroy(n);
                            }
                        }
                    },pacify: function(_39c) {
                    },pacifying: false,pacifyTicks: 200,setPacifying: function(_39d) {
                        if (this.pacifying != _39d) {
                            this.pacifying = _39d;
                            this.pacify(this.pacifying);
                        }
                    },startPacify: function() {
                        this.startPacifyTicks = new Date().getTime();
                    },doPacify: function() {
                        var _39e = (new Date().getTime() - this.startPacifyTicks) > this.pacifyTicks;
                        this.setPacifying(true);
                        this.startPacify();
                        return _39e;
                    },endPacify: function() {
                        this.setPacifying(false);
                    },resize: function() {
                        if (this.scrollboxNode) {
                            this.windowHeight = this.scrollboxNode.clientHeight;
                        }
                        for (var i = 0; i < this.colCount; i++) {
                            util.setStyleHeightPx(this.contentNodes[i], Math.max(1, this.height));
                        }
                        var _39f = (!this._invalidating);
                        if (!_39f) {
                            var ah = this.grid.get("autoHeight");
                            if (typeof ah == "number" && ah <= Math.min(this.rowsPerPage, this.rowCount)) {
                                _39f = true;
                            }
                        }
                        if (_39f) {
                            this.needPage(this.page, this.pageTop);
                        }
                        var _3a0 = (this.page < this.pageCount - 1) ? this.rowsPerPage : ((this.rowCount % this.rowsPerPage) || this.rowsPerPage);
                        var _3a1 = this.getPageHeight(this.page);
                        this.averageRowHeight = (_3a1 > 0 && _3a0 > 0) ? (_3a1 / _3a0) : 0;
                    },calcLastPageHeight: function() {
                        if (!this.pageCount) {
                            return 0;
                        }
                        var _3a2 = this.pageCount - 1;
                        var _3a3 = ((this.rowCount % this.rowsPerPage) || (this.rowsPerPage)) * this.defaultRowHeight;
                        this.pageHeights[_3a2] = _3a3;
                        return _3a3;
                    },updateContentHeight: function(inDh) {
                        this.height += inDh;
                        this.resize();
                    },updatePageHeight: function(_3a4, _3a5, _3a6) {
                        if (this.pageExists(_3a4)) {
                            var oh = this.getPageHeight(_3a4);
                            var h = (this.measurePage(_3a4));
                            if (h === undefined) {
                                h = oh;
                            }
                            this.pageHeights[_3a4] = h;
                            if (oh != h) {
                                this.updateContentHeight(h - oh);
                                var ah = this.grid.get("autoHeight");
                                if ((typeof ah == "number" && ah > this.rowCount) || (ah === true && !_3a5)) {
                                    if (!_3a6) {
                                        this.grid.sizeChange();
                                    } else {
                                        var ns = this.grid.viewsNode.style;
                                        ns.height = parseInt(ns.height) + h - oh + "px";
                                        this.repositionPages(_3a4);
                                    }
                                } else {
                                    this.repositionPages(_3a4);
                                }
                            }
                            return h;
                        }
                        return 0;
                    },rowHeightChanged: function(_3a7, _3a8) {
                        this.updatePageHeight(Math.floor(_3a7 / this.rowsPerPage), false, _3a8);
                    },invalidateNodes: function() {
                        while (this.stack.length) {
                            this.destroyPage(this.popPage());
                        }
                    },createPageNode: function() {
                        var p = document.createElement("div");
                        html.attr(p, "role", "presentation");
                        p.style.position = "absolute";
                        p.style[this.grid.isLeftToRight() ? "left" : "right"] = "0";
                        return p;
                    },getPageHeight: function(_3a9) {
                        var ph = this.pageHeights[_3a9];
                        return (ph !== undefined ? ph : this.defaultPageHeight);
                    },pushPage: function(_3aa) {
                        return this.stack.push(_3aa);
                    },popPage: function() {
                        return this.stack.shift();
                    },findPage: function(_3ab) {
                        var i = 0, h = 0;
                        for (var ph = 0; i < this.pageCount; i++, h += ph) {
                            ph = this.getPageHeight(i);
                            if (h + ph >= _3ab) {
                                break;
                            }
                        }
                        this.page = i;
                        this.pageTop = h;
                    },buildPage: function(_3ac, _3ad, _3ae) {
                        this.preparePage(_3ac, _3ad);
                        this.positionPage(_3ac, _3ae);
                        this.installPage(_3ac);
                        this.renderPage(_3ac);
                        this.pushPage(_3ac);
                    },needPage: function(_3af, _3b0) {
                        var h = this.getPageHeight(_3af), oh = h;
                        if (!this.pageExists(_3af)) {
                            this.buildPage(_3af, (!this.grid._autoHeight && this.keepPages && (this.stack.length >= this.keepPages)), _3b0);
                            h = this.updatePageHeight(_3af, true);
                        } else {
                            this.positionPage(_3af, _3b0);
                        }
                        return h;
                    },onscroll: function() {
                        this.scroll(this.scrollboxNode.scrollTop);
                    },scroll: function(_3b1) {
                        this.grid.scrollTop = _3b1;
                        if (this.colCount) {
                            this.startPacify();
                            this.findPage(_3b1);
                            var h = this.height;
                            var b = this.getScrollBottom(_3b1);
                            for (var p = this.page, y = this.pageTop; (p < this.pageCount) && ((b < 0) || (y < b)); p++) {
                                y += this.needPage(p, y);
                            }
                            this.firstVisibleRow = this.getFirstVisibleRow(this.page, this.pageTop, _3b1);
                            this.lastVisibleRow = this.getLastVisibleRow(p - 1, y, b);
                            if (h != this.height) {
                                this.repositionPages(p - 1);
                            }
                            this.endPacify();
                        }
                    },getScrollBottom: function(_3b2) {
                        return (this.windowHeight >= 0 ? _3b2 + this.windowHeight : -1);
                    },processNodeEvent: function(e, _3b3) {
                        var t = e.target;
                        while (t && (t != _3b3) && t.parentNode && (t.parentNode.parentNode != _3b3)) {
                            t = t.parentNode;
                        }
                        if (!t || !t.parentNode || (t.parentNode.parentNode != _3b3)) {
                            return false;
                        }
                        var page = t.parentNode;
                        e.topRowIndex = page.pageIndex * this.rowsPerPage;
                        e.rowIndex = e.topRowIndex + _377(t);
                        e.rowTarget = t;
                        return true;
                    },processEvent: function(e) {
                        return this.processNodeEvent(e, this.contentNode);
                    },renderRow: function(_3b4, _3b5) {
                    },removeRow: function(_3b6) {
                    },getDefaultPageNode: function(_3b7) {
                        return this.getDefaultNodes()[_3b7];
                    },positionPageNode: function(_3b8, _3b9) {
                    },getPageNodePosition: function(_3ba) {
                        return _3ba.offsetTop;
                    },invalidatePageNode: function(_3bb, _3bc) {
                        var p = _3bc[_3bb];
                        if (p) {
                            delete _3bc[_3bb];
                            this.removePage(_3bb, p);
                            _379(p);
                            p.innerHTML = "";
                        }
                        return p;
                    },getPageRow: function(_3bd) {
                        return _3bd * this.rowsPerPage;
                    },getLastPageRow: function(_3be) {
                        return Math.min(this.rowCount, this.getPageRow(_3be + 1)) - 1;
                    },getFirstVisibleRow: function(_3bf, _3c0, _3c1) {
                        if (!this.pageExists(_3bf)) {
                            return 0;
                        }
                        var row = this.getPageRow(_3bf);
                        var _3c2 = this.getDefaultNodes();
                        var rows = _381(_3c2[_3bf]);
                        for (var i = 0, l = rows.length; i < l && _3c0 < _3c1; i++, row++) {
                            _3c0 += rows[i].offsetHeight;
                        }
                        return (row ? row - 1 : row);
                    },getLastVisibleRow: function(_3c3, _3c4, _3c5) {
                        if (!this.pageExists(_3c3)) {
                            return 0;
                        }
                        var _3c6 = this.getDefaultNodes();
                        var row = this.getLastPageRow(_3c3);
                        var rows = _381(_3c6[_3c3]);
                        for (var i = rows.length - 1; i >= 0 && _3c4 > _3c5; i--, row--) {
                            _3c4 -= rows[i].offsetHeight;
                        }
                        return row + 1;
                    },findTopRow: function(_3c7) {
                        var _3c8 = this.getDefaultNodes();
                        var rows = _381(_3c8[this.page]);
                        for (var i = 0, l = rows.length, t = this.pageTop, h; i < l; i++) {
                            h = rows[i].offsetHeight;
                            t += h;
                            if (t >= _3c7) {
                                this.offset = h - (t - _3c7);
                                return i + this.page * this.rowsPerPage;
                            }
                        }
                        return -1;
                    },findScrollTop: function(_3c9) {
                        var _3ca = Math.floor(_3c9 / this.rowsPerPage);
                        var t = 0;
                        var i, l;
                        for (i = 0; i < _3ca; i++) {
                            t += this.getPageHeight(i);
                        }
                        this.pageTop = t;
                        this.page = _3ca;
                        this.needPage(_3ca, this.pageTop);
                        var _3cb = this.getDefaultNodes();
                        var rows = _381(_3cb[_3ca]);
                        var r = _3c9 - this.rowsPerPage * _3ca;
                        for (i = 0, l = rows.length; i < l && i < r; i++) {
                            t += rows[i].offsetHeight;
                        }
                        return t;
                    },dummy: 0});
            });
        },"dojox/grid/_Layout": function() {
            define(["dojo/_base/kernel", "../main", "dojo/_base/declare", "dojo/_base/array", "dojo/_base/lang", "dojo/dom-geometry", "./cells", "./_RowSelector"], function(dojo, _3cc, _3cd, _3ce, lang, _3cf) {
                return _3cd("dojox.grid._Layout", null, {constructor: function(_3d0) {
                        this.grid = _3d0;
                    },cells: [],structure: null,defaultWidth: "6em",moveColumn: function(_3d1, _3d2, _3d3, _3d4, _3d5) {
                        var _3d6 = this.structure[_3d1].cells[0];
                        var _3d7 = this.structure[_3d2].cells[0];
                        var cell = null;
                        var _3d8 = 0;
                        var _3d9 = 0;
                        for (var i = 0, c; c = _3d6[i]; i++) {
                            if (c.index == _3d3) {
                                _3d8 = i;
                                break;
                            }
                        }
                        cell = _3d6.splice(_3d8, 1)[0];
                        cell.view = this.grid.views.views[_3d2];
                        for (i = 0, c = null; c = _3d7[i]; i++) {
                            if (c.index == _3d4) {
                                _3d9 = i;
                                break;
                            }
                        }
                        if (!_3d5) {
                            _3d9 += 1;
                        }
                        _3d7.splice(_3d9, 0, cell);
                        var _3da = this.grid.getCell(this.grid.getSortIndex());
                        if (_3da) {
                            _3da._currentlySorted = this.grid.getSortAsc();
                        }
                        this.cells = [];
                        _3d3 = 0;
                        var v;
                        for (i = 0; v = this.structure[i]; i++) {
                            for (var j = 0, cs; cs = v.cells[j]; j++) {
                                for (var k = 0; c = cs[k]; k++) {
                                    c.index = _3d3;
                                    this.cells.push(c);
                                    if ("_currentlySorted" in c) {
                                        var si = _3d3 + 1;
                                        si *= c._currentlySorted ? 1 : -1;
                                        this.grid.sortInfo = si;
                                        delete c._currentlySorted;
                                    }
                                    _3d3++;
                                }
                            }
                        }
                        _3ce.forEach(this.cells, function(c) {
                            var _3db = c.markup[2].split(" ");
                            var _3dc = parseInt(_3db[1].substring(5));
                            if (_3dc != c.index) {
                                _3db[1] = "idx=\"" + c.index + "\"";
                                c.markup[2] = _3db.join(" ");
                            }
                        });
                        this.grid.setupHeaderMenu();
                    },setColumnVisibility: function(_3dd, _3de) {
                        var cell = this.cells[_3dd];
                        if (cell.hidden == _3de) {
                            cell.hidden = !_3de;
                            var v = cell.view, w = v.viewWidth;
                            if (w && w != "auto") {
                                v._togglingColumn = _3cf.getMarginBox(cell.getHeaderNode()).w || 0;
                            }
                            v.update();
                            return true;
                        } else {
                            return false;
                        }
                    },addCellDef: function(_3df, _3e0, _3e1) {
                        var self = this;
                        var _3e2 = function(_3e3) {
                            var w = 0;
                            if (_3e3.colSpan > 1) {
                                w = 0;
                            } else {
                                w = _3e3.width || self._defaultCellProps.width || self.defaultWidth;
                                if (!isNaN(w)) {
                                    w = w + "em";
                                }
                            }
                            return w;
                        };
                        var _3e4 = {grid: this.grid,subrow: _3df,layoutIndex: _3e0,index: this.cells.length};
                        if (_3e1 && _3e1 instanceof _3cc.grid.cells._Base) {
                            var _3e5 = lang.clone(_3e1);
                            _3e4.unitWidth = _3e2(_3e5._props);
                            _3e5 = lang.mixin(_3e5, this._defaultCellProps, _3e1._props, _3e4);
                            return _3e5;
                        }
                        var _3e6 = _3e1.type || _3e1.cellType || this._defaultCellProps.type || this._defaultCellProps.cellType || _3cc.grid.cells.Cell;
                        if (lang.isString(_3e6)) {
                            _3e6 = lang.getObject(_3e6);
                        }
                        _3e4.unitWidth = _3e2(_3e1);
                        return new _3e6(lang.mixin({}, this._defaultCellProps, _3e1, _3e4));
                    },addRowDef: function(_3e7, _3e8) {
                        var _3e9 = [];
                        var _3ea = 0, _3eb = 0, _3ec = true;
                        for (var i = 0, def, cell; (def = _3e8[i]); i++) {
                            cell = this.addCellDef(_3e7, i, def);
                            _3e9.push(cell);
                            this.cells.push(cell);
                            if (_3ec && cell.relWidth) {
                                _3ea += cell.relWidth;
                            } else {
                                if (cell.width) {
                                    var w = cell.width;
                                    if (typeof w == "string" && w.slice(-1) == "%") {
                                        _3eb += window.parseInt(w, 10);
                                    } else {
                                        if (w == "auto") {
                                            _3ec = false;
                                        }
                                    }
                                }
                            }
                        }
                        if (_3ea && _3ec) {
                            _3ce.forEach(_3e9, function(cell) {
                                if (cell.relWidth) {
                                    cell.width = cell.unitWidth = ((cell.relWidth / _3ea) * (100 - _3eb)) + "%";
                                }
                            });
                        }
                        return _3e9;
                    },addRowsDef: function(_3ed) {
                        var _3ee = [];
                        if (lang.isArray(_3ed)) {
                            if (lang.isArray(_3ed[0])) {
                                for (var i = 0, row; _3ed && (row = _3ed[i]); i++) {
                                    _3ee.push(this.addRowDef(i, row));
                                }
                            } else {
                                _3ee.push(this.addRowDef(0, _3ed));
                            }
                        }
                        return _3ee;
                    },addViewDef: function(_3ef) {
                        this._defaultCellProps = _3ef.defaultCell || {};
                        if (_3ef.width && _3ef.width == "auto") {
                            delete _3ef.width;
                        }
                        return lang.mixin({}, _3ef, {cells: this.addRowsDef(_3ef.rows || _3ef.cells)});
                    },setStructure: function(_3f0) {
                        this.fieldIndex = 0;
                        this.cells = [];
                        var s = this.structure = [];
                        if (this.grid.rowSelector) {
                            var sel = {type: _3cc._scopeName + ".grid._RowSelector"};
                            if (lang.isString(this.grid.rowSelector)) {
                                var _3f1 = this.grid.rowSelector;
                                if (_3f1 == "false") {
                                    sel = null;
                                } else {
                                    if (_3f1 != "true") {
                                        sel["width"] = _3f1;
                                    }
                                }
                            } else {
                                if (!this.grid.rowSelector) {
                                    sel = null;
                                }
                            }
                            if (sel) {
                                s.push(this.addViewDef(sel));
                            }
                        }
                        var _3f2 = function(def) {
                            return ("name" in def || "field" in def || "get" in def);
                        };
                        var _3f3 = function(def) {
                            if (lang.isArray(def)) {
                                if (lang.isArray(def[0]) || _3f2(def[0])) {
                                    return true;
                                }
                            }
                            return false;
                        };
                        var _3f4 = function(def) {
                            return (def !== null && lang.isObject(def) && ("cells" in def || "rows" in def || ("type" in def && !_3f2(def))));
                        };
                        if (lang.isArray(_3f0)) {
                            var _3f5 = false;
                            for (var i = 0, st; (st = _3f0[i]); i++) {
                                if (_3f4(st)) {
                                    _3f5 = true;
                                    break;
                                }
                            }
                            if (!_3f5) {
                                s.push(this.addViewDef({cells: _3f0}));
                            } else {
                                for (i = 0; (st = _3f0[i]); i++) {
                                    if (_3f3(st)) {
                                        s.push(this.addViewDef({cells: st}));
                                    } else {
                                        if (_3f4(st)) {
                                            s.push(this.addViewDef(st));
                                        }
                                    }
                                }
                            }
                        } else {
                            if (_3f4(_3f0)) {
                                s.push(this.addViewDef(_3f0));
                            }
                        }
                        this.cellCount = this.cells.length;
                        this.grid.setupHeaderMenu();
                    }});
            });
        },"dojo/dnd/Source": function() {
            define(["../_base/array", "../_base/declare", "../_base/kernel", "../_base/lang", "../dom-class", "../dom-geometry", "../mouse", "../ready", "../topic", "./common", "./Selector", "./Manager"], function(_3f6, _3f7, _3f8, lang, _3f9, _3fa, _3fb, _3fc, _3fd, dnd, _3fe, _3ff) {
                if (!_3f8.isAsync) {
                    _3fc(0, function() {
                        var _400 = ["dojo/dnd/AutoSource", "dojo/dnd/Target"];
                        require(_400);
                    });
                }
                var _401 = _3f7("dojo.dnd.Source", _3fe, {isSource: true,horizontal: false,copyOnly: false,selfCopy: false,selfAccept: true,skipForm: false,withHandles: false,autoSync: false,delay: 0,accept: ["text"],generateText: true,constructor: function(node, _402) {
                        lang.mixin(this, lang.mixin({}, _402));
                        var type = this.accept;
                        if (type.length) {
                            this.accept = {};
                            for (var i = 0; i < type.length; ++i) {
                                this.accept[type[i]] = 1;
                            }
                        }
                        this.isDragging = false;
                        this.mouseDown = false;
                        this.targetAnchor = null;
                        this.targetBox = null;
                        this.before = true;
                        this._lastX = 0;
                        this._lastY = 0;
                        this.sourceState = "";
                        if (this.isSource) {
                            _3f9.add(this.node, "dojoDndSource");
                        }
                        this.targetState = "";
                        if (this.accept) {
                            _3f9.add(this.node, "dojoDndTarget");
                        }
                        if (this.horizontal) {
                            _3f9.add(this.node, "dojoDndHorizontal");
                        }
                        this.topics = [_3fd.subscribe("/dnd/source/over", lang.hitch(this, "onDndSourceOver")), _3fd.subscribe("/dnd/start", lang.hitch(this, "onDndStart")), _3fd.subscribe("/dnd/drop", lang.hitch(this, "onDndDrop")), _3fd.subscribe("/dnd/cancel", lang.hitch(this, "onDndCancel"))];
                    },checkAcceptance: function(_403, _404) {
                        if (this == _403) {
                            return !this.copyOnly || this.selfAccept;
                        }
                        for (var i = 0; i < _404.length; ++i) {
                            var type = _403.getItem(_404[i].id).type;
                            var flag = false;
                            for (var j = 0; j < type.length; ++j) {
                                if (type[j] in this.accept) {
                                    flag = true;
                                    break;
                                }
                            }
                            if (!flag) {
                                return false;
                            }
                        }
                        return true;
                    },copyState: function(_405, self) {
                        if (_405) {
                            return true;
                        }
                        if (arguments.length < 2) {
                            self = this == _3ff.manager().target;
                        }
                        if (self) {
                            if (this.copyOnly) {
                                return this.selfCopy;
                            }
                        } else {
                            return this.copyOnly;
                        }
                        return false;
                    },destroy: function() {
                        _401.superclass.destroy.call(this);
                        _3f6.forEach(this.topics, function(t) {
                            t.remove();
                        });
                        this.targetAnchor = null;
                    },onMouseMove: function(e) {
                        if (this.isDragging && this.targetState == "Disabled") {
                            return;
                        }
                        _401.superclass.onMouseMove.call(this, e);
                        var m = _3ff.manager();
                        if (!this.isDragging) {
                            if (this.mouseDown && this.isSource && (Math.abs(e.pageX - this._lastX) > this.delay || Math.abs(e.pageY - this._lastY) > this.delay)) {
                                var _406 = this.getSelectedNodes();
                                if (_406.length) {
                                    m.startDrag(this, _406, this.copyState(dnd.getCopyKeyState(e), true));
                                }
                            }
                        }
                        if (this.isDragging) {
                            var _407 = false;
                            if (this.current) {
                                if (!this.targetBox || this.targetAnchor != this.current) {
                                    this.targetBox = _3fa.position(this.current, true);
                                }
                                if (this.horizontal) {
                                    _407 = (e.pageX - this.targetBox.x < this.targetBox.w / 2) == _3fa.isBodyLtr(this.current.ownerDocument);
                                } else {
                                    _407 = (e.pageY - this.targetBox.y) < (this.targetBox.h / 2);
                                }
                            }
                            if (this.current != this.targetAnchor || _407 != this.before) {
                                this._markTargetAnchor(_407);
                                m.canDrop(!this.current || m.source != this || !(this.current.id in this.selection));
                            }
                        }
                    },onMouseDown: function(e) {
                        if (!this.mouseDown && this._legalMouseDown(e) && (!this.skipForm || !dnd.isFormElement(e))) {
                            this.mouseDown = true;
                            this._lastX = e.pageX;
                            this._lastY = e.pageY;
                            _401.superclass.onMouseDown.call(this, e);
                        }
                    },onMouseUp: function(e) {
                        if (this.mouseDown) {
                            this.mouseDown = false;
                            _401.superclass.onMouseUp.call(this, e);
                        }
                    },onDndSourceOver: function(_408) {
                        if (this !== _408) {
                            this.mouseDown = false;
                            if (this.targetAnchor) {
                                this._unmarkTargetAnchor();
                            }
                        } else {
                            if (this.isDragging) {
                                var m = _3ff.manager();
                                m.canDrop(this.targetState != "Disabled" && (!this.current || m.source != this || !(this.current.id in this.selection)));
                            }
                        }
                    },onDndStart: function(_409, _40a, copy) {
                        if (this.autoSync) {
                            this.sync();
                        }
                        if (this.isSource) {
                            this._changeState("Source", this == _409 ? (copy ? "Copied" : "Moved") : "");
                        }
                        var _40b = this.accept && this.checkAcceptance(_409, _40a);
                        this._changeState("Target", _40b ? "" : "Disabled");
                        if (this == _409) {
                            _3ff.manager().overSource(this);
                        }
                        this.isDragging = true;
                    },onDndDrop: function(_40c, _40d, copy, _40e) {
                        if (this == _40e) {
                            this.onDrop(_40c, _40d, copy);
                        }
                        this.onDndCancel();
                    },onDndCancel: function() {
                        if (this.targetAnchor) {
                            this._unmarkTargetAnchor();
                            this.targetAnchor = null;
                        }
                        this.before = true;
                        this.isDragging = false;
                        this.mouseDown = false;
                        this._changeState("Source", "");
                        this._changeState("Target", "");
                    },onDrop: function(_40f, _410, copy) {
                        if (this != _40f) {
                            this.onDropExternal(_40f, _410, copy);
                        } else {
                            this.onDropInternal(_410, copy);
                        }
                    },onDropExternal: function(_411, _412, copy) {
                        var _413 = this._normalizedCreator;
                        if (this.creator) {
                            this._normalizedCreator = function(node, hint) {
                                return _413.call(this, _411.getItem(node.id).data, hint);
                            };
                        } else {
                            if (copy) {
                                this._normalizedCreator = function(node) {
                                    var t = _411.getItem(node.id);
                                    var n = node.cloneNode(true);
                                    n.id = dnd.getUniqueId();
                                    return {node: n,data: t.data,type: t.type};
                                };
                            } else {
                                this._normalizedCreator = function(node) {
                                    var t = _411.getItem(node.id);
                                    _411.delItem(node.id);
                                    return {node: node,data: t.data,type: t.type};
                                };
                            }
                        }
                        this.selectNone();
                        if (!copy && !this.creator) {
                            _411.selectNone();
                        }
                        this.insertNodes(true, _412, this.before, this.current);
                        if (!copy && this.creator) {
                            _411.deleteSelectedNodes();
                        }
                        this._normalizedCreator = _413;
                    },onDropInternal: function(_414, copy) {
                        var _415 = this._normalizedCreator;
                        if (this.current && this.current.id in this.selection) {
                            return;
                        }
                        if (copy) {
                            if (this.creator) {
                                this._normalizedCreator = function(node, hint) {
                                    return _415.call(this, this.getItem(node.id).data, hint);
                                };
                            } else {
                                this._normalizedCreator = function(node) {
                                    var t = this.getItem(node.id);
                                    var n = node.cloneNode(true);
                                    n.id = dnd.getUniqueId();
                                    return {node: n,data: t.data,type: t.type};
                                };
                            }
                        } else {
                            if (!this.current) {
                                return;
                            }
                            this._normalizedCreator = function(node) {
                                var t = this.getItem(node.id);
                                return {node: node,data: t.data,type: t.type};
                            };
                        }
                        this._removeSelection();
                        this.insertNodes(true, _414, this.before, this.current);
                        this._normalizedCreator = _415;
                    },onDraggingOver: function() {
                    },onDraggingOut: function() {
                    },onOverEvent: function() {
                        _401.superclass.onOverEvent.call(this);
                        _3ff.manager().overSource(this);
                        if (this.isDragging && this.targetState != "Disabled") {
                            this.onDraggingOver();
                        }
                    },onOutEvent: function() {
                        _401.superclass.onOutEvent.call(this);
                        _3ff.manager().outSource(this);
                        if (this.isDragging && this.targetState != "Disabled") {
                            this.onDraggingOut();
                        }
                    },_markTargetAnchor: function(_416) {
                        if (this.current == this.targetAnchor && this.before == _416) {
                            return;
                        }
                        if (this.targetAnchor) {
                            this._removeItemClass(this.targetAnchor, this.before ? "Before" : "After");
                        }
                        this.targetAnchor = this.current;
                        this.targetBox = null;
                        this.before = _416;
                        if (this.targetAnchor) {
                            this._addItemClass(this.targetAnchor, this.before ? "Before" : "After");
                        }
                    },_unmarkTargetAnchor: function() {
                        if (!this.targetAnchor) {
                            return;
                        }
                        this._removeItemClass(this.targetAnchor, this.before ? "Before" : "After");
                        this.targetAnchor = null;
                        this.targetBox = null;
                        this.before = true;
                    },_markDndStatus: function(copy) {
                        this._changeState("Source", copy ? "Copied" : "Moved");
                    },_legalMouseDown: function(e) {
                        if (e.type != "touchstart" && !_3fb.isLeft(e)) {
                            return false;
                        }
                        if (!this.withHandles) {
                            return true;
                        }
                        for (var node = e.target; node && node !== this.node; node = node.parentNode) {
                            if (_3f9.contains(node, "dojoDndHandle")) {
                                return true;
                            }
                            if (_3f9.contains(node, "dojoDndItem") || _3f9.contains(node, "dojoDndIgnore")) {
                                break;
                            }
                        }
                        return false;
                    }});
                return _401;
            });
        },"dijit/_Widget": function() {
            define(["dojo/aspect", "dojo/_base/config", "dojo/_base/connect", "dojo/_base/declare", "dojo/has", "dojo/_base/kernel", "dojo/_base/lang", "dojo/query", "dojo/ready", "./registry", "./_WidgetBase", "./_OnDijitClickMixin", "./_FocusMixin", "dojo/uacss", "./hccss"], function(_417, _418, _419, _41a, has, _41b, lang, _41c, _41d, _41e, _41f, _420, _421) {
                function _422() {
                }
                ;
                function _423(_424) {
                    return function(obj, _425, _426, _427) {
                        if (obj && typeof _425 == "string" && obj[_425] == _422) {
                            return obj.on(_425.substring(2).toLowerCase(), lang.hitch(_426, _427));
                        }
                        return _424.apply(_419, arguments);
                    };
                }
                ;
                _417.around(_419, "connect", _423);
                if (_41b.connect) {
                    _417.around(_41b, "connect", _423);
                }
                var _428 = _41a("dijit._Widget", [_41f, _420, _421], {onClick: _422,onDblClick: _422,onKeyDown: _422,onKeyPress: _422,onKeyUp: _422,onMouseDown: _422,onMouseMove: _422,onMouseOut: _422,onMouseOver: _422,onMouseLeave: _422,onMouseEnter: _422,onMouseUp: _422,constructor: function(_429) {
                        this._toConnect = {};
                        for (var name in _429) {
                            if (this[name] === _422) {
                                this._toConnect[name.replace(/^on/, "").toLowerCase()] = _429[name];
                                delete _429[name];
                            }
                        }
                    },postCreate: function() {
                        this.inherited(arguments);
                        for (var name in this._toConnect) {
                            this.on(name, this._toConnect[name]);
                        }
                        delete this._toConnect;
                    },on: function(type, func) {
                        if (this[this._onMap(type)] === _422) {
                            return _419.connect(this.domNode, type.toLowerCase(), this, func);
                        }
                        return this.inherited(arguments);
                    },_setFocusedAttr: function(val) {
                        this._focused = val;
                        this._set("focused", val);
                    },setAttribute: function(attr, _42a) {
                        _41b.deprecated(this.declaredClass + "::setAttribute(attr, value) is deprecated. Use set() instead.", "", "2.0");
                        this.set(attr, _42a);
                    },attr: function(name, _42b) {
                        var args = arguments.length;
                        if (args >= 2 || typeof name === "object") {
                            return this.set.apply(this, arguments);
                        } else {
                            return this.get(name);
                        }
                    },getDescendants: function() {
                        _41b.deprecated(this.declaredClass + "::getDescendants() is deprecated. Use getChildren() instead.", "", "2.0");
                        return this.containerNode ? _41c("[widgetId]", this.containerNode).map(_41e.byNode) : [];
                    },_onShow: function() {
                        this.onShow();
                    },onShow: function() {
                    },onHide: function() {
                    },onClose: function() {
                        return true;
                    }});
                if (has("dijit-legacy-requires")) {
                    _41d(0, function() {
                        var _42c = ["dijit/_base"];
                        require(_42c);
                    });
                }
                return _428;
            });
        },"dijit/_FocusMixin": function() {
            define(["./focus", "./_WidgetBase", "dojo/_base/declare", "dojo/_base/lang"], function(_42d, _42e, _42f, lang) {
                lang.extend(_42e, {focused: false,onFocus: function() {
                    },onBlur: function() {
                    },_onFocus: function() {
                        this.onFocus();
                    },_onBlur: function() {
                        this.onBlur();
                    }});
                return _42f("dijit._FocusMixin", null, {_focusManager: _42d});
            });
        },"dijit/focus": function() {
            define(["dojo/aspect", "dojo/_base/declare", "dojo/dom", "dojo/dom-attr", "dojo/dom-class", "dojo/dom-construct", "dojo/Evented", "dojo/_base/lang", "dojo/on", "dojo/domReady", "dojo/sniff", "dojo/Stateful", "dojo/_base/window", "dojo/window", "./a11y", "./registry", "./main"], function(_430, _431, dom, _432, _433, _434, _435, lang, on, _436, has, _437, win, _438, a11y, _439, _43a) {
                var _43b;
                var _43c;
                var _43d = _431([_437, _435], {curNode: null,activeStack: [],constructor: function() {
                        var _43e = lang.hitch(this, function(node) {
                            if (dom.isDescendant(this.curNode, node)) {
                                this.set("curNode", null);
                            }
                            if (dom.isDescendant(this.prevNode, node)) {
                                this.set("prevNode", null);
                            }
                        });
                        _430.before(_434, "empty", _43e);
                        _430.before(_434, "destroy", _43e);
                    },registerIframe: function(_43f) {
                        return this.registerWin(_43f.contentWindow, _43f);
                    },registerWin: function(_440, _441) {
                        var _442 = this, body = _440.document && _440.document.body;
                        if (body) {
                            var _443 = has("pointer-events") ? "pointerdown" : has("MSPointer") ? "MSPointerDown" : has("touch-events") ? "mousedown, touchstart" : "mousedown";
                            var mdh = on(_440.document, _443, function(evt) {
                                if (evt && evt.target && evt.target.parentNode == null) {
                                    return;
                                }
                                _442._onTouchNode(_441 || evt.target, "mouse");
                            });
                            var fih = on(body, "focusin", function(evt) {
                                if (!evt.target.tagName) {
                                    return;
                                }
                                var tag = evt.target.tagName.toLowerCase();
                                if (tag == "#document" || tag == "body") {
                                    return;
                                }
                                if (a11y.isFocusable(evt.target)) {
                                    _442._onFocusNode(_441 || evt.target);
                                } else {
                                    _442._onTouchNode(_441 || evt.target);
                                }
                            });
                            var foh = on(body, "focusout", function(evt) {
                                _442._onBlurNode(_441 || evt.target);
                            });
                            return {remove: function() {
                                    mdh.remove();
                                    fih.remove();
                                    foh.remove();
                                    mdh = fih = foh = null;
                                    body = null;
                                }};
                        }
                    },_onBlurNode: function(node) {
                        var now = (new Date()).getTime();
                        if (now < _43b + 100) {
                            return;
                        }
                        if (this._clearFocusTimer) {
                            clearTimeout(this._clearFocusTimer);
                        }
                        this._clearFocusTimer = setTimeout(lang.hitch(this, function() {
                            this.set("prevNode", this.curNode);
                            this.set("curNode", null);
                        }), 0);
                        if (this._clearActiveWidgetsTimer) {
                            clearTimeout(this._clearActiveWidgetsTimer);
                        }
                        if (now < _43c + 100) {
                            return;
                        }
                        this._clearActiveWidgetsTimer = setTimeout(lang.hitch(this, function() {
                            delete this._clearActiveWidgetsTimer;
                            this._setStack([]);
                        }), 0);
                    },_onTouchNode: function(node, by) {
                        _43c = (new Date()).getTime();
                        if (this._clearActiveWidgetsTimer) {
                            clearTimeout(this._clearActiveWidgetsTimer);
                            delete this._clearActiveWidgetsTimer;
                        }
                        if (_433.contains(node, "dijitPopup")) {
                            node = node.firstChild;
                        }
                        var _444 = [];
                        try {
                            while (node) {
                                var _445 = _432.get(node, "dijitPopupParent");
                                if (_445) {
                                    node = _439.byId(_445).domNode;
                                } else {
                                    if (node.tagName && node.tagName.toLowerCase() == "body") {
                                        if (node === win.body()) {
                                            break;
                                        }
                                        node = _438.get(node.ownerDocument).frameElement;
                                    } else {
                                        var id = node.getAttribute && node.getAttribute("widgetId"), _446 = id && _439.byId(id);
                                        if (_446 && !(by == "mouse" && _446.get("disabled"))) {
                                            _444.unshift(id);
                                        }
                                        node = node.parentNode;
                                    }
                                }
                            }
                        } catch (e) {
                        }
                        this._setStack(_444, by);
                    },_onFocusNode: function(node) {
                        if (!node) {
                            return;
                        }
                        if (node.nodeType == 9) {
                            return;
                        }
                        _43b = (new Date()).getTime();
                        if (this._clearFocusTimer) {
                            clearTimeout(this._clearFocusTimer);
                            delete this._clearFocusTimer;
                        }
                        this._onTouchNode(node);
                        if (node == this.curNode) {
                            return;
                        }
                        this.set("prevNode", this.curNode);
                        this.set("curNode", node);
                    },_setStack: function(_447, by) {
                        var _448 = this.activeStack, _449 = _448.length - 1, _44a = _447.length - 1;
                        if (_447[_44a] == _448[_449]) {
                            return;
                        }
                        this.set("activeStack", _447);
                        var _44b, i;
                        for (i = _449; i >= 0 && _448[i] != _447[i]; i--) {
                            _44b = _439.byId(_448[i]);
                            if (_44b) {
                                _44b._hasBeenBlurred = true;
                                _44b.set("focused", false);
                                if (_44b._focusManager == this) {
                                    _44b._onBlur(by);
                                }
                                this.emit("widget-blur", _44b, by);
                            }
                        }
                        for (i++; i <= _44a; i++) {
                            _44b = _439.byId(_447[i]);
                            if (_44b) {
                                _44b.set("focused", true);
                                if (_44b._focusManager == this) {
                                    _44b._onFocus(by);
                                }
                                this.emit("widget-focus", _44b, by);
                            }
                        }
                    },focus: function(node) {
                        if (node) {
                            try {
                                node.focus();
                            } catch (e) {
                            }
                        }
                    }});
                var _44c = new _43d();
                _436(function() {
                    var _44d = _44c.registerWin(_438.get(document));
                    if (has("ie")) {
                        on(window, "unload", function() {
                            if (_44d) {
                                _44d.remove();
                                _44d = null;
                            }
                        });
                    }
                });
                _43a.focus = function(node) {
                    _44c.focus(node);
                };
                for (var attr in _44c) {
                    if (!/^_/.test(attr)) {
                        _43a.focus[attr] = typeof _44c[attr] == "function" ? lang.hitch(_44c, attr) : _44c[attr];
                    }
                }
                _44c.watch(function(attr, _44e, _44f) {
                    _43a.focus[attr] = _44f;
                });
                return _44c;
            });
        },"dijit/_Contained": function() {
            define(["dojo/_base/declare", "./registry"], function(_450, _451) {
                return _450("dijit._Contained", null, {_getSibling: function(_452) {
                        var node = this.domNode;
                        do {
                            node = node[_452 + "Sibling"];
                        } while (node && node.nodeType != 1);
                        return node && _451.byNode(node);
                    },getPreviousSibling: function() {
                        return this._getSibling("previous");
                    },getNextSibling: function() {
                        return this._getSibling("next");
                    },getIndexInParent: function() {
                        var p = this.getParent();
                        if (!p || !p.getIndexOfChild) {
                            return -1;
                        }
                        return p.getIndexOfChild(this);
                    }});
            });
        },"dojox/grid/_RowManager": function() {
            define(["dojo/_base/declare", "dojo/_base/lang", "dojo/dom-class"], function(_453, lang, _454) {
                var _455 = function(_456, _457) {
                    if (_456.style.cssText == undefined) {
                        _456.setAttribute("style", _457);
                    } else {
                        _456.style.cssText = _457;
                    }
                };
                return _453("dojox.grid._RowManager", null, {constructor: function(_458) {
                        this.grid = _458;
                    },linesToEms: 2,overRow: -2,prepareStylingRow: function(_459, _45a) {
                        return {index: _459,node: _45a,odd: Boolean(_459 & 1),selected: !!this.grid.selection.isSelected(_459),over: this.isOver(_459),customStyles: "",customClasses: "dojoxGridRow"};
                    },styleRowNode: function(_45b, _45c) {
                        var row = this.prepareStylingRow(_45b, _45c);
                        this.grid.onStyleRow(row);
                        this.applyStyles(row);
                    },applyStyles: function(_45d) {
                        var i = _45d;
                        i.node.className = i.customClasses;
                        var h = i.node.style.height;
                        _455(i.node, i.customStyles + ";" + (i.node._style || ""));
                        i.node.style.height = h;
                    },updateStyles: function(_45e) {
                        this.grid.updateRowStyles(_45e);
                    },setOverRow: function(_45f) {
                        var last = this.overRow;
                        this.overRow = _45f;
                        if ((last != this.overRow) && (lang.isString(last) || last >= 0)) {
                            this.updateStyles(last);
                        }
                        this.updateStyles(this.overRow);
                    },isOver: function(_460) {
                        return (this.overRow == _460 && !_454.contains(this.grid.domNode, "dojoxGridColumnResizing"));
                    }});
            });
        },"dijit/main": function() {
            define(["dojo/_base/kernel"], function(dojo) {
                return dojo.dijit;
            });
        },"dijit/Destroyable": function() {
            define(["dojo/_base/array", "dojo/aspect", "dojo/_base/declare"], function(_461, _462, _463) {
                return _463("dijit.Destroyable", null, {destroy: function(_464) {
                        this._destroyed = true;
                    },own: function() {
                        var _465 = ["destroyRecursive", "destroy", "remove"];
                        _461.forEach(arguments, function(_466) {
                            var _467;
                            var odh = _462.before(this, "destroy", function(_468) {
                                _466[_467](_468);
                            });
                            var hdhs = [];
                            function _469() {
                                odh.remove();
                                _461.forEach(hdhs, function(hdh) {
                                    hdh.remove();
                                });
                            }
                            ;
                            if (_466.then) {
                                _467 = "cancel";
                                _466.then(_469, _469);
                            } else {
                                _461.forEach(_465, function(_46a) {
                                    if (typeof _466[_46a] === "function") {
                                        if (!_467) {
                                            _467 = _46a;
                                        }
                                        hdhs.push(_462.after(_466, _46a, _469, true));
                                    }
                                });
                            }
                        }, this);
                        return arguments;
                    }});
            });
        },"dojo/dnd/Container": function() {
            define(["../_base/array", "../_base/declare", "../_base/kernel", "../_base/lang", "../_base/window", "../dom", "../dom-class", "../dom-construct", "../Evented", "../has", "../on", "../query", "../touch", "./common"], function(_46b, _46c, _46d, lang, win, dom, _46e, _46f, _470, has, on, _471, _472, dnd) {
                var _473 = _46c("dojo.dnd.Container", _470, {skipForm: false,allowNested: false,constructor: function(node, _474) {
                        this.node = dom.byId(node);
                        if (!_474) {
                            _474 = {};
                        }
                        this.creator = _474.creator || null;
                        this.skipForm = _474.skipForm;
                        this.parent = _474.dropParent && dom.byId(_474.dropParent);
                        this.map = {};
                        this.current = null;
                        this.containerState = "";
                        _46e.add(this.node, "dojoDndContainer");
                        if (!(_474 && _474._skipStartup)) {
                            this.startup();
                        }
                        this.events = [on(this.node, _472.over, lang.hitch(this, "onMouseOver")), on(this.node, _472.out, lang.hitch(this, "onMouseOut")), on(this.node, "dragstart", lang.hitch(this, "onSelectStart")), on(this.node, "selectstart", lang.hitch(this, "onSelectStart"))];
                    },creator: function() {
                    },getItem: function(key) {
                        return this.map[key];
                    },setItem: function(key, data) {
                        this.map[key] = data;
                    },delItem: function(key) {
                        delete this.map[key];
                    },forInItems: function(f, o) {
                        o = o || _46d.global;
                        var m = this.map, e = dnd._empty;
                        for (var i in m) {
                            if (i in e) {
                                continue;
                            }
                            f.call(o, m[i], i, this);
                        }
                        return o;
                    },clearItems: function() {
                        this.map = {};
                    },getAllNodes: function() {
                        return _471((this.allowNested ? "" : "> ") + ".dojoDndItem", this.parent);
                    },sync: function() {
                        var map = {};
                        this.getAllNodes().forEach(function(node) {
                            if (node.id) {
                                var item = this.getItem(node.id);
                                if (item) {
                                    map[node.id] = item;
                                    return;
                                }
                            } else {
                                node.id = dnd.getUniqueId();
                            }
                            var type = node.getAttribute("dndType"), data = node.getAttribute("dndData");
                            map[node.id] = {data: data || node.innerHTML,type: type ? type.split(/\s*,\s*/) : ["text"]};
                        }, this);
                        this.map = map;
                        return this;
                    },insertNodes: function(data, _475, _476) {
                        if (!this.parent.firstChild) {
                            _476 = null;
                        } else {
                            if (_475) {
                                if (!_476) {
                                    _476 = this.parent.firstChild;
                                }
                            } else {
                                if (_476) {
                                    _476 = _476.nextSibling;
                                }
                            }
                        }
                        var i, t;
                        if (_476) {
                            for (i = 0; i < data.length; ++i) {
                                t = this._normalizedCreator(data[i]);
                                this.setItem(t.node.id, {data: t.data,type: t.type});
                                _476.parentNode.insertBefore(t.node, _476);
                            }
                        } else {
                            for (i = 0; i < data.length; ++i) {
                                t = this._normalizedCreator(data[i]);
                                this.setItem(t.node.id, {data: t.data,type: t.type});
                                this.parent.appendChild(t.node);
                            }
                        }
                        return this;
                    },destroy: function() {
                        _46b.forEach(this.events, function(_477) {
                            _477.remove();
                        });
                        this.clearItems();
                        this.node = this.parent = this.current = null;
                    },markupFactory: function(_478, node, Ctor) {
                        _478._skipStartup = true;
                        return new Ctor(node, _478);
                    },startup: function() {
                        if (!this.parent) {
                            this.parent = this.node;
                            if (this.parent.tagName.toLowerCase() == "table") {
                                var c = this.parent.getElementsByTagName("tbody");
                                if (c && c.length) {
                                    this.parent = c[0];
                                }
                            }
                        }
                        this.defaultCreator = dnd._defaultCreator(this.parent);
                        this.sync();
                    },onMouseOver: function(e) {
                        var n = e.relatedTarget;
                        while (n) {
                            if (n == this.node) {
                                break;
                            }
                            try {
                                n = n.parentNode;
                            } catch (x) {
                                n = null;
                            }
                        }
                        if (!n) {
                            this._changeState("Container", "Over");
                            this.onOverEvent();
                        }
                        n = this._getChildByEvent(e);
                        if (this.current == n) {
                            return;
                        }
                        if (this.current) {
                            this._removeItemClass(this.current, "Over");
                        }
                        if (n) {
                            this._addItemClass(n, "Over");
                        }
                        this.current = n;
                    },onMouseOut: function(e) {
                        for (var n = e.relatedTarget; n; ) {
                            if (n == this.node) {
                                return;
                            }
                            try {
                                n = n.parentNode;
                            } catch (x) {
                                n = null;
                            }
                        }
                        if (this.current) {
                            this._removeItemClass(this.current, "Over");
                            this.current = null;
                        }
                        this._changeState("Container", "");
                        this.onOutEvent();
                    },onSelectStart: function(e) {
                        if (!this.skipForm || !dnd.isFormElement(e)) {
                            e.stopPropagation();
                            e.preventDefault();
                        }
                    },onOverEvent: function() {
                    },onOutEvent: function() {
                    },_changeState: function(type, _479) {
                        var _47a = "dojoDnd" + type;
                        var _47b = type.toLowerCase() + "State";
                        _46e.replace(this.node, _47a + _479, _47a + this[_47b]);
                        this[_47b] = _479;
                    },_addItemClass: function(node, type) {
                        _46e.add(node, "dojoDndItem" + type);
                    },_removeItemClass: function(node, type) {
                        _46e.remove(node, "dojoDndItem" + type);
                    },_getChildByEvent: function(e) {
                        var node = e.target;
                        if (node) {
                            for (var _47c = node.parentNode; _47c; node = _47c, _47c = node.parentNode) {
                                if ((_47c == this.parent || this.allowNested) && _46e.contains(node, "dojoDndItem")) {
                                    return node;
                                }
                            }
                        }
                        return null;
                    },_normalizedCreator: function(item, hint) {
                        var t = (this.creator || this.defaultCreator).call(this, item, hint);
                        if (!lang.isArray(t.type)) {
                            t.type = ["text"];
                        }
                        if (!t.node.id) {
                            t.node.id = dnd.getUniqueId();
                        }
                        _46e.add(t.node, "dojoDndItem");
                        return t;
                    }});
                dnd._createNode = function(tag) {
                    if (!tag) {
                        return dnd._createSpan;
                    }
                    return function(text) {
                        return _46f.create(tag, {innerHTML: text});
                    };
                };
                dnd._createTrTd = function(text) {
                    var tr = _46f.create("tr");
                    _46f.create("td", {innerHTML: text}, tr);
                    return tr;
                };
                dnd._createSpan = function(text) {
                    return _46f.create("span", {innerHTML: text});
                };
                dnd._defaultCreatorNodes = {ul: "li",ol: "li",div: "div",p: "div"};
                dnd._defaultCreator = function(node) {
                    var tag = node.tagName.toLowerCase();
                    var c = tag == "tbody" || tag == "thead" ? dnd._createTrTd : dnd._createNode(dnd._defaultCreatorNodes[tag]);
                    return function(item, hint) {
                        var _47d = item && lang.isObject(item), data, type, n;
                        if (_47d && item.tagName && item.nodeType && item.getAttribute) {
                            data = item.getAttribute("dndData") || item.innerHTML;
                            type = item.getAttribute("dndType");
                            type = type ? type.split(/\s*,\s*/) : ["text"];
                            n = item;
                        } else {
                            data = (_47d && item.data) ? item.data : item;
                            type = (_47d && item.type) ? item.type : ["text"];
                            n = (hint == "avatar" ? dnd._createSpan : c)(String(data));
                        }
                        if (!n.id) {
                            n.id = dnd.getUniqueId();
                        }
                        return {node: n,data: data,type: type};
                    };
                };
                return _473;
            });
        },"dojo/cache": function() {
            define(["./_base/kernel", "./text"], function(dojo) {
                return dojo.cache;
            });
        },"dojo/dnd/Manager": function() {
            define(["../_base/array", "../_base/declare", "../_base/lang", "../_base/window", "../dom-class", "../Evented", "../has", "../keys", "../on", "../topic", "../touch", "./common", "./autoscroll", "./Avatar"], function(_47e, _47f, lang, win, _480, _481, has, keys, on, _482, _483, dnd, _484, _485) {
                var _486 = _47f("dojo.dnd.Manager", [_481], {constructor: function() {
                        this.avatar = null;
                        this.source = null;
                        this.nodes = [];
                        this.copy = true;
                        this.target = null;
                        this.canDropFlag = false;
                        this.events = [];
                    },OFFSET_X: has("touch") ? 0 : 16,OFFSET_Y: has("touch") ? -64 : 16,overSource: function(_487) {
                        if (this.avatar) {
                            this.target = (_487 && _487.targetState != "Disabled") ? _487 : null;
                            this.canDropFlag = Boolean(this.target);
                            this.avatar.update();
                        }
                        _482.publish("/dnd/source/over", _487);
                    },outSource: function(_488) {
                        if (this.avatar) {
                            if (this.target == _488) {
                                this.target = null;
                                this.canDropFlag = false;
                                this.avatar.update();
                                _482.publish("/dnd/source/over", null);
                            }
                        } else {
                            _482.publish("/dnd/source/over", null);
                        }
                    },startDrag: function(_489, _48a, copy) {
                        _484.autoScrollStart(win.doc);
                        this.source = _489;
                        this.nodes = _48a;
                        this.copy = Boolean(copy);
                        this.avatar = this.makeAvatar();
                        win.body().appendChild(this.avatar.node);
                        _482.publish("/dnd/start", _489, _48a, this.copy);
                        function _48b(e) {
                            e.preventDefault();
                            e.stopPropagation();
                        }
                        ;
                        this.events = [on(win.doc, _483.move, lang.hitch(this, "onMouseMove")), on(win.doc, _483.release, lang.hitch(this, "onMouseUp")), on(win.doc, "keydown", lang.hitch(this, "onKeyDown")), on(win.doc, "keyup", lang.hitch(this, "onKeyUp")), on(win.doc, "dragstart", _48b), on(win.body(), "selectstart", _48b)];
                        var c = "dojoDnd" + (copy ? "Copy" : "Move");
                        _480.add(win.body(), c);
                    },canDrop: function(flag) {
                        var _48c = Boolean(this.target && flag);
                        if (this.canDropFlag != _48c) {
                            this.canDropFlag = _48c;
                            this.avatar.update();
                        }
                    },stopDrag: function() {
                        _480.remove(win.body(), ["dojoDndCopy", "dojoDndMove"]);
                        _47e.forEach(this.events, function(_48d) {
                            _48d.remove();
                        });
                        this.events = [];
                        this.avatar.destroy();
                        this.avatar = null;
                        this.source = this.target = null;
                        this.nodes = [];
                    },makeAvatar: function() {
                        return new _485(this);
                    },updateAvatar: function() {
                        this.avatar.update();
                    },onMouseMove: function(e) {
                        var a = this.avatar;
                        if (a) {
                            _484.autoScrollNodes(e);
                            var s = a.node.style;
                            s.left = (e.pageX + this.OFFSET_X) + "px";
                            s.top = (e.pageY + this.OFFSET_Y) + "px";
                            var copy = Boolean(this.source.copyState(dnd.getCopyKeyState(e)));
                            if (this.copy != copy) {
                                this._setCopyStatus(copy);
                            }
                        }
                        if (has("touch")) {
                            e.preventDefault();
                        }
                    },onMouseUp: function(e) {
                        if (this.avatar) {
                            if (this.target && this.canDropFlag) {
                                var copy = Boolean(this.source.copyState(dnd.getCopyKeyState(e)));
                                _482.publish("/dnd/drop/before", this.source, this.nodes, copy, this.target, e);
                                _482.publish("/dnd/drop", this.source, this.nodes, copy, this.target, e);
                            } else {
                                _482.publish("/dnd/cancel");
                            }
                            this.stopDrag();
                        }
                    },onKeyDown: function(e) {
                        if (this.avatar) {
                            switch (e.keyCode) {
                                case keys.CTRL:
                                    var copy = Boolean(this.source.copyState(true));
                                    if (this.copy != copy) {
                                        this._setCopyStatus(copy);
                                    }
                                    break;
                                case keys.ESCAPE:
                                    _482.publish("/dnd/cancel");
                                    this.stopDrag();
                                    break;
                            }
                        }
                    },onKeyUp: function(e) {
                        if (this.avatar && e.keyCode == keys.CTRL) {
                            var copy = Boolean(this.source.copyState(false));
                            if (this.copy != copy) {
                                this._setCopyStatus(copy);
                            }
                        }
                    },_setCopyStatus: function(copy) {
                        this.copy = copy;
                        this.source._markDndStatus(this.copy);
                        this.updateAvatar();
                        _480.replace(win.body(), "dojoDnd" + (this.copy ? "Copy" : "Move"), "dojoDnd" + (this.copy ? "Move" : "Copy"));
                    }});
                dnd._manager = null;
                _486.manager = dnd.manager = function() {
                    if (!dnd._manager) {
                        dnd._manager = new _486();
                    }
                    return dnd._manager;
                };
                return _486;
            });
        },"dojo/dnd/Avatar": function() {
            define(["../_base/declare", "../_base/window", "../dom", "../dom-attr", "../dom-class", "../dom-construct", "../hccss", "../query"], function(_48e, win, dom, _48f, _490, _491, has, _492) {
                return _48e("dojo.dnd.Avatar", null, {constructor: function(_493) {
                        this.manager = _493;
                        this.construct();
                    },construct: function() {
                        var a = _491.create("table", {"class": "dojoDndAvatar",style: {position: "absolute",zIndex: "1999",margin: "0px"}}), _494 = this.manager.source, node, b = _491.create("tbody", null, a), tr = _491.create("tr", null, b), td = _491.create("td", null, tr), k = Math.min(5, this.manager.nodes.length), i = 0;
                        if (has("highcontrast")) {
                            _491.create("span", {id: "a11yIcon",innerHTML: this.manager.copy ? "+" : "<"}, td);
                        }
                        _491.create("span", {innerHTML: _494.generateText ? this._generateText() : ""}, td);
                        _48f.set(tr, {"class": "dojoDndAvatarHeader",style: {opacity: 0.9}});
                        for (; i < k; ++i) {
                            if (_494.creator) {
                                node = _494._normalizedCreator(_494.getItem(this.manager.nodes[i].id).data, "avatar").node;
                            } else {
                                node = this.manager.nodes[i].cloneNode(true);
                                if (node.tagName.toLowerCase() == "tr") {
                                    var _495 = _491.create("table"), _496 = _491.create("tbody", null, _495);
                                    _496.appendChild(node);
                                    node = _495;
                                }
                            }
                            node.id = "";
                            tr = _491.create("tr", null, b);
                            td = _491.create("td", null, tr);
                            td.appendChild(node);
                            _48f.set(tr, {"class": "dojoDndAvatarItem",style: {opacity: (9 - i) / 10}});
                        }
                        this.node = a;
                    },destroy: function() {
                        _491.destroy(this.node);
                        this.node = false;
                    },update: function() {
                        _490.toggle(this.node, "dojoDndAvatarCanDrop", this.manager.canDropFlag);
                        if (has("highcontrast")) {
                            var icon = dom.byId("a11yIcon");
                            var text = "+";
                            if (this.manager.canDropFlag && !this.manager.copy) {
                                text = "< ";
                            } else {
                                if (!this.manager.canDropFlag && !this.manager.copy) {
                                    text = "o";
                                } else {
                                    if (!this.manager.canDropFlag) {
                                        text = "x";
                                    }
                                }
                            }
                            icon.innerHTML = text;
                        }
                        _492(("tr.dojoDndAvatarHeader td span" + (has("highcontrast") ? " span" : "")), this.node).forEach(function(node) {
                            node.innerHTML = this.manager.source.generateText ? this._generateText() : "";
                        }, this);
                    },_generateText: function() {
                        return this.manager.nodes.length.toString();
                    }});
            });
        },"dojox/grid/_SelectionPreserver": function() {
            define(["dojo/_base/declare", "dojo/_base/connect", "dojo/_base/lang", "dojo/_base/array"], function(_497, _498, lang, _499) {
                return _497("dojox.grid._SelectionPreserver", null, {constructor: function(_49a) {
                        this.selection = _49a;
                        var grid = this.grid = _49a.grid;
                        this.reset();
                        this._connects = [_498.connect(grid, "_setStore", this, "reset"), _498.connect(grid, "_addItem", this, "_reSelectById"), _498.connect(_49a, "onSelected", lang.hitch(this, "_selectById", true)), _498.connect(_49a, "onDeselected", lang.hitch(this, "_selectById", false)), _498.connect(_49a, "deselectAll", this, "reset")];
                    },destroy: function() {
                        this.reset();
                        _499.forEach(this._connects, _498.disconnect);
                        delete this._connects;
                    },reset: function() {
                        this._selectedById = {};
                    },_reSelectById: function(item, _49b) {
                        if (item && this.grid._hasIdentity) {
                            this.selection.selected[_49b] = this._selectedById[this.grid.store.getIdentity(item)];
                        }
                    },_selectById: function(_49c, _49d) {
                        if (this.selection.mode == "none" || !this.grid._hasIdentity) {
                            return;
                        }
                        var item = _49d, g = this.grid;
                        if (typeof _49d == "number" || typeof _49d == "string") {
                            var _49e = g._by_idx[_49d];
                            item = _49e && _49e.item;
                        }
                        if (item) {
                            this._selectedById[g.store.getIdentity(item)] = !!_49c;
                        }
                        return item;
                    }});
            });
        },"dojox/grid/_FocusManager": function() {
            define(["dojo/_base/array", "dojo/_base/lang", "dojo/_base/declare", "dojo/_base/connect", "dojo/_base/event", "dojo/_base/sniff", "dojo/query", "./util", "dojo/_base/html"], function(_49f, lang, _4a0, _4a1, _4a2, has, _4a3, util, html) {
                return _4a0("dojox.grid._FocusManager", null, {constructor: function(_4a4) {
                        this.grid = _4a4;
                        this.cell = null;
                        this.rowIndex = -1;
                        this._connects = [];
                        this._headerConnects = [];
                        this.headerMenu = this.grid.headerMenu;
                        this._connects.push(_4a1.connect(this.grid.domNode, "onfocus", this, "doFocus"));
                        this._connects.push(_4a1.connect(this.grid.domNode, "onblur", this, "doBlur"));
                        this._connects.push(_4a1.connect(this.grid.domNode, "mousedown", this, "_mouseDown"));
                        this._connects.push(_4a1.connect(this.grid.domNode, "mouseup", this, "_mouseUp"));
                        this._connects.push(_4a1.connect(this.grid.domNode, "oncontextmenu", this, "doContextMenu"));
                        this._connects.push(_4a1.connect(this.grid.lastFocusNode, "onfocus", this, "doLastNodeFocus"));
                        this._connects.push(_4a1.connect(this.grid.lastFocusNode, "onblur", this, "doLastNodeBlur"));
                        this._connects.push(_4a1.connect(this.grid, "_onFetchComplete", this, "_delayedCellFocus"));
                        this._connects.push(_4a1.connect(this.grid, "postrender", this, "_delayedHeaderFocus"));
                    },destroy: function() {
                        _49f.forEach(this._connects, _4a1.disconnect);
                        _49f.forEach(this._headerConnects, _4a1.disconnect);
                        delete this.grid;
                        delete this.cell;
                    },_colHeadNode: null,_colHeadFocusIdx: null,_contextMenuBindNode: null,tabbingOut: false,focusClass: "dojoxGridCellFocus",focusView: null,initFocusView: function() {
                        this.focusView = this.grid.views.getFirstScrollingView() || this.focusView || this.grid.views.views[0];
                        this._initColumnHeaders();
                    },isFocusCell: function(_4a5, _4a6) {
                        return (this.cell == _4a5) && (this.rowIndex == _4a6);
                    },isLastFocusCell: function() {
                        if (this.cell) {
                            return (this.rowIndex == this.grid.rowCount - 1) && (this.cell.index == this.grid.layout.cellCount - 1);
                        }
                        return false;
                    },isFirstFocusCell: function() {
                        if (this.cell) {
                            return (this.rowIndex === 0) && (this.cell.index === 0);
                        }
                        return false;
                    },isNoFocusCell: function() {
                        return (this.rowIndex < 0) || !this.cell;
                    },isNavHeader: function() {
                        return (!!this._colHeadNode);
                    },getHeaderIndex: function() {
                        if (this._colHeadNode) {
                            return _49f.indexOf(this._findHeaderCells(), this._colHeadNode);
                        } else {
                            return -1;
                        }
                    },_focusifyCellNode: function(_4a7) {
                        var n = this.cell && this.cell.getNode(this.rowIndex);
                        if (n) {
                            html.toggleClass(n, this.focusClass, _4a7);
                            if (_4a7) {
                                var sl = this.scrollIntoView();
                                try {
                                    if (has("webkit") || !this.grid.edit.isEditing()) {
                                        util.fire(n, "focus");
                                        if (sl) {
                                            this.cell.view.scrollboxNode.scrollLeft = sl;
                                        }
                                    }
                                } catch (e) {
                                }
                            }
                        }
                    },_delayedCellFocus: function() {
                        if (this.isNavHeader() || !this.grid.focused) {
                            return;
                        }
                        var n = this.cell && this.cell.getNode(this.rowIndex);
                        if (n) {
                            try {
                                if (!this.grid.edit.isEditing()) {
                                    html.toggleClass(n, this.focusClass, true);
                                    if (this._colHeadNode) {
                                        this.blurHeader();
                                    }
                                    util.fire(n, "focus");
                                }
                            } catch (e) {
                            }
                        }
                    },_delayedHeaderFocus: function() {
                        if (this.isNavHeader()) {
                            this.focusHeader();
                        }
                    },_initColumnHeaders: function() {
                        _49f.forEach(this._headerConnects, _4a1.disconnect);
                        this._headerConnects = [];
                        var _4a8 = this._findHeaderCells();
                        for (var i = 0; i < _4a8.length; i++) {
                            this._headerConnects.push(_4a1.connect(_4a8[i], "onfocus", this, "doColHeaderFocus"));
                            this._headerConnects.push(_4a1.connect(_4a8[i], "onblur", this, "doColHeaderBlur"));
                        }
                    },_findHeaderCells: function() {
                        var _4a9 = _4a3("th", this.grid.viewsHeaderNode);
                        var _4aa = [];
                        for (var i = 0; i < _4a9.length; i++) {
                            var _4ab = _4a9[i];
                            var _4ac = html.hasAttr(_4ab, "tabIndex");
                            var _4ad = html.attr(_4ab, "tabIndex");
                            if (_4ac && _4ad < 0) {
                                _4aa.push(_4ab);
                            }
                        }
                        return _4aa;
                    },_setActiveColHeader: function(_4ae, _4af, _4b0) {
                        this.grid.domNode.setAttribute("aria-activedescendant", _4ae.id);
                        if (_4b0 != null && _4b0 >= 0 && _4b0 != _4af) {
                            html.toggleClass(this._findHeaderCells()[_4b0], this.focusClass, false);
                        }
                        html.toggleClass(_4ae, this.focusClass, true);
                        this._colHeadNode = _4ae;
                        this._colHeadFocusIdx = _4af;
                        this._scrollHeader(this._colHeadFocusIdx);
                    },scrollIntoView: function() {
                        var info = (this.cell ? this._scrollInfo(this.cell) : null);
                        if (!info || !info.s) {
                            return null;
                        }
                        var rt = this.grid.scroller.findScrollTop(this.rowIndex);
                        if (info.n && info.sr) {
                            if (info.n.offsetLeft + info.n.offsetWidth > info.sr.l + info.sr.w) {
                                info.s.scrollLeft = info.n.offsetLeft + info.n.offsetWidth - info.sr.w;
                            } else {
                                if (info.n.offsetLeft < info.sr.l) {
                                    info.s.scrollLeft = info.n.offsetLeft;
                                }
                            }
                        }
                        if (info.r && info.sr) {
                            if (rt + info.r.offsetHeight > info.sr.t + info.sr.h) {
                                this.grid.setScrollTop(rt + info.r.offsetHeight - info.sr.h);
                            } else {
                                if (rt < info.sr.t) {
                                    this.grid.setScrollTop(rt);
                                }
                            }
                        }
                        return info.s.scrollLeft;
                    },_scrollInfo: function(cell, _4b1) {
                        if (cell) {
                            var cl = cell, sbn = cl.view.scrollboxNode, sbnr = {w: sbn.clientWidth,l: sbn.scrollLeft,t: sbn.scrollTop,h: sbn.clientHeight}, rn = cl.view.getRowNode(this.rowIndex);
                            return {c: cl,s: sbn,sr: sbnr,n: (_4b1 ? _4b1 : cell.getNode(this.rowIndex)),r: rn};
                        }
                        return null;
                    },_scrollHeader: function(_4b2) {
                        var info = null;
                        if (this._colHeadNode) {
                            var cell = this.grid.getCell(_4b2);
                            if (!cell) {
                                return;
                            }
                            info = this._scrollInfo(cell, cell.getNode(0));
                        }
                        if (info && info.s && info.sr && info.n) {
                            var _4b3 = info.sr.l + info.sr.w;
                            if (info.n.offsetLeft + info.n.offsetWidth > _4b3) {
                                info.s.scrollLeft = info.n.offsetLeft + info.n.offsetWidth - info.sr.w;
                            } else {
                                if (info.n.offsetLeft < info.sr.l) {
                                    info.s.scrollLeft = info.n.offsetLeft;
                                } else {
                                    if (has("ie") <= 7 && cell && cell.view.headerNode) {
                                        cell.view.headerNode.scrollLeft = info.s.scrollLeft;
                                    }
                                }
                            }
                        }
                    },_isHeaderHidden: function() {
                        var _4b4 = this.focusView;
                        if (!_4b4) {
                            for (var i = 0, _4b5; (_4b5 = this.grid.views.views[i]); i++) {
                                if (_4b5.headerNode) {
                                    _4b4 = _4b5;
                                    break;
                                }
                            }
                        }
                        return (_4b4 && html.getComputedStyle(_4b4.headerNode).display == "none");
                    },colSizeAdjust: function(e, _4b6, _4b7) {
                        var _4b8 = this._findHeaderCells();
                        var view = this.focusView;
                        if (!view || !view.header.tableMap.map) {
                            for (var i = 0, _4b9; (_4b9 = this.grid.views.views[i]); i++) {
                                if (_4b9.header.tableMap.map) {
                                    view = _4b9;
                                    break;
                                }
                            }
                        }
                        var _4ba = _4b8[_4b6];
                        if (!view || (_4b6 == _4b8.length - 1 && _4b6 === 0)) {
                            return;
                        }
                        view.content.baseDecorateEvent(e);
                        e.cellNode = _4ba;
                        e.cellIndex = view.content.getCellNodeIndex(e.cellNode);
                        e.cell = (e.cellIndex >= 0 ? this.grid.getCell(e.cellIndex) : null);
                        if (view.header.canResize(e)) {
                            var _4bb = {l: _4b7};
                            var drag = view.header.colResizeSetup(e, false);
                            view.header.doResizeColumn(drag, null, _4bb);
                            view.update();
                        }
                    },styleRow: function(_4bc) {
                        return;
                    },setFocusIndex: function(_4bd, _4be) {
                        this.setFocusCell(this.grid.getCell(_4be), _4bd);
                    },setFocusCell: function(_4bf, _4c0) {
                        if (_4bf && !this.isFocusCell(_4bf, _4c0)) {
                            this.tabbingOut = false;
                            if (this._colHeadNode) {
                                this.blurHeader();
                            }
                            this._colHeadNode = this._colHeadFocusIdx = null;
                            this.focusGridView();
                            this._focusifyCellNode(false);
                            this.cell = _4bf;
                            this.rowIndex = _4c0;
                            this._focusifyCellNode(true);
                        }
                        if (has("opera")) {
                            setTimeout(lang.hitch(this.grid, "onCellFocus", this.cell, this.rowIndex), 1);
                        } else {
                            this.grid.onCellFocus(this.cell, this.rowIndex);
                        }
                    },next: function() {
                        if (this.cell) {
                            var row = this.rowIndex, col = this.cell.index + 1, cc = this.grid.layout.cellCount - 1, rc = this.grid.rowCount - 1;
                            if (col > cc) {
                                col = 0;
                                row++;
                            }
                            if (row > rc) {
                                col = cc;
                                row = rc;
                            }
                            if (this.grid.edit.isEditing()) {
                                var _4c1 = this.grid.getCell(col);
                                if (!this.isLastFocusCell() && (!_4c1.editable || this.grid.canEdit && !this.grid.canEdit(_4c1, row))) {
                                    this.cell = _4c1;
                                    this.rowIndex = row;
                                    this.next();
                                    return;
                                }
                            }
                            this.setFocusIndex(row, col);
                        }
                    },previous: function() {
                        if (this.cell) {
                            var row = (this.rowIndex || 0), col = (this.cell.index || 0) - 1;
                            if (col < 0) {
                                col = this.grid.layout.cellCount - 1;
                                row--;
                            }
                            if (row < 0) {
                                row = 0;
                                col = 0;
                            }
                            if (this.grid.edit.isEditing()) {
                                var _4c2 = this.grid.getCell(col);
                                if (!this.isFirstFocusCell() && !_4c2.editable) {
                                    this.cell = _4c2;
                                    this.rowIndex = row;
                                    this.previous();
                                    return;
                                }
                            }
                            this.setFocusIndex(row, col);
                        }
                    },move: function(_4c3, _4c4) {
                        var _4c5 = _4c4 < 0 ? -1 : 1;
                        if (this.isNavHeader()) {
                            var _4c6 = this._findHeaderCells();
                            var _4c7 = currentIdx = _49f.indexOf(_4c6, this._colHeadNode);
                            currentIdx += _4c4;
                            while (currentIdx >= 0 && currentIdx < _4c6.length && _4c6[currentIdx].style.display == "none") {
                                currentIdx += _4c5;
                            }
                            if ((currentIdx >= 0) && (currentIdx < _4c6.length)) {
                                this._setActiveColHeader(_4c6[currentIdx], currentIdx, _4c7);
                            }
                        } else {
                            if (this.cell) {
                                var sc = this.grid.scroller, r = this.rowIndex, rc = this.grid.rowCount - 1, row = Math.min(rc, Math.max(0, r + _4c3));
                                if (_4c3) {
                                    if (_4c3 > 0) {
                                        if (row > sc.getLastPageRow(sc.page)) {
                                            this.grid.setScrollTop(this.grid.scrollTop + sc.findScrollTop(row) - sc.findScrollTop(r));
                                        }
                                    } else {
                                        if (_4c3 < 0) {
                                            if (row <= sc.getPageRow(sc.page)) {
                                                this.grid.setScrollTop(this.grid.scrollTop - sc.findScrollTop(r) - sc.findScrollTop(row));
                                            }
                                        }
                                    }
                                }
                                var cc = this.grid.layout.cellCount - 1, i = this.cell.index, col = Math.min(cc, Math.max(0, i + _4c4));
                                var cell = this.grid.getCell(col);
                                while (col >= 0 && col < cc && cell && cell.hidden === true) {
                                    col += _4c5;
                                    cell = this.grid.getCell(col);
                                }
                                if (!cell || cell.hidden === true) {
                                    col = i;
                                }
                                var n = cell.getNode(row);
                                if (!n && _4c3) {
                                    if ((row + _4c3) >= 0 && (row + _4c3) <= rc) {
                                        this.move(_4c3 > 0 ? ++_4c3 : --_4c3, _4c4);
                                    }
                                    return;
                                } else {
                                    if ((!n || html.style(n, "display") === "none") && _4c4) {
                                        if ((col + _4c4) >= 0 && (col + _4c4) <= cc) {
                                            this.move(_4c3, _4c4 > 0 ? ++_4c4 : --_4c4);
                                        }
                                        return;
                                    }
                                }
                                this.setFocusIndex(row, col);
                            }
                        }
                    },previousKey: function(e) {
                        if (this.grid.edit.isEditing()) {
                            _4a2.stop(e);
                            this.previous();
                        } else {
                            if (!this.isNavHeader() && !this._isHeaderHidden()) {
                                this.grid.domNode.focus();
                                _4a2.stop(e);
                            } else {
                                this.tabOut(this.grid.domNode);
                                if (this._colHeadFocusIdx != null) {
                                    html.toggleClass(this._findHeaderCells()[this._colHeadFocusIdx], this.focusClass, false);
                                    this._colHeadFocusIdx = null;
                                }
                                this._focusifyCellNode(false);
                            }
                        }
                    },nextKey: function(e) {
                        var _4c8 = (this.grid.rowCount === 0);
                        if (e.target === this.grid.domNode && this._colHeadFocusIdx == null) {
                            this.focusHeader();
                            _4a2.stop(e);
                        } else {
                            if (this.isNavHeader()) {
                                this.blurHeader();
                                if (!this.findAndFocusGridCell()) {
                                    this.tabOut(this.grid.lastFocusNode);
                                }
                                this._colHeadNode = this._colHeadFocusIdx = null;
                            } else {
                                if (this.grid.edit.isEditing()) {
                                    _4a2.stop(e);
                                    this.next();
                                } else {
                                    this.tabOut(this.grid.lastFocusNode);
                                }
                            }
                        }
                    },tabOut: function(_4c9) {
                        this.tabbingOut = true;
                        _4c9.focus();
                    },focusGridView: function() {
                        util.fire(this.focusView, "focus");
                    },focusGrid: function(_4ca) {
                        this.focusGridView();
                        this._focusifyCellNode(true);
                    },findAndFocusGridCell: function() {
                        var _4cb = true;
                        var _4cc = (this.grid.rowCount === 0);
                        if (this.isNoFocusCell() && !_4cc) {
                            var _4cd = 0;
                            var cell = this.grid.getCell(_4cd);
                            if (cell.hidden) {
                                _4cd = this.isNavHeader() ? this._colHeadFocusIdx : 0;
                            }
                            this.setFocusIndex(0, _4cd);
                        } else {
                            if (this.cell && !_4cc) {
                                if (this.focusView && !this.focusView.rowNodes[this.rowIndex]) {
                                    this.grid.scrollToRow(this.rowIndex);
                                }
                                this.focusGrid();
                            } else {
                                _4cb = false;
                            }
                        }
                        this._colHeadNode = this._colHeadFocusIdx = null;
                        return _4cb;
                    },focusHeader: function() {
                        var _4ce = this._findHeaderCells();
                        var _4cf = this._colHeadFocusIdx;
                        if (this._isHeaderHidden()) {
                            this.findAndFocusGridCell();
                        } else {
                            if (!this._colHeadFocusIdx) {
                                if (this.isNoFocusCell()) {
                                    this._colHeadFocusIdx = 0;
                                } else {
                                    this._colHeadFocusIdx = this.cell.index;
                                }
                            }
                        }
                        this._colHeadNode = _4ce[this._colHeadFocusIdx];
                        while (this._colHeadNode && this._colHeadFocusIdx >= 0 && this._colHeadFocusIdx < _4ce.length && this._colHeadNode.style.display == "none") {
                            this._colHeadFocusIdx++;
                            this._colHeadNode = _4ce[this._colHeadFocusIdx];
                        }
                        if (this._colHeadNode && this._colHeadNode.style.display != "none") {
                            if (this.headerMenu && this._contextMenuBindNode != this.grid.domNode) {
                                this.headerMenu.unBindDomNode(this.grid.viewsHeaderNode);
                                this.headerMenu.bindDomNode(this.grid.domNode);
                                this._contextMenuBindNode = this.grid.domNode;
                            }
                            this._setActiveColHeader(this._colHeadNode, this._colHeadFocusIdx, _4cf);
                            this._scrollHeader(this._colHeadFocusIdx);
                            this._focusifyCellNode(false);
                        } else {
                            this.findAndFocusGridCell();
                        }
                    },blurHeader: function() {
                        html.removeClass(this._colHeadNode, this.focusClass);
                        html.removeAttr(this.grid.domNode, "aria-activedescendant");
                        if (this.headerMenu && this._contextMenuBindNode == this.grid.domNode) {
                            var _4d0 = this.grid.viewsHeaderNode;
                            this.headerMenu.unBindDomNode(this.grid.domNode);
                            this.headerMenu.bindDomNode(_4d0);
                            this._contextMenuBindNode = _4d0;
                        }
                    },doFocus: function(e) {
                        if (e && e.target != e.currentTarget) {
                            _4a2.stop(e);
                            return;
                        }
                        if (this._clickFocus) {
                            return;
                        }
                        if (!this.tabbingOut) {
                            this.focusHeader();
                        }
                        this.tabbingOut = false;
                        _4a2.stop(e);
                    },doBlur: function(e) {
                        _4a2.stop(e);
                    },doContextMenu: function(e) {
                        if (!this.headerMenu) {
                            _4a2.stop(e);
                        }
                    },doLastNodeFocus: function(e) {
                        if (this.tabbingOut) {
                            this._focusifyCellNode(false);
                        } else {
                            if (this.grid.rowCount > 0) {
                                if (this.isNoFocusCell()) {
                                    this.setFocusIndex(0, 0);
                                }
                                this._focusifyCellNode(true);
                            } else {
                                this.focusHeader();
                            }
                        }
                        this.tabbingOut = false;
                        _4a2.stop(e);
                    },doLastNodeBlur: function(e) {
                        _4a2.stop(e);
                    },doColHeaderFocus: function(e) {
                        this._setActiveColHeader(e.target, html.attr(e.target, "idx"), this._colHeadFocusIdx);
                        this._scrollHeader(this.getHeaderIndex());
                        _4a2.stop(e);
                    },doColHeaderBlur: function(e) {
                        html.toggleClass(e.target, this.focusClass, false);
                    },_mouseDown: function(e) {
                        this._clickFocus = dojo.some(this.grid.views.views, function(v) {
                            return v.scrollboxNode === e.target;
                        });
                    },_mouseUp: function(e) {
                        this._clickFocus = false;
                    }});
            });
        },"dojox/grid/_Events": function() {
            define(["dojo/keys", "dojo/dom-class", "dojo/_base/declare", "dojo/_base/event", "dojo/_base/sniff"], function(keys, _4d1, _4d2, _4d3, has) {
                return _4d2("dojox.grid._Events", null, {cellOverClass: "dojoxGridCellOver",onKeyEvent: function(e) {
                        this.dispatchKeyEvent(e);
                    },onContentEvent: function(e) {
                        this.dispatchContentEvent(e);
                    },onHeaderEvent: function(e) {
                        this.dispatchHeaderEvent(e);
                    },onStyleRow: function(_4d4) {
                        var i = _4d4;
                        i.customClasses += (i.odd ? " dojoxGridRowOdd" : "") + (i.selected ? " dojoxGridRowSelected" : "") + (i.over ? " dojoxGridRowOver" : "");
                        this.focus.styleRow(_4d4);
                        this.edit.styleRow(_4d4);
                    },onKeyDown: function(e) {
                        if (e.altKey || e.metaKey) {
                            return;
                        }
                        var _4d5;
                        switch (e.keyCode) {
                            case keys.ESCAPE:
                                this.edit.cancel();
                                break;
                            case keys.ENTER:
                                if (!this.edit.isEditing()) {
                                    _4d5 = this.focus.getHeaderIndex();
                                    if (_4d5 >= 0) {
                                        this.setSortIndex(_4d5);
                                        break;
                                    } else {
                                        this.selection.clickSelect(this.focus.rowIndex, dojo.isCopyKey(e), e.shiftKey);
                                    }
                                    _4d3.stop(e);
                                }
                                if (!e.shiftKey) {
                                    var _4d6 = this.edit.isEditing();
                                    this.edit.apply();
                                    if (!_4d6) {
                                        this.edit.setEditCell(this.focus.cell, this.focus.rowIndex);
                                    }
                                }
                                if (!this.edit.isEditing()) {
                                    var _4d7 = this.focus.focusView || this.views.views[0];
                                    _4d7.content.decorateEvent(e);
                                    this.onRowClick(e);
                                    _4d3.stop(e);
                                }
                                break;
                            case keys.SPACE:
                                if (!this.edit.isEditing()) {
                                    _4d5 = this.focus.getHeaderIndex();
                                    if (_4d5 >= 0) {
                                        this.setSortIndex(_4d5);
                                        break;
                                    } else {
                                        this.selection.clickSelect(this.focus.rowIndex, dojo.isCopyKey(e), e.shiftKey);
                                    }
                                    _4d3.stop(e);
                                }
                                break;
                            case keys.TAB:
                                this.focus[e.shiftKey ? "previousKey" : "nextKey"](e);
                                break;
                            case keys.LEFT_ARROW:
                            case keys.RIGHT_ARROW:
                                if (!this.edit.isEditing()) {
                                    var _4d8 = e.keyCode;
                                    _4d3.stop(e);
                                    _4d5 = this.focus.getHeaderIndex();
                                    if (_4d5 >= 0 && (e.shiftKey && e.ctrlKey)) {
                                        this.focus.colSizeAdjust(e, _4d5, (_4d8 == keys.LEFT_ARROW ? -1 : 1) * 5);
                                    } else {
                                        var _4d9 = (_4d8 == keys.LEFT_ARROW) ? 1 : -1;
                                        if (this.isLeftToRight()) {
                                            _4d9 *= -1;
                                        }
                                        this.focus.move(0, _4d9);
                                    }
                                }
                                break;
                            case keys.UP_ARROW:
                                if (!this.edit.isEditing() && this.focus.rowIndex !== 0) {
                                    _4d3.stop(e);
                                    this.focus.move(-1, 0);
                                }
                                break;
                            case keys.DOWN_ARROW:
                                if (!this.edit.isEditing() && this.focus.rowIndex + 1 != this.rowCount) {
                                    _4d3.stop(e);
                                    this.focus.move(1, 0);
                                }
                                break;
                            case keys.PAGE_UP:
                                if (!this.edit.isEditing() && this.focus.rowIndex !== 0) {
                                    _4d3.stop(e);
                                    if (this.focus.rowIndex != this.scroller.firstVisibleRow + 1) {
                                        this.focus.move(this.scroller.firstVisibleRow - this.focus.rowIndex, 0);
                                    } else {
                                        this.setScrollTop(this.scroller.findScrollTop(this.focus.rowIndex - 1));
                                        this.focus.move(this.scroller.firstVisibleRow - this.scroller.lastVisibleRow + 1, 0);
                                    }
                                }
                                break;
                            case keys.PAGE_DOWN:
                                if (!this.edit.isEditing() && this.focus.rowIndex + 1 != this.rowCount) {
                                    _4d3.stop(e);
                                    if (this.focus.rowIndex != this.scroller.lastVisibleRow - 1) {
                                        this.focus.move(this.scroller.lastVisibleRow - this.focus.rowIndex - 1, 0);
                                    } else {
                                        this.setScrollTop(this.scroller.findScrollTop(this.focus.rowIndex + 1));
                                        this.focus.move(this.scroller.lastVisibleRow - this.scroller.firstVisibleRow - 1, 0);
                                    }
                                }
                                break;
                            default:
                                break;
                        }
                    },onMouseOver: function(e) {
                        e.rowIndex == -1 ? this.onHeaderCellMouseOver(e) : this.onCellMouseOver(e);
                    },onMouseOut: function(e) {
                        e.rowIndex == -1 ? this.onHeaderCellMouseOut(e) : this.onCellMouseOut(e);
                    },onMouseDown: function(e) {
                        e.rowIndex == -1 ? this.onHeaderCellMouseDown(e) : this.onCellMouseDown(e);
                    },onMouseOverRow: function(e) {
                        if (!this.rows.isOver(e.rowIndex)) {
                            this.rows.setOverRow(e.rowIndex);
                            e.rowIndex == -1 ? this.onHeaderMouseOver(e) : this.onRowMouseOver(e);
                        }
                    },onMouseOutRow: function(e) {
                        if (this.rows.isOver(-1)) {
                            this.onHeaderMouseOut(e);
                        } else {
                            if (!this.rows.isOver(-2)) {
                                this.rows.setOverRow(-2);
                                this.onRowMouseOut(e);
                            }
                        }
                    },onMouseDownRow: function(e) {
                        if (e.rowIndex != -1) {
                            this.onRowMouseDown(e);
                        }
                    },onCellMouseOver: function(e) {
                        if (e.cellNode) {
                            _4d1.add(e.cellNode, this.cellOverClass);
                        }
                    },onCellMouseOut: function(e) {
                        if (e.cellNode) {
                            _4d1.remove(e.cellNode, this.cellOverClass);
                        }
                    },onCellMouseDown: function(e) {
                    },onCellClick: function(e) {
                        this._click[0] = this._click[1];
                        this._click[1] = e;
                        if (!this.edit.isEditCell(e.rowIndex, e.cellIndex)) {
                            this.focus.setFocusCell(e.cell, e.rowIndex);
                        }
                        if (this._click.length > 1 && this._click[0] == null) {
                            this._click.shift();
                        }
                        this.onRowClick(e);
                    },onCellDblClick: function(e) {
                        var _4da;
                        if (this._click.length > 1 && has("ie")) {
                            _4da = this._click[1];
                        } else {
                            if (this._click.length > 1 && this._click[0].rowIndex != this._click[1].rowIndex) {
                                _4da = this._click[0];
                            } else {
                                _4da = e;
                            }
                        }
                        this.focus.setFocusCell(_4da.cell, _4da.rowIndex);
                        this.edit.setEditCell(_4da.cell, _4da.rowIndex);
                        this.onRowDblClick(e);
                    },onCellContextMenu: function(e) {
                        this.onRowContextMenu(e);
                    },onCellFocus: function(_4db, _4dc) {
                        this.edit.cellFocus(_4db, _4dc);
                    },onRowClick: function(e) {
                        this.edit.rowClick(e);
                        this.selection.clickSelectEvent(e);
                    },onRowDblClick: function(e) {
                    },onRowMouseOver: function(e) {
                    },onRowMouseOut: function(e) {
                    },onRowMouseDown: function(e) {
                    },onRowContextMenu: function(e) {
                    	debugger;
                    	this.edit.rowClick(e);
                      this.selection.clickSelectEvent(e);
                    },onHeaderMouseOver: function(e) {
                    },onHeaderMouseOut: function(e) {
                    },onHeaderCellMouseOver: function(e) {
                        if (e.cellNode) {
                            _4d1.add(e.cellNode, this.cellOverClass);
                        }
                    },onHeaderCellMouseOut: function(e) {
                        if (e.cellNode) {
                            _4d1.remove(e.cellNode, this.cellOverClass);
                        }
                    },onHeaderCellMouseDown: function(e) {
                    },onHeaderClick: function(e) {
                    },onHeaderCellClick: function(e) {
                        this.setSortIndex(e.cell.index);
                        this.onHeaderClick(e);
                    },onHeaderDblClick: function(e) {
                    },onHeaderCellDblClick: function(e) {
                        this.onHeaderDblClick(e);
                    },onHeaderCellContextMenu: function(e) {
                        this.onHeaderContextMenu(e);
                    },onHeaderContextMenu: function(e) {
                        if (!this.headerMenu) {
                            _4d3.stop(e);
                        }
                    },onStartEdit: function(_4dd, _4de) {
                    },onApplyCellEdit: function(_4df, _4e0, _4e1) {
                    },onCancelEdit: function(_4e2) {
                    },onApplyEdit: function(_4e3) {
                    },onCanSelect: function(_4e4) {
                        return true;
                    },onCanDeselect: function(_4e5) {
                        return true;
                    },onSelected: function(_4e6) {
                        this.updateRowStyles(_4e6);
                    },onDeselected: function(_4e7) {
                        this.updateRowStyles(_4e7);
                    },onSelectionChanged: function() {
                    }});
            });
        },"dijit/MenuItem": function() {
            define(["dojo/_base/declare", "dojo/dom", "dojo/dom-attr", "dojo/dom-class", "dojo/_base/kernel", "dojo/sniff", "dojo/_base/lang", "./_Widget", "./_TemplatedMixin", "./_Contained", "./_CssStateMixin", "dojo/text!./templates/MenuItem.html"], function(_4e8, dom, _4e9, _4ea, _4eb, has, lang, _4ec, _4ed, _4ee, _4ef, _4f0) {
                var _4f1 = _4e8("dijit.MenuItem" + (has("dojo-bidi") ? "_NoBidi" : ""), [_4ec, _4ed, _4ee, _4ef], {templateString: _4f0,baseClass: "dijitMenuItem",label: "",_setLabelAttr: function(val) {
                        this._set("label", val);
                        var _4f2 = "";
                        var text;
                        var ndx = val.search(/{\S}/);
                        if (ndx >= 0) {
                            _4f2 = val.charAt(ndx + 1);
                            var _4f3 = val.substr(0, ndx);
                            var _4f4 = val.substr(ndx + 3);
                            text = _4f3 + _4f2 + _4f4;
                            val = _4f3 + "<span class=\"dijitMenuItemShortcutKey\">" + _4f2 + "</span>" + _4f4;
                        } else {
                            text = val;
                        }
                        this.domNode.setAttribute("aria-label", text + " " + this.accelKey);
                        this.containerNode.innerHTML = val;
                        this._set("shortcutKey", _4f2);
                    },iconClass: "dijitNoIcon",_setIconClassAttr: {node: "iconNode",type: "class"},accelKey: "",disabled: false,_fillContent: function(_4f5) {
                        if (_4f5 && !("label" in this.params)) {
                            this._set("label", _4f5.innerHTML);
                        }
                    },buildRendering: function() {
                        this.inherited(arguments);
                        var _4f6 = this.id + "_text";
                        _4e9.set(this.containerNode, "id", _4f6);
                        if (this.accelKeyNode) {
                            _4e9.set(this.accelKeyNode, "id", this.id + "_accel");
                        }
                        dom.setSelectable(this.domNode, false);
                    },onClick: function() {
                    },focus: function() {
                        try {
                            if (has("ie") == 8) {
                                this.containerNode.focus();
                            }
                            this.focusNode.focus();
                        } catch (e) {
                        }
                    },_setSelected: function(_4f7) {
                        _4ea.toggle(this.domNode, "dijitMenuItemSelected", _4f7);
                    },setLabel: function(_4f8) {
                        _4eb.deprecated("dijit.MenuItem.setLabel() is deprecated.  Use set('label', ...) instead.", "", "2.0");
                        this.set("label", _4f8);
                    },setDisabled: function(_4f9) {
                        _4eb.deprecated("dijit.Menu.setDisabled() is deprecated.  Use set('disabled', bool) instead.", "", "2.0");
                        this.set("disabled", _4f9);
                    },_setDisabledAttr: function(_4fa) {
                        this.focusNode.setAttribute("aria-disabled", _4fa ? "true" : "false");
                        this._set("disabled", _4fa);
                    },_setAccelKeyAttr: function(_4fb) {
                        if (this.accelKeyNode) {
                            this.accelKeyNode.style.display = _4fb ? "" : "none";
                            this.accelKeyNode.innerHTML = _4fb;
                            _4e9.set(this.containerNode, "colSpan", _4fb ? "1" : "2");
                        }
                        this._set("accelKey", _4fb);
                    }});
                if (has("dojo-bidi")) {
                    _4f1 = _4e8("dijit.MenuItem", _4f1, {_setLabelAttr: function(val) {
                            this.inherited(arguments);
                            if (this.textDir === "auto") {
                                this.applyTextDir(this.textDirNode);
                            }
                        }});
                }
                return _4f1;
            });
        },"dojox/grid/_RowSelector": function() {
            define(["dojo/_base/declare", "./_View"], function(_4fc, _4fd) {
                return _4fc("dojox.grid._RowSelector", _4fd, {defaultWidth: "2em",noscroll: true,padBorderWidth: 2,buildRendering: function() {
                        this.inherited("buildRendering", arguments);
                        this.scrollboxNode.style.overflow = "hidden";
                        this.headerNode.style.visibility = "hidden";
                    },getWidth: function() {
                        return this.viewWidth || this.defaultWidth;
                    },buildRowContent: function(_4fe, _4ff) {
                        var w = this.contentWidth || 0;
                        _4ff.innerHTML = "<table class=\"dojoxGridRowbarTable\" style=\"width:" + w + "px;height:1px;\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\" role=\"presentation\"><tr><td class=\"dojoxGridRowbarInner\">&nbsp;</td></tr></table>";
                    },renderHeader: function() {
                    },updateRow: function() {
                    },resize: function() {
                        this.adaptHeight();
                    },adaptWidth: function() {
                        if (!("contentWidth" in this) && this.contentNode && this.contentNode.offsetWidth > 0) {
                            this.contentWidth = this.contentNode.offsetWidth - this.padBorderWidth;
                        }
                    },doStyleRowNode: function(_500, _501) {
                        var n = ["dojoxGridRowbar dojoxGridNonNormalizedCell"];
                        if (this.grid.rows.isOver(_500)) {
                            n.push("dojoxGridRowbarOver");
                        }
                        if (this.grid.selection.isSelected(_500)) {
                            n.push("dojoxGridRowbarSelected");
                        }
                        _501.className = n.join(" ");
                    },domouseover: function(e) {
                        this.grid.onMouseOverRow(e);
                    },domouseout: function(e) {
                        if (!this.isIntraRowEvent(e)) {
                            this.grid.onMouseOutRow(e);
                        }
                    }});
            });
        },"url:dojox/grid/resources/View.html": "<div class=\"dojoxGridView\" role=\"presentation\">\n\t<div class=\"dojoxGridHeader\" dojoAttachPoint=\"headerNode\" role=\"presentation\">\n\t\t<div dojoAttachPoint=\"headerNodeContainer\" style=\"width:9000em\" role=\"presentation\">\n\t\t\t<div dojoAttachPoint=\"headerContentNode\" role=\"row\"></div>\n\t\t</div>\n\t</div>\n\t<input type=\"checkbox\" class=\"dojoxGridHiddenFocus\" dojoAttachPoint=\"hiddenFocusNode\" role=\"presentation\" />\n\t<input type=\"checkbox\" class=\"dojoxGridHiddenFocus\" role=\"presentation\" />\n\t<div class=\"dojoxGridScrollbox\" dojoAttachPoint=\"scrollboxNode\" role=\"presentation\">\n\t\t<div class=\"dojoxGridContent\" dojoAttachPoint=\"contentNode\" hidefocus=\"hidefocus\" role=\"presentation\"></div>\n\t</div>\n</div>\n","url:dijit/templates/MenuItem.html": "<tr class=\"dijitReset\" data-dojo-attach-point=\"focusNode\" role=\"menuitem\" tabIndex=\"-1\">\n\t<td class=\"dijitReset dijitMenuItemIconCell\" role=\"presentation\">\n\t\t<span role=\"presentation\" class=\"dijitInline dijitIcon dijitMenuItemIcon\" data-dojo-attach-point=\"iconNode\"></span>\n\t</td>\n\t<td class=\"dijitReset dijitMenuItemLabel\" colspan=\"2\" data-dojo-attach-point=\"containerNode,textDirNode\"\n\t\trole=\"presentation\"></td>\n\t<td class=\"dijitReset dijitMenuItemAccelKey\" style=\"display: none\" data-dojo-attach-point=\"accelKeyNode\"></td>\n\t<td class=\"dijitReset dijitMenuArrowCell\" role=\"presentation\">\n\t\t<span data-dojo-attach-point=\"arrowWrapper\" style=\"visibility: hidden\">\n\t\t\t<span class=\"dijitInline dijitIcon dijitMenuExpand\"></span>\n\t\t\t<span class=\"dijitMenuExpandA11y\">+</span>\n\t\t</span>\n\t</td>\n</tr>\n","url:dojox/grid/resources/_Grid.html": "<div hidefocus=\"hidefocus\" role=\"grid\" dojoAttachEvent=\"onmouseout:_mouseOut\">\n\t<div class=\"dojoxGridMasterHeader\" dojoAttachPoint=\"viewsHeaderNode\" role=\"presentation\"></div>\n\t<div class=\"dojoxGridMasterView\" dojoAttachPoint=\"viewsNode\" role=\"presentation\"></div>\n\t<div class=\"dojoxGridMasterMessages\" style=\"display: none;\" dojoAttachPoint=\"messagesNode\"></div>\n\t<span dojoAttachPoint=\"lastFocusNode\" tabindex=\"0\"></span>\n</div>\n","url:dijit/templates/CheckedMenuItem.html": "<tr class=\"dijitReset\" data-dojo-attach-point=\"focusNode\" role=\"${role}\" tabIndex=\"-1\" aria-checked=\"${checked}\">\n\t<td class=\"dijitReset dijitMenuItemIconCell\" role=\"presentation\">\n\t\t<span class=\"dijitInline dijitIcon dijitMenuItemIcon dijitCheckedMenuItemIcon\" data-dojo-attach-point=\"iconNode\"></span>\n\t\t<span class=\"dijitMenuItemIconChar dijitCheckedMenuItemIconChar\">${checkedChar}</span>\n\t</td>\n\t<td class=\"dijitReset dijitMenuItemLabel\" colspan=\"2\" data-dojo-attach-point=\"containerNode,labelNode,textDirNode\"></td>\n\t<td class=\"dijitReset dijitMenuItemAccelKey\" style=\"display: none\" data-dojo-attach-point=\"accelKeyNode\"></td>\n\t<td class=\"dijitReset dijitMenuArrowCell\" role=\"presentation\">&#160;</td>\n</tr>\n","*now": function(r) {
            r(["dojo/i18n!*preload*dojox/grid/nls/DataGrid*[\"ar\",\"ca\",\"cs\",\"da\",\"de\",\"el\",\"en-gb\",\"en-us\",\"es-es\",\"fi-fi\",\"fr-fr\",\"he-il\",\"hu\",\"it-it\",\"ja-jp\",\"ko-kr\",\"nl-nl\",\"nb\",\"pl\",\"pt-br\",\"pt-pt\",\"ru\",\"sk\",\"sl\",\"sv\",\"th\",\"tr\",\"zh-tw\",\"zh-cn\",\"ROOT\"]"]);
        }}});
define("dojox/grid/DataGrid", ["../main", "dojo/_base/array", "dojo/_base/lang", "dojo/_base/json", "dojo/_base/sniff", "dojo/_base/declare", "./_Grid", "./DataSelection", "dojo/_base/html", "dojo/has", "dojo/has!dojo-bidi?./bidi/_BidiMixin"], function(_502, _503, lang, json, has, _504, _505, _506, html) {
    var _507 = _504("dojox.grid.DataGrid", _505, {store: null,query: null,queryOptions: null,fetchText: "...",sortFields: null,updateDelay: 1,items: null,_store_connects: null,_by_idty: null,_by_idx: null,_cache: null,_pages: null,_pending_requests: null,_bop: -1,_eop: -1,_requests: 0,rowCount: 0,_isLoaded: false,_isLoading: false,keepSelection: false,postCreate: function() {
            this._pages = [];
            this._store_connects = [];
            this._by_idty = {};
            this._by_idx = [];
            this._cache = [];
            this._pending_requests = {};
            this._setStore(this.store);
            this.inherited(arguments);
        },destroy: function() {
            this.selection.destroy();
            this.inherited(arguments);
        },createSelection: function() {
            this.selection = new _506(this);
        },get: function(_508, _509) {
            if (_509 && this.field == "_item" && !this.fields) {
                return _509;
            } else {
                if (_509 && this.fields) {
                    var ret = [];
                    var s = this.grid.store;
                    _503.forEach(this.fields, function(f) {
                        ret = ret.concat(s.getValues(_509, f));
                    });
                    return ret;
                } else {
                    if (!_509 && typeof _508 === "string") {
                        return this.inherited(arguments);
                    }
                }
            }
            return (!_509 ? this.defaultValue : (!this.field ? this.value : (this.field == "_item" ? _509 : this.grid.store.getValue(_509, this.field))));
        },_checkUpdateStatus: function() {
            if (this.updateDelay > 0) {
                var _50a = false;
                if (this._endUpdateDelay) {
                    clearTimeout(this._endUpdateDelay);
                    delete this._endUpdateDelay;
                    _50a = true;
                }
                if (!this.updating) {
                    this.beginUpdate();
                    _50a = true;
                }
                if (_50a) {
                    var _50b = this;
                    this._endUpdateDelay = setTimeout(function() {
                        delete _50b._endUpdateDelay;
                        _50b.endUpdate();
                    }, this.updateDelay);
                }
            }
        },_onSet: function(item, _50c, _50d, _50e) {
            this._checkUpdateStatus();
            var idx = this.getItemIndex(item);
            if (idx > -1) {
                this.updateRow(idx);
            }
        },_createItem: function(item, _50f) {
            var idty = this._hasIdentity ? this.store.getIdentity(item) : json.toJson(this.query) + ":idx:" + _50f + ":sort:" + json.toJson(this.getSortProps());
            var o = this._by_idty[idty] = {idty: idty,item: item};
            return o;
        },_addItem: function(item, _510, _511) {
            this._by_idx[_510] = this._createItem(item, _510);
            if (!_511) {
                this.updateRow(_510);
            }
        },_onNew: function(item, _512) {
            this._checkUpdateStatus();
            var _513 = this.get("rowCount");
            this._addingItem = true;
            this.updateRowCount(_513 + 1);
            this._addingItem = false;
            this._addItem(item, _513);
            this.showMessage();
        },_onDelete: function(item) {
            this._checkUpdateStatus();
            var idx = this._getItemIndex(item, true);
            if (idx >= 0) {
                this._pages = [];
                this._bop = -1;
                this._eop = -1;
                var o = this._by_idx[idx];
                this._by_idx.splice(idx, 1);
                delete this._by_idty[o.idty];
                this.updateRowCount(this.get("rowCount") - 1);
                if (this.get("rowCount") === 0) {
                    this.showMessage(this.noDataMessage);
                }
            }
            if (this.selection.isSelected(idx)) {
                this.selection.deselect(idx);
                this.selection.selected.splice(idx, 1);
            }
        },_onRevert: function() {
            this._refresh();
        },setStore: function(_514, _515, _516) {
            if (this._requestsPending(0)) {
                return;
            }
            this._setQuery(_515, _516);
            this._setStore(_514);
            this._refresh(true);
        },setQuery: function(_517, _518) {
            if (this._requestsPending(0)) {
                return;
            }
            this._setQuery(_517, _518);
            this._refresh(true);
        },setItems: function(_519) {
            this.items = _519;
            this._setStore(this.store);
            this._refresh(true);
        },_setQuery: function(_51a, _51b) {
            this.query = _51a;
            this.queryOptions = _51b || this.queryOptions;
        },_setStore: function(_51c) {
            if (this.store && this._store_connects) {
                _503.forEach(this._store_connects, this.disconnect, this);
            }
            this.store = _51c;
            if (this.store) {
                var f = this.store.getFeatures();
                var h = [];
                this._canEdit = !!f["dojo.data.api.Write"] && !!f["dojo.data.api.Identity"];
                this._hasIdentity = !!f["dojo.data.api.Identity"];
                if (!!f["dojo.data.api.Notification"] && !this.items) {
                    h.push(this.connect(this.store, "onSet", "_onSet"));
                    h.push(this.connect(this.store, "onNew", "_onNew"));
                    h.push(this.connect(this.store, "onDelete", "_onDelete"));
                }
                if (this._canEdit) {
                    h.push(this.connect(this.store, "revert", "_onRevert"));
                }
                this._store_connects = h;
            }
        },_onFetchBegin: function(size, req) {
            if (!this.scroller) {
                return;
            }
            if (this.rowCount != size) {
                if (req.isRender) {
                    this.scroller.init(size, this.keepRows, this.rowsPerPage);
                    this.rowCount = size;
                    this._setAutoHeightAttr(this.autoHeight, true);
                    this._skipRowRenormalize = true;
                    this.prerender();
                    this._skipRowRenormalize = false;
                } else {
                    this.updateRowCount(size);
                }
            }
            if (!size) {
                this.views.render();
                this._resize();
                this.showMessage(this.noDataMessage);
                this.focus.initFocusView();
            } else {
                this.showMessage();
            }
        },_onFetchComplete: function(_51d, req) {
            if (!this.scroller) {
                return;
            }
            if (_51d && _51d.length > 0) {
                _503.forEach(_51d, function(item, idx) {
                    this._addItem(item, req.start + idx, true);
                }, this);
                this.updateRows(req.start, _51d.length);
                if (req.isRender) {
                    this.setScrollTop(0);
                    this.postrender();
                } else {
                    if (this._lastScrollTop) {
                        this.setScrollTop(this._lastScrollTop);
                    }
                }
                if (has("ie")) {
                    html.setSelectable(this.domNode, this.selectable);
                }
            }
            delete this._lastScrollTop;
            if (!this._isLoaded) {
                this._isLoading = false;
                this._isLoaded = true;
            }
            this._pending_requests[req.start] = false;
        },_onFetchError: function(err, req) {
            delete this._lastScrollTop;
            if (!this._isLoaded) {
                this._isLoading = false;
                this._isLoaded = true;
                this.showMessage(this.errorMessage);
            }
            this._pending_requests[req.start] = false;
            this.onFetchError(err, req);
        },onFetchError: function(err, req) {
        },_fetch: function(_51e, _51f) {
            _51e = _51e || 0;
            if (this.store && !this._pending_requests[_51e]) {
                if (!this._isLoaded && !this._isLoading) {
                    this._isLoading = true;
                    this.showMessage(this.loadingMessage);
                }
                this._pending_requests[_51e] = true;
                try {
                    if (this.items) {
                        var _520 = this.items;
                        var _521 = this.store;
                        this.rowsPerPage = _520.length;
                        var req = {start: _51e,count: this.rowsPerPage,isRender: _51f};
                        this._onFetchBegin(_520.length, req);
                        var _522 = 0;
                        _503.forEach(_520, function(i) {
                            if (!_521.isItemLoaded(i)) {
                                _522++;
                            }
                        });
                        if (_522 === 0) {
                            this._onFetchComplete(_520, req);
                        } else {
                            var _523 = function(item) {
                                _522--;
                                if (_522 === 0) {
                                    this._onFetchComplete(_520, req);
                                }
                            };
                            _503.forEach(_520, function(i) {
                                if (!_521.isItemLoaded(i)) {
                                    _521.loadItem({item: i,onItem: _523,scope: this});
                                }
                            }, this);
                        }
                    } else {
                        this.store.fetch({start: _51e,count: this.rowsPerPage,query: this.query,sort: this.getSortProps(),queryOptions: this.queryOptions,isRender: _51f,onBegin: lang.hitch(this, "_onFetchBegin"),onComplete: lang.hitch(this, "_onFetchComplete"),onError: lang.hitch(this, "_onFetchError")});
                    }
                } catch (e) {
                    this._onFetchError(e, {start: _51e,count: this.rowsPerPage});
                }
            }
        },_clearData: function() {
            this.updateRowCount(0);
            this._by_idty = {};
            this._by_idx = [];
            this._pages = [];
            this._bop = this._eop = -1;
            this._isLoaded = false;
            this._isLoading = false;
        },getItem: function(idx) {
            var data = this._by_idx[idx];
            if (!data || (data && !data.item)) {
                this._preparePage(idx);
                return null;
            }
            return data.item;
        },getItemIndex: function(item) {
            return this._getItemIndex(item, false);
        },_getItemIndex: function(item, _524) {
            if (!_524 && !this.store.isItem(item)) {
                return -1;
            }
            var idty = this._hasIdentity ? this.store.getIdentity(item) : null;
            for (var i = 0, l = this._by_idx.length; i < l; i++) {
                var d = this._by_idx[i];
                if (d && ((idty && d.idty == idty) || (d.item === item))) {
                    return i;
                }
            }
            return -1;
        },filter: function(_525, _526) {
            this.query = _525;
            if (_526) {
                this._clearData();
            }
            this._fetch();
        },_getItemAttr: function(idx, attr) {
            var item = this.getItem(idx);
            return (!item ? this.fetchText : this.store.getValue(item, attr));
        },_render: function() {
            if (this.domNode.parentNode) {
                this.scroller.init(this.get("rowCount"), this.keepRows, this.rowsPerPage);
                this.prerender();
                this._fetch(0, true);
            }
        },_requestsPending: function(_527) {
            return this._pending_requests[_527];
        },_rowToPage: function(_528) {
            return (this.rowsPerPage ? Math.floor(_528 / this.rowsPerPage) : _528);
        },_pageToRow: function(_529) {
            return (this.rowsPerPage ? this.rowsPerPage * _529 : _529);
        },_preparePage: function(_52a) {
            if ((_52a < this._bop || _52a >= this._eop) && !this._addingItem) {
                var _52b = this._rowToPage(_52a);
                this._needPage(_52b);
                this._bop = _52b * this.rowsPerPage;
                this._eop = this._bop + (this.rowsPerPage || this.get("rowCount"));
            }
        },_needPage: function(_52c) {
            if (!this._pages[_52c]) {
                this._pages[_52c] = true;
                this._requestPage(_52c);
            }
        },_requestPage: function(_52d) {
            var row = this._pageToRow(_52d);
            var _52e = Math.min(this.rowsPerPage, this.get("rowCount") - row);
            if (_52e > 0) {
                this._requests++;
                if (!this._requestsPending(row)) {
                    setTimeout(lang.hitch(this, "_fetch", row, false), 1);
                }
            }
        },getCellName: function(_52f) {
            return _52f.field;
        },_refresh: function(_530) {
            this._clearData();
            this._fetch(0, _530);
        },sort: function() {
            this.edit.apply();
            this._lastScrollTop = this.scrollTop;
            this._refresh();
        },canSort: function() {
            return (!this._isLoading);
        },getSortProps: function() {
            var c = this.getCell(this.getSortIndex());
            if (!c) {
                if (this.sortFields) {
                    return this.sortFields;
                }
                return null;
            } else {
                var desc = c["sortDesc"];
                var si = !(this.sortInfo > 0);
                if (typeof desc == "undefined") {
                    desc = si;
                } else {
                    desc = si ? !desc : desc;
                }
                return [{attribute: c.field,descending: desc}];
            }
        },styleRowState: function(_531) {
            if (this.store && this.store.getState) {
                var _532 = this.store.getState(_531.index), c = "";
                for (var i = 0, ss = ["inflight", "error", "inserting"], s; s = ss[i]; i++) {
                    if (_532[s]) {
                        c = " dojoxGridRow-" + s;
                        break;
                    }
                }
                _531.customClasses += c;
            }
        },onStyleRow: function(_533) {
            this.styleRowState(_533);
            this.inherited(arguments);
        },canEdit: function(_534, _535) {
            return this._canEdit;
        },_copyAttr: function(idx, attr) {
            var row = {};
            var _536 = {};
            var src = this.getItem(idx);
            return this.store.getValue(src, attr);
        },doStartEdit: function(_537, _538) {
            if (!this._cache[_538]) {
                this._cache[_538] = this._copyAttr(_538, _537.field);
            }
            this.onStartEdit(_537, _538);
        },doApplyCellEdit: function(_539, _53a, _53b) {
            this.store.fetchItemByIdentity({identity: this._by_idx[_53a].idty,onItem: lang.hitch(this, function(item) {
                    var _53c = this.store.getValue(item, _53b);
                    if (typeof _53c == "number") {
                        _539 = isNaN(_539) ? _539 : parseFloat(_539);
                    } else {
                        if (typeof _53c == "boolean") {
                            _539 = _539 == "true" ? true : _539 == "false" ? false : _539;
                        } else {
                            if (_53c instanceof Date) {
                                var _53d = new Date(_539);
                                _539 = isNaN(_53d.getTime()) ? _539 : _53d;
                            }
                        }
                    }
                    this.store.setValue(item, _53b, _539);
                    this.onApplyCellEdit(_539, _53a, _53b);
                })});
        },doCancelEdit: function(_53e) {
            var _53f = this._cache[_53e];
            if (_53f) {
                this.updateRow(_53e);
                delete this._cache[_53e];
            }
            this.onCancelEdit.apply(this, arguments);
        },doApplyEdit: function(_540, _541) {
            var _542 = this._cache[_540];
            this.onApplyEdit(_540);
        },removeSelectedRows: function() {
            if (this._canEdit) {
                this.edit.apply();
                var fx = lang.hitch(this, function(_543) {
                    if (_543.length) {
                        _503.forEach(_543, this.store.deleteItem, this.store);
                        this.selection.clear();
                    }
                });
                if (this.allItemsSelected) {
                    this.store.fetch({query: this.query,queryOptions: this.queryOptions,onComplete: fx});
                } else {
                    fx(this.selection.getSelected());
                }
            }
        }});
    _507.cell_markupFactory = function(_544, node, _545) {
        var _546 = lang.trim(html.attr(node, "field") || "");
        if (_546) {
            _545.field = _546;
        }
        _545.field = _545.field || _545.name;
        var _547 = lang.trim(html.attr(node, "fields") || "");
        if (_547) {
            _545.fields = _547.split(",");
        }
        if (_544) {
            _544(node, _545);
        }
    };
    _507.markupFactory = function(_548, node, ctor, _549) {
        return _505.markupFactory(_548, node, ctor, lang.partial(_507.cell_markupFactory, _549));
    };
    return _507;
});
