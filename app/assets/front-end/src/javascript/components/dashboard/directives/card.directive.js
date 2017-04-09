(function() {

  'use strict';

  // hraCard directive
  // ------------------------------------------------------------------------
  angular
    .module('HRA')
    .directive('hraCard', hraCard);

  function hraCard() {
    return {
      restrict: 'EA',
      scope: {},
      bindToController: {
        card: '=',
      },
      controller: 'dashboardInfoController',
      controllerAs: 'dashboardInfo',
      templateUrl: rootTemplatePath + '/dashboard/views/card.view.html'
    };
  }



  // dashboardInfoController controller
  // ------------------------------------------------------------------------
  angular
    .module('HRA')
    .controller('dashboardInfoController', dashboardInfoController);

  dashboardInfoController
    .$inject = ['$rootScope', '$scope', '$stateParams', 'Employee', 'Equipments', 'skillModel', 'ProjectModel', 'HolidayModel'];

  function dashboardInfoController($rootScope, $scope, $stateParams, Employee, Equipments, skillModel, ProjectModel, HolidayModel) {


    var vm = this;
    vm.list = [];
    vm.counter = 0;
    checkCardType();

    // Public methods
    // ------------------------------------------------------------------------


    // Public methods declaration
    // ------------------------------------------------------------------------

    // Private methods declaration
    // ------------------------------------------------------------------------
    function checkCardType() {
      switch (vm.card.type) {
        case 'employee':
          getAllEmployyes();
          break;

        case 'project':
          getAllProjects();
          break;

        case 'holiday':
          getAllHolidays();
          break;

        case 'equipment':
          getAllEquipments();
          break;

        case 'skills':
          getAllSkills();
          break;
      }
    }

    function getAllEmployyes() {
      Employee.getAll().then(
        function(data) {

          vm.counter = data.length;
        },
        function() {

        });
    }


    function getAllProjects() {
      ProjectModel.getAll().then(
        function(data) {

          vm.counter = data.length;
        },
        function() {

        });
    }

    function getAllHolidays() {
      HolidayModel.getAll().then(
        function(data) {
          vm.counter = data.length;
        },
        function(data) {});
    }

    function getAllEquipments() {
      Equipments.list().then(
        function(data) {
          vm.counter = data.length;
        },
        function() {

        });
    }

    function getAllSkills() {
      skillModel.getAll().then(
        function(data) {
          vm.counter = data.length;
        },
        function() {

        });
    }

    function getAllProjects() {
      ProjectModel.getAll().then(
        function(data) {
          vm.counter = data.length;
        },

        function(err) {
          console.log(err);
        });
    }
  }

}());
