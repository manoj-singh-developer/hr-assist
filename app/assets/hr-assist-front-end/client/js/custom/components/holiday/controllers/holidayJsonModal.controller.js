 // employeesCreateModal controller
 // ------------------------------------------------------------------------
 angular
   .module('HRA')
   .controller('holidayJsonModal', holidayJsonModal);

 holidayJsonModal
   .$inject = ['$mdDialog', '$rootScope', 'HolidayModel'];

 function holidayJsonModal($mdDialog, $rootScope, HolidayModel) {

   var vm = this;



   // Public methods
   // ------------------------------------------------------------------------
   vm.saveFromJson = saveFromJson;
   vm.clearFields = clearFields;
   vm.closeDialog = closeDialog;



   // Public methods declaration
   // ------------------------------------------------------------------------
   function saveFromJson(json) {
     if (json) {
       json = angular.fromJson(json);

       HolidayModel.savefromJson(json).then(
         function(data) {
           $rootScope.$broadcast('holidaysListChanged', ['saveFromJson', data]);
           $rootScope.showToast('Successfully added holiday from json!');
         },
         function(error) {});
     } else {
       console.log('Empty json!');
     }
   }

   function clearFields() {
     vm.json = '';
   }

   function closeDialog() {
     $mdDialog.cancel();
   }

 }
