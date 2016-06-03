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

function isEmpty(myObject) {
    for(var key in myObject) {
        if (myObject.hasOwnProperty(key)) {
            return false;
        }
    }

    return true;
}
function setStyle(Elem, Property, Value)
{
	for (var i = 0; i< Property.length; i++)
	{
		Elem.style[Property[i]] = Value[i];
	}
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

function pixel(v) { return v + "px"; };
//Component
var FloorTab, FuncBar, PartBar, TrashCan, Modal, ExportMenu, ScreenController, Mode;
var PropertyFT, ValueFT, PropertyPBul, ValuePBli, PropertyPBimgclose, PropertyPBContent, Propertycloseli,Valuecloseli,RefSize;
var Height,Width;//window size
var pickObjId;  var dragControll;
var Orientation = -1;
var Func_click_flag, Export_click_flag;
var watchmode = 0;
var partmode = -1;