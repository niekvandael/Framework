var ORDER = (function(){
	this.ORDERNUMBER      	= 0;
	this.ORDERDATE       	= '2000-01-01';
	this.REQUIREDDATE    	= '2000-01-01';
	this.SHIPPEDDATE     	= '2000-01-01';
	this.STATUS        		= "";
	this.COMMENTS      		= "";
	this.CUSTOMERNUMBER   	= 0;
	
	this.CUSTOMERNAME = "";
});

var ORDER_LIST = (function(){
	this.control_rows_to_fetch_number = 0;
	this.control_returned_length = 0;
	this.detail_data = [];
});