<?php
/** ****************************************
 * @author Guy Theuws
 * @filesource COMMON.php
 * @version 11-12-2014 V1.0
 ****************************************** */

class COMMON{
	protected $_connection = null;
	
	function __construct(){
		$this->_connection = new Connection();
	}
	
	protected function _checkIfUserIsAdmin(){
		// create database connection
		$stmt = $this->_connection->getConnection();
	
		$sql = "SELECT * FROM `usrs` WHERE `usr_id` = :user_id AND `status` = 'A' AND `role` = 'admin'";
	
		$preparedStatement = $stmt->prepare($sql);
	
		// bind parameter
		$preparedStatement->bindValue(":user_id", $_SESSION['webuser'], PDO::PARAM_INT);
	
		$preparedStatement->execute();
	
		$this->_connection->closeConnection();
	
		// check if the response exists of one and only one result
		if ($preparedStatement->rowCount() != 1){
			// User has no admin rights
			echo '{"result":403,"message":"You do not have sufficient permissions to execute this action on this module"}'; die;
		}
	}
}