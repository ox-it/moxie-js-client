define(['backbone', 'moxie.conf'], function(Backbone, conf) {
    var WebcamCard = Backbone.View.extend({
        manage: true,
        attributes: {'class': 'today'},
        serialize: function() {
            return this.model.toJSON();
        },
        template: function(webcam) {
            var img = new Image();
            img.src = conf.endpoint + webcam._links.self.href;
            return img;
        }
    });
    return WebcamCard;
});
