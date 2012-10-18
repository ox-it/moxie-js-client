define(['jquery', 'backbone', 'underscore', 'handlebars', 'leaflet', 'moxie.conf'], function($, Backbone, _, Handlebars, L, MoxieConf){
    var IndexView = Backbone.View.extend({

        initialize: function() {
            _.bindAll(this);
            //this.render();

            $.ajax({
                url: MoxieConf.urlFor('dates'),
                dataType: 'json'
            }).success(this.renderTodayDate);
        },

        render: function() {
            // render basic view
            $("#content").html(Handlebars.templates.base());

        },

        renderTodayDate: function(data) {
            $('#list').html(Handlebars.templates.index(data));
        }
    });
    return IndexView;
});
