define(["backbone", "moxie.conf"], function(Backbone, conf) {

    var Event = Backbone.Model.extend({
        url: function() {
            return conf.urlFor('events_id') + this.id;
        }
    });

    return Event;

});
