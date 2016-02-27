
SceneJS.Types.addType("wall/single_window", 
{
	construct: function (params) 
	{
		this._layer,
        this._paramana = new ParameterManager(params, function(property)
		{
			var moveTo = function(p, t) 
			{
				var r = [];
                for(var i = 0; i < p.length; i = i + 3)
				{ r[i] = p[i] + t.x; r[i + 1] = p[i + 1] + t.y; r[i + 2] = p [i + 2] + t.z; }
				return r;
			}
			
			var makePositive = function(l, i) 
			{ 
				var nl = [];
				nl.push(l[0]); nl.push(l[1]); nl.push(l[2]);
				nl[i] = Math.abs(nl[i]); 
				return nl; 
			}
			
			var w = property.width;
			var h = property.height;
			var t = property.thickness; 
			var r = property.ratio;
			
			var wds = {};
			wds.c = {x: -w + (r.a * 2 * w), y: -h + (r.b * 2 * h), z: 0};
			wds.h = property.windowH, wds.w = property.windowW;
			
			// Make sure window size always greater than the {a: 1, b: 1}
			if(wds.w < 1 || wds.w == undefined) { wds.w = 1; }
			if(wds.h < 1 || wds.h == undefined) { wds.h = 1; }
			
			var inter = [];
			inter.push(moveTo([-wds.w, wds.h, -t], wds.c));
			inter.push(moveTo([-wds.w, -wds.h, -t], wds.c));
			inter.push(moveTo([wds.w, -wds.h, -t], wds.c));
			inter.push(moveTo([wds.w, wds.h, -t], wds.c));
			
			var exter = [[-w, h, -t], [-w, -h, -t], [w, -h, -t], [w, h, -t]];
			var pset = [];
			
			for(var idxr = 0; idxr < 4; idxr++)
			{
				var tmprb = (idxr + 1) % 4, tmpra = idxr;

				pset = pset.concat(inter[tmpra]).concat(exter[tmpra])
					.concat(exter[tmprb]).concat(inter[tmprb]);

				pset = pset.concat(makePositive(exter[tmpra], 2)).concat(makePositive(inter[tmpra], 2))
					.concat(makePositive(inter[tmprb], 2)).concat(makePositive(exter[tmprb], 2));

				pset = pset.concat(exter[tmpra]).concat(makePositive(exter[tmpra], 2))
					.concat(makePositive(exter[tmprb], 2)).concat(exter[tmprb]);

				pset = pset.concat(makePositive(inter[tmpra], 2)).concat(inter[tmpra])
					.concat(inter[tmprb]).concat(makePositive(inter[tmprb], 2));
            }
			
			return new Float32Array(pset);
		});
		
		this._paramana.addAttribute('windowH', params.windowH);
        this._paramana.addAttribute('windowW', params.windowW);
        
        this._paramana.addFunction('texture', function(property)
        {
			// Same with position function
			var w = property.width, h = property.height, r = property.ratio;
			
			var wds = {};
			wds.h = property.windowH; wds.w = property.windowW;
			// Make sure window size always greater than the {a: 1, b: 1}
			if(wds.w < 1 || wds.w == undefined) { wds.w = 1; }
			if(wds.h < 1 || wds.h == undefined) { wds.h = 1; }
			
			wds.h = wds.h / (2 * h); wds.w = wds.w / (2 * w);

			var mapcoord = function(p, t) { var rc = [p[0] + t.a, p[1] + t.b]; return rc; };
			
			var wrUL = mapcoord([-wds.w, wds.h], r);
			var wrDL = mapcoord([-wds.w, -wds.h], r);
			var wrDR = mapcoord([wds.w, -wds.h], r);
			var wrUR = mapcoord([wds.w, wds.h], r);
			
			var uvset = 
			[
				wrUL[0], wrUL[1], 0, 1, 0, 0, wrDL[0], wrDL[1],
				0, 1, wrUL[0], wrUL[1], wrDL[0], wrDL[1], 0, 0,
				1, 0, 1, 1, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 0, 0,
				
				wrDL[0], wrDL[1], 0, 0, 1, 0, wrDR[0], wrDR[1],
				0, 0, wrDL[0], wrDL[1], wrDR[0], wrDR[1], 1, 0,
				1, 0, 1, 1, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 0, 0,
				
				wrDR[0], wrDR[1], 1, 0, 1, 1, wrUR[0], wrUR[1],
				1, 0, wrDR[0], wrDR[1], wrUR[0], wrUR[1], 1, 1,
				1, 0, 1, 1, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 0, 0,
				
				wrUR[0], wrUR[1], 1, 1, 0, 1, wrUL[0], wrUL[1],
				1, 1, wrUR[0], wrUR[1], wrUL[0], wrUL[1], 0, 1,
				1, 0, 1, 1, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 0, 0,
			];
			
			return new Float32Array(uvset);
		});
        
		this.addNode(build.call(this, params)); 
	},

	updateNode: function() 
	{ 
		this._paramana.updateGeometryNode(this);
		this._paramana.updateTextureCoord(this);
	},

    getLayer: function(){ return this._layer; },
	setLayer: function(l){ this._layer = l; },

    getWidth: function() { return this._paramana.get('width'); },
	setWidth: function(w) { this._paramana.set('width', w); this.updateNode(); },
	
	getHeight: function() { return this._paramana.get('height'); },
    setHeight: function(h) { this._paramana.set('height', h); this.updateNode(); },
	
    getThickness: function() { return this._paramana.get('thickness'); },
	setThickness: function(t) { this._paramana.set('thickness', t); this.updateNode(); },

    getRatio: function() { return this._paramana.get('ratio'); },
    setRatio: function(r) { this._paramana.set('ratio', r); this.updateNode(); },
    setRatioA: function(ra) { var pr = this.getRatio(); this.setRatio( { a: ra, b: pr.b } ); },
    setRatioB: function(rb) { var pr = this.getRatio(); this.setRatio( { a: pr.a, b: rb } ); },

    getWindowSize: function() { return { w: this._paramana.get('windowW'), h: this._paramana.get('windowH') };  },
    setWindowW: function(ww) { this._paramana.set('windowW', ww); this.updateNode(); },
    setWindowH: function(wh) { this._paramana.set('windowH', wh); this.updateNode(); },

	getScale: function() { return this._paramana.get('scale'); },
	setScale: function(svec) { this._paramana.set('scale', svec); this._paramana.updateMatirxNode(this); },
	
	getRotate: function() { return this._paramana.get('rotate'); },
	setRotate: function(rvec) { this._paramana.set('rotate', rvec); this._paramana.updateMatirxNode(this); },
	
	getTranslate: function() { return this._paramana.get('translate'); },
	setTranslate: function(tvec) { this._paramana.set('translate', tvec); this._paramana.updateMatirxNode(this); },
	
    setTranslateX: function(x) { var t = this.getTranslate(); this.setTranslate([x, t[1], t[2]]); },
    setTranslateY: function(y) { var t = this.getTranslate(); this.setTranslate([t[0], y, t[2]]); },
    setTranslateZ: function(z) { var t = this.getTranslate(); this.setTranslate([t[0], t[1], z]); },
});

function build(params) 
{
	var positionSet = this._paramana.createPositions();
	var indiceSet = utility.makeIndices(0, (positionSet.length / 3) - 1);
	var uvSet = this._paramana.createTextures();
	
    var geometry = 
	{
		type: "geometry",
		primitive: "triangles",
		positions: positionSet,
		normals: "auto",
        uv: uvSet,
		indices: indiceSet
	};
	
	return geometry;
}
