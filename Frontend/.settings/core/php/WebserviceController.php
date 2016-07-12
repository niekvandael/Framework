<?php 
/** ****************************************
 * @author Guy Theuws
 * @filesource webserviceController.php
 * @version 30-10-2014 V1.0
 ****************************************** */

namespace ASIST\core\php;

// open the session so session variables are available.
session_start();

include_once 'web/WebLogin.php';
include_once '../../web/backend/RELATIONS.php';
include_once '../../config/config.php';
include_once 'third-party/sugarCRM/Webservice.php';
include_once 'AsyncWebRequest.php';

class WebserviceController{
	protected $_url = "";
	private $_service = "";
	protected $_data = "";
	private $_pl = "";
	private $_dl = "";
		
	function __construct($dl, $action, $service, $data){
		
		$this->_service 	= $service;
		$this->_data 		= json_decode($data, true);
		$this->_pl 			= substr($this->_getSubdomain(), 0, 3);
		$this->_dl 			= $dl;
		
		if (!$this->_isProductionServer()){
			$this->_url = "https://".TEST_SERVER.":".$this->_getServicePort(false);
		} else{
			$this->_url = "https://".PRODUCTION_SERVER.":".$this->_getServicePort(true);
		}
		$_SESSION["webserviceURL"] = $this->_url;
		
		if($service == "SettingsService" && $this->_isWebserver()){
			echo '{"result":200, "message":"Service not required"}'; die;
			die;
		};
		
		if ($this->_isWebserver()){
			$this->_handleWebuserAuthorization($this->_data);
		}

		// Check if method is login and set session parameters
		$this->_setLoginSession();
		
		// Do authorization
		$this->_checkAuthorization($this->_data);
		
		switch($action){
			case 'callWebservice': $this->_callWebservice();
			break;
			
			default: echo '{"result":403, "message":"The requested action is not supported"}'; die;
		}
	}
	
	private function _getServicePort($production){
		if (!$production) {
			$port = 8443;
			switch ($this->_getSubdomain()){
				case 'dev': $port = PORT_DEV;
				break;
				case 'tst': $port = PORT_TST;
				break;
				case 'acc': $port = PORT_ACC;
				break;
					
				case 'devweb':$port = PORT_DEV_WEB;
				break;
				case 'tstweb': $port = PORT_TST_WEB;
				break;
				case 'accweb': $port = PORT_ACC_WEB;
				break;
				case 'web': $port = PORT_DEV_WEB;
				default:
					break;
			}
			return $port;
		} else {
			switch ($this->_getSubdomain()){
				case 'web': $port = PORT_PRD_WEB;
				break;
				default: $port = PORT_PRD;
				break;
			}
			return $port;
		}
		
	}
	
	private function _getSubdomain(){
		return strtolower(array_shift((explode(".",$_SERVER['HTTP_HOST']))));
	}
	
	private function _handleWebuserAuthorization($data){
		$webLogin = new \WebLogin($this->_url);
		if (!$this->_webuserIsAlreadyLoggedIn()){
			$webLogin->validateUser($data["params"][0]['username'], $data["params"][0]['password']);
		} else{
			$webLogin->validateUser($_SESSION['webuser_username'], $_SESSION['webuser_password']);
		}
			
		// user is a valid webuser so let us continue
		if (!$this->_isLoginMethod($data)){
			// Ok, we are not dealing with the loginservice so we have check if the user has permission to perform his requested action
			$entity = substr($this->_service, 0, 7);
			$webLogin->isAuthorizedForEntity($entity, $this->_getAction());
		}
	}
	
	private function _getAction(){
		// available options:
		// 0 - None
		// 1 - Read
		// 2 - Read, update
		// 3 - Read, update, create
		// 4 - Read, update, create, delete
		
		switch ($this->_data['method']){
			case 'getListData': return 1; 
			break;
			
			case 'getListDataAll': return 1;
			break;
			
			case 'createRecord': return 3;
			break;
			
			case 'readRecord': return 1;
			break;
			
			case 'updateRecord': return 2;
			break;
			
			case 'updateListData': return 2;
			break;
			
			case 'deleteRecord': return 4;
			break;
			
			default: return 0; 
			break;
		}
	}
	
	private function _webuserIsAlreadyLoggedIn(){
		return isset($_SESSION['webuser']) && $_SESSION['webuser'] != false && !$this->_isLoginMethod($this->_data); 
	}
	
	private function _callWebservice(){
		echo $this->_doCurlRequest("$this->_url/" . SERVICES_ROOT . "/restservices/$this->_service", $this->_data);
	}
	
	private function _setWebUser(){
		if ($this->_isWebserver()){
			$this->_setWebUserUsernameAndPasswordRecursive($this->_data["params"]);
		}
	}
	
	private function _setWebUserUsernameAndPasswordRecursive(&$data){
		$usernameFound = false;
		$passwordFound = false;
		
		foreach ($data as $key => $value){
			if ($key === "username"){
				if ($this->_isWebserver() && $this->_isProductionServer()){
					$data[$key] = "READ";
				} else{
					$data[$key] = "CEFETRA";
				}
				$usernameFound = true;
			}
		
			if ($key === "password"){
				if ($this->_isWebserver() && $this->_isProductionServer()){
					$data[$key] = "Bp316GVAPIFVYfiYOLotLBFf/jK4TwwdxWgDlBNoF4EwnogOHVfaDL1R/5C/JNGh\nalGVOOqM9pj0nkp5UdZ1CXMc+ywYn0EVOYpK+FGs8cMcslzP/K67weOJlpifJHcr\nLJk+V+7I58EMB8h6T5/52DtQoGnhBtrs5JHv5umBmlc=\n";
				} else{
					$data[$key] = "mAM7x4G6fE1OZBb/FxjJCi+k2mCD5BCNkL1pyvRVainZ6iexUbUQxAqDSuXT8IwY\nwSk6SysEoG4l+EKuTtqPssJwJQ9AoOfh5qp47iZvf92xoxgom4gY0wevvtH4GGFs\nFVbK+I/8Hhxn7sRrn0sAZG2XRfWDd21SC6/8Xej2spc=\n";
				}
				$passwordFound = true;
			}
		
			if ($usernameFound && $passwordFound){
				return $data;
			}
		
			if (is_array($data[$key])){
				$this->_setWebUserUsernameAndPasswordRecursive($data[$key]);
			}
		}
	}
	
	private function _setDataLibraryIfExistsRecursive(&$data){		
		foreach ($data as $key => $value){
			if ($key === "cindex_environment_code" || $key === "control_locale_language"){
				$data[$key] = $this->_dl;
				return $data;
			}
			
			if (is_array($data[$key])){
				$this->_setDataLibraryIfExistsRecursive($data[$key]);
			}
		}
	}

	private function _setProgramLibraryIfExistsRecursive(&$data){
		foreach ($data as $key => $value){
			if ($key === "cindex_version_code" || $key === "control_locale_region"){
				$data[$key] = $this->_pl;
				return $data;
			}
				
			if (is_array($data[$key])){
				$this->_setProgramLibraryIfExistsRecursive($data[$key]);
			}
		}
	}
	
	private function _getAuthorizationList(){
		$data = array("bindingName"=> "iLoginService", 
				 "method" => "getAuthorizations", 
				 "params" => array(
					[ "cindex_version_code" => $this->_pl,
				 	  "cindex_environment_code" => $this->_dl,
				 	  "errorCode" => 0,
					  "username" => $_SESSION['username'],
					  "password" => $_SESSION['password']
				    ]),
			    "status" => 0
			    );
  		
		$this->_doCurlRequest("$this->_url/" . SERVICES_ROOT . "/restservices/LoginService", $data);
	}
	
	private function _checkAuthorization($data){
		if (substr($this->_service, 0, 2) != "CH"){
			return;
		}
		$authLevel = 0;
		// e.g.: CHCURBL
		$business_object = "CH" . substr($this->_service, 2, 3);
		
		for ($i = 4; $i >= 1; $i--){
			// Check if bo is in list
			if (array_key_exists($business_object, $_SESSION['authorizationList'])){
				$authLevel = $_SESSION['authorizationList'][$business_object];
				break;
			} else{
				$business_object[$i] = "*";
			}
		}
		
		// Module not in authorization list
		if ($business_object == "C****"){
			echo '{"result":"403", "message":"You do not have sufficient permissions to execute this action on this module."}';
			die;
		}
		
		// Map CRUD operation, e.g.: $method = "createRecord", $operation = CREATE;
		switch($data['method']){
			case 'createRecord': $operation = CREATE;
			break;
			
			case 'getListData': $operation = READ;
			break;
			
			case 'getListDataAll': $operation = READ;
			break;
			
			case 'readRecord': $operation = READ;
			break;
			
			case 'updateRecord': $operation = UPDATE;
			break;
			
			case 'updateListData': $operation = UPDATE;
			break;
			
			case 'deleteRecord': $operation = DELETE;
			break;
			
			case 'getProgress': $operation = READ;
			break;
		}
		
		// Check the detail action code in the request and compare it to the authorization level
		
		// no permissions
		if ($authLevel <= 0){
			echo '{"result":"403", "message":"You do not have sufficient permissions to create, read, update or delete."}';
			die;
		}
		
		// read
		if ($authLevel >= 1 && $authLevel < 3 && $operation != READ){
			echo '{"result":"403", "message":"Only read allowed."}';
			die;
		} 
		
		// update
		if($authLevel >= 3  && $authLevel < 6 && $operation != UPDATE && $operation != READ){
			echo '{"result":"403", "message":"Only read and update allowed."}';
			die;
		}
		
		// create
		if ($authLevel >= 6  && $authLevel < 8 && $operation != CREATE && $operation != READ && $operation != UPDATE){
			echo '{"result":"403", "message":"Only read, update and create allowed."}';
			die;
		}
		
		// delete
		// No implementation needed. Everything above 8 has all rights
	}
	
	private function _isWebserver(){
		return $_SESSION["web"];
	}
	
	private function _isLoginMethod($data){
		return $data['method'] === "login";
	}
	
	private function _isProductionServer(){
		return $_SERVER['SERVER_ADDR'] == PRODUCTION_PHP_SERVER || $_SERVER['SERVER_ADDR'] == WEBSERVER;
	}
	
	private function _isTestServer(){
		return $_SERVER['SERVER_ADDR'] == TEST_SERVER;
	}
	
	private function _setLoginSession(){
		if ($this->_isLoginMethod($this->_data)){
			$_SESSION['username'] = $this->_data["params"][0]['username'];
			$_SESSION['password'] = $this->_data["params"][0]['password'];
			if ($this->_isWebserver()){
				// Webuser is logged in, log in with common user
				echo $this->_doCurlRequest("$this->_url/" . SERVICES_ROOT . "/restservices/LoginService");
			} else {
				if (strlen($_SESSION['username']) > 10){
					echo '{"result":403, "message":"Invalid username or password"}';
					die;
				}
			}
			
			// Get user authorization
			$this->_getAuthorizationList();
			
			if ($this->_isWebserver()){
				// If webuser die, otherwise the request will fire twice
				die;
			}
		}
	}
	
	protected function _getSugarCRMData($dataService){
		$_POST["dataService"] = $dataService;
		$sugarCRM = new \SugarCRM();
	}
	
	protected function _getThirdPartyData($url){
		$dataService = split("/", $url)[5];
		$thirdPartyDataResult = null;
		switch ($dataService) {
	    case "CHSU1BLService":
	    	$thirdPartyDataResult = $this->_getSugarCRMData($dataService);
	        break;
		}

		return $thirdPartyDataResult;
	}
	
	
	protected function _doCurlRequest($url, $data = null){
		// Check for third party data
		$thirdPartyData = $this->_getThirdPartyData($url);
		if($thirdPartyData != null){
			return $thirdPartyData;
		};
		
		if(DEBUG == TRUE){
			set_time_limit ( 0 );
			$url = str_replace(TEST_SERVER, DEBUG_SERVER, $url);
			$url = str_replace("https", "http", $url);
		}
		
		if(SSL == false){
			$url = str_replace("https", "http", $url);
		}
		
		$curlRequest = true;
		
		// Check if data is coming from front-end or is set by the back-end
		if (isset($data) && !empty($data)){
			// tempData has to be set if other data is used then $this->_data
			// because it is possible that in one request you have to call multiple services.
			// The original data is set in the $this->_data variable, but needs to be overwritten
			// in case of webusers. In the function $this->_setWebUser the $this->_data variable is passed by reference.
			$tempData = $this->_data;
			$this->_data = $data;
		}
		
		if ($_SESSION['web'] && $this->_service === "CHRELBLService" ){
				$curlRequest = false;
		}
		
		if ($curlRequest){
			// Set program and data library
			$this->_setDataLibraryIfExistsRecursive($this->_data["params"]);
			$this->_setProgramLibraryIfExistsRecursive($this->_data["params"]);
			
			// Set default username and password for webuser
			$this->_setWebUser();
	
			$request = new \AsyncWebRequest($url, $this->_data);
 
			if ($request->start()) {
			    /* ensure we have data */
			    $request->join();
			    /* we can now manipulate the response */
			    if ($data['method'] !== "getAuthorizations"){
			    	echo $request->data;
			    } else {
			    	// Check response status, 200 is OK, 201 is error
			    	$response = json_decode($request->data, true);
						if ($response['result'][0] == 200){
							$list = $response['result'][1];
							$authorizationKeyValue = array();
							
							foreach ($list as $auth){
								$authorizationKeyValue[$auth['BUSINESS_OBJECT']] = $auth['AUTH_LVL'];	
							}
							
							$_SESSION['authorizationList'] = $authorizationKeyValue;
						}
			    }
			}
			
			if (isset($tempData)){
				$this->_data = $tempData;
			}
		} else {
			$relations = new \RELATIONS();
			$relations->getRelations();
		}
	}
}

new WebserviceController($_SESSION['DL'], $_GET['action'], $_POST['service'], $_POST['data']);
?>