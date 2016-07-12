<?php
class AsyncWebRequest extends Thread {
    public $url;
    public $data;
		public $requestData;
     
    public function __construct($url, $data = "{}"){
        $this->url = $url;
				$this->requestData = $data;
    }
     
    public function run() {
      /* process response into useable data */
			$curl_request = curl_init();
			curl_setopt($curl_request, CURLOPT_URL, $this->url);
			curl_setopt($curl_request, CURLOPT_POST, 1);
			curl_setopt($curl_request, CURLOPT_HTTP_VERSION, CURL_HTTP_VERSION_1_0);
			curl_setopt($curl_request, CURLOPT_HEADER, 1);
			curl_setopt($curl_request, CURLOPT_SSL_VERIFYPEER, 0);
			curl_setopt($curl_request, CURLOPT_RETURNTRANSFER, 1);
			curl_setopt($curl_request, CURLOPT_FOLLOWLOCATION, 0);
			curl_setopt($curl_request, CURLOPT_POSTFIELDS, json_encode($this->requestData));
			$result = curl_exec($curl_request);
			
			$header_size = curl_getinfo($curl_request, CURLINFO_HEADER_SIZE);
			$header = substr($result, 0, $header_size);
			
			$this->data = substr($result, $header_size);
			curl_close($curl_request);
    }
}
?>