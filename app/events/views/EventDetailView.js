define(["backbone", "underscore", "app/cordova.help", "app/moxie.conf", "hbs!app/events/templates/event"],
    function(Backbone, _, cordova, conf, eventTemplate) {
        var DEFAULT_HOUR_TO_ADD = 1;        // how many hours to add

        var EventDetailView = Backbone.View.extend({
            manage: true,
            events: {
                "click #to-cal": "addToCalendar"
            },
            serialize: function() {
                var event = this.model.toJSON();
                var eventiCal = conf.endpoint + event._links.self.href + ".ics";
                return {
                    event: event,
                    eventiCal: eventiCal
                };
            },
            template: eventTemplate,
            beforeRender: function() {
                Backbone.trigger('domchange:title', this.model.get('name'));
            },
            addToCalendar: function(ev) {
                // Follow the link if we're not a native app
                if (!cordova.isCordova()) {
                    return true;
                }
                ev.preventDefault();

                if ('plugins' in window && 'calendar' in window.plugins) {
                    var startDate = this.model.attributes.start_moment.toDate();
                    var endDate;

                    // if end_date == start_date, the event would be considered by the
                    // plugin as a day event... which doesn't seem accurate, just adding
                    // one hour to the start date for now...
                    if (this.model.attributes.start_moment.isSame(this.model.attributes.ends_moment)) {
                        var end_moment = this.model.attributes.start_moment.clone();
                        end_moment.add('h', DEFAULT_HOUR_TO_ADD);
                        endDate = end_moment.toDate();
                    } else {
                        endDate = this.model.attributes.ends_moment.toDate();
                    }

                    var title = this.model.attributes.name;
                    var location = this.model.attributes.location;
                    var notes = this.model.attributes.description;

                    // Android is using Intent to redirect to the Calendar app
                    // so there is no need to display an actual message
                    var cbSuccess;
                    if ((window.device) && (window.device.platform==='Android')) {
                        cbSuccess = function() { /* no action */ };
                    } else {
                        cbSuccess = _.bind(this.onAddToCalendarSuccess, this);
                    }

                    window.plugins.calendar.createEvent(title, location, notes, startDate, endDate,
                        cbSuccess, _.bind(this.onAddToCalendarError, this));
                }
                return false;
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
