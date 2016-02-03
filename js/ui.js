
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
}
function AddEventListenerList(list, event, functor)
{
    for(var i = 0; i < list.length; i++) { list[i].addEventListener(event, functor, false); }
}

var lastid=-1;
var uiPanel;
function ScenePick(){
    uiPanel=document.getElementById('codewrapper');
    scene.on("pick",
            function (hit) {
                var material;
                if(lastid>0){
                    material=scene.findNode(lastid);
                    material.setColor({ r:1, g:1, b:1});
                }
                var id=hit.nodeId;
                console.log(id);
                //這是我知道name被material包住，正常藥用id來找但現在id都還沒定
                material=scene.findNode(id).parent;
                material.setColor({r:0.7,g:0.7,b:0.3});
                id=material.id;
                lastid=id;
                uiPanel.style.display='inline-block';
                //讓UI跟隨點擊位置，因為很煩人所以先影藏起來
                //uiPanel.style.left = (hit.canvasPos[0]+50) + "px";
                //uiPanel.style.top = (hit.canvasPos[1]+50) + "px";
                attachInput(hit.nodeId);
            });
    scene.on("nopick",
            function (hit) {
                uiPanel.style.display='none';
                if(lastid>0){
                    material=scene.findNode(lastid);
                    material.setColor({ r:0.8, g:0.8, b:0.8});
                }
                console.log('Nothing picked!');
            });
    var canvas = scene.getCanvas();
    canvas.addEventListener('mousedown',
            function (event) {
                
                scene.pick(event.clientX, event.clientY, { regionPick: true });
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
                box[i].setSrc("images/GeometryTexture/"+src+"");
            }
        }
    }
    hasTexture=!hasTexture;
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
        heightinput.max="30";
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
            n.setHeight(heightinput.value);
            heightpropertyValue.textContent=heightinput.value;
            n.callBaseCalibration();
        }
    });
    heightinput.addEventListener('mouseup',function(event){
        heightismove=false;
    });

    //width
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
        widthinput.max="30";
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
            n.setWidth(widthinput.value);
            widthpropertyValue.textContent=widthinput.value;
            n.callBaseCalibration();
        }
    });
    widthinput.addEventListener('mouseup',function(event){
        widthismove=false;
    });

    //deep
    var deepismove=false;
    var div=document.createElement("div");
    inputarea.appendChild(div);
    //text
    var deeppropertyName=document.createElement("lable");
        deeppropertyName.textContent="depth";
        div.appendChild(deeppropertyName);
    //input
    var deepinput=document.createElement("input");
        deepinput.type="range";
        deepinput.min="1";
        deepinput.max="30";
        deepinput.step="0.1";
        deepinput.value=n.getDepth();
        div.appendChild(deepinput);

    var deeppropertyValue=document.createElement("lable");
        deeppropertyValue.textContent=deepinput.value;
        div.appendChild(deeppropertyValue);

    deepinput.addEventListener('mousedown',function(event){
        deepismove=true;
    });
    deepinput.addEventListener('mousemove',function(event){
        if (deepismove) {
            n.setDepth(deepinput.value);
            deeppropertyValue.textContent=deepinput.value;
            n.callBaseCalibration();
        }
    });
    deepinput.addEventListener('mouseup',function(event){
        deepismove=false;
    });
}
