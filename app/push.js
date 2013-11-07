define(['moxie.conf', 'jquery'], function(conf, $) {
    var consoleAvailable = 'console' in window;

    function PushNotifications() {
        function onNotificationGCM(e) {
            switch(e.event) {
                case 'registered':
                    if ( e.regid.length > 0 ) {
                        var ajaxOptions = {
                            data: {'registration_id': e.regid},
                            dataType: 'json',
                            url: conf.urlFor('push_notification_register_gcm')
                        };
                        $.ajax(ajaxOptions);
                    }
                    break;

                case 'message':
                    if (e.foreground) {
                        if (e.payload && e.payload.message) {
                            navigator.notification.alert(e.payload.message);
                        }
                        if (consoleAvailable) {
                            console.log("Foreground");
                        }
                    }
                    else {
                        if (e.coldstart) {
                            if (consoleAvailable) {
                                console.log("Cold Start");
                            }
                        } else {
                            if (e.payload && e.payload.message) {
                                navigator.notification.alert(e.payload.message);
                            }
                            if (consoleAvailable) {
                                console.log("Background");
                            }
                        }
                    }
                    break;

                case 'error':
                    if (consoleAvailable) {
                        console.log("Error from GCM:" + e.msg);
                    }
                    break;

                default:
                    if (consoleAvailable) {
                        console.log("Unknown event");
                    }
                    break;
            }
        }
        window.onNotificationGCM = onNotificationGCM;
        // result contains any message sent from the plugin call
        function successHandler (result) {
            if (consoleAvailable) {
                console.log("GCM - Success: " + result);
            }
        }
        // result contains any error description text returned from the plugin call
        function errorHandler (error) {
            if (consoleAvailable) {
                console.log("GCM - Error: " + error);
            }
        }
        this.registerAndroid = function() {
            var pushNotification = window.plugins.pushNotification;
            pushNotification.register(successHandler, errorHandler, {"senderID": conf.pushNotifications.android.senderID, "ecb": "onNotificationGCM"});
        };

    }
    return PushNotifications;
});
