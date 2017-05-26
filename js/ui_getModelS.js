function getHipS(param){
    var hipS = {
        type: "flags",
        flags:{transparent:false},
        nodes:
        [{
            type: "name",
            name: "roof",

            nodes:
            [{
                type: "material",
                color:none_select_material_color,
                alpha:0.2,
                nodes:
                [{
                    type: "name",
                    name: "roof.jpg",

                    nodes:
                    [{
                        type: "matrix",
                        elements:[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],

                        nodes:
                        [{
                            type: "texture",
                            src: "images/GeometryTexture/roof.jpg",
                            applyTo: "color",

                            nodes: 
                            [{
                                type: "texture",
                                src: "images/GeometryTexture/roofSpecularMap.png",
                                applyTo: "specular", // Apply to specularity

                                nodes: 
                                [{
                                    type: "texture",
                                    src: "images/GeometryTexture/roofNormalMap.png",
                                    applyTo: "normals", // Apply to geometry normal vectors

                                    nodes:
                                    [{
                                        type: "roof/hip",
                                        layer: param.layerNumber,
                                        height: param.Height,
                                        width: param.Width,
                                        thickness: 2,
                                        depth: param.Depth,
                                        ratio: {a: 0.5 , b: 0.5 },
                                        toplen: 0,
                                        scale: {x: 1, y: 1, z: 1},
                                        rotate: {x: 0, y: 90, z: 0},
                                        translate: {x: 0, y: 0, z: 0}
                                    }]
                                }]
                            }]
                        }]
                    }]
                }]
            }]
        }] 
    };
    return hipS;
}

function getMansardS(param){
    var mansardS = {
        type: "flags",
        flags:{transparent:false},
        nodes:
        [{
            type: "name",
            name: "roof",

            nodes:
            [{
                type: "material",
                color:none_select_material_color,
                alpha:0.2,
                nodes:
                [{
                    type: "name",
                    name: "roof.jpg",

                    nodes:
                    [{
                        type: "matrix",
                        elements:[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],

                        nodes:
                        [{
                            type: "texture",
                            src: "images/GeometryTexture/roof.jpg",
                            applyTo: "color",

                            nodes: 
                            [{
                                type: "texture",
                                src: "images/GeometryTexture/roofSpecularMap.png",
                                applyTo: "specular", // Apply to specularity

                                nodes: 
                                [{
                                    type: "texture",
                                    src: "images/GeometryTexture/roofNormalMap.png",
                                    applyTo: "normals", // Apply to geometry normal vectors

                                    nodes:
                                    [{
                                        type: "roof/mansard",
                                        layer: param.layerNumber,
                                        height: param.Height,
                                        width: param.Width,
                                        thickness: 1,
                                        depth: param.Depth,
                                        ratio: {a: 0.2 , b: 0.2},
                                        scale: {x: 1, y: 1, z: 1},
                                        rotate: {x: 0, y: 90, z: 0},
                                        translate: {x: 0, y: 0, z: 0}
                                    }]
                                }]
                            }]
                        }]
                    }]
                }]
            }]
        }] 
    };
    return mansardS
}

function getGableS(param){

    var gableS = {
        type: "flags",
        flags:{transparent:false},
        nodes:
        [{
            type: "name",
            name: "roof",

            nodes:
            [{
                type: "material",
                color:none_select_material_color,
                alpha:0.2,
                nodes:
                [{
                    type: "name",
                    name: "roof.jpg",

                    nodes:
                    [{
                        type: "matrix",
                        elements:[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],

                        nodes:
                        [{
                            type: "texture",
                            src: "images/GeometryTexture/roof.jpg",
                            applyTo: "color",

                            nodes: 
                            [{
                                type: "texture",
                                src: "images/GeometryTexture/roofSpecularMap.png",
                                applyTo: "specular", // Apply to specularity

                                nodes: 
                                [{
                                    type: "texture",
                                    src: "images/GeometryTexture/roofNormalMap.png",
                                    applyTo: "normals", // Apply to geometry normal vectors

                                    nodes:
                                    [{
                                        type: "roof/gable",
                                        layer: param.layerNumber,
                                        height: param.Height,
                                        width: param.Width,
                                        thickness: 1,
                                        depth: param.Depth,
                                        ratio: {a: 0.5 , b: 0.5},
                                        scale: {x: 1, y: 1, z: 1},
                                        rotate: {x: 0, y: 90, z: 0},
                                        translate: {x: 0, y: 0, z: 0}
                                    }]
                                }]
                            }]
                        }]
                    }]
                }]
            }]
        }] 
    };
    return gableS;
}
function getCrossMansardS(param){
	var corss_mansardS = {
        type: "flags",
        flags:{transparent:false},
        nodes:
        [{
            type: "name",
            name: "roof",

            nodes:
            [{
                type: "material",
                color:none_select_material_color,
                alpha:0.2,
                nodes:
                [{
                    type: "name",
                    name: "roof.jpg",

                    nodes:
                    [{
                        type: "matrix",
                        elements:[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],

                        nodes:
                        [{
                            type: "texture",
                            src: "images/GeometryTexture/roof.jpg",
                            applyTo: "color",

                            nodes: 
                            [{
                                type: "texture",
                                src: "images/GeometryTexture/roofSpecularMap.png",
                                applyTo: "specular", // Apply to specularity

                                nodes: 
                                [{
                                    type: "texture",
                                    src: "images/GeometryTexture/roofNormalMap.png",
                                    applyTo: "normals", // Apply to geometry normal vectors

                                    nodes:
                                    [{
                                        type: "roof/cross_mansard",
                                        layer: param.layerNumber,
                                        height: param.Height,
                                        width: param.Width,
                                        thickness: 1,
                                        depth: param.Depth,

										back_side: "on",
										extrude_len: 1,
										extrude_pos: 0.5,
										extrude_hgt: 1,
										extrude_bas: 20,
										extrude_tpl: 0.2, 
										back_grasp: 1,
                                        front_cover: "off",
                                        
                                        ratio: {a: 0.2 , b: 0.2},
                                        scale: {x: 1, y: 1, z: 1},
                                        rotate: {x: 0, y: 180, z: 0},
                                        translate: {x: 0, y: 0, z: 0}
                                    }]
                                }]
                            }]
                        }]
                    }]
                }]
            }]
        }] 
    };
	return corss_mansardS;
}
function getCrossGableS(param){
	var cross_gableS={
		type: "flags",
        flags:{transparent:false},
        nodes:
        [{
            type: "name",
            name: "roof",

            nodes:
            [{
                type: "material",
                color:none_select_material_color,
                alpha:0.2,
                nodes:
                [{
                    type: "name",
                    name: "roof.jpg",

                    nodes:
                    [{
                        type: "matrix",
                        elements:[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],

                        nodes:
                        [{
                            type: "texture",
                            src: "images/GeometryTexture/roof.jpg",
                            applyTo: "color",

                            nodes: 
                            [{
                                type: "texture",
                                src: "images/GeometryTexture/roofSpecularMap.png",
                                applyTo: "specular", // Apply to specularity

                                nodes: 
                                [{
                                    type: "texture",
                                    src: "images/GeometryTexture/roofNormalMap.png",
                                    applyTo: "normals", // Apply to geometry normal vectors

                                    nodes:
                                    [{
                                        type: "roof/cross_gable",
                                        layer: param.layerNumber,
                                        height: param.Height,
                                        width: param.Width,
                                        back_side: "off",
                                        back_grasp:4,
                                        extrude_len:6,
                                        extrude_pos:0.5,
                                        extrude_bas:6,
                                        extrude_hgt:0.7,
                                        thickness: 1,
                                        depth: param.Depth,
                                        ratio: {a: 0.5 , b: 0.5},
                                        scale: {x: 1, y: 1, z: 1},
                                        rotate: {x: 0, y: 180, z: 0},
                                        translate: {x: 0, y: 0, z: 0}
                                    }]
                                }]
                            }]
                        }]
                    }]
                }]
            }]
        }]
	};
	return cross_gableS;
}
function getTriangleS(param){
    var TriangleS = {
        type: "flags",
        flags:{transparent:false},
        nodes:
        [{
            type: "name",
            name: param.pos,

            nodes:
            [{
                type: "material",
                color:none_select_material_color,
                alpha:0.2,
                nodes:
                [{
                    type: "name",
                    name: "wall.jpg",

                    nodes:
                    [{
                        type: "matrix",
                        elements:[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],

                        nodes:
                        [{
                            type: "texture",
                            src: "images/GeometryTexture/wall.jpg",
                            applyTo: "color",

                            nodes: 
                            [{
                                type: "texture",
                                src: "images/GeometryTexture/wallSpecularMap.png",
                                applyTo: "specular", // Apply to specularity

                                nodes: 
                                [{
                                    type: "texture",
                                    src: "images/GeometryTexture/wallNormalMap.png",
                                    applyTo: "normals", // Apply to geometry normal vectors

                                    nodes:
                                    [{
                                        type: "wall/triangle",
                                        layer: param.layerNumber,
                                        height: param.Height,
                                        width: param.Width,
                                        thickness: 1,
                                        ratio: {a: 0.5 , b: 0.5},
                                        scale: {x: 1, y: 1, z: 1},
                                        rotate: {x: param.rotateX, y: param.rotateY, z: param.rotateZ},
                                        translate: {x: 0, y: 0, z: 0}
                                    }]
                                }]
                            }]
                        }]
                    }]
                }]
            }]
        }] 
    };
    return TriangleS;
}
function getTrapezoidS(param){
	var TrapezoidS = {
        type: "flags",
        flags:{transparent:false},
        nodes:
        [{
            type: "name",
            name: param.pos,

            nodes:
            [{
                type: "material",
                color:none_select_material_color,
                alpha:0.2,
                nodes:
                [{
                    type: "name",
                    name: "wall.jpg",

                    nodes:
                    [{
                        type: "matrix",
                        elements:[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],

                        nodes:
                        [{
                            type: "texture",
                            src: "images/GeometryTexture/wall.jpg",
                            applyTo: "color",

                            nodes: 
                            [{
                                type: "texture",
                                src: "images/GeometryTexture/wallSpecularMap.png",
                                applyTo: "specular", // Apply to specularity

                                nodes: 
                                [{
                                    type: "texture",
                                    src: "images/GeometryTexture/wallNormalMap.png",
                                    applyTo: "normals", // Apply to geometry normal vectors

                                    nodes:
                                    [{
                                        type: "wall/trapezoid",
                                        layer: param.layerNumber,
                                        height: param.Height,
                                        width: param.Width,
                                        thickness: 1,
                                        ratio: {a: 0.2 , b: 1.0},
                                        scale: {x: 1, y: 1, z: 1},
                                        rotate: {x: 0, y: 0, z: 0},
                                        translate: {x: 0, y: 0, z: 0}
                                    }]
                                }]
                            }]
                        }]
                    }]
                }]
            }]
        }] 
    };
    return TrapezoidS;
}
function getWindow_fixed(param){
	var window_fixed = {
		type: "flags",
		flags:{transparent:false},
		nodes:
		[{
			type: "name",
			name: param.pos,
			
			nodes:
			[{
				type: "material",
				color:none_select_material_color,
                alpha:0.2,
				
				nodes:
				[{
					type: "name",
					name: "iron.jpg",
					
					nodes:
					[{
						type: "matrix",
						elements:[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],
						
						nodes:
						[{
							type: "texture",
							src: "images/GeometryTexture/iron.jpg",
							applyTo: "color",
							
							nodes: 
                            [{
                                type: "texture",
                                src: "images/GeometryTexture/ironSpecularMap.png",
                                applyTo: "specular", // Apply to specularity

                                nodes: 
                                [{
                                    type: "texture",
                                    src: "images/GeometryTexture/ironNormalMap.png",
                                    applyTo: "normals", // Apply to geometry normal vectors

                                    nodes:
                                    [{
                                        type: "window/fixed",
                                        extend: param.extend,
                                        size: {a: param.sizeX, b: param.sizeY},
                                        thickness: 1,
                                        rotate: {x: 0, y: 0, z: 0},
                                        translate: {x: 0, y: 0, z: 0},
                                        scale: {x: 1, y: 1, z: 1}
                                    }]
                                }]
                            }]
						}]
					}]
					
				}]
			}]
			
		}]
	};
	return window_fixed;
}
function getNormalWallS(param){
	var normal_wall = {
		type: "flags",
        flags:{transparent:false},
        nodes:
        [{
            type: "name",
            name: param.pos,

            nodes:
            [{
                type: "material",
                color:none_select_material_color,
                alpha:0.2,
                nodes:
                [{
                    type: "name",
                    name: "Wall.jpg",

                    nodes:
                    [{
                        type: "matrix",
                        elements:[0,0,1,0,1,0,0,0,0,1,0,0,9,8.5,0,1],

                        nodes:
                        [{
                            type: "texture",
                            src: "images/GeometryTexture/wall.jpg",
                            applyTo: "color",

                            nodes: 
                            [{
                                type: "texture",
                                src: "images/GeometryTexture/wallSpecularMap.png",
                                applyTo: "specular", // Apply to specularity

                                nodes: 
                                [{
                                    type: "texture",
                                    src: "images/GeometryTexture/wallNormalMap.png",
                                    applyTo: "normals", // Apply to geometry normal vectors

                                    nodes:
                                    [{
                                        type: "wall/no_window",
                                        layer: param.layer,
                                        height: param.height,
                                        width: param.width,
                                        thickness: param.thick,
                                        direction: param.dir,
                                        priority: param.pri,
                                        percentX: param.perX,
                                        percentY: param.perY,
                                        scale: {x: 1, y: 1, z: 1},
                                        rotate: {x: param.rotateX, y: param.rotateY, z: param.rotateZ},
                                        translate: {x: 0, y: 0, z: 0}
                                    }]
                                }]
                            }]
                        }]
                    }]
                }]
            }]
        }]
	};
	return normal_wall;
}
function getSingleWallS(param){
	var single_wall = {
		type: "flags",
        flags:{transparent:false},
        nodes:
        [{
            type: "name",
            name: param.pos,

            nodes:
            [{
                type: "material",
                color:none_select_material_color,
                alpha:0.2,
                nodes:
                [{
                    type: "name",
                    name: "Wall.jpg",

                    nodes:
                    [{
                        type: "matrix",
                        elements:[0,0,1,0,1,0,0,0,0,1,0,0,9,8.5,0,1],

                        nodes:
                        [{
                            type: "texture",
                            src: "images/GeometryTexture/wall.jpg",
                            applyTo: "color",

                            nodes: 
                            [{
                                type: "texture",
                                src: "images/GeometryTexture/wallSpecularMap.png",
                                applyTo: "specular", // Apply to specularity

                                nodes: 
                                [{
                                    type: "texture",
                                    src: "images/GeometryTexture/wallNormalMap.png",
                                    applyTo: "normals", // Apply to geometry normal vectors

                                    nodes:
                                    [{
                                        type: "wall/single_window",
                                        layer: param.layer,
                                        height: param.height,
                                        width: param.width,
                                        thickness: param.thick,
                                        direction: param.dir,
                                        ratio: {a: 0.5,b: 0.5},
                                        windowW: 3,
                                        windowH: 3,
                                        priority: param.pri,
                                        percentX: param.perX,
                                        percentY: param.perY,
                                        scale: {x: 1, y: 1, z: 1},
                                        rotate: {x: param.rotateX, y: param.rotateY, z: param.rotateZ},
                                        translate: {x: 0, y: 0, z: 0}
                                    }]
                                }]
                            }]
                        }]
                    }]
                }]
            }]
        }]
	};
	return single_wall; 
}
function getDoorWallS(param){
	var door_wall = {
		type: "flags",
        flags:{transparent:false},
        nodes:
        [{
            type: "name",
            name: param.pos,

            nodes:
            [{
                type: "material",
                color:none_select_material_color,
                alpha:0.2,
                nodes:
                [{
                    type: "name",
                    name: "Wall.jpg",

                    nodes:
                    [{
                        type: "matrix",
                        elements:[0,0,1,0,1,0,0,0,0,1,0,0,9,8.5,0,1],

                        nodes:
                        [{
                            type: "texture",
                            src: "images/GeometryTexture/wall.jpg",
                            applyTo: "color",

                            nodes: 
                            [{
                                type: "texture",
                                src: "images/GeometryTexture/wallSpecularMap.png",
                                applyTo: "specular", // Apply to specularity

                                nodes: 
                                [{
                                    type: "texture",
                                    src: "images/GeometryTexture/wallNormalMap.png",
                                    applyTo: "normals", // Apply to geometry normal vectors

                                    nodes:
                                    [{
                                        type: "wall/door_entry",
                                        layer: param.layer,
                                        height: param.height,
                                        width: param.width,
                                        thickness: param.thick,
                                        direction: param.dir,
                                        posratio: 0.5,
                                        doorW: 3,
                                        doorH: 6,
                                        priority: param.pri,
                                        percentX: param.perX,
                                        percentY: param.perY,
                                        scale: {x: 1, y: 1, z: 1},
                                        rotate: {x: param.rotateX, y: param.rotateY, z: param.rotateZ},
                                        translate: {x: 0, y: 0, z: 0}
                                    }]
                                }]
                            }]
                        }]
                    }]
                }]
            }]
        }]
	};
	return door_wall;
}
function getMultiWallS(param){
	var multi_wall = {
		type: "flags",
        flags:{transparent:false},
        nodes:
        [{
            type: "name",
            name: param.pos,

            nodes:
            [{
                type: "material",
                color:none_select_material_color,
                alpha:0.2,
                nodes:
                [{
                    type: "name",
                    name: "Wall.jpg",

                    nodes:
                    [{
                        type: "matrix",
                        elements:[0,0,1,0,1,0,0,0,0,1,0,0,9,8.5,0,1],

                        nodes:
                        [{
                            type: "texture",
                            src: "images/GeometryTexture/wall.jpg",
                            applyTo: "color",

                            nodes: 
                            [{
                                type: "texture",
                                src: "images/GeometryTexture/wallSpecularMap.png",
                                applyTo: "specular", // Apply to specularity

                                nodes: 
                                [{
                                    type: "texture",
                                    src: "images/GeometryTexture/wallNormalMap.png",
                                    applyTo: "normals", // Apply to geometry normal vectors

                                    nodes:
                                    [{
                                        type: "wall/multi_window",
                                        layer: param.layer,
                                        height: param.height,
                                        width: param.width,
                                        thickness: param.thick,
                                        direction: param.dir,
                                        priority: param.pri,
                                        percentX: param.perX,
                                        percentY: param.perY,
										windowSize: [3,3,3,3,3,3],
										windowCenter: [0.9,0.5,0.1,0.5,0.5,0.5],
										gap: 2,
                                        scale: {x: 1, y: 1, z: 1},
                                        rotate: {x: param.rotateX, y: param.rotateY, z: param.rotateZ},
                                        translate: {x: 0, y: 0, z: 0}
                                    }]
                                }]
                            }]
                        }]
                    }]
                }]
            }]
        }]
	};
	return multi_wall;
}
function getBaseS(param){
    var base = {
        type: "flags",
        flags:{transparent:false},
        nodes:
        [{
            type: "name",
            name: param.pos,

            nodes:
            [{
                type: "material",
                color:none_select_material_color,
                alpha:0.2,
                nodes:
                [{
                    type: "name",
                    name: "ground.jpg",

                    nodes:
                    [{
                        type: "matrix",
                        elements:[0,0,1,0,1,0,0,0,0,1,0,0,9,8.5,0,1],

                        nodes:
                        [{
                            type: "texture",
                            src: "images/GeometryTexture/ground.jpg",
                            applyTo: "color",

                            nodes: 
                            [{
                                type: "texture",
                                src: "images/GeometryTexture/groundSpecularMap.png",
                                applyTo: "specular", // Apply to specularity

                                nodes: 
                                [{
                                    type: "texture",
                                    src: "images/GeometryTexture/groundNormalMap.png",
                                    applyTo: "normals", // Apply to geometry normal vectors

                                    nodes:
                                    [{
                                        type: "base/basic",
                                        layer: param.layer,
                                        height: param.height,
                                        width: param.width,
                                        thickness: param.thick,
                                        scale: {x: 1, y: 1, z: 1},
                                        rotate: {x: param.rotateX, y: param.rotateY, z: param.rotateZ},
                                        translate: {x: 0, y: 0, z: 0}
                                    }]
                                }]
                            }]
                        }]
                    }]
                }]
            }]
        }]
    };
    return base;
}