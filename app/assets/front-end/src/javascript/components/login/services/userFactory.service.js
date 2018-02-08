(function() {

  'use strict';

  // login services request
  // ------------------------------------------------------------------------

  angular
    .module('HRA')
    .factory('UserFactory', UserFactory);

  UserFactory.$inject = ['$q', '$http', 'apiUrl', '$window', '$resource'];

  function UserFactory($q, $http, apiUrl, $window, $resource) {
    // Public API here
    return {
      login: login
    };

    function login(username, password) {
      var myInfo = {};
      myInfo.email = username;
      myInfo.password = password;

      function promise(resolve, reject) {
        loginMethod(myInfo).$promise.then(
          function(data) {
            return resolve(data);
          },
          function(error) {
            return reject(error);
          });
      }
      return $q(promise);
    }

    function loginMethod(data) {
      var url = apiUrl + "/login";
      return $resource(url).save(data);
    }
  }
})();
