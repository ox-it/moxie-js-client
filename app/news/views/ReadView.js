define(['backbone', 'hbs!news/templates/read'], function(Backbone, readTemplate) {
    var ReadView = Backbone.View.extend({
        initialize: function() {
            this.model.on("change:entries", this.entriesUpdated, this);
        },
        entriesUpdated: function() {
            this.render();
        },
        template: readTemplate,
        manage: true,

        serialize: function() {
            return {feed: this.model.toJSON()};
        }
    });
    return ReadView;
});
