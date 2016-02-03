
SceneJS.Types.addType("wall/no_window", 
{ 
	construct: function(params) 
	{ 
		this.paramana = new ParameterManager(params, function(property)
		{
			var w = property.width / 2, h = property.height / 2, t = property.thickness / 2; 
			var pset = new Float32Array(
			[
				w, h, t, -w, h, t, -w, -h, t, w, -h, t,
				w, h, t, w, -h, t, w, -h, -t, w, h, -t,
				w, h, t, w, h, -t, -w, h, -t, -w, h, t,
				-w, h, t, -w, h, -t, -w, -h, -t, -w, -h, t,
				-w, -h, -t, w, -h, -t, w, -h, t, -w, -h, t,
				w, -h, -t, -w, -h, -t, -w, h, -t, w, h, -t
			]);
			return pset;
		});
		this.addNode(build.call(this, params)); 
	},
	
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
	
	callBaseCalibration: function()
	{
        var backWall = -1, rightWall = -1, leftWall = -1, frontWall = -1, roof = -1, base = -1;
        var nodes=scene.findNodes();
        
        // material name matrix texture element
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
        
        if(base == -1) { console.log("ERROR"); return; }
        if(frontWall != -1 && frontWall.getID() == this.getID()) {}
        else if(backWall != -1 && backWall.getID() == this.getID())
        {
            base.setWidth(this.getWidth());
            base.callBaseCalibration(this.getHeight());
        }
        else if(leftWall!= -1 && leftWall.getID() == this.getID())
        {
            if(backWall != -1 && frontWall != -1) {}
            else if(frontWall != -1) {}
            else if(backWall != -1)
            {
                base.setHeight(this.getWidth() + backWall.getThickness());
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
                base.setHeight(this.getWidth() + backWall.getThickness());
                base.callBaseCalibration(this.getHeight());
            }
            else {}
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
