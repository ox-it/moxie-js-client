define(["app", "backbone", "places/router", "today/views/IndexView", "courses/router", "library/router"], function(app, Backbone, PlacesRouter, IndexView, CoursesRouter, LibraryRouter){
    var MoxieRouter = Backbone.Router.extend({
        subrouters: {},
        routes: {
            "": "index",

            "places/*subroute": "placesModule",
            "courses/*subroute": "coursesModule",
            "library/*subroute": "libraryModule"
        },

        index: function(params) {
            app.showView(new IndexView({params: params}));
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
        },
        libraryModule: function(subroute) {
            if (!this.subrouters.Library) {
                this.subrouters.Library = new LibraryRouter('library', {createTrailingSlashRoutes: true});
            }
        }
    });
    return MoxieRouter;
});
