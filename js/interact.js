function showstate()
{
	if(watchmode)
	{
		Mode.className = "fa fa-eye";
	}
	else
	{
		Mode.className = "fa fa-pencil-square-o";
	}
			
}
var fullScreenflag = 0;
function ScreenControll()
{
	fullScreenflag = !fullScreenflag;
	if(fullScreenflag)
	{
		ScreenController.className = "fa fa-compress";
		toggleFullScreen();
	}
	else
	{
		ScreenController.className = "fa fa-arrows-alt";
		toggleFullScreen();
	}
}
function toggleFullScreen()
{
    var doc = window.document;
    var docel = doc.documentElement;

    var requestFullScreen = docel.requestFullscreen || docel.mozRequestFullScreen || docel.webkitRequestFullScreen;
    var cancelFullScreen = doc.exitFullscreen || doc.mozCancelFullScreen || doc.webkitExitFullscreen;

    if(!doc.fullscreenElement && !doc.mozFullScreenElement && !doc.webkitFullscreenElement)
    {
        requestFullScreen.call(docel);
    }
    else { cancelFullScreen.call(doc);  }
}
//This is for interact ex:click

var TabAmount = 1;// 樓層數初始為一層 屋頂是第0層
var SelectId = 0; // 選取的樓層初始為0(屋頂)

function selectTab(id){
	var Selected = getElem(id);
	for (var i = 0; i <= TabAmount; i++){
		getElem(i.toString()).className = "General";
	}
	Selected.className = "Selected";
	SelectId = parseInt(id);
}

function addTab(){
	TabAmount++;
	var ul = getElem("Tab");
	var plus = getElem("plus");
	var liElem = createElem("li");
	liElem.id = TabAmount.toString();
	liElem.onclick = function(){selectTab(liElem.id)};
	var text = createTextNode(TabAmount.toString() + "F");
	liElem.appendChild(text);
	ul.insertBefore(liElem, plus);
	selectTab(liElem.id);
	setFloorTab(PropertyFT,ValueFT);
	addBase();
}

function deleteTab(){
	var ul = getElem("Tab");
	if (TabAmount > 1){ //只剩一層樓時不能刪除
		ul.removeChild(getElem(SelectId.toString()));
		if (SelectId == TabAmount){
			TabAmount--;
			selectTab(SelectId - 1);
		}
		else{
			//resort
			var tab;
			for (var i = SelectId + 1;i <= TabAmount; i++){
				tab = getElem(i.toString());
				tab.id = (i-1).toString();
				tab.innerHTML = tab.id + "F"  ;
			}
			TabAmount--;
			selectTab(SelectId);
		}
	}
	deleteBase();
}

//For FuncBar

function ExportClick()
{
	Export_click_flag = !Export_click_flag;
	ExportMenu.style.display = "block";
	setInvisibleFuncBar();
}

function closeExportMenu()
{
	ExportMenu.style.display = "none";
	Modal.display = "none";
	Export_click_flag = 0;
	setOriFuncBar();
}

function PartClick()
{
	setOriPartBar();
	setInvisibleFuncBar();
}
//For PartBar
var totalPart = [10, 10, 9];//0-window 1-door 2-roof
var flag = [0, 0, 0];//0-window 1-door 2-roof
function componentClick(id){
	id = id.split("")[id.length-1];
	var AddElem = function(id, Elemindex, MajorElem,BeforeElem){
		partmode = parseInt(id);
		var liElem = createElem("li");
		liElem.id = id + Elemindex.toString();
		liElem.onclick = function(){subPartClick(liElem.id)};
		var content = createElem("img");
		content.src = "./images/Part" +id+"/"+Elemindex.toString()+".png";
		liElem.appendChild(content);
		if(!BeforeElem){
		MajorElem.appendChild(liElem);
		}
		else{
		MajorElem.insertBefore(liElem, BeforeElem);
		}
		
	}
	if(!flag[id]){
		var fixed = getElem("fixed");
		var content = getElem("content");
		var BeforeElem = getElem("SubClose");
		AddElem(id, 0, fixed, BeforeElem);
		for(var i = 1;i <= totalPart[id]; i++){
			AddElem(id, i, content, 0);
		}
		flag[id] = false;
	}
	setPartBar(Math.max(Width,Height), PropertyPBul, ValuePBli, PropertyPBimgclose, PropertyPBContent,Propertycloseli,Valuecloseli)	
	getStyle("subPartBar").display = "block";
	
}
function subPartClick(id){
	console.log(id);
}

function closePartBar(id){
	var Bar = getStyle(id);
	Bar.display = "none";
	//clear subPartBar
	var fixed = getElem("fixed");
	while(fixed.childElementCount > 1){
		fixed.removeChild(fixed.firstElementChild);
	}	
	var content = getElem("content");
	while(content.hasChildNodes()){
		content.removeChild(content.lastChild);
	}
	//show FuncBar
	if(id == "mainPartBar"){
		setInvisiblePartBar();
		setOriFuncBar();
	}
	else
	{
		partmode = -1;
	}
	//click_flag = 0;
	
}



var Texture_flag = 0;
function TextureClick()
{
	var Texture = getStyle('Texture');
	Texture_flag = !Texture_flag;
	if(Texture_flag)
		Texture.backgroundColor = "rgb(247,202,24)";
	else
		Texture.backgroundColor = "rgba(34,167,240,0.6)";
	textureToggle();
}