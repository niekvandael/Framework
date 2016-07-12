<?php
/** ****************************************
 * @author Guy Theuws
 * @filesource iCRUD.php
 * @version 24-11-2014 V1.0
 ****************************************** */

interface iCRUD{
	function create();
	function read();
	function update();
	function delete();
	function getList();
}