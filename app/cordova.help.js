define(['underscore'], function(_) {
    // All our Cordova helper functions in one place.
    //
    var cordova = {
        _isCordova: null,
        isCordova: function() {
            // Cordova will report document.URL with file:// as the scheme
            //
            // Memoize the result since one session cannot (typically) move URL scheme
            if (this._isCordova===null) {
                this._isCordova = document.URL.indexOf( 'http://' ) === -1 && document.URL.indexOf( 'https://' ) === -1;
            }
            return this._isCordova;
        },

        _appReady: false,
        _listeningForAppReady: false,
        _appReadyCallbacks: [],

        appReady: function() {
            // Public API to test if the "deviceready" callback has fired.
            if (!this._appReady && !this._listeningForAppReady) {
                this._listenForAppReady();
                this._listeningForAppReady = true;
            }
            return this._appReady;
        },

        onAppReady: function(cb) {
            // Public API to have a callback exec when the "deviceready" event
            // is triggered. If deviceready has already triggered then we exec
            // the callback synchronously.
            if (this.appReady()) {
                cb();
            } else {
                this._appReadyCallbacks.push(cb);
            }
        },

        _listenForAppReady: function() {
            // Private API which sets a single callback listening for "deviceready"
            $(document).on("deviceready", _.bind(function() {
                this._appReady = true;
                _.invoke(this._appReadyCallbacks, 'call', this) ;
                this._appReadyCallbacks = [];
            }, this));
        },

        isOnline: function() {
            var connectionAvailable = true;
            if (cordova.isCordova()) {
                // If device.ready then we can provide more details about the network
                //
                // NOTE: It's important to test all these attributes before accessing them as we
                //       don't know if device.ready has fired. This seems to cause issues on older
                //       Android devices.
                if (('connection' in navigator) && ('type' in navigator.connection) && ('Connection' in window)) {
                    if(navigator.connection.type === window.Connection.NONE) {
                        connectionAvailable = false;
                    }
                }
            }
            return connectionAvailable;
        },

        whenOnline: function(cb) {
            return $(document).on("online", cb);
        },


    };
    return cordova;
});
