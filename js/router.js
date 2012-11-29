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
            console.log("Calling subrouter");
            if (!this.subrouters.Places) {
                console.log("creating subrouter");
                this.subrouters.Places = new PlacesRouter('places', {createTrailingSlashRoutes: true});
                console.log(this.subrouters);
            }
        },
        coursesModule: function(subroute) {
            console.log("Calling subrouter");
            if (!this.subrouters.Courses) {
                console.log("creating subrouter");
                this.subrouters.Courses = new CoursesRouter('courses', {createTrailingSlashRoutes: true});
                console.log(this.subrouters);
            }
        }
    });
    return MoxieRouter;
});
