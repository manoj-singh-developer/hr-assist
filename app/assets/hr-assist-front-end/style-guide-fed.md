# ASSIST HR Front-End Style Guide



## Table of Contents

  JS
  - [Indentation](#indentation)
  - [Beautify](#beautify)
  - [Errors](#errors)
  - [Comments](#comments)
  - [Functions](#functions)
  - [Angular accolades](#angular-accolades)

  HTML
  - [Indentation](#indentation_1)
  - [Inline css](#inline-css)
  - [Characters limit](#characters-limit)
  - [Spacing between blocks](#spacing-between-blocks)
  - [Comments](#comments_1)
  - [Use HTML5](#use-html5)

  CSS


## JAVASCRIPT

  Javascript basic style guide

### Indentation

  Spaces must be used with each tab being two spaces.


### Beautify

IMPORTANT: We are using a plugin to beautify our code for some basic indentation stuff.

.jsbeautifyrc file is used to configure this plugin

The plugin itself: https://github.com/beautify-web/js-beautify
Plugin for sublime: https://github.com/victorporof/Sublime-HTMLPrettify

### Errors

  We are using jshint in order to decte some code errors.
  https://github.com/jshint/jshint.

### Comments

  Make use of general comments when is necessary or the code is too "funky".

  *Why?*: If your code does "magic", let people know about this.

  ```javascript
    // This is my mega complex function.
    // I want to do some magic here.
    // Was trying to open a portal to another dimension.
    // NOTE: this could backfire if used in older browsers like IE
    //
    // 1. This is a super complicated operation that
    // I thought may be hard to be grasped.
    // 2. Another complex operation here.
    function myFunction(){
      var sum = 1 + 2; // [1];
      var diff = 2 - 1; // [2]
      // more code here
    }
  ```


  Use double line comments in order to differentiate file sections.

 *Why?*: Makes it easier to search using key terms.

 ```javascript
  // ----------------------------------------------------------------------
  // @VARIABLES
  // ----------------------------------------------------------------------

  // code goes below
 ```

  Examples of sections:
  ```
    - VARIABLES
    - EXPOSED PUBLIC METHODS
    - INVOKING PRIVATE METHODS
    - PUBLIC METHODS DECLARATION
    - PUBLIC METHODS DECLARATION
    - PRIVATE METHODS DECLARATION
  ```



  Use @[tagname] comments in order to create tags that can be easily searched. Examples:
  ```
    - @VARIABLES
    - @EXPOSED
    - @PUBLIC
    - @PRIVATE
    - @METHODS
    - @DECLARATION
  ```


  Use 5 space to separate one section from other.

  *Why?*: It creates a visual separation between different types of functions.



  ```javascript
  /* recommended */

  // ----------------------------------------------------------------------
  // @VARIABLES
  // ----------------------------------------------------------------------

  /* beautify preserve:start */
  var vm                  = this;
  vm.serverErrors         = false;
  vm.disabledgeneralInfo  = true;
  vm.teamLeader           = [];
  vm.employees            = [];
  /* beautify preserve:end */


  // 5 spaces between sections


  // ----------------------------------------------------------------------
  // @EXPOSED @PUBLIC @METHODS
  // ----------------------------------------------------------------------

  /* beautify preserve:start */
  vm.saveEmployee           = saveEmployee;
  vm.clearFields            = clearFields;
  /* beautify preserve:end */


  // 5 spaces between sections


  // ----------------------------------------------------------------------
  // @INVOKING @PRIVATE @METHODS
  // ----------------------------------------------------------------------

    privateFunction1();
    privateFunction2();


  // 5 spaces between sections


  // ----------------------------------------------------------------------
  // @PUBLIC @METHODS @DECLARATION
  // ----------------------------------------------------------------------

  function saveEmployee(){
    // code here
  }


  function clearFields() {
    // code here
  }


  // 5 spaces between sections


  // ----------------------------------------------------------------------
  // @PRIVATE @METHODS @DECLARATION
  // ----------------------------------------------------------------------

  function privateFunction1(){
    // code here
  }


  function privateFunction2(){
    // code here
  }

  ```

**[Back to top](#table-of-contents)**


## Functions

  function myFunction(){
    // no extra space here
    // code here
    // no extra space here
  }

**[Back to top](#table-of-contents)**


### Angular accolades
  // To choose here from
  {{ code }}
  or
  {{code}}

**[Back to top](#table-of-contents)**





## HTML

  HTML basic style guide

**[Back to top](#table-of-contents)**


### Indentation

  Spaces must be used with each tab being two spaces.

**[Back to top](#table-of-contents)**


### Inline css

  IMPORTANT: DON’T use inline css.

**[Back to top](#table-of-contents)**


### Characters limit

  If the element attributes are passing the 80 characters limit we should put them one below other.

  ```
  <!-- bad -->
  <md-button class="md-primary" ng-csv="employees.getArray()" csv-header="employees.getHeader()" filename="RaportEmployees.csv"> Export in CSV </md-button>
  ```

  ```
  <!-- good -->
  <md-button
    class="md-primary"
    ng-csv="employees.getArray()"
    csv-header="employees.getHeader()"
    filename="RaportEmployees.csv">
    Export in CSV
  </md-button>
  ```

**[Back to top](#table-of-contents)**


### Spacing between blocks

  Separate independent but loosely related snippets of markup with a single empty line.

  ```
  <!-- bad -->
  <section layout="row" layout-align="center center">
    <md-button
      class="md-raised md-primary"
      ng-click="empoloyeeJsonM.saveFromJson(empoloyeeJsonM.json)">
      Save
    </md-button>
    <md-button
      class="md-raised md-primary"
      ng-click="empoloyeeJsonM.clearFields()">
      Clear
    </md-button>
    <md-button
      class="md-raised"
      ng-click="empoloyeeJsonM.closeDialog()">
      Close
    </md-button>
  </section>
  ```

  ```
  <!-- good -->
  <section layout="row" layout-align="center center">

    <md-button
      class="md-raised md-primary"
      ng-click="empoloyeeJsonM.saveFromJson(empoloyeeJsonM.json)">
      Save
    </md-button>

    <md-button
      class="md-raised md-primary"
      ng-click="empoloyeeJsonM.clearFields()">
      Clear
    </md-button>

    <md-button
      class="md-raised"
      ng-click="empoloyeeJsonM.closeDialog()">
      Close
    </md-button>

  </section>
  ```

  For snippets of markup that doesn't have children and can be placed on a single line, the single line separation is not needed.

  ```
  <!-- bad -->
  <p>{{employeeGeneralInfo.employee.first_name}}</p>

  <p>{{employeeGeneralInfo.employee.middle_name}}</p>

  <p>{{employeeGeneralInfo.employee.last_name}}</p>
  ```

  ```
  <!-- good -->
  <p>{{employeeGeneralInfo.employee.first_name}}</p>
  <p>{{employeeGeneralInfo.employee.middle_name}}</p>
  <p>{{employeeGeneralInfo.employee.last_name}}</p>
  ```

  If an element doesn't have a child but is next to an element that has one the single empty line rule is applied for consistency like in first example from this point.

  You can denote thematic(extra big) breaks with four(5) empty lines and big loosely related snippets with three(3) emtpy spaces.

  ```
  <!-- good -->

  <!--
    This is a very "big" component, not necessarily by its size,
    but rather by its content being different logically different from other blocks
    -->
  <header class="page-header">
    <!-- more markup here -->
  </header>


  <!-- 5 spaces for big components like main or footer  -->


  <section class="big-component">
  </section>





  <!--
    Inside this section we have 3 components that are loosely related snippets so we should
    denote them with 1 space but because they have so much HTML inside we
    will use 3 spaces in order to have a better visual spacing
   -->
  <section class="another-big-component">

    <!-- 3 spaces for related snippets that have a lot of markup inside -->

    <div class="component">
      <!-- A lot of markup here -->
    </div>



    <div class="component">
      <!-- A lot of markup here -->
    </div>



    <div class="component">
      <!-- A lot of markup here -->
    </div>



  </section>


  <!-- 5 spaces again -->


  <footer class="page-footer">
  </footer>
  ```

**[Back to top](#table-of-contents)**


### Comments

  The comments are always welcomed, especially when the nesting gets too crazy.
  If the snippet can be named with a specific name then do it, otherwise just use a class to name your comment.

  ```
  <!-- CARD NOTES -->
  <md-content class="c-card-profile__notes">
    <p>
      <strong>NOTE: </strong>Complete here with your general personal/work information.
    </p>
  </md-content> <!-- CARD NOTES -->
  ```

  Important: This point is not enforced and must be used only when the markup gets too complex and has a bad readability.

### Use HTML5

  Don't forget the HTML5 is rich. Instead of a div with a class of .panel-header we could use a header tag with the same class, same goes for footer and other elements.

**[Back to top](#table-of-contents)**





### CSS

  CSS basic style guide

  To add
