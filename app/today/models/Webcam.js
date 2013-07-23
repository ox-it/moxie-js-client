define(['MoxieModel', 'underscore', 'moxie.conf', 'today/views/WebcamCard'], function(MoxieModel, _, conf, WebcamCard) {
    var Webcam = MoxieModel.extend({
        url: conf.urlFor('webcams'),
        View: WebcamCard,
        parse: function(data) {
            var webcams = _.shuffle(data._embedded.webcams);
            return _.findWhere(webcams, {credit: "Oxford Internet Institute"});
        }
    });
    return Webcam;
});
