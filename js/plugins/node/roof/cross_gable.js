
SceneJS.Types.addType("roof/cross_gable", 
{ 
    construct:function (params) 
    {
        this._layer;
        this._paramana = new ParameterManager(params, function(property)
	    {
            var ratio_boundary = function(val)
            {
                var reval = val;
                switch(reval)
                {
                    case (reval < 0):
                        reval = 0; break;
                    case (reval > 1):
                        reval = 1; break;
                }
                return reval;
            };

            var bs = property.back_side == 'on' ? true: false;

            var w = property.width;
            var d = property.depth;
            var h = property.height;
            var t = property.thickness;

	        var r = property.ratio;
            r.a = ratio_boundary(r.a);
            r.b = ratio_boundary(r.b);

            var el = property.extrude_len * 2;
            var eb = property.extrude_bas * 2;

            var eh = property.extrude_hgt;
            eh = ratio_boundary(eh);

            var ep = property.extrude_pos;
            ep = ratio_boundary(ep);

            var td = d - (3 * t);
            if(eb > (2 * td)) { eb = 2 * td; }

	        var wr = (w * r.a + -w * r.b) / 2;
            var db = (d - (eb * 0.5)) - (3 * t);
            var dr = (2 * db) * (1 - ep), dl = (2 * db) * ep;
            var ldb = db * 2 * ep, rdb = db * 2 * (1 - ep);

            var base_len = w;
            if(base_len < (wr + el)) { base_len = wr + el; }

            var dt = t;
            var st = (2 * h / ( w * r.a + w * r.b)) * dt, sh = h * eh;
            var whr = (w / 2) * (1 - eh);

            var gs = property.back_grasp * 0.7;
            var gsr = property.back_grasp / Math.sqrt((Math.pow((2 * h),2) + Math.pow((2 * w), 2)));
            var mh = (gsr * h * 2), mw = (gsr * w);
	
	        var pset = 
            [
                //front bottom
                -td + ldb - dt, -h, w + dt, -d, -h, w + dt, -d, -h, w, -td + ldb, -h, w,
                d, -h, w + dt, td - rdb + dt, -h, w + dt, td - rdb, -h, w, d, -h, w,

                // backside: nesseary part, L M R
                -d, h, wr, -d, -h, -w, -d + gs, -h, -w, -d + gs, h - mh, wr - mw,
                -d, h, wr, -d + gs, h - mh, wr - mw, d - gs, h - mh, wr - mw, d, h, wr,
                d - gs, h - mh, wr - mw, d - gs, -h, -w, d, -h, -w, d, h, wr,

                -d, h + st, wr, -d + gs, h - mh + st, wr - mw, -d + gs, -h, -w - dt, -d, -h, -w - dt,
                -d, h + st, wr, d, h + st, wr, d - gs, h - mh + st, wr - mw, -d + gs, h - mh + st, wr - mw,
                d - gs, h - mh + st, wr - mw, d, h + st, wr, d, -h, -w - dt, d - gs, -h, -w - dt,

                // extrude
                -db + dl, sh, wr + el, -td + ldb, -h, base_len, -td + ldb, -h, w, -db + dl, sh, wr + whr,
                -db + dl, sh + st, wr + el, -db + dl, sh + st, wr + whr, -td + ldb - dt, -h, w + dt, -td + ldb - dt, -h, base_len,

                -db + dl, sh, wr + whr, td - rdb, -h, w, td - rdb, -h, base_len, -db + dl, sh, wr + el,
                -db + dl, sh + st, wr + whr, -db + dl, sh + st, wr + el, td - rdb + dt, -h, base_len, td - rdb + dt, -h, w + dt,

                // extrude bottom 
                -td + ldb, -h, base_len, -td + ldb - dt, -h, base_len, -td + ldb - dt, -h, w + dt, -td + ldb, -h, w, 
                td - rdb, -h, w, td - rdb + dt, -h, w + dt, td - rdb + dt, -h, base_len, td - rdb, -h, base_len,

                // extrude side
                -db + dl, sh, wr + el, -db + dl, sh + st, wr + el, -td + ldb - dt, -h, base_len, -td + ldb, -h, base_len, 
                -db + dl, sh + st, wr + el, -db + dl, sh, wr + el, td - rdb, -h, base_len, td - rdb + dt, -h, base_len, 
                
                // backside bottom 
                d - gs, -h, -w - dt, d, -h, -w - dt, d, -h, -w, d - gs, -h, -w,
                -d, -h, -w - dt, -d + gs, -h, -w - dt, -d + gs, -h, -w, -d, -h, -w,

                // side 
                -d, h, wr, -d, h + st, wr, -d, -h, -w - dt, -d, -h, -w,
                -d, h + st, wr, -d, h, wr, -d, -h, w, -d, -h, w + dt, 
                d, h, wr, d, h + st, wr, d, -h, w + dt, d, -h, w,
                d, h + st, wr, d, h, wr, d, -h, -w, d, -h, -w - dt
	        ]; 

            if(!bs)
            {
                var bspset = 
                [
                    -d + gs, h - mh + st, wr - mw, d - gs, h - mh + st, wr - mw, 
                    d - gs, h - mh, wr - mw, -d + gs, h - mh, wr - mw, 

                    -d + gs, h - mh + st, wr - mw, -d + gs, h - mh, wr - mw,
                    -d + gs, -h, -w, -d + gs, -h, -w - dt,

                    d - gs, h - mh, wr - mw, d - gs, h - mh + st, wr - mw,
                    d - gs, -h, -w - dt, d - gs, -h, -w,

                ];
                pset = pset.concat(bspset);
            }
            else
            {
                var bspset = 
                [
                    // full backside
                    -d + gs, h - mh, wr - mw, -d + gs, -h, -w, d - gs, -h, -w, d - gs, h - mh, wr - mw,
                    -d + gs, h - mh + st, wr - mw, d - gs, h - mh + st, wr - mw, d - gs, -h, -w - dt, -d + gs, -h, -w - dt,

                    // bottom
                    -d + gs, -h, -w - dt, d - gs, -h, -w - dt, d - gs, -h, -w, -d + gs, -h, -w
                ];
                pset = pset.concat(bspset);
            }
	        
            // if seperate below two part, the normals will not consistence
            pset = pset.concat(
            [
                // frontside
                -db + dl, sh, wr + whr, -td + ldb, -h, w, -d, -h, w, -d, h, wr, 
                -db + dl, sh + st, wr + whr, -d, h + st, wr, -d, -h, w + dt, -td + ldb - dt, -h, w + dt,

                d, h, wr, d, -h, w, td - rdb, -h, w, db - dr, sh, wr + whr,
                d, h + st, wr, db - dr, sh + st, wr + whr, td - rdb + dt, -h, w + dt, d, -h, w + dt,
            ]);

            if(1 != eh)
            {
                var appendpet = 
                [
                    -d, h, wr, -d, h, wr, d, h, wr, -db + dl, sh, wr + whr,
                    -d, h + st, wr, -db + dl, sh + st, wr + whr, d, h + st, wr, -d, h + st, wr
                ];
                pset = pset.concat(appendpet);
            }
            else
            {
                var appendpet = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                                 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
                pset = pset.concat(appendpet);
            }

	        return pset;
	    });

        this._paramana.addAttribute('extrude_pos', params.extrude_pos);
        this._paramana.addAttribute('extrude_hgt', params.extrude_hgt);
        this._paramana.addAttribute('extrude_len', params.extrude_len);
        this._paramana.addAttribute('extrude_bas', params.extrude_bas);
        this._paramana.addAttribute('back_side', params.back_side);
        this._paramana.addAttribute('back_grasp', params.back_grasp);

        // for texture
        this._paramana.addAttribute('shared', {});

        this._paramana.addFunction('texture', function(property)
        {
        });

        this.addNode(roof_cross_gable_build.call(this, params)); 
    },
    
    getLayer:function(){ return this._layer; },
    setLayer:function(l){ this._layer = l; },

    getWidth: function() { return this._paramana.get('width'); },
	setWidth: function(w) { this._paramana.set('width', w); this._paramana.updateGeometryNode(this); },
	
	getHeight: function() { return this._paramana.get('height'); },
	setHeight: function(h) { this._paramana.set('height', h); this._paramana.updateGeometryNode(this); },
	
	getDepth: function() { return this._paramana.get('depth'); },
	setDepth: function(d) { this._paramana.set('depth', d); this._paramana.updateGeometryNode(this); },
	
	getRatio: function() { return this._paramana.get('ratio'); },
	setRatio: function(r) { return this._paramana.set('ratio', r); this._paramana.updateGeometryNode(this); },
	
	getThickness: function() { return this._paramana.get('thickness'); },
	setThickness: function(t) { this._paramana.set('thickness', t); this._paramana.updateGeometryNode(this); },

    getExtrudePos: function() { return this._paramana.get('extrude_pos'); },
    setExtrudePos: function(ep) { this._paramana.set('extrude_pos', ep); this._paramana.updateGeometryNode(this); },

    getExtrudeHgt: function() { return this._paramana.get('extrude_hgt'); },
    setExtrudeHgt: function(eh) { this._paramana.set('extrude_hgt', eh); this._paramana.updateGeometryNode(this); },

    getExtrudeLen: function() { return this._paramana.get('extrude_len'); },
    setExtrudeLen: function(el) { this._paramana.set('extrude_len', el); this._paramana.updateGeometryNode(this); },

    getExtrudeBas: function() { return this._paramana.get('extrude_bas'); },
    setExtrudeBas: function(eb) { this._paramana.set('extrude_bas', eb); this._paramana.updateGeometryNode(this); },

    getBackGrasp: function() { return this._paramana.get('back_grasp'); },
    setBackGrasp: function(bg) { this._paramana.set('back_grasp', bg); this.ParameterManager.updateGeometryNode(this); },

    getBackSide: function() { return this._paramana.get('back_side'); },
    setBackSide: function(bs) { this._paramana.set('back_side', bs); this._paramana.updateGeometryNode(this); },

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
        var mnmte = function(n) { return n.nodes[0].nodes[0].nodes[0].nodes[0].nodes[0]; }
        
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
        	base.setWidth(this.getDepth());
        	base.setHeight(this.getWidth());
        	base.callBaseCalibration();
        }
    },
    
    adjustChildren: function()
    {
    	var baseCenter = this.getTranslate();
        var baseCenterX = baseCenter[0];
        var baseCenterY = baseCenter[1];
        var baseCenterZ = baseCenter[2];

    	var leftTriangle = -1, rightTriangle = -1, roof = -1, base = -1;
        var nodes = scene.findNodes();
        
        //                                 material     name   matrix  texture  element
        var mnmte = function(n) { return n.nodes[0].nodes[0].nodes[0].nodes[0].nodes[0]; }
        
        for(var i = 0; i < nodes.length; i++)
        {
            var n = nodes[i];
            if(n.getType() == "name")
            {
                if(n.getName() =="roof") { roof = mnmte(n); }
                else if(n.getName() == "leftTriangle") { leftTriangle = mnmte(n); }
                else if(n.getName() == "rightTriangle") { rightTriangle = mnmte(n); }
                else if(n.getName() == "base") { base = mnmte(n); }
            }
        }
        
        if(roof == -1) { console.log("ERROR"); return; }
        if(leftTriangle != -1)
        {
        	leftTriangle.setHeight(this.getHeight());
        	leftTriangle.setWidth(this.getWidth());
            
            var translateV = [];
        	translateV.push(baseCenterX - this.getDepth() + leftTriangle.getThickness());
        	translateV.push(baseCenterY);
        	translateV.push(baseCenterZ);
        	
        	leftTriangle.setTranslate(translateV);

            leftTriangle.setLayer(this.getLayer());
        }
        if(rightTriangle != -1)
        {
        	rightTriangle.setHeight(this.getHeight());
        	rightTriangle.setWidth(this.getWidth());
            
            var translateV = [];
        	translateV.push(baseCenterX + this.getDepth() - rightTriangle.getThickness());
        	translateV.push(baseCenterY);
        	translateV.push(baseCenterZ);
        	
        	rightTriangle.setTranslate(translateV);

            rightTriangle.setLayer(this.getLayer());
        }
    },
    KillChildren: function(){


        var baseCenter = this.getTranslate();
        var baseCenterX = baseCenter[0];
        var baseCenterY = baseCenter[1];
        var baseCenterZ = baseCenter[2];

        var leftTriangle = -1, rightTriangle = -1, roof = -1, base = -1;
        var nodes = scene.findNodes();
        
        //                                 material     name   matrix  texture  element
        var mnmte = function(n) { return n.nodes[0].nodes[0].nodes[0].nodes[0].nodes[0]; }
        
        for(var i = 0; i < nodes.length; i++)
        {
            var n = nodes[i];
            if(n.getType() == "name")
            {
                if(n.getName() =="roof") { roof = mnmte(n); }
                else if(n.getName() == "leftTriangle") { leftTriangle = mnmte(n); }
                else if(n.getName() == "rightTriangle") { rightTriangle = mnmte(n); }
                else if(n.getName() == "base") { base = mnmte(n); }
            }
        }
        
        if(roof == -1) { console.log("ERROR"); return; }
        if(leftTriangle != -1)
        {
            leftTriangle.getParent().getParent().getParent().getParent().getParent().getParent().destroy();
        }
        if(rightTriangle != -1)
        {
            rightTriangle.getParent().getParent().getParent().getParent().getParent().getParent().destroy();
        }
    }
 });

function roof_cross_gable_build(params) 
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
        1, 1, 1, 0, 0, 0, 0, 1,	
        0, 1, 1, 1, 1, 0, 0, 0,	
        0, 1, 0, 0, 1, 0, 1, 1,	
        1, 1, 1, 0, 0, 0, 0, 1,	
        0, 1, 0, 0, 1, 0, 1, 1,	
        1, 1, 0, 1, 0, 0, 1, 1,	
        1, 0, 0, 0, 0, 1, 1, 1,	
        1, 1, 1, 0, 0, 0, 0, 1,	
        0, 1, 0, 0, 1, 0, 1, 1,	
        1, 1, 0, 1, 0, 0, 1, 1,	
        1, 0, 0, 0, 0, 1, 1, 1,	
        1, 1, 1, 0, 0, 0, 0, 1,	
        0, 1, 0, 0, 1, 0, 1, 1,	
        1, 1, 0, 1, 0, 0, 1, 1,	
        1, 0, 0, 0, 0, 1, 1, 1,	
        1, 1, 1, 0, 0, 0, 0, 1,	
        0, 1, 0, 0, 1, 0, 1, 1,	
        1, 1, 0, 1, 0, 0, 1, 1,	
        1, 0, 0, 0, 0, 1, 1, 1,	
        1, 1, 0, 1, 0, 0, 1, 0,	
        0, 1, 1, 1, 1, 0, 0, 0,
        1, 0, 0, 0, 0, 1, 1, 1,	
        1, 1, 1, 0, 0, 0, 0, 1,	
        0, 1, 0, 0, 1, 0, 1, 1,	
        1, 1, 0, 1, 0, 0, 1, 1,	
        1, 0, 0, 0, 0, 1, 1, 1,	
        1, 1, 0, 1, 0, 0, 1, 0,	
        0, 1, 1, 1, 1, 0, 0, 0	

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
