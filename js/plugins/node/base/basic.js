
SceneJS.Types.addType("base/basic", 
{ 
	construct: function(params) 
	{ 
		this.realW;
		this.readH;
		this._layer;
		this._offsetX;
		this._offsetY;
		
		this._leftback_X=0;
		this._leftback_Y=0;
		this._paramana = new ParameterManager(params, function(property)
		{
			var w = property.width *1, h = property.height *1, t = property.thickness; 
			var pset = 
            [
				w, t, h, -w, t, h, -w, -t, h, w, -t, h,
				w, t, h, w, -t, h, w, -t, -h, w, t, -h,
				w, t, h, w, t, -h, -w, t, -h, -w, t, h,
				-w, t, h, -w, t, -h, -w, -t, -h, -w, -t, h,
				-w, -t, -h, w, -t, -h, w, -t, h, -w, -t, h, 
				w, -t, -h, -w, -t, -h, -w, t, -h, w, t, -h
			];
			return pset;
		});
		this._paramana.addAttribute('_leftback_X', params.LeftBackX);
		this._paramana.addAttribute('_leftback_Y', params.LeftBackY);
		this._offsetX = 0;
		this._offsetY = 0;
		this.addNode(base_basic_build.call(this, params)); 
		this._layer=params.layer;
		this.realW = params.width;
		this.readH = params.height;
		if(params.OffsetX)this._offsetX = params.OffsetX;
		if(params.OffsetY)this._offsetY = params.OffsetY;
	},
	
	getLeftBackX:function(){return this._paramana.get("_leftback_X");},
	setLeftBackX:function(x){this._paramana.set("_leftback_X",x);},
	
	getLeftBackY:function(){return this._paramana.get("_leftback_Y");},
	setLeftBackY:function(y){this._paramana.set("_leftback_Y",y);},
	
	getOffsetX:function(){return this._offsetX;},
	setOffsetX:function(x){this._offsetX = x;},

	getOffsetY:function(){return this._offsetY;},
	setOffsetY:function(y){this._offsetY = y;},
	
	getRealWidth:function(){return this.realW;},
	setRealWidth:function(w){this.realW = w * 1;},

	getRealHeight:function(){return this.readH;},
	setRealHeight:function(h){this.readH = h * 1;},

	getLayer:function(){ return this._layer; },
	setLayer:function(l){ this._layer=l; },

	getWidth: function() { return this._paramana.get('width'); },
	setWidth: function(w) { this._paramana.set('width', w); this._paramana.updateGeometryNode(this); },
	
	getHeight: function() { return this._paramana.get('height'); },
	setHeight: function(h) { this._paramana.set('height', h); this._paramana.updateGeometryNode(this); },
	
	getThickness: function() { return this._paramana.get('thickness'); },
	setThickness: function(t) { this._paramana.set('thickness', t); this._paramana.updateGeometryNode(this); },
	
	getScale: function() { return this._paramana.get('scale'); },
	setScale: function(svec) { this._paramana.set('scale', svec); this._paramana.updateMatirxNode(this); },
	
	getRotate: function() { return this._paramana.get('rotate'); },
	setRotate: function(rvec) { this._paramana.set('rotate', rvec); this._paramana.updateMatirxNode(this); },
	
	getTranslate: function() { return this._paramana.get('translate'); },
	setTranslate: function(tvec) { this._paramana.set('translate', tvec); this._paramana.updateMatirxNode(this); },
	setTranslateX: function(x){
		var t=this.getTranslate()
		this.setTranslate([x,t[1],t[2]]);
	},
	setTranslateY: function(y){
		var t=this.getTranslate()
		this.setTranslate([t[0],y,t[2]]);
	},
	setTranslateZ: function(z){
		var t=this.getTranslate()
		this.setTranslate([t[0],t[1],z]);
	},
	callBaseCalibration: function(high)
	{
		
		//try {
		//get all the element
		
		var mnmte = function(n) { return n.nodes[0].nodes[0].nodes[0].nodes[0].nodes[0].nodes[0].nodes[0]; }

		var backWall=-1;
		var rightWall=-1;
		var leftWall=-1;
		var frontWall=-1;
		var downBase=-1;
		var downWall=-1;
		var roof=-1;
		var interWall=[];
		var base=-1;
		var leftback_vertical_wall=-1;
		var leftback_horizontal_wall=-1;
		var nodes=scene.findNodes();
		for(var i=0;i<nodes.length;i++){
			var n = nodes[i];
			if(n.getType()=="name"){
				if(n.getName()=="backWall" && mnmte(n).getLayer()==this.getLayer()){
					//         material  name     matrix  texture  element
					backWall=mnmte(n);
				}
				else if(n.getName()=="frontWall" && mnmte(n).getLayer()==this.getLayer())frontWall=mnmte(n);
				else if(n.getName()=="leftWall"  && mnmte(n).getLayer()==this.getLayer())leftWall=mnmte(n);
				else if(n.getName()=="rightWall" && mnmte(n).getLayer()==this.getLayer())rightWall=mnmte(n);
				else if(n.getName()=="roof"                                             )roof=mnmte(n);
				else if(n.getName()=="interWall" && mnmte(n).getLayer()==this.getLayer())interWall.push(mnmte(n));
				else if(n.getName()=="base"      && mnmte(n).getLayer()==this.getLayer() - 1)downBase=mnmte(n);
				else if(n.getName()=="backWall"  && mnmte(n).getLayer()==this.getLayer() - 1)downWall=mnmte(n);
				else if(n.getName()=="leftback_vertical_wall"	&& mnmte(n).getLayer()==this.getLayer()){leftback_vertical_wall=mnmte(n);}
				else if(n.getName()=="leftback_horizontal_wall"	&& mnmte(n).getLayer()==this.getLayer()){leftback_horizontal_wall=mnmte(n);}
				
			}   
		}

		//set base height by layer.
		if(downWall!=-1 && downBase !=-1){
			this.setTranslateY(downBase.getTranslate()[1] + downBase.getThickness() +downWall.getHeight()*2 +this.getThickness());
			this.setTranslateX(downBase.getTranslate()[0] + downBase.getOffsetX());
			this.setTranslateZ(downBase.getTranslate()[2] + downBase.getOffsetY());
			if(!isPowerEditMode()){
				if(this.getRealWidth() >= downBase.getRealWidth()){
					this.setRealWidth(downBase.getRealWidth());
					this.setWidth(downBase.getRealWidth());
				}
				if(this.getRealHeight() >= downBase.getRealHeight()){
					this.setRealHeight(downBase.getRealHeight());
					this.setHeight(downBase.getRealHeight())
				}
			}
		}
		
		

		//change self to fit down base
		if(downBase !=-1){
			//get the orign w and h
			this.setWidth(this.getRealWidth());
			this.setHeight(this.getRealHeight());
			if(this.getRealWidth() < downBase.getRealWidth()){
				this.setWidth(downBase.getRealWidth());
			}
			if(this.getRealHeight() < downBase.getRealHeight()){
				this.setHeight(downBase.getRealHeight());
			}
		}else{
			if(this.getRealWidth() >= this.getWidth()){
				this.setRealWidth(this.getWidth());
			}
			if(this.getRealHeight() >= this.getHeight()){
				this.setRealHeight(this.getHeight());
			}
		}
		var float
		//set four walls position
		var havefrontWall = false;
		var havebackWall = false;
		var defaulthigh=0;
		var baseCenter=this.getTranslate();
		var baseCenterX=baseCenter[0]+this.getOffsetX();
		var baseCenterY=baseCenter[1];
		var baseCenterZ=baseCenter[2]+this.getOffsetY();
		if(baseCenter[0] + this.getOffsetX() + this.getRealWidth() > baseCenter[0] + this.getWidth()){
			baseCenterX = baseCenter[0] + this.getWidth() - this.getRealWidth();
		}
		if(baseCenter[0] + this.getOffsetX() - this.getRealWidth() < baseCenter[0] - this.getWidth()){
			baseCenterX = baseCenter[0] - this.getWidth() + this.getRealWidth();
		}
		if(baseCenter[2] + this.getOffsetY() + this.getRealHeight() > baseCenter[2] + this.getHeight()){
			baseCenterZ = baseCenter[2] + this.getHeight() - this.getRealHeight();
		}
		if(baseCenter[2] + this.getOffsetY() - this.getRealHeight() < baseCenter[2] - this.getHeight()){
			baseCenterZ = baseCenter[2] - this.getHeight() + this.getRealHeight();
		}
		if(downBase != -1){
			this.setOffsetX(baseCenterX - (downBase.getTranslate()[0] + downBase.getOffsetX()));
			this.setOffsetY(baseCenterZ - (downBase.getTranslate()[2] + downBase.getOffsetY()));
		}else{
			this.setOffsetX(baseCenterX - (0));
			this.setOffsetY(baseCenterZ - (0));
			//this.setOffsetX(0);
			//this.setOffsetY(0);
		}
		
		var left_back_cornor = {x: baseCenterX-this.getRealWidth(),y: baseCenterZ-this.getRealHeight() };
		var left_front_cornor = {x: baseCenterX -this.getRealWidth(),y:baseCenterZ+this.getRealHeight() };
		var right_back_cornor = {x: baseCenterX +this.getRealWidth(),y:baseCenterZ-this.getRealHeight()};
		var right_front_cornor = {x: baseCenterX +this.getRealWidth(),y:baseCenterZ+this.getRealHeight()}
		var left_back_x = this.getLeftBackX();
		var left_back_y = this.getLeftBackY();
		if(left_back_x > this.getThickness() * 2 && left_back_y > this.getThickness() * 2){
			var root = scene.findNode(3);
			if(leftback_vertical_wall ==-1){
				var param = {
				pos: "leftback_vertical_wall",
				layer: this.getLayer(),
				height: backWall.getHeight(),
				width: (left_back_y),
				thick: this.getThickness(),
				dir: "vertical",
				rotateX: 0,
				rotateY: 90,
				rotateZ: 0
				}
				var normal_WallS = getNormalWallS(param);
				leftback_vertical_wall=root.addNode(normal_WallS);
				leftback_vertical_wall = flag2housenode(leftback_vertical_wall);
			}else{
				//console.log(leftback_vertical_wall);
				leftback_vertical_wall.setWidth(left_back_y/2);
			}
			leftback_vertical_wall.setTranslateX(left_back_cornor.x + left_back_x + (this.getThickness()));
			leftback_vertical_wall.setTranslateY(backWall.getTranslate()[1]);
			leftback_vertical_wall.setTranslateZ(left_back_cornor.y+(left_back_y/2));
			//console.log(leftback_vertical_wall.getTranslate())
			if(leftback_horizontal_wall == -1){
				var param = {
				pos: "leftback_horizontal_wall",
				layer: this.getLayer(),
				height: backWall.getHeight(),
				width: ((left_back_x+this.getThickness()*2)/2),
				thick: this.getThickness(),
				dir: "horizontal",
				rotateX: 0,
				rotateY: 0,
				rotateZ: 0
				}
				var normal_WallS = getNormalWallS(param);
				leftback_horizontal_wall=root.addNode(normal_WallS);
				leftback_horizontal_wall = flag2housenode(leftback_horizontal_wall);
			}else{
				//console.log(leftback_horizontal_wall);
				leftback_horizontal_wall.setWidth((left_back_x+this.getThickness()*2)/2);
			}
			leftback_horizontal_wall.setTranslateX(left_back_cornor.x + (left_back_x/2)+(this.getThickness()));
			leftback_horizontal_wall.setTranslateY(backWall.getTranslate()[1]);
			leftback_horizontal_wall.setTranslateZ(left_back_cornor.y +(left_back_y + (this.getThickness())
																	   ));
			//console.log(leftback_horizontal_wall.getTranslate());
			//console.log(leftback_horizontal_wall.getWidth());
			//console.log(leftback_horizontal_wall.getHeight());
			//console.log(leftback_horizontal_wall.getThickness());
		}else{
			if(leftback_vertical_wall){
				
			}
			if(leftback_horizontal_wall){
				
			}
			left_back_x = 0;
			left_back_y = 0;
		}
		
		
		//console.log("x:"+left_back_cornor.x+" y:"+left_back_cornor.y);
		var BackLeftWall
		if(frontWall!=-1){
			havefrontWall = true;
			frontWall.setWidth(this.getRealWidth());
			if(high)frontWall.setHeight(high*1);
			frontWall.setTranslateX(baseCenterX);
			frontWall.setTranslateY(baseCenterY+this.getThickness()+frontWall.getHeight());
			frontWall.setTranslateZ(baseCenterZ+this.getRealHeight()-frontWall.getThickness());
			if(frontWall.getHeight() > defaulthigh)defaulthigh=frontWall.getHeight();
			if(frontWall.adjustChildren)frontWall.adjustChildren();
		}
		if(backWall!=-1){
			havebackWall = true;
			
			if(leftback_horizontal_wall != -1){
				var left_edge = left_back_cornor.x + left_back_x + this.getThickness()*2;
				backWall.setWidth((right_back_cornor.x - left_edge)/2);
				if(high)backWall.setHeight(high*1);
				backWall.setTranslateX((right_back_cornor.x + left_edge)/2);
				backWall.setTranslateY(baseCenterY+this.getThickness()+backWall.getHeight());
				backWall.setTranslateZ(baseCenterZ-this.getRealHeight()+backWall.getThickness());
				if(backWall.getHeight() > defaulthigh)defaulthigh=backWall.getHeight();
				if(backWall.adjustChildren)backWall.adjustChildren();
			}else{
				backWall.setWidth(this.getRealWidth());
				if(high)backWall.setHeight(high*1);
				backWall.setTranslateX(baseCenterX);
				backWall.setTranslateY(baseCenterY+this.getThickness()+backWall.getHeight());
				backWall.setTranslateZ(baseCenterZ-this.getRealHeight()+backWall.getThickness());
				if(backWall.getHeight() > defaulthigh)defaulthigh=backWall.getHeight();
				if(backWall.adjustChildren)backWall.adjustChildren();
			}
			
		}
		if(leftWall!=-1){
			if(havebackWall && havefrontWall){
			}
			else if(havefrontWall){
			}else if(havebackWall){
				if(leftback_horizontal_wall != -1){
					var eage = (left_back_cornor.y+left_back_y+this.getThickness()*2)
					leftWall.setWidth((left_front_cornor.y-eage)/2);
					if(high)leftWall.setHeight(high*1);
					leftWall.setTranslateX(baseCenterX-this.getRealWidth()+leftWall.getThickness());
					leftWall.setTranslateY(baseCenterY+this.getThickness()+leftWall.getHeight());
					leftWall.setTranslateZ((eage+left_front_cornor.y)/2);
					if(leftWall.getHeight() > defaulthigh)defaulthigh=leftWall.getHeight();
					if(leftWall.adjustChildren)leftWall.adjustChildren();
				}else{
					leftWall.setWidth(this.getRealHeight()-backWall.getThickness());
					if(high)leftWall.setHeight(high*1);
					leftWall.setTranslateX(baseCenterX-this.getRealWidth()+leftWall.getThickness());
					leftWall.setTranslateY(baseCenterY+this.getThickness()+leftWall.getHeight());
					leftWall.setTranslateZ(baseCenterZ+backWall.getThickness());
					if(leftWall.getHeight() > defaulthigh)defaulthigh=leftWall.getHeight();
					if(leftWall.adjustChildren)leftWall.adjustChildren();
				}
				
			}else{
			}
		}
		if(rightWall!=-1){
			if(havebackWall && havefrontWall){
			}
			else if(havefrontWall){
			}else if(havebackWall){
				rightWall.setWidth(this.getRealHeight()-backWall.getThickness());
				if(high)rightWall.setHeight(high*1);
				rightWall.setTranslateX(baseCenterX+this.getRealWidth()-rightWall.getThickness());
				rightWall.setTranslateY(baseCenterY+this.getThickness()+rightWall.getHeight());
				rightWall.setTranslateZ(baseCenterZ+backWall.getThickness());
				if(rightWall.getHeight() > defaulthigh)defaulthigh=rightWall.getHeight();
				if(rightWall.adjustChildren)rightWall.adjustChildren();
			}else{
			}
			
		}
		//set roof
		if(roof!=-1 && this.getLayer() == getTopLayer()){
			if(roof.setWidth)roof.setWidth(this.getRealHeight());
			if(roof.setDepth)roof.setDepth(this.getRealWidth());
			if(roof.setTranslateX)roof.setTranslateX(baseCenterX);
			if(high && roof.setTranslateY)roof.setTranslateY(baseCenterY+this.getThickness()+high*2+roof.getHeight());
			else if(roof.setTranslateY)roof.setTranslateY(baseCenterY+this.getThickness()+defaulthigh*2+roof.getHeight());
			if(roof.setTranslateZ)roof.setTranslateZ(baseCenterZ);
			if(roof.adjustChildren)roof.adjustChildren();
			if(roof.getType() == "roof/hip"){
				if(roof.getToplen() > roof.getDepth() * 2){
					roof.setToplen(roof.getDepth() * 2);
				}
			}
			if(roof.getType() == "roof/mansard"){
				if(roof.getWidth() < roof.getDepth() * 0.4){
					//roof.setWidth(roof.getDepth()*0.4);
				}
				if(roof.getDepth() < roof.getWidth() * 0.4){
					//roof.setDepth(roof.getWidth() * 0.4);
				}
			}
			if(roof.setLayer)roof.setLayer(this.getLayer()+1);
		}
		//set interwall in new way
		if(interWall.length!=0){
			//sort the inter wall in priority order
			interWall.sort(function(a,b){return a.getPriority() - b.getPriority()});
			//init strate the wall
			for(var i = 0; i<interWall.length;i++){
				
			}
			//first find good position that not being OQPi
		}
		//set interWall
		if(interWall.length!=0){
			interWall.sort(function(a,b){return a.getPriority() - b.getPriority()});
			//for every interwall
			for(var i=0;i<interWall.length;i++){
				//setmin and max edge
				var zmin,zmax,xmin,xmax;
				//set init position
				interWall[i].setTranslateX(baseCenterX+(-this.getRealWidth()+(this.getRealWidth()*2)*interWall[i].getPercentX()/100));
				interWall[i].setTranslateZ(baseCenterZ+(-this.getRealHeight()+(this.getRealHeight()*2)*interWall[i].getPercentY()/100));
				var center=interWall[i].getTranslate();
				var zminrange=9999;
				var zmaxrange=9999;
				var xminrange=9999;
				var xmaxrange=9999;
				//set check time if time is more than maxmun tr => kill it!
				var time=0;
				var check =true
				//check the wall is fit
				while(check){
					check=false;
					//setin back
					if(backWall!=-1){
						var range=Math.sqrt(Math.pow(center[0] - backWall.getTranslate()[0],2)+
							Math.pow(center[1] - backWall.getTranslate()[1],2)+
							Math.pow(center[2] - backWall.getTranslate()[2],2));
						if(range < interWall[i].getThickness() + backWall.getThickness() ||
							backWall.isInside(center)){
							interWall[i].setTranslateZ(backWall.getTranslate()[2]+backWall.getThickness()+interWall[i].getThickness());
							center=interWall[i].getTranslate();
							check=true;
						}
					}
					//setin front
					if(frontWall!=-1){
						var range=Math.sqrt(Math.pow(center[0] - frontWall.getTranslate()[0],2)+
							Math.pow(center[1] - frontWall.getTranslate()[1],2)+
							Math.pow(center[2] - frontWall.getTranslate()[2],2));
						if(range < interWall[i].getThickness() + frontWall.getThickness() ||
							frontWall.isInside(center)){
							interWall[i].setTranslateZ(frontWall.getTranslate()[2]-frontWall.getThickness()-interWall[i].getThickness());
							center=interWall[i].getTranslate();
							check=true;
						}
					}
					//set in left
					if(leftWall!=-1){
						var range=Math.sqrt(Math.pow(center[0] - leftWall.getTranslate()[0],2)+
							Math.pow(center[1] - leftWall.getTranslate()[1],2)+
							Math.pow(center[2] - leftWall.getTranslate()[2],2));
						if(range < interWall[i].getThickness() + leftWall.getThickness() ||
							leftWall.isInside(center)){
							interWall[i].setTranslateX(leftWall.getTranslate()[0]+leftWall.getThickness()+interWall[i].getThickness());
							center=interWall[i].getTranslate();
							check=true;
						}
					}
					//set in front
					if(rightWall!=-1){
						var range=Math.sqrt(Math.pow(center[0] - rightWall.getTranslate()[0],2)+
							Math.pow(center[1] - rightWall.getTranslate()[1],2)+
							Math.pow(center[2] - rightWall.getTranslate()[2],2));
						if(range < interWall[i].getThickness() + rightWall.getThickness() ||
							rightWall.isInside(center)){
							interWall[i].setTranslateX(rightWall.getTranslate()[0]-rightWall.getThickness()-interWall[i].getThickness());
							center=interWall[i].getTranslate();
							check=true;
						}
					}
					if(leftback_vertical_wall!=-1){
					}
					if(leftback_horizontal_wall!=-1){
					}
					for (var j = 0; j < i; j++){
						var range=Math.sqrt(Math.pow(center[0] - interWall[j].getTranslate()[0],2)+
							Math.pow(center[1] - interWall[j].getTranslate()[1],2)+
							Math.pow(center[2] - interWall[j].getTranslate()[2],2));
						if(range < interWall[i].getThickness() + interWall[j].getThickness() ||
							interWall[j].isInside(center)){
							check=true;
							if(interWall[j].getDirection()=="horizontal"){
								if(interWall[j].getTranslate()[2] < center[2]){
									interWall[i].setTranslateZ(interWall[j].getTranslate()[2]+interWall[j].getThickness()+interWall[i].getThickness());
								}else{
									interWall[i].setTranslateZ(interWall[j].getTranslate()[2]-interWall[j].getThickness()-interWall[i].getThickness());
								}
								
							}else{
								if(interWall[j].getTranslate()[0] < center[0]){
									interWall[i].setTranslateX(interWall[j].getTranslate()[0]+interWall[j].getThickness()+interWall[i].getThickness());
								}else{
									interWall[i].setTranslateX(interWall[j].getTranslate()[0]-interWall[j].getThickness()-interWall[i].getThickness());
								}
								
							}
							center=interWall[i].getTranslate();

							break;
						}
					}
					if(center[0]+interWall[i].getThickness() > baseCenterX + this.getRealWidth()){
						interWall[i].setTranslateX(baseCenterX+this.getRealWidth() - interWall[i].getThickness());
						center=interWall[i].getTranslate();
						check=true;
					}
					if(center[0]-interWall[i].getThickness() < baseCenterX - this.getRealWidth()){
						interWall[i].setTranslateX(baseCenterX-this.getRealWidth() + interWall[i].getThickness());
						center=interWall[i].getTranslate();
						check=true;
					}
					if(center[2]+interWall[i].getThickness() > baseCenterZ + this.getRealHeight()){
						interWall[i].setTranslateZ(baseCenterZ+this.getRealHeight() - interWall[i].getThickness());
						center=interWall[i].getTranslate();
						check=true;
					}
					if(center[2]-interWall[i].getThickness() < baseCenterZ - this.getRealHeight()){
						interWall[i].setTranslateZ(baseCenterZ+this.getRealHeight() + interWall[i].getThickness());
						center=interWall[i].getTranslate();
						check=true;
					}
					time++;
					if(time>20){
						break;
					}
				}

				if(time>20){
					//no wall can be fit in
					interWall[i].getParent().getParent().getParent().getParent().getParent().getParent().getParent().getParent().destroy();
				}
				//find z x min,max
				for(var j=0;j<i;j++){
					
					//if direction is no different no need for caucluct z x min max
					if(interWall[i].getDirection() != interWall[j].getDirection()){

						//if no close no need for z x min max
						var point = [interWall[i].getTranslate()[0],
										interWall[i].getTranslate()[1],
										interWall[i].getTranslate()[2]];
						if(interWall[i].getDirection() == "vertical"){
							point[2] = interWall[j].getTranslate()[2];
						}else{
							point[0] = interWall[j].getTranslate()[0];
						}
						if(interWall[j].isInside(point) ){
							if(center[2]-interWall[j].getTranslate()[2]<zminrange && center[2]-interWall[j].getTranslate()[2] >0){
								zminrange=center[2]-interWall[j].getTranslate()[2]; 
								zmin=interWall[j].getTranslate()[2] + interWall[j].getThickness();
							}
							if(interWall[j].getTranslate()[2] - center[2] < zmaxrange && interWall[j].getTranslate()[2] - center[2] >0){
								zmaxrange=interWall[j].getTranslate()[2] - center[2];
								zmax=interWall[j].getTranslate()[2] - interWall[j].getThickness();
							}
							if(center[0] - interWall[j].getTranslate()[0] < xminrange && center[0] - interWall[j].getTranslate()[0] >0){
								xminrange=center[0] - interWall[j].getTranslate()[0];
								xmin = interWall[j].getTranslate()[0] + interWall[j].getThickness();
							}
							if(interWall[j].getTranslate()[0] - center[0] < xmaxrange && interWall[j].getTranslate()[0] - center[0] >0){
								xmaxrange = interWall[j].getTranslate()[0] - center[0];
								xmax = interWall[j].getTranslate()[0] - interWall[j].getThickness();
							}
						}
						
					}
					
				}
				if(zminrange>=8888){
					if(backWall!=-1){
						zmin=backWall.getTranslate()[2] + backWall.getThickness();
					}else{
						zmin = baseCenterZ - this.getRealHeight();
					}
				}
				if(zmaxrange>=8888){
					if(frontWall!=-1){
						zmax=frontWall.getTranslate()[2] - frontWall.getThickness(); 
					}else{
						zmax = baseCenterZ + this.getRealHeight();
					}
				}
				if(xminrange>=8888){
					if(leftWall!=-1){
						xmin=leftWall.getTranslate()[0] + leftWall.getThickness();
					}else{
						xmin = baseCenterX -this.getRealWidth();
					}
				}
				if(xmaxrange>=8888){
					if(rightWall!=-1){
						xmax = rightWall.getTranslate()[0] -rightWall.getThickness();
					}else{
						xmax = baseCenterX + this.getRealWidth();
					}
				}
				if(interWall[i].direction=="vertical"){
					if(xmax-xmin<interWall[i].getThickness()){
						console.log("bad Things happen with too close wall");
					}
					interWall[i].setTranslateZ((zmax + zmin)/2);
					interWall[i].setWidth((zmax - zmin)/2);
					//if(high)rightWall.setHeight(high*1);
				}
				else{
					if(zmax - zmin < interWall[i].getThickness()){
						console.log("bad Things happen with too close wall");
					}
					interWall[i].setTranslateX((xmax + xmin)/2);
					interWall[i].setWidth((xmax - xmin)/2);
				}
				interWall[i].setHeight(rightWall.getHeight());
				interWall[i].setTranslateY(rightWall.getTranslate()[1]);
				if(high)interWall[i].setHeight(high*1);
				interWall[i].setPercentX((100*(interWall[i].getTranslate()[0] - baseCenterX + this.getRealWidth()))/(this.getRealWidth()*2));
				interWall[i].setPercentY((100*(interWall[i].getTranslate()[2] - baseCenterZ + this.getRealHeight()))/(this.getRealHeight()*2));
				if(interWall[i] && interWall[i].adjustChildren){
					interWall[i].adjustChildren()
				};
			};
			
		}

		//call 
		for(var i=0;i<nodes.length;i++){
			var n = nodes[i];
			if(n.getType()=="name"){
				if(n.getName()=="base" && mnmte(n).getLayer() == this.getLayer()+1)mnmte(n).callBaseCalibration();
			}
		}
		//dirty = false;
		//}
		//catch(err) {
		//    //console.log(err.message);
		//    dirty = true;
		//}
		 
	}
});

function base_basic_build(params) 
{
    var positionSet = this._paramana.createPositions();
	var indiceSet = utility.makeIndices(0, (positionSet.length / 3 ) - 1);
	var uvSet = 
    [
		1, 1, 0, 1, 0, 0, 1, 0,
		0, 1, 0, 0, 1, 0, 1, 1,
		1, 0, 1, 1, 0, 1, 0, 0,
		1, 1, 0, 1, 0, 0, 1, 0,
		0, 0, 1, 0, 1, 1, 0, 1,
		0, 0, 1, 0, 1, 1, 0, 1
	];
	
	var geometry = 
	{
		type: 'geometry',
		primitive: 'triangles',
		positions: positionSet,
		uv: uvSet,
		normals: "auto",
		indices: indiceSet
	};
	
	return geometry;
}
