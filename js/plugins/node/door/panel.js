
SceneJS.Types.addType("door/panel",
{
    construct: function(params)
    {
        this._paramana = new ParameterManager(params, function(property)
        {
            var x = property.size.a, y = property.size.b, z = property.thickness / 2;
           
            var pset = 
            [
                x, y, z, -x, y, z, -x, -y, z, x, -y, z, 
                x, y, z, x, -y, z, x, -y, -z, x, y, -z,
                x, y, z, x, y, -z, -x, y, -z, -x, y, z, 
                -x, y, z, -x, y, -z, -x, -y, -z, -x, -y, z,
                -x, -y, -z, x, -y, -z, x, -y, z, -x, -y, z,
                x, -y, -z, -x, -y, -z, -x, y, -z, x, y, -z
            ];

            return pset;
        });
        this._layer = params.layer;
        this._paramana.addAttribute('size', params.size);

        this.addNode(door_panel_build.call(this, params));
    },

    getLayer: function() { return this._layer; },
    setLayer: function(l) { return this._layer = l; },

    getThickness: function() { return this._paramana.get('thickness'); },
    setThickness: function(t) { this._paramana.set('thickness', t); this._paramana.updateGeometryNode(this); },

    getSize: function() { return this._paramana.get('size'); },
    setSize: function(s) { this._paramana.set('size', l); this._paramana.updateGeometryNode(this); },

    getScale: function() { return this._paramana.get('scale'); },
	setScale: function(svec) { this._paramana.set('scale', svec); this._paramana.updateMatirxNode(this); },
	
	getRotate: function() { return this._paramana.get('rotate'); },
	setRotate: function(rvec) { this._paramana.set('rotate', rvec); this._paramana.updateMatirxNode(this); },
	
	getTranslate: function() { return this._paramana.get('translate'); },
	setTranslate: function(tvec) { this._paramana.set('translate', tvec); this._paramana.updateMatirxNode(this); },
});

function door_panel_build(params)
{
    var positionSet = this._paramana.createPositions();
    var indiceSet = utility.makeIndices(0, (positionSet.length / 3) - 1);
    var uvSet = 
    [ 
        1, 1, 0, 1, 0, 0, 1, 0,
        0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0,
        1, 0, 0, 0, 0, 1, 1, 1
    ];

    var geometry = 
    {
        type: "geometry",
        primitive: "triangles",
        positions: positionSet,
        indices: indiceSet,
        uv: uvSet,
        normals: "auto"
    };

    return geometry;
}

