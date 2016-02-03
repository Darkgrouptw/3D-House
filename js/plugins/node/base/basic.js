
SceneJS.Types.addType("base/basic", 
{ 
    construct: function(params) 
	{ 
		this.paramana = new ParameterManager(params, function(property)
		{
			var w = property.width / 2, h = property.height / 2, t = property.thickness / 2; 
			var pset = new Float32Array(
			[
				w, t, h, -w, t, h, -w, -t, h, w, -t, h,
			    w, t, h, w, -t, h, w, -t, -h, w, t, -h,
			    w, t, h, w, t, -h, -w, t, -h, -w, t, h,
			    -w, t, h, -w, t, -h, -w, -t, -h, -w, -t, h,
			    -w, -t, -h, w, -t, -h, w, -t, h, -w, -t, h, 
			    w, -t, -h, -w, -t, -h, -w, t, -h, w, t, -h
			]);
			return pset;
		});
		this.addNode(build.call(this, params)); 
	},
	
	getWidth: function() { return this.paramana.get('width'); },
	setWidth: function(w) { this.paramana.set('width', w); this.paramana.updateGeometryNode(this); },
	
	getHeight: function() { return this.paramana.get('height'); },
	setHeight: function(h) { this.paramana.set('height', h); this.paramana.updateGeometryNode(this); },
	
	getThickness: function() { return this.paramana.get('thickness'); },
	setThickness: function(t) { this.paramana.set('thickness', t); this.paramana.updateGeometryNode(this); },
	
	getScale: function() { return this.paramana.get('scale'); },
	setScale: function(svec) { this.paramana.set('scale', svec); this.paramana.updateMatirxNode(this); },
	
	getRotate: function() { return this.paramana.get('rotate'); },
	setRotate: function(rvec) { this.paramana.set('rotate', rvec); this.paramana.updateMatirxNode(this); },
	
	getTranslate: function() { return this.paramana.get('translate'); },
	setTranslate: function(tvec) { this.paramana.set('translate', tvec); this.paramana.updateMatirxNode(this); },
	
	callBaseCalibration: function(high)
	{
        var backWall = -1, rightWall = -1, leftWall = -1, frontWall = -1, roof = -1;
        var nodes=scene.findNodes();
        
        // material name matrix texture element
        var mnmte = function(n) { return n.nodes[0].nodes[0].nodes[0].nodes[0].nodes[0]; }
    
        for(var i=0;i<nodes.length;i++)
        {
            var n = nodes[i];
            if(n.getType() == "name")
            {
                if(n.getName() == "backWall") { backWall = mnmte(n); }
                else if(n.getName() == "frontWall") { frontWall = mnmte(n); }
                else if(n.getName() == "leftWall") { leftWall = mnmte(n); }
                else if(n.getName() == "rightWall") { rightWall = mnmte(n); }
                else if(n.getName() == "roof") { roof = mnmte(n); }
            }
        }
        var havefrontWall = false, havebackWall = false;
        var defaulthigh = 0;
        var baseCenter = this.getTranslate();
        var baseCenterX = baseCenter[0], baseCenterY = baseCenter[1], baseCenterZ = baseCenter[2];
        
        if(frontWall != -1)
        {
            havefrontWall = true;
            frontWall.setWidth(this.getWidth());
            if(high) { frontWall.setHeight(high * 1); } 

            var translateV = [];
            translateV.push(baseCenterX);
            translateV.push(baseCenterY + this.getThickness() + frontWall.getHeight());
            translateV.push(baseCenterZ + this.getHeight() - frontWall.getThickness());

            frontWall.setTranslate(translateV);
            defaulthigh = frontWall.getHeight();
        }
        if(backWall != -1)
        {
            havebackWall = true;
            backWall.setWidth(this.getWidth());
            if(high) { backWall.setHeight(high * 1); }

            var translateV = [];
            translateV.push(baseCenterX);
            translateV.push(baseCenterY + this.getThickness() + backWall.getHeight());
            translateV.push(baseCenterZ - this.getHeight() + backWall.getThickness());

            backWall.setTranslate(translateV);
            defaulthigh = backWall.getHeight();
        }
        if(leftWall != -1)
        {
            if(havebackWall && havefrontWall) {}
            else if(havefrontWall) {}
            else if(havebackWall)
            {
                leftWall.setWidth(this.getHeight() - backWall.getThickness());
                if(high)leftWall.setHeight(high * 1);

                var translateV = [];
                translateV.push(baseCenterX - this.getWidth() + leftWall.getThickness());
                translateV.push(baseCenterY + this.getThickness() + leftWall.getHeight());
                translateV.push(baseCenterZ + backWall.getThickness());
                
                leftWall.setTranslate(translateV);
                defaulthigh = leftWall.getHeight();
            }
            else {}
        }
        if(rightWall != -1)
        {
            if(havebackWall && havefrontWall) {}
            else if(havefrontWall) {}
            else if(havebackWall)
            {
                rightWall.setWidth(this.getHeight() - backWall.getThickness());
                if(high) { rightWall.setHeight(high * 1); }

                var translateV = [];
                translateV.push(baseCenterX + this.getWidth() - rightWall.getThickness());
                translateV.push(baseCenterY + this.getThickness() + rightWall.getHeight());
                translateV.push(baseCenterZ + backWall.getThickness());

                rightWall.setTranslate(translateV);
                defaulthigh = rightWall.getHeight();
            }
            else {}
        }
        if(roof != -1)
        {
            roof.setWidth(this.getHeight());
            roof.setDepth(this.getWidth());

            var translateV = [];
            translateV.push(baseCenterX);
            
            if(high) { translateV.push(baseCenterY + this.getThickness() + 2 * high + roof.getHeight()); }
            else { translateV.push(baseCenterY + this.getThickness() + 2 * defaulthigh + roof.getHeight()); }
            
            translateV.push(baseCenterZ);

            roof.setTranslate(translateV);
            roof.adjustChildren();
        }
    }
});

function build(params) 
{	
	var indiceSet = utility.makeIndices(0, 23);
	var uvSet = new Float32Array(
	[
		1, 1, 0, 1, 0, 0, 1, 0,
		0, 1, 0, 0, 1, 0, 1, 1,
		1, 0, 1, 1, 0, 1, 0, 0,
		1, 1, 0, 1, 0, 0, 1, 0,
		0, 0, 1, 0, 1, 1, 0, 1,
		0, 0, 1, 0, 1, 1, 0, 1
	]);
	
	var geometry = 
	{
		type: 'geometry',
		primitive: 'triangles',
		positions: this.paramana.createPositions(),
		uv: uvSet,
		normals: "auto",
		indices: indiceSet
	};
	
	return geometry;
}
