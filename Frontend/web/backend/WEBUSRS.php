<?php
/** ****************************************
 * @author Guy Theuws
 * @filesource Users.php
 * @version 24-11-2014 V1.0
 ****************************************** */

class WEBUSRS extends COMMON{
	function getList($model = null){
		// create database connection
		$stmt = $this->_connection->getConnection();
		
		// Before doing anything check if the user has admin access
		$this->_checkIfUserIsAdmin();
		
		$sql = "SELECT * FROM `usrs` WHERE `status` = 'A'";
		
		$preparedStatement = $stmt->prepare($sql);
		
		$preparedStatement->execute();
		
		echo json_encode( $preparedStatement->fetchAll(PDO::FETCH_ASSOC) );
		
		$this->_connection->closeConnection();
	}
	
	function updatePassword($model = null){
		// create database connection
		$stmt = $this->_connection->getConnection();
		
		// Before doing anything check if the user has admin access
		$this->_checkIfUserIsAdmin();
	
		$sql = "UPDATE `usrs` SET `password` = :password WHERE `usr_id` = :user_id AND `status` = 'A'";
	
		$preparedStatement = $stmt->prepare($sql);
	
		// bind parameter
		$preparedStatement->bindValue(":user_id", $model['usr_id'], PDO::PARAM_INT);
		$preparedStatement->bindValue(":password", hash('sha256', $model['password'] . $model['salt']), PDO::PARAM_STR);
	
		$preparedStatement->execute();
	
		$this->_connection->closeConnection();
	
		// check if the response exists of one and only one result
		if ($preparedStatement->rowCount() != 1){
			// User has no admin rights
			echo '{"result":403,"message":"Error occured while updating the password of user: ' . $model['email'] . '. Are you sure the submitted password has changed?"}'; die;
		}
		
		echo '{"result":200}'; die;
	}
	
	function updateUser($model = null){
		// create database connection
		$stmt = $this->_connection->getConnection();
		
		// Before doing anything check if the user has admin access
		$this->_checkIfUserIsAdmin();
		
		$sql = "UPDATE `usrs` SET `email` = :email, `role` = :role, `first_name` = :first_name, `last_name` = :last_name, `company` = :company, `title` = :title WHERE `usr_id` = :usr_id AND `status` = 'A'";
		
		$preparedStatement = $stmt->prepare($sql);
		
		// bind parameter
		$preparedStatement->bindValue(":email", $model['email'], PDO::PARAM_STR);
		$preparedStatement->bindValue(":usr_id", $model['usr_id'], PDO::PARAM_INT);
		$preparedStatement->bindValue(":role", $model['role'], PDO::PARAM_STR);
		$preparedStatement->bindValue(":first_name", $model['first_name'], PDO::PARAM_STR);
		$preparedStatement->bindValue(":last_name", $model['last_name'], PDO::PARAM_STR);
		$preparedStatement->bindValue(":company", $model['company'], PDO::PARAM_STR);
		$preparedStatement->bindValue(":title", $model['title'], PDO::PARAM_STR);
		
		$preparedStatement->execute();
		
		$this->_connection->closeConnection();
		
		// check if the response exists of one and only one result
		if ($preparedStatement->rowCount() != 1){
			// User has no admin rights
			echo '{"result":403,"message":"Error occured while updating the password of user: ' . $model['email'] . '. Are you sure the submitted password has changed?"}'; die;
		}
		
		echo '{"result":200}'; die;
	}
	
	function createUser($model = null){
		// create database connection
		$stmt = $this->_connection->getConnection();
	
		// Before doing anything check if the user has admin access
		$this->_checkIfUserIsAdmin();
	
		$sql = "INSERT INTO `usrs`(`role`, `email`, `password`, `salt`, `first_name`, `last_name`, `company`, `title`, `status`) 
				VALUES ('user', :email,  SHA2(RAND(), 256), SHA2(RAND(), 256), :first_name, :last_name, :company, :title, 'A')";
	
		$preparedStatement = $stmt->prepare($sql);
	
		// bind parameter
		$preparedStatement->bindValue(":email", $model['email'], PDO::PARAM_STR);
		$preparedStatement->bindValue(":first_name", $model['first_name'], PDO::PARAM_STR);
		$preparedStatement->bindValue(":last_name", $model['last_name'], PDO::PARAM_STR);
		$preparedStatement->bindValue(":company", $model['company'], PDO::PARAM_STR);
		$preparedStatement->bindValue(":title", $model['title'], PDO::PARAM_STR);
	
		$preparedStatement->execute();
	
		$this->_connection->closeConnection();
	
		// check if the response exists of one and only one result
		if ($preparedStatement->rowCount() != 1){
			// User has no admin rights
			echo '{"result":403,"message":"Error occured while updating the password of user: ' . $model['email'] . '. Are you sure the submitted password has changed?"}'; die;
		}
	
		echo '{"result":200}'; die;
	}
	
	function deleteUser($model = null){
		// create database connection
		$stmt = $this->_connection->getConnection();
	
		// Before doing anything check if the user has admin access
		$this->_checkIfUserIsAdmin();
	
		$sql = "UPDATE `usrs` u SET u.status = 'O' WHERE u.usr_id = :usr_id";
	
		$preparedStatement = $stmt->prepare($sql);
	
		// bind parameter
		$preparedStatement->bindValue(":usr_id", $model['usr_id'], PDO::PARAM_INT);
	
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