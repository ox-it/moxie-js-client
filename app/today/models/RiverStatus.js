define(['backbone', 'underscore', 'moxie.conf', 'today/views/RiversCard'], function(Backbone, _, conf, RiversCard) {
    var RiverStatus = Backbone.Model.extend({
        url: conf.urlFor('rivers'),
        View: RiversCard
    });
    return RiverStatus;
});
