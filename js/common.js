//This is for General function and some global variable

function getElem(ID)
{
	return document.getElementById(ID);
}

function getSubElem(Elem,strTag)
{
	return Elem.getElementsByTagName(strTag);
}
function getElemByClass(ClassName)
{
	return document.getElementsByClassName(ClassName);
}
function getElemByName(Name)
{
	return document.getElementsByName(Name);
}
function getStyle(ID)
{
	return document.getElementById(ID).style;
}

function createElem(Elem)
{
	return document.createElement(Elem);
}

function createTextNode(Content)
{
	return document.createTextNode(Content);
}

//Component
var FloorTab, FuncBar, PartBar, TrashCan, Modal, ExportMenu;
var PropertyFT, ValueFT, PropertyPBul, ValuePBli, PropertyPBimgclose, PropertyPBContent, Propertycloseli,Valuecloseli,RefSize;
var Height,Width;//window size

var Orientation = -1;
var Func_click_flag, Export_click_flag;