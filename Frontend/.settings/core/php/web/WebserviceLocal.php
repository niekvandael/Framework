<?php
/** ****************************************
 * @author Guy Theuws
 * @filesource WebserviceLocal.php
 * @version 20-11-2014 V1.0
 ****************************************** */

// open the session so session variables are available.
session_start();

include 'WebLogin.php';
include_once '../../../config/config.php';

include BACKEND_PATH . 'COMMON.php';
include BACKEND_PATH . 'WEBUSRS.php';
include BACKEND_PATH . 'GROUPS.php';
include BACKEND_PATH . 'AUTH.php';
include BACKEND_PATH . 'MENU.php';
include BACKEND_PATH . 'RELATIONS.php';

class WebserviceLocal{
	private $_model = "";
	private $_method = "";
	private $_entity = "";
	private $_screen = "";
	private $_connection = null;
	private $_url = null;
	
	function __construct($model, $method, $entity){
		$this->_connection = new Connection();
		
		$this->_model = json_decode($model, true);
		$this->_method = $method;
		$this->_entity = $entity;
		
		// Login 
		$_SESSION['webuser'] = true;
		
		$webLogin = new WebLogin($_SESSION["webserviceURL"]);
		$webLogin->validateUser($_SESSION['webuser_username'], $_SESSION['webuser_password']);
		
		if (DEBUG){
			error_log("Auth level :: " . $this->getMethod($this->_method));
		}

		
		$webLogin->isAuthorizedForEntity($this->_entity, $this->getMethod($this->_method));
		
		// Create dynamic class
		try{
			$class = new $this->_entity();
		} catch (Exception $ex){
			echo '{"status":403,"message":"Requested entity does not exists"}'; die;
		}
		
		// Check if requested method exists and execute
		if (!method_exists($class, $this->_method)){
			echo '{"status":403,"message":"Requested action does not exists"}';
		} else{
			$class->{$this->_method}($this->_model);
		}
	}
	
	private function getMethod(){
		// available options:
		// 0 - None
		// 1 - Read
		// 2 - Read, update
		// 3 - Read, update, create
		// 4 - Read, update, create, delete
		error_log($this->_method . " :: " . strtoupper(substr($this->_method, 0, strlen(preg_replace("/^([a-z]*)[A-Z].*$/", "$1", $this->_method)))));
		switch(strtoupper(substr($this->_method, 0, strlen(preg_replace("/^([a-z]*)[A-Z].*$/", "$1", $this->_method))))){
			case CREATE: return 3;
			break;
			
			case GET: return 1;
			break;
			
			case UPDATE: return 2;
			break;
			
			case DELETE: return 4;
			break;
			
			default: return 0;
		}
	}
}

new WebserviceLocal($_POST['model'], $_POST['method'], $_POST['entity']);