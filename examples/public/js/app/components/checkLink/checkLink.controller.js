'use strict';

var eX = require('./../../../../../../src/eXtended');

function CheckLinkCtrl() {
  // Methods
  this.run = run;

  return this;

  function run() {
    var linkTemplate = require('./checkLink.template.html');

    eX.createDirective('CheckLink', {
      showMessage: function() {
        var params = eX.getArguments(arguments, true);

        console.log('Inside showMessage', params);
      },
      showMessage2: function(message) {
        console.log('Holaaaaa', message);
      },
      render: function() {
        return linkTemplate;
      }
    });

    eX.render('#directive', '<CheckLink />', {
      url: {
        http: 'http://www.codejobs.biz'
      },
      content: 'Hello World'
    });
  }
}

// Exporting object
module.exports = new CheckLinkCtrl();
