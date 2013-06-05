define(['today/views/CardView', 'moxie.conf'], function(CardView, conf) {
    var WebcamCard = CardView.extend({
        weight: 60,
        manage: true,
        attributes: {'class': 'today webcam'},
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
