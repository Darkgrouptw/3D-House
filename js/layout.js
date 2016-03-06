//This is for layout setting
function initial()
{
	FloorTab = getElem("FLOORTAB");
	FuncBar = getElem("FUNCBAR");
	PartBar = getElem("PARTBAR");
	TrashCan = getElem("TRASHCAN");
	Modal = getStyle("MODAL");
	ExportMenu = getElem("EXPORTMENU");
	setLayout();
}
function setLayout()//This function will run while onload and onresize
{
	Width = window.innerWidth;
	Height = window.innerHeight;
	changeSize(getElem('archcanvas'),Width,Height);
	setComponent();	
}

function setComponent()
{
	var RefSize;
	if (Width > Height)//Horizontal
	{
		//1.change component size
		changeSize(FloorTab, 0.05*Width, 0.95*Height);
		changeSize(PartBar, 0.085*Width, Height);
		RefSize = Width;
		//2 for FloorTab Property / Value
		PropertyFT = ["font-size", "display","padding-top","padding-left"];
		ValueFT = [0.03*Width + "px", "block", 0.015*Width + "px", 0.01*Width + "px"];
		//3 for PartBar Property / Value
		PropertyPBul = "marginLeft";
		ValuePBli = "block";
		PropertyPBimgclose = ["bottom", "left", "width", "height"];
		PropertyPBContent = ["maxHeight", "top", "overflowX"];
		Propertycloseli = "paddingTop";
		Valuecloseli = Height - 0.07*Width;
	}
	else//Vertical
	{
		//1.change component size
		changeSize(FloorTab, Width, 0.05*Height);
		changeSize(PartBar, Width, 0.085*Height);
		RefSize = Height;
		//2 for FloorTab Property / Value
		PropertyFT = ["font-size", "display", "padding-left","line-height"];
		ValueFT = [0.03*Height + "px", "inline-block", 0.015*Height + "px", 0.05*Height + "px"];
		//3 for PartBar Property / Value
		PropertyPBul = "marginTop";
		ValuePBli = "inline-block";
		PropertyPBimgclose = ["top", "right", "width", "height"];
		PropertyPBContent = ["maxWidth", "left", "overflowY"];
		Propertycloseli = "paddingLeft";
		Valuecloseli = Width - 0.07*Height;
	}
	changeSize(FuncBar, -1, 0.25*RefSize);
	
	setFloorTab(PropertyFT,ValueFT);
	setPartBar(RefSize, PropertyPBul, ValuePBli, PropertyPBimgclose,PropertyPBContent,Propertycloseli,Valuecloseli);
	
	setMultiStyle(getElemByClass("funcsquare"),["width","height"], [0.12*RefSize + "px", 0.12*RefSize + "px"]);
	setMultiStyle(getSubElem(FuncBar,"p"), ["textAlign", "verticalAlign", "fontSize", "lineHeight"], ["center", "middile", 0.03*RefSize + "px", 0.12*RefSize + "px"]);
	setExportMenu();
	setTrashCan();
}
function setFloorTab(Property,Value)
{
	rmvStyle(getSubElem(FloorTab,"li"));
	setMultiStyle(getSubElem(FloorTab,"li"),Property,Value);
}
function setPartBar(RefSize, PropertyPBul, ValuePBli, PropertyPBimgclose, PropertyPBContent,Propertycloseli,Valuecloseli)
{
	rmvStyle(getElemByName("ImgClose"));
	setMultiStyle(getSubElem(PartBar,"img"),["width","height"],[0.07*RefSize + "px", 0.07*RefSize + "px"]);
	setMultiStyle(getSubElem(PartBar,"ul"), PropertyPBul, 0.01*RefSize + "px");
	setMultiStyle(getSubElem(PartBar,"li"), "display", ValuePBli);
	setMultiStyle(getElemByName("ImgClose"),PropertyPBimgclose,["0%", "0%", 0.032*RefSize, 0.032*RefSize]);
	getElem("content").style[PropertyPBContent[0]] = 5*0.07*RefSize + "px";
	getElem("content").style[PropertyPBContent[1]] = 0.07*RefSize + "px";
	getElem("content").style[PropertyPBContent[2]]= "hidden";
	getElem("SubClose").style[Propertycloseli] = Valuecloseli + "px";
	
}
function setExportMenu()
{
	changeSize(ExportMenu,0.25*Width,0.25*Height);
	RefSize = Math.min(Width,Height);
	setMultiStyle(getSubElem(ExportMenu,"h1"),"font-size",0.03*RefSize + "px");
	setMultiStyle(getSubElem(ExportMenu,"h2"),["font-size","line-height"],[0.02*RefSize + "px", 0.04*RefSize + "px"]);
}
function setTrashCan()
{
	changeSize(TrashCan, 0.05*Height, 0.05*Height);
	setMultiStyle(getSubElem(TrashCan,"i"),["font-size"], [0.05*Height + "px"]);
}

function setMultiStyle(Elem,Property,Value)
{

	if(typeof Property == "object")
	{
		for (var i = 0;i < Elem.length;i++)
		{
			for (var j = 0;j < Property.length;j++)
			{
			Elem[i].style[Property[j]] = Value[j];
			}
		}
	}
	else
	{
		for(var i = 0;i < Elem.length;i++)
		{
			Elem[i].style[Property] = Value;
		}
		
	}
}
function rmvStyle(Elem)
{
	for(var i = 0;i < Elem.length;i++)
	{
		Elem[i].removeAttribute("style");
	}
}

function changeSize(Elem, W, H)
{
	if(W != -1)
	{
		Elem.style.width = W + "px";
	}
	if(H != -1)
	{
		Elem.style.height = H + "px";
	}
}

function setInvisibleFuncBar()
{
	setMultiStyle(getElemByClass("funcsquare"), "display","none");
}
function setOriFuncBar()
{
	Func_click_flag = 0;
	setInvisibleFuncBar();
	var FileArea = getElem("File_close");
	var File = getElem("File");
	var EditArea = getElem("Edit_close");
	var Edit = getElem("Edit");
	FileArea.style.display = EditArea.style.display = "block";
	FileArea.style.backgroundColor = EditArea.style.backgroundColor = "rgba(34, 167, 240, 0.6)";
	File.innerHTML = "File";
	Edit.innerHTML = "Edit";
}

function setInvisiblePartBar()
{
	PartBar.style.display = "none";
	getElem("mainPartBar").style.display = "none";
	getElem("subPartBar").style.display = "none";
}
function setOriPartBar()
{
	Modal.display = "none";
	PartBar.style.display = "block";
	getElem("mainPartBar").style.display = "block";
	getElem("subPartBar").style.display = "none";
}
