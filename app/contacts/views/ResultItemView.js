define(["backbone", "underscore", "jquery", "app", "hbs!contacts/templates/result-item"], function(Backbone, _, $, app, resultTemplate){
    var ResultItemView = Backbone.View.extend({
        manage: true,
        tagName: "li",
        attributes: {
            "class": "contact-record"
        },
        events: {
            "click .add-contact": "addContact"
        },
        addContact: function(ev) {
            ev.preventDefault();
            // use native cordoba API if available
            // else use data URI to download a vCard
            if ('contacts' in navigator) {
                this.handleContactNative();
            } else {
                this.handleContactDataUri();
            }
            return false;
        },
        onContactSaveSuccess: function() {
            navigator.notification.alert(this.model.attributes.name + " has been added to your address book.", _.bind(this.render, this), "Contact Saved");
        },
        onContactSaveError: function(err) {
            var errorMessage = "An unknown error has occured";
            if (err.code === ContactError.UNKNOWN_ERROR) {
                // Log the error message but pass silently
                //
                // This is because we've seen the UNKNOWN_ERROR occur
                // even when everything seems to have succeeded.
                console.log(errorMessage);
                return;
            } else if (err.code === ContactError.INVALID_ARGUMENT_ERROR) {
                errorMessage = "An unknown error has occured";
            } else if (err.code === ContactError.TIMEOUT_ERROR) {
                errorMessage = "Enable to reach the address book";
            } else if (err.code === ContactError.PENDING_OPERATION_ERROR) {
                errorMessage = "Enable to reach the address book";
            } else if (err.code === ContactError.IO_ERROR) {
                errorMessage = "Enable to reach the address book";
            } else if (err.code === ContactError.NOT_SUPPORTED_ERROR) {
                errorMessage = "Function not supported";
            } else if (err.code === ContactError.PERMISSION_DENIED_ERROR) {
                errorMessage = "Permission denied";
            }
            navigator.notification.alert(errorMessage, _.bind(this.render, this), "Error");
        },
        handleContactNative: function() {
            var contact = navigator.contacts.create({
                displayName: this.model.attributes.name
            });

            var name = new ContactName();
            name.formatted = this.model.attributes.name;

            var names = this.extractName();
            if (names != null) {
                name.familyName = names[0];
                name.givenName = names[1];
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
                // TODO try to update phone number with international prefix (or should it be on API-side?)
                var externalTel = new ContactField();
                externalTel.pref = true;
                externalTel.type = "External";
                externalTel.value = this.model.attributes.external_tel;
                contact.phoneNumbers = [externalTel];
            }
            contact.save(_.bind(this.onContactSaveSuccess, this), _.bind(this.onContactSaveError, this));
        },
        handleContactDataUri: function() {
            var vcard = this.getVcard();
            window.location.href = "data:text/vcard;base64," + btoa(vcard.replace(/\n/g, '\r\n'));
            // will redirect the user - its browser should propose him to download the vcard
        },
        getVcard: function() {
            var vcard = "BEGIN:VCARD\n";

            var names = this.extractName();
            if (names != null) {
                vcard += "N:" + names[0] + ";" + names[1] + ";;;\n";
            }

            vcard += "FN:" + this.model.attributes.name + "\n";

            if (this.model.attributes.email) {
                vcard += "EMAIL;INTERNET:" + this.model.attributes.email + "\n";
            }

            if (this.model.attributes.external_tel) {
                vcard += "TEL;WORK:" + this.model.attributes.external_tel + "\n";
            }

            if (this.model.attributes.unit) {
                vcard += "ORG:" + this.model.attributes.unit + "\n";
            }

            vcard += "END:VCARD";

            return vcard;
        },
        extractName: function() {
            // attempt to get family name and given name out of a string
            // returns an array with last name, first name(s)
            // or null if there was an issue when trying to extract the parts
            var names = [];
            try {
                // TODO try to extract the prefix ("Mr", "Mrs" etc)
                var parts = this.model.attributes.name.split(',');
                names[0] = parts.shift();
                names[1] = parts.join().trim();
                return names;
            } catch(err) {
                console.log(err);
                return null;
            }
        },
        serialize: function() {
            return {
                contact: this.model.toJSON()
            };
        },
        template: resultTemplate
    });
    return ResultItemView;
});
