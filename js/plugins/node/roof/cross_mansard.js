
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
            var hmtt = hmt - t;

            var rg = 2 * w * (1 - (r.a + r.a));
            var rsp = rg - ((eb + t) * 2);
            var rct = (rsp * ep) - (rsp * 0.5);

            var rsq = rg - (eb * 2);
            var rot = (rsq * ep) - (rsq * 0.5);

            var trl = eb * et;

            var thl = hmtt * (1 - eh);
            var ohl = hmt * (1 - eh);
	
	        var dNwr = 2 * -w * r.a, dPwr = 2 * w * r.a; 
	        var dNdr = 2 * -d * r.b, dPdr = 2 * d * r.b;

            var dFdr = dPdr * (1 - ((thl + t) * 0.5 / h));
            var dIdr = dPdr * (1 - ((ohl + t) * 0.5 / h));
	
	        var pset = 
            [
                // outside 4 side
		        -w - dNwr, h, d - dPdr, -w - dNwr, h, -d - dNdr, -w, -h, -d, -w, -h, d, 
		        //w - dPwr, h, -d - dNdr, -w - dNwr, h, -d - dNdr, -w, -h, -d, w, -h, -d,
		        w - dPwr, h, d - dPdr, w, -h, d, w, -h, -d, w - dPwr, h, -d - dNdr,
		        //w - dPwr, h, d - dPdr, w, -h, d, -w, -h, d, -w - dNwr, h, d - dPdr, 
               
                // outside top
                //-w - dNwr, h, -d - dNdr, 
                //-w - dNwr, h, d - dPdr, 
                //w - dPwr, h, d - dPdr, 
                //w - dPwr, h, -d - dNdr, 
               
                // inside 4 side
                -w - dNwr + t, hmt, d - dPdr - t, -w + t, -h, d - t, -w + t, -h, -d + t, -w - dNwr + t, hmt, -d - dNdr + t, 
		        //w - dPwr - t, hmt, -d - dNdr + t, w - t, -h, -d + t, -w + t, -h, -d + t, -w - dNwr + t, hmt, -d - dNdr + t, 
		        w - dPwr - t, hmt, d - dPdr - t, w - dPwr - t, hmt, -d - dNdr + t, w - t, -h, -d + t,  w - t, -h, d - t, 
               
                // extrude part
                w - dPwr - t, hmt, d - dPdr - t, 
                w - t, -h, d - t, 
                rct + eb, -h, d - t,
                rct + trl, hmtt - thl, d - dFdr - t,

                w - dPwr - t, hmt, d - dPdr - t,
                rct + trl, hmtt - thl, d - dFdr - t,
                rct - trl, hmtt - thl, d - dFdr - t,
                -w - dNwr + t, hmt, d - dPdr - t,

                rct - trl, hmtt - thl, d - dFdr - t,
                rct - eb, -h, d - t,
                -w + t, -h, d - t,
                -w - dNwr + t, hmt, d - dPdr - t,

                w - dPwr, h, d - dPdr,
                w, -h, d,
                rot + eb, -h, d,
                rot + trl, hmt - ohl, d - dIdr,

                w - dPwr, h, d - dPdr,
                rot + trl, hmt - ohl, d - dIdr,
                rot - trl, hmt - ohl, d - dIdr,
                -w - dNwr, h, d - dPdr,

                rot - trl, hmt - ohl, d - dIdr,
                rot - eb, -h, d,
                -w, -h, d,
                -w - dNwr, h, d - dPdr,

                //w - dPwr - t, hmt, d - dPdr - t,
                //w - t, -h, d - t,
                //-w + t, -h, d - t, 
                //-w - dNwr + t, hmt, d - dPdr - t, 
		        
                // inside top 
                //w - dPwr - t, hmt, d - dPdr - t, 
                //-w - dNwr + t, hmt, d - dPdr - t,
                //-w - dNwr + t, hmt, -d - dNdr + t, 
                //w - dPwr - t, hmt, -d - dNdr + t, 
		       
                // 4 side bottom
                -w + t, -h, d - t, -w, -h, d, -w, -h, -d, -w + t, -h, -d + t,
		        //w - t, -h, -d + t, w, -h, -d, -w, -h, -d, -w + t, -h, -d + t,
		        w - t, -h, d - t, w - t, -h, -d + t, w, -h, -d, w, -h, d,	
		        //w - t, -h, d - t, -w + t, -h, d - t, -w, -h, d, w, -h, d, 
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

    // Warning: limitation is 0.5
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
		0, 1, 0, 0, 1, 0, 1, 1,			// Front West
		1, 1, 1, 0, 0, 0, 0, 1,			// Front Sourth
		0, 1, 1, 1, 1, 0, 0, 0,			// Front East
		0, 1, 0, 0, 1, 0, 1, 1,			// Front North
		1, 1, 1, 0, 0, 0, 0, 1,			// Front Center
		
		0, 1, 0, 0, 1, 0, 1, 1,			// Back West
		1, 1, 0, 1, 0, 0, 1, 1,			// Back Sourth
		1, 0, 0, 0, 0, 1, 1, 1,			// Back East
		1, 1, 0, 1, 0, 0, 1, 0,			// Back North
		0, 1, 1, 1, 1, 0, 0, 0,			// Back Center
		
		0, 1, 0, 0, 1, 0, 1, 1,			// Side West
		1, 1, 0, 1, 0, 0, 1, 1,			// Side Sourth
		1, 0, 0, 0, 0, 1, 1, 1,			// Side East
		1, 1, 0, 1, 0, 0, 1, 0,			// Side North
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
