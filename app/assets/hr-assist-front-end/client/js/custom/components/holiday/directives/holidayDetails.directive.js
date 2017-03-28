(function() {

  'use strict';



  // hraHolidayDetails directive
  // ------------------------------------------------------------------------
  angular
    .module('HRA')
    .directive('hraHolidayDetails', hraHolidayDetails);

  function hraHolidayDetails() {
    return {
      restrict: 'EA',
      scope: {},
      controller: 'holidayDetailsController',
      controllerAs: 'holidayDetails',
      templateUrl: rootTemplatePath + 'components/holiday/views/holidayDetails.view.html'
    };
  }



  // holidayDetailsController controller
  // ------------------------------------------------------------------------
  angular
    .module('HRA')
    .controller('holidayDetailsController', holidayDetailsController);

  holidayDetailsController
    .$inject = ['$rootScope', '$scope', '$stateParams', 'HolidayModel', '$mdToast'];

  function holidayDetailsController($rootScope, $scope, $stateParams, HolidayModel, $mdToast) {

    var vm = this;
    vm.viewLists = null;
    vm.viewObject = null;
    var ids = $stateParams.id;



    // public methods
    // ------------------------------------------------------------------------
    vm.getHolidays = getHolidays;



    // public methods declaration
    // ------------------------------------------------------------------------

    function getHolidays() {
      HolidayModel.getAll().then(
        function(res) {
          vm.viewObject = res.filter(function(obj) {
            return obj.id == ids;
          });
        },
        function(err) {
          $rootScope.showToast('Error on loading data! Please refresh!');
        });
    };
    vm.getHolidays();

    return ($scope.se = vm);
  }

}());
