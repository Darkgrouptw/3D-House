(function () {

    SceneJS.Types.addType("wall/triangle", { construct:function (params) { this.addNode(build.call(this, params)); } });

    function build(params) 
	{
        var width, height, thick, center, ratio;
        if(params.size && params.thick) 
		{
            width = (params.size.a || params.size.y) / 2;
            height = (params.size.b || params.size.z) / 2;
            thick = params.thick / 2;
        } 
		else { width = 0; height = 0; thick = 0; }
		
		if(params.center) { center = params.center; }
		else { center = { x: 0, y: 0, z: 0}; }
		
		if(params.ratio) { ratio = params.ratio; }
		else { ratio = { a: 0, b: 0}; }

        var coreId = "wall/triangle" + "_" + SceneJS_add_randomString(20) + "_" + (params.wire ? "wire" : "solid");

        // If a node core already exists for a prim with the given properties,
        // then for efficiency we'll share that core rather than create another geometry
        if (this.getScene().hasCore("geometry", coreId)) { return { type:"geometry", coreId:coreId }; }

		var positionSet = new Float32Array(
		[
			-width, -height, -thick,									// A
			width, -height, -thick,										// B
			(width * ratio.a + -width * ratio.b) / 2, height, -thick,	// C
			
			-width, -height, thick,										// A'
			width, -height, thick,										// B'
			(width * ratio.a + -width * ratio.b) / 2, height, thick		// C'
			
			/*
			-width, -height, thick,
			-width, -height, -thick,
			width, -height, -thick,
			width, -height, thick,	
			
			-width, -height, thick,
			-width, -height, -thick,
			(width * ratio.a + -width * ratio.b) / 2, height, -thick,
			(width * ratio.a + -width * ratio.b) / 2, height, thick,
			
			(width * ratio.a + -width * ratio.b) / 2, height, thick,
			(width * ratio.a + -width * ratio.b) / 2, height, -thick,
			width, -height, -thick,
			width, -height, thick,
			*/
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