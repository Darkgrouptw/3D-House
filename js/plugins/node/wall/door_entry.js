SceneJS.Types.addType("wall/door_entry",
{
    construct: function(params)
    {
        this._layer;
        this._percentX;
        this._percentY;
        this._priority;
        this.direction;
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

            // bottom
            pset = pset.concat(attachToLast(inter[0], -t)).concat(attachToLast(inter[0], t))
                .concat(attachToLast(exter[0], t)).concat(attachToLast(exter[0], -t));

            pset = pset.concat(attachToLast(inter[3], -t)).concat(attachToLast(exter[3], -t))
                .concat(attachToLast(exter[3], t)).concat(attachToLast(inter[3], t));


            return pset;
        });
        
        this._paramana.addAttribute('posratio', params.posratio);
        this._paramana.addAttribute('doorW', params.doorW);
        this._paramana.addAttribute('doorH', params.doorH);
        this._paramana.addFunction('texture', function(property)
        {
            var w = property.width, h = property.height, t = property.thickness, pr = property.posratio;
            var dw = property.doorW, dh = property.doorH;

            var initx = ((w - dw) * pr) / w;
            var icr = [];
            icr.push([initx, 0]);
            icr.push([initx, dh / h]);
            icr.push([initx + (dw / w), dh / h]);
            icr.push([initx + (dw / w), 0]);

            var ecr = [];
            ecr.push([0, 0]); ecr.push([0, 1]); ecr.push([1, 1]); ecr.push([1, 0]);
            
            var uvset = [];

            for(var i = 0; i < 3; i++)
            {
                uvset = uvset.concat(
                [ 
                    ecr[i][0], ecr[i][1], icr[i][0], icr[i][1], icr[i + 1][0], icr[i + 1][1], ecr[i + 1][0], ecr[i + 1][1],
                    icr[i][0], icr[i][1], ecr[i][0], ecr[i][1], ecr[i + 1][0], ecr[i + 1][1], icr[i + 1][0], icr[i + 1][1],
                    1, 1, 0, 1, 0, 0, 1, 0,
                    1, 1, 0, 1, 0, 0, 1, 0
                ]);
            }

            uvset = uvset.concat([1, 1, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 0, 0, 1, 0]);

            return uvset;
        });

        this.addNode(wall_door_entry_build.call(this, params));
        this.direction = params.direction;
        this._percentY=params.percentY;
        this._percentX=params.percentX;
        this._priority=params.priority;
        this._layer = params.layer;
     },

    updateNode: function()
    {
        this._paramana.updateGeometryNode(this);
        this._paramana.updateTextureCoord(this); 
    },

    getLayer: function(){ return this._layer; },
	setLayer: function(l){ this._layer = l; },

    getPriority:function(){return this._priority;},
    setPriority:function(p){this._priority=p;},

    setPercentX:function(x){this._percentX=x;},
    getPercentX:function(){return this._percentX;},

    setPercentY:function(y){this._percentY=y;},
    getPercentY:function(){return this._percentY;},

    getWidth: function() { return this._paramana.get('width'); },
	setWidth: function(w) { this._paramana.set('width', w); this.updateNode(); },
	
	getHeight: function() { return this._paramana.get('height'); },
    setHeight: function(h) { this._paramana.set('height', h); this.updateNode(); },
	
    getThickness: function() { return this._paramana.get('thickness'); },
	setThickness: function(t) { this._paramana.set('thickness', t); this.updateNode(); },

    getPosratio: function() { return this._paramana.get('posratio'); },
    setPosratio: function(r) { this._paramana.set('posratio', r); this.updateNode(); },

    getDoorSize: function() { return { w: this._paramana.get('doorW'), h: this._paramana.get('doorH') };  },
    setDoorW: function(dw) { this._paramana.set('doorW', dw); this.updateNode(); },
    setDoorH: function(dh) { this._paramana.set('doorH', dh); this.updateNode(); },

	getScale: function() { return this._paramana.get('scale'); },
	setScale: function(svec) { this._paramana.set('scale', svec); this._paramana.updateMatirxNode(this); },
	
	getRotate: function() { return this._paramana.get('rotate'); },
	setRotate: function(rvec) { this._paramana.set('rotate', rvec); this._paramana.updateMatirxNode(this); },
	
	getTranslate: function() { return this._paramana.get('translate'); },
	setTranslate: function(tvec) { this._paramana.set('translate', tvec); this._paramana.updateMatirxNode(this); },
	
    setTranslateX: function(x) { var t = this.getTranslate(); this.setTranslate([x, t[1], t[2]]); },
    setTranslateY: function(y) { var t = this.getTranslate(); this.setTranslate([t[0], y, t[2]]); },
    setTranslateZ: function(z) { var t = this.getTranslate(); this.setTranslate([t[0], t[1], z]); },
    getDirection:function(){return this.direction;},
    setDirection:function(d){
        if(d=="horizontal" || d=="vertical"){
            this.direction=d;
            var matrix= this.parent;
            if(d=="horizontal"){
                this.setRotate([0,0,0]);
            }else{
                this.setRotate([0,90,0]);
            }
        }
    },
    isInside:function(params){
        var center=this.getTranslate();
        var range=Math.sqrt(Math.pow(center[0] - params[0],2)+
                            Math.pow(center[1] - params[1],2)+
                            Math.pow(center[2] - params[2],2));
        //if(range < this.getThickness()/2){
        //    return true;
        //}
        if(this.direction=="vertical"){
            //if(this.getPriority()==2){
            //    console.log("meow");
            //    console.log(params);
            //    console.log(center);
            //        console.log(params[0] <= center[0] + this.getThickness()/2);
            //        console.log(params[0] >= center[0] - this.getThickness()/2);
            //        console.log(params[1] <= center[1] + this.getHeight()/2);
            //        console.log(params[1] >= center[1] - this.getHeight()/2);
            //        console.log(params[2] <= center[2] + this.getWidth()/2);
            //        console.log(params[2] >= center[2] - this.getWidth()/2);
            //    }
            if(params[0] <= center[0] + this.getThickness() &&
                params[0] >= center[0] - this.getThickness() &&
                params[1] <= center[1] + this.getHeight() &&
                params[1] >= center[1] - this.getHeight() &&
                params[2] <= center[2] + this.getWidth() &&
                params[2] >= center[2] - this.getWidth()){
                return true
            }
            else{
                return false
            }
        }
        else{
            if(params[0] <= center[0] + this.getWidth() &&
                params[0] >= center[0] - this.getWidth() &&
                params[1] <= center[1] + this.getHeight() &&
                params[1] >= center[1] - this.getHeight() &&
                params[2] <= center[2] + this.getThickness() &&
                params[2] >= center[2] - this.getThickness()){
                return true
            }
            else{
                return false
            }
        }
    },
    isTooClose: function(wall){
        var center=this.getTranslate();
        var up1,up2,down1,down2,left1,left2,right1,right2;
        if(this.direction == "vertical"){
            up1 = center[2] + this.getWidth();
            down1 = center[2] - this.getWidth();
            left1 = center[0] - this.getThickness();
            right1 = center[0] + this.getThickness();
        }else{
            up1 = center[2] + this.getThickness();
            down1 = center[2] - this.getThickness();
            left1 = center[0] - this.getWidth();
            right1 = center[0] + this.getWidth();
        }
        var center2 = wall.getTranslate();
        up2 = center2[2] + wall.getThickness();
        down2 = center2[2] - wall.getThickness();
        left2 = center2[0] - wall.getThickness();
        right2 = center2[0] + wall.getThickness();

        if(!(down2 >= up1 || down1 >= up2) && !(left1 >= right2 || left2 >= right1)){
            return true;
        }else{
            return false;
        }
    },
    callBaseCalibration: function()
    {
        var mnmte = function(n) { return n.nodes[0].nodes[0].nodes[0].nodes[0].nodes[0].nodes[0].nodes[0]; }

        var backWall=-1;
        var rightWall=-1;
        var leftWall=-1;
        var frontWall=-1;
        var downBase=-1;
        var downWall=-1;
        var roof=-1;
        var base=-1;
        var nodes = scene.findNodes();
        for(var i=0;i<nodes.length;i++){
            var n = nodes[i];
            if(n.getType()=="name"){
                if(n.getName()=="backWall" && mnmte(n).getLayer()==this.getLayer()){
                    //         material  name     matrix  texture  element
                    backWall=mnmte(n);
                }
                else if(n.getName()=="frontWall" && mnmte(n).getLayer()==this.getLayer())frontWall=mnmte(n);
                else if(n.getName()=="leftWall"  && mnmte(n).getLayer()==this.getLayer())leftWall=mnmte(n);
                else if(n.getName()=="rightWall" && mnmte(n).getLayer()==this.getLayer())rightWall=mnmte(n);
                else if(n.getName()=="roof"                                             )roof=mnmte(n);
                else if(n.getName()=="base" && mnmte(n).getLayer()==this.getLayer())base=mnmte(n);
                else if(n.getName()=="base"      && mnmte(n).getLayer()==this.getLayer() - 1)downBase=mnmte(n);
                else if(n.getName()=="backWall"  && mnmte(n).getLayer()==this.getLayer() - 1)downWall=mnmte(n);
            }   
        }
        
        if(base == -1) { console.log("ERROR"); return; }
        if(frontWall != -1 && frontWall.getID() == this.getID()) {}
        else if(backWall != -1 && backWall.getID() == this.getID())
        {
            base.setRealWidth(this.getWidth());
            base.callBaseCalibration(this.getHeight());
        }
        else if(leftWall!= -1 && leftWall.getID() == this.getID())
        {
            if(backWall != -1 && frontWall != -1) {}
            else if(frontWall != -1) {}
            else if(backWall != -1)
            {
                base.setRealHeight(this.getWidth() + backWall.getThickness());
                base.callBaseCalibration(this.getHeight());
            }
            else {}
        }
        else if(rightWall != -1 && rightWall.getID() == this.getID())
        {
            if(backWall != -1 && frontWall != -1) {}
            else if(frontWall != -1) {}
            else if(backWall != -1)
            {
                base.setRealHeight(this.getWidth() + backWall.getThickness());
                base.callBaseCalibration(this.getHeight());
            }
            else {
                
            }
        }
        else{
            base.callBaseCalibration();
        }
    },
    adjustChildren: function()
    {
        var baseCenter = this.getTranslate();
        var baseCenterX = baseCenter[0];
        var baseCenterY = baseCenter[1];
        var baseCenterZ = baseCenter[2];
        var size =  this.getDoorSize();
        var ratio = this.getPosratio();
        var wh = size.h;
        var ww = size.w;
        var a = ratio;
        var b = ratio;
        if(ww>this.getWidth()-1){
            ww = this.getWidth()-1;
        }
        if(wh>this.getHeight()-1){
            wh = this.getHeight() - 1;
        }
        if((baseCenterX-this.getWidth())+(a*2*this.getWidth())+ww > baseCenterX + this.getWidth() - 1){
            a = (baseCenterX + this.getWidth() - 1 - ww) - baseCenterX + this.getWidth();
            a = a/(2*this.getWidth());
        }
        if((baseCenterX - this.getWidth())+(a*2*this.getWidth())-ww < baseCenterX -this.getWidth() + 1){
            a = (baseCenterX -this.getWidth() + 1 + ww) -baseCenterX + this.getWidth();
            a = a/(2*this.getWidth());
        }
        if((baseCenterZ-this.getHeight())+(b*2*this.getHeight())+wh>baseCenterZ + this.getHeight() - 1){
            b = (baseCenterZ + this.getHeight() - 1 - wh) - baseCenterZ + this.getHeight();
            b = b/(2*this.getHeight());
        }
        if((baseCenterZ - this.getHeight())+(b*2*this.getHeight()-wh)<baseCenterZ - this.getHeight() + 1){
            b = (baseCenterZ - this.getHeight() + 1 + wh) -baseCenterZ +this.getHeight();
            b = b/(2*this.getHeight());
        }
        this.setDoorH(wh);
        this.setDoorW(ww);
        this.setPosratio(a);
    }
});

function wall_door_entry_build() 
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
