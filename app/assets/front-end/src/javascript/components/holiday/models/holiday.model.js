(function() {

  'use strict';

  angular
    .module('HRA')
    .factory('Holiday', Holiday);

  function Holiday($resource, alertService, apiUrl, errorService) {

    function Holiday() {}

    let url = '';
    let promise = null;
    let resource = null;
    let model = 'Holiday';

    Holiday.getAll = () => {
      url = apiUrl + "/holidays";

      resource = $resource(url, {}, {
        'get': {
          method: 'GET',
          isArray: true
        }
      }).get();

      promise = resource.$promise
        .then(data => data)
        .catch((error) => {
          alertService.error(model, 'getAll');
          errorService.forceLogout(error);
          errorService.notUserFound(error);
        });

      return promise;
    };

    Holiday.getHolidayById = (id) => {

      url = apiUrl + '/holidays/:id';
      resource = $resource(url).get({ id: id });

      promise = resource.$promise
        .then(data => data)
        .catch((error) => {
          alertService.error(model, 'getById');
          errorService.forceLogout(error);
          errorService.notUserFound(error);
        });
      return promise;

    };

    Holiday.save = (data) => {

      url = apiUrl + '/holidays/new';
      resource = $resource(url, {}, {
        'post': {
          method: 'POST'
        }
      }).save(data);

      promise = resource.$promise
        .then((data) => {
          alertService.success(model, 'save');
          return data;
        }).catch((error) => {
          errorService.forceLogout(error);
          alertService.error(model, 'save')
        });

      return promise;

    };

    Holiday.remove = (id) => {

      url = apiUrl + '/holidays:id';
      resource = $resource(url).delete({ id: id });

      promise = resource.$promise
        .then((data) => {
          alertService.success(model, 'remove');
          return data;
        })
        .catch((error) => {
          errorService.forceLogout(error);
          alertService.error(model, 'remove')
        });

      return promise;

    };

    Holiday.update = (holiday) => {

      url = apiUrl + '/holidays/:id';
      let projectId = project.project_id;

      resource = $resource(url, {}, {
        'update': { method: 'PUT' }
      }).update({
        id: holiday.user_id,
        holiday_id: holiday.holiday_id
      }, holiday);

      promise = resource.$promise
        .then((data) => {
          alertService.success(model, 'updateProjects');
          return data;
        })
        .catch((error) => {
          alertService.error(model, 'updateProjects');
          errorService.forceLogout(error);
        });

    };

    return Holiday;

  }

}());
