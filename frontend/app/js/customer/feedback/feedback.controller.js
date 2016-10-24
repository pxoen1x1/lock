(function () {
    'use strict';

    angular
        .module('app.customer')
        .controller('CustomerFeedbackController', CustomerFeedbackController);

    CustomerFeedbackController.$inject = ['$mdDialog', 'customerDataservice', 'requestInfo'];

    /* @ngInject */
    function CustomerFeedbackController($mdDialog, customerDataservice, requestInfo) {
        var vm = this;

        vm.feedbackData = {};

        vm.setFeedbackRating = setFeedbackRating;
        vm.submit = submit;
        vm.cancel = cancel;

        function setFeedbackRating(rating) {
            vm.feedbackData.rating = rating;

            return rating;
        }

        function addFeedback(feedbackData) {
            feedbackData.requestId = requestInfo.id;

            return customerDataservice.createFeedback(feedbackData)
                .then(function (createdFeedback) {

                    return createdFeedback.request;
                });
        }

        function submit(feedbackData, isFromValid) {
            if (!isFromValid) {

                return;
            }

            addFeedback(feedbackData);

            $mdDialog.hide();
        }

        function cancel() {
            $mdDialog.cancel();
        }
    }
})();