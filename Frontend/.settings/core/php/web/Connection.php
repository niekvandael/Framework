<?php

interface ConnectionSettings{
    const HOST      = 'localhost';
    const USER      = 'root';
    const PASSWORD  = 'i4sAagTG ,<P67K';
    const DATABASE  = 'cefwebdb';
    
    const HOST_TEST = '10.10.1.241';
    const PASSWORD_TEST = 'Extranet!';
    
    /* SHOULD BE IN A COMMON PHP FILE */
    const PRODUCTION_PHP_SERVER = "10.10.1.240";
    const WEBSERVER = "10.10.1.47";
}

class Connection {
    
    private $connection = '';
    
    function __construct() {
        try {
        	$production = $this->_isProductionServer();
        	
        	if($_SERVER['SERVER_ADDR'] == ConnectionSettings::PRODUCTION_PHP_SERVER || $_SERVER['SERVER_ADDR'] == ConnectionSettings::WEBSERVER){
        		$production = true;
        	}
        	if($production){
        		$this->connection = new PDO("mysql:host=".ConnectionSettings::HOST.";port=3306;dbname=".ConnectionSettings::DATABASE, ConnectionSettings::USER, ConnectionSettings::PASSWORD);
        	} else {
        		$this->connection = new PDO("mysql:host=".ConnectionSettings::HOST_TEST.";port=3306;dbname=".ConnectionSettings::DATABASE, ConnectionSettings::USER, ConnectionSettings::PASSWORD_TEST);
        	}
        } catch (Exception $e) {
            echo $e->getMessage();
        }
    }
    
    private function _isProductionServer(){
    	return $_SERVER['SERVER_ADDR'] == PRODUCTION_PHP_SERVER || $_SERVER['SERVER_ADDR'] == WEBSERVER;
    }
    
    function getConnection(){
        return $this->connection;
    }
    
    function closeConnection(){
        $this->connection = null;
    } 
    
    private function getPDOType($value){
    	if (is_int($value))
    		$param = PDO::PARAM_INT;
    	elseif (is_bool($value))
    	$param = PDO::PARAM_BOOL;
    	elseif (is_null($value))
    	$param = PDO::PARAM_NULL;
    	elseif (is_string($value))
    	$param = PDO::PARAM_STR;
    	else
    		$param = FALSE;
    	return $param;
    }
}
?>