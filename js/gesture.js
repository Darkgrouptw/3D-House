//pick object normal to decide which view point you want
var tmpNormal = null;
// distance between origin point and camera position
var camDist = null;

//console.log("objectId ", objectId);
//var noLayer = getNodeLayer(objectId);
//console.log("nodeLayer ", scene.getNode(objectId).nodes[0].nodes[0].nodes[0].getLayer());
//console.log("noLayer ", noLayer);
//var noName = getNodeName(objectId);
//var noType = getNodeType(objectId);
//console.log("nodeType ", scene.getNode(objectId).nodes[0].nodes[0].nodes[0]);
//console.log("noType ", noType);
//console.log("nodeName ", scene.getNode(objectId).parent.parent.getName());
//console.log("noName ", noName);
//pickNode = scene.findNode(objectId).parent.parent.getName();
//var pickLayer = scene.getNode(objectId).nodes[0].nodes[0].nodes[0].getLayer();

var numberOfType = ["base/basic","wall/door_entry","wall/single_window","wall/no_window","wall/multi_window",
                    "roof/cross_gable","roof/gable","roof/hip","roof/mansard","wall/triangle","window/fixed"];

var numberOfName = ["base","rightWall","leftWall","backWall","roof","rightTriangle","leftTriangle","interWall","window"];

var numberOfRoof = ["roof/cross_gable","roof/gable","roof/hip","roof/mansard"];

function Sign(x) 
{
    return typeof x === 'number' ? x ? x < 0 ? -1 : 1 : x === x ? 0 : NaN : NaN;
}

function getNodeBase(objName, objLayer)
{
    var tmpNode = scene.findNodes();
    var nodeObject;
    for(var i = 0; i < tmpNode.length; i++)
    {
        var nodeType = tmpNode[i].type;
        if(nodeType == "name")
        {
            if(tmpNode[i].getName() == objName && getNodeLayer(tmpNode[i].getID()) == objLayer)
            {
                nodeObject = getNodeType(tmpNode[i].getID());
                break;
            }
        }
    }
    return nodeObject;
}

function getNodeRoof()
{
    var tmpNode = scene.findNodes();
    var nodeObject;
    for(var i = 0; i < tmpNode.length; i++)
    {
        if(numberOfRoof.indexOf(tmpNode[i].type) > -1)
        {
            nodeObject = tmpNode[i];
            break;
        }
    }
    return nodeObject;
}

function getNodeLayer(id)
{
    var currentNode = scene.getNode(id).nodes[0];
    var nodeType;
    var nodeLayer;
    while(true)
    {
        nodeType = currentNode.type;
        // Move to next node
        if (numberOfType.indexOf(nodeType) > -1) {
            nodeLayer = currentNode.getLayer();
            break;
        } 
        else {
            currentNode = currentNode.nodes[0];
        }
    }
    return nodeLayer;
}

function getNodeType(id)
{
    var currentNode = scene.getNode(id).nodes[0];
    var nodeType;
    while(true)
    {
        nodeType = currentNode.type;
        // Move to next node
        if (numberOfType.indexOf(nodeType) > -1) {
            break;
        } else {
            currentNode = currentNode.nodes[0];
        }
    }
    return currentNode;
}

function getNodeName(id)
{
    var currentNode = scene.getNode(id).parent;
    var nodeType;
    var nodeName;
    while(true)
    {
        nodeType = currentNode.type;
        if(nodeType == 'name')
        {
            nodeName = currentNode.getName();
            // Move to the parent
            if (numberOfName.indexOf(nodeName) > -1) {
                break;
            }
            else
            {
                console.log("NodeName was not found!!!");
                break;
            }
        }
        else
        {
            currentNode = currentNode.parent;
        }
    }
    return nodeName;
}

function windowOffsetY(id, tmpLength, tmpAxis)
{
    var tmpOffsetY;
    var n = scene.getNode(3).getEye();
    var tmpNode = getNodeType(id);

    switch(tmpAxis)
    {
        case 1:
        case 3:
            if(n.x < 0)
            {
                tmpOffsetY = tmpNode.getRatio().b;
                tmpOffsetY -= Sign(tmpLength) / 50;
                tmpNode.setRatioB(tmpOffsetY);
                tmpNode.callBaseCalibration();
            }
            else
            {
                tmpOffsetY = tmpNode.getRatio().b;
                tmpOffsetY -= Sign(tmpLength) / 50;
                tmpNode.setRatioB(tmpOffsetY);
                tmpNode.callBaseCalibration();
            }
            break;
    }
}

function windowOffsetX(id, tmpLength, tmpAxis)
{
    var tmpOffsetX;
    var n = scene.getNode(3).getEye();
    var tmpNode = getNodeType(id);

    switch(tmpAxis)
    {
        case 1:
        case 3:
            if(n.x < 0)
            {
                tmpOffsetX = tmpNode.getRatio().a;
                tmpOffsetX -= Sign(tmpLength) / 50;
                tmpNode.setRatioA(tmpOffsetX);
                tmpNode.callBaseCalibration();
            }
            else
            {
                tmpOffsetX = tmpNode.getRatio().a;
                tmpOffsetX += Sign(tmpLength) / 50;
                tmpNode.setRatioA(tmpOffsetX);
                tmpNode.callBaseCalibration();
            }
            break;
    }
}

function doorOffsetX(id, tmpLength, tmpAxis)
{
    var tmpOffsetX;
    var n = scene.getNode(3).getEye();
    var tmpNode = getNodeType(id);

    switch(tmpAxis)
    {
        case 1:
        case 3:
            if(n.x < 0)
            {
                tmpOffsetX = tmpNode.getPosratio();
                tmpOffsetX -= Sign(tmpLength) / 50;
                tmpNode.setPosratio(tmpOffsetX);
                tmpNode.callBaseCalibration();
            }
            else
            {
                tmpOffsetX = tmpNode.getPosratio();
                tmpOffsetX += Sign(tmpLength) / 50;
                tmpNode.setPosratio(tmpOffsetX);
                tmpNode.callBaseCalibration();
            }
            break;
    }
}

function baseOffsetX(id, tmpLength, tmpAxis)
{
    var tmpOffsetX;
    var tmpOffsetY;
    var n = scene.getNode(3).getEye();
    var tmpNode = getNodeType(id);

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
    var tmpNode = getNodeType(id);

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
    var tmpNode = getNodeType(id);

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
    var tmpNode = getNodeType(id);

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

function setWindowWidth(object, length, limit)
{
    var tmpWidth = object.getWindowSize().w;
    if(length >= 0)
    {
        tmpWidth += Sign(length);
        object.setWindowW(tmpWidth) / 30;
        object.callBaseCalibration();
    }
    else
    {
        if(tmpWidth > limit)
        {
            tmpWidth += Sign(length);
            object.setWindowW(tmpWidth) / 30;
            object.callBaseCalibration();
        }
        else
        {
            tmpWidth = limit;
            object.setWindowW(tmpWidth) / 30;
            object.callBaseCalibration();
        }
    }
}

function setWindowHeight(object, length, limit)
{
    var tmpHeight = object.getWindowSize().h;
    if(length >= 0)
    {
        tmpHeight += Sign(length);
        object.setWindowH(tmpHeight) / 30;
        object.callBaseCalibration();
    }
    else
    {
        if(tmpHeight > limit)
        {
            tmpHeight += Sign(length);
            object.setWindowH(tmpHeight) / 30;
            object.callBaseCalibration();
        }
        else
        {
            tmpHeight = limit;
            object.setWindowH(tmpHeight) / 30;
            object.callBaseCalibration();
        }
    }
}

function setDoorWidth(object, length, limit)
{
    var tmpWidth = object.getDoorSize().w;
    if(length >= 0)
    {
        tmpWidth += Sign(length);
        object.setDoorW(tmpWidth) / 30;
        object.callBaseCalibration();
    }
    else
    {
        if(tmpWidth > limit)
        {
            tmpWidth += Sign(length);
            object.setDoorW(tmpWidth) / 30;
            object.callBaseCalibration();
        }
        else
        {
            tmpWidth = limit;
            object.setDoorW(tmpWidth) / 30;
            object.callBaseCalibration();
        }
    }
}

function setDoorHeight(object, length, limit)
{
    var tmpHeight = object.getDoorSize().h;
    if(length >= 0)
    {
        tmpHeight += Sign(length);
        object.setDoorH(tmpHeight) / 30;
        object.callBaseCalibration();
    }
    else
    {
        if(tmpHeight > limit)
        {
            tmpHeight += Sign(length);
            object.setDoorH(tmpHeight) / 30;
            object.callBaseCalibration();
        }
        else
        {
            tmpHeight = limit;
            object.setDoorH(tmpHeight) / 30;
            object.callBaseCalibration();
        }
    }
}

function horizontalAxis(id, tmpLength, tmpAxis)
{
    var n;
    var tmpLayer = getNodeLayer(id);
    var nameNode = getNodeName(id);
    if(nameNode == "rightTriangle" || nameNode == "leftTriangle")
    {
        n = getNodeRoof();
    }
    else
    {
        n = getNodeType(id);
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
                var tmpBackWall = getNodeBase("backWall", tmpLayer);
                setObjectWidth(tmpBackWall, tmpLength, 18);
            }
            break;
        case 1:
            if(nameNode == "window")
            {
                n = getNodeType(getWallID[getWindowID.indexOf(id)]);
                setWindowWidth(n, tmpLength, 3);
            }
            else if(nameNode == "rightWall" || nameNode == "leftWall")
            {
                if(partmode == 0)
                {
                    setWindowWidth(n, tmpLength, 3);
                }
                else if(partmode == 1)
                {
                    setDoorWidth(n, tmpLength, 3);
                }
                else
                {
                    setObjectWidth(n, tmpLength, 7);
                }
            }
            else if(nameNode == "roof" || nameNode == "rightTriangle" || nameNode == "leftTriangle")
            {
                setObjectWidth(n, tmpLength, 8);
            }
            else if(nameNode == "base")
            {
                var tmpRightWall = getNodeBase("rightWall", tmpLayer);
                setObjectWidth(tmpRightWall, tmpLength, 7);
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
                var tmpBackWall = getNodeBase("backWall", tmpLayer);
                setObjectWidth(tmpBackWall, tmpLength, 18);
            }
            break;
        case 3:
            if(nameNode == "window")
            {
                n = getNodeType(getWallID[getWindowID.indexOf(id)]);
                setWindowWidth(n, tmpLength, 3);
            }
            else if(nameNode == "rightWall" || nameNode == "leftWall")
            {
                if(partmode == 0)
                {
                    setWindowWidth(n, tmpLength, 3);
                }
                else if(partmode == 1)
                {
                    setDoorWidth(n, tmpLength, 3);
                }
                else
                {
                    setObjectWidth(n, tmpLength, 7);
                }
            }
            else if(nameNode == "roof" || nameNode == "rightTriangle" || nameNode == "leftTriangle")
            {
                setObjectWidth(n, tmpLength, 8);
            }
            else if(nameNode == "base")
            {
                var tmpRightWall = getNodeBase("rightWall", tmpLayer);
                setObjectWidth(tmpRightWall, tmpLength, 7);
            }
            break;
    }
}

function verticalAxis(id, tmpLength, tmpAxis)
{
    var n;
    var tmpLayer = getNodeLayer(id);
    var nameNode = getNodeName(id);
    if(nameNode == "rightTriangle" || nameNode == "leftTriangle")
    {
        n = getNodeRoof();
    }
    else
    {
        n = getNodeType(id);
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
            if(nameNode == "window")
            {
                n = getNodeType(getWallID[getWindowID.indexOf(id)]);
                setWindowHeight(n, tmpLength, 3);
            }
            else if(nameNode == "rightWall" || nameNode == "leftWall")
            {
                if(partmode == 0)
                {
                    setWindowHeight(n, tmpLength, 3);
                }
                else if(partmode == 1)
                {
                    setDoorHeight(n, tmpLength, 6);
                }
                else
                {
                    setObjectHeight(n, tmpLength, 8);
                }
            }
            else if(nameNode == "backWall")
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
                var tmpRightWall = getNodeBase("rightWall", tmpLayer);
                setObjectWidth(tmpRightWall, tmpLength, 7);
            }
            break;
        case 3:
            if(nameNode == "window")
            {
                n = getNodeType(getWallID[getWindowID.indexOf(id)]);
                setWindowHeight(n, tmpLength, 3);
            }
            else if(nameNode == "rightWall" || nameNode == "leftWall")
            {
                if(partmode == 0)
                {
                    setWindowHeight(n, tmpLength, 3);
                }
                else if(partmode == 1)
                {
                    setDoorHeight(n, tmpLength, 6);
                }
                else
                {
                    setObjectHeight(n, tmpLength, 8);
                }
            }
            else if(nameNode == "backWall")
            {
                setObjectWidth(n, tmpLength, 18);
            }
            else if(nameNode == "roof" || nameNode == "rightTriangle" || nameNode == "leftTriangle")
            {
                setObjectDepth(n, tmpLength, 18);
            }
            else if(nameNode == "base")
            {
                var tmpBackWall = getNodeBase("backWall", tmpLayer);
                setObjectWidth(tmpBackWall, tmpLength, 18);
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
    var tmpNode = getNodeType(id);

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