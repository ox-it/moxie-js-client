define(["backbone","library/models/ItemModel"], function(Backbone, Item) {

    var Items = Backbone.Collection.extend({

        model: Item

    });

    // Returns the Model class
    return Items;

});
