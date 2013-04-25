define(['backbone', 'hbs!news/templates/browse'], function(Backbone, browseTemplate) {
    var BrowseView = Backbone.View.extend({

        template: browseTemplate,
        manage: true,
        serialize: function() {
            return {feeds: this.collection.toJSON()};
        }
    });
    return BrowseView;
});
