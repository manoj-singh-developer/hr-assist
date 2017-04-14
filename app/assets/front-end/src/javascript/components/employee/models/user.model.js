(() => {

    'use strict';

    angular
      .module('HRA')
      .factory('User', User);

    User
      .$inject = ['$resource', 'apiUrl', 'alertService'];

    function User($resource, apiUrl, alertService) {

      function User() {}


      let url = '';
      let promise = null;
      let resource = null;
      let model = 'User';


      User.save = (data) => {
        url = apiUrl + '/users/new';
        resource = $resource(url, {}, {
          'post': {
            method: 'POST'
          }
        }).save(data);

        promise = resource.$promise
          .then((data) => {
            alertService.success(model, 'save');
            return data;
          }).catch(() => alertService.error(model, 'save'));

        return promise;
      };

      User.update = (data) => {
        url = apiUrl + '/users/:id';
        resource = $resource(url, {}, {
          'update': { method: 'PUT' }
        }).update({ id: data.id }, data);

        promise = resource.$promise
          .then((data) => {
            alertService.success(model, 'update');
            return data;
          })
          .catch(() => alertService.error(model, 'update'));

        return promise;
      };

      User.getById = (id) => {
        url = apiUrl + '/users/:id';
        resource = $resource(url).get({ id: id });

        promise = resource.$promise
          .then(data => data)
          .catch(() => alertService.error(model, 'getById'));
        return promise;
      };

      User.getAll = () => {
        url = apiUrl + '/users';
        resource = $resource(url, {}, {
          'get': {
            method: 'GET',
            isArray: false
          }
        }).get();

        promise = resource.$promise
          .then(data => data.items)
          .catch(() => alertService.error(model, 'getAll'));

        return promise;
      };

      User.remove = (id) => {
        url = apiUrl + '/users/:id';
        resource = $resource(url).delete({ id: id });

        promise = resource.$promise
          .then((data) => {
            alertService.success(model, 'remove');
            return data;
          })
          .catch(() => alertService.error(model, 'remove'));

        return promise;
      };


      User.getSchedule = (user) => {
        url = apiUrl + '/users/:id/schedule';
        resource = $resource(url).get({ id: user.id });

        promise = resource.$promise
          .then(data => data)
          .catch(() => alertService.error(model, 'getSchedule'));
        return promise;
      };

      User.updateSchedule = (id, schedule) => {
        url = apiUrl + '/users/:id/schedule/:idSchedule';
        resource = $resource(url, {}, {
          'update': { method: 'PUT' }
        }).update({ id: id, idSchedule: schedule.id }, schedule);

        promise = resource.$promise
          .then((data) => {
            alertService.success(model, 'update');
            return data;
          })
          .catch(() => alertService.error(model, 'update'));

        return promise;
      };


      User.getPosition = (user) => {
        // TODO:  Something is wrong with this one in api
        url = apiUrl + '/users/:id/position';
        resource = $resource(url, {}, {
          'get': {
            method: 'GET',
            isArray: false
          }
        }).get({ id: user.id });

        promise = resource.$promise
          .then(data => data)
          .catch(() => alertService.error(model, 'getPosition'));

        return promise;
      };

      User.updatePosition = (user, position) => {
        url = apiUrl + '/users/:id/position';
        resource = $resource(url, {}, {
          'update': { method: 'PUT' }
        }).update({ id: user.id }, { position_id: position.id });

        promise = resource.$promise
          .then((data) => {
            alertService.success(model, 'updatePosition');
            return data;
          })
          .catch(() => alertService.error(model, 'updatePosition'));

        return promise;
      };


      User.getDevices = () => {

      };

      User.updateDevices = () => {

      };

      User.removeDevices = () => {

      };


      User.getLanguages = () => {

      };

      User.updateLanguages = () => {

      };

      User.removeLanguages = () => {

      };


      User.getEducations = () => {

      };

      User.updateEducations = () => {

      };

      User.removeEducations = () => {

      };


      User.getProjects = (user) => {
        url = apiUrl + '/users/:id/projects';
        resource = $resource(url).get({ id: user.id });
        promise = resource.$promise
          .then(data => data.items)
          .catch(() => alertService.error(model, 'getProjects'));

        return promise;
      };

    User.updateProjects = () => {

    };

    User.removeProjects = () => {

    };


    User.getHolidays = () => {

    };

    User.updateHolidays = () => {

    };

    User.removeHolidays = () => {

    };

    return User;

  }

})();
