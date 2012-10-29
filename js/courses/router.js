define(["backbone", "courses/views/ListView"], function(Backbone, ListView){

    var CoursesRouter = Backbone.Router.extend({
        routes: {
            "courses": "courses",
        },

        courses: function(params) {
            listView = new ListView({params: params});
            listView.render();
        },
    });

    return CoursesRouter;
});
