(() => {

  'use strict';

  angular
    .module('HRA')
    .controller('userDetailsCtrl', userDetailsCtrl);

  userDetailsCtrl
    .$inject = ['$rootScope', '$scope', '$q', '$stateParams', 'User', 'Technology', 'Project'];

  function userDetailsCtrl($rootScope, $scope, $q, $stateParams, User, Technology, Project) {

    let vm = this;
    vm.resources = {};
    vm.formTitle = 'User Profile';


    _getResources();
    $rootScope.$on('event:toggleCard', _scrollToCard);


    function _scrollToCard(event, card, action) {
      if (action === 'open') {
        card.addClass('is-opened');
      }

      if (action === 'close') {
        card.removeClass('is-opened');

        angular.element('html, body').animate({
          scrollTop: card.offset().top - 100
        }, 500);
      }
    }


    function _getResources() {
      let promises = [];
      promises.push(User.getById($stateParams.id));
      promises.push(User.getAll());
      promises.push(Technology.getAll());
      promises.push(Project.getAll());
      promises.push(User.getLanguages());
      promises.push(User.getEducations($stateParams.id));
      
      $q.all(promises).then((data) => {
        vm.resources.user = data[0];
        vm.resources.users = data[1];
        vm.resources.technologies = data[2];
        vm.resources.projects = data[3];
        vm.resources.languages = data[4];
        vm.resources.educations = data[5];
        $rootScope.$emit("event:userResourcesLoaded", vm.resources);

      });
    }

  }

})();
