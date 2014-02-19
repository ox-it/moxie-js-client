define(["app", "cordova.help", "backbone", "places/router", "today/views/IndexView", "today/collections/TodayItems", "courses/router", "library/router", "contacts/router", "news/router", "events/router", "feedback/router", "notifications/router", "favourites/views/FavouritesEditButtonView", "favourites/views/FavouritesView", "today/views/EditTodayButton", "today/views/SaveTodayButton", "today/views/EditTodayView", "security/router"],
    function(app, cordova, Backbone, PlacesRouter, IndexView, TodayItems, CoursesRouter, LibraryRouter, ContactsRouter, NewsRouter, EventsRouter, FeedbackRouter, NotificationsRouter, FavouritesEditButtonView, FavouritesView, EditTodayButton, SaveTodayButton, EditTodayView, SecurityRouter){
    var MoxieRouter = Backbone.Router.extend({
        subrouters: {},

        initialize: function(options) {
            // Pass favourites to the TodayItems to personalise the Today View
            // from the user Favourites. First arg here is empty array of models
            this.today = new TodayItems([], {favourites: app.favourites, settings: app.todaySettings});
        },

        routes: {
            "": "index",
            "today/edit": "editTodayView",
            "favourites/": "manageFavourites",

            "places/*subroute": "placesModule",
            "courses/*subroute": "coursesModule",
            "library/*subroute": "libraryModule",
            "contacts/*subroute": "contacts",
            "news/*subroute": "news",
            "events/*subroute": "events",
            "security/*subroute": "security",
            "feedback/*subroute": "feedback",
            "notifications/*subroute": "notifications"
        },

        index: function() {
            if (cordova.isOnline()) {
                this.today.fetch();
            }
            var editTodayButton = new EditTodayButton();
            app.renderView(new IndexView({collection: this.today}), {menu: true, contextButtonView: editTodayButton});
        },

        editTodayView: function(params) {
            var saveTodayButton = new SaveTodayButton();
            var editTodayView = new EditTodayView({collection: this.today, button: saveTodayButton});
            app.renderView(editTodayView, {menu: true, contextButtonView: saveTodayButton});
        },

        manageFavourites: function(params) {
            var favouritesEditButtonView = new FavouritesEditButtonView({disabled: app.favourites.isEmpty()});
            var favouritesView = new FavouritesView({collection: app.favourites, button: favouritesEditButtonView});
            app.renderView(favouritesView, {menu: true, contextButtonView: favouritesEditButtonView});
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
        events: function(params) {
            if (!this.subrouters.Events) {
                this.subrouters.Events = new EventsRouter('events', {createTrailingSlashRoutes: true});
            }
        },
        security: function(params) {
            if (!this.subrouters.Security) {
                this.subrouters.Security = new SecurityRouter('security', {createTrailingSlashRoutes: true});
            }
        },
        feedback: function(params) {
            if (!this.subrouters.Feedback) {
                this.subrouters.Feedback = new FeedbackRouter('feedback', {createTrailingSlashRoutes: true});
            }
        },
        notifications: function(params) {
            if (!this.subrouters.Notifications) {
                this.subrouters.Notifications = new NotificationsRouter('notifications', {createTrailingSlashRoutes: true});
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
