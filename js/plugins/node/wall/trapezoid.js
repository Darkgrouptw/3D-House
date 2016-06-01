
SceneJS.Types.addType("wall/trapezoid", 
{ 
	construct: function(params) 
	{ 
		this._percentX;
		this._percentY;
		this._priority;
		this._layer;
		this.direction;
		this._paramana = new ParameterManager(params, function(property)
		{
            var ratio_check = function(r)
            {
                var repeatf = function(q) { if(q > 1) { q = 1; } if (q < 0) { q = 0; } return q; };
                r.a = repeatf(r.a);
                r.b = repeatf(r.b);

                return r;
            }

			// Temporarlly do not make the half value.
			var w = property.width, h = property.height, t = property.thickness, r = ratio_check(property.ratio);

			var pset =
            [
				w * r.a, h, t, -w * r.a, h, t, -w * r.b, -h, t, w * r.b, -h, t,
                
                w * r.a, h, t, w * r.b, -h, t, w * r.b, -h, -t, w * r.a, h, -t,
                w * r.a, h, t, w * r.a, h, -t, -w * r.a, h, -t, -w * r.a, h, t,
                -w * r.a, h, t, -w * r.a, h, -t, -w * r.b, -h, -t, -w * r.b, -h, t,
                -w * r.b, -h, -t, w * r.b, -h, -t, w * r.b, -h, t, -w * r.b, -h, t,
                
                w * r.b, -h, -t, -w * r.b, -h, -t, -w * r.a, h, -t, w * r.a, h, -t
			];
			return pset;
		});

        this._paramana.addFunction('texture', function(property)
        {
            var r = property.ratio; 
            var repeatf = function(q) { if(q > 1) { q = 1; } if (q < 0) { q = 0; } return q; };
            r.a = repeatf(r.a) / 2;
            r.b = repeatf(r.b) / 2;


            var uvs = 
            [
                1 - r.a, 1, r.a, 1, r.b, 0, 1 - r.b, 0,
                
                0, 1, 0, 0, 1, 0, 1, 1,
                1, 0, 1, 1, 0, 1, 0, 0,
                1, 1, 0, 1, 0, 0, 1, 0,
                0, 0, 1, 0, 1, 1, 0, 1,
                
                r.b, 0, 1 - r.b, 0, 1 - r.a, 1, r.a, 1
            ];

            return uvs;

        });

		this.addNode(wall_trapezoid_build.call(this, params)); 
		this.direction = params.direction,
		this._percentY = params.percentY;
		this._percentX = params.percentX;
		this._priority = params.priority;
		this._layer=params.layer;
	},
	
	getLayer: function() { return this._layer; },
	setLayer: function(l) { this._layer = l; },

	getPriority: function() { return this._priority; },
	setPriority: function(p) { this._priority = p; },

	getDirection: function() { return this.direction; },
	setDirection: function(d) 
    {
        if(d == "horizontal" || d == "vertical")
        {
			this.direction = d;
			var matrix = this.parent;
			if(d == "horizontal")
            {
				this.setRotate([0, 0, 0]);
			}
            else
            {
				this.setRotate([0, 90, 0]);
			}
		}
	},

	setPercentX: function(x) { this._percentX = x; },
	getPercentX: function() { return this._percentX; },

	setPercentY: function(y) { this._percentY = y; },
	getPercentY: function() { return this._percentY; },

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
	
    setTranslateX: function(x)
    {
        var t = this.getTranslate();
        this.setTranslate([x, t[1], t[2]]);
    },
    
    setTranslateY: function(y)
    {
        var t = this.getTranslate()
        this.setTranslate([t[0], y, t[2]]);
    },

    setTranslateZ: function(z)
    {
        var t = this.getTranslate()
        this.setTranslate([t[0], t[1], z]);
    },

	isInside: function(params)
    {
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

		var backWall = -1;
        var rightWall = -1;
        var leftWall = -1;
        var frontWall = -1;
        var downBase = -1;
        var downWall = -1;
        var roof = -1;
        var base = -1;
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
	}
});

function wall_trapezoid_build(params) 
{
    var positionSet = this._paramana.createPositions();
	var indiceSet = utility.makeIndices(0, (positionSet.length / 3) - 1);
	var uvSet = this._paramana.createTextures();	
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
