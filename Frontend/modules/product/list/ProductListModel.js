/**
 * CREATED BY GENERATOR ON 2015/05/04 12:39:53 @ v 4.0
 *
 * Package    : refer.cur.list
 */
 
var ProductListModel = (function(){
	ProductListModel.prototype.constructor.call(this);
	
    this.KEY_BEGIN              = new PRODUCT();
    this.KEY_NEXT               = new PRODUCT();
    this.LIST                   = new PRODUCT_LIST();
    
    this.getNewKeyBegin = function(){
        return new Product;
    };
    
    this.getNewList = function(){
        return null;
    };
});

ProductListModel.prototype 	= Object.create(ListModel.prototype);
ProductListModel.prototype.constructor = ListModel;