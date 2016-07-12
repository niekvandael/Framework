<?php
/** ****************************************
 * @author Guy Theuws
 * @filesource Groups.php
 * @version 24-11-2014 V1.0
 ****************************************** */

class GROUPS extends COMMON{
	function getList(){
		// create database connection
		$stmt = $this->_connection->getConnection();
		
		// Before doing anything check if the user has admin access
		$this->_checkIfUserIsAdmin();
		
		$sql = "SELECT * FROM `grps` WHERE `status` = 'A'";
		
		$preparedStatement = $stmt->prepare($sql);
		
		$preparedStatement->execute();
		
		echo json_encode( $preparedStatement->fetchAll(PDO::FETCH_ASSOC) );
		
		$this->_connection->closeConnection();
	}
	
	function getUserGroupsForUser($data){
		$usr_id = $data['usr_id'] == "" ? 0 : $data['usr_id'];

		// create database connection
		$stmt = $this->_connection->getConnection();
		
		// Before doing anything check if the user has admin access
		$this->_checkIfUserIsAdmin();
		
		$sql = "SELECT g.grp_id, g.grp_name FROM `grps` g, `grp_x_usr` gxu, `usrs` u 
				WHERE u.usr_id = :usr_id AND 
				u.status = 'A' AND
				u.usr_id = gxu.usr_id AND
				gxu.status = 'A' AND
				g.status = 'A' AND
				gxu.grp_id = g.grp_id";
		
		$preparedStatement = $stmt->prepare($sql);
		
		// bind parameter
		$preparedStatement->bindValue(":usr_id", $usr_id, PDO::PARAM_INT);
		
		$preparedStatement->execute();
		
		$this->_connection->closeConnection();
		
		echo json_encode( $preparedStatement->fetchAll(PDO::FETCH_ASSOC) );
	}
	
	function getUserGroups(){
		// create database connection
		$stmt = $this->_connection->getConnection();
	
		// Before doing anything check if the user has admin access
		$this->_checkIfUserIsAdmin();
	
		$sql = "SELECT g.grp_id, g.grp_name FROM `grps` g WHERE g.status = 'A'";
	
		$preparedStatement = $stmt->prepare($sql);
	
		$preparedStatement->execute();
	
		$this->_connection->closeConnection();
	
		echo json_encode( $preparedStatement->fetchAll(PDO::FETCH_ASSOC) );
	}
	
	function updateUserGroupsMembership($data){
		// create database connection
		$stmt = $this->_connection->getConnection();
	
		// Before doing anything check if the user has admin access
		$this->_checkIfUserIsAdmin();
		
		$checkSQL = "SELECT gxu.grp_x_usr_id FROM `grp_x_usr` gxu WHERE gxu.usr_id = :usr_id AND gxu.grp_id = :grp_id";
		
		for ($i = 0; $i < count($data['grp_id']); $i++){
		
			$checkstmt = $stmt->prepare($checkSQL);
				
			$checkstmt->bindValue(":usr_id", $data['usr_id'], PDO::PARAM_INT);
			$checkstmt->bindValue(":grp_id", $data['grp_id'][$i], PDO::PARAM_INT);
		
			$checkstmt->execute();
			
			if ($checkstmt->rowCount() > 0){
				$sql = "UPDATE `grp_x_usr` gxu SET gxu.status = 'A' WHERE gxu.usr_id = :usr_id AND gxu.grp_id = :grp_id AND gxu.status <> 'A'";
			} else{
				$sql = "INSERT INTO `grp_x_usr`(grp_id, usr_id, status) VALUES (:grp_id, :usr_id, 'A');";
			}
			
			$preparedStatement = $stmt->prepare($sql);
			
			$preparedStatement->bindValue(":usr_id", $data['usr_id'], PDO::PARAM_INT);
			$preparedStatement->bindValue(":grp_id", $data['grp_id'][$i], PDO::PARAM_INT);
		
			$preparedStatement->execute();
		}
		
		$this->_connection->closeConnection();
	
		echo '{"result":200}';die;
	}
	
	function deleteUserGroupsMembership($data){
		// create database connection
		$stmt = $this->_connection->getConnection();
	
		// Before doing anything check if the user has admin access
		$this->_checkIfUserIsAdmin();
	
		$checkSQL = "SELECT gxu.grp_x_usr_id FROM `grp_x_usr` gxu WHERE gxu.usr_id = :usr_id AND gxu.grp_id = :grp_id;";
	
		for ($i = 0; $i < count($data['grp_id']); $i++){
	
			$checkstmt = $stmt->prepare($checkSQL);
	
			$checkstmt->bindValue(":usr_id", $data['usr_id'], PDO::PARAM_INT);
			$checkstmt->bindValue(":grp_id", $data['grp_id'][$i], PDO::PARAM_INT);
	
			$checkstmt->execute();
				
			if ($checkstmt->rowCount() > 0){
				$sql = "UPDATE `grp_x_usr` gxu SET gxu.status = 'O' WHERE gxu.usr_id = :usr_id AND gxu.grp_id = :grp_id;";
			} 
				
			$preparedStatement = $stmt->prepare($sql);
				
			$preparedStatement->bindValue(":usr_id", $data['usr_id'], PDO::PARAM_INT);
			$preparedStatement->bindValue(":grp_id", $data['grp_id'][$i], PDO::PARAM_INT);
	
			$preparedStatement->execute();
		}
	
		$this->_connection->closeConnection();
	
		echo '{"result":200}';die;
	}
	
	function updateGroup($data){
		// create database connection
		$stmt = $this->_connection->getConnection();
	
		// Before doing anything check if the user has admin access
		$this->_checkIfUserIsAdmin();
	
		$sql = "UPDATE `grps` g SET g.grp_name = :grp_name WHERE g.grp_id = :grp_id;";
		
		$preparedStatement = $stmt->prepare($sql);
			
		$preparedStatement->bindValue(":grp_name", $data['grp_name'], PDO::PARAM_INT);
		$preparedStatement->bindValue(":grp_id", $data['grp_id'], PDO::PARAM_INT);

		$preparedStatement->execute();
	
		$this->_connection->closeConnection();
		
		if ($preparedStatement->rowCount() > 0){
			echo '{"result":200}';die;
		} else{
			echo '{"result":403, "message":"Oops! Did you try to duplicate an entry?"}';die;
		}
	}
	
	function createGroup($model = null){
		// create database connection
		$stmt = $this->_connection->getConnection();
	
		// Before doing anything check if the user has admin access
		$this->_checkIfUserIsAdmin();
	
		$sql = "INSERT INTO `grps`(`grp_name`, `status`) VALUES (:grp_name, 'A')";
	
		$preparedStatement = $stmt->prepare($sql);
	
		// bind parameter
		$preparedStatement->bindValue(":grp_name", $model['grp_name'], PDO::PARAM_STR);
	
		$preparedStatement->execute();
	
		$this->_connection->closeConnection();
	
		// check if the response exists of one and only one result
		if ($preparedStatement->rowCount() != 1){
			// User has no admin rights
			echo '{"result":403,"message":"Insertion failed. Did you a duplicate group name?"}'; die;
		}
	
		echo '{"result":200}'; die;
	}
	
	function deleteGroup($model = null){
		// create database connection
		$stmt = $this->_connection->getConnection();
	
		// Before doing anything check if the user has admin access
		$this->_checkIfUserIsAdmin();
	
		$sql = "UPDATE `grps` g SET g.status = 'O' WHERE g.grp_id = :grp_id";
	
		$preparedStatement = $stmt->prepare($sql);
	
		// bind parameter
		$preparedStatement->bindValue(":grp_id", $model['grp_id'], PDO::PARAM_INT);
	
		$preparedStatement->execute();
	
		$this->_connection->closeConnection();
	
		// check if the response exists of one and only one result
		if ($preparedStatement->rowCount() != 1){
			// User has no admin rights
			echo '{"result":403,"message":"Error occured while updating the password of user: ' . $model['email'] . '. Are you sure the submitted password has changed?"}'; die;
		}
	
		echo '{"result":200}'; die;
	}
}