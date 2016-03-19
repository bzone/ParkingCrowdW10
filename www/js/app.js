(function () {
    'use strict';
    var module = angular.module('app', ['onsen']);
    var url = "http://parkingcrowd.dev.thickmug.com";
    var currentApiKey;


    module.controller('AppController', function ($scope, $projekty, $filter) {
        $scope.currentPage = "Home";


        $scope.isCheckedById = function (id) {
            var checked = $("input[id=" + id + "]:checked").length;

            if (checked == 0) {
                return false;
            } else {
                return true;
            }
        }

        //NOTE: Logowanie uzytkownika
        $scope.loginUser = function () {
            var user_email = $("#loginEmail").val();
            var user_password = $("#loginPassword").val();
            if ($.trim(user_email).length > 0 & $.trim(user_password).length > 0) {
                $.ajax({
                    type: "POST",
                    url: url + '/api/v1/security/get-api-key',
                    beforeSend: function () {
                        $("#spinner").css('display', 'block');
                    },
                    data: {
                        username: user_email,
                        password: user_password
                    },
                    datatype: 'json',
                    cache: false,
                    success: function (respond) {
                        window.console && console.log(respond);
                        if (respond.status == "success") {
                            currentApiKey = respond.data.api_key;
                            $scope.user = angular.fromJson(respond.data);
                            $("#spinner").fadeOut(1000);
                            navi.pushPage('home.html', {
                                animation: 'slide'
                            });
                        }
                    },
                    error: function (respond) {
                        $("#spinner").fadeOut(1000);
                        ons.notification.alert({
                            message: 'Podane dane są niepoprawne'
                        });
                    }
                });
            } else {
                ons.notification.alert({
                    message: 'Podaj e-mail i hasło'
                });
            }
        }

        //NOTE: Reset hasła
        $scope.recoverPassword = function () {
            var user_name = $("#recoverUser").val();
            var user_email = $("#recoverEmail").val();
            if ($.trim(user_email).length > 0 & $.trim(user_name).length > 0) {
                $.ajax({
                    type: "POST",
                    url: url + '/api/v1/registration/password-reset',
                    beforeSend: function () {
                        $("#spinner").css('display', 'block');
                    },
                    data: {
                        username: user_name,
                        email: user_email
                    },
                    datatype: 'json',
                    cache: false,
                    success: function (respond) {
                        window.console && console.log(respond);
                        if (respond.status == "success") {
                            $("#spinner").fadeOut(1000);
                            ons.notification.alert({
                                message: 'Twoje hasło zostało wysłane na podany adres e-mail'
                            });
                            navi.popPage();
                        } else if (respond.status == "error") {
                            $("#spinner").fadeOut(1000);
                            ons.notification.alert({
                                message: 'Podane dane są niepoprawne'
                            });
                        }
                    },
                    error: function (respond) {
                        $("#spinner").fadeOut(1000);
                        ons.notification.alert({
                            message: 'Podane dane są niepoprawne'
                        });
                    }
                });
            } else {
                ons.notification.alert({
                    message: 'Podaj e-mail i nazwę uzytkownika'
                });
            }
        }

        //NOTE: Rejestracja uzytkownika
        $scope.registerUser = function () {
            var user_email = $("#newUserEmail").val();
            var user_name = $("#newUserName").val();
            var user_password = $("#newUserPassword").val();

            function validateEmail(email) {
                var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                return re.test(email);
            }

            if (!validateEmail(user_email)) {
                ons.notification.alert({
                    message: 'Podany adres e-mail jest niepoprawny'
                });
            } else {
                $.ajax({
                    type: "POST",
                    url: url + '/api/v1/registration/register',
                    beforeSend: function () {
                        $("#spinner").css('display', 'block');
                    },
                    data: {
                        email: user_email,
                        username: user_name,
                        password: user_password
                    },
                    datatype: 'json',
                    cache: false,
                    success: function (respond) {
                        window.console && console.log(respond);
                        if (respond.status == "exists") {
                            ons.notification.alert({
                                message: 'Hey! Już masz konto! możesz się zalogować'
                            });
                            $("#spinner").fadeOut(1000);
                            navi.popPage();
                        } else if (respond.status == "success") {
                            currentApiKey = respond.data.api_key;
                            $scope.user = angular.fromJson(respond.data);
                            $("#spinner").fadeOut(1000);
                            navi.pushPage('home.html', {
                                animation: 'slide'
                            });
                        }
                    }
                });
            }
        }

        //NOTE: Wylogowywanie
        $scope.logOut = function () {
            $.ajax({
                type: "POST",
                url: url + '/api/v1/security/logout',
                beforeSend: function () {
                    $("#spinner").css('display', 'block');
                },
                headers: {
                    "api-key": currentApiKey
                },
                datatype: 'json',
                cache: false,
                success: function (respond) {
                    $("#spinner").fadeOut(1000);
                    menu.closeMenu();
                    navi.popPage();
                },
                error: function (respond) {
                    window.console && console.log('error ' + JSON.stringify(respond));
                    $("#spinner").fadeOut(1000);
                }
            });
        }


        //NOTE: Otwieranie ekranu ustawień
        $scope.openSettings = function () {
            menu.closeMenu();
            if ($scope.currentPage != 'Settings') {
                $scope.currentPage = 'Settings'
                naviDash.replacePage('settings.html');
            }
        }

        //NOTE: Zmiana avatara
        $scope.changeAvatar = function () {
            function convertToDataURLviaCanvas(url, callback, outputFormat) {
                var img = new Image();
                img.crossOrigin = 'Anonymous';
                img.onload = function () {
                    var canvas = document.createElement('CANVAS');
                    var ctx = canvas.getContext('2d');
                    var dataURL;
                    canvas.height = this.height * 0.1;
                    canvas.width = this.width * 0.1;
                    ctx.translate(canvas.width / 2, canvas.height / 2);
                    ctx.rotate(90 * Math.PI / 180);
                    ctx.translate(-canvas.width / 2, -canvas.height / 2);
                    ctx.drawImage(this, 0, 0, canvas.width, canvas.height);
                    dataURL = canvas.toDataURL(outputFormat);
                    callback(dataURL);
                    canvas = null;
                };
                img.src = url;
            }

            function getLengthInBytes(str) {
                var b = str.match(/[^\x00-\xff]/g);
                return (str.length + (!b ? 0 : b.length));
            }

            function captureSuccess(mediaFiles) {
                var i, len;
                for (i = 0, len = mediaFiles.length; i < len; i += 1) {
                    var avatrUzytkownika = mediaFiles[i].fullPath;
                    convertToDataURLviaCanvas(avatrUzytkownika, function (base64Img) {
                        avatrUzytkownika = base64Img;
                        window.console && console.log('Nowy awatar pobrany');
                        $('#avatarPreview').css('background-image', 'url(' + base64Img + ')');
                        $scope.user.new_avatar = base64Img.split(',')[1];
                        $scope.user.new_avatar_size = getLengthInBytes($scope.user.new_avatar);
                        window.console && console.log($scope.user.new_avatar_size);
                        console.log($scope.user.new_avatar);
                    });
                }
            }

            navigator.device.capture.captureImage(captureSuccess, console.log("capture"), {
                limit: 1
            });
        }


        //NOTE: Zapisywanie zmian w profilu użytkownika
        $scope.saveSettings = function () {
            var passwordOK = true;
            var sendData = false;

            var settings = {
                places: [
                    {
                        prop_guarded: $scope.isCheckedById('prop0')
                    },
                    {
                        prop_monitored: $scope.isCheckedById('prop1')
                    },
                    {
                        prop_bus: $scope.isCheckedById('prop2')
                    },
                    {
                        prop_covered: $scope.isCheckedById('prop3')
                    }
                ]
            }


            if ($scope.user.new_avatar) {
                sendData = true;
                var dataToSend = {
                    first_name: $scope.user.first_name,
                    last_name: $scope.user.last_name,
                    username: $scope.user.username,
                    email: $scope.user.email,
                    about: $scope.user.about,
                    phone_number: $scope.user.phone_number,
                    facebook_id: $scope.user.facebook_id,
                    twitter_id: $scope.user.twitter_id,
                    settings: JSON.stringify(settings),
                    image: JSON.stringify({
                        'sizeInBytes': $scope.user.new_avatar_size,
                        'mimeType': 'image/png',
                        'name': 'avatar',
                        'data': $scope.user.new_avatar
                    })
                }
            } else {
                sendData = true;
                var dataToSend = {
                    first_name: $scope.user.first_name,
                    last_name: $scope.user.last_name,
                    username: $scope.user.username,
                    email: $scope.user.email,
                    about: $scope.user.about,
                    phone_number: $scope.user.phone_number,
                    facebook_id: $scope.user.facebook_id,
                    twitter_id: $scope.user.twitter_id,
                    settings: JSON.stringify(settings)
                }
            }

            if (sendData) {
                $.ajax({
                    type: "POST",
                    url: url + '/api/v1/user/update-profile',
                    beforeSend: function () {
                        $("#spinner").css('display', 'block');
                    },
                    data: dataToSend,
                    headers: {
                        "api-key": currentApiKey
                    },
                    datatype: 'json',
                    cache: false,
                    success: function (respond) {
                        window.console && console.log(respond);
                        if (respond.status == "success") {
                            window.console && console.log('Zaktualizowano dane użytkownika');
                            $("#spinner").fadeOut(1000);
                            $scope.user.settings.places[0].prop_guarded = $scope.isCheckedById('prop0');
                            $scope.user.settings.places[1].prop_monitored = $scope.isCheckedById('prop1');
                            $scope.user.settings.places[2].prop_bus = $scope.isCheckedById('prop2');
                            $scope.user.settings.places[3].prop_covered = $scope.isCheckedById('prop3');

                            ons.notification.alert({
                                message: 'Twoje dane zostały zaktualizowane'
                            });
                        } else if (respond.status == "error") {
                            window.console && console.log('error ' + respond.data);
                            $("#spinner").fadeOut(1000);
                            ons.notification.alert({
                                message: 'Podane dane są niepoprawne'
                            });
                        }
                    },
                    error: function (respond) {
                        window.console && console.log('error ' + JSON.stringify(respond));
                        $("#spinner").fadeOut(1000);
                        ons.notification.alert({
                            message: 'Podane dane są niepoprawne'
                        });
                    }
                });
            }
        }


        //NOTE: Otwieranie notyfikacji
        $scope.openNotifications = function () {
            menu.closeMenu();
            $scope.currentPage = 'Notifications';
            $.ajax({
                type: "GET",
                url: url + '/api/v1/notification/read',
                beforeSend: function () {
                    $("#spinner").css('display', 'block');
                },
                data: {
                    only_unread: 1
                },
                headers: {
                    "api-key": currentApiKey
                },
                datatype: 'json',
                cache: false,
                success: function (respond) {
                    window.console && console.log(respond);
                    if (respond.status == "success") {
                        window.console && console.log('Pobrano listę notyfikacji');
                        $scope.notifications = angular.fromJson(respond.data);
                        naviDash.pushPage('notifications.html');
                        $("#spinner").fadeOut(1000);

                    } else if (respond.status == "error") {
                        window.console && console.log('error ' + respond.data);
                        $("#spinner").fadeOut(1000);
                        ons.notification.alert({
                            message: 'Błąd pobierania danych'
                        });
                    }
                },
                error: function (respond) {
                    window.console && console.log('error ' + JSON.stringify(respond));
                    $("#spinner").fadeOut(1000);
                    ons.notification.alert({
                        message: 'Podane dane są niepoprawne'
                    });
                }
            });
        }


        //NOTE: Otwieranie miejsca
        $scope.showPlace = function (id) {
            menu.closeMenu();
            $scope.currentPage = 'Place';
            $.ajax({
                type: "GET",
                url: url + '/api/v1/offers/places/' + id,
                beforeSend: function () {
                    $("#spinner").css('display', 'block');
                },
                data: {},
                headers: {
                    "api-key": currentApiKey
                },
                datatype: 'json',
                cache: false,
                success: function (respond) {
                    window.console && console.log(respond);
                    if (respond.status == "success") {
                        window.console && console.log('Pobrano listę notyfikacji');
                        $scope.currentPlace = angular.fromJson(respond.data);
                        $scope.currentPlace.view = 'map';
                        $scope.currentPlace.now = new Date();
                        var d2 = new Date($scope.currentPlace.now);
                        d2.setHours(d2.getHours() + 12);
                        $scope.currentPlace.later = d2;
                        naviDash.pushPage('place.html');
                        $("#spinner").fadeOut(1000);

                    } else if (respond.status == "error") {
                        window.console && console.log('error ' + respond.data);
                        $("#spinner").fadeOut(1000);
                        ons.notification.alert({
                            message: 'Błąd pobierania danych'
                        });
                    }
                },
                error: function (respond) {
                    window.console && console.log('error ' + JSON.stringify(respond));
                    $("#spinner").fadeOut(1000);
                    ons.notification.alert({
                        message: 'Podane dane są niepoprawne'
                    });
                }
            });
        }

        $scope.showCar = function (id) {
            menu.closeMenu();
            $scope.currentPage = 'Car';
            $.ajax({
                type: "GET",
                url: url + '/api/v1/offers/cars/' + id,
                beforeSend: function () {
                    $("#spinner").css('display', 'block');
                },
                data: {},
                headers: {
                    "api-key": currentApiKey
                },
                datatype: 'json',
                cache: false,
                success: function (respond) {
                    window.console && console.log(respond);
                    if (respond.status == "success") {
                        window.console && console.log('Pobrano listę notyfikacji');
                        $scope.currentPlace = angular.fromJson(respond.data);
                        $scope.currentPlace.view = 'map';
                        $scope.currentPlace.now = new Date();
                        var d2 = new Date($scope.currentPlace.nows);
                        d2.setHours(d2.getHours() + 12);
                        $scope.currentPlace.later = d2;
                        naviDash.pushPage('car.html');
                        $("#spinner").fadeOut(1000);

                    } else if (respond.status == "error") {
                        window.console && console.log('error ' + respond.data);
                        $("#spinner").fadeOut(1000);
                        ons.notification.alert({
                            message: 'Błąd pobierania danych'
                        });
                    }
                },
                error: function (respond) {
                    window.console && console.log('error ' + JSON.stringify(respond));
                    $("#spinner").fadeOut(1000);
                    ons.notification.alert({
                        message: 'Podane dane są niepoprawne'
                    });
                }
            });
        }

        $scope.changeToPhotos = function () {
            $scope.currentPlace.view = 'photos';
        }

        $scope.changeToMap = function () {
            $scope.currentPlace.view = 'map';
        }

        $scope.addPlaceToFav = function (id) {
            $.ajax({
                type: "POST",
                url: url + '/api/v1/user/favourites/create',
                beforeSend: function () {
                    $("#spinner").css('display', 'block');
                },
                data: {
                    offer_place_id: id
                },
                headers: {
                    "api-key": currentApiKey
                },
                datatype: 'json',
                cache: false,
                success: function (respond) {
                    window.console && console.log(respond);
                    $("#spinner").fadeOut(1000);
                    if (respond.status == "success") {
                        window.console && console.log('Zaktualizowano listę ulubionych');
                        $scope.currentPlace.favourite = true;
                        $scope.$apply();
                    } else if (respond.status == "error") {
                        window.console && console.log('error ' + respond.data);
                    }
                },
                error: function (respond) {
                    $("#spinner").fadeOut(1000);
                    window.console && console.log('error ' + JSON.stringify(respond));
                }
            });
        }

        $scope.removePlaceFromFav = function (id) {
            $.ajax({
                type: "POST",
                url: url + '/api/v1/user/favourites/destroy',
                beforeSend: function () {
                    $("#spinner").css('display', 'block');
                },
                data: {
                    offer_place_id: id
                },
                headers: {
                    "api-key": currentApiKey
                },
                datatype: 'json',
                cache: false,
                success: function (respond) {
                    window.console && console.log(respond);
                    $("#spinner").fadeOut(1000);
                    if (respond.status == "success") {
                        window.console && console.log('Zaktualizowano listę ulubionych');
                        $scope.currentPlace.favourite = false;
                        $scope.$apply();
                    } else if (respond.status == "error") {
                        window.console && console.log('error ' + respond.data);
                    }
                },
                error: function (respond) {
                    $("#spinner").fadeOut(1000);
                    window.console && console.log('error ' + JSON.stringify(respond));
                }
            });
        }

        $scope.addCarToFav = function (id) {
            $.ajax({
                type: "POST",
                url: url + '/api/v1/user/favourites/create',
                beforeSend: function () {
                    $("#spinner").css('display', 'block');
                },
                data: {
                    offer_car_id: id
                },
                headers: {
                    "api-key": currentApiKey
                },
                datatype: 'json',
                cache: false,
                success: function (respond) {
                    window.console && console.log(respond);
                    $("#spinner").fadeOut(1000);
                    if (respond.status == "success") {
                        window.console && console.log('Zaktualizowano listę ulubionych');
                        $scope.currentPlace.favourite = true;
                        $scope.$apply();
                    } else if (respond.status == "error") {
                        window.console && console.log('error ' + respond.data);
                    }
                },
                error: function (respond) {
                    $("#spinner").fadeOut(1000);
                    window.console && console.log('error ' + JSON.stringify(respond));
                }
            });
        }

        $scope.removeCarFromFav = function (id) {
            $.ajax({
                type: "POST",
                url: url + '/api/v1/user/favourites/destroy',
                beforeSend: function () {
                    $("#spinner").css('display', 'block');
                },
                data: {
                    offer_car_id: id
                },
                headers: {
                    "api-key": currentApiKey
                },
                datatype: 'json',
                cache: false,
                success: function (respond) {
                    window.console && console.log(respond);
                    $("#spinner").fadeOut(1000);
                    if (respond.status == "success") {
                        window.console && console.log('Zaktualizowano listę ulubionych');
                        $scope.currentPlace.favourite = false;
                        $scope.$apply();
                    } else if (respond.status == "error") {
                        window.console && console.log('error ' + respond.data);
                    }
                },
                error: function (respond) {
                    $("#spinner").fadeOut(1000);
                    window.console && console.log('error ' + JSON.stringify(respond));
                }
            });
        }


        //NOTE: Aktualizacja lokalizacji
        $scope.updateLocation = function () {
            var onSuccess = function (position) {
                var currentLocationLat = position.coords.latitude;
                var currentLocationLong = position.coords.longitude;

                $.ajax({
                    type: "POST",
                    url: url + '/api/v1/user/update-location',
                    beforeSend: function () {},
                    data: {
                        latitude: currentLocationLat,
                        longitude: currentLocationLong
                    },
                    headers: {
                        "api-key": currentApiKey
                    },
                    datatype: 'json',
                    cache: false,
                    success: function (respond) {
                        window.console && console.log(respond);
                        if (respond.status == "success") {
                            window.console && console.log('Zaktualizowano lokalizacje');
                        } else if (respond.status == "error") {
                            window.console && console.log('error ' + respond.data);
                        }
                    },
                    error: function (respond) {
                        window.console && console.log('error ' + JSON.stringify(respond));
                    }
                });
            };

            var options = {};

            navigator.geolocation.getCurrentPosition(onSuccess, null, options);
        }

        //NOTE: Otwieranie ekranu głównego
        $scope.openHome = function () {
            menu.closeMenu();
            if ($scope.currentPage != 'Home') {
                $scope.currentPage = 'Home';
                naviDash.replacePage('homedash.html');
            }
        }


        //NOTE: Otwieranie ekranu ulubionych
        $scope.openFavs = function () {
            menu.closeMenu();
            if ($scope.currentPage != 'Favs') {
                $scope.currentPage = 'Favs';

                $.ajax({
                    type: "GET",
                    url: url + '/api/v1/user/favourites',
                    beforeSend: function () {
                        $("#spinner").css('display', 'block');
                    },
                    data: {
                        type: 0
                    },
                    headers: {
                        "api-key": currentApiKey
                    },
                    datatype: 'json',
                    cache: false,
                    success: function (respond) {
                        window.console && console.log(respond);
                        if (respond.status == "success") {
                            window.console && console.log('Pobrano liste ulubionych');
                            $scope.favsList = angular.fromJson(respond.data);
                            $scope.favView = 'parking';
                            $scope.$apply();
                            naviDash.replacePage('favs.html');
                            $("#spinner").fadeOut(1000);

                        } else if (respond.status == "error") {
                            window.console && console.log('error ' + respond.data);
                            $("#spinner").fadeOut(1000);
                            ons.notification.alert({
                                message: 'Błąd pobierania danych'
                            });
                        }
                    },
                    error: function (respond) {
                        window.console && console.log('error ' + JSON.stringify(respond));
                        $("#spinner").fadeOut(1000);
                        ons.notification.alert({
                            message: 'Podane dane są niepoprawne'
                        });
                    }
                });


            }
        }

        $scope.changeToParking = function () {
            $scope.favView = 'parking';
        }

        $scope.changeToCars = function () {
            $scope.favView = 'cars';
        }

        //NOTE: Otwieranie ekranu portfela
        $scope.openWallet = function () {
            menu.closeMenu();
            if ($scope.currentPage != 'Wallet') {
                $scope.currentPage = 'Wallet';

                $.ajax({
                    type: "GET",
                    url: url + '/api/v1/user/balance',
                    beforeSend: function () {
                        $("#spinner").css('display', 'block');
                    },
                    data: {
                        limit: 1000
                    },
                    headers: {
                        "api-key": currentApiKey
                    },
                    datatype: 'json',
                    cache: false,
                    success: function (respond) {
                        window.console && console.log(respond);
                        if (respond.status == "success") {
                            window.console && console.log('Pobrano ststystyki portfela');
                            $scope.walletList = angular.fromJson(respond.data);
                            $scope.walletView = 'summary';
                            $scope.$apply();
                            naviDash.replacePage('wallet.html');
                            $("#spinner").fadeOut(1000);

                        } else if (respond.status == "error") {
                            window.console && console.log('error ' + respond.data);
                            $("#spinner").fadeOut(1000);
                            ons.notification.alert({
                                message: 'Błąd pobierania danych'
                            });
                        }
                    },
                    error: function (respond) {
                        window.console && console.log('error ' + JSON.stringify(respond));
                        $("#spinner").fadeOut(1000);
                        ons.notification.alert({
                            message: 'Podane dane są niepoprawne'
                        });
                    }
                });


            }
        }

        $scope.changeToSummary = function () {
            $scope.walletView = 'summary';
        }

        $scope.changeToHistory = function () {
            $scope.walletView = 'history';
        }



        //NOTE: Otwieranie ekranu historii najmu
        $scope.openHistory = function () {
            menu.closeMenu();
            if ($scope.currentPage != 'History') {
                $scope.currentPage = 'History';

                $.ajax({
                    type: "GET",
                    url: url + '/api/v1/user/reservations',
                    beforeSend: function () {
                        $("#spinner").css('display', 'block');
                    },
                    data: {
                        limit: 1000,
                        canceled: 1
                    },
                    headers: {
                        "api-key": currentApiKey
                    },
                    datatype: 'json',
                    cache: false,
                    success: function (respond) {
                        window.console && console.log(respond);
                        if (respond.status == "success") {
                            window.console && console.log('Pobrano historie najmu');
                            $scope.historyList = angular.fromJson(respond.data);
                            $scope.$apply();
                            naviDash.replacePage('history.html');
                            $("#spinner").fadeOut(1000);

                        } else if (respond.status == "error") {
                            window.console && console.log('error ' + respond.data);
                            $("#spinner").fadeOut(1000);
                            ons.notification.alert({
                                message: 'Błąd pobierania danych'
                            });
                        }
                    },
                    error: function (respond) {
                        window.console && console.log('error ' + JSON.stringify(respond));
                        $("#spinner").fadeOut(1000);
                        ons.notification.alert({
                            message: 'Podane dane są niepoprawne'
                        });
                    }
                });


            }
        }



        //NOTE: Sprawdzanie czy użytkownik jest przypisany do zestawu 
        $scope.userIn = function () {
            var currentUser = $scope.user.id;
            var found = $filter('filter')($scope.questDetailsData.users, {
                id: currentUser
            }, true);
            if (found.length > 0) {
                return true;
            } else {
                return false;
            }
        }


        //NOTE: Otwieranie twoich zadan 
        $scope.openReservations = function () {
            menu.closeMenu();
            window.console && console.log($scope.currentPage);
            if ($scope.currentPage != 'rezerwacje') {
                $scope.currentPage = 'rezerwacje';
                $.ajax({
                    type: "GET",
                    url: url + '/api/v1/user/reservations',
                    beforeSend: function () {
                        $("#spinner").css('display', 'block');
                    },
                    data: {
                        limit: 1000,
                        canceled: 1
                    },
                    headers: {
                        "api-key": currentApiKey
                    },
                    datatype: 'json',
                    cache: false,
                    success: function (respond) {
                        window.console && console.log(respond);
                        if (respond.status == "success") {
                            window.console && console.log('Pobrano rezerwacje');
                            $scope.reservationsList = angular.fromJson(respond.data);
                            $scope.$apply();
                            naviDash.replacePage('reservations.html');
                            $("#spinner").fadeOut(1000);

                        } else if (respond.status == "error") {
                            window.console && console.log('error ' + respond.data);
                            $("#spinner").fadeOut(1000);
                            ons.notification.alert({
                                message: 'Błąd pobierania danych'
                            });
                        }
                    },
                    error: function (respond) {
                        window.console && console.log('error ' + JSON.stringify(respond));
                        $("#spinner").fadeOut(1000);
                        ons.notification.alert({
                            message: 'Podane dane są niepoprawne'
                        });
                    }
                });

            }
        }


        $scope.showReservationDetails = function (element) {
            $scope.detailsView = element;
            naviDash.pushPage('reservationdetails.html');

        }



        $scope.distanceStart = function () {
            $scope.taskDetailsData.display.active = 1;
            var iFrequency = 5000; // expressed in miliseconds
            var myInterval = 0;



            // STARTS and Resets the loop if any
            function startLoop() {
                if (myInterval > 0) clearInterval(myInterval); // stop
                myInterval = setInterval(window.console && console.log(myInterval), iFrequency); // run
            }

            startLoop();

        }


    });

    module.controller('MasterController', function ($scope, $projekty, $filter) {
        $scope.items = $projekty.items;
        var userID = $scope.user.idUser;
    });


    module.factory('$projekty', function () {
        var projekty = {};
        //NOTE: Lista projekty
        projekty.items = [];
        return projekty;
    });


})();