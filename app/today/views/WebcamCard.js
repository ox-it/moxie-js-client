define(['underscore', 'today/views/CardView', 'moxie.conf', 'hbs!today/templates/webcam'], function(_, CardView, conf, webcamTemplate) {
    var WebcamCard = CardView.extend({
        weight: 60,
        manage: true,
        attributes: {
            'class': 'today webcam',
            'style': 'display:none;',
        },
        serialize: function() {
            return this.model.toJSON();
        },
        template: webcamTemplate,
        afterRender: function() {
            var img = new Image();
            img.src = conf.endpoint + this.model.get('_links').self.href;
            img.alt = this.model.get('description');
            img.onload = _.bind(this.showEl, this);
            this.insert(this.el, img);
            if (img.complete) {
                // Image cached
                this.showEl();
            }
        },
        showEl: function() {
            this.el.style.display = null;
            $('.today-card-container').nested('append', this.el);
        },
    });
    return WebcamCard;
});
