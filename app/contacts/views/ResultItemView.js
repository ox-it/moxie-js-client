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
                var contactEl = ev.target.parentElement.parentElement;
                var contactName = $(contactEl).find('.contact-name').text();
                var contactEmail = $(contactEl).find('.contact-info .contact-email').text();
                var contactExternalTel = $(contactEl).find('.contact-info .contact-external-tel a').text();
                var contactInternalTel = $(contactEl).find('.contact-info .contact-internal-tel a').text();
                var contactUnit = $(contactEl).find('.contact-info .contact-unit').text();
                var contact = navigator.contacts.create({
                    displayName: contactName,
                });
                var email = new ContactField();
                email.pref = true;
                email.type = "Work";
                email.value = contactEmail;
                contact.emails = [email];
                var name = new ContactName();
                name.formatted = contactName;
                var organization = new ContactOrganization();
                organization.pref = true;
                organization.type = "Work";
                organization.name = contactUnit;
                contact.organizations = [organization];
                var externalTel = new ContactField();
                externalTel.pref = true;
                externalTel.type = "External";
                externalTel.value = contactExternalTel;
                var internalTel = new ContactField();
                internalTel.pref = false;
                internalTel.type = "Internal";
                internalTel.value = contactInternalTel;
                contact.phoneNumbers = [externalTel, internalTel],
                contact.save();
                navigator.notification.alert(contactName+" has been added to your address book.", _.bind(this.render, this), "Contact Saved");
            }
            return false;
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
