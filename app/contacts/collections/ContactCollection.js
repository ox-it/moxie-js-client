define(["core/collections/MoxieCollection", "contacts/models/ContactModel", "moxie.conf"], function(MoxieCollection, Contact, conf) {

    var Contacts = MoxieCollection.extend({

        model: Contact,

        initialize: function(query) {
            this.query = query || {};
        },

        parse: function(data) {
            return data.persons;
        },

        url: function() {
            var qstring = $.param(this.query);
            var searchPath = conf.pathFor('contact_search');
            if (qstring) {
                searchPath += ('?' + qstring);
            }
            return conf.endpoint + searchPath.replace(/\+/g, "%20");
        }

    });

    return Contacts;

});
