function buildZigzag(mainPos, segH, paramE, boundS)
{
	var p1 = [mainPos[0], mainPos[1], mainPos[2]];
    var p2 = [mainPos[3], mainPos[4], mainPos[5]];
    var p3 = [mainPos[6], mainPos[7], mainPos[8]];
    var p4 = [mainPos[9], mainPos[10], mainPos[11]];

    var v1 = [];
    var v2 = [];
    var v3 = [];
    var norV1 = [];
    var norV2 = [];

    SceneJS_math_subVec3(p1,p2,v1);
    SceneJS_math_subVec3(p1,p4,v2);
    SceneJS_math_normalizeVec3(v1,norV1);
    SceneJS_math_normalizeVec3(v2,norV2);
    SceneJS_math_addVec3(norV1,norV2,v3);

    var mulBound = function(c) { return c*boundS; };
    v3 = v3.map(mulBound);

    var pos = [];
    pos.push(mainPos[0] - v3[0]);
    pos.push(mainPos[1] - v3[1]);
    pos.push(mainPos[2] - v3[2]);

    SceneJS_math_subVec3(p2,p3,v1);
    SceneJS_math_subVec3(p2,p1,v2);
    SceneJS_math_normalizeVec3(v1,norV1);
    SceneJS_math_normalizeVec3(v2,norV2);
    SceneJS_math_addVec3(norV1,norV2,v3);
    v3 = v3.map(mulBound);

    pos.push(mainPos[3] - v3[0]);
    pos.push(mainPos[4] - v3[1]);
    pos.push(mainPos[5] - v3[2]);

    SceneJS_math_subVec3(p3,p4,v1);
    SceneJS_math_subVec3(p3,p2,v2);
    SceneJS_math_normalizeVec3(v1,norV1);
    SceneJS_math_normalizeVec3(v2,norV2);
    SceneJS_math_addVec3(norV1,norV2,v3);
    v3 = v3.map(mulBound);

    pos.push(mainPos[6] - v3[0]);
    pos.push(mainPos[7] - v3[1]);
    pos.push(mainPos[8] - v3[2]);

    SceneJS_math_subVec3(p4,p1,v1);
    SceneJS_math_subVec3(p4,p3,v2);
    SceneJS_math_normalizeVec3(v1,norV1);
    SceneJS_math_normalizeVec3(v2,norV2);
    SceneJS_math_addVec3(norV1,norV2,v3);
    v3 = v3.map(mulBound);

    pos.push(mainPos[9] - v3[0]);
    pos.push(mainPos[10] - v3[1]);
    pos.push(mainPos[11] - v3[2]);

	var VertexY = [];
	VertexY.push(pos[1]);
	VertexY.push(pos[4]);
	VertexY.push(pos[7]);
	VertexY.push(pos[10]);
	VertexY.sort(function(a, b){return a-b});

	var positions = [];
	var normals = [];
	var uvs = [];
	var indices = [];

	var segW = 1;
	var ix, iz;
		
    for(var num = 0; num < segH + 1 ; num++)
    {
        var len = 1 / segH;

        var beforeY = LinearInterpolate(VertexY[3], VertexY[0], len * num);
        var afterY = LinearInterpolate(VertexY[3], VertexY[0], len * (num + 1) );
        //console.log("before Y ", beforeY, " after Y ", afterY);

        var newLX = LinearInterpolate(pos[3], pos[0], len * num);
        var newLY = LinearInterpolate(pos[4], pos[1], len * num);
        var newLZ = LinearInterpolate(pos[5], pos[2], len * num);

        positions.push(newLX);
        positions.push(newLY);
        positions.push(newLZ);

        var newRX = LinearInterpolate(pos[6], pos[9], len * num);
        var newRY = LinearInterpolate(pos[7], pos[10], len * num);
        var newRZ = LinearInterpolate(pos[8], pos[11], len * num);
        positions.push(newRX);
        positions.push(newRY);
        positions.push(newRZ);

        if(num != segH)
        {
            positions.push(newLX + paramE[0]);
            positions.push(newLY + paramE[1]);
            positions.push(newLZ + paramE[2]);

            positions.push(newRX + paramE[0]);
            positions.push(newRY + paramE[1]);
            positions.push(newRZ + paramE[2]);
        }
    }

    for (iz = 0; iz < (segH * 2) + 1; iz++) {
        for (ix = 0; ix < (segW + 1); ix++) {
            normals.push(0);
            normals.push(0);
            normals.push(1);

            uvs.push(ix / 1 );
            uvs.push(1 - iz / (segH * 2 ));
        }
    }

    var a;
    var b;
    var c;
    var d;

    for (iz = 0; iz < (segH * 2); iz++) {
        for (ix = 0; ix < segW; ix++) {

            a = ix + 2 * iz;
            b = ix + 2 * ( iz + segW );
            c = ( ix + segW ) + 2 * ( iz + segW );
            d = ( ix + segW ) + 2 * iz;

            indices.push(a);
            indices.push(b);
            indices.push(c);

            indices.push(a);
            indices.push(c);
            indices.push(d);

            var tmpA, tmpB, tmpC, tmpD;
            if(iz % 2 != 0 && iz > 0)
            {
                indices.push(tmpA);
                indices.push(b);
                indices.push(tmpB);

                indices.push(tmpD);
                indices.push(c);
                indices.push(tmpC);

                tmpA = a;
                tmpB = b;
                tmpC = c;
                tmpD = d;
            }
            else
            {
                tmpA = a;
                tmpB = b;
                tmpC = c;
                tmpD = d;
            }
        }
    }


    var idx = positions.length / 3;
    for(var i = 0; i < mainPos.length; i++)
    {
        positions.push(mainPos[i]);

        if(i % 3 != 2)
        {
            normals.push(0);
        }
        else
        {
            normals.push(1);
        }
    }

    for (iz = 0; iz < (segW + 1); iz++) {
        for (ix = 0; ix < (segW + 1); ix++) {

            uvs.push(ix / segW);
            uvs.push(1 - iz / (segH * 2));
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
        normals: "auto", //normals,
        uv: uvs,
        indices:indices
    };
}

function LinearInterpolate(p0, p1, mu)
{
    return p0 * (1 - mu) + p1 * mu;
}
