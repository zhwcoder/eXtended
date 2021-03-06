'use strict';

var directives = require('./directives');
var dom = require('./dom');
var shared = require('./shared');
var templates = require('./templates');
var utils = require('./utils');

function Elements() {
  // Methods
  this.create = create;
  this.element = element;
  this.render = render;

  return this;

  /**
   * Creates a new element (with or without id & class).
   *
   * @param {string} tag
   * @param {object || string || boolean} props = false
   * @param {string} content
   * @return {object} element with properties.
   * @public
   */
  function create(tag, props, content) {
    var element = dom.getElementNameAndType(tag);
    var el = dom.newElement(element.name);
    var value;
    var property;
    var type;

    // Get properties for class or id and default attributes
    var getProps = function(element, props) {
      var newProps = shared.isSpecialTag(tag, props);

      if (element.id || element.class) {
        props = !props ? {} : props;
      }

      if (element.id) {
        props.id = element.id;
      }

      if (element.class) {
        props.class = element.class;
      }

      return newProps ? utils.merge(props, newProps) : props;
    };

    // Builds the object
    var buildElement = function() {
      props = getProps(element, props);

      if (content) {
        el.innerHTML = content;
      }

      if (utils.isObject(props)) {
        utils.forEach(props, function(key) {
          value = props[key] || '';
          property = shared.getProperty(key);
          el[property] = value;
        });
      } else if (props) {
        type = dom.getElementType(props, true);
        value = type !== 'tag' ? props.substring(1) : props;
        property = shared.getProperty(type);
        el[property] = value;
      }

      return el;
    };

    return buildElement();
  }

  /**
   * Get an element object.
   *
   * @param {string} elementName
   * @return {object} element
   * @public
   */
  function element(elementName) {
    return dom.getElement(elementName);
  }

  /**
   * Render elements.
   *
   * @param {string} target
   * @param {array} elements
   * @public
   */
  function render(target) {
    var elements = shared.getArguments(arguments);
    var el = element(target);
    var directiveProps;
    var directiveClass;
    var properties = {};
    var newElements;
    var vm;
    var directive = shared.isDirective(elements[0]);

    // Rendering a directive
    if (directive) {
      if (utils.isObject(elements[1])) {
        properties = elements[1];
        vm = elements[2] || 'vm' + directive;
      }

      // Setting the target of the directive
      properties.$target = target;

      // Getting the directive properties & merging with actual properties
      directiveProps = directives.getDirectiveProps(elements[0]);
      directiveProps.props = utils.merge(directiveProps.props, properties);

      // Getting the directiveClass object (coming from the controller)
      directiveClass = directives.getDirective(directiveProps.props.$directiveName);

      // Getting the compiled HTML as new DOM element
      newElements = templates.getCompiledHTML(directiveClass.render(), directiveProps, directiveClass, vm);

      // Removing used directive (free memory)
      directives.removeDirective(directiveProps.props.$directiveName);

      if (utils.isArray(newElements)) {
        utils.forEach(newElements, function(element) {
          el.appendChild(element);
        });
      }
    } else {
      // Rendering DOM elements
      utils.forEach(elements, function(element) {
        if (utils.isObject(element)) {
          el.appendChild(element);
        }
      });
    }
  }
}

// Exporting object
module.exports = new Elements();
