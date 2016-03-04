SceneJS.Types.addType("wall/door_entry",
{
    construct: function(params)
    {
        this._layer,
        this.direction,
        this._paramana = new ParameterManager(params, function(property)
        {
            var attachToLast = function(p, v) 
            {
                var r = []; r[0] = p[0]; r[1] = p[1]; r[2] = v;
                return r;
            }

            var w = property.width, h = property.height, t = property.thickness, pr = property.posratio;
            var dw = property.doorW, dh = property.doorH;
           
            var init = [];
            init.push(((w - dw) * 2 * pr) - w); init.push(-h);

            var inter = [];
            inter.push(init);
            inter.push([init[0], init[1] + (2 * dh)]);
            inter.push([init[0] + (2 * dw), init[1] + (2 * dh)]);
            inter.push([init[0] + (2 * dw), init[1]]);

            var exter = [];
            exter.push([-w, -h]); exter.push([-w, h]); exter.push([w, h]); exter.push([w, -h]);
            
            var pset = [];

            for(var idxr = 0; idxr < 3; idxr++)
            {
                var tmprb = (idxr + 1) % 4, tmpra = idxr;
                
                pset = pset.concat(attachToLast(exter[tmpra], t)).concat(attachToLast(inter[tmpra], t))
                    .concat(attachToLast(inter[tmprb], t)).concat(attachToLast(exter[tmprb], t));

                pset = pset.concat(attachToLast(inter[tmpra], -t)).concat(attachToLast(exter[tmpra], -t))
                    .concat(attachToLast(exter[tmprb], -t)).concat(attachToLast(inter[tmprb], -t));

                pset = pset.concat(attachToLast(exter[tmpra], -t)).concat(attachToLast(exter[tmpra], t))
                    .concat(attachToLast(exter[tmprb], t)).concat(attachToLast(exter[tmprb], -t));

                pset = pset.concat(attachToLast(inter[tmprb], -t)).concat(attachToLast(inter[tmprb], t))
                    .concat(attachToLast(inter[tmpra], t)).concat(attachToLast(inter[tmpra], -t));
            }

            for(var y = 0; y <= 3; y = y + 3)
            {
                pset = pset.concat(attachToLast(inter[0], -t)).concat(attachToLast(inter[0], t))
                    .concat(attachToLast(exter[0], t)).concat(attachToLast(exter[0], -t));
            }

            return pset;
        });
        
        this._paramana.addAttribute('posratio', params.posratio);
        this._paramana.addAttribute('doorW', params.doorW);
        this._paramana.addAttribute('doorH', params.doorH);

        this.addNode(build.call(this, params));
        this.direction = params.direction;
        this._layer = params.layer;
     },

    updateNode: function()
    {
        this._paramana.updateGeometryNode(this);
    },

    getLayer: function(){ return this._layer; },
	setLayer: function(l){ this._layer = l; },

    getWidth: function() { return this._paramana.get('width'); },
	setWidth: function(w) { this._paramana.set('width', w); this.updateNode(); },
	
	getHeight: function() { return this._paramana.get('height'); },
    setHeight: function(h) { this._paramana.set('height', h); this.updateNode(); },
	
    getThickness: function() { return this._paramana.get('thickness'); },
	setThickness: function(t) { this._paramana.set('thickness', t); this.updateNode(); },

    getPosratio: function() { return this._paramana.get('posratio'); },
    setPosratio: function(r) { this._paramana.set('posratio', r); this.updateNode(); },

    getDoorSize: function() { return { w: this._paramana.get('doorW'), h: this._paramana.get('doorH') };  },
    setDoorW: function(dw) { this._paramana.set('doorW', ww); this.updateNode(); },
    setDoorH: function(dh) { this._paramana.set('doorH', wh); this.updateNode(); },

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
	//var uvSet = this._paramana.createTextures();
	
    var geometry = 
	{
		type: "geometry",
		primitive: "triangles",
		positions: positionSet,
		normals: "auto",
        //uv: uvSet,
		indices: indiceSet
	};
	
	return geometry;
}
