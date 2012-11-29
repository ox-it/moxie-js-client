define(["backbone", "places/router", "today/views/IndexView", "courses/router"], function(Backbone, PlacesRouter, IndexView, CoursesRouter){
    var MoxieRouter = Backbone.Router.extend({
        subrouters: {},
        routes: {
            "": "index",

            "places/*subroute": "placesModule",
            "courses/*subroute": "coursesModule"
        },

        index: function(params) {
            indexView = new IndexView({params: params});
            indexView.render();
        },

        placesModule: function(subroute) {
            if (!this.subrouters.Places) {
                this.subrouters.Places = new PlacesRouter('places', {createTrailingSlashRoutes: true});
            }
        },
        coursesModule: function(subroute) {
            if (!this.subrouters.Courses) {
                this.subrouters.Courses = new CoursesRouter('courses', {createTrailingSlashRoutes: true});
            }
        }
    });
    return MoxieRouter;
});
