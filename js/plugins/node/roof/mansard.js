(function () {

    SceneJS.Types.addType("roof/mansard", 
	{ construct:function (params) { this.addNode(build.call(this, params)); }});

    function build(params) 
	{
        var size = {x: 0, y: 0, z: 0}, ratio = { a: 0, b: 0 }, center, thick;
        if(params.size && params.ratio) 
		{ 
			size.x = params.size.x / 2;
			size.y = params.size.z / 2;
			size.z = params.size.y / 2;
			ratio = params.ratio; 
		} 

		if(params.thick) { thick = params.thick } else { thick = 1; }
		
		if(params.center) { center = params.center; }
		else { center = { x: 0, y: 0, z: 0}; }
		
        var coreId = "roof/mansard" + "_" + SceneJS_add_randomString(20) + "_" + (params.wire ? "wire" : "_solid");

        // If a node core already exists for a prim with the given properties,
        // then for efficiency we'll share that core rather than create another geometry
        if (this.getScene().hasCore("geometry", coreId)) { return { type:"geometry", coreId:coreId }; }
		
		
		var sZ = size.z, sX = size.x, sY = size.y;
		
		// Abbreviate to easy use. dnxpr is mean the "'d'ouble 'n'egative 'x' and multply 'r'atio.x"
		// The same, p is mean the positive
		var dNxr = 2 * -sX * ratio.a, dPxr = 2 * sX * ratio.a, 
			dNzr = 2 * -sZ * ratio.b, dPzr = 2 * sZ * ratio.b;
		
		// It is mean the " 's'ize.'z' 'm'inus 't'hick "
		var sYmt = sY - thick;
		
		var positionSet = new Float32Array(
		[
			// Front  West
			-sX - dNxr, sY, sZ - dPzr, 
			-sX, -sY, sZ, 										// A
			-sX, -sY, -sZ, 										// C
			-sX - dNxr, sY, -sZ - dNzr,
			
			// Front Sourth
			sX - dPxr, sY, -sZ - dNzr, 		
			-sX - dNxr, sY, -sZ - dNzr, 
			-sX, -sY, -sZ, 										// C
			sX, -sY, -sZ, 										// D
			
			// Front East
			sX - dPxr, sY, sZ - dPzr, 
			sX - dPxr, sY, -sZ - dNzr, 
			sX, -sY, -sZ, 										// D
			sX, -sY, sZ, 										// B
			
			// Front North
			sX - dPxr, sY, sZ - dPzr, 
			sX, -sY, sZ, 										// B
			-sX, -sY, sZ, 										// A
			-sX - dNxr, sY, sZ - dPzr, 
			
			// Front Center
			-sX - dNxr, sY, -sZ - dNzr, 
			sX - dPxr, sY, -sZ - dNzr, 
			sX - dPxr, sY, sZ - dPzr, 
			-sX - dNxr, sY, sZ - dPzr, 
			
			// Back West
			-sX - dNxr + thick, sYmt, sZ - dPzr - thick, 
			-sX - dNxr + thick, sYmt, -sZ - dNzr + thick, 
			-sX + thick, -sY, -sZ + thick, 					// C'
			-sX + thick, -sY, sZ - thick, 					// A'
			
			// Back Sourth
			sX - dPxr - thick, sYmt, -sZ - dNzr + thick, 
			sX- thick, -sY, -sZ + thick, 					// D'
			-sX + thick, -sY, -sZ + thick, 					// A'
			-sX - dNxr + thick, sYmt, -sZ - dNzr + thick, 
			
			// Back East
			sX - dPxr - thick, sYmt, sZ - dPzr - thick, 
			sX - thick, -sY, sZ - thick, 						// B'
			sX - thick, -sY, -sZ + thick, 						// D'
			sX - dPxr - thick, sYmt, -sZ - dNzr + thick, 
			
			// Back North
			sX - dPxr - thick, sYmt, sZ - dPzr - thick, 
			-sX - dNxr + thick, sYmt, sZ - dPzr - thick, 
			-sX + thick, -sY, sZ - thick, 						// A'
			sX - thick, -sY, sZ - thick, 						// B'
			
			// Back Center
			sX - dPxr - thick, sYmt, sZ - dPzr - thick, 
			sX - dPxr - thick, sYmt, -sZ - dNzr + thick, 
			-sX - dNxr + thick, sYmt, -sZ - dNzr + thick, 
			-sX - dNxr + thick,  sYmt, sZ - dPzr - thick,
			
			// Side West
			-sX + thick, -sY, sZ - thick, 
			-sX + thick, -sY, -sZ + thick, 
			-sX, -sY, -sZ, 	
			-sX, -sY, sZ,
			
			// Side Sourth
			sX - thick, -sY, -sZ + thick, 	
			sX, -sY, -sZ, 	
			-sX, -sY, -sZ, 
			-sX + thick, -sY, -sZ + thick,
			
			// Side East
			sX - thick, -sY, sZ - thick, 
			sX, -sY, sZ,
			sX, -sY, -sZ, 
			sX - thick, -sY, -sZ + thick, 	
			
			// Side North
			sX - thick, -sY, sZ- thick, 
			-sX + thick, -sY, sZ - thick, 			
			-sX, -sY, sZ, 
			sX, -sY, sZ, 
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
            positions: positionSet,
			uv: new Float32Array([
				/*0, 1, 0, 0, 1, 0, 1, 1,			// Front West
				1, 1, 1, 0, 0, 0, 0, 1,			// Front Sourth
				0, 1, 1, 1, 1, 0, 0, 0,			// Front East
				0, 1, 0, 0, 1, 0, 1, 1,			// Front North
				1, 1, 1, 0, 0, 0, 0, 1,			// Front Center
				
				0, 1, 0, 0, 1, 0, 1, 1,			// Back West
				1, 1, 0, 1, 0, 0, 1, 1,			// Back Sourth
				1, 0, 0, 0, 0, 1, 1, 1,			// Back East
				1, 1, 0, 1, 0, 0, 1, 0,			// Back North
				0, 1, 1, 1, 1, 0, 0, 0			// Back Center
				
				0, 1, 0, 0, 1, 0, 1, 1,			// Side West
				1, 1, 0, 1, 0, 0, 1, 1,			// Side Sourth
				1, 0, 0, 0, 0, 1, 1, 1,			// Side East
				1, 1, 0, 1, 0, 0, 1, 0,			// Side North*/
			]),
			normals: "auto",
            indices: 
			[
				0, 1, 2, 0, 2, 3,				// Front West
				4, 5, 6, 4, 6, 7,				// Front Sourth
				8, 9, 10, 8, 10, 11,			// Front East
				12, 13, 14, 12, 14, 15,			// Front North
				16, 17, 18, 16, 18, 19,			// Front Center
				
				20, 21, 22, 20, 22, 23,			// Back West
				24, 25, 26, 24, 26, 27,			// Back Sourth
				28, 29, 30, 28, 30, 31,			// Back East
				32, 33, 34, 32, 34, 35,			// Back North
				36, 37, 38, 36, 38, 39,			// Back Center
				
				40, 41, 42, 40, 42, 43,			// Side West
				44, 45, 46, 44, 46, 47,			// Side Sourth
				48, 49, 50, 48, 50, 51,			// Side East
				52, 53, 54, 52, 54, 55			// Side North
            ]
        };
		
		return newone;
    }
})();