//最後選擇的零件
var lastid=-1;
//最後選擇的樓層
var lastFloor = -1;
// ???
var uiPanel;
// Scale object in lock mode, zoom in/out in unlock mode (for two fingers gesture)
var isLock = false;
// Tranalate interWall or base object When isRotation is false, Rotate camera when isRotation is true (for a finger gesture)
var isRotation = true;
// if equals to true redraw the house in next frams
var dirty = true;
// the value used only in time function since the house will need 1~4 frams to be ready to draw after the element be changed
var time = 0;
//this is for the element that is not gona printed
var windows = [];
var doors = [];
//get dependency between wall and window
var getWallID = [];
var getWindowID = [];

none_select_material_color = {r:1,g:1,b:1}
select_material_color = {r:0.7,g:0.7,b:0.3}

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
                    scene.pick(event.clientX, event.clientY);
                    if(lastid == -1 && lastFloor == -1){
                        setAllTheElementPickable();
                        scene.pick(event.clientX, event.clientY);
                    }
                }

            }, true);

/*    canvas.addEventListener('mousemove',
            function (event) {

                if(pickNode == "window" && !Mobile)
                {
                    moveComponent();
                }

            }, true);*/

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
                    scene.pick(event.targetTouches[0].clientX, event.targetTouches[0].clientY);
                    if(lastid == -1 && lastFloor == -1){
                        setAllTheElementPickable();
                        scene.pick(event.targetTouches[0].clientX, event.targetTouches[0].clientY);
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
                        switch(pickNode)
                        {
                            //case "base":
                            //    baseOffsetY(objectId, tmpYlength, currentAxis);
                            //    break;
                            case "interWall":
                                interWallOffsetY(objectId, tmpYlength, currentAxis);
                                break;
                            case "window":
                                var changeId = getWallID[getWindowID.indexOf(objectId)];
                                var tmpNodeType = getNodeType(changeId);
                                if(tmpNodeType.type != "wall/multi_window")
                                {
                                    windowOffsetY(changeId, tmpYlength, currentAxis);
                                }
                                else
                                {
                                    multiWindowOffsetY(objectId, tmpYlength, currentAxis);
                                }
                                break;
                            case "leftWall":
                            case "rightWall":
                            case "backWall":
                                if(partmode == 0)
                                {
                                    windowOffsetY(objectId, tmpYlength, currentAxis);
                                }
                                break;
                        }
                    }
                    else if(offsetCos >= (1 / Math.sqrt(2)) && offsetCos <= 1)
                    {
                        switch(pickNode)
                        {
                            //case "base":
                            //    baseOffsetX(objectId, tmpXlength, currentAxis);
                            //    break;
                            case "interWall":
                                interWallOffsetX(objectId, tmpXlength, currentAxis);
                                break;
                            case "window":
                                var changeId = getWallID[getWindowID.indexOf(objectId)];
                                var tmpNodeType = getNodeType(changeId);
                                if(tmpNodeType.type != "wall/multi_window")
                                {
                                    windowOffsetX(changeId, tmpXlength, currentAxis);
                                }
                                else
                                {
                                    multiWindowOffsetX(objectId, tmpXlength, currentAxis);
                                }
                                break;
                            case "leftWall":
                            case "rightWall":
                            case "backWall":
                                if(partmode == 0)
                                {
                                    windowOffsetX(objectId, tmpXlength, currentAxis);
                                }
                                else if(partmode == 1)
                                {
                                    doorOffsetX(objectId, tmpXlength, currentAxis);
                                }
                                break;
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
                dirty = true;
                var material;

                if(lastid>0){
                    var node = scene.findNode(lastid);
                    if(node.getType() == "window/fixed"){

                    }else{
                        material= housenode2Material(node); 
                        material.setColor(none_select_material_color);
                    }
                    
                }
                var id=hit.nodeId;
                var element=TextureName2housenode(scene.findNode(id)); 
                //console.log(element.getID());
                //這是我知道name被material包住，正常藥用id來找但現在id都還沒定
                /*material=scene.findNode(id).parent;
                material.setColor({r:0.7,g:0.7,b:0.3});*/
                id=element.id;
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

                //console.log("getWallID ", getWallID);
                //console.log("getWindowID ", getWindowID);
                console.log("ID: ", element.getID(), " partmode: ", partmode);
                console.log("id: ", hit.nodeId);
                if(pickObjId != null && scene.getNode(pickObjId) != null) { delete scene.getNode(pickObjId)._topicSubs.rendered; } // delete render event from trackPosition
                objectId = hit.nodeId;
				pickObjId = objectId;
				selectLayer();
				modifyWall();
                pickNode = getNodeName(objectId);
                var pickLayer = getNodeLayer(objectId);
                if(pickNode == "window") { 
                    isRotation = false; 
                    getDecoration(objectId);
                    /*isRotation = false; 
                    var changeId = getWallID[getWindowID.indexOf(objectId)];
                    changeViewpoint(getNodeName(changeId)); */
                } 
                else if(pickNode == "base" && pickLayer != 1) { isRotation = false; }
                else if(pickNode == "interWall") { isRotation = false; }
                else { isRotation = true; }

                var now = new Date().getTime();
                if(now - lastTime < 300) {
					watchmode = 0;
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
				trackPosition(objectId);
            });
    scene.on("nopick",
            function (hit) {
				var alltab = getSubElem(getElem("Tab"),"li");
				for (var i = 0; i < alltab.length; i++){
					alltab[i].className = "General";
				}
				var key = getElem("functionkey");
				key.innerHTML = "+";
                dirty = true;
				watchmode = 1;
                uiPanel.style.display='none';

                if(lastid>0){
                    var node = scene.findNode(lastid);
                    if(node.getType() == "window/fixed"){

                    }else{
                        material= housenode2Material(node); 
                        material.setColor({ r:0.8, g:0.8, b:0.8});
                    }
                    
                }
                lastid = -1;
                lastFloor = -1;
				pickObjId = null;
				closePartBar("subPartBar");
				closePartBar("mainPartBar");
                console.log('Nothing picked!');
                isLock = false;
                objectId = null;
                isRotation = true;
                pickNode = null;
				if(!Mobile)
				{
					disableController(getElem("DRAGCONTROLL"));
					disableController(getElem("SCALECONTROLL"));
				}
				
				
                //for some ridiculurs reason i got to pick again!!
                //scene.pick()
            });
}

function UIlog(log){
    console.log(log);
}
var hasTexture=true;
function textureToggle(){
    console.log("textureToggle");
    var box=scene.findNodes();
    for(var i=0;i<box.length;i++){
        if(box[i].getType()=="flags"){
            if(hasTexture){
                housenode2Texture(flag2housenode(box[i]))._initTexture();
            }else{
				
                var src=housenode2TextureName(flag2housenode(box[i])).getName();
                housenode2Texture(flag2housenode(box[i])).setSrc("images/GeometryTexture/"+src+"");
            }
        }
    }
    hasTexture=!hasTexture;
    dirty = true;
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
                backWall=Pos2housenode(n);
            }
            else if(n.getName()=="frontWall")frontWall=Pos2housenode(n);
            else if(n.getName()=="leftWall")leftWall=Pos2housenode(n);
            else if(n.getName()=="rightWall")rightWall=Pos2housenode(n);
            else if(n.getName()=="roof")roof=Pos2housenode(n);
            else if(n.getName()=="interWall" && Pos2housenode(n).getLayer() == lastFloor )interWall.push(Pos2housenode(n));
            else if(n.getName()=="base")base=Pos2housenode(n);
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
                    color:none_select_material_color,
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
                                    type: "texture",
                                    src: "images/GeometryTexture/wallSpecularMap.png",
                                    applyTo: "specular", // Apply to specularity

                                    nodes: 
                                    [{
                                        type: "texture",
                                        src: "images/GeometryTexture/wallNormalMap.png",
                                        applyTo: "normals", // Apply to geometry normal vectors

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
                }]
            }]
    });
    
    Calibration();
    dirty = true;
}

function getTopLayer(){
    var layerNumber=0;
    var nodes=scene.findNodes();
    for(var i=0;i<nodes.length;i++){
        var n = nodes[i];
        if(n.getType()=="name"){
            if(n.getName()=="base"){if(Pos2housenode(n).getLayer()>layerNumber){layerNumber=Pos2housenode(n).getLayer();}}
        }
    }
    return layerNumber;
}

function addBase(){
    var nodes=scene.findNodes();
    var layerNumber=getTopLayer()+1;
	var top_base;
    console.log(layerNumber);
	for(var i=0;i<nodes.length;i++){
		if(nodes[i].getType() == "base/basic"){
			if(nodes[i].getLayer() == layerNumber -1){
				top_base = nodes[i];
			}
		}
	}
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
                    color:none_select_material_color,
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
                                    type: "texture",
                                    src: "images/GeometryTexture/groundSpecularMap.png",
                                    applyTo: "specular", // Apply to specularity

                                    nodes: 
                                    [{
                                        type: "texture",
                                        src: "images/GeometryTexture/groundNormalMap.png",
                                        applyTo: "normals", // Apply to geometry normal vectors

                                        nodes:
                                        [{
                                            type: "base/basic",
                                            layer: layerNumber,
                                            height: top_base.getRealHeight(),
                                            width: top_base.getRealWidth(),
                                            thickness: top_base.getThickness(),
                                            scale: {x: 1, y: 1, z: 1},
                                            rotate: {x: 0, y: 0, z: 0},
                                            translate: {x: 0, y: 0, z: 0}
                                        }]
                                    }]
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
                    color:none_select_material_color,
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
                                    type: "texture",
                                    src: "images/GeometryTexture/wallSpecularMap.png",
                                    applyTo: "specular", // Apply to specularity

                                    nodes: 
                                    [{
                                        type: "texture",
                                        src: "images/GeometryTexture/wallNormalMap.png",
                                        applyTo: "normals", // Apply to geometry normal vectors

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
                    color:none_select_material_color,
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
                                    type: "texture",
                                    src: "images/GeometryTexture/wallSpecularMap.png",
                                    applyTo: "specular", // Apply to specularity

                                    nodes: 
                                    [{
                                        type: "texture",
                                        src: "images/GeometryTexture/wallNormalMap.png",
                                        applyTo: "normals", // Apply to geometry normal vectors

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
                    color:none_select_material_color,
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
                                    type: "texture",
                                    src: "images/GeometryTexture/wallSpecularMap.png",
                                    applyTo: "specular", // Apply to specularity

                                    nodes: 
                                    [{
                                        type: "texture",
                                        src: "images/GeometryTexture/wallNormalMap.png",
                                        applyTo: "normals", // Apply to geometry normal vectors

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
                }]
            }]
        
    });

    Calibration();
    dirty = true;
}

function deleteTopBase(){
	var layerNumber=getTopLayer();
	deleteBase(layerNumber);
}
function deleteBase(layerNumber){
    var nodes=scene.findNodes();
    if(layerNumber <=0  || getTopLayer() <= 1){
        lastid =-1;
        lastFloor=-1;
        return;
    }
    for(var i=0;i<nodes.length;i++){
        var n = nodes[i];
        if(n.getLayer){
            if(n.getLayer() == layerNumber){
                housenode2flag(n).destroy();
            }
			if(n.getLayer() > layerNumber){
				n.setLayer(n.getLayer()-1);
			}
        }
    }
    lastFloor =-1;
    lastid=-1;

    Calibration();
    dirty = true;
}

function attachInput(pickId){
	watchmode = 0;
    var n = TextureName2housenode(scene.findNode(pickId));
	
    var nameNode= housenode2Pos(n);

    console.log(nameNode.getName());

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
    if(n.getType() == "window/fixed"){
        var div=document.createElement("div");
        inputarea.appendChild(div);

        //input
        var deleteinput=document.createElement("input");
            deleteinput.value = "white";
            deleteinput.type="button";
            div.appendChild(deleteinput);

        deleteinput.addEventListener('click',function(event){
            housenode2Material(n).setColor({r:1,g:1,b:1});
        });

        //input
        var deleteinput=document.createElement("input");
            deleteinput.value = "brown";
            deleteinput.type="button";
            div.appendChild(deleteinput);

        deleteinput.addEventListener('click',function(event){
            housenode2Material(n).setColor({r:204/255,g:141/255,b:85/255});
        });
    }
	//roof backSide
	if(n.getBackSide && n.getBackSide()){
		var div=document.createElement("div");
        inputarea.appendChild(div);
        //text
        var roof_back_side_propertyName=document.createElement("lable");
            roof_back_side_propertyName.textContent="BackSide";
            div.appendChild(roof_back_side_propertyName);
        //input
        var roof_back_side_input=document.createElement("input");
            roof_back_side_input.type="checkbox";
            roof_back_side_input.checked=(n.getBackSide()=="off");
            div.appendChild(roof_back_side_input);

        var roof_back_side_propertyValue = document.createElement("lable");
            roof_back_side_propertyValue.textContent = (roof_back_side_input.checked ? "off":"on");
            div.appendChild(roof_back_side_propertyValue);

        roof_back_side_input.addEventListener('click',function(event){
			n.setBackSide(roof_back_side_input.checked ? "off":"on");
            roof_back_side_propertyValue.textContent = roof_back_side_input.checked ? "off":"on";
            n.callBaseCalibration();
            dirty = true;
        });
	}
	
    //hight
    if(n.getHeight && housenode2Pos(n).getName() != "interWall"){
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
			if(n.getLayer && n.getLayer() == 1){
				
			}else{
				if(n.getRealHeight)heightinput.value=n.getRealHeight();
			}
            
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
				if(n.getLayer && n.getLayer() == 1){
					
				}else{
					if(n.setRealHeight){n.setRealHeight(Number(heightinput.value*1.0));}
				}
                heightpropertyValue.textContent=heightinput.value;
                n.callBaseCalibration();
                dirty = true;
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
    if(n.getWidth && housenode2Pos(n).getName() != "interWall"){
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
			if(n.getLayer && n.getLayer() == 1){
				
			}else{
				if(n.getRealWidth)widthinput.value=n.getRealWidth();
			}
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
				if(n.getLayer && n.getLayer() == 1){
					
				}else{
					if(n.setRealWidth){n.setRealWidth(Number(widthinput.value*1.0));}
				}
                widthpropertyValue.textContent=widthinput.value;
                n.callBaseCalibration();
                dirty = true;
            }
        });
        widthinput.addEventListener('mouseup',function(event){
            widthismove=false;
			
        });
    }
    
	//basicRealWidth
	if(n.getRealWidth && housenode2Pos(n).getName() == "base" && n.getLayer && n.getLayer() == 1){
		var realWidthismove = false;
		var div = document.createElement("div");
		inputarea.appendChild(div);
		//text
		var realWidth_propertyName = document.createElement("lable");
		realWidth_propertyName.textContent = "realWidth";
		div.appendChild(realWidth_propertyName);
		//input
		var realWidth_input = document.createElement("input");
			realWidth_input.type="range";
            realWidth_input.min="1";
            realWidth_input.max="50";
            realWidth_input.step="0.1";
            realWidth_input.value=n.getRealWidth();
			div.appendChild(realWidth_input);
		
		var realWidth_propertyValue = document.createElement("lable");
		realWidth_propertyValue.textContent = realWidth_input.value;
		div.appendChild(realWidth_propertyValue);
		realWidth_input.addEventListener('mousedown',function(event){
            realWidthismove=true;
        });
        realWidth_input.addEventListener('mousemove',function(event){
            if (realWidthismove) {
                n.setRealWidth(Number(realWidth_input.value*1.0));
                realWidth_propertyValue.textContent=realWidth_input.value;
                n.callBaseCalibration();
                dirty = true;
            }
        });
        realWidth_input.addEventListener('mouseup',function(event){
			realWidthismove=false;
        });
	}
	
	//basicRealHeight
	if(n.getRealHeight && housenode2Pos(n).getName() == "base" && n.getLayer && n.getLayer() == 1){
		var realHeightismove = false;
		var div = document.createElement("div");
		inputarea.appendChild(div);
		//text
		var realHeight_propertyName = document.createElement("lable");
		realHeight_propertyName.textContent = "realHeight";
		div.appendChild(realHeight_propertyName);
		//input
		var realHeight_input = document.createElement("input");
			realHeight_input.type="range";
            realHeight_input.min="1";
            realHeight_input.max="50";
            realHeight_input.step="0.1";
            realHeight_input.value=n.getRealHeight();
			div.appendChild(realHeight_input);
		
		var realHeight_propertyValue = document.createElement("lable");
		realHeight_propertyValue.textContent = realHeight_input.value;
		div.appendChild(realHeight_propertyValue);
		realHeight_input.addEventListener('mousedown',function(event){
            realHeightismove=true;
        });
        realHeight_input.addEventListener('mousemove',function(event){
            if (realHeightismove) {
                n.setRealHeight(Number(realHeight_input.value*1.0));
                realHeight_propertyValue.textContent=realHeight_input.value;
                n.callBaseCalibration();
                dirty = true;
            }
        });
        realHeight_input.addEventListener('mouseup',function(event){
			realHeightismove=false;
        });
	}
	
	//basicleftbackX
	if(n.getLeftBackX){
		var leftback_xismove = false;
		var div = document.createElement("div");
		inputarea.appendChild(div);
		//text
		var leftback_x_propertyName = document.createElement("lable");
		leftback_x_propertyName.textContent = "leftback_x";
		div.appendChild(leftback_x_propertyName);
		//input
		var leftback_x_input = document.createElement("input");
			leftback_x_input.type="range";
            leftback_x_input.min="0";
            leftback_x_input.max="50";
            leftback_x_input.step="0.1";
            leftback_x_input.value=n.getLeftBackX();
			div.appendChild(leftback_x_input);
		
		var leftback_x_propertyValue = document.createElement("lable");
		leftback_x_propertyValue.textContent = leftback_x_input.value;
		div.appendChild(leftback_x_propertyValue);
		leftback_x_input.addEventListener('mousedown',function(event){
            leftback_xismove=true;
        });
        leftback_x_input.addEventListener('mousemove',function(event){
            if (leftback_xismove) {
                n.setLeftBackX(Number(leftback_x_input.value*1.0));
                leftback_x_propertyValue.textContent=leftback_x_input.value;
                n.callBaseCalibration();
                dirty = true;
            }
        });
        leftback_x_input.addEventListener('mouseup',function(event){
			leftback_xismove=false;
        });
	}
	
	if(n.getLeftBackY){
		var leftback_yismove = false;
		var div = document.createElement("div");
		inputarea.appendChild(div);
		//text
		var leftback_y_propertyName = document.createElement("lable");
		leftback_y_propertyName.textContent = "leftback_y";
		div.appendChild(leftback_y_propertyName);
		//input
		var leftback_y_input = document.createElement("input");
			leftback_y_input.type="range";
            leftback_y_input.min="0";
            leftback_y_input.max="50";
            leftback_y_input.step="0.1";
            leftback_y_input.value=n.getLeftBackY();
			div.appendChild(leftback_y_input);
		
		var leftback_y_propertyValue = document.createElement("lable");
		leftback_y_propertyValue.textContent = leftback_y_input.value;
		div.appendChild(leftback_y_propertyValue);
		leftback_y_input.addEventListener('mousedown',function(event){
            leftback_yismove=true;
        });
        leftback_y_input.addEventListener('mousemove',function(event){
            if (leftback_yismove) {
                n.setLeftBackY(Number(leftback_y_input.value*1.0));
                leftback_y_propertyValue.textContent=leftback_y_input.value;
                n.callBaseCalibration();
                dirty = true;
            }
        });
        leftback_y_input.addEventListener('mouseup',function(event){
			leftback_yismove=false;
        });
	}
	
	if(n.getRightBackX){
		var rightback_xismove = false;
		var div = document.createElement("div");
		inputarea.appendChild(div);
		//text
		var rightback_x_propertyName = document.createElement("lable");
		rightback_x_propertyName.textContent = "rightback_x";
		div.appendChild(rightback_x_propertyName);
		//input
		var rightback_x_input = document.createElement("input");
			rightback_x_input.type="range";
            rightback_x_input.min="0";
            rightback_x_input.max="50";
            rightback_x_input.step="0.1";
            rightback_x_input.value=n.getRightBackX();
			div.appendChild(rightback_x_input);
		
		var rightback_x_propertyValue = document.createElement("lable");
		rightback_x_propertyValue.textContent = rightback_x_input.value;
		div.appendChild(rightback_x_propertyValue);
		rightback_x_input.addEventListener('mousedown',function(event){
            rightback_xismove=true;
        });
        rightback_x_input.addEventListener('mousemove',function(event){
            if (rightback_xismove) {
                n.setRightBackX(Number(rightback_x_input.value*1.0));
                rightback_x_propertyValue.textContent=rightback_x_input.value;
                n.callBaseCalibration();
                dirty = true;
            }
        });
        rightback_x_input.addEventListener('mouseup',function(event){
			rightback_xismove=false;
        });
	}
	//basicrightBackXY
	if(n.getRightBackY){
		var rightback_yismove = false;
		var div = document.createElement("div");
		inputarea.appendChild(div);
		//text
		var rightback_y_propertyName = document.createElement("lable");
		rightback_y_propertyName.textContent = "rightback_y";
		div.appendChild(rightback_y_propertyName);
		//input
		var rightback_y_input = document.createElement("input");
			rightback_y_input.type="range";
            rightback_y_input.min="0";
            rightback_y_input.max="50";
            rightback_y_input.step="0.1";
            rightback_y_input.value=n.getRightBackY();
			div.appendChild(rightback_y_input);
		
		var rightback_y_propertyValue = document.createElement("lable");
		rightback_y_propertyValue.textContent = rightback_y_input.value;
		div.appendChild(rightback_y_propertyValue);
		rightback_y_input.addEventListener('mousedown',function(event){
            rightback_yismove=true;
        });
        rightback_y_input.addEventListener('mousemove',function(event){
            if (rightback_yismove) {
                n.setRightBackY(Number(rightback_y_input.value*1.0));
                rightback_y_propertyValue.textContent=rightback_y_input.value;
                n.callBaseCalibration();
                dirty = true;
            }
        });
        rightback_y_input.addEventListener('mouseup',function(event){
			rightback_yismove=false;
        });
	}
	
    //percentX
    if(n.getPercentX && housenode2Pos(n).getName() == "interWall"){
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
                dirty = true;
            }
        });
        percentXinput.addEventListener('mouseup',function(event){
            percentXismove=false;
        });
    }
    

    //percentY
    if(n.getPercentY && housenode2Pos(n).getName() == "interWall"){
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
                dirty = true;
            }
        });
        percentYinput.addEventListener('mouseup',function(event){
            percentYismove=false;
        });
    }
    
    //direction
    if(n.getDirection && housenode2Pos(n).getName() == "interWall"){
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
            directionpropertyValue.textContent = directioninput.checked ? "vertical":"horizontal";
            n.callBaseCalibration();
            dirty = true;
        });
    }

    //delete interWall
    if(n.getDirection && housenode2Pos(n).getName() == "interWall"){
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
            deleteWall(n.getID());
        });
    }


    //sigle Wall
    if(n.getDirection){
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
			changeWall(n.getID(),"wall/single_window");
        });
    }
    //door Wall
    if(n.getDirection){
        var div=document.createElement("div");
        inputarea.appendChild(div);
        //text
        var doorpropertyName=document.createElement("lable");
            doorpropertyName.textContent="door";
            div.appendChild(doorpropertyName);
        //input
        var doorinput=document.createElement("input");
            doorinput.value = "door";
            doorinput.type="button";
            div.appendChild(doorinput);

        doorinput.addEventListener('click',function(event){
			changeWall(n.getID(),"wall/door_entry");
            
        });
    }
    //normal Wall
    if(n.getDirection){
        var div=document.createElement("div");
        inputarea.appendChild(div);
        //text
        var normalpropertyName=document.createElement("lable");
            normalpropertyName.textContent="normal";
            div.appendChild(normalpropertyName);
        //input
        var normalinput=document.createElement("input");
            normalinput.value = "normal";
            normalinput.type="button";
            div.appendChild(normalinput);

        normalinput.addEventListener('click',function(event){
			changeWall(n.getID(),"wall/no_window");
        });
    }
	//multi wall
	if(n.getDirection){
		var div = document.createElement("div");
		inputarea.appendChild(div);
		//text
		var multi_propertyName = document.createElement("lable");
			multi_propertyName.textContent = "multi";
			div.appendChild(multi_propertyName);
		var multi_input = document.createElement("input");
			multi_input.value = "multi";
			multi_input.type = "button";
			div.appendChild(multi_input);
		multi_input.addEventListener('click',function(event){
			changeWall(n.getID(),"wall/multi_window");
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
                dirty = true;
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
                dirty = true;
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
                dirty = true;
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
                dirty = true;
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
				moveWindow(n.getID(),Number(RatioAinput.value*1.0),n.getRatio().b);
                RatioAropertyValue.textContent=RatioAinput.value;
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
				moveWindow(n.getID(),n.getRatio().a,Number(RatioBinput.value*1.0));
                RatioBropertyValue.textContent=RatioBinput.value;
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
                dirty = true;
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
                dirty = true;
            }
        });
        WindowHinput.addEventListener('mouseup',function(event){
            WindowHismove=false;
        });
    }
    //posratio
    if(n.getPosratio){
        var Posratioismove=false;
        var div=document.createElement("div");
        inputarea.appendChild(div);
        //text
        var PosratiopropertyName=document.createElement("lable");
            PosratiopropertyName.textContent="Posratio";
            div.appendChild(PosratiopropertyName);
        //input
        var Posratioinput=document.createElement("input");
            Posratioinput.type="range";
            Posratioinput.min="0";
            Posratioinput.max="1";
            Posratioinput.step="0.01";
            Posratioinput.value=n.getPosratio();
            div.appendChild(Posratioinput);
    
        var PosratioropertyValue=document.createElement("lable");
            PosratioropertyValue.textContent=Posratioinput.value;
            div.appendChild(PosratioropertyValue);
    
        Posratioinput.addEventListener('mousedown',function(event){
            Posratioismove=true;
        });
        Posratioinput.addEventListener('mousemove',function(event){
            if (Posratioismove) {
				moveDoor(n.getID(),Number(Posratioinput.value*1.0));
                PosratioropertyValue.textContent=Posratioinput.value;
            }
        });
        Posratioinput.addEventListener('mouseup',function(event){
            Posratioismove=false;
        });
    }
    //Doorw
    if(n.getDoorSize && n.setDoorW){
        var DoorWismove=false;
        var div=document.createElement("div");
        inputarea.appendChild(div);
        //text
        var DoorWpropertyName=document.createElement("lable");
            DoorWpropertyName.textContent="DoorW";
            div.appendChild(DoorWpropertyName);
        //input
        var DoorWinput=document.createElement("input");
            DoorWinput.type="range";
            DoorWinput.min="1";
            DoorWinput.max="10";
            DoorWinput.step="0.1";
            DoorWinput.value=n.getDoorSize().w;
            div.appendChild(DoorWinput);
    
        var DoorWropertyValue=document.createElement("lable");
            DoorWropertyValue.textContent=DoorWinput.value;
            div.appendChild(DoorWropertyValue);
    
        DoorWinput.addEventListener('mousedown',function(event){
            DoorWismove=true;
        });
        DoorWinput.addEventListener('mousemove',function(event){
            if (DoorWismove) {
                n.setDoorW(Number(DoorWinput.value*1.0));
                DoorWropertyValue.textContent=DoorWinput.value;
                n.callBaseCalibration();
                dirty = true;
            }
        });
        DoorWinput.addEventListener('mouseup',function(event){
            DoorWismove=false;
        });
    }
    //Doorh
    if(n.getDoorSize && n.setDoorH){
        var DoorHismove=false;
        var div=document.createElement("div");
        inputarea.appendChild(div);
        //text
        var DoorHpropertyName=document.createElement("lable");
            DoorHpropertyName.textContent="DoorH";
            div.appendChild(DoorHpropertyName);
        //input
        var DoorHinput=document.createElement("input");
            DoorHinput.type="range";
            DoorHinput.min="1";
            DoorHinput.max="10";
            DoorHinput.step="0.01";
            DoorHinput.value=n.getDoorSize().h;
            div.appendChild(DoorHinput);
    
        var DoorHropertyValue=document.createElement("lable");
            DoorHropertyValue.textContent=DoorHinput.value;
            div.appendChild(DoorHropertyValue);
    
        DoorHinput.addEventListener('mousedown',function(event){
            DoorHismove=true;
        });
        DoorHinput.addEventListener('mousemove',function(event){
            if (DoorHismove) {
                n.setDoorH(Number(DoorHinput.value*1.0));
                DoorHropertyValue.textContent=DoorHinput.value;
                n.callBaseCalibration();
                dirty = true;
            }
        });
        DoorHinput.addEventListener('mouseup',function(event){
            DoorHismove=false;
        });
    }
	
	//multi wall
	if(n.getDoorPosratio){
		var DoorPosratio_is_move = false;
		var div=document.createElement("div");
		inputarea.appendChild(div);
		var doors_posratio = n.getDoorPosratio();
		for(var i=0;i<doors_posratio.length;i++){
			//text
			var DoorPostratio_property_name =document.createElement("lable");
			DoorPostratio_property_name.textContent = "Number "+i+" Door";
			div.appendChild(DoorPostratio_property_name);
			//index
			var DoorIndex = i;
			//input
			var DoorPostratio_input = document.createElement("input");
			DoorPostratio_input.type = "range";
			DoorPostratio_input.min="0";
			DoorPostratio_input.max="1";
			DoorPostratio_input.step="0.01";
			DoorPostratio_input.value=doors_posratio[i];
			div.appendChild(DoorPostratio_input);
			//lable
			var DoorPostraio_value = document.createElement("lable");
			DoorPostraio_value.textContent = DoorPostratio_input.value;
			div.appendChild(DoorPostraio_value);
			//event
			DoorPostratio_input.addEventListener('mousedown',function(event){
				DoorPosratio_is_move = true;
			});
			DoorPostratio_input.addEventListener('mousemove',function(event){
				if(DoorPosratio_is_move){
					n.setDoorPosratioByIndex(Number(DoorPostratio_input.value),DoorIndex);
					DoorPostraio_value.textContent = DoorPostratio_input.value;
					n.callBaseCalibration();
					dirty = true;
				}
			});
			DoorPostratio_input.addEventListener('mouseup',function(event){
				DoorPosratio_is_move = false;
			});
			div.appendChild(document.createElement("br"));
		}
	}
	
	if(n.getWindowCenter)
    {
		var windowCenter_is_move = [];
		var div = document.createElement("div");
		inputarea.appendChild(div);
		var windows_Center = n.getWindowCenter();
		var windowCenter_property_name = [];
		var windowCenter_input = [];
		var windowCenter_value =[];
		
		for(var i = 0;i < windows_Center.length; i += 2)
        {
			
            //texr
			windowCenter_property_name.push(document.createElement("lable"));
			windowCenter_property_name[i].textContent = "  Number " + (i / 2) + " windowX";
			div.appendChild(windowCenter_property_name[i]);
			
            //index
			var windowIndex = i;
			
            //input
			windowCenter_input.push(document.createElement("input"));
			windowCenter_input[i].type = "range";
			windowCenter_input[i].min = "0";
			windowCenter_input[i].max = "1";
			windowCenter_input[i].step = "0.01";
			windowCenter_input[i].value = windows_Center[i];
			windowCenter_input[i].name = i;
			div.appendChild(windowCenter_input[i]);
			
            //lable
			windowCenter_value.push(document.createElement("lable"));
			windowCenter_value[i].textContent = windowCenter_input[i].value;
			div.appendChild(windowCenter_value[i]);

			//event
			windowCenter_is_move.push(false);
			
            windowCenter_input[i].addEventListener('mousedown', function(event)
            {
				windowCenter_is_move[Number(this.name)] = true;
			});
			
            windowCenter_input[i].addEventListener('mousemove', function(event)
            {
                var tn = Number(this.name);
                var wctn = Number(windowCenter_input[tn].value);
			
                if(windowCenter_is_move[tn])
                {
					n.setWindowCenterByIndex(wctn, tn);
					windowCenter_value[tn].textContent = windowCenter_input[tn].value;
					n.callBaseCalibration();
					dirty = true;
				}
			});
			
            windowCenter_input[i].addEventListener('mouseup', function(event)
            {
				windowCenter_is_move[Number(this.name)] = false;
			});
			
			
			//text
			windowCenter_property_name.push(document.createElement("lable"));
			windowCenter_property_name[i+1].textContent = "  Number " + (i / 2) + " windowY";
			div.appendChild(windowCenter_property_name[i + 1]);

			//index
			var windowIndex = i + 1;

			//input
			windowCenter_input.push(document.createElement("input"));
			windowCenter_input[i+1].type = "range";
			windowCenter_input[i+1].min = "0";
			windowCenter_input[i+1].max = "1";
			windowCenter_input[i+1].step = "0.01";
			windowCenter_input[i+1].value = windows_Center[i + 1];
			windowCenter_input[i+1].name = i + 1;
			div.appendChild(windowCenter_input[i + 1]);

			//lable
			windowCenter_value.push(document.createElement("lable"));
			windowCenter_value[i+1].textContent = windowCenter_input[i + 1].value;
			div.appendChild(windowCenter_value[i + 1]);

			//event
			windowCenter_is_move.push(false);
			
            windowCenter_input[i+1].addEventListener('mousedown', function(event)
            {
				windowCenter_is_move[Number(this.name)] = true;
			});

			windowCenter_input[i+1].addEventListener('mousemove', function(event)
            {
                var tn = Number(this.name);
                var wctn = Number(windowCenter_input[tn].value);
				if(windowCenter_is_move[tn])
                {
					n.setWindowCenterByIndex(wctn, tn);
					windowCenter_value[tn].textContent = windowCenter_input[tn].value;
					n.callBaseCalibration();
					dirty = true;
				}
			});
			
            windowCenter_input[i+1].addEventListener('mouseup', function(event)
            {
				windowCenter_is_move[Number(this.name)] = false;
			});

			div.appendChild(document.createElement("br"));
		}
	}
	
	//corss_galbe extrude
	if(n.getExtrudeBas && n.getExtrudeBas()){
		var roof_extrudeBas_ismove = false;
		var div = document.createElement("div");
		inputarea.appendChild(div);
		//text
		var roof_extrudeBas_propertyName = document.createElement("lable");
			roof_extrudeBas_propertyName.textContent = "roof_extrudeBas";
			div.appendChild(roof_extrudeBas_propertyName);
		//input
		var roof_extrudeBas_input = document.createElement("input");
			roof_extrudeBas_input.type = "range";
			roof_extrudeBas_input.min = "1";
			roof_extrudeBas_input.max = "50";
			roof_extrudeBas_input.step = "0.1";
			roof_extrudeBas_input.value = n.getExtrudeBas();
			div.appendChild(roof_extrudeBas_input);
		var roof_extrudeBas_propertyValue = document.createElement("lable");
			roof_extrudeBas_propertyValue.textContent = roof_extrudeBas_input.value;
			div.appendChild(roof_extrudeBas_propertyValue);
		roof_extrudeBas_input.addEventListener('mousedown',function(event){
			roof_extrudeBas_ismove = true;
		});
		roof_extrudeBas_input.addEventListener('mousemove',function(event){
			if(roof_extrudeBas_ismove){
				n.setExtrudeBas(Number(roof_extrudeBas_input.value));
				roof_extrudeBas_propertyValue.textContent = roof_extrudeBas_input.value;
				n.callBaseCalibration();
				dirty = true;
			}
		});
		roof_extrudeBas_input.addEventListener('mouseup',function(event){
			roof_extrudeBas_ismove = false;
		});
		
	}
	if(n.getExtrudeLen && n.getExtrudeLen()){
		var roof_extrudeLen_ismove = false;
		var div = document.createElement("div");
		inputarea.appendChild(div);
		//text
		var roof_extrudeLen_propertyName = document.createElement("lable");
			roof_extrudeLen_propertyName.textContent = "roof_extrudeLen";
			div.appendChild(roof_extrudeLen_propertyName);
		//input
		var roof_extrudeLen_input = document.createElement("input");
			roof_extrudeLen_input.type = "range";
			roof_extrudeLen_input.min = "1";
			roof_extrudeLen_input.max = "50";
			roof_extrudeLen_input.step = "0.1";
			roof_extrudeLen_input.value = n.getExtrudeLen();
			div.appendChild(roof_extrudeLen_input);
		var roof_extrudeLen_propertyValue = document.createElement("lable");
			roof_extrudeLen_propertyValue.textContent = roof_extrudeLen_input.value;
			div.appendChild(roof_extrudeLen_propertyValue);
		roof_extrudeLen_input.addEventListener('mousedown',function(event){
			roof_extrudeLen_ismove = true;
		});
		roof_extrudeLen_input.addEventListener('mousemove',function(event){
			if(roof_extrudeLen_ismove){
				n.setExtrudeLen(Number(roof_extrudeLen_input.value));
				roof_extrudeLen_propertyValue.textContent = roof_extrudeLen_input.value;
				n.callBaseCalibration();
				dirty = true;
			}
		});
		roof_extrudeLen_input.addEventListener('mouseup',function(event){
			roof_extrudeLen_ismove = false;
		});
	}
	if(n.getExtrudePos && n.getExtrudePos()){
		var roof_extrudePos_ismove = false;
		var div = document.createElement("div");
		inputarea.appendChild(div);
		//text
		var roof_extrudePos_propertyName = document.createElement("lable");
			roof_extrudePos_propertyName.textContent = "roof_extrudePos";
			div.appendChild(roof_extrudePos_propertyName);
		//input
		var roof_extrudePos_input = document.createElement("input");
			roof_extrudePos_input.type = "range";
			roof_extrudePos_input.min = "0";
			roof_extrudePos_input.max = "1";
			roof_extrudePos_input.step = "0.1";
			roof_extrudePos_input.value = n.getExtrudePos();
			div.appendChild(roof_extrudePos_input);
		var roof_extrudePos_propertyValue = document.createElement("lable");
			roof_extrudePos_propertyValue.textContent = roof_extrudePos_input.value;
			div.appendChild(roof_extrudePos_propertyValue);
		roof_extrudePos_input.addEventListener('mousedown',function(event){
			roof_extrudePos_ismove = true;
		});
		roof_extrudePos_input.addEventListener('mousemove',function(event){
			if(roof_extrudePos_ismove){
				n.setExtrudePos(Number(roof_extrudePos_input.value*1.0));
				roof_extrudePos_propertyValue.textContent = roof_extrudePos_input.value;
				n.callBaseCalibration();
				dirty = true;
			}
		});
		roof_extrudePos_input.addEventListener('mouseup',function(event){
			roof_extrudePos_ismove = false;
		});
	}
	if(n.getExtrudeHgt && n.getExtrudeHgt()){
		var roof_extrudeHgt_ismove = false;
		var div = document.createElement("div");
		inputarea.appendChild(div);
		//text
		var roof_extrudeHgt_propertyName = document.createElement("lable");
			roof_extrudeHgt_propertyName.textContent = "roof_extrudeHgt";
			div.appendChild(roof_extrudeHgt_propertyName);
		//input
		var roof_extrudeHgt_input = document.createElement("input");
			roof_extrudeHgt_input.type = "range";
			roof_extrudeHgt_input.min = "0";
			roof_extrudeHgt_input.max = "1";
			roof_extrudeHgt_input.step = "0.1";
			roof_extrudeHgt_input.value = n.getExtrudeHgt();
			div.appendChild(roof_extrudeHgt_input);
		var roof_extrudeHgt_propertyValue = document.createElement("lable");
			roof_extrudeHgt_propertyValue.textContent = roof_extrudeHgt_input.value;
			div.appendChild(roof_extrudeHgt_propertyValue);
		roof_extrudeHgt_input.addEventListener('mousedown',function(event){
			roof_extrudeHgt_ismove = true;
		});
		roof_extrudeHgt_input.addEventListener('mousemove',function(event){
			if(roof_extrudeHgt_ismove){
				n.setExtrudeHgt(Number(roof_extrudeHgt_input.value*1.0));
				roof_extrudeHgt_propertyValue.textContent = roof_extrudeHgt_input.value;
				n.callBaseCalibration();
				dirty = true;
			}
		});
		roof_extrudeHgt_input.addEventListener('mouseup',function(event){
			roof_extrudeHgt_ismove = false;
		});
	}
	
}

function timeFuction(){
    setInterval(function(){
        if(dirty || time > 0){
            if(dirty){
                time = 3;
            }
            time--;
            var base=-1;
            var interWall=[];
            var nodes=scene.findNodes();
			var Wall_id =[]
			var the_number_of_window=0;
			var the_number_of_door=0;
			var select_node=-1;
			if(lastid > 0){
				select_node = scene.findNode(lastid).getID();
			}
			
            getWallID = [];
            getWindowID = [];
            for(var i=0;i<nodes.length;i++){
                var node = nodes[i];
                if(node.getType()=="name"){
                   	if(node.getName()=="base" && Pos2housenode(node).getLayer() == 1)base=Pos2housenode(node);
					if(node.getID() == lastid){
						console.log("lastid ", lastid, " node ", node);
						select_node = housenode2Material(node).getID();
					}
                }
                if(node.getType()=="flags"){
                    if(lastFloor == -1 ||
                        (flag2housenode(node).getLayer && flag2housenode(node).getLayer() == lastFloor)){
                        node.setTransparent(false);
                        node.setPicking(true);
                    }
                    else{
                        node.setTransparent(true);
                        node.setPicking(false);
                    }
                }
                if(node.getType() == "material"){
                    if(Material2housenode(node).getType() != "window/fixed"){
                        if(Material2housenode(node).getID() == select_node){
                            node.setColor(select_material_color);
                        }else{
                            node.setColor(none_select_material_color);
                        }
                    }else{
                    }
                    
                }
                if(node.getType() == "texture"){
                    if(hasTexture){
                        
                    }else{
                        node._initTexture();
                    }
                }
				
				if(node.getType() == "wall/door_entry"){
					if(housenode2Pos(node).getName() != "interWall"){
						//the_number_of_door++;
						//Wall_id.push(i);
					}
				}else if(node.getType() == "wall/single_window"){
					if(housenode2Pos(node).getName() != "interWall"){
						the_number_of_window++;
						Wall_id.push(node);

                        //console.log("single_window ID ", node.parent.parent.parent.parent.parent.getID());
                        if(getWallID.indexOf(node.parent.parent.parent.parent.parent.getID()) < 0)
                        {
                            getWallID.push(node.parent.parent.parent.parent.parent.getID());
                        }
					}
				}else if(node.getType() == "wall/multi_window"){
					if(housenode2Pos(node).getName() != "interWall"){
						the_number_of_window += node.getWindowCenter().length/2;
						the_number_of_door += node.getDoorPosratio().length;
						Wall_id.push(node);

                        var numberOfCenter = node.getWindowCenter().length / 2;
                        if(getWallID.indexOf(node.parent.parent.parent.parent.parent.getID()) < 0)
                        {
                            for(var num = 0; num < numberOfCenter; num++)
                            {
                                getWallID.push(node.parent.parent.parent.parent.parent.getID());
                            }
                        }
					}
					
				}
            }
			if(pickObjId != null && time ==0 && !Mobile)
			{
				console.log('hitPos',hitPos);
				ModifyComponent();
			}
				
            if(base != -1){
                base.callBaseCalibration();
            }
			if(the_number_of_door >= doors.length){
				create10Doors();
			}
			if(the_number_of_window >= windows.length){
				create20Windows();
			}
			var next_window_used =0;
			var next_door_used =0;
			if(isShowingTheNonePrintablePart()){
				for(var i=0 ;i<Wall_id.length;i++){
					var node =Wall_id[i];
					if(node.getType() == "wall/door_entry"){
					}else if(node.getType() == "wall/single_window"){
						var rotate = node.getRotate();
						var traslate = node.getTranslate();
						var window_size_X = node.getWindowSize().w;
						var window_size_Y = node.getWindowSize().h;
						var window_ratio_X = node.getRatio().a;
						var window_ratio_Y = node.getRatio().b;
						var wall_width = node.getWidth();
						var wall_height = node.getHeight();
						var result=callculateWindow({rotate:rotate,translate:traslate,
										 window_ratio_X:window_ratio_X,window_ratio_Y:window_ratio_Y,
										 wall_width:wall_width,wall_height});

                        //console.log("next window ", windows[next_window_used].nodes[0].nodes[0].nodes[0].getID());
                        if(getWindowID.indexOf(windows[next_window_used].nodes[0].nodes[0].nodes[0].getID()) == -1)
                        {
                            getWindowID.push(windows[next_window_used].nodes[0].nodes[0].nodes[0].getID());

                        }

						var target = flag2housenode(windows[next_window_used]);
						target.setTranslate([result.x,result.y,result.z]);
						target.setRotate([result.rx,result.ry,result.rz]);
						target.setSize({a:window_size_X,b:window_size_Y});
						next_window_used++;
					}else if(node.getType() == "wall/multi_window"){
						var number_of_windows_in_wall = node.getWindowCenter().length/2;
						for(var j=0;j<number_of_windows_in_wall;j++){
							var rotate = node.getRotate();
							var traslate = node.getTranslate();
							var window_size_X = node.getWindowSize()[2*j];
							var window_size_Y = node.getWindowSize()[2*j+1];
							var window_ratio_X = node.getWindowCenter()[2*j];
							var window_ratio_Y = node.getWindowCenter()[2*j+1];
							var wall_width = node.getWidth();
							var wall_height = node.getHeight();
							var result=callculateWindow({rotate:rotate,translate:traslate,
										 window_ratio_X:window_ratio_X,window_ratio_Y:window_ratio_Y,
										 wall_width:wall_width,wall_height: wall_height});
                            var centers = node.getExactlyWindowCenter();
							var c = node.getTranslate();
                            //console.log("next window ", windows[next_window_used].nodes[0].nodes[0].nodes[0].getID());
                            if(getWindowID.indexOf(windows[next_window_used].nodes[0].nodes[0].nodes[0].getID()) == -1)
                            {
                                getWindowID.push(windows[next_window_used].nodes[0].nodes[0].nodes[0].getID());
                            }

							var target = flag2housenode(windows[next_window_used]);
							//target.setTranslate([result.x,result.y,result.z]);
							target.setTranslate([centers[2*j],centers[2*j+1]+node.getHeight() + c[1] - node.getHeight(),result.z]);
							target.setRotate([result.rx,result.ry,result.rz]);
							target.setSize({a:window_size_X,b:window_size_Y});
							next_window_used++;
						}
					}else{
						console.log(node);
					}
				}
			}
			
			for(var i=next_window_used;i<windows.length;i++){
				var target = flag2housenode(windows[i]);
				target.setTranslate([-1000,-1000,-1000]);
			}
			dirty = false;
        }
    }, 16);
}

function callculateWindow(param){
	var rotate = param.rotate;
	var traslate = param.translate;
	var window_ratio_X = param.window_ratio_X;
	var window_ratio_Y = param.window_ratio_Y;
	
	var wall_width = param.wall_width;
	var wall_height = param.wall_height;
	var x=0,y=0,z=0,rx=0,ry=0,rz=0;
	rx=rotate[0];ry=rotate[1];rz=rotate[2];
	if(rotate[1] == 270){
		x = traslate[0];
		y = traslate[1] - wall_height/2 + wall_height * (2*window_ratio_Y-0.5) ;
		z = traslate[2] - wall_width/2 + wall_width * (2*window_ratio_X-0.5);
	}else if(rotate[1] == 90){
		x = traslate[0];
		y = traslate[1] - wall_height/2 + wall_height * (2*window_ratio_Y -0.5) ;
		z = traslate[2] + wall_width/2 - wall_width * (2*window_ratio_X -0.5);
	}else{
		x = traslate[0] - wall_width/2 + wall_width * (2*window_ratio_X -0.5);
		y = traslate[1] - wall_height/2 + wall_height * (2*window_ratio_Y-0.5) ;
		z = traslate[2];
	}
	if(ry == 90 && traslate[0] < 0){
		ry=270;
	}else if(ry == 270 && traslate[0] >0){
		ry=90;
	}else if(ry == 0 && traslate[2] < 0){
		ry = 180;
	}else if(ry == 180 && traslate[2] >0){
		ry = 0;
	}
	if(ry==0){
		z-=1;
	}else if(ry == 90){
		x-=1;
	}else if(ry ==180){
		z+=1;
	}else if(ry ==270){
		x+=1;
	}
	return {x:x,y:y,z:z,rx:rx,ry:ry,rz:rz};
}

function Calibration(){
    var base=-1;
    var nodes=scene.findNodes();
    for(var i=0;i<nodes.length;i++){
        var node = nodes[i];
        if(node.getType()=="name"){
            if(node.getName()=="base" && Pos2housenode(node).getLayer() == 1){
                base=Pos2housenode(node);
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

function isShowingTheNonePrintablePart(){
	var windowMode=document.getElementById('windowMode');
    return windowMode.checked;
}

function changeRoof(type){
    var roof=-1;
    var nodes=scene.findNodes();
    var root = scene.findNode(3);
    var layerNumber=getTopLayer()+1;
    var elements = [];
    for(var i=0;i<nodes.length;i++){
        var node = nodes[i];
        if(node.getType()=="name"){
            if(node.getName()=="roof" ){
                roof=Pos2housenode(node);
            }
        }
        if(node.getType() == "flags" && 
            housenode2Pos(flag2housenode(node)).getName() != "roof" &&
            housenode2Pos(flag2housenode(node)).getName() != "rightTriangle" &&
            housenode2Pos(flag2housenode(node)).getName() != "leftTriangle"){
            elements.push(node);
        }
    }
    if(roof != -1){
        if(roof.KillChildren)roof.KillChildren();
        if(type == "roof/gable"){
            console.log("changed to gable");
            var rightTriangleS = getTriangleS({layerNumber: layerNumber,
                Height: roof.getHeight(),
                Width: roof.getWidth(),
                Depth: roof.getDepth(),
                Ratioa: roof.getRatio().a,
                Ratiob: roof.getRatio().b,
				rotateX: 0,
				rotateY: 90,
				rotateZ: 0,
				pos: "rightTriangle"
            });

            var leftTriangleS = getTriangleS({layerNumber: layerNumber,
                Height: roof.getHeight(),
                Width: roof.getWidth(),
                Depth: roof.getDepth(),
                Ratioa: roof.getRatio().a,
                Ratiob: roof.getRatio().b,
				rotateX: 0,
				rotateY: 90,
				rotateZ: 0,
                pos: "leftTriangle"
            });
            var gableS = getGableS({layerNumber: layerNumber,
                Height: roof.getHeight(),
                Width: roof.getWidth(),
                Depth: roof.getDepth(),
                Ratioa: roof.getRatio().a,
                Ratiob: roof.getRatio().b
            });
            var baseS = getBaseS({layer: layerNumber,
                Height: roof.getHeight(),
                Width: roof.getWidth(),
                thick: 1,
                rotateX: 0,
                rotateY: 0,
                rotateZ: 0,
                pos: "roof_base"
            });
            console.log(root.addNode(baseS));
            console.log(root.addNode(leftTriangleS));
            root.addNode(rightTriangleS);
            root.addNode(gableS);
            housenode2flag(roof).destroy();
        }else if(type=="roof/cross_gable"){
			console.log("change to cross_gable");
			var rightTriangleS = getTriangleS({layerNumber: layerNumber,
                Height: roof.getHeight(),
                Width: roof.getWidth(),
                Depth: roof.getDepth(),
                Ratioa: roof.getRatio().a,
                Ratiob: roof.getRatio().b,
				rotateX: 0,
				rotateY: 90,
				rotateZ: 0,
                pos: "rightTriangle"
            });

            var leftTriangleS = getTriangleS({layerNumber: layerNumber,
                Height: roof.getHeight(),
                Width: roof.getWidth(),
                Depth: roof.getDepth(),
                Ratioa: roof.getRatio().a,
                Ratiob: roof.getRatio().b,
				rotateX: 0,
				rotateY: 90,
				rotateZ: 0,
                pos: "leftTriangle"
            });
			var frontTriangleS = getTriangleS({layerNumber: layerNumber,
                Height: roof.getHeight(),
                Width: roof.getWidth(),
                Depth: roof.getDepth(),
                Ratioa: roof.getRatio().a,
                Ratiob: roof.getRatio().b,
				rotateX: 0,
				rotateY: 0,
				rotateZ: 0,
                pos: "frontTriangle"
            });
			var cross_gableS = getCrossGableS({layerNumber: layerNumber,
                Height: roof.getHeight(),
                Width: roof.getWidth(),
                Depth: roof.getDepth(),
                Ratioa: roof.getRatio().a,
                Ratiob: roof.getRatio().b
            });
            var baseS = getBaseS({layer: layerNumber,
                Height: roof.getHeight(),
                Width: roof.getWidth(),
                thick: 1,
                rotateX: 0,
                rotateY: 0,
                rotateZ: 0,
                pos: "roof_base"
            });
            root.addNode(baseS);
			root.addNode(frontTriangleS);
			root.addNode(leftTriangleS);
            root.addNode(rightTriangleS);
			root.addNode(cross_gableS);
			housenode2flag(roof).destroy();
			
		}else if(type == "roof/hip"){
            console.log("changed to hip");
            var hipS = getHipS({layerNumber: layerNumber,
                Height: roof.getHeight(),
                Width: roof.getWidth(),
                Depth: roof.getDepth(),
                Ratioa: roof.getRatio().a,
                Ratiob: roof.getRatio().b
            });
            
            root.addNode(hipS);
            housenode2flag(roof).destroy();
        }else if(type == "roof/mansard"){
            console.log("changed to mansard");
            var mansardS = getMansardS({layerNumber: layerNumber,
                Height: roof.getHeight(),
                Width: roof.getWidth(),
                Depth: roof.getDepth(),
                Ratioa: roof.getRatio().a,
                Ratiob: roof.getRatio().b
            });
            root.addNode(mansardS);
            housenode2flag(roof).destroy();
        }else if(type == "roof/cross_mansard"){
			console.log("change to cross_mansard");
			var cross_mansardS = getCrossMansardS({layerNumber: layerNumber,
                Height: roof.getHeight(),
                Width: roof.getWidth(),
                Depth: roof.getDepth(),
                Ratioa: roof.getRatio().a,
                Ratiob: roof.getRatio().b
            });
            var t_w =  getTrapezoidS({layerNumber: layerNumber,
                Height: roof.getHeight() - roof.getThickness()*4,
                Width: roof.getWidth(),
                Depth: roof.getDepth(),
                Ratioa: roof.getRatio().a,
                Ratiob: roof.getRatio().b,
                pos: "frontTrapezoid"
            });
            root.addNode(t_w);
			root.addNode(cross_mansardS);
			housenode2flag(roof).destroy();
		}
        
    }
    lastFloor =-1;
    lastid=-1;
    Calibration();
    dirty = true;
    
}

function getHipInfo(){
    return "<element><type>roof/hip</type><transform><scale>1,1,1</scale><rotate>0,90,0</rotate><translate>0,0,0</translate></transform><texture>roof.jpg</texture><pos>roof</pos><property><width>18</width><height>8</height><depth>18</depth><thickness>2</thickness><ratio>0.5,0.5</ratio><toplen>6</toplen><layer>2</layer></property></element>";
}
function getgableInfo(){
    return '<element><type>roof/gable</type><transform><scale>1,1,1</scale><rotate>0,90,0</rotate><translate>0,21.5,0</translate></transform><texture>roof.jpg</texture><pos>roof</pos><property><height>5</height><width>8</width><thickness>1</thickness><depth>18</depth><ratio>0.5,0.5</ratio></property></element><element><type>wall/triangle</type><transform><scale>1,1,1</scale><rotate>0,90,0</rotate><translate>17,22,0</translate></transform>    <texture>wall.jpg</texture><pos>rightTriangle</pos><property><height>5</height><width>8</width><thickness>1</thickness><ratio>0.5,0.5</ratio></property></element><element><type>wall/triangle</type><transform><scale>1,1,1</scale><rotate>0,-90,0</rotate><translate>-17,22,0</translate></transform>        <texture>wall.jpg</texture><pos>leftTriangle</pos><property><height>5</height><width>8</width><thickness>1</thickness><ratio>0.5,0.5</ratio></property></element>';
}
function getElementXML(n){
	var cut_string = "images/GeometryTexture/";
	var cut_length = cut_string.length;
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
        if(housenode2TextureName(n).getName){
            xml+=housenode2TextureName(n).getName();
        }
        xml+='</texture>'+'\n';
		xml+='\t\t'+'<specular>';
        if(housenode2TextureName(n).getName){
			var s =housenode2SpecularTexture(n)._core.src ;
            xml+= s.substring(cut_length,s.length);
        }
        xml+='</specular>'+'\n';
		xml+='\t\t'+'<normalmap>';
        if(housenode2TextureName(n).getName){
            var s =housenode2normalTexture(n)._core.src ;
            xml+= s.substring(cut_length,s.length);
        }
        xml+='</normalmap>'+'\n';
        xml+='\t\t'+'<pos>';
        if(housenode2Pos(n).getName){
            xml+=housenode2Pos(n).getName();
        }
        xml+='</pos>'+'\n';
        xml+='\t\t'+'<property>'+'\n';
            if(n.getLayer)xml+='\t\t\t'+'<layer>'+n.getLayer()+'</layer>'+'\n';
			if(n.getRealHeight)xml+='\t\t\t'+'<realheight>'+n.getRealHeight()+'</realheight>'+'\n';
            if(n.getHeight)xml+='\t\t\t'+'<height>'+n.getHeight()+'</height>'+'\n';
            if(n.getRealWidth)xml+='\t\t\t'+'<realwidth>'+n.getRealWidth()+'</realwidth>'+'\n';
            if(n.getWidth)xml+='\t\t\t'+'<width>'+n.getWidth()+'</width>'+'\n';
            if(n.getThickness)xml+='\t\t\t'+'<thickness>'+n.getThickness()+'</thickness>'+'\n';
            if(n.getDepth)xml+='\t\t\t'+'<depth>'+n.getDepth()+'</depth>'+'\n';
            if(n.getRatio){
                var ratio = n.getRatio();
                xml+='\t\t\t'+'<ratio>'+ratio.a+','+ratio.b+'</ratio>'+'\n';
            }
			if(n.getLeftBackX)xml+='\t\t\t'+'<LeftBackX>'+n.getLeftBackX()+'</LeftBackX>'+'\n';
			if(n.getLeftBackY)xml+='\t\t\t'+'<LeftBackY>'+n.getLeftBackY()+'</LeftBackY>'+'\n';
			if(n.getRightBackX)xml+='\t\t\t'+'<RightBackX>'+n.getRightBackX()+'</RightBackX>'+'\n';
			if(n.getRightBackY)xml+='\t\t\t'+'<RightBackY>'+n.getRightBackY()+'</RightBackY>'+'\n';
            if(n.getPercentX && n.getPercentX())xml+='\t\t\t'+'<percentX>'+n.getPercentX()+'</percentX>'+'\n';
            if(n.getPercentY && n.getPercentY())xml+='\t\t\t'+'<percentY>'+n.getPercentY()+'</percentY>'+'\n';
            if(n.getPriority && n.getPriority())xml+='\t\t\t'+'<priority>'+n.getPriority()+'</priority>'+'\n';
            if(n.getToplen)xml+='\t\t\t'+'<toplen>'+n.getToplen()+'</toplen>'+'\n';
            if(n.getDirection)xml+='\t\t\t'+'<direction>'+n.getDirection()+'</direction>'+'\n';
            if(n.getOffsetX && n.getOffsetX())xml += '\t\t\t'+'<OffsetX>'+n.getOffsetX()+'</OffsetX>'+'\n';
            if(n.getOffsetY && n.getOffsetY())xml += '\t\t\t'+'<OffsetY>'+n.getOffsetY()+'</OffsetY>'+'\n';
            if(n.getWindowSize){
                var size = n.getWindowSize();
                xml+='\t\t\t'+'<windowW>'+size.w+'</windowW>'+'\n';
                xml+='\t\t\t'+'<windowH>'+size.h+'</windowH>'+'\n';
            }
            if(n.getDoorSize && n.getDoorSize().w)xml+='\t\t\t'+'<doorW>'+n.getDoorSize().w+'</doorW>'+'\n';
            if(n.getDoorSize && n.getDoorSize().h)xml+='\t\t\t'+'<doorH>'+n.getDoorSize().h+'</doorH>'+'\n';
            if(n.getPosratio && n.getPosratio())xml+='\t\t\t'+'<posratio>'+n.getPosratio()+'</posratio>'+'\n';
            if(n.getDoorPosratio && n.getDoorPosratio()){
                xml+='\t\t\t'+'<doorPosratio>';
                var doorpostatios = n.getDoorPosratio();
                for(var i=0;i<doorpostatios.length;i++){
                    if(i==0)xml+=doorpostatios[i];
                    else xml+=','+doorpostatios[i];
                }
                xml+='</doorPosratio>'+'\n';
            }
            if(n.getDoorSize && n.getDoorSize()){
                xml+='\t\t\t'+'<doorSize>';
                var values = n.getDoorSize();
                for(var i=0;i<values.length;i++){
                    if(i==0)xml+=values[i];
                    else xml+=','+values[i];
                }
                xml+='</doorSize>'+'\n';
            }
            if(n.getWindowSize && n.getWindowSize()){
                xml+='\t\t\t'+'<windowSize>';
                var values = n.getWindowSize();
                for(var i=0;i<values.length;i++){
                    if(i==0)xml+=values[i];
                    else xml+=','+values[i];
                }
                xml+='</windowSize>'+'\n';
            }
            if(n.getWindowCenter && n.getWindowCenter()){
                xml+='\t\t\t'+'<windowCenter>';
                var values = n.getWindowCenter();
                for(var i=0;i<values.length;i++){
                    if(i==0)xml+=values[i];
                    else xml+=','+values[i];
                }
                xml+='</windowCenter>'+'\n';
            }
			if(n.getExtrudePos && n.getExtrudePos())xml+='\t\t\t'+'<extrude_pos>'+n.getExtrudePos()+'</extrude_pos>'+'\n';
			if(n.getExtrudeHgt && n.getExtrudeHgt())xml+='\t\t\t'+'<extrude_hgt>'+n.getExtrudeHgt()+'</extrude_hgt>'+'\n';
			if(n.getExtrudeLen && n.getExtrudeLen())xml+='\t\t\t'+'<extrude_len>'+n.getExtrudeLen()+'</extrude_len>'+'\n';
			if(n.getExtrudeBas && n.getExtrudeBas())xml+='\t\t\t'+'<extrude_bas>'+n.getExtrudeBas()+'</extrude_bas>'+'\n';
			if(n.getBackGrasp && n.getBackGrasp())xml+='\t\t\t'+'<back_grasp>'+n.getBackGrasp()+'</back_grasp>'+'\n';
			if(n.getBackSide && n.getBackSide())xml+='\t\t\t'+'<back_side>'+n.getBackSide()+'</back_side>'+'\n';
			if(n.getGap)xml+='\t\t\t'+'<gap>'+n.getGap()+'</gap>'+'\n';
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
            var n= flag2housenode(node);
			if(n.getType() == "window/fixed"){
			}else{
				xml += getElementXML(n);
			}
            
        }
    }
    xml+='</layer>'+'\n';
    console.log(xml);
    return xml;
}

function saveXML(){
    download(generateXML(), "3Dhouse.3Dhouse", 'text/plain');
}

function create20Windows(){
	console.log(scene.findNode(3));
	for(var i=0;i<20;i++){
		windows.push(scene.findNode(3).addNode(getWindow_fixed({pos:'window',extend:1,sizeX:4,sizeY:4,})));
	}
}
function create10Doors(){
	
}

function normalTexture2housenode(node){
	return node.nodes[0];
}
function SpecularTexture2housenode(node){
	return normalTexture2housenode(node).nodes[0];
}
function Texture2housenode(node){
	return SpecularTexture2housenode(node).nodes[0];
}
function Matrix2housenode(node){
	return Texture2housenode(node).nodes[0];
}
function TextureName2housenode(node){
	return Matrix2housenode(node).nodes[0];
}
function Material2housenode(node){
	return TextureName2housenode(node).nodes[0];
}
function Pos2housenode(node){
	return Material2housenode(node).nodes[0];
}
function flag2housenode(node){
	return Pos2housenode(node).nodes[0];
}
function housenode2normalTexture(node){
	return node.getParent();
}
function housenode2SpecularTexture(node){
	return housenode2normalTexture(node).getParent();
}
function housenode2Texture(node){
	return housenode2SpecularTexture(node).getParent();
}
function housenode2Matrix(node){
	return housenode2Texture(node).getParent();
}
function housenode2TextureName(node){
	return housenode2Matrix(node).getParent();
}
function housenode2Material(node){
	return housenode2TextureName(node).getParent();
}
function housenode2Pos(node){
	return housenode2Material(node).getParent();
}
function housenode2flag(node){
	return housenode2Pos(node).getParent();
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

function getHipS(param){
    var hipS = {
        type: "flags",
        flags:{transparent:false},
        nodes:
        [{
            type: "name",
            name: "roof",

            nodes:
            [{
                type: "material",
                color:none_select_material_color,
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
                                type: "texture",
                                src: "images/GeometryTexture/roofSpecularMap.png",
                                applyTo: "specular", // Apply to specularity

                                nodes: 
                                [{
                                    type: "texture",
                                    src: "images/GeometryTexture/roofNormalMap.png",
                                    applyTo: "normals", // Apply to geometry normal vectors

                                    nodes:
                                    [{
                                        type: "roof/hip",
                                        layer: param.layerNumber,
                                        height: param.Height,
                                        width: param.Width,
                                        thickness: 2,
                                        depth: param.Depth,
                                        ratio: {a: 0.5 , b: 0.5 },
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
            }]
        }] 
    };
    return hipS;
}

function getMansardS(param){
    var mansardS = {
        type: "flags",
        flags:{transparent:false},
        nodes:
        [{
            type: "name",
            name: "roof",

            nodes:
            [{
                type: "material",
                color:none_select_material_color,
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
                                type: "texture",
                                src: "images/GeometryTexture/roofSpecularMap.png",
                                applyTo: "specular", // Apply to specularity

                                nodes: 
                                [{
                                    type: "texture",
                                    src: "images/GeometryTexture/roofNormalMap.png",
                                    applyTo: "normals", // Apply to geometry normal vectors

                                    nodes:
                                    [{
                                        type: "roof/mansard",
                                        layer: param.layerNumber,
                                        height: param.Height,
                                        width: param.Width,
                                        thickness: 1,
                                        depth: param.Depth,
                                        ratio: {a: 0.2 , b: 0.2},
                                        scale: {x: 1, y: 1, z: 1},
                                        rotate: {x: 0, y: 90, z: 0},
                                        translate: {x: 0, y: 0, z: 0}
                                    }]
                                }]
                            }]
                        }]
                    }]
                }]
            }]
        }] 
    };
    return mansardS
}

function getGableS(param){

    var gableS = {
        type: "flags",
        flags:{transparent:false},
        nodes:
        [{
            type: "name",
            name: "roof",

            nodes:
            [{
                type: "material",
                color:none_select_material_color,
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
                                type: "texture",
                                src: "images/GeometryTexture/roofSpecularMap.png",
                                applyTo: "specular", // Apply to specularity

                                nodes: 
                                [{
                                    type: "texture",
                                    src: "images/GeometryTexture/roofNormalMap.png",
                                    applyTo: "normals", // Apply to geometry normal vectors

                                    nodes:
                                    [{
                                        type: "roof/gable",
                                        layer: param.layerNumber,
                                        height: param.Height,
                                        width: param.Width,
                                        thickness: 1,
                                        depth: param.Depth,
                                        ratio: {a: 0.5 , b: 0.5},
                                        scale: {x: 1, y: 1, z: 1},
                                        rotate: {x: 0, y: 90, z: 0},
                                        translate: {x: 0, y: 0, z: 0}
                                    }]
                                }]
                            }]
                        }]
                    }]
                }]
            }]
        }] 
    };
    return gableS;
}
function getCrossMansardS(param){
	var corss_mansardS = {
        type: "flags",
        flags:{transparent:false},
        nodes:
        [{
            type: "name",
            name: "roof",

            nodes:
            [{
                type: "material",
                color:none_select_material_color,
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
                                type: "texture",
                                src: "images/GeometryTexture/roofSpecularMap.png",
                                applyTo: "specular", // Apply to specularity

                                nodes: 
                                [{
                                    type: "texture",
                                    src: "images/GeometryTexture/roofNormalMap.png",
                                    applyTo: "normals", // Apply to geometry normal vectors

                                    nodes:
                                    [{
                                        type: "roof/cross_mansard",
                                        layer: param.layerNumber,
                                        height: param.Height,
                                        width: param.Width,
                                        thickness: 1,
                                        depth: param.Depth,

										back_side: "on",
										extrude_len: 1,
										extrude_pos: 0.5,
										extrude_hgt: 1,
										extrude_bas: 20,
										extrude_tpl: 0.2, 
										back_grasp: 1,
                                        front_cover: "off",
                                        
                                        ratio: {a: 0.2 , b: 0.2},
                                        scale: {x: 1, y: 1, z: 1},
                                        rotate: {x: 0, y: 180, z: 0},
                                        translate: {x: 0, y: 0, z: 0}
                                    }]
                                }]
                            }]
                        }]
                    }]
                }]
            }]
        }] 
    };
	return corss_mansardS;
}
function getCrossGableS(param){
	var cross_gableS={
		type: "flags",
        flags:{transparent:false},
        nodes:
        [{
            type: "name",
            name: "roof",

            nodes:
            [{
                type: "material",
                color:none_select_material_color,
                alpha:0.2,
                nodes:
                [{
                    type: "name",
                    name: "old_roof.jpg",

                    nodes:
                    [{
                        type: "matrix",
                        elements:[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],

                        nodes:
                        [{
                            type: "texture",
                            src: "images/GeometryTexture/old_roof.jpg",
                            applyTo: "color",

                            nodes: 
                            [{
                                type: "texture",
                                src: "images/GeometryTexture/roofSpecularMap.png",
                                applyTo: "specular", // Apply to specularity

                                nodes: 
                                [{
                                    type: "texture",
                                    src: "images/GeometryTexture/roofNormalMap.png",
                                    applyTo: "normals", // Apply to geometry normal vectors

                                    nodes:
                                    [{
                                        type: "roof/cross_gable",
                                        layer: param.layerNumber,
                                        height: param.Height,
                                        width: param.Width,
                                        back_side: "off",
                                        back_grasp:4,
                                        extrude_len:6,
                                        extrude_pos:0.5,
                                        extrude_bas:6,
                                        extrude_hgt:0.7,
                                        thickness: 1,
                                        depth: param.Depth,
                                        ratio: {a: 0.5 , b: 0.5},
                                        scale: {x: 1, y: 1, z: 1},
                                        rotate: {x: 0, y: 180, z: 0},
                                        translate: {x: 0, y: 0, z: 0}
                                    }]
                                }]
                            }]
                        }]
                    }]
                }]
            }]
        }]
	};
	return cross_gableS;
}
function getTriangleS(param){
    var TriangleS = {
        type: "flags",
        flags:{transparent:false},
        nodes:
        [{
            type: "name",
            name: param.pos,

            nodes:
            [{
                type: "material",
                color:none_select_material_color,
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
                                type: "texture",
                                src: "images/GeometryTexture/wallSpecularMap.png",
                                applyTo: "specular", // Apply to specularity

                                nodes: 
                                [{
                                    type: "texture",
                                    src: "images/GeometryTexture/wallNormalMap.png",
                                    applyTo: "normals", // Apply to geometry normal vectors

                                    nodes:
                                    [{
                                        type: "wall/triangle",
                                        layer: param.layerNumber,
                                        height: param.Height,
                                        width: param.Width,
                                        thickness: 1,
                                        ratio: {a: 0.5 , b: 0.5},
                                        scale: {x: 1, y: 1, z: 1},
                                        rotate: {x: param.rotateX, y: param.rotateY, z: param.rotateZ},
                                        translate: {x: 0, y: 0, z: 0}
                                    }]
                                }]
                            }]
                        }]
                    }]
                }]
            }]
        }] 
    };
    return TriangleS;
}
function getTrapezoidS(param){
	var TrapezoidS = {
        type: "flags",
        flags:{transparent:false},
        nodes:
        [{
            type: "name",
            name: param.pos,

            nodes:
            [{
                type: "material",
                color:none_select_material_color,
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
                                type: "texture",
                                src: "images/GeometryTexture/wallSpecularMap.png",
                                applyTo: "specular", // Apply to specularity

                                nodes: 
                                [{
                                    type: "texture",
                                    src: "images/GeometryTexture/wallNormalMap.png",
                                    applyTo: "normals", // Apply to geometry normal vectors

                                    nodes:
                                    [{
                                        type: "wall/trapezoid",
                                        layer: param.layerNumber,
                                        height: param.Height,
                                        width: param.Width,
                                        thickness: 1,
                                        ratio: {a: 0.2 , b: 0.8},
                                        scale: {x: 1, y: 1, z: 1},
                                        rotate: {x: 0, y: 0, z: 0},
                                        translate: {x: 0, y: 0, z: 0}
                                    }]
                                }]
                            }]
                        }]
                    }]
                }]
            }]
        }] 
    };
    return TrapezoidS;
}
function getWindow_fixed(param){
	var window_fixed = {
		type: "flags",
		flags:{transparent:false},
		nodes:
		[{
			type: "name",
			name: param.pos,
			
			nodes:
			[{
				type: "material",
				color:none_select_material_color,
                alpha:0.2,
				
				nodes:
				[{
					type: "name",
					name: "iron.jpg",
					
					nodes:
					[{
						type: "matrix",
						elements:[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],
						
						nodes:
						[{
							type: "texture",
							src: "images/GeometryTexture/iron.jpg",
							applyTo: "color",
							
							nodes: 
                            [{
                                type: "texture",
                                src: "images/GeometryTexture/ironSpecularMap.png",
                                applyTo: "specular", // Apply to specularity

                                nodes: 
                                [{
                                    type: "texture",
                                    src: "images/GeometryTexture/ironNormalMap.png",
                                    applyTo: "normals", // Apply to geometry normal vectors

                                    nodes:
                                    [{
                                        type: "window/fixed",
                                        extend: param.extend,
                                        size: {a: param.sizeX, b: param.sizeY},
                                        thickness: 1,
                                        rotate: {x: 0, y: 0, z: 0},
                                        translate: {x: 0, y: 0, z: 0},
                                        scale: {x: 1, y: 1, z: 1}
                                    }]
                                }]
                            }]
						}]
					}]
					
				}]
			}]
			
		}]
	};
	return window_fixed;
}
function getNormalWallS(param){
	var normal_wall = {
		type: "flags",
        flags:{transparent:false},
        nodes:
        [{
            type: "name",
            name: param.pos,

            nodes:
            [{
                type: "material",
                color:none_select_material_color,
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
                                type: "texture",
                                src: "images/GeometryTexture/wallSpecularMap.png",
                                applyTo: "specular", // Apply to specularity

                                nodes: 
                                [{
                                    type: "texture",
                                    src: "images/GeometryTexture/wallNormalMap.png",
                                    applyTo: "normals", // Apply to geometry normal vectors

                                    nodes:
                                    [{
                                        type: "wall/no_window",
                                        layer: param.layer,
                                        height: param.height,
                                        width: param.width,
                                        thickness: param.thick,
                                        direction: param.dir,
                                        priority: param.pri,
                                        percentX: param.perX,
                                        percentY: param.perY,
                                        scale: {x: 1, y: 1, z: 1},
                                        rotate: {x: param.rotateX, y: param.rotateY, z: param.rotateZ},
                                        translate: {x: 0, y: 0, z: 0}
                                    }]
                                }]
                            }]
                        }]
                    }]
                }]
            }]
        }]
	};
	return normal_wall;
}
function getSingleWallS(param){
	var single_wall = {
		type: "flags",
        flags:{transparent:false},
        nodes:
        [{
            type: "name",
            name: param.pos,

            nodes:
            [{
                type: "material",
                color:none_select_material_color,
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
                                type: "texture",
                                src: "images/GeometryTexture/wallSpecularMap.png",
                                applyTo: "specular", // Apply to specularity

                                nodes: 
                                [{
                                    type: "texture",
                                    src: "images/GeometryTexture/wallNormalMap.png",
                                    applyTo: "normals", // Apply to geometry normal vectors

                                    nodes:
                                    [{
                                        type: "wall/single_window",
                                        layer: param.layer,
                                        height: param.height,
                                        width: param.width,
                                        thickness: param.thick,
                                        direction: param.dir,
                                        ratio: {a: 0.5,b: 0.5},
                                        windowW: 3,
                                        windowH: 3,
                                        priority: param.pri,
                                        percentX: param.perX,
                                        percentY: param.perY,
                                        scale: {x: 1, y: 1, z: 1},
                                        rotate: {x: param.rotateX, y: param.rotateY, z: param.rotateZ},
                                        translate: {x: 0, y: 0, z: 0}
                                    }]
                                }]
                            }]
                        }]
                    }]
                }]
            }]
        }]
	};
	return single_wall; 
}
function getDoorWallS(param){
	var door_wall = {
		type: "flags",
        flags:{transparent:false},
        nodes:
        [{
            type: "name",
            name: param.pos,

            nodes:
            [{
                type: "material",
                color:none_select_material_color,
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
                                type: "texture",
                                src: "images/GeometryTexture/wallSpecularMap.png",
                                applyTo: "specular", // Apply to specularity

                                nodes: 
                                [{
                                    type: "texture",
                                    src: "images/GeometryTexture/wallNormalMap.png",
                                    applyTo: "normals", // Apply to geometry normal vectors

                                    nodes:
                                    [{
                                        type: "wall/door_entry",
                                        layer: param.layer,
                                        height: param.height,
                                        width: param.width,
                                        thickness: param.thick,
                                        direction: param.dir,
                                        posratio: 0.5,
                                        doorW: 3,
                                        doorH: 6,
                                        priority: param.pri,
                                        percentX: param.perX,
                                        percentY: param.perY,
                                        scale: {x: 1, y: 1, z: 1},
                                        rotate: {x: param.rotateX, y: param.rotateY, z: param.rotateZ},
                                        translate: {x: 0, y: 0, z: 0}
                                    }]
                                }]
                            }]
                        }]
                    }]
                }]
            }]
        }]
	};
	return door_wall;
}
function getMultiWallS(param){
	var multi_wall = {
		type: "flags",
        flags:{transparent:false},
        nodes:
        [{
            type: "name",
            name: param.pos,

            nodes:
            [{
                type: "material",
                color:none_select_material_color,
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
                                type: "texture",
                                src: "images/GeometryTexture/wallSpecularMap.png",
                                applyTo: "specular", // Apply to specularity

                                nodes: 
                                [{
                                    type: "texture",
                                    src: "images/GeometryTexture/wallNormalMap.png",
                                    applyTo: "normals", // Apply to geometry normal vectors

                                    nodes:
                                    [{
                                        type: "wall/multi_window",
                                        layer: param.layer,
                                        height: param.height,
                                        width: param.width,
                                        thickness: param.thick,
                                        direction: param.dir,
                                        priority: param.pri,
                                        percentX: param.perX,
                                        percentY: param.perY,
										windowSize: [3,3,3,3,3,3],
										windowCenter: [0.9,0.5,0.1,0.5,0.5,0.5],
										gap: 2,
                                        scale: {x: 1, y: 1, z: 1},
                                        rotate: {x: param.rotateX, y: param.rotateY, z: param.rotateZ},
                                        translate: {x: 0, y: 0, z: 0}
                                    }]
                                }]
                            }]
                        }]
                    }]
                }]
            }]
        }]
	};
	return multi_wall;
}
function getBaseS(param){
    var base = {
        type: "flags",
        flags:{transparent:false},
        nodes:
        [{
            type: "name",
            name: param.pos,

            nodes:
            [{
                type: "material",
                color:none_select_material_color,
                alpha:0.2,
                nodes:
                [{
                    type: "name",
                    name: "ground.jpg",

                    nodes:
                    [{
                        type: "matrix",
                        elements:[0,0,1,0,1,0,0,0,0,1,0,0,9,8.5,0,1],

                        nodes:
                        [{
                            type: "texture",
                            src: "images/GeometryTexture/ground.jpg",
                            applyTo: "color",

                            nodes: 
                            [{
                                type: "texture",
                                src: "images/GeometryTexture/groundSpecularMap.png",
                                applyTo: "specular", // Apply to specularity

                                nodes: 
                                [{
                                    type: "texture",
                                    src: "images/GeometryTexture/groundNormalMap.png",
                                    applyTo: "normals", // Apply to geometry normal vectors

                                    nodes:
                                    [{
                                        type: "base/basic",
                                        layer: param.layer,
                                        height: param.height,
                                        width: param.width,
                                        thickness: param.thick,
                                        scale: {x: 1, y: 1, z: 1},
                                        rotate: {x: param.rotateX, y: param.rotateY, z: param.rotateZ},
                                        translate: {x: 0, y: 0, z: 0}
                                    }]
                                }]
                            }]
                        }]
                    }]
                }]
            }]
        }]
    };
    return base;
}
function changeWall(wall_id,wall_type){
	var n = scene.findNode(wall_id);
	if(n.getType() !="wall/no_window" &&
	  n.getType() !="wall/single_window" &&
	  n.getType() !="wall/door_entry" &&
	  n.getType() !="wall/multi_window"){
		return;
	}
	
	var root = scene.findNode(3);
	var param = {
				pos: housenode2Pos(n).getName(),
				layer: n.getLayer(),
				height: n.getHeight(),
				width: n.getWidth(),
				thick: n.getThickness(),
				dir: n.getDirection(),
				pri: n.getPriority(),
				perX: n.getPercentX(),
				perY: n.getPercentY(),
				rotateX: n.getRotate()[0],
				rotateY: n.getRotate()[1],
				rotateZ: n.getRotate()[2]
			}
	if(wall_type == "wall/no_window"){
		var normal_WallS = getNormalWallS(param);
		console.log(root.addNode(normal_WallS));
			
            
	}else if(wall_type == "wall/single_window"){
		var single_wallS = getSingleWallS(param);
			root.addNode(single_wallS);
	}else if(wall_type == "wall/door_entry"){
		var door_wallS = getDoorWallS(param);
			root.addNode(door_wallS);
	}else if(wall_type == "wall/multi_window"){
		var multi_wallS =getMultiWallS(param);
			root.addNode(multi_wallS);
	}
	
	housenode2flag(n).destroy();
    //remove input
    if(document.getElementById('inputarea')){
        document.getElementById('inputarea').remove();
    }
    //cancle pick
    lastid=-1;
    dirty = true;
}
function deleteWall(wall_id){
	var n = scene.findNode(wall_id);
	if(n.getDirection && housenode2Pos(n).getName() == "interWall")
	 housenode2flag(n).destroy();
     
     //remove input
     if(document.getElementById('inputarea')){
         document.getElementById('inputarea').remove();
     }
     //cancle pick
     lastid=-1;
     dirty = true;
}
function moveWindow(wall_id,ratioA,ratioB){
	var n = scene.findNode(wall_id);
	if(n.getRatio){
		n.setRatioA(ratioA);
		n.setRatioB(ratioB);
		n.callBaseCalibration();
		dirty = true;
	}
}
function moveDoor(wall_id,pos_ration){
	var n = scene.findNode(wall_id);
	if(n.getPosratio){
		n.setPosratio(pos_ration);
		n.callBaseCalibration();
		dirty = true;
	}
}
