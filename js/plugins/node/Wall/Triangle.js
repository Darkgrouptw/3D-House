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
			// Left Triangle
			-width, -height, -thickness,
			width, -height, -thickness,
			(width * ratio.x + -width * ratio.y) / 2, height, -thickness,
			
			// Back Face
			width, -height, -thickness,
			(width * ratio.x + -width * ratio.y) / 2, height, -thickness,
			(width * ratio.x + -width * ratio.y) / 2, height, thickness,
			width, -height, thickness,
			
			// Front Face
			-width, -height, -thickness,
			(width * ratio.x + -width * ratio.y) / 2, height, -thickness,
			(width * ratio.x + -width * ratio.y) / 2, height, thickness,
			-width, -height, thickness,
			
			// Buttom Face
			-width, -height, -thickness,
			width, -height, -thickness,
			width, -height, thickness,
			-width, -height, thickness,
		
			// Right Triangle
			-width, -height, thickness,
			width, -height, thickness,
			(width * ratio.x + -width * ratio.y) / 2, height, thickness
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
				0,0,-1,0,0,-1,0,0,-1,
				0,0,0,0,0,0,0,0,0,0,0,0,
				0,0,0,0,0,0,0,0,0,0,0,0,
				0,0,0,0,0,0,0,0,0,0,0,0,
				0,0,1,0,0,1,0,0,1
			]),
			uv: new Float32Array([
				0,0,1,0,ratio.x,1,
				1,0,1,1,0,1,0,0,
				1,1,0,1,0,0,1,0,
				0,1,0,0,1,0,1,1,
				0,0,1,0,ratio.y,1
			]),
            indices: 
			[
				0, 1, 2,
				3, 4, 5, 3, 5, 6,
				7, 8, 9, 7, 9, 10,
				11, 12, 13, 11, 13, 14,
				15, 16, 17,
            ]
        };
		
		return newone;
    }
})();