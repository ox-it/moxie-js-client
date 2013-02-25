define(['jquery', 'backbone', 'underscore', 'hbs!today/templates/index', 'hbs!today/templates/oxford_date', 'leaflet', 'moxie.conf'],
    function($, Backbone, _, indexTemplate, oxfordDate, L, MoxieConf){
    var IndexView = Backbone.View.extend({

        initialize: function() {
            _.bindAll(this);
        },

        render: function() {
            // base, static template
            this.$el.html(indexTemplate());

            // loading date
            $.ajax({
                url: MoxieConf.urlFor('dates'),
                dataType: 'json'
            }).success(this.renderTodayDate);
            return this;
        },

        renderTodayDate: function(data) {
            this.$("#oxford_date").html(oxfordDate(data));
        }
    });
    return IndexView;
});
