define(['backbone', 'cordova.help', 'hbs!news/templates/entry'], function(Backbone, cordova, entryTemplate) {
    var EntryView = Backbone.View.extend({
        manage: true,
        serialize: function() {
            return {entry: this.model.toJSON()};
        },
        template: entryTemplate,
        events: {
            'click .entry-content a[href]': 'linkClicked'
        },
        linkClicked: function(ev) {
            if (cordova.isCordova()) {
                // If we're on a native device always open the main
                // link for the article regardless of link clicked
                //
                // This is partly for simplicity, partly because so many
                // RSS feeds are loaded with relative hrefs
                ev.preventDefault();
                var href = this.model.get('link');
                if ((window.device) && (window.device.platform==='Android')) {
                    navigator.app.loadUrl(href, { openExternal:true });
                } else if ((window.device) && (window.device.platform==='iOS')) {
                    window.open(href, '_system');
                }
                return false;
            }
            return true;
        },
        beforeRender: function() {
            Backbone.trigger('domchange:title', this.model.get('title'));
        }
    });
    return EntryView;
});
