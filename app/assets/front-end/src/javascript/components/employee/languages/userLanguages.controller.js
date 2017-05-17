((_) => {

  'use strict';

  angular
    .module('HRA')
    .controller('userLanguagesCtrl', userLanguagesCtrl);

  userLanguagesCtrl
    .$inject = ['$rootScope', 'autocompleteService', 'User'];

  function userLanguagesCtrl($rootScope, autocompleteService, User) {

    let vm = this;
    let languagesToAdd = [];
    let languagesToRemove = [];
    vm.user = {};
    vm.languages = [];
    vm.userLanguages = [];
    vm.copyUserLanguages = [];
    vm.addNewLanguage = addNewLanguage;

    vm.levels = [
      "Elementary proficiency",
      "Limited working proficiency",
      "Professional working proficiency",
      "Full professional proficiency",
      "Native or bilingual proficiency"
    ];

    vm.addInQueue = addInQueue;
    vm.removeFromQueue = removeFromQueue;
    vm.save = save;
    vm.cancel = cancel;
    vm.showEditLanguages = false;

    _getLanguages();


    $rootScope.$on("event:userResourcesLoaded", (event, data) => {
      vm.user = data.user;
      _getUserLanguages();
    });

    function addNewLanguage() {
      if (!vm.languagesToAdd) {
        vm.languagesToAdd = [];
      }
      vm.languagesToAdd.push({});

    }

    function addInQueue(language) {

      if (language) {
        let notToAdd = _.findWhere(vm.copyUserLanguages, { id: language.id });
        if(notToAdd === undefined){
          let toRemove = _.findWhere(languagesToRemove, { id: language.id });
          languagesToRemove = _.without(languagesToRemove, toRemove);
          languagesToAdd.push(language);
          vm.copyUserLanguages.push(language);
        }
      vm.searchText = "";  
      }
    }

    function removeFromQueue(language) {
      let toRemove = _.findWhere(vm.copyUserLanguages, { id: language.id });
      vm.copyUserLanguages = _.without(vm.copyUserLanguages, toRemove);
      languagesToAdd = _.without(languagesToAdd, toRemove);
      languagesToRemove.push(language.id);
    }

    function cancel(){
      vm.searchText = "";
      vm.copyUserLanguages = [];
      User.getUserLanguages(vm.user)
      .then((data) => {
        vm.userLanguages = data;
        vm.copyUserLanguages.push(...vm.userLanguages);
      });
    }

    function save() {

      if (languagesToAdd.length > 0) {
        User.updateLanguages(vm.user, languagesToAdd)
          .then((data) => {
            vm.userLanguages = data;
          });
          languagesToAdd = [];
      }

      if (languagesToRemove.length > 0) {
        User.removeLanguages(vm.user, languagesToRemove);
        languagesToRemove = [];
      }

      vm.showEditLanguages = false;
    }


    function _getLanguages() {
      User.getLanguages()
        .then((data) => {
          vm.languages = data;
          autocompleteService.buildList(vm.languages, ['long_name']);
      });
    }

    function _getUserLanguages() {
      User.getUserLanguages(vm.user)
      .then((data) => {
        vm.userLanguages = data;
        vm.copyUserLanguages.push(...vm.userLanguages);
      });
    }

    vm.displayEditLanguages = () => {
      vm.showEditLanguages = !vm.showEditLanguages;
    }

  }

})(_);
