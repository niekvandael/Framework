/**
 * CREATED BY GENERATOR ON 2015/05/04 12:39:53 @ v 4.0
 *
 * Package    : refer.cur.list
 */
 
var OrderListModel = (function(){
	OrderListModel.prototype.constructor.call(this);
	
    this.KEY_BEGIN              = new ORDER();
    this.KEY_NEXT               = new ORDER();
    this.LIST                   = new ORDER_LIST();
    
    this.getNewKeyBegin = function(){
        return new Order;
    };
    
    this.getNewList = function(){
        return null;
    };
});

OrderListModel.prototype 	= Object.create(ListModel.prototype);
OrderListModel.prototype.constructor = ListModel;