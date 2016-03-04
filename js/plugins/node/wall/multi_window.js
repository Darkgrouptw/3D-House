SceneJS.Types.addType("wall/multi_window", 
{ 
    construct: function (params) 
    {
        this._layer;
        this.direction;
        this._paramana = new ParameterManager(params, function(property)
        {
            console.log("this is a joke");
        });

        this._paramana.addAttribute('sizeMode', params.sizeMode);
        this._paramana.addAttribute('windowSize', utility.vectorForm(params.windowSize));
        
        this._paramana.addAttribute('centerMode', params.centerMode); 
        this._paramana.addAttribute('windowCenter', utility.vectorForm(params.windowCenter));
        this._paramana.addAttribute('arrangement', utility.vectorForm(params.arrangement));

        this.addNode(build.call(this, params)); 
    }
});

function build(params) 
{}
