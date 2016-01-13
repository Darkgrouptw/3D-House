(function () 
{

    SceneJS.Types.addType("Base/Basic", 
	{
        construct:function (params) { this.addNode(build.call(this, params)); }
    });

    function build(params) 
	{
        var x, y, z, center;
        if(params.width && params.height && params.thickness) 
		{
            x = params.width;
            y = params.thickness;
            z = params.height;
        } 
		else { x = 20; y = 0.5;z = 20; }
		
		if(params.center) { center = params.center; }
		else { center = {x: 0, y: 0, z: 0}; }

        var coreId = "Base/Basic" + x + "_" + y + "_" + z + (params.wire ? "wire" : "_solid");

        // If a node core already exists for a prim with the given properties,
        // then for efficiency we'll share that core rather than create another geometry
        if (this.getScene().hasCore("geometry", coreId)) { return { type:"geometry", coreId:coreId }; }

		positionSet = new Float32Array(
		[
			x, y, z, -x, y, z, -x, -y, z, x, -y, z, // v0-v1-v2-v3 front
			x, y, z, x, -y, z, x, -y, -z, x, y, -z, // v0-v3-v4-v5 right
			x, y, z, x, y, -z, -x, y, -z, -x, y, z, // v0-v5-v6-v1 top
			-x, y, z, -x, y, -z, -x, -y, -z, -x, -y, z, // v1-v6-v7-v2 left
			-x, -y, -z, x, -y, -z, x, -y, z, -x, -y, z, // v7-v4-v3-v2 bottom
			x, -y, -z, -x, -y, -z, -x, y, -z, x, y, -z // v4-v7-v6-v5 back
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
            uv: new Float32Array([
                1, 1, 0, 1, 0, 0, 1, 0, // v0-v1-v2-v3 front
                0, 1, 0, 0, 1, 0, 1, 1, // v0-v3-v4-v5 right
                1, 0, 1, 1, 0, 1, 0, 0, // v0-v5-v6-v1 top
                1, 1, 0, 1, 0, 0, 1, 0, // v1-v6-v7-v2 left
                0, 0, 1, 0, 1, 1, 0, 1, // v7-v4-v3-v2 bottom
                0, 0, 1, 0, 1, 1, 0, 1    // v4-v7-v6-v5 back
            ]),
            indices: [
                0, 1, 2, 0, 2, 3, // front
                4, 5, 6, 4, 6, 7, // right
                8, 9, 10, 8, 10, 11, // top
                12, 13, 14, 12, 14, 15, // left
                16, 17, 18, 16, 18, 19, // bottom
                20, 21, 22, 20, 22, 23   // back
            ]
        };
		
		return newone;
    }
})();