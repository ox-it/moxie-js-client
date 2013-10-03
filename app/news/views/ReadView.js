define(['backbone', 'hbs!news/templates/read'], function(Backbone, readTemplate) {
    var ReadView = Backbone.View.extend({
        initialize: function() {
            this.model.entries.on("reset", this.entriesUpdated, this);
        },
        entriesUpdated: function() {
            this.render();
        },
        template: readTemplate,
        manage: true,

        serialize: function() {
            return {feed: this.model.toJSON(), entries: this.model.entries.toJSON()};
        },
        beforeRender: function() {
            Backbone.trigger('domchange:title', this.model.get('title'));
        }
    });
    return ReadView;
});
