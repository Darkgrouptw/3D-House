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
		
	}
	
}

function moveComponent(pickObj)
{
	var W;	var H;
	if (pickObj == "window")
	{
		W = 4;
		H = 4;
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
}
function findRelativeWall(Id)
{
	var wallId = getWallID;
	var windowId = getWindowID;
	var index = windowId.indexOf(Id);
	return wallId[index];
}