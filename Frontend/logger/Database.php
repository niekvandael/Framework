<?php
/**
 * CREATED BY NVD ON 15-mei-2014 15:08:50
 *
 * Package    : logger
 * Filename   : Database.php
 */
include 'Configuration.php';

class Database implements iConfiguration{
	private $PDO = null;
	
	public function Database(){
		try{
			$this->PDO = new PDO('mysql:host=' . iConfiguration::HOST . ';dbname=' . iConfiguration::DATABASE, iConfiguration::USERNAME, iConfiguration::PASSWORD);
			$this->PDO->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
		} catch (PDOException $error){
			die ("I'm sorry, but an error occurred when I tried to connect to the database");
		}
	}
	
	public function closeConnection(){
		$this->PDO = null;
	}
	
	public function insertData($data, $table){
		$fields 	= "(";
		$values	= " VALUES (";
		
		foreach ($data as $key => $value){
			$fields .= $key . ", ";
			$values .= ":" . $key . ", ";
		}
		
		$fields = substr($fields, 0, strlen($fields) - 2) . ")";
		$values = substr($values, 0, strlen($values) - 2) . ")";
		$sth = $this->PDO->prepare("INSERT INTO `$table` $fields $values");

		reset($data);
		
		foreach ($data as $key2 => $value2){
			$sth->bindValue(":" . $key2, $value2, $this->getPDOType($value2));
		}
		
		$sth->execute();
		
		echo true;
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
	
	public function getList($table){
		$sth = $this->PDO->prepare("SELECT * FROM `$table`");
		$sth->execute();
		return $sth->fetchAll(PDO::FETCH_ASSOC);
	}
} 
?>