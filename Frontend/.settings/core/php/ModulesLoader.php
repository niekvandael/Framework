<?php
/**
 * @author Guy Theuws
 * @package core/php
 * @name modulesloader.php 
 * @version 1.0
 * 
 * Controller that loads model/view/controllers. The core to open files. (Almost) every request will pass through this controller.
 */
/*
 * AUTHORIZATION
 * if ( not authorized )
 * 		exit;
 */
 
// ************** RUN PHP CODE BEFORE INITIALIZATION *************** \\

// ************** SET LOOKUP CONFIGURATION *************** \\

class ModulesLoader{
	private $_files = array();
	private $_maincontroller = "";
	private $_isLookup = false;
	
	function __construct(){
		$this->_getMainController();
		$this->_includeMVC();
		$this->_includeLookupInformation();
		$this->_includeIdMainController();
	}
	
	private function _getMainController(){
		if (isset($_GET['mainController'])){
			$this->_maincontroller = $_GET['mainController'];
		}
	}
	
	private function _checkForLookup(){
		if (isset($_GET['src']) && $_GET['src'] == 'lookup'){
			$config 				= json_decode($_GET['lookupConfiguration']);
			$this->_maincontroller 	= $config->mainController;
			$this->_package 		= $config->package;
			$this->_isLookup 		= true;
			$files 					= "";
			foreach ($config->controllers as $controller){
				$link 	= "modules/" . $config->package . '/list/' . $controller;
				$model 	= $config->package;
				$file 	= "{" . "\"link\":\"" . $link . "\", \"model\":\"" . $model . "\"}";
					
				if(strlen($files) > 0){
					$files = $files . ",";
				}
				$files 	= $files . $file;
					
				return "[$files]";
			}
		}
	}
	
	private function _includeMVC(){
		$this->_files = (isset($_GET['files'])) ? json_decode($_GET['files']) : json_decode($this->_checkForLookup());
		
		foreach ($this->_files as $file){
		
			$controller 				= $file->link;
			$view 						= str_replace ("Controller", "View", $file->link);
			$model 						= str_replace("Controller", "Model", $file->link);
		
			// ************** ONLY JAVASCRIPT BELOW *************** \\
		
			// -- START: JS INCLUDE
			// Include models based on the library variable
			if (isset($file->model)){
				$models = explode(",", $file->model);
				foreach ($models as $script){
					if (file_exists("../../models/$script/Records.js"))
						echo "<script type='text/javascript' src='/models/$script/Records.js'></script>\n\n";
				}
				}
					
				// Include cryptography
				if ((strpos($file->link, 'LoginController') !== FALSE) || (strpos($file->link, 'PasswordChangeController') !== FALSE)){
					echo "<script type='text/javascript' src='/../core/js/encryptor.js'></script>\n";
					
					if(file_exists('../../' . $view . '.js' )){
						echo "<script type='text/javascript' src='/$view.js?time=" . time() . "'></script>\n";
					}
							
				}
				

				echo "<script type='text/javascript' src='/$model.js?time=" . time() . "'></script>\n";
				echo "<script type='text/javascript' src='/$controller.js?time=" . time() . "'></script>\n";
		}
	}
	
	private function _includeLookupInformation(){
		if ($this->_isLookup){
			$this->_maincontroller = 'modules/' . $this->_package . "/" . $this->_maincontroller;
		
			$data = new stdClass();
			$data->searchCriteria 		= json_decode($_GET['searchCriteria']);
			$data->selectionMapping 	= json_decode($_GET['selectionMapping']);
			$data->identifier			= $_GET['identifier'];
			$data->id					= $_GET['id'];
			$data->date 				= $_GET['date'];
		
			$data = json_encode($data);
			
			if (isset($data) && $data != null){
				echo "<script type='text/javascript'>var data = '" . $data . "';</script>\n";
			}
		}
	}
	
	private function _includeIdMainController(){
		echo "<script type='text/javascript'>var id = '{$_GET['id']}';</script>\n";
		echo "<script type='text/javascript' src='/$this->_maincontroller.js?" . time() . "'></script>\n";
	}
}

new ModulesLoader();
?>