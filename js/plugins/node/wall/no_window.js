
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
	setTranslate: function(tvec) { this.paramana.set('translate', tvec); this.paramana.updateMatirxNode(this); }
});

function build(params) 
{
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
		positions: this.paramana.makePositions(),
		normals: new Float32Array([
			0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1,
			1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0,
			0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0,
			-1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0,
			0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0,
			0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1 
		]),
		uv: uvs,
		indices: this.paramana.makeIndices(0, 23)
	};
	
	return geometry;
}
