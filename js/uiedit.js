function moveComponent()
{
	//pick check
	//picksomething
	if(pickObjId)
	{
		var componentType = getNodeName(pickObjId);
		if(componentType == "window")//pick what
		{
			
			var windowCenter = getNodeCenter(pickObjId);
			var X = windowCenter[0];
			var Y = windowCenter[1];
			var W = 4;
			var H = 4;
			var leftPoint = [hitPos.x-W, hitPos.y-H];
			console.log(leftPoint);
			/* document.getElementsByTagName("body")[0].addEventListener('mousedown',function(event)
			{
				console.log(event.clientX);
				console.log(event.clientY);
			}); */
			DragController(leftPoint);			
		}
		else
		{
			DragController(null); 
		}		
	}
	else
	{
		DragController(null);
	}
	
	
}
function DragController(point)
{
	dragControll = getElem("DRAGCONTROLL");
	if(point)
	{
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
	else
	{
		dragControll.style.left = "";
		dragControll.style.top = "";
		dragControll.style.display = "none";
	}
	
}
function findRelativeWall(Id)
{
	var wallId = getWallID;
	var windowId = getWindowID;
	var index = windowId.indexOf(Id);
	return wallId[index];
}