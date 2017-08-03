(() => {

  'use strict';

  angular
    .module('HRA')
    .controller('candidateFormCtrl', candidateFormCtrl);

  function candidateFormCtrl($mdDialog, $rootScope, $scope, autocompleteService, Candidate, dateService, Project, Technology, data) {

    let vm = this;
    let candidateCv;
    let technologiesToRemove = [];
    let filesToRemove = [];
    let technologiesToAdd = [];
    let interview = [];
    let dataObj = {};

    vm.selectedTechnologyLevel = [];
    vm.selectedItem = [];

    vm.candidate = data.candidate || {};
    vm.candidateTechnologies = vm.candidate.technologies;
    vm.candidateFiles = vm.candidate.candidate_files;
    vm.validateDate = false;
    vm.technologies = [];
    vm.candidate.category = (vm.candidate.category || vm.candidate.category === 0) ? vm.candidate.category : null;
    vm.candidate.technologies = [];
    vm.status = ['applied', 'meeting', 'test', 'accepted', 'failed', 'internship', 'employee'];
    vm.technologiesToAdd = [{}];
    vm.selectedTechnologies = [];

    vm.dateService = dateService;
    vm.save = save;
    vm.closeButton = closeButton;
    vm.clearButton = clearButton;
    vm.checkDates = checkDates;
    vm.addNewTechnology = addNewTechnology;
    vm.querySearch = querySearch;
    vm.addInQueue = addInQueue;
    vm.removeFromQueue = removeFromQueue;
    vm.removeFromQueueFile = removeFromQueueFile;


    _getTechnologies();

    function addNewTechnology() {
      vm.technologiesToAdd.push({});
    }

    function addInQueue(item) {
      vm.technologies = _.without(vm.technologies, item);
    }

    function removeFromQueue(technology) {
      let toRemove = _.findWhere(vm.candidateTechnologies, { technology_id: technology.technology_id });
      vm.candidateTechnologies = _.without(vm.candidateTechnologies, toRemove);

      technologiesToRemove.push(technology.technology_id);

    }

    function removeFromQueueFile(file) {
      let toRemove = _.findWhere(vm.candidateFiles, { id: file.id });
      vm.candidateFiles = _.without(vm.candidateFiles, toRemove);

      filesToRemove.push(file.id);

    }

    function closeButton() {
      $mdDialog.cancel();
    }

    function clearButton() {
      vm.candidate = {};
      vm.technologiesToAdd = [{}];
    }

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


    function save(files) {


      if (files != null) {

        for (let i in files) {

          if (files[i] instanceof Array) {

            angular.forEach(files[i], function(value, key) {
              if (value.type == 'video/mp4' || value.type == 'audio/mp3') {
                interview.push(value);
              }
            });

          } else if (files[i].type == 'application/pdf' || files[i].type == 'application/msword' || files[i].type == 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
            candidateCv = files[i];
          }

        }

      }

      _formatDate();
      _createTechnologiesObj();
      _createDataObject();

      if (dataObj.id) {

        if (technologiesToRemove.length) {
          Candidate.removeTechnologies(vm.candidate, technologiesToRemove).then(() => {
            _sendEventNotify('candidateTechRemoved', technologiesToRemove);
            technologiesToRemove = [];
          });

        } else if (filesToRemove.length) {
          Candidate.removeFiles(vm.candidate, filesToRemove).then(() => {
            _sendEventNotify('candidateFilesRemoved', filesToRemove);
            filesToRemove = [];
          });

        } else {
          Candidate.update(dataObj).then((resource) => {
            _sendEventNotify('candidateEdited', resource.data.items);
          });
        }

      } else if (dataObj) {
        Candidate.save(dataObj).then((resource) => {
          _sendEventNotify('candidateAdd', resource.data.items);
        });
      }
      $mdDialog.cancel();
    }

    function _getTechnologies() {
      Technology.getAll()
        .then((data) => {
          vm.technologies = data;
          autocompleteService.buildList(vm.technologies, ['name']);
        });
    }

    function _formatDate() {
      vm.candidate.university_start_year = vm.candidate.university_start_year ? vm.dateService.format(vm.candidate.university_start_year) : null;
      vm.candidate.university_end_year = vm.candidate.university_end_year ? vm.dateService.format(vm.candidate.university_end_year) : null;
    }

    function _getArrayFromObj(obj) {
      return $.map(obj, (value, index) => {
        if (value) {
          return value;
        }
      });
    }

    function _createTechnologiesObj() {
      let levelArr = _getArrayFromObj(vm.selectedTechnologyLevel);
      let technologiesName = _getArrayFromObj(vm.searchTechnology);
      for (let i = 0; i < technologiesName.length; i++) {
        vm.candidate.technologies.push({
          technology_id: vm.selectedItem[i] ? vm.selectedItem[i].id : null,
          technology_name: technologiesName[i],
          technology_level: (technologiesName[i] && levelArr[i]) ? levelArr[i] : 0
        });
      }
      return vm.candidate.technologies;
    }

    function _createDataObject() {
      dataObj = {
        id: vm.candidate.id,
        candidate_cv: candidateCv,
        university_start_year: vm.candidate.university_start_year,
        university_end_year: vm.candidate.university_end_year,
        name: vm.candidate.name,
        technologies: vm.candidate.technologies,
        status: vm.candidate.status ? vm.candidate.status : '0',
        projects: vm.candidate.projects,
        contact_info: vm.candidate.contact_info,
        comments: vm.candidate.comments,
        category: vm.candidate.category,
        audio_files: interview
      };

      for (let key in dataObj) {
        if (!dataObj[key] || dataObj[key].length == 0) {
          delete dataObj[key];
        }
      }
      return dataObj;
    }

    function _sendEventNotify(eventName, data) {
      $rootScope.$emit('event:' + eventName, data);
    }
  }

})();
