(function () {

    SceneJS.Types.addType("architectures/pillar_R", {

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

        var coreId = "architecture/pillar_R" + x + "_" + y + "_" + z + (params.wire ? "wire" : "_solid");

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
                13 , 1 , -8 , 12.3505 , 1 , -8 , 12.3505 , 14.503 , -8 , 13 , 14.503 , -8 , 
				13 , 14.503 , -8 , 13 , 14.503 , -7.29939 , 13 , 1 , -7.29939 , 13 , 1 , -8 , 
				12.3503 , 14.5028 , -7.29957 , 12.3503 , 1 , -7.29957 , 13 , 1 , -7.29939 , 13 , 14.503 , -7.29939 , 
				12.3505 , 14.503 , -8 , 12.3505 , 1 , -8 , 12.3503 , 1 , -7.29957 , 12.3503 , 14.5028 , -7.29957 , 
				13 , 1 , -8 , 13 , 1 , -7.29939 , 12.3503 , 1 , -7.29957 , 12.3505 , 1 , -8 , 
				13 , 14.503 , -7.29939 , 13 , 14.503 , -8 , 12.3505 , 14.503 , -8 , 12.3503 , 14.5028 , -7.29957 
            ]),
            normals:new Float32Array([
                0 , 0 , -1 , 0 , 0 , -1 , 0 , 0 , -1 , 0 , 0 , -1 , 
				1 , 0 , 0 , 1 , 0 , 0 , 1 , 0 , 0 , 1 , 0 , 0 , 
				-0.000284 , 0 , 1 , -0.000284 , 0 , 1 , -0.000284 , 0 , 1 , -0.000284 , 0 , 1 , 
				-1 , 0 , -0.000365 , -1 , 0 , -0.000365 , -1 , 0 , -0.000365 , -1 , 0 , -0.000365 , 
				0 , -1 , 0 , 0 , -1 , 0 , 0 , -1 , 0 , 0 , -1 , 0 , 
				-0.000157 , 1 , 0.000145 , -0.000157 , 1 , 0.000145 , -0.000157 , 1 , 0.000145 , -0.000157 , 1 , 0.000145 , 
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