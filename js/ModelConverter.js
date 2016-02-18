///////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Wouldn't be changed stuff
var typeDefined = ["roof", "base", "wall"];
///////////////////////////////////////////////////////////////////////////////////////////////////////////////

//Global variables
var outNodeIndex = 0;
var infoStr = "";	//Storing the string in info.txt
var posArray;	//Storing values of pos in each elements 
var typeArray;	//Storing values of type in each elements 

//mesh manipulating (latch faces)
//faceArray[x][3]: vertex[3]
var connector;	//:faceArray      Storing array of mesh with faceArray in each elements
var nonConnector;	//:faceArray      Storing array of mesh with faceArray in each elements
var connector_No;	//Storing the corresponding model index
var nonConnector_No;	//Storing the corresponding model index

function traverse(curNode, target){
	var newArr = new Array;
	newArr = target;
	if(newArr.length == 1){
		for(;newArr.indexOf(curNode.type) == -1;curNode = curNode.nodes[0]);
	}else{
		for(;newArr.indexOf(String(curNode.type).substring(0, 4)) == -1;curNode = curNode.nodes[0]);
	}
	return curNode;
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Here are the exporting functions
function exportMultiObj(inputNode){
	
}
function exportOneObj(inputNode){

}

function exportMultiStl(inputNode){

}
function exportOneStl(inputNode){

}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Function used for converting the model in multiple .obj (NO DOWNLOADING)
function convertToMultiObj(inputNode){
	infoStr = "";
	//Init the arrays
	connector = new Array;
	nonConnector = new Array;
	connector_No = new Array;
	nonConnector_No = new Array;

	var nodesArr = inputNode.nodes;
	outNodeIndex = 0;
	var matList = new Array();	//Stores the transformation matrices

	//Init posArray
	posArray = new Array;
	typeArray = new Array;
	for(var i = 0;i<nodesArr.length;i++){
		posArray.push(nodesArr[i]._core.name);
		typeArray.push(traverse(nodesArr[i], typeDefined).type);
		console.log(typeArray[i]);
	}
	//Looping all matrices of nodes
	for(nodeI = 0;nodeI<nodesArr.length;nodeI++){

		var tmpMat = traverse(nodesArr[nodeI], "matrix").getModelMatrix();
		matList.push(tmpMat);

		var curNode = traverse(nodesArr[nodeI], "geometry");
		var tmpPos = curNode.getPositions();
		var tmpNorm = curNode.getNormals();
		var tmpFaces = curNode.getIndices();

		//vStr stores the output string of vertices positions
		//vnStr stores the output string of vertices normals
		//fStr stores the output string of face definition indices		
		var vStr = "", vnStr = "", fStr = "";
		for(i = 0;i<tmpPos.length;i += 3){
			var vec = [tmpPos[i], tmpPos[i+1], tmpPos[i+2], 1.0];
			var outVec = new Array();
			for(j = 0;j<16;j+=4){
				outVec.push(matList[nodeI][rowToColMajor(j)]*vec[0] + matList[nodeI][rowToColMajor(j+1)]*vec[1] + matList[nodeI][rowToColMajor(j+2)]*vec[2] + matList[nodeI][rowToColMajor(j+3)]*vec[3]);
			}
			vStr += "v " + outVec[0]/outVec[3] + " " + outVec[1]/outVec[3] + " " + outVec[2]/outVec[3] + "\n";
		}
		vStr += "\n";
		for(i = 0;i<tmpNorm.length;i += 3){
			var vec = [tmpNorm[i], tmpNorm[i+1], tmpNorm[i+2], 1.0];
			var outVec = new Array();
			for(j = 0;j<16;j+=4){
				outVec.push(matList[nodeI][rowToColMajor(j)]*vec[0] + matList[nodeI][rowToColMajor(j+1)]*vec[1] + matList[nodeI][rowToColMajor(j+2)]*vec[2] + matList[nodeI][rowToColMajor(j+3)]*vec[3]);
			}
			vnStr += "vn " + outVec[0] + " " + outVec[1] + " " + outVec[2] + "\n";
		}
		vnStr += "\n";
		
		if(traverse(nodesArr[nodeI], typeDefined).type == "roof/gable"){
			//Divides the roof into two .obj
			var vArr = new Array(), vnArr = new Array();
			var iter = 0, lastIter = 0;
			for(iter = 0, lastIter = 0;iter < vStr.length; iter++){
				if(vStr[iter] == "\n"){

					vArr.push(vStr.substring(lastIter, ++iter));
					lastIter = iter;
				}
			}
			
			for(iter = 0, lastIter = 0;iter < vnStr.length; iter++){
				if(vnStr[iter] == "\n"){
					vnArr.push(vnStr.substring(lastIter, ++iter));
					lastIter = iter;
				}
			}
			var f1Str = "", f2Str = "";
			var m1VIndex = [16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 36, 37, 38, 39];
			for(i = 0;i<tmpFaces.length;i += 3){
				if(m1VIndex.indexOf(tmpFaces[i]) > -1 && m1VIndex.indexOf(tmpFaces[i+1]) > -1 && m1VIndex.indexOf(tmpFaces[i+2]) > -1)
					f1Str += "f " + (tmpFaces[i]+1 - decrFace1(tmpFaces[i])) + "//" + (tmpFaces[i]+1 - decrFace1(tmpFaces[i])) + " " + (tmpFaces[i+1]+1 - decrFace1(tmpFaces[i+1])) + "//" + (tmpFaces[i+1]+1 - decrFace1(tmpFaces[i+1])) + " " + (tmpFaces[i+2]+1 - decrFace1(tmpFaces[i+2])) + "//" + (tmpFaces[i+2]+1 - decrFace1(tmpFaces[i+2])) + "\n";
				else
					f2Str += "f " + (tmpFaces[i]+1 - decrFace2(tmpFaces[i])) + "//" + (tmpFaces[i]+1 - decrFace2(tmpFaces[i])) + " " + (tmpFaces[i+1]+1 - decrFace2(tmpFaces[i+1])) + "//" + (tmpFaces[i+1]+1 - decrFace2(tmpFaces[i+1])) + " " + (tmpFaces[i+2]+1 - decrFace2(tmpFaces[i+2])) + "//" + (tmpFaces[i+2]+1 - decrFace2(tmpFaces[i+2])) + "\n";
			}
			//Dealing with inter face
			f1Str += "f " + (4) + "//" + (4) + " " + (18) + "//" + (18) + " " + (1) + "//" + (1) + "\n";
			f1Str += "f " + (1) + "//" + (1) + " " + (18) + "//" + (18) + " " + (17) + "//" + (17) + "\n";
			f2Str += "f " + (4) + "//" + (4) + " " + (18) + "//" + (18) + " " + (1) + "//" + (1) + "\n";
			f2Str += "f " + (1) + "//" + (1) + " " + (18) + "//" + (18) + " " + (17) + "//" + (17) + "\n";
			vStr = "";
			vnStr = "";
			var v2Str = "", vn2Str = "";
			for(i = 0;i<vArr.length;i++){
				if(m1VIndex.indexOf(i) > -1){
					vStr += vArr[i];
				}else{
					v2Str += vArr[i];
				}
			}
			vStr += "\n";
			v2Str += "\n";
			for(i = 0;i<vnArr.length;i++){
				if(m1VIndex.indexOf(i) > -1){
					vnStr += vnArr[i];
				}else{
					vn2Str += vnArr[i];
				}
			}
			vnStr += "\n";
			vn2Str += "\n";
			// latchFaces(nodeI);
			parseObj_withStoring(vStr + vnStr + f1Str, false);
			download(vStr + vnStr + f1Str, "model_part" + (outNodeIndex++) + ".obj", 'text/plain');
			parseObj_withStoring(v2Str + vn2Str + f2Str, false);
			download(v2Str + vn2Str + f2Str, "model_part" + (outNodeIndex++) + ".obj", 'text/plain');
		}else{

			for(i = 0;i<tmpFaces.length;i += 3){
				fStr += "f " + (tmpFaces[i]+1) + "//" + (tmpFaces[i]+1) + " " + (tmpFaces[i+1]+1) + "//" + (tmpFaces[i+1]+1) + " " + (tmpFaces[i+2]+1) + "//" + (tmpFaces[i+2]+1) + "\n";
			}
			fStr += "\n";

			// latchFaces(nodeI);
			parseObj_withStoring(vStr + vnStr + fStr, isConnector(nodeI));
			download(vStr + vnStr + fStr, "model_part" + (outNodeIndex++) + ".obj", 'text/plain');
		}

	}
	///////////////////////////////////////////////////////////////////////////////////////////////////////////////
	//-------------------------------------------Dealing with latch faces------------------------------------------
	//Printing total model number
	infoStr = outNodeIndex + "\n\n";

	//Put two array, stores convex and concave string
	var vexStr = new Array, caveStr = new Array;

	for(var conIter = 0;conIter < connector.length;conIter++){
		for(var faceIter = 0;faceIter<connector[conIter].length;faceIter++){
			//Comparing with nonConnector
			for(var model = 0;model<nonConnector.length;model++){
				if(isInside(nonConnector[model], connector[conIter][faceIter])){
					// console.log("nonConnector");
					// console.log("model: " + model);
					// console.log("conIter: " + conIter); 
					// console.log("faceIter: " + faceIter + "\n");

					//Adding string to vexStr & caveStr
					var tmpVexStr = "", tmpCaveStr = "", pointStr = "";
					for(var i = 0;i<3;i++){
						for(var j = 0;j<3;j++){
							pointStr += connector[conIter][faceIter][i][j] + " ";
						}
						pointStr += "\n";
					}
					tmpCaveStr += "model_part" + nonConnector_No[model] + "\n" + pointStr;
					tmpVexStr += "model_part" + connector_No[conIter] + "\n" + pointStr;
					vexStr.push(tmpVexStr);
					caveStr.push(tmpCaveStr);
				}
			}
			//Comparing with connector
			for(var model = 0;model<connector.length;model++){
				if(model != conIter && isInside(connector[model], connector[conIter][faceIter])){
					// console.log("connector");
					// console.log("model: " + model);
					// console.log("conIter: " + conIter);
					// console.log("faceIter: " + faceIter + "\n");

					//Adding string to vexStr & caveStr
					var tmpVexStr = "", tmpCaveStr = "", pointStr = "";
					for(var i = 0;i<3;i++){
						for(var j = 0;j<3;j++){
							pointStr += connector[conIter][faceIter][i][j] + " ";
						}
						pointStr += "\n";
					}
					tmpCaveStr += "model_part" + connector_No[model] + "\n" + pointStr;
					tmpVexStr += "model_part" + connector_No[conIter] + "\n" + pointStr;
					//Is it duplicated??
					if(caveStr.indexOf(tmpVexStr) == -1 && vexStr.indexOf(tmpCaveStr) == -1){
						vexStr.push(tmpVexStr);
						caveStr.push(tmpCaveStr);
					}
				}
			}
		}
	}
	for(var i = 0;i<caveStr.length;i+=2){
		infoStr += vexStr[i] + vexStr[i+1] + caveStr[i] + caveStr[i+1] + "\n";
	}
	download(addSubMark(infoStr), "info" + ".txt", 'text/plain');
}

//Adding convex or concave marks(0 or 1)
function addSubMark(str){
	var lines = str.split("\n");
	var outStr = "";
	if(lines.length <2){
		return "";
	}
	var count = 0, outNum = 0;
	for(var i = 0;i<lines.length;i++){

		if(i>2 && lines[i] != "" && lines[i].substring(0, 5) != "model"){
			outStr += lines[i] + String(outNum % 2) + "\n";
			if(++count == 6){
				count = 0;
				outNum++;
			}
		}else{
			outStr += lines[i] + "\n";
		}
	}
	return outStr;
}

function isConnector(nodeNum){
	console.log(typeArray[nodeNum].substring(0, 4));
	if(typeArray[nodeNum].substring(0, 4) == "wall"){
		return true;
	}
	return false;
}

function isInside(meshFaces, testPoints){
	for(var testI = 0;testI<testPoints.length;testI++){
		//Comparing Area
		var inside = false;
		for(var meshFaceIter = 0;meshFaceIter < meshFaces.length && !inside;meshFaceIter++){
			var sumArea = 0.0;
			var originalArea = 0.0;
			for(var i = 0;i<3;i++){
				sumArea += areaOfTriangle([meshFaces[meshFaceIter][i], testPoints[testI], meshFaces[meshFaceIter][(i+1)%3]]);
			}
			originalArea += areaOfTriangle(meshFaces[meshFaceIter]);
			if(Math.abs(sumArea - originalArea) < 0.0000001){
				inside = true;
			}
		}
		if(!inside){
			return false;
		}
	}

	return true;
}

function areaOfTriangle(points){
	var ab = new Array, bc = new Array;
	for(var i = 0;i<3;i++){
		ab.push(points[0][i] - points[1][i]);
		bc.push(points[1][i] - points[2][i]);
	}

	if((Math.abs(ab[0]) + Math.abs(ab[1]) + Math.abs(ab[2])) < 0.0000001 || (Math.abs(bc[0]) + Math.abs(bc[1]) + Math.abs(bc[2])) < 0.0000001)	return 0;
	// console.log((ab[0] + ab[1] + ab[2]));
	// console.log((bc[0] + bc[1] + bc[2]));
	var angle = Math.acos(dot([ab, bc])/(magnitude([points[0], points[1]])*magnitude([points[1], points[2]])));
	return(0.5*(magnitude([points[0], points[1]])*magnitude([points[1], points[2]]))*Math.sin(angle));
}

function dot(vecs){
	return(vecs[0][0]*vecs[1][0] + vecs[0][1]*vecs[1][1] + vecs[0][2]*vecs[1][2]);
}

//Length of 2 vectors
function magnitude(points){
	if(points[0][0] == points[1][0] && points[0][1] == points[1][1] && points[0][2] == points[1][2])	return 0;
	return(Math.sqrt(Math.pow(points[0][0] - points[1][0], 2) + Math.pow(points[0][1] - points[1][1], 2) + Math.pow(points[0][2] - points[1][2], 2)));
}

function decrFace1(param){
	return (param<32?16:20);
}

function decrFace2(param){
	return (param<16?0:16);
}

//Function used for converting the model in one .obj (NO DOWNLOADING)
function convertToOneObj(inputNode){
	var nodesArr = inputNode.nodes;
	var v = 0, vn = 0, f = 1;
	var vCount = new Array();
	//console.log(nodesArr[i].nodes[0].elements.length);
	//Look for each array size
	for(i = 0;i<nodesArr.length;i++){
		var curNode = traverse(nodesArr[i], "geometry");
		vCount.push(curNode.getPositions().length);
		v += curNode.getPositions().length;
		//vt += curNode.getUV().length;
		vn += curNode.getNormals().length;
	}

	var matList, vList, vnList, fList;
	matList = new Array();
	vList = new Float32Array(v);
	//vtList = new Float32Array();
	vnList = new Float32Array(vn);
	fList = new Array();
	
	v = 0;	vn = 0;	//Reset v and vn, and use them for propagating the index

	for(nodeI = 0;nodeI<nodesArr.length;nodeI++){
		var tmpMat = traverse(nodesArr[nodeI], "matrix").getModelMatrix();
		matList.push(tmpMat);

		var curNode = traverse(nodesArr[nodeI], "geometry");
		var tmpPos = curNode.getPositions();
		var tmpNorm = curNode.getNormals();
		var tmpFaces = curNode.getIndices();
		for (i = 0;i<tmpPos.length;i++){
			vList[v++] = tmpPos[i];
		}
		for (i = 0;i<tmpNorm.length;i++){
			vnList[vn++] = tmpNorm[i];
		}
		for(i = 0;i<tmpFaces.length;i++){
			fList.push(tmpFaces[i] + f);
		}
		f = Math.max.apply(Math, fList) + 1;
	}
	//Export .obj
	
	var vStr = "", vnStr = "", fStr = "";
	for(i = 0;i<vList.length;i += 3){
		var vec = [vList[i], vList[i+1], vList[i+2], 1.0];
		var outVec = new Array();
		for(j = 0;j<16;j+=4){
			outVec.push(matList[lookAtNode(vCount, i)][rowToColMajor(j)]*vec[0] + matList[lookAtNode(vCount, i)][rowToColMajor(j+1)]*vec[1] + matList[lookAtNode(vCount, i)][rowToColMajor(j+2)]*vec[2] + matList[lookAtNode(vCount, i)][rowToColMajor(j+3)]*vec[3]);
		}
		vStr += "v " + outVec[0]/outVec[3] + " " + outVec[1]/outVec[3] + " " + outVec[2]/outVec[3] + "\n";
	}
	vStr += "\n";
	for(i = 0;i<vnList.length;i += 3){
		var vec = [vnList[i], vnList[i+1], vnList[i+2], 1.0];
		var outVec = new Array();
		for(j = 0;j<16;j+=4){
			outVec.push(matList[lookAtNode(vCount, i)][rowToColMajor(j)]*vec[0] + matList[lookAtNode(vCount, i)][rowToColMajor(j+1)]*vec[1] + matList[lookAtNode(vCount, i)][rowToColMajor(j+2)]*vec[2] + matList[lookAtNode(vCount, i)][rowToColMajor(j+3)]*vec[3]);
		}
		// outVec = vec;
		vnStr += "vn " + outVec[0]/outVec[3] + " " + outVec[1]/outVec[3] + " " + outVec[2]/outVec[3] + "\n";
	}
	vnStr += "\n";
	for(i = 0;i<fList.length;i += 3){
		fStr += "f " + fList[i] + "//" + fList[i] + " " + fList[i+1] + "//" + fList[i+1] + " " + fList[i+2] + "//" + fList[i+2] + "\n";
	}
	fStr += "\n";
	download(vStr + vnStr + fStr, "model.obj", 'text/plain');
}

function rowToColMajor(param){
	return (parseInt(param/4) + 4*(param%4));
}

function lookAtNode(vCount, i){
	var j = i;
	for(k = 0;k<vCount.length;k++){
		if(j - vCount[k] < 0)	return k;
		else j -= vCount[k];
	}
	return vCount.length - 1;
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////////
//     :o(
function convertToMultiStl(inputNode){
	var nodesArr = inputNode.nodes;
	var outNodeIndex = 0;
	var matList = new Array();	//Stores the transformation matrices

	//Looping all matrices of nodes
	for(nodeI = 0;nodeI<nodesArr.length;nodeI++){

		var tmpMat = nodesArr[nodeI].nodes[0].nodes[0].nodes[0].getModelMatrix();
		matList.push(tmpMat);

		var curNode = nodesArr[nodeI].nodes[0].nodes[0].nodes[0].nodes[0].nodes[0].nodes[0];
		var tmpPos = curNode.getPositions();
		var tmpNorm = curNode.getNormals();
		var tmpFaces = curNode.getIndices();		


		if(nodesArr[nodeI].nodes[0].nodes[0].nodes[0].nodes[0].nodes[0].type == "roof/gable"){
			//vArr storing string, including \n; vnArr storing vectors	

			var vArr = new Array(), vnArr = new Array();
			for(i = 0;i<tmpPos.length;i += 3){
				var vec = [tmpPos[i], tmpPos[i+1], tmpPos[i+2], 1.0];
				var outVec = new Array();
				for(j = 0;j<16;j+=4){
					outVec.push(matList[nodeI][rowToColMajor(j)]*vec[0] + matList[nodeI][rowToColMajor(j+1)]*vec[1] + matList[nodeI][rowToColMajor(j+2)]*vec[2] + matList[nodeI][rowToColMajor(j+3)]*vec[3]);
				}
				vArr.push("vertex " + outVec[0]/outVec[3] + " " + outVec[1]/outVec[3] + " " + outVec[2]/outVec[3] + "\n");
			}
			for(i = 0;i<tmpNorm.length;i += 3){
				var vec = [tmpNorm[i], tmpNorm[i+1], tmpNorm[i+2], 1.0];
				var outVec = new Array();
				for(j = 0;j<16;j+=4){
					outVec.push(matList[nodeI][rowToColMajor(j)]*vec[0] + matList[nodeI][rowToColMajor(j+1)]*vec[1] + matList[nodeI][rowToColMajor(j+2)]*vec[2] + matList[nodeI][rowToColMajor(j+3)]*vec[3]);
				}
				vnArr.push(outVec);
			}
			var outStr1 = "", outStr2 = "";
			outStr1 += "solid model" + (outNodeIndex) + "\n";
			outStr2 += "solid model" + (outNodeIndex+1) + "\n";

			var m1VIndex = [16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 36, 37, 38, 39];
			for(i = 0;i<tmpFaces.length;i += 3){
				var vIndex = new Array();
				if(m1VIndex.indexOf(tmpFaces[i]) > -1 && m1VIndex.indexOf(tmpFaces[i+1]) > -1 && m1VIndex.indexOf(tmpFaces[i+2]) > -1){
					outStr1 += "facet normal ";
					for(k = 0;k<3;k++){
						outStr1 += (vnArr[tmpFaces[i]][k] + vnArr[tmpFaces[i+1]][k] + vnArr[tmpFaces[i+2]][k]);
						outStr1 += " ";
					}
					outStr1 += "\n    outer loop\n";
					for(k = 0;k<3;k++){
						outStr1 += "        " + vArr[tmpFaces[i+k]];
					}
					outStr1 += "    endloop\nendfacet\n";
				}else{
					outStr2 += "facet normal ";
					for(k = 0;k<3;k++){
						outStr2 += (vnArr[tmpFaces[i]][k] + vnArr[tmpFaces[i+1]][k] + vnArr[tmpFaces[i+2]][k]);
						outStr2 += " ";
					}
					outStr2 += "\n    outer loop\n";
					for(k = 0;k<3;k++){
						outStr2 += "        " + vArr[tmpFaces[i+k]];
					}
					outStr2 += "    endloop\nendfacet\n";
				}
			}
			//Dealing with inter faces
			outStr1 += "facet normal ";
			for(k = 0;k<3;k++){
				outStr1 += (vnArr[0][k] + vnArr[3][k] + vnArr[33][k]);
				outStr1 += " ";
			}
			outStr1 += "\n    outer loop\n";
			
			outStr1 += "        " + vArr[3];
			outStr1 += "        " + vArr[0];
			outStr1 += "        " + vArr[33];
			
			outStr1 += "    endloop\nendfacet\n";

			outStr1 += "facet normal ";
			for(k = 0;k<3;k++){
				outStr1 += (vnArr[0][k] + vnArr[33][k] + vnArr[32][k]);
				outStr1 += " ";
			}
			outStr1 += "\n    outer loop\n";
			
			outStr1 += "        " + vArr[0];
			outStr1 += "        " + vArr[33];
			outStr1 += "        " + vArr[32];
			
			outStr1 += "    endloop\nendfacet\n";

			outStr2 += "facet normal ";
			for(k = 0;k<3;k++){
				outStr2 += (vnArr[0][k] + vnArr[3][k] + vnArr[33][k]);
				outStr2 += " ";
			}
			outStr2 += "\n    outer loop\n";
			
			outStr2 += "        " + vArr[3];
			outStr2 += "        " + vArr[0];
			outStr2 += "        " + vArr[33];
			
			outStr2 += "    endloop\nendfacet\n";

			outStr2 += "facet normal ";
			for(k = 0;k<3;k++){
				outStr2 += (vnArr[0][k] + vnArr[33][k] + vnArr[32][k]);
				outStr2 += " ";
			}
			outStr2 += "\n    outer loop\n";
			
			outStr2 += "        " + vArr[0];
			outStr2 += "        " + vArr[33];
			outStr2 += "        " + vArr[32];
			
			outStr2 += "    endloop\nendfacet\n";


			outStr1 += "endsolid model" + (outNodeIndex);
			outStr2 += "endsolid model" + (outNodeIndex+1);

			
			download(outStr1, "model_part" + (outNodeIndex++) + ".stl", 'text/plain');
			download(outStr2, "model_part" + (outNodeIndex++) + ".stl", 'text/plain');
		}else{
			//vStr stores the output string of vertices positions
			//vnStr stores the output string of vertices normals
			//fStr stores the output string of face definition indices		
			var vStr = new Array(), vnSet = new Array(), outStr = "";

			for(i = 0;i<tmpPos.length;i += 3){
				var vec = [tmpPos[i], tmpPos[i+1], tmpPos[i+2], 1.0];
				var outVec = new Array();
				for(j = 0;j<16;j+=4){
					outVec.push(matList[nodeI][rowToColMajor(j)]*vec[0] + matList[nodeI][rowToColMajor(j+1)]*vec[1] + matList[nodeI][rowToColMajor(j+2)]*vec[2] + matList[nodeI][rowToColMajor(j+3)]*vec[3]);
				}
				vStr.push("vertex " + outVec[0]/outVec[3] + " " + outVec[1]/outVec[3] + " " + outVec[2]/outVec[3] + "\n");
			}

			for(i = 0;i<tmpNorm.length;i += 3){
				var vec = [tmpNorm[i], tmpNorm[i+1], tmpNorm[i+2], 1.0];
				var outVec = new Array();
				for(j = 0;j<16;j+=4){
					outVec.push(matList[nodeI][rowToColMajor(j)]*vec[0] + matList[nodeI][rowToColMajor(j+1)]*vec[1] + matList[nodeI][rowToColMajor(j+2)]*vec[2] + matList[nodeI][rowToColMajor(j+3)]*vec[3]);
				}
				vnSet.push(outVec);
			}
			outStr += "solid model" + outNodeIndex + "\n";
			for(i = 0;i<tmpFaces.length;i += 3){
				outStr += "facet normal ";
				var norm = new Array();
				for(k = 0;k<3;k++){
					norm.push(vnSet[tmpFaces[i]][k]/vnSet[tmpFaces[i]][3] + vnSet[tmpFaces[i+1]][k]/vnSet[tmpFaces[i+1]][3] + vnSet[tmpFaces[i+2]][k]/vnSet[tmpFaces[i+2]][3]);
				}
				normalize(norm);
				for(k = 0;k<3;k++){
					outStr += norm[k] + " ";
				}
				outStr += "\n    outer loop\n";
				for(k = 0;k<3;k++){
					outStr += "        " + vStr[tmpFaces[i+k]];
				}
				outStr += "    endloop\nendfacet\n\n";
			}
			// console.log(outStr);
			outStr += "endsolid model" + outNodeIndex;
			download(outStr, "model_part" + (outNodeIndex++) + ".stl", 'text/plain');

		}
	}
}

function convertToOneStl(inputNode){
	var nodesArr = inputNode.nodes;
	var outNodeIndex = 0;
	var matList = new Array();	//Stores the transformation matrices
	var mainOutStr = "solid model\n";

	//Looping all matrices of nodes
	for(nodeI = 0;nodeI<nodesArr.length;nodeI++){

		var tmpMat = nodesArr[nodeI].nodes[0].nodes[0].nodes[0].getModelMatrix();
		matList.push(tmpMat);

		var curNode = nodesArr[nodeI].nodes[0].nodes[0].nodes[0].nodes[0].nodes[0].nodes[0];
		var tmpPos = curNode.getPositions();
		var tmpNorm = curNode.getNormals();
		var tmpFaces = curNode.getIndices();		

		//vStr stores the output string of vertices positions
		//vnStr stores the output string of vertices normals
		//fStr stores the output string of face definition indices		
		var vStr = new Array(), vnSet = new Array(), outStr = "";

		for(i = 0;i<tmpPos.length;i += 3){
			var vec = [tmpPos[i], tmpPos[i+1], tmpPos[i+2], 1.0];
			var outVec = new Array();
			for(j = 0;j<16;j+=4){
				outVec.push(matList[nodeI][rowToColMajor(j)]*vec[0] + matList[nodeI][rowToColMajor(j+1)]*vec[1] + matList[nodeI][rowToColMajor(j+2)]*vec[2] + matList[nodeI][rowToColMajor(j+3)]*vec[3]);
			}
			vStr.push("vertex " + outVec[0]/outVec[3] + " " + outVec[1]/outVec[3] + " " + outVec[2]/outVec[3] + "\n");
		}

		for(i = 0;i<tmpNorm.length;i += 3){
			var vec = [tmpNorm[i], tmpNorm[i+1], tmpNorm[i+2], 1.0];
			var outVec = new Array();
			for(j = 0;j<16;j+=4){
				outVec.push(matList[nodeI][rowToColMajor(j)]*vec[0] + matList[nodeI][rowToColMajor(j+1)]*vec[1] + matList[nodeI][rowToColMajor(j+2)]*vec[2] + matList[nodeI][rowToColMajor(j+3)]*vec[3]);
			}
			vnSet.push(outVec);
		}
		for(i = 0;i<tmpFaces.length;i += 3){
			outStr += "facet normal ";
			var norm = new Array();
			for(k = 0;k<3;k++){
				norm.push(vnSet[tmpFaces[i]][k]/vnSet[tmpFaces[i]][3] + vnSet[tmpFaces[i+1]][k]/vnSet[tmpFaces[i+1]][3] + vnSet[tmpFaces[i+2]][k]/vnSet[tmpFaces[i+2]][3]);
			}
			normalize(norm);
			for(k = 0;k<3;k++){
				outStr += norm[k] + " ";
			}
			outStr += "\n    outer loop\n";
			for(k = 0;k<3;k++){
				outStr += "        " + vStr[tmpFaces[i+k]];
			}
			outStr += "    endloop\nendfacet\n\n";
		}
		mainOutStr += outStr;
	}
	mainOutStr += "endsolid model\n";

	download(mainOutStr, "model.stl", 'text/plain');
}

function normalize(vec){
	var mag = Math.abs(vec[0]) + Math.abs(vec[1]) + Math.abs(vec[2]);
	vec[0] /= mag;
	vec[1] /= mag;
	vec[2] /= mag;
}

//Just parsing the text storing .obj and return {<vertices>, <normals>, <faces>}
function parseObj(text){
	var objText = text.split("\n");
	var obj = {};	//The elements inside are string
	var vertexMatches = new Array, normalMatches = new Array, faceMatches = new Array;
	for(var i = 0;i<objText.length;i++){
		if(objText[i][0] == "v" && objText[i][1] == " "){
			vertexMatches.push(objText[i]);
		}
		else if(objText[i][0] == "v" && objText[i][1] == "n"){
			normalMatches.push(objText[i]);
		}
		else if(objText[i][0] == "f" && objText[i][1] == " "){
			faceMatches.push(objText[i]);
		}
	}
	if (vertexMatches)
	{
	    obj.vertices = vertexMatches.map(function(vertex)
	    {
	        var vertices = vertex.split(" ");
	        vertices.shift();
	        return vertices;
	    });
	}
	if (normalMatches)
	{
		obj.normals = normalMatches.map(function(normal)
	    {
	        var normals = normal.split(" ");
	        normals.shift();
	        return normals;
	    });
	}
	if (faceMatches)
	{
	    obj.faces = faceMatches.map(function(face)
	    {
	        var faces = face.split(" ");
	        faces.shift();
	        return faces;
	    });
	    var outFaces = new Array;
	    for(var i = 0;i<obj.faces.length;i++){
	    	outFaces.push(obj.faces[i].map(function(face){
	    		var outputFace  = face.split("//");
	    		return outputFace[0];
	    	}));
	    }
	    obj.faces = outFaces;
	}
	return obj;
}

//Used for dealing with latch faces and vertices' data storing in connector[]
function parseObj_withStoring(text, isConnector){
	var objText = text.split("\n");
	var obj = parseObj(text);	//The elements inside are string
	var faceArray = new Array;
	for(var i = 0;i<obj.faces.length;i++){
		var vertices = new Array;
		for(var j = 0;j<3;j++){
			var tmpV = [parseFloat(obj.vertices[parseInt(obj.faces[i][j]) - 1][0]), parseFloat(obj.vertices[parseInt(obj.faces[i][j]) - 1][1]), parseFloat(obj.vertices[parseInt(obj.faces[i][j]) - 1][2])];
			vertices.push(tmpV);
		}
		faceArray.push(vertices);
	}
	if(isConnector){
		connector.push(faceArray);
		connector_No.push(outNodeIndex);
	}else{
		nonConnector.push(faceArray);
		nonConnector_No.push(outNodeIndex);
	}
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////
//.obj export as local download files
function download(strData, strFileName, strMimeType) {
    var D = document,
        A = arguments,
        a = D.createElement("a"),
        d = A[0],
        n = A[1],
        t = A[2] || "text/plain";

    //build download link:
    a.href = "data:" + strMimeType + "charset=utf-8," + escape(strData);


    if (window.MSBlobBuilder) { // IE10
        var bb = new MSBlobBuilder();
        bb.append(strData);
        return navigator.msSaveBlob(bb, strFileName);
    } /* end if(window.MSBlobBuilder) */



    if ('download' in a) { //FF20, CH19
        a.setAttribute("download", n);
        a.innerHTML = "downloading...";
        D.body.appendChild(a);
        setTimeout(function() {
            var e = D.createEvent("MouseEvents");
            e.initMouseEvent("click", true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
            a.dispatchEvent(e);
            D.body.removeChild(a);
        }, 66);
        return true;
    }; /* end if('download' in a) */



    //do iframe dataURL download: (older W3)
    var f = D.createElement("iframe");
    D.body.appendChild(f);
    f.src = "data:" + (A[2] ? A[2] : "application/octet-stream") + (window.btoa ? ";base64" : "") + "," + (window.btoa ? window.btoa : escape)(strData);
    setTimeout(function() {
        D.body.removeChild(f);
    }, 333);
    return true;
}

//Garbage
function latchFaces(nodeNum){
	switch(posArray[nodeNum]){
		case 'base':
			infoStr += "model" + outNodeIndex + " 9, 10, 11" + "\n";
			infoStr += "model" + outNodeIndex + " 9, 11, 12" + "\n";
			break;
		case 'rightWall':
			infoStr += "model" + outNodeIndex + " 1, 2, 3" + "\n";
			infoStr += "model" + outNodeIndex + " 1, 3, 4" + "\n";
			infoStr += "model" + outNodeIndex + " 13, 14, 15" + "\n";
			infoStr += "model" + outNodeIndex + " 13, 15, 16" + "\n";
			infoStr += "model" + outNodeIndex + " 21, 22, 23" + "\n";
			infoStr += "model" + outNodeIndex + " 21, 23, 24" + "\n";
			break;
		case 'leftWall':
			infoStr += "model" + outNodeIndex + " 1, 2, 3" + "\n";
			infoStr += "model" + outNodeIndex + " 1, 3, 4" + "\n";
			infoStr += "model" + outNodeIndex + " 13, 14, 15" + "\n";
			infoStr += "model" + outNodeIndex + " 13, 15, 16" + "\n";
			infoStr += "model" + outNodeIndex + " 21, 22, 23" + "\n";
			infoStr += "model" + outNodeIndex + " 21, 23, 24" + "\n";
			break;
		case 'backWall':
			infoStr += "model" + outNodeIndex + " 17, 18, 19" + "\n";
			infoStr += "model" + outNodeIndex + " 17, 19, 20" + "\n";
			infoStr += "model" + outNodeIndex + " 21, 22, 23" + "\n";
			infoStr += "model" + outNodeIndex + " 21, 23, 24" + "\n";
			break;
		case 'rightTriangle':
			infoStr += "model" + outNodeIndex + " 4, 5, 6" + "\n";
			infoStr += "model" + outNodeIndex + " 4, 6, 7" + "\n";
			infoStr += "model" + outNodeIndex + " 8, 9, 10" + "\n";
			infoStr += "model" + outNodeIndex + " 8, 10, 11" + "\n";
			infoStr += "model" + outNodeIndex + " 12, 13, 14" + "\n";
			infoStr += "model" + outNodeIndex + " 12, 14, 15" + "\n";
			break;
		case 'leftTriangle':
			infoStr += "model" + outNodeIndex + " 4, 5, 6" + "\n";
			infoStr += "model" + outNodeIndex + " 4, 6, 7" + "\n";
			infoStr += "model" + outNodeIndex + " 8, 9, 10" + "\n";
			infoStr += "model" + outNodeIndex + " 8, 10, 11" + "\n";
			infoStr += "model" + outNodeIndex + " 12, 13, 14" + "\n";
			infoStr += "model" + outNodeIndex + " 12, 14, 15" + "\n";
			break;
		case 'roof':
			infoStr += "model" + outNodeIndex + " 17, 18, 19" + "\n";
			infoStr += "model" + outNodeIndex + " 17, 19, 20" + "\n";
			infoStr += "model" + (outNodeIndex + 1) + " 17, 18, 19" + "\n";
			infoStr += "model" + (outNodeIndex + 1) + " 17, 19, 20" + "\n";
			break;
	}
}

// function loadXML(xmlText){
// 	var domParser = new DOMParser();
// 	xmlDoc = domParser.parseFromString(xmlText, 'text/xml');
// 	posArray = new Array();
// 	typeArray = new Array();
// 	var layers = xmlDoc.getElementsByTagName('layer');
// 	for(var layerLen = 0; layerLen < layers.length; layerLen++)
// 	{
// 		// For each element in the layer
// 		var elements = layers[layerLen].getElementsByTagName('element');
// 		for(var elementLen = 0; elementLen < elements.length; elementLen++)
// 		{
// 			var posNode = elements[elementLen].getElementsByTagName('pos');
// 			var typeNode = elements[elementLen].getElementsByTagName('type');
// 			posArray.push(posNode[0].textContent);
// 			typeArray.push(typeNode[0].textContent);
// 		}
// 	}
// 	// for(var i = 0;i<posArray.length;i++){
// 	// 	console.log(posArray[i]);
// 	// }
// }