var percentage;
var total = 8;
function setLayout()
{
	var Width = window.innerWidth;
	var Height = window.innerHeight;
	percentage = document.getElementById("percentage");
	percentage.style.fontSize = 0.05*Height + "px";
	setInterval(sendingRequest, 3*1000);
	setInterval(sendingDetailRequest, 3*1000);
	table = getElem("DETAIL");
	table.style.fontSize = 0.05*Height + "px";
}
var result = null;
var xmlHttp = null;
var url = "http://140.118.155.219/login.php?username=ac&password=ac";
var obj; var progress;
function sendingRequest()
{
	xmlHttp = new XMLHttpRequest();
	xmlHttp.onreadystatechange = function()
	{
		if(xmlHttp.readyState == 4 && xmlHttp.status == 200)
		{
			result = xmlHttp.responseText;
			obj = JSON.parse(result);
			//assume obj[0]
			user = obj[0];
			progressV = (user["剩餘任務量"]/user["任務量"])*100;
			total = user["任務量"];
			showProgress(percentage, progressV);
		}
	};
	
	xmlHttp.open("GET", url, true);
	xmlHttp.send(null);

}

var detailResult = null;
var detailurl;
var ComponentV = [];
function sendingDetailRequest()
{
	for (var i = 0;i <= total; i++)
	{
		progressListener(i);
	}
	showDetailProgress();
}

function progressListener(i) {
	
	detailurl = "http://140.118.155.219/subtaskprogress.php?username=ac&task_name=model&numofparts=" + i.toString();

	var xmlHttpDetail = new XMLHttpRequest();
	xmlHttpDetail.onreadystatechange = function()
	{
		if(xmlHttpDetail.readyState == 4 && xmlHttpDetail.status == 200)
		{
		detailResult = xmlHttpDetail.responseText;
		detailResult = detailResult.substr(2, detailResult.length);
		detail = JSON.parse(detailResult);
		value = detail["done_of_slices_and_black"]/detail["num_of_slices_and_black"];
		ComponentV[i] = (value*100).toFixed(2);	
		
		}
	};
	xmlHttpDetail.open("GET",detailurl,true);
	xmlHttpDetail.send(null);
}

function showProgress(elem, value)
{
	setStyle(elem,["width","display"], [value + "%", "block"]);
	elem.innerHTML = value + "%";
}
function showDetailProgress()
{
	if (ComponentV.length > 0)
	{
		var rf_v = getElem("roof_V");
		var wallL_V = getElem("wallL_V");
		var wallR_V = getElem("wallR_V");
		var wallB_V = getElem("wallB_V");
		var interwall_V = getElem("interwall_V");
		var base_V = getElem("base_V");
		rf_v.innerHTML = ComponentV[3] + "%";
		wallL_V.innerHTML = ComponentV[4] + "%";
		wallR_V.innerHTML = ComponentV[5] + "%";
		wallB_V.innerHTML = ComponentV[6] + "%";
		interwall_V.innerHTML = ComponentV[7] + "%";
		base_V.innerHTML = ComponentV[8] + "%";
	}
	
}