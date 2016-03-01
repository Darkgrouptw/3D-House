var superRenderList = "";
var parseXml="";
function superXReProduction(xml){
    scene.destroy();
    superRenderList ="		nodes:\n		[";
    parseXml=( new window.DOMParser() ).parseFromString(xml, "text/xml");
    ReadText();

    superRenderList = "	type: \"scene\",\n"+
                    "	canvasId: \"archcanvas\",\n"+
                    "	nodes:\n"+
                    "	[{\n"+
                        "		type:   \"cameras/orbit\",\n"+
                        "		yaw: 0,\n"+
                        "		pitch: -30,\n"+
                        "		zoom: 100,\n"+
                        "		zoomSensitivity: 5.0,\n"+
                        "		showCursor: false,\n"+
                        "		maxPitch: -10,\n"+
                        "		minPitch: -80,\n\n"+
                        superRenderList+
                        "\n }]";
    SceneJS.setConfigs({
        pluginPath:"js/plugins"
    });
    console.log(superRenderList);
    scene = SceneJS.createScene({superRenderList});
    ScenePick();
}
function ReadText(){
    //console.log(parseXml);
    var layers = parseXml.getElementsByTagName('layer');
    for(var i=0;i<layers.length;i++){
        //get layer element
        var elements = layers.item(i).getElementsByTagName('element');
        for(var j=0;j<elements.length;j++){
            if(j==0)
				superRenderList = superRenderList + "{\n";
            else 
				superRenderList = superRenderList + "	{\n";

            //get xml
            var typeNode = elements.item(j).getElementsByTagName('type');
            var textureNode = elements.item(j).getElementsByTagName('texture');
            var propertyNode = elements.item(j).getElementsByTagName('property');
            var transformNode = elements.item(j).getElementsByTagName('transform');
            var decorateNode = elements.item(j).getElementsByTagName('decorate');

            //kasim
            var posInfomation = elements[j].getElementsByTagName('pos');

            var nodesStr =[""];
            var endStr = [""];
            if(transformNode.length != 0)
                MB(nodesStr,transformNode.item(0));
            if(typeNode.length != 0)
                TB(nodesStr,textureNode.item(0),endStr);
            if(typeNode.length != 0){
                TPB(nodesStr,typeNode.item(0),endStr);
                if(propertyNode.length != 0){
                    PB(nodesStr,propertyNode);
                    nodesStr[0] = nodesStr[0]+",\n";
                    PB(nodesStr,transformNode);
                }
            }
            var nameWrapStr = "	type:\"name\",\n						name: \""+textureNode.item(0).textContent+"\",\n\n						nodes:\n						[{"+nodesStr[0]+"\n"+endStr[0]+"}]\n";
            var materailWrapStr = "				type:\"material\",\n					color:{ r:0.8, g:0.8, b:0.8 },\n					alpha:0.2,\n\n					nodes:\n					[{\n					"+nameWrapStr+"}]";
            var nameDoubleWrapStr = "				type:\"name\",\n				name:\""+posInfomation.item(0).textContent+"\",\n\n				nodes:\n				[{\n	"+materailWrapStr+"}]\n";
            var flagsWrapStr = "			type:\"flags\",\n			flags: { transparent:false },\n\n			nodes:\n			[{\n"+nameDoubleWrapStr+"}]\n";
            superRenderList = superRenderList+flagsWrapStr+"},";
        }
    }
    superRenderList = superRenderList.substr(0,superRenderList.length -1)+"]";
}

function MB(str,transform){
    var scale_xml = transform.getElementsByTagName('scale').item(0).textContent;
    var rotate_xml = transform.getElementsByTagName('rotate').item(0).textContent;
    var translate_xml = transform.getElementsByTagName('translate').item(0).textContent;
    
    var scaleParam = scale_xml.split(",");
    var rotateParam = rotate_xml.split(",");
    var translateParam = rotate_xml.split(",");
    
    var translate_m = 
    [
        1,0,0,0,
        0,1,0,0,
        0,0,1,0,
        translateParam[0],translateParam[1],translateParam[2],1
    ];
    
    var deg_X = (rotateParam[0]/180)*Math.PI;
    var deg_Y = (rotateParam[1]/180)*Math.PI;
    var deg_Z = (rotateParam[2]/180)*Math.PI;
    var rotate_m_X = 
    [
        1,0,0,0,
        0,Math.round(Math.cos(deg_X) * 1000000) / 1000000, Math.round(Math.sin(deg_X) * 1000000) / 1000000,0,
        0,Math.round(-Math.sin(deg_X) * 1000000) / 1000000, Math.round(Math.cos(deg_X) * 1000000) / 1000000,0,
        0,0,0,1
    ];
    var rotate_m_Y = 
    [
        Math.round(Math.cos(deg_Y) * 1000000) / 1000000,0,Math.round(-Math.sin(deg_Y) * 1000000) / 1000000,0,
        0,1,0,0,
        Math.round(Math.sin(deg_Y) * 1000000) / 1000000,0,Math.round(Math.cos(deg_Y) * 1000000) / 1000000,0,
        0,0,0,1
    ];
    var rotate_m_Z = 
    [
        Math.round(Math.cos(deg_Z) * 1000000) / 1000000,Math.round(Math.sin(deg_Z) * 1000000) / 1000000,0,0,
        Math.round(-Math.sin(deg_Z) * 1000000) / 1000000,Math.round(Math.cos(deg_Z) * 1000000) / 1000000,0,0,
        0,0,1,0,
        0,0,0,1
    ];
    
    var scale_m = 
    [
        scaleParam[0],0,0,0,
        0,scaleParam[1],0,0,
        0,0,scaleParam[2],0,
        0,0,0,1
    ];
    var ans = MO(MO(MO(MO(rotate_m_X,rotate_m_Y),rotate_m_Z),scale_m),translate_m);
    str[0] = "\n							type: \"matrix\",\n         		            elements:["+ ans[0];
    for(i = 1; i < 16; i++)
        str[0] = str[0]+","+ans[i];
    str[0] = str[0]+"],\n\n";
}
function TB(str,texture,endstr){
    str[0] = str[0]+"							nodes:\n							[{\n";
    str[0] = str[0]+"								type: \"texture\",\n";
    str[0] = str[0]+"								src: \"images/GeometryTexture/"+texture.textContent+"\",\n";
    str[0] = str[0]+"								applyTo: \"color\",\n\n";
    endstr[0] = endstr[0]+"}]\n";
}

function TPB(str, type, endStr){
    str[0] = str[0]+"								nodes:\n								[{\n									type: \""+type.textContent+"\",\n";
    endStr[0] = "								"+endStr[0]+"							}]\n";
}

function PB(str, property){
    var child = property.item(0).childNodes;
    var first = false;
    for(i = 0; i < child.length; i++)
    {
        var item = child.item(i);
        if(item.nodeType == 3)        // 是DOMText，所以要跳過
            continue;
        else
        {
            var strlist = item.textContent.split(",");
			if(strlist.length == 1)
                str[0] = str[0]+"									"+item.nodeName+": "+item.textContent+",\n";
            else if(strlist.length == 2)
                str[0] = str[0]+"									"+item.nodeName+": {a: "+strlist[0]+", b: "+strlist[1]+"},\n";
            else if(strlist.length == 3)
				str[0] = str[0]+"									"+item.nodeName+": {x: "+strlist[0]+", y: "+strlist[1]+", z: "+strlist[2]+"},\n";
                
        }
    }
    str[0] = str[0].substr(0, str[0].length - 2);
}

function CC(i,j){
    return i*4+j;
}

function MO(array1,array2){
    var ans =
    [
        0,0,0,0, 
        0,0,0,0, 
        0,0,0,0,
        0,0,0,0
    ];
    for(var i = 0; i < 4; i++)
        for(var j = 0; j < 4; j++)
            for(gap = 0; gap < 4; gap++)
                ans[CC(i,j)] += array1[i * 4 + gap] * array2[j + gap * 4];
    return ans;
}