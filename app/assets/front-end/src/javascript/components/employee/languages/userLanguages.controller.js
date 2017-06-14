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
    vm.disableSaveBtn = true;
    vm.selectedLanguageLevel = [];
    vm.languagesToAdd = [];
    vm.selectedItem = [];
    vm.languageLvlTxt = [];

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
      vm.languagesToAdd.push({});
    }

    function removeFromQueue(language) {
      let toRemove = _.findWhere(vm.copyUserLanguages, { id: language.id });
      vm.copyUserLanguages = _.without(vm.copyUserLanguages, toRemove);
      languagesToAdd = _.without(languagesToAdd, toRemove);
      languagesToRemove.push(language.id);
      vm.disableSaveBtn = false;
    }

    function cancel() {
      vm.searchText = "";
      vm.copyUserLanguages = [];
      User.getUserLanguages(vm.user)
        .then((data) => {
          vm.userLanguages = data;
          vm.copyUserLanguages.push(...vm.userLanguages);
        });
      vm.disableSaveBtn = true;
    }

    function save() {

      let objToSave = [];
      let levelArr = $.map(vm.selectedLanguageLevel, (value, index) => {
        return [value];
      });
      let languageIdArr = $.map(vm.selectedItem, (value, index) => {
        return [value.id];
      });

      for (let i = 0; i < vm.selectedItem.length; i++) {
        objToSave.push({
          id: languageIdArr[i],
          level: levelArr[i]
        });
        vm.copyUserLanguages.push(vm.selectedItem[i]);
      }

      if (objToSave.length > 0) {
        User.updateLanguages(vm.user, objToSave)
          .then((data) => {
            vm.userLanguages = data;
          });
        objToSave = [];
      }

      if (languagesToRemove.length > 0) {
        User.removeLanguages(vm.user, languagesToRemove);
        languagesToRemove = [];
      }

      vm.showEditLanguages = false;
      vm.disableSaveBtn = true;
      vm.searchText = "";
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

          // for (let j = 0; j < vm.copyUserLanguages.length; j++) {

          //   let promise = new Promise((resolve) => {
          //     resolve(_getLvlTxt(vm.copyUserLanguages[j].level));
          //   });

          //   promise
          //     .then((response) => {
          //       vm.languageLvlTxt.push(response);
          //       for (let i = 0; i < vm.copyUserLanguages.length; i++) {
          //         vm.copyUserLanguages[i].level = _.assign(vm.languageLvlTxt[i], vm.copyUserLanguages[i].level);
          //       }

          //       vm.copyUserLanguages = vm.copyUserLanguages;
          //     });
          // }

        });
    }

    vm.displayEditLanguages = () => {
      vm.showEditLanguages = !vm.showEditLanguages;
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
  }

})(_);
