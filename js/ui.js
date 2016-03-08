var go = true;
function UIinit(boolFlag)
{
    console.log('what did you done');
    if(!boolFlag) 
    {
        var codeWrapper = document.getElementById('codewrapper');
        codeWrapper.style.display = 'none';
        return;
    }
    
    var target = null;
    var lastX = 0;
    var lastY = 0;
    var elementRect = null;
    var dragButton = document.getElementById('dragsquare');
    var srcButton = document.getElementById('srcbutton')
    var codeWrapper = document.getElementById('codewrapper');
    var body = document.getElementsByTagName('body');
    
    // Source window could be drag
    dragButton.addEventListener('mousedown', function(event)
    {
        isDraggEnabled = this.dataset.draggable;
        if(isDraggEnabled)
        {
            lastX = event.clientX;
            lastY = event.clientY;
            
            elementRect = codeWrapper.getBoundingClientRect();
            
            target = codeWrapper;
        };
    });
    AddEventListenerList(body, 'mouseup', function(event) 
    {
        target = null;
        elementRect = null;
    });
    
    AddEventListenerList(body, 'mousemove', function(event) 
    {
        if (target) 
        {
            target.style.left = (elementRect.left + event.clientX - lastX) + "px";
            target.style.top = (elementRect.top + event.clientY - lastY) + "px";
        };     
    });
    
    var openFlag = true, timer; 
    srcButton.addEventListener('dblclick', function()
    {
        openFlag = !openFlag;
        var codeBlock = document.getElementById('uiarea');
        
        if(openFlag) { codeBlock.style.display = 'inline-block'; }
        else { codeBlock.style.display = 'none'; }
    });

    timeFuction();
}
function AddEventListenerList(list, event, functor)
{
    for(var i = 0; i < list.length; i++) { list[i].addEventListener(event, functor, false); }
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

var lastid=-1;
var lastFloor = -1;
var uiPanel;
var tmpNormal = null;
var camDist = null;
var isLock = false;
var isRotation = true;
function ScenePick(){
    var firstX;
    var firstY;
    var secondX;
    var secondY;
    
    var lastTime;
    var objectId = null;
    var pickNode = null;
    
    var canvas = scene.getCanvas();

    canvas.addEventListener('mousedown',
            function (event) {
                tmpNormal = null;
                camDist = null;

                firstX = event.clientX;
                firstY = event.clientY;
            }, true);

    canvas.addEventListener('mouseup',
            function (event) {

                if(event.clientX == firstX && event.clientY == firstY)
                {
                    scene.pick(event.clientX, event.clientY, {rayPick: true});
                    if(lastid == -1 && lastFloor == -1){
                        setAllTheElementPickable();
                        scene.pick(event.clientX, event.clientY, {rayPick: true});
                    }
                }

            }, true);

    canvas.addEventListener('touchstart',
            function (event) {
                tmpNormal = null;
                camDist = null;
                
                if(event.targetTouches.length != 1)
                {
                    firstX = event.targetTouches[0].clientX;
                    firstY = event.targetTouches[0].clientX;
                    secondX = event.targetTouches[1].clientX;
                    secondY = event.targetTouches[1].clientX;
                }
                else
                {
                    firstX = event.targetTouches[0].clientX;
                    firstY = event.targetTouches[0].clientY;
                }
				
            }, true);

    canvas.addEventListener('touchend',
            function (event) {
                
                if(event.targetTouches[0].clientX == firstX && event.targetTouches[0].clientY == firstY)
                {
                    scene.pick(event.targetTouches[0].clientX, event.targetTouches[0].clientY, {rayPick: true});
                    if(lastid == -1 && lastFloor == -1){
                        setAllTheElementPickable();
                        scene.pick(event.targetTouches[0].clientX, event.targetTouches[0].clientY, {rayPick: true});
                    }
                }
                
            }, true);
			
	canvas.addEventListener('touchmove',
            function (event) {

                var currentAxis = getAxis();
                if(event.targetTouches.length != 1)
                {
                    var posX = event.targetTouches[0].clientX;
                    var posY = event.targetTouches[0].clientY;
                    var pos1X = event.targetTouches[1].clientX;
                    var pos1Y = event.targetTouches[1].clientY;

                    var firstLength = Math.sqrt((firstX - secondX) * (firstX - secondX) + (firstY - secondY) * (firstY - secondY));
                    var secondLength = Math.sqrt((posX - pos1X) * (posX - pos1X) + (posY - pos1Y) * (posY - pos1Y));
                    var compareLength = (secondLength - firstLength);
                    
                    var vecA = [];
                    var VecB = [];
                    if(pos1Y > posY)
                    {
                        vecA.push(pos1X - posX);
                        vecA.push(pos1Y - posY);
                        VecB.push(pos1X - posX);
                        VecB.push(0);
                    }
                    else
                    {
                        vecA.push(posX - pos1X);
                        vecA.push(posY - pos1Y);
                        VecB.push(posX - pos1X);
                        VecB.push(0);
                    }
                    var scaleCos = (vecA[0]*VecB[0] + vecA[1]*VecB[1]) / 
                                ( Math.sqrt(vecA[0]*vecA[0] + vecA[1]*vecA[1]) * Math.sqrt(VecB[0]*VecB[0] + VecB[1]*VecB[1] ) );  
                    
                    if(scaleCos < (1 / Math.sqrt(2)) && scaleCos >= 0 )
                    {
                        //Vertical
                        verticalAxis(objectId, compareLength, currentAxis);
                    }
                    else if(scaleCos >= (1 / Math.sqrt(2)) && scaleCos <= 1)
                    {
                        //Horizontal
                        horizontalAxis(objectId, compareLength, currentAxis);
                    }

                    firstX = posX;
                    firstY = posY;
                    secondX = pos1X;
                    secondY = pos1Y;
                }
                else
                {
                    var posX = event.targetTouches[0].clientX;
                    var posY = event.targetTouches[0].clientY;

                    var vecC = [];
                    var vecD = [];
                    vecC.push(firstX - posX);
                    vecC.push(firstY - posY);
                    vecD.push(firstX - posX);
                    vecD.push(0);
                    var offsetCos = (vecC[0]*vecD[0] + vecC[1]*vecD[1]) /
                                ( Math.sqrt(vecC[0]*vecC[0] + vecC[1]*vecC[1]) * Math.sqrt(vecD[0]*vecD[0] + vecD[1]*vecD[1] ) );

                    var tmpXlength = posX - firstX;
                    var tmpYlength = posY - firstY;
                    if(offsetCos < (1 / Math.sqrt(2)) && offsetCos >= 0)
                    {
                        if(pickNode == "base")
                        {
                            baseOffsetY(objectId, tmpYlength, currentAxis);
                        }
                        else
                        {
                            interWallOffsetY(objectId, tmpYlength, currentAxis);
                        }
                    }
                    else if(offsetCos >= (1 / Math.sqrt(2)) && offsetCos <= 1)
                    {
                        if(pickNode == "base")
                        {
                            baseOffsetX(objectId, tmpXlength, currentAxis);
                        }
                        else
                        {
                            interWallOffsetX(objectId, tmpXlength, currentAxis);
                        }
                    }
                    
                    firstX = posX;
                    firstY = posY;
                }
            }, true);
            
    uiPanel=document.getElementById('codewrapper');
    scene.on("pick",
            function (hit) {
				isLock = true;
                
                var material;
                if(lastid>0){
                    material=scene.findNode(lastid);
                    material.setColor({ r:1, g:1, b:1});
                }
                var id=hit.nodeId;
                var element=scene.findNode(id).nodes[0].nodes[0].nodes[0];
                console.log(element.getID());
                //這是我知道name被material包住，正常藥用id來找但現在id都還沒定
                material=scene.findNode(id).parent;
                material.setColor({r:0.7,g:0.7,b:0.3});
                id=material.id;
                lastid=id;
                if(!element.getLayer){
                    //something uneditale clicked
                    uiPanel.style.display='none';
                    return;
                }
                lastFloor=element.getLayer();
                uiPanel.style.display='inline-block';
                //讓UI跟隨點擊位置，因為很煩人所以先影藏起來
                //uiPanel.style.left = (hit.canvasPos[0]+50) + "px";
                //uiPanel.style.top = (hit.canvasPos[1]+50) + "px";

                objectId = hit.nodeId;
                pickNode = scene.findNode(objectId).parent.parent.getName();
                var pickLayer = scene.getNode(objectId).nodes[0].nodes[0].nodes[0].getLayer();
                if(pickNode == "interWall") { isRotation = false; }
                else if(pickNode == "base" && pickLayer != 1) { isRotation = false; }
                else { isRotation = true; }

                var now = new Date().getTime();
                if(now - lastTime < 300) {
                    if(pickNode != "interWall")
                    {
                        changeViewpoint(pickNode);
                    }
                    else
                    {
                        changeInterWallDirention(objectId);
                    }
                }
                lastTime = now;

                attachInput(objectId);
            });

    scene.on("nopick",
            function (hit) {
                uiPanel.style.display='none';
                if(lastid>0){
                    material=scene.findNode(lastid);
                    material.setColor({ r:0.8, g:0.8, b:0.8});
                }
                lastid = -1;
                lastFloor = -1;
                console.log('Nothing picked!');
                isLock = false;
                objectId = null;
                isRotation = true;
                pickNode = null;
                //for some ridiculurs reason i got to pick again!!
                //scene.pick()
            });
}

function Sign(x) 
{
    return typeof x === 'number' ? x ? x < 0 ? -1 : 1 : x === x ? 0 : NaN : NaN;
}

function baseOffsetX(id, tmpLength, tmpAxis)
{
    var tmpOffsetX;
    var tmpOffsetY;
    var n = scene.getNode(3).getEye();
    var tmpNode = scene.getNode(id).nodes[0].nodes[0].nodes[0];

    switch(tmpAxis)
    {
        case 0:
        case 2:
            if(n.z > 0)
            {
                tmpOffsetX = tmpNode.getOffsetX();
                tmpOffsetX += Sign(tmpLength);
                tmpNode.setOffsetX(tmpOffsetX);
                tmpNode.callBaseCalibration();
            }
            else
            {
                tmpOffsetX = tmpNode.getOffsetX();
                tmpOffsetX -= Sign(tmpLength);
                tmpNode.setOffsetX(tmpOffsetX);
                tmpNode.callBaseCalibration();
            }
            break;
        case 1:
        case 3:
            if(n.x < 0)
            {
                tmpOffsetY = tmpNode.getOffsetY();
                tmpOffsetY += Sign(tmpLength);
                tmpNode.setOffsetY(tmpOffsetY);
                tmpNode.callBaseCalibration();
            }
            else
            {
                tmpOffsetY = tmpNode.getOffsetY();
                tmpOffsetY -= Sign(tmpLength);
                tmpNode.setOffsetY(tmpOffsetY);
                tmpNode.callBaseCalibration();
            }
            break;
    }
}

function baseOffsetY(id, tmpLength, tmpAxis)
{
    var tmpOffsetX;
    var tmpOffsetY;
    var n = scene.getNode(3).getEye();
    var tmpNode = scene.getNode(id).nodes[0].nodes[0].nodes[0];

    switch(tmpAxis)
    {
        case 0:
        case 2:
            if(n.z > 0)
            {
                tmpOffsetY = tmpNode.getOffsetY();
                tmpOffsetY += Sign(tmpLength);
                tmpNode.setOffsetY(tmpOffsetY);
                tmpNode.callBaseCalibration();
            }
            else
            {
                tmpOffsetY = tmpNode.getOffsetY();
                tmpOffsetY -= Sign(tmpLength);
                tmpNode.setOffsetY(tmpOffsetY);
                tmpNode.callBaseCalibration();
            }
            break;
        case 1:
        case 3:
            if(n.x < 0)
            {
                tmpOffsetX = tmpNode.getOffsetX();
                tmpOffsetX -= Sign(tmpLength);
                tmpNode.setOffsetX(tmpOffsetX);
                tmpNode.callBaseCalibration();
            }
            else
            {
                tmpOffsetX = tmpNode.getOffsetX();
                tmpOffsetX += Sign(tmpLength);
                tmpNode.setOffsetX(tmpOffsetX);
                tmpNode.callBaseCalibration();
            }
    }
}

function interWallOffsetX(id, tmplength, tmpAxis)
{
    var tmpPercentX;
    var tmpPercentY;
    var n = scene.getNode(3).getEye();
    var tmpNode = scene.getNode(id).nodes[0].nodes[0].nodes[0];

    switch(tmpAxis)
    {
        case 0:
        case 2:
            if(tmpNode.getDirection() == "vertical" && n.z > 0)
            {
                tmpPercentX = tmpNode.getPercentX();
                tmpPercentX += Sign(tmplength);
                tmpNode.setPercentX(tmpPercentX);
                tmpNode.callBaseCalibration();
            }
            else if(tmpNode.getDirection() == "vertical" && n.z < 0)
            {
                tmpPercentX = tmpNode.getPercentX();
                tmpPercentX -= Sign(tmplength);
                tmpNode.setPercentX(tmpPercentX);
                tmpNode.callBaseCalibration();
            }
            break;
        case 1:
        case 3:
            if(tmpNode.getDirection() == "horizontal" && n.x < 0)
            {
                tmpPercentY = tmpNode.getPercentY();
                tmpPercentY += Sign(tmplength);
                tmpNode.setPercentY(tmpPercentY);
                tmpNode.callBaseCalibration();
            }
            else if(tmpNode.getDirection() == "horizontal" && n.x > 0)
            {
                tmpPercentY = tmpNode.getPercentY();
                tmpPercentY -= Sign(tmplength);
                tmpNode.setPercentY(tmpPercentY);
                tmpNode.callBaseCalibration();
            }
            break;
    }
}

function interWallOffsetY(id, tmplength, tmpAxis)
{
    var tmpPercentX;
    var tmpPercentY;
    var n = scene.getNode(3).getEye();
    var tmpNode = scene.getNode(id).nodes[0].nodes[0].nodes[0];

    switch(tmpAxis)
    {
        case 0:
        case 2:
            if(tmpNode.getDirection() == "horizontal" && n.z > 0)
            {
                tmpPercentY = tmpNode.getPercentY();
                tmpPercentY += Sign(tmplength);
                tmpNode.setPercentY(tmpPercentY);
                tmpNode.callBaseCalibration();
            }
            else if(tmpNode.getDirection() == "horizontal" && n.z < 0)
            {
                tmpPercentY = tmpNode.getPercentY();
                tmpPercentY -= Sign(tmplength);
                tmpNode.setPercentY(tmpPercentY);
                tmpNode.callBaseCalibration();
            }
            break;
        case 1:
        case 3:
            if(tmpNode.getDirection() == "vertical" && n.x < 0)
            {
                tmpPercentX = tmpNode.getPercentX();
                tmpPercentX -= Sign(tmplength);
                tmpNode.setPercentX(tmpPercentX);
                tmpNode.callBaseCalibration();
            }
            else if(tmpNode.getDirection() == "vertical" && n.x > 0)
            {
                tmpPercentX = tmpNode.getPercentX();
                tmpPercentX += Sign(tmplength);
                tmpNode.setPercentX(tmpPercentX);
                tmpNode.callBaseCalibration();
            }
            break;
    }
}

function setObjectWidth(object, length, limit)
{
    var tmpWidth = object.getWidth();
    if(length >= 0)
    {
        tmpWidth += Sign(length);
        object.setWidth(tmpWidth);
        object.callBaseCalibration();
    }
    else
    {
        if(tmpWidth > limit)
        {
            tmpWidth += Sign(length);
            object.setWidth(tmpWidth);
            object.callBaseCalibration();
        }
        else
        {
            tmpWidth = limit;
            object.setWidth(tmpWidth);
            object.callBaseCalibration();
        }
    }
}

function setObjectHeight(object, length, limit)
{
    var tmpHeight = object.getHeight();
    if(length >= 0)
    {
        tmpHeight += Sign(length);
        object.setHeight(tmpHeight);
        object.callBaseCalibration();
    }
    else
    {
        if(tmpHeight > limit)
        {
            tmpHeight += Sign(length);
            object.setHeight(tmpHeight);
            object.callBaseCalibration();
        }
        else
        {
            tmpHeight = limit;
            object.setHeight(tmpHeight);
            object.callBaseCalibration();
        }
    }
}

function setObjectDepth(object, length, limit)
{
    var tmpDepth = object.getDepth();
    if(length >= 0)
    {
        tmpDepth += Sign(length);
        object.setDepth(tmpDepth);
        object.callBaseCalibration();
    }
    else
    {
        if(tmpDepth > limit)
        {
            tmpDepth += Sign(length);
            object.setDepth(tmpDepth);
            object.callBaseCalibration();
        }
        else
        {
            tmpDepth = limit;
            object.setDepth(tmpDepth);
            object.callBaseCalibration();
        }
    }
}
function horizontalAxis(id, tmpLength, tmpAxis)
{
    var n;
    var tmpNode = scene.findNodes();
    var tmpLayer = scene.getNode(id).nodes[0].nodes[0].nodes[0].getLayer();
    var nameNode = scene.getNode(id).parent.parent.getName();
    if(nameNode == "rightTriangle" || nameNode == "leftTriangle")
    {
        n = scene.getNode(7).nodes[0].nodes[0].nodes[0];
    }
    else
    {
        n = scene.getNode(id).nodes[0].nodes[0].nodes[0];
    }

    switch(tmpAxis)
    {
        case 0: 
            if(nameNode == "backWall")
            {
                setObjectWidth(n, tmpLength, 18);
            }
            else if(nameNode == "roof" || nameNode == "rightTriangle" || nameNode == "leftTriangle")
            {
                setObjectDepth(n, tmpLength, 18);
            }
            else if(nameNode == "base")
            {
                for(var i = 0; i < tmpNode.length; i++)
                {
                    if(tmpNode[i].getType() == "name")
                    {
                        if(tmpNode[i].getName() == "backWall" && tmpNode[i].nodes[0].nodes[0].nodes[0].nodes[0].nodes[0].getLayer() == tmpLayer)
                        {
                            var tmpBackWall = tmpNode[i].nodes[0].nodes[0].nodes[0].nodes[0].nodes[0];
                            setObjectWidth(tmpBackWall, tmpLength, 18);
                        }
                    }
                }
            }
            break;
        case 1:
            if(nameNode == "rightWall" || nameNode == "leftWall")
            {
                setObjectWidth(n, tmpLength, 7);
            }
            else if(nameNode == "roof" || nameNode == "rightTriangle" || nameNode == "leftTriangle")
            {
                setObjectWidth(n, tmpLength, 8);
            }
            else if(nameNode == "base")
            {
                for(var i = 0; i < tmpNode.length; i++)
                {
                    if(tmpNode[i].getType() == "name")
                    {
                        if(tmpNode[i].getName() == "rightWall" && tmpNode[i].nodes[0].nodes[0].nodes[0].nodes[0].nodes[0].getLayer() == tmpLayer)
                        {
                            var tmpRightWall = tmpNode[i].nodes[0].nodes[0].nodes[0].nodes[0].nodes[0];
                            setObjectWidth(tmpRightWall, tmpLength, 7);
                        }
                    }
                }
            }
            break;
        case 2:
            if(nameNode == "backWall")
            {
                setObjectWidth(n, tmpLength, 18);
            }
            else if(nameNode == "roof" || nameNode == "rightTriangle" || nameNode == "leftTriangle")
            {
                setObjectDepth(n, tmpLength, 18);
            }
            else if(nameNode == "base")
            {
                for(var i = 0; i < tmpNode.length; i++)
                {
                    if(tmpNode[i].getType() == "name")
                    {
                        if(tmpNode[i].getName() == "backWall" && tmpNode[i].nodes[0].nodes[0].nodes[0].nodes[0].nodes[0].getLayer() == tmpLayer)
                        {
                            var tmpBackWall = tmpNode[i].nodes[0].nodes[0].nodes[0].nodes[0].nodes[0];
                            setObjectWidth(tmpBackWall, tmpLength, 18);
                        }
                    }
                }
            }
            break;
        case 3:
            if(nameNode == "rightWall" || nameNode == "leftWall")
            {
                setObjectWidth(n, tmpLength, 7);
            }
            else if(nameNode == "roof" || nameNode == "rightTriangle" || nameNode == "leftTriangle")
            {
                setObjectWidth(n, tmpLength, 8);
            }
            else if(nameNode == "base")
            {
                for(var i = 0; i < tmpNode.length; i++)
                {
                    if(tmpNode[i].getType() == "name")
                    {
                        if(tmpNode[i].getName() == "rightWall" && tmpNode[i].nodes[0].nodes[0].nodes[0].nodes[0].nodes[0].getLayer() == tmpLayer)
                        {
                            var tmpRightWall = tmpNode[i].nodes[0].nodes[0].nodes[0].nodes[0].nodes[0];
                            setObjectWidth(tmpRightWall, tmpLength, 7);
                        }
                    }
                }
            }
            break;
    }
}

function verticalAxis(id, tmpLength, tmpAxis)
{
    var n;
    var tmpNode = scene.findNodes();
    var tmpLayer = scene.getNode(id).nodes[0].nodes[0].nodes[0].getLayer();
    var nameNode = scene.getNode(id).parent.parent.getName();
    if(nameNode == "rightTriangle" || nameNode == "leftTriangle")
    {
        n = scene.getNode(7).nodes[0].nodes[0].nodes[0];
    }
    else
    {
        n = scene.getNode(id).nodes[0].nodes[0].nodes[0];
    }

    switch(tmpAxis)
    {
        case 0:
            if(nameNode == "rightWall" || nameNode == "leftWall" || nameNode == "backWall")
            {
                setObjectHeight(n, tmpLength, 8);
            }
            else if(nameNode == "roof" || nameNode == "rightTriangle" || nameNode == "leftTriangle")
            {
                setObjectHeight(n, tmpLength, 5);
            }
            break;
        case 1:
            if(nameNode == "rightWall" || nameNode == "leftWall" || nameNode == "backWall")
            {
                setObjectHeight(n, tmpLength, 8);
            }
            else if(nameNode == "roof" || nameNode == "rightTriangle" || nameNode == "leftTriangle")
            {
                setObjectHeight(n, tmpLength, 5);
            }
            break;
        case 2:
            if(nameNode == "rightWall" || nameNode == "leftWall")
            {
                setObjectWidth(n, tmpLength, 7);
            }
            else if(nameNode == "roof" || nameNode == "rightTriangle" || nameNode == "leftTriangle")
            {
                setObjectWidth(n, tmpLength, 8);
            }
            else if(nameNode == "base")
            {
                for(var i = 0; i < tmpNode.length; i++)
                {
                    if(tmpNode[i].getType() == "name")
                    {
                        if(tmpNode[i].getName() == "rightWall" && tmpNode[i].nodes[0].nodes[0].nodes[0].nodes[0].nodes[0].getLayer() == tmpLayer)
                        {
                            var tmpRightWall = tmpNode[i].nodes[0].nodes[0].nodes[0].nodes[0].nodes[0];
                            setObjectWidth(tmpRightWall, tmpLength, 7);
                        }
                    }
                }
            }
            break;
        case 3:
            if(nameNode == "backWall")
            {
                setObjectWidth(n, tmpLength, 18);
            }
            else if(nameNode == "roof" || nameNode == "rightTriangle" || nameNode == "leftTriangle")
            {
                setObjectDepth(n, tmpLength, 18);
            }
            else if(nameNode == "base")
            {
                for(var i = 0; i < tmpNode.length; i++)
                {
                    if(tmpNode[i].getType() == "name")
                    {
                        if(tmpNode[i].getName() == "backWall" && tmpNode[i].nodes[0].nodes[0].nodes[0].nodes[0].nodes[0].getLayer() == tmpLayer)
                        {
                            var tmpBackWall = tmpNode[i].nodes[0].nodes[0].nodes[0].nodes[0].nodes[0];
                            setObjectWidth(tmpBackWall, tmpLength, 18);
                        }
                    }
                }
            }
            break;
    }
}

function getAxis()
{
    var camPos = scene.getNode(3).getEye();
    var camA = [];
    var camB = [];
    camA.push(0 - camPos.x);
    camA.push(0 - camPos.y);
    camA.push(0 - camPos.z);
    camB.push(0 - camPos.x);
    camB.push(0);
    camB.push(0 - camPos.z);
    
    var cam3DCos = (camA[0]*camB[0] + camA[1]*camB[1] + camA[2]*camB[2]) / 
            (Math.sqrt(camA[0]*camA[0] + camA[1]*camA[1] + camA[2]*camA[2]) * Math.sqrt(camB[0]*camB[0] + camB[1]*camB[1] + camB[2]*camB[2]));
    
    if(cam3DCos > (1 / Math.sqrt(2)) && cam3DCos <= 1)
    {
        var subCamA = [];
        var subCamB = [];
        subCamA.push(0 - camPos.x);
        subCamA.push(0 - camPos.z);
        subCamB.push(0)
        subCamB.push(0 - camPos.z);
        
        var subCamCos = (subCamA[0]*subCamB[0] + subCamA[1]*subCamB[1]) /
                (Math.sqrt(subCamA[0]*subCamA[0] + subCamA[1]*subCamA[1]) * Math.sqrt(subCamB[0]*subCamB[0] + subCamB[1]*subCamB[1]));
        if(subCamCos > (1 / Math.sqrt(2)) && subCamCos <= 1)
        {
            return 0;
        }
        else if(subCamCos <= (1 / Math.sqrt(2)) && subCamCos >= 0)
        {
            return 1;
        }
    }
    else if(cam3DCos <= (1 / Math.sqrt(2)) && cam3DCos >= 0)
    {
        var subCamA = [];
        var subCamB = [];
        subCamA.push(0 - camPos.x);
        subCamA.push(0 - camPos.z);
        subCamB.push(0)
        subCamB.push(0 - camPos.z);
        
        var subCamCos = (subCamA[0]*subCamB[0] + subCamA[1]*subCamB[1]) /
                (Math.sqrt(subCamA[0]*subCamA[0] + subCamA[1]*subCamA[1]) * Math.sqrt(subCamB[0]*subCamB[0] + subCamB[1]*subCamB[1]));
        if(subCamCos > (1 / Math.sqrt(2)) && subCamCos <= 1)
        {
            return 2;
        }
        else if(subCamCos <= (1 / Math.sqrt(2)) && subCamCos >= 0)
        {
            return 3;
        }
    }
}

function changeInterWallDirention(id)
{
    var tmpNode = scene.getNode(id).nodes[0].nodes[0].nodes[0];
    //console.log("this is ",tmpNode);
    if(tmpNode.getDirection() == "vertical")
    {
        tmpNode.setDirection("horizontal");
        tmpNode.callBaseCalibration();
    }
    else
    {
        tmpNode.setDirection("vertical");
        tmpNode.callBaseCalibration();
    }
}

function changeViewpoint(nameNode)
{
    var camPos = scene.getNode(3).getEye();
    var dist = Math.sqrt( (camPos.x-0) * (camPos.x-0) + (camPos.y-0) * (camPos.y-0) + (camPos.z-0) * (camPos.z-0) );
    //console.log(dist);

    switch(nameNode){
        case "base":
            tmpNormal = [0,1,0];
            camDist = dist;
            break;
        case "rightWall":
            tmpNormal = [1,0,0];
            camDist = dist;
            break;
        case "leftWall":
            tmpNormal = [-1,0,0];
            camDist = dist;
            break;
        case "backWall":
            tmpNormal = [0,0,-1];
            camDist = dist;
            break;
        case "roof":
        case "rightTriangle":
        case "leftTriangle":
            tmpNormal = [0,0,1];
            camDist = dist;
            break;
        default:
            tmpNormal = null;
            camDist = null;
    }
}

function getNormal()
{
    return tmpNormal;
}

function getCameraDistance()
{
    return camDist;
}

function getIsLock()
{
    return isLock;
}

function getIsRotation()
{
    return isRotation;
}

function UIlog(log){
    console.log(log);
}
var hasTexture=true;
function textureToggle(){
    console.log("textureToggle");
    var box=scene.findNodes();
    for(var i=0;i<box.length;i++){
        if(box[i].getType()=="texture"){
            if(hasTexture){
                box[i]._initTexture();
            }else{
                var src=box[i].getParent().getParent().getName();
                box[i].setSrc("images/GeometryTexture/"+src+"");
            }
        }
    }
    hasTexture=!hasTexture;
}

function addInterWall(){
    if(lastFloor<=0 || lastFloor == getTopLayer()+1){
        return;
    }
    var backWall=-1;
    var rightWall=-1;
    var leftWall=-1;
    var frontWall=-1;
    var roof=-1;
    var base=-1;
    var interWall=[];
    var nodes=scene.findNodes();
    for(var i=0;i<nodes.length;i++){
        var n = nodes[i];
        if(n.getType()=="name"){
            if(n.getName()=="backWall"){
                //         material  name     matrix  texture  element
                backWall=n.nodes[0].nodes[0].nodes[0].nodes[0].nodes[0];
            }
            else if(n.getName()=="frontWall")frontWall=n.nodes[0].nodes[0].nodes[0].nodes[0].nodes[0];
            else if(n.getName()=="leftWall")leftWall=n.nodes[0].nodes[0].nodes[0].nodes[0].nodes[0];
            else if(n.getName()=="rightWall")rightWall=n.nodes[0].nodes[0].nodes[0].nodes[0].nodes[0];
            else if(n.getName()=="roof")roof=n.nodes[0].nodes[0].nodes[0].nodes[0].nodes[0];
            else if(n.getName()=="interWall" && n.nodes[0].nodes[0].nodes[0].nodes[0].nodes[0].getLayer() == lastFloor )interWall.push(n.nodes[0].nodes[0].nodes[0].nodes[0].nodes[0]);
            else if(n.getName()=="base")base=n.nodes[0].nodes[0].nodes[0].nodes[0].nodes[0];
        }
    }
    var bigestID=0;
    if(interWall.length!=0){
        for(var i=0;i<interWall.length;i++){
            if(interWall[i].getPriority() > bigestID){
                bigestID = interWall[i].getPriority() + 1;
            }
        }
    }
    var px=50,py=50;
    var numberOfDirectionVerticle=0;
    var numberOfDirectionHorizontal=0;
    for(var i=0;i<interWall.length;i++){
        if(interWall[i].getDirection() == "vertical"){
            numberOfDirectionVerticle++;
        }else{
            numberOfDirectionHorizontal++;
        }
    }
    if(numberOfDirectionHorizontal==0){
        py=50;
    }else{
        py=100-50/(numberOfDirectionHorizontal+1);
    }
    if(numberOfDirectionVerticle==0){
        px=50;
    }else{
        px=100-50/(numberOfDirectionVerticle+1);
    }
    
    

    var root = scene.findNode(3);
    root.addNode({
        type: "flags",
            flags:{transparent:false},
            nodes:
            [{
                type: "name",
                name: "interWall",
    
                nodes:
                [{
                    type: "material",
                    color:{ r:0.8, g:0.8, b:0.8 },
                    alpha:0.2,
                    nodes:
                    [{
                        type: "name",
                        name: "Wall.jpg",
    
                        nodes:
                        [{
                            type: "matrix",
                            elements:[0,0,1,0,1,0,0,0,0,1,0,0,9,8.5,0,1],
    
                            nodes:
                            [{
                                type: "texture",
                                src: "images/GeometryTexture/wall.jpg",
                                applyTo: "color",
    
                                nodes:
                                [{
                                    type: "wall/no_window",
                                    layer: lastFloor,
                                    height: 4,
                                    width: 10,
                                    thickness: 1,
                                    direction: "vertical",
                                    priority: bigestID,
                                    percentX: 50,
                                    percentY: 50,
                                    scale: {x: 1, y: 1, z: 1},
                                    rotate: {x: 0, y: 90, z: 0},
                                    translate: {x: 0, y: 0, z: 0}
                                }]
                            }]
                        }]
                    }]
                }]
            }]
    });
    
    Calibration();
}

function getTopLayer(){
    var layerNumber=0;
    var nodes=scene.findNodes();
    for(var i=0;i<nodes.length;i++){
        var n = nodes[i];
        if(n.getType()=="name"){
            if(n.getName()=="base"){if(n.nodes[0].nodes[0].nodes[0].nodes[0].nodes[0].getLayer()>layerNumber){layerNumber=n.nodes[0].nodes[0].nodes[0].nodes[0].nodes[0].getLayer();}}
        }
    }
    return layerNumber;
}

function addBase(){
    var nodes=scene.findNodes();
    var layerNumber=getTopLayer()+1;
    console.log(layerNumber);
    var root = scene.findNode(3);
    //base
    root.addNode({
        type: "flags",
            flags:{transparent:false},
            nodes:
            [{
                type: "name",
                name: "base",
    
                nodes:
                [{
                    type: "material",
                    color:{ r:0.8, g:0.8, b:0.8 },
                    alpha:0.2,
                    nodes:
                    [{
                        type: "name",
                        name: "ground.jpg",
    
                        nodes:
                        [{
                            type: "matrix",
                            elements:[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],
    
                            nodes:
                            [{
                                type: "texture",
                                src: "images/GeometryTexture/ground.jpg",
                                applyTo: "color",
    
                                nodes:
                                [{
                                    type: "base/basic",
                                    layer: layerNumber,
                                    height: 8,
                                    width: 18,
                                    thickness: 1,
                                    scale: {x: 1, y: 1, z: 1},
                                    rotate: {x: 0, y: 0, z: 0},
                                    translate: {x: 0, y: 0, z: 0}
                                }]
                            }]
                        }]
                    }]
                }]
            }]
        
    });
    //BackWall
    root.addNode({
        type: "flags",
            flags:{transparent:false},
            nodes:
            [{
                type: "name",
                name: "backWall",
    
                nodes:
                [{
                    type: "material",
                    color:{ r:0.8, g:0.8, b:0.8 },
                    alpha:0.2,
                    nodes:
                    [{
                        type: "name",
                        name: "Wall.jpg",
    
                        nodes:
                        [{
                            type: "matrix",
                            elements:[1,0,0,0,0,0,-1,0,0,1,0,0,0,8.5,-7.5,1],
    
                            nodes:
                            [{
                                type: "texture",
                                src: "images/GeometryTexture/wall.jpg",
                                applyTo: "color",
    
                                nodes:
                                [{
                                    type: "wall/no_window",
                                    layer: layerNumber,
                                    height: 8,
                                    width: 18,
                                    thickness: 1,
                                    scale: {x: 1, y: 1, z: 1},
                                    rotate: {x: 0, y: 0, z: 0},
                                    translate: {x: 0, y: 0, z: 0},
                                    direction: "horizontal"
                                }]
                            }]
                        }]
                    }]
                }]
            }]
        
    });
    //frontWall
    //root.addNode({
    //});
    //leftWall
    root.addNode({
        type:"flags",
            flags:{transparent:false},
            nodes:
            [{
                type: "name",
                name: "leftWall",
    
                nodes:
                [{
                    type: "material",
                    color:{ r:0.8, g:0.8, b:0.8 },
                    alpha:0.2,
                    nodes:
                    [{
                        type: "name",
                        name: "Wall.jpg",
    
                        nodes:
                        [{
                            type: "matrix",
                            elements:[0,0,1,0,-1,0,0,0,0,-1,0,0,-17.5,8.5,0.5,1],
    
                            nodes:
                            [{
                                type: "texture",
                                src: "images/GeometryTexture/wall.jpg",
                                applyTo: "color",
    
                                nodes:
                                [{
                                    type: "wall/no_window",
                                    layer: layerNumber,
                                    height: 8,
                                    width: 7.5,
                                    thickness: 1,
                                    scale: {x: 1, y: 1, z: 1},
                                    rotate: {x: 0, y: 90, z: 0},
                                    translate: {x: 0, y: 0, z: 0},
                                    direction: "vertical"
                                }]
                            }]
                        }]
                    }]
                }]
            }]
        
    });
    //rightWall
    root.addNode({
        type:"flags",
        flags:{transparent:false},
            nodes:
            [{
                type: "name",
                name: "rightWall",
    
                nodes:
                [{
                    type: "material",
                    color:{ r:0.8, g:0.8, b:0.8 },
                    alpha:0.2,
                    nodes:
                    [{
                        type: "name",
                        name: "Wall.jpg",
    
                        nodes:
                        [{
                            type: "matrix",
                            elements:[0,0,1,0,1,0,0,0,0,1,0,0,17.5,8.5,0.5,1],
    
                            nodes:
                            [{
                                type: "texture",
                                src: "images/GeometryTexture/wall.jpg",
                                applyTo: "color",
    
                                nodes:
                                [{
                                    type: "wall/no_window",
                                    layer: layerNumber,
                                    height: 8,
                                    width: 7.5,
                                    thickness: 1,
                                    scale: {x: 1, y: 1, z: 1},
                                    rotate: {x: 0, y: 90, z: 0},
                                    translate: {x: 0, y: 0, z: 0},
                                    direction: "vertical"
                                }]
                            }]
                        }]
                    }]
                }]
            }]
        
    });

    Calibration();
}

function deleteBase(){
    var layerNumber=getTopLayer();
    var nodes=scene.findNodes();
    if(layerNumber <=1){
        lastid =-1;
        lastFloor=-1;
        return;
    }
    for(var i=0;i<nodes.length;i++){
        var n = nodes[i];
        if(n.getLayer){
            if(n.getLayer() == layerNumber){
                n.getParent().getParent().getParent().getParent().getParent().getParent().destroy();
            }
        }
    }
    lastFloor =-1;
    lastid=-1;

    Calibration();
}

function attachInput(pickId){

    var n = scene.findNode(pickId);

    var nameNode= n.parent.parent;

    console.log(nameNode.getName());

    //  matrix    texture   element
    n = n.nodes[0].nodes[0].nodes[0];



    var uiarea=document.getElementById('uiarea');
    var domParser = new DOMParser();

    //remove input
    if(document.getElementById('inputarea')){
        document.getElementById('inputarea').remove();
    }

    if(nameNode.getName()=="rightTriangle" || nameNode.getName()=="leftTriangle"){
        return;
    }

    //add input
    var inputarea=document.createElement("div");
    inputarea.id="inputarea";
    uiarea.appendChild(inputarea);

    //hight
    if(n.getHeight && n.getParent().getParent().getParent().getParent().getParent().getName() != "interWall"){
        var heightismove=false;
        var div=document.createElement("div");
        inputarea.appendChild(div);
        //text
        var heightpropertyName=document.createElement("lable");
            heightpropertyName.textContent="height";
            div.appendChild(heightpropertyName);
        //input
        var heightinput=document.createElement("input");
            heightinput.type="range";
            heightinput.min="1";
            heightinput.max="50";
            heightinput.step="0.1";
            heightinput.value=n.getHeight();
            if(n.getRealHeight)heightinput.value=n.getRealHeight();
            div.appendChild(heightinput);
    
        var heightpropertyValue=document.createElement("lable");
            heightpropertyValue.textContent=heightinput.value;
            div.appendChild(heightpropertyValue);
    
        heightinput.addEventListener('mousedown',function(event){
            heightismove=true;
        });
        heightinput.addEventListener('mousemove',function(event){
            if (heightismove) {
                n.setHeight(Number(heightinput.value*1.0));
                if(n.setRealHeight){n.setRealHeight(Number(heightinput.value*1.0));}
                heightpropertyValue.textContent=heightinput.value;
                n.callBaseCalibration();
            }
        });
        //heightinput.addEventListener('change',function(event){
        //    n.setHeight(Number(heightinput.value*1.0));
        //    heightpropertyValue.textContent=heightinput.value;
        //    n.callBaseCalibration();
        //});
        heightinput.addEventListener('mouseup',function(event){
            heightismove=false;
        });
    }
    

    //width
    if(n.getWidth && n.getParent().getParent().getParent().getParent().getParent().getName() != "interWall"){
        var widthismove=false;
        var div=document.createElement("div");
        inputarea.appendChild(div);
        //text
        var widthpropertyName=document.createElement("lable");
            widthpropertyName.textContent="width";
            div.appendChild(widthpropertyName);
        //input
        var widthinput=document.createElement("input");
            widthinput.type="range";
            widthinput.min="1";
            widthinput.max="50";
            widthinput.step="0.1";
            widthinput.value=n.getWidth();
            if(n.getRealWidth)widthinput.value=n.getRealWidth();
            div.appendChild(widthinput);
    
        var widthpropertyValue=document.createElement("lable");
            widthpropertyValue.textContent=widthinput.value;
            div.appendChild(widthpropertyValue);
    
        widthinput.addEventListener('mousedown',function(event){
            widthismove=true;
        });
        widthinput.addEventListener('mousemove',function(event){
            if (widthismove) {
                n.setWidth(Number(widthinput.value*1.0));
                if(n.setRealWidth){n.setRealWidth(Number(widthinput.value*1.0));}
                widthpropertyValue.textContent=widthinput.value;
                n.callBaseCalibration();
            }
        });
        widthinput.addEventListener('mouseup',function(event){
            widthismove=false;
        });
    }
    

    //percentX
    if(n.getPercentX && n.getParent().getParent().getParent().getParent().getParent().getName() == "interWall"){
        var percentXismove=false;
        var div = document.createElement("div");
        inputarea.appendChild(div);
        //text
        var percentXpropertyName=document.createElement("lable");
            percentXpropertyName.textContent="percentX";
            div.appendChild(percentXpropertyName);
        //input
        var percentXinput=document.createElement("input");
            percentXinput.type="range";
            percentXinput.min="0";
            percentXinput.max="100";
            percentXinput.step="0.1";
            percentXinput.value=n.getPercentX();
            div.appendChild(percentXinput);
    
        var percentXpropertyValue = document.createElement("lable");
            percentXpropertyValue.textContent=percentXinput.value;
            div.appendChild(percentXpropertyValue);
    
        percentXinput.addEventListener('mousedown',function(event){
            percentXismove=true;
        });
        percentXinput.addEventListener('mousemove',function(event){
            if (percentXismove) {
                n.setPercentX(Number(percentXinput.value));
                percentXpropertyValue.textContent=percentXinput.value;
                n.callBaseCalibration();
            }
        });
        percentXinput.addEventListener('mouseup',function(event){
            percentXismove=false;
        });
    }
    

    //percentY
    if(n.getPercentY && n.getParent().getParent().getParent().getParent().getParent().getName() == "interWall"){
        var percentYismove=false;
        var div = document.createElement("div");
        inputarea.appendChild(div);
        //text
        var percentYpropertyName=document.createElement("lable");
            percentYpropertyName.textContent="percentY";
            div.appendChild(percentYpropertyName);
        //input
        var percentYinput=document.createElement("input");
            percentYinput.type="range";
            percentYinput.min="0";
            percentYinput.max="100";
            percentYinput.step="0.1";
            percentYinput.value=n.getPercentY();
            div.appendChild(percentYinput);
    
        var percentYpropertyValue = document.createElement("lable");
            percentYpropertyValue.textContent=percentYinput.value;
            div.appendChild(percentYpropertyValue);
    
        percentYinput.addEventListener('mousedown',function(event){
            percentYismove=true;
        });
        percentYinput.addEventListener('mousemove',function(event){
            if (percentYismove) {
                n.setPercentY(Number(percentYinput.value));
                percentYpropertyValue.textContent=percentYinput.value;
                n.callBaseCalibration();
            }
        });
        percentYinput.addEventListener('mouseup',function(event){
            percentYismove=false;
        });
    }
    
    //direction
    if(n.getDirection && n.getParent().getParent().getParent().getParent().getParent().getName() == "interWall"){
        var div=document.createElement("div");
        inputarea.appendChild(div);
        //text
        var directionpropertyName=document.createElement("lable");
            directionpropertyName.textContent="direction";
            div.appendChild(directionpropertyName);
        //input
        var directioninput=document.createElement("input");
            directioninput.type="checkbox";
            directioninput.checked=(n.getDirection()=="vertical");
            div.appendChild(directioninput);

        var directionpropertyValue = document.createElement("lable");
            directionpropertyValue.textContent = (directioninput.checked ? "vertical":"horizontal");
            div.appendChild(directionpropertyValue);

        directioninput.addEventListener('click',function(event){
            n.setDirection(directioninput.checked ? "vertical":"horizontal");
            directioninput.textContent = directioninput.checked == "vertical" ? "vertical":"horizontal";
            n.callBaseCalibration();
        });
    }

    //delete interWall
    if(n.getDirection && n.getParent().getParent().getParent().getParent().getParent().getName() == "interWall"){
        var div=document.createElement("div");
        inputarea.appendChild(div);
        //text
        var deletepropertyName=document.createElement("lable");
            deletepropertyName.textContent="delete";
            div.appendChild(deletepropertyName);
        //input
        var deleteinput=document.createElement("input");
            deleteinput.value = "delete";
            deleteinput.type="button";
            div.appendChild(deleteinput);

        deleteinput.addEventListener('click',function(event){
            var backWall=-1;
            var rightWall=-1;
            var leftWall=-1;
            var frontWall=-1;
            var roof=-1;
            var base=-1;
            var interWall=[];
            var nodes=scene.findNodes();
            for(var i=0;i<nodes.length;i++){
                var node = nodes[i];
                if(node.getType()=="name"){
                    if(node.getName()=="backWall"){
                        //         material  name     matrix  texture  element
                        backWall=node.nodes[0].nodes[0].nodes[0].nodes[0].nodes[0];
                    }
                    else if(node.getName()=="frontWall")frontWall=node.nodes[0].nodes[0].nodes[0].nodes[0].nodes[0];
                    else if(node.getName()=="leftWall")leftWall=node.nodes[0].nodes[0].nodes[0].nodes[0].nodes[0];
                    else if(node.getName()=="rightWall")rightWall=node.nodes[0].nodes[0].nodes[0].nodes[0].nodes[0];
                    else if(node.getName()=="roof")roof=node.nodes[0].nodes[0].nodes[0].nodes[0].nodes[0];
                    else if(node.getName()=="interWall")interWall.push(node.nodes[0].nodes[0].nodes[0].nodes[0].nodes[0]);
                    else if(node.getName()=="base")base=node.nodes[0].nodes[0].nodes[0].nodes[0].nodes[0];
                }
            }

            if(base != -1){
                //flags  texture     //matrix    name        material    name
                n.getParent().getParent().getParent().getParent().getParent().getParent().destroy();
                
                //remove input
                if(document.getElementById('inputarea')){
                    document.getElementById('inputarea').remove();
                }
                //cancle pick
                lastid=-1;
            }

        });
    }


    //sigle Wall
    if(n.getDirection && n.getParent().getParent().getParent().getParent().getParent().getName() != "interWall"){
        var div=document.createElement("div");
        inputarea.appendChild(div);
        //text
        var siglepropertyName=document.createElement("lable");
            siglepropertyName.textContent="sigle";
            div.appendChild(siglepropertyName);
        //input
        var sigleinput=document.createElement("input");
            sigleinput.value = "sigle";
            sigleinput.type="button";
            div.appendChild(sigleinput);

        sigleinput.addEventListener('click',function(event){
            var backWall=-1;
            var rightWall=-1;
            var leftWall=-1;
            var frontWall=-1;
            var roof=-1;
            var base=-1;
            var interWall=[];
            var nodes=scene.findNodes();
            for(var i=0;i<nodes.length;i++){
                var node = nodes[i];
                if(node.getType()=="name"){
                    if(node.getName()=="backWall"){
                        //         material  name     matrix  texture  element
                        backWall=node.nodes[0].nodes[0].nodes[0].nodes[0].nodes[0];
                    }
                    else if(node.getName()=="frontWall")frontWall=node.nodes[0].nodes[0].nodes[0].nodes[0].nodes[0];
                    else if(node.getName()=="leftWall")leftWall=node.nodes[0].nodes[0].nodes[0].nodes[0].nodes[0];
                    else if(node.getName()=="rightWall")rightWall=node.nodes[0].nodes[0].nodes[0].nodes[0].nodes[0];
                    else if(node.getName()=="roof")roof=node.nodes[0].nodes[0].nodes[0].nodes[0].nodes[0];
                    else if(node.getName()=="interWall")interWall.push(node.nodes[0].nodes[0].nodes[0].nodes[0].nodes[0]);
                    else if(node.getName()=="base")base=node.nodes[0].nodes[0].nodes[0].nodes[0].nodes[0];
                }
            }

            if(base != -1){
                //flags  texture     //matrix    name        material    name
                //n.getParent().getParent().getParent().getParent().getParent().getParent().destroy();
                var nName = n.getParent().getParent().getParent().getParent().getParent().getName();
                var nLayer = n.getLayer();
                var nDir = n.getDirection();
                var nThick = n.getThickness();
                var nHeight = n.getHeight();
                var nWidth = n.getWidth();
                var nrotate = n.getRotate();
                var root = scene.findNode(3);
                root.addNode({
                    type: "flags",
                        flags:{transparent:false},
                        nodes:
                        [{
                            type: "name",
                            name: nName,
                
                            nodes:
                            [{
                                type: "material",
                                color:{ r:0.8, g:0.8, b:0.8 },
                                alpha:0.2,
                                nodes:
                                [{
                                    type: "name",
                                    name: "Wall.jpg",
                
                                    nodes:
                                    [{
                                        type: "matrix",
                                        elements:[0,0,1,0,1,0,0,0,0,1,0,0,9,8.5,0,1],
                
                                        nodes:
                                        [{
                                            type: "texture",
                                            src: "images/GeometryTexture/wall.jpg",
                                            applyTo: "color",
                
                                            nodes:
                                            [{
                                                type: "wall/single_window",
                                                layer: nLayer,
                                                height: nHeight,
                                                width: nWidth,
                                                thickness: nThick,
                                                direction: nDir,
                                                ratio: {a: 0.5,b: 0.5},
                                                windowW: 3,
                                                windowH: 3,
                                                scale: {x: 1, y: 1, z: 1},
                                                rotate: {x: nrotate[0], y: nrotate[1], z: nrotate[2]},
                                                translate: {x: 0, y: 0, z: 0}
                                            }]
                                        }]
                                    }]
                                }]
                            }]
                        }]
                });
                n.getParent().getParent().getParent().getParent().getParent().getParent().destroy();
                //remove input
                if(document.getElementById('inputarea')){
                    document.getElementById('inputarea').remove();
                }
                //cancle pick
                lastid=-1;
            }

        });
    }
    //depth
    if(n.getDepth){
        var depthismove=false;
        var div=document.createElement("div");
        inputarea.appendChild(div);
        //text
        var depthpropertyName=document.createElement("lable");
            depthpropertyName.textContent="depth";
            div.appendChild(depthpropertyName);
        //input
        var depthinput=document.createElement("input");
            depthinput.type="range";
            depthinput.min="1";
            depthinput.max="50";
            depthinput.step="0.1";
            depthinput.value=n.getDepth();
            div.appendChild(depthinput);
    
        var depthpropertyValue=document.createElement("lable");
            depthpropertyValue.textContent=depthinput.value;
            div.appendChild(depthpropertyValue);
    
        depthinput.addEventListener('mousedown',function(event){
            depthismove=true;
        });
        depthinput.addEventListener('mousemove',function(event){
            if (depthismove) {
                n.setDepth(Number(depthinput.value));
                depthpropertyValue.textContent=depthinput.value;
                n.callBaseCalibration();
            }
        });
        depthinput.addEventListener('mouseup',function(event){
            depthismove=false;
        });
    }
    //toplen
    if(n.getToplen ){
        var toplenismove=false;
        var div=document.createElement("div");
        inputarea.appendChild(div);
        //text
        var toplenpropertyName=document.createElement("lable");
            toplenpropertyName.textContent="toplen";
            div.appendChild(toplenpropertyName);
        //input
        var topleninput=document.createElement("input");
            topleninput.type="range";
            topleninput.min="0";
            topleninput.max="50";
            topleninput.step="0.1";
            topleninput.value=n.getToplen();
            div.appendChild(topleninput);
    
        var toplenpropertyValue=document.createElement("lable");
            toplenpropertyValue.textContent=topleninput.value;
            div.appendChild(toplenpropertyValue);
    
        topleninput.addEventListener('mousedown',function(event){
            toplenismove=true;
        });
        topleninput.addEventListener('mousemove',function(event){
            if (toplenismove) {
                n.setToplen(Number(topleninput.value*1.0));
                toplenpropertyValue.textContent=topleninput.value;
                n.callBaseCalibration();
            }
        });
        topleninput.addEventListener('mouseup',function(event){
            toplenismove=false;
        });
    }
    //OffsetX
    if(n.getOffsetX){
        var OffsetXismove=false;
        var div=document.createElement("div");
        inputarea.appendChild(div);
        //text
        var OffsetXpropertyName=document.createElement("lable");
            OffsetXpropertyName.textContent="OffsetX";
            div.appendChild(OffsetXpropertyName);
        //input
        var OffsetXinput=document.createElement("input");
            OffsetXinput.type="range";
            OffsetXinput.min="-50";
            OffsetXinput.max="50";
            OffsetXinput.step="0.1";
            OffsetXinput.value=n.getOffsetX();
            div.appendChild(OffsetXinput);
    
        var OffsetXropertyValue=document.createElement("lable");
            OffsetXropertyValue.textContent=OffsetXinput.value;
            div.appendChild(OffsetXropertyValue);
    
        OffsetXinput.addEventListener('mousedown',function(event){
            OffsetXismove=true;
        });
        OffsetXinput.addEventListener('mousemove',function(event){
            if (OffsetXismove) {
                n.setOffsetX(Number(OffsetXinput.value*1.0));
                OffsetXropertyValue.textContent=OffsetXinput.value;
                n.callBaseCalibration();
            }
        });
        OffsetXinput.addEventListener('mouseup',function(event){
            OffsetXismove=false;
        });
    }
    //OffsetY
    if(n.getOffsetY){
        var OffsetYismove=false;
        var div=document.createElement("div");
        inputarea.appendChild(div);
        //text
        var OffsetYpropertyName=document.createElement("lable");
            OffsetYpropertyName.textContent="OffsetY";
            div.appendChild(OffsetYpropertyName);
        //input
        var OffsetYinput=document.createElement("input");
            OffsetYinput.type="range";
            OffsetYinput.min="-50";
            OffsetYinput.max="50";
            OffsetYinput.step="0.1";
            OffsetYinput.value=n.getOffsetY();
            div.appendChild(OffsetYinput);
    
        var OffsetYropertyValue=document.createElement("lable");
            OffsetYropertyValue.textContent=OffsetYinput.value;
            div.appendChild(OffsetYropertyValue);
    
        OffsetYinput.addEventListener('mousedown',function(event){
            OffsetYismove=true;
        });
        OffsetYinput.addEventListener('mousemove',function(event){
            if (OffsetYismove) {
                n.setOffsetY(Number(OffsetYinput.value*1.0));
                OffsetYropertyValue.textContent=OffsetYinput.value;
                n.callBaseCalibration();
            }
        });
        OffsetYinput.addEventListener('mouseup',function(event){
            OffsetYismove=false;
        });
    }
    //ratio
    if(n.getRatio && n.setRatioA){
        var RatioAismove=false;
        var div=document.createElement("div");
        inputarea.appendChild(div);
        //text
        var RatioApropertyName=document.createElement("lable");
            RatioApropertyName.textContent="RatioA";
            div.appendChild(RatioApropertyName);
        //input
        var RatioAinput=document.createElement("input");
            RatioAinput.type="range";
            RatioAinput.min="0";
            RatioAinput.max="1";
            RatioAinput.step="0.01";
            RatioAinput.value=n.getRatio().a;
            div.appendChild(RatioAinput);
    
        var RatioAropertyValue=document.createElement("lable");
            RatioAropertyValue.textContent=RatioAinput.value;
            div.appendChild(RatioAropertyValue);
    
        RatioAinput.addEventListener('mousedown',function(event){
            RatioAismove=true;
        });
        RatioAinput.addEventListener('mousemove',function(event){
            if (RatioAismove) {
                n.setRatioA(Number(RatioAinput.value*1.0));
                RatioAropertyValue.textContent=RatioAinput.value;
                n.callBaseCalibration();
            }
        });
        RatioAinput.addEventListener('mouseup',function(event){
            RatioAismove=false;
        });
    }
    if(n.getRatio && n.setRatioB){
        var RatioBismove=false;
        var div=document.createElement("div");
        inputarea.appendChild(div);
        //text
        var RatioBpropertyName=document.createElement("lable");
            RatioBpropertyName.textContent="RatioB";
            div.appendChild(RatioBpropertyName);
        //input
        var RatioBinput=document.createElement("input");
            RatioBinput.type="range";
            RatioBinput.min="0";
            RatioBinput.max="1";
            RatioBinput.step="0.01";
            RatioBinput.value=n.getRatio().b;
            div.appendChild(RatioBinput);
    
        var RatioBropertyValue=document.createElement("lable");
            RatioBropertyValue.textContent=RatioBinput.value;
            div.appendChild(RatioBropertyValue);
    
        RatioBinput.addEventListener('mousedown',function(event){
            RatioBismove=true;
        });
        RatioBinput.addEventListener('mousemove',function(event){
            if (RatioBismove) {
                n.setRatioB(Number(RatioBinput.value*1.0));
                RatioBropertyValue.textContent=RatioBinput.value;
                n.callBaseCalibration();
            }
        });
        RatioBinput.addEventListener('mouseup',function(event){
            RatioBismove=false;
        });
    }
    //windowSize
    if(n.getWindowSize && n.setWindowW){
        var WindowWismove=false;
        var div=document.createElement("div");
        inputarea.appendChild(div);
        //text
        var WindowWpropertyName=document.createElement("lable");
            WindowWpropertyName.textContent="WindowW";
            div.appendChild(WindowWpropertyName);
        //input
        var WindowWinput=document.createElement("input");
            WindowWinput.type="range";
            WindowWinput.min="0";
            WindowWinput.max="20";
            WindowWinput.step="0.1";
            WindowWinput.value=n.getWindowSize().w;
            div.appendChild(WindowWinput);
    
        var WindowWropertyValue=document.createElement("lable");
            WindowWropertyValue.textContent=WindowWinput.value;
            div.appendChild(WindowWropertyValue);
    
        WindowWinput.addEventListener('mousedown',function(event){
            WindowWismove=true;
        });
        WindowWinput.addEventListener('mousemove',function(event){
            if (WindowWismove) {
                n.setWindowW(Number(WindowWinput.value*1.0));
                WindowWropertyValue.textContent=WindowWinput.value;
                n.callBaseCalibration();
            }
        });
        WindowWinput.addEventListener('mouseup',function(event){
            WindowWismove=false;
        });
    }
    if(n.getWindowSize && n.setWindowH){
        var WindowHismove=false;
        var div=document.createElement("div");
        inputarea.appendChild(div);
        //text
        var WindowHpropertyName=document.createElement("lable");
            WindowHpropertyName.textContent="WindowH";
            div.appendChild(WindowHpropertyName);
        //input
        var WindowHinput=document.createElement("input");
            WindowHinput.type="range";
            WindowHinput.min="0";
            WindowHinput.max="20";
            WindowHinput.step="0.1";
            WindowHinput.value=n.getWindowSize().h;
            div.appendChild(WindowHinput);
    
        var WindowHropertyValue=document.createElement("lable");
            WindowHropertyValue.textContent=WindowHinput.value;
            div.appendChild(WindowHropertyValue);
    
        WindowHinput.addEventListener('mousedown',function(event){
            WindowHismove=true;
        });
        WindowHinput.addEventListener('mousemove',function(event){
            if (WindowHismove) {
                n.setWindowH(Number(WindowHinput.value*1.0));
                WindowHropertyValue.textContent=WindowHinput.value;
                n.callBaseCalibration();
            }
        });
        WindowHinput.addEventListener('mouseup',function(event){
            WindowHismove=false;
        });
    }
}


function timeFuction(){
    setInterval(function(){
        if(go){
            var backWall=-1;
            var rightWall=-1;
            var leftWall=-1;
            var frontWall=-1;
            var roof=-1;
            var base=-1;
            var interWall=[];
            var nodes=scene.findNodes();
            for(var i=0;i<nodes.length;i++){
                var node = nodes[i];
                if(node.getType()=="name"){
                    if(node.getName()=="backWall"){
                        //         material  name     matrix  texture  element
                        backWall=node.nodes[0].nodes[0].nodes[0].nodes[0].nodes[0];
                    }
                    else if(node.getName()=="frontWall")frontWall=node.nodes[0].nodes[0].nodes[0].nodes[0].nodes[0];
                    else if(node.getName()=="leftWall")leftWall=node.nodes[0].nodes[0].nodes[0].nodes[0].nodes[0];
                    else if(node.getName()=="rightWall")rightWall=node.nodes[0].nodes[0].nodes[0].nodes[0].nodes[0];
                    else if(node.getName()=="interWall")interWall.push(node.nodes[0].nodes[0].nodes[0].nodes[0].nodes[0]);
                    else if(node.getName()=="base" && node.nodes[0].nodes[0].nodes[0].nodes[0].nodes[0].getLayer() == 1)base=node.nodes[0].nodes[0].nodes[0].nodes[0].nodes[0];
                }
                if(node.getType()=="flags"){
                    if(lastFloor == -1 ||
                        (node.nodes[0].nodes[0].nodes[0].nodes[0].nodes[0].nodes[0].getLayer && node.nodes[0].nodes[0].nodes[0].nodes[0].nodes[0].nodes[0].getLayer() == lastFloor)){
                        node.setTransparent(false);
                        node.setPicking(true);
                    }
                    else{
                        node.setTransparent(true);
                        node.setPicking(false);
                    }
                }
                if(node.getType() == "material"){
                    if(node.getID() == lastid){
                        node.setColor({r:0.7,g:0.7,b:0.3});
                    }else{
                        node.setColor({r:1,g:1,b:1});
                    }
                }
                if(node.getType() == "texture"){
                    if(hasTexture){
                        
                    }else{
                        node._initTexture();
                    }
                }
            }
            if(base != -1){
                base.callBaseCalibration();
            }
            
        }
    }, 16);
}

function Calibration(){
    var base=-1;
    var nodes=scene.findNodes();
    for(var i=0;i<nodes.length;i++){
        var node = nodes[i];
        if(node.getType()=="name"){
            if(node.getName()=="base" && node.nodes[0].nodes[0].nodes[0].nodes[0].nodes[0].getLayer() == 1){
                base=node.nodes[0].nodes[0].nodes[0].nodes[0].nodes[0];
                break;
            }
        }
    }
    if(base != -1){
        base.callBaseCalibration();
    }
}

function setAllTheElementPickable(){
    var nodes=scene.findNodes();
            for(var i=0;i<nodes.length;i++){
                var node = nodes[i];
                if(node.getType()=="flags"){
                        node.setPicking(true);
                }
            }
}

function isPowerEditMode(){
    var powerEditMode=document.getElementById('powerEditMode');
    return powerEditMode.checked;
}

function changeRoof(){
    go = false;
    var roof=-1;
    var nodes=scene.findNodes();
    var root = scene.findNode(3);
    var layerNumber=getTopLayer()
    var elements = [];
    for(var i=0;i<nodes.length;i++){
        var node = nodes[i];
        if(node.getType()=="name"){
            if(node.getName()=="roof" ){
                roof=node.nodes[0].nodes[0].nodes[0].nodes[0].nodes[0];
            }
        }
        if(node.getType() == "flags" && 
            node.nodes[0].getName() != "roof" &&
            node.nodes[0].getName() != "rightTriangle" &&
            node.nodes[0].getName() != "leftTriangle"){
            elements.push(node);
        }
    }
    if(roof != -1){
        if(roof.KillChildren)roof.KillChildren();
        if(roof.getType() == "roof/hip"){
            console.log("changed to gable");
            var rightTriangle = {
                type: "flags",
                flags:{transparent:false},
                nodes:
                [{
                    type: "name",
                    name: "rightTriangle",
        
                    nodes:
                    [{
                        type: "material",
                        color:{ r:0.8, g:0.8, b:0.8 },
                        alpha:0.2,
                        nodes:
                        [{
                            type: "name",
                            name: "wall.jpg",
        
                            nodes:
                            [{
                                type: "matrix",
                                elements:[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],
        
                                nodes:
                                [{
                                    type: "texture",
                                    src: "images/GeometryTexture/wall.jpg",
                                    applyTo: "color",
        
                                    nodes:
                                    [{
                                        type: "wall/triangle",
                                        layer: layerNumber,
                                        height: roof.getHeight(),
                                        width: roof.getWidth(),
                                        thickness: 1,
                                        ratio: {a: roof.getRatio().a , b: roof.getRatio().b},
                                        scale: {x: 1, y: 1, z: 1},
                                        rotate: {x: 0, y: 90, z: 0},
                                        translate: {x: 0, y: 0, z: 0}
                                    }]
                                }]
                            }]
                        }]
                    }]
                }] 
            };
            var leftTriangle = {
                type: "flags",
                flags:{transparent:false},
                nodes:
                [{
                    type: "name",
                    name: "leftTriangle",
        
                    nodes:
                    [{
                        type: "material",
                        color:{ r:0.8, g:0.8, b:0.8 },
                        alpha:0.2,
                        nodes:
                        [{
                            type: "name",
                            name: "wall.jpg",
        
                            nodes:
                            [{
                                type: "matrix",
                                elements:[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],
        
                                nodes:
                                [{
                                    type: "texture",
                                    src: "images/GeometryTexture/wall.jpg",
                                    applyTo: "color",
        
                                    nodes:
                                    [{
                                        type: "wall/triangle",
                                        layer: layerNumber,
                                        height: roof.getHeight(),
                                        width: roof.getWidth(),
                                        thickness: 1,
                                        ratio: {a: roof.getRatio().a , b: roof.getRatio().b},
                                        scale: {x: 1, y: 1, z: 1},
                                        rotate: {x: 0, y: 90, z: 0},
                                        translate: {x: 0, y: 0, z: 0}
                                    }]
                                }]
                            }]
                        }]
                    }]
                }] 
            };
            var gable = {
                type: "flags",
                flags:{transparent:false},
                nodes:
                [{
                    type: "name",
                    name: "roof",
        
                    nodes:
                    [{
                        type: "material",
                        color:{ r:0.8, g:0.8, b:0.8 },
                        alpha:0.2,
                        nodes:
                        [{
                            type: "name",
                            name: "roof.jpg",
        
                            nodes:
                            [{
                                type: "matrix",
                                elements:[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],
        
                                nodes:
                                [{
                                    type: "texture",
                                    src: "images/GeometryTexture/roof.jpg",
                                    applyTo: "color",
        
                                    nodes:
                                    [{
                                        type: "roof/gable",
                                        layer: layerNumber,
                                        height: roof.getHeight(),
                                        width: roof.getWidth(),
                                        thickness: 1,
                                        depth: roof.getDepth(),
                                        ratio: {a: roof.getRatio().a , b: roof.getRatio().b},
                                        scale: {x: 1, y: 1, z: 1},
                                        rotate: {x: 0, y: 90, z: 0},
                                        translate: {x: 0, y: 0, z: 0}
                                    }]
                                }]
                            }]
                        }]
                    }]
                }] 
            };
            root.addNode(hip);
            roof.getParent().getParent().getParent().getParent().getParent().getParent().destroy();
        }else if(roof.getType() == "roof/gable"){
            console.log("changed to hip");
            var hip = {
                type: "flags",
                flags:{transparent:false},
                nodes:
                [{
                    type: "name",
                    name: "roof",
        
                    nodes:
                    [{
                        type: "material",
                        color:{ r:0.8, g:0.8, b:0.8 },
                        alpha:0.2,
                        nodes:
                        [{
                            type: "name",
                            name: "roof.jpg",
        
                            nodes:
                            [{
                                type: "matrix",
                                elements:[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],
        
                                nodes:
                                [{
                                    type: "texture",
                                    src: "images/GeometryTexture/roof.jpg",
                                    applyTo: "color",
        
                                    nodes:
                                    [{
                                        type: "roof/hip",
                                        layer: layerNumber,
                                        height: roof.getHeight(),
                                        width: roof.getWidth(),
                                        thickness: 2,
                                        depth: roof.getDepth(),
                                        ratio: {a: roof.getRatio().a , b: roof.getRatio().b},
                                        toplen: 0,
                                        scale: {x: 1, y: 1, z: 1},
                                        rotate: {x: 0, y: 90, z: 0},
                                        translate: {x: 0, y: 0, z: 0}
                                    }]
                                }]
                            }]
                        }]
                    }]
                }] 
            };
            root.addNode(hip);
            roof.getParent().getParent().getParent().getParent().getParent().getParent().destroy();
        }
        
    }
    lastFloor =-1;
    lastid=-1;
    go = true;
    Calibration();
    
}

function getHipInfo(){
    return "<element><type>roof/hip</type><transform><scale>1,1,1</scale><rotate>0,90,0</rotate><translate>0,0,0</translate></transform><texture>roof.jpg</texture><pos>roof</pos><property><width>18</width><height>8</height><depth>18</depth><thickness>2</thickness><ratio>0.5,0.5</ratio><toplen>6</toplen><layer>2</layer></property></element>";
}
function getgableInfo(){
    return '<element><type>roof/gable</type><transform><scale>1,1,1</scale><rotate>0,90,0</rotate><translate>0,21.5,0</translate></transform><texture>roof.jpg</texture><pos>roof</pos><property><height>5</height><width>8</width><thickness>1</thickness><depth>18</depth><ratio>0.5,0.5</ratio></property></element><element><type>wall/triangle</type><transform><scale>1,1,1</scale><rotate>0,90,0</rotate><translate>17,22,0</translate></transform>    <texture>wall.jpg</texture><pos>rightTriangle</pos><property><height>5</height><width>8</width><thickness>1</thickness><ratio>0.5,0.5</ratio></property></element><element><type>wall/triangle</type><transform><scale>1,1,1</scale><rotate>0,-90,0</rotate><translate>-17,22,0</translate></transform>        <texture>wall.jpg</texture><pos>leftTriangle</pos><property><height>5</height><width>8</width><thickness>1</thickness><ratio>0.5,0.5</ratio></property></element>';
}
function getElementXML(n){
    var xml='';
    xml+='\t'+'<element>'+'\n';
        if(n.getType)xml+='\t\t'+'<type>'+n.getType()+'</type>'+'\n';
        xml+='\t\t'+'<transform>'+'\n';
            if(n.getScale){
                var scale = n.getScale();
                xml+='\t\t\t'+'<scale>'+scale[0]+','+scale[1]+','+scale[2]+'</scale>'+'\n';
            }
            if(n.getRotate){
                var rotate = n.getRotate();
                xml+='\t\t\t'+'<rotate>'+rotate[0]+','+rotate[1]+','+rotate[2]+'</rotate>'+'\n';
            }
            if(n.getTranslate){
                var translate = n.getTranslate();
                xml+='\t\t\t'+'<translate>'+translate[0]+','+translate[1]+','+translate[2]+'</translate>'+'\n';
            }
        xml+='\t\t'+'</transform>'+'\n';
        xml+='\t\t'+'<texture>';
        if(n.getParent().getParent().getParent().getName){
            xml+=n.getParent().getParent().getParent().getName();
        }
        xml+='</texture>'+'\n';
        xml+='\t\t'+'<pos>';
        if(n.getParent().getParent().getParent().getParent().getParent().getName){
            xml+=n.getParent().getParent().getParent().getParent().getParent().getName();
        }
        xml+='</pos>'+'\n';
        xml+='\t\t'+'<property>'+'\n';
            if(n.getLayer)xml+='\t\t\t'+'<layer>'+n.getLayer()+'</layer>'+'\n';
            if(n.getRealHeight)xml+='\t\t\t'+'<height>'+n.getRealHeight()+'</height>'+'\n';
            else if(n.getHeight)xml+='\t\t\t'+'<height>'+n.getHeight()+'</height>'+'\n';
            if(n.getRealWidth)xml+='\t\t\t'+'<width>'+n.getRealWidth()+'</width>'+'\n';
            else if(n.getWidth)xml+='\t\t\t'+'<width>'+n.getWidth()+'</width>'+'\n';
            if(n.getThickness)xml+='\t\t\t'+'<thickness>'+n.getThickness()+'</thickness>'+'\n';
            if(n.getDepth)xml+='\t\t\t'+'<depth>'+n.getDepth()+'</depth>'+'\n';
            if(n.getRatio){
                var ratio = n.getRatio();
                xml+='\t\t\t'+'<ratio>'+ratio.a+','+ratio.b+'</ratio>'+'\n';
            }
            if(n.getPercentX && n.getPercentX())xml+='\t\t\t'+'<percentX>'+n.getPercentX()+'</percentX>'+'\n';
            if(n.getPercentY && n.getPercentY())xml+='\t\t\t'+'<percentY>'+n.getPercentY()+'</percentY>'+'\n';
            if(n.getPriority && n.getPriority())xml+='\t\t\t'+'<priority>'+n.getPriority()+'</priority>'+'\n';
            if(n.getToplen && n.getToplen())xml+='\t\t\t'+'<toplen>'+n.getToplen()+'</toplen>'+'\n';
            if(n.getDirection)xml+='\t\t\t'+'<direction>'+'\"'+n.getDirection()+'\"'+'</direction>'+'\n';
            if(n.getOffsetX && n.getOffsetX())xml += '\t\t\t'+'<OffsetX>'+n.getOffsetX()+'</OffsetX>'+'\n';
            if(n.getOffsetY && n.getOffsetY())xml += '\t\t\t'+'<OffsetY>'+n.getOffsetY()+'</OffsetY>'+'\n';
            if(n.getWindowSize){
                var size = n.getWindowSize();
                xml+='\t\t\t'+'<windowW>'+size.w+'</windowW>'+'\n';
                xml+='\t\t\t'+'<windowH>'+size.h+'</windowH>'+'\n';
            }
        xml+='\t\t'+'</property>'+'\n';
    xml+='\t'+'</element>'+'\n';
    return xml;
}
function generateXML(){
    var xml='';
    xml+='<layer>'+'\n';
    var nodes=scene.findNodes();
    for(var i=0;i<nodes.length;i++){
        var node = nodes[i];
        if(node.getType()=="flags"){
            var n= node.nodes[0].nodes[0].nodes[0].nodes[0].nodes[0].nodes[0];
            xml += getElementXML(n);
        }
    }
    xml+='</layer>'+'\n';
    console.log(xml);
    return xml;
}

function saveXML(){
    download(generateXML(), "3Dhouse.3Dhouse", 'text/plain');
}



function RedButtonClick(){
    superXReProduction(generateXML());
}

function setlayout()
{
	var canvas = document.getElementById("archcanvas");
	canvas.width = screen.width;
	canvas.height = screen.height;
	
}
