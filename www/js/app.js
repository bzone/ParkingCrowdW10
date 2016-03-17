(function () {
    'use strict';
    var module = angular.module('app', ['onsen']);
    var url = "http://daredot.dev.thickmug.com";
    var currentApiKey;


    module.controller('AppController', function ($scope, $projekty, $filter) {
        $scope.currentPage = "Home";

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
            var passwordOK = false;
            var sendData = false;
            if ($scope.user.newpassword || $scope.user.newpasswordr) {
                if ($scope.user.newpassword == $scope.user.newpasswordr) {
                    window.console && console.log('Nowe hasło gotowe do ustawienia');
                    passwordOK = true;
                } else {
                    ons.notification.alert({
                        message: 'Hasła się nie zgadzają'
                    });
                }
            }
            if ($scope.user.new_avatar) {
                window.console && console.log('Nowy awatar gotowy do ustawienia');
                var newAvatar = {
                    'sizeInBytes': $scope.user.new_avatar_size,
                    'mimeType': 'image/png',
                    'name': 'avatar',
                    'data': $scope.user.new_avatar
                }
            }
            if (passwordOK && $scope.user.newpassword && $scope.user.newpasswordr && $scope.user.new_avatar) {
                sendData = true;
                var dataToSend = {
                    first_name: $scope.user.first_name,
                    last_name: $scope.user.last_name,
                    username: $scope.user.username,
                    email: $scope.user.email,
                    facebook_id: $scope.user.facebook_id,
                    twitter_id: $scope.user.twitter_id,
                    password: $scope.user.newpassword,
                    image: JSON.stringify({
                        'sizeInBytes': $scope.user.new_avatar_size,
                        'mimeType': 'image/png',
                        'name': 'avatar',
                        'data': $scope.user.new_avatar
                    })
                }
            } else if (passwordOK && $scope.user.newpassword && $scope.user.newpasswordr && !$scope.user.new_avatar) {
                sendData = true;
                var dataToSend = {
                    first_name: $scope.user.first_name,
                    last_name: $scope.user.last_name,
                    username: $scope.user.username,
                    email: $scope.user.email,
                    facebook_id: $scope.user.facebook_id,
                    twitter_id: $scope.user.twitter_id,
                    password: $scope.user.newpassword
                }
            } else if (!$scope.user.newpassword && !$scope.user.newpasswordr && $scope.user.new_avatar) {
                sendData = true;
                var dataToSend = {
                    first_name: $scope.user.first_name,
                    last_name: $scope.user.last_name,
                    username: $scope.user.username,
                    email: $scope.user.email,
                    facebook_id: $scope.user.facebook_id,
                    twitter_id: $scope.user.twitter_id,
                    image: JSON.stringify({
                        'sizeInBytes': $scope.user.new_avatar_size,
                        'mimeType': 'image/png',
                        'name': 'avatar',
                        'data': $scope.user.new_avatar
                    })
                }
            } else if (!$scope.user.newpassword && !$scope.user.newpasswordr) {
                sendData = true;
                var dataToSend = {
                    first_name: $scope.user.first_name,
                    last_name: $scope.user.last_name,
                    username: $scope.user.username,
                    email: $scope.user.email,
                    facebook_id: $scope.user.facebook_id,
                    twitter_id: $scope.user.twitter_id
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


        //NOTE: Otwieranie ekranu statystyk
        $scope.openStats = function () {
            menu.closeMenu();
            if ($scope.currentPage != 'Stats') {
                $scope.currentPage = 'Stats';
                naviDash.replacePage('stats.html');
            }
        }

        //NOTE: Otwieranie ekranu dodawania zadania
        $scope.openNewQuests = function () {
            menu.closeMenu();
            if ($scope.currentPage != 'NewQuests') {
                $scope.currentPage = 'NewQuests';
                naviDash.replacePage('addquest.html');
            }
        }

        //NOTE: Wyswietlanie wybranej kategorii
        $scope.getCategory = function (cat, name) {
            $scope.categoryName = name;
            $.ajax({
                type: "GET",
                url: url + '/api/v1/challenge/search',
                beforeSend: function () {
                    $("#spinner").css('display', 'block');
                },
                data: {
                    category_id: cat
                },
                headers: {
                    "api-key": currentApiKey
                },
                datatype: 'json',
                cache: false,
                success: function (respond) {
                    window.console && console.log(respond);
                    if (respond.status == "success") {
                        window.console && console.log('Pobrano zadania z kategorii ' + cat);
                        $scope.tasksInCategory = angular.fromJson(respond.data);
                        naviDash.pushPage('category.html');
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

        //NOTE: Otwieranie detali zestawu
        $scope.questDetails = function (id) {
            window.console && console.log('Pobieram detale zestawu: ' + id);
            $.ajax({
                type: "GET",
                url: url + '/api/v1/challenge/read/' + id,
                beforeSend: function () {
                    $("#spinner").css('display', 'block');
                },
                headers: {
                    "api-key": currentApiKey
                },
                datatype: 'json',
                cache: false,
                success: function (respond) {
                    window.console && console.log(respond);
                    if (respond.status == "success") {
                        window.console && console.log('Pobrano detale zestawu ' + id);
                        $scope.questDetailsData = angular.fromJson(respond.data);

                        if ($scope.questDetailsData.teams_stats) {
                            angular.forEach($scope.questDetailsData.teams_stats.tasks, function (task, key) {
                                window.console && console.log(task.name + " : " + key);
                                window.console && console.log($scope.questDetailsData.tasks[key].name);
                                task.id = $scope.questDetailsData.tasks[key].id;
                                task.type = $scope.questDetailsData.tasks[key].type.id;
                                task.difficulty = $scope.questDetailsData.tasks[key].difficulty;
                            }, true);
                        }

                        $scope.detailsMyPoints = 0;
                        $scope.detailsWhiteTeam = 0;
                        $scope.detailsBlackTeam = 0;

                        angular.forEach($scope.questDetailsData.tasks, function (task, key) {
                            if (task.verified != 0) {
                                $scope.detailsMyPoints++;
                            }
                        }, true);

                        angular.forEach($scope.questDetailsData.users, function (user, key) {
                            if (user.team == "white") {
                                $scope.detailsWhiteTeam++;
                            }
                            if (user.team == "black") {
                                $scope.detailsBlackTeam++;
                            }
                        }, true);


                        $scope.detailsMyLocation = 0;
                        var found = $filter('filter')($scope.questDetailsData.users, {
                            id: $scope.user.id
                        }, true);
                        if (found.length > 0) {
                            $scope.detailsMyLocation = found[0].location;
                        }


                        naviDash.pushPage('questdetails.html');
                        $("#spinner").fadeOut(1000);

                    } else if (respond.status == "error") {
                        window.console && console.log('error ' + respond.data);
                        $("#spinner").fadeOut(1000);
                        ons.notification.alert({
                            message: 'Bład pobierania danych'
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

        //NOTE: Otwieranie listy graczy
        $scope.playersList = function (id) {
            $scope.currentPage = "PlayerList";
            naviDash.pushPage('playerslist.html');
        }

        //NOTE: Otwieranie rankingu graczy
        $scope.playersRanking = function (id) {
            $scope.currentPage = "RankingList";
            naviDash.pushPage('playerranking.html');
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

        //NOTE: Sprawdzanie czy zadanie jest aktywne
        $scope.questActive = function () {
            var dataZadania = $scope.questDetailsData.finish_date;
            dataZadania = new Date(dataZadania);
            var now = new Date();
            if (now.getTime() >= dataZadania.getTime()) {
                return false;
            } else {
                return true;
            }
        }

        //NOTE: Dołącz do zadania
        $scope.joinQuest = function (quest, team) {
            if (team == "none") {
                var dataToSend = {
                    challenge_id: quest,
                    user_ids: '[' + $scope.user.id + ']'
                }
            } else {
                var dataToSend = {
                    challenge_id: quest,
                    user_ids: '[' + $scope.user.id + ']',
                    team: team
                }
            }
            $.ajax({
                type: "POST",
                url: url + '/api/v1/challenge/assign-users',
                beforeSend: function () {
                    $("#spinner").css('display', 'block');
                },
                headers: {
                    "api-key": currentApiKey
                },
                data: dataToSend,
                datatype: 'json',
                cache: false,
                success: function (respond) {
                    window.console && console.log(respond);
                    if (respond.status == "success") {
                        window.console && console.log('Przypisano do zestawu');
                        $scope.openYourQuests();
                        $("#spinner").fadeOut(1000);

                    } else if (respond.status == "error") {
                        window.console && console.log('error ' + respond.data);
                        $("#spinner").fadeOut(1000);
                        ons.notification.alert({
                            message: 'Bład pobierania danych'
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

        //NOTE: Detale zadania
        $scope.taskDetails = function (id) {
            window.console && console.log('Pobieranie detale zdania ' + id);
            $.ajax({
                type: "GET",
                url: url + '/api/v1/user/challenge/tasks',
                beforeSend: function () {
                    $("#spinner").css('display', 'block');
                },
                headers: {
                    "api-key": currentApiKey
                },
                data: {
                    task_id: id
                },
                datatype: 'json',
                cache: false,
                success: function (respond) {
                    window.console && console.log(respond);
                    if (respond.status == "success") {
                        $("#spinner").fadeOut(1000);
                        $scope.taskDetailsData = angular.fromJson(respond.message);
                        $scope.taskDetailsData.readyToVerify = 0;
                        $scope.taskDetailsData.params = angular.fromJson($scope.taskDetailsData.task.lparams);
                        if ($scope.taskDetailsData.progress) {
                            $scope.taskDetailsData.progressParams = angular.fromJson($scope.taskDetailsData.progress.lparams);
                        }

                        // checklista
                        if ($scope.taskDetailsData.task.type.id == 8) {
                            $scope.taskDetailsData.display = [];

                            if (!$scope.taskDetailsData.progressParams) {
                                angular.forEach($scope.taskDetailsData.params.checklist, function (point, key) {
                                    var listpoint = {
                                        checklist: point,
                                        status: 0
                                    }
                                    $scope.taskDetailsData.display.push(listpoint);

                                }, true);
                            } else {
                                var finished = 0;
                                angular.forEach($scope.taskDetailsData.params.checklist, function (point, key) {
                                    var listpoint = {
                                        checklist: point,
                                        status: $scope.taskDetailsData.progressParams.status[key]
                                    }
                                    if ($scope.taskDetailsData.progressParams.status[key] == 1) {
                                        finished++;
                                    }
                                    $scope.taskDetailsData.display.push(listpoint);

                                }, true);
                                if ($scope.taskDetailsData.params.checklist.length == finished) {
                                    $scope.taskDetailsData.readyToVerify = 1;
                                }
                            }
                        }

                        // dystans
                        if ($scope.taskDetailsData.task.type.id == 6) {
                            $scope.taskDetailsData.display = [];

                            if ($scope.taskDetailsData.progressParams) {
                                $scope.taskDetailsData.display.distance = $scope.taskDetailsData.progressParams.distance;
                                $scope.taskDetailsData.display.tracked = $scope.taskDetailsData.progressParams.tracked;
                                if ($scope.taskDetailsData.display.tracked >= $scope.taskDetailsData.display.distance) {
                                    $scope.taskDetailsData.readyToVerify = 1;
                                }
                            } else {
                                $scope.taskDetailsData.display.distance = $scope.taskDetailsData.params.distance;
                                $scope.taskDetailsData.display.tracked = 0;
                            }
                        }

                        if ($scope.taskDetailsData.progress) {
                            if ($scope.taskDetailsData.progress.waiting_for_verification == 1 || $scope.taskDetailsData.progress.verified == 1) {
                                $scope.taskDetailsData.readyToVerify = 0;
                            }
                        }

                        window.console && console.log('Pobrane detale zdania');
                        naviDash.pushPage('taskdetails.html');
                    } else if (respond.status == "error") {
                        $("#spinner").fadeOut(1000);
                        window.console && console.log('error ' + respond.data);
                    }
                },
                error: function (respond) {
                    $("#spinner").fadeOut(1000);
                    window.console && console.log('error ' + JSON.stringify(respond));
                }
            });
        }

        //NOTE: Otwieranie twoich zadan 
        $scope.openYourQuests = function () {
            menu.closeMenu();
            window.console && console.log($scope.currentPage);
            if ($scope.currentPage != 'YourQuests') {
                $scope.currentPage = 'YourQuests';
                $.ajax({
                    type: "GET",
                    url: url + '/api/v1/user/challenges',
                    beforeSend: function () {
                        $("#spinner").css('display', 'block');
                    },
                    data: {
                        finished: 0,
                        limit: 1000,
                    },
                    headers: {
                        "api-key": currentApiKey
                    },
                    datatype: 'json',
                    cache: false,
                    success: function (respond) {
                        $scope.activeTasks = angular.fromJson(respond.data);
                        window.console && console.log(respond);
                        $.ajax({
                            type: "GET",
                            url: url + '/api/v1/user/challenges',
                            beforeSend: function () {
                                $("#spinner").css('display', 'block');
                            },
                            data: {
                                finished: 1,
                                limit: 1000,
                            },
                            headers: {
                                "api-key": currentApiKey
                            },
                            datatype: 'json',
                            cache: false,
                            success: function (respond) {
                                $scope.doneTasks = angular.fromJson(respond.data);
                                $("#spinner").fadeOut(1000);
                                window.console && console.log(respond);
                                naviDash.pushPage('yourquests.html');
                            },
                            error: function (respond) {
                                window.console && console.log('error ' + JSON.stringify(respond));
                                $("#spinner").fadeOut(1000);
                                ons.notification.alert({
                                    message: 'Podane dane są niepoprawne'
                                });
                            }
                        });
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


        //NOTE: Otwieranie porównanie graczy
        $scope.comparePlayers = function (challenge_id, user_id) {
            var found = $filter('filter')($scope.questDetailsData.users, {
                id: user_id
            }, true);
            window.console && console.log(found[0]);
            $scope.compereWith = found[0];
            $scope.currentPage = 'Compare';
            $.ajax({
                type: "GET",
                url: url + '/api/v1/user/challenges/compare',
                beforeSend: function () {
                    $("#spinner").css('display', 'block');
                },
                data: {
                    challenge_id: challenge_id,
                    user_id: user_id,
                },
                headers: {
                    "api-key": currentApiKey
                },
                datatype: 'json',
                cache: false,
                success: function (respond) {
                    $("#spinner").fadeOut(1000);
                    $scope.compare = angular.fromJson(respond.message);
                    window.console && console.log(respond);

                    $.ajax({
                        type: "GET",
                        url: url + '/api/v1/user/challenges/compare',
                        beforeSend: function () {
                            $("#spinner").css('display', 'block');
                        },
                        data: {
                            challenge_id: challenge_id,
                            user_id: $scope.user.id,
                        },
                        headers: {
                            "api-key": currentApiKey
                        },
                        datatype: 'json',
                        cache: false,
                        success: function (respond) {
                            $("#spinner").fadeOut(1000);
                            $scope.compareMyPoints = angular.fromJson(respond.message);
                            window.console && console.log(respond);

                            var myPoints = 0;
                            var otherPoints = 0;
                            angular.forEach($scope.compare, function (task, key) {
                                task.verifiedMy = $scope.compareMyPoints[key].verified;
                                if (task.verifiedMy != 0) {
                                    myPoints++;
                                }
                                if (task.verified != 0) {
                                    otherPoints++;
                                }
                            }, true);
                            $scope.myPoints = myPoints;
                            $scope.otherPoints = otherPoints;

                            naviDash.pushPage('compare.html');
                        },
                        error: function (respond) {
                            window.console && console.log('error ' + JSON.stringify(respond));
                            $("#spinner").fadeOut(1000);
                            ons.notification.alert({
                                message: 'Podane dane są niepoprawne'
                            });
                        }
                    });

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

        //NOTE: Otwieranie zakładki zadania aktywne {
        $scope.showActiveTasks = function () {
            $('#activeTasks').css('display', 'block');
            $('#doneTasks').css('display', 'none');
        }

        //NOTE: Otwieranie zakładki zadania ukończone {
        $scope.showDoneTasks = function () {
            $('#activeTasks').css('display', 'none');
            $('#doneTasks').css('display', 'block');
        }


        //NOTE: Przesyłanie zadania do weryfikacji
        $scope.taskVerify = function (taskid, type) {

            if (type == 8) {
                var checklist = $scope.taskDetailsData.params.checklist;

                var status = [1];

                var i = 0;
                for (i = 1; i < $scope.taskDetailsData.params.checklist.length; i++) {
                    status.push(1);
                }
                window.console && console.log(status);

                var dataToSend = {
                    checklist: checklist,
                    status: status
                }
            }

            dataToSend = JSON.stringify(dataToSend);

            $.ajax({
                type: "POST",
                url: url + '/api/v1/user/challenges/task/update',
                beforeSend: function () {
                    $("#spinner").css('display', 'block');
                },
                data: {
                    task_id: taskid,
                    lparams: dataToSend,
                },
                headers: {
                    "api-key": currentApiKey
                },
                datatype: 'json',
                cache: false,
                success: function (respond) {
                    window.console && console.log(respond);

                    $.ajax({
                        type: "POST",
                        url: url + '/api/v1/user/challenges/task/send-to-verification',
                        beforeSend: function () {
                            $("#spinner").css('display', 'block');
                        },
                        data: {
                            task_id: taskid
                        },
                        headers: {
                            "api-key": currentApiKey
                        },
                        datatype: 'json',
                        cache: false,
                        success: function (respond) {
                            $("#spinner").fadeOut(1000);
                            window.console && console.log(respond);
                            naviDash.popPage();
                        },
                        error: function (respond) {
                            window.console && console.log('error ' + JSON.stringify(respond));
                            $("#spinner").fadeOut(1000);
                            ons.notification.alert({
                                message: 'Podane dane są niepoprawne'
                            });
                        }
                    });

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

        $scope.toogleCheck = function (index) {
            if ($scope.taskDetailsData.progress) {
                if ($scope.taskDetailsData.progress.waiting_for_verification == 0) {
                    var tmp = $scope.taskDetailsData.display[index].status;
                    if (tmp == 1) {
                        $scope.taskDetailsData.display[index].status = 0;
                    } else {
                        $scope.taskDetailsData.display[index].status = 1;
                    }

                    var finished = 0;
                    angular.forEach($scope.taskDetailsData.params.checklist, function (point, key) {
                        if ($scope.taskDetailsData.display[key].status == 1) {
                            finished++;
                        }
                    }, true);
                    if ($scope.taskDetailsData.params.checklist.length == finished) {
                        $scope.taskDetailsData.readyToVerify = 1;
                    } else {
                        $scope.taskDetailsData.readyToVerify = 0;
                    }
                }
            } else {
                var tmp = $scope.taskDetailsData.display[index].status;
                if (tmp == 1) {
                    $scope.taskDetailsData.display[index].status = 0;
                } else {
                    $scope.taskDetailsData.display[index].status = 1;
                }

                var finished = 0;
                angular.forEach($scope.taskDetailsData.params.checklist, function (point, key) {
                    if ($scope.taskDetailsData.display[key].status == 1) {
                        finished++;
                    }
                }, true);
                if ($scope.taskDetailsData.params.checklist.length == finished) {
                    $scope.taskDetailsData.readyToVerify = 1;
                } else {
                    $scope.taskDetailsData.readyToVerify = 0;
                }
            }
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