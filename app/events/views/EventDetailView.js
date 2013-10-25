define(["backbone", "app", "hbs!events/templates/event"],
    function(Backbone, app, eventTemplate) {
        var EventDetailView = Backbone.View.extend({
            manage: true,
            events: {
                "click #to-cal": "addToCalendar"
            },
            serialize: function() {
                return {
                    event: this.model.toJSON(),
                    nativeApp: app.isCordova()
                };
            },
            template: eventTemplate,
            beforeRender: function() {
                Backbone.trigger('domchange:title', this.model.get('name'));
            },
            addToCalendar: function(ev) {
                ev.preventDefault();

                if ('plugins' in window && 'calendar' in window.plugins) {
                    var startDate = this.model.attributes.start_moment.toDate();
                    var end_moment = this.model.attributes.start_moment.clone();
                    end_moment.add('h', 1);
                    var endDate = end_moment.toDate();
                    var title = this.model.attributes.name;
                    var location = this.model.attributes.location;
                    var notes = this.model.attributes.description;

                    window.plugins.calendar.createEvent(title, location, notes, startDate, endDate,
                        _.bind(this.onAddToCalendarSuccess, this), _.bind(this.onAddToCalendarError, this));
                }
            },
            onAddToCalendarSuccess: function(msg) {
                navigator.notification.alert('"' + this.model.attributes.name + '" has been added to your calendar.',
                    _.bind(this.render, this), "Event saved");
            },
            onAddToCalendarError: function(msg) {
                navigator.notification.alert(msg, _.bind(this.render, this), "Error");
            }
        });
        return EventDetailView;
});