define(['backbone', 'hbs!news/templates/item'], function(Backbone, itemTemplate) {
    var ItemView = Backbone.View.extend({

        template: itemTemplate,
        manage: true,
        tagName: "li",

        serialize: function() {
            return {feed: this.model.toJSON()};
        }
    });
    return ItemView;
});
