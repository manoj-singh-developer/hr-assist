(() => {

  'use strict';

  angular
    .module('HRA')
    .controller('userGeneralCtrl', userGeneralCtrl);

  function userGeneralCtrl($rootScope, $scope, $stateParams, $state, AuthInterceptor, dateService, md5, Position, User) {

    let vm = this;
    let userCopy = {};
    let positionCopy = {};
    let departmentCopy = {};
    let scheduleCopy = {};
    let education = [];
    let userImage = '';
    let defaultAuthRequest = AuthInterceptor.request;
    vm.AuthInterceptor = AuthInterceptor;

    vm.today = new Date();
    vm.isAdmin = false;
    vm.user = {};
    vm.position = {};
    vm.department = {};
    vm.schedule = {};
    vm.certifications = [];
    vm.dateService = dateService;
    vm.showSshKey = false;
    vm.contractType = [
      'Full-time',
      'Part-time 4h',
      'Part-time 6h'
    ];

    vm.save = save;
    vm.savePosition = savePosition;
    vm.saveDepartment = saveDepartment;
    vm.saveCopy = saveCopy;
    vm.cancel = cancel;
    vm.userLogOut = userLogOut;
    vm.generateCv = generateCv;
    vm.viewSsh = viewSsh;

    _getPositions();
    _getDepartments();

    if ($rootScope.isAdmin === true) {
      vm.isAdmin = true;
    } else {
      vm.isAdmin = false;
    }

    $rootScope.$on('event:userResourcesLoaded', (event, resources)=> {
      vm.user = resources.user;
      vm.education = resources.educations;
      vm.technologies = resources.userTechnologies;
      vm.certifications = resources.certifications;

      saveCopy();
      _getUserPosition();
      _getUserDepartment();
      _getEducation();
      _getBase64ImageUrl(vm.user.email, 100);
      _getUserLanguage();

    });

     $rootScope.$on('educationUpdated', (event, education) => {
      vm.education = education;
      _getEducation();
    });

      $rootScope.$on('technologiesUpdated', (event, technologies) => {
      vm.technologies = technologies;
    });

    $rootScope.$on('certificationUpdated', (event, certifications) => {
      vm.certifications = certifications;
    });

    $rootScope.$on('loadUserSchedule', (event, data) => {
      vm.schedule = data;
    });

    $rootScope.$on('notifyScheduleUpdate', (event, data) => {
      _getUserSchedule();
    });

    function viewSsh() {
      vm.showSshKey = !vm.showSshKey;
    }

    function save() {
      vm.user.company_start_date = vm.user.company_start_date ? vm.dateService.format(vm.user.company_start_date) : null;
      vm.user.birthday = vm.user.birthday ? vm.dateService.format(vm.user.birthday) : null;
      User.update(vm.user).then((data) => {
        if (data) {
          vm.user = data;
        } else {
          _getUser();
        }
        vm.toggleForm();
      });
    }

    function saveCopy() {
      userCopy = angular.copy(vm.user);
      positionCopy = angular.copy(vm.position);
      departmentCopy = angular.copy(vm.department);
      scheduleCopy = angular.copy(vm.schedule);
    }

    function cancel() {
      vm.user = angular.copy(userCopy);
      vm.position = angular.copy(positionCopy);
      vm.department = angular.copy(departmentCopy);
      vm.schedule = angular.copy(scheduleCopy);
    }

    function savePosition() {
      User.updatePosition(vm.user, vm.position).then((data) => {
        vm.position = data;
      });
    }

    function saveDepartment() {
      User.updateDepartment(vm.user, vm.department).then((data) => {
        // Just a hack because of POST instead OF PUT
        vm.department = data[data.length-1];

      });
    }

    function userLogOut() {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_token');
      $state.reload();
    }

    function generateCv(typeOfDoc) {

      let objectToGenerate = {
        'SkillsPassport': {
          'Locale': 'en',
          'DocumentInfo': {
            'DocumentType': 'ECV',
            'CreationDate': new Date(),
            'LastUpdateDate': new Date(),
            'XSDVersion': 'V3.0',
            'Generator': 'REST_WS',
            'Comment': 'Europass CV'
          },
          'LearnerInfo': {
            'Identification': {
              'PersonName': {
                'FirstName': vm.user.first_name,
                'Surname': vm.user.last_name
              },
              'ContactInfo': {
                'Address': {
                  'Contact': {
                    'AddressLine': vm.user.address,
                    'PostalCode': vm.user.zip_code,
                    'Municipality': vm.user.city,
                    'Country': {
                      'Code': 'RO',
                      'Label': 'Romanian'
                    }
                  }
                },
                'Email': {
                  'Contact': vm.user.email
                },
                'Telephone': [{
                  'Contact': vm.user.phone,
                  'Use': {
                    'Code': 'mobile',
                    'Label': 'Mobile'
                  }
                }],

              },
              'Demographics': {
                'Birthdate': {
                  'Year': new Date(vm.user.birthday).getFullYear(),
                  'Month': new Date(vm.user.birthday).getMonth() + 1,
                  'Day': new Date(vm.user.birthday).getDate()
                }
              },
              'Photo': {
                'MimeType': 'image/jpeg',
                'Data': userImage,
                'Metadata': [{
                  'Key': 'dimension',
                  'Value': '90x90'
                }, {
                  'Key': 'number-of-pages',
                  'Value': '5'
                }]
              }
            },
            'Headline': {
              'Type': {
                'Code': 'job_applied_for',
                'Label': 'JOB APPLIED FOR'
              },
              'Description': {
                'Label': ' '
              }
            },
            'WorkExperience': [{
              'Period': {
                'From': {
                  'Year': new Date(vm.user.company_start_date).getFullYear(),
                  'Month': new Date(vm.user.company_start_date).getMonth()
                },
                'Current': true
              },
              'Position': {
                'Label': vm.position.name
              },
              'Activities': '',
              'Employer': {
                'Name': 'Assist Software',
                'ContactInfo': {
                  'Address': {
                    'Contact': {
                      'AddressLine': 'nr. 1, Tipografiei Street',
                      'PostalCode': '720043',
                      'Municipality': 'Suceava',
                      'Country': {
                        'Code': 'RO',
                        'Label': 'Romania'
                      }
                    }
                  }
                }
              }
            }],
            'Education': education,
            'Skills': {
              'Linguistic': {
                'MotherTongue': [{
                  'Description': {
                    'Code': 'RO',
                    'Label': 'Romana'
                  }
                }],
                'ForeignLanguage': _getLanguages()
              },
              'JobRelated': {
                'Description': vm.technologies.length ? '- ' + _getNameOfItems(vm.technologies) : ' '
              },
              'Communication': {
                'Description': ''
              },
              'Organisational': {
                'Description': ''
              },
              'Computer': {
                'Description': ''
              },
              'Driving': {
                'Description': [vm.user.car_plate && vm.user.car_plate != 'no' && vm.user.car_plate != '-' ? 'yes' : '-']
              },
            },
            'Achievement': [{
              'Title': {
                'Code': 'certifications',
                'Label': 'Certifications'
              },
              'Description': vm.certifications.length ? '- ' + _getNameOfItems(vm.certifications) : ' '
            }]
          }
        }
      };

      if (typeOfDoc === 'doc') {
        _getAsDoc(objectToGenerate);
      } else {
        _getAsPdf(objectToGenerate);
      }
    }

    function _getCv(data, url, type, extension) {
      vm.AuthInterceptor.request = vm.AuthInterceptor.request != null ? null : defaultAuthRequest; // AuthInterceptor set config headers to null

      User.getCv(data, url).then((resource) => {

        let ieEDGE = navigator.userAgent.match(/Edge/g);
        let ie = navigator.userAgent.match(/.NET/g); // IE 11+
        let oldIE = navigator.userAgent.match(/MSIE/g);
        let name = 'CV_' + vm.user.first_name + '_' + vm.user.last_name;
        let blob = new window.Blob([resource.data], { type: type });

        if (ie || oldIE || ieEDGE) {
          let fileName = name + '.pdf';
          window.navigator.msSaveBlob(blob, fileName);
        } else {
          let file = new Blob([resource.data], {
            type: type
          });
          let fileURL = URL.createObjectURL(file);
          let a = document.createElement('a');
          a.href = fileURL;
          a.target = '_blank';
          a.download = name + extension;
          document.body.appendChild(a);
          a.click();
          URL.revokeObjectURL(file);
        }

        vm.AuthInterceptor.request = vm.AuthInterceptor.request != null ? null : defaultAuthRequest; // AuthInterceptor set request to default config header
      });
    }

    function _getAsPdf(data) {
      let url = 'https://europass.cedefop.europa.eu/rest/v1/document/to/pdf-cv';
      let type = 'application/pdf';
      let extension = '.pdf';
      _getCv(data, url, type, extension);
    }

    function _getAsDoc(data) {
      let url = 'https://europass.cedefop.europa.eu/rest/v1/document/to/word';
      let type = 'application/msword';
      let extension = '.doc';
      _getCv(data, url, type, extension);
    }

    function _getPositions() {
      Position.getAll().then(data => vm.positions = data);
    }

    function _getDepartments() {
      User.getDepartments().then(data => vm.departments = data);
    }

    function _getUser() {
      User.getById($stateParams.id).then(data => vm.user = data);
    }

    function _getUserPosition() {
      User.getPosition(vm.user).then((data) => {
        vm.position = data;
        saveCopy();
      });
    }

    function _getUserDepartment() {
      User.getDepartment(vm.user).then((data) => {
        vm.department = data[data.length-1];
        saveCopy();
      });
    }

    function _getUserSchedule() {
      User.getSchedule(vm.user).then((data) => {
        vm.schedule = data;
        saveCopy();
      });
    }

    function _getUserLanguage() {
      User.getUserLanguages(vm.user).then(data => {
        vm.userLanguages = data;
        _getLanguages();
      });
    }

    function _getLanguages() {
      let languageEuropassFormat = [];

      function _convertLvlToText(data) {
        switch (data) {
          case 1:
            return "A2";
            break;
          case 2:
            return "B1";
            break;
          case 3:
            return "B2";
            break;
          case 4:
            return "C1";
            break;
          case 5:
            return "C2";
            break;
          default:
            return "Not selected";
        }
      }

      vm.userLanguages.forEach(function(element, index) {
        let level = _convertLvlToText(element.level);
        languageEuropassFormat.push({
          'Description': {
            'Code': element.short_name.toUpperCase(),
            'Label': element.long_name
          },
          'ProficiencyLevel': {
            'Listening': level,
            'Reading': level,
            'SpokenInteraction': level,
            'SpokenProduction': level,
            'Writing': level
          },
          'Certificate': [{
            'Title': ''
          }]
        });
      });
      return languageEuropassFormat;
    }

    function _getNameOfItems(items) {
      let itemsString = $.map(items, (elem, index) => {
        return elem.name;
      });
      return itemsString.join('\n - ');
    }

    function _getEducation() {
      education = [];
      for (let i = 0; i < vm.education.length; i++) {
        let edObj = {};
        edObj.Period = {};
        edObj.Period.From = {};
        edObj.Period.To = {};
        edObj.Organisation = {};
        edObj.Organisation.ContactInfo = {};
        edObj.Organisation.ContactInfo.Address = {};

        edObj.Period.From.Year = new Date(vm.education[i].start_date).getFullYear();
        edObj.Period.To.Year = new Date(vm.education[i].end_date).getFullYear();
        edObj.Title = vm.education[i].degree;
        edObj.Organisation.Name = vm.education[i].name;
        education.push(edObj);
      }

      education.sort((a, b) => {
        return b.Period.To.Year - a.Period.To.Year;
      });

      return education;
    }

    function _getBase64ImageUrl(email, size) {
      let url = 'http://www.gravatar.com/avatar/' + md5(email) + '.jpg?s=' + size;
      let img = new Image();
      img.setAttribute('crossOrigin', 'anonymous');

      img.onload = function() {
        let canvas = document.createElement("canvas");
        canvas.width = this.width;
        canvas.height = this.height;

        let ctx = canvas.getContext("2d");
        ctx.drawImage(this, 0, 0);

        let dataURL = canvas.toDataURL("image/png");

        return userImage = dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
      };

      img.src = url;
    }

  }


})();
