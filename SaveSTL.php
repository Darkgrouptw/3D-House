<?php
    $debugArDiuNei = "";
    $typeDefined = array("roof", "base", "wall", "wind");
    $modelExactLatchArea = array("base");
    $treePrior = array("base" => 0, "interWall" => 1, "backWall" => 2, "rightWall" => 3, "leftWall" => 3, "rightTriangle" => 4, "leftTriangle" => 4, "roof" => 5);
    $treePriorMap = $treePrior;
    $maxPrior = $treePrior[count($treePrior) - 1][1];

    //Global variables
    $outNodeIndex = 0;
    $infoStr = "";   //Storing the string in info.txt
    $posArray; //Storing values of pos in each elements
    $typeArray;    //Storing values of type in each elements
    $layerArray;   //Storing values of layer number in each nodes
    //mesh manipulating (latch faces)
    //faceArray[x][3]: vertex[3]
    $connector;    //:faceArray      Storing array of mesh with faceArray in each elements
    $nonConnector; //:faceArray      Storing array of mesh with faceArray in each elements
    $connector_No; //Storing the corresponding model index
    $nonConnector_No;  //Storing the corresponding model index
    //STL Strings
    $stlText;
    //Printing info.txt??
    $infoPrint = false;
    function traverse($curNode, $target){
        $newArr = [];
        $newArr = $target;
        if(count($newArr) == 1){
            for(;array_search($curNode->type, $newArr) === false;$curNode = $curNode->nodes[0]);
        }else{
            for(;$curNode->type && array_search(substr(String($curNode->type), 0, 4), $newArr) === false;$curNode = $curNode->nodes[0]);
        }
        return $curNode;
    }
    function stringReturn(){
        return "hi man!!";
    }

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //Here are the exporting functions
    function exportMultiObj($inputNode){
        convertToMultiObj($inputNode, true);
    }

    function deleteWindows($nodes){
        global $typeDefined;
        for($i = 0;$i<count($nodes);$i++){
            if(substr(String(traverse($nodes[$i], $typeDefined)->type), 0, 6) == "window"){
                unset($nodes, $i);
                $i--;
            }
        }
        return $nodes;
    }

    class ModelObject{
        public $vertices;
        public $normals;
        public $faces;
    }

    function exportMultiStl($inputNode){
        $stlText = [];

        $objs = convertToMultiObj($inputNode);

        //Parsing roof part number
        $parseRoof = 0;
        //Using the faceArray in connector and nonConnector to construct the stl models
        //Only normals in objs are needed
        for($modelNo = 0;$modelNo<count($objs);$modelNo++){
            //String storing stl
            $outStr = "solid model" . $modelNo . "\n\n";

            $curObj = parseObj($objs[$modelNo]);
            $indexConn = max(array_search($modelNo, $connector_No), array_search($modelNo, $nonConnector_No));
            $faceArr;
            if(array_search($modelNo, $connector_No) !== false){
                $faceArr = $connector[$indexConn];
            }else{
                $faceArr = $nonConnector[$indexConn];
            }
            $sum = [0, 0];
            $minZ = 99999999;

            //Storing the vec and angle of current rotation
            $angle = [];
            $vec = [];
            //Rotating
            switch($posArray[$modelNo]){
                case "roof":
                    switch($typeArray[$modelNo]){
                        case "roof/gable":
                            if($parseRoof == 0){
                                $angle = [-39.5];
                                $vec = [0];
                            }else{
                                $angle = [219.5];
                                $vec = [0];
                            }
                            break;
                        case "roof/hip":
                            switch($parseRoof){
                                case 0:
                                    $angle = [-90, 41.58];
                                    $vec = [0, 1];
                                    break;
                                case 1:
                                    $vec = [0];
                                    $angle = [-17.5];
                                    break;
                                case 2:
                                    $angle = [90, 221.58];
                                    $vec = [0, 1];
                                    break;
                                case 3:
                                    $vec = [0];
                                    $angle = [-162.5];
                                    break;
                                default:
                                    $angle = [0];
                                    $vec = [0];
                                    break;
                            }
                            break;
                        case "roof/mansard":
                            switch($parseRoof){
                                case 0:
                                    $vec = [0];
                                    $angle = [10];
                                    break;
                                case 1:
                                    $vec = [1, 0];
                                    $angle = [270, 158];
                                    break;
                                case 2:
                                    $vec = [0];
                                    $angle = [170];
                                    break;
                                case 3:
                                    $vec = [1, 0];
                                    $angle = [90, 158];
                                    break;
                                case 4:
                                    $vec = [0];
                                    $angle = [90];
                                    break;
                                default:
                                    $vec = [0];
                                    $angle = [0];
                                    break;
                            }
                            break;
                        case "roof/cross_gable":
                            break;
                        default:
                            $angle = [0];
                            $vec = [0];
                            break;
                    }
                    $parseRoof++;
                    break;
                case "leftTriangle":
                    $vec = [1];
                    $angle = [90];
                    break;
                case "rightTriangle":
                    $vec = [1];
                    $angle = [90];
                    break;
                case "base":
                    $angle = [90];
                    $vec = [0];
                    break;
                case "interWall":
                    $angle = [90];
                    $vec = [1];
                    break;
                case "backWall":
                    $angle = [-90, -90];
                    $vec = [2, 2];
                    break;
                case "leftWall":
                    $angle = [90];
                    $vec = [1];
                    break;
                case "rightWall":
                    $angle = [90];
                    $vec = [1];
                    break;
                default:
                    $angle = [0];
                    $vec = [0];
                    break;
            }

            $curObj = rotateOneAxis($curObj, $angle, $vec);
            $faceArr = rotateOneAxis_faceArr($faceArr, $angle, $vec);
            //Finding sum and min to align
            for($nv = 0;$nv<count($curObj->vertices);$nv++){
                for($nd = 0;$nd<2;$nd++){
                    $sum[$nd] += floatval($curObj->vertices[$nv][$nd]);
                }
                if($curObj->vertices[$nv][2] < $minZ)   $minZ = floatval($curObj->vertices[$nv][2]);
            }
            for($nd = 0;$nd<2;$nd++){
                $sum[$nd] /= floatval(count($curObj->vertices));
            }

            //Storing calculated normals
            $norms = [];
            for($i = 0;$i<count($faceArr);$i++){
                //finding corresponding normal
                $curNorm = [0, 0, 0];
                for($pointI = 0;$pointI < 3;$pointI++){
                    for($dimen = 0;$dimen < 3;$dimen++){
                        $curNorm[$dimen] += floatval($curObj->normals[$curObj->faces[$i][$pointI] - 1][$dimen]);
                    }
                }
                normalize($curNorm);
                array_push($norms, $curNorm);
            }

            for($i = 0;$i<count($faceArr);$i++){
                //Aligning
                for($nv = 0;$nv<3;$nv++){
                    for($nd = 0;$nd<2;$nd++){
                        $faceArr[$i][$nv][$nd] -= $sum[$nd];
                    }
                    $faceArr[$i][$nv][2] -= $minZ;
                }

                //Saving string
                $outStr .= "facet normal " . $norms[$i][0] . " " . $norms[$i][1] . " " . $norms[$i][2] . "\n";
                $outStr .= "    outer loop\n";
                for($j = 0;$j<3;$j++){
                    $outStr = $outStr . "        vertex ";
                    for($k = 0;$k < 3;$k++){
                        $outStr .= $faceArr[$i][$j][$k] . " ";
                    }
                    $outStr = $outStr . "\n";
                }
               $outStr .= "    endloop\nendfacet\n\n";
            }

            $outStr .= "endsolid model" . $modelNo . "\n";

            array_push($stlText, $outStr);

            //Not Downloading
            //download($outStr, "model_part" . $modelNo . ".stl", 'text/plain');
        }
        //sendingRequest(stlText);
        return $stlText;
    }

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //Function used for converting the model in multiple .obj (NO DOWNLOADING)
    function convertToMultiObj($inputNode){
        //You need to add the fucking global keyword when using global variables!!!
        global $debugArDiuNei, $modelExactLatchArea, $treePrior, $treePriorMap, $maxPrior, $outNodeIndex, $infoStr, $posArray, $typeArray, $layerArray, $connector, $nonConnector, $connector_No, $nonConnector_No, $stlText, $infoPrint;
        //Return object of .objs (strings)
        $objs = [];

        $infoStr = "";
        //Init the arrays
        $connector = [];
        $nonConnector = [];
        $connector_No = [];
        $nonConnector_No = [];

        $nodesArr = $inputNode;
        $outNodeIndex = 0;

        //Init posArray
        $posArray = [];
        $typeArray = [];
        $layerArray = [];
        for($i = 0;$i<count($nodesArr);$i++){
            //duplicate if "roof" in posArray and typeArray only,  used in infotext indicating pos
            $curPos = $nodesArr[$i]->pos; $curType = $nodesArr[$i]->type;
            $curLayer = intval($nodesArr[$i]->properties["layer"]);
            $dup = 1;
            switch($curType){
                case "roof/gable":
                    $dup = 2;
                    break;
                case "roof/hip":
                    $dup = 4;
                    break;
                case "roof/mansard":
                    $dup = 5;
                    break;
                case "roof/cross_gable":
                    $dup = 4;
                    break;
                default:
                    $dup = 1;
                    break;
            }
            for($j = 0;$j<$dup;$j++){
                array_push($posArray, $curPos);
                array_push($typeArray, $curType);
                array_push($layerArray, $curLayer);
            }
        }
        //Looping all matrices of nodes
        for($nodeI = 0;$nodeI<count($nodesArr);$nodeI++){
            $curNode = $nodesArr[$nodeI];
            $tmpPos = $curNode->points;
            // $tmpNorm = $curNode->normals;
            $tmpFaces = $curNode->indices;                //Start from zero!!

            //vStr stores the output string of vertices positions
            //vnStr stores the output string of vertices normals
            //fStr stores the output string of face definition indices      
            $vStr = ""; $vnStr = ""; $fStr = "";
            for($i = 0;$i<count($tmpPos);$i++){
                $vStr .= "v " . (string)$tmpPos[$i][0] . " " . (string)$tmpPos[$i][1] . " " . (string)$tmpPos[$i][2] . "\n";
            }
            $vStr .= "\n";
            // for($i = 0;$i<count($tmpNorm);$i++){
            //     $vnStr .= "vn " . (string)$tmpNorm[$i][0] . " " . (string)$tmpNorm[$i][1] . " " . (string)$tmpNorm[$i][2] + "\n";
            // }
            // $vnStr .= "\n";
            
            /////////////////////////////////////////////////////////////////
            //For roof decomposing
            //Storing each vertex string lines to vArr
            $vArr = explode("\n", $vStr);
            // $vnArr = explode("\n", $vnStr);
            foreach ($vArr as $key => $element) {
                $vArr[$key] .= "\n";
            }

            // $iter = 0; $lastIter = 0;
            // for($iter = 0, $lastIter = 0;$iter < count($vStr); $iter++){
            //     if($vStr[$iter] == "\n"){

            //         array_push($vArr, substr($vStr, $lastIter, ++$iter));
            //         $lastIter = $iter;
            //     }
            // }
            
            // for($iter = 0, $lastIter = 0;$iter < count($vnStr); $iter++){
            //     if($vnStr[$iter] == "\n"){
            //        array_push($vnArr, substr($vnStr, $lastIter, ++$iter));
            //         $lastIter = $iter;
            //     }
            // }
            ///////////////////////////////////////////////////////////////


            switch($curNode->type){
                case "roof/gable":
                    //Functions about modifying the vertices' number of each face
                    function decrFace1($param){
                        return ($param<32?16:20);
                    }

                    function decrFace2($param){
                        return ($param<16?0:16);
                    }

                    $f1Str = ""; $f2Str = "";
                    $m1VIndex = [16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 36, 37, 38, 39];
                    for($i = 0;$i<count($tmpFaces);$i += 3){
                        if(array_search($tmpFaces[$i], $m1VIndex) !== false && array_search($tmpFaces[$i + 1], $m1VIndex) !== false && array_search($tmpFaces[$i + 2], $m1VIndex) !== false)
                            $f1Str .= "f " . ($tmpFaces[$i]+1 - decrFace1($tmpFaces[$i])) . "//" . ($tmpFaces[$i]+1 - decrFace1($tmpFaces[$i])) . " " . ($tmpFaces[$i+1]+1 - decrFace1($tmpFaces[$i+1])) . "//" . ($tmpFaces[$i+1]+1 - decrFace1($tmpFaces[$i+1])) . " " . ($tmpFaces[$i+2]+1 - decrFace1($tmpFaces[$i+2])) . "//" . ($tmpFaces[$i+2]+1 - decrFace1($tmpFaces[$i+2])) . "\n";
                        else
                            $f2Str .= "f " . ($tmpFaces[$i]+1 - decrFace2($tmpFaces[$i])) . "//" . ($tmpFaces[$i]+1 - decrFace2($tmpFaces[$i])) . " " . ($tmpFaces[$i+1]+1 - decrFace2($tmpFaces[$i+1])) . "//" . ($tmpFaces[$i+1]+1 - decrFace2($tmpFaces[$i+1])) . " " . ($tmpFaces[$i+2]+1 - decrFace2($tmpFaces[$i+2])) . "//" . ($tmpFaces[$i+2]+1 - decrFace2($tmpFaces[$i+2])) . "\n";
                    }
                    //Dealing with inter face
                    $f1Str .= "f " . (4) . "//" . (4) . " " . (18) . "//" . (18) . " " . (1) . "//" . (1) . "\n";
                    $f1Str .= "f " . (1) . "//" . (1) . " " . (18) . "//" . (18) . " " . (17). "//". (17) . "\n";
                    $f2Str .= "f " . (4) . "//" . (4) . " " . (18) . "//" . (18) . " " . (1) . "//" . (1) . "\n";
                    $f2Str .= "f " . (1) . "//" . (1) . " " . (18) . "//" . (18) . " " . (17). "//". (17) . "\n";
                    $vStr = "";
                    $vnStr = "";
                    $v2Str = ""; $vn2Str = "";
                    for($i = 0;$i<count($vArr);$i++){
                        if(array_search($i, $m1VIndex) !== false){
                            $vStr .= $vArr[$i];
                        }else{
                            $v2Str .= $vArr[$i];
                        }
                    }
                    $vStr .= "\n";
                    $v2Str .= "\n";
                    for($i = 0;$i<count($vnArr);$i++){
                        if(array_search($i, $m1VIndex) !== false){
                            $vnStr .= $vnArr[$i];
                        }else{
                            $vn2Str .= $vnArr[$i];
                        }
                    }
                    $vnStr .= "\n";
                    $vn2Str .= "\n";

                    parseObj_withStoring($vStr . $vnStr . $f1Str, false);
                    $outNodeIndex++;
                    parseObj_withStoring($v2Str . $vn2Str . $f2Str, false);
                    $outNodeIndex++;

                    //Append string of .objs
                    array_push($objs, $vStr . $vnStr . $f1Str);
                    array_push($objs, $v2Str . $vn2Str . $f2Str);
                    break;
                case "roof/hip":
                    $vStr = ["", "", "", ""]; $vnStr = ["", "", "", ""]; $fStr = ["", "", "", ""];
                    $mVIndex = [];            //Array of 4 elements storing model's vertices (original face indices)
                    array_push($mVIndex, [0, 2, 3, 4, 6, 7, 12, 13, 14, 20, 22, 23, 36, 37, 38, 39]);       //Model1(quad)
                    array_push($mVIndex, [12, 14, 15, 20, 21, 22, 32, 33, 34, 35]);                         //Model2(triangle)
                    array_push($mVIndex, [0, 1, 2, 4, 5, 6, 8, 9, 10, 16, 18, 19, 28, 29, 30, 31]);         //Model3(quad)
                    array_push($mVIndex, [8, 10, 11, 16, 17, 18, 24, 25, 26, 27]);                          //Model4(triangle)

                    $mVFacesI = [];           //Array of 4 elements storing model's vertices (output face indices, ordered)
                    array_push($mVFacesI, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 15, 14, 13, 16, 15, 1, 4, 2, 1, 5, 4, 2, 4, 6, 3, 2, 6, 7, 11, 10, 7, 9, 11]);    //For quad models ; later is the interfaces
                    array_push($mVFacesI, [1, 2, 3, 4, 5, 6, 7, 9, 8, 7, 10, 9, 1, 9, 4, 9, 10, 4, 4, 8, 1, 8, 4, 7]);                          //For triangular models
                    array_push($mVFacesI, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 15, 14, 13, 16, 15, 16, 13, 7, 10, 7, 13, 15, 1, 14, 6, 14, 1, 3, 4, 6, 1, 3, 6]);    //For quad models ; later is the interfaces
                    array_push($mVFacesI, [1, 2, 3, 4, 5, 6, 7, 9, 8, 7, 10, 9, 1, 10, 4, 10, 7, 4, 4, 9, 1, 9, 4, 8]);                         //For triangular models

                    //Adding to fStr
                    for($i = 0;$i<4;$i++){
                        for($j = 0;$j<count($mVFacesI[$i]);$j+=3){
                            $fStr[$i] .= "f " . $mVFacesI[$i][$j] . "//" . $mVFacesI[$i][$j] . " " . $mVFacesI[$i][$j+1] . "//" . $mVFacesI[$i][$j+1] . " " . $mVFacesI[$i][$j+2] . "//" . $mVFacesI[$i][$j+2] . "\n";
                        }
                    }

                    for($i = 0;$i<count($vArr);$i++){
                        for($modelNo = 0;$modelNo<4;$modelNo++){
                            if(array_search($i, $mVIndex[$modelNo]) !== false){
                                $vStr[$modelNo] .= $vArr[$i];
                                $vnStr[$modelNo] .= $vnArr[$i];
                            }
                        }
                    }

                    for($i = 0;$i<4;$i++){
                        $vStr[$i] .= "\n";
                        $vnStr[$i] .= "\n";

                        parseObj_withStoring($vStr[$i] . $vnStr[$i] . $fStr[$i], false);
                        //Append string of .objs
                        array_push($objs, $vStr[$i]. $vnStr[$i] . $fStr[$i]);
                        $outNodeIndex++;
                    }

                    break;
                case "roof/mansard":
                    $vStr = ["", "", "", "", ""]; $vnStr = ["", "", "", "", ""]; $fStr = ["", "", "", "", ""];
                    $mVIndex = [];            //Array of 5 elements storing model's vertices (original face indices)
                    array_push($mVIndex, [0, 1, 2, 3, 20, 21, 22, 23, 40, 41, 42, 43]);     //Left
                    array_push($mVIndex, [4, 5, 6, 7, 24, 25, 26, 27, 44, 45, 46, 47]);     //Back
                    array_push($mVIndex, [8, 9, 10, 11, 28, 29, 30, 31, 48, 49, 50, 51]);   //Right
                    array_push($mVIndex, [12, 13, 14, 15, 32, 33, 34, 35, 52, 53, 54, 55]); //Front
                    array_push($mVIndex, [16, 17, 18, 19, 36, 37, 38, 39]);                 //Top

                    $mVFacesI = [];           //Array of 5 elements storing model's vertices (output face indices, ordered)
                    array_push($mVFacesI, [1, 3, 2, 1, 4, 3, 5, 7, 6, 5, 8, 7, 9, 11, 10, 9, 12, 11, 4, 6, 11, 11, 6, 10, 1, 12, 5, 12, 9, 5, 5, 6, 1, 4, 1, 6]);
                    array_push($mVFacesI, [1, 3, 2, 1, 4, 3, 5, 7, 6, 5, 8, 7, 9, 11, 10, 9, 12, 11, 1, 5, 10, 10, 5, 9, 8, 2, 11, 11, 12, 8, 2, 8, 5, 5, 1, 2]);
                    array_push($mVFacesI, [1, 3, 2, 1, 4, 3, 5, 7, 6, 5, 8, 7, 9, 11, 10, 9, 12, 11, 1, 5, 10, 10, 5, 9, 8, 2, 11, 11, 12, 8, 2, 8, 5, 5, 1, 2]);
                    array_push($mVFacesI, [1, 3, 2, 1, 4, 3, 5, 7, 6, 5, 8, 7, 9, 11, 10, 9, 12, 11, 4, 6, 11, 11, 6, 10, 1, 12, 5, 12, 9, 5, 5, 6, 1, 4, 1, 6]);
                    array_push($mVFacesI, [1, 3, 2, 1, 4, 3, 5, 7, 6, 5, 8, 7, 8, 5, 4, 4, 5, 3, 5, 6, 3, 3, 6, 2, 6, 7, 2, 2, 7, 1, 7, 8, 1, 4, 1, 8]);

                    //Adding to fStr
                    for($i = 0;$i<5;$i++){
                        for($j = 0;$j<count($mVFacesI[$i]);$j+=3){
                            $fStr[$i] .= "f " . $mVFacesI[$i][$j] . "//" . $mVFacesI[$i][$j] . " " . $mVFacesI[$i][$j+1] . "//" . $mVFacesI[$i][$j+1] . " " . $mVFacesI[$i][$j+2] . "//" . $mVFacesI[$i][$j+2] . "\n";
                        }
                    }

                    for($i = 0;$i<count($vArr);$i++){
                        for($modelNo = 0;$modelNo<5;$modelNo++){
                            if($mVIndex[$modelNo].indexOf($i) > -1){
                                $vStr[$modelNo] .= $vArr[$i];
                                $vnStr[$modelNo] .= $vnArr[$i];
                            }
                        }
                    }

                    for($i = 0;$i<5;$i++){
                        $vStr[$i] .= "\n";
                        $vnStr[$i] .= "\n";

                        parseObj_withStoring($vStr[$i] . $vnStr[$i] . $fStr[$i], false);
                        //Append string of .objs
                        array_push($objs, $vStr[$i] . $vnStr[$i] . $fStr[$i]);
                        $outNodeIndex++;
                    }
                    break;
                case "roof/cross_gable":
                    $vStr = ["", "", "", ""]; $vnStr = ["", "", "", ""]; $fStr = ["", "", "", ""];
                    $mVIndex = [];           //Array of 4 elements storing model's vertices (original face indices)
                    array_push($mVIndex, [8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,64,65,66,67,68,69,70,71,72,73,74,75,84,85,86,87,88,89,90,91,92,93,94,95,96,97,98,99,116,117,118,120,122,123]);      //Back
                    array_push($mVIndex, [0,1,2,3,4,5,6,7,76,77,78,79,80,81,82,83,100,101,102,103,104,105,106,107,108,109,110,111,112,113,114,115,116,117,118,119,120,121,122,123]);        //FrontBase
                    array_push($mVIndex, [40,41,42,43,44,45,46,47,52,53,54,55,60,61,62,63]);    //Cover1
                    array_push($mVIndex, [32,33,34,35,36,37,38,39,48,49,50,51,56,57,58,59]);    //Cover2

                    $mVFacesI = [];          //Array of 4 elements storing model's vertices (output face indices, ordered)
                    array_push($mVFacesI, [1,2,3,1,3,4,5,6,7,5,7,8,9,10,11,9,11,12,13,14,15,13,15,16,17,18,19,17,19,20,21,22,23,21,23,24,25,26,27,25,27,28,29,30,31,29,31,32,33,34,35,33,35,36,37,38,39,37,39,40,41,42,43,41,43,44,45,46,47,45,47,48,49,50,51,49,51,52,53,54,55,56,57,58,58,54,55,58,55,57]);
                    array_push($mVFacesI, [1,2,3,1,3,4,5,6,7,5,7,8,9,10,11,9,11,12,13,14,15,13,15,16,17,18,19,17,19,20,21,22,23,21,23,24,25,26,27,25,27,28,29,30,31,29,31,32,33,34,35,33,35,36,37,38,39,37,39,40,27,31,38,27,38,36,36,38,24,36,24,18,34,40,39,34,39,35]);
                    array_push($mVFacesI, [1,2,3,1,3,4,5,6,7,5,7,8,9,10,11,9,11,12,13,14,15,13,15,16,14,13,5,5,1,14,5,1,10,10,9,1]);
                    array_push($mVFacesI, [1,2,3,1,3,4,5,6,7,5,7,8,9,10,11,9,11,12,13,14,15,13,15,16,14,13,6,4,6,13,11,6,12,6,4,12]);

                    //Adding to fStr
                    for($i = 0;$i<4;$i++){
                        for($j = 0;$j<count($mVFacesI[$i]);$j+=3){
                            $fStr[$i] .= "f " . $mVFacesI[$i][$j] . "//" . $mVFacesI[$i][$j] . " " . $mVFacesI[$i][$j+1] . "//" . $mVFacesI[$i][$j+1] . " " . $mVFacesI[$i][$j+2] . "//" . $mVFacesI[$i][$j+2] . "\n";
                        }
                    }

                    for($i = 0;$i<count($vArr);$i++){
                        for($modelNo = 0;$modelNo<4;$modelNo++){
                            if($mVIndex[$modelNo].indexOf($i) > -1){
                                $vStr[$modelNo] .= $vArr[$i];
                                $vnStr[$modelNo] .= $vnArr[$i];
                            }
                        }
                    }

                    for($i = 0;$i<4;$i++){
                        $vStr[$i] .= "\n";
                        $vnStr[$i] .= "\n";
                        parseObj_withStoring($vStr[$i] . $vnStr[$i] . $fStr[$i], false);
                        //Append string of .objs
                        array_push($objs, $vStr[$i] . $vnStr[$i] . $fStr[$i]);
                        $outNodeIndex++;
                    }
                    break;

                default:
                    for($i = 0;$i<count($tmpFaces);$i += 3){
                        $fStr .= "f " . ($tmpFaces[$i]+1) . "//" . ($tmpFaces[$i]+1) . " " . ($tmpFaces[$i+1]+1) . "//" . ($tmpFaces[$i+1]+1) . " " . ($tmpFaces[$i+2]+1) . "//" . ($tmpFaces[$i+2]+1) . "\n";
                    }
                    $fStr .= "\n";

                    parseObj_withStoring($vStr . $vnStr . $fStr, isConnector($outNodeIndex));
                    $outNodeIndex++;
                    array_push($objs, $vStr . $vnStr . $fStr);
                    break;      
            }
        }

        if($infoPrint){
            ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
            //-------------------------------------------Dealing with latch faces------------------------------------------
            //Printing total model number
            // infoStr = outNodeIndex + "\n";
            //Put two array, stores convex and concave string
            $latchStrArr = [];
            $latch2StrArr = [];
            for($i = 0;$i<$outNodeIndex;$i++){
                array_push($latchStrArr, []);
                array_push($latch2StrArr, []);
            }

            $maxLayer = 2;
            foreach($layerArray as $element){
                if($element > $maxLayer)  $maxLayer = $element;
            }
            $connTree = [];
            //Init connTree
            array_fill(0, ($maxLayer-1)*5 + 1, []);
            function findModelNo($no){
                for($i = 0;$i<count($connTree);$i++){
                    for($j = 0;$j<count($connTree[$i]);$j++){
                        if($connTree[$i][$j]->modelNo == $no){
                            return [$i, $j];
                        }
                    }
                }
                return;
            }
            for($conIter = 0;$conIter < count($connector);$conIter++){
                for($faceIter = 0;$faceIter<count($connector[$conIter]);$faceIter++){
                    //Comparing with nonConnector
                    for($model = 0;$model<count($nonConnector);$model++){
                        $result = isInside($nonConnector[$model], $connector[$conIter][$faceIter]);
                        if($result){
                            //Adding string to vexStr & caveStr
                            $isCave = 0;     //The nonConnector model convex or concave??
                            $pointStr = ""; $point2Str = "";
                            $curPos = (string)($posArray[$nonConnector_No[$model]]);
                            switch($curPos){
                                case "roof":
                                    break;
                                case "base":
                                    $isCave = 1;
                                    break;
                                default:
                                    break;
                            }
                            for($i = 0;$i<3;$i++){
                                for($j = 0;$j<3;$j++){
                                    $pointStr .= $connector[$conIter][$faceIter][$i][$j] . " ";
                                    if(array_search($curPos, $modelExactLatchArea) !== false)
                                        //output the exact area of latch faces
                                        $point2Str .= $connector[$conIter][$faceIter][$i][$j] . " ";
                                    else
                                        $point2Str .= $nonConnector[$model][$result[0]][$i][$j] . " ";
                                }
                                $pointStr .= (string)(($isCave + 1)%2) . "\n";
                                $point2Str .= (string)($isCave) . "\n";
                            }
                            //Split into 2 elements
                            if(array_search($point2Str, $latchStrArr[$nonConnector_No[$model]]) === false){
                                array_push($latchStrArr[$nonConnector_No[$model]], $point2Str);
                            }
                            if(array_search($curPos, $modelExactLatchArea) === false){
                                $point2Str = "";
                                for($i = 0;$i<3;$i++){
                                    for($j = 0;$j<3;$j++){
                                        $point2Str .= $nonConnector[$model][$result[1]][$i][$j] . " ";
                                    }
                                    $point2Str .= (string)($isCave) . "\n";
                                }
                                if(array_search($point2Str, $latchStrArr[$nonConnector_No[$model]]) === false){
                                    array_push($latchStrArr[$nonConnector_No[$model]], $point2Str);
                                }
                            }
                            if(array_search($pointStr, $latchStrArr[$connector_No[$conIter]]) === false){
                                array_push($latchStrArr[$connector_No[$conIter]], $pointStr);
                            }

                            //The above handling latches

                            //These are handling dependency

                            // //Checking their priority
                            // var nonConPrior = treePriorMap.get(posArray[nonConnector_No[model]]);
                            // var conPrior = treePriorMap.get(posArray[connector_No[conIter]]);
                            // var newObj;
                            // if(nonConPrior + maxPrior*layerArray[nonConnector_No[model]] > conPrior + maxPrior*layerArray[connector_No[conIter]]){
                            //  newObj = {modelNo:nonConnector_No[model], 
                            //          connecting:[connector_No[conIter]], 
                            //          priority:nonConPrior, 
                            //          layer:layerArray[nonConnector_No[model]]};
                            // }else{
                            //  newObj = {modelNo:connector_No[conIter],
                            //          connecting:[nonConnector_No[model]],
                            //          priority:conPrior,
                            //          layer:layerArray[connector_No[conIter]]};
                            // }
                            // var i = new Array(2);
                            // if(i = findModelNo(newObj.modelNo)){
                            //  if(connTree[i[0]][i[1]].connecting.indexOf(newObj.connecting[0]) == -1){
                            //      connTree[i[0]][i[1]].connecting.push(newObj.connecting[0]);
                            //  }
                            // }else{
                            //  if(maxLayer == layerArray[newObj.modelNo]){
                            //      //Dealing with 5 4
                            //      connTree[(newObj.layer-1)*5 - 1 + (newObj.priority-4)].push(newObj);
                            //  }else{
                            //      //Dealing with 3 2 1 0 4
                            //      connTree[(newObj.layer-1)*5 - 1 + (newObj.priority + 1)%5].push(newObj);
                            //  }
                            // }
                        }
                    }

                    //Comparing with connector
                    for($model = 0;$model<count($connector);$model++){
                        $result = isInside($connector[$model], $connector[$conIter][$faceIter]);
                        if($model != $conIter && $result && count($result) > 1){
                            $pointStr = ""; $point2Str = "";
                            for($i = 0;$i<3;$i++){
                                for($j = 0;$j<3;$j++){
                                    $pointStr .= $connector[$conIter][$faceIter][$i][$j] . " ";
                                    $point2Str .= $connector[$model][$result[0]][$i][$j] . " ";
                                }
                                $pointStr .= 1 . "\n";
                                $point2Str .= 0 . "\n";
                            }

                            //Split into 2 elements
                            if(array_search($point2Str, $latch2StrArr[$connector_No[$model]]) === false){
                                array_push($latch2StrArr[$connector_No[$model]], $point2Str);
                            }
                            $point2Str = "";

                            for($i = 0;$i<3;$i++){
                                for($j = 0;$j<3;$j++){
                                    $point2Str .= $connector[$model][$result[1]][$i][$j] . " ";
                                }
                                $point2Str .= 0 . "\n";
                            }

                            if(array_search($point2Str, $latch2StrArr[$connector_No[$model]]) === false){
                                array_push($latch2StrArr[$connector_No[$model]], $point2Str);
                            }
                            if(array_search($pointStr, $latch2StrArr[$connector_No[$conIter]]) === false){
                                array_push($latch2StrArr[$connector_No[$conIter]], $pointStr);
                            }

                            //The above handling latches

                            //These are handling dependency

                            // //Checking their priority
                            // var nonConPrior = treePriorMap.get(posArray[connector_No[model]]);
                            // var conPrior = treePriorMap.get(posArray[connector_No[conIter]]);
                            // var newObj;
                            // if(nonConPrior + maxPrior*layerArray[connector_No[model]] > conPrior + maxPrior*layerArray[connector_No[conIter]]){
                            //  newObj = {modelNo:connector_No[model], 
                            //          connecting:[connector_No[conIter]], 
                            //          priority:nonConPrior, 
                            //          layer:layerArray[connector_No[model]]};
                            // }else{
                            //  newObj = {modelNo:connector_No[conIter],
                            //          connecting:[connector_No[model]],
                            //          priority:conPrior,
                            //          layer:layerArray[connector_No[conIter]]};
                            // }
                            // var i = new Array(2);
                            // if(i = findModelNo(newObj.modelNo)){
                            //  if(connTree[i[0]][i[1]].connecting.indexOf(newObj.connecting[0]) == -1){
                            //      connTree[i[0]][i[1]].connecting.push(newObj.connecting[0]);
                            //  }
                            // }else{
                            //  if(maxLayer == layerArray[newObj.modelNo]){
                            //      //Dealing with 5 4
                            //      connTree[(newObj.layer-1)*5 - 1 + (newObj.priority-4)].push(newObj);

                            //  }else{
                            //      //Dealing with 3 2 1 0 4
                            //      connTree[(newObj.layer-1)*5 - 1 + (newObj.priority + 1)%5].push(newObj);
                            //  }
                            // }
                        }
                    }
                }
            }

            //Rearrange the triangles to rectangles with correct indices
            for($i = 0;$i<count($latchStrArr);$i++){
                for($j = 0;$j<count($latchStrArr[$i]);$j += 2){
                   $points = []; $caves = [];
                    $pointArr = explode('\n', $latchStrArr[$i][$j]);
                    for($k = 0;$k<3;$k++){
                        array_push($caves, array_map("intval", explode(' ', $pointArr[$k]))[3]);
                        array_push($points, array_splice(array_map("floatval", explode(' ', $pointArr[$k])), 3, 1));
                    }

                    $pointArr = explode('\n', $latchStrArr[$i][$j+1]);
                    for($k = 0;$k<3;$k++){
                        array_push($caves, array_map("intval", explode(' ', $pointArr[$k]))[3]);
                        array_push($points, array_splice(array_map("floatval", explode(' ', $pointArr[$k])), 3, 1));
                    }

                    //Reset latchStrArr
                    $latchStrArr[$i][$j] = "";
                    $latchStrArr[$i][$j+1] = "";

                    $nonEqualPointIndex = -1;
                    $equalPointIndex2 = [];

                    //Finding non equal point index and second triangle's equal indices
                    for($k = 0;$k<3;$k++){
                        $_iter = 0;
                        for(;$_iter + 3 < count($points) && !pointsEqual([$points[$_iter + 3], $points[$k]]);$_iter++);
                        if($_iter+3 >= count($points)){
                            $nonEqualPointIndex = $k;
                        }else{
                            array_push($equalPointIndex2, $_iter+3);
                        }
                    }
                    $equalPointIndex1 = [0, 1, 2];
                    unset($equalPointIndex1, $nonEqualPointIndex);
                    
                    //Adding initial point
                    for($l = 0;$l<3;$l++){
                        $latchStrArr[$i][$j] .= $points[$equalPointIndex1[0]][$l] . " ";
                    }
                    $latchStrArr[$i][$j] .= $caves[$equalPointIndex1[0]] . "\n";

                    //Adding second point
                    for($l = 0;$l<3;$l++){
                        $latchStrArr[$i][$j] .= $points[$nonEqualPointIndex][$l] . " ";
                    }
                    $latchStrArr[$i][$j] .= $caves[$nonEqualPointIndex] . "\n";

                    //Adding third point
                    for($l = 0;$l<3;$l++){
                        $latchStrArr[$i][$j] .= $points[$equalPointIndex1[1]][$l] . " ";
                    }
                    $latchStrArr[$i][$j] .= $caves[$equalPointIndex1[1]] . "\n";

                    //Adding fourth and fifth point
                    foreach($equalPointIndex2 as $element){
                        for($l = 0;$l<3;$l++){
                            $latchStrArr[$i][$j+1] .= $points[$element][$l] . " ";
                        }
                        $latchStrArr[$i][$j+1] .= $caves[$element] . "\n";
                    }
                    
                    //Adding last point
                    for($l = 0;$l<3;$l++){
                        $latchStrArr[$i][$j+1] .= $points[12 - $equalPointIndex2[0] - $equalPointIndex2[1]][$l] . " ";
                    }
                    $latchStrArr[$i][$j+1] .= $caves[12 - $equalPointIndex2[0] - $equalPointIndex2[1]] . "\n";
                }
                for($j = 0;$j<count($latch2StrArr[$i]);$j += 2){
                    $points = []; $caves = [];
                    $pointArr = explode('\n', $latch2StrArr[$i][$j]);

                    for($k = 0;$k<3;$k++){
                        array_push($caves, array_map("intval", explode(' ', $pointArr[$k]))[3]);
                        array_push($points, array_splice(array_map("floatval", explode(' ', $pointArr[$k])), 3, 1));
                    }

                    $pointArr = explode('\n', $latch2StrArr[$i][$j+1]);
                    for($k = 0;$k<3;$k++){
                        array_push($caves, array_map("intval", explode(' ', $pointArr[$k]))[3]);
                        array_push($points, array_splice(array_map("floatval", explode(' ', $pointArr[$k])), 3, 1));
                    }

                    //Reset latchStrArr
                    $latch2StrArr[$i][$j] = "";
                    $latch2StrArr[$i][$j+1] = "";

                    $nonEqualPointIndex = -1;
                    $equalPointIndex2 = [];

                    //Finding non equal point index and second triangle's equal indices
                    for($k = 0;$k<3;$k++){
                        $_iter = 0;
                        for(;$_iter + 3 < count($points) && !pointsEqual([$points[$_iter + 3], $points[$k]]);$_iter++);
                        if($_iter+3 >=count($points)){
                            $nonEqualPointIndex = $k;
                        }else{
                            array_push($equalPointIndex2, $_iter+3);
                        }
                    }
                    $equalPointIndex1 = [0, 1, 2];
                    unset($equalPointIndex1, $nonEqualPointIndex);
                    
                    //Adding initial point
                    for($l = 0;$l<3;$l++){
                        $latch2StrArr[$i][$j] .= $points[$equalPointIndex1[0]][$l] . " ";
                    }
                    $latch2StrArr[$i][$j] .= $caves[$equalPointIndex1[0]] . "\n";

                    //Adding second point
                    for($l = 0;$l<3;$l++){
                        $latch2StrArr[$i][$j] .= $points[$nonEqualPointIndex][$l] . " ";
                    }
                    $latch2StrArr[$i][$j] .= $caves[$nonEqualPointIndex] . "\n";

                    //Adding third point
                    for($l = 0;$l<3;$l++){
                        $latch2StrArr[$i][$j] .= $points[$equalPointIndex1[1]][$l] . " ";
                    }
                    $latch2StrArr[$i][$j] .= $caves[$equalPointIndex1[1]] . "\n";

                    //Adding fourth and fifth point
                    foreach($equalPointIndex2 as $element){
                        for($l = 0;$l<3;$l++){
                            $latch2StrArr[$i][$j+1] .= $points[$element][$l] . " ";
                        }
                        $latch2StrArr[$i][$j+1] .= $caves[$element] . "\n";
                    }
                    
                    //Adding last point
                    for($l = 0;$l<3;$l++){
                        $latch2StrArr[$i][$j+1] .= $points[12 - $equalPointIndex2[0] - $equalPointIndex2[1]][$l] . " ";
                    }
                    $latch2StrArr[$i][$j+1] .= $caves[12 - $equalPointIndex2[0] - $equalPointIndex2[1]] . "\n";
                }
            }
            
            //Printing the model total quantity
            $infoStr .= count($latchStrArr) . "\n";

            for($i = 0;$i<count($latchStrArr);$i++){
                $infoStr .= "model_part" . $i ." " . $posArray[$i] . "\n";
                $total = count($latchStrArr[$i]) + count($latch2StrArr[$i]);
                $infoStr .= $total . "\n";
                for($j = 0;$j<count($latchStrArr[$i]);$j++){
                    $infoStr .= $latchStrArr[$i][$j];
                }
                for($j = 0;$j<count($latch2StrArr[$i]);$j++){
                    $infoStr .= $latch2StrArr[$i][$j];
                }
            }

            // //Adding dependency text info
            // for(var i = connTree.length - 1;i>=0;i--){
            //  for(var j = 0;j<connTree[i].length;j++){
            //      infoStr += "model_part" + connTree[i][j].modelNo + ": layer " + connTree[i][j].layer + "\n";
            //      infoStr += "connecting with models: ";
            //      for(var k = 0;k<connTree[i][j].connecting.length;k++){
            //          infoStr += connTree[i][j].connecting[k] + " ";
            //      }
            //      infoStr += "\n\n";
            //  }
            // }
            download($infoStr, "info.txt", 'text/plain');
        }
        return $objs;
    }

    function degToRad($degree){
        return floatval($degree) * pi() / 180.0;
    }

    function mulMat($mat, $point){
        $vecOut = [0.0, 0.0, 0.0];
        for($i = 0;$i<3;$i++){
            $cur = 0.0;
            for($j = 0;$j<3;$j++){
                $cur += $mat[$i][$j] * $point[$j];
            }
            $vecOut[$i] = $cur;
        }
        return $vecOut;
    }

    //Dealing with array
    function rotateOneAxis($obj, $angle, $vec){

        for($main = 0;$main<count($angle);$main++){
            $radAngle = degToRad($angle[$main]);
            $matrices = [];
            array_push($matrices, [[1.0, 0.0, 0.0], [0.0, cos($radAngle), -sin($radAngle)], [0.0, sin($radAngle), cos($radAngle)]]);
            array_push($matrices, [[cos($radAngle), 0.0, sin($radAngle)], [0.0, 1.0, 0.0], [-sin($radAngle), 0.0, cos($radAngle)]]);
            array_push($matrices, [[cos($radAngle), -sin($radAngle), 0.0], [sin($radAngle), cos($radAngle), 0.0], [0, 0, 1]]);
            
            for($i = 0;$i<count($obj->vertices);$i++){
                $obj->vertices[$i] = mulMat($matrices[$vec[$main]], $obj->vertices[$i]);
                $obj->normals[$i] = mulMat($matrices[$vec[$main]], $obj->normals[$i]);
            }
        }
        
        return $obj;
    }

    //Dealing with array
    function rotateOneAxis_faceArr($faceArr, $angle, $vec){
        for($main = 0;$main<$angle.length;$main++){
            $radAngle = degToRad($angle[$main]);
            $matrices = [];
            array_push($matrices, [[1.0, 0.0, 0.0], [0.0, cos($radAngle), -sin($radAngle)], [0.0, sin($radAngle), cos($radAngle)]]);
            array_push($matrices, [[cos($radAngle), 0.0, sin($radAngle)], [0.0, 1.0, 0.0], [-sin($radAngle), 0.0, cos($radAngle)]]);
            array_push($matrices, [[cos($radAngle), -sin($radAngle), 0.0], [sin($radAngle), cos($radAngle), 0.0], [0, 0, 1]]);
            function mulMat($mat, $point){
                $vecOut = [0.0, 0.0, 0.0];
                for($i = 0;$i<3;$i++){
                    $cur = 0.0;
                    for($j = 0;$j<3;$j++){
                        $cur += $mat[$i][$j] * $point[$j];
                    }
                    $vecOut[$i] = $cur;
                }
                return $vecOut;
            }
            for($i = 0;$i<count($faceArr);$i++){
                for($j = 0;$j<3;$j++){
                    $faceArr[$i][$j] = mulMat($matrices[$vec[$main]], $faceArr[$i][$j]);
                }
            }
        }
        return $faceArr;
    }

    //Adding convex or concave marks(0 or 1) , //
    function addSubMark($str){
        $lines = explode("\n", $str);
        $outStr = "";
        if(count($lines) < 2){
            return "";
        }
        $count = 0; $outNum = 0;
        for($i = 0;$i<count($lines);$i++){
            if($i>2 && $lines[$i] != "" && substr($lines[$i], 0, 5) != "model"){
                $outStr .= $lines[$i] . (string)($outNum % 2) . "\n";
                if(++$count == 6){
                    $count = 0;
                    $outNum++;
                }
            }else{
                $outStr .= $lines[$i] . "\n";
            }
        }
        return $outStr;
    }

    function isConnector($nodeNum){
        if(substr($typeArray[$nodeNum], 0, 4) == "wall"){
            return true;
        }
        return false;
    }

    function faceNormal($points){
        $u = []; $v = [];
        for($i = 0;$i<3;$i++){
            array_push($u, floatval($points[1][$i] - $points[0][$i]));
            array_push($v, floatval($points[2][$i] - $points[0][$i]));
        }

        $out = [];
        array_push($out, $u[1] * $v[2] - $u[2] * $v[1]);
        array_push($out, $u[2] * $v[0] - $u[0] * $v[2]);
        array_push($out, $u[0] * $v[1] - $u[1] * $v[0]);

        normalize($out);

        return $out;
    }

    function pointsEqual($points){
        return((abs(floatval($points[0][0] - $points[1][0])) < 0.00001) && (abs(floatval($points[0][1] - $points[1][1])) < 0.00001) && (abs(floatval($points[0][2] - $points[1][2])) < 0.00001));
    }

    function isInside($meshFaces, $testPoints){
        //Storing the faces of latch
        $meshFacesArr = [];
        $meshFacesArrNo = []; //Storing the quantity of that face appears
        for($testI = 0;$testI<count($testPoints);$testI++){
            //Comparing Area
            $inside = false;
            for($meshFaceIter = 0;$meshFaceIter < count($meshFaces);$meshFaceIter++){
                //1.Finding other triangle to become a rectangle
                //2.Inside that rectangle??

                //Finding other triangle
                //2Points matching
                $triMatch = [];
                $triMatchNo = [];
                for($i = 0;$i<count($meshFaces);$i++){
                    if($i != $meshFaceIter){
                        $noMatch = 0;    //Number of matching
                        for($j = 0;$j<3;$j++){
                            for($k = 0;$k<3;$k++){
                                if(pointsEqual([$meshFaces[$meshFaceIter][$j], $meshFaces[$i][$k]])){
                                    $noMatch++;
                                }
                            }
                        }
                        if($noMatch == 2){
                            $triMatch.push($meshFaces[$i]);
                            $triMatchNo.push($i);
                        }
                    }
                }
                //normal Matching
                $count = 0;
                $otherTri;
                $otherTriNo;
                for($i = 0;$i<count($triMatch);$i++){
                    $negNormal = faceNormal($triMatch[$i]);
                    for($j = 0;$j<3;$j++){
                        $negNormal[$i] *= -1.0;
                    }
                    if(pointsEqual([faceNormal($triMatch[$i]), faceNormal($meshFaces[$meshFaceIter])])){
                        $otherTri = $triMatch[$i];
                        $otherTriNo = $triMatchNo[$i];
                        $count++;
                    }
                }

                if($otherTri){
                    //Combine into a rectangle
                    $rect = [$otherTri[0], $otherTri[1], $otherTri[2]];
                    $pInsert;
                    for($i = 0;$i<3;$i++){
                        $exist = false;
                        for($j = 0;$j<3;$j++){
                            if(pointsEqual([$rect[$j], $meshFaces[$meshFaceIter][$i]]))  $exist = true;
                        }
                        if(!$exist){
                            $pInsert = $meshFaces[$meshFaceIter][$i];
                            break;
                        }
                    }
                    //To confirm the correctness of ordering
                    //1.Find the point in triangle is the farthest
                    //2.insert to index: +2&mod3
                    $maxDis = 0.0;
                    $maxI = 0;
                    for($i = 0;$i<3;$i++){
                        $tmpMag = magnitude([$pInsert, $rect[$i]]);
                        if($maxDis < $tmpMag){
                            $maxDis = $tmpMag;
                            $maxI = $i;
                        }
                    }
                    $rect.splice(($maxI + 2) % 3, 0, $pInsert);

                    //Calculating if inside
                    $sumArea = 0.0;
                    $originalArea = areaOfRectangle($rect);
                    for($i = 0;$i<4;$i++){
                        $sumArea += areaOfTriangle([$rect[$i], $testPoints[$testI], $rect[($i+1)%4]]);
                    }

                    if(abs($sumArea - $originalArea) < 0.0000001){
                        $inside = true;
                        if ($meshFacesArr.indexOf($meshFaceIter) == -1){
                            $meshFacesArr.push($meshFaceIter);
                            $meshFacesArrNo.push(1);
                        }else{
                            $meshFacesArrNo[$meshFacesArr.indexOf($meshFaceIter)]++;
                        }
                        if($meshFacesArr.indexOf($otherTriNo) == -1){
                            $meshFacesArr.push($otherTriNo);
                            $meshFacesArrNo.push(1);
                        }else{
                            $meshFacesArrNo[$meshFacesArr.indexOf($otherTriNo)]++;
                        }
                    }
                }
            }
            if(!$inside){
                return false;
            }
        }
        $indices = [];
        for($i = 0;$i<count($meshFacesArrNo);$i++){
            if($meshFacesArrNo[$i] >= 6){
                $indices.push($meshFacesArr[$i]);
            }
        }
        return $indices;
    }

    function areaOfTriangle($points){
        $ab = []; $bc = []; $ac = [];
        for($i = 0;$i<3;$i++){
            $ab.push($points[0][$i] - $points[1][$i]);
            $bc.push($points[1][$i] - $points[2][$i]);
            $ac.push($points[0][$i] - $points[2][$i]);
        }

        if((abs($ab[0]) + abs($ab[1]) + abs($ab[2])) < 0.0000001 || (abs($bc[0]) + abs($bc[1]) + abs($bc[2])) < 0.0000001 || (abs($ac[0]) + abs($ac[1]) + abs($ac[2])) < 0.0000001) return 0;
        $angle = acos(dot([$ab, $bc])/(magnitude([$points[0], $points[1]])*magnitude([$points[1], $points[2]])));
        return(0.5*(magnitude([$points[0], $points[1]])*magnitude([$points[1], $points[2]]))*sin($angle));
    }

    function areaOfRectangle($points){
        $sum = 0;
        $sum += areaOfTriangle([$points[0], $points[1], $points[2]]);
        $sum += areaOfTriangle([$points[0], $points[1], $points[3]]);
        $sum += areaOfTriangle([$points[0], $points[2], $points[3]]);
        $sum += areaOfTriangle([$points[1], $points[2], $points[3]]);
        $sum /= 2.0;
        return $sum;
    }

    function dot($vecs){
        return($vecs[0][0]*$vecs[1][0] + $vecs[0][1]*$vecs[1][1] + $vecs[0][2]*$vecs[1][2]);
    }

    //Length of 2 vectors
    function magnitude($points){
        if($points[0][0] == $points[1][0] && $points[0][1] == $points[1][1] && $points[0][2] == $points[1][2])    return 0;
        return(sqrt(pow($points[0][0] - $points[1][0], 2) + pow($points[0][1] - $points[1][1], 2) + pow($points[0][2] - $points[1][2], 2)));
    }

    //Function used for converting the model in one .obj (NO DOWNLOADING)
    // function convertToOneObj($inputNode){
    //     $nodesArr = $inputNode->nodes;
    //     $v = 0; $vn = 0; $f = 1;
    //     $vCount = [];

    //     //Look for each array size
    //     for($i = 0;$i<count($nodesArr);$i++){
    //         $curNode = traverse($nodesArr[$i], "geometry");
    //         array_push($vCount, count($curNode.getPositions()));
    //         $v += count($curNode.getPositions());
    //         $vn += count($curNode.getNormals());
    //     }

    //     $matList; $vList; $vnList; $fList;
    //     $matList = [];
    //     $vList = [];
    //     for($i = 0;$i < v;$i++){
    //         array_push($vList, 0.0);
    //     }
    //     //vtList = new Float32Array();
    //     $vnList = [];
    //     for($i = 0;$i < vn;$i++){
    //         array_push($vnList, 0.0);
    //     }
    //     $fList = [];
        
    //     $v = 0;  $vn = 0; //Reset v and vn, and use them for propagating the index

    //     for($nodeI = 0;$nodeI<count($nodesArr);$nodeI++){
    //         $tmpMat = traverse($nodesArr[$nodeI], "matrix").getModelMatrix();
    //         $matList.push($tmpMat);

    //         $curNode = traverse($nodesArr[$nodeI], "geometry");
    //         $tmpPos = $curNode.getPositions();
    //         $tmpNorm = $curNode.getNormals();
    //         $tmpFaces = $curNode.getIndices();
    //         for ($i = 0;$i<count($tmpPos);$i++){
    //             $vList[$v++] = $tmpPos[$i];
    //         }
    //         for ($i = 0;$i<count($tmpNorm);$i++){
    //             $vnList[$vn++] = $tmpNorm[$i];
    //         }
    //         for(i = 0;i<count($tmpFaces);$i++){
    //             array_push($fList, $tmpFaces[$i] + $f);
    //         }
    //         $f = max($fList) + 1;
    //     }
    //     //Export .obj
        
    //     $vStr = ""; $vnStr = "", fStr = "";
    //     for(i = 0;i<vList.length;i += 3){
    //         var vec = [vList[i], vList[i+1], vList[i+2], 1.0];
    //         var outVec = new Array();
    //         for(j = 0;j<16;j+=4){
    //             outVec.push(matList[lookAtNode(vCount, i)][rowToColMajor(j)]*vec[0] + matList[lookAtNode(vCount, i)][rowToColMajor(j+1)]*vec[1] + matList[lookAtNode(vCount, i)][rowToColMajor(j+2)]*vec[2] + matList[lookAtNode(vCount, i)][rowToColMajor(j+3)]*vec[3]);
    //         }
    //         vStr += "v " + outVec[0]/outVec[3] + " " + outVec[1]/outVec[3] + " " + outVec[2]/outVec[3] + "\n";
    //     }
    //     vStr += "\n";
    //     for(i = 0;i<vnList.length;i += 3){
    //         var vec = [vnList[i], vnList[i+1], vnList[i+2], 1.0];
    //         var outVec = new Array();
    //         for(j = 0;j<16;j+=4){
    //             outVec.push(matList[lookAtNode(vCount, i)][rowToColMajor(j)]*vec[0] + matList[lookAtNode(vCount, i)][rowToColMajor(j+1)]*vec[1] + matList[lookAtNode(vCount, i)][rowToColMajor(j+2)]*vec[2] + matList[lookAtNode(vCount, i)][rowToColMajor(j+3)]*vec[3]);
    //         }
    //         // outVec = vec;
    //         vnStr += "vn " + outVec[0]/outVec[3] + " " + outVec[1]/outVec[3] + " " + outVec[2]/outVec[3] + "\n";
    //     }
    //     vnStr += "\n";
    //     for(i = 0;i<fList.length;i += 3){
    //         fStr += "f " + fList[i] + "//" + fList[i] + " " + fList[i+1] + "//" + fList[i+1] + " " + fList[i+2] + "//" + fList[i+2] + "\n";
    //     }
    //     fStr += "\n";
    //     download(vStr + vnStr + fStr, "model.obj", 'text/plain');
    // }

    function rowToColMajor($param){
        return (intval($param/4) + 4*($param%4));
    }

    function lookAtNode($vCount, $i){
        $j = $i;
        for($k = 0;$k<count($vCount);$k++){
            if($j - $vCount[$k] < 0)   return $k;
            else $j -= $vCount[$k];
        }
        return count($vCount) - 1;
    }


    function normalize($vec){
        $mag = abs($vec[0]) + abs($vec[1]) + abs($vec[2]);
        $vec[0] /= $mag;
        $vec[1] /= $mag;
        $vec[2] /= $mag;
    }

    function exploreLine($line){
        $elements = explode(" ", $line);
        array_shift($elements);
        return $elements;
    }

    function exploreFace($face){
        $outputFace  = explode("//", $face);
        return $outputFace[0];
    }

    //Just parsing the text storing .obj and return {<vertices>, <normals>, <faces>}
    function parseObj($text){
        $objText = explode("\n", $text);
        $obj = new ModelObject;   //The elements inside are string
        $vertexMatches = []; $normalMatches = []; $faceMatches = [];
        for($i = 0;$i<count($objText);$i++){
            if($objText[$i][0] == "v" && $objText[$i][1] == " "){
                array_push($vertexMatches, $objText[$i]);
            }
            else if($objText[$i][0] == "v" && $objText[$i][1] == "n"){
                array_push($normalMatches, $objText[$i]);
            }
            else if($objText[$i][0] == "f" && $objText[$i][1] == " "){
                array_push($faceMatches, $objText[$i]);
            }
        }
        if ($vertexMatches)
        {
            $obj->vertices = array_map("exploreLine", $vertexMatches);
        }
        if ($normalMatches)
        {
            $obj->normals = array_map("exploreLine", $normalMatches);
        }
        if ($faceMatches)
        {
            $obj->faces = array_map("exploreLine", $faceMatches);
            $outFaces = [];
            
            for($i = 0;$i<count($obj->faces);$i++){
                array_push($outFaces, array_map("exploreFace", $obj->faces[$i]));
            }
            $obj->faces = $outFaces;
        }
        return $obj;
    }

    //Used for dealing with latch faces and vertices' data storing in connector[]
    function parseObj_withStoring($text, $isConnector){
        $objText = explode("\n", $text);
        $obj = parseObj($text);   //The elements inside are string
        $f = [];
        for($a = 0;$a<count($obj->faces);$a++){
            $vertices = [];
            for($b = 0;$b<3;$b++){
                array_push($vertices, [floatval($obj->vertices[intval($obj->faces[$a][$b]) - 1][0]), floatval($obj->vertices[intval($obj->faces[$a][$b]) - 1][1]), floatval($obj->vertices[intval($obj->faces[$a][$b]) - 1][2])]);
            }
            $tmpVec = [];
            array_push($tmpVec, [$vertices[0][0], $vertices[0][1], $vertices[0][2]]);
            array_push($tmpVec, [$vertices[1][0], $vertices[1][1], $vertices[1][2]]);
            array_push($tmpVec, [$vertices[2][0], $vertices[2][1], $vertices[2][2]]);
            
            array_push($f, [[$vertices[0][0], $vertices[0][1], $vertices[0][2]], [$vertices[1][0], $vertices[1][1], $vertices[1][2]], [$vertices[2][0], $vertices[2][1], $vertices[2][2]]]);
        }
        if($isConnector){
            array_push($connector, $f);
            array_push($connector_No, $outNodeIndex);
        }else{
            array_push($nonConnector, $f);
            array_push($nonConnector_No, $outNodeIndex);
        }
    }

    //The function converting obj to text(.obj)
    function obj2Text($obj){
        $str = ""; $vnStr = ""; $fStr = "";
        foreach($obj->vertices as $element){
            $str .= "v ";
            for($i = 0;$i<3;$i++){
                $str .= (string)($element[$i]) . " ";
            }
            $str .= "\n";
        };
        $str .= "\n";
        foreach($obj->normals as $element){
            $str .= "vn ";
            for($i = 0;$i<3;$i++){
                $str .= (string)($element[$i]) . " ";
            }
            $str .= "\n";
        };
        $str .= "\n";
        $noZero = 0;
        foreach($obj->faces as $element){
            if($element == 0)    $noZero = 1;
        };
        foreach($obj->faces as $element){
            $str .= "f ";
            for($i = 0;$i<3;$i++){
                $str .= (string)(intval($element[$i]) + $noZero) . "//" . (string)(intval($element[$i]) + $noZero) . " ";
            }
            $str .= "\n";
        };
        $str .= "\n";

        return $str;
    }
    // function download(strData, strFileName, strMimeType) {
    //     var D = document,
    //         A = arguments,
    //         a = D.createElement("a"),
    //         d = A[0],
    //         n = A[1],
    //         t = A[2] || "text/plain";

    //     //build download link:
    //     a.href = "data:" + strMimeType + "charset=utf-8," + escape(strData);


    //     if (window.MSBlobBuilder) { // IE10
    //         var bb = new MSBlobBuilder();
    //         bb.append(strData);
    //         return navigator.msSaveBlob(bb, strFileName);
    //     } /* end if(window.MSBlobBuilder) */



    //     if ('download' in a) { //FF20, CH19
    //         a.setAttribute("download", n);
    //         a.innerHTML = "downloading...";
    //         D.body.appendChild(a);
    //         setTimeout(function() {
    //             var e = D.createEvent("MouseEvents");
    //             e.initMouseEvent("click", true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
    //             a.dispatchEvent(e);
    //             D.body.removeChild(a);
    //         }, 66);
    //         return true;
    //     }; /* end if('download' in a) */



    //     //do iframe dataURL download: (older W3)
    //     var f = D.createElement("iframe");
    //     D.body.appendChild(f);
    //     f.src = "data:" + (A[2] ? A[2] : "application/octet-stream") + (window.btoa ? ";base64" : "") + "," + (window.btoa ? window.btoa : escape)(strData);
    //     setTimeout(function() {
    //         D.body.removeChild(f);
    //     }, 333);
    //     return true;
    // }


    function cors() {

        // Allow from any origin
        if (isset($_SERVER['HTTP_ORIGIN'])) {
            header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
            header('Access-Control-Allow-Credentials: true');
            header('Access-Control-Max-Age: 86400');    // cache for 1 day
        }

        // Access-Control headers are received during OPTIONS requests
        if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {

            if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD']))
                header("Access-Control-Allow-Methods: GET, POST, OPTIONS");         

            if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']))
                header("Access-Control-Allow-Headers: {$_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']}");

            exit(0);
        }

        echo "You have CORS!";
    }
    $debug = "";
    // // Allow from any origin
 //    if (isset($_SERVER['HTTP_ORIGIN'])) {
 //        header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
 //        header('Access-Control-Allow-Credentials: true');
 //        header('Access-Control-Max-Age: 86400');    // cache for 1 day
 //    }

 //    // Access-Control headers are received during OPTIONS requests
 //    if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {

 //        if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD']))
 //            header("Access-Control-Allow-Methods: GET, POST, OPTIONS");         

 //        if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']))
 //            header("Access-Control-Allow-Headers:        {$_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']}");

 //        exit(0);
 //    }
    cors();

    $outStr = '';
    $DebugMode = true;
    if($DebugMode)
        if(count($_POST) != 0){
            $dataPOST = trim(file_get_contents('php://input', r));
            file_put_contents("house.xml",$dataPOST);
            
            $xml = new SimpleXMLElement($dataPOST);
            $nodes = makeNode($xml);
            foreach($nodes as $node){
                $node->makePoints();
            }
            $objtext = convertToMultiObj($nodes);
            for($i = 0;$i<count($objtext);$i++){
                file_put_contents($i.".obj", $objtext[$i]);
            }
            // file_put_contents("3.obj", $objtext[4]);


            // file_put_contents("debug.txt", $debugArDiuNei);
        }
        else
           echo "No post params";
    // function searchKey($obj, $str){
    //  $found = false;
    //  getObject($obj)
    // }
    // function getObject($obj, $str){
    //  $arrObj = get_object_vars($obj);
    //  for($i = 0;$i < count($arrObj);$i++){
    //      if(key($arrObj[$i]) == $str){
    //          return arrObj[$i];
    //      }else{

    //      }
    //  }
    // }
    // function findKey($arr, $str){
    //  for($i = 0;$i < count($arr);$i++){
    //      if(key($arr[$i]) == $str){
    //          return arrObj[$i];
    //      }
    //  }
    //  return NULL;
    // }

    function splitSerialize($str, $nextLine){
        $outStr = '';
        $lineIter = 0;
        for($i = 0;$i < strlen($str);$i++){
            while($i < strlen($str) && $str[$i] != "d"){
                $i++;
            }
            $i += 2;
            $j = $i + 1;
            while($j < strlen($str) && $str[$j] != ";"){
                $j++;
            }
            $lineIter++;
            if($lineIter == $nextLine){
                $lineIter = 0;
                $outStr .= substr($str, $i, $j - $i) . "\n";
            }else{
                $outStr .= substr($str, $i, $j - $i) . ", ";
            }
        }
        return $outStr;
    }

    function makeNode($xml){
        $nodes = array();
        $elements = $xml->element;
        foreach($elements as $element){
            $tmpNode = new node($element);
            array_push($nodes, $tmpNode);
            $tmpNode = new node;
        }
        return $nodes;
    }
    function getNode_type($nodes, $str){
        foreach ($nodes as $node) {
            if($node->type == $str){
                return $node;
            }
        }
        return NULL;
    }
    class node{
        public $myElement;
        public $type;
        public $properties;
        public $points;
        public $transform;
        public $transMat;
        public $indices;
        public $pos;

        // public function check(){
        //  if($this->width && $this->height && $this->thickness){
        //      return true;
        //  }else{
        //      return false;
        //  }
        // }

        function __construct($element){
            $this->type = (string)$element->type;
            $this->pos = (string)$element->pos;
            $this->myElement = $element;
            $this->transform = array("scale" => array_map("floatval", (array)explode(",", $element->transform->scale)), "rotate" => array_map("floatval", (array)explode(",", $element->transform->rotate)), "translate" => array_map("floatval", (array)explode(",", $element->transform->translate)));
            // $this->transform = (array)$element->transform->scale;
        }

        public function defaultIndices($total){
            $this->indices = [];
            for($i = 0;$i<$total;$i+=4){
                array_push($this->indices, $i);
                array_push($this->indices, $i+1);
                array_push($this->indices, $i+2);
                array_push($this->indices, $i);
                array_push($this->indices, $i+2);
                array_push($this->indices, $i+3);
            }
        }

        public function triangleIndices($total){
            $this->indices = [];
            array_push($this->indices, 0);
            array_push($this->indices, 1);
            array_push($this->indices, 2);
            array_push($this->indices, 3);
            array_push($this->indices, 4);
            array_push($this->indices, 5);

            for($i = 6;$i<$total;$i+=4){
                array_push($this->indices, $i);
                array_push($this->indices, $i+1);
                array_push($this->indices, $i+2);
                array_push($this->indices, $i);
                array_push($this->indices, $i+2);
                array_push($this->indices, $i+3);
            }
        }

        public function makePoints(){
            $func = $this->type;
            $func = str_replace("/", "_", $func);
            $func = "makePoints_".$func;
            call_user_func(array($this, $func));
            call_user_func(array($this, "makeTransMat"));
            call_user_func(array($this, "transform"));
        }

        public function makePoints_base_basic(){
            $this->properties = array_map("floatval", (array)$this->myElement->property);
            $w = floatval($this->properties["width"]);
            $h = floatval($this->properties["height"]);
            $t = floatval($this->properties["thickness"]);
           
            $pset = 
            array(
                $w, $t, $h, -$w, $t, $h, -$w, -$t, $h, $w, -$t, $h,
                $w, $t, $h, $w, -$t, $h, $w, -$t, -$h, $w, $t, -$h,
                $w, $t, $h, $w, $t, -$h, -$w, $t, -$h, -$w, $t, $h,
                -$w, $t, $h, -$w, $t, -$h, -$w, -$t, -$h, -$w, -$t, $h,
                -$w, -$t, -$h, $w, -$t, -$h, $w, -$t, $h, -$w, -$t, $h, 
                $w, -$t, -$h, -$w, -$t, -$h, -$w, $t, -$h, $w, $t, -$h
            );
            $this->points = [];
            for($i = 0;$i < count($pset);$i+=3){
                array_push($this->points, [$pset[$i], $pset[$i+1], $pset[$i+2]]);
            }
            $this->defaultIndices(count($this->points));
        }

        public function makePoints_roof_gable(){
            $this->properties = array_map("floatval", (array)$this->myElement->property);
            $w = floatval($this->properties["width"]);
            $d = floatval($this->properties["depth"]);
            $h = floatval($this->properties["height"]);
            $t = floatval($this->properties["thickness"]); 
            $r = array_map("floatval", (array)explode(",", $this->myElement->property->ratio));

            $be = ($t * 2.0) / sqrt(3.0);
            $wr = ($w * $r[0] + -$w * $r[1]) / 2.0;
            $pset = 
            array(
                $wr, $h + $be, -$d, -$w - $be, -$h, -$d, -$w - $be, -$h, $d, $wr, $h + $be, $d,
                $wr, $h + $be, -$d, -$w - $be, -$h, -$d, -$w, -$h, -$d, $wr, $h, -$d,
                -$w - $be, -$h, -$d, -$w - $be, -$h, $d, -$w, -$h, $d, -$w, -$h, -$d,
                $wr, $h + $be, $d, -$w - $be, -$h, $d, -$w, -$h, $d, $wr, $h, $d,
        
                $wr, $h + $be, -$d, $w + $be, -$h, -$d,  $w + $be, -$h, $d, $wr, $h + $be, $d,
                $wr, $h + $be, -$d, $w + $be, -$h, -$d, $w, -$h, -$d, $wr, $h, -$d,
                $w + $be, -$h, -$d, $w + $be, -$h, $d, $w, -$h, $d, $w, -$h, -$d,
                $wr, $h + $be, $d, $w + $be, -$h, $d, $w, -$h, $d, $wr, $h, $d,
        
                $wr, $h, -$d, $wr, $h, $d, -$w, -$h, $d, -$w, -$h, -$d,
                $wr, $h, -$d, $wr, $h, $d, $w, -$h, $d, $w, -$h, -$d
            );
            $this->points = [];
            for($i = 0;$i < count($pset);$i+=3){
                array_push($this->points, [$pset[$i], $pset[$i+1], $pset[$i+2]]);
            }
            $this->defaultIndices(count($this->points));
        }

        public function makePoints_wall_triangle(){
            $this->properties = array_map("floatval", (array)$this->myElement->property);
            $w = floatval($this->properties["width"]);
            $h = floatval($this->properties["height"]);
            $t = floatval($this->properties["thickness"]); 
            $r = array_map("floatval", (array)explode(",", $this->myElement->property->ratio));

            $topw = ($w * $r[0] + -$w * $r[1]) / 2.0;
            $pset = 
            array(
                -$w, -$h, -$t, $w, -$h, -$t, $topw, $h, -$t,
                -$w, -$h, $t, $w, -$h, $t, $topw, $h, $t,
                $w, -$h, -$t, $topw, $h, -$t, $topw, $h, $t, $w, -$h, $t,
                -$w, -$h, -$t, $topw, $h, -$t, $topw, $h, $t, -$w, -$h, $t,
                -$w, -$h, -$t, $w, -$h, -$t, $w, -$h, $t, -$w, -$h, $t
            );
            $this->points = [];
            for($i = 0;$i < count($pset);$i+=3){
                array_push($this->points, [$pset[$i], $pset[$i+1], $pset[$i+2]]);
            }
            $this->triangleIndices(count($this->points));
        }

        public function makePoints_wall_no_window(){
            $this->properties = array_map("floatval", (array)$this->myElement->property);
            $w = floatval($this->properties["width"]);
            $h = floatval($this->properties["height"]);
            $t = floatval($this->properties["thickness"]); 
            $pset = 
            array(
                $w, $h, $t, -$w, $h, $t, -$w, -$h, $t, $w, -$h, $t,
                $w, $h, $t, $w, -$h, $t, $w, -$h, -$t, $w, $h, -$t,
                $w, $h, $t, $w, $h, -$t, -$w, $h, -$t, -$w, $h, $t,
                -$w, $h, $t, -$w, $h, -$t, -$w, -$h, -$t, -$w, -$h, $t,
                -$w, -$h, -$t, $w, -$h, -$t, $w, -$h, $t, -$w, -$h, $t,
                $w, -$h, -$t, -$w, -$h, -$t, -$w, $h, -$t, $w, $h, -$t
            );
            $this->points = [];
            for($i = 0;$i < count($pset);$i+=3){
                array_push($this->points, [$pset[$i], $pset[$i+1], $pset[$i+2]]);
            }
            $this->defaultIndices(count($this->points));
        }

        public function math_mulMat4($m1, $m2){
            $mout = array(array(0, 0, 0, 0), array(0, 0, 0, 0), array(0, 0, 0, 0), array(0, 0, 0, 0));
            for($i = 0;$i<4;$i++){
                for($j = 0;$j<4;$j++){
                    for($k = 0;$k<4;$k++){
                        $mout[$i][$j] += $m1[$i][$k]*$m2[$k][$j];
                    }
                }
            }
            return $mout;
        }

        public function mat4x4ToFloat(&$m){
            for($i = 0;$i < 4;$i++){
                for($j = 0;$j < 4;$j++){
                    $m[$i][$j] = floatval($m[$i][$j]);
                }
                // $m[$i] = array_map("floatval", (array)$m[$i]);
            }
            return $m;
        }

        public function makeTransMat(){
            $scale = $this->transform["scale"];
            $rotate = $this->transform["rotate"];
            $translate = $this->transform["translate"];
            
            $smat = array(array($scale[0], 0, 0, 0), array(0, $scale[1], 0, 0), array(0, 0, $scale[2], 0), array(0, 0, 0, 1));
            $this->mat4x4ToFloat($smat);
            $tmat = array(array(1, 0, 0, $translate[0]), array(0, 1, 0, $translate[1]), array(0, 0, 1, $translate[2]), array(0, 0, 0, 1));
            $this->mat4x4ToFloat($tmat);

            $rarc = array(pi()/180*$rotate[0], pi()/180*$rotate[1], pi()/180*$rotate[2]);

            $rotx = array(array(1, 0, 0, 0), array(0, cos($rarc[0]), -sin($rarc[0]), 0), array(0, sin($rarc[0]), cos($rarc[0]), 0), array(0, 0, 0, 1));
            $roty = array(array(cos($rarc[1]), 0, sin($rarc[1]), 0), array(0, 1, 0, 0), array(-sin($rarc[1]), 0, cos($rarc[1]), 0), array(0, 0, 0, 1));
            $rotz = array(array(cos($rarc[2]), -sin($rarc[2]), 0, 0), array(sin($rarc[2]), cos($rarc[2]), 0, 0), array(0, 0, 1, 0), array(0, 0, 0, 1));

            $this->mat4x4ToFloat($rotx);
            $this->mat4x4ToFloat($roty);
            $this->mat4x4ToFloat($rotz);


            // Rz * Ry * Rx
            $rmat = array(array(0, 0, 0, 0), array(0, 0, 0, 0), array(0, 0, 0, 0), array(0, 0, 0, 0));
            $rmat = $this->math_mulMat4($roty, $rotx);
            $rmat = $this->math_mulMat4($rotz, $rmat);

            // Mt * Mr * Ms
            $amat = array(array(0, 0, 0, 0), array(0, 0, 0, 0), array(0, 0, 0, 0), array(0, 0, 0, 0));
            $amat = $this->math_mulMat4($rmat, $smat);
            $amat = $this->math_mulMat4($tmat, $amat);

            $this->transMat = $amat;
        }

        public function transform(){
            for($i = 0;$i<count($this->points);$i++){
                $vec = array($this->points[$i][0], $this->points[$i][1], $this->points[$i][2], 1.0);
                $outVec = array();
                for($j = 0;$j<4;$j++){
                    $tmp = 0;
                    for($k = 0;$k<4;$k++){
                        $tmp += $this->transMat[$j][$k]*$vec[$k];
                    }
                    array_push($outVec, $tmp);
                }
                $this->points[$i][0] = $outVec[0] / $outVec[3];
                $this->points[$i][1] = $outVec[1] / $outVec[3];
                $this->points[$i][2] = $outVec[2] / $outVec[3];
            }
        }
    }
?>