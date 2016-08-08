define(['backbone', 'hbs!app/news/templates/browse'], function(Backbone, browseTemplate) {
    var BrowseView = Backbone.View.extend({

        template: browseTemplate,
        manage: true,
        serialize: function() {
            return {feeds: this.collection.toJSON()};
        },
        beforeRender: function() {
            Backbone.trigger('domchange:title', "News");
        }
    });
    return BrowseView;
});
