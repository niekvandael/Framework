<?php
if (!isset($_POST['data'])){
	die ('No data set');
}

$data = $_POST['data'];
$data = json_decode($data);

$fields	= $_GET['structure'];
$fields = substr($fields, 1, strlen($fields) - 2);
$fields = json_decode($fields, TRUE);

$mydata 		= array();
$headers 		= array();
$values 		= array();

$i = 0;

for ($i = 0; $i < count($fields); $i++){
	$headers[] = $fields[$i]['name'];
}

for ($row = 0; $row < count($data); $row++){
	$temp = array();
	for ($col = 0; $col < count($fields); $col++){
		$t = $data[$row]->$fields[$col]['field'];
		$temp[] = $t[0];
	}
	array_push($values, $temp);
}

$mydata[0] = $headers;

foreach ($values as $array){
	array_push($mydata, $array);
}

$fileName = $_GET['title'] . " " . date("Y-m-d His");

header("Content-Type: application/vnd.ms-excel");
header("Content-Disposition: attachment; filename=\"$fileName.csv\"");
outputCSV($mydata);

function outputCSV($data) {
	$outstream = fopen("php://output", 'w');
	echo "sep=;\n";
	function __outputCSV(&$vals, $key, $filehandler) {
		fputcsv($filehandler, $vals, ';', '"');
	}
	array_walk($data, '__outputCSV', $outstream);
	fclose($outstream);
}	
?>