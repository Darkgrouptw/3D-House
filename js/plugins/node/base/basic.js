
SceneJS.Types.addType("base/basic", 
{ 
    construct: function(params) 
	{ 
        this._layer;
		this.paramana = new ParameterManager(params, function(property)
		{
			var w = property.width / 2, h = property.height / 2, t = property.thickness / 2; 
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
	},
	
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
                else if(n.getName()=="roof"      && mnmte(n).getLayer()==this.getLayer())roof=mnmte(n);
                else if(n.getName()=="interWall" && mnmte(n).getLayer()==this.getLayer())interWall.push(mnmte(n));
                else if(n.getName()=="base"      && mnmte(n).getLayer()==this.getLayer() - 1)downBase=mnmte(n);
                else if(n.getName()=="backWall"  && mnmte(n).getLayer()==this.getLayer() - 1)downWall=mnmte(n);
            }   
        }
        if(downWall!=-1 && downBase !=-1){
            this.setTranslateY(downBase.getTranslate()[1] + downBase.getThickness()/2 +downWall.getHeight() +this.getThickness()/2);
            if(this.getWidth() <= downBase.getWidth()){
                this.setWidth(downBase.getWidth());
            }
            if(this.getHeight() <= downBase.getHeight()){
                this.setHeight(downBase.getHeight());
            }
            
            
        }

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
            frontWall.setTranslateY(baseCenterY+this.getThickness()/2+frontWall.getHeight()/2);
            frontWall.setTranslateZ(baseCenterZ+this.getHeight()/2-frontWall.getThickness()/2);
            if(frontWall.getHeight() > defaulthigh)defaulthigh=frontWall.getHeight();
        }
        if(backWall!=-1){
            havebackWall = true;
            backWall.setWidth(this.getWidth());
            if(high)backWall.setHeight(high*1);
            backWall.setTranslateX(baseCenterX);
            backWall.setTranslateY(baseCenterY+this.getThickness()/2+backWall.getHeight()/2);
            backWall.setTranslateZ(baseCenterZ-this.getHeight()/2+backWall.getThickness()/2);
            if(backWall.getHeight() > defaulthigh)defaulthigh=backWall.getHeight();
        }
        if(leftWall!=-1){
            if(havebackWall && havefrontWall){
            }
            else if(havefrontWall){
            }else if(havebackWall){
                leftWall.setWidth(this.getHeight()-backWall.getThickness());
                if(high)leftWall.setHeight(high*1);
                leftWall.setTranslateX(baseCenterX-this.getWidth()/2+leftWall.getThickness()/2);
                leftWall.setTranslateY(baseCenterY+this.getThickness()/2+leftWall.getHeight()/2);
                leftWall.setTranslateZ(baseCenterZ+backWall.getThickness()/2);
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
                rightWall.setTranslateX(baseCenterX+this.getWidth()/2-rightWall.getThickness()/2);
                rightWall.setTranslateY(baseCenterY+this.getThickness()/2+rightWall.getHeight()/2);
                rightWall.setTranslateZ(baseCenterZ+backWall.getThickness()/2);
                if(rightWall.getHeight() > defaulthigh)defaulthigh=rightWall.getHeight();
            }else{
            }
        }
        if(roof!=-1){
            roof.setWidth(this.getHeight());
            roof.setDeep(this.getWidth());
            roof.setTranslateX(baseCenterX);
            if(high)roof.setTranslateY(baseCenterY+this.getThickness()/2+high+roof.getHeight()/2);
            else roof.setTranslateY(baseCenterY+this.getThickness()/2+defaulthigh+roof.getHeight()/2);
            roof.setTranslateZ(baseCenterZ);
            roof.adjustChildren();
        }
        if(interWall.length!=0){
            interWall.sort(function(a,b){return a.getPriority() - b.getPriority()});
            for(var i=0;i<interWall.length;i++){
                var zmin,zmax,xmin,xmax;
                interWall[i].setTranslateX(baseCenterX-this.getWidth()/2+(this.getWidth())*interWall[i].getPercentX()/100);
                interWall[i].setTranslateZ(baseCenterZ-this.getHeight()/2+(this.getHeight())*interWall[i].getPercentY()/100);
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
                        if(range < interWall[i].getThickness()/2 + interWall[j].getThickness()/2 ||
                            interWall[j].isInside(center)){
                            check=true;
                            if(interWall[j].getDirection()=="horizontal"){
                                if(interWall[j].getTranslate()[2] < center[2]){
                                    interWall[i].setTranslateZ(interWall[j].getTranslate()[2]+interWall[j].getThickness()/2+interWall[i].getThickness()/2);
                                }else{
                                    interWall[i].setTranslateZ(interWall[j].getTranslate()[2]-interWall[j].getThickness()/2-interWall[i].getThickness()/2);
                                }
                                
                            }else{
                                if(interWall[j].getTranslate()[0] < center[0]){
                                    interWall[i].setTranslateX(interWall[j].getTranslate()[0]+interWall[j].getThickness()/2+interWall[i].getThickness()/2);
                                }else{
                                    interWall[i].setTranslateX(interWall[j].getTranslate()[0]-interWall[j].getThickness()/2-interWall[i].getThickness()/2);
                                }
                                
                            }
                            center=interWall[i].getTranslate();

                            break;
                        }
                    }
                    time++;
                    if(time>500){
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
                                zmin=interWall[j].getTranslate()[2] + interWall[j].getThickness()/2;
                            }
                            if(interWall[j].getTranslate()[2] - center[2] < zmaxrange && interWall[j].getTranslate()[2] - center[2] >0){
                                zmaxrange=interWall[j].getTranslate()[2] - center[2];
                                zmax=interWall[j].getTranslate()[2] - interWall[j].getThickness()/2;
                            }
                            if(center[0] - interWall[j].getTranslate()[0] < xminrange && center[0] - interWall[j].getTranslate()[0] >0){
                                xminrange=center[0] - interWall[j].getTranslate()[0];
                                xmin = interWall[j].getTranslate()[0] + interWall[j].getThickness()/2;
                            }
                            if(interWall[j].getTranslate()[0] - center[0] < xmaxrange && interWall[j].getTranslate()[0] - center[0] >0){
                                xmaxrange = interWall[j].getTranslate()[0] - center[0];
                                xmax = interWall[j].getTranslate()[0] - interWall[j].getThickness()/2;
                            }
                        }
                        
                    }
                    
                }
                if(zminrange>=8888){
                    if(backWall!=-1){
                        zmin=backWall.getTranslate()[2] + backWall.getThickness()/2;
                    }else{
                        zmin = baseCenterZ - this.getHeight()/2;
                    }
                }
                if(zmaxrange>=8888){
                    if(frontWall!=-1){
                        zmax=frontWall.getTranslate()[2] - frontWall.getThickness()/2; 
                    }else{
                        zmax = baseCenterZ + this.getHeight()/2;
                    }
                }
                if(xminrange>=8888){
                    if(leftWall!=-1){
                        xmin=leftWall.getTranslate()[0] + leftWall.getThickness()/2;
                    }else{
                        xmin = baseCenterX -this.getWidth()/2;
                    }
                }
                if(xmaxrange>=8888){
                    if(rightWall!=-1){
                        xmax = rightWall.getTranslate()[0] -rightWall.getThickness()/2;
                    }else{
                        xmax = baseCenterX + this.getWidth()/2;
                    }
                }
                if(interWall[i].direction=="vertical"){
                    if(xmax-xmin<interWall[i].getThickness()/2){
                        console.log("bad Things happen with too close wall");
                    }
                    interWall[i].setTranslateZ((zmax + zmin)/2);
                    interWall[i].setWidth((zmax - zmin));
                    //if(high)rightWall.setHeight(high*1);
                }
                else{
                    if(zmax - zmin < interWall[i].getThickness()/2){
                        console.log("bad Things happen with too close wall");
                    }
                    interWall[i].setTranslateX((xmax + xmin)/2);
                    interWall[i].setWidth((xmax - xmin));
                }
                interWall[i].setHeight(rightWall.getHeight());
                interWall[i].setTranslateY(rightWall.getTranslate()[1]);
                if(high)interWall[i].setHeight(high*1);
                interWall[i].setPercentX((100*(interWall[i].getTranslate()[0] - baseCenterX + this.getWidth()/2))/(this.getWidth()));
                interWall[i].setPercentY((100*(interWall[i].getTranslate()[2] - baseCenterZ + this.getHeight()/2))/(this.getHeight()));
            }
        }
        for(var i=0;i<nodes.length;i++){
            var n = nodes[i];
            if(n.getType()=="name"){
                if(n.getName()=="base" && mnmte(n).getLayer() == this.getLayer()+1)mnmte(n).callBaseCalibration();
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
