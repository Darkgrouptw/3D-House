
SceneJS.Types.addType("roof/gable", 
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
	
	        var be = (t * 2) / Math.sqrt(3) ;
	        var wr = (w * r.a + -w * r.b) / 2;
	
	        var pset = 
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
	        ]; 
	        
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
        	translateV.push(baseCenterX - this.getDepth() + leftTriangle.getThickness());
        	translateV.push(baseCenterY);
        	translateV.push(baseCenterZ);
        	
        	leftTriangle.setTranslate(translateV);

            leftTriangle.setLayer(this.getLayer());
        }
        if(rightTriangle != -1)
        {
        	rightTriangle.setHeight(this.getHeight());
        	rightTriangle.setWidth(this.getWidth());
            
            var translateV = [];
        	translateV.push(baseCenterX + this.getDepth() - rightTriangle.getThickness());
        	translateV.push(baseCenterY);
        	translateV.push(baseCenterZ);
        	
        	rightTriangle.setTranslate(translateV);

            rightTriangle.setLayer(this.getLayer());
        }
    },
    KillChildren: function(){


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
            leftTriangle.getParent().getParent().getParent().getParent().getParent().getParent().destroy();
        }
        if(rightTriangle != -1)
        {
            rightTriangle.getParent().getParent().getParent().getParent().getParent().getParent().destroy();
        }
    }
 });

function build(params) 
{
    var positionSet = this._paramana.createPositions();
    var indiceSet = utility.makeIndices(0, (positionSet.length / 3) - 1);
    var uvSet = 
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
    ];

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
