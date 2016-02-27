
SceneJS.Types.addType("roof/mansard", 
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
	
	        var hmt = h - t; 
	
	        var dNwr = 2 * -w * r.a, dPwr = 2 * w * r.a; 
	        var dNdr = 2 * -d * r.b, dPdr = 2 * d * r.b;        
	
	        var pset = new Float32Array(
	        [
		        -w - dNwr, h, d - dPdr, -w, -h, d, -w, -h, -d, -w - dNwr, h, -d - dNdr,
		        w - dPwr, h, -d - dNdr, -w - dNwr, h, -d - dNdr, -w, -h, -d, w, -h, -d,
		        w - dPwr, h, d - dPdr, w - dPwr, h, -d - dNdr, w, -h, -d, w, -h, d, 
		        w - dPwr, h, d - dPdr, w, -h, d, -w, -h, d, -w - dNwr, h, d - dPdr, 
		        -w - dNwr, h, -d - dNdr, w - dPwr, h, -d - dNdr, w - dPwr, h, d - dPdr, -w - dNwr, h, d - dPdr, 
                -w - dNwr + t, hmt, d - dPdr - t, -w - dNwr + t, hmt, -d - dNdr + t, -w + t, -h, -d + t, -w + t, -h, d - t,
		        w - dPwr - t, hmt, -d - dNdr + t, w - t, -h, -d + t, -w + t, -h, -d + t, -w - dNwr + t, hmt, -d - dNdr + t, 
		        w - dPwr - t, hmt, d - dPdr - t, w - t, -h, d - t, w - t, -h, -d + t, w - dPwr - t, hmt, -d - dNdr + t, 
		        w - dPwr - t, hmt, d - dPdr - t, -w - dNwr + t, hmt, d - dPdr - t, -w + t, -h, d - t, w - t, -h, d - t, 
		        w - dPwr - t, hmt, d - dPdr - t, w - dPwr - t, hmt, -d - dNdr + t, -w - dNwr + t, hmt, -d - dNdr + t, -w - dNwr + t, hmt, d - dPdr - t,
		        -w + t, -h, d - t, -w + t, -h, -d + t, -w, -h, -d, -w, -h, d,
		        w - t, -h, -d + t, w, -h, -d, -w, -h, -d, -w + t, -h, -d + t,
		        w - t, -h, d - t, w, -h, d, w, -h, -d, w - t, -h, -d + t, 	
		        w - t, -h, d - t, -w + t, -h, d - t, -w, -h, d, w, -h, d, 
	        ]);
	        
	        return pset;
	    });
        this.addNode(build.call(this, params)); 
    },
    
    getLayer:function(){ return this._layer; },
    setLayer:function(l){ this._layer = l; },

    getWidth: function() { return this._paramana.get('width'); },
	setWidth: function(w) { this._paramana.set('width', w); this._paramana.updateGeometryNode(this); },
	
	getHeight: function() { return this._paramana.get('height'); },
	setHeight: function(h) { this._paramana.set('height', h); this._paramana.updateGeometryNode(this); },
	
	getDepth: function() { return this._paramana.get('depth'); },
	setDepth: function(d) { this._paramana.set('depth', d); this._paramana.updateGeometryNode(this); },

    // Warning: limitation is 0.5
	getRatio: function() { return this._paramana.get('ratio'); },
	setRatio: function(r) { return this._paramana.set('ratio', r); this._paramana.updateGeometryNode(this); },
	
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
        	base.callBaseCalibration();
        }
    }
});

function build(params) 
{
    var positionSet = this._paramana.createPositions();
    var indiceSet = utility.makeIndices(0, (positionSet.length / 3) - 1);
	var uvSet = new Float32Array([
		0, 1, 0, 0, 1, 0, 1, 1,			// Front West
		1, 1, 1, 0, 0, 0, 0, 1,			// Front Sourth
		0, 1, 1, 1, 1, 0, 0, 0,			// Front East
		0, 1, 0, 0, 1, 0, 1, 1,			// Front North
		1, 1, 1, 0, 0, 0, 0, 1,			// Front Center
		
		0, 1, 0, 0, 1, 0, 1, 1,			// Back West
		1, 1, 0, 1, 0, 0, 1, 1,			// Back Sourth
		1, 0, 0, 0, 0, 1, 1, 1,			// Back East
		1, 1, 0, 1, 0, 0, 1, 0,			// Back North
		0, 1, 1, 1, 1, 0, 0, 0,			// Back Center
		
		0, 1, 0, 0, 1, 0, 1, 1,			// Side West
		1, 1, 0, 1, 0, 0, 1, 1,			// Side Sourth
		1, 0, 0, 0, 0, 1, 1, 1,			// Side East
		1, 1, 0, 1, 0, 0, 1, 0,			// Side North
	]);

    var geometry = 
	{
        type: "geometry",
        primitive: "triangles",
        positions: positionSet,
		uv: uvSet,
		normals: "auto",
        indices: indiceSet
    };
	
	return geometry;
}
