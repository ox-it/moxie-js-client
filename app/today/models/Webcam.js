define(['backbone', 'underscore', 'moxie.conf', 'today/views/WebcamCard'], function(Backbone, _, conf, WebcamCard) {
    var Webcam = Backbone.Model.extend({
        url: conf.urlFor('webcams'),
        View: WebcamCard,
        parse: function(data) {
            var index = _.random(0, data._embedded.webcams.length);
            return data._embedded.webcams[index];
        }
    });
    return Webcam;
});
