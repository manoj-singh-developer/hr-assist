((_) => {

  'use strict';

  angular
    .module('HRA')
    .controller('userLanguagesCtrl', userLanguagesCtrl);

  function userLanguagesCtrl($rootScope, autocompleteService, User) {

    let vm = this;
    let languagesToRemove = [];
    let initLanguages = [];
    let objToSave = {};

    vm.user = {};
    vm.languages = [];
    vm.userLanguages = [];;
    vm.selectedLanguageLevel = [];
    vm.languagesToAdd = [];
    vm.selectedItem = [];
    vm.disableSaveBtn = true;

    vm.addNewLanguage = addNewLanguage;
    vm.addInQueue = addInQueue;
    vm.removeFromQueue = removeFromQueue;
    vm.save = save;
    vm.cancel = cancel;
    vm.toggleForm = toggleForm;
    vm.getLevelText = getLevelText;

    _getLanguages();

    $rootScope.$on("event:userResourcesLoaded", (event, data) => {
      vm.user = data.user;
      _getUserLanguages();
    });

    function addNewLanguage() {
      vm.languagesToAdd.push({});
    }

    function addInQueue(item) {
      vm.languages = _.without(vm.languages, item);
      _disableSaveBtn(false);
    }

    function removeFromQueue(language) {
      let toRemove = _.findWhere(vm.userLanguages, { language_id: language.language_id });
      vm.userLanguages = _.without(vm.userLanguages, toRemove);

      languagesToRemove.push(language.language_id);
      _disableSaveBtn(false);
    }

    function cancel() {
      vm.searchText = '';
      vm.disableSaveBtn = true;
      vm.selectedItem = [];
      vm.languagesToAdd = [];
      vm.selectedLanguageLevel = [];
      _disableSaveBtn(true);
      toggleForm();
    }

    function save() {
      _getLanguageObject();

      if (objToSave.languages.length) {
        // timeout is used for case when delete and add same language
        // delete shoud execute first then update
        setTimeout(() => {
          User.updateLanguages(vm.user, objToSave).then((data) => {
            objToSave = [];
            _getUserLanguages();
          });
        }, 500);
      }

      if (languagesToRemove.length) {
        User.removeLanguages(vm.user, languagesToRemove).then(() => {
          languagesToRemove = [];
          _getUserLanguages();
        });
      }
      vm.languages = initLanguages;
      cancel();
    }

    function toggleForm() {
      vm.showForm = !vm.showForm;
    }

    function getLevelText(data) {
      switch (data) {
        case 1:
          return "Elementary proficiency";
          break;
        case 2:
          return "Limited working proficiency";
          break;
        case 3:
          return "Professional working proficiency";
          break;
        case 4:
          return "Full professional proficiency";
          break;
        case 5:
          return "Native or bilingual proficiency";
          break;
        default:
          return "Please select your experience level";
      }
    }

    function _getLanguageObject() {
      let languagesToAdd = [];
      vm.selectedItem.forEach((element, index) => {
        languagesToAdd.push({
          id: element.id,
          level: element.level
        });
      });

      objToSave = { languages: languagesToAdd };

      return objToSave;
    }

    function _getLanguages() {
      User.getLanguages()
        .then((data) => {
          vm.languages = data;
          initLanguages = data;
          autocompleteService.buildList(vm.languages, ['long_name']);
        });
    }

    function _getUserLanguages() {
      User.getUserLanguages(vm.user)
        .then((data) => {
          vm.userLanguages = data;
        });
    }

    function _disableSaveBtn(booleanValue) {
      vm.disableSaveBtn = !booleanValue ? booleanValue : true;
    }
  }

})(_);
