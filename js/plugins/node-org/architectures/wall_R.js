(function () {

    SceneJS.Types.addType("architectures/wall_R", {

        construct:function (params) {
            this.addNode(build.call(this, params));
        }
    });

    function build(params) {

        var x, y, z;
        if (params.size) {
            x = params.size[0];
            y = params.size[1];
            z = params.size[2];
        } else {
            // Deprecated
            x = params.xSize || 1;
            y = params.ySize || 1;
            z = params.zSize || 1;
        }

        var coreId = "architecture/wall_R" + x + "_" + y + "_" + z + (params.wire ? "wire" : "_solid");

        // If a node core already exists for a prim with the given properties,
        // then for efficiency we'll share that core rather than create another geometry
        if (this.getScene().hasCore("geometry", coreId)) {
            return {
                type:"geometry",
                coreId:coreId
            };
        }

        // Otherwise, create a new geometry
        return {
            type:"geometry",
            primitive:params.wire ? "lines" : "triangles",
            coreId:coreId,
            positions:new Float32Array([
                12.35 , 14.5028 , -7.31461 , 12.35 , 1 , -7.31461 , 12.35 , 1 , 7.39429 , 12.35 , 14.5028 , 7.39429 , 
				12.9712 , 14.503 , -7.31399 , 12.9712 , 14.503 , 7.39236 , 12.9712 , 1 , 7.39236 , 12.9712 , 1 , -7.31399 , 
				12.35 , 14.5028 , 7.39429 , 12.35 , 1 , 7.39429 , 12.9712 , 1 , 7.39236 , 12.9712 , 14.503 , 7.39236 , 
				12.35 , 14.5028 , -7.31461 , 12.35 , 14.5028 , 7.39429 , 12.9712 , 14.503 , 7.39236 , 12.9712 , 14.503 , -7.31399 , 
				12.35 , 1 , 7.39429 , 12.35 , 1 , -7.31461 , 12.9712 , 1 , -7.31399 , 12.9712 , 1 , 7.39236 , 
				12.35 , 1 , -7.31461 , 12.35 , 14.5028 , -7.31461 , 12.9712 , 14.503 , -7.31399 , 12.9712 , 1 , -7.31399 , 
            ]),
            normals:new Float32Array([
                -1 , 0 , 0 , -1 , 0 , 0 , -1 , 0 , 0 , -1 , 0 , 0 , 
				1 , 0 , 0 , 1 , 0 , 0 , 1 , 0 , 0 , 1 , 0 , 0 , 
				0.002968 , 0 , 0.999996 , 0.002968 , 0 , 0.999996 , 0.002968 , 0 , 0.999996 , 0.002968 , 0 , 0.999996 , 
				-0.000314 , 1 , 0 , -0.000314 , 1 , 0 , -0.000314 , 1 , 0 , -0.000314 , 1 , 0 , 
				0 , -1 , 0 , 0 , -1 , 0 , 0 , -1 , 0 , 0 , -1 , 0 , 
				0.000955 , 0 , -1 , 0.000955 , 0 , -1 , 0.000955 , 0 , -1 , 0.000955 , 0 , -1
            ]),
            // uv:new Float32Array([
                // x, y, 0, y, 0, 0, x, 0, // v0-v1-v2-v3 front
                // 0, y, 0, 0, x, 0, x, y, // v0-v3-v4-v5 right
                // x, 0, x, y, 0, y, 0, 0, // v0-v5-v6-v1 top
                // x, y, 0, y, 0, 0, x, 0, // v1-v6-v7-v2 left
                // 0, 0, x, 0, x, y, 0, y, // v7-v4-v3-v2 bottom
                // 0, 0, x, 0, x, y, 0, y    // v4-v7-v6-v5 back
            // ]),
            indices:[
                  0,  1,  2,  0,  2,  3,
				 4,  5,  6,  4,  6,  7,
				 8,  9, 10,  8, 10, 11,
				12, 13, 14, 12, 14, 15,
				16, 17, 18, 16, 18, 19,
				20, 21, 22, 20, 22, 23
			]
        };
    }
})();