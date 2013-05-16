define(["app", "underscore", "backbone", "courses/views/SearchView", "courses/views/BookingsView", "courses/views/CoursesView", "courses/views/CourseView", "courses/collections/CourseCollection", "backbone.subroute"],
 function(app, _, Backbone, SearchView, BookingsView, CoursesView, CourseView, Courses){
    var CoursesRouter = Backbone.SubRoute.extend({
        collection: new Courses(),

        routes: {
            "": "subjects",
            "bookings": "bookings",
            "detail/:id": "course",
            ":query": "courses"
        },

        subjects: function() {
            this.collection.fetch();
            app.renderView(new SearchView({
                collection: this.collection,
            }), {menu: true});
        },

        bookings: function(params) {
            app.showView(new BookingsView({
                params: params
            }));
        },

        courses: function(query, params) {
            app.showView(new CoursesView({
                params: params,
                query: query
            }));
        },

        course: function(id, params) {
            app.showView(new CourseView({
                params: params,
                id: id
            }));
        }

    });

    return CoursesRouter;
});
