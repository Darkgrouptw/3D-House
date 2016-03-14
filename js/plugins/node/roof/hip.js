
SceneJS.Types.addType("roof/hip", 
{ 
    construct:function (params) 
    {
        this._layer;
        this._paramana = new ParameterManager(params, function(property)
	    {
            var w = property.width;
            var d = property.depth;
            var h = property.height;
            var t = property.thickness;
	        var r = property.ratio;
	        var tl = property.toplen;
	
	        var pA, pB, pset = [], pctD = -d + (2 * d * r.b);
	        
		    if (tl == 0) 
		    { 
			    var pctW = -w + (2 * w * r.a);
			    pA = [pctW, h, pctD]; pB = [pctW, h, pctD];
		    }
		    else 
		    {
			    var rl = (w * 2) - tl;
			    pA = [-w + (rl * r.a), h, pctD]; pB = [w - (rl * (1 - r.a)), h, pctD];
            }

            // Maybe we have very small height
            if(pA[0] > pB[0]) { pA[0] = 0; pB[0] = 0; }	

			var pset = pset.concat(
			[
				pB[0], pB[1], pB[2], w, -h, -d, pA[0], pA[1], pA[2], -w, -h, d,
				pA[0], pA[1] - t, pA[2], w - t, -h, -d + t, pB[0], pB[1] - t, pB[2], -w + t, -h, d - t,
			    pA[0], pA[1], pA[2], w, -h, -d, -w, -h, -d, -w, -h, d, 
                pB[0], pB[1], pB[2], -w, -h, d, w, -h, d, w, -h, -d, 
			    pA[0], pA[1] - t, pA[2], -w + t, -h, d - t, -w + t, -h, -d + t, w - t, -h, -d + t,
			    pB[0], pB[1] - t, pB[2], w - t, -h, -d + t, w - t, -h, d - t, -w + t, -h, d - t,
			    -w + t, -h, d - t, -w + t, -h, -d + t, -w, -h, -d, -w, -h, d,
			    -w + t, -h, -d + t, w - t, -h, -d + t, w, -h, -d, -w, -h, -d,
			    w - t, -h, d - t, w, -h, d, w, -h, -d, w - t, -h, -d + t,
			    -w + t, -h, d - t, -w, -h, d, w, -h, d, w - t, -h, d - t
		    ]); 
	            
	        return pset;
	    });
	   
	    // toplen will affect the position, so it need to add it.
	    this._paramana.addAttribute('toplen', params.toplen);
        this._paramana.addFunction('texture', function(property)
        {
            var w = property.width, d = property.depth, r = property.ratio, tl = property.toplen;
	        var pA, pB, rD = r.b;
	        
		    if (tl == 0) { var rW = r.a; pA = [rW, rD]; pB = [rW, rD]; }
		    else { var rl = (w * 2) - tl; pA = [(rl * r.a) / (w * 2), rD]; pB = [((w * 2) - rl * (1 - r.a)) / (w * 2), rD]; }

            if(pA[0] > pB[0]) { pA[0] = 0.5; pB[0] = 0.5; }

            var uvset = 
            [
                pB[0], pB[1], 1, 1, pA[0], pA[1], 0, 0, 
	            pA[0], pA[1], 1, 1, pB[0], pB[1], 0, 0,
	            
                pA[0], pA[1], 1, 1, 0, 1, 0, 0,
                pB[0], pB[1], 0, 0, 1, 0, 1, 1,	
                
                pA[0], pA[1], 0, 0, 0, 1, 1, 1,
                pB[0], pB[1], 1, 1, 1, 0, 0, 0,

                1, 1, 0, 1, 0, 0, 1, 0,
	            1, 0, 0, 0, 0, 1, 1, 1,
	
	            1, 1, 0, 1, 0, 0, 1, 0,
	            0, 1, 1, 1, 1, 0, 0, 0
            ];

            return uvset;
        });

        this.addNode(roof_hip_build.call(this, params)); 
    },  

    updateNode: function()
    {
        this._paramana.updateGeometryNode(this);
        this._paramana.updateTextureCoord(this);
    },

    getLayer: function() { return this._layer; },
    setLayer: function(l) { return this._layer = l },

    getWidth: function() { return this._paramana.get('width'); },
	setWidth: function(w) { this._paramana.set('width', w); this.updateNode(); },
	
	getHeight: function() { return this._paramana.get('height'); },
	setHeight: function(h) { this._paramana.set('height', h); this.updateNode(); },
	
	getDepth: function() { return this._paramana.get('depth'); },
	setDepth: function(d) { this._paramana.set('depth', d); this.updateNode(); },
	
	getRatio: function() { return this._paramana.get('ratio'); },
	setRatio: function(r) { return this._paramana.set('ratio', r); this.updateNode(); },
	
	getToplen: function() { return this._paramana.get('toplen'); },
	setToplen: function(tl) { this._paramana.set('toplen', tl); this.updateNode(); },
	
	getThickness: function() { return this._paramana.get('thickness'); },
	setThickness: function(t) { this._paramana.set('thickness', t); this.updateNode(); },

	getScale: function() { return this._paramana.get('scale'); },
	setScale: function(svec) { this._paramana.set('scale', svec); this._paramana.updateMatirxNode(this); },
	
	getRotate: function() { return this._paramana.get('rotate'); },
	setRotate: function(rvec) { this._paramana.set('rotate', rvec); this._paramana.updateMatirxNode(this); },
	
	getTranslate: function() { return this._paramana.get('translate'); },
	setTranslate: function(tvec) { this._paramana.set('translate', tvec); this._paramana.updateMatirxNode(this); },
	
	setTranslateX: function(x) { var t = this.getTranslate(); this.setTranslate([x, t[1], t[2]]); },
    setTranslateY: function(y) { var t = this.getTranslate(); this.setTranslate([t[0], y, t[2]]); },
    setTranslateZ: function(z) { var t = this.getTranslate(); this.setTranslate([t[0], t[1], z]); },
    callBaseCalibration: function()
	{

    	var backWall=-1, rightWall=-1, leftWall=-1,frontWall=-1, roof=-1, base=-1;
        var nodes=scene.findNodes();
        
        //                                 material     name   matrix  texture  element
        var mnmte = function(n) { return n.nodes[0].nodes[0].nodes[0].nodes[0].nodes[0]; }
        
        for(var i = 0; i < nodes.length; i++)
        {
            var n = nodes[i];
            if(n.getType() == "name")
            {
                if(n.getName() == "backWall") { backWall = mnmte(n); }
                else if(n.getName() == "frontWall") { frontWall = mnmte(n); }
                else if(n.getName() == "leftWall") { leftWall = mnmte(n); }
                else if(n.getName() == "rightWall") { rightWall = mnmte(n); }
                else if(n.getName() == "roof") { roof = mnmte(n); }
                else if(n.getName() == "base" && mnmte(n).getLayer && mnmte(n).getLayer() == this.getLayer() - 1) { base = mnmte(n); }
            }
        }
        if(base == -1){ console.log("ERROR"); return; }
        if(roof.getID() == this.getID())
        {
        	if(base.setRealWidth)base.setRealWidth(this.getDepth());
            if(base.setRealHeight)base.setRealHeight(this.getWidth());
        	base.setWidth(this.getDepth());
        	base.setHeight(this.getWidth());
        	base.callBaseCalibration();
        }
    }
});


function roof_hip_build(params) 
{
    var positionSet = this._paramana.createPositions();
    var indiceSet = utility.makeIndices(0, (positionSet.length / 3) - 1);
    var uvSet = this._paramana.createTextures();

    var geometry = 
	{
        type: "geometry",
        primitive: "triangles",
        positions: positionSet,
        uv: uvSet,
        normals: "auto",
        indices:  indiceSet
    };
	
	return geometry;
}

