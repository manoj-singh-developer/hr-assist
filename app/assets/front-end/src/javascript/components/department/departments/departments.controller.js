((_) => {

    'use strict';

    angular
        .module('HRA')
        .controller('departmentsCtrl', departmentsCtrl);

    function departmentsCtrl($scope, $rootScope, $mdDialog, tableSettings, autocompleteService, Department) {

        let vm = this;
        let excelData = [];
        let exportDepartments = [];
        let querySearchItems = [];
        vm.tableSettings = tableSettings;
        vm.tableSettings.query = {
            limit: 10,
            page: 1,
            order: 'name'
        };

        vm.showForm = showForm;
        vm.remove = remove;
        vm.querySearch = querySearch;
        vm.saveExcelFile = saveExcelFile;

        _getDepartments();

        $rootScope.$on('event:departmentUpdate', (event, data) => {
            let editedDepartment = _.findWhere(vm.departments, {
                id: data.id
            });
            vm.departments = _.without(vm.departments, editedDepartment);
            vm.departments.push(data)
            autocompleteService.buildList(vm.departments, ['name']);
        });

        $rootScope.$on('event:departmentAdd', (event, data) => {
            vm.departments = vm.departments.concat(data);
        });

        function showForm(departmentObject) {
            $mdDialog.show({
                templateUrl: rootTemplatePath + '/department/form/departmentsForm.view.html',
                controller: 'departmentFormCtrl',
                controllerAs: 'departmentForm',
                clickOutsideToClose: true,
                departmentObject: angular.copy(departmentObject)
            });
        }

        function remove(department, event) {
            var confirm = $mdDialog.confirm()
                .title('Remove the ' + department.name + ' department ?')
                .targetEvent(event)
                .cancel('No')
                .ok('Yes');
            $mdDialog.show(confirm).then(() => {
                tableSettings.selected = [];
                Department.remove(department.id).then((data) => {
                    if (data.id) {
                        let toRemove = _.findWhere(vm.departments, {
                            id: department.id
                        });
                        vm.departments = _.without(vm.departments, toRemove);
                        _updateTablePagination(vm.departments);
                        _generateXlsx();
                    }
                    if (data.error == 'sql_error') {
                        let alert = $mdDialog.alert()
                        $mdDialog.show({
                            template: '<md-dialog>' +
                                '  <md-dialog-content class="md-dialog-content">' +
                                '     <h3 class="text-center alert alert-info">This department it\'s used by someone and can\'t be deleted!</h3>' +
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
                querySearchItems = autocompleteService.querySearch(query, list);
                _generateXlsx();
            } else {
                _updateTablePagination(list);
                _generateXlsx();
            }
            return autocompleteService.querySearch(query, list);

        }

        function saveExcelFile() {
            let opts = [{
                sheetid: 'Departments Raport',
                headers: false
            }];
            let res = alasql('SELECT INTO XLSX("Departments Raport.xlsx",?) FROM ? ORDER BY name', [opts, [excelData]]);
        }

        function _updateTablePagination(data) {
            vm.tableSettings.total = data ? data.length : 0;
        }

        function _getDepartments() {
            Department.getAll().then((data) => {
                vm.departments = data;
                _updateTablePagination(vm.departments);
                _generateXlsx();
                return autocompleteService.buildList(vm.departments, ['name']);
            });
        }

        function _generateXlsx() {
            excelData = [];
            exportDepartments = vm.searchText ? querySearchItems : vm.departments;

            let tableHeader = {
                name: 'Department',
                functional_manager: 'Functional Manager'
            };

            if (exportDepartments) {
                angular.forEach(exportDepartments, function(value, key) {
                    excelData.push({
                        name: value.name,
                        functional_manager: value.functional_manager
                    });
                });

                Array.prototype.sortOn = function(key) {
                    this.sort(function(a, b) {
                        if (a[key].toLowerCase() < b[key].toLowerCase()) {
                            return -1;
                        } else if (a[key].toLowerCase() > b[key].toLowerCase()) {
                            return 1;
                        }
                        return 0;
                    });
                };

                excelData.sortOn('name');
                excelData.unshift(tableHeader);

                return excelData;
            }
        }



    }

})(_);
