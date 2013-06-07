define(['backbone', 'moxie.conf'], function(Backbone, conf) {
    var RTIModel = Backbone.Model.extend({
        url: function() {
            return conf.endpoint + this.get('href');
        }
    });
    return RTIModel;
});
