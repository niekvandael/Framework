/**
 * CREATED BY Niek Vandael ON 27 mai. 2015 14:26:00

 * Package    : js
 * Filename   : formatters.js
*/

var format = {};

/**
 * Automatically choose between number or textformatter
 */
format.defaultFormatter = function(item, row, cell) {
	if (isNaN(item)) {
		return format.textFormatter(item, row, cell);
	}

	return format.numberFormatter_2(item, row, cell);
};


/**
 * To format combo values
 */

format.comboFormatter = function(item, row, cell){
	try {
			return cell.getWidgetProps().store.get(item).name;
	} catch (e) {
		return item;
	}
};

/**
 * To format text
 */
format.textFormatter = function(item, row, cell) {
	if(row != undefined && cell != undefined){
		setEditableCellAttributes(item, row, cell);
		return "<div style='float:left;overflow:hidden;text-overflow: ellipsis;white-space:nowrap;width:inherit;min-width:100%;'>" + item + "</div>";	
	}
	
	return item;
};

/**
 * To format numbers
 */

format.numberFormatter_6 = function(item, row, cell){
	return format.numberFormatter(item, row, cell, 6);
};

format.numberFormatter_2 = function(item, row, cell){
	return format.numberFormatter(item, row, cell, 2);
};

format.numberFormatter_0 = function(item, row, cell){
	return format.numberFormatter(item, row, cell, 0);
};

format.numberFormatter = function(item, row, cell, places) {
	setEditableCellAttributes(item, row, cell);

	var color = "";
	if (item < 0) {
		color = "red";
	}
	if (cell._props.places != undefined) {
		places = cell._props.places;
	}
	require([ "dojo/number" ], function(number) {
		item = number
				.format(item, {
					places : places
				});
	});
	return "<div style='text-align:right;overflow:hidden;text-overflow: ellipsis;white-space: nowrap; width:inherit;min-width:100%; color:" + color + ";'>" + item + "</div>";
};

/**
 * To format month's from id to text (e.g. 1 to January)
 */
format.monthFormatter = function(item, row, cell) {
	setEditableCellAttributes(item, row, cell);

	for (var i = 0; i < COMBOBOX.getMonths().data.length; i++) {
		if (COMBOBOX.getMonths().data[i].id == item) {
			return COMBOBOX.getMonths().data[i].name;
		}
	};

	return item;
};

/**
 * To format without style. 
 * Function is necessary for default behaviour like editable grid settings
 */
format.noFormatter = function(item, row, cell) {
	setEditableCellAttributes(item, row, cell);
	return item;
};

/**
 * To format without style. 
 * Function is necessary for default behaviour like editable grid settings
 */
format.statusFormatter = function(item, row, cell) {
	switch (item) {
	case "A":
		return LANGUAGE.ACTIVE;
		break;
		
	case "O":
		return LANGUAGE.OBSOLETE;
		break;
	}
	
	return item;
};

format.dateTimeFormatter=function(item, row, cell){
	var result = item;
	
	// Invalid date (e.g. null)
	if(item == "Invalid Date"){
		return "";
	}
	
	// Date as date format: frontend formatting
	if(item instanceof Date){
		item = item.toISOString().split('T')[0];
	}
	
	// Date as string format: returned from server as yyyy-MM-dd
	try {
		var splitted = item.split("-");
		var year = splitted[0];
		var month = splitted[1];
		var day = splitted[2];
		
		if(splitted.length >= 4){
			var time = splitted[3];
			var timeSplitted = time.split(".");
			time = timeSplitted[0] + ":" +  timeSplitted[1] + ":" +  timeSplitted[2];
			
			result = day + " " + format.getMonthShort(parseInt(month)) + " " + year + "  " + time;
		} else {
			result = day + " " + format.getMonthShort(parseInt(month)) + " " + year;
		}
	
		if(row != null && cell != undefined){
			return format.textFormatter(result, row, cell);
		}
		
		return result;
	} catch (e) {
		return format.textFormatter(item, row, cell);
	}

	return (result, row, cell);
};

format.getMonth = function(monthIndex){
	var months = [LANGUAGE.JANUARY, LANGUAGE.FEBRUARY, LANGUAGE.MARCH,
			LANGUAGE.APRIL, LANGUAGE.MAY, LANGUAGE.JUNE, LANGUAGE.JULY,
			LANGUAGE.AUGUST, LANGUAGE.SEPTEMBER, LANGUAGE.OCTOBER,
			LANGUAGE.NOVEMBER, LANGUAGE.DECEMBER
	];
	
	return (months[monthIndex-1]);
};

format.getMonthShort = function(monthIndex){
	var months = [LANGUAGE.JANUARY, LANGUAGE.FEBRUARY, LANGUAGE.MARCH,
			LANGUAGE.APRIL, LANGUAGE.MAY, LANGUAGE.JUNE, LANGUAGE.JULY,
			LANGUAGE.AUGUST, LANGUAGE.SEPTEMBER, LANGUAGE.OCTOBER,
			LANGUAGE.NOVEMBER, LANGUAGE.DECEMBER
	];
	
	return ((months[monthIndex-1]).substring(0,3));
};

format.getCSVDelimiterValues = function(item, row, cell){
	var values = COMBOBOX.getCSVDelimiterValues();
	return values.get(item).name;
};


format.getAccepted_indValues = function(item, row, cell){
	var values = COMBOBOX.getAccepted_indValues();
	return values.get(item).name;
};


format.getAccnt_tpValues = function(item, row, cell){
	var values = COMBOBOX.getAccnt_tpValues();
	return values.get(item).name;
};


format.getActual_indValues = function(item, row, cell){
	var values = COMBOBOX.getActual_indValues();
	return values.get(item).name;
};


format.getAct_pass_indValues = function(item, row, cell){
	var values = COMBOBOX.getAct_pass_indValues();
	return values.get(item).name;
};


format.getAddition_qty_indValues = function(item, row, cell){
	var values = COMBOBOX.getAddition_qty_indValues();
	return values.get(item).name;
};


format.getAddress_tpValues = function(item, row, cell){
	var values = COMBOBOX.getAddress_tpValues();
	return values.get(item).name;
};


format.getAddress_typeValues = function(item, row, cell){
	var values = COMBOBOX.getAddress_typeValues();
	return values.get(item).name;
};


format.getAdd_substr_indValues = function(item, row, cell){
	var values = COMBOBOX.getAdd_substr_indValues();
	return values.get(item).name;
};


format.getAdvice_tpValues = function(item, row, cell){
	var values = COMBOBOX.getAdvice_tpValues();
	return values.get(item).name;
};


format.getAgent_doc_tpValues = function(item, row, cell){
	var values = COMBOBOX.getAgent_doc_tpValues();
	return values.get(item).name;
};


format.getAgent_doc_tp_sendValues = function(item, row, cell){
	var values = COMBOBOX.getAgent_doc_tp_sendValues();
	return values.get(item).name;
};


format.getAgent_indValues = function(item, row, cell){
	var values = COMBOBOX.getAgent_indValues();
	return values.get(item).name;
};


format.getAgreed_indValues = function(item, row, cell){
	var values = COMBOBOX.getAgreed_indValues();
	return values.get(item).name;
};


format.getAida_statusValues = function(item, row, cell){
	var values = COMBOBOX.getAida_statusValues();
	return values.get(item).name;
};


format.getAltertxt_cnf_indValues = function(item, row, cell){
	var values = COMBOBOX.getAltertxt_cnf_indValues();
	return values.get(item).name;
};


format.getAna_fees_tpValues = function(item, row, cell){
	var values = COMBOBOX.getAna_fees_tpValues();
	return values.get(item).name;
};


format.getAna_indValues = function(item, row, cell){
	var values = COMBOBOX.getAna_indValues();
	return values.get(item).name;
};


format.getAna_order_indValues = function(item, row, cell){
	var values = COMBOBOX.getAna_order_indValues();
	return values.get(item).name;
};


format.getAutom_wash_out_indValues = function(item, row, cell){
	var values = COMBOBOX.getAutom_wash_out_indValues();
	return values.get(item).name;
};


format.getBal_diff_indValues = function(item, row, cell){
	var values = COMBOBOX.getBal_diff_indValues();
	return values.get(item).name;
};


format.getBal_indValues = function(item, row, cell){
	var values = COMBOBOX.getBal_indValues();
	return values.get(item).name;
};


format.getBal_result_indValues = function(item, row, cell){
	var values = COMBOBOX.getBal_result_indValues();
	return values.get(item).name;
};


format.getBank_indValues = function(item, row, cell){
	var values = COMBOBOX.getBank_indValues();
	return values.get(item).name;
};


format.getBatch_fms_changbleValues = function(item, row, cell){
	var values = COMBOBOX.getBatch_fms_changbleValues();
	return values.get(item).name;
};


format.getBatch_fms_imm_procValues = function(item, row, cell){
	var values = COMBOBOX.getBatch_fms_imm_procValues();
	return values.get(item).name;
};


format.getBatch_fms_tp_indValues = function(item, row, cell){
	var values = COMBOBOX.getBatch_fms_tp_indValues();
	return values.get(item).name;
};


format.getBroker_indValues = function(item, row, cell){
	var values = COMBOBOX.getBroker_indValues();
	return values.get(item).name;
};


format.getBudget_tpValues = function(item, row, cell){
	var values = COMBOBOX.getBudget_tpValues();
	return values.get(item).name;
};


format.getBuyer_closed_indValues = function(item, row, cell){
	var values = COMBOBOX.getBuyer_closed_indValues();
	return values.get(item).name;
};


format.getBuyer_doc_tpValues = function(item, row, cell){
	var values = COMBOBOX.getBuyer_doc_tpValues();
	return values.get(item).name;
};


format.getBuyer_doc_tp_sendValues = function(item, row, cell){
	var values = COMBOBOX.getBuyer_doc_tp_sendValues();
	return values.get(item).name;
};


format.getBuyer_indValues = function(item, row, cell){
	var values = COMBOBOX.getBuyer_indValues();
	return values.get(item).name;
};


format.getBuy_back_indValues = function(item, row, cell){
	var values = COMBOBOX.getBuy_back_indValues();
	return values.get(item).name;
};


format.getBuy_sell_indValues = function(item, row, cell){
	var values = COMBOBOX.getBuy_sell_indValues();
	return values.get(item).name;
};


format.getCalc_method_wprValues = function(item, row, cell){
	var values = COMBOBOX.getCalc_method_wprValues();
	return values.get(item).name;
};


format.getCalc_period_cdValues = function(item, row, cell){
	var values = COMBOBOX.getCalc_period_cdValues();
	return values.get(item).name;
};


format.getCertificate_calc_indValues = function(item, row, cell){
	var values = COMBOBOX.getCertificate_calc_indValues();
	return values.get(item).name;
};


format.getCertificate_systemValues = function(item, row, cell){
	var values = COMBOBOX.getCertificate_systemValues();
	return values.get(item).name;
};


format.getChanged_indValues = function(item, row, cell){
	var values = COMBOBOX.getChanged_indValues();
	return values.get(item).name;
};


format.getChannel_usage_cdValues = function(item, row, cell){
	var values = COMBOBOX.getChannel_usage_cdValues();
	return values.get(item).name;
};


format.getChild_locs_includedValues = function(item, row, cell){
	var values = COMBOBOX.getChild_locs_includedValues();
	return values.get(item).name;
};


format.getCif_booked_indValues = function(item, row, cell){
	var values = COMBOBOX.getCif_booked_indValues();
	return values.get(item).name;
};


format.getCircle_statusValues = function(item, row, cell){
	var values = COMBOBOX.getCircle_statusValues();
	return values.get(item).name;
};


format.getClaim_statusValues = function(item, row, cell){
	var values = COMBOBOX.getClaim_statusValues();
	return values.get(item).name;
};


format.getClosed_indValues = function(item, row, cell){
	var values = COMBOBOX.getClosed_indValues();
	return values.get(item).name;
};


format.getCnversion_cost_indValues = function(item, row, cell){
	var values = COMBOBOX.getCnversion_cost_indValues();
	return values.get(item).name;
};


format.getComite_indValues = function(item, row, cell){
	var values = COMBOBOX.getComite_indValues();
	return values.get(item).name;
};


format.getCompleted_indValues = function(item, row, cell){
	var values = COMBOBOX.getCompleted_indValues();
	return values.get(item).name;
};


format.getComplete_indValues = function(item, row, cell){
	var values = COMBOBOX.getComplete_indValues();
	return values.get(item).name;
};


format.getConfirm_indValues = function(item, row, cell){
	var values = COMBOBOX.getConfirm_indValues();
	return values.get(item).name;
};


format.getConf_ctr_indValues = function(item, row, cell){
	var values = COMBOBOX.getConf_ctr_indValues();
	return values.get(item).name;
};


format.getConf_sent_indValues = function(item, row, cell){
	var values = COMBOBOX.getConf_sent_indValues();
	return values.get(item).name;
};


format.getConsumption_indValues = function(item, row, cell){
	var values = COMBOBOX.getConsumption_indValues();
	return values.get(item).name;
};


format.getContainer_loc_typeValues = function(item, row, cell){
	var values = COMBOBOX.getContainer_loc_typeValues();
	return values.get(item).name;
};


format.getCoop_indValues = function(item, row, cell){
	var values = COMBOBOX.getCoop_indValues();
	return values.get(item).name;
};


format.getCost_ctr_indValues = function(item, row, cell){
	var values = COMBOBOX.getCost_ctr_indValues();
	return values.get(item).name;
};


format.getCost_rte_tpValues = function(item, row, cell){
	var values = COMBOBOX.getCost_rte_tpValues();
	return values.get(item).name;
};


format.getCovering_indValues = function(item, row, cell){
	var values = COMBOBOX.getCovering_indValues();
	return values.get(item).name;
};


format.getCovering_tpValues = function(item, row, cell){
	var values = COMBOBOX.getCovering_tpValues();
	return values.get(item).name;
};


format.getCreate_remove_indValues = function(item, row, cell){
	var values = COMBOBOX.getCreate_remove_indValues();
	return values.get(item).name;
};


format.getCrop_year_indValues = function(item, row, cell){
	var values = COMBOBOX.getCrop_year_indValues();
	return values.get(item).name;
};


format.getCtr_tpValues = function(item, row, cell){
	var values = COMBOBOX.getCtr_tpValues();
	return values.get(item).name;
};


format.getCtr_tp_cur_reqValues = function(item, row, cell){
	var values = COMBOBOX.getCtr_tp_cur_reqValues();
	return values.get(item).name;
};


format.getCtr_tp_fxValues = function(item, row, cell){
	var values = COMBOBOX.getCtr_tp_fxValues();
	return values.get(item).name;
};


format.getCum_inv_indValues = function(item, row, cell){
	var values = COMBOBOX.getCum_inv_indValues();
	return values.get(item).name;
};


format.getCurrentYearPlusThreeValues = function(item, row, cell){
	var values = COMBOBOX.getCurrentYearPlusThreeValues();
	return values.get(item).name;
};


format.getCur_add_amnt_indValues = function(item, row, cell){
	var values = COMBOBOX.getCur_add_amnt_indValues();
	return values.get(item).name;
};


format.getCur_covered_indValues = function(item, row, cell){
	var values = COMBOBOX.getCur_covered_indValues();
	return values.get(item).name;
};


format.getCur_covering_indValues = function(item, row, cell){
	var values = COMBOBOX.getCur_covering_indValues();
	return values.get(item).name;
};


format.getCur_val_decl_indValues = function(item, row, cell){
	var values = COMBOBOX.getCur_val_decl_indValues();
	return values.get(item).name;
};


format.getDecimal_pointValues = function(item, row, cell){
	var values = COMBOBOX.getDecimal_pointValues();
	return values.get(item).name;
};


format.getDetail_sheet_indValues = function(item, row, cell){
	var values = COMBOBOX.getDetail_sheet_indValues();
	return values.get(item).name;
};


format.getDoccountryValues = function(item, row, cell){
	var values = COMBOBOX.getDoccountryValues();
	return values.get(item).name;
};


format.getDoclanguageValues = function(item, row, cell){
	var values = COMBOBOX.getDoclanguageValues();
	return values.get(item).name;
};


format.getDoc_statusValues = function(item, row, cell){
	var values = COMBOBOX.getDoc_statusValues();
	return values.get(item).name;
};


format.getDoc_tpValues = function(item, row, cell){
	var values = COMBOBOX.getDoc_tpValues();
	return values.get(item).name;
};


format.getD_c_indValues = function(item, row, cell){
	var values = COMBOBOX.getD_c_indValues();
	return values.get(item).name;
};


format.getEc_dlv_indValues = function(item, row, cell){
	var values = COMBOBOX.getEc_dlv_indValues();
	return values.get(item).name;
};


format.getEc_indValues = function(item, row, cell){
	var values = COMBOBOX.getEc_indValues();
	return values.get(item).name;
};


format.getElectr_invoic_indValues = function(item, row, cell){
	var values = COMBOBOX.getElectr_invoic_indValues();
	return values.get(item).name;
};


format.getEnclosed_prd_indValues = function(item, row, cell){
	var values = COMBOBOX.getEnclosed_prd_indValues();
	return values.get(item).name;
};


format.getEnd_date_requiredValues = function(item, row, cell){
	var values = COMBOBOX.getEnd_date_requiredValues();
	return values.get(item).name;
};


format.getEntity_typeValues = function(item, row, cell){
	var values = COMBOBOX.getEntity_typeValues();
	return values.get(item).name;
};


format.getEst_costng_sep_indValues = function(item, row, cell){
	var values = COMBOBOX.getEst_costng_sep_indValues();
	return values.get(item).name;
};


format.getException_tpValues = function(item, row, cell){
	var values = COMBOBOX.getException_tpValues();
	return values.get(item).name;
};


format.getExclude_ind1Values = function(item, row, cell){
	var values = COMBOBOX.getExclude_ind1Values();
	return values.get(item).name;
};


format.getExclude_indValues = function(item, row, cell){
	var values = COMBOBOX.getExclude_indValues();
	return values.get(item).name;
};


format.getExtensionpercValues = function(item, row, cell){
	var values = COMBOBOX.getExtensionpercValues();
	return values.get(item).name;
};


format.getExtension_ctr_indValues = function(item, row, cell){
	var values = COMBOBOX.getExtension_ctr_indValues();
	return values.get(item).name;
};


format.getExtension_indValues = function(item, row, cell){
	var values = COMBOBOX.getExtension_indValues();
	return values.get(item).name;
};


format.getExtraSelections = function(item, row, cell){
	var values = COMBOBOX.getExtraSelections();
	return values.get(item).name;
};


format.getExt_text_indValues = function(item, row, cell){
	var values = COMBOBOX.getExt_text_indValues();
	return values.get(item).name;
};


format.getEx_store_indValues = function(item, row, cell){
	var values = COMBOBOX.getEx_store_indValues();
	return values.get(item).name;
};


format.getFill_bcur_amnt_indValues = function(item, row, cell){
	var values = COMBOBOX.getFill_bcur_amnt_indValues();
	return values.get(item).name;
};


format.getFinal_indValues = function(item, row, cell){
	var values = COMBOBOX.getFinal_indValues();
	return values.get(item).name;
};


format.getFix_stateValues = function(item, row, cell){
	var values = COMBOBOX.getFix_stateValues();
	return values.get(item).name;
};


format.getFmh_tpValues = function(item, row, cell){
	var values = COMBOBOX.getFmh_tpValues();
	return values.get(item).name;
};


format.getFms_completed_indValues = function(item, row, cell){
	var values = COMBOBOX.getFms_completed_indValues();
	return values.get(item).name;
};


format.getFob_fob_indValues = function(item, row, cell){
	var values = COMBOBOX.getFob_fob_indValues();
	return values.get(item).name;
};


format.getForeign_dlv_indValues = function(item, row, cell){
	var values = COMBOBOX.getForeign_dlv_indValues();
	return values.get(item).name;
};


format.getForeign_indValues = function(item, row, cell){
	var values = COMBOBOX.getForeign_indValues();
	return values.get(item).name;
};


format.getFulflmnt_indValues = function(item, row, cell){
	var values = COMBOBOX.getFulflmnt_indValues();
	return values.get(item).name;
};


format.getFully_priced_indValues = function(item, row, cell){
	var values = COMBOBOX.getFully_priced_indValues();
	return values.get(item).name;
};


format.getFunc_indValues = function(item, row, cell){
	var values = COMBOBOX.getFunc_indValues();
	return values.get(item).name;
};


format.getFut_exc_physic_indValues = function(item, row, cell){
	var values = COMBOBOX.getFut_exc_physic_indValues();
	return values.get(item).name;
};


format.getGeneric_indValues = function(item, row, cell){
	var values = COMBOBOX.getGeneric_indValues();
	return values.get(item).name;
};


format.getGmp_indValues = function(item, row, cell){
	var values = COMBOBOX.getGmp_indValues();
	return values.get(item).name;
};


format.getGoods_indValues = function(item, row, cell){
	var values = COMBOBOX.getGoods_indValues();
	return values.get(item).name;
};


format.getHaulFix_doc_tpValues = function(item, row, cell){
	var values = COMBOBOX.getHaulFix_doc_tpValues();
	return values.get(item).name;
};


format.getHaulierStatusValues = function(item, row, cell){
	var values = COMBOBOX.getHaulierStatusValues();
	return values.get(item).name;
};


format.getHold_indValues = function(item, row, cell){
	var values = COMBOBOX.getHold_indValues();
	return values.get(item).name;
};


format.getIndiv_booking_indValues = function(item, row, cell){
	var values = COMBOBOX.getIndiv_booking_indValues();
	return values.get(item).name;
};


format.getInitiative_indValues = function(item, row, cell){
	var values = COMBOBOX.getInitiative_indValues();
	return values.get(item).name;
};


format.getInsurance_co_indValues = function(item, row, cell){
	var values = COMBOBOX.getInsurance_co_indValues();
	return values.get(item).name;
};


format.getIns_cert_indValues = function(item, row, cell){
	var values = COMBOBOX.getIns_cert_indValues();
	return values.get(item).name;
};


format.getInterval_typeValues = function(item, row, cell){
	var values = COMBOBOX.getInterval_typeValues();
	return values.get(item).name;
};


format.getInt_text_indValues = function(item, row, cell){
	var values = COMBOBOX.getInt_text_indValues();
	return values.get(item).name;
};


format.getInvoiceable_indValues = function(item, row, cell){
	var values = COMBOBOX.getInvoiceable_indValues();
	return values.get(item).name;
};


format.getInvoiced_ia_indValues = function(item, row, cell){
	var values = COMBOBOX.getInvoiced_ia_indValues();
	return values.get(item).name;
};


format.getInvoice_layoutValues = function(item, row, cell){
	var values = COMBOBOX.getInvoice_layoutValues();
	return values.get(item).name;
};


format.getInvoice_tpValues = function(item, row, cell){
	var values = COMBOBOX.getInvoice_tpValues();
	return values.get(item).name;
};


format.getInv_ia_paid_indValues = function(item, row, cell){
	var values = COMBOBOX.getInv_ia_paid_indValues();
	return values.get(item).name;
};


format.getInv_paid_indValues = function(item, row, cell){
	var values = COMBOBOX.getInv_paid_indValues();
	return values.get(item).name;
};


format.getLaboratory_indValues = function(item, row, cell){
	var values = COMBOBOX.getLaboratory_indValues();
	return values.get(item).name;
};


format.getLci_indValues = function(item, row, cell){
	var values = COMBOBOX.getLci_indValues();
	return values.get(item).name;
};


format.getLeading_agio_indValues = function(item, row, cell){
	var values = COMBOBOX.getLeading_agio_indValues();
	return values.get(item).name;
};


format.getLeading_calc_amnt_indValues = function(item, row, cell){
	var values = COMBOBOX.getLeading_calc_amnt_indValues();
	return values.get(item).name;
};


format.getLevy_indValues = function(item, row, cell){
	var values = COMBOBOX.getLevy_indValues();
	return values.get(item).name;
};


format.getLiability_indValues = function(item, row, cell){
	var values = COMBOBOX.getLiability_indValues();
	return values.get(item).name;
};


format.getLiability_tpValues = function(item, row, cell){
	var values = COMBOBOX.getLiability_tpValues();
	return values.get(item).name;
};


format.getLibrararyQueries = function(item, row, cell){
	var values = COMBOBOX.getLibrararyQueries();
	return values.get(item).name;
};


format.getLimit_exceed_indValues = function(item, row, cell){
	var values = COMBOBOX.getLimit_exceed_indValues();
	return values.get(item).name;
};


format.getLinked_indValues = function(item, row, cell){
	var values = COMBOBOX.getLinked_indValues();
	return values.get(item).name;
};


format.getLoading_doc_tpValues = function(item, row, cell){
	var values = COMBOBOX.getLoading_doc_tpValues();
	return values.get(item).name;
};


format.getLoading_doc_tp_sendValues = function(item, row, cell){
	var values = COMBOBOX.getLoading_doc_tp_sendValues();
	return values.get(item).name;
};


format.getLoc_typeValues = function(item, row, cell){
	var values = COMBOBOX.getLoc_typeValues();
	return values.get(item).name;
};


format.getLog_typeValues = function(item, row, cell){
	var values = COMBOBOX.getLog_typeValues();
	return values.get(item).name;
};


format.getMailingtp_invoiceValues = function(item, row, cell){
	var values = COMBOBOX.getMailingtp_invoiceValues();
	return values.get(item).name;
};


format.getMailing_tpValues = function(item, row, cell){
	var values = COMBOBOX.getMailing_tpValues();
	return values.get(item).name;
};


format.getMailing_tp_apprValues = function(item, row, cell){
	var values = COMBOBOX.getMailing_tp_apprValues();
	return values.get(item).name;
};


format.getMailing_tp_broValues = function(item, row, cell){
	var values = COMBOBOX.getMailing_tp_broValues();
	return values.get(item).name;
};


format.getMailing_tp_bsValues = function(item, row, cell){
	var values = COMBOBOX.getMailing_tp_bsValues();
	return values.get(item).name;
};


format.getMailing_tp_chValues = function(item, row, cell){
	var values = COMBOBOX.getMailing_tp_chValues();
	return values.get(item).name;
};


format.getMailing_tp_cnf_indValues = function(item, row, cell){
	var values = COMBOBOX.getMailing_tp_cnf_indValues();
	return values.get(item).name;
};


format.getMailing_tp_shValues = function(item, row, cell){
	var values = COMBOBOX.getMailing_tp_shValues();
	return values.get(item).name;
};


format.getMailing_tp_strValues = function(item, row, cell){
	var values = COMBOBOX.getMailing_tp_strValues();
	return values.get(item).name;
};


format.getMailing_tp_suValues = function(item, row, cell){
	var values = COMBOBOX.getMailing_tp_suValues();
	return values.get(item).name;
};


format.getMarket_tpValues = function(item, row, cell){
	var values = COMBOBOX.getMarket_tpValues();
	return values.get(item).name;
};


format.getMethod_of_paymValues = function(item, row, cell){
	var values = COMBOBOX.getMethod_of_paymValues();
	return values.get(item).name;
};


format.getMoment_of_dlv_indValues = function(item, row, cell){
	var values = COMBOBOX.getMoment_of_dlv_indValues();
	return values.get(item).name;
};


format.getMths_detail_indValues = function(item, row, cell){
	var values = COMBOBOX.getMths_detail_indValues();
	return values.get(item).name;
};


format.getMutation_tpValues = function(item, row, cell){
	var values = COMBOBOX.getMutation_tpValues();
	return values.get(item).name;
};


format.getNom_appr_indValues = function(item, row, cell){
	var values = COMBOBOX.getNom_appr_indValues();
	return values.get(item).name;
};


format.getNongmp_indValues = function(item, row, cell){
	var values = COMBOBOX.getNongmp_indValues();
	return values.get(item).name;
};


format.getNongmp_message_indValues = function(item, row, cell){
	var values = COMBOBOX.getNongmp_message_indValues();
	return values.get(item).name;
};


format.getOnRequest_indValues = function(item, row, cell){
	var values = COMBOBOX.getOnRequest_indValues();
	return values.get(item).name;
};


format.getOpen_indValues = function(item, row, cell){
	var values = COMBOBOX.getOpen_indValues();
	return values.get(item).name;
};


format.getOperating_statusValues = function(item, row, cell){
	var values = COMBOBOX.getOperating_statusValues();
	return values.get(item).name;
};


format.getOperation_tpValues = function(item, row, cell){
	var values = COMBOBOX.getOperation_tpValues();
	return values.get(item).name;
};


format.getOrder_indValues = function(item, row, cell){
	var values = COMBOBOX.getOrder_indValues();
	return values.get(item).name;
};


format.getOrder_tpValues = function(item, row, cell){
	var values = COMBOBOX.getOrder_tpValues();
	return values.get(item).name;
};


format.getOriginal_indValues = function(item, row, cell){
	var values = COMBOBOX.getOriginal_indValues();
	return values.get(item).name;
};


format.getOriginate_indValues = function(item, row, cell){
	var values = COMBOBOX.getOriginate_indValues();
	return values.get(item).name;
};


format.getOrigin_dest_indValues = function(item, row, cell){
	var values = COMBOBOX.getOrigin_dest_indValues();
	return values.get(item).name;
};


format.getOrigin_in_docs_indValues = function(item, row, cell){
	var values = COMBOBOX.getOrigin_in_docs_indValues();
	return values.get(item).name;
};


format.getOwn_vat_indValues = function(item, row, cell){
	var values = COMBOBOX.getOwn_vat_indValues();
	return values.get(item).name;
};


format.getParc_text_indValues = function(item, row, cell){
	var values = COMBOBOX.getParc_text_indValues();
	return values.get(item).name;
};


format.getParc_tpValues = function(item, row, cell){
	var values = COMBOBOX.getParc_tpValues();
	return values.get(item).name;
};


format.getParticipant_indValues = function(item, row, cell){
	var values = COMBOBOX.getParticipant_indValues();
	return values.get(item).name;
};


format.getPayment_indValues = function(item, row, cell){
	var values = COMBOBOX.getPayment_indValues();
	return values.get(item).name;
};


format.getPaymts_lead_indValues = function(item, row, cell){
	var values = COMBOBOX.getPaymts_lead_indValues();
	return values.get(item).name;
};


format.getPeriod_idValues = function(item, row, cell){
	var values = COMBOBOX.getPeriod_idValues();
	return values.get(item).name;
};


format.getPeriod_tp_indValues = function(item, row, cell){
	var values = COMBOBOX.getPeriod_tp_indValues();
	return values.get(item).name;
};


format.getPeriod_tp_ind_dslValues = function(item, row, cell){
	var values = COMBOBOX.getPeriod_tp_ind_dslValues();
	return values.get(item).name;
};


format.getPlanning_tpValues = function(item, row, cell){
	var values = COMBOBOX.getPlanning_tpValues();
	return values.get(item).name;
};


format.getPort_pre_adv_indValues = function(item, row, cell){
	var values = COMBOBOX.getPort_pre_adv_indValues();
	return values.get(item).name;
};


format.getPos_lia_indValues = function(item, row, cell){
	var values = COMBOBOX.getPos_lia_indValues();
	return values.get(item).name;
};


format.getPos_tpValues = function(item, row, cell){
	var values = COMBOBOX.getPos_tpValues();
	return values.get(item).name;
};


format.getPos_tp_fromValues = function(item, row, cell){
	var values = COMBOBOX.getPos_tp_fromValues();
	return values.get(item).name;
};


format.getPos_tp_toValues = function(item, row, cell){
	var values = COMBOBOX.getPos_tp_toValues();
	return values.get(item).name;
};


format.getPpa_tpValues = function(item, row, cell){
	var values = COMBOBOX.getPpa_tpValues();
	return values.get(item).name;
};


format.getPre_a_nom_appr_indValues = function(item, row, cell){
	var values = COMBOBOX.getPre_a_nom_appr_indValues();
	return values.get(item).name;
};


format.getPriced_unpricd_indValues = function(item, row, cell){
	var values = COMBOBOX.getPriced_unpricd_indValues();
	return values.get(item).name;
};


format.getPric_constructionValues = function(item, row, cell){
	var values = COMBOBOX.getPric_constructionValues();
	return values.get(item).name;
};


format.getPric_premctr_indValues = function(item, row, cell){
	var values = COMBOBOX.getPric_premctr_indValues();
	return values.get(item).name;
};


format.getPric_tpValues = function(item, row, cell){
	var values = COMBOBOX.getPric_tpValues();
	return values.get(item).name;
};


format.getPric_tp_indValues = function(item, row, cell){
	var values = COMBOBOX.getPric_tp_indValues();
	return values.get(item).name;
};


format.getPrintloc_zipcdValues = function(item, row, cell){
	var values = COMBOBOX.getPrintloc_zipcdValues();
	return values.get(item).name;
};


format.getPrint_on_appValues = function(item, row, cell){
	var values = COMBOBOX.getPrint_on_appValues();
	return values.get(item).name;
};


format.getPrint_on_ctrValues = function(item, row, cell){
	var values = COMBOBOX.getPrint_on_ctrValues();
	return values.get(item).name;
};


format.getPrint_on_invValues = function(item, row, cell){
	var values = COMBOBOX.getPrint_on_invValues();
	return values.get(item).name;
};


format.getPriority_indValues = function(item, row, cell){
	var values = COMBOBOX.getPriority_indValues();
	return values.get(item).name;
};


format.getProces_crd_inv_indValues = function(item, row, cell){
	var values = COMBOBOX.getProces_crd_inv_indValues();
	return values.get(item).name;
};


format.getProces_deb_inv_indValues = function(item, row, cell){
	var values = COMBOBOX.getProces_deb_inv_indValues();
	return values.get(item).name;
};


format.getProduct_development_indValues = function(item, row, cell){
	var values = COMBOBOX.getProduct_development_indValues();
	return values.get(item).name;
};


format.getProduct_on_storeValues = function(item, row, cell){
	var values = COMBOBOX.getProduct_on_storeValues();
	return values.get(item).name;
};


format.getProd_fam_bound_indValues = function(item, row, cell){
	var values = COMBOBOX.getProd_fam_bound_indValues();
	return values.get(item).name;
};


format.getProrata_settlm_indValues = function(item, row, cell){
	var values = COMBOBOX.getProrata_settlm_indValues();
	return values.get(item).name;
};


format.getPuchase_sale_both_indValues = function(item, row, cell){
	var values = COMBOBOX.getPuchase_sale_both_indValues();
	return values.get(item).name;
};


format.getPuchase_sale_indValues = function(item, row, cell){
	var values = COMBOBOX.getPuchase_sale_indValues();
	return values.get(item).name;
};


format.getLimit_type_indValues = function(item, row, cell){
	var values = COMBOBOX.getLimit_type_indValues();
	return values.get(item).name;
};


format.getPur_avail_indValues = function(item, row, cell){
	var values = COMBOBOX.getPur_avail_indValues();
	return values.get(item).name;
};


format.getPur_sal_indValues = function(item, row, cell){
	var values = COMBOBOX.getPur_sal_indValues();
	return values.get(item).name;
};


format.getPur_sal_ind_dslValues = function(item, row, cell){
	var values = COMBOBOX.getPur_sal_ind_dslValues();
	return values.get(item).name;
};


format.getP_bro_rel_indValues = function(item, row, cell){
	var values = COMBOBOX.getP_bro_rel_indValues();
	return values.get(item).name;
};


format.getP_CH18_OutputValues = function(item, row, cell){
	var values = COMBOBOX.getP_CH18_OutputValues();
	return values.get(item).name;
};


format.getP_CH94_CondenseValues = function(item, row, cell){
	var values = COMBOBOX.getP_CH94_CondenseValues();
	return values.get(item).name;
};


format.getP_CH94_Groupby1Values = function(item, row, cell){
	var values = COMBOBOX.getP_CH94_Groupby1Values();
	return values.get(item).name;
};


format.getP_CH94_OutputValues = function(item, row, cell){
	var values = COMBOBOX.getP_CH94_OutputValues();
	return values.get(item).name;
};


format.getP_CH94_PrintfuturesValues = function(item, row, cell){
	var values = COMBOBOX.getP_CH94_PrintfuturesValues();
	return values.get(item).name;
};


format.getP_CH94_Reporttype1Values = function(item, row, cell){
	var values = COMBOBOX.getP_CH94_Reporttype1Values();
	return values.get(item).name;
};


format.getP_CH94_Reporttype2Values = function(item, row, cell){
	var values = COMBOBOX.getP_CH94_Reporttype2Values();
	return values.get(item).name;
};


format.getP_CH94_Reporttype3Values = function(item, row, cell){
	var values = COMBOBOX.getP_CH94_Reporttype3Values();
	return values.get(item).name;
};


format.getP_CH94_Reporttype4Values = function(item, row, cell){
	var values = COMBOBOX.getP_CH94_Reporttype4Values();
	return values.get(item).name;
};


format.getP_CH94_SortbyValues = function(item, row, cell){
	var values = COMBOBOX.getP_CH94_SortbyValues();
	return values.get(item).name;
};


format.getP_CHAR_1Values = function(item, row, cell){
	var values = COMBOBOX.getP_CHAR_1Values();
	return values.get(item).name;
};


format.getP_Ctr_finalisedValues = function(item, row, cell){
	var values = COMBOBOX.getP_Ctr_finalisedValues();
	return values.get(item).name;
};


format.getP_Fullflmnt_indValues = function(item, row, cell){
	var values = COMBOBOX.getP_Fullflmnt_indValues();
	return values.get(item).name;
};


format.getP_OrderStatusValues = function(item, row, cell){
	var values = COMBOBOX.getP_OrderStatusValues();
	return values.get(item).name;
};


format.getP_YES_NOValues = function(item, row, cell){
	var values = COMBOBOX.getP_YES_NOValues();
	return values.get(item).name;
};


format.getQualitytrms_prtValues = function(item, row, cell){
	var values = COMBOBOX.getQualitytrms_prtValues();
	return values.get(item).name;
};


format.getQualitytrms_tpValues = function(item, row, cell){
	var values = COMBOBOX.getQualitytrms_tpValues();
	return values.get(item).name;
};


format.getReasonValues = function(item, row, cell){
	var values = COMBOBOX.getReasonValues();
	return values.get(item).name;
};


format.getReconcil_check_indValues = function(item, row, cell){
	var values = COMBOBOX.getReconcil_check_indValues();
	return values.get(item).name;
};


format.getRegion_linked_indValues = function(item, row, cell){
	var values = COMBOBOX.getRegion_linked_indValues();
	return values.get(item).name;
};


format.getRegistr_statusValues = function(item, row, cell){
	var values = COMBOBOX.getRegistr_statusValues();
	return values.get(item).name;
};


format.getRelation_typeValues = function(item, row, cell){
	var values = COMBOBOX.getRelation_typeValues();
	return values.get(item).name;
};


format.getReloading_indValues = function(item, row, cell){
	var values = COMBOBOX.getReloading_indValues();
	return values.get(item).name;
};


format.getRemarks_indValues = function(item, row, cell){
	var values = COMBOBOX.getRemarks_indValues();
	return values.get(item).name;
};


format.getReprint_indValues = function(item, row, cell){
	var values = COMBOBOX.getReprint_indValues();
	return values.get(item).name;
};


format.getReqstateValues = function(item, row, cell){
	var values = COMBOBOX.getReqstateValues();
	return values.get(item).name;
};


format.getRest_indValues = function(item, row, cell){
	var values = COMBOBOX.getRest_indValues();
	return values.get(item).name;
};


format.getResult_tpValues = function(item, row, cell){
	var values = COMBOBOX.getResult_tpValues();
	return values.get(item).name;
};


format.getReverse_indValues = function(item, row, cell){
	var values = COMBOBOX.getReverse_indValues();
	return values.get(item).name;
};


format.getReverse_rte_indValues = function(item, row, cell){
	var values = COMBOBOX.getReverse_rte_indValues();
	return values.get(item).name;
};


format.getRgt_lia_indValues = function(item, row, cell){
	var values = COMBOBOX.getRgt_lia_indValues();
	return values.get(item).name;
};


format.getRight_indValues = function(item, row, cell){
	var values = COMBOBOX.getRight_indValues();
	return values.get(item).name;
};


format.getRouting_cdValues = function(item, row, cell){
	var values = COMBOBOX.getRouting_cdValues();
	return values.get(item).name;
};


format.getRunning_accntValues = function(item, row, cell){
	var values = COMBOBOX.getRunning_accntValues();
	return values.get(item).name;
};


format.getRun_indValues = function(item, row, cell){
	var values = COMBOBOX.getRun_indValues();
	return values.get(item).name;
};


format.getSample_tpValues = function(item, row, cell){
	var values = COMBOBOX.getSample_tpValues();
	return values.get(item).name;
};


format.getSealing_tp_ctrValues = function(item, row, cell){
	var values = COMBOBOX.getSealing_tp_ctrValues();
	return values.get(item).name;
};


format.getSeal_tpValues = function(item, row, cell){
	var values = COMBOBOX.getSeal_tpValues();
	return values.get(item).name;
};


format.getSearch_locValues = function(item, row, cell){
	var values = COMBOBOX.getSearch_locValues();
	return values.get(item).name;
};


format.getSearch_pdvValues = function(item, row, cell){
	var values = COMBOBOX.getSearch_pdvValues();
	return values.get(item).name;
};


format.getSeller_closed_indValues = function(item, row, cell){
	var values = COMBOBOX.getSeller_closed_indValues();
	return values.get(item).name;
};


format.getSeller_doc_tpValues = function(item, row, cell){
	var values = COMBOBOX.getSeller_doc_tpValues();
	return values.get(item).name;
};


format.getSeller_doc_tp_sendValues = function(item, row, cell){
	var values = COMBOBOX.getSeller_doc_tp_sendValues();
	return values.get(item).name;
};


format.getSell_buy_choic_indValues = function(item, row, cell){
	var values = COMBOBOX.getSell_buy_choic_indValues();
	return values.get(item).name;
};


format.getSend_toValues = function(item, row, cell){
	var values = COMBOBOX.getSend_toValues();
	return values.get(item).name;
};


format.getSent_messageValues = function(item, row, cell){
	var values = COMBOBOX.getSent_messageValues();
	return values.get(item).name;
};


format.getSettlm_reservationValues = function(item, row, cell){
	var values = COMBOBOX.getSettlm_reservationValues();
	return values.get(item).name;
};


format.getShipowner_indValues = function(item, row, cell){
	var values = COMBOBOX.getShipowner_indValues();
	return values.get(item).name;
};


format.getShipping_spec_indValues = function(item, row, cell){
	var values = COMBOBOX.getShipping_spec_indValues();
	return values.get(item).name;
};


format.getShow_areaValues = function(item, row, cell){
	var values = COMBOBOX.getShow_areaValues();
	return values.get(item).name;
};


format.getShow_locValues = function(item, row, cell){
	var values = COMBOBOX.getShow_locValues();
	return values.get(item).name;
};


format.getShow_monthValues = function(item, row, cell){
	var values = COMBOBOX.getShow_monthValues();
	return values.get(item).name;
};


format.getShow_periodValues = function(item, row, cell){
	var values = COMBOBOX.getShow_periodValues();
	return values.get(item).name;
};


format.getShow_prod_famValues = function(item, row, cell){
	var values = COMBOBOX.getShow_prod_famValues();
	return values.get(item).name;
};


format.getShow_prod_stypValues = function(item, row, cell){
	var values = COMBOBOX.getShow_prod_stypValues();
	return values.get(item).name;
};


format.getShow_prod_typeValues = function(item, row, cell){
	var values = COMBOBOX.getShow_prod_typeValues();
	return values.get(item).name;
};


format.getShow_relValues = function(item, row, cell){
	var values = COMBOBOX.getShow_relValues();
	return values.get(item).name;
};


format.getShow_storageValues = function(item, row, cell){
	var values = COMBOBOX.getShow_storageValues();
	return values.get(item).name;
};


format.getShow_user_idValues = function(item, row, cell){
	var values = COMBOBOX.getShow_user_idValues();
	return values.get(item).name;
};


format.getSpec_barges_indValues = function(item, row, cell){
	var values = COMBOBOX.getSpec_barges_indValues();
	return values.get(item).name;
};


format.getSpec_groupValues = function(item, row, cell){
	var values = COMBOBOX.getSpec_groupValues();
	return values.get(item).name;
};


format.getSpec_push_barg_indValues = function(item, row, cell){
	var values = COMBOBOX.getSpec_push_barg_indValues();
	return values.get(item).name;
};


format.getSpec_stores_indValues = function(item, row, cell){
	var values = COMBOBOX.getSpec_stores_indValues();
	return values.get(item).name;
};


format.getSpec_trains_indValues = function(item, row, cell){
	var values = COMBOBOX.getSpec_trains_indValues();
	return values.get(item).name;
};


format.getSpec_trucks_indValues = function(item, row, cell){
	var values = COMBOBOX.getSpec_trucks_indValues();
	return values.get(item).name;
};


format.getSpec_vessels_indValues = function(item, row, cell){
	var values = COMBOBOX.getSpec_vessels_indValues();
	return values.get(item).name;
};


format.getSrc_tp_fin_mutValues = function(item, row, cell){
	var values = COMBOBOX.getSrc_tp_fin_mutValues();
	return values.get(item).name;
};


format.getStandard_indValues = function(item, row, cell){
	var values = COMBOBOX.getStandard_indValues();
	return values.get(item).name;
};


format.getStandard_saltm_indValues = function(item, row, cell){
	var values = COMBOBOX.getStandard_saltm_indValues();
	return values.get(item).name;
};


format.getStatusProvisionalIndValues = function(item, row, cell){
	var values = COMBOBOX.getStatusProvisionalIndValues();
	return values.get(item).name;
};


format.getStatusValues = function(item, row, cell){
	var values = COMBOBOX.getStatusValues();
	return values.get(item).name;
};


format.getStorage_tpValues = function(item, row, cell){
	var values = COMBOBOX.getStorage_tpValues();
	return values.get(item).name;
};


format.getStrtdt_paym_per_tpValues = function(item, row, cell){
	var values = COMBOBOX.getStrtdt_paym_per_tpValues();
	return values.get(item).name;
};


format.getSubbook_indValues = function(item, row, cell){
	var values = COMBOBOX.getSubbook_indValues();
	return values.get(item).name;
};


format.getSundries_indValues = function(item, row, cell){
	var values = COMBOBOX.getSundries_indValues();
	return values.get(item).name;
};


format.getSupplier_indValues = function(item, row, cell){
	var values = COMBOBOX.getSupplier_indValues();
	return values.get(item).name;
};


format.getSup_int_appr_indValues = function(item, row, cell){
	var values = COMBOBOX.getSup_int_appr_indValues();
	return values.get(item).name;
};


format.getSup_int_indValues = function(item, row, cell){
	var values = COMBOBOX.getSup_int_indValues();
	return values.get(item).name;
};


format.getSustainable_indValues = function(item, row, cell){
	var values = COMBOBOX.getSustainable_indValues();
	return values.get(item).name;
};


format.getTargetchannelValues = function(item, row, cell){
	var values = COMBOBOX.getTargetchannelValues();
	return values.get(item).name;
};


format.getTerms_indValues = function(item, row, cell){
	var values = COMBOBOX.getTerms_indValues();
	return values.get(item).name;
};


format.getTerms_tp_indValues = function(item, row, cell){
	var values = COMBOBOX.getTerms_tp_indValues();
	return values.get(item).name;
};


format.getText_typeValues = function(item, row, cell){
	var values = COMBOBOX.getText_typeValues();
	return values.get(item).name;
};


format.getTiming_indValues = function(item, row, cell){
	var values = COMBOBOX.getTiming_indValues();
	return values.get(item).name;
};


format.getToleranceValues = function(item, row, cell){
	var values = COMBOBOX.getToleranceValues();
	return values.get(item).name;
};


format.getTotal_tpValues = function(item, row, cell){
	var values = COMBOBOX.getTotal_tpValues();
	return values.get(item).name;
};


format.getTo_be_cnf_indValues = function(item, row, cell){
	var values = COMBOBOX.getTo_be_cnf_indValues();
	return values.get(item).name;
};


format.getTrader_statusValues = function(item, row, cell){
	var values = COMBOBOX.getTrader_statusValues();
	return values.get(item).name;
};


format.getTransp_doc_tpValues = function(item, row, cell){
	var values = COMBOBOX.getTransp_doc_tpValues();
	return values.get(item).name;
};


format.getTransp_doc_tp_sendValues = function(item, row, cell){
	var values = COMBOBOX.getTransp_doc_tp_sendValues();
	return values.get(item).name;
};


format.getTransshipment_indValues = function(item, row, cell){
	var values = COMBOBOX.getTransshipment_indValues();
	return values.get(item).name;
};


format.getTranssh_mom_indValues = function(item, row, cell){
	var values = COMBOBOX.getTranssh_mom_indValues();
	return values.get(item).name;
};


format.getTurnover_cum_tpValues = function(item, row, cell){
	var values = COMBOBOX.getTurnover_cum_tpValues();
	return values.get(item).name;
};


format.getTypeValues = function(item, row, cell){
	var values = COMBOBOX.getTypeValues();
	return values.get(item).name;
};


format.getType_addr_officeValues = function(item, row, cell){
	var values = COMBOBOX.getType_addr_officeValues();
	return values.get(item).name;
};


format.getType_addr_po_boxValues = function(item, row, cell){
	var values = COMBOBOX.getType_addr_po_boxValues();
	return values.get(item).name;
};


format.getUpd_econ_pos_indValues = function(item, row, cell){
	var values = COMBOBOX.getUpd_econ_pos_indValues();
	return values.get(item).name;
};


format.getUser_check_indValues = function(item, row, cell){
	var values = COMBOBOX.getUser_check_indValues();
	return values.get(item).name;
};


format.getVat_calc_indValues = function(item, row, cell){
	var values = COMBOBOX.getVat_calc_indValues();
	return values.get(item).name;
};


format.getVat_cdValues = function(item, row, cell){
	var values = COMBOBOX.getVat_cdValues();
	return values.get(item).name;
};


format.getVat_tpValues = function(item, row, cell){
	var values = COMBOBOX.getVat_tpValues();
	return values.get(item).name;
};


format.getWbt_stateValues = function(item, row, cell){
	var values = COMBOBOX.getWbt_stateValues();
	return values.get(item).name;
};


format.getWeightcl_dlv_indValues = function(item, row, cell){
	var values = COMBOBOX.getWeightcl_dlv_indValues();
	return values.get(item).name;
};


format.getXcs_indValues = function(item, row, cell){
	var values = COMBOBOX.getXcs_indValues();
	return values.get(item).name;
};


format.getYesNoBlancValues = function(item, row, cell){
	var values = COMBOBOX.getYesNoBlancValues();
	return values.get(item).name;
};


format.getZipcd_required_indValues = function(item, row, cell){
	var values = COMBOBOX.getZipcd_required_indValues();
	return values.get(item).name;
};


format.getYears = function(item, row, cell){
	var values = COMBOBOX.getYears();
	return values.get(item).name;
};


format.getCurrentYearAnd2 = function(item, row, cell){
	var values = COMBOBOX.getCurrentYearAnd2();
	return values.get(item).name;
};


format.getMonths = function(item, row, cell){
	var values = COMBOBOX.getMonths();
	return values.get(item).name;
};


format.getSpotMonths = function(item, row, cell){
	var values = COMBOBOX.getSpotMonths();
	return values.get(item).name;
};

format.getYesNoImage = function(item, row, cell){
	if(item == "Y"){
		return LANGUAGE.YES_ICON; 
	}
	
	if(item == "N"){
		return LANGUAGE.NO_ICON; 
	}
};

format.yesno = function(item, row, cell){
	var value = false;
	if(item == "Y"){
		value = " checked ";
	}
	return "<input type='checkbox'"+value+" readonly disabled/>";
};

format.swyxClickToDial = function(item, row, cell){
	return "<a onclick='window.doNotShowConfirmation = true;' href='swyx:// " + item.replace(/ /g, "") + "'>" + item + "</a>";
};

format.widgetFormatter = function(uniqueId, rowIdx, cell){
	if (cell.widgetProps && cell.widgetProps.type){
		cell.widgetProps.props.row = this.grid.getItem(rowIdx);
		switch (cell.widgetProps.type){
			case 'button': 
				var button = new custom.Button(cell.widgetProps.props);
				button._destroyOnRemove = true;
				return button;
				break;
			
			case 'numeric': 
				var numberTextBox = new custom.NumberTextBox(cell.widgetProps.props);
				numberTextBox._destroyOnRemove = true;
				return numberTextBox;
				break;
		}
	}
	console.warn('To use your custom properties you have to define a JSON string in your column properties.\
			The property name has to be "widgetProps" and\
			the cellType has to be "dojox.grid.cells._Widget\n\n\
			\
			Example: <th field="invoiceno" width="12%"\n\
			cellType="dojox.grid.cells._Widget"\n\
				widgetProps="{type:\'button\',props:{parentId:\'${id}\',attachScope:this,onClick:\'doGuy\',title:\'download\',buttonId:\'guy\'}}"\n\
				formatter="widgetFormatter"\n\
			>${i18n.DOWNLOAD}</th>"');
};