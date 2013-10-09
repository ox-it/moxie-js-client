define(["backbone", "underscore", "jquery", "app", "hbs!contacts/templates/result-item"], function(Backbone, _, $, app, resultTemplate){
    var ResultItemView = Backbone.View.extend({
        manage: true,
        tagName: "li",
        events: {
            "click .add-contact": "addContact"
        },
        addContact: function(ev) {
            ev.preventDefault();
            if ('contacts' in navigator) {
                var contact = navigator.contacts.create({
                    displayName: this.model.attributes.name
                });

                var name = new ContactName();
                name.formatted = this.model.attributes.name;

                try {
                    var parts = this.model.attributes.name.split(',');
                    name.familyName = parts.shift();
                    name.givenName = parts.join().trim();
                } catch(err) {
                    console.log(err);
                }

                contact.name = name;

                if (this.model.attributes.unit) {
                    var organization = new ContactOrganization();
                    organization.pref = true;
                    organization.type = "Work";
                    organization.name = this.model.attributes.unit;
                    contact.organizations = [organization];
                }

                if (this.model.attributes.email) {
                    var email = new ContactField();
                    email.pref = true;
                    email.type = "Work";
                    email.value = this.model.attributes.email;
                    contact.emails = [email];
                }

                if (this.model.attributes.external_tel) {
                    var externalTel = new ContactField();
                    externalTel.pref = true;
                    externalTel.type = "External";
                    externalTel.value = this.model.attributes.external_tel;
                    contact.phoneNumbers = [externalTel];
                }
                contact.save(_.bind(this.onContactSaveSuccess, this), _.bind(this.onContactSaveError, this));
            }
            return false;
        },
        onContactSaveSuccess: function() {
            navigator.notification.alert(this.model.attributes.name + " has been added to your address book.", _.bind(this.render, this), "Contact Saved");
        },
        onContactSaveError: function(err) {
            navigator.notification.alert("An error has occured " + err.code, _.bind(this.render, this), "Error");
        },
        serialize: function() {
            return {
                contact: this.model.toJSON(),
                nativeApp: app.isCordova()
            };
        },
        template: resultTemplate
    });
    return ResultItemView;
});
