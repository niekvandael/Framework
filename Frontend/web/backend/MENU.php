<?php
/** ****************************************
 * @author Guy Theuws
 * @filesource MENU.php
 * @version 18-12-2014 V1.0
 ****************************************** */

class MENU extends COMMON{
	function getMenuItems(){
		try{
			$returnArray = array();
			
			// create database connection
			$stmt = $this->_connection->getConnection();
			
			$getGroupsSql = "SELECT grp_id FROM grp_x_usr WHERE usr_id = :usr_id";
			
			$psGroups = $stmt->prepare($getGroupsSql);
				
			// bind parameter
			$psGroups->bindValue(":usr_id", $_SESSION['webuser'], PDO::PARAM_INT);
			$psGroups->execute();
			

			foreach ( $psGroups->fetchAll(PDO::FETCH_ASSOC) as $groupsRow ){
				$getParentSql = "SELECT mi.menu_item, mi.menu_item_id FROM `menu_items` mi 
						WHERE mi.menu_item_id IN ( SELECT DISTINCT mi2.main_menu_id FROM `menu_items` mi2, `mi_x_grp` mxg 
												  WHERE mxg.menu_item_id = mi2.menu_item_id AND 
												  mxg.grp_id = :grp_id
												)";
				
				$psMainMenu = $stmt->prepare($getParentSql);
				
				// bind parameter
				$psMainMenu->bindValue(":grp_id", $groupsRow['grp_id'], PDO::PARAM_INT);
				
				$psMainMenu->execute();
				
				if ($psMainMenu->rowCount() <= 0){
					continue;
				}
				
				foreach ($psMainMenu->fetchAll(PDO::FETCH_ASSOC) as $mainMenuRow) {
				
					$sql = "SELECT me.entity, me.link, me.model, me.maincontroller, mi.menu_item FROM `mi_x_grp` mxg, `menu_items` mi, `mi_extra` me 
						WHERE mxg.menu_item_id = mi.menu_item_id AND 
						mi.menu_item_id = me.menu_item_id AND 
						mxg.grp_id = :grp_id AND
						mi.main_menu_id = :main_menu_id
						GROUP BY mxg.mi_x_grp_id;";
					
					
					$preparedStatement = $stmt->prepare($sql);
					
					// bind parameter
					$preparedStatement->bindValue(":grp_id", $groupsRow['grp_id'], PDO::PARAM_INT);
					$preparedStatement->bindValue(":main_menu_id", $mainMenuRow['menu_item_id'], PDO::PARAM_INT);
					
					$preparedStatement->execute();
					
					if ($preparedStatement->rowCount() > 0){
						$returnArray[$mainMenuRow['menu_item']] = $preparedStatement->fetchAll(PDO::FETCH_ASSOC);
					}
				}
			}
			
			$this->_connection->closeConnection();
			
			echo json_encode( $returnArray );
		} catch (Exception $ex){
			print_r($ex->getMessage()); die;
		}
	}
	
	
}
