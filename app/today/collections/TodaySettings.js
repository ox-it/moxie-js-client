define(["backbone", "underscore", "localstorage"],
    function(Backbone, _) {
        var defaultSettings = [
            {name: 'OxfordDate', label: "Show the current Oxford term date", enabled: true},
            {name: 'Weather', label: "Show the current weather observation and forecast for Oxford", enabled: true},
            {name: 'Webcam', label: "Show a live image from a webcam in Oxford", enabled: true},
            {name: 'NearbyRTI', label: "Show live departure information for a nearby transport link", enabled: true},
            {name: 'Events', label: "Show today's upcoming events in Oxford", enabled: true},
            {name: 'ParkAndRide', label: "Show the live capacity information for the Park and Rides", enabled: true},
            {name: 'FavRTI', label: "Show the live departure information for your favourite transport links", enabled: true},
        ];
        var TodaySettings = Backbone.Collection.extend({
            initialize: function() {
                try {
                    // Possible error thrown when loading without localStorage available
                    this.localStorage = new Backbone.LocalStorage("TodaySettings");
                    this.fetch();
                } catch (e) {
                    if ('console' in window) {
                        console.log("Error accessing localStorage");
                        console.log(e);
                    }
                }
            },
            parse: function(data) {
                console.log(data);
                _.each(data, function(userSetting) {
                    if ('name' in userSetting && 'enabled' in userSetting) {
                        var setting = _.findWhere(defaultSettings, {name: userSetting.name});
                        if (setting) {
                            setting.enabled = userSetting.enabled;
                        }
                    }
                });
                return defaultSettings;
            },
            enabled: function(settingName) {
                return this.get(settingName).get('enabled');
            },
            model: Backbone.Model.extend({idAttribute: 'name'}),
            fetch: function() {
                if ('localStorage' in this) {
                    Backbone.Collection.prototype.fetch.apply(this, arguments);
                }
                return this;
            }
        });
        return TodaySettings;
    }

);
