<?php
/** ****************************************
 * @author Guy Theuws
 * @filesource Auth.php
 * @version 11-12-2014 V1.0
 ****************************************** */

class AUTH extends COMMON{
	function getAuthorizationForGroup($data){
		$grp_id = $data['grp_id'] == "" ? '' : $data['grp_id'];
		
		// create database connection
		$stmt = $this->_connection->getConnection();
		
		// Before doing anything check if the user has admin access
		$this->_checkIfUserIsAdmin();
		
		$sql = "SELECT al.auth_lvl_id, al.entity, al.auth_lvl, g.grp_name FROM `grp_x_auth` gxa, `auth_lvls` al, `grps` g
				WHERE g.status = 'A' AND
				g.status = 'A' AND
				gxa.status = 'A' AND
				al.status = 'A' AND
				g.grp_id = :grp_id AND 
				g.grp_id = gxa.grp_id AND
				gxa.auth_lvl_id = al.auth_lvl_id";
		
		$preparedStatement = $stmt->prepare($sql);
		
		// bind parameter
		$preparedStatement->bindValue(":grp_id", $grp_id, PDO::PARAM_INT);
		
		$preparedStatement->execute();
		
		$this->_connection->closeConnection();
		
		echo json_encode( $preparedStatement->fetchAll(PDO::FETCH_ASSOC) );
	}
	
	function getAllAuthorizations(){
		// create database connection
		$stmt = $this->_connection->getConnection();
	
		// Before doing anything check if the user has admin access
		$this->_checkIfUserIsAdmin();
	
		$sql = "SELECT al.auth_lvl_id, al.entity, al.auth_lvl, al.status FROM `auth_lvls` al
				WHERE al.status = 'A'";
	
		$preparedStatement = $stmt->prepare($sql);
	
		$preparedStatement->execute();
	
		$this->_connection->closeConnection();
	
		echo json_encode( $preparedStatement->fetchAll(PDO::FETCH_ASSOC) );
	}
	
	function getUserSpecialAuthorization($data){
		$usr_id = $data['usr_id'] == "" ? 0 : $data['usr_id'];
		
		// create database connection
		$stmt = $this->_connection->getConnection();
		
		// Before doing anything check if the user has admin access
		$this->_checkIfUserIsAdmin();
		
		$sql = "SELECT al.auth_lvl_id, al.entity, al.auth_lvl FROM `usr_x_auth` uxa, `auth_lvls` al, `usrs` u 
				WHERE u.usr_id = :usr_id AND 
				u.status = 'A' AND
				u.usr_id = uxa.usr_id AND
				uxa.status = 'A' AND
				al.status = 'A' AND
				uxa.auth_lvl_id = al.auth_lvl_id";
		
		$preparedStatement = $stmt->prepare($sql);
		
		// bind parameter
		$preparedStatement->bindValue(":usr_id", $usr_id, PDO::PARAM_INT);
		
		$preparedStatement->execute();
		
		$this->_connection->closeConnection();
		
		echo json_encode( $preparedStatement->fetchAll(PDO::FETCH_ASSOC) );
	}
	
	function updateUserSpecialAuthorization($data){
		// create database connection
		$stmt = $this->_connection->getConnection();
	
		// Before doing anything check if the user has admin access
		$this->_checkIfUserIsAdmin();
	
		$checkSQL = "SELECT uxa.usr_x_auth_id FROM `usr_x_auth` uxa WHERE uxa.usr_id = :usr_id AND uxa.auth_lvl_id = :auth_lvl_id";
	
		for ($i = 0; $i < count($data['auth_lvl_id']); $i++){
	
			$checkstmt = $stmt->prepare($checkSQL);
	
			$checkstmt->bindValue(":usr_id", $data['usr_id'], PDO::PARAM_INT);
			$checkstmt->bindValue(":auth_lvl_id", $data['auth_lvl_id'][$i], PDO::PARAM_INT);
	
			$checkstmt->execute();
				
			if ($checkstmt->rowCount() > 0){
				$sql = "UPDATE `usr_x_auth` uxa SET uxa.status = 'A' WHERE uxa.usr_id = :usr_id AND uxa.auth_lvl_id = :auth_lvl_id";
			} else{
				$sql = "INSERT INTO `usr_x_auth`(usr_id, auth_lvl_id, status) VALUES (:usr_id, :auth_lvl_id, 'A');";
			}
				
			$preparedStatement = $stmt->prepare($sql);
				
			$preparedStatement->bindValue(":usr_id", $data['usr_id'], PDO::PARAM_INT);
			$preparedStatement->bindValue(":auth_lvl_id", $data['auth_lvl_id'][$i], PDO::PARAM_INT);
	
			$preparedStatement->execute();
		}
	
		$this->_connection->closeConnection();
	
		echo '{"result":200}';die;
	}
	
	function deleteUserSpecialAuthorization($data){
		// create database connection
		$stmt = $this->_connection->getConnection();
	
		// Before doing anything check if the user has admin access
		$this->_checkIfUserIsAdmin();
	
		$checkSQL = "SELECT uxa.usr_x_auth_id FROM `usr_x_auth` uxa WHERE uxa.usr_id = :usr_id AND uxa.auth_lvl_id = :auth_lvl_id;";
	
		for ($i = 0; $i < count($data['auth_lvl_id']); $i++){
	
			$checkstmt = $stmt->prepare($checkSQL);
	
			$checkstmt->bindValue(":usr_id", $data['usr_id'], PDO::PARAM_INT);
			$checkstmt->bindValue(":auth_lvl_id", $data['auth_lvl_id'][$i], PDO::PARAM_INT);
	
			$checkstmt->execute();
	
			if ($checkstmt->rowCount() > 0){
				$sql = "UPDATE `usr_x_auth` uxa SET uxa.status = 'O' WHERE uxa.usr_id = :usr_id AND uxa.auth_lvl_id = :auth_lvl_id;";
			} 
	
			$preparedStatement = $stmt->prepare($sql);
	
			$preparedStatement->bindValue(":usr_id", $data['usr_id'], PDO::PARAM_INT);
			$preparedStatement->bindValue(":auth_lvl_id", $data['auth_lvl_id'][$i], PDO::PARAM_INT);
	
			$preparedStatement->execute();
		}
	
		$this->_connection->closeConnection();
	
		echo '{"result":200}';die;
	} 
	
	function updateGroupAuthorization($data){
		// create database connection
		$stmt = $this->_connection->getConnection();
	
		// Before doing anything check if the user has admin access
		$this->_checkIfUserIsAdmin();
	
		$checkSQL = "SELECT gxa.grp_x_auth_id FROM `grp_x_auth` gxa WHERE gxa.grp_id = :grp_id AND gxa.auth_lvl_id = :auth_lvl_id";
	
		for ($i = 0; $i < count($data['auth_lvl_id']); $i++){
	
			$checkstmt = $stmt->prepare($checkSQL);
	
			$checkstmt->bindValue(":grp_id", $data['grp_id'], PDO::PARAM_INT);
			$checkstmt->bindValue(":auth_lvl_id", $data['auth_lvl_id'][$i], PDO::PARAM_INT);
	
			$checkstmt->execute();
	
			if ($checkstmt->rowCount() > 0){
				$sql = "UPDATE `grp_x_auth` gxa SET gxa.status = 'A' WHERE gxa.grp_id = :grp_id AND gxa.auth_lvl_id = :auth_lvl_id";
			} else{
				$sql = "INSERT INTO `grp_x_auth`(grp_id, auth_lvl_id, status) VALUES (:grp_id, :auth_lvl_id, 'A');";
			}
	
			$preparedStatement = $stmt->prepare($sql);
	
			$preparedStatement->bindValue(":grp_id", $data['grp_id'], PDO::PARAM_INT);
			$preparedStatement->bindValue(":auth_lvl_id", $data['auth_lvl_id'][$i], PDO::PARAM_INT);
	
			$preparedStatement->execute();
		}
	
		$this->_connection->closeConnection();
	
		echo '{"result":200}';die;
	}
	
	function deleteGroupAuthorization($data){
		// create database connection
		$stmt = $this->_connection->getConnection();
	
		// Before doing anything check if the user has admin access
		$this->_checkIfUserIsAdmin();
	
		$checkSQL = "SELECT gxa.grp_x_auth_id FROM `grp_x_auth` gxa WHERE gxa.grp_id = :grp_id AND gxa.auth_lvl_id = :auth_lvl_id;";
	
		for ($i = 0; $i < count($data['auth_lvl_id']); $i++){
	
			$checkstmt = $stmt->prepare($checkSQL);
	
			$checkstmt->bindValue(":grp_id", $data['grp_id'], PDO::PARAM_INT);
			$checkstmt->bindValue(":auth_lvl_id", $data['auth_lvl_id'][$i], PDO::PARAM_INT);
	
			$checkstmt->execute();
	
			if ($checkstmt->rowCount() > 0){
				$sql = "UPDATE `grp_x_auth` gxa SET gxa.status = 'O' WHERE gxa.grp_id = :grp_id AND gxa.auth_lvl_id = :auth_lvl_id;";
			}
	
			$preparedStatement = $stmt->prepare($sql);
	
			$preparedStatement->bindValue(":grp_id", $data['grp_id'], PDO::PARAM_INT);
			$preparedStatement->bindValue(":auth_lvl_id", $data['auth_lvl_id'][$i], PDO::PARAM_INT);
	
			$preparedStatement->execute();
		}
	
		$this->_connection->closeConnection();
	
		echo '{"result":200}';die;
	}
	
	function updateAuthorization($model = null){
		// create database connection
		$stmt = $this->_connection->getConnection();
	
		// Before doing anything check if the user has admin access
		$this->_checkIfUserIsAdmin();
	
		$sql = "UPDATE `auth_lvls` al SET al.status = 'A', al.auth_lvl = :auth_lvl, al.entity = :entity WHERE al.auth_lvl_id = :auth_lvl_id";
		
		$preparedStatement = $stmt->prepare($sql);
	
		$preparedStatement->bindValue(":entity", $model['entity'], PDO::PARAM_STR);
		$preparedStatement->bindValue(":auth_lvl_id", $model['auth_lvl_id'], PDO::PARAM_INT);
		$preparedStatement->bindValue(":auth_lvl", $model['auth_lvl'], PDO::PARAM_INT);
	
		$preparedStatement->execute();
	
		$this->_connection->closeConnection();
	
		echo '{"result":200}';die;
	}
	
	function createAuthorization($model = null){
		// create database connection
		$stmt = $this->_connection->getConnection();
	
		// Before doing anything check if the user has admin access
		$this->_checkIfUserIsAdmin();
	
		$sql = "INSERT INTO `auth_lvls` (auth_lvl, entity, status) VALUES(:auth_lvl, :entity, 'A');";
	
		$preparedStatement = $stmt->prepare($sql);
	
		$preparedStatement->bindValue(":entity", $model['entity'], PDO::PARAM_STR);
		$preparedStatement->bindValue(":auth_lvl", $model['auth_lvl'], PDO::PARAM_INT);
	
		$preparedStatement->execute();
	
		$this->_connection->closeConnection();
	
		echo '{"result":200}';die;
	}
	
	function deleteAuthorization($model = null){
		// create database connection
		$stmt = $this->_connection->getConnection();
	
		// Before doing anything check if the user has admin access
		$this->_checkIfUserIsAdmin();
	
		$sql = "UPDATE `auth_lvls` al SET al.status = 'O' WHERE al.auth_lvl_id = :auth_lvl_id";
	
		$preparedStatement = $stmt->prepare($sql);
	
		$preparedStatement->bindValue(":auth_lvl_id", $model['auth_lvl_id'], PDO::PARAM_INT);
	
		$preparedStatement->execute();
	
		$this->_connection->closeConnection();
	
		echo '{"result":200}';die;
	}
}