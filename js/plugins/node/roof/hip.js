
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
			    var rl = (d * 2) - tl;
			    pA = [-w + (rl * r.a), h, pctD]; pB = [w - (rl * (1 - r.a)), h, pctD];
            }

            // Maybe we have very small height
            if(pA[0] > pB[0])
            {
                 pA[0] = 0; pB[0] = 0;
            }	

			pset = pset.concat(
			[
				pB[0], pB[1], pB[2], -w, -h, d, pA[0], pA[1], pA[2], w, -h, -d,
				pA[0], pA[1] - t, pA[2], -w + t, -h, d - t, pB[0], pB[1] - t, pB[2], w - t, -h, -d + t,
			    pA[0], pA[1], pA[2], -w, -h, d, -w, -h, -d, w, -h, -d, pB[0], pB[1], pB[2], w, -h, -d, w, -h, d, -w, -h, d,
			    pA[0], pA[1] - t, pA[2], w - t, -h, -d + t, -w + t, -h, -d + t, -w + t, -h, d - t,
			    pB[0], pB[1] - t, pB[2], -w + t, -h, d - t, w - t, -h, d - t, w - t, -h, -d + t,
			    -w + t, -h, d - t, -w + t, -h, -d + t, -w, -h, -d, -w, -h, d,
			    -w + t, -h, -d + t, w - t, -h, -d + t, w, -h, -d, -w, -h, -d,
			    w - t, -h, d - t, w, -h, d, w, -h, -d, w - t, -h, -d + t,
			    -w + t, -h, d - t, -w, -h, d, w, -h, d, w - t, -h, d - t
		    ]); 
	            
	        return pset;
	    });
	    
	    // toplen will affect the position, so it need to add it.
	    this._paramana.addAttribute('toplen', params.toplen);
        
        this.addNode(build.call(this, params)); 
    },  

    getLayer: function() { return this._layer; },
    setLayer: function(l) { return this._layer = l },

    getWidth: function() { return this._paramana.get('width'); },
	setWidth: function(w) { this._paramana.set('width', w); this._paramana.updateGeometryNode(this); },
	
	getHeight: function() { return this._paramana.get('height'); },
	setHeight: function(h) { this._paramana.set('height', h); this._paramana.updateGeometryNode(this); },
	
	getDepth: function() { return this._paramana.get('depth'); },
	setDepth: function(d) { this._paramana.set('depth', d); this._paramana.updateGeometryNode(this); },
	
	getRatio: function() { return this._paramana.get('ratio'); },
	setRatio: function(r) { return this._paramana.set('ratio', r); this._paramana.updateGeometryNode(this); },
	
	getToplen: function() { return this._paramana.get('toplen'); },
	setToplen: function(tl) { this._paramana.set('toplen', tl); this._paramana.updateGeometryNode(this); },
	
	getThickness: function() { return this._paramana.get('thickness'); },
	setThickness: function(t) { this._paramana.set('thickness', t); this._paramana.updateGeometryNode(this); },

	getScale: function() { return this._paramana.get('scale'); },
	setScale: function(svec) { this._paramana.set('scale', svec); this._paramana.updateMatirxNode(this); },
	
	getRotate: function() { return this._paramana.get('rotate'); },
	setRotate: function(rvec) { this._paramana.set('rotate', rvec); this._paramana.updateMatirxNode(this); },
	
	getTranslate: function() { return this._paramana.get('translate'); },
	setTranslate: function(tvec) { this._paramana.set('translate', tvec); this._paramana.updateMatirxNode(this); },
	
	setTranslateX: function(x) { var t = this.getTranslate(); this.setTranslate([x, t[1], t[2]]); },
    setTranslateY: function(y) { var t = this.getTranslate(); this.setTranslate([t[0], y, t[2]]); },
    setTranslateZ: function(z) { var t = this.getTranslate(); this.setTranslate([t[0], t[1], z]); },
});


function build(params) 
{
    var positionSet = this._paramana.createPositions();
    var indiceSet = utility.makeIndices(0, (positionSet.length / 3) - 1);
   
    // Copy from roof/gable
    var uvSet = new Float32Array(
    [
	    0, 1, 0, 0, 1, 0, 1, 1, 
	    1, 1, 1, 0, 0, 0, 0, 1,
	    0, 1, 1, 1, 1, 0, 0, 0,

	    0, 1, 0, 0, 1, 0, 1, 1,	
	    1, 1, 1, 0, 0, 0, 0, 1,
	    0, 1, 0, 0, 1, 0, 1, 1,

	    1, 1, 0, 1, 0, 0, 1, 1,
	    1, 0, 0, 0, 0, 1, 1, 1,
	
	    1, 1, 0, 1, 0, 0, 1, 0,
	    0, 1, 1, 1, 1, 0, 0, 0
    ]);

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

