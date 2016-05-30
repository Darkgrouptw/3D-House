
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
			
	        var hmt = h - t; 
            
            var dNwr = 2 * -w * r.a, dPwr = 2 * w * r.a; 
	        var dNdr = 2 * -d * r.b, dPdr = 2 * d * r.b;
            
            var extrudef = function(padding)
            {
                if(padding == undefined) { padding = 0; }
                var tmeb = eb - padding;
                var tmph = ((2 * h) - t);
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
                pack.dal = dPdr * (1 - (pack.hp / tmph));

                pack.teb = 2 * tmeb;
                pack.tebet = pack.teb * et;

                return pack;
            };

            op = extrudef();
            ip = extrudef(t);
			
			var extdbs = d - dPdr;
			var addl = el * 2;;
			if(addl < (dPdr + op.dal)) { addl = dPdr + op.dal; }
	
	        var pset = 
            [
                // outside 2 side
		        -w - dNwr, h, d - dPdr, -w - dNwr, h, -d - dNdr, -w, -h, -d, -w, -h, d, 
		        w - dPwr, h, d - dPdr, w, -h, d, w, -h, -d, w - dPwr, h, -d - dNdr,
				
				// inside 2 side
                -w - dNwr + t, hmt, d - dPdr - t, -w + t, -h, d - t, -w + t, -h, -d + t, -w - dNwr + t, hmt, -d - dNdr + t, 
		        w - dPwr - t, hmt, d - dPdr - t, w - dPwr - t, hmt, -d - dNdr + t, w - t, -h, -d + t,  w - t, -h, d - t, 
               
                // outside top
                //-w - dNwr, h, -d - dNdr, 
                //-w - dNwr, h, d - dPdr, 
                //w - dPwr, h, d - dPdr, 
                //w - dPwr, h, -d - dNdr, 
				
				// inside top 
                //w - dPwr - t, hmt, d - dPdr - t, 
                //-w - dNwr + t, hmt, d - dPdr - t,
                //-w - dNwr + t, hmt, -d - dNdr + t, 
                //w - dPwr - t, hmt, -d - dNdr + t, 

                // back side necessary part

                // extrude part 
                
                // out [D', D, C, C']
                op.sb + op.il, op.hp - h, d - dPdr + op.dal,
                -w - dNwr, h, d - dPdr,
                -w, -h, d,
                op.sb, -h, d,
               
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
                
				// extrude length
				
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

                // 2 side bottom
                -w + t, -h, d - t, -w, -h, d, -w, -h, -d, -w + t, -h, -d + t,
		        w - t, -h, d - t, w - t, -h, -d + t, w, -h, -d, w, -h, d,	
				
				// extrude bottom
				
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
				
				// front cover
				
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
	        
	        return pset;
	    });

        this._paramana.addAttribute('extrude_pos', params.extrude_pos);
        this._paramana.addAttribute('extrude_hgt', params.extrude_hgt);
        this._paramana.addAttribute('extrude_len', params.extrude_len);
        this._paramana.addAttribute('extrude_bas', params.extrude_bas);
        this._paramana.addAttribute('extrude_tpl', params.extrude_tpl);
        this._paramana.addAttribute('back_side', params.back_side);
        this._paramana.addAttribute('back_grasp', params.back_grasp);

        this.addNode(roof_cross_mansard_build.call(this, params)); 
    },
    
    getLayer: function(){ return this._layer; },
    setLayer: function(l){ this._layer = l; },

    getWidth: function() { return this._paramana.get('width'); },
	setWidth: function(w) { this._paramana.set('width', w); this._paramana.updateGeometryNode(this); },
	
	getHeight: function() { return this._paramana.get('height'); },
	setHeight: function(h) { this._paramana.set('height', h); this._paramana.updateGeometryNode(this); },
	
	getDepth: function() { return this._paramana.get('depth'); },
	setDepth: function(d) { this._paramana.set('depth', d); this._paramana.updateGeometryNode(this); },

    getBackSide: function() { return this._paramana.get('back_side'); },
    setBackSide: function() { this._paramana.set('back_side', bs); this._paramana.updateGeometryNode(this); },

    getBackGrasp: function() { return this._paramana.get('back_grasp'); },
    setBackGrasp: function() { this._paramana.set('back_grasp', bg); this._paramana.updateGeometryNode(this); },

    getExtrudePos: function() { return this._paramana.get('extrude_pos'); },
    setExtrudePos: function(ep) { this._paramana.set('extrude_pos', ep); this._paramana.updateGeometryNode(this); },

    getExtrudeHgt: function() { return this._paramana.get('extrude_hgt'); },
    setExtrudeHgt: function(eh) { this._paramana.set('extrude_hgt', eh); this._paramana.updateGeometryNode(this); },

    getExtrudeLen: function() { return this._paramana.get('extrude_len'); },
    setExtrudeLen: function(el) { this._paramana.set('extrude_len', el); this._paramana.updateGeometryNode(this); },

    getExtrudeBas: function() { return this._paramana.get('extrude_bas'); },
    setExtrudeBas: function(eb) { this._paramana.set('extrude_bas', eb); this._paramana.updateGeometryNode(this); },

    getExtrudeTpl: function() { return this._paramana.get('extrude_tpl'); },
    setExtrudeTpl: function(et) { this._paramana.set('extrude_tpl', et); this._paramana.updateGeometryNode(this); },

	getRatio: function() { return this._paramana.get('ratio'); },
	setRatio: function(r) { return this._paramana.set('ratio', r); this._paramana.updateGeometryNode(this); },
	
	getThickness: function() { return this._paramana.get('thickness'); },
	setThickness: function(t) { this._paramana.set('thickness', t); this._paramana.updateGeometryNode(this); },

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
	var uvSet = 
    [
		0, 1, 0, 0, 1, 0, 1, 1,
		1, 1, 1, 0, 0, 0, 0, 1,
		0, 1, 1, 1, 1, 0, 0, 0,
		0, 1, 0, 0, 1, 0, 1, 1,
		1, 1, 1, 0, 0, 0, 0, 1,	
		
		0, 1, 0, 0, 1, 0, 1, 1,
		1, 1, 0, 1, 0, 0, 1, 1,
		1, 0, 0, 0, 0, 1, 1, 1,
		1, 1, 0, 1, 0, 0, 1, 0,
		0, 1, 1, 1, 1, 0, 0, 0,	
		
		0, 1, 0, 0, 1, 0, 1, 1,
		1, 1, 0, 1, 0, 0, 1, 1,
		1, 0, 0, 0, 0, 1, 1, 1,
		1, 1, 0, 1, 0, 0, 1, 0,
		
		0, 1, 0, 0, 1, 0, 1, 1,
		1, 1, 0, 1, 0, 0, 1, 1,
		1, 0, 0, 0, 0, 1, 1, 1,
		1, 1, 0, 1, 0, 0, 1, 0,
		0, 1, 1, 1, 1, 0, 0, 0,	
		
		0, 1, 0, 0, 1, 0, 1, 1,
		1, 1, 0, 1, 0, 0, 1, 1,
		1, 0, 0, 0, 0, 1, 1, 1,
		1, 1, 0, 1, 0, 0, 1, 0,
		
		0, 1, 0, 0, 1, 0, 1, 1,
		1, 1, 0, 1, 0, 0, 1, 1,
		1, 0, 0, 0, 0, 1, 1, 1,
		1, 1, 0, 1, 0, 0, 1, 0,
		
		0, 1, 0, 0, 1, 0, 1, 1,
		1, 1, 0, 1, 0, 0, 1, 1,
		1, 0, 0, 0, 0, 1, 1, 1,
		1, 1, 0, 1, 0, 0, 1, 0,
		0, 1, 1, 1, 1, 0, 0, 0,	
		
		0, 1, 0, 0, 1, 0, 1, 1,
		1, 1, 0, 1, 0, 0, 1, 1,
		1, 0, 0, 0, 0, 1, 1, 1,
		1, 1, 0, 1, 0, 0, 1, 0,
	];

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
