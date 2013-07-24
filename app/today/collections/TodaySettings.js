define(["backbone", "underscore", "localstorage"],
    function(Backbone, _) {
        var defaultSettings = [
            {name: 'OxfordDate', label: "Oxford term date", enabled: true},
            {name: 'Weather', label: "Weather", enabled: true},
            {name: 'RiverStatus', label: "River safety flags", enabled: true},
            {name: 'Events', label: "Today's upcoming events", enabled: true},
            {name: 'NearbyRTI', label: "<strong>Nearby</strong> transport information", enabled: true},
            {name: 'FavRTI', label: "<strong>My favourite</strong> transport information", enabled: true},
            {name: 'ParkAndRide', label: "Park &amp; Ride live capacity information", enabled: true},
            {name: 'Webcam', label: "Webcam", enabled: true},
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
