(function() {

  'use strict';

  // ------------------------------------------------------------------------
  // @employeeSkillsController
  // ------------------------------------------------------------------------

  angular
    .module('HRA')
    .controller('employeeHolidayPreviewController', employeeHolidayPreviewController);

  employeeHolidayPreviewController
    .$inject = ['HolidayModel', '$state', '$window'];





  function employeeHolidayPreviewController(HolidayModel, $state, $window) {

    // ----------------------------------------------------------------------
    // VARIABLES
    // ----------------------------------------------------------------------

    var vm = this;
    var holidayIndex = $state.params.holidayIndex;
    vm.employeeId = $state.params.id;
    vm.holidays = null;





    // ----------------------------------------------------------------------
    // EXPOSED PUBLIC METHODS
    // ----------------------------------------------------------------------

    vm.print = print;



    // ----------------------------------------------------------------------
    // INVOKING PRIVATE METHODS
    // ----------------------------------------------------------------------

    getHoliday();





    // ----------------------------------------------------------------------
    // PUBLIC METHODS DECLARATION
    // ----------------------------------------------------------------------

    function print() {

      var content = document.getElementsByClassName('js-holiday-preview')[0].innerHTML;
      var popupWin = window.open('', '_blank');

      popupWin.document.open();
      popupWin.document.write('<html><head><link rel="stylesheet" href="/styles/importer.css"><style>' +
        '#print-hide {display: none !important;}' +
        '.ng-hide { display: none !important; }' +
        '</style></head><body onload="window.print(); window.close();">' + content + '</body></html>');

      popupWin.document.close();

    }





    // ----------------------------------------------------------------------
    // PRIVATE METHODS DECLARATION
    // ----------------------------------------------------------------------

    function getHoliday() {

      HolidayModel.getHolidayById(holidayIndex).then(
        function(data) {

          vm.holiday = data;

          vm.holiday.intervals = vm.holiday.intervals
            .map(
              function(item) {

                item = angular.fromJson(item);
                item.from = new Date(item.from);
                item.to = new Date(item.to);

                return item;

              });

        },
        function(error) {

          console.log('ERROR: ', error);

        });

    }


  }

}());
