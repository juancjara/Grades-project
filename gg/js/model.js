var Evaluation = function ( params ){
    if ( params == undefined ) return;
    this._name = params.name || "";
    this._value = params.value|| -1;
    this._sons =params.sons || [];
    this._weight = params.weight || "";
    this._deleteMin = params.deleteMin || false;
    this._precision = params.precision || 1;
    this._locked = params.locked || false;
    this._tempValue = -1;
    this._id = params.id ;
    this._bounds = { lower : 0 , upper : 20 };
};

Evaluation.prototype = {
    getBounds : function (){
        if ( this._locked ){
            return { lower : this._value , upper : this._value };
        }
        return this._bounds;
    },
    setBounds : function( bound ){
        this._bounds = bound;
    },
    getId : function(){
        return this._id;
    },
    setId : function( id ){
        this._id = id;
    },
    getName : function(){
        return this._name;
    },
    setName : function( name ){
        this._name = name;
    },
    getValue : function(){
        return this._value;
    },
    setValue : function( value ){
        this._value = value;
    },
    getSons : function(){
        return this._sons;
    },
    setSons : function( sons ){
        this._sons = sons;
    },
    getWeight : function (){
        return this._weight;
    },
    setWeight : function( weight ){
        this._weight = weight;
    },
    getDeleteMin : function(){
        return this._deleteMin;
    },
    setDeleteMin : function( deleteMin ){
        this._deleteMin = deleteMin;
    },
    getPrecision : function(){
        return this._precision;
    },
    setPrecision : function( precision ){
        this._precision = precision;
    },
    getLocked : function(){
        return this._locked;
    },
    setLocked : function( locked ){
        this._locked = locked;
    },
    getTempValue : function(){
        return this._tempValue;
    },
    setTempValue : function( value ){
        this._tempValue = value;
    }
};