/**
 * CREATED BY NVD ON 2015/04/22 09:12:36 @ v 3.0
 *
 * Package    : Login
 */

define([
    "dojo/_base/declare",
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
    'dijit/_WidgetsInTemplateMixin',
    "dojo/text!modules/login/LoginView.html",
    "mvc/ListController",
    "dijit/registry",
    "dojo/keys",
    "/modules/login/LoginModel.js"
], function(declare, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, template, ListController, registry, keys) {
    return declare("LoginController", [_WidgetBase, _TemplatedMixin, ListController, _WidgetsInTemplateMixin], {
        templateString: template,
        isWeb: false,
    	  
    	  constructor: function(){
    	  	this.inherited(arguments);
    	  	this.model = new LoginModel();
    	  	this._connections = [];
    	  },
    	  
    	  startup: function(){/*overwrite default startup*/},
    	  
    	  postCreate: function(){
    	  	this.inherited(arguments);
    	  	this.password.focus();
    	  	this.username.focus();
    	  },
    	  
    	  loginAction: function(){
    	  	document.getElementById(this.id + 'pageInformation').innerHTML = LANGUAGE.LOGIN_BUSY;
    	  	this.loginButton.disabled = true;
    	  	window.models.setCredentials(this.username.get('value'), this.password.get('value'));
    	  	this.callWebservice();
    	  },
    	  
    	  handleKeys: function(e){
    	  	if (e.keyCode != keys.ENTER || this.loginButton.disabled){
    	  		return;
    	  	}
    	  	this.loginAction();
    	  },
    	  
    	  callWebservice: function(){
    	  	document.getElementById(this.id + 'loader').style.visibility = "visible";
    	  	callWebservice("iLoginService", "login", this.model.getModel(), "LoginService", this, "callbackLoginService", "loginWebserviceError");
    	  },
    	  
    	  callbackLoginService: function(data){
    	  	if (document.getElementById(this.id + 'loader')){
    	  		document.getElementById(this.id + 'loader').style.visibility = "hidden";
    	  	}
    	  	this.loginButton.disabled = false;
    	  	switch(data.result){
    			case 200:
    				getSettings();
    				if (this.isWeb){
    					getMenu();
    					
    				}
    				registry.byId("loginModal").destroyRecursive();
    			  break;
    			case 201:
    				document.getElementById(this.id + 'pageInformation').innerHTML = LANGUAGE.LOGIN_INCORRECT_PASSWORD;
    			  break;
    			case 202:
    				document.getElementById(this.id + 'pageInformation').innerHTML = LANGUAGE.LOGIN_PASSWORD_EXPIRED;
    			  //this.showChangePassword();
    			  break;
    			case (data.result <= 100):
    				document.getElementById(this.id + 'pageInformation').innerHTML = LANGUAGE.LOGIN_PASSWORD_WILL_EXPIRE;
    			  break; 
    			default: document.getElementById(this.id + 'pageInformation').innerHTML = LANGUAGE.UNKNOWN_ERROR;
    			  break;
    			}
    	  }
    });
});