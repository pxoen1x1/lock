(function () {
    'use strict';

    angular
        .module('app.customer')
        .controller('CustomerProfileController', CustomerProfileController);

    CustomerProfileController.$inject = ['currentUserService', 'coreConstants', 'conf'];

    /* @ngInject */
    function CustomerProfileController(currentUserService, coreConstants, conf) {
        var vm = this;

        vm.profileData = {};
        vm.profileData.customerData = {};
        vm.isEditing = false;
        vm.fileUploaderOptions = coreConstants.FILE_UPLOADER_OPTIONS;
        vm.newPortrait = '';
        
        vm.updateUser = updateUser;
        vm.updateCustomer = updateCustomer;
        vm.getUser = getUser;

        activate();

        function updateCustomer(customerData, isFormValid) {
            if (!isFormValid) {

                return;
            }


            return currentUserService.updateCustomer(customerData)
                .then(function (customer) {
                    console.log(customer);
                    vm.profileData.customerData = customer.customer[0];
                    return vm.profileData;
                }).then(function(){
                    vm.isEditingCustomer = false;
                });
        }

        function updateUser(user, isFormValid) {
            if (!isFormValid) {

                return;
            }

            if (vm.newPortrait) {
                user.portrait = {
                    base64: vm.newPortrait
                };
            }

            return currentUserService.setUser(user)
                .then(function (user) {

                    vm.profileData = user;
                    vm.profileData.portrait = user.portrait ? conf.BASE_URL + user.portrait : '';
                    vm.newPortrait = '';
                    vm.isEditing = false;

                    return vm.profileData;
                });
        }

        function getUser() {

            return currentUserService.getUser()
                .then(function (user) {

                    vm.profileData = user;
                    vm.profileData.portrait = user.portrait ? conf.BASE_URL + user.portrait : '';

                    return currentUserService.getCustomer()
                        .then(function(customer){
                            console.log(customer.customer[0]);

                            if(!customer){
                                console.log('error during receiving customer');
                            }
                            vm.profileData.customerData = customer.customer[0];
                            return vm.profileData;
                        });
                });
        }

        function activate() {
            getUser();
        }
    }
})();