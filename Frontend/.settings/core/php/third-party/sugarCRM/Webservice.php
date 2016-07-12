<?php
/**
 * @author Guy Theuws
 * @package core/php/third-party/sugarCRM
 * @version 1.0
 * 
 * SugarCRM class to call the API(JSON format). The resonse will be printed(JSON format).
 * 
 **/  
$requests["CHSU1BLService"] = "
 {
		    \"data\": {
		        \"method\": \"get_entry_list\",
		        \"module\": \"Contacts\",
		        \"selectFields\": [
		            \"id\",
		            \"first_name\",
		            \"last_name\",
		            \"description\",
		            \"salutation\",
		            \"title\",
		            \"department\",
		            \"phone_mobile\",
		            \"phone_work\"
		        ],
		        \"linkNameToFieldsArray\": [
		            [
		                [
		                    \"name\",
		                    \"email_addresses\"
		                ],
		                [
		                    \"value\",
		                    [
		                        \"id\",
		                        \"email_address\",
		                        \"opt_out\",
		                        \"primary_address\"
		                    ]
		                ]
		            ]
		        ],
		        \"query\": \"\",
		        \"orderBy\": \"\",
		        \"offset\": \"\",
		        \"maxResults\": 1000,
		        \"deleted\": \"\",
		        \"favorites\": \"\"
		    	}
			}
";

// open the session so session variables are available.
//session_start();
	
class SugarCRM{
	/**
	 * @param int $_port - Private. Needed to set the URL. Value in $_SESSION['port']
	 * @param string $_username - Private. Default username
	 * @param string $_password - Private. Default password
	 * @param array $_parameters - Private. SugarCRM incoming parameters. Value in $_POST['data']
	 * 							            $_POST['data']['module'],
	 *										$_POST['data']['selectFields'],
	 *										$_POST['data']['linkNameToFieldsArray'],
	 *										$_POST['data']['query'],
	 *										$_POST['data']['orderBy'],
	 *										$_POST['data']['offset'],
	 *										$_POST['data']s['maxResults'],
	 *										$_POST['data']['deleted'],
	 *										$_POST['data']['favorites']
	 * @param string $_sessionID - Private. SessionID received from sugarCRM after successful login
	 * @param array $_entryListParameters - Private. $_parameters set in correct format
	 * @param array $_loginParameters - Private. Loginparameters set in correct format
	 */
	private $_port = "";
	private $_url  = "";
	private $_username = "RestV4";
	private $_password = "RestV4";
	private $_parameters = "";
	private $_sessionID = "";
	private $_entryListParameters = "";
	private $_loginParameters = array(
         "user_auth"=>array(
              "user_name"=>"",
              "password"=>"",
              "version"=>"1"
         ),
         "application_name"=>"RestTest",
         "name_value_list"=>array(),
    );
	
	function _getRequest(){
		$request = $GLOBALS["requests"][$_POST["dataService"]];
		
		// get params into request (TODO)
		
		return $request;
	}

	function __construct(){
		$this->_getRequest();
		
		if (!isset($_POST['data'])){
			die("No environment or data set!");
		}
		
		$session = isset($_SESSION['port']) ? $_SESSION['port'] : false;
		
		$this->_url = $this->_getUrl($session);
		$this->_parameters = json_decode($_POST['data'], TRUE);
		$this->_setLoginParameters();
		$this->_login();
		$this->_execute();
	}
	
	private function _getUrl($port){
		// check which endpoint we need to use
		switch ($port){
			// BV
			case '9181':  $url = "http://crm.cefetra.nl/service/v4/rest.php";
			break;
		
			// Feed Service
			case '9282':  $url = "http://crmcfs.cefetra.nl/service/v4/rest.php";
			break;
		
			// UK(ltd)
			case '9383':  $url = "http://crm.cefetra.co.uk/service/v4/rest.php";
			break;
		
			// BU ?
			
			// BMTI?
			
			// ...?
			
			default: $url = "http://crm.cefetra.nl/service/v4/rest.php";
			break;
		}
		
		if (!isset($url)){
			die ('Unknown environment');
		}
		return $url;
	}
	
	private function _setLoginParameters(){
		$this->_loginParameters['user_auth']["user_name"] = $this->_username;
		$this->_loginParameters['user_auth']['password']  = md5($this->_password);
	}
	
	private function _callWebservice($method, $parameters, $url){
			ob_start();
			
			$curl_request = curl_init();
			curl_setopt($curl_request, CURLOPT_URL, $url);
			curl_setopt($curl_request, CURLOPT_POST, 1);
			curl_setopt($curl_request, CURLOPT_HTTP_VERSION, CURL_HTTP_VERSION_1_0);
			//tell curl not to return headers(if 0), but do return the respone
			curl_setopt($curl_request, CURLOPT_HEADER, 1);
			curl_setopt($curl_request, CURLOPT_SSL_VERIFYPEER, 0);
			curl_setopt($curl_request, CURLOPT_RETURNTRANSFER, 1);
			curl_setopt($curl_request, CURLOPT_FOLLOWLOCATION, 0);
		
			$jsonEncodedData = json_encode($parameters);
		
			$post = array(
					"method" => $method,
					"input_type" => "JSON",
					"response_type" => "JSON",
					"rest_data" => $jsonEncodedData
			);
		
			curl_setopt($curl_request, CURLOPT_POSTFIELDS, $post);
			$result = curl_exec($curl_request);
			curl_close($curl_request);
		
			$result = explode("\r\n\r\n", $result, 2);
			// Convert the result from JSON format to a PHP array
			$response = json_decode($result[1]);
			ob_end_flush();
		
			return $response;
	}
	
	private function _setEntryListParameters($sessionID, $moduleName, $selectFields, $linkNameToFieldsArray, $query = NULL, $orderBy = NULL, $offset = 0, $maxResults = 1000000, $deleted = 0, $favorites = FALSE){
		
		$this->_entryListParameters = array(
				//session id
				'session' => $sessionID,
				 
				//The name of the module from which to retrieve records
				'module_name' => $moduleName,
				 
				//The SQL WHERE clause without the word â€œwhereâ€�.
				'query' => $query,
				 
				//The SQL ORDER BY clause without the phrase â€œorder byâ€�.
				'order_by' => $orderBy,
				 
				//The record offset from which to start.
				'offset' => $offset,
				 
				//Optional. The list of fields to be returned in the results
				'select_fields' => $selectFields,
				 
				//A list of link names and the fields to be returned for each link name
				'link_name_to_fields_array' => $linkNameToFieldsArray,
				 
				//The maximum number of results to return.
				'max_results' => $maxResults,
				 
				//To exclude deleted records
				'deleted' => $deleted,
				 
				//If only records marked as favorites should be returned.
				'Favorites' => $favorites,
		);
	}
	
	private function _login(){
		$login_result = $this->_callWebservice("login", $this->_loginParameters, $this->_url);
		$this->_sessionID = $login_result->id;
	}
	
	private function _execute(){
		print_r($this->_parameters);
		die;
		
		$this->_setEntryListParameters(
				$this->_sessionID,
				$this->_parameters['module'],
				$this->_parameters['selectFields'],
				$this->_parameters['linkNameToFieldsArray'],
				$this->_parameters['query'],
				$this->_parameters['orderBy'],
				$this->_parameters['offset'],
				$this->_parameters['maxResults'],
				$this->_parameters['deleted'],
				$this->_parameters['favorites']
		);
		
		$results = $this->_callWebservice($this->_parameters['method'], $this->_entryListParameters, $this->_url);
		
		echo json_encode($results);
	}
}
?>
