(function () {

    SceneJS.Types.addType("Roof/Gable", 
	{
        construct:function (params) { this.addNode(build.call(this, params)); }
    });

    function build(params) 
	{
        var width, height, thickness, center, ratio, deep;
        if(params.width && params.height && params.thickness && params.deep) 
		{
            width = params.width;
            height = params.height;
            thickness = params.thickness;
			deep = params.deep;
        } 
		else { width = 0; height = 0; thickness = 0; deep = 0; }
		
		if(params.center) { center = params.center; }
		else { center = { x: 0, y: 0, z: 0}; }
		
		if(params.ratio) { ratio = params.ratio; }
		else { ratio = { x: 0.5, y: 0.5, z: 1.0 }; }

        var coreId = "Roof/Gable" + width + "_" + height + "_" + thickness + "_" + deep + (params.wire ? "wire" : "_solid");

        // If a node core already exists for a prim with the given properties,
        // then for efficiency we'll share that core rather than create another geometry
        if (this.getScene().hasCore("geometry", coreId)) { return { type:"geometry", coreId:coreId }; }

		var bevelEdge = (thickness * 2 ) / Math.sqrt(3);
		
		positionSet = new Float32Array(
		[
			-width, -height, -deep,													// Inner front 1
			width, -height, -deep,													// Inner front 2
			(width * ratio.x + -width * ratio.y) / 2, height, -deep,				// Inner front 3
			
			-width - bevelEdge, -height, -deep,										// Outter front 1
			width + bevelEdge, -height, -deep,										// Outter front 2
			(width * ratio.x + -width * ratio.y) / 2, height + bevelEdge, -deep,	// Outter front 3
			
			-width, -height, deep,													// Inner back 1
			width, -height, deep,													// Inner back 2
			(width * ratio.x + -width * ratio.y) / 2, height, deep,					// Inner back 3
			
			-width - bevelEdge, -height, deep,										// Outter back 1
			width + bevelEdge, -height, deep,										// Outter back 2
			(width * ratio.x + -width * ratio.y) / 2, height + bevelEdge, deep,		// Outter back 3
		]);
		
		for(var pidx = 0; pidx < positionSet.length; pidx = pidx + 3)
		{
			positionSet[pidx] = positionSet[pidx] + center.x;
			positionSet[pidx + 1] = positionSet[pidx + 1] + center.y;
			positionSet[pidx + 2] = positionSet[pidx + 2] + center.z;
		}
		
        // Otherwise, create a new geometry
        newone = 
		{
            type: "geometry",
            primitive: params.wire ? "lines" : "triangles",
            coreId: coreId,
            positions: positionSet,
            normals: "auto",
            indices: 
			[
				5, 2, 0, 3, 5, 0, 		// Side 1
				5, 4, 1, 2, 5, 1, 		// Side 2
				
				6, 8, 11, 9, 6, 11, 	// Side 3
				7, 10, 11, 8, 7, 11,	// Side 4
				
				2, 1, 8, 1, 7, 8, 		// Side 5
				2, 8, 6, 0, 2, 6,		// Side 6
				
				3, 9, 11, 5, 3, 11,		// Side 7
				5, 11, 10, 4, 5, 10,	// Side 8
				
				3, 0, 9, 0, 9, 6,		// Side 9
				10, 4, 7, 4, 1, 7		// Side 0
            ]
        };
		
		return newone;
    }
})();