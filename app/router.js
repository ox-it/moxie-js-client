define(["app", "backbone", "places/router", "today/views/IndexView", "courses/router", "favourites/views/FavouritesView"], function(app, Backbone, PlacesRouter, IndexView, CoursesRouter, FavouritesView){
    var MoxieRouter = Backbone.Router.extend({
        subrouters: {},
        routes: {
            "": "index",
            "favourites/": "favourites",

            "places/*subroute": "placesModule",
            "courses/*subroute": "coursesModule"
        },

        index: function(params) {
            app.showView(new IndexView({params: params}));
        },

        favourites: function(params) {
            app.showView(new FavouritesView({params: params}));
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
