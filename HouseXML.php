<?php
class HouseXML
{
	var $xmlDoc;
	var $DebugMode = false;
	var $RenderList;
	
	///////////////////////////////////////////////////////////////////////////////
	// 初始化檔案，打名稱丟進去，會讀出
	///////////////////////////////////////////////////////////////////////////////
	function init($loc)
	{
		$this->xmlDoc = new DOMDocument();
		$this->xmlDoc->load($loc);
		
		$this->RenderList = "		nodes:\n		[";
		$this->ReadText();
	}
	
	///////////////////////////////////////////////////////////////////////////////
	// 把所有的東西，push 進去 Array
	///////////////////////////////////////////////////////////////////////////////
	function ReadText()
	{
		$FirstTime = true;
		$layers = $this->xmlDoc->getElementsByTagName('layer');		// Get All Layers
		for($i = 0; $i < $layers->length; $i++)
		{
			// 拿每一層裡面的元件
			$elements = $layers->item($i)->getElementsByTagName('element');
			for($j = 0; $j < $elements->length; $j++)
			{
				if($j == 0)
					$this->RenderList = $this->RenderList."{\n";
				else
					$this->RenderList = $this->RenderList."		{\n";
				
				
				//拿出這些 XML
				$typeNode = $elements->item($j)->getElementsByTagName('type');
				$textureNode = $elements->item($j)->getElementsByTagName('texture');
				$propertyNode = $elements->item($j)->getElementsByTagName('property');
				$transformNode = $elements->item($j)->getElementsByTagName('transform');
				$decorateNode = $elements->item($j)->getElementsByTagName('decorate');
				
				//kaism
				$posInformation = $elements->item($j)->getElementsByTagName('pos');
				
				$nodeStr = "";
				$endStr = "";
				if($transformNode->length != 0)
					$this->MatrixBind($nodeStr, $transformNode->item(0));
				
				if($textureNode->length != 0)
					$this->TextureBind($nodeStr, $textureNode->item(0), $endStr);
				
				if($typeNode->length != 0)
				{
					$this->TypeBind($nodeStr, $typeNode->item(0), $endStr);
					if($propertyNode->length != 0)
					{
						$this->PropertyBind($nodeStr, $propertyNode);
						$this->PropertyBind($nodeStr, $transformNode);
					}
				}
				//多套一層name，這樣scene.js 才可以pick
				$nameWrapStr="					type: \"name\",\n 					name: \"".$textureNode->item(0)->textContent."\",\n\n					nodes:\n					[{\n".$nodeStr."\n".$endStr."				}]\n";
				//多套一層material，這樣才可以個別改顏色
				
				$materialWrapStr="				type: \"material\",\n 				color:{ r:0.8, g:0.8, b:0.8 },\n\n 				nodes:\n				[{\n".$nameWrapStr."				}]\n";
				//再套一層name，儲存方屋資訊
				$nameDoubleWrapStr="			type: \"name\",\n 			name: \"".$posInformation->item(0)->textContent."\",\n\n			nodes:\n 			[{\n".$materialWrapStr."		}]";
				$this->RenderList = $this->RenderList.$nameDoubleWrapStr."\n		},\n";
			}
		}
		$this->RenderList = substr($this->RenderList, 0, strlen($this->RenderList) -2)."]";
		//$this->Draw();
	}
	function Draw()
	{
		$this->RenderList = "	type: \"scene\",\n".
					"	canvasId: \"archcanvas\",\n".
					"	nodes:\n".
					"	[{\n".
						"		type: 	\"cameras/orbit\",\n".
						"		yaw: 0,\n".
						"		pitch: -30,\n".
						"		zoom: 100,\n".
						"		zoomSensitivity: 5.0,\n".
						"		showCursor: false,\n\n".
						$this->RenderList.
						"\n	}]";
		if($this->DebugMode)
			echo $this->RenderList;
		echo "<script>\n";
		echo "SceneJS.setConfigs\n";
		echo "({\n";
		echo "	pluginPath:\"js/plugins\"\n";
		echo "});\n\n";
		

		echo "var scene = SceneJS.createScene\n";
		echo "({\n".$this->RenderList;
		echo "\n})\n";
		echo "UIinit(true)\n";
		echo "ScenePick()\n";
		echo"</script>\n";
	}
	
	
	///////////////////////////////////////////////////////////////////////////////
	// 把 Matrix 的東西，傳到string裡
	///////////////////////////////////////////////////////////////////////////////
	private function MatrixBind(&$str, $transform)
	{
		$scale_xml = $transform->getElementsByTagName('scale')->item(0)->textContent;
		$rotate_xml = $transform->getElementsByTagName('rotate')->item(0)->textContent;
		$translate_xml = $transform->getElementsByTagName('translate')->item(0)->textContent;
		
		$scaleParam = explode(',', $scale_xml);
		$rotateParam = explode(',', $rotate_xml);
		$translateParam = explode(',', $translate_xml);
		
		$translate_m = array
		(
			1,0,0,0,
			0,1,0,0,
			0,0,1,0,
			$translateParam[0],$translateParam[1],$translateParam[2],1
		);
		
		$deg_X = deg2rad($rotateParam[0]);
		$deg_Y = deg2rad($rotateParam[1]);
		$deg_Z = deg2rad($rotateParam[2]);
		$rotate_m_X = array
		(
			1,0,0,0,
			0,round(cos($deg_X) * 1000000) / 1000000, round(sin($deg_X) * 1000000) / 1000000,0,
			0,round(-sin($deg_X) * 1000000) / 1000000, round(cos($deg_X) * 1000000) / 1000000,0,
			0,0,0,1
		);
		$rotate_m_Y = array
		(
			round(cos($deg_Y) * 1000000) / 1000000,0,round(-sin($deg_Y) * 1000000) / 1000000,0,
			0,1,0,0,
			round(sin($deg_Y) * 1000000) / 1000000,0,round(cos($deg_Y) * 1000000) / 1000000,0,
			0,0,0,1
		);
		$rotate_m_Z = array
		(
			round(cos($deg_Z) * 1000000) / 1000000,round(sin($deg_Z) * 1000000) / 1000000,0,0,
			round(-sin($deg_Z) * 1000000) / 1000000,round(cos($deg_Z) * 1000000) / 1000000,0,0,
			0,0,1,0,
			0,0,0,1
		);
		
		$scale_m = array
		(
			$scaleParam[0],0,0,0,
			0,$scaleParam[1],0,0,
			0,0,$scaleParam[2],0,
			0,0,0,1
		);
		$ans = $this->MatrixOperation($this->MatrixOperation($this->MatrixOperation($this->MatrixOperation($translate_m,$rotate_m_X),$rotate_m_Y),$rotate_m_Z),$scale_m);
		$str = "						type: \"matrix\",\n						elements:[". $ans[0];
		for($i = 1; $i < 16; $i++)
			$str = $str.",".$ans[$i];
		$str = $str."],\n\n";
	}
	///////////////////////////////////////////////////////////////////////////////
	// 把 Texture 的東西，傳到string裡
	///////////////////////////////////////////////////////////////////////////////
	private function TextureBind(&$str, $texture, &$endStr)
	{
		$str = $str."						nodes:\n						[{\n";
		$str = $str."							type: \"texture\",\n";
		$str = $str."							src: \"Images/GeometryTexture/".$texture->textContent."\",\n";
		$str = $str."							applyTo: \"color\",\n\n";
		$endStr = $endStr."}]\n";
	}
	///////////////////////////////////////////////////////////////////////////////
	// 把 Type 的東西，傳到string裡
	///////////////////////////////////////////////////////////////////////////////
	private function TypeBind(&$str, $type, &$endStr)
	{
		$str = $str."							nodes:\n							[{\n								type: \"".$type->textContent."\",\n";
		$endStr =  "							".$endStr."						}]\n";
	}
	///////////////////////////////////////////////////////////////////////////////
	// 把 Property 的東西，傳到string裡
	///////////////////////////////////////////////////////////////////////////////
	private function PropertyBind(&$str, $property)
	{
		$child = $property->item(0)->childNodes;
		$first = false;
		for($i = 0; $i < $child->length; $i++)
		{
			$item = $child->item($i);
			if($item->nodeType == 3)		// 是DOMText，所以要跳過
				continue;
			else
			{
				$strlist = explode(",",$item->textContent);
				if(count($strlist) == 1)
					$str = $str."								".$item->nodeName.": ".$item->textContent.",\n";
				else if(count($strlist) == 2)
					$str = $str."								".$item->nodeName.": {a: ".$strlist[0].", b: ".$strlist[1]."},\n";
				else if(count($strlist) == 3)
					$str = $str."								".$item->nodeName.": {x: ".$strlist[0].", y: ".$strlist[1].", z: ".$strlist[2]."},\n";
					
			}
		}
		$str = substr($str, 0, strlen($str) - 2);
	}
	
	///////////////////////////////////////////////////////////////////////////////
	// Matrix 的座標，從二維變到一維
	///////////////////////////////////////////////////////////////////////////////
	private function ChangeCoord($i, $j)
	{
		return $i * 4 + $j;
	}
	///////////////////////////////////////////////////////////////////////////////
	// Matrix 的矩陣運算
	///////////////////////////////////////////////////////////////////////////////
	private function MatrixOperation($array1,$array2)
	{
		$ans = array
		(
			0,0,0,0, 
			0,0,0,0, 
			0,0,0,0,
			0,0,0,0
		);
		for($i = 0; $i < 4; $i++)
			for($j = 0; $j < 4; $j++)
				for($gap = 0; $gap < 4; $gap++)
					$ans[$this->ChangeCoord($i,$j)] += $array1[$i * 4 + $gap] * $array2[$j + $gap * 4];
		return $ans;
	}
}
?>