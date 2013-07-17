// Backbone.Factory a plugin for making factories
(function() {

	// check to see if we have Cocktail loaded
    var hasCocktail = _.isObject(Cocktail);

    // Backbone abstract factory
    Backbone.Factory = function(BaseClass) {
        if(!_.isFunction(BaseClass.extend)) {
            throw "Backbone.Factory Must Include Base Class for Abstract Factory that implements the extend function"
        }
        _.bindAll(this)
        this.base = BaseClass;
        this._objs = {};
        this._mixins = {};
    };

    _.extend(Backbone.Factory.prototype, {
        add:function(id, def, mixins) {
            var m = this._mixins,
                obj =  this.base.extend(def);

            if(_.isArray(mixins)) {
                _.each(mixins, function(id) {
                    if(m[id]) { 
                        if(hasCocktail) {
                            Cocktail.mixin(obj, m[id]);
                        }else{
                            _.extend(obj.prototype, m[id]);
                        }
                    }
                });
            }

            this._objs[id] = obj;
            return obj;
        },
        make:function(id, config) {
            var obj = this._objs[id]; 
            return (obj ? new obj(config) : null);
        },
        mixin:function(id, protoProps) {
            if(!id || !_.isString(id) || !_.isObject(protoProps)) { return; }
            this._mixins[id] = protoProps;
        },
        get:function(id) {
            return this._objs[id];
        },
        getMixin:function(id) {
            return this._mixins[id];
        }
    });
})();