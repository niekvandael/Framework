<?php
/** ****************************************
 * @author Guy Theuws
 * @filesource RELATIONS.php
 * @version 18-03-2015 V1.0
 ****************************************** */

include_once 'COMMON.php';

class RELATIONS extends COMMON{
	function getRelations(){
		try{
			$returnArray = array();
			
			// create database connection
			$stmt = $this->_connection->getConnection();
			
			$getRelSql = "SELECT relid FROM usr_x_relid WHERE user_id = :usr_id";
			
			$psRel = $stmt->prepare($getRelSql);
				
			// bind parameter
			$psRel->bindValue(":usr_id", $_SESSION['webuser'], PDO::PARAM_INT);
			$psRel->execute();
			
			echo json_encode( array("result" => $psRel->fetchAll(PDO::FETCH_ASSOC)) );
			
			$this->_connection->closeConnection();
		} catch (Exception $ex){
			print_r($ex->getMessage()); die;
		}
	}
}
