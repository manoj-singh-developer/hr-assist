(() => {

    'use strict';

    angular
        .module('HRA')
        .controller('departmentFormCtrl', departmentFormCtrl);

    function departmentFormCtrl($scope, Department, $mdDialog, $rootScope, departmentObject) {

        var vm = this;
        vm.department = departmentObject || {};

        vm.add = add;
        vm.closeButton = closeButton;
        vm.clearButton = clearButton;

        function add() {
            if (vm.department.id) {
                Department.update(vm.department).then((data) => {
                    $rootScope.$emit('event:departmentUpdate', vm.department);
                    $mdDialog.cancel();
                });
            } else {
                Department.save(vm.department).then((data) => {
                    $rootScope.$emit('event:departmentAdd', data);
                    $mdDialog.cancel();
                });
            }
        }

        function closeButton() {
            $mdDialog.cancel();
        }

        function clearButton() {
            vm.department = {};
        }

    }

})();
