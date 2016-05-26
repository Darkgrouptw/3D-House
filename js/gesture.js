//pick object normal to decide which view point you want
var tmpNormal = null;
// distance between origin point and camera position
var camDist = null;

var numberOfType = ["base/basic","wall/door_entry","wall/single_window","wall/no_window","wall/multi_window",
                    "roof/cross_gable","roof/gable","roof/hip","roof/mansard","wall/triangle","window/fixed"];

var numberOfName = ["base","rightWall","leftWall","backWall","roof","rightTriangle","leftTriangle","interWall","window"];

var numberOfRoof = ["roof/cross_gable","roof/gable","roof/hip","roof/mansard"];

var hitPos = {};
function Sign(x) 
{
    return typeof x === 'number' ? x ? x < 0 ? -1 : 1 : x === x ? 0 : NaN : NaN;
}

/*function getDependencyWall(id)
{
    var tmpNode = getNodeType(getWallID[getWindowID.indexOf(id)]);
    var tmpWidth = tmpNode.getWidth();
    var tmpHeight = tmpNode.getHeight();
    var tmpWindowCenter = tmpNode.getWindowCenter();
    var tmpCenter = getNodeCenter(id);
    console.log("tmpNode ", tmpNode);
    console.log("tmpWidth ", tmpWidth, " tmpHeight ", tmpHeight);
    console.log("tmpCenter ", tmpCenter, " tmpWindowCenter ", tmpWindowCenter);

    var centerX = (tmpWidth + tmpCenter[0]) / (2 * tmpWidth);
    var centerY = (2 * tmpHeight - tmpCenter[1]) / (2 * tmpHeight);
    console.log("centerX ", centerX, " centerY ", centerY);

    var getX = 999, index = 0;
    for(var i = 0; i < (tmpWindowCenter.length / 2); i++)
    {
        var tmpX = Math.sqrt(Math.pow((centerX - tmpWindowCenter[i * 2]), 2));
        console.log("i ", i, " tmpX ", tmpX);
        if(tmpX < getX)
        {
            getX = tmpX;
            index = i;
        }
    }
    console.log("index ", index * 2, " [index * 2]", tmpWindowCenter[index * 2]);
    console.log("tmpWindowCenter[0]", tmpWindowCenter[0]);
    console.log("tmpWindowCenter[1]", tmpWindowCenter[1]);
    console.log("tmpWindowCenter[2]", tmpWindowCenter[2]);
    console.log("tmpWindowCenter[3]", tmpWindowCenter[3]);
}*/

function trackPosition(id)
{
    //var count = 0;
    var tmpNode = scene.getNode(id);
    tmpNode.on("rendered",
        function (event) {
            //count++;
            //console.log("id ", id, "gesture position ", event.getCanvasPos(), " count ", count);

            if(id == pickObjId)
            {
                //console.log("id ", id, "gesture position ", event.getCanvasPos(), " count ", count);
                hitPos = event.getCanvasPos();
            }
        });
}

function getTopLeftCorner(id)
{
    var currentAxis = getAxis();
    var camera = scene.getNode(3).getEye();
    var corner = [];
    var VertexX = [];
    var VertexY = [];
    var VertexZ = [];
    var center = [];
    var tmpNode = getNodeType(id);

    var tmpT = {};
    tmpT.rotate = tmpNode.getRotate();
    tmpT.scale = tmpNode.getScale();
    tmpT.translate = tmpNode.getTranslate();
    var transMatrix = utility.transformMatrix(tmpT);

    var getPos = tmpNode.nodes[0].getPositions();
    for(var j = 0; j < getPos.length; j += 3)
    {
        var tmpP = [];
        tmpP.push(getPos[j]);
        tmpP.push(getPos[j + 1]);
        tmpP.push(getPos[j + 2]);
        tmpP.push(1);
        var transPos = SceneJS_math_mulMat4v4(transMatrix, tmpP);
        VertexX.push(transPos[0]);
        VertexY.push(transPos[1]);
        VertexZ.push(transPos[2]);
    }
    //console.log(VertexX);

    var minX = Math.min(...VertexX);
    var maxX = Math.max(...VertexX);
    var minY = Math.min(...VertexY);
    var maxY = Math.max(...VertexY);
    var minZ = Math.min(...VertexZ);
    var maxZ = Math.max(...VertexZ);
    console.log("minX ", minX, " maxX ", maxX);
    console.log("minY ", minY, " maxY ", maxY);
    console.log("minZ ", minZ, " maxZ ", maxZ);


}

function multiWindowOffsetX(id, tmpLength, tmpAxis)
{
    var n = scene.getNode(3).getEye();
    var tmpNode = getNodeType(getWallID[getWindowID.indexOf(id)]);
    var tmpWidth = tmpNode.getWidth();
    var tmpHeight = tmpNode.getHeight();
    var tmpWindowCenter = tmpNode.getWindowCenter();
    var tmpCenter = getNodeCenter(id);
    var centerX = (tmpWidth + tmpCenter[0]) / (2 * tmpWidth);
    var centerY = (2 * tmpHeight - tmpCenter[1]) / (2 * tmpHeight);

    var getX = 999, index = -1;
    for(var i = 0; i < (tmpWindowCenter.length / 2); i++)
    {
        var tmpX = Math.sqrt(Math.pow((centerX - tmpWindowCenter[i * 2]), 2) + Math.pow((centerY - tmpWindowCenter[i * 2 + 1]), 2));
        if(tmpX < getX)
        {
            getX = tmpX;
            index = i;
        }
    }

    switch(tmpAxis)
    {
        case 0:
        case 2:
            if(n.z < 0)
            {
                tmpWindowCenter[index * 2] -= Sign(tmpLength) / 100;
                tmpNode.setWindowCenter(tmpWindowCenter);
                tmpNode.callBaseCalibration();
            }
            else
            {
                tmpWindowCenter[index * 2] += Sign(tmpLength) / 100;
                tmpNode.setWindowCenter(tmpWindowCenter);
                tmpNode.callBaseCalibration();
            }
            break;
    }
}

function multiWindowOffsetY(id, tmpLength, tmpAxis)
{
    var n = scene.getNode(3).getEye();
    var tmpNode = getNodeType(getWallID[getWindowID.indexOf(id)]);
    var tmpWidth = tmpNode.getWidth();
    var tmpHeight = tmpNode.getHeight();
    var tmpWindowCenter = tmpNode.getWindowCenter();
    var tmpCenter = getNodeCenter(id);
    var centerX = (tmpWidth + tmpCenter[0]) / (2 * tmpWidth);
    var centerY = (2 * tmpHeight - tmpCenter[1]) / (2 * tmpHeight);

    var getY = 999, index = -1;
    for(var i = 0; i < (tmpWindowCenter.length / 2); i++)
    {
        var tmpY = Math.sqrt(Math.pow((centerX - tmpWindowCenter[i * 2]), 2) + Math.pow((centerY - tmpWindowCenter[i * 2 + 1]), 2));
        if(tmpY < getY)
        {
            getY = tmpY;
            index = i;
        }
    }

    switch(tmpAxis)
    {
        case 0:
        case 2:
            if(n.z < 0)
            {
                tmpWindowCenter[index * 2 + 1] -= Sign(tmpLength) / 50;
                tmpNode.setWindowCenter(tmpWindowCenter);
                tmpNode.callBaseCalibration();
            }
            else
            {
                tmpWindowCenter[index * 2 + 1] += Sign(tmpLength) / 50;
                tmpNode.setWindowCenter(tmpWindowCenter);
                tmpNode.callBaseCalibration();
            }
            break;
    }
}

function getNodeCenter(id)
{
    var VertexX = [];
    var VertexY = [];
    var VertexZ = [];
    var center = [];
    var tmpNode = getNodeType(id);

    var tmpT = {};
    tmpT.rotate = tmpNode.getRotate();
    tmpT.scale = tmpNode.getScale();
    tmpT.translate = tmpNode.getTranslate();
    var transMatrix = utility.transformMatrix(tmpT);

    var getPos = tmpNode.nodes[0].getPositions();
    for(var j = 0; j < getPos.length; j += 3)
    {
        var tmpP = [];
        tmpP.push(getPos[j]);
        tmpP.push(getPos[j + 1]);
        tmpP.push(getPos[j + 2]);
        tmpP.push(1);
        var transPos = SceneJS_math_mulMat4v4(transMatrix, tmpP);
        VertexX.push(transPos[0]);
        VertexY.push(transPos[1]);
        VertexZ.push(transPos[2]);
    }
    //console.log(VertexX);

    var minX = Math.min(...VertexX);
    var maxX = Math.max(...VertexX);
    var minY = Math.min(...VertexY);
    var maxY = Math.max(...VertexY);
    var minZ = Math.min(...VertexZ);
    var maxZ = Math.max(...VertexZ);
    //console.log("minX ", minX, " maxX ", maxX);
    //console.log("minY ", minY, " maxY ", maxY);
    //console.log("minZ ", minZ, " maxZ ", maxZ);

    center.push((minX + maxX) / 2);
    center.push((minY + maxY) / 2);
    center.push((minZ + maxZ) / 2);
    //console.log("center ", center);

    return center;
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
        case 0:
        case 2:
            if(n.z < 0)
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
        case 0:
        case 2:
            if(n.z < 0)
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
        case 0:
        case 2:
            if(n.z < 0)
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
            if(nameNode == "window")
            {
                n = getNodeType(getWallID[getWindowID.indexOf(id)]);
                setWindowWidth(n, tmpLength, 4);
            }
            else if(nameNode == "backWall")
            {
                setObjectWidth(n, tmpLength, 24);
            }
            else if(nameNode == "roof" || nameNode == "rightTriangle" || nameNode == "leftTriangle")
            {
                setObjectDepth(n, tmpLength, 24);
            }
            else if(nameNode == "base")
            {
                var tmpBackWall = getNodeBase("backWall", tmpLayer);
                setObjectWidth(tmpBackWall, tmpLength, 24);
            }
            break;
        case 1:
            if(nameNode == "window")
            {
                n = getNodeType(getWallID[getWindowID.indexOf(id)]);
                setWindowWidth(n, tmpLength, 4);
            }
            else if(nameNode == "rightWall" || nameNode == "leftWall")
            {
                if(partmode == 0)
                {
                    setWindowWidth(n, tmpLength, 4);
                }
                else if(partmode == 1)
                {
                    setDoorWidth(n, tmpLength, 5);
                }
                else
                {
                    setObjectWidth(n, tmpLength, 15);
                }
            }
            else if(nameNode == "roof" || nameNode == "rightTriangle" || nameNode == "leftTriangle")
            {
                setObjectWidth(n, tmpLength, 16);
            }
            else if(nameNode == "base")
            {
                var tmpRightWall = getNodeBase("rightWall", tmpLayer);
                setObjectWidth(tmpRightWall, tmpLength, 15);
            }
            break;
        case 2:
            if(nameNode == "window")
            {
                n = getNodeType(getWallID[getWindowID.indexOf(id)]);
                setWindowWidth(n, tmpLength, 4);
            }
            else if(nameNode == "backWall")
            {
                setObjectWidth(n, tmpLength, 24);
            }
            else if(nameNode == "roof" || nameNode == "rightTriangle" || nameNode == "leftTriangle")
            {
                setObjectDepth(n, tmpLength, 24);
            }
            else if(nameNode == "base")
            {
                var tmpBackWall = getNodeBase("backWall", tmpLayer);
                setObjectWidth(tmpBackWall, tmpLength, 24);
            }
            break;
        case 3:
            if(nameNode == "window")
            {
                n = getNodeType(getWallID[getWindowID.indexOf(id)]);
                setWindowWidth(n, tmpLength, 4);
            }
            else if(nameNode == "rightWall" || nameNode == "leftWall")
            {
                if(partmode == 0)
                {
                    setWindowWidth(n, tmpLength, 4);
                }
                else if(partmode == 1)
                {
                    setDoorWidth(n, tmpLength, 5);
                }
                else
                {
                    setObjectWidth(n, tmpLength, 15);
                }
            }
            else if(nameNode == "roof" || nameNode == "rightTriangle" || nameNode == "leftTriangle")
            {
                setObjectWidth(n, tmpLength, 16);
            }
            else if(nameNode == "base")
            {
                var tmpRightWall = getNodeBase("rightWall", tmpLayer);
                setObjectWidth(tmpRightWall, tmpLength, 15);
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
            if(nameNode == "window")
            {
                n = getNodeType(getWallID[getWindowID.indexOf(id)]);
                setWindowHeight(n, tmpLength, 4);
            }
            else if(nameNode == "rightWall" || nameNode == "leftWall" || nameNode == "backWall")
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
                setWindowHeight(n, tmpLength, 4);
            }
            else if(nameNode == "rightWall" || nameNode == "leftWall")
            {
                if(partmode == 0)
                {
                    setWindowHeight(n, tmpLength, 4);
                }
                else if(partmode == 1)
                {
                    setDoorHeight(n, tmpLength, 9);
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
            if(nameNode == "window")
            {
                n = getNodeType(getWallID[getWindowID.indexOf(id)]);
                setWindowHeight(n, tmpLength, 4);
            }
            else if(nameNode == "rightWall" || nameNode == "leftWall")
            {
                setObjectWidth(n, tmpLength, 7);
            }
            else if(nameNode == "roof" || nameNode == "rightTriangle" || nameNode == "leftTriangle")
            {
                setObjectWidth(n, tmpLength, 16);
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
                setWindowHeight(n, tmpLength, 4);
            }
            else if(nameNode == "rightWall" || nameNode == "leftWall")
            {
                if(partmode == 0)
                {
                    setWindowHeight(n, tmpLength, 4);
                }
                else if(partmode == 1)
                {
                    setDoorHeight(n, tmpLength, 9);
                }
                else
                {
                    setObjectHeight(n, tmpLength, 8);
                }
            }
            else if(nameNode == "backWall")
            {
                setObjectWidth(n, tmpLength, 24);
            }
            else if(nameNode == "roof" || nameNode == "rightTriangle" || nameNode == "leftTriangle")
            {
                setObjectDepth(n, tmpLength, 24);
            }
            else if(nameNode == "base")
            {
                var tmpBackWall = getNodeBase("backWall", tmpLayer);
                setObjectWidth(tmpBackWall, tmpLength, 24);
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
            return 0; // look at z axis  0 - 45 degree
        }
        else if(subCamCos <= (1 / Math.sqrt(2)) && subCamCos >= 0)
        {
            return 1; // look at x axis 0 - 45 degree
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
            return 2; // look at z axis 45 - 90 degree
        }
        else if(subCamCos <= (1 / Math.sqrt(2)) && subCamCos >= 0)
        {
            return 3;   // look at x axis 45 - 90 degree
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