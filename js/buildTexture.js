function buildZigzag(mainPos, segH, paramE, boundS)
{
	var p1 = [mainPos[0], mainPos[1], mainPos[2]];
    var p2 = [mainPos[3], mainPos[4], mainPos[5]];
    var p3 = [mainPos[6], mainPos[7], mainPos[8]];
    var p4 = [mainPos[9], mainPos[10], mainPos[11]];

    var v3 = [];
    var mulBound = function(c) { return c*boundS; };
	v3 = scaleUnitVector(p1, p2, p4);
    v3 = v3.map(mulBound);

    var pos = [];
    pos.push(mainPos[0] - v3[0]);
    pos.push(mainPos[1] - v3[1]);
    pos.push(mainPos[2] - v3[2]);

	v3 = scaleUnitVector(p2, p3, p1);
    v3 = v3.map(mulBound);

    pos.push(mainPos[3] - v3[0]);
    pos.push(mainPos[4] - v3[1]);
    pos.push(mainPos[5] - v3[2]);

	v3 = scaleUnitVector(p3, p4, p2);
    v3 = v3.map(mulBound);

    pos.push(mainPos[6] - v3[0]);
    pos.push(mainPos[7] - v3[1]);
    pos.push(mainPos[8] - v3[2]);

	v3 = scaleUnitVector(p4, p1, p3);
    v3 = v3.map(mulBound);

    pos.push(mainPos[9] - v3[0]);
    pos.push(mainPos[10] - v3[1]);
    pos.push(mainPos[11] - v3[2]);

	var positions = [];
	var uvs = [];
	var indices = [];

	var segW = 1;
	var ix, iz;
		
    for(var num = 0; num < segH + 1 ; num++)
    {
        var len = 1 / segH;

        var newLX = LinearInterpolate(pos[3], pos[0], len * num);
        var newLY = LinearInterpolate(pos[4], pos[1], len * num);
        var newLZ = LinearInterpolate(pos[5], pos[2], len * num);

        var newRX = LinearInterpolate(pos[6], pos[9], len * num);
        var newRY = LinearInterpolate(pos[7], pos[10], len * num);
        var newRZ = LinearInterpolate(pos[8], pos[11], len * num);

        if(num != 0)
        {
            positions.push(newLX + paramE[0]);
            positions.push(newLY + paramE[1]);
            positions.push(newLZ + paramE[2]);

            positions.push(newRX + paramE[0]);
            positions.push(newRY + paramE[1]);
            positions.push(newRZ + paramE[2]);

            if(num != segH)
            {
                positions.push(newLX);
                positions.push(newLY);
                positions.push(newLZ);

                positions.push(newRX);
                positions.push(newRY);
                positions.push(newRZ);
            }
            else
            {
                positions.push(newLX);
                positions.push(newLY);
                positions.push(newLZ);

                positions.push(newRX);
                positions.push(newRY);
                positions.push(newRZ);
            }
        }
        else
        {
            positions.push(newLX);
            positions.push(newLY);
            positions.push(newLZ);

            positions.push(newRX);
            positions.push(newRY);
            positions.push(newRZ);
        }

    }

	for (iz = 0; iz < (segH * 2); iz++) {
		for (ix = 0; ix < segW; ix++) {
			uvs.push(1);
			uvs.push(0);

			uvs.push(0);
			uvs.push(0);
			
			uvs.push(1);
			uvs.push(1);
			
			uvs.push(0);
			uvs.push(1);
		}
	}

    var a;
    var b;
    var c;
    var d;

    for (iz = 0; iz < (segH * 2); iz++) {
        for (ix = 0; ix < segW; ix++) {

            a = ix + 2 * iz; // 0
            b = ix + 2 * ( iz + segW ); // 2
            c = ( ix + segW ) + 2 * ( iz + segW ); // 3
            d = ( ix + segW ) + 2 * iz; // 1
			
            indices.push(a);
            indices.push(b);
            indices.push(c);

            indices.push(a);
            indices.push(c);
            indices.push(d);
        }
    }

    // uvs.push(0.5);
    // uvs.push(1);
    // uvs.push(0);
    // uvs.push(0);
    // uvs.push(1);
    // uvs.push(0);

    // uvs.push(0.5);
    // uvs.push(1);
    // uvs.push(0);
    // uvs.push(0);
    // uvs.push(1);
    // uvs.push(0);


    // uvs.push(0.5);
    // uvs.push(1);
    // uvs.push(0);
    // uvs.push(0);
    // uvs.push(1);
    // uvs.push(0);


    // uvs.push(0.5);
    // uvs.push(1);
    // uvs.push(0);
    // uvs.push(0);
    // uvs.push(1);
    // uvs.push(0);

    // // ----- indices
    // indices.push(0);
    // indices.push(4);
    // indices.push(2);

    // indices.push(4);
    // indices.push(8);
    // indices.push(6);

    // indices.push(1);
    // indices.push(3);
    // indices.push(5);

    // indices.push(5);
    // indices.push(7);
    // indices.push(9);


    for (iz = 0; iz < (segH * 2); iz++) {
        for (ix = 0; ix < segW; ix++) {

            a = ix + 2 * iz; // 0
            b = ix + 2 * ( iz + segW ); // 2
            c = ( ix + segW ) + 2 * ( iz + segW ); // 3
            d = ( ix + segW ) + 2 * iz; // 1

            if(iz % 2 == 0)
            {
                uvs.push(0.5);
                uvs.push(1);
                uvs.push(0);
                uvs.push(0);
                uvs.push(1);
                uvs.push(0);

                indices.push(a);
                indices.push(b + 2);
                indices.push(b);
                
                uvs.push(0.5);
                uvs.push(1);
                uvs.push(0);
                uvs.push(0);
                uvs.push(1);
                uvs.push(0);
                indices.push(d);
                indices.push(c);
                indices.push(c + 2);
            }
        }
    }

	
    var idx = positions.length / 3;
    for(var i = 0; i < mainPos.length; i++)
    {
        positions.push(mainPos[i]);
    }
	

    for (iz = 0; iz < (segH * 2); iz++) {
		for (ix = 0; ix < segW; ix++) {
            uvs.push(1);
            uvs.push(0);

            uvs.push(0);
            uvs.push(0);
            
            uvs.push(1);
            uvs.push(1);
            
            uvs.push(0);
            uvs.push(1);

			// uvs.push(ix / 1 );
			// uvs.push(1 - iz / (segH * 2 ));

			// uvs.push(ix / 1 );
			// uvs.push(1 - (iz + 1) / (segH * 2 ));

			// uvs.push((ix + 1) / 1 );
			// uvs.push(1 - (iz + 1) / (segH * 2 ));

			// uvs.push((ix + 1) / 1 );
			// uvs.push(1 - iz / (segH * 2 ));
		}
	}

    indices.push(idx + 1);
    indices.push(idx);
    indices.push(idx - 2);
    indices.push(idx - 2);
    indices.push(0);
    indices.push(idx + 1);

    indices.push(idx + 1);
    indices.push(0);
    indices.push(1);
    indices.push(1);
    indices.push(idx + 2);
    indices.push(idx + 1);

    indices.push(idx + 2);
    indices.push(1);
    indices.push(idx - 1);
    indices.push(idx - 1);
    indices.push(idx + 3);
    indices.push(idx + 2);

    indices.push(idx - 2);
    indices.push(idx);
    indices.push(idx + 3);
    indices.push(idx + 3);
    indices.push(idx - 1);
    indices.push(idx - 2); 

    return {
        positions: positions,
        normals: "auto", 
        uv: uvs,
        indices:indices
    };
}

function scaleUnitVector(p0, p1, p2)
{
	var v1 = [];
    var v2 = [];
    var v3 = [];
    var norV1 = [];
    var norV2 = [];

    SceneJS_math_subVec3(p0,p1,v1);
    SceneJS_math_subVec3(p0,p2,v2);
    SceneJS_math_normalizeVec3(v1,norV1);
    SceneJS_math_normalizeVec3(v2,norV2);
    SceneJS_math_addVec3(norV1,norV2,v3);
	
	return v3;
}

function LinearInterpolate(p0, p1, mu)
{
    return p0 * (1 - mu) + p1 * mu;
}
