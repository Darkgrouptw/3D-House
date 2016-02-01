(function () {

    SceneJS.Types.addType("roof/gable", { construct:function (params) { this.addNode(build.call(this, params)); }});

    function build(params) 
	{
        var width, height, lenght, thick;
        if(params.size && params.thick) 
		{
            width = params.size.y / 2;
			lenght = params.size.x / 2;
            height = params.size.z / 2;
            thick = params.thick;
        } 
		else { width = 0; height = 0; thick = 0; lenght = 0; }
		
		var center = params.center !== undefined? params.center: { x: 0, y: 0, z: 0};
		var ratio = params.ratio !== undefined? params.ratio: {a: 0, b: 0};
		var patch = params.patch !== undefined? params.patch: {a: 0, b: 0};

        var coreId = "roof/gable" + "_" + SceneJS_add_randomString(20) + "_" + (params.wire ? "wire" : "solid");

        // If a node core already exists for a prim with the given properties,
        // then for efficiency we'll share that core rather than create another geometry
        if (this.getScene().hasCore("geometry", coreId)) { return { type:"geometry", coreId:coreId }; }

		var bevelEdge = (thick * 2 ) / Math.sqrt(3) ;
		
		var positionSet = [
			// Back
			(width * ratio.a + -width * ratio.b) / 2, height + bevelEdge, -lenght,
			-width - bevelEdge, -height, -lenght,
			-width - bevelEdge, -height, lenght,
			(width * ratio.a + -width * ratio.b) / 2, height + bevelEdge, lenght,
			
			// Back Right
			(width * ratio.a + -width * ratio.b) / 2, height + bevelEdge, -lenght,
			-width - bevelEdge, -height, -lenght,
			-width, -height, -lenght,
			(width * ratio.a + -width * ratio.b) / 2, height, -lenght,
			
			// Back Buttom
			-width - bevelEdge, -height, -lenght,
			-width - bevelEdge, -height, lenght,
			 -width, -height, lenght,
			 -width, -height, -lenght,
			 
			 // Back Left
			 (width * ratio.a + -width * ratio.b) / 2, height + bevelEdge, lenght,
			 -width - bevelEdge, -height, lenght,
			 -width, -height, lenght,
			 (width * ratio.a + -width * ratio.b) / 2, height, lenght,
			 
			 // Front
			(width * ratio.a + -width * ratio.b) / 2, height + bevelEdge, -lenght,
			width + bevelEdge, -height, -lenght,	
			width + bevelEdge, -height, lenght,
			(width * ratio.a + -width * ratio.b) / 2, height + bevelEdge, lenght,
			
			// Front Right
			(width * ratio.a + -width * ratio.b) / 2, height + bevelEdge, -lenght,
			width + bevelEdge, -height, -lenght,	
			width, -height, -lenght,
			(width * ratio.a + -width * ratio.b) / 2, height, -lenght,
			
			// Front Buttom
			width + bevelEdge, -height, -lenght,
			width + bevelEdge, -height, lenght,
			width, -height, lenght,
			width, -height, -lenght,
			
			// Front Left
			(width * ratio.a + -width * ratio.b) / 2, height + bevelEdge, lenght,
			width + bevelEdge, -height, lenght,
			width, -height, lenght,
			(width * ratio.a + -width * ratio.b) / 2, height, lenght,
			
			// Back Inside
			(width * ratio.a + -width * ratio.b) / 2, height, -lenght,
			(width * ratio.a + -width * ratio.b) / 2, height, lenght,
			-width, -height, lenght,
			-width, -height, -lenght,
			
			// Front Inside
			(width * ratio.a + -width * ratio.b) / 2, height, -lenght,
			(width * ratio.a + -width * ratio.b) / 2, height, lenght,
			width, -height, lenght,
			width, -height, -lenght,
		];
		
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
			normal: "auto",
			uv: new Float32Array([
				0, 1, 0, 0, 1, 0, 1, 1,			// Back 
				1, 1, 1, 0, 0, 0, 0, 1,			// Back Right
				0, 1, 1, 1, 1, 0, 0, 0,			// Back Buttom
				0, 1, 0, 0, 1, 0, 1, 1,			// Back Left
				
				1, 1, 1, 0, 0, 0, 0, 1,			// Front
				0, 1, 0, 0, 1, 0, 1, 1,			// Front Right
				1, 1, 0, 1, 0, 0, 1, 1,			// Front Buttom
				1, 0, 0, 0, 0, 1, 1, 1,			// Front Left
				
				1, 1, 0, 1, 0, 0, 1, 0,			// Back Inside
				0, 1, 1, 1, 1, 0, 0, 0			// Front Inside
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