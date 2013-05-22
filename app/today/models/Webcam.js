define(['backbone', 'underscore', 'moxie.conf', 'today/views/WebcamCard'], function(Backbone, _, conf, WebcamCard) {
    var Webcam = Backbone.Model.extend({
        url: conf.urlFor('webcams'),
        View: WebcamCard,
        parse: function(data) {
            var webcams = _.shuffle(data._embedded.webcams);
            return _.findWhere(webcams, {credit: "Oxford Internet Institute"});
        }
    });
    return Webcam;
});
