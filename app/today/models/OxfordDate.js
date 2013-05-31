define(['backbone', 'moxie.conf', 'today/views/OxfordDateView'], function(Backbone, conf, OxfordDateView) {
    var OxfordDate = Backbone.Model.extend({
        url: conf.urlFor('dates'),
        View: OxfordDateView
    });
    return OxfordDate;
});
