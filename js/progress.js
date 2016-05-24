var percentage;
function setLayout()
{
	var Width = window.innerWidth;
	var Height = window.innerHeight;
	percentage = document.getElementById("percentage");
	percentage.style.fontSize = 0.05*Height + "px";
	setInterval(sendingRequest, 3*1000);
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
			progress = (user["剩餘任務量"]/user["任務量"])*100;
			percentage.style.width = progress + "%";
			percentage.innerHTML = progress + "%";
			percentage.style.display = "block";
		}
	};
	
	xmlHttp.open("GET", url, true);
	xmlHttp.send(null);

}