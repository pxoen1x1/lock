(function () {
    'use strict';

    angular
        .module('app.core')
        .filter('tel', tel);

    function tel() {
        return telFilter;

        function telFilter(phoneNumber) {
            var result = '';

            if (!phoneNumber) {

                return result;
            }

            var value = phoneNumber.toString().trim().replace(/^\+/, '');
            var regex = /\d/;
            var isPhoneNumberValid = regex.test(value);

            if (!isPhoneNumberValid || value.length < 10) {

                return phoneNumber;
            }

            var countryCode = '';
            var cityCode = '';
            var number = '';

            if (value.length === 10) {
                cityCode = value.slice(0, 3);
                number = value.slice(3);
                result = '(' + cityCode + ') ';
            } else {
                countryCode = value.slice(0, 2);
                cityCode = value.slice(2, 4);
                number = value.slice(4);
                result = '+' + countryCode + '-' + cityCode + '-';
            }

            result += number.slice(0, 3) + '-' + number.slice(3);

            return result;
        }
    }
})();