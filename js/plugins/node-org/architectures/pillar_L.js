(function () {

    SceneJS.Types.addType("architectures/pillar_L", {

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

        var coreId = "architecture/pillar_L" + x + "_" + y + "_" + z + (params.wire ? "wire" : "_solid");

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
                -13 , 14.503 , -7.29592 , -13 , 14.503 , -8 , -13 , 1 , -8 , -13 , 1 , -7.29592 , 
				-12.3493 , 1 , -7.2961 , -12.3493 , 14.5028 , -7.2961 , -13 , 14.503 , -7.29592 , -13 , 1 , -7.29592 , 
				-12.3487 , 14.503 , -8 , -12.3487 , 1 , -8 , -13 , 1 , -8 , -13 , 14.503 , -8 , 
				-12.3487 , 1 , -8 , -12.3487 , 14.503 , -8 , -12.3493 , 14.5028 , -7.2961 , -12.3493 , 1 , -7.2961 , 
				-13 , 1 , -8 , -12.3487 , 1 , -8 , -12.3493 , 1 , -7.2961 , -13 , 1 , -7.29592 , 
				-12.3493 , 14.5028 , -7.2961 , -12.3487 , 14.503 , -8 , -13 , 14.503 , -8 , -13 , 14.503 , -7.29592 
            ]),
            normals:new Float32Array([
                -1 , 0 , 0 , -1 , 0 , 0 , -1 , 0 , 0 , -1 , 0 , 0 , 
				0.000282 , 0 , 1 , 0.000282 , 0 , 1 , 0.000282 , 0 , 1 , 0.000282 , 0 , 1 , 
				0 , 0 , -1 , 0 , 0 , -1 , 0 , 0 , -1 , 0 , 0 , -1 , 
				1 , 0 , 0.000931 , 1 , 0 , 0.000931 , 1 , 0 , 0.000931 , 1 , 0 , 0.000931 , 
				0 , -1 , 0 , 0 , -1 , 0 , 0 , -1 , 0 , 0 , -1 , 0 , 
				0.000157 , 1 , 0.000144 , 0.000157 , 1 , 0.000144 , 0.000157 , 1 , 0.000144 , 0.000157 , 1 , 0.000144 
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