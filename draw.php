<html lang = "en">
<head>
	<meta charset = "utf-8">
	<meta http-equiv = "X-UA-Compatible" content = "IE=edge">
	<meta name = "viewport" content = "width=device-width, initial-scale=1">
	
	<title>3D House - Draw</title>
	
	<link href = "css/reset.css" rel = "stylesheet">
	<link href = "css/style.css" rel = "stylesheet">
    <link href = "css/default.css" rel = "stylesheet">
	<script src = "js/scenejs.js"></script>
	<script src="js/ui.js"></script>
    <script src = "js/utility.js"></script>
    <script src = "js/layout.js"></script>
    <script src = "js/interact.js"></script>
    <script src = "js/ModelConverter.js"></script>

	<?php
		include	"HouseXML.php";
		
		$OpenSuccess = false;				//確定有沒有打開成功
		$ErrorStr = "";
		
		if(isset($_GET["XML"]))
		{
			$FileLocation = "./XML/".$_GET["XML"].".xml";
			if(file_exists($FileLocation))
			{
				$XML = new HouseXML();
				$XML->init($FileLocation);
				$OpenSuccess = true;
				//echo "<script src = 'js/setup.js'></script>\n";
			}
			else
				$ErrorStr = "檔案不存在";
		}
		else
			$ErrorStr = "請輸入要讀的XML檔案";
		
		function PrintError($str)
		{
			echo "<h2 style = 'text-align:center'><font color = 'white'>".$str."</font></h2>";
		}
		
	?>
<?php
	//header('Location: login.php');
	//exit;
?>
</head>
<body onresize = "setlayout()" onload = "setlayout()">
	<div id="codewrapper" style="display: none" >
        <div id="srcbutton">
            <div id="dragsquare" data-draggable="true"></div>
            <p> source </p>
        </div>
        <div id="uiarea">
        </div>            
    </div>
    <div id = "Top"></div>
	
	<input type="button" class="RightUpButton" value="關閉貼圖" onclick="textureToggle()">
	<input type="button" class="MultiObjButtonStyle" value="Export as multiple .obj" onclick="multiObjButtonFunc()">
	<input type="button" class="OneObjButtonStyle" value="Export as one .obj" onclick="oneObjButtonFunc()">
	<input type="button" class="MultiStlButtonStyle" value="Export as multiple .stl" onclick="multiStlButtonFunc()">
	<input type="button" class="OneStlButtonStyle" value="Export as one .stl" onclick="oneStlButtonFunc()">
	
    <div id = "Main" class = "maincanvas">
	<?php
		if($OpenSuccess)
		{
			echo "<canvas id = \"archcanvas\"></canvas>";
			echo $XML->Draw();
		}
		else
			PrintError($ErrorStr);
	?>
    </div>
	<div id = "Bottom">
        <div id = "Subaddbtn" class = "bottom btn sub">
            <img src = "./images/addfloor.png">
        </div>
        
        <div id = "Subdecoratebtn" class = "bottom btn sub" onclick = "SubdecoratebtnClick()">
            <img src = "./Images/decorate.png">
        </div>
        
        <div id = "Mainbtn" class = "bottom btn main" onclick = "MainbtnClick()">
            <img id = "mainbtnimg" src = "./Images/add.png">
        </div>
        
        <div id = "Toolbar" class = "bottom bar">
            <ul>
                <li><img src = "./Images/icon-window.png"></li>
                <li><img src = "./Images/icon-door.png"></li>
                <li><img src = "./Images/icon-roof.png"></li>
                <li style = "float: right;"><img src = "./images/cross2.png" onclick = "CloseToolbarClick()"></li>
            </ul>
        </div>
    </div>
</body>
</html>
</html>