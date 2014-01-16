define(['moxie.conf', 'jquery', 'app'], function(conf, $, app) {
    var consoleAvailable = 'console' in window;

    function PushNotifications() {
        function onNotificationGCM(e) {
            switch(e.event) {
                case 'registered':
                    if ( e.regid.length > 0 ) {
                        var ajaxOptions = {
                            type: "POST",
                            data: JSON.stringify({'registration_id': e.regid}),
                            contentType: 'application/json',
                            url: conf.urlFor('push_notification_register_gcm')
                        };
                        $.ajax(ajaxOptions);
                    }
                    break;

                case 'message':
                    if (e.foreground) {
                        // Manually fire the alert as there will
                        // be no notification in the notification bar
                        if (e.payload && e.payload.message) {
                            navigator.notification.alert(e.payload.message);
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


        // iOS
        //
        // handle APNS notifications for iOS
        function onNotificationAPN(e) {
            var pushNotification = window.plugins.pushNotification;
            if (e.badge) {
                pushNotification.setApplicationIconBadgeNumber(successHandler, e.badge);
            }
        }
        window.onNotificationAPN = onNotificationAPN;

        function tokenHandler(result) {
            var ajaxOptions = {
                type: "POST",
                data: JSON.stringify({'device_token': result}),
                contentType: 'application/json',
                url: conf.urlFor('push_notification_register_apns')
            };
            $.ajax(ajaxOptions);
        }

        // result contains any message sent from the plugin call
        function successHandler (result) {
            if (consoleAvailable) {
                console.log("PushPlugin - Success: " + result);
            }
        }

        // result contains any error description text returned from the plugin call
        function errorHandler (error) {
            if (consoleAvailable) {
                console.log("PushPlugin - Error: " + error);
            }
        }

        this.registerAndroid = function() {
            var pushNotification = window.plugins.pushNotification;
            pushNotification.register(successHandler, errorHandler, {"senderID": conf.pushNotifications.android.senderID, "ecb": "onNotificationGCM"});
        };

        this.registeriOS = function() {
            try {
                var pushNotification = window.plugins.pushNotification;
                pushNotification.register(tokenHandler, errorHandler, {"badge":"true","sound":"true","alert":"true","ecb":"onNotificationAPN"});
            } catch (e) {
                if (consoleAvailable) {
                    console.log("PushPlugin - Error Registering: " + e.msg);
                }
            }
        };

    }
    return PushNotifications;
});
