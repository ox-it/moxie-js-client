define(['jquery', 'backbone', 'underscore', 'hbs!/handlebars/base', 'hbs!/handlebars/today/index', 'leaflet', 'moxie.conf'], function($, Backbone, _, baseTemplate, indexTemplate, L, MoxieConf){
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
            $("#content").html(baseTemplate());

        },

        renderTodayDate: function(data) {
            $('#list').html(indexTemplate(data));
        }
    });
    return IndexView;
});
