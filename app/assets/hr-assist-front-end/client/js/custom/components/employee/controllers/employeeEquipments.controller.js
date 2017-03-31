(function() {

  'use strict';

  // ------------------------------------------------------------------------
  // @emplyeeGeneralInfoCtrl
  // ------------------------------------------------------------------------

  angular
    .module('HRA')
    .controller('hraEquipmentsCtrl', hraEquipmentsCtrl);

  hraEquipmentsCtrl
    .$inject = ['$rootScope', '$scope', '$timeout', '$mdToast', '$mdDialog', 'Upload', 'autocompleteService', 'miscellaneousService', 'Employee', 'Equipments', '$q'];





  function hraEquipmentsCtrl($rootScope, $scope, $timeout, $mdToast, $mdDialog, Upload, autocompleteService, miscellaneousService, Employee, Equipments, $q) {

    // ----------------------------------------------------------------------
    // VARIABLES
    // ----------------------------------------------------------------------

    var vm = this;
    vm.serverErrors = false;
    vm.equipmentNr = [];
    vm.form = {} || null;
    vm.minus = [];
    vm.disabledEquipments = true;
    vm.searchEquipment = {};
    vm.createEquipments = [];
    vm.copyCat = [];
    vm.equimentAdd1 = [];
    vm.eq = [];
    vm.equipmentsLabels = [
      'Monitor 1',
      'Monitor 2',
      'PC/Laptop',
      'Mobile device'
    ];





    // ----------------------------------------------------------------------
    // EXPOSED PUBLIC METHODS
    // ----------------------------------------------------------------------

    /* beautify preserve:start */
    vm.saveEmployee           = saveEmployee;
    vm.clearFields            = clearFields;
    vm.cancelAdd              = cancelAdd;
    vm.querySearchEquipments  = querySearchEquipments;
    vm.addEquipments          = addEquipments;
    vm.addEquipment           = addEquipment;
    vm.addNewEq               = addNewEq;
    vm.generalInfoShowHide    = generalInfoShowHide;
    vm.searchTextChange       = searchTextChange;
    vm.toggleCard             = toggleCard;
    /* beautify preserve:end */


    // ----------------------------------------------------------------------
    // INVOKING PRIVATE METHODS
    // ----------------------------------------------------------------------

    var getEmployee = $rootScope.$on('employeeIsLoadedEvent', function(event, employee) {
      vm.employee = employee;
      getEquipments();
    });

    $scope.$on('$destroy', function() {
      getEmployee();
    });


    // ----------------------------------------------------------------------
    // PUBLIC METHODS DECLARATION
    // ----------------------------------------------------------------------

    function toggleCard(event, action) {

      var card = angular
        .element(event.currentTarget)
        .closest('.js-employee-card');

      $rootScope.$emit("event:toggleCard", card, action);

    }


    function saveEmployee(employee) {
      fill(employee);

      vm.copyCat = angular.copy(vm.replaceEq);
      //vm.equimentAdd = [];
      $timeout(function() {
        $rootScope.$emit("callSaveMethodCards", employee);
        vm.disabledEquipments = true;
        vm.equimentAdd = [];
      }, 350);
    }

    function clearFields() {
      vm.employee = {};
    }

    function cancelAdd() {
      vm.disabledEquipments = true;

      for (var i = vm.copyCat.length; i < vm.replaceEq.length; i++) {
        vm.searchEquipment[i] = "";
      }

      vm.form = {};
      vm.hideNewEq = false;
      vm.replaceEq = _.initial(vm.replaceEq, vm.replaceEq.length - vm.copyCat.length);
      vm.createEquipments.length = vm.replaceEq.length;

      if (vm.replaceEq.length < 4)
        vm.createEquipments.length = 4;
    }

    function getEquipments() {
      Device.list()
        .then(function(res) {
          vm.equipmentsList = res;
          updateAutocompleteEquipments(vm.equipmentsList);
          return autocompleteService.buildList(vm.equipmentsList, ['name', 'description']);
        }, function(err) {
          $rootScope.showToast('Something gone wrong');
        });
    }

    function updateAutocompleteEquipments(allEquipments) {
      vm.createEquipments.length = 4;
      if (vm.employee.equipments !== null && vm.employee.equipments !== undefined) {
        if (vm.employee.equipments.length > 4) {
          vm.createEquipments.length = vm.employee.equipments.length;
        }
        vm.replaceEq = vm.employee.equipments;
        //console.log("in update", vm.replaceEq);
        vm.copyCat = angular.copy(vm.replaceEq);
        for (var i = 0; i <= vm.employee.equipments.length; i++) {
          vm.searchEquipment[i] = vm.employee.equipments[i] ? vm.employee.equipments[i].name + ' ' + vm.employee.equipments[i].description : '';
        }
      }
      $timeout(function() {
        vm.equimentAdd = [];
        //  console.log(vm.equimentAdd);
      }, 100)

    }

    function querySearchEquipments(query) {
      return autocompleteService.querySearch(query, vm.equipmentsList);
    }

    function addEquipment() {
      vm.createEquipments.push({});
    }

    function addNewEq() {
      vm.hideNewEq = true;
    }

    function addEquipments(item, employee, nr) {
      vm.replaceEq[nr] = item;
      //  console.log("vm.replaceEq", vm.replaceEq);
      // console.log("vm.equimentAdd", vm.equimentAdd);
    }

    function searchTextChange(index, item) {
      // console.log("item.id",item.id);
      //console.log("vm.equimentAdd1 before", vm.equimentAdd);
      if (item !== "") {
        vm.equimentAdd[index] = {
          name: item,
          description: ""
        }
      }


      if (item === "") {
        vm.replaceEq[index] = undefined;
      }

      // console.log("vm.replaceEq1", vm.replaceEq);
      // console.log("vm.equimentAdd1", vm.equimentAdd);
    }





    // ----------------------------------------------------------------------
    // PRIVATE METHODS DECLARATION
    // ----------------------------------------------------------------------

    function removeEq(index, equipment) {
      vm.minus.push(equipment);
      vm.employee.equipments.splice(index, 1);
    }

    function fill(employee) {
      vm.constr = [];
      vm.employee.equipments = vm.replaceEq;

      vm.saveEq(vm.equimentAdd).then(function(rez) {
        for (var i = 0; i < vm.replaceEq.length; i++) {
          if (vm.replaceEq[i] !== undefined) {
            vm.constr.push(vm.replaceEq[i]);
          }
        }

        for (var i = 0; i < rez.length; i++) {
          vm.constr.push(rez[i]);
        }

        vm.replaceEq = [];
        vm.replaceEq = vm.constr;
        vm.employee.equipments = vm.replaceEq

      }, function(err) {
        console.log(err);
      });

      $timeout(function() {
        vm.replaceEq = vm.replaceEq.filter(function(item) {
          return item !== undefined;
        });
      }, 200);

      $timeout(function() {
        vm.employee.equipments = vm.replaceEq;
        employee = vm.employee;
        vm.form = {};
        vm.hideNewEq = false;
        return employee;
      }, 300)
    }

    vm.saveEq = function(data) {
      function promise(resolve, reject) {
        saveEquipment(data).then(
          function(data) {
            return resolve(data);
          },
          function(error) {
            return reject(error);
          });
      }

      return $q(promise);
    };


    function saveEquipment(data) {
      vm.eq = [];

      function promise(resolve, reject) {
        for (var i = 0; i < data.length; i++) {
          if (data[i] !== undefined && data[i].name !== "") {
            Equipments.save(data[i]).then(function(res) {

              vm.eq.push(res);
              $timeout(function() {
                return resolve(vm.eq);
              }, 100);

            }, function(err) {
              return reject(err);
            });
          }
        }

      }
      return $q(promise);
    }

    function generalInfoShowHide(data) {
      if (data === 'equipments') {
        vm.disabledEquipments = false;
        getEquipments();
      }
    }

  }

})();
