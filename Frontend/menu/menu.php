<?php 

//
// Roles
//

$roles['admin']['employeeMenuItem'] = true;
$roles['admin']['orderMenuItem'] = true;
$roles['admin']['contractMenuItem'] = true;
$roles['admin']['productMenuItem'] = true;

//
// Menu Items
//
$menu['Reference'][] = array("id" => "employeeMenuItem", 		"title" => "Employee List");
$menu['Reference'][] = array("id" => "orderMenuItem", 			"title" => "Order List");
$menu['Reference'][] = array("id" => "contractMenuItem", 		"title" => "Contract List");
$menu['Special'][] = array("id" => "productMenuItem", 			"title" => "Products");

?>