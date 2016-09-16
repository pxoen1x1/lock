(function () {
    'use strict';

    angular
        .module('app.core')
        .directive('fileUploader', fileUploader);

    fileUploader.$inject = ['$compile', '$templateCache'];

    function fileUploader($compile, $templateCache) {
        var directive = {
            link: link,
            restrict: 'A',
            scope: {
                uploadFileUrl: '@',
                removeFileUrl: '@',
                method: '@',
                allowedExtensions: '@',
                maxSize: '@',
                isSingleFile: '@',
                isMultipleSelection: '@',
                autoUpload: '@',
                onFail: '&',
                selectedFileSrc: '=?',
                selectedFile: '=?',
                uploadedFiles: '=?'
            },
            controller: fileUploaderController,
            controllerAs: 'vm',
            bindToController: true
        };

        return directive;

        function link(scope, element) {
            var vm = scope.vm;
            var isMultipleSelection = !vm.isMultipleSelection || vm.isMultipleSelection === 'true';
            var isSingleFile = vm.isSingleFile === 'true';

            var template = $templateCache.get('core/directives/file-uploader/file-uploader.html');

            var inputElement = $compile(template)(scope);

            if (!isMultipleSelection || isSingleFile) {
                inputElement.removeAttr('multiple');
            }

            element.after(inputElement);

            element.bind('click', function () {
                element.next()[0].click();
            });
        }
    }

    fileUploaderController.$inject = ['$scope', 'coreDataservice', 'FileUploader'];

    /* @ngInject */
    function fileUploaderController($scope, coreDataservice, FileUploader) {
        var promiseRemoveFromQueue;
        var vm = this;

        vm.uploader = new FileUploader();

        vm.uploader.method = vm.method || 'POST';
        vm.uploader.url = vm.uploadFileUrl;
        vm.uploader.formData = [vm.formData];
        vm.uploader.autoUpload = vm.autoUpload !== 'false';

        vm.uploader.filters = [
            {
                name: 'allowedExtensionsFilter',
                fn: function (item) {
                    if (!vm.allowedExtensions) {
                        return true;
                    }

                    var nameParts = item.name.match(/.+\.([a-zA-Z0-9]+)$/);

                    if (nameParts.length < 2) {
                        return false;
                    }

                    var extension = nameParts[nameParts.length - 1];

                    return vm.allowedExtensions.indexOf(extension) !== -1;
                }
            },
            {
                name: 'maxFileSizeFilter',
                fn: function (item) {
                    var maxSize = +vm.maxSize;

                    return !maxSize || item.size <= maxSize;
                }
            }
        ];

        vm.uploader.onBeforeUploadItem = onBeforeUploadItem;
        vm.uploader.deleteUploadedFile = deleteUploadedFile;
        vm.uploader.onSuccessItem = onSuccessItem;
        vm.uploader.onWhenAddingFileFailed = onWhenAddingFileFailed;
        vm.uploader.onAfterAddingFile = onAfterAddingFile;

        activate();

        function onBeforeUploadItem(fileItem) {
            fileItem.url = vm.uploadFileUrl;
        }

        function onAfterAddingFile(fileItem) {
            var reader = new FileReader();

            reader.onload = onLoadFile;
            reader.readAsDataURL(fileItem._file);

            function onLoadFile(event) {
                vm.selectedFileSrc = event.target.result;
                $scope.$apply();
            }

            vm.selectedFile = fileItem && fileItem._file ? fileItem._file.name : null;
        }

        function onSuccessItem(item, response) {
            if (!vm.isSingleFile || vm.isSingleFile !== 'true') {
                vm.uploadedFiles = vm.uploadedFiles || [];

                vm.uploadedFiles.push(response);
            } else {
                vm.uploadedFiles = response;
            }
        }

        function onWhenAddingFileFailed(fileItem, filter) {
            var message = '';

            switch (filter.name) {
                case 'allowedExtensionsFilter':
                    message = 'The file extension is not allowed. Allowed extensions are: ' +
                        vm.allowedExtensionsStr;
                    break;
                case 'maxFileSizeFilter':
                    message = 'The file is too big. It should be no more than ' + vm.maxSize + 'B';
                    break;
            }

            vm.onFail({message: message});
        }

        function deleteUploadedFile(item) {
            var config = {
                url: vm.uploadFileUrl + '/' + item.uploadedFile.id,
                method: 'DELETE'
            };

            promiseRemoveFromQueue = coreDataservice.requestWithTimeout(config);

            return promiseRemoveFromQueue
                .then(function (response) {

                    return response.data;
                });
        }

        function activate() {
            if (vm.allowedExtensions) {
                vm.allowedExtensionsStr = vm.allowedExtensions.replace(/(\w+)/g, '.$1,');
            }
        }
    }
})();