define(["backbone", "hbs!places/templates/item"], function(Backbone, itemTemplate){
    var ItemView = Backbone.View.extend({
        manage: true,
        tagName: "li",
        serialize: function() { return this.model.toJSON(); },
        template: itemTemplate
    });
    return ItemView;
});
