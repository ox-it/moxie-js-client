define(['backbone'], function(Backbone) {
    var StaticView = Backbone.View.extend({

        initialize: function(options) {
            this.template = options.template;
            this.feed = options.feed;
            this.feed.entries.on("reset", this.render, this);
        },

        serialize: function() {
            var entries = this.feed.entries.toJSON();
            if (entries.length > 3) {
                entries = entries.slice(0, 3);
            }
            return {feed: this.feed.toJSON(), entries: entries};
        },

        beforeRender: function() {
            Backbone.trigger('domchange:title', "Safety and Security");
        },

        manage: true
    });
    return StaticView;
});
