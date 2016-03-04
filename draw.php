<html lang = "en">
<head>
	<meta charset = "utf-8">
	<meta http-equiv = "X-UA-Compatible" content = "IE=edge">
	<meta name="viewport" content="width=device-width, user-scalable=no" />
	<meta name="mobile-web-app-capable" content="yes" /> 
	<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">


	<title>3D House - Draw</title>
	
	<link href = "css/reset.css" rel = "stylesheet">
	<link href = "css/style.css" rel = "stylesheet">
    <link href = "css/default.css" rel = "stylesheet">
    <link rel="stylesheet" href="http://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.4.0/css/font-awesome.min.css">
	<script src = "js/scenejs.js"></script>
	<script src = "js/paramanager.js"></script>
	<script src = "js/ui.js"></script>
    <script src = "js/utility.js"></script>
    <script src = "js/layout.js"></script>
    <script src = "js/interact.js"></script>
    <script src = "js/ModelConverter.js"></script>
    <script src = "js/superXReProduction.js"></script>

	<?php
		include	"HouseXML.php";
		
		$OpenSuccess = false;				//確定有沒有打開成功
		$ErrorStr = "";
		
		if(isset($_GET["XML"]))
		{
			$FileLocation = "./xml/".$_GET["XML"].".xml";
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
	
    <div id = "Top" class = "top bar">
        <ul>
            <li><i class = "fa fa-caret-square-o-down" onclick = "ExportClick()">  Export</i></li>
            <div id = "ExportContent" class = "subcontent">
                <p><i onclick="multiObjButtonFunc()">Export as multiple .obj</i></p>
                <p><i onclick="oneObjButtonFunc()">Export as one .obj</i></p>
                <p><i onclick="multiStlButtonFunc()">Export as multiple .stl</i></p>
                <p><i onclick="oneStlButtonFunc()">Export as one .stl</i></p>
                <p><i class="fa fa-times" onclick = "CloseExport()">  close</i></p>
            </div>
            <li><i class = "fa fa-file">  Save</i></li>
        </ul>
    </div>
	
	<div id="codewrapper" style="display: none" >
        <div id="srcbutton">
            <div id="dragsquare" data-draggable="true"></div>
            <p> source </p>
        </div>
        <div id="uiarea">
        	<input type="checkbox" id = "powerEditMode" checked = true>要不要啟動強力編輯模式<br>
        </div>            
    </div>
	<input type="button" class="RightUpButton" value="關閉貼圖" onclick="textureToggle()">
	<input type="button" class="RightUpButton" style="top: 100;right: 20; " value="新增牆壁" onclick="addInterWall()">
	<input type="button" class="RightUpButton" style="top: 150;right: 20; " value="新增樓層" onclick="addBase()">
	<input type="button" class="RightUpButton" style="top: 200;right: 20; " value="刪除樓層" onclick="deleteBase()">
	<input type="button" class="RightUpButton" style="top: 250;right: 20; " value="儲存XML" onclick="saveXML()">
	<!--<input type="button" class="RightUpButton" style="top: 300;right: 20; background: #FF5555" value="!!!!!!!" onclick="RedButtonClick()">-->
	<!--<input type="button" class="MultiObjButtonStyle" value="Export as multiple .obj" onclick="multiObjButtonFunc()">
	<input type="button" class="OneObjButtonStyle" value="Export as one .obj" onclick="oneObjButtonFunc()">
	<input type="button" class="MultiStlButtonStyle" value="Export as multiple .stl" onclick="multiStlButtonFunc()">
	<input type="button" class="OneStlButtonStyle" value="Export as one .stl" onclick="oneStlButtonFunc()">-->
	
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
            <img src = "./images/decorate.png">
        </div>
        
        <div id = "Mainbtn" class = "bottom btn main" onclick = "MainbtnClick()">
            <img id = "mainbtnimg" src = "./images/add.png">
        </div>
        
        <div id = "SubToolbar" class = "bottom bar">
            <ul id = "SubToolbarContent">
                
                <li id = "SubToolbarClose" style = "float: right;"><img src = "./images/cross2.png" onclick = "CloseSubToolbarClick()"></li>
            </ul>
        </div>
        
        <div id = "Toolbar" class = "bottom bar">
            <ul>
                <li><img src = "./images/icon-window.png"></li>
                <li><img src = "./images/icon-door.png"></li>
                <li><img src = "./images/icon-roof.png" onclick = "RoofClick()"></li>
                <li style = "float: right;"><img src = "./images/cross2.png" onclick = "CloseToolbarClick()"></li>
            </ul>
        </div>
    </div>
</body>
</html>
</html>
