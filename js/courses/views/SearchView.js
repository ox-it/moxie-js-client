define(['jquery', 'backbone', 'underscore', 'handlebars', 'leaflet', 'moxie.conf'], function($, Backbone, _, Handlebars, L, MoxieConf){
    var SearchView = Backbone.View.extend({

        initialize: function() {
            _.bindAll(this);
            //this.render();

            $.ajax({
                url: MoxieConf.urlFor('courses_subjects'),
                dataType: 'json'
            }).success(this.renderSubjectsList);
        },

        render: function() {
            // render basic view
            $("#content").html(Handlebars.templates.base());
        },

        renderSubjectsList: function(data) {
            $('#list').html(Handlebars.templates.courses_index(data));
        }
    });
    return SearchView;
});
