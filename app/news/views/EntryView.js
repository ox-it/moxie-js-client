define(['backbone', 'hbs!news/templates/entry'], function(Backbone, entryTemplate) {
    var EntryView = Backbone.View.extend({
        manage: true,
        serialize: function() {
            return {entry: this.model.toJSON()};
        },
        template: entryTemplate
    });
    return EntryView;
});
