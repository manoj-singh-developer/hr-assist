(function() {

  'use strict';

  // ------------------------------------------------------------------------
  // emplyeeGeneralInfoCtrl
  // ------------------------------------------------------------------------

  angular
    .module('HRA')
    .controller('hraLanguageCtrl', hraLanguageCtrl);

  hraLanguageCtrl
    .$inject = ['$rootScope', '$scope', '$timeout', '$mdToast', '$mdDialog', 'Upload', 'autocompleteService', 'miscellaneousService', 'Employee'];





  function hraLanguageCtrl($rootScope, $scope, $timeout, $mdToast, $mdDialog, Upload, autocompleteService, miscellaneousService, Employee) {


    // ----------------------------------------------------------------------
    // VARIABLES
    // ----------------------------------------------------------------------

    /* beautify preserve:start */
    var vm                  = this;
    vm.serverErrors         = false;
    vm.disabledLanguagesis  = true;
    vm.createLanguage       = [];
    vm.selLevel             = [];
    vm.newJob               = [];
    vm.selectedLevel        = {};
    vm.selectedLevel        = [];
    /* beautify preserve:end */

    vm.levels = [
      "Elementary proficiency",
      "Limited working proficiency",
      "Professional working proficiency",
      "Full professional proficiency",
      "Native or bilingual proficiency"
    ];





    // ----------------------------------------------------------------------
    // EXPOSED PUBLIC METHODS
    // ------------------------------------------------------------------------

    /* beautify preserve:start */
    vm.saveEmployee         = saveEmployee;
    vm.clearFields          = clearFields;
    vm.cancelAdd            = cancelAdd;
    vm.querySearchLanguage  = querySearchLanguage;
    vm.generalInfoShowHide  = generalInfoShowHide;
    vm.getSelectedText      = getSelectedText;
    vm.addNewLanguage       = addNewLanguage;
    vm.removeLanguage       = removeLanguage;
    vm.searchLanguage       = [];
    vm.copyCat              = [];
    vm.toggleCard           = toggleCard;
    /* beautify preserve:end */





    // ----------------------------------------------------------------------
    // INVOKING PRIVATE METHODS
    // ----------------------------------------------------------------------

    var getEmployee = $rootScope.$on('employeeIsLoadedEvent', function(event, employee) {
      vm.employee = employee;
      getLanguages();
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
      vm.disabledLanguagesis = true;
      vm.copyCat = angular.copy(vm.createLanguage);
      $rootScope.$emit("callSaveMethodCards", employee);

    }


    function clearFields() {

      vm.employee = {};

    }


    function cancelAdd() {

      vm.disabledLanguagesis = true;
      for (var i = vm.copyCat.length; i < vm.createLanguage.length; i++) {
        vm.createLanguage[i].language = "";
        vm.createLanguage[i].level = "Proficiency...";
      }
      vm.createLanguage = _.initial(vm.createLanguage, vm.createLanguage.length - vm.copyCat.length);

    }


    function querySearchLanguage(query) {

      return autocompleteService.querySearch(query, vm.languages);

    }


    function getLanguages() {

      Employee.getLanguages()
        .then(function(data) {
          vm.languages = data;
          updateAutocompleteLang();
          return autocompleteService.buildList(vm.languages, ['name']);
        }, function(error) {
          $rootScope.showToast('Something gone wrong:', error);
        });

    }


    function updateAutocompleteLang() {

      if (vm.employee.languages !== null && vm.employee.languages !== undefined && vm.employee.languages !== '') {
        vm.createLanguage = angular.fromJson(vm.employee.languages);
        vm.copyCat = angular.copy(vm.createLanguage);
      }

    }


    function removeLanguage(index) {

      vm.createLanguage.splice(index, 1);

    }

    function getSelectedText(data) {

      if (data !== undefined) {
        return data;
      } else {
        return "Proficiency...";
      }

    }

    function addNewLanguage() {

      if (!vm.createLanguage) {
        vm.createLanguage = [];
      }
      vm.createLanguage.push({});

    }


    function fill(employee) {

      var lang = [];
      var i = 0;
      for (i; i < vm.createLanguage.length; i++) {
        lang.push({
          language: vm.createLanguage[i].language,
          level: vm.createLanguage[i].level
        });
      }

      vm.employee.languages = angular.toJson(lang);
      vm.employee.equipments = vm.employee.equipments;
      employee = vm.employee;
      return employee;

    }


    function generalInfoShowHide(data) {

      if (data === 'languages') {
        vm.disabledLanguagesis = false;
      }

    }


  }

})();
