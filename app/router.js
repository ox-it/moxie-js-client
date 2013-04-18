define(["app", "underscore", "backbone", "places/router", "today/views/IndexView", "courses/router", "library/router", "contacts/collections/ContactCollection", "contacts/views/SearchView", "favourites/views/FavouritesView"], function(app, _, Backbone, PlacesRouter, IndexView, CoursesRouter, LibraryRouter, Contacts, ContactsView, FavouritesView){
    var MoxieRouter = Backbone.Router.extend({
        contactsCollection: new Contacts(),
        subrouters: {},
        routes: {
            "": "index",
            "favourites/": "favourites",
            "contacts*": "contacts",

            "places/*subroute": "placesModule",
            "courses/*subroute": "coursesModule",
            "library/*subroute": "libraryModule"
        },

        index: function(params) {
            app.renderView(new IndexView({params: params}), {menu: true});
        },

        favourites: function(params) {
            app.renderView(new FavouritesView({params: params}), {menu: true});
        },

        contacts: function(params) {
            var query = params || {};
            if (!(_.isEqual(query, this.contactsCollection.query) && (this.contactsCollection.length))) {
                this.contactsCollection.query = query;
                this.contactsCollection.fetch();
            }
            app.renderView(new ContactsView({collection: this.contactsCollection, params: params}), {menu: true});
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
