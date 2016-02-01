(function () 
{
    SceneJS.Types.addType("base/circle", { construct: function (params) {this.addNode(build.call(this, params)); }});

    function build(params) 
	{
        /* config */
        var radiusTop = params.radius !== undefined ? params.radius : 0;
        var radiusBottom = radiusTop;
        var height = params.thick !== undefined ? params.thick: 0;

        var radialSegments   = 60;
        var heightSegments   = 1;

        var openEnded = params.openEnded || false;
        /* config end */

        var heightHalf = height / 2;
        var heightLength = height / heightSegments;

        var radialAngle = (2.0 * Math.PI / radialSegments);
        var radialLength = 1.0 / radialSegments;

        var nextRadius = this.radiusBottom;
        var radiusChange = (radiusTop - radiusBottom) / heightSegments;

        var positions = [];
        var normals = [];
        var uvs = [];
        var indices = [];

        // create vertices
        var normalY = (90.0 - (Math.atan(height / (radiusBottom - radiusTop))) * 180/Math.PI) / 90.0;

        for (var h = 0; h <= heightSegments; h++) 
		{
            var currentRadius = radiusTop - h * radiusChange;
            var currentHeight = heightHalf - h * heightLength

            for (var i=0; i <= radialSegments; i++) 
			{
                var x = Math.sin(i * radialAngle);
                var z = Math.cos(i * radialAngle);

                normals.push(currentRadius * x);
                normals.push(normalY); //todo
                normals.push(currentRadius * z);
                uvs.push(1 - (i * radialLength));
                uvs.push(0 + h * 1 / heightSegments);
                positions.push(currentRadius * x);
                positions.push(currentHeight);
                positions.push(currentRadius * z);
            }
        }

        // create faces
        for (var h = 0; h < heightSegments; h++) 
		{
            for (var i=0; i <= radialSegments; i++) 
			{
                var first = h * (radialSegments + 1) + i;
                var second = first + radialSegments;
                indices.push(first);
                indices.push(second);
                indices.push(second + 1);

                indices.push(first);
                indices.push(second + 1);
                indices.push(first + 1);
            }
        }

        // create top cap
        if (!openEnded && radiusTop > 0) 
		{
            var startIndex = (positions.length / 3);

            // top center
            normals.push(0.0);
            normals.push(1.0);
            normals.push(0.0);
            uvs.push(0.5);
            uvs.push(0.5);
            positions.push(0);
            positions.push(heightHalf);
            positions.push(0);

            // top triangle fan
            for (var i=0; i <= radialSegments; i++) 
			{
                var x = Math.sin(i * radialAngle);
                var z = Math.cos(i * radialAngle);
                var tu = (0.5 * Math.sin(i * radialAngle)) + 0.5;
                var tv = (0.5 * Math.cos(i * radialAngle)) + 0.5;

                normals.push(radiusTop * x);
                normals.push(1.0);
                normals.push(radiusTop * z);
                uvs.push(tu);
                uvs.push(tv);
                positions.push(radiusTop * x);
                positions.push(heightHalf);
                positions.push(radiusTop * z);
            }

            for (var i=0; i < radialSegments; i++) 
			{
                var center = startIndex;
                var first = startIndex + 1 + i;
                indices.push(first);
                indices.push(first + 1);
                indices.push(center);
            }
        }

        // create bottom cap
        if (!openEnded && radiusBottom > 0) 
		{
            var startIndex = (positions.length/3);

            // top center
            normals.push(0.0);
            normals.push(-1.0);
            normals.push(0.0);
            uvs.push(0.5);
            uvs.push(0.5);
            positions.push(0);
            positions.push(0-heightHalf);
            positions.push(0);

            // top triangle fan
            for (var i=0; i <= radialSegments; i++) 
			{
                var x = Math.sin(i * radialAngle);
                var z = Math.cos(i * radialAngle);
                var tu = (0.5 * Math.sin(i * radialAngle)) + 0.5;
                var tv = (0.5 * Math.cos(i * radialAngle)) + 0.5;

                normals.push(radiusBottom * x);
                normals.push(-1.0);
                normals.push(radiusBottom * z);
                uvs.push(tu);
                uvs.push(tv);
                positions.push(radiusBottom * x);
                positions.push(0 - heightHalf);
                positions.push(radiusBottom * z);
            }

            for (var i=0; i < radialSegments; i++) 
			{
                var center = startIndex;
                var first = startIndex + 1 + i;
                indices.push(first);
                indices.push(first + 1);
                indices.push(center);
            }
        }
	
		var center = params.center !== undefined? params.center: {x: 0, y: 0, z: 0};
		
		for(var pidx = 0; pidx < positions.length; pidx = pidx + 3)
		{
			positions[pidx] = positions[pidx] + center.x;
			positions[pidx + 1] = positions[pidx + 1] + center.y;
			positions[pidx + 2] = positions[pidx + 2] + center.z;
		}

        return {
            type: "geometry",
            primitive: params.wire ? "lines" : "triangles",
            coreId : "circle_" + SceneJS_add_randomString(20) + "_" + (params.wire ? "wire" : "solid"),
            positions : new Float32Array(positions),
            normals: new Float32Array(normals),
            uv : new Float32Array(uvs),
            indices : indices
        };
    }
})();