define(['app/core/models/MoxieModel', 'app/moxie.conf', 'app/today/views/OxfordDateView'], function(MoxieModel, conf, OxfordDateView) {
    var OxfordDate = MoxieModel.extend({
        url: conf.urlFor('dates'),
        View: OxfordDateView
    });
    return OxfordDate;
});
