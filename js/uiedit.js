function loadinitialComponent()
{
	var nodes = scene.findNodes();
	var n;
	for (var i = 0;i < nodes.length; i++)
	{
		n = nodes[i].getType();
		n = n.split('/');
		if(n == "wall" || n == "roof" || n == "base")
		{
			
		}
		
	}
}

function ModifyComponent()
{
	//check what is picked
	var pickObj = getNodeName(pickObjId);
	if (pickObj== "window" || pickObj == "door" || pickObj == "interWall")//the pickObj can do translate modification
	{
		moveComponent(pickObj);
		disableController(getElem("SCALECONTROLL"));
	}
	else //the pickObj can do resize modification
	{
		resizeComponent();
		disableController(getElem("DRAGCONTROLL"));
	}
	
}
function resizeComponent()
{
	var node = getNodeType(pickObjId);
	var w = node.getWidth()*30;
	var h = node.getHeight()*30;
	var leftPoint = [hitPos.x-(w/2), hitPos.y-(h/2)];
	var scale = getElem("SCALECONTROLL");
	setStyle(scale,["width", "height", "left", "top", "display"],[pixel(w), pixel(h), pixel(leftPoint[0]), pixel(leftPoint[1]), "block"]);

	var scaleH = getElem("scaleHControll");
	var scaleV = getElem("scaleVControll");
	scaleH.style.width = scaleH.style.height =scaleV.style.width = scaleV.style.height = w/30 + "px";

	
	scaleH.style.display = "block";
	scaleV.style.display = "block";
	scaleController(node);
}



function scaleController(node)
{
	var scaleH = getElem("scaleHControll");
	var scaleV = getElem("scaleVControll");
	var scale = getElem("SCALECONTROLL");
	var targetH = null;	var targetV = null;
	var elemRectH = null;	var elemRectV = null;
	
	
	// events
	var MouseDownEvent = function(event)
	{
		isDraggEnabled = this.dataset.draggable;
		if(isDraggEnabled)
		{
			lastX = event.clientX//-parseFloat(scale.style.left);
			lastY = event.clientY//-parseFloat(scale.style.left);
			
			if(event.currentTarget.getAttribute('id') == "scaleHControll")
			{
				elemRectH = scaleH.getBoundingClientRect();
				targetH = scaleH;
			}
			else
			{
				elemRectV = scaleV.getBoundingClientRect();
				targetV = scaleV;
			}
		};
	};

	var MouseUpEvent = function(event)
	{
		targetH = null;
		elemRectH = null;
		targetV = null;
		elemRectV = null;
	};

	var MouseMoveEvent = function(event)
	{
		if (targetH) 
		{
			var shift = (event.clientX - lastX);
			targetH.style.left = pixel(parseFloat(targetH.style.left) + shift);
			scale.style.width = pixel(parseFloat(scale.style.width) + shift);
			lastX = event.clientX;
		};

		if (targetV)
		{
			var shift = (event.clientY - lastY);
			targetV.style.top = pixel(parseFloat(targetV.style.top));
			scale.style.top = pixel(parseFloat(scale.style.top) + shift);
			scale.style.height = pixel(parseFloat(scale.style.height) - shift);
			console.log(node.getHeight() - shift);
			//setObjectHeight(node,(node.getHeight() - shift),10);
			lastY = event.clientY;
			
			node.setHeight(node.getHeight() - shift);
			if(node.getLayer && node.getLayer() == 1){
				
			}else{
				if(node.setRealHeight){node.setRealHeight(node.getHeight() - shift);}
			}
			//heightpropertyValue.textContent=heightinput.value;
			//console.log('realHeight:',node.getRealHeight());
			console.log('getHeight:',node.getHeight())
			node.callBaseCalibration();
			dirty = true;
				
		}
	}
	
	var body = document.getElementsByTagName("body");
	scaleV.addEventListener('mousedown', MouseDownEvent);
	scaleH.addEventListener('mousedown', MouseDownEvent); 
	body[0].addEventListener('mouseup', MouseUpEvent);
	body[0].addEventListener('mousemove', MouseMoveEvent);
}

function heightChange(node)
{
	
}
function moveComponent(pickObj)
{
	var W;	var H;
	if (pickObj == "window")
	{
		W = 4;
		H = 4;
	}
	else
	{
		W = getNodeType(pickObjId).getWidth();
		H = getNodeType(pickObjId).getHeight();
	}
		
	var leftPoint = [hitPos.x-W, hitPos.y-H];
	DragController(leftPoint);			
}
function DragController(point)
{
	dragControll = getElem("DRAGCONTROLL");

	var target = null;
	var elementRect = null;
	var body = document.getElementsByTagName("body");
	dragControll.style.left = point[0] + "px";
	dragControll.style.top = point[1] + "px";
	dragControll.style.display = "block";
	dragControll.addEventListener('mousedown', function(event)
	{
		isDraggEnabled = this.dataset.draggable;
		if(isDraggEnabled)
		{
			lastX = event.clientX;
			lastY = event.clientY;
			
			elementRect = dragControll.getBoundingClientRect();
			target = dragControll;
		};
	});
	body[0].addEventListener('mouseup',function(event)
	{
		target = null;
		elementRect = null;
	});

	body[0].addEventListener('mousemove',function(event)
	{
		if (target) 
		{
			target.style.left = (elementRect.left + event.clientX - lastX) + "px";
			target.style.top = (elementRect.top + event.clientY - lastY) + "px";
		};     
	});
}

function disableController(controller)
{
	controller.style.left = "";
	controller.style.top = "";
	controller.style.display = "none";

}
function findRelativeWall(Id)
{
	var wallId = getWallID;
	var windowId = getWindowID;
	var index = windowId.indexOf(Id);
	return wallId[index];
}