define(["backbone", "app/moxie.conf"], function(Backbone, conf) {

    var Feedback = Backbone.Model.extend({
        url: conf.urlFor('feedback'),
        localStorage: null,
        collection: null
    });
    return Feedback;

});
