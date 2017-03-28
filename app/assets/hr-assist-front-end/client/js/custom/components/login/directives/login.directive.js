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
      templateUrl: rootTemplatePath + 'components/login/views/login.form.view.html'
    };
  }



  // login controller
  // ------------------------------------------------------------------------
  angular
    .module('HRA')
    .controller('loginController', loginController);

  loginController.$inject = ['UserFactory', '$state', '$scope', '$window', 'tokenService'];

  function loginController(UserFactory, $state, $scope, $window, tokenService) {
    var vm = this;
    vm.login = login;

    function login(username, password) {
      //var user = false;
      UserFactory.login(username, password).then(function(data) {
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

      }, function(date) {
        console.log('Wrong credentials!');
      });
    }

  }
})();
