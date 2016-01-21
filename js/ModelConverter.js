///////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Function used for exporting the model in multiple .obj
function convertToMultiObj(inputNode){
	var nodesArr = inputNode.nodes;
	var outNodeIndex = 0;
	var matList = new Array();	//Stores the transformation matrices

	//Looping all matrices of nodes
	for(nodeI = 0;nodeI<nodesArr.length;nodeI++){

		var tmpMat = nodesArr[nodeI].nodes[0].nodes[0].getModelMatrix();
		matList.push(tmpMat);

		var curNode = nodesArr[nodeI].nodes[0].nodes[0].nodes[0].nodes[0].nodes[0];
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
		

		if(nodesArr[nodeI].nodes[0].nodes[0].nodes[0].nodes[0].type == "Roof/Gable"){
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
			f1Str += "f " + (1) + "//" + (1) + " " + (17) + "//" + (17) + " " + (18) + "//" + (18) + "\n";
			f2Str += "f " + (4) + "//" + (4) + " " + (18) + "//" + (18) + " " + (1) + "//" + (1) + "\n";
			f2Str += "f " + (1) + "//" + (1) + " " + (17) + "//" + (17) + " " + (18) + "//" + (18) + "\n";
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
			download(vStr + vnStr + f1Str, "model_part" + (outNodeIndex++) + ".obj", 'text/plain');
			download(v2Str + vn2Str + f2Str, "model_part" + (outNodeIndex++) + ".obj", 'text/plain');
		}else{

			for(i = 0;i<tmpFaces.length;i += 3){
				fStr += "f " + (tmpFaces[i]+1) + "//" + (tmpFaces[i]+1) + " " + (tmpFaces[i+1]+1) + "//" + (tmpFaces[i+1]+1) + " " + (tmpFaces[i+2]+1) + "//" + (tmpFaces[i+2]+1) + "\n";
			}
			fStr += "\n";
			download(vStr + vnStr + fStr, "model_part" + (outNodeIndex++) + ".obj", 'text/plain');
		}

	}
	
}

function decrFace1(param){
	return (param<32?16:20);
}

function decrFace2(param){
	return (param<16?0:16);
}

//Function used for exporting the model in one .obj
function convertToOneObj(inputNode){
	var nodesArr = inputNode.nodes;
	var v = 0, vn = 0, f = 1;
	var vCount = new Array();
	//console.log(nodesArr[i].nodes[0].elements.length);
	//Look for each array size
	for(i = 0;i<nodesArr.length;i++){
		var curNode = nodesArr[i].nodes[0].nodes[0].nodes[0].nodes[0].nodes[0];
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
		var tmpMat = nodesArr[nodeI].nodes[0].nodes[0].getModelMatrix();
		matList.push(tmpMat);

		var curNode = nodesArr[nodeI].nodes[0].nodes[0].nodes[0].nodes[0].nodes[0];
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
//
function convertToMultiStl(inputNode){
	var nodesArr = inputNode.nodes;
	var outNodeIndex = 0;
	var matList = new Array();	//Stores the transformation matrices

	//Looping all matrices of nodes
	for(nodeI = 0;nodeI<nodesArr.length;nodeI++){

		var tmpMat = nodesArr[nodeI].nodes[0].nodes[0].getModelMatrix();
		matList.push(tmpMat);

		var curNode = nodesArr[nodeI].nodes[0].nodes[0].nodes[0].nodes[0].nodes[0];
		var tmpPos = curNode.getPositions();
		var tmpNorm = curNode.getNormals();
		var tmpFaces = curNode.getIndices();		


		if(nodesArr[nodeI].nodes[0].nodes[0].nodes[0].nodes[0].type == "Roof/Gable"){
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
				outStr1 += (vnArr[0][k] + vnArr[32][k] + vnArr[33][k]);
				outStr1 += " ";
			}
			outStr1 += "\n    outer loop\n";
			
			outStr1 += "        " + vArr[0];
			outStr1 += "        " + vArr[32];
			outStr1 += "        " + vArr[33];
			
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
				outStr2 += (vnArr[0][k] + vnArr[32][k] + vnArr[33][k]);
				outStr2 += " ";
			}
			outStr2 += "\n    outer loop\n";
			
			outStr2 += "        " + vArr[0];
			outStr2 += "        " + vArr[32];
			outStr2 += "        " + vArr[33];
			
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

		var tmpMat = nodesArr[nodeI].nodes[0].nodes[0].getModelMatrix();
		matList.push(tmpMat);

		var curNode = nodesArr[nodeI].nodes[0].nodes[0].nodes[0].nodes[0].nodes[0];
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