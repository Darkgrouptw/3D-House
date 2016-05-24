
SceneJS.Types.addType("wall/single_window", 
{
	construct: function (params) 
	{
		this._layer;
		this._percentX;
        this._percentY;
        this._priority;
		this.direction;
        this._paramana = new ParameterManager(params, function(property)
		{
			var moveTo = function(p, t) 
			{
				var r = [];
                for(var i = 0; i < p.length; i = i + 3)
				{ r[i] = p[i] + t.x; r[i + 1] = p[i + 1] + t.y; r[i + 2] = p [i + 2] + t.z; }
				return r;
			}
			
			var makePositive = function(l, i) 
			{ 
				var nl = [];
				nl.push(l[0]); nl.push(l[1]); nl.push(l[2]);
				nl[i] = Math.abs(nl[i]); 
				return nl; 
			}
			
			var w = property.width;
			var h = property.height;
			var t = property.thickness; 
			var r = property.ratio;
			
			var wds = {};
			wds.c = {x: -w + (r.a * 2 * w), y: -h + (r.b * 2 * h), z: 0};
			wds.h = property.windowH, wds.w = property.windowW;
			
			// Make sure window size always greater than the {a: 1, b: 1}
			if(wds.w < 1 || wds.w == undefined) { wds.w = 1; }
			if(wds.h < 1 || wds.h == undefined) { wds.h = 1; }
			
			var inter = [];
			inter.push(moveTo([-wds.w, wds.h, -t], wds.c));
			inter.push(moveTo([-wds.w, -wds.h, -t], wds.c));
			inter.push(moveTo([wds.w, -wds.h, -t], wds.c));
			inter.push(moveTo([wds.w, wds.h, -t], wds.c));
			
			var exter = [[-w, h, -t], [-w, -h, -t], [w, -h, -t], [w, h, -t]];
			var pset = [];
			
			for(var idxr = 0; idxr < 4; idxr++)
			{
				var tmprb = (idxr + 1) % 4, tmpra = idxr;

				pset = pset.concat(exter[tmprb]).concat(exter[tmpra])
					.concat(inter[tmpra]).concat(inter[tmprb]);

				pset = pset.concat(makePositive(inter[tmprb], 2)).concat(makePositive(inter[tmpra], 2))
					.concat(makePositive(exter[tmpra], 2)).concat(makePositive(exter[tmprb], 2));

				pset = pset.concat(makePositive(exter[tmprb], 2)).concat(makePositive(exter[tmpra], 2))
					.concat(exter[tmpra]).concat(exter[tmprb]);

				pset = pset.concat(inter[tmprb]).concat(inter[tmpra])
					.concat(makePositive(inter[tmpra], 2)).concat(makePositive(inter[tmprb], 2));
            }
			
			return pset;
		});
		
		this._paramana.addAttribute('windowH', params.windowH);
        this._paramana.addAttribute('windowW', params.windowW);
        
        this._paramana.addFunction('texture', function(property)
        {
			// Same with position function
			var w = property.width, h = property.height, r = property.ratio;
			
			var wds = {};
			wds.h = property.windowH; wds.w = property.windowW;
			// Make sure window size always greater than the {a: 1, b: 1}
			if(wds.w < 1 || wds.w == undefined) { wds.w = 1; }
			if(wds.h < 1 || wds.h == undefined) { wds.h = 1; }
			
			wds.h = wds.h / (2 * h); wds.w = wds.w / (2 * w);

			var mapcoord = function(p, t) { var rc = [p[0] + t.a, p[1] + t.b]; return rc; };
			
			var wrUL = mapcoord([-wds.w, wds.h], r);
			var wrDL = mapcoord([-wds.w, -wds.h], r);
			var wrDR = mapcoord([wds.w, -wds.h], r);
			var wrUR = mapcoord([wds.w, wds.h], r);
			
			var uvset = 
			[
				0, 0, 0, 1, wrUL[0], wrUL[1], wrDL[0], wrDL[1],
				wrDL[0], wrDL[1], wrUL[0], wrUL[1], 0, 1, 0, 0,
				1, 0, 1, 1, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 0, 0,
				
				1, 0, 0, 0, wrDL[0], wrDL[1], wrDR[0], wrDR[1],
				wrDR[0], wrDR[1], wrDL[0], wrDL[1], 0, 0, 1, 0,
				1, 0, 1, 1, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 0, 0,
				
				1, 1, 1, 0, wrDR[0], wrDR[1], wrUR[0], wrUR[1],
				wrUR[0], wrUR[1], wrDR[0], wrDR[1], 1, 0, 1, 1,
				1, 0, 1, 1, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 0, 0,
				
				0, 1, 1, 1, wrUR[0], wrUR[1], wrUL[0], wrUL[1],
				wrUL[0], wrUL[1], wrUR[0], wrUR[1], 1, 1, 0, 1,
				1, 0, 1, 1, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 0, 0,
			];
			
			return uvset;
		});
        
		this.addNode(wall_single_window_build.call(this, params)); 
		this.direction=params.direction;
		this._percentY=params.percentY;
        this._percentX=params.percentX;
        this._priority=params.priority;
		this._layer=params.layer;
	},

	updateNode: function() 
	{ 
		this._paramana.updateGeometryNode(this);
		this._paramana.updateTextureCoord(this);
	},

    getLayer: function(){ return this._layer; },
	setLayer: function(l){ this._layer = l; },

	getPriority:function(){return this._priority;},
    setPriority:function(p){this._priority=p;},

    setPercentX:function(x){this._percentX=x;},
    getPercentX:function(){return this._percentX;},

    setPercentY:function(y){this._percentY=y;},
    getPercentY:function(){return this._percentY;},

    getWidth: function() { return this._paramana.get('width'); },
	setWidth: function(w) { this._paramana.set('width', w); this.updateNode(); },
	
	getHeight: function() { return this._paramana.get('height'); },
    setHeight: function(h) { this._paramana.set('height', h); this.updateNode(); },
	
    getThickness: function() { return this._paramana.get('thickness'); },
	setThickness: function(t) { this._paramana.set('thickness', t); this.updateNode(); },

    getRatio: function() { return this._paramana.get('ratio'); },
    setRatio: function(r) { this._paramana.set('ratio', r); this.updateNode(); },
    setRatioA: function(ra) { var pr = this.getRatio(); this.setRatio( { a: ra, b: pr.b } ); },
    setRatioB: function(rb) { var pr = this.getRatio(); this.setRatio( { a: pr.a, b: rb } ); },

    getWindowSize: function() { return { w: this._paramana.get('windowW'), h: this._paramana.get('windowH') };  },
    setWindowW: function(ww) { this._paramana.set('windowW', ww); this.updateNode(); },
    setWindowH: function(wh) { this._paramana.set('windowH', wh); this.updateNode(); },

	getScale: function() { return this._paramana.get('scale'); },
	setScale: function(svec) { this._paramana.set('scale', svec); this._paramana.updateMatirxNode(this); },
	
	getRotate: function() { return this._paramana.get('rotate'); },
	setRotate: function(rvec) { this._paramana.set('rotate', rvec); this._paramana.updateMatirxNode(this); },
	
	getTranslate: function() { return this._paramana.get('translate'); },
	setTranslate: function(tvec) { this._paramana.set('translate', tvec); this._paramana.updateMatirxNode(this); },
	
    setTranslateX: function(x) { var t = this.getTranslate(); this.setTranslate([x, t[1], t[2]]); },
    setTranslateY: function(y) { var t = this.getTranslate(); this.setTranslate([t[0], y, t[2]]); },
    setTranslateZ: function(z) { var t = this.getTranslate(); this.setTranslate([t[0], t[1], z]); },
    getDirection:function(){return this.direction;},
	setDirection:function(d){
		if(d=="horizontal" || d=="vertical"){
			this.direction=d;
			var matrix= this.parent;
			if(d=="horizontal"){
				this.setRotate([0,0,0]);
			}else{
				this.setRotate([0,90,0]);
			}
		}
	},
    isInside:function(params){
        var center=this.getTranslate();
        var range=Math.sqrt(Math.pow(center[0] - params[0],2)+
                            Math.pow(center[1] - params[1],2)+
                            Math.pow(center[2] - params[2],2));
        //if(range < this.getThickness()/2){
        //    return true;
        //}
        if(this.direction=="vertical"){
            //if(this.getPriority()==2){
            //    console.log("meow");
            //    console.log(params);
            //    console.log(center);
            //        console.log(params[0] <= center[0] + this.getThickness()/2);
            //        console.log(params[0] >= center[0] - this.getThickness()/2);
            //        console.log(params[1] <= center[1] + this.getHeight()/2);
            //        console.log(params[1] >= center[1] - this.getHeight()/2);
            //        console.log(params[2] <= center[2] + this.getWidth()/2);
            //        console.log(params[2] >= center[2] - this.getWidth()/2);
            //    }
            if(params[0] <= center[0] + this.getThickness() &&
                params[0] >= center[0] - this.getThickness() &&
                params[1] <= center[1] + this.getHeight() &&
                params[1] >= center[1] - this.getHeight() &&
                params[2] <= center[2] + this.getWidth() &&
                params[2] >= center[2] - this.getWidth()){
                return true
            }
            else{
                return false
            }
        }
        else{
            if(params[0] <= center[0] + this.getWidth() &&
                params[0] >= center[0] - this.getWidth() &&
                params[1] <= center[1] + this.getHeight() &&
                params[1] >= center[1] - this.getHeight() &&
                params[2] <= center[2] + this.getThickness() &&
                params[2] >= center[2] - this.getThickness()){
                return true
            }
            else{
                return false
            }
        }
    },
    callBaseCalibration: function()
	{
		var mnmte = function(n) { return n.nodes[0].nodes[0].nodes[0].nodes[0].nodes[0].nodes[0].nodes[0]; }

		var backWall=-1;
        var rightWall=-1;
        var leftWall=-1;
        var frontWall=-1;
        var downBase=-1;
        var downWall=-1;
        var roof=-1;
        var base=-1;
        var nodes = scene.findNodes();
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
                else if(n.getName()=="roof"      										)roof=mnmte(n);
                else if(n.getName()=="base" && mnmte(n).getLayer()==this.getLayer())base=mnmte(n);
                else if(n.getName()=="base"      && mnmte(n).getLayer()==this.getLayer() - 1)downBase=mnmte(n);
                else if(n.getName()=="backWall"  && mnmte(n).getLayer()==this.getLayer() - 1)downWall=mnmte(n);
            }   
        }
		
		if(base == -1) { console.log("ERROR"); return; }
		if(frontWall != -1 && frontWall.getID() == this.getID()) {}
		else if(backWall != -1 && backWall.getID() == this.getID())
		{
			base.setRealWidth(this.getWidth());
			base.callBaseCalibration(this.getHeight());
		}
		else if(leftWall!= -1 && leftWall.getID() == this.getID())
		{
			if(backWall != -1 && frontWall != -1) {}
			else if(frontWall != -1) {}
			else if(backWall != -1)
			{
				base.setRealHeight(this.getWidth() + backWall.getThickness());
				base.callBaseCalibration(this.getHeight());
			}
			else {}
		}
		else if(rightWall != -1 && rightWall.getID() == this.getID())
		{
			if(backWall != -1 && frontWall != -1) {}
			else if(frontWall != -1) {}
			else if(backWall != -1)
			{
				base.setRealHeight(this.getWidth() + backWall.getThickness());
				base.callBaseCalibration(this.getHeight());
			}
			else {
				
			}
		}
		else{
			base.callBaseCalibration();
		}
	},
	adjustChildren: function()
    {
    	var baseCenter = this.getTranslate();
        var baseCenterX = baseCenter[0];
        var baseCenterY = baseCenter[1];
        var baseCenterZ = baseCenter[2];
    	var size =  this.getWindowSize();
    	var ratio = this.getRatio();
    	var wh = size.h;
    	var ww = size.w;
    	var a = ratio.a;
    	var b = ratio.b;
    	if(ww>this.getWidth()-1){
    		ww = this.getWidth()-1;
    	}
    	if(wh>this.getHeight()-1){
    		wh = this.getHeight() - 1;
    	}
    	if((baseCenterX-this.getWidth())+(a*2*this.getWidth())+ww > baseCenterX + this.getWidth() - 1){
    		a = (baseCenterX + this.getWidth() - 1 - ww) - baseCenterX + this.getWidth();
    		a = a/(2*this.getWidth());
    	}
    	if((baseCenterX - this.getWidth())+(a*2*this.getWidth())-ww < baseCenterX -this.getWidth() + 1){
    		a = (baseCenterX -this.getWidth() + 1 + ww) -baseCenterX + this.getWidth();
    		a = a/(2*this.getWidth());
    	}
    	if((baseCenterZ-this.getHeight())+(b*2*this.getHeight())+wh>baseCenterZ + this.getHeight() - 1){
    		b = (baseCenterZ + this.getHeight() - 1 - wh) - baseCenterZ + this.getHeight();
    		b = b/(2*this.getHeight());
    	}
    	if((baseCenterZ - this.getHeight())+(b*2*this.getHeight()-wh)<baseCenterZ - this.getHeight() + 1){
    		b = (baseCenterZ - this.getHeight() + 1 + wh) -baseCenterZ +this.getHeight();
    		b = b/(2*this.getHeight());
    	}
    	this.setWindowH(wh);
    	this.setWindowW(ww);
    	this.setRatioA(a);
    	this.setRatioB(b);
    }
});

function wall_single_window_build(params) 
{
	var positionSet = this._paramana.createPositions();
	var indiceSet = utility.makeIndices(0, (positionSet.length / 3) - 1);
	var uvSet = this._paramana.createTextures();
	
    var geometry = 
	{
		type: "geometry",
		primitive: "triangles",
		positions: positionSet,
		normals: "auto",
        uv: uvSet,
		indices: indiceSet
	};
	
	return geometry;
}
