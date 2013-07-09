define(["app", "backbone", "places/router", "today/views/IndexView", "today/collections/TodayItems", "courses/router", "library/router", "contacts/router", "news/router", "favourites/views/FavouritesView"], function(app, Backbone, PlacesRouter, IndexView, TodayItems, CoursesRouter, LibraryRouter, ContactsRouter, NewsRouter, FavouritesView){
    var MoxieRouter = Backbone.Router.extend({
        subrouters: {},
        today: new TodayItems(),

        initialize: function(options) {
            options = options || {};
            this.favourites = options.favourites;
            this.favouriteButtonView = options.favouriteButtonView;
        },

        routes: {
            "": "index",
            "favourites/": "manageFavourites",

            "places/*subroute": "placesModule",
            "courses/*subroute": "coursesModule",
            "library/*subroute": "libraryModule",
            "contacts/*subroute": "contacts",
            "news/*subroute": "news"
        },

        index: function() {
            this.today.fetch();
            app.renderView(new IndexView({collection: this.today}), {menu: true});
        },

        manageFavourites: function(params) {
            app.renderView(new FavouritesView({collection: this.favourites, button: this.favouriteButtonView}), {menu: true});
        },

        contacts: function(params) {
            if (!this.subrouters.Contacts) {
                this.subrouters.Contacts = new ContactsRouter('contacts', {createTrailingSlashRoutes: true});
            }
        },
        news: function(params) {
            if (!this.subrouters.News) {
                this.subrouters.News = new NewsRouter('news', {createTrailingSlashRoutes: true});
            }
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
