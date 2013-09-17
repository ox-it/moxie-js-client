define(["backbone", "moxie.conf"], function(Backbone, conf) {

    var Feedback = Backbone.Model.extend({
        url: conf.urlFor('feedback')
    });
    return Feedback;

});
