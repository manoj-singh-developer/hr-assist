(() => {

    'use strict';

    angular
        .module('HRA')
        .controller('componentFormCtrl', componentFormCtrl);

    function componentFormCtrl($scope, Component, $mdDialog, $rootScope, componentObject) {

        var vm = this;
        vm.component = componentObject || {};

        vm.add = add;
        vm.closeButton = closeButton;
        vm.clearButton = clearButton;

        function add() {
            if (vm.component.id) {
                Component.update(vm.component).then((data) => {
                    $rootScope.$emit('event:componentUpdate', vm.component);
                    $mdDialog.cancel();
                });
            } else {
                Component.save(vm.component).then((data) => {
                    $rootScope.$emit('event:componentAdd', data);
                    $mdDialog.cancel();
                });
            }
        }

        function closeButton() {
            $mdDialog.cancel();
        }

        function clearButton() {
            vm.component = {};
        }

    }

})();
