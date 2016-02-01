var triangle_w,triangle_h,triangle_rx,triangle_ry,triangle_th;
    SceneJS.Types.addType("wall/triangle", 
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
        	var matrix=this.parent;
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
            triangle_w=wide*1;
            positionSet=generaterPositionSetForTriangle();
            geometry.setPositions({positions: positionSet});
        },
        getWidth:function(){
            return triangle_w*1;
        },
        setHeight:function(high){
            var geometry= this.findNodesByType("geometry")[0];
            triangle_h=high*1;
            positionSet=generaterPositionSetForTriangle();
            geometry.setPositions({positions: positionSet});
        },
        getHeight:function(){
            return triangle_h*1;
        },
        setThickness:function(thic){
            var geometry= this.findNodesByType("geometry")[0];
            triangle_th=thic*1;
            positionSet=generaterPositionSetForTriangle();
            geometry.setPositions({positions: positionSet});
        },
        getThickness:function(){
            return triangle_th*1;
        },
        callBaseCalibration:function(){

        	return;
            var leftTriangle=-1;
            var rightTriangle=-1;
            var roof=-1;
            var nodes=scene.findNodes();
            for(var i=0;i<nodes.length;i++){
                var n = nodes[i];
                if(n.getType()=="name"){
                    if(n.getName()=="roof")roof=n.nodes[0].nodes[0].nodes[0].nodes[0].nodes[0];
                    else if(n.getName()=="leftTriangle")leftTriangle=n.nodes[0].nodes[0].nodes[0].nodes[0].nodes[0];
                    else if(n.getName()=="rightTriangle")rightTriangle=n.nodes[0].nodes[0].nodes[0].nodes[0].nodes[0];
                }
            }
            if(roof == -1){
                console.log("ERROR");
                return;
            }
            if(leftTriangle.getID() == this.getID()){
            	roof.setWidth(this.getWidth());
            	roof.setHeight(this.getHeight());
            	roof.adjustChildren();
            }else if(rightTriangle.getID() == this.getID()){
            	roof.setWidth(this.getWidth());
            	roof.setHeight(this.getHeight());
            	roof.adjustChildren();
            }
        }
    });

    function build(params) 
	{
        var width, height, thickness, center, ratio;
        if(params.width && params.height && params.thickness) 
		{
            width = params.width;
            height = params.height;
            thickness = params.thickness;
        } 
		else { width = 0; height = 0; thickness = 0; }
		
		if(params.center) { center = params.center; }
		else { center = { x: 0, y: 0, z: 0}; }
		
		if(params.ratio) { ratio = params.ratio; }
		else { ratio = { x: 0.5, y: 0.5, z: 1.0 }; }
        var coreId = "wall/triangle" + width + "_" + height + "_" + thickness + (params.wire ? "wire" : "_solid");

        // If a node core already exists for a prim with the given properties,
        // then for efficiency we'll share that core rather than create another geometry
        if (this.getScene().hasCore("geometry", coreId)) { return { type:"geometry", coreId:coreId }; }

        //kasim
        triangle_w=width;triangle_h=height;triangle_rx=ratio.x;triangle_ry=ratio.y;triangle_th=thickness;

		positionSet = new Float32Array(
		[
			// Left Triangle
			-width, -height, -thickness,
			width, -height, -thickness,
			(width * ratio.x + -width * ratio.y) / 2, height, -thickness,
			
			// Back Face
			width, -height, -thickness,
			(width * ratio.x + -width * ratio.y) / 2, height, -thickness,
			(width * ratio.x + -width * ratio.y) / 2, height, thickness,
			width, -height, thickness,
			
			// Front Face
			-width, -height, -thickness,
			(width * ratio.x + -width * ratio.y) / 2, height, -thickness,
			(width * ratio.x + -width * ratio.y) / 2, height, thickness,
			-width, -height, thickness,
			
			// Buttom Face
			-width, -height, -thickness,
			width, -height, -thickness,
			width, -height, thickness,
			-width, -height, thickness,
		
			// Right Triangle
			-width, -height, thickness,
			width, -height, thickness,
			(width * ratio.x + -width * ratio.y) / 2, height, thickness
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
				0,0,-1,0,0,-1,0,0,-1,
				0,0,0,0,0,0,0,0,0,0,0,0,
				0,0,0,0,0,0,0,0,0,0,0,0,
				0,0,0,0,0,0,0,0,0,0,0,0,
				0,0,1,0,0,1,0,0,1
			]),
			uv: new Float32Array([
				0,0,1,0,ratio.x,1,
				1,0,1,1,0,1,0,0,
				1,1,0,1,0,0,1,0,
				0,1,0,0,1,0,1,1,
				0,0,1,0,ratio.y,1
			]),
            indices: 
			[
				0, 1, 2,
				3, 4, 5, 3, 5, 6,
				7, 8, 9, 7, 9, 10,
				11, 12, 13, 11, 13, 14,
				15, 16, 17,
            ]
        };
		
		return newone;
    }

function generaterPositionSetForTriangle(){
	var width,height,ratioX,ratioY,thickness;
	width=triangle_w;height=triangle_h;ratioX=triangle_rx;ratioY=triangle_ry;thickness=triangle_th;

	positionSet = new Float32Array(
		[
			// Left Triangle
			-width, -height, -thickness,
			width, -height, -thickness,
			(width * ratioX + -width * ratioY) / 2, height, -thickness,
			
			// Back Face
			width, -height, -thickness,
			(width * ratioX + -width * ratioY) / 2, height, -thickness,
			(width * ratioX + -width * ratioY) / 2, height, thickness,
			width, -height, thickness,
			
			// Front Face
			-width, -height, -thickness,
			(width * ratioX + -width * ratioY) / 2, height, -thickness,
			(width * ratioX + -width * ratioY) / 2, height, thickness,
			-width, -height, thickness,
			
			// Buttom Face
			-width, -height, -thickness,
			width, -height, -thickness,
			width, -height, thickness,
			-width, -height, thickness,
		
			// Right Triangle
			-width, -height, thickness,
			width, -height, thickness,
			(width * ratioX + -width * ratioY) / 2, height, thickness
		]);
	return positionSet;
}
