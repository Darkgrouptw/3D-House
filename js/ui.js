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

/*var lastid=-1;
var lastFloor = -1;
var uiPanel;
function ScenePick(){
    uiPanel=document.getElementById('codewrapper');
    scene.on("pick",
            function (hit) {
                var material;
                if(lastid>0){
                    if(scene.findNode(lastid)){
                        material=scene.findNode(lastid);
                        material.setColor({ r:1, g:1, b:1});
                    } 
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
                attachInput(hit.nodeId);
            });
    scene.on("nopick",
            function () {
                uiPanel.style.display='none';
                if(lastid>0){
                    material=scene.findNode(lastid);
                    material.setColor({ r:1, g:1, b:1});
                }
                lastid = -1;
                lastFloor = -1;
                console.log('Nothing picked!');

                //for some ridiculurs reason i got to pick again!!
                //scene.pick()
            });
    var canvas = scene.getCanvas();
    canvas.addEventListener('mousedown',
            function (event) {
                
                scene.pick(event.clientX, event.clientY, { regionPick: true });
                if(lastid == -1 && lastFloor == -1){
                    setAllTheElementPickable();
                    scene.pick(event.clientX, event.clientY, { regionPick: true });
                }
            });
}*/

var lastid=-1;
var lastFloor = -1;
var uiPanel;
var tmpNormal = null;
function ScenePick(){
    var lastX;
    var lastY;
    
    var stampDown;
    var stampUp;
    var count = 0;
    
    var canvas = scene.getCanvas();

    canvas.addEventListener('mousedown',
            function (event) {
                tmpNormal = null;
                if(count == 0)
                {
                    stampDown = event.timeStamp;
                    console.log(stampDown);
                }

                lastX = event.clientX;
                lastY = event.clientY;
            }, true);

    canvas.addEventListener('mouseup',
            function (event) {

                if(Math.abs(event.clientX - lastX) < 3 && Math.abs(event.clientY - lastY) < 3)
                {
                    count++;
                    console.log(count);

                    if(count == 2)
                    {
                        stampUp = event.timeStamp - stampDown;
                        console.log(stampUp);
                    }

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

                if(count == 0)
                {
                    stampDown = event.timeStamp;
                    //console.log(stampDown);
                }
                
                lastX = event.targetTouches[0].clientX;
                lastY = event.targetTouches[0].clientY;
            }, true);

    canvas.addEventListener('touchend',
            function (event) {
                
                if(Math.abs(event.targetTouches[0].clientX - lastX) < 3 && Math.abs(event.targetTouches[0].clientY - lastY) < 3)
                {
                    count++;
                    //console.log(count);

                    if(count == 2)
                    {
                        stampUp = event.timeStamp - stampDown;
                        //console.log(stampUp);
                    }

                    scene.pick(event.targetTouches[0].clientX, event.targetTouches[0].clientY, {rayPick: true});
                    if(lastid == -1 && lastFloor == -1){
                        setAllTheElementPickable();
                        scene.pick(event.targetTouches[0].clientX, event.targetTouches[0].clientY, {rayPick: true});
                    }
                }
                
            }, true);
			
	canvas.addEventListener('touchmove', 
			function(event){
				if(count != 2)
				{
					count = 0;
				}
			},true);

            
    uiPanel=document.getElementById('codewrapper');
    scene.on("pick",
            function (hit) {
                
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
                
                console.log(hit.worldPos);
                calculateAxis(hit.nodeId);
                if(count != 2)
                {
                    attachInput(hit.nodeId);
                }
                else
                {
                    if(stampUp < 500)
                    {
                        changeViewpoint(hit.nodeId);
                    }
                    count = 0;
                }
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
                count = 0;
                //for some ridiculurs reason i got to pick again!!
                //scene.pick()
            });
}

function calculateAxis(id)
{
    var tmpId = scene.findNode(id);

    var tmpT = {};
    tmpT.rotate = tmpId.nodes[0].nodes[0].nodes[0].getRotate();
    tmpT.scale = tmpId.nodes[0].nodes[0].nodes[0].getScale();
    tmpT.translate = tmpId.nodes[0].nodes[0].nodes[0].getTranslate();
    var transMatrix = utility.transformMatrix(tmpT);

    var modelMat = tmpId.nodes[0].getModelMatrix();
    var viewMat = scene.getNode(3).getMatrix();
    var projMat = SceneJS.Camera.getDefaultMatrix();

    var tmpTRS = SceneJS_math_mat4();
    var tmpVM = SceneJS_math_mat4();
    var tmpPV = SceneJS_math_mat4();

    var modelTRS = SceneJS_math_mulMat4(modelMat , transMatrix, tmpTRS);
    var vmMat = SceneJS_math_mulMat4(viewMat, modelTRS, tmpVM);
    var pvMat = SceneJS_math_mulMat4(projMat, vmMat, tmpPV);

    var tmpX = [1.0, 0.0, 0.0, 1.0];
    var tmpY = [0.0, 1.0, 0.0, 1.0];
    var tmpZ = [0.0, 0.0, 1.0, 1.0];
    var tmpO = [0.0, 0.0, 0.0, 1.0];

    var xaxis = SceneJS_math_mulMat4v4(pvMat, tmpX);
    var yaxis = SceneJS_math_mulMat4v4(pvMat, tmpY);
    var zaxis = SceneJS_math_mulMat4v4(pvMat, tmpZ);
    var oaxis = SceneJS_math_mulMat4v4(pvMat, tmpO);
    xaxis = SceneJS_math_projectVec4(xaxis);
    yaxis = SceneJS_math_projectVec4(yaxis);
    zaxis = SceneJS_math_projectVec4(zaxis);
    oaxis = SceneJS_math_projectVec4(oaxis);

    var lengthX = Math.sqrt((xaxis[0]-oaxis[0]) * (xaxis[0]-oaxis[0]) + 
                            (xaxis[1]-oaxis[1]) * (xaxis[1]-oaxis[1]) + 
                            (xaxis[2]-oaxis[2]) * (xaxis[2]-oaxis[2]) +
                            (xaxis[3]-oaxis[3]) * (xaxis[3]-oaxis[3]));

    var lengthY = Math.sqrt((yaxis[0]-oaxis[0]) * (yaxis[0]-oaxis[0]) + 
                            (yaxis[1]-oaxis[1]) * (yaxis[1]-oaxis[1]) + 
                            (yaxis[2]-oaxis[2]) * (yaxis[2]-oaxis[2]) +
                            (yaxis[3]-oaxis[3]) * (yaxis[3]-oaxis[3]));

    var lengthZ = Math.sqrt((zaxis[0]-oaxis[0]) * (zaxis[0]-oaxis[0]) + 
                            (zaxis[1]-oaxis[1]) * (zaxis[1]-oaxis[1]) + 
                            (zaxis[2]-oaxis[2]) * (zaxis[2]-oaxis[2]) +
                            (zaxis[3]-oaxis[3]) * (zaxis[3]-oaxis[3]));

    var tmpArr = [];
    tmpArr.push(lengthX);
    tmpArr.push(lengthY);
    tmpArr.push(lengthZ);
    tmpArr.sort(function(a, b){return a-b});
    
    if(tmpArr[0] == lengthX)
    {
        console.log("yz");
    }
    else if(tmpArr[0] == lengthY)
    {
        console.log("xz");
    }
    else if(tmpArr[0] == lengthZ)
    {
        console.log("xy");
    }
}

function changeViewpoint(id)
{
    var tmpId = scene.findNode(id);
    var nameNode= tmpId.parent.parent.getName();
    if(nameNode == "base")
    {
        tmpNormal = [0,1,0];
    }
    else if(nameNode == "rightWall")
    {
        tmpNormal = [1,0,0];
    }
    else if(nameNode == "leftWall")
    {
        tmpNormal = [-1,0,0];
    }
    else if(nameNode == "backWall")
    {
        tmpNormal = [0,0,-1];
    }
    else if(nameNode == "roof" || nameNode == "rightTriangle" || nameNode == "leftTriangle")
    {
        tmpNormal = [0,0,1];
    }
    else
    {
        tmpNormal = null;
    }
}

function getNormal()
{
    return tmpNormal;
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
                box[i].setSrc("Images/GeometryTexture/"+src+"");
            }
        }
    }
    hasTexture=!hasTexture;
}

function addInterWall(){
    if(lastFloor<=0){
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
                                src: "images/GeometryTexture/Wall.jpg",
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
                        name: "Ground.jpg",
    
                        nodes:
                        [{
                            type: "matrix",
                            elements:[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],
    
                            nodes:
                            [{
                                type: "texture",
                                src: "images/GeometryTexture/Ground.jpg",
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
                                src: "images/GeometryTexture/Wall.jpg",
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
                                src: "images/GeometryTexture/Wall.jpg",
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
                                src: "images/GeometryTexture/Wall.jpg",
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
                n.setPercentY(percentYinput.value);
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
                n.setDepth(depthinput.value);
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
            topleninput.min="1";
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

            for(var i = 0 ; i < root.nodes.length ; i++){
                root.nodes[i].destroy();
            }
            root.disconnectNodes();
            root.addNode(gable);
            root.addNode(rightTriangle);
            root.addNode(leftTriangle);
            for(var i = 0 ; i < elements.length ; i++){
                elements[i].disconnect();
                root.addNode(elements[i]);
            }
            
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

            for(var i = 0 ; i < root.nodes.length ; i++){
                root.nodes[i].destroy();
            }
            root.disconnectNodes();
            root.addNode(hip);
            for(var i = 0 ; i < elements.length ; i++){
                elements[i].disconnect();
                root.addNode(elements[i]);
            }
        }
        
    }
    lastFloor =-1;
    lastid=-1;
    go = true;
    Calibration();
    
}
function testChangeRoof(){
    var roof=-1;
    var nodes=scene.findNodes();
    var root = scene.findNode(3);
    var layerNumber=getTopLayer()
    for(var i=0;i<nodes.length;i++){
        var node = nodes[i];
        if(node.getType()=="name"){
            if(node.getName()=="roof" ){
                roof=node.nodes[0].nodes[0].nodes[0].nodes[0].nodes[0];
            }
        }
    }
    if(roof != -1){
        var xml='';
        xml+='<layer>'+'\n';
        var nodes=scene.findNodes();
        if(roof.getType() == "roof/hip"){
            xml+=getgableInfo();
        }else if(roof.getType() == "roof/gable"){
            xml+=getHipInfo();
        }
        for(var i=0;i<nodes.length;i++){
            var node = nodes[i];
            if(node.getType()=="flags"){
                var n= node.nodes[0].nodes[0].nodes[0].nodes[0].nodes[0].nodes[0];
                if(n.getType() != "roof/gable" &&
                    n.getType() != "roof/hip" &&
                    n.getType() != "wall/triangle"){
                    xml += getElementXML(n);
                }
            }
        }
        xml+='</layer>'+'\n';
    }
    var parseXml;

    if (window.DOMParser) {
        parseXml = function(xmlStr) {
            return ( new window.DOMParser() ).parseFromString(xmlStr, "text/xml");
        };
    } else if (typeof window.ActiveXObject != "undefined" && new window.ActiveXObject("Microsoft.XMLDOM")) {
        parseXml = function(xmlStr) {
            var xmlDoc = new window.ActiveXObject("Microsoft.XMLDOM");
            xmlDoc.async = "false";
            xmlDoc.loadXML(xmlStr);
            return xmlDoc;
        };
    } else {
        parseXml = function() { return null; }
    }
    
    var xmlDoc = parseXml(xml);
    if (xmlDoc) {
        window.alert(xmlDoc.documentElement.nodeName);
    }
    console.log(xmlDoc);


    return xml;
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



