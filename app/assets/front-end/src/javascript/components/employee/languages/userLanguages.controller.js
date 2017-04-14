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
        let toRemove = _.findWhere(languagesToRemove, { id: language.id });
        languagesToRemove = _.without(languagesToRemove, toRemove);
        languagesToAdd.push(language);
        vm.userLanguages.push(language);
        vm.searchText = "";
      }
    }

    function removeFromQueue(language) {
      let toRemove = _.findWhere(vm.userLanguages, { id: language.id });
      vm.userLanguages = _.without(vm.userLanguages, toRemove);
      languagesToAdd = _.without(languagesToAdd, toRemove);
      languagesToRemove.push(language);
    }

    function save() {
      if (languagesToAdd.length) {
        User.updateLanguages(vm.user, languagesToAdd)
          .then(() => {
            _getUserLanguages();
            vm.toggleForm();
          });
      }

      if (languagesToRemove.length) {
        User.removeLanguages(vm.user, languagesToRemove)
          .then(() => {
            _getUserLanguages();
            vm.toggleForm();
          });
      }
    }


    function _getLanguages() {
      User.getLanguages().then((data) => {
        vm.languages = data;
        autocompleteService.buildList(vm.languages, ['long_name']);
      });
    }

    function _getUserLanguages() {
      User.getUserLanguages(vm.user).then((data) => {
        vm.userLanguages = data;
      });
    }

  }

})(_);
