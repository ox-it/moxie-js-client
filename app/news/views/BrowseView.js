define(['backbone', 'news/views/ItemView', 'hbs!news/templates/browse'], function(Backbone, ItemView, browseTemplate) {
    var BrowseView = Backbone.View.extend({

        template: browseTemplate,
        manage: true,

        beforeRender: function() {
            if (this.collection.length) {
                var views = [];
                this.collection.each(function(model) { views.push(new ItemView({model: model})); });
                this.insertViews({"#feeds": views});
            }
        }
    });
    return BrowseView;
});
