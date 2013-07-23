define(['MoxieModel', 'moxie.conf', 'today/views/OxfordDateView'], function(MoxieModel, conf, OxfordDateView) {
    var OxfordDate = MoxieModel.extend({
        url: conf.urlFor('dates'),
        View: OxfordDateView
    });
    return OxfordDate;
});
