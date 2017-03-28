 // projectsCreateModal controller
 // ------------------------------------------------------------------------
 angular
   .module('HRA')
   .controller('projectModal', projectModal);

 projectModal
   .$inject = ['$mdDialog', 'data'];

 function projectModal($mdDialog, data) {

   var vm = this;
   vm.project = angular.copy(data.project);
   vm.projectIndex = data.projectIndex;

   if (data.projectIndex >= 0) {
     vm.formTitle = 'Edit Form';
   } else {
     vm.formTitle = 'Create Form';
   }

 }
