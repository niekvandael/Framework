<?php
session_start();

include_once '../config/config.php';

class FileLoader {
	
	private $_loc = "";
	private $_hash = "";
	private $_url = "";
	private $_env = "";
	
	public function __construct($loc, $hash){
		$this->_loc = $loc;
		$this->_hash = $hash;
		
		$this->_env = $_SESSION["DL"];
		//$this->_env = "UK";
		
		if (!$this->_isProductionServer()){
			$this->_url = "https://".TEST_SERVER.":".$this->_getServicePort(false);
		} else{
			$this->_url = "https://".PRODUCTION_SERVER.":".$this->_getServicePort(true);
		}
		
		return $this->_loadFile();
	}

	private function _isProductionServer(){
		return $_SERVER['SERVER_ADDR'] == PRODUCTION_PHP_SERVER || $_SERVER['SERVER_ADDR'] == WEBSERVER;
	}
	
	private function _loadFile(){
		$locDecrypted = $this->_loc;
		$hashDecrypted = $this->_hash;		
		$location = $this->_url . "/documents_" . strtoupper($this->_env) . $locDecrypted;
		
		$ch = curl_init($location);
		curl_setopt($ch, CURLOPT_NOBODY, true);
		curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);
		curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, 0);
		curl_exec($ch);
		$retcode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
		// $retcode >= 400 -> not found, $retcode = 200, found.
		curl_close($ch);

		if ($retcode == 200) {
			if ($hashDecrypted == hash_file('sha256', $location)) {
				header("Content-disposition: attachment; filename=" . substr($locDecrypted, 1));
				header("Content-type: application/pdf");
				return readfile($location);
			};
		} else {
			header("Content-disposition: attachment; filename=404");
			header("Content-type: application/json");
			return readfile(null);
		}
	}
	
	private function _getServicePort($production){
		if (!$production) {
			$port = 8443;
			switch ($this->_getSubdomain()){
				case 'dev': $port = 8443;
				break;
				case 'tst': $port = 7443;
				break;
				case 'acc': $port = 6443;
				break;
					
				case 'devweb':$port = 8444;
				break;
				case 'tstweb': $port = 7444;
				break;
				case 'accweb': $port = 6444;
				break;
				case 'web': $port = 8443; // TODO: delete (temporary 'ppweb' on cefetra4)
				default:
					break;
			}
			return $port;
		} else {
			switch ($this->_getSubdomain()){
				case 'web': $port = 444;
				break;
				default: $port = 443;
				break;
			}
			return $port;
		}
	
	}
	
	public function _decrypt($encrypted){
		$encrypted = str_ireplace("\n", "", $encrypted);
		return $this->_doCurlRequest("$this->_url/" . SERVICES_ROOT . "/restservices/LoginService", "{\"bindingName\":\"iLoginService\",\"method\":\"decodePassword\",\"params\":[{\"errorCode\":0,\"username\":\"\",\"password\":\"" . $encrypted . "\",\"cindex_version_code\":\"\",\"cindex_environment_code\":\"\"}]}");
	}
	
	protected function _doCurlRequest($url, $data = null){
		ob_start();
		$curl_request = curl_init();
		curl_setopt($curl_request, CURLOPT_URL, $url);
		curl_setopt($curl_request, CURLOPT_POST, 1);
		curl_setopt($curl_request, CURLOPT_HTTP_VERSION, CURL_HTTP_VERSION_1_0);
		curl_setopt($curl_request, CURLOPT_HEADER, 1);
		curl_setopt($curl_request, CURLOPT_SSL_VERIFYPEER, 0);
		curl_setopt($curl_request, CURLOPT_RETURNTRANSFER, 1);
		curl_setopt($curl_request, CURLOPT_FOLLOWLOCATION, 0);
		curl_setopt($curl_request, CURLOPT_POSTFIELDS, $data);
		$result = curl_exec($curl_request);
	
		$header_size = curl_getinfo($curl_request, CURLINFO_HEADER_SIZE);
		$header = substr($result, 0, $header_size);
	
		$response = substr($result, $header_size);
	
		curl_close($curl_request);
	
		ob_end_flush();
	
		if (isset($tempData)){
			$this->_data = $tempData;
		}
		$result = json_decode($response, true);
		return $result['result'];
	}
	
	private function _getSubdomain(){
		return strtolower(array_shift((explode(".",$_SERVER['HTTP_HOST']))));
	}
}
$data = json_decode($_POST["data"], true);
new FileLoader($data["loc"], $data["hash"]);
?>