
//根據進度回傳對應的RGB
function percentageToRGB (percentage){
	var material_color;
	
	if (percentage > 0 && percentage <= 25){
		material_color = {r:255/255, g:255/255, b:255/255};
	}
	else if (percentage > 25 && percentage <= 50){
		material_color = {r:143/255, g:187/255, b:232/255};
	}
	else if (percentage > 50 && percentage <= 75){
		material_color = {r:255/255, g:251/255, b:153/255};
	}
	else if (percentage > 75 && percentage < 100){
		material_color = {r:202/255, g:229/255, b:144/255};
	}
	else if (percentage == 100){
	    material_color = {r:219/255, g:173/255, b:137/255};
	}
	
	return material_color;
	 
}

//取得各物件的ID
function getObjectId(){
	var objId={
		roofId:"",
		wallLeftId:"",
		wallRightId:"",
		wallBackId:"",
		wallInterId:"",
		baseId:""
	};
	
	var nodes = scene.findNodes();
	
	for(var i = 0 ; i < nodes.length ; i++){
		var n = nodes[i];
		if(n.getType() == "name"){
			if(n.getName() == "roof"){
				objId.roofId = n.getID();
			}
			else if (n.getName() == "leftWall"){
				objId.wallLeftId = n.getID();
			}
			else if (n.getName() == "rightWall"){
				objId.wallRightId = n.getID();   
			}
			else if (n.getName() == "backWall"){
				objId.wallBackId = n.getID();
			}
			else if (n.getName() == "interWall"){
				objId.wallInterId = n.getID();
			}
			else if (n.getName() =="base"){
				objId.baseId = n.getID();
			}
		}
	}
	return objId;
}

//取得物件node的material
function getObjectMaterial(nodeId){
	return scene.getNode(nodeId).nodes[0];	
}

//根據進度變換顏色
function changeRGB(type,percentage){
	
	var nodeID = getObjectId();
	if (type == "roof"){
		var roofMaterial = getObjectMaterial(nodeID.roofId);
		roofMaterial.setColor(percentageToRGB(percentage));
	}
	else if (type == "leftWall"){
		var leftWallMaterial = getObjectMaterial(nodeID.wallLeftId);
		leftWallMaterial.setColor(percentageToRGB(percentage));
	}
	else if (type == "rightWall"){
		var rightWallMaterial = getObjectMaterial(nodeID.wallRightId);
		rightWallMaterial.setColor(percentageToRGB(percentage));
	}
	else if (type == "backWall"){
		var backWallMaterial = getObjectMaterial(nodeID.wallBackId);
		backWallMaterial.setColor(percentageToRGB(percentage));
	}
	else if (type == "interWall"){
		var interWallMaterial = getObjectMaterial(nodeID.wallInterId);
		interWallMaterial.setColor(percentageToRGB(percentage));
	}
	else if (type == "base"){
		var baseMaterial = getObjectMaterial(nodeID.baseId);
		baseMaterial.setColor(percentageToRGB(percentage));
	}
	
}


