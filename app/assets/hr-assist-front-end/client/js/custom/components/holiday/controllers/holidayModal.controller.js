 // holidayModal controller
 // ------------------------------------------------------------------------
 angular
   .module('HRA')
   .controller('holidayModal', holidayModal);

 holidayModal
   .$inject = ['$mdDialog', 'data', 'HolidayModel'];

 function holidayModal($mdDialog, data, HolidayModel) {

   var vm = this;
   vm.holiday = data.holiday;
   vm.holidayIndex = data.holidayIndex;

   // if (!data.holiday) {
   //   vm.holiday = new HolidayModel();
   // } else {
   //   vm.holiday = angular.copy(data.holiday);
   // }


   if (data.holidayIndex >= 0) {
     vm.formTitle = 'Edit Holiday';
   } else {
     vm.formTitle = 'Create Holiday';
   }
 }
