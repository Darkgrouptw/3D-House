(function () 
{
    SceneJS.Types.addType("wall/single_window", { construct: function (params) { this.addNode(build.call(this, params)); }});

    function build(params) 
	{
        var w = params.width !== undefined ? params.width / 2 : 0;
        var h = params.height !== undefined ? params.height / 2 : 0;
		var t = params.thickness !== undefined ? params.thickness / 2 : 0;
		var c = params.center !== undefined ? params.center : {x: 0, y: 0, z: 0};
		var r = params.ratio !== undefined ? params.ratio : {a: 0, b: 0};

		var wc = {x: -w + (r.a * 2 * w), y: -h + (r.b * 2 * h), z: 0};
		var ws = params.wsize !== undefined ? params.wsize : {a: 1, b: 1};
		ws.a = ws.a / 2;
		ws.b = ws.b / 2;
		
		var makePositive = function(l, i) 
		{ 
			var nl = [];
			nl.push(l[0]); nl.push(l[1]); nl.push(l[2]);
			nl[i] = Math.abs(nl[i]); 
			return nl; 
		}
		
		var internal = [];
		internal.push(SceneJS_add_moveToCenter([-ws.a, ws.b, -t], wc)); 		//A'
		internal.push(SceneJS_add_moveToCenter([-ws.a, -ws.b, -t], wc)); 	    //B'
		internal.push(SceneJS_add_moveToCenter([ws.a, -ws.b, -t], wc)); 		//C'
		internal.push(SceneJS_add_moveToCenter([ws.a, ws.b, -t], wc)); 		    //D'
		
		var external = [[-w, h, -t], [-w, -h, -t], [w, -h, -t], [w, h, -t]];
		
		var pset = [];
		
		for(var idxr = 0; idxr < 4; idxr++)
		{
			var tmprb = (idxr + 1) % 4;
			var tmpra = idxr;
			// Downside
			pset = pset.concat(internal[tmpra]).concat(external[tmpra])
				.concat(external[tmprb]).concat(internal[tmprb]);
			
			// Upside
			pset = pset.concat(makePositive(external[tmpra], 2)).concat(makePositive(internal[tmpra], 2))
				.concat(makePositive(internal[tmprb], 2)).concat(makePositive(external[tmprb], 2));
				
			// External Side
			pset = pset.concat(external[tmpra]).concat(makePositive(external[tmpra], 2))
				.concat(makePositive(external[tmprb], 2)).concat(external[tmprb]);
				
			// Internal Side
			pset = pset.concat(makePositive(internal[tmpra], 2)).concat(internal[tmpra])
				.concat(internal[tmprb]).concat(makePositive(internal[tmprb], 2));
		}
		
        var coreId = "wall/single_window" + "_" + SceneJS_add_randomString(20) + "_" + (params.wire ? "wire" : "solid");

        // If a node core already exists for a prim with the given properties,
        // then for efficiency we'll share that core rather than create another geometry
        if (this.getScene().hasCore("geometry", coreId)) { return { type: "geometry", coreId: coreId }; }
		
		pset = SceneJS_add_moveToCenter(pset, c);
		
        // Otherwise, create a new geometry
        var newone = 
		{
            type: "geometry",
            primitive: params.wire ? "lines" : "triangles",
            coreId: coreId,
            positions: new Float32Array(pset),
            normals: new Float32Array([
				0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1,
                0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1,
                -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0,
				1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0,
				
                0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1,
				0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1,
                0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0,
                0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0,
				
                0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1,
                0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1,
				1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0,
                -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0,
				
                0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1,
                0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1,
				0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0,
				0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0,
            ]),
            indices: SceneJS_add_indiceGenerator(0, 63)
        };
		
		return newone;
    }
})();
