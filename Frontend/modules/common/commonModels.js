/**
 * CREATED BY NVD ON 1-apr.-2014 13:57:41
 * 
 * Package : modules/common Filename : commonModels.js
 */

function commonModels() {
    this.CH000S0W_COMMON = new CH000S0W_COMMON();
    this.CH000SEW_SYS_ERROR = new CH000SEW_SYS_ERROR();
    this.CH000S0W_COMM = new CH000S0W_COMM();
    this.PROGRAM_RETURN_REC = new PROGRAM_RETURN_REC();
    
    this.settings = {};
    this.settingsToCommit = [];
    
    
    this.getSettingsForEntity = function(entity){
    	var entitySettings = {};
    	
    	for (var setting in this.settings) {
    		if(setting.split(".")[0] == entity){
    			entitySettings[this.settings[setting].key] = this.settings[setting];
    		}
    	}	
    	return entitySettings;
    };
    
    this.saveSuccessfull = function(){
    	this.settingsToCommit = [];
    };
    
    this.getSettingsToCommit = function(){
    	return this.settingsToCommit;
    };
    
    this.getProgramReturnRec = function() {
    	return this.PROGRAM_RETURN_REC;
    };

    this.setCredentials = function(username, password) {
		this.PROGRAM_RETURN_REC.username = username;
		this.PROGRAM_RETURN_REC.password = encrypt(password);
    };
    
    this.setEncryptedCredentials = function(username, password) {
		this.PROGRAM_RETURN_REC.username = username;
		this.PROGRAM_RETURN_REC.password = password;
    };
    this.getusername = function() {
    	return (this.PROGRAM_RETURN_REC.username);
    };

    this.setSettings = function(settings) {
		if (this.settings == null) {
			var temp = [];
			for (var i = 0; i < settings.length; i++){
				temp[settings[i].key] = settings[i]; 
			}
		    this.settings = temp;
		} else {
			this.updateSettings(settings);
		}
    };

    this.updateSettings = function(settings) {
    	for (var i = 0; i < settings.length; i++){
		    if(this.settings[settings[i].key] == undefined || this.settings[settings[i].key].value != settings[i].value){
		    	this.settingsToCommit.push(settings[i]);
		    }
		    
		    this.settings[settings[i].key] = settings[i];
    	}
    };

    this.getSettings = function() {
    	return this.settings;
    };

    this.getSetting = function(id) {
	    if (this.settings != undefined && this.settings[id] != null) {
	    	return this.settings[id].value;
	    }
		return undefined;
    };

};

if (typeof window.models === 'undefined') {
    window.models = new commonModels();
};