
SceneJS.Types.addType("window/fixed",
{
    construct: function(params)
    {
        this._paramana = new ParameterManager(params, function(property)
        {
            var e = property.extend, t = property.thickness, s = property.size;

            var expand = function(q)
            {
                r = [];
                r.push([q.a, q.b, 0]); r.push([-q.a, q.b, 0]);
                r.push([-q.a, -q.b, 0]); r.push([q.a, -q.b, 0]);
                return r;
            };

            var deep_copy = function(c) { cp = []; c.forEach(function(v) { cp = cp.concat(v); }); return cp; }
            var modifier = function(p, i, v) { q = deep_copy(p); q[i] = v; return q; };
         
            var inset_bo = expand(s);

            var c = {a: s.a - 0.5, b: s.b - 0.5 };
            var inset_bi = expand(c);

            var t2 = 2 * t;
            var hlafpt2 = t2 + 0.5;

            var pset = [];

            var sign = [1, -1, -1, 1];
            var helper = [true, true, false, false];
            var main = [1, 0, 1,  0];
            var sub = [0, 1, 0, 1];

            for(var idx = 0; idx < 4; idx++)
            {
                var tpb = (idx + 1) % 4, tpa = idx;
                pset = pset.concat(inset_bi[tpa]).concat(inset_bi[tpb]).concat(inset_bo[tpb]).concat(inset_bo[tpa]);
               
                var thickbob = modifier(inset_bo[tpb], 2, t2);
                var thickboa = modifier(inset_bo[tpa], 2, t2);
                pset = pset.concat(inset_bo[tpa]).concat(inset_bo[tpb]).concat(thickbob).concat(thickboa);

                var topbia = modifier(inset_bi[tpa], 2, hlafpt2);
                var topbib = modifier(inset_bi[tpb], 2, hlafpt2);
                pset = pset.concat(inset_bi[tpb]).concat(inset_bi[tpa]).concat(topbia).concat(topbib);

                var extdboa = modifier(thickboa, main[idx], thickboa[main[idx]] + (sign[idx] * e));
                var extdbob = modifier(thickbob, main[idx], thickbob[main[idx]] + (sign[idx] * e));

                if(helper[idx])
                {
                    extdboa[sub[idx]] = extdboa[sub[idx]] + e;
                    extdbob[sub[idx]] = extdbob[sub[idx]] - e;
                }
                else
                {
                    extdboa[sub[idx]] = extdboa[sub[idx]] - e;
                    extdbob[sub[idx]] = extdbob[sub[idx]] + e;
                }

                pset = pset.concat(thickboa).concat(thickbob).concat(extdbob).concat(extdboa);

                var paddboa = modifier(extdboa, 2, extdboa[2] + 0.5);
                var paddbob = modifier(extdbob, 2, extdbob[2] + 0.5);
                pset = pset.concat(extdboa).concat(extdbob).concat(paddbob).concat(paddboa);

                pset = pset.concat(topbia).concat(paddboa).concat(paddbob).concat(topbib);
            }

            return pset;

        });
        this._layer = params.layer;
        this._paramana.addAttribute('extend', params.extend);
        this._paramana.addAttribute('size', params.size);

        this.addNode(window_fixed_build.call(this, params));
    },

    getLayer: function() { return this._layer; },
    setLayer: function(l) { return this._layer = l; },

    getThickness: function() { return this._paramana.get('thickness'); },
    setThickness: function(t) { this._paramana.set('thickness', t); this._paramana.updateGeometryNode(this); },

    getSize: function() { return this._paramana.get('size'); },
    setSize: function(s) { this._paramana.set('size', l); this._paramana.updateGeometryNode(this); },

    getExtend: function() { return this._paramana.get('extend'); },
    setExtend: function(e) { this._paramana.set('extend', e); this._paramana.updateGeometryNode(this); },

    getScale: function() { return this._paramana.get('scale'); },
	setScale: function(svec) { this._paramana.set('scale', svec); this._paramana.updateMatirxNode(this); },
	
	getRotate: function() { return this._paramana.get('rotate'); },
	setRotate: function(rvec) { this._paramana.set('rotate', rvec); this._paramana.updateMatirxNode(this); },
	
	getTranslate: function() { return this._paramana.get('translate'); },
	setTranslate: function(tvec) { this._paramana.set('translate', tvec); this._paramana.updateMatirxNode(this); },
});

function window_fixed_build(params)
{
    var positionSet = this._paramana.createPositions();
    var indiceSet = utility.makeIndices(0, (positionSet.length / 3) - 1);
    var uvSet = 
    [ 
        0.8, 0.8, 0.2, 0.8, 0, 1, 1, 1,
        1, 1, 0, 0, 0, 1, 0, 0,
        1, 1, 0, 0, 0, 1, 0, 0,
        0.8, 0.8, 0.2, 0.8, 0, 1, 1, 1,
        1, 1, 0, 0, 0, 1, 0, 0,
        0.8, 0.8, 1, 1, 0, 1, 0.2, 0.8,
        
        0.2, 0.8, 0.2, 0.2, 0, 0, 0, 1,
        1, 1, 0, 0, 0, 1, 0, 0,
        1, 1, 0, 0, 0, 1, 0, 0,
        0.2, 0.8, 0.2, 0.2, 0, 0, 0, 1,
        1, 1, 0, 0, 0, 1, 0, 0,
        0.2, 0.8, 0, 1, 0, 0, 0.2, 0.2,

        0.2, 0.2, 0.8, 0.2, 1, 0, 0, 0,
        1, 1, 0, 0, 0, 1, 0, 0,
        1, 1, 0, 0, 0, 1, 0, 0,
        0.2, 0.2, 0.8, 0.2, 1, 0, 0, 0,
        1, 1, 0, 0, 0, 1, 0, 0,
        0.2, 0.2, 0, 0, 1, 0, 0.8, 0.2,

        0.8, 0.2, 0.8, 0.8, 1, 1, 1, 0, 
        1, 1, 0, 0, 0, 1, 0, 0,
        1, 1, 0, 0, 0, 1, 0, 0,
        0.8, 0.2, 0.8, 0.8, 1, 1, 1, 0,
        1, 1, 0, 0, 0, 1, 0, 0,
        0.8, 0.2, 1, 0, 1, 1, 0.8, 0.8,
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

