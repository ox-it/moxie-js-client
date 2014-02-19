define(['underscore'], function(_) {
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
        appReady: function() {
            return this._appReady;
        },

        _appReadyCallbacks: [],

        _listenForAppReady: function() {
            $(document).on("deviceready", _.bind(function() {
                console.log("device ready!");
                console.log("calling callbacks");
                console.log(this._appReadyCallbacks);
                console.log(this._appReadyCallbacks.length);
                _.invoke(this._appReadyCallbacks, 'call', this) ;
                this._appReadyCallbacks = [];
            }, this));
        },

        _listeningForAppReady: false,
        onAppReady: function(cb) {
            if (this.appReady()) {
                cb();
            }
            else {
                this._appReadyCallbacks.push(cb);
                if (!this._listeningForAppReady) {
                    this._listenForAppReady();
                    this._listeningForAppReady = true;
                }
            }
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
