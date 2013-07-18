define(["app", "underscore", "backbone", "contacts/collections/ContactCollection", "contacts/views/SearchView"], function(app, _, Backbone, Contacts, ContactsView){
    var ContactsRouter = Backbone.SubRoute.extend({
        contactsCollection: new Contacts(),
        routes: {'search*': 'search'},
        search: function(params) {
            var query = params || {};
            this.contactsCollection.query = query;
            if (_.isEmpty(query)) {
                this.contactsCollection.reset([]);
            } else if (!(_.isEqual(query, this.contactsCollection.query) && (this.contactsCollection.length))) {
                this.contactsCollection.fetch();
            }
            app.renderView(new ContactsView({collection: this.contactsCollection, params: params}), {menu: true});
        }
    });
    return ContactsRouter;
});
