
SceneJS.Types.addType("base/basic", 
{ 
    construct: function(params) 
	{ 
        this.realW;
        this.readH;
        this._layer;
		this.paramana = new ParameterManager(params, function(property)
		{
			var w = property.width, h = property.height, t = property.thickness; 
			var pset = new Float32Array(
			[
				w, t, h, -w, t, h, -w, -t, h, w, -t, h,
			    w, t, h, w, -t, h, w, -t, -h, w, t, -h,
			    w, t, h, w, t, -h, -w, t, -h, -w, t, h,
			    -w, t, h, -w, t, -h, -w, -t, -h, -w, -t, h,
			    -w, -t, -h, w, -t, -h, w, -t, h, -w, -t, h, 
			    w, -t, -h, -w, -t, -h, -w, t, -h, w, t, -h
			]);
			return pset;
		});
		this.addNode(build.call(this, params)); 
        this._layer=params.layer;
        this.realW = params.width;
        this.readH = params.height;
	},
	
    getRealWidth:function(){return this.realW;},
    setRealWidth:function(w){this.realW = w;},

    getRealHeight:function(){return this.readH;},
    setRealHeight:function(h){this.readH = h;},

    getLayer:function(){ return this._layer; },
    setLayer:function(l){ this._layer=l; },

	getWidth: function() { return this.paramana.get('width'); },
	setWidth: function(w) { this.paramana.set('width', w); this.paramana.updateGeometryNode(this); },
	
	getHeight: function() { return this.paramana.get('height'); },
	setHeight: function(h) { this.paramana.set('height', h); this.paramana.updateGeometryNode(this); },
	
	getThickness: function() { return this.paramana.get('thickness'); },
	setThickness: function(t) { this.paramana.set('thickness', t); this.paramana.updateGeometryNode(this); },
	
	getScale: function() { return this.paramana.get('scale'); },
	setScale: function(svec) { this.paramana.set('scale', svec); this.paramana.updateMatirxNode(this); },
	
	getRotate: function() { return this.paramana.get('rotate'); },
	setRotate: function(rvec) { this.paramana.set('rotate', rvec); this.paramana.updateMatirxNode(this); },
	
	getTranslate: function() { return this.paramana.get('translate'); },
	setTranslate: function(tvec) { this.paramana.set('translate', tvec); this.paramana.updateMatirxNode(this); },
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
        //get the orign w and h
        this.setWidth(this.getRealWidth());
        this.setHeight(this.getRealHeight());

        //get all the element
        var mnmte = function(n) { return n.nodes[0].nodes[0].nodes[0].nodes[0].nodes[0]; }

        var backWall=-1;
        var rightWall=-1;
        var leftWall=-1;
        var frontWall=-1;
        var downBase=-1;
        var downWall=-1;
        var roof=-1;
        var interWall=[];
        var base=-1;
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
            }   
        }

        //set base height by layer
        if(downWall!=-1 && downBase !=-1){
            this.setTranslateY(downBase.getTranslate()[1] + downBase.getThickness() +downWall.getHeight()*2 +this.getThickness());
            if(this.getWidth() >= downBase.getWidth()){
                this.setWidth(downBase.getWidth());
            }
            if(this.getHeight() >= downBase.getHeight()){
                this.setHeight(downBase.getHeight());
            }
            
            
        }
        //set four walls position
        var havefrontWall = false;
        var havebackWall = false;
        var defaulthigh=0;
        var baseCenter=this.getTranslate();
        var baseCenterX=baseCenter[0];
        var baseCenterY=baseCenter[1];
        var baseCenterZ=baseCenter[2];
        if(frontWall!=-1){
            havefrontWall = true;
            frontWall.setWidth(this.getWidth());
            if(high)frontWall.setHeight(high*1);
            frontWall.setTranslateX(baseCenterX);
            frontWall.setTranslateY(baseCenterY+this.getThickness()+frontWall.getHeight());
            frontWall.setTranslateZ(baseCenterZ+this.getHeight()-frontWall.getThickness());
            if(frontWall.getHeight() > defaulthigh)defaulthigh=frontWall.getHeight();
        }
        if(backWall!=-1){
            havebackWall = true;
            backWall.setWidth(this.getWidth());
            if(high)backWall.setHeight(high*1);
            backWall.setTranslateX(baseCenterX);
            backWall.setTranslateY(baseCenterY+this.getThickness()+backWall.getHeight());
            backWall.setTranslateZ(baseCenterZ-this.getHeight()+backWall.getThickness());
            if(backWall.getHeight() > defaulthigh)defaulthigh=backWall.getHeight();
        }
        if(leftWall!=-1){
            if(havebackWall && havefrontWall){
            }
            else if(havefrontWall){
            }else if(havebackWall){
                leftWall.setWidth(this.getHeight()-backWall.getThickness());
                if(high)leftWall.setHeight(high*1);
                leftWall.setTranslateX(baseCenterX-this.getWidth()+leftWall.getThickness());
                leftWall.setTranslateY(baseCenterY+this.getThickness()+leftWall.getHeight());
                leftWall.setTranslateZ(baseCenterZ+backWall.getThickness());
                if(leftWall.getHeight() > defaulthigh)defaulthigh=leftWall.getHeight();
            }else{
            }
        }
        if(rightWall!=-1){
            if(havebackWall && havefrontWall){
            }
            else if(havefrontWall){
            }else if(havebackWall){
                rightWall.setWidth(this.getHeight()-backWall.getThickness());
                if(high)rightWall.setHeight(high*1);
                rightWall.setTranslateX(baseCenterX+this.getWidth()-rightWall.getThickness());
                rightWall.setTranslateY(baseCenterY+this.getThickness()+rightWall.getHeight());
                rightWall.setTranslateZ(baseCenterZ+backWall.getThickness());
                if(rightWall.getHeight() > defaulthigh)defaulthigh=rightWall.getHeight();
            }else{
            }
        }
        //set roof
        if(roof!=-1 && this.getLayer() == getTopLayer()){
            if(roof.setWidth)roof.setWidth(this.getHeight());
            if(roof.setDepth)roof.setDepth(this.getWidth());
            if(roof.setTranslateX)roof.setTranslateX(baseCenterX);
            if(high && roof.setTranslateY)roof.setTranslateY(baseCenterY+this.getThickness()+high*2+roof.getHeight());
            else if(roof.setTranslateY)roof.setTranslateY(baseCenterY+this.getThickness()+defaulthigh*2+roof.getHeight());
            if(roof.setTranslateZ)roof.setTranslateZ(baseCenterZ);
            if(roof.adjustChildren)roof.adjustChildren();
            if(roof.setLayer)roof.setLayer(this.getLayer());
        }
        //set interwall
        if(interWall.length!=0){
            interWall.sort(function(a,b){return a.getPriority() - b.getPriority()});
            for(var i=0;i<interWall.length;i++){
                var zmin,zmax,xmin,xmax;
                //console.log(interWall[i].getPercentX());
                interWall[i].setTranslateX(baseCenterX-this.getWidth()+(this.getWidth()*2)*interWall[i].getPercentX()/100);
                interWall[i].setTranslateZ(baseCenterZ-this.getHeight()+(this.getHeight()*2)*interWall[i].getPercentY()/100);
                var center=interWall[i].getTranslate();
                var zminrange=9999;
                var zmaxrange=9999;
                var xminrange=9999;
                var xmaxrange=9999;
                var check =true
                var time=0;
                while(check){
                    check=false;
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
                    time++;
                    if(time>2){
                        break;
                    }
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
                        zmin = baseCenterZ - this.getHeight();
                    }
                }
                if(zmaxrange>=8888){
                    if(frontWall!=-1){
                        zmax=frontWall.getTranslate()[2] - frontWall.getThickness(); 
                    }else{
                        zmax = baseCenterZ + this.getHeight();
                    }
                }
                if(xminrange>=8888){
                    if(leftWall!=-1){
                        xmin=leftWall.getTranslate()[0] + leftWall.getThickness();
                    }else{
                        xmin = baseCenterX -this.getWidth();
                    }
                }
                if(xmaxrange>=8888){
                    if(rightWall!=-1){
                        xmax = rightWall.getTranslate()[0] -rightWall.getThickness();
                    }else{
                        xmax = baseCenterX + this.getWidth();
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
                interWall[i].setPercentX((100*(interWall[i].getTranslate()[0] - baseCenterX + this.getWidth()))/(this.getWidth()*2));
                interWall[i].setPercentY((100*(interWall[i].getTranslate()[2] - baseCenterZ + this.getHeight()))/(this.getHeight()*2));
            }
        }

        //save the w and h to realw and realh
        this.setRealWidth(this.getWidth());
        this.setRealHeight(this.getHeight());
        
        //call 
        for(var i=0;i<nodes.length;i++){
            var n = nodes[i];
            if(n.getType()=="name"){
                if(n.getName()=="base" && mnmte(n).getLayer() == this.getLayer()+1)mnmte(n).callBaseCalibration();
            }
        }
        
        
        //change self to fit down base
        if(downBase !=-1){
            if(this.getWidth() < downBase.getWidth()){
                this.setWidth(downBase.getWidth());
            }
            if(this.getHeight() < downBase.getHeight()){
                this.setHeight(downBase.getHeight());
            }
        }
    }
});

function build(params) 
{	
	var indiceSet = utility.makeIndices(0, 23);
	var uvSet = new Float32Array(
	[
		1, 1, 0, 1, 0, 0, 1, 0,
		0, 1, 0, 0, 1, 0, 1, 1,
		1, 0, 1, 1, 0, 1, 0, 0,
		1, 1, 0, 1, 0, 0, 1, 0,
		0, 0, 1, 0, 1, 1, 0, 1,
		0, 0, 1, 0, 1, 1, 0, 1
	]);
	
	var geometry = 
	{
		type: 'geometry',
		primitive: 'triangles',
		positions: this.paramana.createPositions(),
		uv: uvSet,
		normals: "auto",
		indices: indiceSet
	};
	
	return geometry;
}
