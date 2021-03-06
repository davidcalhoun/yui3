function TimeAxis(config)
{
	TimeAxis.superclass.constructor.apply(this, arguments);
}

TimeAxis.NAME = "timeAxis";

TimeAxis.ATTRS = 
{
    maximum: {
		getter: function ()
		{
			if(this._autoMax || this._setMaximum === null) 
			{
                return this._getNumber(this._dataMaximum);
			}
			return this._setMaximum;
		},
		setter: function (value)
		{
			this._setMaximum = this._getNumber(value);
            this.fire("dataChange");
		}
    },

    minimum: {
		getter: function ()
		{
			if(this._autoMin || this._setMinimum === null) 
			{
				return this._dataMinimum;
			}
			return this._setMinimum;
		},
		setter: function (value)
		{
			this._setMinimum = this._getNumber(value);
            this.fire("dataChange");
        }
    }
};

Y.extend(TimeAxis, Y.BaseAxis, {
	/**
	 * @private
	 */
	_dataType: "time",
		
	/**
	 * @private (override)
	 */
	_setDataByKey: function(key)
	{
		var obj, 
			arr = [], 
			dv = this._dataClone.concat(), 
			i, 
			val,
			len = dv.length;
		for(i = 0; i < len; ++i)
		{
			obj = dv[i][key];
			if(Y.Lang.isDate(obj))
			{
				val = obj.valueOf();
			}
			else if(!Y.Lang.isNumber(obj))
			{
				val = new Date(obj.toString()).valueOf();
			}
			else
			{
				val = obj;
			}
			arr[i] = val;
		}
		this._keys[key] = arr;
		this._data = this._data.concat(arr);
	},

    _getNumber: function(val)
    {
        if(Y.Lang.isDate(val))
        {
            val = val.valueOf();
        }
        else if(!Y.Lang.isNumber(val))
        {
            val = new Date(val.toString()).valueOf();
        }

        return val;
    },

    updateMaxByPosition:function(val, len)
    {
        var range = this._dataMaximum - this._dataMinimum,
            scaleFactor = len / range,
            pos = (val/len) * range;
            pos += this._dataMinimum;
        this.set("maximum", pos);
    },

    updateMinByPosition:function(val, len)
    {
        var range = this._dataMaximum - this._dataMinimum,
            scaleFactor = len / range,
            pos = (val/len) * range;
            pos += this._dataMinimum;
        this.set("minimum", pos);
    },

    updateMinAndMaxByPosition: function(minVal, maxVal, len)
    {
        var range = this._dataMaximum - this._dataMinimum,
            scaleFactor = len / range,
            min = minVal / len,
            max = maxVal / len;
        min += this._dataMinimum;
        max += this._dataMaximum;
        //this.set("minimum", min);
        //this.set("maximum", max);
        this._setMaximum = this._getNumber(max);
        this._setMinimum = this._getNumber(min);
        this.fire("dataChange");
    }
});

Y.TimeAxis = TimeAxis;
		
