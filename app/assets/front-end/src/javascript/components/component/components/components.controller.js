((_) => {

    'use strict';

    angular
        .module('HRA')
        .controller('componentsCtrl', componentsCtrl);

    function componentsCtrl($scope, $rootScope, $mdDialog, tableSettings, autocompleteService, Component) {

        var vm = this;
        vm.tableSettings = tableSettings;
        vm.tableSettings.query = {
            limit: 10,
            page: 1,
            order: 'name'
        };

        vm.showForm = showForm;
        vm.remove = remove;
        vm.querySearch = querySearch;

        _getComponents();

        $rootScope.$on('event:componentUpdate', (event, data) => {
            debugger
            let editedComponent = _.findWhere(vm.components, {
                id: data.id
            });
            vm.components = _.without(vm.components, editedComponent);
            vm.components.push(data)
            autocompleteService.buildList(vm.components, ['name']);
        });

        $rootScope.$on('event:componentAdd', (event, data) => {
            vm.components = vm.components.concat(data);
        });

        function showForm(componentObject) {
            $mdDialog.show({
                templateUrl: rootTemplatePath + '/component/form/componentsForm.view.html',
                controller: 'componentFormCtrl',
                controllerAs: 'componentForm',
                clickOutsideToClose: true,
                componentObject: angular.copy(componentObject)
            });
        }

        function remove(component, event) {
            var confirm = $mdDialog.confirm()
                .title('Remove the ' + component.name + ' component ?')
                .targetEvent(event)
                .cancel('No')
                .ok('Yes');
            $mdDialog.show(confirm).then(() => {
                tableSettings.selected = [];
                Component.remove(component.id).then((data) => {
                    if (data.id) {
                        let toRemove = _.findWhere(vm.components, {
                            id: component.id
                        });
                        vm.components = _.without(vm.components, toRemove);
                        _updateTablePagination(vm.components);
                    }
                    if (data.error == 'sql_error') {
                        let alert = $mdDialog.alert()
                        $mdDialog.show({
                            template: '<md-dialog>' +
                                '  <md-dialog-content class="md-dialog-content">' +
                                '     <h3 class="text-center alert alert-info">This component it\'s used by someone and can\'t be deleted!</h3>' +
                                '  </md-dialog-content>' +
                                '  <md-dialog-actions>' +
                                '    <md-button ng-click="closeDialog()" class="md-primary">' +
                                '      Ok, got it' +
                                '    </md-button>' +
                                '  </md-dialog-actions>' +
                                '</md-dialog>',
                            controller: function DialogController($scope, $mdDialog) {
                                $scope.closeDialog = function() {
                                    $mdDialog.hide();
                                }
                            },
                            clickOutsideToClose: true
                        });
                    }
                });
            });
        }

        function querySearch(query, list) {
            if (query) {
                _updateTablePagination(autocompleteService.querySearch(query, list));
            } else {
                _updateTablePagination(list);
            }
            return autocompleteService.querySearch(query, list);

        }

        function _updateTablePagination(data) {
            vm.tableSettings.total = data ? data.length : 0;
        }

        function _getComponents() {
            Component.getAll().then((data) => {
                vm.components = data;
                _updateTablePagination(vm.components);
                return autocompleteService.buildList(vm.components, ['name']);
            });
        }

    }

})(_);
