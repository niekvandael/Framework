<?php
include 'Connection.php';

class WebLogin{
	private $_email = "";
	private $_password = "";
	private $_connection = null;
	private $_url = "";
	
	function __construct($url = null){
		$this->_url = strtolower($url);
		$this->_connection = new Connection();
	}
	
	public function validateUser($email, $password){
		$this->_email = strtolower($email);
		$this->_password = $this->_decryptPassword($password);

		// create database connection
		$stmt = $this->_connection->getConnection();
		
		$sql = "SELECT `salt` FROM `usrs` WHERE `email` = :email AND `status` = 'A'";
		
		$preparedStatement = $stmt->prepare($sql);
		
		// bind values
		$preparedStatement->bindValue(":email", $this->_email, PDO::PARAM_STR);
		
		$preparedStatement->execute();
		
		// check if the response exists of one and only one result
		if ($preparedStatement->rowCount() != 1){
			// wrong login credentials, user not found
			unset($_SESSION['webuser']);
			echo '{"result":201}';
			die;
		} 
		
		$salt = $preparedStatement->fetchAll()[0]['salt'];
		
		$sql = "SELECT `usr_id` FROM `usrs` WHERE `email` = :email AND `password` = :password AND `status` = 'A'";
		
		$preparedStatement = $stmt->prepare($sql);
		
		// bind values
		$preparedStatement->bindValue(":email", $this->_email, PDO::PARAM_STR);
		$preparedStatement->bindValue(":password", hash('sha256', $this->_password . $salt), PDO::PARAM_STR);
		
		
		$preparedStatement->execute();
		
		// check if the response exists of one and only one result
		if ($preparedStatement->rowCount() == 1){
			// valid login, set the userid in the session
			$_SESSION['webuser'] = $preparedStatement->fetchAll(PDO::FETCH_ASSOC)[0]['usr_id'];
			$_SESSION['webuser_username'] = $this->_email;
			$_SESSION['webuser_password'] = $password;
		} else {
			// wrong login credentials
			unset($_SESSION['webuser']);
			echo '{"result":201}';
			die;
		}
		
		
		
		$this->_updateLoginTimestamp();
	}
	
	public function isAuthorizedForEntity($entity, $action){
		if ($action < 1){
			echo '{"result":403,"message":"You do not have sufficient permissions to execute this action on this module."}';die;
		}
		
		// create database connection
		$stmt = $this->_connection->getConnection();
		
		$sql = "SELECT al.auth_lvl FROM auth_lvls al, usrs u, usr_x_auth uxa
				WHERE u.usr_id = :user_id AND
				al.status = 'A' AND
				u.status = 'A' AND
				uxa.status = 'A' AND
				u.usr_id = uxa.usr_id AND
				uxa.auth_lvl_id = al.auth_lvl_id AND
				al.entity = :entity
				ORDER BY al.auth_lvl ASC
				LIMIT 0,1";
		
		$preparedStatement = $stmt->prepare($sql);
		
		// bind values
		$preparedStatement->bindValue(":user_id", $_SESSION['webuser'], PDO::PARAM_INT);
		$preparedStatement->bindValue(":entity", $entity, PDO::PARAM_STR);
		
		$preparedStatement->execute();
		
		// check if there are individual permissions available for this user on this entity
		if ($preparedStatement->rowCount() == 1){
			// The user wants to perform an action, but has not sufficient permissions
			if ($action > $preparedStatement->fetchAll()[0]['auth_lvl']){
				echo '{"result":403,"message":"You do not have sufficient permissions to execute this action on this module."}';
				die;
			} else{
				return; // user has permission to perform this action
			}
		}
		
		$sql = "SELECT al.auth_lvl FROM auth_lvls al, usrs u, grp_x_usr gxu, grp_x_auth gxa
				WHERE u.usr_id = :user_id AND
				al.status = 'A' AND
				u.status = 'A' AND
				gxu.status = 'A' AND
				gxa.status = 'A' AND
				u.usr_id = gxu.usr_id AND
				gxu.grp_id = gxa.grp_id AND
				gxa.auth_lvl_id = al.auth_lvl_id AND
				al.entity = :entity
				ORDER BY al.auth_lvl ASC
				LIMIT 0,1;";
		
		$preparedStatement = $stmt->prepare($sql);
		
		// bind values
		$preparedStatement->bindValue(":user_id", $_SESSION['webuser'], PDO::PARAM_INT);
		$preparedStatement->bindValue(":entity", $entity, PDO::PARAM_STR);
		
		$preparedStatement->execute();
		
		// check if there are group permissions available for this user on this entity
		if ($preparedStatement->rowCount() == 1){
			// The user wants to perform an action, but has not sufficient permissions
			if ($action > $preparedStatement->fetchAll()[0]['auth_lvl']){
				if (DEBUG){
					error_log("Group permissions are blocking this action");
				}
				echo '{"result":403,"message":"You do not have sufficient permissions to execute this action on this module."}';
				die;
			} else{
				return; // user has permission to perform this action
			}
		} else{
			echo '{"result":403,"message":"You do not have sufficient permissions to execute this action on this module."}'; // No permissions found for the user
			die;
		}
	}
	
	public function _decryptPassword($password){
		$password = str_ireplace("\n", "", $password);
		return $this->_doCurlRequest("$this->_url/" . SERVICES_ROOT . "/restservices/LoginService", "{\"bindingName\":\"iLoginService\",\"method\":\"decodePassword\",\"params\":[{\"errorCode\":0,\"username\":\"\",\"password\":\"" . $password . "\",\"cindex_version_code\":\"\",\"cindex_environment_code\":\"\"}]}");
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
	
	private function _updateLoginTimestamp(){
		// create database connection
		$stmt = $this->_connection->getConnection();
	
		$sql = "UPDATE `usrs` SET `last_login` = null WHERE `usr_id` = :user_id AND `status` = 'A'";
	
		$preparedStatement = $stmt->prepare($sql);
	
		$preparedStatement->bindValue(":user_id", $_SESSION['webuser'], PDO::PARAM_INT);
	
		$preparedStatement->execute();
	}
}