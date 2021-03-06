<?php
session_start();
/**
 * CREATED BY Guy Theuws ON 1-apr.-2014 14:10:44
 *
 * Package    : /
 * Filename   : index.php
 */
header('Content-type: text/html; charset=iso-8859-1');
header("Expires: on, 01 Jan 1970 00:00:00 GMT");
header("Last-Modified: " . gmdate("D, d M Y H:i:s") . " GMT");
header("Cache-Control: no-store, no-cache, must-revalidate");
header("Cache-Control: post-check=0, pre-check=0", false);
header("Pragma: no-cache");

if (!isset($_GET['environment'])){
	die ("No environment set");
}

if (strlen($_GET['environment']) > 3){
	die ('environment seems not legit!');
}
$_SESSION['DL'] = strtoupper($_GET['environment']);
$_SESSION["web"] = false;

include ("menu/menu.php");
?>
<!DOCTYPE html>
<html>
<head>
<link rel="stylesheet" href="/dojo/dijit/flat.css" />
<link rel="stylesheet"
	href="/dojo/dojox/grid/enhanced/resources/tundra/EnhancedGrid.css" />
<link rel="stylesheet"
	href="/dojo/dojox/grid/enhanced/resources/EnhancedGrid.css" />
<link rel="stylesheet"
	href="/dojo/dojox/layout/resources/FloatingPane.css" />
<link rel="stylesheet"
	href="/dojo/dojox/layout/resources/ResizeHandle.css" />
<link rel="stylesheet" href="/core/css/framework.css" />
<link rel="shortcut icon" href="/images/favicon.jpg"
	type="image/png; charset=binary" />
<link rel="icon" href="/images/favicon.png"
	type="image/png; charset=binary" />
<meta name="viewport" content="width=device-width, initial-scale=1" />

<script type="text/javascript">
dojoConfig = {
        packages: [
            { name: "cefetraWidgets", 	location: "../../core/widgets"}, 
            { name: "mvc", 							location: "../../core/mvc"}, 
            { name: "modules", 					location: "/modules"},
            { name: "models", 					location: "/models"},
            
            
        ],
        isDebug: true,
        async: true
    };
</script>
<script src='/dojo/dojo/dojo.js.uncompressed.js'></script>
<script>

<?php include('core/js/imports.txt'); ?>
			  new Dialog({
							title					: "<?php print strtolower(array_shift((explode(".",$_SERVER['HTTP_HOST'])))); ?> | Cindex Login | v.{version}",
			  			content				: new LoginController(),
			    		closable			: false,
			    		modal					: true,
			    		id						: "loginModal",
			    		className			: 'loginDialog'
			  }).show();

			  document.body.style.visibility = "visible";
			  
			  loadComboBoxes();
			  loadMenuEvents();

			  on(window, 'resize', function() { 
				  registry.byId('mainTabContainer').resize();
				});

			  parser.parse();
});

window.oncontextmenu = function(event) {
    event.preventDefault();
    event.stopPropagation();
    return false;
};

window.onbeforeunload = function(){
  	if(!window.doNotShowConfirmation){
        return "Are you sure you want to close Cindex?";
  	}
  	window.doNotShowConfirmation = false;
};


</script>
<!-- include custom widgets -->
<script src='/menu/menuEvents.js'></script>
<script src='/language/en_EN.js'></script>
<?php include ("core/php/config.properties.php"); ?>
<script src='/language/languageFunctions.js'></script>
<script src='/libraries/colors.js'></script>
<script src='/libraries/combobox.js'></script>
<script src='/libraries/formatters.js'></script>
<script src='/libraries/styling.js'></script>
<script src='/libraries/validation.js'></script>
<script src='/core/js/common.js'></script>
<script src='/core/js/webservice.js'></script>
<script src='/core/js/actions.js'></script>
<script src='/core/js/dojo.js'></script>
<script src='/core/js/date.js'></script>
<script src='/core/js/grid.js'></script>
<script src='/core/js/import.js'></script>
<script src='/core/mvc/ListModel.js'></script>
<script src='/core/mvc/DetailModel.js'></script>
<script src='/models/common/framework/Records.js'></script>
<script src='/modules/common/commonModels.js'></script>
<script src='/models/common/framework/commonModels.js'></script>
<script src='/core/js/encryptor.js'></script>

<!-- third-party scripts -->
<script type="text/javascript"
	src="/core/js/third-party/pidCrypt/pidcrypt.js"></script>
<script type="text/javascript"
	src="/core/js/third-party/pidCrypt/pidcrypt_util.js"></script>
<script type="text/javascript"
	src="/core/js/third-party/pidCrypt/asn1.js"></script>
<script type="text/javascript"
	src="/core/js/third-party/pidCrypt/jsbn.js"></script>
<script type="text/javascript"
	src="/core/js/third-party/pidCrypt/rng.js"></script>
<script type="text/javascript"
	src="/core/js/third-party/pidCrypt/prng4.js"></script>
<script type="text/javascript"
	src="/core/js/third-party/pidCrypt/rsa.js"></script> 
 

<?php 
// include language file
if (isset($_COOKIE['language']) && file_exists("language/{$_COOKIE['language']}.js"))
	echo "<script src='/language/{$_COOKIE['language']}.js'></script>";
else 
	echo "<script src='/language/en_EN.js'></script>";
?>
<title>ASIST Framework DEMO - {version}</title>
</head>
<body class="tundra" style="visibility: hidden;">
	<div data-dojo-type="dijit/layout/BorderContainer" id="mainLayout"
		data-dojo-props='liveSplitters : false'
		style="width: 100%; height: 100%;">
		<img src="images/toplogo.jpg" alt="Logo" class="toplogo" style="margin-right: 20px; margin-left: 20px; width:150px;" >
		<div data-dojo-type="dijit/layout/AccordionContainer" id="menu"
			data-dojo-props="region:'leading', splitter:true"
			style="width: 10%; height: 100%; margin-top: 50px;">
			<div data-dojo-type="dijit/layout/ContentPane" title="Favorites">
				<div id="favoriteMenuitems" data-dojo-id="favoriteMenuitems"></div>
			</div>
		    <?php
				foreach ( $menu as $key => $value ) {
					echo '<div data-dojo-type="dijit/layout/ContentPane" title="' . $key . '">';
					foreach ( $value as $k => $v ) {
						if (isset ( $roles ['admin'] [$v ['id']] ) && $roles ['admin'] [$v ['id']]) {
							echo '<div id="' . $v ['id'] . '" data-dojo-type="custom.CustomMenuItem" data-dojo-props="id: \'' . $v ['id'] . '\', title: \'' . $v ['title'] . '\', open: false"></div>';
						}
					}
					echo "</div>";
    		} 
		    ?>
	    </div>
		<div data-dojo-type="dijit/layout/TabContainer" data-dojo-props="region:'center',isLayoutContainer:true" id="mainTabContainer" style="width: 100%; height: 100%;">
			<div data-dojo-type="dijit/layout/ContentPane" title="Home">
				<iframe src="http://www.asist.be" width="98%" height="98%"></iframe>
			</div>
		</div>
	</div>
</body>
</html>