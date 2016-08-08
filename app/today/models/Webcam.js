define(['app/core/models/MoxieModel', 'underscore', 'app/moxie.conf', 'app/today/views/WebcamCard'], function(MoxieModel, _, conf, WebcamCard) {
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
