
SceneJS.Types.addType("roof/gable", 
{ 
    construct:function (params) 
    {
        this.paramana = new ParameterManager(params, function(property)
	    {
            var w = property.width;
	        var	d = property.depth;
            var h = property.height;
            var t = property.thickness;
	        var r = property.ratio;
	
	        var be = (t * 2) / Math.sqrt(3) ;
	        var wr = (w * r.a + -w * r.b) / 2;
	
	        var pset = new Float32Array(
	        [
		        wr, h + be, -d, -w - be, -h, -d, -w - be, -h, d, wr, h + be, d,
		        wr, h + be, -d, -w - be, -h, -d, -w, -h, -d, wr, h, -d,
		        -w - be, -h, -d, -w - be, -h, d, -w, -h, d, -w, -h, -d,
		        wr, h + be, d, -w - be, -h, d, -w, -h, d, wr, h, d,
		
		        wr, h + be, -d, w + be, -h, -d,	 w + be, -h, d, wr, h + be, d,
		        wr, h + be, -d, w + be, -h, -d,	w, -h, -d, wr, h, -d,
		        w + be, -h, -d, w + be, -h, d, w, -h, d, w, -h, -d,
		        wr, h + be, d, w + be, -h, d, w, -h, d, wr, h, d,
		
		        wr, h, -d, wr, h, d, -w, -h, d, -w, -h, -d,
		        wr, h, -d, wr, h, d, w, -h, d, w, -h, -d
	        ]); 
	        
	        return pset;
	    });
        this.addNode(build.call(this, params)); 
    },
    
    getWidth: function() { return this.paramana.get('width'); },
	setWidth: function(w) { this.paramana.set('width', w); this.paramana.updateGeometryNode(this); },
	
	getHeight: function() { return this.paramana.get('height'); },
	setHeight: function(h) { this.paramana.set('height', h); this.paramana.updateGeometryNode(this); },
	
	getDepth: function() { return this.paramana.get('depth'); },
	setDepth: function(d) { this.paramana.set('depth', d); this.paramana.updateGeometryNode(this); },
	
	getRatio: function() { return this.paramana.get('ratio'); },
	setRatio: function(r) { return this.paramana.set('ratio', r); this.paramana.updateGeometryNode(this); },
	
	getThickness: function() { return this.paramana.get('thickness'); },
	setThickness: function(t) { this.paramana.set('thickness', t); this.paramana.updateGeometryNode(this); },

	getScale: function() { return this.paramana.get('scale'); },
	setScale: function(svec) { this.paramana.set('scale', svec); this.paramana.updateMatirxNode(this); },
	
	getRotate: function() { return this.paramana.get('rotate'); },
	setRotate: function(rvec) { this.paramana.set('rotate', rvec); this.paramana.updateMatirxNode(this); },
	
	getTranslate: function() { return this.paramana.get('translate'); },
	setTranslate: function(tvec) { this.paramana.set('translate', tvec); this.paramana.updateMatirxNode(this); },
	
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
                else if(n.getName() == "base") { base = mnmte(n); }
            }
        }
        if(base == -1){ console.log("ERROR"); return; }
        if(roof.getID() == this.getID())
        {
        	base.setWidth(this.getDepth());
        	base.setHeight(this.getWidth());
        	base.callBaseCalibration();
        }
    },
    
    adjustChildren: function()
    {

    	var baseCenter = this.getTranslate();
        var baseCenterX = baseCenter[0];
        var baseCenterY = baseCenter[1];
        var baseCenterZ = baseCenter[2];

    	var leftTriangle = -1, rightTriangle = -1, roof = -1, base = -1;
        var nodes = scene.findNodes();
        
        //                                 material     name   matrix  texture  element
        var mnmte = function(n) { return n.nodes[0].nodes[0].nodes[0].nodes[0].nodes[0]; }
        
        for(var i = 0; i < nodes.length; i++)
        {
            var n = nodes[i];
            if(n.getType() == "name")
            {
                if(n.getName() =="roof") { roof = mnmte(n); }
                else if(n.getName() == "leftTriangle") { leftTriangle = mnmte(n); }
                else if(n.getName() == "rightTriangle") { rightTriangle = mnmte(n); }
                else if(n.getName() == "base") { base = mnmte(n); }
            }
        }
        
        if(roof == -1) { console.log("ERROR"); return; }
        if(leftTriangle != -1)
        {
        	leftTriangle.setHeight(this.getHeight());
        	leftTriangle.setWidth(this.getWidth());
            
            var translateV = [];
        	translateV.push(baseCenterZ - this.getDepth() + leftTriangle.getThickness());
        	translateV.push(baseCenterY);
        	translateV.push(baseCenterZ);
        	
        	leftTriangle.setTranslate(translateV);
        }
        if(rightTriangle != -1)
        {
        	rightTriangle.setHeight(this.getHeight());
        	rightTriangle.setWidth(this.getWidth());
            
            var translateV = [];
        	translateV.push(baseCenterZ + this.getDepth() - rightTriangle.getThickness());
        	translateV.push(baseCenterY);
        	translateV.push(baseCenterZ);
        	
        	rightTriangle.setTranslate(translateV);
        }

    }
 });

function build(params) 
{
    var indiceSet = utility.makeIndices(0, 39);
    var normalSet = new Float32Array(
    [
        0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1,
        1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0,
        0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0,
        -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0,
        0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0,
        0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1,
        0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1,
        1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0,
        0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0,
        -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0
    ]);
    var uvSet = new Float32Array(
    [
	    0, 1, 0, 0, 1, 0, 1, 1,			// Back 
	    1, 1, 1, 0, 0, 0, 0, 1,			// Back Right
	    0, 1, 1, 1, 1, 0, 0, 0,			// Back Buttom
	    0, 1, 0, 0, 1, 0, 1, 1,			// Back Left
	
	    1, 1, 1, 0, 0, 0, 0, 1,			// Front
	    0, 1, 0, 0, 1, 0, 1, 1,			// Front Right
	    1, 1, 0, 1, 0, 0, 1, 1,			// Front Buttom
	    1, 0, 0, 0, 0, 1, 1, 1,			// Front Left
	
	    1, 1, 0, 1, 0, 0, 1, 0,			// Back Inside
	    0, 1, 1, 1, 1, 0, 0, 0			// Front Inside
    ]);

    var geometry = 
	{
        type: "geometry",
        primitive: "triangles",
        positions: this.paramana.createPositions(),
		uv: uvSet,
		normals: "auto",
        indices: indiceSet
    };
	
	return geometry;
}
