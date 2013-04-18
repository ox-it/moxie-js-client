define(["app", "underscore", "backbone", "contacts/collections/ContactCollection", "contacts/views/SearchView"], function(app, _, Backbone, Contacts, ContactsView){
    var ContactsRouter = Backbone.SubRoute.extend({
        contactsCollection: new Contacts(),
        routes: {'search*': 'search'},
        search: function(params) {
            var query = params || {};
            if (!(_.isEqual(query, this.contactsCollection.query) && (this.contactsCollection.length))) {
                this.contactsCollection.query = query;
                this.contactsCollection.fetch();
            }
            app.renderView(new ContactsView({collection: this.contactsCollection, params: params}), {menu: true});
        }
    });
    return ContactsRouter;
});
