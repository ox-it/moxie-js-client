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

    };
    return cordova;
});
