
SceneJS.Types.addType("roof/cross_mansard", 
{ 
    construct:function (params) 
    { 
        this._layer;
        this._paramana = new ParameterManager(params, function(property)
	    {
            var ratio_check = function(r) 
            {
                if(r.a > 0.5) { r.a = 0.5; } if(r.b > 0.5) { r.b = 0.5; }
                if(r.a < 0.0) { r.a = 0.0; } if(r.b < 0.0) { r.b = 0.0; }
                return r;
            };

            var d = property.width;
            var w = property.depth;
            var h = property.height;
            var t = property.thickness;
	        var r = ratio_check(property.ratio);

            var eb = property.extrude_bas;
            var et = property.extrude_tpl;
            var el = property.extrude_len;
            var eh = property.extrude_hgt;
            var ep = property.extrude_pos;

            var bgp = property.back_grasp;
			
	        var hmt = h - t; 
            
            var dNwr = 2 * -w * r.a, dPwr = 2 * w * r.a; 
	        var dNdr = 2 * -d * r.b, dPdr = 2 * d * r.b;
            
            var extrudef = function(padding)
            {
                if(padding == undefined) { padding = 0; }
                var tmeb = eb - padding;
                var fulh = ((2 * h) - padding);
                var pack = {};

                // available range
                pack.ar = 2 * w * (1 - (r.a * 2)) - (2 * padding);
                
                // movable range 
                pack.mr = pack.ar - (2 * tmeb); 

                // start base
                pack.sb = ((pack.ar * -1) / 2) + (ep * pack.mr);

                // indent lenght
                pack.il = tmeb * (1 - et);

                // height position
                //pack.hp = (2 * (h - (1.5 * t)) * eh) + (2 * t);
                
                pack.hp = ((fulh - (3 * t) + padding) * eh) + (2 * t) - padding;
                //pack.ihp = ((tmph - (3 * t)) * eh) + (2 * t); 

                // depth add length
                pack.dal = dPdr * (1 - (pack.hp / fulh));

                pack.teb = 2 * tmeb;
                pack.tebet = pack.teb * et;

                return pack;
            };

            op = extrudef();
            ip = extrudef(t);
			
			var extdbs = d - dPdr;
			var addl = el * 2;;
			if(addl < (dPdr + op.dal)) { addl = dPdr + op.dal; }

            var idpd = dPdr * (1 - (bgp / (hmt + h)));
            var odpd = dPdr * (1 - ((bgp + t) / (2 * h)));
            var wpd = dPwr * (1 - (bgp / (hmt + h)));
	
	        var pset = [];
                
                // outside 2 side
            var outside = 
            [
		        -w - dNwr, h, d - dPdr, -w - dNwr, h, -d - dNdr, -w, -h, -d, -w, -h, d, 
		        w - dPwr, h, d - dPdr, w, -h, d, w, -h, -d, w - dPwr, h, -d - dNdr,
			];
            pset = pset.concat(outside);
            property.shared.outside = outside;
				
                // inside 2 side
            var inside = 
            [
                -w - dNwr + t, hmt, d - dPdr - t, -w + t, -h, d - t, -w + t, -h, -d + t, -w - dNwr + t, hmt, -d - dNdr + t, 
		        w - dPwr - t, hmt, d - dPdr - t, w - dPwr - t, hmt, -d - dNdr + t, w - t, -h, -d + t,  w - t, -h, d - t, 
            ];
            pset = pset.concat(inside);
            property.shared.inside = inside;
                
                // outside top
            var topside = 
            [
                -w - dNwr, h, -d - dNdr, 
                -w - dNwr, h, d - dPdr, 
                w - dPwr, h, d - dPdr, 
                w - dPwr, h, -d - dNdr, 
		
                w - dPwr - t, hmt, d - dPdr - t, 
                -w - dNwr + t, hmt, d - dPdr - t,
                -w - dNwr + t, hmt, -d - dNdr + t, 
                w - dPwr - t, hmt, -d - dNdr + t,  
            ];
            pset = pset.concat(topside);
            property.shared.topside = topside;

                // back side necessary part
                
            var back_bottom =
            [
                w, -h, -d, w - t, -h, -d + t, w - t - bgp, -h, -d + t, w - t - bgp, -h, -d,
                -w + t, -h, -d + t, -w, -h, -d, -w + t + bgp, -h, -d, -w + t + bgp, -h, -d + t, 
            ];
            pset = pset.concat(back_bottom);
            property.shared.back_bottom = back_bottom;

                // side 
            var side =
            [
                // left side
                w - wpd - t - bgp, hmt - bgp, -d + t + idpd,
                w - wpd - t - bgp, hmt - bgp, -d + odpd,
                w - t - bgp, -h, -d,
                w - t - bgp, -h, -d + t,

                // right side
                -w + wpd + t + bgp, hmt - bgp, -d + odpd, 
                -w + wpd + t + bgp, hmt - bgp, -d + t + idpd,
                -w + t + bgp, -h, -d + t,
                -w + t + bgp, -h , -d,

                // center side
                -w + wpd + t + bgp, hmt - bgp, -d + t + idpd,
                -w + wpd + t + bgp, hmt - bgp, -d + odpd, 
                w - wpd - t - bgp, hmt - bgp, -d + odpd,
                w - wpd - t - bgp, hmt - bgp, -d + t + idpd, 
            ];
            pset = pset.concat(side);
            property.shared.side = side;

                // grasps
            var grasps = 
            [
                // left out grasp
                w - wpd - t - bgp, hmt - bgp, -d + odpd,
                w - dPwr, h, -d - dNdr,
                w, -h, -d,
                w - t - bgp, -h, -d,

                // right out grasp
                -w - dNwr, h, -d - dNdr,
                -w + wpd + t + bgp, hmt - bgp, -d + odpd,
                -w + t + bgp, -h, -d,
                -w, -h, -d,

                // center out grasp
                w - dPwr, h, -d - dNdr,
                w - wpd - t - bgp, hmt - bgp, -d + odpd,
                -w + wpd + t + bgp, hmt - bgp, -d + odpd,
                -w - dNwr, h, -d - dNdr,

                // left in grasp
                w - dPwr - t, hmt, -d - dNdr + t,
                w - wpd - t - bgp, hmt - bgp, -d + t + idpd,
                w - t - bgp, -h, -d + t,
                w - t, -h, -d + t,

                // right in grasp
                -w + wpd + t + bgp, hmt - bgp, -d + t + idpd,
                -w - dNwr + t, hmt, -d - dNdr + t,
                -w + t, -h, -d + t,
                -w + t + bgp, -h, -d + t,

                // center in grasp 
                -w - dNwr + t, hmt, -d - dNdr + t,
                -w + wpd + t + bgp, hmt - bgp, -d + t + idpd,
                w - wpd - t - bgp, hmt - bgp, -d + t + idpd,
                w - dPwr - t, hmt, -d - dNdr + t, 
            ];
            pset = pset.concat(grasps);
            property.shared.grasps = grasps; 
                
                // debug
                //w, -h, -d,
                //-w, -h, -d,
                //-w - dNwr, h, -d - dNdr,
                //w - dPwr, h, -d - dNdr,
                
                // extrude part 
            var front_extrude =
            [
                // debug [D, C, B, A]     
                //-w - dNwr, h, d - dPdr,
                //-w, -h, d,
                //w, -h, d,
                //w - dPwr, h, d - dPdr,

                // out [D', D, C, C']
                -w - dNwr, h, d - dPdr,
                -w, -h, d,
                op.sb, -h, d,
                op.sb + op.il, op.hp - h, d - dPdr + op.dal,

                // in [D', C', C, D]
                ip.sb + ip.il, ip.hp - h, d - dPdr - t + ip.dal,
                ip.sb, -h, d - t,
                -w + t, -h, d - t,
                -w - dNwr + t, hmt, d - dPdr -t,

                // out [A, D, D', A']
                w - dPwr, h, d - dPdr,
                -w - dNwr, h, d - dPdr,
                op.sb + op.il, op.hp - h, d - dPdr + op.dal,
                op.sb + op.il + op.tebet, op.hp - h, d - dPdr + op.dal, 
                
                // in [A, A', D', D]
                w - dPwr - t, hmt, d - dPdr - t,
                ip.sb + ip.il + ip.tebet, ip.hp - h, d - dPdr - t + ip.dal,
                ip.sb + ip.il, ip.hp - h, d - dPdr - t + ip.dal,
                -w - dNwr + t, hmt, d - dPdr - t,

                // out [A, A', B', B]
                w - dPwr, h, d - dPdr,
                op.sb + op.il + op.tebet, op.hp - h, d - dPdr + op.dal,
                op.sb + op.teb, -h, d,
                w, -h, d,
                
                // in [A, B, B', A']
                w - dPwr -t, hmt, d - dPdr - t,
                w - t, -h, d - t,
                ip.sb + ip.teb, -h, d - t,
                ip.sb + ip.il + ip.tebet, ip.hp - h, d - dPdr - t + ip.dal,
            ];
            pset = pset.concat(front_extrude);
            property.shared.front_extrude = front_extrude;

				// extrude length
		    var extrude_length = 
            [
				// out [D'', D', C', C'']
				op.sb + op.il, op.hp - h, extdbs + addl,
                op.sb + op.il, op.hp - h, d - dPdr + op.dal,
                op.sb, -h, d,
				op.sb, -h, extdbs + addl,
				
				// in [D'', C'', C', D']
                ip.sb + ip.il, ip.hp - h, extdbs + addl,
				ip.sb, -h, extdbs + addl,
                ip.sb, -h, d - t,
				ip.sb + ip.il, ip.hp - h, d - dPdr - t + ip.dal,

				// out [A', A'', B'', B']
				op.sb + op.il + op.tebet, op.hp - h, d - dPdr + op.dal,
				op.sb + op.il + op.tebet, op.hp - h, extdbs + addl,
				op.sb + op.teb, -h, extdbs + addl,
				op.sb + op.teb, -h, d,
				
				// in [A', B', B'', A'']
				ip.sb + ip.il + ip.tebet, ip.hp - h, d - dPdr - t + ip.dal,
                ip.sb + ip.teb, -h, d - t,
                ip.sb + ip.teb, -h, extdbs + addl,
				ip.sb + ip.il + ip.tebet, ip.hp - h, extdbs + addl,
            ];
            pset = pset.concat(extrude_length);
            property.shared.extrude_length = extrude_length;

                // extrude top
            var extrude_top = 
            [
                // out [A', D', D'', A'']
                op.sb + op.il + op.tebet, op.hp - h, d - dPdr + op.dal, 
				op.sb + op.il, op.hp - h, d - dPdr + op.dal,
				op.sb + op.il, op.hp - h, extdbs + addl,
				op.sb + op.il + op.tebet, op.hp - h, extdbs + addl, 
				
				// in [A', A'', D'', D']
                ip.sb + ip.il + ip.tebet, ip.hp - h, d - dPdr - t + ip.dal,
				ip.sb + ip.il + ip.tebet, ip.hp - h, extdbs + addl,
				ip.sb + ip.il, ip.hp - h, extdbs + addl,
                ip.sb + ip.il, ip.hp - h, d - dPdr - t + ip.dal,
            ];
            pset = pset.concat(extrude_top);
            property.shared.extrude_top = extrude_top;

                // 2 side bottom
            var side_bottom = 
            [
                -w + t, -h, d - t, -w, -h, d, -w, -h, -d, -w + t, -h, -d + t,
		        w - t, -h, d - t, w - t, -h, -d + t, w, -h, -d, w, -h, d,
            ];
            pset = pset.concat(side_bottom);
            property.shared.side_bottom = side_bottom;
				
				// extrude bottom
		    var extrude_bottom =
            [
                // [iC', oC', oC, iC]
				ip.sb, -h, d - t,
				op.sb, -h, d,
				-w, -h, d,
				-w + t, -h, d - t,
				
				// [iC', iC'', oC'', oC']
				ip.sb, -h, d - t,
				ip.sb, -h, extdbs + addl,
				op.sb, -h, extdbs + addl,
				op.sb, -h, d,
                
				// [oB', oB'', iB'', iB']
				op.sb + op.teb, -h, d,
				op.sb + op.teb, -h, extdbs + addl,
				ip.sb + ip.teb, -h, extdbs + addl,
				ip.sb + ip.teb, -h, d - t,
                
				// [iB, oB, oB', iB']
				w - t, -h, d - t,
				w, -h, d,
				op.sb + op.teb, -h, d,
				ip.sb + ip.teb, -h, d - t, 
		    ];
            pset = pset.concat(extrude_bottom);
            property.shared.extrude_bottom = extrude_bottom;

				// front cover
            var front_cover = 
            [
				// [iD'', oD'', oC'', iC'']
				ip.sb + ip.il, ip.hp - h, extdbs + addl,
				op.sb + op.il, op.hp - h, extdbs + addl,
				op.sb, -h, extdbs + addl,
				ip.sb, -h, extdbs + addl,
				
				// [oA'', oD'', iD'', iA'']
				op.sb + op.il + op.tebet, op.hp - h, extdbs + addl, 
				op.sb + op.il, op.hp - h, extdbs + addl,
				ip.sb + ip.il, ip.hp - h, extdbs + addl,
				ip.sb + ip.il + ip.tebet, ip.hp - h, extdbs + addl,
				
				// [oA'', iA'', iB'', oB'']
				op.sb + op.il + op.tebet, op.hp - h, extdbs + addl,
				ip.sb + ip.il + ip.tebet, ip.hp - h, extdbs + addl,
				ip.sb + ip.teb, -h, extdbs + addl,
				op.sb + op.teb, -h, extdbs + addl,
	        ];
            pset = pset.concat(front_cover);
            property.shared.front_cover = front_cover;
	        
	        return pset;
	    });

        this._paramana.addAttribute('extrude_pos', params.extrude_pos);
        this._paramana.addAttribute('extrude_hgt', params.extrude_hgt);
        this._paramana.addAttribute('extrude_len', params.extrude_len);
        this._paramana.addAttribute('extrude_bas', params.extrude_bas);
        this._paramana.addAttribute('extrude_tpl', params.extrude_tpl);
        this._paramana.addAttribute('back_side', params.back_side);
        this._paramana.addAttribute('back_grasp', params.back_grasp);

        this._paramana.addAttribute('shared', {});

        this._paramana.addFunction('texture', function(property)
        {
            var tmpUV = [[0, 0], [1, 0], [0, 1], [1, 1]];
            var uvs = [];

            var share = property.shared;

            var h = property.height, dh = 2 * h;
            var w = property.width, dw = 2 * w;
            var d = property.depth, dd = 2 * d;
    
            var sideTexture = function(points)
            {
                var tmpcat = [];
                for(var i = 0; i < points.length; i = i + 3) { tmpcat = tmpcat.concat(tmpUV[0]); }
                return tmpcat;
            };
        
            var randomTexture = function(points)
            {
                var tmpcat = [];
                for(var i = 0; i < points.length; i = i + 3) { tmpcat = tmpcat.concat(tmpUV[Math.floor(Math.random() * 3)]); }
                return tmpcat;
            };

            var depthHeightTexture = function(points)
            {
                var tmpcat = [];
                for(var i = 0; i < points.length; i = i + 3)
                {
                   tmpcat = tmpcat.concat([(points[i] - d) / dd, (points[i + 1] - h) / dh]); 
                }
                return tmpcat;
            };

            var widthHeightTexture = function(points)
            {
                var tmpcat = [];
                for(var i = 0; i < points.length; i = i + 3)
                {
                    tmpcat = tmpcat.concat([(points[i + 2] - w) / dw, (points[i + 1] - h) / dh]);
                }
                return tmpcat;
            };

            return uvs.concat(depthHeightTexture(share.outside))
                    .concat(depthHeightTexture(share.inside))
                    .concat(sideTexture(share.topside))
                    .concat(sideTexture(share.back_bottom))
                    .concat(depthHeightTexture(share.side))
                    .concat(widthHeightTexture(share.grasps))
                    .concat(widthHeightTexture(share.front_extrude))
                    .concat(depthHeightTexture(share.extrude_length))
                    .concat(sideTexture(share.extrude_top))
                    .concat(sideTexture(share.side_bottom))
                    .concat(sideTexture(share.extrude_bottom))
                    .concat(sideTexture(share.front_cover));
        });

        this.addNode(roof_cross_mansard_build.call(this, params)); 
    },
    
    getLayer: function() { return this._layer; },
    setLayer: function(l) { this._layer = l; },

    update: function() 
    {
        this._paramana.updateGeometryNode(this);;
        this._paramana.updateTextureCoord(this);
    },

    getWidth: function() { return this._paramana.get('width'); },
	setWidth: function(w) { this._paramana.set('width', w); this.update(); },
	
	getHeight: function() { return this._paramana.get('height'); },
	setHeight: function(h) { this._paramana.set('height', h); this.update(); },
	
	getDepth: function() { return this._paramana.get('depth'); },
	setDepth: function(d) { this._paramana.set('depth', d); this.update(); },

    getBackSide: function() { return this._paramana.get('back_side'); },
    setBackSide: function() { this._paramana.set('back_side', bs); this.update(); },

    getBackGrasp: function() { return this._paramana.get('back_grasp'); },
    setBackGrasp: function() { this._paramana.set('back_grasp', bg); this.update(); },

    getExtrudePos: function() { return this._paramana.get('extrude_pos'); },
    setExtrudePos: function(ep) { this._paramana.set('extrude_pos', ep); this.update(); },

    getExtrudeHgt: function() { return this._paramana.get('extrude_hgt'); },
    setExtrudeHgt: function(eh) { this._paramana.set('extrude_hgt', eh); this.update(); },

    getExtrudeLen: function() { return this._paramana.get('extrude_len'); },
    setExtrudeLen: function(el) { this._paramana.set('extrude_len', el); this.update(); },

    getExtrudeBas: function() { return this._paramana.get('extrude_bas'); },
    setExtrudeBas: function(eb) { this._paramana.set('extrude_bas', eb); this.update(); },

    getExtrudeTpl: function() { return this._paramana.get('extrude_tpl'); },
    setExtrudeTpl: function(et) { this._paramana.set('extrude_tpl', et); this.update(); },

	getRatio: function() { return this._paramana.get('ratio'); },
	setRatio: function(r) { return this._paramana.set('ratio', r); this.update(); },
	
	getThickness: function() { return this._paramana.get('thickness'); },
	setThickness: function(t) { this._paramana.set('thickness', t); this.update(); },

	getScale: function() { return this._paramana.get('scale'); },
	setScale: function(svec) { this._paramana.set('scale', svec); this._paramana.updateMatirxNode(this); },
	
	getRotate: function() { return this._paramana.get('rotate'); },
	setRotate: function(rvec) { this._paramana.set('rotate', rvec); this._paramana.updateMatirxNode(this); },
	
	getTranslate: function() { return this._paramana.get('translate'); },
	setTranslate: function(tvec) { this._paramana.set('translate', tvec); this._paramana.updateMatirxNode(this); },
	
	setTranslateX: function(x) { var t = this.getTranslate(); this.setTranslate([x, t[1], t[2]]); },
    setTranslateY: function(y) { var t = this.getTranslate(); this.setTranslate([t[0], y, t[2]]); },
    setTranslateZ: function(z) { var t = this.getTranslate(); this.setTranslate([t[0], t[1], z]); },
    
    callBaseCalibration: function()
	{

    	var backWall=-1, rightWall=-1, leftWall=-1,frontWall=-1, roof=-1, base=-1;
        var nodes=scene.findNodes();
        
        //                                 material     name   matrix  texture  element
        var mnmte = function(n) { return n.nodes[0].nodes[0].nodes[0].nodes[0].nodes[0].nodes[0].nodes[0]; }
        
        for(var i = 0; i < nodes.length; i++)
        {
            var n = nodes[i];
            if(n.getType() == "name")
            {
                if(n.getName() == "backWall") { backWall = mnmte(n); }
                else if(n.getName() == "frontWall") { frontWall = mnmte(n); }
                else if(n.getName() == "leftWall") { leftWall = mnmte(n); }
                else if(n.getName() == "rightWall") { rightWall = mnmte(n); }
                else if(n.getName() == "roof") { roof = mnmte(n); }
                else if(n.getName() == "base" && mnmte(n).getLayer && mnmte(n).getLayer() == this.getLayer() - 1) { base = mnmte(n); }
            }
        }
        if(base == -1){ console.log("ERROR"); return; }
        if(roof.getID() == this.getID())
        {
        	if(base.setRealWidth)base.setRealWidth(this.getDepth());
            if(base.setRealHeight)base.setRealHeight(this.getWidth());
        	base.callBaseCalibration();
        }
    }
});

function roof_cross_mansard_build(params) 
{
    var positionSet = this._paramana.createPositions();
    var indiceSet = utility.makeIndices(0, (positionSet.length / 3) - 1);
	var uvSet = this._paramana.createTextures();
    
    var geometry = 
	{
        type: "geometry",
        primitive: "triangles",
        positions: positionSet,
		uv: uvSet,
		normals: "auto",
        indices: indiceSet
    };
	
	return geometry;
}
