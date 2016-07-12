define([
         "dojo/_base/declare", 
         "dijit/form/RadioButton",
         "dijit/_WidgetBase",
         "dijit/_TemplatedMixin",
         "dijit/_WidgetsInTemplateMixin",
         "dojo/text!js/../custom/templates/RadioButtonGroup.html",
         "dijit/registry",
         "dojo/dom-construct"
     ], function(declare, RadioButton, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, template, registry, domConstruct){
         declare("custom.RadioButtonGroup", [_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
        	 	templateString : template,
   					widgetsInTemplate : true,
   					i18n: LANGUAGE,
   					baseClass: "",
   					value: null,
   					
   					startup: function(){
   						this.inherited(arguments);
   						
   						// check if this.radiobuttons is defined
   						if (typeof this.radioButtons === "undefined"){return;}
   						
							for (var prop in this.radioButtons){
								var row = this.radioButtons[prop];
								if (row === null){return;}
								if (row.newLine){
									domConstruct.place(domConstruct.toDom('<br />'), this.id);
								};
								new RadioButton({
										value:row.value,
										onClick:this.handleClick,
										id:this.id+"_radioButton_val_"+row.value,
										name:"groupName_"+this.parentId+"_"+this.id,
										parentGroup:this.id
									}).placeAt(this.id);
								var label = domConstruct.toDom('<label for="'+this.id+'_radioButton_val_'+row.value+'"' + 'class="radioButtonSpacer"' + '>'+row.label+'</label>');
								domConstruct.place(label, this.id);
							}
   					},
   					
   					handleClick: function(){
   						registry.byId(this.parentGroup).set('value', this.get('value'));
   					},
   					
						set: function(attr, val) {
							if(attr == "disabled"){
								for (var prop in this.radioButtons){
									registry.byId(this.id + "_radioButton_val_"+ this.radioButtons[prop].value).set('disabled', val);
								}
							}
							if(attr == "value"){
								if(val == "clear"){
									for (var prop in this.radioButtons){
										registry.byId(this.id + "_radioButton_val_"+ this.radioButtons[prop].value).set('checked', false);
									}
								}
								var widget = registry.byId(this.id + "_radioButton_val_"+val);
								if (widget){
									 	widget.set('checked', true);
										this.value = val;
								 }
							}
							this.inherited(arguments);
						},
        });
});