(() => {

  'use strict';

  angular
    .module('HRA')
    .factory('User', User);


  function User($resource, apiUrl, alertService, $stateParams, errorService, $httpParamSerializerJQLike, $http) {

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
        }).catch((error) => {
          errorService.forceLogout(error);
          alertService.error(model, 'save')
        });

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
        .catch((error) => {
          errorService.forceLogout(error);
          alertService.error(model, 'update')
        });

      return promise;
    };

    User.getById = (id) => {
      url = apiUrl + '/users/:id';
      resource = $resource(url).get({ id: id });

      promise = resource.$promise
        .then(data => data)
        .catch((error) => {
          //alertService.error(model, 'getById');
          errorService.forceLogout(error);
          errorService.notUserFound(error);
        });
      return promise;
    };

    User.getAll = () => {
      url = apiUrl + '/users?with[]=languages&with[]=technologies&with[]=projects&with[]=certifications';
      resource = $resource(url, {}, {
        'get': {
          method: 'GET',
          isArray: false
        }
      }).get();

      promise = resource.$promise
        .then(data => data.items)
        .catch((error) => {
          //alertService.error(model, 'getAll');
          errorService.forceLogout(error);
          errorService.notUserFound(error);
        });

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
        .catch((error) => {
          errorService.forceLogout(error);
          alertService.error(model, 'remove')
        });

      return promise;
    };


    User.getSchedule = () => {
      var userId = $stateParams.id;
      url = apiUrl + '/users/' + userId + '/schedule';
      resource = $resource(url).get();

      promise = resource.$promise
        .then(data => data)
        .catch((error) => {
          //alertService.error(model, 'getSchedule');
          errorService.forceLogout(error);
          errorService.notUserFound(error);
        });
      return promise;
    };

    User.updateSchedule = (id, schedule) => {
      url = apiUrl + '/users/:id/schedule/';
      resource = $resource(url, {}, {
        'post': { method: 'POST' }
      }).save({ id: id }, schedule);

      promise = resource.$promise
        .then((data) => {
          alertService.success(model, 'update');
          return data;
        })
        .catch((error) => {
          errorService.forceLogout(error);
          alertService.error(model, 'update')
        });

      return promise;
    };


    User.getPosition = (user) => {
      url = apiUrl + '/users/:id/position';
      resource = $resource(url, {}, {
        'get': {
          method: 'GET',
          isArray: false
        }
      }).get({ id: user.id });

      promise = resource.$promise
        .then(data => data)
        .catch((error) => {
          // alertService.error(model, 'getPosition');
          errorService.forceLogout(error);
          errorService.notUserFound(error);
        });

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
        .catch((error) => {
          errorService.forceLogout(error);
          alertService.error(model, 'updatePosition')
        });

      return promise;
    };

    User.getDepartments = () => {
      url = apiUrl + '/departments';
      resource = $resource(url, {}, {
        'get': {
          method: 'GET',
          isArray: false
        }
      }).get();

      promise = resource.$promise
        .then(data => data.items)
        .catch((error) => {
          errorService.forceLogout(error);
          alertService.error(model, 'getAll');
        });

      return promise;
    };

    User.getDepartment = (user) => {
      url = apiUrl + '/users/:id/department';
      resource = $resource(url, {}, {
        'get': {
          method: 'GET',
          isArray: true
        }
      }).get({ id: user.id });

      promise = resource.$promise
        .then(data => data)
        .catch((error) => {
          // alertService.error(model, 'getDepartment');
          errorService.forceLogout(error);
          errorService.notUserFound(error);
        });

      return promise;
    };

    User.updateDepartment = (user, department) => {
      url = apiUrl + '/users/:id/department/new';
      resource = $resource(url, {}, {
        'post': { method: 'POST' }
      }).save({ id: user.id },{ department_id: department.id });

      promise = resource.$promise
        .then((data) => {
          alertService.success(model, 'updateDepartment');
          return data.items;
        })
        .catch((error) => {
          errorService.forceLogout(error);
          alertService.error(model, 'updateDepartment')
        });

      return promise;
    };

    User.getUserDevices = (userId) => {
      var userID = userId;
      url = apiUrl + '/users/' + userID + '/devices';
      resource = $resource(url).get();

      promise = resource.$promise
        .then(data => data.items)
        .catch((error) => {
          // alertService.error(model, 'getUserDevices');
          errorService.forceLogout(error);
          errorService.notUserFound(error);
        });
      return promise;
    };

    User.updateDevices = (user, devices) => {
      //let deviceIds = devices.map(device => device.id);
      url = apiUrl + '/users/:id/devices';
      resource = $resource(url, {}, {
        'update': { method: 'PUT' }
      }).update({ id: user.id }, devices);

      promise = resource.$promise
        .then((data) => {
          alertService.success(model, 'updateDevices');
          return data.items;
        })
        .catch((error) => {
          errorService.forceLogout(error);
          alertService.error(model, 'updateDevices');
        });

      return promise;
    };

    User.removeDevices = (user, device) => {
      let data = {};
      data["device_ids"] = device.device_id;
      url = apiUrl + '/users/:id/devices';

      resource = $resource(url, data, {
        'delete': {
          method: 'DELETE',
          isArray: true
        }
      }).delete({ id: user.id });

      promise = resource.$promise
        .then((data) => {
          // alertService.success(model, 'removeDevices');
          return data;
        })
        .catch((error) => {
          errorService.forceLogout(error);
          alertService.error(model, 'removeDevices')
        });

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
        .catch((error) => {
          //alertService.error(model, 'getLanguages');
          errorService.forceLogout(error);
          errorService.notUserFound(error);
        });

      return promise;
    };

    User.getUserLanguages = (user) => {
      url = apiUrl + '/users/:id/languages';
      resource = $resource(url).get({ id: user.id });
      promise = resource.$promise
        .then(data => data.items)
        .catch((error) => {
          // alertService.error(model, 'getUserLanguages');
          errorService.forceLogout(error);
          errorService.notUserFound(error);
        });

      return promise;
    };

    User.updateLanguages = (user, languages) => {
      url = apiUrl + '/users/:id/languages';
      resource = $resource(url, {}, {
        'update': { method: 'PUT' }
      }).update({ id: user.id }, languages);

      promise = resource.$promise
        .then((data) => {
          alertService.success(model, 'updateLanguages');
          return data.items;

        })
        .catch((error) => {
          errorService.forceLogout(error);
          alertService.error(model, 'updateLanguages')
        });

      return promise;
    };

    User.removeLanguages = (user, languages) => {
      let data = {};
      data["language_ids[]"] = languages;
      url = apiUrl + '/users/:id/languages';
      resource = $resource(url, data, {
        'delete': {
          method: 'DELETE',
          isArray: true
        }
      }).delete({ id: user.id });

      promise = resource.$promise
        .then((data) => {
          alertService.success(model, 'removeLanguages');
          return data;
        })
        .catch((error) => {
          errorService.forceLogout(error);
          alertService.error(model, 'removeLanguages')
        });

      return promise;
    };


    User.getEducations = (id) => {
      url = apiUrl + '/users/:id/educations';
      resource = $resource(url).get({ id: id });

      promise = resource.$promise
        .then(data => data.items)
        .catch((error) => {
          //alertService.error(model, 'getEducations');
          errorService.forceLogout(error);
          errorService.notUserFound(error);
        });
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
        .then(data => data.items)
        .catch((error) => {
          errorService.forceLogout(error);
          alertService.error(model, 'saveEducations')
        });

      return promise;
    };

    User.updateEducations = (id, educations) => {
      url = apiUrl + '/users/:id/educations';
      resource = $resource(url, {}, {
        'update': { method: 'PUT' }
      }).update({ id: id }, educations);

      promise = resource.$promise
        .then(data => data.items)
        .catch((error) => {
          errorService.forceLogout(error);
          alertService.error(model, 'updateEducations')
        });

      return promise;
    };

    User.removeEducations = (id, education) => {
      url = apiUrl + '/users/:id/educations';
      resource = $resource(url, education, {
        'delete': {
          method: 'DELETE',
          isArray: true
        }
      }).delete({ id: id });

      promise = resource.$promise
        .then((data) => {
          alertService.success(model, 'remove');
          return data;
        })
        .catch((error) => {
          errorService.forceLogout(error);
          alertService.error(model, 'remove');
        });

      return promise;
    };


    User.getProjects = (user) => {
      url = apiUrl + '/users/:id/projects';
      resource = $resource(url).get({ id: user.id });
      promise = resource.$promise
        .then(data => data.items)
        .catch((error) => {
          // alertService.error(model, 'getProjects');
          errorService.forceLogout(error);
          errorService.notUserFound(error);
        });

      return promise;
    };

    User.updateProjects = (user, project) => {
      url = apiUrl + '/users/:id/projects/:project_id';
      let projectId = project.project_id;
      resource = $resource(url, {}, {
        'update': { method: 'PUT' }
      }).update({
        id: user.id,
        project_id: projectId
      }, project);
      promise = resource.$promise
        .then((data) => {
          alertService.success(model, 'updateProjects');
          return data;
        })
        .catch((error) => {
          alertService.error(model, 'updateProjects');
          errorService.forceLogout(error);
        });

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
        .catch((error) => {
          errorService.forceLogout(error);
          alertService.error(model, 'remove')
        });

      return promise;
    };

    User.removeProjectTechnologies = (project, technologies) => {
      let data = {};
      let userId = project.user_id;
      let projId = project.project_id;
      data["technology_ids[]"] = technologies.map(technologies => technologies.id);
      url = apiUrl + '/users/:user_id/projects/:project_id/technologies';
      resource = $resource(url, data, {
        'delete': {
          method: 'DELETE',
          isArray: true
        }
      }).delete({
        user_id: userId,
        project_id: projId
      });

      promise = resource.$promise
        .then((data) => {
          alertService.success(model, 'removeProjectTechnologies');
          // return data;
        })
        .catch((error) => {
          errorService.forceLogout(error);
          alertService.error(model, 'removeProjectTechnologies');
        });

      return promise;
    };

    User.getHolidays = () => {

      let userId = $stateParams.id;
      url = apiUrl + '/users/' + userId + '/holidays';
      resource = $resource(url).query();

      promise = resource.$promise
        .then(data => data)
        .catch((error) => {
          //alertService.error(model, 'getUserHolidays');
          errorService.forceLogout(error);
          errorService.notUserFound(error);
        });

      return promise;
    };

    User.addHolidays = (data) => {

      let userId = $stateParams.id;
      url = apiUrl + '/users/' + userId + '/holidays';
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
          alertService.error(model, 'save');
        });

      return promise;
    };

    User.getTechnologies = () => {

      let userId = $stateParams.id;
      url = apiUrl + '/users/' + userId + '/technologies';
      resource = $resource(url).get();

      promise = resource.$promise
        .then(data => data.items)
        .catch((error) => {
          errorService.forceLogout(error);
          //alertService.error(model, 'getUserTechnologies');
        });

      return promise;
    };

    User.saveUserTechnologies = (data) => {

      let userId = $stateParams.id;
      url = apiUrl + '/users/' + userId + '/technologies';
      resource = $resource(url, {}, {
        'post': { method: 'POST' }
      }).save(data);

      promise = resource.$promise
        .then((data) => {
          alertService.success(model, 'saveUserTechnologies');
          return data.items;
        })
        .catch((error) => {
          errorService.forceLogout(error);
          alertService.error(model, 'saveUserTechnologies');
        });

      return promise;
    };

    User.updateUserTechnologies = (data) => {
      let userId = $stateParams.id;

      url = apiUrl + '/users/' + userId + '/technologies';
      resource = $resource(url, {}, {
        'update': { method: 'PUT' }
      }).update(data);

      promise = resource.$promise
        .then((data) => {
          alertService.success(model, 'updateUserTechnologies');
          return data.items;
        })
        .catch((error) => {
          errorService.forceLogout(error);
          alertService.error(model, 'updateUserTechnologies');
        });

      return promise;
    };

    User.deleteUserTechnologies = (technologies) => {
      let data = {};
      let userId = $stateParams.id;
      data["technology_ids[]"] = technologies.map(technologies => technologies.id);

      url = apiUrl + '/users/' + userId + '/technologies';

      resource = $resource(url, data).delete({ id: userId });

      promise = resource.$promise
        .then((data) => {
          alertService.success(model, 'deleteUserTechnologies');
          return data;
        })
        .catch((error) => {
          errorService.forceLogout(error);
          alertService.error(model, 'deleteUserTechnologies');
        });

      return promise;
    }

    User.filter = (data) => {
      let filterUrl = '/users?with[]=languages&with[]=technologies&with[]=projects&with[]=certifications';
      let decodedObjUrl = decodeURIComponent($httpParamSerializerJQLike(data).replace(/\+/g, " "));
      url = apiUrl + filterUrl + '&' + decodedObjUrl;
      resource = $resource(url, {}, {
        'get': {
          method: 'GET',
          isArray: false
        }
      }).get();

      promise = resource.$promise
        .then((data) => {
          return data.items;
        })
        .catch((error) => {
          errorService.forceLogout(error);
          alertService.error(model, 'filter');
        });
      return promise;
    };

    User.getCertifications = () => {

      let userId = $stateParams.id;
      url = apiUrl + '/users/' + userId + '/certifications';
      resource = $resource(url).get();

      promise = resource.$promise
        .then(data => data.items)
        .catch((error) => {
          errorService.forceLogout(error);
          //alertService.error(model, 'getUserTechnologies');
        });

      return promise;
    };

    User.saveCertifications = (id, certifications) => {

      url = apiUrl + '/users/:id/certifications';
      resource = $resource(url, {}, {
        'post': {
          method: 'POST'
        }
      }).save({ id: id }, certifications);

      promise = resource.$promise
        .then(data => data.items)
        .catch((error) => {
          errorService.forceLogout(error);
          alertService.error(model, 'saveCertifications')
        });

      return promise;
    };

    User.updateCertifications = (id, certifications) => {

      url = apiUrl + '/users/:id/certifications';
      resource = $resource(url, {}, {
        'update': { method: 'PUT' }
      }).update({ id: id }, certifications);

      promise = resource.$promise
        .then(data => data.items)
        .catch((error) => {
          errorService.forceLogout(error);
          alertService.error(model, 'updateCertifications')
        });

      return promise;
    };

    User.removeCertifications = (id, certification) => {
      let data = {};
      data["certification_ids"] = certification.id;
      url = apiUrl + '/users/:id/certifications';
      resource = $resource(url, data, {
        'delete': {
          method: 'DELETE',
          isArray: true
        }
      }).delete({ id: id });
      promise = resource.$promise
        .then((data) => {
          alertService.success(model, 'removeCertifications');
          return data;
        })
        .catch((error) => {
          errorService.forceLogout(error);
          alertService.error(model, 'removeCertifications');
        });

      return promise;
    }

    User.removeHoliday = (holiday) => {

      let data = {
        user_id: $stateParams.id,
        holiday_ids: holiday.holiday_id
      };
      url = apiUrl + '/users/:id/holidays';
      resource = $resource(url, data, {
        'delete': {
          method: 'DELETE',
          isArray: true
        }
      }).delete({ id: data.user_id });

      promise = resource.$promise
        .then((data) => {
          alertService.success(model, 'removeHoliday');
          return data;
        })
        .catch((error) => {
          errorService.forceLogout(error);
          alertService.error(model, 'removeHoliday')
        });

      return promise;
    };

    User.getCv = (data, url) => {
      url = url || 'https://europass.cedefop.europa.eu/rest/v1/document/to/pdf-cv';

      return $http({
          url: url,
          method: 'POST',
          data: data,
          responseType: 'arraybuffer'
        }).then((data) => {
          alertService.success(model, 'getCv');

          return data;
        })
        .catch((error) => {
          errorService.forceLogout(error);
          //alertService.error(model, 'getCv');
        });
    };

    return User;

  }

})();
