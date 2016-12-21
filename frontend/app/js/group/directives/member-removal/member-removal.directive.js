(function () {
    'use strict';

    angular
        .module('app.group')
        .directive('memberRemoval', memberRemoval);

    memberRemoval.$inject = ['groupDataservice'];

    /* @ngInject */
    function memberRemoval(groupDataservice) {
        var directive = {
            link: link,
            restrict: 'A',
            scope: {
                member: '< memberRemoval',
                onRemove: '&'
            }
        };
        return directive;

        function link(scope, element) {

            function removeMemberFromGroup() {

                return groupDataservice.removeMemberFromGroup(scope.member)
                    .then(function (removedMember) {

                        scope.$applyAsync(
                            function () {
                                scope.onRemove({removedMember: removedMember});
                            }
                        );
                    });
            }

            element.on('click', function () {
                removeMemberFromGroup();
            });
        }
    }
})();