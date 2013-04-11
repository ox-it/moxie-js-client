define(["backbone"], function(Backbone) {

    var Category = Backbone.Model.extend({
        getChildren: function() {
            var children = this.collection.filter(function(model) {
                return (model.get('type_prefixed').indexOf(this.get('type_prefixed')) === 0) && (model.get('depth') === this.get('depth')+1);
            }, this);
            return children;
        }
    });

    return Category;

});
