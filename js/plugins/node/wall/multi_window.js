/*(function () 
{
    SceneJS.Types.addType("wall/multi_window", { construct: function (params) { this.addNode(build.call(this, params)); }});

    function build(params) 
	{
        var w = params.width !== undefined ? params.width / 2 : 0;
        var h = params.height !== undefined ? params.height / 2 : 0;
		var t = params.thickness !== undefined ? params.thickness / 2 : 0;
		var c = params.center !== undefined ? params.center : {x: 0, y: 0, z: 0};

        var coreId = "wall/single_window" + "_" + SceneJS_add_randomString(20) + "_" + (params.wire ? "wire" : "solid");
        if (this.getScene().hasCore("geometry", coreId)) { return { type: "geometry", coreId: coreId }; }
        
        var pp = params.parampack;

        var mode = { wsize: pp.attributes['wsize'].value, ratio: pp.attributes['ratio'].value };
        
        // Generate window center
        var wc = []; var sizemax = {w: params.width, h: 0};
        switch(mode.ratio)
        {
            case "auto":
                var rowSeg = params.height / (pp.colrow.length + 1);
                sizemax.h = (rowSeg - 1) / 2;
                for(var ir = 1; ir <= pp.colrow.length; ir++)
                {
                    var colSeg = params.height / pp.colrow[i] + 1;
                    if(colSeg < sizemax.w) { sizemax.w = colSeg; }
                    for(var jc = 1; jc <= pp.colrow[i]; jc++)
                    {
                        wc.push([-w + (jc * colSeg), h - (ir * rowSeg)])
                    }
                }
                break;
                
            case "manual":
                for(var ix = 0; ix < pp.lratio.length; ix = ix + 2)
                {
                    wc.push([pp.lratio[ix], pp.lratio[ix + 1]]);
                }
                break;
                
            default:
        }
        
        // Generate window size
        var ws = [];
        var PickingMin = function(l, ordered) 
        {
            var val;
            if(ordered == 'odd') { val = 0; }
            if(ordered == 'even') { val = 1; }
            
            var tmpl = []; 
            for(var i = val; i < l.length; i = i + 2) { tmpl.push(l[i]); }
            tmpl.min = function() { return Math.min.apply(null, this); }
            return tmpl.min();
        }
        
        var BoundarySzie = function(list) 
        {
            var fesible = list;
            // Not Yet Do
            return feasible;
        }
        
        switch(mode.wsize)
        {
            case "diff":
            
                for(var is = 0; is < pp.lwsize.length; is = is + 2)
                {
                    ws.push([pp.lwsize[is], pp.lwsize[is + 1]]);
                }
                
                break;
                
            case "same":
            
                var windowsize;
                
                if(pp.lwsize !== undefined)
                {
                    // For now, the user defined data which without the boundary check.
                    windowsize = [PickingMin(pp.lwsize, 'odd'), PickingMin(pp.lwsize, 'even')];
                }
                else
                {
                    // Compute from the window center, and make the size is suitable for all window.
                    windowsize = sizemax;
                }
                
                for(var idx = 0; idx < wc.length; idx++)
                {
                    ws.push(windowsize);
                }  
                
                break;
                
            case "auto":
            
                // Compute for each size of window, don't care the same size.
                break;
                
            default:
        }
        
        
                
		
		pset = SceneJS_add_moveToCenter(pset, c);
		
        // Otherwise, create a new geometry
        var newone = 
		{
            type: "geometry",
            primitive: params.wire ? "lines" : "triangles",
            coreId: coreId,
            positions: new Float32Array(pset),
            normals: new Float32Array([
				0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1,
                0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1,
                -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0,
				1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0,
				
                0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1,
				0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1,
                0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0,
                0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0,
				
                0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1,
                0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1,
				1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0,
                -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0,
				
                0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1,
                0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1,
				0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0,
				0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0,
            ]),
            indices: SceneJS_add_indiceGenerator(64)
        };
		
		return newone;
    }
})();*/
