SceneJS.Types.addType("wall/multi_window", 
{ 
    construct: function (params) 
    {
        this._layer = params.layer;
        this.direction = params.direction;
        this._paramana = new ParameterManager(params, function(property)
        {
			var t = property.thickness, w = property.width, h = property.height;
          
            // Only check exist the value or not. Not check vaild
            var hasDoor = function(p) { return (p.doorSize != undefined && p.doorPosratio != undefined); }
            var hasWindow = function(p) { return (p.windowSize != undefined && p.windowCenter != undefined); }

            var checkPoint = function(pl)
            {
                var flag = true;
                for(var i = 0; i < pl.length; i++)
                {
                    //Check the point
                    var local = false;
                    for(var k = 0; k < this.points.length; k++)
                    {
                        if(this.points[k][0] == pl[i][0] && this.points[k][1] == pl[i][1]) 
                        { local = true; break; }
                    }
                    flag = flag && local;
                }
                return flag;
            }
            
            var sideIndices = function(t)
            {
                var sidepoints = [];
                for(var v = 0; v < this.side; v++)
                {
                    var w = (v + 1) % 4;

                    // Frist
                    sidepoints = sidepoints.concat([this.points[v][0], this.points[v][1], t]);
                    sidepoints = sidepoints.concat([this.points[v][0], this.points[v][1], -t]);
                    sidepoints = sidepoints.concat([this.points[w][0], this.points[w][1], t]);
                    
                    // Second
                    sidepoints = sidepoints.concat([this.points[v][0], this.points[v][1], -t]);
                    sidepoints = sidepoints.concat([this.points[w][0], this.points[w][1], -t]);
                    sidepoints = sidepoints.concat([this.points[w][0], this.points[w][1], t]);
                }
                return sidepoints;
            }
            
            var each = function(functor) { for(var e = 0; e < this.points.length; e++) { functor(this.points[e]); } }
            
            var thicknessAppend = function(plist, tvalue)
            {
                var finalset = [];
                plist.forEach(function(elem) { finalset = finalset.concat([elem[0], elem[1], tvalue]); });
                return finalset;
            }
            
            var objectization = function(p)
			{
				var resobj = {}; resobj.windows = []; resobj.doors = [];
				var ws = p.windowSize, wc = p.windowCenter, ds = p.doorSize, dp = p.doorPosratio;

				// For door, only consider one door now.
				if(hasDoor(p))
				{
					for(var i = 0; i < dp.length; i++)
					{
						var door = {}, init = {}, full = {}; 
						init.x = ((w - ds[i]) * 2 * dp[i]) - w; init.y = -h;
						full.w = 2 * ds[i]; full.h = 2 * ds[i + 1]; 
						
						// Candidate property: texture, center
						door.id = i; door.points = []; door.side = 3;
						door.points.push([init.x, init.y]);
						door.points.push([init.x, init.y + full.h]);
						door.points.push([init.x + full.w, init.y + full.h]);
						door.points.push([init.x + full.w, init.y]);
						door.check = checkPoint.bind(door);
						door.foreach = each.bind(door);
						door.sideind = sideIndices.bind(door);
						
						resobj.doors.push(door);
					}
				}
				
                // For window
				if(hasWindow(p))
				{
					for(var j = 0; j < wc.length; j = j + 2)
					{
						var window = {}, c = {}, half = {};
						c.x = ((2 * w) * wc[j]) - w; c.y = ((2 * h) * wc[j + 1]) - h;
						half.w = ws[j]; half.h = ws[j + 1];
						
						window.id = j; window.points = []; window.side = 4;
						window.points.push([c.x - half.w, c.y - half.h]);
						window.points.push([c.x - half.w, c.y + half.h]);
						window.points.push([c.x + half.w, c.y + half.h]);
						window.points.push([c.x + half.w, c.y - half.h]);	
						window.check = checkPoint.bind(window);
						window.foreach = each.bind(window);
						window.sideind = sideIndices.bind(window);

						resobj.windows.push(window);
					}
				}
				
				return resobj;
			}
			
            var wallpos = [];
            wallpos.push([-w, -h]); wallpos.push([-w, h]); wallpos.push([w, h]); wallpos.push([w, -h]);
			var decorate = objectization(property);
			
            var ap = []; ap = ap.concat(wallpos);

			if(hasDoor(property)) { decorate.doors.forEach(function(td) { td.foreach(function(p) { ap = ap.concat([p]); }); }); }
			if(hasWindow(property)) { decorate.windows.forEach(function(tw) { tw.foreach(function(p) { ap = ap.concat([p]); }); }); }

            var ind = utility.delaunay2D(ap);
            var back = [], front = [];

            // Find out the overlap in the window or door
            for(var hv = 0; hv < ind.length; hv = hv + 3)
            {
                var fs = [ap[ind[hv]], ap[ind[hv + 1]], ap[ind[hv + 2]]];
                var bs = [ap[ind[hv + 2]], ap[ind[hv + 1]], ap[ind[hv]]];
                var flag = false;
				
                if(hasDoor(property)) { decorate.doors.forEach(function(td) { flag = flag || td.check(fs); }); }
                if(hasWindow(property)) { decorate.windows.forEach(function(tw) { flag = flag || tw.check(bs); }); }
                if(!flag) { back = back.concat(bs); front = front.concat(fs); }
            }

            var backside = thicknessAppend(back, t);
            var frontside = thicknessAppend(front, -t);
           
            var inner = [];

            var wallside = 4, doorL = [], doorR = [];
            if(hasDoor(property))
            {
				// Here only consdier one door, not for multiple door
                doorL = sideIndices.bind({ points: [wallpos[0], decorate.doors[0].points[0]], side: 1 })(t);
                doorR = sideIndices.bind({ points: [decorate.doors[0].points[3], wallpos[3]], side: 1 })(t);
                decorate.doors.forEach(function(elem) { inner = inner.concat(elem.sideind(t));});
                wallside = 3;
            }

            var outter = sideIndices.bind({ points: wallpos, side: wallside })(-t);
             
			if(hasWindow(property))
            { decorate.windows.forEach(function(elem) { inner = inner.concat(elem.sideind(t)); }); }

			property.shared.frontback = backside.concat(frontside);
			property.shared.fullwall = {w: w, h: h};
			property.shared.sidenum = ((outter.length + inner.length + doorL.length + doorR.length) / 18);
		
            return backside.concat(frontside).concat(outter).concat(inner).concat(doorL).concat(doorR);
			
        });

        this._paramana.addAttribute('windowSize', utility.vectorForm(params.windowSize));
        this._paramana.addAttribute('windowCenter', utility.vectorForm(params.windowCenter));
		this._paramana.addAttribute('doorSize', utility.vectorForm(params.doorSize));
        this._paramana.addAttribute('doorPosratio', utility.vectorForm(params.doorPosratio));
		
		// For share variable in texture
		this._paramana.addAttribute('shared', {});
		this._paramana.addFunction('texture', function(property)
		{
			var uvset = [];
			var side = [1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 0];
			var f = property.shared.fullwall;
			
			for(var l = 0; l < property.shared.frontback.length; l = l + 3)
			{
				var pa = property.shared.frontback[l], pb = property.shared.frontback[l + 1];
				uvset = uvset.concat([((pa + f.w) / (2 * f.w)), ((pb + f.h) / (2 * f.h))]);
			}
			
			for(var i = 0; i < property.shared.sidenum; i++) { uvset = uvset.concat(side); }
			
			return uvset;
		});

        this.addNode(build.call(this, params));
    },
	
	update: function() 
	{ 
		this._paramana.updateGeometryNode(this); 
		this._paramana.updateTextureCoord(this); 
	},
	
	getLayer: function() { return this._layer; },
	setLayer: function(l) { this._layer = l; },

	getPriority: function() { return this._priority; },
	setPriority: function(p) { this._priority = p; },

	getDirection: function() { return this.direction;},
	setDirection: function(d)
	{
		if(d == "horizontal" || d == "vertical")
		{
			this.direction = d;
			var matrix = this.parent;
			if(d == "horizontal") { this.setRotate([0, 0, 0]); }
			else { this.setRotate([0, 90, 0]); }
		}
	},

	getPercentX: function() { return this._percentX; },
	setPercentX: function(x) { this._percentX = x; },
	
	getPercentY: function() { return this._percentY; },
	setPercentY: function(y) { this._percentY = y; },

	getWidth: function() { return this._paramana.get('width'); },
	setWidth: function(w) { this._paramana.set('width', w); this.update(); },
	
	getHeight: function() { return this._paramana.get('height'); },
	setHeight: function(h) { this._paramana.set('height', h); this.update(); },
	
	getThickness: function() { return this._paramana.get('thickness'); },
	setThickness: function(t) { this._paramana.set('thickness', t); this.update(); },
	
	getDoorPosratio: function() { return this._paramana.get('doorPosratio'); },
	setDoorPosratio: function(dp) { this._paramana.set('doorPosratio', dp); this.update(); },
	setDoorPosratioByPush: function(v) { var tmp = this.getDoorPosratio(); this.setDoorPosratio(tmp.push(v)); },
	setDoorPosratioByIndex: function(v, i)
	{
		var tmp = this.getDoorPosratio();
		if(i < 0 || i > tmp.length) { console.log('Warning: Index is not allowed'); return; }
		tmp[i] = v;
		this.setDoorPosratio(tmp);
	},
	
	getDoorSize: function() { return this._paramana.get('doorSize'); },
	setDoorSize: function(ds) { this._paramana.set('doorSize', ds); this.update(); },
	setDoorSizeByPush: function(v) { var tmp = this.getDoorSize(); this.setDoorSize(tmp.push(v)); },
	setDoorSizeByIndex: function(v, i)
	{
		var tmp = this.getDoorSize();
		if(i < 0 || i > tmp.length) { console.log('Warning: Index is not allowed'); return; }
		tmp[i] = v;
		this.setDoorSize(tmp);
	},
	
	getWindowCenter: function() { return this._paramana.get('windowCenter'); },
	setWindowCenter: function(wc) { this._paramana.set('windowCenter', wc); this.update(); },
	setWindowCenterByPush: function(v) { var tmp = this.getWindowCenter(); this.setWindowCenter(tmp.push(v)); },
	setWindowCenterByIndex: function(v, i)
	{
		var tmp = this.getWindowCenter();
		if(i < 0 || i > tmp.length) { console.log('Warning: Index is not allowed'); return; }
		tmp[i] = v;
		this.setWindowCenter(tmp);
	},
	
	getWindowSize: function() { return this._paramana.get('windowSize'); },
	setWindowSize: function(ws) { this._paramana.set('windowSize', ws); this.update(); },
	setWindowSizeByPush: function(v) { var tmp = this.getWindowSize(); this.setWindowSize(tmp.push(v)); },
	setWindowSizeByIndex: function(v, i)
	{
		var tmp = this.getWindowSize();
		if(i < 0 || i > tmp.length) { console.log('Warning: Index is not allowed'); return; }
		tmp[i] = v;
		this.setWindowSize(tmp);
	},
	
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
	var indiceSet = utility.makeIndices(0, (positionSet.length / 3) - 1, 3);
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
