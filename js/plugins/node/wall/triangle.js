
SceneJS.Types.addType("wall/triangle", 
{ 
	construct: function (params) 
	{ 
		this._layer;
		this.paramana = new ParameterManager(params, function(property)
		{
			var w = property.width, h = property.height, t = property.thickness, r = property.ratio;
			var topw = (w * r.a + -w * r.b) / 2;
			var pset = new Float32Array(
			[
				-w, -h, -t, w, -h, -t, topw, h, -t,
				-w, -h, t, w, -h, t, topw, h, t,
				w, -h, -t, topw, h, -t, topw, h, t, w, -h, t,
				-w, -h, -t, topw, h, -t, topw, h, t, -w, -h, t,
				-w, -h, -t, w, -h, -t, w, -h, t, -w, -h, t
			]);
			
			return pset;
		});
		this.addNode(build.call(this, params)); 
	},
	
	getLayer:function(){return this._layer;},
	setLayer:function(l){this._layer=l;},

	getWidth: function() { return this.paramana.get('width'); },
	setWidth: function(w) { this.paramana.set('width', w); this.paramana.updateGeometryNode(this); },
	
	getHeight: function() { return this.paramana.get('height'); },
	setHeight: function(h) { this.paramana.set('height', h); this.paramana.updateGeometryNode(this); },
	
	getThickness: function() { return this.paramana.get('thickness'); },
	setThickness: function(t) { this.paramana.set('thickness', t); this.paramana.updateGeometryNode(this); },
	
	getRatio: function() { return this.paramana.get('ratio'); },
	setRatio: function(r) { return this.paramana.set('ratio', r); this.paramana.updateGeometryNode(this); },
	
	getScale: function() { return this.paramana.get('scale'); },
	setScale: function(svec) { this.paramana.set('scale', svec); this.paramana.updateMatirxNode(this); },
	
	getRotate: function() { return this.paramana.get('rotate'); },
	setRotate: function(rvec) { this.paramana.set('rotate', rvec); this.paramana.updateMatirxNode(this); },
	
	getTranslate: function() { return this.paramana.get('translate'); },
	setTranslate: function(tvec) { this.paramana.set('translate', tvec); this.paramana.updateMatirxNode(this); },
	
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
	var indiceSet = utility.makeIndices(0, 5, 3).concat(utility.makeIndices(6, 17));
	var uvSet =  new Float32Array(
	[
		0, 0, 1, 0, this.paramana.get('ratio').a, 1,
		1, 0, 1, 1, 0, 1, 0, 0,
		1, 1, 0, 1, 0, 0, 1, 0,
		0, 1, 0, 0, 1, 0, 1, 1,
		0, 0, 1, 0, this.paramana.get('ratio').b, 1
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
