define(["app", "underscore", "backbone", "courses/views/SubjectsView", "courses/views/BookingsView", "courses/views/CoursesView", "courses/views/CourseView", "courses/collections/CourseCollection", "backbone.subroute"],
 function(app, _, Backbone, SubjectsView, BookingsView, CoursesView, CourseView, Courses){
    var CoursesRouter = Backbone.SubRoute.extend({
        collection: new Courses(),

        routes: {
            "": "subjects",
            "bookings": "bookings",
            ":query": "courses",
            "detail/:id": "course"
        },

        subjects: function() {
            this.collection.fetch();
            app.renderView(new SubjectsView({
                collection: this.collection,
            }), {menu: true});
        },

        bookings: function(params) {
            app.showView(new BookingsView({
                params: params
            }));
        },

        courses: function(query) {
            this.collection.fetch(query);
            app.showView(new CoursesView({
                collection: this.collection,
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
