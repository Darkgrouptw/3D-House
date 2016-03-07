
SceneJS.Types.addType("wall/triangle", 
{ 
	construct: function (params) 
	{ 
		this._layer;
		this._paramana = new ParameterManager(params, function(property)
		{
			var w = property.width, h = property.height, t = property.thickness, r = property.ratio;
			var topw = (w * r.a + -w * r.b) / 2;
			var pset = 
            [
				-w, -h, -t, w, -h, -t, topw, h, -t,
				-w, -h, t, w, -h, t, topw, h, t,
				w, -h, -t, topw, h, -t, topw, h, t, w, -h, t,
				-w, -h, -t, topw, h, -t, topw, h, t, -w, -h, t,
				-w, -h, -t, w, -h, -t, w, -h, t, -w, -h, t
			];
			
			return pset;
		});
		this._layer = params.layer;
		this.addNode(build.call(this, params)); 
	},
	
	getLayer: function() { return this._layer; },
	setLayer: function(l) { this._layer = l;} ,

	getWidth: function() { return this._paramana.get('width'); },
	setWidth: function(w) { this._paramana.set('width', w); this._paramana.updateGeometryNode(this); },
	
	getHeight: function() { return this._paramana.get('height'); },
	setHeight: function(h) { this._paramana.set('height', h); this._paramana.updateGeometryNode(this); },
	
	getThickness: function() { return this._paramana.get('thickness'); },
	setThickness: function(t) { this._paramana.set('thickness', t); this._paramana.updateGeometryNode(this); },
	
	getRatio: function() { return this._paramana.get('ratio'); },
	setRatio: function(r) { return this._paramana.set('ratio', r); this._paramana.updateGeometryNode(this); },
	
	getScale: function() { return this._paramana.get('scale'); },
	setScale: function(svec) { this._paramana.set('scale', svec); this._paramana.updateMatirxNode(this); },
	
	getRotate: function() { return this._paramana.get('rotate'); },
	setRotate: function(rvec) { this._paramana.set('rotate', rvec); this._paramana.updateMatirxNode(this); },
	
	getTranslate: function() { return this._paramana.get('translate'); },
	setTranslate: function(tvec) { this._paramana.set('translate', tvec); this._paramana.updateMatirxNode(this); },
	
    callBaseCalibration: function()
    {
        return;
        var leftTriangle = -1, rightTriangle = -1, roof = -1;
        var nodes = scene.findNodes();
        
        // material name matrix texture element
        var mnmte = function(n) { return n.nodes[0].nodes[0].nodes[0].nodes[0].nodes[0]; }
        
        for(var i=0;i<nodes.length;i++)
        {
            var n = nodes[i];
            if(n.getType()=="name")
            {
                if(n.getName()=="roof") { roof = mnmte(n); }
                else if(n.getName()=="leftTriangle") { leftTriangle = mnmte(n); }
                else if(n.getName()=="rightTriangle") { rightTriangle = mnmte(n); }
            }
        }
        if(roof == -1) { console.log("ERROR"); return; }
        if(leftTriangle.getID() == this.getID())
        {
	        roof.setWidth(this.getWidth());
	        roof.setHeight(this.getHeight());
	        roof.adjustChildren();
        }
        else if(rightTriangle.getID() == this.getID())
        {
	        roof.setWidth(this.getWidth());
	        roof.setHeight(this.getHeight());
	        roof.adjustChildren();
        }
    }
});

function build(params) 
{
    var positionSet = this._paramana.createPositions();
	var indiceSet = utility.makeIndices(0, 5, 3).concat(utility.makeIndices(6, 17));
	var uvSet = 
    [
		0, 0, 1, 0, this._paramana.get('ratio').a, 1,
		1, 0, 1, 1, 0, 1, 0, 0,
		1, 1, 0, 1, 0, 0, 1, 0,
		0, 1, 0, 0, 1, 0, 1, 1,
		0, 0, 1, 0, this._paramana.get('ratio').b, 1
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
