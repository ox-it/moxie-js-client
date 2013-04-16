define(["app", "underscore", "backbone", "courses/views/SearchView", "courses/views/BookingsView", "courses/views/CoursesView", "courses/views/CourseView", "courses/collections/CourseCollection", "backbone.subroute"],
 function(app, _, Backbone, SearchView, BookingsView, CoursesView, CourseView, Courses){
    var CoursesRouter = Backbone.SubRoute.extend({

        routes: {
            "": "search",
            "bookings": "bookings",
            "detail/:id": "course",
            ":query": "courses"
        },

        search: function(params) {
            var options = (_.isEmpty(params)) ? {menu: true} : {};
            app.renderView(new SearchView({
                collection: new Courses(),
                params: params
            }), options);
        },

        bookings: function(params) {
            app.showView(new BookingsView({
                params: params
            }), {back: true});
        },

        courses: function(query, params) {
            app.showView(new CoursesView({
                params: params,
                query: query
            }), {back: true});
        },

        course: function(id, params) {
            app.showView(new CourseView({
                params: params,
                id: id
            }), {back: true});
        }

    });

    return CoursesRouter;
});
