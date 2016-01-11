(function () {

    SceneJS.Types.addType("Wall/Triangle", 
	{
        construct:function (params) { this.addNode(build.call(this, params)); }
    });

    function build(params) 
	{
        var width, height, thickness, center, ratio;
        if(params.width && params.height && params.thickness) 
		{
            width = params.width;
            height = params.height;
            thickness = params.thickness;
        } 
		else { width = 0; height = 0; thickness = 0; }
		
		if(params.center) { center = params.center; }
		else { center = { x: 0, y: 0, z: 0}; }
		
		if(params.ratio) { ratio = params.ratio; }
		else { ratio = { x: 0.5, y: 0.5, z: 1.0 }; }

        var coreId = "Wall/Triangle" + width + "_" + height + "_" + thickness + (params.wire ? "wire" : "_solid");

        // If a node core already exists for a prim with the given properties,
        // then for efficiency we'll share that core rather than create another geometry
        if (this.getScene().hasCore("geometry", coreId)) { return { type:"geometry", coreId:coreId }; }

		positionSet = new Float32Array(
		[
			-width, -height, -thickness,									// front 1
			width, -height, -thickness,										// front 2
			(width * ratio.x + -width * ratio.y) / 2, height, -thickness,	// front 3
			-width, -height, thickness,										// back 1
			width, -height, thickness,										// back 2
			(width * ratio.x + -width * ratio.y) / 2, height, thickness,	// back 3
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
				2, 1, 0, 			// Front
				3, 4, 5,			// Back
				3, 5, 2, 3, 0, 2,	// Side A
				3, 0, 1, 3, 4, 1,	// Side B
				2, 5, 4, 2, 1, 4	// Side C
            ]
        };
		
		return newone;
    }
})();