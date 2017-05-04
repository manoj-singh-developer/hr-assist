(() => {

  'use strict';

  angular
    .module('HRA')
    .factory('User', User);

  User
    .$inject = ['$resource', 'apiUrl', 'alertService', '$stateParams'];

  function User($resource, apiUrl, alertService, $stateParams) {

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


    User.getSchedule = () => {
      var userId = $stateParams.id;
      url = apiUrl + '/users/'+userId+'/schedule';
      resource = $resource(url).get();

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

    User.getUserDevices = (userId) => {
      var userID = userId;
      url = apiUrl + '/users/'+userID+'/devices';
      resource = $resource(url).get();

      promise = resource.$promise
        .then(data => data.items)
        .catch(() => alertService.error(model, 'getUserDevices'));
      return promise;
    };

    User.updateDevices = (user, devices) => {
      let deviceIds = devices.map(device => device.id);
      url = apiUrl + '/users/:id/devices';
      resource = $resource(url, {}, {
        'update': { method: 'PUT' }
      }).update({ id: user.id }, { device_ids: deviceIds });

      promise = resource.$promise
          .then((data) => {
          alertService.success(model, 'updateDevices');
      return data;
      })
      .catch(() => alertService.error(model, 'updateDevices'));

      return promise;
    };

    User.removeDevices = (user, devices) => {
      let data = {};
      data["device_ids[]"] = devices;
      url = apiUrl + '/users/:id/devices';
      resource = $resource(url, data).delete({ id: user.id });

      promise = resource.$promise
          .then((data) => {
          alertService.success(model, 'removeDevices');
      return data;
      })
      .catch(() => alertService.error(model, 'removeDevices'));

      return promise;
    };

    /*TODO: To create a component Language and to add this to the language model*/
    User.getLanguages = () => {
      url = apiUrl + '/languages';
      resource = $resource(url, {}, {
        'get': {
          method: 'GET',
          isArray: false
        }
      }).get();

      promise = resource.$promise
        .then(data => data.items)
        .catch(() => alertService.error(model, 'getLanguages'));

      return promise;
    };

    User.getUserLanguages = (user) => {
      url = apiUrl + '/users/:id/languages';
      resource = $resource(url).get({ id: user.id });
      promise = resource.$promise
        .then(data => data.items)
        .catch(() => alertService.error(model, 'getUserLanguages'));

      return promise;
    };

    User.updateLanguages = (user, languages) => {
      let languageIds = languages.map(language => language.id);
      url = apiUrl + '/users/:id/languages';
      resource = $resource(url, {}, {
        'update': { method: 'PUT' }
      }).update({ id: user.id }, { language_ids: languageIds });

      promise = resource.$promise
        .then((data) => {
          alertService.success(model, 'updateLanguages');
          return data;
        })
        .catch(() => alertService.error(model, 'updateLanguages'));

      return promise;
    };

    User.removeLanguages = (user, languages) => {
      let data = {};
      data["language_ids[]"] = languages.map(language => language.id);
      url = apiUrl + '/users/:id/languages';
      resource = $resource(url, data).delete({ id: user.id });
      
      promise = resource.$promise
        .then((data) => {
          alertService.success(model, 'removeLanguages');
          return data;
        })
        .catch(() => alertService.error(model, 'removeLanguages'));

      return promise;
    };



    User.getEducations = (id) => {
      url = apiUrl + '/users/:id/educations';
      resource = $resource(url).get({ id: id });

      promise = resource.$promise
        .then(data => data.items)
        .catch(() => alertService.error(model, 'getEducations'));
      return promise;
    };

    User.saveEducations = (id, educations) => {
      url = apiUrl + '/users/:id/educations';
      resource = $resource(url, {}, {
        'post': {
          method: 'POST'
        }
      }).save({ id: id }, educations);

      promise = resource.$promise
        .then(data =>data.items)
        .catch(() => alertService.error(model, 'saveEducations'));

      return promise;
    };

    User.updateEducations = (id, educations) => {
      url = apiUrl + '/users/:id/educations';
      resource = $resource(url, {}, {
        'update': { method: 'PUT' }
      }).update({ id: id }, educations);

      promise = resource.$promise
        .then(data => data.items)
        .catch(() => alertService.error(model, 'updateEducations'));

      return promise;
    };

    User.removeEducations = (id,education) => {
      url = apiUrl + '/users/:id/educations';
      resource = $resource(url, education).delete({ id: id });

      promise = resource.$promise
        .then((data) => {
          alertService.success(model, 'remove');
          return data;
        })
        .catch(() => alertService.error(model, 'remove'));

      return promise;
    };


    User.getProjects = (user) => {
      url = apiUrl + '/users/:id/projects';
      resource = $resource(url).get({ id: user.id });
      promise = resource.$promise
        .then(data => data.items)
        .catch(() => alertService.error(model, 'getProjects'));

      return promise;
    };

    User.updateProjects = (user, project) => {
      url = apiUrl + '/users/:id/projects/:project_id';
      let projectId = project.project_id;
      resource = $resource(url, {}, {
        'update': { method: 'PUT' }
      }).update({ id: user.id, 
                  project_id: projectId}, project);
      promise = resource.$promise
        .then((data) => {
          alertService.success(model, 'updateProjects');
           return data;
        })
        .catch(() => alertService.error(model, 'updateProjects'));

      return promise;
    };


    User.removeProjects = (user, project) => {
      let userId = user.id;
      let prjId = project.project.id;
      url = apiUrl + '/users/:id/projects/:project_id';
      resource = $resource(url).delete({ id: userId, project_id: prjId });

      promise = resource.$promise
        .then((data) => {
          alertService.success(model, 'remove');
          // return data;
        })
        .catch(() => alertService.error(model, 'remove'));

      return promise;
    };

    User.removeProjectTechnologies = (project, technologies) => {
      let data = {};
      let userId = project.user_id;
      let projId = project.project_id;
      data["technology_ids[]"] = technologies.map(technologies => technologies.id);
      url = apiUrl + '/users/:user_id/projects/:project_id/technologies';
      resource = $resource(url, data).delete({ user_id: userId,
               project_id: projId });

      promise = resource.$promise
        .then((data) => {
          alertService.success(model, 'removeProjectTechnologies');
          // return data;
        })
        .catch(() => alertService.error(model, 'removeProjectTechnologies'));

      return promise;
    };

    User.getHolidays = () => {

      let userId= $stateParams.id;
      url = apiUrl + '/users/'+userId+'/holidays';
      resource = $resource(url).query();

      promise = resource.$promise
        .then(data => data)
        .catch(() => alertService.error(model, 'getUserHolidays'));

      return promise;
    };

    User.addHolidays = (data) => {
      let userId= $stateParams.id;
      url = apiUrl + '/users/'+userId+'/holidays';
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

    User.removeHolidays = () => {

    };

    return User;

  }

})();
