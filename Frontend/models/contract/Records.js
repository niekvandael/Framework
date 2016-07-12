
var CONTRACT_KEY_BEGIN = (function(){
	this.rel_id = "";
	this.ctr_dte_from = '1900-01-01';
	this.ctr_dte_to = '1900-01-01';
	this.pos_dte_from = '1900-01-01';
	this.pos_dte_to  = "";
	this.prod_fam_id  = "";
	this.prod_type_id = "";
	this.prod_styp_id = "";
	this.loc_id = "";
	this.pur_sal_ind = "";
});

var CONTRACT_LIST = (function(){
	this.control_rows_to_fetch_number = 0;
	this.control_returned_length = 0;
	this.detail_action_code = "";
	this.detail_data = [];
});

var CONTRACT_DETAIL_DATA = (function(){
	this.name  = "";
	this.rel_id = ""; 
	this.prod_fam_id = "";  
	this.prod_type_id = ""; 
	this.prod_styp_id = "";
	this.origin = "";
	this.terms_of_del = "";
	this.loc_id = "";  
	this.place = "";  
	this.trader = "";  
	this.ps = "";  
	this.poskey = "";  
	this.posk = ""; 
	this.ctr_dte = "";  
	this.period_startdte = "";  
	this.per_enddte = "";  
	this.ctr_no = "";  
	this.subctr_no = "";  
	this.ctr_no_supl_cust = ""; 
	this.cur_cd = "";  
	this.ctr_pric_mt = "";  
	this.ctr_qty = "";
	this.parc_tp = "";
	this.parc_no = "";  
	this.delivered = "";  
	this.totfixrel = "";  
	this.fixed = "";  
	this.released_qty = "";  
	this.balance = "";  
	this.sl = "";  
	this.pur_sal_ind = ""; 
	this.folder_document = "";  
	this.contract = ""; 
	this.total = "";
	this.filehash  = "";
});