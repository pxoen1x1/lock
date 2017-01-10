(function () {
    'use strict';

    angular
        .module('app.registration')
        .constant('registrationConstants', {
            SPECIALIST_REGISTRATION_STEPS: [
                {
                    id: 1,
                    templateUrl: 'registration/specialist-registration/specialist-registration-agreement.html',
                    title: 'agreement'
                },
                {
                    id: 2,
                    templateUrl: 'registration/specialist-registration/specialist-registration-profile.html',
                    title: 'profile'
                }
            ],
        });
})();