((_) => {

  'use strict';

  angular
    .module('HRA')
    .controller('userLanguagesCtrl', userLanguagesCtrl);

  function userLanguagesCtrl($rootScope, autocompleteService, User) {

    let vm = this;
    let languagesToRemove = [];
    let initLanguages = [];
    vm.disableSaveBtn = true;

    vm.user = {};
    vm.languages = [];
    vm.userLanguages = [];
    vm.copyUserLanguages = [];
    vm.selectedLanguageLevel = [];
    vm.languagesToAdd = [];
    vm.selectedItem = [];

    vm.addNewLanguage = addNewLanguage;
    vm.addInQueue = addInQueue;
    vm.removeFromQueue = removeFromQueue;
    vm.save = save;
    vm.cancel = cancel;
    vm.toggleForm = toggleForm;

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
      let toRemove = _.findWhere(vm.copyUserLanguages, { language_id: language.language_id });
      vm.copyUserLanguages = _.without(vm.copyUserLanguages, toRemove);

      languagesToRemove.push(language.language_id);
      _disableSaveBtn(false);
    }

    function cancel() {
      vm.searchText = '';
      vm.disableSaveBtn = true;
      vm.selectedItem = [];
      vm.languagesToAdd = [];
      vm.selectedLanguageLevel = [];
      _getUserLanguages();
      _disableSaveBtn(true);
      toggleForm();
    }

    function save() {
      let languagesToAdd = [];
      let levelArr = $.map(vm.selectedLanguageLevel, (value, index) => {
        return [value];
      });
      let languageIdArr = $.map(vm.selectedItem, (value, index) => {
        return [value.id];
      });

      for (let i = 0; i < vm.selectedItem.length; i++) {
        languagesToAdd.push({
          id: languageIdArr[i],
          level: levelArr[i]
        });
      }

      let objToSave = { languages: languagesToAdd };

      if (objToSave.languages.length) {
        User.updateLanguages(vm.user, objToSave)
          .then((data) => cancel());
        objToSave = [];
      }

      if (languagesToRemove.length) {
        User.removeLanguages(vm.user, languagesToRemove).then(() => {
          cancel();
        });
        languagesToRemove = [];
      }
      vm.languages = initLanguages;

    }

    function toggleForm() {
      vm.showForm = !vm.showForm;
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
      vm.copyUserLanguages = [];
      User.getUserLanguages(vm.user)
        .then((data) => {
          vm.userLanguages = data;
          vm.copyUserLanguages.push(...vm.userLanguages);
          for (let j = 0; j < vm.copyUserLanguages.length; j++) {
            vm.copyUserLanguages[j].level = _getLvlTxt(vm.copyUserLanguages[j].level);
          }

        });
    }

    function _getLvlTxt(data) {
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

    function _disableSaveBtn(booleanValue) {
      vm.disableSaveBtn = !booleanValue ? booleanValue : true;
    }
  }

})(_);
