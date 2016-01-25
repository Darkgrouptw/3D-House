    SceneJS.Types.addType("Wall/NoWindow", 
	{
        construct:function (params) { this.addNode(build.call(this, params)); },
        setCenter:function(point){
            var matrix= this.parent;
            matrix=matrix.parent;
            var mat=matrix.getWorldMatrix();
            mat[12]=point.x;
            mat[13]=point.y;
            mat[14]=point.z;
            matrix.setMatrix(mat);
        },
        getCenter:function(){
            var matrix= this.parent;
            matrix=matrix.parent;
            var mat=matrix.getWorldMatrix();

            var cx=mat[12],cy=mat[13],cz=mat[14];
            return {x: cx, y: cy, z: cz };
        },
        setCenterX:function(x){
            var matrix= this.parent;
            matrix=matrix.parent;
            var mat=matrix.getWorldMatrix();
            mat[12]=x;
            matrix.setMatrix(mat);
        },
        setCenterY:function(y){
            var matrix= this.parent;
            matrix=matrix.parent;
            var mat=matrix.getWorldMatrix();
            mat[13]=y;
            matrix.setMatrix(mat);
        },
        setCenterZ:function(z){
            var matrix= this.parent;
            matrix=matrix.parent;
            var mat=matrix.getWorldMatrix();
            mat[14]=z;
            matrix.setMatrix(mat);
        },
        setWidth:function(wide){
            var geometry= this.findNodesByType("geometry")[0];
            positionSet = geometry.getPositions();
            var x, y, z;
            x=wide;
            y=positionSet[1];
            z=positionSet[2];
            positionSet=generaterPositionSet({ x: x,y: y,z: z});
            geometry.setPositions({positions: positionSet});
        },
        getWidth:function(){
            var geometry= this.findNodesByType("geometry")[0];
            positionSet = geometry.getPositions();
            return positionSet[0];
        },
        setHeight:function(high){
            var geometry= this.findNodesByType("geometry")[0];
            positionSet = geometry.getPositions();
            var x, y, z;
            x=positionSet[0];
            y=positionSet[1];
            z=high;
            positionSet=generaterPositionSet({ x: x,y: y,z: z});
            geometry.setPositions({positions: positionSet});
        },
        getHeight:function(){
            var geometry= this.findNodesByType("geometry")[0];
            positionSet = geometry.getPositions();
            return positionSet[2];
        },
        setThickness:function(thic){
            var geometry= this.findNodesByType("geometry")[0];
            positionSet = geometry.getPositions();
            var x, y, z;
            x=positionSet[0];
            y=thic;
            z=positionSet[2];
            positionSet=generaterPositionSet({ x: x,y: y,z: z});
            geometry.setPositions({positions: positionSet});
        },
        getThickness:function(){
            var geometry= this.findNodesByType("geometry")[0];
            positionSet = geometry.getPositions();
            return positionSet[1];
        },
        callBaseCalibration:function(){
            var backWall=-1;
            var rightWall=-1;
            var leftWall=-1;
            var frontWall=-1;
            var roof=-1;
            var base=-1;
            var nodes=scene.findNodes();
            for(var i=0;i<nodes.length;i++){
                var n = nodes[i];
                if(n.getType()=="name"){
                    if(n.getName()=="backWall"){
                        //         material  name     matrix  texture  element
                        backWall=n.nodes[0].nodes[0].nodes[0].nodes[0].nodes[0];
                    }
                    else if(n.getName()=="frontWall")frontWall=n.nodes[0].nodes[0].nodes[0].nodes[0].nodes[0];
                    else if(n.getName()=="leftWall")leftWall=n.nodes[0].nodes[0].nodes[0].nodes[0].nodes[0];
                    else if(n.getName()=="rightWall")rightWall=n.nodes[0].nodes[0].nodes[0].nodes[0].nodes[0];
                    else if(n.getName()=="roof")roof=n.nodes[0].nodes[0].nodes[0].nodes[0].nodes[0];
                    else if(n.getName()=="base")base=n.nodes[0].nodes[0].nodes[0].nodes[0].nodes[0];
                }
            }
            if(base == -1){
                console.log("ERROR");
                return;
            }
            if(frontWall!=-1 && frontWall.getID() == this.getID()){

            }
            else if(backWall!=-1 && backWall.getID() == this.getID()){
                base.setWidth(this.getWidth())
                base.callBaseCalibration(this.getHeight());
            }
            else if(leftWall!=-1 && leftWall.getID() == this.getID()){
                if(backWall !=-1 && frontWall !=-1){
                }else if(frontWall != -1){

                }else if(backWall != -1){
                    base.setHeight(this.getWidth()+backWall.getThickness());
                    base.callBaseCalibration(this.getHeight());
                }else{

                }
            }
            else if(rightWall!=-1 && rightWall.getID() == this.getID()){
                if(backWall !=-1 && frontWall !=-1){

                }else if(frontWall != -1){

                }else if(backWall != -1){
                    base.setHeight(this.getWidth()+backWall.getThickness());
                    base.callBaseCalibration(this.getHeight());
                }else{
                    
                }
            }
        }
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

        var coreId = "Wall/NoWindow" + x + "_" + y + "_" + z + (params.wire ? "wire" : "_solid");

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
            normals: new Float32Array([
                0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, // v0-v1-v2-v3 front
                1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, // v0-v3-v4-v5 right
                0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, // v0-v5-v6-v1 top
                -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, // v1-v6-v7-v2 left
                0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, // v7-v4-v3-v2 bottom
                0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1     // v4-v7-v6-v5 back
            ]),
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
    function generaterPositionSet(params){
        var x,y,z;
        x=params.x;
        y=params.y;
        z=params.z;
        var positionSet = new Float32Array(
        [
            x, y, z, -x, y, z, -x, -y, z, x, -y, z, // v0-v1-v2-v3 front
            x, y, z, x, -y, z, x, -y, -z, x, y, -z, // v0-v3-v4-v5 right
            x, y, z, x, y, -z, -x, y, -z, -x, y, z, // v0-v5-v6-v1 top
            -x, y, z, -x, y, -z, -x, -y, -z, -x, -y, z, // v1-v6-v7-v2 left
            -x, -y, -z, x, -y, -z, x, -y, z, -x, -y, z, // v7-v4-v3-v2 bottom
            x, -y, -z, -x, -y, -z, -x, y, -z, x, y, -z // v4-v7-v6-v5 back
        ]);
        return positionSet;
    }