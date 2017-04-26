(function() {

  'use strict';

  // ------------------------------------------------------------------------
  // @userEducationController
  // ------------------------------------------------------------------------

  angular
    .module('HRA')
    .controller('userEducationController', userEducationController);

  userEducationController
    .$inject = ['$rootScope', '$scope', '$stateParams', 'User', 'autocompleteService', 'miscellaneousService'];





  function userEducationController($rootScope, $scope, $stateParams, User, autocompleteService, miscellaneousService) {

    // ----------------------------------------------------------------------
    // VARIABLES
    // ----------------------------------------------------------------------

    var vm = this;
    vm.userEducationList = [];
    vm.userEducations = [];
    vm.showEditEducation = false;



    // ----------------------------------------------------------------------
    // INVOKING PRIVATE METHODS
    // ----------------------------------------------------------------------

    var getUser = $rootScope.$on('event:userResourcesLoaded', function(event, resources) {
      vm.user = resources.user;
      vm.userEducations = resources.educations;
      initEducations();
    });


    // ----------------------------------------------------------------------
    // EXPOSED PUBLIC METHODS
    // ----------------------------------------------------------------------

    vm.removeEducation = removeEducation;
    vm.addNewEducation = addNewEducation;
    vm.save = save;
    vm.cancelAdd = cancelAdd;
    vm.displayEditEducation = displayEditEducation;





    // ----------------------------------------------------------------------
    // PUBLIC METHODS DECLARATION
    // ----------------------------------------------------------------------

    function displayEditEducation() {

       vm.showEditEducation = !vm.showEditEducation;
    }


    function addNewEducation() {
      vm.userEducationList.push({});
    }

    function removeEducation(index) {
      if(index < vm.userEducations.length)
      {
        let obj = {"education_ids": Array.of(vm.userEducations[index].id)};
        User.removeEducations(vm.user.id, obj);

        vm.userEducations.splice(index,1);
        vm.userEducationList.splice(index,1);
      }
      else
        vm.userEducationList.splice(index,1);
    }

    function save() {

      var saveEducationsObj = {};
      var updateEducationsObj = {};
      saveEducationsObj["educations"] = [];
      updateEducationsObj["educations"] = [];
      
      vm.userEducationList.forEach(function(value,index){
        if(index < vm.userEducations.length){
          if(JSON.stringify(vm.userEducations[index]) !== JSON.stringify(value))
            updateEducationsObj["educations"].push(value);
        }
        else
          saveEducationsObj["educations"].push(value);
      });

      if(updateEducationsObj["educations"].length !== 0)
        User.updateEducations(vm.user.id, updateEducationsObj).then((data) => {
          vm.userEducations = data;
          initEducations();
        });

      if(saveEducationsObj["educations"].length !== 0)
        User.saveEducations(vm.user.id, saveEducationsObj).then((data) => {
          vm.userEducations = data;
          initEducations();
        });

    }

    function cancelAdd() {
      vm.userEducationList = [];
      vm.userEducationList = _.map(vm.userEducations, _.clone);
    }





    // ----------------------------------------------------------------------
    // Private methods declaration
    // ----------------------------------------------------------------------
    function initEducations(){
      vm.userEducationList = _.map(vm.userEducations, _.clone);
    }
  }

}());
