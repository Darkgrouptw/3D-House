// Namespace
var utility = {};

// Convert object to the vector(array) form
utility.vectorForm = function(vector) 
{
    if(vector.a != undefined && vector.b != undefined) { return [ vector.a, vector.b  ]  }
    if(vector.x == undefined || vector.y == undefined || vector.z == undefined) { return vector; }
    return [ vector.x , vector.y, vector.z ]; 
};

// Get the half value
utility.makeHalf = function(value) { return value / 2; };

// True if value is numeric, else get the false
utility.isNumeric = function(value) { return !isNaN(parseFloat(value)) && isFinite(value); };

// True if value undefined, else get the false, notices: null is not undefined
utility.checkIsUndefined = function(value) { return (value !== undefined ? false : true); };

// Generate random string
utility.makeRandomID = function(size)
{
	var text = "";
	var possible = "AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz0123456789";
	for(var index = 0; index < size; index++)
	{
		text += possible.charAt(Math.floor(Math.random() * possible.length));
	}
	return text;
};

// Try generate something like a indices given start and end.
// For example: start = 0, end = 3, group = 4, result = [0, 1, 2, 0, 2, 3]
utility.makeIndices = function(start, end, group)
{
	group = group !== undefined ? group : 4;
	if(group == 4)
	{
		var indices = [], num = end + 1;
		if(((num - start) % group) == 0)
		{
			for(var idx = start; idx < num; idx = idx + group)
			{
				indices = indices.concat([idx, idx + 1, idx + 2, idx, idx + 2, idx + 3]);
			}
		}
		return indices;
	}
	
	if(group == 3)
	{
		var indices = [], num = end + 1;
		if((num % group) == 0)
		{
			for(var idx = start; idx < num; idx = idx + group)
			{
				indices = indices.concat([idx, idx + 1, idx + 2]);
			}
		}
		return indices;
	}
};

// Not yet implement
utility.makeNormals = function (indices, positions) 
{ 
	console.log('makeNormals: Not yet'); 
};

// Needed SceneJS support
utility.transformMatrix = function(transform) 
{
	var smat = SceneJS_math_scalingMat4v(transform.scale);
	var tmat = SceneJS_math_translationMat4v(transform.translate);

	var rarc = [0, 0, 0];
	SceneJS_math_mulVec3Scalar(transform.rotate, Math.PI / 180, rarc);

	var rotx = SceneJS_math_rotationMat4v(rarc[0], [1, 0, 0]);
	var roty = SceneJS_math_rotationMat4v(rarc[1], [0, 1, 0]);
	var rotz = SceneJS_math_rotationMat4v(rarc[2], [0, 0, 1]);

	// Rz * Ry * Rx
	var rmat = SceneJS_math_diagonalMat4v([0, 0, 0, 0]);
	SceneJS_math_mulMat4(roty, rotx, rmat);
	SceneJS_math_mulMat4(rotz, rmat, rmat);

	// Mt * Mr * Ms
	var amat = SceneJS_math_diagonalMat4v([0, 0, 0, 0]);
	SceneJS_math_mulMat4(rmat, smat, amat);
	SceneJS_math_mulMat4(tmat, amat, amat);
	
	return amat;
};

// Triangulation only for 2-D
utility.delaunay2D = function(positions, key)
{
	var EPSILON = 1.0 / 1048576.0;
	var superTriangle = function(v)
	{
		var x = { min: Number.POSITIVE_INFINITY, max: Number.NEGATIVE_INFINITY, mid: 0 };
		var y = { min: Number.POSITIVE_INFINITY, max: Number.NEGATIVE_INFINITY, mid: 0 };

		for(var i = v.length; i--; ) 
		{
			if(v[i][0] < x.min) x.min = v[i][0];
			if(v[i][0] > x.max) x.max = v[i][0];
			if(v[i][1] < y.min) y.min = v[i][1];
			if(v[i][1] > y.max) y.max = v[i][1];
		}

		var dx = x.max - x.min;
		var dy = y.max - y.min;
		var dmax = Math.max(dx, dy);
		x.mid = x.min + dx * 0.5;
		y.mid = y.min + dy * 0.5;

		return [
			[x.mid - 20 * dmax, y.mid -      dmax],
			[x.mid            , y.mid + 20 * dmax],
			[x.mid + 20 * dmax, y.mid -      dmax]
		];
	};
	
	function circumcircle(v, i, j, k) 
	{
		var x1 = v[i][0], y1 = v[i][1], x2 = v[j][0],
			y2 = v[j][1], x3 = v[k][0], y3 = v[k][1],
			fabsy1y2 = Math.abs(y1 - y2),
			fabsy2y3 = Math.abs(y2 - y3),
			xc, yc, m1, m2, mx1, mx2, my1, my2, dx, dy;

		// Check for coincident points
		if(fabsy1y2 < EPSILON && fabsy2y3 < EPSILON)
		  throw new Error("Eek! Coincident points!");

		if(fabsy1y2 < EPSILON) 
		{
			m2  = -((x3 - x2) / (y3 - y2));
			mx2 = (x2 + x3) / 2.0;
			my2 = (y2 + y3) / 2.0;
			xc  = (x2 + x1) / 2.0;
			yc  = m2 * (xc - mx2) + my2;
		}
		else 
		{
			if(fabsy2y3 < EPSILON) 
			{
				m1  = -((x2 - x1) / (y2 - y1));
				mx1 = (x1 + x2) / 2.0;
				my1 = (y1 + y2) / 2.0;
				xc  = (x3 + x2) / 2.0;
				yc  = m1 * (xc - mx1) + my1;
			}
			else 
			{
				m1  = -((x2 - x1) / (y2 - y1));
				m2  = -((x3 - x2) / (y3 - y2));
				mx1 = (x1 + x2) / 2.0;
				mx2 = (x2 + x3) / 2.0;
				my1 = (y1 + y2) / 2.0;
				my2 = (y2 + y3) / 2.0;
				xc  = (m1 * mx1 - m2 * mx2 + my2 - my1) / (m1 - m2);
				yc  = (fabsy1y2 > fabsy2y3) ?
				m1 * (xc - mx1) + my1 :
				m2 * (xc - mx2) + my2;
			}
		}
		dx = x2 - xc;
		dy = y2 - yc;
		return {i: i, j: j, k: k, x: xc, y: yc, r: dx * dx + dy * dy};
	};
	
	var dedup = function(edges) 
	{
		var a, b, m, n;

		for(var j = edges.length; j; ) 
		{
			b = edges[--j];
			a = edges[--j];

			for(var i = j; i; ) 
			{
				n = edges[--i];
				m = edges[--i];

				if((a === m && b === n) || (a === n && b === m)) 
				{
					edges.splice(j, 2);
					edges.splice(i, 2);
					break;
				}
			}
		}
	};
	
	var n = positions.length, i, j, indices, st, open, closed, edges, dx, dy, a, b, c;

	// Fail if there aren't enough vertices to form any triangles.
	if(n < 3) { return []; }

	// Slice out the actual vertices from the passed objects. (Duplicate the
	// array even if we don't, though, since we need to make a supertriangle
	// later on!)
	positions = positions.slice(0);
	if(key) for(i = n; i--; ) positions[i] = positions[i][key];

	// Make an array of indices into the vertex array, sorted by the
	// vertices' x-position.
	indices = new Array(n);
	for(i = n; i--; ) { indices[i] = i; }
	indices.sort(function(i, j) { return positions[j][0] - positions[i][0]; });

	// Next, find the vertices of the supertriangle (which contains all other
	// triangles), and append them onto the end of a (copy of) the vertex
	// array.
	st = superTriangle(positions);
	positions.push(st[0], st[1], st[2]);

	// Initialize the open list (containing the supertriangle and nothing
	// else) and the closed list (which is empty since we havn't processed
	// any triangles yet).
	open   = [circumcircle(positions, n + 0, n + 1, n + 2)];
	closed = []; edges  = [];

	// Incrementally add each vertex to the mesh.
	for(i = indices.length; i--; edges.length = 0) 
	{
		c = indices[i];

		// For each open triangle, check to see if the current point is
		// inside it's circumcircle. If it is, remove the triangle and add
		// it's edges to an edge list.
		for(j = open.length; j--; ) 
		{
			// If this point is to the right of this triangle's circumcircle,
			// then this triangle should never get checked again. Remove it
			// from the open list, add it to the closed list, and skip.
			dx = positions[c][0] - open[j].x;
			if(dx > 0.0 && dx * dx > open[j].r) 
			{
				closed.push(open[j]);
				open.splice(j, 1);
				continue;
			}

			// If we're outside the circumcircle, skip this triangle.
			dy = positions[c][1] - open[j].y;
			if(dx * dx + dy * dy - open[j].r > EPSILON) continue;

			// Remove the triangle and add it's edges to the edge list.
			edges.push(open[j].i, open[j].j, open[j].j, open[j].k, open[j].k, open[j].i);
			open.splice(j, 1);
		}

		// Remove any doubled edges.
		dedup(edges);

		// Add a new triangle for each edge.
		for(j = edges.length; j; ) 
		{
			b = edges[--j]; a = edges[--j];
			open.push(circumcircle(positions, a, b, c));
		}
	}

	// Copy any remaining open triangles to the closed list, and then
	// remove any triangles that share a vertex with the supertriangle,
	// building a list of triplets that represent triangles.
	for(i = open.length; i--; ) { closed.push(open[i]); }
	open.length = 0;

	for(i = closed.length; i--; )
	{
		if(closed[i].i < n && closed[i].j < n && closed[i].k < n)
		{ open.push(closed[i].i, closed[i].j, closed[i].k); }
	}
	return open;
}; // End of delaunay2D


// For easy to management the parameter
function ParameterManager(p, posfunc)
{	
	this.property = {}, this.transform = {}, this.functor = {};
	
	this.functor.unfunc = function(name) { console.log('Error: ' + name + ' undefined.'); return []; };
	
	this.property.width = p.width !== undefined ? p.width: 0;
	this.property.depth = p.depth !== undefined ? p.depth : 0;
	this.property.height = p.height !== undefined ? p.height : 0;
	
	this.property.thickness = p.thickness !== undefined ? p.thickness : 0;
	
	this.property.ratio = p.ratio !== undefined ? p.ratio: {a: 0, b: 0};

	this.transform.scale = p.scale !== undefined ? utility.vectorForm(p.scale): [1, 1, 1];
	this.transform.rotate = p.rotate !== undefined ? utility.vectorForm(p.rotate): [0, 0, 0];
	this.transform.translate = p.translate !== undefined ? utility.vectorForm(p.translate): [0, 0, 0];

	this.functor.position = posfunc != undefined ? posfunc: this.functor.unfunc.bind(null, 'position');
};	

// When needed add the other attribute
ParameterManager.prototype.addAttribute = function(name, attribute)
{
    if(!utility.checkIsUndefined(this.property[name])) 
    { console.log('Warning: You are trying to override the property: ' + name); }
    
    this.property[name] = attribute;
};

// Set function when needed
ParameterManager.prototype.addFunction = function(name, func)
{
	if(!utility.checkIsUndefined(this.functor[name])) 
	{ console.log('Warning: You are trying to override the function: ' + name); }
	
	if(func === undefined || func === null) { func = this.functor.unfunc.bind(null, name); }
	
	this.functor[name] = func;
};

// Getter by specific attribute, for example: get('width')
ParameterManager.prototype.get = function(attribute)
{
	// If attribute in the property
	if(!utility.checkIsUndefined(this.property[attribute])) { return this.property[attribute]; }
	else 
	{
		// Consider transform
		if(!utility.checkIsUndefined(this.transform[attribute])) { return this.transform[attribute]; }
		else { console.log('Error: No ' + attribute + ' attribute in parameter manager.'); }
	}
}

// Setter by specific attribute
ParameterManager.prototype.set = function(attribute, value)
{
	if(!utility.checkIsUndefined(this.property[attribute])) { this.property[attribute] = value; }
	else 
	{
		if(!utility.checkIsUndefined(this.transform[attribute])) { this.transform[attribute] = value; }
		else { console.log('Error: No ' + attribute + ' attribute in parameter manager.'); }
	}
};

// Need redefine in each element
ParameterManager.prototype.createPositions = function() { return this.functor.position(this.property); };

// Optional for texture coordinate
ParameterManager.prototype.createTextures = function() 
{ 
	if (!utility.checkIsUndefined(this.functor.texture))
	{
		return this.functor.texture(this.property);
	}
	return [];
}

ParameterManager.prototype.updateMatirxNode = function(that)
{
	// Up to get the matrix node
	var matrix = that.parent;
	while(true)
	{
		// This is mean the node doesn't wrapped by matrix node. 
		if(utility.checkIsUndefined(matrix['parent'])) { console.log('Warning: No transform node exist.'); return; }
		
		// Move to the parent
		if(matrix.type !== 'matrix') { matrix = matrix.parent; }
		else { break; }
	}
	matrix.setMatrix(utility.transformMatrix(this.transform));
};

ParameterManager.prototype.updateGeometryNode = function(that)
{
	var geometry = that.findNodesByType('geometry')[0];
	geometry.setPositions({ positions: new Float32Array(this.functor.position(this.property)) });
};

// Only needed already have texture modification function
ParameterManager.prototype.updateTextureCoord = function(that)
{
	// If functor does exist texture function
	if(!utility.checkIsUndefined(this.functor.texture))
	{
		var geometry = that.findNodesByType('geometry')[0];
		geometry.setUV({ uv: new Float32Array(this.functor.texture(this.property)) });
	}
}

