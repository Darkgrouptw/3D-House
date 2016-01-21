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
			// Back
			(width * ratio.x + -width * ratio.y) / 2, height + bevelEdge, -deep,
			-width - bevelEdge, -height, -deep,
			-width - bevelEdge, -height, deep,
			(width * ratio.x + -width * ratio.y) / 2, height + bevelEdge, deep,
			
			// Back Right
			(width * ratio.x + -width * ratio.y) / 2, height + bevelEdge, -deep,
			-width - bevelEdge, -height, -deep,
			-width, -height, -deep,
			(width * ratio.x + -width * ratio.y) / 2, height, -deep,
			
			// Back Buttom
			-width - bevelEdge, -height, -deep,
			-width - bevelEdge, -height, deep,
			 -width, -height, deep,
			 -width, -height, -deep,
			 
			 // Back Left
			 (width * ratio.x + -width * ratio.y) / 2, height + bevelEdge, deep,
			 -width - bevelEdge, -height, deep,
			 -width, -height, deep,
			 (width * ratio.x + -width * ratio.y) / 2, height, deep,
			 
			 // Front
			(width * ratio.x + -width * ratio.y) / 2, height + bevelEdge, -deep,
			width + bevelEdge, -height, -deep,	
			width + bevelEdge, -height, deep,
			(width * ratio.x + -width * ratio.y) / 2, height + bevelEdge, deep,
			
			// Front Right
			(width * ratio.x + -width * ratio.y) / 2, height + bevelEdge, -deep,
			width + bevelEdge, -height, -deep,	
			width, -height, -deep,
			(width * ratio.x + -width * ratio.y) / 2, height, -deep,
			
			// Front Buttom
			width + bevelEdge, -height, -deep,
			width + bevelEdge, -height, deep,
			width, -height, deep,
			width, -height, -deep,
			
			// Front Left
			(width * ratio.x + -width * ratio.y) / 2, height + bevelEdge, deep,
			width + bevelEdge, -height, deep,
			width, -height, deep,
			(width * ratio.x + -width * ratio.y) / 2, height, deep,
			
			// Back Inside
			(width * ratio.x + -width * ratio.y) / 2, height, -deep,
			(width * ratio.x + -width * ratio.y) / 2, height, deep,
			-width, -height, deep,
			-width, -height, -deep,
			
			// Front Inside
			(width * ratio.x + -width * ratio.y) / 2, height, -deep,
			(width * ratio.x + -width * ratio.y) / 2, height, deep,
			width, -height, deep,
			width, -height, -deep,
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
			normals: new Float32Array([
                0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1,
                1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0,
                0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0,
                -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0,
                0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0,
                0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1,
                0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1,
                1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0,
                0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0,
                -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0
            ]),
			uv: new Float32Array([
				0,1,0,0,1,0,1,1,			// Back 
				1,1,1,0,0,0,0,1,			// Back Right
				0,1,1,1,1,0,0,0,			// Back Buttom
				0,1,0,0,1,0,1,1,			// Back Left
				
				1,1,1,0,0,0,0,1,			// Front
				0,1,0,0,1,0,1,1,			// Front Right
				1,1,0,1,0,0,1,1,			// Front Buttom
				1,0,0,0,0,1,1,1,			// Front Left
				
				1,1,0,1,0,0,1,0,			// Back Inside
				0,1,1,1,1,0,0,0				// Front Inside
				
			]),
            indices: 
			[
				0, 1, 2, 0, 2, 3,			// Back
				4, 5, 6, 4, 6, 7,			// Back Right
				8, 9, 10, 8, 10, 11,		// Back Buttom
				12, 13, 14, 12, 14, 15,		// Back Left
				
				16, 17, 18, 16, 18, 19,		// Front
				20, 21, 22, 20, 22, 23,		// Front Right
				24, 25, 26, 24, 26, 27,		// Front Buttom
				28, 29, 30, 28, 30, 31,		// Front Left
				
				32, 33, 34, 32, 34, 35,		// Back Inside
				36, 37, 38, 36, 38, 39		// Front Inside
            ]
        };
		
		return newone;
    }
})();