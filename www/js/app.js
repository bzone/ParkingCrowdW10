(function () {
    'use strict';
    var module = angular.module('app', ['onsen', 'uiGmapgoogle-maps']);
    var url = "http://parkingcrowd.dev.thickmug.com";
    var currentApiKey;

    var l_lang;
    if (navigator.userLanguage) // Explorer
        l_lang = navigator.userLanguage;
    else if (navigator.language) // FF
        l_lang = navigator.language;
    else
        l_lang = "en";


    var marker1 = {
        id: 1,
        latitude: 37.769,
        longitude: -122.44
    };

    var markersDisplayed = 0;
    var markersAdded = 0;
    var maxMarkersToDisplay = 3;
    var increment = 0.02;
    var startingLongitude = -122.44;
    var startingLatitude = 37.769;




    module.controller('AppController', function ($scope, $projekty, $filter) {
        $scope.currentPage = "Home";
        $scope.detectLang = l_lang;

        $scope.transPolish = {
            app_name: 'ParkingCrowd',
            action_settings: 'Settings',
            car_return_place: 'Miejsce zwrotu pojazdu:',
            car_get_address: 'Adres odbioru pojazdu:',
            drawer_open: '',
            drawer_close: '',
            ainslieBold: '"fonts/ainslie-bold.otf"',
            ainslieRegular: '"fonts/ainslie-regular.otf"',
            username_text: 'nazwa użytkownika',
            password_text: 'hasło',
            login_text: 'zaloguj się',
            or_text: 'lub',
            create_account_Text: 'utwórz nowe konto',
            email_text: 'e-mail',
            reset_text: 'zresetuj hasło',
            recovery_text: 'Podaj nazwę uzytkownika i adres e-mail powiązany z Twoim kontem.',
            recovery_text2: 'Na podany adres otrzymasz przypomnienia swojego hasła.',
            lorem: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum quis tempus nulla. Donec tincidunt mollis odio sed ultrices. Integer non facilisis nibh. Integer et lacus a urna laoreet tincidunt quis in metus.',
            next_text: 'dalej',
            name_text: 'imię',
            last_name_text: 'nazwisko',
            phone_number: 'numer telefonu',
            register_and_login_text: 'zarejestruj i zaloguj',
            money_in_wallet_text: 'Środki w portfelu: ',
            home_screen_text: 'Szkolenia',
            my_reservation: 'Moje rezerwacje',
            history_text: 'Historia najmu',
            favourite_text: 'Ulubione',
            scanner_qr_text: 'Skaner QRCode',
            where_do_you_want_to_park_text: 'Gdzie chcesz zaparkować?',
            login_text_bad_credentials: 'Login lub hasło niepoprawne!',
            login_text_no_account: 'Login lub hasło niepoprawne!',
            create_account_text_name_taken: 'Wybrana nazwa jest już zajęta!',
            create_account_text_fields_required: 'Wszystkie pola są wymagane!',
            create_account_text_mail_taken: 'Wybrany email jest już zajęty!',
            create_account_text_creating_account: 'Tworzę konto...',
            error_downloading_places_fail: 'Pobieranie ofert nie powiodło się!',
            title_parking_crowd: 'Parking Crowd',
            title_details_offer: 'Detale oferty',
            map_text: 'Mapa',
            photos_text: 'Zdjęcia',
            park_now_text: 'Zaparkuj teraz',
            reserve_text: 'Zarezerwuj',
            occupance_text: 'Zajętość',
            features_text: 'Udogodnienia',
            guarded_24_text: 'Strzeżony 24h',
            monitoring_text: 'Monitoring',
            covered_text: 'Zadaszony',
            bus_text: 'Dla autokarów',
            additional_info_text: 'Informacje dodatkowe',
            owner_text: 'Wynajmujący',
            renting_from: '"Wynajmuje od: "',
            rents_from_text: 'Wynajmuje od: ',
            reserve_parking_title: 'Rezerwacja parkingu',
            from_Text: 'od',
            set_date_and_time_text: 'wybierz datę i godzinę',
            to_text: 'do',
            parking_not_available_at_text: 'Parking niedostępny w terminach:',
            error_make_reservation_fail: 'Nie udało się zarezerwować terminu! Sprawdź czy nie pokrywa się z innym terminem lub czy masz wystarczającą ilość środków na koncie.',
            title_my_reservations: 'Moje rezerwacje',
            error_not_enough_balance_to_buy: 'Nie masz wystarczającej ilości pieniędzy na koncie!',
            title_details: 'Szczegóły',
            cancel_reservation_text: 'anuluj rezerwację',
            contact_with_owner_text: 'Kontakt z osobą wynajmującą',
            error_generic: 'Wystąpił błąd!',
            parking_service_text: 'Wynajem miejsca parkingowego',
            car_service_text: 'Wynajem samochodu',
            menu_your_services_text: 'Twoje usługi',
            menu_add_service_text: 'Dodaj usługę',
            menu_why_text: 'Dlaczego warto',
            menu_for_owner_text: 'Dla wynajmujących',
            title_add_service: 'Dodaj usługę',
            add_name_text: 'Nazwa',
            add_info_add_text: 'Informacje podstawowe',
            add_hint_name: 'Wpisz nazwę',
            add_localization_text: 'Lokalizacja',
            add_price_per_hour_text: 'Cena za godzinę',
            add_info_additional_text: 'Informacje dodatkowe',
            add_guarded_text: 'Strzeżony',
            add_monitoring_text: 'Monitoring',
            add_covered_text: 'Zadaszony',
            add_bus_Tex: 'Dla autokarów',
            add_additional_desc_text: 'Opis dodatkowy:',
            add_hint_desc: 'Opisz swój parking/miejsce parkingowe',
            add_photos_text: 'Zdjęcia',
            add_button_text: 'dodaj usługę',
            add_localization_hint_text: 'Kliknij i wybierz parking na mapie.\nDane uzupełnią się automatycznie.',
            title_add_localization_map: 'Dodaj lokalizację',
            map_localization_text: 'Znaleziona lokalizacja:',
            parking_text: 'Parking',
            cars_text: 'Samochody',
            title_your_services: 'Twoje usługi',
            status_text: 'Status',
            reservations_text: 'Rezerwacje',
            free_text: 'wolny',
            no_cars_text: 'Nie wynajmujesz żadnego samochodu',
            title_your_offer: 'Twoja oferta',
            other_text: 'Inne',
            block_text: 'Zablokuj miejsce',
            qr_code_text: 'Mój QR CODE',
            nfc_text: 'Wynajem przez NFC',
            by_owner: 'przez wynajmującego',
            history_res_text: 'Historia wynajmu',
            title_qr_scanner: 'Skaner QR Code',
            no_description_text: 'Brak opisu',
            title_parking_now: 'Parkowanie',
            stop_parking_text: 'zakończ parkowanie',
            overall_parking_cost_text: 'całkowity koszt wynajmu: ',
            parking_available_untill_text: '"Parking dostępny jeszcze: "',
            hours_and_text: '" godzin i "',
            minutes_text: '" minut"',
            please_select_parking_number: 'wybierz numer parkingu na którym chcesz zaparkować',
            title_voice_parking: 'Parkowanie głosowe',
            send_rating_text: 'prześlij ocenę',
            rate_text: 'Ocena',
            title_notifications: 'Notyfikacje',
            title_history_of_reservation: 'Historia rezerwacji',
            your_balance_text: 'w Twoim portfelu znajduje się:',
            title_wallet: 'Portfel',
            tab_balance: 'Saldo',
            tab_history: 'Historia',
            text_wallet_info: 'Aby dodać lub wypłacić środki skorzystaj ze strony parkingcrowd.pl',
            text_balance: 'saldo:',
            by_site: 'Doładowanie przez stronę',
            title_settings: 'Ustawienia',
            text_email: 'E-mail',
            text_phone: 'Numer telefonu',
            about_text: 'O sobie',
            text_camera: 'aparat',
            text_gallery: 'galeria',
            settings_text_settings_saved: 'USTAWIENIA ZAPISANE!',
            settings_text_settings_not_saved: 'Błąd! Nie zapisano ustawień!',
            set_avatar_text: 'zmień awatar',
            title_why: 'Dlaczego warto',
            title_histoy: 'Historia najmu',
            title_edit_service: 'Edycja usługi',
            text_save_service_edited: 'zapisz usługę',
            text_save_settings: 'Zapisz ustawienia',
            car_rent_now_text: 'Wynajmij teraz',
            car_info_text: 'Informacje o samochodzie',
            four_persons_feature: 'osobowy',
            air_con_text: 'Klimatyzacja',
            abs_text: 'ABS',
            cabriolet_text: 'Kabriolet',
            power_steering_text: 'Wspomaganie',
            hint_brand_name: 'Podaj markę',
            brand_text: 'Marka',
            model_text: 'Podaj model',
            year_text: 'Rocznik',
            year_hint: 'Podaj rocznik',
            seats_text: 'Ilość miejsc',
            seats_hint: 'Podaj ilość miejsc',
            block_offer_text: 'Zablokuj wynajem',
            contact_to_person_renting_your_car: 'Kontakt z osobą wynajmującą Twój samochód',
            status_rent_text: 'Status wynajmu',
            title_rent: 'Wynajem',
            overall_gain_from_rent_text: '"całkowity zysk z wynajmu: "',
            accept_rent_close_text: 'potwierdź odbiór pojazdu',
            car_rent_close_info_text: 'Koniec wynajmu musi potwierdzić\nwłaściciel wynajmowanego pojazdu!',
            error_no_sim_or_gps: 'By korzystać z aplikacji włącz GPS oraz upewnij się, że masz dostęp do sieci komórkowej.',
            text_favourites: 'Brak ulubionych',
            title_favourites: 'Ulubione',
            logout_button_Text: 'Wyloguj się',
            title_calendar: 'Kalendarz rezerwacji',
            menu_calendar_text: 'Kalendarz rezerwacji',
            user_blacklisted: 'Użytkownik dodany do listy blokowanych użytkowników. Jeśli chcesz go usunąć z tej listy, wejdź do ustawień i otwórz listę blokowanych użytkowników.',
            settings_search: 'Ustawienia wyszukiwania',
            search_text: 'Zaznacz, które opcje muszą być spełnione podczas wyszukiwania parkingu:',
            blocked_users: 'Blokowani użytkownicy',
            blocked_users_text: 'Dodaj do listy osoby, którym nie chcesz udostępniać swoich usług.',
            blocked_users_list: 'Blokowane osoby',
            cancelled_text: 'anulowano',
            ended_cost_text: '"zakończono - koszt parkowania: "',
            in_progress_Text: 'właśnie trwa',
            maximum_rent_time: '"maksymalny czas wynajmu: "',
            occupied: 'zajęty',
            available: 'wolny',
            no_current_rating_car: 'Nie wynajmujesz żadnego samochodu',
            rent_time: 'Czas wynajmu: ',
            rate_parking: 'oceń miejsce parkingowe',
            voice_parking_found: '"Znaleziono "',
            voice_parking_your_neighbour: '" parkingi w Twojej okolicy."',
            voice_parking: '"Parking "',
            voice_at_distance: '" w odległości "',
            voice_meteres: '" metrów."',
            voice_kilometers: '" kilometrów."',
            voice_found: '"znaleziono "',
            voice_parkings_close: '" parkingi w pobliżu"',
            voice_which_parking: '" Który parking wybierasz?"',
            voice_no_such_parking: 'Nie ma takiego parkingu',
            voice_price_is: '" W cenie "',
            voice_per_hour: '" złotych za godzinę."',
            service_parking_Text: 'Posiadasz własne miejsce parkingowe? Dodaj je do Parking Crowd i zarób trochę pieniędzy na wypożyczaniu go innym. Pamiętaj by zrobić zdjęcia i dokładnie opisać położenie miejsca, tak aby nie było wątpliwości dla wynajmujących.',
            service_car_text: 'Możesz także udostępnić własny samochód użytkownikom Parking Crowd. Tak samo jak w miejscu parkingowym, porób zdjęcia i poświęć chwilę na dokładne opisanie samochodu, który chcesz udostępnić do wypożyczenia.',
            why_text: 'Zostań wynajmującym i zarabiaj z Parking Crowd. Masz pełną kontrolę nad swoimi ofertami. Z łatwością zarządzasz swoim miejscem i zarobionymi pieniędzmi. Wypłacasz środki kiedy chcesz przez stronę internetową. Nic Cię nie ogranicza! Wynajmuj tyle miejsc ile potrzebujesz. Wynajmując miejsce parkingowe dodatkowo zbierasz atrakcyjne oferty.',
            no_content_notifications: 'Brak notyfikacji',
            no_content_history: 'Brak historii',
            no_context_reservations: 'Brak rezerwacji',
            no_content_calendar: 'Brak nadchodzących\nrezerwacji',
            in_progress: 'parkowanie w trakcie',
            to_parking_left: 'Do rozpoczęcia parkowania zostało:',
            home_screen: 'Ekran główny'
        }

        $scope.transEnglish = {
            app_name: 'ParkingCrowd',
            by_owner: 'by owner',
            text_save_settings: 'Save settings',
            action_settings: 'Settings',
            car_return_place: 'Car return place:',
            car_get_address: 'Car rent place:',
            drawer_open: '',
            drawer_close: '',
            by_site: 'Payment by webpage',
            ainslieBold: '"fonts/ainslie-bold.otf"',
            ainslieRegular: '"fonts/ainslie-regular.otf"',
            username_text: 'username',
            password_text: 'password',
            login_text: 'login',
            or_text: 'or',
            create_account_Text: 'create new account',
            email_text: 'e-mail',
            reset_text: 'reset password',
            recovery_text: 'insert your username and email connected to you account.',
            recovery_text2: 'You will get your password on your email.',
            lorem: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum quis tempus nulla. Donec tincidunt mollis odio sed ultrices. Integer non facilisis nibh. Integer et lacus a urna laoreet tincidunt quis in metus.',
            next_text: 'next',
            name_text: 'first name',
            last_name_text: 'last nameo',
            phone_number: 'phone number',
            register_and_login_text: 'sign up and login',
            hello_blank_fragment: 'Hello blank fragment',
            money_in_wallet_text: 'Account balance ',
            home_screen_text: 'Trainings',
            my_reservation: 'My reservations',
            history_text: 'Reservation history',
            favourite_text: 'Favourites',
            scanner_qr_text: 'QRCode scanner',
            where_do_you_want_to_park_text: 'Where do you want to park?',
            login_text_bad_credentials: 'Login or password incorrect!',
            login_text_no_account: 'Login or password incorrect!',
            create_account_text_name_taken: 'Name already taken!',
            create_account_text_fields_required: 'All fields are required!',
            create_account_text_mail_taken: 'Email already in use!',
            create_account_text_creating_account: 'Creating account...',
            error_downloading_places_fail: 'Download failed...',
            title_parking_crowd: 'Parking Crowd',
            title_details_offer: 'Offer details',
            map_text: 'Map',
            photos_text: 'Photos',
            park_now_text: 'Park now',
            reserve_text: 'Make reservation',
            occupance_text: 'Occupance',
            features_text: 'Features',
            guarded_24_text: 'Guarded 24h',
            monitoring_text: 'Monitoring',
            covered_text: 'Covered',
            bus_text: 'For buses',
            additional_info_text: 'Additional information',
            owner_text: 'Owner',
            renting_from: 'Renting from: ',
            rents_from_text: 'Available for rent from:',
            reserve_parking_title: 'Parking reservation',
            from_Text: 'From',
            set_date_and_time_text: 'select date',
            to_text: 'To',
            parking_not_available_at_text: 'Parking not available at:',
            error_make_reservation_fail: 'Reservation not available! Check if it does not overlap with existing reservation or you have enough money on your account.',
            title_my_reservations: 'My reservations',
            error_not_enough_balance_to_buy: 'Insufficient funds!',
            title_details: 'Reservation details',
            cancel_reservation_text: 'cancel reservation',
            contact_with_owner_text: 'Contact owner',
            error_generic: 'Error occured!',
            parking_service_text: 'Rent your parking space',
            car_service_text: 'Rent car',
            menu_your_services_text: 'Your services',
            menu_add_service_text: 'Add service',
            menu_why_text: 'Why Parking Crowd?',
            menu_for_owner_text: 'For owners',
            title_add_service: 'Add service',
            add_name_text: 'Name',
            add_info_add_text: 'Basic information',
            add_hint_name: 'Type name',
            add_localization_text: 'Localization',
            add_price_per_hour_text: 'Price per hour',
            add_info_additional_text: 'Additional information',
            add_guarded_text: 'Guarded',
            add_monitoring_text: 'Monitoring',
            add_covered_text: 'Covered',
            add_bus_Tex: 'For buses',
            add_additional_desc_text: 'Description:',
            add_hint_desc: 'Describe your parking space',
            add_photos_text: 'Photos',
            add_button_text: 'add service',
            add_localization_hint_text: 'Click and select on map.\nData fills in automatically.',
            title_add_localization_map: 'Add location',
            map_localization_text: 'Location found:',
            parking_text: 'Parking',
            cars_text: 'Cars',
            title_your_services: 'Your services',
            status_text: 'Status',
            reservations_text: 'Reservations',
            free_text: 'available',
            no_cars_text: 'You are not renting any car currently.',
            title_your_offer: 'Your offer',
            other_text: 'Other',
            block_text: 'Block parking space',
            qr_code_text: 'My QR CODE',
            nfc_text: 'Rent via NFC',
            history_res_text: 'Rent history',
            title_qr_scanner: 'QR Code Scanner',
            no_description_text: 'No description',
            title_parking_now: 'Parking now',
            stop_parking_text: 'end parking',
            overall_parking_cost_text: '"overall cost: "',
            parking_available_untill_text: '"Parking available untill: "',
            hours_and_text: '" hours and "',
            minutes_text: '" minutes"',
            please_select_parking_number: 'please select parking which you want to use',
            title_voice_parking: 'Voice parking search',
            send_rating_text: 'send rating',
            rate_text: 'Rating',
            title_notifications: 'Notifications',
            title_history_of_reservation: 'Reservation history',
            your_balance_text: 'your current funds:',
            title_wallet: 'Wallet',
            tab_balance: 'Balance',
            tab_history: 'History',
            text_wallet_info: 'To add or withdraw funds\n please use parkingcrowd.pl',
            text_balance: 'balance:',
            title_settings: 'Settings',
            text_email: 'E-mail',
            text_phone: 'Phone number',
            about_text: 'About',
            text_camera: 'camera',
            text_gallery: 'gallery',
            settings_text_settings_saved: 'SETTINGS SAVED!',
            settings_text_settings_not_saved: 'Error! Settings not saved!',
            set_avatar_text: 'change avatar',
            title_why: 'Why Parking Crowd',
            title_histoy: 'Rent history',
            title_edit_service: 'Edit service',
            text_save_service_edited: 'save service',
            car_rent_now_text: 'Rent now',
            car_info_text: 'Car information',
            four_persons_feature: 'seats',
            air_con_text: 'Air conditioning',
            abs_text: 'ABS',
            cabriolet_text: 'Cabriolet',
            power_steering_text: 'Power steering',
            hint_brand_name: 'Type brand',
            brand_text: 'Brand',
            model_text: 'Type model',
            year_text: 'Year',
            year_hint: 'Type year',
            seats_text: 'Seats amount',
            seats_hint: 'Type seats amount',
            block_offer_text: 'Block offer',
            contact_to_person_renting_your_car: 'Contact person renting your car',
            status_rent_text: 'Rent status',
            title_rent: 'Renting',
            overall_gain_from_rent_text: '"overall gain from rent: "',
            accept_rent_close_text: 'accept car return',
            car_rent_close_info_text: 'Car return must be\naccepted by car owner!',
            error_no_sim_or_gps: 'To use this app make sure you have GPS on and good network signal.',
            text_favourites: 'No favourites',
            title_favourites: 'Favourites',
            logout_button_Text: 'Logout',
            title_calendar: 'Reservations calendar',
            menu_calendar_text: 'Reservations calendar',
            user_blacklisted: 'User added to list of blocked users. If you want to remove him from this list, please go to settings and edit blocked users list there.',
            settings_search: 'Search filters',
            search_text: 'Select which requirements must be met when searching for parking:',
            blocked_users: 'Blocked users',
            blocked_users_text: 'Add users to list of users that are not allowed to rent from you.',
            blocked_users_list: 'Blocked users',
            cancelled_text: 'cancelled',
            ended_cost_text: '"ended - parking cost: "',
            in_progress_Text: 'in progress',
            maximum_rent_time: '"maximum rent time: "',
            occupied: 'occupied',
            available: 'available',
            no_current_rating_car: 'You are not renting\nany car now',
            rent_time: '"Rent time: "',
            rate_parking: 'rent this parking',
            voice_parking_found: '"Found "',
            voice_parking_your_neighbour: '" parking spots"',
            voice_parking: '"Parking "',
            voice_at_distance: '" at distance of "',
            voice_meteres: '" meters."',
            voice_kilometers: '" kilometers."',
            voice_found: '"found "',
            voice_parkings_close: '" parkings nearby"',
            voice_which_parking: '" Which parking do you choose?"',
            voice_no_such_parking: 'No such parking',
            voice_price_is: '" Priced "',
            voice_per_hour: '" per hour."',
            service_parking_Text: 'Do you own a parking space? Add it as a service to Parking Crowd and make some money off it. Remember to take photos and describe it in detail, so you customers will not have any difficulties finding your parking space.',
            service_car_text: 'You can rent your car too. Renting process is the same as it is in renting parking space. Take photos of your car, spend a moment describing it - it will help you get more Parking Crowd users to consider your offer.',
            why_text: 'Become a tenant and earn with Parking Crowd. You have a full control! Thanks to our mobile application. Manage your parking spaces and your earned money. Withdraw your money wherever you want. There are no limits! Rent as many spots as you need. Renting a place earns additional discounts.',
            no_content_notifications: 'Brak notyfikacji',
            no_content_history: 'Brak historii',
            no_context_reservations: 'Brak rezerwacji',
            no_content_calendar: 'Brak nadchodzących rezerwacji',
            in_progress: 'parkowanie w trakcie',
            to_parking_left: 'Do rozpoczęcia parkowania zostało:',
            home_screen: 'Home'
        }

        $scope.transGerman = {
            app_name: 'ParkingCrowd',
            action_settings: 'Einstellungen ',
            by_owner: 'durch den Vermieter',
            car_get_address: 'Autovermietung Ort:',
            text_save_settings: 'Einstellungen speichern',
            car_return_place: 'Das Fahrzeug zurückkehrt:',
            by_site: 'Zahlung per Web-Seite',
            drawer_open: '',
            drawer_close: '',
            ainslieBold: '"fonts/ainslie-bold.otf"',
            ainslieRegular: '"fonts/ainslie-regular.otf"',
            username_text: 'username',
            password_text: 'Passwort',
            login_text: 'login',
            or_text: ' oder ',
            create_account_Text: 'neues Konto erstellen',
            email_text: 'E-Mail',
            reset_text: 'Passwort zurücksetzen',
            recovery_text: 'Bitte geben Sie Ihren Benutzernamen und E-Mail-Adresse mit Ihrem Konto verknüpft.',
            recovery_text2: 'Um die Adresse erhalten Sie eine Erinnerung an Ihr Passwort zu erhalten.',
            lorem: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum quis tempus nulla. Donec tincidunt mollis odio sed ultrices. Integer non facilisis nibh. Integer et lacus a urna laoreet tincidunt quis in metus.',
            next_text: 'nächste',
            name_text: 'Vorname ',
            last_name_text: 'Nachname',
            phone_number: 'Telefonnummer ',
            register_and_login_text: 'anmelden und einloggen ',
            hello_blank_fragment: 'Hello blank fragment',
            money_in_wallet_text: '"Kontostand "',
            home_screen_text: 'Trainings',
            my_reservation: 'Meine Buchungen',
            history_text: 'Reservierung Geschichte',
            favourite_text: 'Favoriten ',
            scanner_qr_text: 'QRCode scanner',
            where_do_you_want_to_park_text: 'Wo Sie parken tun?',
            login_text_bad_credentials: 'Login oder Passwort falsch!',
            login_text_no_account: 'Login oder Passwort falsch!',
            create_account_text_name_taken: 'Name bereits vergeben!',
            create_account_text_fields_required: 'Alle Felder müssen ausgefüllt sein!',
            create_account_text_mail_taken: 'E-Mail bereits in Gebrauch!',
            create_account_text_creating_account: 'Erstellen von Konto ...',
            error_downloading_places_fail: 'Download fehlgeschlagen ...',
            title_parking_crowd: 'Parking Crowd',
            title_details_offer: 'Angebotsdetails',
            map_text: 'Karte',
            photos_text: 'Fotos',
            park_now_text: 'Park jetzt',
            reserve_text: 'Direkt buchen',
            occupance_text: 'Occupancy ',
            features_text: 'Eigenschaften',
            guarded_24_text: 'Bewacht  24h',
            monitoring_text: 'Überwachung',
            covered_text: 'Bedeckt',
            bus_text: 'Für Busse',
            additional_info_text: 'Zusätzliche Information',
            owner_text: 'Eigentümer',
            renting_from: '"Vermietung von: "',
            rents_from_text: 'Verfügbar für Miete aus:',
            reserve_parking_title: 'Parkplatz Reservierung',
            from_Text: 'Von',
            set_date_and_time_text: 'Datum auswählen',
            to_text: 'Nach',
            parking_not_available_at_text: 'Parken ist nicht verfügbar bei:',
            error_make_reservation_fail: 'Reservierung nicht möglich! Überprüfen Sie, ob es nicht mit bestehenden Reservierung nicht überlappt oder Sie haben genug Geld auf Ihrem Konto.',
            title_my_reservations: 'Meine Buchungen',
            error_not_enough_balance_to_buy: 'Unzureichende Mittel!',
            title_details: 'Reservierungsangaben',
            cancel_reservation_text: 'Reservierung stornieren',
            contact_with_owner_text: 'Vermieter kontaktieren',
            error_generic: 'Ein Fehler ist aufgetreten!',
            parking_service_text: 'Mieten Sie Ihren Parkplatz',
            car_service_text: 'Auto mieten',
            menu_your_services_text: 'Ihre Dienste',
            menu_add_service_text: 'In Service',
            menu_why_text: 'Warum Parking Crowd?',
            menu_for_owner_text: 'Für Besitzer',
            title_add_service: 'In Service',
            add_name_text: 'Name',
            add_info_add_text: 'Grundinformation',
            add_hint_name: 'Typenbezeichnung',
            add_localization_text: 'Lokalisierung',
            add_price_per_hour_text: 'Preis pro Stunde',
            add_info_additional_text: 'Zusätzliche Information',
            add_guarded_text: 'Bewacht',
            add_monitoring_text: 'Überwachung',
            add_covered_text: 'Bedeckt',
            add_bus_Tex: 'Für Busse',
            add_additional_desc_text: 'Beschreibung:',
            add_hint_desc: 'Beschreiben Sie Ihren Parkplatz',
            add_photos_text: 'Fotos',
            add_button_text: 'addieren Service',
            add_localization_hint_text: 'Klicken Sie auf und wählen Sie auf der Karte.\nDaten füllt automatisch in.',
            title_add_localization_map: 'Ort hinzufügen',
            map_localization_text: 'Standort gefunden:',
            parking_text: 'Parkplatz',
            cars_text: 'Cars',
            title_your_services: 'Ihre Dienste',
            status_text: 'Status',
            reservations_text: 'Reservierungen',
            free_text: 'erhältlich',
            no_cars_text: 'Sie sind nicht jedes Auto zur Zeit zu mieten.',
            title_your_offer: 'Ihr Angebot',
            other_text: 'Andere',
            block_text: 'Block-Parkplatz',
            qr_code_text: 'Meine QR-Code',
            nfc_text: 'Mieten über NFC',
            history_res_text: 'Mieten Geschichte',
            title_qr_scanner: 'QR-Code-Scanner',
            no_description_text: 'Keine Beschreibung',
            title_parking_now: 'Parken jetzt',
            stop_parking_text: 'Ende Parkplatz',
            overall_parking_cost_text: '"Gesamtkosten: "',
            parking_available_untill_text: '"Parkplatz vorhanden, bis: "',
            hours_and_text: '" Stunden und "',
            minutes_text: '" Minute"',
            please_select_parking_number: 'bitte wählen Parkplatz, die Sie verwenden möchten',
            title_voice_parking: 'Sprach Parkplatz suchen',
            send_rating_text: 'senden Bewertung',
            rate_text: 'Wertung',
            title_notifications: 'Benachrichtigungen',
            title_history_of_reservation: 'Reservierung Geschichte',
            your_balance_text: 'Ihre aktuellen Fonds:',
            title_wallet: 'Brieftasche',
            tab_balance: 'Saldo',
            tab_history: 'Geschichte',
            text_wallet_info: 'Zum Hinzufügen oder Geld abheben \n benutzen Sie bitte parkingcrowd.pl',
            text_balance: 'saldo:',
            title_settings: 'Einstellungen',
            text_email: 'E-mail',
            text_phone: 'Telefonnummer',
            about_text: 'Etwa',
            text_camera: 'Kamera',
            text_gallery: 'Galerie',
            settings_text_settings_saved: 'EINSTELLUNGEN GESPEICHERT!',
            settings_text_settings_not_saved: 'Fehler! Einstellungen nicht gespeichert!',
            set_avatar_text: 'Avatar ändern',
            title_why: 'Warum Parking Crowd',
            title_histoy: 'Mieten Geschichte',
            title_edit_service: 'Bearbeiten Service',
            text_save_service_edited: 'sparen Service',
            car_rent_now_text: 'jetzt mieten',
            car_info_text: 'Auto-Informationen',
            four_persons_feature: 'Sitze',
            air_con_text: 'Klimaanlage',
            abs_text: 'ABS',
            cabriolet_text: 'Kabriolett',
            power_steering_text: 'Servolenkung',
            hint_brand_name: 'Geben Marke',
            brand_text: 'Marke',
            model_text: 'Geben Modell',
            year_text: 'Jahr',
            year_hint: 'Geben Jahr',
            seats_text: 'Sitze Menge',
            seats_hint: 'Geben Sitze Menge',
            block_offer_text: 'Block-Angebot',
            contact_to_person_renting_your_car: 'Ansprechpartner Ihr Auto zu mieten',
            status_rent_text: 'Mieten Status',
            title_rent: 'Verleih',
            overall_gain_from_rent_text: '"Gesamtverstärkung von der Miete: "',
            accept_rent_close_text: 'akzeptieren Auto Rückkehr',
            car_rent_close_info_text: 'Fahrzeugrückgabe muss ein\nAutobesitzer akzeptiert werden!',
            error_no_sim_or_gps: 'Zur Nutzung dieser App sicherstellen, dass Sie GPS auf und gutes Netzwerk Signal haben.',
            text_favourites: 'Keine Favoriten',
            title_favourites: 'Favoriten',
            logout_button_Text: 'Ausloggen',
            title_calendar: 'Reservierungen Kalender',
            menu_calendar_text: 'Reservierungen Kalender',
            user_blacklisted: 'Benutzer hinzugefügt Liste der gesperrten Benutzer. Wenn man ihn aus dieser Liste entfernen möchten, gehen Sie bitte auf Einstellungen und blockiert Nutzerliste bearbeiten dort.',
            settings_search: 'Suchfilter',
            search_text: 'Wählen Sie, welche Voraussetzungen müssen erfüllt sein, wenn für das Abstellen der Suche:',
            blocked_users: 'Blockierte Benutzer',
            blocked_users_text: 'Fügen Sie die Benutzer von Benutzern auflisten, die nicht erlaubt sind, von Ihnen zu mieten.',
            blocked_users_list: 'Blockierte Benutzer',
            cancelled_text: 'abgebrochen',
            ended_cost_text: '"beendet - Parkgebühr: "',
            in_progress_Text: 'in Bearbeitung',
            maximum_rent_time: '"maximale Mietzeit: "',
            occupied: 'belegt',
            available: 'erhältlich',
            no_current_rating_car: 'Sie mieten nicht\njedes Auto jetzt',
            rent_time: '"Mietzeitraum: "',
            rate_parking: 'mieten diese Parkplatz',
            voice_parking_found: '"gefunden "',
            voice_parking_your_neighbour: '" Parkplätze"',
            voice_parking: '"Parkplätze "',
            voice_at_distance: '" in einer Entfernung von "',
            voice_meteres: '" meter."',
            voice_kilometers: '" kilometer."',
            voice_found: '"gefunden "',
            voice_parkings_close: '" Parkings in der Nähe"',
            voice_which_parking: '" Welche Parkplatz entscheiden Sie?"',
            voice_no_such_parking: 'Eine solche Park',
            voice_price_is: '" bewertet "',
            voice_per_hour: '" pro Stunde."',
            service_parking_Text: 'Haben Sie einen Parkplatz besitzen? Fügen Sie es als Service für Parken Crowd und etwas Geld aus ihm machen. Denken Sie daran, zu fotografieren und beschreiben im Detail, so dass Sie Kunden werden keine Schwierigkeiten haben, Ihren Parkplatz zu finden.',
            service_car_text: 'Sie können auch Ihr Auto mieten. Prozess zu mieten ist die gleiche wie bei der Vermietung Parkplatz ist. Machen Sie Fotos von Ihrem Auto, verbringen Sie einen Moment ist es zu beschreiben - es wird Ihnen helfen, mehr Parken Crowd Benutzer erhalten Ihr Angebot in Betracht ziehen.',
            why_text: 'Holen Sie sich Mieter und verdienen mit Parkplatz Crowd. Sie haben eine volle Kontrolle! Dank unserer mobilen Anwendung. Verwalten Sie Ihre Parkplätze und Ihr verdientes Geld. Ziehen Sie Ihr Geld, wo immer Sie wollen. Es gibt keine Grenzen! Mieten Sie so viele Punkte wie Sie benötigen. Vermietung verdient einen Platz zusätzliche Rabatte.',
            no_content_notifications: 'Brak notyfikacji',
            no_content_history: 'Brak historii',
            no_context_reservations: 'Brak rezerwacji',
            no_content_calendar: 'Brak nadchodzących rezerwacji',
            in_progress: 'parkowanie w trakcie',
            to_parking_left: 'Do rozpoczęcia parkowania zostało:',
            home_screen: 'Bildschirm'
        }

        //$scope.detectLang = 'en';
        if ($scope.detectLang == 'pl') {
            $scope.lang = $scope.transPolish;
        } else if ($scope.detectLang == 'de') {
            $scope.lang = $scope.transGerman;
        } else {
            $scope.lang = $scope.transEnglish;
        }

        $scope.rent = false;


        $scope.map = {
            center: {
                latitude: 52.405298,
                longitude: 16.9179432
            },
            zoom: 12
        };
        $scope.map.markers = [];

        $scope.map.options = {
            disableDefaultUI: true
        }

        $scope.removeMarkers = function () {
            $scope.map.markers = [];
            markersDisplayed = 0;
            markersAdded = 0;
        }
        
          var events = {
            places_changed:function (searchBox) {
                alert('ok');
                var place = searchBox.getPlaces();
                if (!place || place == 'undefined' || place.length == 0) {
                    console.log('no place data :(');
                    return;
                }

                // refresh the map
                $scope.map = {
                    center:{
                        latitude:place[0].geometry.location.lat(),
                        longitude:place[0].geometry.location.lng()
                    },
                    zoom:10
                };

                // refresh the marker
                $scope.marker = {
                    id:0,
                    options:{ draggable:false },
                    coords:{
                        latitude:place[0].geometry.location.lat(),
                        longitude:place[0].geometry.location.lng()
                    }
                };

            }
        };
        
            $scope.searchbox = {
            template:'searchbox.tpl.html',
            events:events,
                parentdiv:'searchBoxParent',
            options:{
                autocomplete:false,
                types:['address'],
                componentRestrictions:{
                    //country:'fr'
                }
            }
        };

        $scope.toggleAddAndRemoveMarkers = function () {

            //if 3 displayed already, pop first one off of the array
            if (markersDisplayed >= 3) {
                markersDisplayed--;
                $scope.map.markers.shift();
            }
            //addd a new position
            markersDisplayed++;
            $scope.map.markers.push({
                id: markersAdded,
                latitude: startingLatitude,
                longitude: (startingLongitude + (markersAdded * increment))
            });
            markersAdded++;
        };

        $scope.centerMap = function (lat, long) {
            $scope.map.center = {
                latitude: lat,
                longitude: long
            }
        }

        var markerDetails = function (marker) {
            console.log(marker.model.id);
            $scope.showPlace(marker.model.id);
        }

        $scope.markerDetails = markerDetails;

        $scope.loadMarkers = function (type) {
            $scope.map.markers = [];
            if (type = "places") {
                angular.forEach($scope.placesList, function (mark, index) {
                    $scope.map.markers.push({
                        id: mark.id,
                        latitude: mark.latitude,
                        longitude: mark.longitude,
                        mapIcon: 'https://dl.dropboxusercontent.com/u/28981503/mappoint.png'
                    });
                });
            }
        }

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

                $scope.centerMap(currentLocationLat, currentLocationLong);
                $scope.map.markers = [];
                $scope.$apply();

                $.ajax({
                    type: "GET",
                    url: url + '/api/v1/offers/places',
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
                            window.console && console.log('Pobrano listę miejsc');
                            $scope.placesList = angular.fromJson(respond.data);
                            $scope.loadMarkers('places');
                            $scope.$apply();

                            $.ajax({
                                type: "GET",
                                url: url + '/api/v1/offers/cars',
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
                                        window.console && console.log('Pobrano listę samochodow');
                                        $scope.carsList = angular.fromJson(respond.data);
                                        $scope.$apply();

                                    } else if (respond.status == "error") {
                                        window.console && console.log('error ' + respond.data);
                                    }
                                },
                                error: function (respond) {
                                    window.console && console.log('error ' + JSON.stringify(respond));
                                }
                            });



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
            $scope.currentPage = 'detalerezerwacji';
            naviDash.pushPage('reservationdetails.html');
        }

        $scope.reservePlace = function () {
            $scope.currentPage = 'rezerwacja';
            $scope.reserveFrom = $scope.currentPlace.now;
            $scope.reserveTo = $scope.currentPlace.later;
            naviDash.pushPage('reserve.html');
        }

        $scope.reservePlaceConfirm = function () {
            var odd = $('#dataod').val();
            var dod = $('#datado').val();


            $.ajax({
                type: "POST",
                url: url + '/api/v1/user/reservations/create',
                beforeSend: function () {
                    $("#spinner").css('display', 'block');
                },
                data: {
                    offer_place_id: $scope.currentPlace.id,
                    start_date: odd,
                    end_date: dod
                },
                headers: {
                    "api-key": currentApiKey
                },
                datatype: 'json',
                cache: false,
                success: function (respond) {
                    window.console && console.log(respond);

                    if (respond.status == "success") {
                        window.console && console.log('Dodano rezerwacje');

                        $scope.currentPage = 'rezerwacjenie';
                        $("#spinner").fadeOut(1000);
                        naviDash.popPage();

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

        $scope.cancleReservation = function (id) {
            $.ajax({
                type: "POST",
                url: url + '/api/v1/user/reservations/destroy/' + id,
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
                        window.console && console.log('Anulowano rezerwację');

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
                                    naviDash.popPage();
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

        var timeinterval = 0;

        $scope.parkNow = function (type) {
            if ($scope.rent == true) {
                ons.notification.alert({
                    message: 'Masz już aktywną usługę'
                });
            } else {

                $scope.rent = true;
                $scope.rentVisible = true;
                naviDash.popPage();
                var iFrequency = 1000; // expressed in miliseconds

                $scope.rentTime = {};
                $scope.rentTime.type = type;
                $scope.rentTime.rating = 0;
                $scope.rentTime.sec = 0;
                $scope.rentTime.min = 0;
                $scope.rentTime.hours = 0;
                $scope.rentTime.price = 0;
                $scope.rentTime.priceBase = $scope.currentPlace.price_per_hour;
                $scope.rentTime.price = $scope.rentTime.price + ($scope.rentTime.priceBase / 4);
                $scope.rentTime.currentPlace = $scope.currentPlace;

                if ($scope.rentTime.type == 'place') {
                    $.ajax({
                        type: "POST",
                        url: url + '/api/v1/user/place/start',
                        beforeSend: function () {
                            $("#spinner").css('display', 'block');
                        },
                        data: {
                            offer_place_id: $scope.currentPlace.id,
                            start_date: new Date()
                        },
                        headers: {
                            "api-key": currentApiKey
                        },
                        datatype: 'json',
                        cache: false,
                        success: function (respond) {
                            window.console && console.log(respond);

                            if (respond.status == "success") {
                                window.console && console.log('Rozpoczęto parkowanie');
                                $scope.currentReservation = angular.fromJson(respond.data);
                                $scope.currentPage = 'rezerwacjenie2';
                                $("#spinner").fadeOut(1000);

                            } else if (respond.status == "error") {
                                window.console && console.log('error ' + respond.data);
                            }
                        },
                        error: function (respond) {
                            $("#spinner").fadeOut(1000);
                            window.console && console.log('error ' + JSON.stringify(respond));
                        }
                    });
                } else {
                    $.ajax({
                        type: "POST",
                        url: url + '/api/v1/user/car/start',
                        beforeSend: function () {
                            $("#spinner").css('display', 'block');
                        },
                        data: {
                            offer_car_id: $scope.currentPlace.id,
                            start_date: new Date()
                        },
                        headers: {
                            "api-key": currentApiKey
                        },
                        datatype: 'json',
                        cache: false,
                        success: function (respond) {
                            window.console && console.log(respond);

                            if (respond.status == "success") {
                                window.console && console.log('Rozpoczęto wynajem');
                                $scope.currentReservation = angular.fromJson(respond.data);
                                $scope.currentPage = 'rezerwacjenie2';
                                $("#spinner").fadeOut(1000);

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




                // STARTS and Resets the loop if any
                timeinterval = setInterval(function () {
                    $scope.rentTime.sec++;
                    if ($scope.rentTime.sec == 60) {
                        $scope.rentTime.sec = 0;
                        $scope.rentTime.min++;
                        if ($scope.rentTime.min == 15) {
                            $scope.rentTime.price = $scope.rentTime.price + ($scope.rentTime.priceBase / 4);
                        }
                        if ($scope.rentTime.min == 30) {
                            $scope.rentTime.price = $scope.rentTime.price + ($scope.rentTime.priceBase / 4);
                        }
                        if ($scope.rentTime.min == 45) {
                            $scope.rentTime.price = $scope.rentTime.price + ($scope.rentTime.priceBase / 4);
                        }
                        if ($scope.rentTime.min == 60) {
                            $scope.rentTime.price = $scope.rentTime.price + ($scope.rentTime.priceBase / 4);
                            $scope.rentTime.min = 0;
                            $scope.rentTime.hours++;
                        }
                    }
                    $scope.$apply();
                }, 1000);
            }
        }

        $scope.rentDetails = function () {
            $scope.rentVisible = false;
            naviDash.pushPage("rentdetails.html", {
                animation: "lift"
            })
        }

        $scope.hideRentDetails = function () {
            $scope.rentVisible = true;
            naviDash.popPage();
        }

        $scope.parkStop = function () {

            $.ajax({
                type: "POST",
                url: url + '/api/v1/user/place/stop',
                beforeSend: function () {
                    $("#spinner").css('display', 'block');
                },
                data: {
                    reservation_id: $scope.currentReservation.id,
                    end_date: new Date()
                },
                headers: {
                    "api-key": currentApiKey
                },
                datatype: 'json',
                cache: false,
                success: function (respond) {
                    window.console && console.log(respond);

                    if (respond.status == "success") {
                        window.console && console.log('Zakończono parkowanie');
                        $scope.currentReservation = angular.fromJson(respond.data);
                        $scope.currentPage = 'rezerwacjenie2';
                        $("#spinner").fadeOut(1000);
                        clearInterval(timeinterval);
                        $scope.rent = false;
                        $scope.rentVisible = false;
                        $scope.$apply();
                        naviDash.pushPage("rentsummary.html", {
                            animation: "fade"
                        })


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

        $scope.setRating = function (number) {
            $scope.rentTime.rating = number;
        }

        $scope.sendRating = function () {


            $.ajax({
                type: "POST",
                url: url + '/api/v1/user/reservations/rate',
                beforeSend: function () {
                    $("#spinner").css('display', 'block');
                },
                data: {
                    reservation_id: $scope.currentReservation.id,
                    rate: $scope.rentTime.rating
                },
                headers: {
                    "api-key": currentApiKey
                },
                datatype: 'json',
                cache: false,
                success: function (respond) {
                    window.console && console.log(respond);

                    if (respond.status == "success") {
                        window.console && console.log('oceniono oferte');
                        $scope.currentPage = 'rezerwacjenie3';
                        $("#spinner").fadeOut(1000);
                        naviDash.resetToPage('homedash.html', {
                            animation: "fade"
                        })

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