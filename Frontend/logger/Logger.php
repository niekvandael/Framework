<?php
/**
 * CREATED BY NVD ON 13-mei-2014 14:21:50
 *
 * Package    : 
 * Filename   : logger.php
 */
include 'Database.php';

if ( isset($_POST['error'])){
	$data 			= $_POST['error'];
	$username		= $_POST['username'];
	
	$saveData = array("username" => $username, "error_object" => $data);
	
	$class = new Database();
	$class->insertData($saveData, "error_log");
}

if ( isset($_GET['cmd']) ){
	$cmd = $_GET['cmd'];
	
	if ($cmd == "getErrorList"){
		$class = new Database();
		echo json_encode($class->getList('error_log'));
	}
}
?>