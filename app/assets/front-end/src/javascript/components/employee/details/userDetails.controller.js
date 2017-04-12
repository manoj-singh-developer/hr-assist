(function() {

  'use strict';

  // ------------------------------------------------------------------------
  // @userDetailsController
  // ------------------------------------------------------------------------
  angular
    .module('HRA')
    .controller('userDetailsController', userDetailsController);

  userDetailsController
    .$inject = ['$rootScope', '$scope', '$stateParams', 'User', 'Position', 'Technology', 'Project'];





  function userDetailsController($rootScope, $scope, $stateParams, User, Position, skillModel, Project) {

    // ----------------------------------------------------------------------
    // VARIABLES
    // ----------------------------------------------------------------------

    var vm = this;
    var userId = $stateParams.id;
    vm.userResources = {};
    vm.formTitle = 'User Profile';
    //vm.saveUser = saveUser;
    vm.allPositions = [];




    // ----------------------------------------------------------------------
    // EXPOSED PUBLIC METHODS
    // ----------------------------------------------------------------------



    // ----------------------------------------------------------------------
    // INVOKING PRIVATE METHODS
    // ----------------------------------------------------------------------

    getUserResources();
    $rootScope.$on('event:toggleCard', scrollToCard);





    // ----------------------------------------------------------------------
    // PUBLIC METHODS
    // ----------------------------------------------------------------------





    // ----------------------------------------------------------------------
    // PRIVATE METHODS DECLARATION
    // ----------------------------------------------------------------------

    function scrollToCard(event, card, action) {

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


    // ----------------------------------------------------------------------
    //  START LOADING EMPLOYEE RESOURCES

    function getUserResources() {

      User.getById(userId, vm.candidate)
        .then(getUserById)
        // .then(getAllSkills)
        // .then(getAllProjects)
        // .then(getAllUsers)
        // .then(getAllHolidays)
        .catch(handleErrorChain);
      // User.getAllUsers(vm.candidate)
      //   .then(getAllPositions)
      //   .catch(handleErrorChain);
      User.getPositionById(userId)
        .then(getUserPositionById)
        .catch(handleErrorChain);

      User.getScheduleById(userId)
        .then(getUserScheduleById)
        .catch(handleErrorChain);

    }

    function getPositionResource(){
      Position.getAll()
      .then(getAllPositions)
      .catch(handleErrorChain);;
    }

    function getAllPositions(positions){
      vm.allPositions = positions;
      resourcesAreLoaded();
    }


    function getUserById(user) {
      console.log('CONTROLLER: Load user by id');
      vm.user = user;
      vm.progress = getProfileProgress(vm.user);
      
    }

     function getUserScheduleById(userSchedule) {
      vm.userSchedule = userSchedule;
      getPositionResource();
    }

    function getUserPositionById(userPosition) {
      vm.userPosition = userPosition;
    }

    function getAllSkills(skills) {

      console.log('CONTROLLER: Load all skills');
      vm.userResources.skills = skills;

      return ProjectModel.getAll();

    }


    function getAllProjects(projects) {

      console.log('CONTROLLER: Load all projects');
      vm.userResources.projects = projects;

      return User.getAll();

    }


    function getAllUsers(users) {

      console.log('CONTROLLER: Load all users');
      vm.userResources.users = users;

      return HolidayModel.getAll();

    }


    function getAllHolidays(holidays) {

      console.log('CONTROLLER: Load all holidays');
      vm.userResources.holidays = holidays;

      resourcesAreLoaded();

    }

    function resourcesAreLoaded() {
      // Sa scap de primele doua si sa ramana doar ultima
      $rootScope.$emit("userIsLoadedEvent", vm.user, vm.userPosition,vm.userSchedule,  vm.allPositions, vm.candidate, vm.progress);

      $rootScope.$emit("event:userIsLoaded", vm.user, vm.userPosition, vm.userSchedule, vm.allPositions, vm.candidate, vm.progress);

      $rootScope.$emit("event:userResourcesLoaded", vm.userResources, vm.userSchedule, vm.position, vm.user, vm.candidate, vm.progress);
    }


    function getProfileProgress(data) {

      console.log('CONTROLLER: Get profile progress');
      var allPropertiesLength = Object.keys(data).length;
      var completedPropertiesLength = '';
      var completedProperties = [];
      var profileProgress = 0;

      angular.forEach(data, function(value) {
        if (value) {
          completedProperties.push(value);
        }
      });

      completedPropertiesLength = completedProperties.length;
      profileProgress = completedPropertiesLength / allPropertiesLength * 100;
      return Math.round(profileProgress);

    }


    function handleErrorChain(error) {

      console.log('Error: ', error);

    }

    //  END LOADING EMPLOYEE RESOURCES
    // ----------------------------------------------------------------------





    var update = $rootScope.$on('callSaveMethodCardsUsers', function(event, user) {
      // Update profile progress bar
      // Progress function ar putea fi pusa la comun poate
      vm.progress = getProfileProgress(user);
      $rootScope.$emit("event:updateProgress", vm.progress);

      var currentUser = angular.copy(user);
      if (!user.id) {
        User.create(currentUser);
        return User.save(currentUser, vm.candidate).then(
          function(data) {

            $rootScope.showToast('User created successfuly!');
            // addUsedEquipment();
            User.getById(data.id, vm.candidate).then(function(data) {
              onSaveSuccess('save', User.create(data));
            }, function() {
              // De facut si la eroare
            });

            vm.user = {};
          },
          function(error) {
            $rootScope.showToast('User creation failed!');
            onSaveError(error);
          });
      } else {
        return User.update(currentUser, vm.candidate).then(
          function() {
            $rootScope.showToast('User updated successfuly!');
            User.getById(currentUser.id, vm.candidate).then(function(data) {
              onSaveSuccess('update', data);

            }, function() {

              // De facut si la eroare
            });
          },
          function(error) {
            $rootScope.showToast('User update failed!', error);
            onSaveError();
          });
      }
    });

    // merge dar probabil nu este cea mai buna varianta(pentru a face doar
    //un update
    $scope.$on('$destroy', function() {
      update();
    });

    function onSaveSuccess(action, user) {
      vm.btnIsDisabled = false;
      vm.serverErrors = false;
      $rootScope.$broadcast('usersListChanged', [action, user]);
      $rootScope.$emit("event:userDetailsUpdated", user);
    }

    function onSaveError(message) {
      vm.btnIsDisabled = false;
      vm.serverErrors = true;
      vm.serverErrorsArray = message;
    }

  }

}());
