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
    if(n.getHeight && housenode2Pos(n).getName() != "interWall"&& housenode2Pos(n).getName() !="frontTriangle"){
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
            heightinput.min="5";
            heightinput.max="50";
            heightinput.step="1";
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
    if(n.getWidth && housenode2Pos(n).getName() != "interWall"&& housenode2Pos(n).getName() !="frontTriangle"){
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
            widthinput.min="14";
            widthinput.max="50";
            widthinput.step="1";
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
            percentXinput.min="10";
            percentXinput.max="90";
            percentXinput.step="1";
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
	if(n.getDirection&& housenode2Pos(n).getName() !="leftWall"&& housenode2Pos(n).getName() !="rightWall"){
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
			roof_extrudeBas_input.max = "20";
			roof_extrudeBas_input.step = "1";
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
			roof_extrudeLen_input.max = "15";
			roof_extrudeLen_input.step = "1";
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
			roof_extrudeHgt_input.max = "0.8";
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