(function () {

    SceneJS.Types.addType("wall/no_window", { construct: function (params) { this.addNode(build.call(this, params)); } });

    function build(params) 
	{
        var x, y, z, thick, center;
		
		// This size is pair value
        if(params.size && params.thick) 
		{
            y = params.size.a / 2;
            z = params.size.b / 2;
			x = params.thick / 2;
        } 
		else { x = 0; y = 0; z = 0; }
		
		if(params.center) { center = params.center; }
		else { center = {x: 0, y: 0, z: 0}; }

        var coreId = "wall/no_window" + "_" + SceneJS_add_randomString(20) + "_" + (params.wire ? "wire" : "solid");

        // If a node core already exists for a prim with the given properties,
        // then for efficiency we'll share that core rather than create another geometry
        if (this.getScene().hasCore("geometry", coreId)) { return { type:"geometry", coreId: coreId }; }

		var positionSet = new Float32Array(
		[
			x, y, z, -x, y, z, -x, -y, z, x, -y, z,
			x, y, z, x, -y, z, x, -y, -z, x, y, -z,
			x, y, z, x, y, -z, -x, y, -z, -x, y, z,
			-x, y, z, -x, y, -z, -x, -y, -z, -x, -y, z,
			-x, -y, -z, x, -y, -z, x, -y, z, -x, -y, z,
			x, -y, -z, -x, -y, -z, -x, y, -z, x, y, -z
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
            normals: new Float32Array([
                0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1,
                1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0,
                0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0,
                -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0,
                0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0,
                0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1 
            ]),
            indices: [
                0, 1, 2, 0, 2, 3,
                4, 5, 6, 4, 6, 7,
                8, 9, 10, 8, 10, 11,
                12, 13, 14, 12, 14, 15,
                16, 17, 18, 16, 18, 19,
                20, 21, 22, 20, 22, 23
            ]
        };
		
		return newone;
    }
})();