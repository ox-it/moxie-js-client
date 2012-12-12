define(['jquery', 'backbone', 'underscore', 'hbs!today/templates/index', 'leaflet', 'moxie.conf'], function($, Backbone, _, indexTemplate, L, MoxieConf){
    var IndexView = Backbone.View.extend({

        initialize: function() {
            _.bindAll(this);
        },

        render: function() {
            $.ajax({
                url: MoxieConf.urlFor('dates'),
                dataType: 'json'
            }).success(this.renderTodayDate);
            return this;
        },

        renderTodayDate: function(data) {
            this.$el.html(indexTemplate(data));
        }
    });
    return IndexView;
});
