function ModifyComponent()
{
	//check what is picked
	var pickObj = getNodeName(pickObjId);
	if (pickObj== "window" || pickObj == "door" || pickObj == "interWall")//the pickObj can do translate modification
	{
		moveComponent(pickObj);
	}
	else //the pickObj can do resize modification
	{
		resizeComponent();
	}
	
}
function resizeComponent()
{
	var node = getNodeType(pickObjId);
	var w = node.getWidth()*30;
	var h = node.getHeight()*30;
	var leftPoint = [hitPos.x-(w/2), hitPos.y-(h/2)];
	var scale = getElem("SCALECONTROLL");
	scale.style.width = w + "px";
	scale.style.height = h + "px";
	scale.style.left = leftPoint[0] + "px";
	scale.style.top = leftPoint[1] + "px";
	scale.style.display = "block";
	var scaleH = getElem("scaleHControll");
	var scaleV = getElem("scaleVControll");
	scaleH.style.width = scaleH.style.height =scaleV.style.width = scaleV.style.height = w/30 + "px";
	scaleH.style.top = h/2 +"px";
	scaleH.style.left = w-5 +"px";
	scaleV.style.top = -(w/20)-5+ "px";
	scaleV.style.left = w/2 + "px";
	scaleH.style.display = "block";
	scaleV.style.display = "block";
	scaleController();
}



function scaleController()
{
	var scaleH = getElem("scaleHControll");
	var scaleV = getElem("scaleVControll");
	var scale = getElem("SCALECONTROLL");
	var targetH = null;	var targetV = null;
	var elemRectH = null;	var elemRectV = null;
	
	var pixel = function(v) { return v + "px"; };
	
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
			lastY = event.clientY;
		}
	}
	
	var body = document.getElementsByTagName("body");
	scaleV.addEventListener('mousedown', MouseDownEvent);
	scaleH.addEventListener('mousedown', MouseDownEvent); /*function(event)
	{
		isDraggEnabled = this.dataset.draggable;
		if(isDraggEnabled)
		{
			lastX = event.clientX//-parseFloat(scale.style.left);
			lastY = event.clientY//-parseFloat(scale.style.left);
			
			//console.log('lastX',lastX);
			//lastY = event.clientY;
			//scaleH.style.left = lastX;
			elemRectH = scaleH.getBoundingClientRect();
			targetH = scaleH;
		};
	});*/
	body[0].addEventListener('mouseup', MouseUpEvent);/*function(event)
	{
		targetH = null;
		elemRectH = null;
	});*/

	body[0].addEventListener('mousemove', MouseMoveEvent);/*function(event)
	{
		if (targetH) 
		{
			//console.log('elemRectH',elemRectH.left,'clientX',event.clientX,'lastX',lastX);
			//targetH.style.left = (elemRectH.left + event.clientX - lastX) + "px";
			targetH.style.left = (event.clientX - lastX) + (parseFloat(scale.style.width) - 5) + "px";
			
			//targetH.style.top = (elemRectH.top + event.clientY - lastY) + "px";
		};

		if (targetV)
		{
			targetV.style.top = (event.clientY - lastY) + (parseFloat(scale.style.height) - 5) + "px";
		}
	});*/
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

function disableAllController()
{
	var dragger = getElem("DRAGCONTROLL");
	dragger.style.left = "";
	dragger.style.top = "";
	dragger.style.display = "none";
	
	var scale = getElem("SCALECONTROLL");
	scale.style.left = "";
	scale.style.top = "";
	scale.style.display = "none";
}
function findRelativeWall(Id)
{
	var wallId = getWallID;
	var windowId = getWindowID;
	var index = windowId.indexOf(Id);
	return wallId[index];
}