<?php
	$debug = "";
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
            header("Access-Control-Allow-Headers:        {$_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']}");

        exit(0);
    }
    $DebugMode = true;
    if($DebugMode)
        if(count($_POST) != 0){
        	$dataPOST = trim(file_get_contents('php://input', r));
            file_put_contents("house.xml",$dataPOST);
            
            $xml = new SimpleXMLElement($dataPOST);
            $nodes = makeNode($xml);
            getNode_type($nodes, "base/basic")->makePoints();
            file_put_contents("debug.txt", serialize(getNode_type($nodes, "base/basic")->points));
            // file_put_contents("debug.txt", getNode_type($nodes, "base/basic")->makePoints());

        }
        else
           echo "No post params";
    // function searchKey($obj, $str){
    // 	$found = false;
    // 	getObject($obj)
    // }
    // function getObject($obj, $str){
    // 	$arrObj = get_object_vars($obj);
    // 	for($i = 0;$i < count($arrObj);$i++){
    // 		if(key($arrObj[$i]) == $str){
    // 			return arrObj[$i];
    // 		}else{

    // 		}
    // 	}
    // }
    // function findKey($arr, $str){
    // 	for($i = 0;$i < count($arr);$i++){
    // 		if(key($arr[$i]) == $str){
    // 			return arrObj[$i];
    // 		}
    // 	}
    // 	return NULL;
    // }


    function makeNode($xml){
   		$nodes = array();
   		$elements = $xml->element;
   		$tmpNode = new node;
   		foreach($elements as $element){
   			$tmpNode->type = (string)$element->type;
   			$tmpNode->properties = array_map("intval", (array)$element->property);
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
    	public $type;
    	public $properties;
    	public $points;

    	// public function check(){
    	// 	if($this->width && $this->height && $this->thickness){
    	// 		return true;
    	// 	}else{
    	// 		return false;
    	// 	}
    	// }

    	public function makePoints(){
    		$func = $this->type;
    		$func = str_replace("/", "_", $func);
    		$func = "makePoints_".$func;
    		call_user_func(array($this, $func));
    	}

    	public function makePoints_base_basic(){
    		$w = $this->properties["width"];
    		$h = $this->properties["height"];
    		$t = $this->properties["thickness"]; 
			$pset = 
            array(
				$w, $t, $h, -$w, $t, $h, -$w, -$t, $h, $w, -$t, $h,
				$w, $t, $h, $w, -$t, $h, $w, -$t, -$h, $w, $t, -$h,
				$w, $t, $h, $w, $t, -$h, -$w, $t, -$h, -$w, $t, $h,
				-$w, $t, $h, -$w, $t, -$h, -$w, -$t, -$h, -$w, -$t, $h,
				-$w, -$t, -$h, $w, -$t, -$h, $w, -$t, $h, -$w, -$t, $h, 
				$w, -$t, -$h, -$w, -$t, -$h, -$w, $t, -$h, $w, $t, -$h
			);
    		$this->points = $pset;
    	}

   //  	public function makePoints_base_basic(){
   //  		$w = $this->width;
   //  		$h = $this->height;
   //  		$t = $this->thickness; 
   //  		$d = $this->depth;
   //  		$r = $this->ratio;
			// $pset = 
   //          array(
			// 	$w, $t, $h, -$w, $t, $h, -$w, -$t, $h, $w, -$t, $h,
			// 	$w, $t, $h, $w, -$t, $h, $w, -$t, -$h, $w, $t, -$h,
			// 	$w, $t, $h, $w, $t, -$h, -$w, $t, -$h, -$w, $t, $h,
			// 	-$w, $t, $h, -$w, $t, -$h, -$w, -$t, -$h, -$w, -$t, $h,
			// 	-$w, -$t, -$h, $w, -$t, -$h, $w, -$t, $h, -$w, -$t, $h, 
			// 	$w, -$t, -$h, -$w, -$t, -$h, -$w, $t, -$h, $w, $t, -$h
			// );
   //  		$this->points = $pset;
   //  	}
    }
?>