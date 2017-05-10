(function() {

  'use strict';


  // login directive
  // ------------------------------------------------------------------------
  angular
    .module('HRA')
    .directive('hralogin', hraLogindDrectives);

  function hraLogindDrectives() {
    return {
      restrict: 'EA',
      scope: {},
      controller: 'loginController',
      controllerAs: 'loginCtrl',
      templateUrl: rootTemplatePath + 'login/views/login.form.view.html'
    };
  }



  // login controller
  // ------------------------------------------------------------------------
  angular
    .module('HRA')
    .controller('loginController', loginController);


  function loginController(UserFactory, $state, $scope, $window, tokenService, $rootScope, $timeout) {
    var vm = this;
    vm.login = login;
    vm.loginError = false;

    function login(username, password) {
      //var user = false;
      UserFactory.login(username, password)
        .then(function(data) {
          
          vm.error = data.message;
          if(data.status === 'error') {
            vm.loginError = true;
          }

          $timeout(() => {
            vm.loginError = false;
          }, 3000);

          if (data.status === "error") return;
          vm.user = data.user;

          // Set two tokens
          var userInfoToken = data.custom_token;
          var authToken = data.user.auth_token;

          // IMPORTANT
          // userInfoToken goes first
          //authToken is second
          tokenService.setTokens([userInfoToken, authToken]);

          $state.go('employeesParent.details', {
            id: vm.user.id
          });

        });
    }

  }
})();
