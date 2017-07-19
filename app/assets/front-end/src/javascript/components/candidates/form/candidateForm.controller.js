(() => {

  'use strict';

  angular
    .module('HRA')
    .controller('candidateFormCtrl', candidateFormCtrl);

  function candidateFormCtrl($mdDialog, $rootScope, $scope, autocompleteService, Candidate, data, dateService, Project, Technology) {

    let vm = this;
    vm.candidate = data.candidate || {};
    vm.validateDate = false;
    vm.technologies = [];
    vm.candidate.category;
    vm.candidate.technologies = [];
    vm.status = ['applied', 'meeting', 'test', 'accepted', 'failed', 'internship', 'employee'];
    vm.technologiesToAdd = [{}];
    vm.selectedItem = [];

    vm.dateService = dateService;
    vm.save = save;
    vm.addInQueue = addInQueue;
    vm.closeButton = closeButton;
    vm.clearButton = clearButton;
    vm.checkDates = checkDates;
    vm.addNewTechnology = addNewTechnology;
    vm.querySearch = querySearch;


    _getTechnologies();

    function addNewTechnology() {
      vm.technologiesToAdd.push({});
    }

    function addInQueue(item) {
      vm.technologies = _.without(vm.technologies, item);
    }

    function closeButton() {
      $mdDialog.cancel();
    }

    function clearButton() {
      vm.candidate = {};
      vm.technologiesToAdd = [{}];
    }

    vm.candidate.university_start_year = vm.candidate.university_start_year ? vm.dateService.format(vm.candidate.university_start_year) : null;
    vm.candidate.university_end_year = vm.candidate.university_end_year ? vm.dateService.format(vm.candidate.university_end_year) : null;

    function checkDates() {
      if (vm.candidate.university_start_year && vm.candidate.university_end_year && vm.candidate.university_start_year > vm.candidate.university_end_year) {
        vm.validateDate = true;
      } else {
        vm.validateDate = false;
      }
    }


    function querySearch(query, list) {
      return autocompleteService.querySearch(query, list);
    }

    function save(file) {

      let technologiesToAdd = [];
      // let interview = [];
      let interview;
      let cv;

      let levelArr = $.map(vm.selectedTechnologyLevel, (value, index) => {
        if (value) {
          return value;
        }
      });

      let technologiesIdArr = $.map(vm.selectedItem, (value, index) => {
        if (value) {
          return value.id;
        }
      });

      for (let i = 0; i < vm.selectedItem.length; i++) {
        vm.candidate.technologies.push({
          id: technologiesIdArr[i],
          level: levelArr[i]
        });
      }

      if (file != null) {
        for (let i in file) {
          if (file[i] instanceof Array) {
            angular.forEach(file[i], function(value, key) {
              interview.push(value);
            });
          } else if (file[i].type == 'video/mp4' || file[i].type == 'audio/mp3') {
            interview = file[i];
          } else if (file[i].type == 'application/pdf') {
            cv = file[i];
          }
        }
      }

      let dataObj = {
        id: vm.candidate.id,
        candidate_cv: cv,
        university_start_year: vm.candidate.university_start_year,
        university_end_year: vm.candidate.university_end_year,
        name: vm.candidate.name,
        status: vm.candidate.status ? vm.candidate.status : 0,
        projects: vm.candidate.projects,
        contact_info: vm.candidate.contact_info,
        comments: vm.candidate.comments,
        category: vm.candidate.category,
        'audio_files[]': interview
      };
      for (let key in dataObj) {
        if (!dataObj[key] || dataObj[key].length == 0) {
          delete dataObj[key];
        }
      }

      if (dataObj.id) {
        Candidate.update(dataObj).then((resource) => {
          console.log(resource.data);
          $rootScope.$emit('event:candidateAdd', resource.data);
          $mdDialog.cancel();
        });
      } else {
        Candidate.save(dataObj).then((resource) => {
          console.log(resource.data);
          $rootScope.$emit('event:candidateAdd', resource.data);
          $mdDialog.cancel();
        });
      }
    }

    function _getTechnologies() {
      Technology.getAll()
        .then((data) => {
          vm.technologies = data;
          autocompleteService.buildList(vm.technologies, ['name']);
        });
    };

  }

})();
