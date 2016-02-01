(function () {

    SceneJS.Types.addType("roof/hip", { construct:function (params) { this.addNode(build.call(this, params)); }});

    function build(params) 
	{
        var size = {x: 0, y: 0, z: 0}, thick, toplen, ratio, center;
        if(params.size && params.thick && params.toplen != undefined) 
		{
            size.x = params.size.x / 2;
			size.y = params.size.z / 2;
			size.z = params.size.y / 2;
            thick = params.thick;
			toplen = params.toplen;
        } 
		else { thick = 0; toplen = 0; }
		
		if(params.center) { center = params.center; }
		else { center = { x: 0, y: 0, z: 0}; }
		
		if(params.ratio) { ratio = params.ratio; }
		else { ratio = { a: 0, b: 0 }; }

        var coreId = "roof/hip" + "_" + SceneJS_add_randomString(20) + "_" + (params.wire ? "wire" : "solid");

        // If a node core already exists for a prim with the given properties,
        // then for efficiency we'll share that core rather than create another geometry
        if (this.getScene().hasCore("geometry", coreId)) { return { type: "geometry", coreId: coreId }; }

		var topPointA, topPointB;
		var positionSet = [], indiceSet = [], normalSet = [];
		
		var percentageZ = -size.z + (2 * size.z * ratio.b);
		if (toplen == 0) 
		{ 
			var percetageX = -size.x + (2 * size.x * ratio.a);
			topPointA = [percetageX, size.y, percentageZ]; 
			topPointB = [percetageX, size.y, percentageZ];
		}
		else 
		{
			var remainlen = (size.x * 2) - toplen;
			topPointA = [-size.x + (remainlen * ratio.a), size.y, percentageZ];
			topPointB = [size.x - (remainlen * (1 - ratio.a)), size.y, percentageZ];
			
			// Extra faces and indices
			positionSet = positionSet.concat(
			[
				// Front
				topPointB[0], topPointB[1], topPointB[2],
				-size.x, -size.y, size.z, 
				topPointA[0], topPointA[1], topPointA[2],
				size.x, -size.y, -size.z, 
				
				// Back
				topPointA[0], topPointA[1] - thick, topPointA[2],
				-size.x + thick, -size.y, size.z - thick, 
				topPointB[0], topPointB[1] - thick, topPointB[2],
				size.x - thick, -size.y, -size.z + thick,
			]);
			
			indiceSet = indiceSet.concat(
			[
				32, 33, 34, 32, 34, 35, 
				36, 37, 38, 36, 38, 39
			]);
			
			normalSet = normalSet.concat(
			[
				-1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0,
				0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0,
			]);
		}
		
		
		positionSet = positionSet.concat(
		[
			// Front 
			topPointA[0], topPointA[1], topPointA[2],
			-size.x, -size.y, size.z,
			-size.x, -size.y, -size.z,
			size.x, -size.y, -size.z,
			
			topPointB[0], topPointB[1], topPointB[2],
			size.x, -size.y, -size.z,
			size.x, -size.y, size.z,
			-size.x, -size.y, size.z,
			
			// Back
			topPointA[0], topPointA[1] - thick, topPointA[2],
			size.x - thick, -size.y, -size.z + thick, 
			-size.x + thick, -size.y, -size.z + thick,
			-size.x + thick, -size.y, size.z - thick,
			
			topPointB[0], topPointB[1] - thick, topPointB[2],
			-size.x + thick, -size.y, size.z - thick,
			size.x - thick, -size.y, size.z - thick,
			size.x - thick, -size.y, -size.z + thick,
			
			// Side West
			-size.x + thick, -size.y, size.z - thick,
			-size.x + thick, -size.y, -size.z + thick,
			-size.x, -size.y, -size.z,
			-size.x, -size.y, size.z,
			
			// Side Sourth
			-size.x + thick, -size.y, -size.z + thick,
			size.x - thick, -size.y, -size.z + thick,
			size.x, -size.y, -size.z,
			-size.x, -size.y, -size.z,
			
			// Side East
			size.x - thick, -size.y, size.z - thick,
			size.x, -size.y, size.z,
			size.x, -size.y, -size.z,
			size.x - thick, -size.y, -size.z + thick,
			
			// Side North
			-size.x + thick, -size.y, size.z - thick,
			-size.x, -size.y, size.z,
			size.x, -size.y, size.z,
			size.x - thick, -size.y, size.z - thick
		]);
		
		indiceSet = indiceSet.concat(
		[
			0, 1, 2, 0, 2, 3,
			4, 5, 6, 4, 6, 7,
			8, 9, 10, 8, 10, 11,
			12, 13, 14, 12, 14, 15,
			16, 17, 18, 16, 18, 19,
			20, 21, 22, 20, 22, 23,	
			24, 25, 26, 24, 26, 27,
			28, 29, 30, 28, 30, 31
		]);
		
		normalSet = normalSet.concat(
		[
			-1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0,
			-1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0,
			
			0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1,    
            0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0,
			
            -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0,
            0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0,
            0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1,
			1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0
		]);
		
		for(var pidx = 0; pidx < positionSet.length; pidx = pidx + 3)
		{
			positionSet[pidx] = positionSet[pidx] + center.x;
			positionSet[pidx + 1] = positionSet[pidx + 1] + center.y;
			positionSet[pidx + 2] = positionSet[pidx + 2] + center.z;
		}
		
        // Otherwise, create a new geometry
        var newone = 
		{
            type: "geometry",
            primitive: params.wire ? "lines" : "triangles",
            coreId: coreId,
            positions: new Float32Array(positionSet),
            normals: normalSet,
            indices:  indiceSet
        };
		
		return newone;
    }
})();