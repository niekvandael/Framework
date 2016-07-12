/**
 * CREATED BY GENERATOR ON 2014/10/08 08:15:45 @ v 2.0
 *
 * Package    : webmodules.contract.opencontract.list
 */
 
var contractListModel = (function(){
	contractListModel.prototype.constructor.call(this);
	
    this.KEY_BEGIN              = new CONTRACT_KEY_BEGIN();
    this.LIST                   = new CONTRACT_LIST();
    
    this.getNewKeyBegin = function(){
        return new CONTRACT_KEY_BEGIN;
    };
    
    this.getNewList = function(){
    
        return new CONTRACT_LIST;
    };
    
    this.getServiceModel = function(){
        return [window.models.CH000S0W_COMMON, 
                window.models.CH000SEW_SYS_ERROR, 
                window.models.CH000S0W_COMM, 
                this.KEY_BEGIN, 
                this.getNewList(), 
                window.models.getProgramReturnRec()
               ];
    };
    
    // Overwrite : no KEY_NEXT
    this.setListModel = function( model ){
        this.returnedLength = model[1].contract_detail_data.length;
        this.LIST.contract_detail_data = model[1].contract_detail_data;
    };
    
    // Overwrite : no KEY_NEXT
    this.getListModel = function (){
        return(this.LIST.contract_detail_data);
    };
});

contractListModel.prototype 	= Object.create(ListModel.prototype);
contractListModel.prototype.constructor = ListModel;