
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

var lastid=-1;
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
            deepismove=true;
        });
        percentXinput.addEventListener('mousemove',function(event){
            if (deepismove) {
                n.setPercentX(Number(percentXinput.value));
                percentXpropertyValue.textContent=percentXinput.value;
                n.callBaseCalibration();
            }
        });
        percentXinput.addEventListener('mouseup',function(event){
            deepismove=false;
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
            deepismove=true;
        });
        percentYinput.addEventListener('mousemove',function(event){
            if (deepismove) {
                n.setPercentY(percentYinput.value);
                percentYpropertyValue.textContent=percentYinput.value;
                n.callBaseCalibration();
            }
        });
        percentYinput.addEventListener('mouseup',function(event){
            deepismove=false;
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

    //deep
    if(n.getDeep){
        var deepismove=false;
        var div=document.createElement("div");
        inputarea.appendChild(div);
        //text
        var deeppropertyName=document.createElement("lable");
            deeppropertyName.textContent="deep";
            div.appendChild(deeppropertyName);
        //input
        var deepinput=document.createElement("input");
            deepinput.type="range";
            deepinput.min="1";
            deepinput.max="50";
            deepinput.step="0.1";
            deepinput.value=n.getDeep();
            div.appendChild(deepinput);
    
        var deeppropertyValue=document.createElement("lable");
            deeppropertyValue.textContent=deepinput.value;
            div.appendChild(deeppropertyValue);
    
        deepinput.addEventListener('mousedown',function(event){
            deepismove=true;
        });
        deepinput.addEventListener('mousemove',function(event){
            if (deepismove) {
                n.setDeep(deepinput.value);
                deeppropertyValue.textContent=deepinput.value;
                n.callBaseCalibration();
            }
        });
        deepinput.addEventListener('mouseup',function(event){
            deepismove=false;
        });
    }
    

}


function timeFuction(){
    setInterval(function(){
        if(true){
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

function saveXML(){
    var xml='';
    xml+='<layer>'+'\n';
    var nodes=scene.findNodes();
    for(var i=0;i<nodes.length;i++){
        var node = nodes[i];
        if(node.getType()=="flags"){
            var n= node.nodes[0].nodes[0].nodes[0].nodes[0].nodes[0].nodes[0];
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
                    if(n.getDirection)xml+='\t\t\t'+'<direction>'+'\"'+n.getDirection()+'\"'+'</direction>'+'\n';

                xml+='\t\t'+'</property>'+'\n';
            xml+='\t'+'</element>'+'\n';
        }
    }
    xml+='</layer>'+'\n';
    console.log(xml);
    download(xml, "3Dhouse.3Dhouse", 'text/plain');
}