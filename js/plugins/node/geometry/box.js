/**
 * Box geometry node type
 *
 * @author xeolabs / http://xeolabs.com
 *
 * <p>Usage example:</p>
 *
 * <pre>
 * someNode.addNode({
 *      type: "geometry/box",
 *      xSize: 10,
 *      ySize: 20,
 *      zSize: 1.5,
 *      wire: false // Default
 *  });
 *  </pre>
 */
(function () {

    SceneJS.Types.addType("geometry/box", {

        construct:function (params) {
            this.addNode(build.call(this, params));
        }
    });

    function build(params) {

        var x, y, z;
        if (params.size) {
            x = params.size.x;
            y = params.size.y;
            z = params.size.z;
        } 

       // Otherwise, create a new geometry
        return {
            type:"geometry",
            primitive: "triangles",
            positions:new Float32Array([
                x, y, z, -x, y, z, -x, -y, z, x, -y, z, // v0-v1-v2-v3 front 0 1 2 3
                x, y, z, x, -y, z, x, -y, -z, x, y, -z, // v0-v3-v4-v5 right 4 5 6 7
                x, y, z, x, y, -z, -x, y, -z, -x, y, z, // v0-v5-v6-v1 top   8 9 10 11
                -x, y, z, -x, y, -z, -x, -y, -z, -x, -y, z, // v1-v6-v7-v2 left
                -x, -y, -z, x, -y, -z, x, -y, z, -x, -y, z, // v7-v4-v3-v2 bottom
                x, -y, -z, -x, -y, -z, -x, y, -z, x, y, -z // v4-v7-v6-v5 back
            ]),
            normals:new Float32Array([
                0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, // v0-v1-v2-v3 front
                1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, // v0-v3-v4-v5 right
                0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, // v0-v5-v6-v1 top
                -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, // v1-v6-v7-v2 left
                0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, // v7-v4-v3-v2 bottom
                0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1     // v4-v7-v6-v5 back
            ]),
            uv:new Float32Array([
                x, y, 0, y, 0, 0, x, 0, // v0-v1-v2-v3 front
                0, y, 0, 0, x, 0, x, y, // v0-v3-v4-v5 right
                x, 0, x, y, 0, y, 0, 0, // v0-v5-v6-v1 top
                x, y, 0, y, 0, 0, x, 0, // v1-v6-v7-v2 left
                0, 0, x, 0, x, y, 0, y, // v7-v4-v3-v2 bottom
                0, 0, x, 0, x, y, 0, y    // v4-v7-v6-v5 back
            ]),
            indices:[
                0, 1, 2, 0, 2, 3, // front
                4, 5, 6, 4, 6, 7, // right
                8, 9, 10, 8, 10, 11, // top
                12, 13, 14, 12, 14, 15, // left
                16, 17, 18, 16, 18, 19, // bottom
                20, 21, 22, 20, 22, 23   // back
            ]
        };
    }
})();
