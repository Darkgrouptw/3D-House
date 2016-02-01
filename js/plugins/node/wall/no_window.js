(function () 
{
    var p = {};

    SceneJS.Types.addType("wall/no_window", 
	{ 
		construct: function(params) { this.addNode(build.call(this, params)); },
		
		// Getter function, for property
		getWidth: function() { return p.get('width'); },
		getHeight: function() { return p.get('height'); },
		getThickness: function() { return p.get('thickness'); },
		
		// For transform
		getScale: function() { return p.get('scale'); },
		getRotate: function() { return p.get('rotate'); },
		getTranslate: function() { return p.get('translate'); },
		
		// Setter function, for property
		setWidth: function(w) { p.set('width', w); p.updateGeometryNode.bind(this)(); },
		setHeight: function(h) { p.set('height', h); p.updateGeometryNode.bind(this)(); },
		setThickness: function(t) { p.set('thickness', t); p.updateGeometryNode.bind(this)(); },
		
		// For transform
		setScale: function(svec) { p.set('scale', svec); p.updateMatirxNode.bind(this)(); },
		setRotate: function(rvec) { p.set('rotate', rvec); p.updateMatirxNode.bind(this)(); },
		setTranslate: function(tvec) { p.set('translate', tvec); p.updateMatirxNode.bind(this)(); }
	});

    function build(params) 
	{
        p = new ParameterManager(params, function(property)
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
		
		var uvs = new Float32Array(
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
            coreId: p.makeRandomID(20),
            positions: p.makePositions(),
            normals: new Float32Array([
                0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1,
                1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0,
                0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0,
                -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0,
                0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0,
                0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1 
            ]),
			uv: uvs,
            indices: p.makeIndices(0, 23)
        };
		
		return geometry;
    }
    
})();
