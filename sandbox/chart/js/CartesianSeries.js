function CartesianSeries(config)
{
	CartesianSeries.superclass.constructor.apply(this, arguments);
}

CartesianSeries.NAME = "cartesianSeries";

CartesianSeries.ATTRS = {
	parent: {
		lazyAdd: false,

		getter: function()
		{
			return this._parent;
		},

		setter: function(value)
		{
			if(Y.Lang.isString(value))
			{
				this._parent = document.getElementById(value);
			}
			else
			{
				this._parent = value;
			}
            this._setCanvas();
			return this._parent;
		}
	},

	type: {		
		getter: function()
		{
			return this._type;
		},
		setter: function(value)
		{
			this._type = value;
			return value;
		}
  	},
	/**
	 * Order of this ISeries instance of this <code>type</code>.
	 */
	order: {
		getter: function()
		{
			return this._order;
		},
		setter:function(value)
		{
			this._order = value;
			return value;
		}
	},
	/**
	 * x coordinates for the series.
	 */
	xcoords: {
		getter: function()
		{
			return this._xcoords;
		},

		setter: function(value)
		{
			this._xcoords = value;
			return value;
		}
	},
	/**
	 * y coordinates for the series
	 */
	ycoords: {
		getter: function()
		{
			return this._ycoords;
		},
		setter: function(value)
		{
			this._ycoords = value;
			return value;
		}
	},
	graph: {
		getter: function()
		{
			return this._graph;
		},
		setter: function(value)
		{
			this._graph = value;
			return value;
		}
	},
	/**
	 * Reference to the <code>Axis</code> instance used for assigning 
	 * x-values to the graph.
	 */
	xAxis: {
		getter: function()
		{ 
			return this._xAxis;
		},
		validator: function(value)
		{
			return value !== this._xAxis;
		},
		setter: function(value)
		{
			if(this._xAxis) 
			{
				//this.xAxis.removeEventListener(DataEvent.NEW_DATA, this.xAxisChangeHandler);
				//this.xAxis.removeEventListener(DataEvent.DATA_CHANGE, this.xAxisChangeHandler);
			}
			this._xAxis = value;			
			this._xAxis.on("axisReady", Y.bind(this.xAxisChangeHandler, this));
			//this.xAxis.addEventListener(DataEvent.NEW_DATA, this.xAxisChangeHandler);
			this._xAxis.on("dataChange", Y.bind(this.xAxisChangeHandler, this));
			this.setFlag("axisDataChange");
			return value;
		},
		lazyAdd: false
	},
	
	yAxis: {
		getter: function()
		{ 
			return this._yAxis;
		},
		validator: function(value)
		{
			return value !== this._yAxis;
		},
		setter: function(value)
		{
			if(this._yAxis) 
			{
	//			this.yAxis.removeEventListener(DataEvent.NEW_DATA, this.yAxisChangeHandler);
	//			this.yAxis.removeEventListener(DataEvent.DATA_CHANGE, this.yAxisChangeHandler);
			}
			this._yAxis = value;
			this._yAxis.on("axisReady", Y.bind(this.yAxisChangeHandler, this));
	//		this.yAxis.addEventListener(DataEvent.NEW_DATA, this.yAxisChangeHandler);
	//		this.yAxis.addEventListener(DataEvent.DATA_CHANGE, this.yAxisChangeHandler);
			this.setFlag("axisDataChange");
			return value;
		},
		lazyAdd: false
	},
	/**
	 * Indicates which array to from the hash of value arrays in 
	 * the x-axis <code>Axis</code> instance.
	 */
	xKey: {
		getter: function()
		{ 
			return this._xKey; 
		},
		validator: function(value)
		{
			return value !== this._xKey;
		},
		setter: function(value)
		{
			this._xKey = value;
			this.setFlag("xKeyChange");
			return value;
		}
	},
	/**
	 * Indicates which array to from the hash of value arrays in 
	 * the y-axis <code>Axis</code> instance.
	 */
	yKey: {
		getter: function()
		{ 
			return this._yKey; 
		},
		validator: function(value)
		{
			return value !== this._yKey;
		},
		setter: function(value)
		{
			this._yKey = value;
			this.setFlag("yKeyChange");
			return value;
		}
	},
    
    /**
     * Determines which axis property will define the bounds of the series.
     *  <ul>
     *      <li><code>data</code>: Maximum and minimum values are determined by the values of the datasource.</li>
     *      <li><code>axis</code>: Maximum and minimum values are determined by the <code>Axis</code> setting.</li>
     *  </ul>
     */

    /**
	 * The graphic in which the line series will be rendered.
	 */
	graphic: {
		getter: function()
		{
			return this._graphic;
		},
		setter: function(value)
		{
			this._graphic = value;
			return value;
		}
	}
};

Y.extend(CartesianSeries, Y.Renderer, {
	_setCanvas: function()
    {
        this._graphic = new Y.Graphic();
        this._graphic.render(this.get("parent"));
    },

    _parent: null,

	_styles: {
		padding:{
			top: 0,
			left: 0,
			right: 0,
			bottom: 0
		}
	},
	
	/**
	 * @private
	 */
	_graphic: null,
	
	/**
	 * @private (protected)
	 * Handles updating the graph when the x < code>Axis</code> values
	 * change.
	 */
	xAxisChangeHandler: function(event)
	{
        if(this.get("xKey")) 
		{
            this.setFlag("axisDataChange");
		}
		if(this.get("yKey")) 
		{
			this.callRender();
		}
	},

	/**
	 * @private (protected)
	 * Handles updating the chart when the y <code>Axis</code> values
	 * change.
	 */
	yAxisChangeHandler: function(event)
	{
		if(this.get("yKey")) 
		{
			this.setFlag("axisDataChange");
		}
		if(this.get("xKey")) 
		{
			this.callRender();
		}
	},

	/**
	 * @private
	 */
	_type: "cartesian",

	/**
	 * @private 
	 * Storage for <code>order</code>
	 */
	_order: NaN,
	
	/**
	 * @private 
	 * Storage for <code>xcoords</code>.
	 */
	_xcoords: [],

	
	/**
	 * @private
	 * Storage for xKey
	 */
	_xKey: null,
	/**
	 * @private (protected)
	 * Storage for <code>ycoords</code>
	 */
	_ycoords: [],
	/**
	 * @private 
	 * Storage for <code>graph</code>.
	 */
	_graph: null,
	/**
	 * @private
	 * Storage for xAxis
	 */
	_xAxis: null,
	
	/**
	 * @private
	 * Storage for yAxis
	 */
	_yAxis: null,
	/**
	 * @private
	 * Storage for yKey
	 */
	_yKey: null,
	
	/**
	 * @private (protected)
	 */
	_xMin:NaN,
	
	/**
	 * @private (protected)
	 */
	_xMax: NaN,
	
	/**
	 * @private (protected)
	 */
	_yMin: NaN,
	
	/**
	 * @private (protected)
	 */
	_yMax: NaN,

	/**
	 * @private (protected)
	 * Storage for xCoords
	 */
	_xCoords: [],

	/**
	 * @private
	 */
	setAreaData: function()
	{
        var nextX, nextY,
            parent = this.get("parent"),
			graphic = this.get("graphic"),
			w = parent.offsetWidth,
            h = parent.offsetHeight,
            padding = this.get("styles").padding,
			leftPadding = padding.left,
			topPadding = padding.top,
			dataWidth = w - (leftPadding + padding.right),
			dataHeight = h - (topPadding + padding.bottom),
			xcoords = [],
			ycoords = [],
			xMax = this.get("xAxis").get("maximum"),
			xMin = this.get("xAxis").get("minimum"),
			yMax = this.get("yAxis").get("maximum"),
			yMin = this.get("yAxis").get("minimum"),
			xKey = this.get("xKey"),
			yKey = this.get("yKey"),
			xScaleFactor = dataWidth / (xMax - xMin),
			yScaleFactor = dataHeight / (yMax - yMin),
			xData = this.get("xAxis").getDataByKey(xKey),
			yData = this.get("yAxis").getDataByKey(yKey),
			dataLength = xData.length, 	
			midY = dataHeight/2,
			areaMin = leftPadding,
            areaMax = Math.round((((xMax - xMin) * xScaleFactor) + leftPadding)),
            i;
        for (i = 0; i < dataLength; ++i) 
		{
            nextX = Math.round((((xData[i] - xMin) * xScaleFactor) + leftPadding));
			nextY = Math.round(((dataHeight + topPadding) - (yData[i] - yMin) * yScaleFactor));
            xcoords.push(nextX);
            ycoords.push(nextY);
        }
        this.set("xcoords", xcoords);
		this.set("ycoords", ycoords);
    },

	/**
	 * @private
	 */
	drawGraph: function()
	{
	},
	
	/**
	 * @private (override)
	 */
	render: function()
    {
		var dataChange = this.checkDataFlags(),
			resize = this.checkResizeFlags(),
			styleChange = this.checkStyleFlags(),
			graphic = this.get("graphic"),
            parent = this.get("parent"),
			w = parent.offsetWidth,
            h = parent.offsetHeight,
			xAxis = this.get("xAxis"),
			yAxis = this.get("yAxis");

		if(dataChange)
		{
			this._xMin = xAxis.get("minimum");
			this._xMax = xAxis.get("maximum");
			this._yMin = yAxis.get("minimum");
			this._yMax = yAxis.get("maximum");
		}
		
        if ((resize || dataChange) && (!isNaN(w) && !isNaN(h) && w > 0 && h > 0))
		{
			this.setAreaData();
			if(this.get("xcoords") && this.get("ycoords")) 
			{
				this.setLaterFlag("drawGraph");
			}
			return;
		}
		
		if(this.checkFlag("drawGraph") || (styleChange && this._xcoords && this._ycoords))
		{
			this.drawGraph();
		}
	},

	/**
	 * Determines whether a data change has occurred during this render cycle.
	 */
	checkDataFlags: function () 
	{
		return this.checkFlags({
			axisDataChange:true,
			xKeyChange:true,
			yKeyChange:true
		});
	},

	/**
	 * Indicates whether there has been a resize during the current render cycle.
	 */
	checkResizeFlags: function ()
	{
		return this.checkFlags({
			padding:true,
			resize:true
		});
	},

	/**
	 * Indicates whether there has been a style change during the current
	 * render cycle.
	 */
	checkStyleFlags: function () 
	{
		return false;
	}
});

Y.CartesianSeries = CartesianSeries;
