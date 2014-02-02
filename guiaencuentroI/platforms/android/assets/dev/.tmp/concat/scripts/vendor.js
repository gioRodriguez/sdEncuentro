var Zepto = function () {
    var undefined, key, $, classList, emptyArray = [], slice = emptyArray.slice, filter = emptyArray.filter, document = window.document, elementDisplay = {}, classCache = {}, cssNumber = {
        'column-count': 1,
        'columns': 1,
        'font-weight': 1,
        'line-height': 1,
        'opacity': 1,
        'z-index': 1,
        'zoom': 1
      }, fragmentRE = /^\s*<(\w+|!)[^>]*>/, singleTagRE = /^<(\w+)\s*\/?>(?:<\/\1>|)$/, tagExpanderRE = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi, rootNodeRE = /^(?:body|html)$/i, capitalRE = /([A-Z])/g, methodAttributes = [
        'val',
        'css',
        'html',
        'text',
        'data',
        'width',
        'height',
        'offset'
      ], adjacencyOperators = [
        'after',
        'prepend',
        'before',
        'append'
      ], table = document.createElement('table'), tableRow = document.createElement('tr'), containers = {
        'tr': document.createElement('tbody'),
        'tbody': table,
        'thead': table,
        'tfoot': table,
        'td': tableRow,
        'th': tableRow,
        '*': document.createElement('div')
      }, readyRE = /complete|loaded|interactive/, classSelectorRE = /^\.([\w-]+)$/, idSelectorRE = /^#([\w-]*)$/, simpleSelectorRE = /^[\w-]*$/, class2type = {}, toString = class2type.toString, zepto = {}, camelize, uniq, tempParent = document.createElement('div'), propMap = {
        'tabindex': 'tabIndex',
        'readonly': 'readOnly',
        'for': 'htmlFor',
        'class': 'className',
        'maxlength': 'maxLength',
        'cellspacing': 'cellSpacing',
        'cellpadding': 'cellPadding',
        'rowspan': 'rowSpan',
        'colspan': 'colSpan',
        'usemap': 'useMap',
        'frameborder': 'frameBorder',
        'contenteditable': 'contentEditable'
      };
    zepto.matches = function (element, selector) {
      if (!selector || !element || element.nodeType !== 1)
        return false;
      var matchesSelector = element.webkitMatchesSelector || element.mozMatchesSelector || element.oMatchesSelector || element.matchesSelector;
      if (matchesSelector)
        return matchesSelector.call(element, selector);
      var match, parent = element.parentNode, temp = !parent;
      if (temp)
        (parent = tempParent).appendChild(element);
      match = ~zepto.qsa(parent, selector).indexOf(element);
      temp && tempParent.removeChild(element);
      return match;
    };
    function type(obj) {
      return obj == null ? String(obj) : class2type[toString.call(obj)] || 'object';
    }
    function isFunction(value) {
      return type(value) == 'function';
    }
    function isWindow(obj) {
      return obj != null && obj == obj.window;
    }
    function isDocument(obj) {
      return obj != null && obj.nodeType == obj.DOCUMENT_NODE;
    }
    function isObject(obj) {
      return type(obj) == 'object';
    }
    function isPlainObject(obj) {
      return isObject(obj) && !isWindow(obj) && Object.getPrototypeOf(obj) == Object.prototype;
    }
    function isArray(value) {
      return value instanceof Array;
    }
    function likeArray(obj) {
      return typeof obj.length == 'number';
    }
    function compact(array) {
      return filter.call(array, function (item) {
        return item != null;
      });
    }
    function flatten(array) {
      return array.length > 0 ? $.fn.concat.apply([], array) : array;
    }
    camelize = function (str) {
      return str.replace(/-+(.)?/g, function (match, chr) {
        return chr ? chr.toUpperCase() : '';
      });
    };
    function dasherize(str) {
      return str.replace(/::/g, '/').replace(/([A-Z]+)([A-Z][a-z])/g, '$1_$2').replace(/([a-z\d])([A-Z])/g, '$1_$2').replace(/_/g, '-').toLowerCase();
    }
    uniq = function (array) {
      return filter.call(array, function (item, idx) {
        return array.indexOf(item) == idx;
      });
    };
    function classRE(name) {
      return name in classCache ? classCache[name] : classCache[name] = new RegExp('(^|\\s)' + name + '(\\s|$)');
    }
    function maybeAddPx(name, value) {
      return typeof value == 'number' && !cssNumber[dasherize(name)] ? value + 'px' : value;
    }
    function defaultDisplay(nodeName) {
      var element, display;
      if (!elementDisplay[nodeName]) {
        element = document.createElement(nodeName);
        document.body.appendChild(element);
        display = getComputedStyle(element, '').getPropertyValue('display');
        element.parentNode.removeChild(element);
        display == 'none' && (display = 'block');
        elementDisplay[nodeName] = display;
      }
      return elementDisplay[nodeName];
    }
    function children(element) {
      return 'children' in element ? slice.call(element.children) : $.map(element.childNodes, function (node) {
        if (node.nodeType == 1)
          return node;
      });
    }
    zepto.fragment = function (html, name, properties) {
      var dom, nodes, container;
      if (singleTagRE.test(html))
        dom = $(document.createElement(RegExp.$1));
      if (!dom) {
        if (html.replace)
          html = html.replace(tagExpanderRE, '<$1></$2>');
        if (name === undefined)
          name = fragmentRE.test(html) && RegExp.$1;
        if (!(name in containers))
          name = '*';
        container = containers[name];
        container.innerHTML = '' + html;
        dom = $.each(slice.call(container.childNodes), function () {
          container.removeChild(this);
        });
      }
      if (isPlainObject(properties)) {
        nodes = $(dom);
        $.each(properties, function (key, value) {
          if (methodAttributes.indexOf(key) > -1)
            nodes[key](value);
          else
            nodes.attr(key, value);
        });
      }
      return dom;
    };
    zepto.Z = function (dom, selector) {
      dom = dom || [];
      dom.__proto__ = $.fn;
      dom.selector = selector || '';
      return dom;
    };
    zepto.isZ = function (object) {
      return object instanceof zepto.Z;
    };
    zepto.init = function (selector, context) {
      var dom;
      if (!selector)
        return zepto.Z();
      else if (typeof selector == 'string') {
        selector = selector.trim();
        if (selector[0] == '<' && fragmentRE.test(selector))
          dom = zepto.fragment(selector, RegExp.$1, context), selector = null;
        else if (context !== undefined)
          return $(context).find(selector);
        else
          dom = zepto.qsa(document, selector);
      } else if (isFunction(selector))
        return $(document).ready(selector);
      else if (zepto.isZ(selector))
        return selector;
      else {
        if (isArray(selector))
          dom = compact(selector);
        else if (isObject(selector))
          dom = [selector], selector = null;
        else if (fragmentRE.test(selector))
          dom = zepto.fragment(selector.trim(), RegExp.$1, context), selector = null;
        else if (context !== undefined)
          return $(context).find(selector);
        else
          dom = zepto.qsa(document, selector);
      }
      return zepto.Z(dom, selector);
    };
    $ = function (selector, context) {
      return zepto.init(selector, context);
    };
    function extend(target, source, deep) {
      for (key in source)
        if (deep && (isPlainObject(source[key]) || isArray(source[key]))) {
          if (isPlainObject(source[key]) && !isPlainObject(target[key]))
            target[key] = {};
          if (isArray(source[key]) && !isArray(target[key]))
            target[key] = [];
          extend(target[key], source[key], deep);
        } else if (source[key] !== undefined)
          target[key] = source[key];
    }
    $.extend = function (target) {
      var deep, args = slice.call(arguments, 1);
      if (typeof target == 'boolean') {
        deep = target;
        target = args.shift();
      }
      args.forEach(function (arg) {
        extend(target, arg, deep);
      });
      return target;
    };
    zepto.qsa = function (element, selector) {
      var found, maybeID = selector[0] == '#', maybeClass = !maybeID && selector[0] == '.', nameOnly = maybeID || maybeClass ? selector.slice(1) : selector, isSimple = simpleSelectorRE.test(nameOnly);
      return isDocument(element) && isSimple && maybeID ? (found = element.getElementById(nameOnly)) ? [found] : [] : element.nodeType !== 1 && element.nodeType !== 9 ? [] : slice.call(isSimple && !maybeID ? maybeClass ? element.getElementsByClassName(nameOnly) : element.getElementsByTagName(selector) : element.querySelectorAll(selector));
    };
    function filtered(nodes, selector) {
      return selector == null ? $(nodes) : $(nodes).filter(selector);
    }
    $.contains = function (parent, node) {
      return parent !== node && parent.contains(node);
    };
    function funcArg(context, arg, idx, payload) {
      return isFunction(arg) ? arg.call(context, idx, payload) : arg;
    }
    function setAttribute(node, name, value) {
      value == null ? node.removeAttribute(name) : node.setAttribute(name, value);
    }
    function className(node, value) {
      var klass = node.className, svg = klass && klass.baseVal !== undefined;
      if (value === undefined)
        return svg ? klass.baseVal : klass;
      svg ? klass.baseVal = value : node.className = value;
    }
    function deserializeValue(value) {
      var num;
      try {
        return value ? value == 'true' || (value == 'false' ? false : value == 'null' ? null : !/^0/.test(value) && !isNaN(num = Number(value)) ? num : /^[\[\{]/.test(value) ? $.parseJSON(value) : value) : value;
      } catch (e) {
        return value;
      }
    }
    $.type = type;
    $.isFunction = isFunction;
    $.isWindow = isWindow;
    $.isArray = isArray;
    $.isPlainObject = isPlainObject;
    $.isEmptyObject = function (obj) {
      var name;
      for (name in obj)
        return false;
      return true;
    };
    $.inArray = function (elem, array, i) {
      return emptyArray.indexOf.call(array, elem, i);
    };
    $.camelCase = camelize;
    $.trim = function (str) {
      return str == null ? '' : String.prototype.trim.call(str);
    };
    $.uuid = 0;
    $.support = {};
    $.expr = {};
    $.map = function (elements, callback) {
      var value, values = [], i, key;
      if (likeArray(elements))
        for (i = 0; i < elements.length; i++) {
          value = callback(elements[i], i);
          if (value != null)
            values.push(value);
        }
      else
        for (key in elements) {
          value = callback(elements[key], key);
          if (value != null)
            values.push(value);
        }
      return flatten(values);
    };
    $.each = function (elements, callback) {
      var i, key;
      if (likeArray(elements)) {
        for (i = 0; i < elements.length; i++)
          if (callback.call(elements[i], i, elements[i]) === false)
            return elements;
      } else {
        for (key in elements)
          if (callback.call(elements[key], key, elements[key]) === false)
            return elements;
      }
      return elements;
    };
    $.grep = function (elements, callback) {
      return filter.call(elements, callback);
    };
    if (window.JSON)
      $.parseJSON = JSON.parse;
    $.each('Boolean Number String Function Array Date RegExp Object Error'.split(' '), function (i, name) {
      class2type['[object ' + name + ']'] = name.toLowerCase();
    });
    $.fn = {
      forEach: emptyArray.forEach,
      reduce: emptyArray.reduce,
      push: emptyArray.push,
      sort: emptyArray.sort,
      indexOf: emptyArray.indexOf,
      concat: emptyArray.concat,
      map: function (fn) {
        return $($.map(this, function (el, i) {
          return fn.call(el, i, el);
        }));
      },
      slice: function () {
        return $(slice.apply(this, arguments));
      },
      ready: function (callback) {
        if (readyRE.test(document.readyState) && document.body)
          callback($);
        else
          document.addEventListener('DOMContentLoaded', function () {
            callback($);
          }, false);
        return this;
      },
      get: function (idx) {
        return idx === undefined ? slice.call(this) : this[idx >= 0 ? idx : idx + this.length];
      },
      toArray: function () {
        return this.get();
      },
      size: function () {
        return this.length;
      },
      remove: function () {
        return this.each(function () {
          if (this.parentNode != null)
            this.parentNode.removeChild(this);
        });
      },
      each: function (callback) {
        emptyArray.every.call(this, function (el, idx) {
          return callback.call(el, idx, el) !== false;
        });
        return this;
      },
      filter: function (selector) {
        if (isFunction(selector))
          return this.not(this.not(selector));
        return $(filter.call(this, function (element) {
          return zepto.matches(element, selector);
        }));
      },
      add: function (selector, context) {
        return $(uniq(this.concat($(selector, context))));
      },
      is: function (selector) {
        return this.length > 0 && zepto.matches(this[0], selector);
      },
      not: function (selector) {
        var nodes = [];
        if (isFunction(selector) && selector.call !== undefined)
          this.each(function (idx) {
            if (!selector.call(this, idx))
              nodes.push(this);
          });
        else {
          var excludes = typeof selector == 'string' ? this.filter(selector) : likeArray(selector) && isFunction(selector.item) ? slice.call(selector) : $(selector);
          this.forEach(function (el) {
            if (excludes.indexOf(el) < 0)
              nodes.push(el);
          });
        }
        return $(nodes);
      },
      has: function (selector) {
        return this.filter(function () {
          return isObject(selector) ? $.contains(this, selector) : $(this).find(selector).size();
        });
      },
      eq: function (idx) {
        return idx === -1 ? this.slice(idx) : this.slice(idx, +idx + 1);
      },
      first: function () {
        var el = this[0];
        return el && !isObject(el) ? el : $(el);
      },
      last: function () {
        var el = this[this.length - 1];
        return el && !isObject(el) ? el : $(el);
      },
      find: function (selector) {
        var result, $this = this;
        if (typeof selector == 'object')
          result = $(selector).filter(function () {
            var node = this;
            return emptyArray.some.call($this, function (parent) {
              return $.contains(parent, node);
            });
          });
        else if (this.length == 1)
          result = $(zepto.qsa(this[0], selector));
        else
          result = this.map(function () {
            return zepto.qsa(this, selector);
          });
        return result;
      },
      closest: function (selector, context) {
        var node = this[0], collection = false;
        if (typeof selector == 'object')
          collection = $(selector);
        while (node && !(collection ? collection.indexOf(node) >= 0 : zepto.matches(node, selector)))
          node = node !== context && !isDocument(node) && node.parentNode;
        return $(node);
      },
      parents: function (selector) {
        var ancestors = [], nodes = this;
        while (nodes.length > 0)
          nodes = $.map(nodes, function (node) {
            if ((node = node.parentNode) && !isDocument(node) && ancestors.indexOf(node) < 0) {
              ancestors.push(node);
              return node;
            }
          });
        return filtered(ancestors, selector);
      },
      parent: function (selector) {
        return filtered(uniq(this.pluck('parentNode')), selector);
      },
      children: function (selector) {
        return filtered(this.map(function () {
          return children(this);
        }), selector);
      },
      contents: function () {
        return this.map(function () {
          return slice.call(this.childNodes);
        });
      },
      siblings: function (selector) {
        return filtered(this.map(function (i, el) {
          return filter.call(children(el.parentNode), function (child) {
            return child !== el;
          });
        }), selector);
      },
      empty: function () {
        return this.each(function () {
          this.innerHTML = '';
        });
      },
      pluck: function (property) {
        return $.map(this, function (el) {
          return el[property];
        });
      },
      show: function () {
        return this.each(function () {
          this.style.display == 'none' && (this.style.display = '');
          if (getComputedStyle(this, '').getPropertyValue('display') == 'none')
            this.style.display = defaultDisplay(this.nodeName);
        });
      },
      replaceWith: function (newContent) {
        return this.before(newContent).remove();
      },
      wrap: function (structure) {
        var func = isFunction(structure);
        if (this[0] && !func)
          var dom = $(structure).get(0), clone = dom.parentNode || this.length > 1;
        return this.each(function (index) {
          $(this).wrapAll(func ? structure.call(this, index) : clone ? dom.cloneNode(true) : dom);
        });
      },
      wrapAll: function (structure) {
        if (this[0]) {
          $(this[0]).before(structure = $(structure));
          var children;
          while ((children = structure.children()).length)
            structure = children.first();
          $(structure).append(this);
        }
        return this;
      },
      wrapInner: function (structure) {
        var func = isFunction(structure);
        return this.each(function (index) {
          var self = $(this), contents = self.contents(), dom = func ? structure.call(this, index) : structure;
          contents.length ? contents.wrapAll(dom) : self.append(dom);
        });
      },
      unwrap: function () {
        this.parent().each(function () {
          $(this).replaceWith($(this).children());
        });
        return this;
      },
      clone: function () {
        return this.map(function () {
          return this.cloneNode(true);
        });
      },
      hide: function () {
        return this.css('display', 'none');
      },
      toggle: function (setting) {
        return this.each(function () {
          var el = $(this);
          ;
          (setting === undefined ? el.css('display') == 'none' : setting) ? el.show() : el.hide();
        });
      },
      prev: function (selector) {
        return $(this.pluck('previousElementSibling')).filter(selector || '*');
      },
      next: function (selector) {
        return $(this.pluck('nextElementSibling')).filter(selector || '*');
      },
      html: function (html) {
        return arguments.length === 0 ? this.length > 0 ? this[0].innerHTML : null : this.each(function (idx) {
          var originHtml = this.innerHTML;
          $(this).empty().append(funcArg(this, html, idx, originHtml));
        });
      },
      text: function (text) {
        return arguments.length === 0 ? this.length > 0 ? this[0].textContent : null : this.each(function () {
          this.textContent = text === undefined ? '' : '' + text;
        });
      },
      attr: function (name, value) {
        var result;
        return typeof name == 'string' && value === undefined ? this.length == 0 || this[0].nodeType !== 1 ? undefined : name == 'value' && this[0].nodeName == 'INPUT' ? this.val() : !(result = this[0].getAttribute(name)) && name in this[0] ? this[0][name] : result : this.each(function (idx) {
          if (this.nodeType !== 1)
            return;
          if (isObject(name))
            for (key in name)
              setAttribute(this, key, name[key]);
          else
            setAttribute(this, name, funcArg(this, value, idx, this.getAttribute(name)));
        });
      },
      removeAttr: function (name) {
        return this.each(function () {
          this.nodeType === 1 && setAttribute(this, name);
        });
      },
      prop: function (name, value) {
        name = propMap[name] || name;
        return value === undefined ? this[0] && this[0][name] : this.each(function (idx) {
          this[name] = funcArg(this, value, idx, this[name]);
        });
      },
      data: function (name, value) {
        var data = this.attr('data-' + name.replace(capitalRE, '-$1').toLowerCase(), value);
        return data !== null ? deserializeValue(data) : undefined;
      },
      val: function (value) {
        return arguments.length === 0 ? this[0] && (this[0].multiple ? $(this[0]).find('option').filter(function () {
          return this.selected;
        }).pluck('value') : this[0].value) : this.each(function (idx) {
          this.value = funcArg(this, value, idx, this.value);
        });
      },
      offset: function (coordinates) {
        if (coordinates)
          return this.each(function (index) {
            var $this = $(this), coords = funcArg(this, coordinates, index, $this.offset()), parentOffset = $this.offsetParent().offset(), props = {
                top: coords.top - parentOffset.top,
                left: coords.left - parentOffset.left
              };
            if ($this.css('position') == 'static')
              props['position'] = 'relative';
            $this.css(props);
          });
        if (this.length == 0)
          return null;
        var obj = this[0].getBoundingClientRect();
        return {
          left: obj.left + window.pageXOffset,
          top: obj.top + window.pageYOffset,
          width: Math.round(obj.width),
          height: Math.round(obj.height)
        };
      },
      css: function (property, value) {
        if (arguments.length < 2) {
          var element = this[0], computedStyle = getComputedStyle(element, '');
          if (!element)
            return;
          if (typeof property == 'string')
            return element.style[camelize(property)] || computedStyle.getPropertyValue(property);
          else if (isArray(property)) {
            var props = {};
            $.each(isArray(property) ? property : [property], function (_, prop) {
              props[prop] = element.style[camelize(prop)] || computedStyle.getPropertyValue(prop);
            });
            return props;
          }
        }
        var css = '';
        if (type(property) == 'string') {
          if (!value && value !== 0)
            this.each(function () {
              this.style.removeProperty(dasherize(property));
            });
          else
            css = dasherize(property) + ':' + maybeAddPx(property, value);
        } else {
          for (key in property)
            if (!property[key] && property[key] !== 0)
              this.each(function () {
                this.style.removeProperty(dasherize(key));
              });
            else
              css += dasherize(key) + ':' + maybeAddPx(key, property[key]) + ';';
        }
        return this.each(function () {
          this.style.cssText += ';' + css;
        });
      },
      index: function (element) {
        return element ? this.indexOf($(element)[0]) : this.parent().children().indexOf(this[0]);
      },
      hasClass: function (name) {
        if (!name)
          return false;
        return emptyArray.some.call(this, function (el) {
          return this.test(className(el));
        }, classRE(name));
      },
      addClass: function (name) {
        if (!name)
          return this;
        return this.each(function (idx) {
          classList = [];
          var cls = className(this), newName = funcArg(this, name, idx, cls);
          newName.split(/\s+/g).forEach(function (klass) {
            if (!$(this).hasClass(klass))
              classList.push(klass);
          }, this);
          classList.length && className(this, cls + (cls ? ' ' : '') + classList.join(' '));
        });
      },
      removeClass: function (name) {
        return this.each(function (idx) {
          if (name === undefined)
            return className(this, '');
          classList = className(this);
          funcArg(this, name, idx, classList).split(/\s+/g).forEach(function (klass) {
            classList = classList.replace(classRE(klass), ' ');
          });
          className(this, classList.trim());
        });
      },
      toggleClass: function (name, when) {
        if (!name)
          return this;
        return this.each(function (idx) {
          var $this = $(this), names = funcArg(this, name, idx, className(this));
          names.split(/\s+/g).forEach(function (klass) {
            (when === undefined ? !$this.hasClass(klass) : when) ? $this.addClass(klass) : $this.removeClass(klass);
          });
        });
      },
      scrollTop: function (value) {
        if (!this.length)
          return;
        var hasScrollTop = 'scrollTop' in this[0];
        if (value === undefined)
          return hasScrollTop ? this[0].scrollTop : this[0].pageYOffset;
        return this.each(hasScrollTop ? function () {
          this.scrollTop = value;
        } : function () {
          this.scrollTo(this.scrollX, value);
        });
      },
      scrollLeft: function (value) {
        if (!this.length)
          return;
        var hasScrollLeft = 'scrollLeft' in this[0];
        if (value === undefined)
          return hasScrollLeft ? this[0].scrollLeft : this[0].pageXOffset;
        return this.each(hasScrollLeft ? function () {
          this.scrollLeft = value;
        } : function () {
          this.scrollTo(value, this.scrollY);
        });
      },
      position: function () {
        if (!this.length)
          return;
        var elem = this[0], offsetParent = this.offsetParent(), offset = this.offset(), parentOffset = rootNodeRE.test(offsetParent[0].nodeName) ? {
            top: 0,
            left: 0
          } : offsetParent.offset();
        offset.top -= parseFloat($(elem).css('margin-top')) || 0;
        offset.left -= parseFloat($(elem).css('margin-left')) || 0;
        parentOffset.top += parseFloat($(offsetParent[0]).css('border-top-width')) || 0;
        parentOffset.left += parseFloat($(offsetParent[0]).css('border-left-width')) || 0;
        return {
          top: offset.top - parentOffset.top,
          left: offset.left - parentOffset.left
        };
      },
      offsetParent: function () {
        return this.map(function () {
          var parent = this.offsetParent || document.body;
          while (parent && !rootNodeRE.test(parent.nodeName) && $(parent).css('position') == 'static')
            parent = parent.offsetParent;
          return parent;
        });
      }
    };
    $.fn.detach = $.fn.remove;
    ;
    [
      'width',
      'height'
    ].forEach(function (dimension) {
      var dimensionProperty = dimension.replace(/./, function (m) {
          return m[0].toUpperCase();
        });
      $.fn[dimension] = function (value) {
        var offset, el = this[0];
        if (value === undefined)
          return isWindow(el) ? el['inner' + dimensionProperty] : isDocument(el) ? el.documentElement['scroll' + dimensionProperty] : (offset = this.offset()) && offset[dimension];
        else
          return this.each(function (idx) {
            el = $(this);
            el.css(dimension, funcArg(this, value, idx, el[dimension]()));
          });
      };
    });
    function traverseNode(node, fun) {
      fun(node);
      for (var key in node.childNodes)
        traverseNode(node.childNodes[key], fun);
    }
    adjacencyOperators.forEach(function (operator, operatorIndex) {
      var inside = operatorIndex % 2;
      $.fn[operator] = function () {
        var argType, nodes = $.map(arguments, function (arg) {
            argType = type(arg);
            return argType == 'object' || argType == 'array' || arg == null ? arg : zepto.fragment(arg);
          }), parent, copyByClone = this.length > 1;
        if (nodes.length < 1)
          return this;
        return this.each(function (_, target) {
          parent = inside ? target : target.parentNode;
          target = operatorIndex == 0 ? target.nextSibling : operatorIndex == 1 ? target.firstChild : operatorIndex == 2 ? target : null;
          nodes.forEach(function (node) {
            if (copyByClone)
              node = node.cloneNode(true);
            else if (!parent)
              return $(node).remove();
            traverseNode(parent.insertBefore(node, target), function (el) {
              if (el.nodeName != null && el.nodeName.toUpperCase() === 'SCRIPT' && (!el.type || el.type === 'text/javascript') && !el.src)
                window['eval'].call(window, el.innerHTML);
            });
          });
        });
      };
      $.fn[inside ? operator + 'To' : 'insert' + (operatorIndex ? 'Before' : 'After')] = function (html) {
        $(html)[operator](this);
        return this;
      };
    });
    zepto.Z.prototype = $.fn;
    zepto.uniq = uniq;
    zepto.deserializeValue = deserializeValue;
    $.zepto = zepto;
    return $;
  }();
window.Zepto = Zepto;
window.$ === undefined && (window.$ = Zepto);
;
(function ($) {
  var slice = Array.prototype.slice;
  function Deferred(func) {
    var tuples = [
        [
          'resolve',
          'done',
          $.Callbacks({
            once: 1,
            memory: 1
          }),
          'resolved'
        ],
        [
          'reject',
          'fail',
          $.Callbacks({
            once: 1,
            memory: 1
          }),
          'rejected'
        ],
        [
          'notify',
          'progress',
          $.Callbacks({ memory: 1 })
        ]
      ], state = 'pending', promise = {
        state: function () {
          return state;
        },
        always: function () {
          deferred.done(arguments).fail(arguments);
          return this;
        },
        then: function () {
          var fns = arguments;
          return Deferred(function (defer) {
            $.each(tuples, function (i, tuple) {
              var fn = $.isFunction(fns[i]) && fns[i];
              deferred[tuple[1]](function () {
                var returned = fn && fn.apply(this, arguments);
                if (returned && $.isFunction(returned.promise)) {
                  returned.promise().done(defer.resolve).fail(defer.reject).progress(defer.notify);
                } else {
                  var context = this === promise ? defer.promise() : this, values = fn ? [returned] : arguments;
                  defer[tuple[0] + 'With'](context, values);
                }
              });
            });
            fns = null;
          }).promise();
        },
        promise: function (obj) {
          return obj != null ? $.extend(obj, promise) : promise;
        }
      }, deferred = {};
    $.each(tuples, function (i, tuple) {
      var list = tuple[2], stateString = tuple[3];
      promise[tuple[1]] = list.add;
      if (stateString) {
        list.add(function () {
          state = stateString;
        }, tuples[i ^ 1][2].disable, tuples[2][2].lock);
      }
      deferred[tuple[0]] = function () {
        deferred[tuple[0] + 'With'](this === deferred ? promise : this, arguments);
        return this;
      };
      deferred[tuple[0] + 'With'] = list.fireWith;
    });
    promise.promise(deferred);
    if (func)
      func.call(deferred, deferred);
    return deferred;
  }
  $.when = function (sub) {
    var resolveValues = slice.call(arguments), len = resolveValues.length, i = 0, remain = len !== 1 || sub && $.isFunction(sub.promise) ? len : 0, deferred = remain === 1 ? sub : Deferred(), progressValues, progressContexts, resolveContexts, updateFn = function (i, ctx, val) {
        return function (value) {
          ctx[i] = this;
          val[i] = arguments.length > 1 ? slice.call(arguments) : value;
          if (val === progressValues) {
            deferred.notifyWith(ctx, val);
          } else if (!--remain) {
            deferred.resolveWith(ctx, val);
          }
        };
      };
    if (len > 1) {
      progressValues = new Array(len);
      progressContexts = new Array(len);
      resolveContexts = new Array(len);
      for (; i < len; ++i) {
        if (resolveValues[i] && $.isFunction(resolveValues[i].promise)) {
          resolveValues[i].promise().done(updateFn(i, resolveContexts, resolveValues)).fail(deferred.reject).progress(updateFn(i, progressContexts, progressValues));
        } else {
          --remain;
        }
      }
    }
    if (!remain)
      deferred.resolveWith(resolveContexts, resolveValues);
    return deferred.promise();
  };
  $.Deferred = Deferred;
}(Zepto));
;
(function ($) {
  $.Callbacks = function (options) {
    options = $.extend({}, options);
    var memory, fired, firing, firingStart, firingLength, firingIndex, list = [], stack = !options.once && [], fire = function (data) {
        memory = options.memory && data;
        fired = true;
        firingIndex = firingStart || 0;
        firingStart = 0;
        firingLength = list.length;
        firing = true;
        for (; list && firingIndex < firingLength; ++firingIndex) {
          if (list[firingIndex].apply(data[0], data[1]) === false && options.stopOnFalse) {
            memory = false;
            break;
          }
        }
        firing = false;
        if (list) {
          if (stack)
            stack.length && fire(stack.shift());
          else if (memory)
            list.length = 0;
          else
            Callbacks.disable();
        }
      }, Callbacks = {
        add: function () {
          if (list) {
            var start = list.length, add = function (args) {
                $.each(args, function (_, arg) {
                  if (typeof arg === 'function') {
                    if (!options.unique || !Callbacks.has(arg))
                      list.push(arg);
                  } else if (arg && arg.length && typeof arg !== 'string')
                    add(arg);
                });
              };
            add(arguments);
            if (firing)
              firingLength = list.length;
            else if (memory) {
              firingStart = start;
              fire(memory);
            }
          }
          return this;
        },
        remove: function () {
          if (list) {
            $.each(arguments, function (_, arg) {
              var index;
              while ((index = $.inArray(arg, list, index)) > -1) {
                list.splice(index, 1);
                if (firing) {
                  if (index <= firingLength)
                    --firingLength;
                  if (index <= firingIndex)
                    --firingIndex;
                }
              }
            });
          }
          return this;
        },
        has: function (fn) {
          return !!(list && (fn ? $.inArray(fn, list) > -1 : list.length));
        },
        empty: function () {
          firingLength = list.length = 0;
          return this;
        },
        disable: function () {
          list = stack = memory = undefined;
          return this;
        },
        disabled: function () {
          return !list;
        },
        lock: function () {
          stack = undefined;
          if (!memory)
            Callbacks.disable();
          return this;
        },
        locked: function () {
          return !stack;
        },
        fireWith: function (context, args) {
          if (list && (!fired || stack)) {
            args = args || [];
            args = [
              context,
              args.slice ? args.slice() : args
            ];
            if (firing)
              stack.push(args);
            else
              fire(args);
          }
          return this;
        },
        fire: function () {
          return Callbacks.fireWith(this, arguments);
        },
        fired: function () {
          return !!fired;
        }
      };
    return Callbacks;
  };
}(Zepto));
;
(function ($) {
  var $$ = $.zepto.qsa, _zid = 1, undefined, slice = Array.prototype.slice, isFunction = $.isFunction, isString = function (obj) {
      return typeof obj == 'string';
    }, handlers = {}, specialEvents = {}, focusinSupported = 'onfocusin' in window, focus = {
      focus: 'focusin',
      blur: 'focusout'
    }, hover = {
      mouseenter: 'mouseover',
      mouseleave: 'mouseout'
    };
  specialEvents.click = specialEvents.mousedown = specialEvents.mouseup = specialEvents.mousemove = 'MouseEvents';
  function zid(element) {
    return element._zid || (element._zid = _zid++);
  }
  function findHandlers(element, event, fn, selector) {
    event = parse(event);
    if (event.ns)
      var matcher = matcherFor(event.ns);
    return (handlers[zid(element)] || []).filter(function (handler) {
      return handler && (!event.e || handler.e == event.e) && (!event.ns || matcher.test(handler.ns)) && (!fn || zid(handler.fn) === zid(fn)) && (!selector || handler.sel == selector);
    });
  }
  function parse(event) {
    var parts = ('' + event).split('.');
    return {
      e: parts[0],
      ns: parts.slice(1).sort().join(' ')
    };
  }
  function matcherFor(ns) {
    return new RegExp('(?:^| )' + ns.replace(' ', ' .* ?') + '(?: |$)');
  }
  function eventCapture(handler, captureSetting) {
    return handler.del && (!focusinSupported && handler.e in focus) || !!captureSetting;
  }
  function realEvent(type) {
    return hover[type] || focusinSupported && focus[type] || type;
  }
  function add(element, events, fn, data, selector, delegator, capture) {
    var id = zid(element), set = handlers[id] || (handlers[id] = []);
    events.split(/\s/).forEach(function (event) {
      if (event == 'ready')
        return $(document).ready(fn);
      var handler = parse(event);
      handler.fn = fn;
      handler.sel = selector;
      if (handler.e in hover)
        fn = function (e) {
          var related = e.relatedTarget;
          if (!related || related !== this && !$.contains(this, related))
            return handler.fn.apply(this, arguments);
        };
      handler.del = delegator;
      var callback = delegator || fn;
      handler.proxy = function (e) {
        e = compatible(e);
        if (e.isImmediatePropagationStopped())
          return;
        e.data = data;
        var result = callback.apply(element, e._args == undefined ? [e] : [e].concat(e._args));
        if (result === false)
          e.preventDefault(), e.stopPropagation();
        return result;
      };
      handler.i = set.length;
      set.push(handler);
      if ('addEventListener' in element)
        element.addEventListener(realEvent(handler.e), handler.proxy, eventCapture(handler, capture));
    });
  }
  function remove(element, events, fn, selector, capture) {
    var id = zid(element);
    ;
    (events || '').split(/\s/).forEach(function (event) {
      findHandlers(element, event, fn, selector).forEach(function (handler) {
        delete handlers[id][handler.i];
        if ('removeEventListener' in element)
          element.removeEventListener(realEvent(handler.e), handler.proxy, eventCapture(handler, capture));
      });
    });
  }
  $.event = {
    add: add,
    remove: remove
  };
  $.proxy = function (fn, context) {
    if (isFunction(fn)) {
      var proxyFn = function () {
        return fn.apply(context, arguments);
      };
      proxyFn._zid = zid(fn);
      return proxyFn;
    } else if (isString(context)) {
      return $.proxy(fn[context], fn);
    } else {
      throw new TypeError('expected function');
    }
  };
  $.fn.bind = function (event, data, callback) {
    return this.on(event, data, callback);
  };
  $.fn.unbind = function (event, callback) {
    return this.off(event, callback);
  };
  $.fn.one = function (event, selector, data, callback) {
    return this.on(event, selector, data, callback, 1);
  };
  var returnTrue = function () {
      return true;
    }, returnFalse = function () {
      return false;
    }, ignoreProperties = /^([A-Z]|returnValue$|layer[XY]$)/, eventMethods = {
      preventDefault: 'isDefaultPrevented',
      stopImmediatePropagation: 'isImmediatePropagationStopped',
      stopPropagation: 'isPropagationStopped'
    };
  function compatible(event, source) {
    if (source || !event.isDefaultPrevented) {
      source || (source = event);
      $.each(eventMethods, function (name, predicate) {
        var sourceMethod = source[name];
        event[name] = function () {
          this[predicate] = returnTrue;
          return sourceMethod && sourceMethod.apply(source, arguments);
        };
        event[predicate] = returnFalse;
      });
      if (source.defaultPrevented !== undefined ? source.defaultPrevented : 'returnValue' in source ? source.returnValue === false : source.getPreventDefault && source.getPreventDefault())
        event.isDefaultPrevented = returnTrue;
    }
    return event;
  }
  function createProxy(event) {
    var key, proxy = { originalEvent: event };
    for (key in event)
      if (!ignoreProperties.test(key) && event[key] !== undefined)
        proxy[key] = event[key];
    return compatible(proxy, event);
  }
  $.fn.delegate = function (selector, event, callback) {
    return this.on(event, selector, callback);
  };
  $.fn.undelegate = function (selector, event, callback) {
    return this.off(event, selector, callback);
  };
  $.fn.live = function (event, callback) {
    $(document.body).delegate(this.selector, event, callback);
    return this;
  };
  $.fn.die = function (event, callback) {
    $(document.body).undelegate(this.selector, event, callback);
    return this;
  };
  $.fn.on = function (event, selector, data, callback, one) {
    var autoRemove, delegator, $this = this;
    if (event && !isString(event)) {
      $.each(event, function (type, fn) {
        $this.on(type, selector, data, fn, one);
      });
      return $this;
    }
    if (!isString(selector) && !isFunction(callback) && callback !== false)
      callback = data, data = selector, selector = undefined;
    if (isFunction(data) || data === false)
      callback = data, data = undefined;
    if (callback === false)
      callback = returnFalse;
    return $this.each(function (_, element) {
      if (one)
        autoRemove = function (e) {
          remove(element, e.type, callback);
          return callback.apply(this, arguments);
        };
      if (selector)
        delegator = function (e) {
          var evt, match = $(e.target).closest(selector, element).get(0);
          if (match && match !== element) {
            evt = $.extend(createProxy(e), {
              currentTarget: match,
              liveFired: element
            });
            return (autoRemove || callback).apply(match, [evt].concat(slice.call(arguments, 1)));
          }
        };
      add(element, event, callback, data, selector, delegator || autoRemove);
    });
  };
  $.fn.off = function (event, selector, callback) {
    var $this = this;
    if (event && !isString(event)) {
      $.each(event, function (type, fn) {
        $this.off(type, selector, fn);
      });
      return $this;
    }
    if (!isString(selector) && !isFunction(callback) && callback !== false)
      callback = selector, selector = undefined;
    if (callback === false)
      callback = returnFalse;
    return $this.each(function () {
      remove(this, event, callback, selector);
    });
  };
  $.fn.trigger = function (event, args) {
    event = isString(event) || $.isPlainObject(event) ? $.Event(event) : compatible(event);
    event._args = args;
    return this.each(function () {
      if ('dispatchEvent' in this)
        this.dispatchEvent(event);
      else
        $(this).triggerHandler(event, args);
    });
  };
  $.fn.triggerHandler = function (event, args) {
    var e, result;
    this.each(function (i, element) {
      e = createProxy(isString(event) ? $.Event(event) : event);
      e._args = args;
      e.target = element;
      $.each(findHandlers(element, event.type || event), function (i, handler) {
        result = handler.proxy(e);
        if (e.isImmediatePropagationStopped())
          return false;
      });
    });
    return result;
  };
  ;
  ('focusin focusout load resize scroll unload click dblclick ' + 'mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave ' + 'change select keydown keypress keyup error').split(' ').forEach(function (event) {
    $.fn[event] = function (callback) {
      return callback ? this.bind(event, callback) : this.trigger(event);
    };
  });
  ;
  [
    'focus',
    'blur'
  ].forEach(function (name) {
    $.fn[name] = function (callback) {
      if (callback)
        this.bind(name, callback);
      else
        this.each(function () {
          try {
            this[name]();
          } catch (e) {
          }
        });
      return this;
    };
  });
  $.Event = function (type, props) {
    if (!isString(type))
      props = type, type = props.type;
    var event = document.createEvent(specialEvents[type] || 'Events'), bubbles = true;
    if (props)
      for (var name in props)
        name == 'bubbles' ? bubbles = !!props[name] : event[name] = props[name];
    event.initEvent(type, bubbles, true);
    return compatible(event);
  };
}(Zepto));
;
(function ($) {
  var jsonpID = 0, document = window.document, key, name, rscript = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, scriptTypeRE = /^(?:text|application)\/javascript/i, xmlTypeRE = /^(?:text|application)\/xml/i, jsonType = 'application/json', htmlType = 'text/html', blankRE = /^\s*$/;
  function triggerAndReturn(context, eventName, data) {
    var event = $.Event(eventName);
    $(context).trigger(event, data);
    return !event.isDefaultPrevented();
  }
  function triggerGlobal(settings, context, eventName, data) {
    if (settings.global)
      return triggerAndReturn(context || document, eventName, data);
  }
  $.active = 0;
  function ajaxStart(settings) {
    if (settings.global && $.active++ === 0)
      triggerGlobal(settings, null, 'ajaxStart');
  }
  function ajaxStop(settings) {
    if (settings.global && !--$.active)
      triggerGlobal(settings, null, 'ajaxStop');
  }
  function ajaxBeforeSend(xhr, settings) {
    var context = settings.context;
    if (settings.beforeSend.call(context, xhr, settings) === false || triggerGlobal(settings, context, 'ajaxBeforeSend', [
        xhr,
        settings
      ]) === false)
      return false;
    triggerGlobal(settings, context, 'ajaxSend', [
      xhr,
      settings
    ]);
  }
  function ajaxSuccess(data, xhr, settings, deferred) {
    var context = settings.context, status = 'success';
    settings.success.call(context, data, status, xhr);
    if (deferred)
      deferred.resolveWith(context, [
        data,
        status,
        xhr
      ]);
    triggerGlobal(settings, context, 'ajaxSuccess', [
      xhr,
      settings,
      data
    ]);
    ajaxComplete(status, xhr, settings);
  }
  function ajaxError(error, type, xhr, settings, deferred) {
    var context = settings.context;
    settings.error.call(context, xhr, type, error);
    if (deferred)
      deferred.rejectWith(context, [
        xhr,
        type,
        error
      ]);
    triggerGlobal(settings, context, 'ajaxError', [
      xhr,
      settings,
      error || type
    ]);
    ajaxComplete(type, xhr, settings);
  }
  function ajaxComplete(status, xhr, settings) {
    var context = settings.context;
    settings.complete.call(context, xhr, status);
    triggerGlobal(settings, context, 'ajaxComplete', [
      xhr,
      settings
    ]);
    ajaxStop(settings);
  }
  function empty() {
  }
  $.ajaxJSONP = function (options, deferred) {
    if (!('type' in options))
      return $.ajax(options);
    var _callbackName = options.jsonpCallback, callbackName = ($.isFunction(_callbackName) ? _callbackName() : _callbackName) || 'jsonp' + ++jsonpID, script = document.createElement('script'), originalCallback = window[callbackName], responseData, abort = function (errorType) {
        $(script).triggerHandler('error', errorType || 'abort');
      }, xhr = { abort: abort }, abortTimeout;
    if (deferred)
      deferred.promise(xhr);
    $(script).on('load error', function (e, errorType) {
      clearTimeout(abortTimeout);
      $(script).off().remove();
      if (e.type == 'error' || !responseData) {
        ajaxError(null, errorType || 'error', xhr, options, deferred);
      } else {
        ajaxSuccess(responseData[0], xhr, options, deferred);
      }
      window[callbackName] = originalCallback;
      if (responseData && $.isFunction(originalCallback))
        originalCallback(responseData[0]);
      originalCallback = responseData = undefined;
    });
    if (ajaxBeforeSend(xhr, options) === false) {
      abort('abort');
      return xhr;
    }
    window[callbackName] = function () {
      responseData = arguments;
    };
    script.src = options.url.replace(/=\?/, '=' + callbackName);
    document.head.appendChild(script);
    if (options.timeout > 0)
      abortTimeout = setTimeout(function () {
        abort('timeout');
      }, options.timeout);
    return xhr;
  };
  $.ajaxSettings = {
    type: 'GET',
    beforeSend: empty,
    success: empty,
    error: empty,
    complete: empty,
    context: null,
    global: true,
    xhr: function () {
      return new window.XMLHttpRequest();
    },
    accepts: {
      script: 'text/javascript, application/javascript, application/x-javascript',
      json: jsonType,
      xml: 'application/xml, text/xml',
      html: htmlType,
      text: 'text/plain'
    },
    crossDomain: false,
    timeout: 0,
    processData: true,
    cache: true
  };
  function mimeToDataType(mime) {
    if (mime)
      mime = mime.split(';', 2)[0];
    return mime && (mime == htmlType ? 'html' : mime == jsonType ? 'json' : scriptTypeRE.test(mime) ? 'script' : xmlTypeRE.test(mime) && 'xml') || 'text';
  }
  function appendQuery(url, query) {
    if (query == '')
      return url;
    return (url + '&' + query).replace(/[&?]{1,2}/, '?');
  }
  function serializeData(options) {
    if (options.processData && options.data && $.type(options.data) != 'string')
      options.data = $.param(options.data, options.traditional);
    if (options.data && (!options.type || options.type.toUpperCase() == 'GET'))
      options.url = appendQuery(options.url, options.data), options.data = undefined;
  }
  $.ajax = function (options) {
    var settings = $.extend({}, options || {}), deferred = $.Deferred && $.Deferred();
    for (key in $.ajaxSettings)
      if (settings[key] === undefined)
        settings[key] = $.ajaxSettings[key];
    ajaxStart(settings);
    if (!settings.crossDomain)
      settings.crossDomain = /^([\w-]+:)?\/\/([^\/]+)/.test(settings.url) && RegExp.$2 != window.location.host;
    if (!settings.url)
      settings.url = window.location.toString();
    serializeData(settings);
    if (settings.cache === false)
      settings.url = appendQuery(settings.url, '_=' + Date.now());
    var dataType = settings.dataType, hasPlaceholder = /=\?/.test(settings.url);
    if (dataType == 'jsonp' || hasPlaceholder) {
      if (!hasPlaceholder)
        settings.url = appendQuery(settings.url, settings.jsonp ? settings.jsonp + '=?' : settings.jsonp === false ? '' : 'callback=?');
      return $.ajaxJSONP(settings, deferred);
    }
    var mime = settings.accepts[dataType], headers = {}, setHeader = function (name, value) {
        headers[name.toLowerCase()] = [
          name,
          value
        ];
      }, protocol = /^([\w-]+:)\/\//.test(settings.url) ? RegExp.$1 : window.location.protocol, xhr = settings.xhr(), nativeSetHeader = xhr.setRequestHeader, abortTimeout;
    if (deferred)
      deferred.promise(xhr);
    if (!settings.crossDomain)
      setHeader('X-Requested-With', 'XMLHttpRequest');
    setHeader('Accept', mime || '*/*');
    if (mime = settings.mimeType || mime) {
      if (mime.indexOf(',') > -1)
        mime = mime.split(',', 2)[0];
      xhr.overrideMimeType && xhr.overrideMimeType(mime);
    }
    if (settings.contentType || settings.contentType !== false && settings.data && settings.type.toUpperCase() != 'GET')
      setHeader('Content-Type', settings.contentType || 'application/x-www-form-urlencoded');
    if (settings.headers)
      for (name in settings.headers)
        setHeader(name, settings.headers[name]);
    xhr.setRequestHeader = setHeader;
    xhr.onreadystatechange = function () {
      if (xhr.readyState == 4) {
        xhr.onreadystatechange = empty;
        clearTimeout(abortTimeout);
        var result, error = false;
        if (xhr.status >= 200 && xhr.status < 300 || xhr.status == 304 || xhr.status == 0 && protocol == 'file:') {
          dataType = dataType || mimeToDataType(settings.mimeType || xhr.getResponseHeader('content-type'));
          result = xhr.responseText;
          try {
            if (dataType == 'script')
              (1, eval)(result);
            else if (dataType == 'xml')
              result = xhr.responseXML;
            else if (dataType == 'json')
              result = blankRE.test(result) ? null : $.parseJSON(result);
          } catch (e) {
            error = e;
          }
          if (error)
            ajaxError(error, 'parsererror', xhr, settings, deferred);
          else
            ajaxSuccess(result, xhr, settings, deferred);
        } else {
          ajaxError(xhr.statusText || null, xhr.status ? 'error' : 'abort', xhr, settings, deferred);
        }
      }
    };
    if (ajaxBeforeSend(xhr, settings) === false) {
      xhr.abort();
      ajaxError(null, 'abort', xhr, settings, deferred);
      return xhr;
    }
    if (settings.xhrFields)
      for (name in settings.xhrFields)
        xhr[name] = settings.xhrFields[name];
    var async = 'async' in settings ? settings.async : true;
    xhr.open(settings.type, settings.url, async, settings.username, settings.password);
    for (name in headers)
      nativeSetHeader.apply(xhr, headers[name]);
    if (settings.timeout > 0)
      abortTimeout = setTimeout(function () {
        xhr.onreadystatechange = empty;
        xhr.abort();
        ajaxError(null, 'timeout', xhr, settings, deferred);
      }, settings.timeout);
    xhr.send(settings.data ? settings.data : null);
    return xhr;
  };
  function parseArguments(url, data, success, dataType) {
    var hasData = !$.isFunction(data);
    return {
      url: url,
      data: hasData ? data : undefined,
      success: !hasData ? data : $.isFunction(success) ? success : undefined,
      dataType: hasData ? dataType || success : success
    };
  }
  $.get = function (url, data, success, dataType) {
    return $.ajax(parseArguments.apply(null, arguments));
  };
  $.post = function (url, data, success, dataType) {
    var options = parseArguments.apply(null, arguments);
    options.type = 'POST';
    return $.ajax(options);
  };
  $.getJSON = function (url, data, success) {
    var options = parseArguments.apply(null, arguments);
    options.dataType = 'json';
    return $.ajax(options);
  };
  $.fn.load = function (url, data, success) {
    if (!this.length)
      return this;
    var self = this, parts = url.split(/\s/), selector, options = parseArguments(url, data, success), callback = options.success;
    if (parts.length > 1)
      options.url = parts[0], selector = parts[1];
    options.success = function (response) {
      self.html(selector ? $('<div>').html(response.replace(rscript, '')).find(selector) : response);
      callback && callback.apply(self, arguments);
    };
    $.ajax(options);
    return this;
  };
  var escape = encodeURIComponent;
  function serialize(params, obj, traditional, scope) {
    var type, array = $.isArray(obj), hash = $.isPlainObject(obj);
    $.each(obj, function (key, value) {
      type = $.type(value);
      if (scope)
        key = traditional ? scope : scope + '[' + (hash || type == 'object' || type == 'array' ? key : '') + ']';
      if (!scope && array)
        params.add(value.name, value.value);
      else if (type == 'array' || !traditional && type == 'object')
        serialize(params, value, traditional, key);
      else
        params.add(key, value);
    });
  }
  $.param = function (obj, traditional) {
    var params = [];
    params.add = function (k, v) {
      this.push(escape(k) + '=' + escape(v));
    };
    serialize(params, obj, traditional);
    return params.join('&').replace(/%20/g, '+');
  };
}(Zepto));
;
(function ($) {
  $.fn.serializeArray = function () {
    var result = [], el;
    $([].slice.call(this.get(0).elements)).each(function () {
      el = $(this);
      var type = el.attr('type');
      if (this.nodeName.toLowerCase() != 'fieldset' && !this.disabled && type != 'submit' && type != 'reset' && type != 'button' && (type != 'radio' && type != 'checkbox' || this.checked))
        result.push({
          name: el.attr('name'),
          value: el.val()
        });
    });
    return result;
  };
  $.fn.serialize = function () {
    var result = [];
    this.serializeArray().forEach(function (elm) {
      result.push(encodeURIComponent(elm.name) + '=' + encodeURIComponent(elm.value));
    });
    return result.join('&');
  };
  $.fn.submit = function (callback) {
    if (callback)
      this.bind('submit', callback);
    else if (this.length) {
      var event = $.Event('submit');
      this.eq(0).trigger(event);
      if (!event.isDefaultPrevented())
        this.get(0).submit();
    }
    return this;
  };
}(Zepto));
;
(function ($) {
  if (!('__proto__' in {})) {
    $.extend($.zepto, {
      Z: function (dom, selector) {
        dom = dom || [];
        $.extend(dom, $.fn);
        dom.selector = selector || '';
        dom.__Z = true;
        return dom;
      },
      isZ: function (object) {
        return $.type(object) === 'array' && '__Z' in object;
      }
    });
  }
  try {
    getComputedStyle(undefined);
  } catch (e) {
    var nativeGetComputedStyle = getComputedStyle;
    window.getComputedStyle = function (element) {
      try {
        return nativeGetComputedStyle(element);
      } catch (e) {
        return null;
      }
    };
  }
}(Zepto));
;
(function () {
  var CORDOVA_JS_BUILD_LABEL = '3.3.0';
  var require, define;
  (function () {
    var modules = {}, requireStack = [], inProgressModules = {}, SEPARATOR = '.';
    function build(module) {
      var factory = module.factory, localRequire = function (id) {
          var resultantId = id;
          if (id.charAt(0) === '.') {
            resultantId = module.id.slice(0, module.id.lastIndexOf(SEPARATOR)) + SEPARATOR + id.slice(2);
          }
          return require(resultantId);
        };
      module.exports = {};
      delete module.factory;
      factory(localRequire, module.exports, module);
      return module.exports;
    }
    require = function (id) {
      if (!modules[id]) {
        throw 'module ' + id + ' not found';
      } else if (id in inProgressModules) {
        var cycle = requireStack.slice(inProgressModules[id]).join('->') + '->' + id;
        throw 'Cycle in require graph: ' + cycle;
      }
      if (modules[id].factory) {
        try {
          inProgressModules[id] = requireStack.length;
          requireStack.push(id);
          return build(modules[id]);
        } finally {
          delete inProgressModules[id];
          requireStack.pop();
        }
      }
      return modules[id].exports;
    };
    define = function (id, factory) {
      if (modules[id]) {
        throw 'module ' + id + ' already defined';
      }
      modules[id] = {
        id: id,
        factory: factory
      };
    };
    define.remove = function (id) {
      delete modules[id];
    };
    define.moduleMap = modules;
  }());
  if (typeof module === 'object' && typeof require === 'function') {
    module.exports.require = require;
    module.exports.define = define;
  }
  define('cordova', function (require, exports, module) {
    var channel = require('cordova/channel');
    var platform = require('cordova/platform');
    var m_document_addEventListener = document.addEventListener;
    var m_document_removeEventListener = document.removeEventListener;
    var m_window_addEventListener = window.addEventListener;
    var m_window_removeEventListener = window.removeEventListener;
    var documentEventHandlers = {}, windowEventHandlers = {};
    document.addEventListener = function (evt, handler, capture) {
      var e = evt.toLowerCase();
      if (typeof documentEventHandlers[e] != 'undefined') {
        documentEventHandlers[e].subscribe(handler);
      } else {
        m_document_addEventListener.call(document, evt, handler, capture);
      }
    };
    window.addEventListener = function (evt, handler, capture) {
      var e = evt.toLowerCase();
      if (typeof windowEventHandlers[e] != 'undefined') {
        windowEventHandlers[e].subscribe(handler);
      } else {
        m_window_addEventListener.call(window, evt, handler, capture);
      }
    };
    document.removeEventListener = function (evt, handler, capture) {
      var e = evt.toLowerCase();
      if (typeof documentEventHandlers[e] != 'undefined') {
        documentEventHandlers[e].unsubscribe(handler);
      } else {
        m_document_removeEventListener.call(document, evt, handler, capture);
      }
    };
    window.removeEventListener = function (evt, handler, capture) {
      var e = evt.toLowerCase();
      if (typeof windowEventHandlers[e] != 'undefined') {
        windowEventHandlers[e].unsubscribe(handler);
      } else {
        m_window_removeEventListener.call(window, evt, handler, capture);
      }
    };
    function createEvent(type, data) {
      var event = document.createEvent('Events');
      event.initEvent(type, false, false);
      if (data) {
        for (var i in data) {
          if (data.hasOwnProperty(i)) {
            event[i] = data[i];
          }
        }
      }
      return event;
    }
    var cordova = {
        define: define,
        require: require,
        version: CORDOVA_JS_BUILD_LABEL,
        platformId: platform.id,
        addWindowEventHandler: function (event) {
          return windowEventHandlers[event] = channel.create(event);
        },
        addStickyDocumentEventHandler: function (event) {
          return documentEventHandlers[event] = channel.createSticky(event);
        },
        addDocumentEventHandler: function (event) {
          return documentEventHandlers[event] = channel.create(event);
        },
        removeWindowEventHandler: function (event) {
          delete windowEventHandlers[event];
        },
        removeDocumentEventHandler: function (event) {
          delete documentEventHandlers[event];
        },
        getOriginalHandlers: function () {
          return {
            'document': {
              'addEventListener': m_document_addEventListener,
              'removeEventListener': m_document_removeEventListener
            },
            'window': {
              'addEventListener': m_window_addEventListener,
              'removeEventListener': m_window_removeEventListener
            }
          };
        },
        fireDocumentEvent: function (type, data, bNoDetach) {
          var evt = createEvent(type, data);
          if (typeof documentEventHandlers[type] != 'undefined') {
            if (bNoDetach) {
              documentEventHandlers[type].fire(evt);
            } else {
              setTimeout(function () {
                if (type == 'deviceready') {
                  document.dispatchEvent(evt);
                }
                documentEventHandlers[type].fire(evt);
              }, 0);
            }
          } else {
            document.dispatchEvent(evt);
          }
        },
        fireWindowEvent: function (type, data) {
          var evt = createEvent(type, data);
          if (typeof windowEventHandlers[type] != 'undefined') {
            setTimeout(function () {
              windowEventHandlers[type].fire(evt);
            }, 0);
          } else {
            window.dispatchEvent(evt);
          }
        },
        callbackId: Math.floor(Math.random() * 2000000000),
        callbacks: {},
        callbackStatus: {
          NO_RESULT: 0,
          OK: 1,
          CLASS_NOT_FOUND_EXCEPTION: 2,
          ILLEGAL_ACCESS_EXCEPTION: 3,
          INSTANTIATION_EXCEPTION: 4,
          MALFORMED_URL_EXCEPTION: 5,
          IO_EXCEPTION: 6,
          INVALID_ACTION: 7,
          JSON_EXCEPTION: 8,
          ERROR: 9
        },
        callbackSuccess: function (callbackId, args) {
          try {
            cordova.callbackFromNative(callbackId, true, args.status, [args.message], args.keepCallback);
          } catch (e) {
            console.log('Error in error callback: ' + callbackId + ' = ' + e);
          }
        },
        callbackError: function (callbackId, args) {
          try {
            cordova.callbackFromNative(callbackId, false, args.status, [args.message], args.keepCallback);
          } catch (e) {
            console.log('Error in error callback: ' + callbackId + ' = ' + e);
          }
        },
        callbackFromNative: function (callbackId, success, status, args, keepCallback) {
          var callback = cordova.callbacks[callbackId];
          if (callback) {
            if (success && status == cordova.callbackStatus.OK) {
              callback.success && callback.success.apply(null, args);
            } else if (!success) {
              callback.fail && callback.fail.apply(null, args);
            }
            if (!keepCallback) {
              delete cordova.callbacks[callbackId];
            }
          }
        },
        addConstructor: function (func) {
          channel.onCordovaReady.subscribe(function () {
            try {
              func();
            } catch (e) {
              console.log('Failed to run constructor: ' + e);
            }
          });
        }
      };
    module.exports = cordova;
  });
  define('cordova/android/nativeapiprovider', function (require, exports, module) {
    var nativeApi = this._cordovaNative || require('cordova/android/promptbasednativeapi');
    var currentApi = nativeApi;
    module.exports = {
      get: function () {
        return currentApi;
      },
      setPreferPrompt: function (value) {
        currentApi = value ? require('cordova/android/promptbasednativeapi') : nativeApi;
      },
      set: function (value) {
        currentApi = value;
      }
    };
  });
  define('cordova/android/promptbasednativeapi', function (require, exports, module) {
    module.exports = {
      exec: function (service, action, callbackId, argsJson) {
        return prompt(argsJson, 'gap:' + JSON.stringify([
          service,
          action,
          callbackId
        ]));
      },
      setNativeToJsBridgeMode: function (value) {
        prompt(value, 'gap_bridge_mode:');
      },
      retrieveJsMessages: function (fromOnlineEvent) {
        return prompt(+fromOnlineEvent, 'gap_poll:');
      }
    };
  });
  define('cordova/argscheck', function (require, exports, module) {
    var exec = require('cordova/exec');
    var utils = require('cordova/utils');
    var moduleExports = module.exports;
    var typeMap = {
        'A': 'Array',
        'D': 'Date',
        'N': 'Number',
        'S': 'String',
        'F': 'Function',
        'O': 'Object'
      };
    function extractParamName(callee, argIndex) {
      return /.*?\((.*?)\)/.exec(callee)[1].split(', ')[argIndex];
    }
    function checkArgs(spec, functionName, args, opt_callee) {
      if (!moduleExports.enableChecks) {
        return;
      }
      var errMsg = null;
      var typeName;
      for (var i = 0; i < spec.length; ++i) {
        var c = spec.charAt(i), cUpper = c.toUpperCase(), arg = args[i];
        if (c == '*') {
          continue;
        }
        typeName = utils.typeName(arg);
        if ((arg === null || arg === undefined) && c == cUpper) {
          continue;
        }
        if (typeName != typeMap[cUpper]) {
          errMsg = 'Expected ' + typeMap[cUpper];
          break;
        }
      }
      if (errMsg) {
        errMsg += ', but got ' + typeName + '.';
        errMsg = 'Wrong type for parameter "' + extractParamName(opt_callee || args.callee, i) + '" of ' + functionName + ': ' + errMsg;
        if (typeof jasmine == 'undefined') {
          console.error(errMsg);
        }
        throw TypeError(errMsg);
      }
    }
    function getValue(value, defaultValue) {
      return value === undefined ? defaultValue : value;
    }
    moduleExports.checkArgs = checkArgs;
    moduleExports.getValue = getValue;
    moduleExports.enableChecks = true;
  });
  define('cordova/base64', function (require, exports, module) {
    var base64 = exports;
    base64.fromArrayBuffer = function (arrayBuffer) {
      var array = new Uint8Array(arrayBuffer);
      return uint8ToBase64(array);
    };
    var b64_6bit = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
    var b64_12bit;
    var b64_12bitTable = function () {
      b64_12bit = [];
      for (var i = 0; i < 64; i++) {
        for (var j = 0; j < 64; j++) {
          b64_12bit[i * 64 + j] = b64_6bit[i] + b64_6bit[j];
        }
      }
      b64_12bitTable = function () {
        return b64_12bit;
      };
      return b64_12bit;
    };
    function uint8ToBase64(rawData) {
      var numBytes = rawData.byteLength;
      var output = '';
      var segment;
      var table = b64_12bitTable();
      for (var i = 0; i < numBytes - 2; i += 3) {
        segment = (rawData[i] << 16) + (rawData[i + 1] << 8) + rawData[i + 2];
        output += table[segment >> 12];
        output += table[segment & 4095];
      }
      if (numBytes - i == 2) {
        segment = (rawData[i] << 16) + (rawData[i + 1] << 8);
        output += table[segment >> 12];
        output += b64_6bit[(segment & 4095) >> 6];
        output += '=';
      } else if (numBytes - i == 1) {
        segment = rawData[i] << 16;
        output += table[segment >> 12];
        output += '==';
      }
      return output;
    }
  });
  define('cordova/builder', function (require, exports, module) {
    var utils = require('cordova/utils');
    function each(objects, func, context) {
      for (var prop in objects) {
        if (objects.hasOwnProperty(prop)) {
          func.apply(context, [
            objects[prop],
            prop
          ]);
        }
      }
    }
    function clobber(obj, key, value) {
      exports.replaceHookForTesting(obj, key);
      obj[key] = value;
      if (obj[key] !== value) {
        utils.defineGetter(obj, key, function () {
          return value;
        });
      }
    }
    function assignOrWrapInDeprecateGetter(obj, key, value, message) {
      if (message) {
        utils.defineGetter(obj, key, function () {
          console.log(message);
          delete obj[key];
          clobber(obj, key, value);
          return value;
        });
      } else {
        clobber(obj, key, value);
      }
    }
    function include(parent, objects, clobber, merge) {
      each(objects, function (obj, key) {
        try {
          var result = obj.path ? require(obj.path) : {};
          if (clobber) {
            if (typeof parent[key] === 'undefined') {
              assignOrWrapInDeprecateGetter(parent, key, result, obj.deprecated);
            } else if (typeof obj.path !== 'undefined') {
              if (merge) {
                recursiveMerge(parent[key], result);
              } else {
                assignOrWrapInDeprecateGetter(parent, key, result, obj.deprecated);
              }
            }
            result = parent[key];
          } else {
            if (typeof parent[key] == 'undefined') {
              assignOrWrapInDeprecateGetter(parent, key, result, obj.deprecated);
            } else {
              result = parent[key];
            }
          }
          if (obj.children) {
            include(result, obj.children, clobber, merge);
          }
        } catch (e) {
          utils.alert('Exception building Cordova JS globals: ' + e + ' for key "' + key + '"');
        }
      });
    }
    function recursiveMerge(target, src) {
      for (var prop in src) {
        if (src.hasOwnProperty(prop)) {
          if (target.prototype && target.prototype.constructor === target) {
            clobber(target.prototype, prop, src[prop]);
          } else {
            if (typeof src[prop] === 'object' && typeof target[prop] === 'object') {
              recursiveMerge(target[prop], src[prop]);
            } else {
              clobber(target, prop, src[prop]);
            }
          }
        }
      }
    }
    exports.buildIntoButDoNotClobber = function (objects, target) {
      include(target, objects, false, false);
    };
    exports.buildIntoAndClobber = function (objects, target) {
      include(target, objects, true, false);
    };
    exports.buildIntoAndMerge = function (objects, target) {
      include(target, objects, true, true);
    };
    exports.recursiveMerge = recursiveMerge;
    exports.assignOrWrapInDeprecateGetter = assignOrWrapInDeprecateGetter;
    exports.replaceHookForTesting = function () {
    };
  });
  define('cordova/channel', function (require, exports, module) {
    var utils = require('cordova/utils'), nextGuid = 1;
    var Channel = function (type, sticky) {
        this.type = type;
        this.handlers = {};
        this.state = sticky ? 1 : 0;
        this.fireArgs = null;
        this.numHandlers = 0;
        this.onHasSubscribersChange = null;
      }, channel = {
        join: function (h, c) {
          var len = c.length, i = len, f = function () {
              if (!--i)
                h();
            };
          for (var j = 0; j < len; j++) {
            if (c[j].state === 0) {
              throw Error('Can only use join with sticky channels.');
            }
            c[j].subscribe(f);
          }
          if (!len)
            h();
        },
        create: function (type) {
          return channel[type] = new Channel(type, false);
        },
        createSticky: function (type) {
          return channel[type] = new Channel(type, true);
        },
        deviceReadyChannelsArray: [],
        deviceReadyChannelsMap: {},
        waitForInitialization: function (feature) {
          if (feature) {
            var c = channel[feature] || this.createSticky(feature);
            this.deviceReadyChannelsMap[feature] = c;
            this.deviceReadyChannelsArray.push(c);
          }
        },
        initializationComplete: function (feature) {
          var c = this.deviceReadyChannelsMap[feature];
          if (c) {
            c.fire();
          }
        }
      };
    function forceFunction(f) {
      if (typeof f != 'function')
        throw 'Function required as first argument!';
    }
    Channel.prototype.subscribe = function (f, c) {
      forceFunction(f);
      if (this.state == 2) {
        f.apply(c || this, this.fireArgs);
        return;
      }
      var func = f, guid = f.observer_guid;
      if (typeof c == 'object') {
        func = utils.close(c, f);
      }
      if (!guid) {
        guid = '' + nextGuid++;
      }
      func.observer_guid = guid;
      f.observer_guid = guid;
      if (!this.handlers[guid]) {
        this.handlers[guid] = func;
        this.numHandlers++;
        if (this.numHandlers == 1) {
          this.onHasSubscribersChange && this.onHasSubscribersChange();
        }
      }
    };
    Channel.prototype.unsubscribe = function (f) {
      forceFunction(f);
      var guid = f.observer_guid, handler = this.handlers[guid];
      if (handler) {
        delete this.handlers[guid];
        this.numHandlers--;
        if (this.numHandlers === 0) {
          this.onHasSubscribersChange && this.onHasSubscribersChange();
        }
      }
    };
    Channel.prototype.fire = function (e) {
      var fail = false, fireArgs = Array.prototype.slice.call(arguments);
      if (this.state == 1) {
        this.state = 2;
        this.fireArgs = fireArgs;
      }
      if (this.numHandlers) {
        var toCall = [];
        for (var item in this.handlers) {
          toCall.push(this.handlers[item]);
        }
        for (var i = 0; i < toCall.length; ++i) {
          toCall[i].apply(this, fireArgs);
        }
        if (this.state == 2 && this.numHandlers) {
          this.numHandlers = 0;
          this.handlers = {};
          this.onHasSubscribersChange && this.onHasSubscribersChange();
        }
      }
    };
    channel.createSticky('onDOMContentLoaded');
    channel.createSticky('onNativeReady');
    channel.createSticky('onCordovaReady');
    channel.createSticky('onPluginsReady');
    channel.createSticky('onDeviceReady');
    channel.create('onResume');
    channel.create('onPause');
    channel.createSticky('onDestroy');
    channel.waitForInitialization('onCordovaReady');
    channel.waitForInitialization('onDOMContentLoaded');
    module.exports = channel;
  });
  define('cordova/exec', function (require, exports, module) {
    var cordova = require('cordova'), nativeApiProvider = require('cordova/android/nativeapiprovider'), utils = require('cordova/utils'), base64 = require('cordova/base64'), jsToNativeModes = {
        PROMPT: 0,
        JS_OBJECT: 1,
        LOCATION_CHANGE: 2
      }, nativeToJsModes = {
        POLLING: 0,
        LOAD_URL: 1,
        ONLINE_EVENT: 2,
        PRIVATE_API: 3
      }, jsToNativeBridgeMode, nativeToJsBridgeMode = nativeToJsModes.ONLINE_EVENT, pollEnabled = false, messagesFromNative = [];
    function androidExec(success, fail, service, action, args) {
      if (jsToNativeBridgeMode === undefined) {
        androidExec.setJsToNativeBridgeMode(jsToNativeModes.JS_OBJECT);
      }
      for (var i = 0; i < args.length; i++) {
        if (utils.typeName(args[i]) == 'ArrayBuffer') {
          args[i] = base64.fromArrayBuffer(args[i]);
        }
      }
      var callbackId = service + cordova.callbackId++, argsJson = JSON.stringify(args);
      if (success || fail) {
        cordova.callbacks[callbackId] = {
          success: success,
          fail: fail
        };
      }
      if (jsToNativeBridgeMode == jsToNativeModes.LOCATION_CHANGE) {
        window.location = 'http://cdv_exec/' + service + '#' + action + '#' + callbackId + '#' + argsJson;
      } else {
        var messages = nativeApiProvider.get().exec(service, action, callbackId, argsJson);
        if (jsToNativeBridgeMode == jsToNativeModes.JS_OBJECT && messages === '@Null arguments.') {
          androidExec.setJsToNativeBridgeMode(jsToNativeModes.PROMPT);
          androidExec(success, fail, service, action, args);
          androidExec.setJsToNativeBridgeMode(jsToNativeModes.JS_OBJECT);
          return;
        } else {
          androidExec.processMessages(messages);
        }
      }
    }
    function pollOnceFromOnlineEvent() {
      pollOnce(true);
    }
    function pollOnce(opt_fromOnlineEvent) {
      var msg = nativeApiProvider.get().retrieveJsMessages(!!opt_fromOnlineEvent);
      androidExec.processMessages(msg);
    }
    function pollingTimerFunc() {
      if (pollEnabled) {
        pollOnce();
        setTimeout(pollingTimerFunc, 50);
      }
    }
    function hookOnlineApis() {
      function proxyEvent(e) {
        cordova.fireWindowEvent(e.type);
      }
      window.addEventListener('online', pollOnceFromOnlineEvent, false);
      window.addEventListener('offline', pollOnceFromOnlineEvent, false);
      cordova.addWindowEventHandler('online');
      cordova.addWindowEventHandler('offline');
      document.addEventListener('online', proxyEvent, false);
      document.addEventListener('offline', proxyEvent, false);
    }
    hookOnlineApis();
    androidExec.jsToNativeModes = jsToNativeModes;
    androidExec.nativeToJsModes = nativeToJsModes;
    androidExec.setJsToNativeBridgeMode = function (mode) {
      if (mode == jsToNativeModes.JS_OBJECT && !window._cordovaNative) {
        console.log('Falling back on PROMPT mode since _cordovaNative is missing. Expected for Android 3.2 and lower only.');
        mode = jsToNativeModes.PROMPT;
      }
      nativeApiProvider.setPreferPrompt(mode == jsToNativeModes.PROMPT);
      jsToNativeBridgeMode = mode;
    };
    androidExec.setNativeToJsBridgeMode = function (mode) {
      if (mode == nativeToJsBridgeMode) {
        return;
      }
      if (nativeToJsBridgeMode == nativeToJsModes.POLLING) {
        pollEnabled = false;
      }
      nativeToJsBridgeMode = mode;
      nativeApiProvider.get().setNativeToJsBridgeMode(mode);
      if (mode == nativeToJsModes.POLLING) {
        pollEnabled = true;
        setTimeout(pollingTimerFunc, 1);
      }
    };
    function processMessage(message) {
      try {
        var firstChar = message.charAt(0);
        if (firstChar == 'J') {
          eval(message.slice(1));
        } else if (firstChar == 'S' || firstChar == 'F') {
          var success = firstChar == 'S';
          var keepCallback = message.charAt(1) == '1';
          var spaceIdx = message.indexOf(' ', 2);
          var status = +message.slice(2, spaceIdx);
          var nextSpaceIdx = message.indexOf(' ', spaceIdx + 1);
          var callbackId = message.slice(spaceIdx + 1, nextSpaceIdx);
          var payloadKind = message.charAt(nextSpaceIdx + 1);
          var payload;
          if (payloadKind == 's') {
            payload = message.slice(nextSpaceIdx + 2);
          } else if (payloadKind == 't') {
            payload = true;
          } else if (payloadKind == 'f') {
            payload = false;
          } else if (payloadKind == 'N') {
            payload = null;
          } else if (payloadKind == 'n') {
            payload = +message.slice(nextSpaceIdx + 2);
          } else if (payloadKind == 'A') {
            var data = message.slice(nextSpaceIdx + 2);
            var bytes = window.atob(data);
            var arraybuffer = new Uint8Array(bytes.length);
            for (var i = 0; i < bytes.length; i++) {
              arraybuffer[i] = bytes.charCodeAt(i);
            }
            payload = arraybuffer.buffer;
          } else if (payloadKind == 'S') {
            payload = window.atob(message.slice(nextSpaceIdx + 2));
          } else {
            payload = JSON.parse(message.slice(nextSpaceIdx + 1));
          }
          cordova.callbackFromNative(callbackId, success, status, [payload], keepCallback);
        } else {
          console.log('processMessage failed: invalid message:' + message);
        }
      } catch (e) {
        console.log('processMessage failed: Message: ' + message);
        console.log('processMessage failed: Error: ' + e);
        console.log('processMessage failed: Stack: ' + e.stack);
      }
    }
    androidExec.processMessages = function (messages) {
      if (messages) {
        messagesFromNative.push(messages);
        if (messagesFromNative.length > 1) {
          return;
        }
        while (messagesFromNative.length) {
          messages = messagesFromNative[0];
          if (messages == '*') {
            messagesFromNative.shift();
            window.setTimeout(pollOnce, 0);
            return;
          }
          var spaceIdx = messages.indexOf(' ');
          var msgLen = +messages.slice(0, spaceIdx);
          var message = messages.substr(spaceIdx + 1, msgLen);
          messages = messages.slice(spaceIdx + msgLen + 1);
          processMessage(message);
          if (messages) {
            messagesFromNative[0] = messages;
          } else {
            messagesFromNative.shift();
          }
        }
      }
    };
    module.exports = androidExec;
  });
  define('cordova/exec/proxy', function (require, exports, module) {
    var CommandProxyMap = {};
    module.exports = {
      add: function (id, proxyObj) {
        console.log('adding proxy for ' + id);
        CommandProxyMap[id] = proxyObj;
        return proxyObj;
      },
      remove: function (id) {
        var proxy = CommandProxyMap[id];
        delete CommandProxyMap[id];
        CommandProxyMap[id] = null;
        return proxy;
      },
      get: function (service, action) {
        return CommandProxyMap[service] ? CommandProxyMap[service][action] : null;
      }
    };
  });
  define('cordova/init', function (require, exports, module) {
    var channel = require('cordova/channel');
    var cordova = require('cordova');
    var modulemapper = require('cordova/modulemapper');
    var platform = require('cordova/platform');
    var pluginloader = require('cordova/pluginloader');
    var platformInitChannelsArray = [
        channel.onNativeReady,
        channel.onPluginsReady
      ];
    function logUnfiredChannels(arr) {
      for (var i = 0; i < arr.length; ++i) {
        if (arr[i].state != 2) {
          console.log('Channel not fired: ' + arr[i].type);
        }
      }
    }
    window.setTimeout(function () {
      if (channel.onDeviceReady.state != 2) {
        console.log('deviceready has not fired after 5 seconds.');
        logUnfiredChannels(platformInitChannelsArray);
        logUnfiredChannels(channel.deviceReadyChannelsArray);
      }
    }, 5000);
    function replaceNavigator(origNavigator) {
      var CordovaNavigator = function () {
      };
      CordovaNavigator.prototype = origNavigator;
      var newNavigator = new CordovaNavigator();
      if (CordovaNavigator.bind) {
        for (var key in origNavigator) {
          if (typeof origNavigator[key] == 'function') {
            newNavigator[key] = origNavigator[key].bind(origNavigator);
          }
        }
      }
      return newNavigator;
    }
    if (window.navigator) {
      window.navigator = replaceNavigator(window.navigator);
    }
    if (!window.console) {
      window.console = {
        log: function () {
        }
      };
    }
    if (!window.console.warn) {
      window.console.warn = function (msg) {
        this.log('warn: ' + msg);
      };
    }
    channel.onPause = cordova.addDocumentEventHandler('pause');
    channel.onResume = cordova.addDocumentEventHandler('resume');
    channel.onDeviceReady = cordova.addStickyDocumentEventHandler('deviceready');
    if (document.readyState == 'complete' || document.readyState == 'interactive') {
      channel.onDOMContentLoaded.fire();
    } else {
      document.addEventListener('DOMContentLoaded', function () {
        channel.onDOMContentLoaded.fire();
      }, false);
    }
    if (window._nativeReady) {
      channel.onNativeReady.fire();
    }
    modulemapper.clobbers('cordova', 'cordova');
    modulemapper.clobbers('cordova/exec', 'cordova.exec');
    modulemapper.clobbers('cordova/exec', 'Cordova.exec');
    platform.bootstrap && platform.bootstrap();
    pluginloader.load(function () {
      channel.onPluginsReady.fire();
    });
    channel.join(function () {
      modulemapper.mapModules(window);
      platform.initialize && platform.initialize();
      channel.onCordovaReady.fire();
      channel.join(function () {
        require('cordova').fireDocumentEvent('deviceready');
      }, channel.deviceReadyChannelsArray);
    }, platformInitChannelsArray);
  });
  define('cordova/modulemapper', function (require, exports, module) {
    var builder = require('cordova/builder'), moduleMap = define.moduleMap, symbolList, deprecationMap;
    exports.reset = function () {
      symbolList = [];
      deprecationMap = {};
    };
    function addEntry(strategy, moduleName, symbolPath, opt_deprecationMessage) {
      if (!(moduleName in moduleMap)) {
        throw new Error('Module ' + moduleName + ' does not exist.');
      }
      symbolList.push(strategy, moduleName, symbolPath);
      if (opt_deprecationMessage) {
        deprecationMap[symbolPath] = opt_deprecationMessage;
      }
    }
    exports.clobbers = function (moduleName, symbolPath, opt_deprecationMessage) {
      addEntry('c', moduleName, symbolPath, opt_deprecationMessage);
    };
    exports.merges = function (moduleName, symbolPath, opt_deprecationMessage) {
      addEntry('m', moduleName, symbolPath, opt_deprecationMessage);
    };
    exports.defaults = function (moduleName, symbolPath, opt_deprecationMessage) {
      addEntry('d', moduleName, symbolPath, opt_deprecationMessage);
    };
    exports.runs = function (moduleName) {
      addEntry('r', moduleName, null);
    };
    function prepareNamespace(symbolPath, context) {
      if (!symbolPath) {
        return context;
      }
      var parts = symbolPath.split('.');
      var cur = context;
      for (var i = 0, part; part = parts[i]; ++i) {
        cur = cur[part] = cur[part] || {};
      }
      return cur;
    }
    exports.mapModules = function (context) {
      var origSymbols = {};
      context.CDV_origSymbols = origSymbols;
      for (var i = 0, len = symbolList.length; i < len; i += 3) {
        var strategy = symbolList[i];
        var moduleName = symbolList[i + 1];
        var module = require(moduleName);
        if (strategy == 'r') {
          continue;
        }
        var symbolPath = symbolList[i + 2];
        var lastDot = symbolPath.lastIndexOf('.');
        var namespace = symbolPath.substr(0, lastDot);
        var lastName = symbolPath.substr(lastDot + 1);
        var deprecationMsg = symbolPath in deprecationMap ? 'Access made to deprecated symbol: ' + symbolPath + '. ' + deprecationMsg : null;
        var parentObj = prepareNamespace(namespace, context);
        var target = parentObj[lastName];
        if (strategy == 'm' && target) {
          builder.recursiveMerge(target, module);
        } else if (strategy == 'd' && !target || strategy != 'd') {
          if (!(symbolPath in origSymbols)) {
            origSymbols[symbolPath] = target;
          }
          builder.assignOrWrapInDeprecateGetter(parentObj, lastName, module, deprecationMsg);
        }
      }
    };
    exports.getOriginalSymbol = function (context, symbolPath) {
      var origSymbols = context.CDV_origSymbols;
      if (origSymbols && symbolPath in origSymbols) {
        return origSymbols[symbolPath];
      }
      var parts = symbolPath.split('.');
      var obj = context;
      for (var i = 0; i < parts.length; ++i) {
        obj = obj && obj[parts[i]];
      }
      return obj;
    };
    exports.reset();
  });
  define('cordova/platform', function (require, exports, module) {
    module.exports = {
      id: 'android',
      bootstrap: function () {
        var channel = require('cordova/channel'), cordova = require('cordova'), exec = require('cordova/exec'), modulemapper = require('cordova/modulemapper');
        exec(null, null, 'PluginManager', 'startup', []);
        channel.onNativeReady.fire();
        modulemapper.clobbers('cordova/plugin/android/app', 'navigator.app');
        var backButtonChannel = cordova.addDocumentEventHandler('backbutton');
        backButtonChannel.onHasSubscribersChange = function () {
          exec(null, null, 'App', 'overrideBackbutton', [this.numHandlers == 1]);
        };
        cordova.addDocumentEventHandler('menubutton');
        cordova.addDocumentEventHandler('searchbutton');
        channel.onCordovaReady.subscribe(function () {
          exec(null, null, 'App', 'show', []);
        });
      }
    };
  });
  define('cordova/plugin/android/app', function (require, exports, module) {
    var exec = require('cordova/exec');
    module.exports = {
      clearCache: function () {
        exec(null, null, 'App', 'clearCache', []);
      },
      loadUrl: function (url, props) {
        exec(null, null, 'App', 'loadUrl', [
          url,
          props
        ]);
      },
      cancelLoadUrl: function () {
        exec(null, null, 'App', 'cancelLoadUrl', []);
      },
      clearHistory: function () {
        exec(null, null, 'App', 'clearHistory', []);
      },
      backHistory: function () {
        exec(null, null, 'App', 'backHistory', []);
      },
      overrideBackbutton: function (override) {
        exec(null, null, 'App', 'overrideBackbutton', [override]);
      },
      exitApp: function () {
        return exec(null, null, 'App', 'exitApp', []);
      }
    };
  });
  define('cordova/pluginloader', function (require, exports, module) {
    var modulemapper = require('cordova/modulemapper');
    function injectScript(url, onload, onerror) {
      var script = document.createElement('script');
      script.onload = onload;
      script.onerror = onerror || onload;
      script.src = url;
      document.head.appendChild(script);
    }
    function onScriptLoadingComplete(moduleList, finishPluginLoading) {
      for (var i = 0, module; module = moduleList[i]; i++) {
        if (module) {
          try {
            if (module.clobbers && module.clobbers.length) {
              for (var j = 0; j < module.clobbers.length; j++) {
                modulemapper.clobbers(module.id, module.clobbers[j]);
              }
            }
            if (module.merges && module.merges.length) {
              for (var k = 0; k < module.merges.length; k++) {
                modulemapper.merges(module.id, module.merges[k]);
              }
            }
            if (module.runs && !(module.clobbers && module.clobbers.length) && !(module.merges && module.merges.length)) {
              modulemapper.runs(module.id);
            }
          } catch (err) {
          }
        }
      }
      finishPluginLoading();
    }
    function handlePluginsObject(path, moduleList, finishPluginLoading) {
      var scriptCounter = moduleList.length;
      if (!scriptCounter) {
        finishPluginLoading();
        return;
      }
      function scriptLoadedCallback() {
        if (!--scriptCounter) {
          onScriptLoadingComplete(moduleList, finishPluginLoading);
        }
      }
      for (var i = 0; i < moduleList.length; i++) {
        injectScript(path + moduleList[i].file, scriptLoadedCallback);
      }
    }
    function injectPluginScript(pathPrefix, finishPluginLoading) {
      injectScript(pathPrefix + 'cordova_plugins.js', function () {
        try {
          var moduleList = require('cordova/plugin_list');
          handlePluginsObject(pathPrefix, moduleList, finishPluginLoading);
        } catch (e) {
          finishPluginLoading();
        }
      }, finishPluginLoading);
    }
    function findCordovaPath() {
      var path = null;
      var scripts = document.getElementsByTagName('script');
      var term = 'cordova.js';
      for (var n = scripts.length - 1; n > -1; n--) {
        var src = scripts[n].src;
        if (src.indexOf(term) == src.length - term.length) {
          path = src.substring(0, src.length - term.length);
          break;
        }
      }
      return path;
    }
    exports.load = function (callback) {
      var pathPrefix = findCordovaPath();
      if (pathPrefix === null) {
        console.log('Could not find cordova.js script tag. Plugin loading may fail.');
        pathPrefix = '';
      }
      injectPluginScript(pathPrefix, callback);
    };
  });
  define('cordova/urlutil', function (require, exports, module) {
    var urlutil = exports;
    var anchorEl = document.createElement('a');
    urlutil.makeAbsolute = function (url) {
      anchorEl.href = url;
      return anchorEl.href;
    };
  });
  define('cordova/utils', function (require, exports, module) {
    var utils = exports;
    utils.defineGetterSetter = function (obj, key, getFunc, opt_setFunc) {
      if (Object.defineProperty) {
        var desc = {
            get: getFunc,
            configurable: true
          };
        if (opt_setFunc) {
          desc.set = opt_setFunc;
        }
        Object.defineProperty(obj, key, desc);
      } else {
        obj.__defineGetter__(key, getFunc);
        if (opt_setFunc) {
          obj.__defineSetter__(key, opt_setFunc);
        }
      }
    };
    utils.defineGetter = utils.defineGetterSetter;
    utils.arrayIndexOf = function (a, item) {
      if (a.indexOf) {
        return a.indexOf(item);
      }
      var len = a.length;
      for (var i = 0; i < len; ++i) {
        if (a[i] == item) {
          return i;
        }
      }
      return -1;
    };
    utils.arrayRemove = function (a, item) {
      var index = utils.arrayIndexOf(a, item);
      if (index != -1) {
        a.splice(index, 1);
      }
      return index != -1;
    };
    utils.typeName = function (val) {
      return Object.prototype.toString.call(val).slice(8, -1);
    };
    utils.isArray = function (a) {
      return utils.typeName(a) == 'Array';
    };
    utils.isDate = function (d) {
      return utils.typeName(d) == 'Date';
    };
    utils.clone = function (obj) {
      if (!obj || typeof obj == 'function' || utils.isDate(obj) || typeof obj != 'object') {
        return obj;
      }
      var retVal, i;
      if (utils.isArray(obj)) {
        retVal = [];
        for (i = 0; i < obj.length; ++i) {
          retVal.push(utils.clone(obj[i]));
        }
        return retVal;
      }
      retVal = {};
      for (i in obj) {
        if (!(i in retVal) || retVal[i] != obj[i]) {
          retVal[i] = utils.clone(obj[i]);
        }
      }
      return retVal;
    };
    utils.close = function (context, func, params) {
      if (typeof params == 'undefined') {
        return function () {
          return func.apply(context, arguments);
        };
      } else {
        return function () {
          return func.apply(context, params);
        };
      }
    };
    utils.createUUID = function () {
      return UUIDcreatePart(4) + '-' + UUIDcreatePart(2) + '-' + UUIDcreatePart(2) + '-' + UUIDcreatePart(2) + '-' + UUIDcreatePart(6);
    };
    utils.extend = function () {
      var F = function () {
      };
      return function (Child, Parent) {
        F.prototype = Parent.prototype;
        Child.prototype = new F();
        Child.__super__ = Parent.prototype;
        Child.prototype.constructor = Child;
      };
    }();
    utils.alert = function (msg) {
      if (window.alert) {
        window.alert(msg);
      } else if (console && console.log) {
        console.log(msg);
      }
    };
    function UUIDcreatePart(length) {
      var uuidpart = '';
      for (var i = 0; i < length; i++) {
        var uuidchar = parseInt(Math.random() * 256, 10).toString(16);
        if (uuidchar.length == 1) {
          uuidchar = '0' + uuidchar;
        }
        uuidpart += uuidchar;
      }
      return uuidpart;
    }
  });
  window.cordova = require('cordova');
  require('cordova/init');
}());
cordova.define('cordova/plugin_list', function (require, exports, module) {
  module.exports = [
    {
      'file': 'plugins/org.apache.cordova.vibration/www/vibration.js',
      'id': 'org.apache.cordova.vibration.notification',
      'merges': ['navigator.notification']
    },
    {
      'file': 'plugins/org.apache.cordova.dialogs/www/notification.js',
      'id': 'org.apache.cordova.dialogs.notification',
      'merges': ['navigator.notification']
    },
    {
      'file': 'plugins/org.apache.cordova.dialogs/www/android/notification.js',
      'id': 'org.apache.cordova.dialogs.notification_android',
      'merges': ['navigator.notification']
    },
    {
      'file': 'plugins/org.apache.cordova.inappbrowser/www/InAppBrowser.js',
      'id': 'org.apache.cordova.inappbrowser.InAppBrowser',
      'clobbers': ['window.open']
    }
  ];
  module.exports.metadata = {
    'org.apache.cordova.vibration': '0.3.6',
    'org.apache.cordova.dialogs': '0.2.5',
    'org.apache.cordova.inappbrowser': '0.3.0'
  };
});
window.getText = function (dateSelected, callback, failure) {
  cordova.exec(callback, failure, 'GetText', 'getText', [dateSelected]);
};
(function (window, document, undefined) {
  'use strict';
  function minErr(module) {
    return function () {
      var code = arguments[0], prefix = '[' + (module ? module + ':' : '') + code + '] ', template = arguments[1], templateArgs = arguments, stringify = function (obj) {
          if (typeof obj === 'function') {
            return obj.toString().replace(/ \{[\s\S]*$/, '');
          } else if (typeof obj === 'undefined') {
            return 'undefined';
          } else if (typeof obj !== 'string') {
            return JSON.stringify(obj);
          }
          return obj;
        }, message, i;
      message = prefix + template.replace(/\{\d+\}/g, function (match) {
        var index = +match.slice(1, -1), arg;
        if (index + 2 < templateArgs.length) {
          arg = templateArgs[index + 2];
          if (typeof arg === 'function') {
            return arg.toString().replace(/ ?\{[\s\S]*$/, '');
          } else if (typeof arg === 'undefined') {
            return 'undefined';
          } else if (typeof arg !== 'string') {
            return toJson(arg);
          }
          return arg;
        }
        return match;
      });
      message = message + '\nhttp://errors.angularjs.org/1.2.10/' + (module ? module + '/' : '') + code;
      for (i = 2; i < arguments.length; i++) {
        message = message + (i == 2 ? '?' : '&') + 'p' + (i - 2) + '=' + encodeURIComponent(stringify(arguments[i]));
      }
      return new Error(message);
    };
  }
  var lowercase = function (string) {
    return isString(string) ? string.toLowerCase() : string;
  };
  var uppercase = function (string) {
    return isString(string) ? string.toUpperCase() : string;
  };
  var manualLowercase = function (s) {
    return isString(s) ? s.replace(/[A-Z]/g, function (ch) {
      return String.fromCharCode(ch.charCodeAt(0) | 32);
    }) : s;
  };
  var manualUppercase = function (s) {
    return isString(s) ? s.replace(/[a-z]/g, function (ch) {
      return String.fromCharCode(ch.charCodeAt(0) & ~32);
    }) : s;
  };
  if ('i' !== 'I'.toLowerCase()) {
    lowercase = manualLowercase;
    uppercase = manualUppercase;
  }
  var msie, jqLite, jQuery, slice = [].slice, push = [].push, toString = Object.prototype.toString, ngMinErr = minErr('ng'), _angular = window.angular, angular = window.angular || (window.angular = {}), angularModule, nodeName_, uid = [
      '0',
      '0',
      '0'
    ];
  msie = int((/msie (\d+)/.exec(lowercase(navigator.userAgent)) || [])[1]);
  if (isNaN(msie)) {
    msie = int((/trident\/.*; rv:(\d+)/.exec(lowercase(navigator.userAgent)) || [])[1]);
  }
  function isArrayLike(obj) {
    if (obj == null || isWindow(obj)) {
      return false;
    }
    var length = obj.length;
    if (obj.nodeType === 1 && length) {
      return true;
    }
    return isString(obj) || isArray(obj) || length === 0 || typeof length === 'number' && length > 0 && length - 1 in obj;
  }
  function forEach(obj, iterator, context) {
    var key;
    if (obj) {
      if (isFunction(obj)) {
        for (key in obj) {
          if (key != 'prototype' && key != 'length' && key != 'name' && (!obj.hasOwnProperty || obj.hasOwnProperty(key))) {
            iterator.call(context, obj[key], key);
          }
        }
      } else if (obj.forEach && obj.forEach !== forEach) {
        obj.forEach(iterator, context);
      } else if (isArrayLike(obj)) {
        for (key = 0; key < obj.length; key++)
          iterator.call(context, obj[key], key);
      } else {
        for (key in obj) {
          if (obj.hasOwnProperty(key)) {
            iterator.call(context, obj[key], key);
          }
        }
      }
    }
    return obj;
  }
  function sortedKeys(obj) {
    var keys = [];
    for (var key in obj) {
      if (obj.hasOwnProperty(key)) {
        keys.push(key);
      }
    }
    return keys.sort();
  }
  function forEachSorted(obj, iterator, context) {
    var keys = sortedKeys(obj);
    for (var i = 0; i < keys.length; i++) {
      iterator.call(context, obj[keys[i]], keys[i]);
    }
    return keys;
  }
  function reverseParams(iteratorFn) {
    return function (value, key) {
      iteratorFn(key, value);
    };
  }
  function nextUid() {
    var index = uid.length;
    var digit;
    while (index) {
      index--;
      digit = uid[index].charCodeAt(0);
      if (digit == 57) {
        uid[index] = 'A';
        return uid.join('');
      }
      if (digit == 90) {
        uid[index] = '0';
      } else {
        uid[index] = String.fromCharCode(digit + 1);
        return uid.join('');
      }
    }
    uid.unshift('0');
    return uid.join('');
  }
  function setHashKey(obj, h) {
    if (h) {
      obj.$$hashKey = h;
    } else {
      delete obj.$$hashKey;
    }
  }
  function extend(dst) {
    var h = dst.$$hashKey;
    forEach(arguments, function (obj) {
      if (obj !== dst) {
        forEach(obj, function (value, key) {
          dst[key] = value;
        });
      }
    });
    setHashKey(dst, h);
    return dst;
  }
  function int(str) {
    return parseInt(str, 10);
  }
  function inherit(parent, extra) {
    return extend(new (extend(function () {
    }, { prototype: parent }))(), extra);
  }
  function noop() {
  }
  noop.$inject = [];
  function identity($) {
    return $;
  }
  identity.$inject = [];
  function valueFn(value) {
    return function () {
      return value;
    };
  }
  function isUndefined(value) {
    return typeof value === 'undefined';
  }
  function isDefined(value) {
    return typeof value !== 'undefined';
  }
  function isObject(value) {
    return value != null && typeof value === 'object';
  }
  function isString(value) {
    return typeof value === 'string';
  }
  function isNumber(value) {
    return typeof value === 'number';
  }
  function isDate(value) {
    return toString.call(value) === '[object Date]';
  }
  function isArray(value) {
    return toString.call(value) === '[object Array]';
  }
  function isFunction(value) {
    return typeof value === 'function';
  }
  function isRegExp(value) {
    return toString.call(value) === '[object RegExp]';
  }
  function isWindow(obj) {
    return obj && obj.document && obj.location && obj.alert && obj.setInterval;
  }
  function isScope(obj) {
    return obj && obj.$evalAsync && obj.$watch;
  }
  function isFile(obj) {
    return toString.call(obj) === '[object File]';
  }
  function isBoolean(value) {
    return typeof value === 'boolean';
  }
  var trim = function () {
      if (!String.prototype.trim) {
        return function (value) {
          return isString(value) ? value.replace(/^\s\s*/, '').replace(/\s\s*$/, '') : value;
        };
      }
      return function (value) {
        return isString(value) ? value.trim() : value;
      };
    }();
  function isElement(node) {
    return !!(node && (node.nodeName || node.on && node.find));
  }
  function makeMap(str) {
    var obj = {}, items = str.split(','), i;
    for (i = 0; i < items.length; i++)
      obj[items[i]] = true;
    return obj;
  }
  if (msie < 9) {
    nodeName_ = function (element) {
      element = element.nodeName ? element : element[0];
      return element.scopeName && element.scopeName != 'HTML' ? uppercase(element.scopeName + ':' + element.nodeName) : element.nodeName;
    };
  } else {
    nodeName_ = function (element) {
      return element.nodeName ? element.nodeName : element[0].nodeName;
    };
  }
  function map(obj, iterator, context) {
    var results = [];
    forEach(obj, function (value, index, list) {
      results.push(iterator.call(context, value, index, list));
    });
    return results;
  }
  function size(obj, ownPropsOnly) {
    var count = 0, key;
    if (isArray(obj) || isString(obj)) {
      return obj.length;
    } else if (isObject(obj)) {
      for (key in obj)
        if (!ownPropsOnly || obj.hasOwnProperty(key))
          count++;
    }
    return count;
  }
  function includes(array, obj) {
    return indexOf(array, obj) != -1;
  }
  function indexOf(array, obj) {
    if (array.indexOf)
      return array.indexOf(obj);
    for (var i = 0; i < array.length; i++) {
      if (obj === array[i])
        return i;
    }
    return -1;
  }
  function arrayRemove(array, value) {
    var index = indexOf(array, value);
    if (index >= 0)
      array.splice(index, 1);
    return value;
  }
  function isLeafNode(node) {
    if (node) {
      switch (node.nodeName) {
      case 'OPTION':
      case 'PRE':
      case 'TITLE':
        return true;
      }
    }
    return false;
  }
  function copy(source, destination) {
    if (isWindow(source) || isScope(source)) {
      throw ngMinErr('cpws', 'Can\'t copy! Making copies of Window or Scope instances is not supported.');
    }
    if (!destination) {
      destination = source;
      if (source) {
        if (isArray(source)) {
          destination = copy(source, []);
        } else if (isDate(source)) {
          destination = new Date(source.getTime());
        } else if (isRegExp(source)) {
          destination = new RegExp(source.source);
        } else if (isObject(source)) {
          destination = copy(source, {});
        }
      }
    } else {
      if (source === destination)
        throw ngMinErr('cpi', 'Can\'t copy! Source and destination are identical.');
      if (isArray(source)) {
        destination.length = 0;
        for (var i = 0; i < source.length; i++) {
          destination.push(copy(source[i]));
        }
      } else {
        var h = destination.$$hashKey;
        forEach(destination, function (value, key) {
          delete destination[key];
        });
        for (var key in source) {
          destination[key] = copy(source[key]);
        }
        setHashKey(destination, h);
      }
    }
    return destination;
  }
  function shallowCopy(src, dst) {
    dst = dst || {};
    for (var key in src) {
      if (src.hasOwnProperty(key) && key.charAt(0) !== '$' && key.charAt(1) !== '$') {
        dst[key] = src[key];
      }
    }
    return dst;
  }
  function equals(o1, o2) {
    if (o1 === o2)
      return true;
    if (o1 === null || o2 === null)
      return false;
    if (o1 !== o1 && o2 !== o2)
      return true;
    var t1 = typeof o1, t2 = typeof o2, length, key, keySet;
    if (t1 == t2) {
      if (t1 == 'object') {
        if (isArray(o1)) {
          if (!isArray(o2))
            return false;
          if ((length = o1.length) == o2.length) {
            for (key = 0; key < length; key++) {
              if (!equals(o1[key], o2[key]))
                return false;
            }
            return true;
          }
        } else if (isDate(o1)) {
          return isDate(o2) && o1.getTime() == o2.getTime();
        } else if (isRegExp(o1) && isRegExp(o2)) {
          return o1.toString() == o2.toString();
        } else {
          if (isScope(o1) || isScope(o2) || isWindow(o1) || isWindow(o2) || isArray(o2))
            return false;
          keySet = {};
          for (key in o1) {
            if (key.charAt(0) === '$' || isFunction(o1[key]))
              continue;
            if (!equals(o1[key], o2[key]))
              return false;
            keySet[key] = true;
          }
          for (key in o2) {
            if (!keySet.hasOwnProperty(key) && key.charAt(0) !== '$' && o2[key] !== undefined && !isFunction(o2[key]))
              return false;
          }
          return true;
        }
      }
    }
    return false;
  }
  function csp() {
    return document.securityPolicy && document.securityPolicy.isActive || document.querySelector && !!(document.querySelector('[ng-csp]') || document.querySelector('[data-ng-csp]'));
  }
  function concat(array1, array2, index) {
    return array1.concat(slice.call(array2, index));
  }
  function sliceArgs(args, startIndex) {
    return slice.call(args, startIndex || 0);
  }
  function bind(self, fn) {
    var curryArgs = arguments.length > 2 ? sliceArgs(arguments, 2) : [];
    if (isFunction(fn) && !(fn instanceof RegExp)) {
      return curryArgs.length ? function () {
        return arguments.length ? fn.apply(self, curryArgs.concat(slice.call(arguments, 0))) : fn.apply(self, curryArgs);
      } : function () {
        return arguments.length ? fn.apply(self, arguments) : fn.call(self);
      };
    } else {
      return fn;
    }
  }
  function toJsonReplacer(key, value) {
    var val = value;
    if (typeof key === 'string' && key.charAt(0) === '$') {
      val = undefined;
    } else if (isWindow(value)) {
      val = '$WINDOW';
    } else if (value && document === value) {
      val = '$DOCUMENT';
    } else if (isScope(value)) {
      val = '$SCOPE';
    }
    return val;
  }
  function toJson(obj, pretty) {
    if (typeof obj === 'undefined')
      return undefined;
    return JSON.stringify(obj, toJsonReplacer, pretty ? '  ' : null);
  }
  function fromJson(json) {
    return isString(json) ? JSON.parse(json) : json;
  }
  function toBoolean(value) {
    if (typeof value === 'function') {
      value = true;
    } else if (value && value.length !== 0) {
      var v = lowercase('' + value);
      value = !(v == 'f' || v == '0' || v == 'false' || v == 'no' || v == 'n' || v == '[]');
    } else {
      value = false;
    }
    return value;
  }
  function startingTag(element) {
    element = jqLite(element).clone();
    try {
      element.empty();
    } catch (e) {
    }
    var TEXT_NODE = 3;
    var elemHtml = jqLite('<div>').append(element).html();
    try {
      return element[0].nodeType === TEXT_NODE ? lowercase(elemHtml) : elemHtml.match(/^(<[^>]+>)/)[1].replace(/^<([\w\-]+)/, function (match, nodeName) {
        return '<' + lowercase(nodeName);
      });
    } catch (e) {
      return lowercase(elemHtml);
    }
  }
  function tryDecodeURIComponent(value) {
    try {
      return decodeURIComponent(value);
    } catch (e) {
    }
  }
  function parseKeyValue(keyValue) {
    var obj = {}, key_value, key;
    forEach((keyValue || '').split('&'), function (keyValue) {
      if (keyValue) {
        key_value = keyValue.split('=');
        key = tryDecodeURIComponent(key_value[0]);
        if (isDefined(key)) {
          var val = isDefined(key_value[1]) ? tryDecodeURIComponent(key_value[1]) : true;
          if (!obj[key]) {
            obj[key] = val;
          } else if (isArray(obj[key])) {
            obj[key].push(val);
          } else {
            obj[key] = [
              obj[key],
              val
            ];
          }
        }
      }
    });
    return obj;
  }
  function toKeyValue(obj) {
    var parts = [];
    forEach(obj, function (value, key) {
      if (isArray(value)) {
        forEach(value, function (arrayValue) {
          parts.push(encodeUriQuery(key, true) + (arrayValue === true ? '' : '=' + encodeUriQuery(arrayValue, true)));
        });
      } else {
        parts.push(encodeUriQuery(key, true) + (value === true ? '' : '=' + encodeUriQuery(value, true)));
      }
    });
    return parts.length ? parts.join('&') : '';
  }
  function encodeUriSegment(val) {
    return encodeUriQuery(val, true).replace(/%26/gi, '&').replace(/%3D/gi, '=').replace(/%2B/gi, '+');
  }
  function encodeUriQuery(val, pctEncodeSpaces) {
    return encodeURIComponent(val).replace(/%40/gi, '@').replace(/%3A/gi, ':').replace(/%24/g, '$').replace(/%2C/gi, ',').replace(/%20/g, pctEncodeSpaces ? '%20' : '+');
  }
  function angularInit(element, bootstrap) {
    var elements = [element], appElement, module, names = [
        'ng:app',
        'ng-app',
        'x-ng-app',
        'data-ng-app'
      ], NG_APP_CLASS_REGEXP = /\sng[:\-]app(:\s*([\w\d_]+);?)?\s/;
    function append(element) {
      element && elements.push(element);
    }
    forEach(names, function (name) {
      names[name] = true;
      append(document.getElementById(name));
      name = name.replace(':', '\\:');
      if (element.querySelectorAll) {
        forEach(element.querySelectorAll('.' + name), append);
        forEach(element.querySelectorAll('.' + name + '\\:'), append);
        forEach(element.querySelectorAll('[' + name + ']'), append);
      }
    });
    forEach(elements, function (element) {
      if (!appElement) {
        var className = ' ' + element.className + ' ';
        var match = NG_APP_CLASS_REGEXP.exec(className);
        if (match) {
          appElement = element;
          module = (match[2] || '').replace(/\s+/g, ',');
        } else {
          forEach(element.attributes, function (attr) {
            if (!appElement && names[attr.name]) {
              appElement = element;
              module = attr.value;
            }
          });
        }
      }
    });
    if (appElement) {
      bootstrap(appElement, module ? [module] : []);
    }
  }
  function bootstrap(element, modules) {
    var doBootstrap = function () {
      element = jqLite(element);
      if (element.injector()) {
        var tag = element[0] === document ? 'document' : startingTag(element);
        throw ngMinErr('btstrpd', 'App Already Bootstrapped with this Element \'{0}\'', tag);
      }
      modules = modules || [];
      modules.unshift([
        '$provide',
        function ($provide) {
          $provide.value('$rootElement', element);
        }
      ]);
      modules.unshift('ng');
      var injector = createInjector(modules);
      injector.invoke([
        '$rootScope',
        '$rootElement',
        '$compile',
        '$injector',
        '$animate',
        function (scope, element, compile, injector, animate) {
          scope.$apply(function () {
            element.data('$injector', injector);
            compile(element)(scope);
          });
        }
      ]);
      return injector;
    };
    var NG_DEFER_BOOTSTRAP = /^NG_DEFER_BOOTSTRAP!/;
    if (window && !NG_DEFER_BOOTSTRAP.test(window.name)) {
      return doBootstrap();
    }
    window.name = window.name.replace(NG_DEFER_BOOTSTRAP, '');
    angular.resumeBootstrap = function (extraModules) {
      forEach(extraModules, function (module) {
        modules.push(module);
      });
      doBootstrap();
    };
  }
  var SNAKE_CASE_REGEXP = /[A-Z]/g;
  function snake_case(name, separator) {
    separator = separator || '_';
    return name.replace(SNAKE_CASE_REGEXP, function (letter, pos) {
      return (pos ? separator : '') + letter.toLowerCase();
    });
  }
  function bindJQuery() {
    jQuery = window.jQuery;
    if (jQuery) {
      jqLite = jQuery;
      extend(jQuery.fn, {
        scope: JQLitePrototype.scope,
        isolateScope: JQLitePrototype.isolateScope,
        controller: JQLitePrototype.controller,
        injector: JQLitePrototype.injector,
        inheritedData: JQLitePrototype.inheritedData
      });
      jqLitePatchJQueryRemove('remove', true, true, false);
      jqLitePatchJQueryRemove('empty', false, false, false);
      jqLitePatchJQueryRemove('html', false, false, true);
    } else {
      jqLite = JQLite;
    }
    angular.element = jqLite;
  }
  function assertArg(arg, name, reason) {
    if (!arg) {
      throw ngMinErr('areq', 'Argument \'{0}\' is {1}', name || '?', reason || 'required');
    }
    return arg;
  }
  function assertArgFn(arg, name, acceptArrayAnnotation) {
    if (acceptArrayAnnotation && isArray(arg)) {
      arg = arg[arg.length - 1];
    }
    assertArg(isFunction(arg), name, 'not a function, got ' + (arg && typeof arg == 'object' ? arg.constructor.name || 'Object' : typeof arg));
    return arg;
  }
  function assertNotHasOwnProperty(name, context) {
    if (name === 'hasOwnProperty') {
      throw ngMinErr('badname', 'hasOwnProperty is not a valid {0} name', context);
    }
  }
  function getter(obj, path, bindFnToScope) {
    if (!path)
      return obj;
    var keys = path.split('.');
    var key;
    var lastInstance = obj;
    var len = keys.length;
    for (var i = 0; i < len; i++) {
      key = keys[i];
      if (obj) {
        obj = (lastInstance = obj)[key];
      }
    }
    if (!bindFnToScope && isFunction(obj)) {
      return bind(lastInstance, obj);
    }
    return obj;
  }
  function getBlockElements(nodes) {
    var startNode = nodes[0], endNode = nodes[nodes.length - 1];
    if (startNode === endNode) {
      return jqLite(startNode);
    }
    var element = startNode;
    var elements = [element];
    do {
      element = element.nextSibling;
      if (!element)
        break;
      elements.push(element);
    } while (element !== endNode);
    return jqLite(elements);
  }
  function setupModuleLoader(window) {
    var $injectorMinErr = minErr('$injector');
    var ngMinErr = minErr('ng');
    function ensure(obj, name, factory) {
      return obj[name] || (obj[name] = factory());
    }
    var angular = ensure(window, 'angular', Object);
    angular.$$minErr = angular.$$minErr || minErr;
    return ensure(angular, 'module', function () {
      var modules = {};
      return function module(name, requires, configFn) {
        var assertNotHasOwnProperty = function (name, context) {
          if (name === 'hasOwnProperty') {
            throw ngMinErr('badname', 'hasOwnProperty is not a valid {0} name', context);
          }
        };
        assertNotHasOwnProperty(name, 'module');
        if (requires && modules.hasOwnProperty(name)) {
          modules[name] = null;
        }
        return ensure(modules, name, function () {
          if (!requires) {
            throw $injectorMinErr('nomod', 'Module \'{0}\' is not available! You either misspelled ' + 'the module name or forgot to load it. If registering a module ensure that you ' + 'specify the dependencies as the second argument.', name);
          }
          var invokeQueue = [];
          var runBlocks = [];
          var config = invokeLater('$injector', 'invoke');
          var moduleInstance = {
              _invokeQueue: invokeQueue,
              _runBlocks: runBlocks,
              requires: requires,
              name: name,
              provider: invokeLater('$provide', 'provider'),
              factory: invokeLater('$provide', 'factory'),
              service: invokeLater('$provide', 'service'),
              value: invokeLater('$provide', 'value'),
              constant: invokeLater('$provide', 'constant', 'unshift'),
              animation: invokeLater('$animateProvider', 'register'),
              filter: invokeLater('$filterProvider', 'register'),
              controller: invokeLater('$controllerProvider', 'register'),
              directive: invokeLater('$compileProvider', 'directive'),
              config: config,
              run: function (block) {
                runBlocks.push(block);
                return this;
              }
            };
          if (configFn) {
            config(configFn);
          }
          return moduleInstance;
          function invokeLater(provider, method, insertMethod) {
            return function () {
              invokeQueue[insertMethod || 'push']([
                provider,
                method,
                arguments
              ]);
              return moduleInstance;
            };
          }
        });
      };
    });
  }
  var version = {
      full: '1.2.10',
      major: 1,
      minor: 2,
      dot: 10,
      codeName: 'augmented-serendipity'
    };
  function publishExternalAPI(angular) {
    extend(angular, {
      'bootstrap': bootstrap,
      'copy': copy,
      'extend': extend,
      'equals': equals,
      'element': jqLite,
      'forEach': forEach,
      'injector': createInjector,
      'noop': noop,
      'bind': bind,
      'toJson': toJson,
      'fromJson': fromJson,
      'identity': identity,
      'isUndefined': isUndefined,
      'isDefined': isDefined,
      'isString': isString,
      'isFunction': isFunction,
      'isObject': isObject,
      'isNumber': isNumber,
      'isElement': isElement,
      'isArray': isArray,
      'version': version,
      'isDate': isDate,
      'lowercase': lowercase,
      'uppercase': uppercase,
      'callbacks': { counter: 0 },
      '$$minErr': minErr,
      '$$csp': csp
    });
    angularModule = setupModuleLoader(window);
    try {
      angularModule('ngLocale');
    } catch (e) {
      angularModule('ngLocale', []).provider('$locale', $LocaleProvider);
    }
    angularModule('ng', ['ngLocale'], [
      '$provide',
      function ngModule($provide) {
        $provide.provider({ $$sanitizeUri: $$SanitizeUriProvider });
        $provide.provider('$compile', $CompileProvider).directive({
          a: htmlAnchorDirective,
          input: inputDirective,
          textarea: inputDirective,
          form: formDirective,
          script: scriptDirective,
          select: selectDirective,
          style: styleDirective,
          option: optionDirective,
          ngBind: ngBindDirective,
          ngBindHtml: ngBindHtmlDirective,
          ngBindTemplate: ngBindTemplateDirective,
          ngClass: ngClassDirective,
          ngClassEven: ngClassEvenDirective,
          ngClassOdd: ngClassOddDirective,
          ngCloak: ngCloakDirective,
          ngController: ngControllerDirective,
          ngForm: ngFormDirective,
          ngHide: ngHideDirective,
          ngIf: ngIfDirective,
          ngInclude: ngIncludeDirective,
          ngInit: ngInitDirective,
          ngNonBindable: ngNonBindableDirective,
          ngPluralize: ngPluralizeDirective,
          ngRepeat: ngRepeatDirective,
          ngShow: ngShowDirective,
          ngStyle: ngStyleDirective,
          ngSwitch: ngSwitchDirective,
          ngSwitchWhen: ngSwitchWhenDirective,
          ngSwitchDefault: ngSwitchDefaultDirective,
          ngOptions: ngOptionsDirective,
          ngTransclude: ngTranscludeDirective,
          ngModel: ngModelDirective,
          ngList: ngListDirective,
          ngChange: ngChangeDirective,
          required: requiredDirective,
          ngRequired: requiredDirective,
          ngValue: ngValueDirective
        }).directive({ ngInclude: ngIncludeFillContentDirective }).directive(ngAttributeAliasDirectives).directive(ngEventDirectives);
        $provide.provider({
          $anchorScroll: $AnchorScrollProvider,
          $animate: $AnimateProvider,
          $browser: $BrowserProvider,
          $cacheFactory: $CacheFactoryProvider,
          $controller: $ControllerProvider,
          $document: $DocumentProvider,
          $exceptionHandler: $ExceptionHandlerProvider,
          $filter: $FilterProvider,
          $interpolate: $InterpolateProvider,
          $interval: $IntervalProvider,
          $http: $HttpProvider,
          $httpBackend: $HttpBackendProvider,
          $location: $LocationProvider,
          $log: $LogProvider,
          $parse: $ParseProvider,
          $rootScope: $RootScopeProvider,
          $q: $QProvider,
          $sce: $SceProvider,
          $sceDelegate: $SceDelegateProvider,
          $sniffer: $SnifferProvider,
          $templateCache: $TemplateCacheProvider,
          $timeout: $TimeoutProvider,
          $window: $WindowProvider
        });
      }
    ]);
  }
  var jqCache = JQLite.cache = {}, jqName = JQLite.expando = 'ng-' + new Date().getTime(), jqId = 1, addEventListenerFn = window.document.addEventListener ? function (element, type, fn) {
      element.addEventListener(type, fn, false);
    } : function (element, type, fn) {
      element.attachEvent('on' + type, fn);
    }, removeEventListenerFn = window.document.removeEventListener ? function (element, type, fn) {
      element.removeEventListener(type, fn, false);
    } : function (element, type, fn) {
      element.detachEvent('on' + type, fn);
    };
  function jqNextId() {
    return ++jqId;
  }
  var SPECIAL_CHARS_REGEXP = /([\:\-\_]+(.))/g;
  var MOZ_HACK_REGEXP = /^moz([A-Z])/;
  var jqLiteMinErr = minErr('jqLite');
  function camelCase(name) {
    return name.replace(SPECIAL_CHARS_REGEXP, function (_, separator, letter, offset) {
      return offset ? letter.toUpperCase() : letter;
    }).replace(MOZ_HACK_REGEXP, 'Moz$1');
  }
  function jqLitePatchJQueryRemove(name, dispatchThis, filterElems, getterIfNoArguments) {
    var originalJqFn = jQuery.fn[name];
    originalJqFn = originalJqFn.$original || originalJqFn;
    removePatch.$original = originalJqFn;
    jQuery.fn[name] = removePatch;
    function removePatch(param) {
      var list = filterElems && param ? [this.filter(param)] : [this], fireEvent = dispatchThis, set, setIndex, setLength, element, childIndex, childLength, children;
      if (!getterIfNoArguments || param != null) {
        while (list.length) {
          set = list.shift();
          for (setIndex = 0, setLength = set.length; setIndex < setLength; setIndex++) {
            element = jqLite(set[setIndex]);
            if (fireEvent) {
              element.triggerHandler('$destroy');
            } else {
              fireEvent = !fireEvent;
            }
            for (childIndex = 0, childLength = (children = element.children()).length; childIndex < childLength; childIndex++) {
              list.push(jQuery(children[childIndex]));
            }
          }
        }
      }
      return originalJqFn.apply(this, arguments);
    }
  }
  function JQLite(element) {
    if (element instanceof JQLite) {
      return element;
    }
    if (!(this instanceof JQLite)) {
      if (isString(element) && element.charAt(0) != '<') {
        throw jqLiteMinErr('nosel', 'Looking up elements via selectors is not supported by jqLite! See: http://docs.angularjs.org/api/angular.element');
      }
      return new JQLite(element);
    }
    if (isString(element)) {
      var div = document.createElement('div');
      div.innerHTML = '<div>&#160;</div>' + element;
      div.removeChild(div.firstChild);
      jqLiteAddNodes(this, div.childNodes);
      var fragment = jqLite(document.createDocumentFragment());
      fragment.append(this);
    } else {
      jqLiteAddNodes(this, element);
    }
  }
  function jqLiteClone(element) {
    return element.cloneNode(true);
  }
  function jqLiteDealoc(element) {
    jqLiteRemoveData(element);
    for (var i = 0, children = element.childNodes || []; i < children.length; i++) {
      jqLiteDealoc(children[i]);
    }
  }
  function jqLiteOff(element, type, fn, unsupported) {
    if (isDefined(unsupported))
      throw jqLiteMinErr('offargs', 'jqLite#off() does not support the `selector` argument');
    var events = jqLiteExpandoStore(element, 'events'), handle = jqLiteExpandoStore(element, 'handle');
    if (!handle)
      return;
    if (isUndefined(type)) {
      forEach(events, function (eventHandler, type) {
        removeEventListenerFn(element, type, eventHandler);
        delete events[type];
      });
    } else {
      forEach(type.split(' '), function (type) {
        if (isUndefined(fn)) {
          removeEventListenerFn(element, type, events[type]);
          delete events[type];
        } else {
          arrayRemove(events[type] || [], fn);
        }
      });
    }
  }
  function jqLiteRemoveData(element, name) {
    var expandoId = element[jqName], expandoStore = jqCache[expandoId];
    if (expandoStore) {
      if (name) {
        delete jqCache[expandoId].data[name];
        return;
      }
      if (expandoStore.handle) {
        expandoStore.events.$destroy && expandoStore.handle({}, '$destroy');
        jqLiteOff(element);
      }
      delete jqCache[expandoId];
      element[jqName] = undefined;
    }
  }
  function jqLiteExpandoStore(element, key, value) {
    var expandoId = element[jqName], expandoStore = jqCache[expandoId || -1];
    if (isDefined(value)) {
      if (!expandoStore) {
        element[jqName] = expandoId = jqNextId();
        expandoStore = jqCache[expandoId] = {};
      }
      expandoStore[key] = value;
    } else {
      return expandoStore && expandoStore[key];
    }
  }
  function jqLiteData(element, key, value) {
    var data = jqLiteExpandoStore(element, 'data'), isSetter = isDefined(value), keyDefined = !isSetter && isDefined(key), isSimpleGetter = keyDefined && !isObject(key);
    if (!data && !isSimpleGetter) {
      jqLiteExpandoStore(element, 'data', data = {});
    }
    if (isSetter) {
      data[key] = value;
    } else {
      if (keyDefined) {
        if (isSimpleGetter) {
          return data && data[key];
        } else {
          extend(data, key);
        }
      } else {
        return data;
      }
    }
  }
  function jqLiteHasClass(element, selector) {
    if (!element.getAttribute)
      return false;
    return (' ' + (element.getAttribute('class') || '') + ' ').replace(/[\n\t]/g, ' ').indexOf(' ' + selector + ' ') > -1;
  }
  function jqLiteRemoveClass(element, cssClasses) {
    if (cssClasses && element.setAttribute) {
      forEach(cssClasses.split(' '), function (cssClass) {
        element.setAttribute('class', trim((' ' + (element.getAttribute('class') || '') + ' ').replace(/[\n\t]/g, ' ').replace(' ' + trim(cssClass) + ' ', ' ')));
      });
    }
  }
  function jqLiteAddClass(element, cssClasses) {
    if (cssClasses && element.setAttribute) {
      var existingClasses = (' ' + (element.getAttribute('class') || '') + ' ').replace(/[\n\t]/g, ' ');
      forEach(cssClasses.split(' '), function (cssClass) {
        cssClass = trim(cssClass);
        if (existingClasses.indexOf(' ' + cssClass + ' ') === -1) {
          existingClasses += cssClass + ' ';
        }
      });
      element.setAttribute('class', trim(existingClasses));
    }
  }
  function jqLiteAddNodes(root, elements) {
    if (elements) {
      elements = !elements.nodeName && isDefined(elements.length) && !isWindow(elements) ? elements : [elements];
      for (var i = 0; i < elements.length; i++) {
        root.push(elements[i]);
      }
    }
  }
  function jqLiteController(element, name) {
    return jqLiteInheritedData(element, '$' + (name || 'ngController') + 'Controller');
  }
  function jqLiteInheritedData(element, name, value) {
    element = jqLite(element);
    if (element[0].nodeType == 9) {
      element = element.find('html');
    }
    var names = isArray(name) ? name : [name];
    while (element.length) {
      for (var i = 0, ii = names.length; i < ii; i++) {
        if ((value = element.data(names[i])) !== undefined)
          return value;
      }
      element = element.parent();
    }
  }
  function jqLiteEmpty(element) {
    for (var i = 0, childNodes = element.childNodes; i < childNodes.length; i++) {
      jqLiteDealoc(childNodes[i]);
    }
    while (element.firstChild) {
      element.removeChild(element.firstChild);
    }
  }
  var JQLitePrototype = JQLite.prototype = {
      ready: function (fn) {
        var fired = false;
        function trigger() {
          if (fired)
            return;
          fired = true;
          fn();
        }
        if (document.readyState === 'complete') {
          setTimeout(trigger);
        } else {
          this.on('DOMContentLoaded', trigger);
          JQLite(window).on('load', trigger);
        }
      },
      toString: function () {
        var value = [];
        forEach(this, function (e) {
          value.push('' + e);
        });
        return '[' + value.join(', ') + ']';
      },
      eq: function (index) {
        return index >= 0 ? jqLite(this[index]) : jqLite(this[this.length + index]);
      },
      length: 0,
      push: push,
      sort: [].sort,
      splice: [].splice
    };
  var BOOLEAN_ATTR = {};
  forEach('multiple,selected,checked,disabled,readOnly,required,open'.split(','), function (value) {
    BOOLEAN_ATTR[lowercase(value)] = value;
  });
  var BOOLEAN_ELEMENTS = {};
  forEach('input,select,option,textarea,button,form,details'.split(','), function (value) {
    BOOLEAN_ELEMENTS[uppercase(value)] = true;
  });
  function getBooleanAttrName(element, name) {
    var booleanAttr = BOOLEAN_ATTR[name.toLowerCase()];
    return booleanAttr && BOOLEAN_ELEMENTS[element.nodeName] && booleanAttr;
  }
  forEach({
    data: jqLiteData,
    inheritedData: jqLiteInheritedData,
    scope: function (element) {
      return jqLite(element).data('$scope') || jqLiteInheritedData(element.parentNode || element, [
        '$isolateScope',
        '$scope'
      ]);
    },
    isolateScope: function (element) {
      return jqLite(element).data('$isolateScope') || jqLite(element).data('$isolateScopeNoTemplate');
    },
    controller: jqLiteController,
    injector: function (element) {
      return jqLiteInheritedData(element, '$injector');
    },
    removeAttr: function (element, name) {
      element.removeAttribute(name);
    },
    hasClass: jqLiteHasClass,
    css: function (element, name, value) {
      name = camelCase(name);
      if (isDefined(value)) {
        element.style[name] = value;
      } else {
        var val;
        if (msie <= 8) {
          val = element.currentStyle && element.currentStyle[name];
          if (val === '')
            val = 'auto';
        }
        val = val || element.style[name];
        if (msie <= 8) {
          val = val === '' ? undefined : val;
        }
        return val;
      }
    },
    attr: function (element, name, value) {
      var lowercasedName = lowercase(name);
      if (BOOLEAN_ATTR[lowercasedName]) {
        if (isDefined(value)) {
          if (!!value) {
            element[name] = true;
            element.setAttribute(name, lowercasedName);
          } else {
            element[name] = false;
            element.removeAttribute(lowercasedName);
          }
        } else {
          return element[name] || (element.attributes.getNamedItem(name) || noop).specified ? lowercasedName : undefined;
        }
      } else if (isDefined(value)) {
        element.setAttribute(name, value);
      } else if (element.getAttribute) {
        var ret = element.getAttribute(name, 2);
        return ret === null ? undefined : ret;
      }
    },
    prop: function (element, name, value) {
      if (isDefined(value)) {
        element[name] = value;
      } else {
        return element[name];
      }
    },
    text: function () {
      var NODE_TYPE_TEXT_PROPERTY = [];
      if (msie < 9) {
        NODE_TYPE_TEXT_PROPERTY[1] = 'innerText';
        NODE_TYPE_TEXT_PROPERTY[3] = 'nodeValue';
      } else {
        NODE_TYPE_TEXT_PROPERTY[1] = NODE_TYPE_TEXT_PROPERTY[3] = 'textContent';
      }
      getText.$dv = '';
      return getText;
      function getText(element, value) {
        var textProp = NODE_TYPE_TEXT_PROPERTY[element.nodeType];
        if (isUndefined(value)) {
          return textProp ? element[textProp] : '';
        }
        element[textProp] = value;
      }
    }(),
    val: function (element, value) {
      if (isUndefined(value)) {
        if (nodeName_(element) === 'SELECT' && element.multiple) {
          var result = [];
          forEach(element.options, function (option) {
            if (option.selected) {
              result.push(option.value || option.text);
            }
          });
          return result.length === 0 ? null : result;
        }
        return element.value;
      }
      element.value = value;
    },
    html: function (element, value) {
      if (isUndefined(value)) {
        return element.innerHTML;
      }
      for (var i = 0, childNodes = element.childNodes; i < childNodes.length; i++) {
        jqLiteDealoc(childNodes[i]);
      }
      element.innerHTML = value;
    },
    empty: jqLiteEmpty
  }, function (fn, name) {
    JQLite.prototype[name] = function (arg1, arg2) {
      var i, key;
      if (fn !== jqLiteEmpty && (fn.length == 2 && (fn !== jqLiteHasClass && fn !== jqLiteController) ? arg1 : arg2) === undefined) {
        if (isObject(arg1)) {
          for (i = 0; i < this.length; i++) {
            if (fn === jqLiteData) {
              fn(this[i], arg1);
            } else {
              for (key in arg1) {
                fn(this[i], key, arg1[key]);
              }
            }
          }
          return this;
        } else {
          var value = fn.$dv;
          var jj = value === undefined ? Math.min(this.length, 1) : this.length;
          for (var j = 0; j < jj; j++) {
            var nodeValue = fn(this[j], arg1, arg2);
            value = value ? value + nodeValue : nodeValue;
          }
          return value;
        }
      } else {
        for (i = 0; i < this.length; i++) {
          fn(this[i], arg1, arg2);
        }
        return this;
      }
    };
  });
  function createEventHandler(element, events) {
    var eventHandler = function (event, type) {
      if (!event.preventDefault) {
        event.preventDefault = function () {
          event.returnValue = false;
        };
      }
      if (!event.stopPropagation) {
        event.stopPropagation = function () {
          event.cancelBubble = true;
        };
      }
      if (!event.target) {
        event.target = event.srcElement || document;
      }
      if (isUndefined(event.defaultPrevented)) {
        var prevent = event.preventDefault;
        event.preventDefault = function () {
          event.defaultPrevented = true;
          prevent.call(event);
        };
        event.defaultPrevented = false;
      }
      event.isDefaultPrevented = function () {
        return event.defaultPrevented || event.returnValue === false;
      };
      var eventHandlersCopy = shallowCopy(events[type || event.type] || []);
      forEach(eventHandlersCopy, function (fn) {
        fn.call(element, event);
      });
      if (msie <= 8) {
        event.preventDefault = null;
        event.stopPropagation = null;
        event.isDefaultPrevented = null;
      } else {
        delete event.preventDefault;
        delete event.stopPropagation;
        delete event.isDefaultPrevented;
      }
    };
    eventHandler.elem = element;
    return eventHandler;
  }
  forEach({
    removeData: jqLiteRemoveData,
    dealoc: jqLiteDealoc,
    on: function onFn(element, type, fn, unsupported) {
      if (isDefined(unsupported))
        throw jqLiteMinErr('onargs', 'jqLite#on() does not support the `selector` or `eventData` parameters');
      var events = jqLiteExpandoStore(element, 'events'), handle = jqLiteExpandoStore(element, 'handle');
      if (!events)
        jqLiteExpandoStore(element, 'events', events = {});
      if (!handle)
        jqLiteExpandoStore(element, 'handle', handle = createEventHandler(element, events));
      forEach(type.split(' '), function (type) {
        var eventFns = events[type];
        if (!eventFns) {
          if (type == 'mouseenter' || type == 'mouseleave') {
            var contains = document.body.contains || document.body.compareDocumentPosition ? function (a, b) {
                var adown = a.nodeType === 9 ? a.documentElement : a, bup = b && b.parentNode;
                return a === bup || !!(bup && bup.nodeType === 1 && (adown.contains ? adown.contains(bup) : a.compareDocumentPosition && a.compareDocumentPosition(bup) & 16));
              } : function (a, b) {
                if (b) {
                  while (b = b.parentNode) {
                    if (b === a) {
                      return true;
                    }
                  }
                }
                return false;
              };
            events[type] = [];
            var eventmap = {
                mouseleave: 'mouseout',
                mouseenter: 'mouseover'
              };
            onFn(element, eventmap[type], function (event) {
              var target = this, related = event.relatedTarget;
              if (!related || related !== target && !contains(target, related)) {
                handle(event, type);
              }
            });
          } else {
            addEventListenerFn(element, type, handle);
            events[type] = [];
          }
          eventFns = events[type];
        }
        eventFns.push(fn);
      });
    },
    off: jqLiteOff,
    one: function (element, type, fn) {
      element = jqLite(element);
      element.on(type, function onFn() {
        element.off(type, fn);
        element.off(type, onFn);
      });
      element.on(type, fn);
    },
    replaceWith: function (element, replaceNode) {
      var index, parent = element.parentNode;
      jqLiteDealoc(element);
      forEach(new JQLite(replaceNode), function (node) {
        if (index) {
          parent.insertBefore(node, index.nextSibling);
        } else {
          parent.replaceChild(node, element);
        }
        index = node;
      });
    },
    children: function (element) {
      var children = [];
      forEach(element.childNodes, function (element) {
        if (element.nodeType === 1)
          children.push(element);
      });
      return children;
    },
    contents: function (element) {
      return element.childNodes || [];
    },
    append: function (element, node) {
      forEach(new JQLite(node), function (child) {
        if (element.nodeType === 1 || element.nodeType === 11) {
          element.appendChild(child);
        }
      });
    },
    prepend: function (element, node) {
      if (element.nodeType === 1) {
        var index = element.firstChild;
        forEach(new JQLite(node), function (child) {
          element.insertBefore(child, index);
        });
      }
    },
    wrap: function (element, wrapNode) {
      wrapNode = jqLite(wrapNode)[0];
      var parent = element.parentNode;
      if (parent) {
        parent.replaceChild(wrapNode, element);
      }
      wrapNode.appendChild(element);
    },
    remove: function (element) {
      jqLiteDealoc(element);
      var parent = element.parentNode;
      if (parent)
        parent.removeChild(element);
    },
    after: function (element, newElement) {
      var index = element, parent = element.parentNode;
      forEach(new JQLite(newElement), function (node) {
        parent.insertBefore(node, index.nextSibling);
        index = node;
      });
    },
    addClass: jqLiteAddClass,
    removeClass: jqLiteRemoveClass,
    toggleClass: function (element, selector, condition) {
      if (isUndefined(condition)) {
        condition = !jqLiteHasClass(element, selector);
      }
      (condition ? jqLiteAddClass : jqLiteRemoveClass)(element, selector);
    },
    parent: function (element) {
      var parent = element.parentNode;
      return parent && parent.nodeType !== 11 ? parent : null;
    },
    next: function (element) {
      if (element.nextElementSibling) {
        return element.nextElementSibling;
      }
      var elm = element.nextSibling;
      while (elm != null && elm.nodeType !== 1) {
        elm = elm.nextSibling;
      }
      return elm;
    },
    find: function (element, selector) {
      if (element.getElementsByTagName) {
        return element.getElementsByTagName(selector);
      } else {
        return [];
      }
    },
    clone: jqLiteClone,
    triggerHandler: function (element, eventName, eventData) {
      var eventFns = (jqLiteExpandoStore(element, 'events') || {})[eventName];
      eventData = eventData || [];
      var event = [{
            preventDefault: noop,
            stopPropagation: noop
          }];
      forEach(eventFns, function (fn) {
        fn.apply(element, event.concat(eventData));
      });
    }
  }, function (fn, name) {
    JQLite.prototype[name] = function (arg1, arg2, arg3) {
      var value;
      for (var i = 0; i < this.length; i++) {
        if (isUndefined(value)) {
          value = fn(this[i], arg1, arg2, arg3);
          if (isDefined(value)) {
            value = jqLite(value);
          }
        } else {
          jqLiteAddNodes(value, fn(this[i], arg1, arg2, arg3));
        }
      }
      return isDefined(value) ? value : this;
    };
    JQLite.prototype.bind = JQLite.prototype.on;
    JQLite.prototype.unbind = JQLite.prototype.off;
  });
  function hashKey(obj) {
    var objType = typeof obj, key;
    if (objType == 'object' && obj !== null) {
      if (typeof (key = obj.$$hashKey) == 'function') {
        key = obj.$$hashKey();
      } else if (key === undefined) {
        key = obj.$$hashKey = nextUid();
      }
    } else {
      key = obj;
    }
    return objType + ':' + key;
  }
  function HashMap(array) {
    forEach(array, this.put, this);
  }
  HashMap.prototype = {
    put: function (key, value) {
      this[hashKey(key)] = value;
    },
    get: function (key) {
      return this[hashKey(key)];
    },
    remove: function (key) {
      var value = this[key = hashKey(key)];
      delete this[key];
      return value;
    }
  };
  var FN_ARGS = /^function\s*[^\(]*\(\s*([^\)]*)\)/m;
  var FN_ARG_SPLIT = /,/;
  var FN_ARG = /^\s*(_?)(\S+?)\1\s*$/;
  var STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/gm;
  var $injectorMinErr = minErr('$injector');
  function annotate(fn) {
    var $inject, fnText, argDecl, last;
    if (typeof fn == 'function') {
      if (!($inject = fn.$inject)) {
        $inject = [];
        if (fn.length) {
          fnText = fn.toString().replace(STRIP_COMMENTS, '');
          argDecl = fnText.match(FN_ARGS);
          forEach(argDecl[1].split(FN_ARG_SPLIT), function (arg) {
            arg.replace(FN_ARG, function (all, underscore, name) {
              $inject.push(name);
            });
          });
        }
        fn.$inject = $inject;
      }
    } else if (isArray(fn)) {
      last = fn.length - 1;
      assertArgFn(fn[last], 'fn');
      $inject = fn.slice(0, last);
    } else {
      assertArgFn(fn, 'fn', true);
    }
    return $inject;
  }
  function createInjector(modulesToLoad) {
    var INSTANTIATING = {}, providerSuffix = 'Provider', path = [], loadedModules = new HashMap(), providerCache = {
        $provide: {
          provider: supportObject(provider),
          factory: supportObject(factory),
          service: supportObject(service),
          value: supportObject(value),
          constant: supportObject(constant),
          decorator: decorator
        }
      }, providerInjector = providerCache.$injector = createInternalInjector(providerCache, function () {
        throw $injectorMinErr('unpr', 'Unknown provider: {0}', path.join(' <- '));
      }), instanceCache = {}, instanceInjector = instanceCache.$injector = createInternalInjector(instanceCache, function (servicename) {
        var provider = providerInjector.get(servicename + providerSuffix);
        return instanceInjector.invoke(provider.$get, provider);
      });
    forEach(loadModules(modulesToLoad), function (fn) {
      instanceInjector.invoke(fn || noop);
    });
    return instanceInjector;
    function supportObject(delegate) {
      return function (key, value) {
        if (isObject(key)) {
          forEach(key, reverseParams(delegate));
        } else {
          return delegate(key, value);
        }
      };
    }
    function provider(name, provider_) {
      assertNotHasOwnProperty(name, 'service');
      if (isFunction(provider_) || isArray(provider_)) {
        provider_ = providerInjector.instantiate(provider_);
      }
      if (!provider_.$get) {
        throw $injectorMinErr('pget', 'Provider \'{0}\' must define $get factory method.', name);
      }
      return providerCache[name + providerSuffix] = provider_;
    }
    function factory(name, factoryFn) {
      return provider(name, { $get: factoryFn });
    }
    function service(name, constructor) {
      return factory(name, [
        '$injector',
        function ($injector) {
          return $injector.instantiate(constructor);
        }
      ]);
    }
    function value(name, val) {
      return factory(name, valueFn(val));
    }
    function constant(name, value) {
      assertNotHasOwnProperty(name, 'constant');
      providerCache[name] = value;
      instanceCache[name] = value;
    }
    function decorator(serviceName, decorFn) {
      var origProvider = providerInjector.get(serviceName + providerSuffix), orig$get = origProvider.$get;
      origProvider.$get = function () {
        var origInstance = instanceInjector.invoke(orig$get, origProvider);
        return instanceInjector.invoke(decorFn, null, { $delegate: origInstance });
      };
    }
    function loadModules(modulesToLoad) {
      var runBlocks = [], moduleFn, invokeQueue, i, ii;
      forEach(modulesToLoad, function (module) {
        if (loadedModules.get(module))
          return;
        loadedModules.put(module, true);
        try {
          if (isString(module)) {
            moduleFn = angularModule(module);
            runBlocks = runBlocks.concat(loadModules(moduleFn.requires)).concat(moduleFn._runBlocks);
            for (invokeQueue = moduleFn._invokeQueue, i = 0, ii = invokeQueue.length; i < ii; i++) {
              var invokeArgs = invokeQueue[i], provider = providerInjector.get(invokeArgs[0]);
              provider[invokeArgs[1]].apply(provider, invokeArgs[2]);
            }
          } else if (isFunction(module)) {
            runBlocks.push(providerInjector.invoke(module));
          } else if (isArray(module)) {
            runBlocks.push(providerInjector.invoke(module));
          } else {
            assertArgFn(module, 'module');
          }
        } catch (e) {
          if (isArray(module)) {
            module = module[module.length - 1];
          }
          if (e.message && e.stack && e.stack.indexOf(e.message) == -1) {
            e = e.message + '\n' + e.stack;
          }
          throw $injectorMinErr('modulerr', 'Failed to instantiate module {0} due to:\n{1}', module, e.stack || e.message || e);
        }
      });
      return runBlocks;
    }
    function createInternalInjector(cache, factory) {
      function getService(serviceName) {
        if (cache.hasOwnProperty(serviceName)) {
          if (cache[serviceName] === INSTANTIATING) {
            throw $injectorMinErr('cdep', 'Circular dependency found: {0}', path.join(' <- '));
          }
          return cache[serviceName];
        } else {
          try {
            path.unshift(serviceName);
            cache[serviceName] = INSTANTIATING;
            return cache[serviceName] = factory(serviceName);
          } catch (err) {
            if (cache[serviceName] === INSTANTIATING) {
              delete cache[serviceName];
            }
            throw err;
          } finally {
            path.shift();
          }
        }
      }
      function invoke(fn, self, locals) {
        var args = [], $inject = annotate(fn), length, i, key;
        for (i = 0, length = $inject.length; i < length; i++) {
          key = $inject[i];
          if (typeof key !== 'string') {
            throw $injectorMinErr('itkn', 'Incorrect injection token! Expected service name as string, got {0}', key);
          }
          args.push(locals && locals.hasOwnProperty(key) ? locals[key] : getService(key));
        }
        if (!fn.$inject) {
          fn = fn[length];
        }
        return fn.apply(self, args);
      }
      function instantiate(Type, locals) {
        var Constructor = function () {
          }, instance, returnedValue;
        Constructor.prototype = (isArray(Type) ? Type[Type.length - 1] : Type).prototype;
        instance = new Constructor();
        returnedValue = invoke(Type, instance, locals);
        return isObject(returnedValue) || isFunction(returnedValue) ? returnedValue : instance;
      }
      return {
        invoke: invoke,
        instantiate: instantiate,
        get: getService,
        annotate: annotate,
        has: function (name) {
          return providerCache.hasOwnProperty(name + providerSuffix) || cache.hasOwnProperty(name);
        }
      };
    }
  }
  function $AnchorScrollProvider() {
    var autoScrollingEnabled = true;
    this.disableAutoScrolling = function () {
      autoScrollingEnabled = false;
    };
    this.$get = [
      '$window',
      '$location',
      '$rootScope',
      function ($window, $location, $rootScope) {
        var document = $window.document;
        function getFirstAnchor(list) {
          var result = null;
          forEach(list, function (element) {
            if (!result && lowercase(element.nodeName) === 'a')
              result = element;
          });
          return result;
        }
        function scroll() {
          var hash = $location.hash(), elm;
          if (!hash)
            $window.scrollTo(0, 0);
          else if (elm = document.getElementById(hash))
            elm.scrollIntoView();
          else if (elm = getFirstAnchor(document.getElementsByName(hash)))
            elm.scrollIntoView();
          else if (hash === 'top')
            $window.scrollTo(0, 0);
        }
        if (autoScrollingEnabled) {
          $rootScope.$watch(function autoScrollWatch() {
            return $location.hash();
          }, function autoScrollWatchAction() {
            $rootScope.$evalAsync(scroll);
          });
        }
        return scroll;
      }
    ];
  }
  var $animateMinErr = minErr('$animate');
  var $AnimateProvider = [
      '$provide',
      function ($provide) {
        this.$$selectors = {};
        this.register = function (name, factory) {
          var key = name + '-animation';
          if (name && name.charAt(0) != '.')
            throw $animateMinErr('notcsel', 'Expecting class selector starting with \'.\' got \'{0}\'.', name);
          this.$$selectors[name.substr(1)] = key;
          $provide.factory(key, factory);
        };
        this.classNameFilter = function (expression) {
          if (arguments.length === 1) {
            this.$$classNameFilter = expression instanceof RegExp ? expression : null;
          }
          return this.$$classNameFilter;
        };
        this.$get = [
          '$timeout',
          function ($timeout) {
            return {
              enter: function (element, parent, after, done) {
                if (after) {
                  after.after(element);
                } else {
                  if (!parent || !parent[0]) {
                    parent = after.parent();
                  }
                  parent.append(element);
                }
                done && $timeout(done, 0, false);
              },
              leave: function (element, done) {
                element.remove();
                done && $timeout(done, 0, false);
              },
              move: function (element, parent, after, done) {
                this.enter(element, parent, after, done);
              },
              addClass: function (element, className, done) {
                className = isString(className) ? className : isArray(className) ? className.join(' ') : '';
                forEach(element, function (element) {
                  jqLiteAddClass(element, className);
                });
                done && $timeout(done, 0, false);
              },
              removeClass: function (element, className, done) {
                className = isString(className) ? className : isArray(className) ? className.join(' ') : '';
                forEach(element, function (element) {
                  jqLiteRemoveClass(element, className);
                });
                done && $timeout(done, 0, false);
              },
              enabled: noop
            };
          }
        ];
      }
    ];
  function Browser(window, document, $log, $sniffer) {
    var self = this, rawDocument = document[0], location = window.location, history = window.history, setTimeout = window.setTimeout, clearTimeout = window.clearTimeout, pendingDeferIds = {};
    self.isMock = false;
    var outstandingRequestCount = 0;
    var outstandingRequestCallbacks = [];
    self.$$completeOutstandingRequest = completeOutstandingRequest;
    self.$$incOutstandingRequestCount = function () {
      outstandingRequestCount++;
    };
    function completeOutstandingRequest(fn) {
      try {
        fn.apply(null, sliceArgs(arguments, 1));
      } finally {
        outstandingRequestCount--;
        if (outstandingRequestCount === 0) {
          while (outstandingRequestCallbacks.length) {
            try {
              outstandingRequestCallbacks.pop()();
            } catch (e) {
              $log.error(e);
            }
          }
        }
      }
    }
    self.notifyWhenNoOutstandingRequests = function (callback) {
      forEach(pollFns, function (pollFn) {
        pollFn();
      });
      if (outstandingRequestCount === 0) {
        callback();
      } else {
        outstandingRequestCallbacks.push(callback);
      }
    };
    var pollFns = [], pollTimeout;
    self.addPollFn = function (fn) {
      if (isUndefined(pollTimeout))
        startPoller(100, setTimeout);
      pollFns.push(fn);
      return fn;
    };
    function startPoller(interval, setTimeout) {
      (function check() {
        forEach(pollFns, function (pollFn) {
          pollFn();
        });
        pollTimeout = setTimeout(check, interval);
      }());
    }
    var lastBrowserUrl = location.href, baseElement = document.find('base'), newLocation = null;
    self.url = function (url, replace) {
      if (location !== window.location)
        location = window.location;
      if (history !== window.history)
        history = window.history;
      if (url) {
        if (lastBrowserUrl == url)
          return;
        lastBrowserUrl = url;
        if ($sniffer.history) {
          if (replace)
            history.replaceState(null, '', url);
          else {
            history.pushState(null, '', url);
            baseElement.attr('href', baseElement.attr('href'));
          }
        } else {
          newLocation = url;
          if (replace) {
            location.replace(url);
          } else {
            location.href = url;
          }
        }
        return self;
      } else {
        return newLocation || location.href.replace(/%27/g, '\'');
      }
    };
    var urlChangeListeners = [], urlChangeInit = false;
    function fireUrlChange() {
      newLocation = null;
      if (lastBrowserUrl == self.url())
        return;
      lastBrowserUrl = self.url();
      forEach(urlChangeListeners, function (listener) {
        listener(self.url());
      });
    }
    self.onUrlChange = function (callback) {
      if (!urlChangeInit) {
        if ($sniffer.history)
          jqLite(window).on('popstate', fireUrlChange);
        if ($sniffer.hashchange)
          jqLite(window).on('hashchange', fireUrlChange);
        else
          self.addPollFn(fireUrlChange);
        urlChangeInit = true;
      }
      urlChangeListeners.push(callback);
      return callback;
    };
    self.baseHref = function () {
      var href = baseElement.attr('href');
      return href ? href.replace(/^(https?\:)?\/\/[^\/]*/, '') : '';
    };
    var lastCookies = {};
    var lastCookieString = '';
    var cookiePath = self.baseHref();
    self.cookies = function (name, value) {
      var cookieLength, cookieArray, cookie, i, index;
      if (name) {
        if (value === undefined) {
          rawDocument.cookie = escape(name) + '=;path=' + cookiePath + ';expires=Thu, 01 Jan 1970 00:00:00 GMT';
        } else {
          if (isString(value)) {
            cookieLength = (rawDocument.cookie = escape(name) + '=' + escape(value) + ';path=' + cookiePath).length + 1;
            if (cookieLength > 4096) {
              $log.warn('Cookie \'' + name + '\' possibly not set or overflowed because it was too large (' + cookieLength + ' > 4096 bytes)!');
            }
          }
        }
      } else {
        if (rawDocument.cookie !== lastCookieString) {
          lastCookieString = rawDocument.cookie;
          cookieArray = lastCookieString.split('; ');
          lastCookies = {};
          for (i = 0; i < cookieArray.length; i++) {
            cookie = cookieArray[i];
            index = cookie.indexOf('=');
            if (index > 0) {
              name = unescape(cookie.substring(0, index));
              if (lastCookies[name] === undefined) {
                lastCookies[name] = unescape(cookie.substring(index + 1));
              }
            }
          }
        }
        return lastCookies;
      }
    };
    self.defer = function (fn, delay) {
      var timeoutId;
      outstandingRequestCount++;
      timeoutId = setTimeout(function () {
        delete pendingDeferIds[timeoutId];
        completeOutstandingRequest(fn);
      }, delay || 0);
      pendingDeferIds[timeoutId] = true;
      return timeoutId;
    };
    self.defer.cancel = function (deferId) {
      if (pendingDeferIds[deferId]) {
        delete pendingDeferIds[deferId];
        clearTimeout(deferId);
        completeOutstandingRequest(noop);
        return true;
      }
      return false;
    };
  }
  function $BrowserProvider() {
    this.$get = [
      '$window',
      '$log',
      '$sniffer',
      '$document',
      function ($window, $log, $sniffer, $document) {
        return new Browser($window, $document, $log, $sniffer);
      }
    ];
  }
  function $CacheFactoryProvider() {
    this.$get = function () {
      var caches = {};
      function cacheFactory(cacheId, options) {
        if (cacheId in caches) {
          throw minErr('$cacheFactory')('iid', 'CacheId \'{0}\' is already taken!', cacheId);
        }
        var size = 0, stats = extend({}, options, { id: cacheId }), data = {}, capacity = options && options.capacity || Number.MAX_VALUE, lruHash = {}, freshEnd = null, staleEnd = null;
        return caches[cacheId] = {
          put: function (key, value) {
            var lruEntry = lruHash[key] || (lruHash[key] = { key: key });
            refresh(lruEntry);
            if (isUndefined(value))
              return;
            if (!(key in data))
              size++;
            data[key] = value;
            if (size > capacity) {
              this.remove(staleEnd.key);
            }
            return value;
          },
          get: function (key) {
            var lruEntry = lruHash[key];
            if (!lruEntry)
              return;
            refresh(lruEntry);
            return data[key];
          },
          remove: function (key) {
            var lruEntry = lruHash[key];
            if (!lruEntry)
              return;
            if (lruEntry == freshEnd)
              freshEnd = lruEntry.p;
            if (lruEntry == staleEnd)
              staleEnd = lruEntry.n;
            link(lruEntry.n, lruEntry.p);
            delete lruHash[key];
            delete data[key];
            size--;
          },
          removeAll: function () {
            data = {};
            size = 0;
            lruHash = {};
            freshEnd = staleEnd = null;
          },
          destroy: function () {
            data = null;
            stats = null;
            lruHash = null;
            delete caches[cacheId];
          },
          info: function () {
            return extend({}, stats, { size: size });
          }
        };
        function refresh(entry) {
          if (entry != freshEnd) {
            if (!staleEnd) {
              staleEnd = entry;
            } else if (staleEnd == entry) {
              staleEnd = entry.n;
            }
            link(entry.n, entry.p);
            link(entry, freshEnd);
            freshEnd = entry;
            freshEnd.n = null;
          }
        }
        function link(nextEntry, prevEntry) {
          if (nextEntry != prevEntry) {
            if (nextEntry)
              nextEntry.p = prevEntry;
            if (prevEntry)
              prevEntry.n = nextEntry;
          }
        }
      }
      cacheFactory.info = function () {
        var info = {};
        forEach(caches, function (cache, cacheId) {
          info[cacheId] = cache.info();
        });
        return info;
      };
      cacheFactory.get = function (cacheId) {
        return caches[cacheId];
      };
      return cacheFactory;
    };
  }
  function $TemplateCacheProvider() {
    this.$get = [
      '$cacheFactory',
      function ($cacheFactory) {
        return $cacheFactory('templates');
      }
    ];
  }
  var $compileMinErr = minErr('$compile');
  $CompileProvider.$inject = [
    '$provide',
    '$$sanitizeUriProvider'
  ];
  function $CompileProvider($provide, $$sanitizeUriProvider) {
    var hasDirectives = {}, Suffix = 'Directive', COMMENT_DIRECTIVE_REGEXP = /^\s*directive\:\s*([\d\w\-_]+)\s+(.*)$/, CLASS_DIRECTIVE_REGEXP = /(([\d\w\-_]+)(?:\:([^;]+))?;?)/;
    var EVENT_HANDLER_ATTR_REGEXP = /^(on[a-z]+|formaction)$/;
    this.directive = function registerDirective(name, directiveFactory) {
      assertNotHasOwnProperty(name, 'directive');
      if (isString(name)) {
        assertArg(directiveFactory, 'directiveFactory');
        if (!hasDirectives.hasOwnProperty(name)) {
          hasDirectives[name] = [];
          $provide.factory(name + Suffix, [
            '$injector',
            '$exceptionHandler',
            function ($injector, $exceptionHandler) {
              var directives = [];
              forEach(hasDirectives[name], function (directiveFactory, index) {
                try {
                  var directive = $injector.invoke(directiveFactory);
                  if (isFunction(directive)) {
                    directive = { compile: valueFn(directive) };
                  } else if (!directive.compile && directive.link) {
                    directive.compile = valueFn(directive.link);
                  }
                  directive.priority = directive.priority || 0;
                  directive.index = index;
                  directive.name = directive.name || name;
                  directive.require = directive.require || directive.controller && directive.name;
                  directive.restrict = directive.restrict || 'A';
                  directives.push(directive);
                } catch (e) {
                  $exceptionHandler(e);
                }
              });
              return directives;
            }
          ]);
        }
        hasDirectives[name].push(directiveFactory);
      } else {
        forEach(name, reverseParams(registerDirective));
      }
      return this;
    };
    this.aHrefSanitizationWhitelist = function (regexp) {
      if (isDefined(regexp)) {
        $$sanitizeUriProvider.aHrefSanitizationWhitelist(regexp);
        return this;
      } else {
        return $$sanitizeUriProvider.aHrefSanitizationWhitelist();
      }
    };
    this.imgSrcSanitizationWhitelist = function (regexp) {
      if (isDefined(regexp)) {
        $$sanitizeUriProvider.imgSrcSanitizationWhitelist(regexp);
        return this;
      } else {
        return $$sanitizeUriProvider.imgSrcSanitizationWhitelist();
      }
    };
    this.$get = [
      '$injector',
      '$interpolate',
      '$exceptionHandler',
      '$http',
      '$templateCache',
      '$parse',
      '$controller',
      '$rootScope',
      '$document',
      '$sce',
      '$animate',
      '$$sanitizeUri',
      function ($injector, $interpolate, $exceptionHandler, $http, $templateCache, $parse, $controller, $rootScope, $document, $sce, $animate, $$sanitizeUri) {
        var Attributes = function (element, attr) {
          this.$$element = element;
          this.$attr = attr || {};
        };
        Attributes.prototype = {
          $normalize: directiveNormalize,
          $addClass: function (classVal) {
            if (classVal && classVal.length > 0) {
              $animate.addClass(this.$$element, classVal);
            }
          },
          $removeClass: function (classVal) {
            if (classVal && classVal.length > 0) {
              $animate.removeClass(this.$$element, classVal);
            }
          },
          $updateClass: function (newClasses, oldClasses) {
            this.$removeClass(tokenDifference(oldClasses, newClasses));
            this.$addClass(tokenDifference(newClasses, oldClasses));
          },
          $set: function (key, value, writeAttr, attrName) {
            var booleanKey = getBooleanAttrName(this.$$element[0], key), normalizedVal, nodeName;
            if (booleanKey) {
              this.$$element.prop(key, value);
              attrName = booleanKey;
            }
            this[key] = value;
            if (attrName) {
              this.$attr[key] = attrName;
            } else {
              attrName = this.$attr[key];
              if (!attrName) {
                this.$attr[key] = attrName = snake_case(key, '-');
              }
            }
            nodeName = nodeName_(this.$$element);
            if (nodeName === 'A' && key === 'href' || nodeName === 'IMG' && key === 'src') {
              this[key] = value = $$sanitizeUri(value, key === 'src');
            }
            if (writeAttr !== false) {
              if (value === null || value === undefined) {
                this.$$element.removeAttr(attrName);
              } else {
                this.$$element.attr(attrName, value);
              }
            }
            var $$observers = this.$$observers;
            $$observers && forEach($$observers[key], function (fn) {
              try {
                fn(value);
              } catch (e) {
                $exceptionHandler(e);
              }
            });
          },
          $observe: function (key, fn) {
            var attrs = this, $$observers = attrs.$$observers || (attrs.$$observers = {}), listeners = $$observers[key] || ($$observers[key] = []);
            listeners.push(fn);
            $rootScope.$evalAsync(function () {
              if (!listeners.$$inter) {
                fn(attrs[key]);
              }
            });
            return fn;
          }
        };
        var startSymbol = $interpolate.startSymbol(), endSymbol = $interpolate.endSymbol(), denormalizeTemplate = startSymbol == '{{' || endSymbol == '}}' ? identity : function denormalizeTemplate(template) {
            return template.replace(/\{\{/g, startSymbol).replace(/}}/g, endSymbol);
          }, NG_ATTR_BINDING = /^ngAttr[A-Z]/;
        return compile;
        function compile($compileNodes, transcludeFn, maxPriority, ignoreDirective, previousCompileContext) {
          if (!($compileNodes instanceof jqLite)) {
            $compileNodes = jqLite($compileNodes);
          }
          forEach($compileNodes, function (node, index) {
            if (node.nodeType == 3 && node.nodeValue.match(/\S+/)) {
              $compileNodes[index] = node = jqLite(node).wrap('<span></span>').parent()[0];
            }
          });
          var compositeLinkFn = compileNodes($compileNodes, transcludeFn, $compileNodes, maxPriority, ignoreDirective, previousCompileContext);
          safeAddClass($compileNodes, 'ng-scope');
          return function publicLinkFn(scope, cloneConnectFn, transcludeControllers) {
            assertArg(scope, 'scope');
            var $linkNode = cloneConnectFn ? JQLitePrototype.clone.call($compileNodes) : $compileNodes;
            forEach(transcludeControllers, function (instance, name) {
              $linkNode.data('$' + name + 'Controller', instance);
            });
            for (var i = 0, ii = $linkNode.length; i < ii; i++) {
              var node = $linkNode[i], nodeType = node.nodeType;
              if (nodeType === 1 || nodeType === 9) {
                $linkNode.eq(i).data('$scope', scope);
              }
            }
            if (cloneConnectFn)
              cloneConnectFn($linkNode, scope);
            if (compositeLinkFn)
              compositeLinkFn(scope, $linkNode, $linkNode);
            return $linkNode;
          };
        }
        function safeAddClass($element, className) {
          try {
            $element.addClass(className);
          } catch (e) {
          }
        }
        function compileNodes(nodeList, transcludeFn, $rootElement, maxPriority, ignoreDirective, previousCompileContext) {
          var linkFns = [], attrs, directives, nodeLinkFn, childNodes, childLinkFn, linkFnFound;
          for (var i = 0; i < nodeList.length; i++) {
            attrs = new Attributes();
            directives = collectDirectives(nodeList[i], [], attrs, i === 0 ? maxPriority : undefined, ignoreDirective);
            nodeLinkFn = directives.length ? applyDirectivesToNode(directives, nodeList[i], attrs, transcludeFn, $rootElement, null, [], [], previousCompileContext) : null;
            if (nodeLinkFn && nodeLinkFn.scope) {
              safeAddClass(jqLite(nodeList[i]), 'ng-scope');
            }
            childLinkFn = nodeLinkFn && nodeLinkFn.terminal || !(childNodes = nodeList[i].childNodes) || !childNodes.length ? null : compileNodes(childNodes, nodeLinkFn ? nodeLinkFn.transclude : transcludeFn);
            linkFns.push(nodeLinkFn, childLinkFn);
            linkFnFound = linkFnFound || nodeLinkFn || childLinkFn;
            previousCompileContext = null;
          }
          return linkFnFound ? compositeLinkFn : null;
          function compositeLinkFn(scope, nodeList, $rootElement, boundTranscludeFn) {
            var nodeLinkFn, childLinkFn, node, $node, childScope, childTranscludeFn, i, ii, n;
            var nodeListLength = nodeList.length, stableNodeList = new Array(nodeListLength);
            for (i = 0; i < nodeListLength; i++) {
              stableNodeList[i] = nodeList[i];
            }
            for (i = 0, n = 0, ii = linkFns.length; i < ii; n++) {
              node = stableNodeList[n];
              nodeLinkFn = linkFns[i++];
              childLinkFn = linkFns[i++];
              $node = jqLite(node);
              if (nodeLinkFn) {
                if (nodeLinkFn.scope) {
                  childScope = scope.$new();
                  $node.data('$scope', childScope);
                } else {
                  childScope = scope;
                }
                childTranscludeFn = nodeLinkFn.transclude;
                if (childTranscludeFn || !boundTranscludeFn && transcludeFn) {
                  nodeLinkFn(childLinkFn, childScope, node, $rootElement, createBoundTranscludeFn(scope, childTranscludeFn || transcludeFn));
                } else {
                  nodeLinkFn(childLinkFn, childScope, node, $rootElement, boundTranscludeFn);
                }
              } else if (childLinkFn) {
                childLinkFn(scope, node.childNodes, undefined, boundTranscludeFn);
              }
            }
          }
        }
        function createBoundTranscludeFn(scope, transcludeFn) {
          return function boundTranscludeFn(transcludedScope, cloneFn, controllers) {
            var scopeCreated = false;
            if (!transcludedScope) {
              transcludedScope = scope.$new();
              transcludedScope.$$transcluded = true;
              scopeCreated = true;
            }
            var clone = transcludeFn(transcludedScope, cloneFn, controllers);
            if (scopeCreated) {
              clone.on('$destroy', bind(transcludedScope, transcludedScope.$destroy));
            }
            return clone;
          };
        }
        function collectDirectives(node, directives, attrs, maxPriority, ignoreDirective) {
          var nodeType = node.nodeType, attrsMap = attrs.$attr, match, className;
          switch (nodeType) {
          case 1:
            addDirective(directives, directiveNormalize(nodeName_(node).toLowerCase()), 'E', maxPriority, ignoreDirective);
            for (var attr, name, nName, ngAttrName, value, nAttrs = node.attributes, j = 0, jj = nAttrs && nAttrs.length; j < jj; j++) {
              var attrStartName = false;
              var attrEndName = false;
              attr = nAttrs[j];
              if (!msie || msie >= 8 || attr.specified) {
                name = attr.name;
                ngAttrName = directiveNormalize(name);
                if (NG_ATTR_BINDING.test(ngAttrName)) {
                  name = snake_case(ngAttrName.substr(6), '-');
                }
                var directiveNName = ngAttrName.replace(/(Start|End)$/, '');
                if (ngAttrName === directiveNName + 'Start') {
                  attrStartName = name;
                  attrEndName = name.substr(0, name.length - 5) + 'end';
                  name = name.substr(0, name.length - 6);
                }
                nName = directiveNormalize(name.toLowerCase());
                attrsMap[nName] = name;
                attrs[nName] = value = trim(attr.value);
                if (getBooleanAttrName(node, nName)) {
                  attrs[nName] = true;
                }
                addAttrInterpolateDirective(node, directives, value, nName);
                addDirective(directives, nName, 'A', maxPriority, ignoreDirective, attrStartName, attrEndName);
              }
            }
            className = node.className;
            if (isString(className) && className !== '') {
              while (match = CLASS_DIRECTIVE_REGEXP.exec(className)) {
                nName = directiveNormalize(match[2]);
                if (addDirective(directives, nName, 'C', maxPriority, ignoreDirective)) {
                  attrs[nName] = trim(match[3]);
                }
                className = className.substr(match.index + match[0].length);
              }
            }
            break;
          case 3:
            addTextInterpolateDirective(directives, node.nodeValue);
            break;
          case 8:
            try {
              match = COMMENT_DIRECTIVE_REGEXP.exec(node.nodeValue);
              if (match) {
                nName = directiveNormalize(match[1]);
                if (addDirective(directives, nName, 'M', maxPriority, ignoreDirective)) {
                  attrs[nName] = trim(match[2]);
                }
              }
            } catch (e) {
            }
            break;
          }
          directives.sort(byPriority);
          return directives;
        }
        function groupScan(node, attrStart, attrEnd) {
          var nodes = [];
          var depth = 0;
          if (attrStart && node.hasAttribute && node.hasAttribute(attrStart)) {
            var startNode = node;
            do {
              if (!node) {
                throw $compileMinErr('uterdir', 'Unterminated attribute, found \'{0}\' but no matching \'{1}\' found.', attrStart, attrEnd);
              }
              if (node.nodeType == 1) {
                if (node.hasAttribute(attrStart))
                  depth++;
                if (node.hasAttribute(attrEnd))
                  depth--;
              }
              nodes.push(node);
              node = node.nextSibling;
            } while (depth > 0);
          } else {
            nodes.push(node);
          }
          return jqLite(nodes);
        }
        function groupElementsLinkFnWrapper(linkFn, attrStart, attrEnd) {
          return function (scope, element, attrs, controllers, transcludeFn) {
            element = groupScan(element[0], attrStart, attrEnd);
            return linkFn(scope, element, attrs, controllers, transcludeFn);
          };
        }
        function applyDirectivesToNode(directives, compileNode, templateAttrs, transcludeFn, jqCollection, originalReplaceDirective, preLinkFns, postLinkFns, previousCompileContext) {
          previousCompileContext = previousCompileContext || {};
          var terminalPriority = -Number.MAX_VALUE, newScopeDirective, controllerDirectives = previousCompileContext.controllerDirectives, newIsolateScopeDirective = previousCompileContext.newIsolateScopeDirective, templateDirective = previousCompileContext.templateDirective, nonTlbTranscludeDirective = previousCompileContext.nonTlbTranscludeDirective, hasTranscludeDirective = false, hasElementTranscludeDirective = false, $compileNode = templateAttrs.$$element = jqLite(compileNode), directive, directiveName, $template, replaceDirective = originalReplaceDirective, childTranscludeFn = transcludeFn, linkFn, directiveValue;
          for (var i = 0, ii = directives.length; i < ii; i++) {
            directive = directives[i];
            var attrStart = directive.$$start;
            var attrEnd = directive.$$end;
            if (attrStart) {
              $compileNode = groupScan(compileNode, attrStart, attrEnd);
            }
            $template = undefined;
            if (terminalPriority > directive.priority) {
              break;
            }
            if (directiveValue = directive.scope) {
              newScopeDirective = newScopeDirective || directive;
              if (!directive.templateUrl) {
                assertNoDuplicate('new/isolated scope', newIsolateScopeDirective, directive, $compileNode);
                if (isObject(directiveValue)) {
                  newIsolateScopeDirective = directive;
                }
              }
            }
            directiveName = directive.name;
            if (!directive.templateUrl && directive.controller) {
              directiveValue = directive.controller;
              controllerDirectives = controllerDirectives || {};
              assertNoDuplicate('\'' + directiveName + '\' controller', controllerDirectives[directiveName], directive, $compileNode);
              controllerDirectives[directiveName] = directive;
            }
            if (directiveValue = directive.transclude) {
              hasTranscludeDirective = true;
              if (!directive.$$tlb) {
                assertNoDuplicate('transclusion', nonTlbTranscludeDirective, directive, $compileNode);
                nonTlbTranscludeDirective = directive;
              }
              if (directiveValue == 'element') {
                hasElementTranscludeDirective = true;
                terminalPriority = directive.priority;
                $template = groupScan(compileNode, attrStart, attrEnd);
                $compileNode = templateAttrs.$$element = jqLite(document.createComment(' ' + directiveName + ': ' + templateAttrs[directiveName] + ' '));
                compileNode = $compileNode[0];
                replaceWith(jqCollection, jqLite(sliceArgs($template)), compileNode);
                childTranscludeFn = compile($template, transcludeFn, terminalPriority, replaceDirective && replaceDirective.name, { nonTlbTranscludeDirective: nonTlbTranscludeDirective });
              } else {
                $template = jqLite(jqLiteClone(compileNode)).contents();
                $compileNode.empty();
                childTranscludeFn = compile($template, transcludeFn);
              }
            }
            if (directive.template) {
              assertNoDuplicate('template', templateDirective, directive, $compileNode);
              templateDirective = directive;
              directiveValue = isFunction(directive.template) ? directive.template($compileNode, templateAttrs) : directive.template;
              directiveValue = denormalizeTemplate(directiveValue);
              if (directive.replace) {
                replaceDirective = directive;
                $template = jqLite('<div>' + trim(directiveValue) + '</div>').contents();
                compileNode = $template[0];
                if ($template.length != 1 || compileNode.nodeType !== 1) {
                  throw $compileMinErr('tplrt', 'Template for directive \'{0}\' must have exactly one root element. {1}', directiveName, '');
                }
                replaceWith(jqCollection, $compileNode, compileNode);
                var newTemplateAttrs = { $attr: {} };
                var templateDirectives = collectDirectives(compileNode, [], newTemplateAttrs);
                var unprocessedDirectives = directives.splice(i + 1, directives.length - (i + 1));
                if (newIsolateScopeDirective) {
                  markDirectivesAsIsolate(templateDirectives);
                }
                directives = directives.concat(templateDirectives).concat(unprocessedDirectives);
                mergeTemplateAttributes(templateAttrs, newTemplateAttrs);
                ii = directives.length;
              } else {
                $compileNode.html(directiveValue);
              }
            }
            if (directive.templateUrl) {
              assertNoDuplicate('template', templateDirective, directive, $compileNode);
              templateDirective = directive;
              if (directive.replace) {
                replaceDirective = directive;
              }
              nodeLinkFn = compileTemplateUrl(directives.splice(i, directives.length - i), $compileNode, templateAttrs, jqCollection, childTranscludeFn, preLinkFns, postLinkFns, {
                controllerDirectives: controllerDirectives,
                newIsolateScopeDirective: newIsolateScopeDirective,
                templateDirective: templateDirective,
                nonTlbTranscludeDirective: nonTlbTranscludeDirective
              });
              ii = directives.length;
            } else if (directive.compile) {
              try {
                linkFn = directive.compile($compileNode, templateAttrs, childTranscludeFn);
                if (isFunction(linkFn)) {
                  addLinkFns(null, linkFn, attrStart, attrEnd);
                } else if (linkFn) {
                  addLinkFns(linkFn.pre, linkFn.post, attrStart, attrEnd);
                }
              } catch (e) {
                $exceptionHandler(e, startingTag($compileNode));
              }
            }
            if (directive.terminal) {
              nodeLinkFn.terminal = true;
              terminalPriority = Math.max(terminalPriority, directive.priority);
            }
          }
          nodeLinkFn.scope = newScopeDirective && newScopeDirective.scope === true;
          nodeLinkFn.transclude = hasTranscludeDirective && childTranscludeFn;
          return nodeLinkFn;
          function addLinkFns(pre, post, attrStart, attrEnd) {
            if (pre) {
              if (attrStart)
                pre = groupElementsLinkFnWrapper(pre, attrStart, attrEnd);
              pre.require = directive.require;
              if (newIsolateScopeDirective === directive || directive.$$isolateScope) {
                pre = cloneAndAnnotateFn(pre, { isolateScope: true });
              }
              preLinkFns.push(pre);
            }
            if (post) {
              if (attrStart)
                post = groupElementsLinkFnWrapper(post, attrStart, attrEnd);
              post.require = directive.require;
              if (newIsolateScopeDirective === directive || directive.$$isolateScope) {
                post = cloneAndAnnotateFn(post, { isolateScope: true });
              }
              postLinkFns.push(post);
            }
          }
          function getControllers(require, $element, elementControllers) {
            var value, retrievalMethod = 'data', optional = false;
            if (isString(require)) {
              while ((value = require.charAt(0)) == '^' || value == '?') {
                require = require.substr(1);
                if (value == '^') {
                  retrievalMethod = 'inheritedData';
                }
                optional = optional || value == '?';
              }
              value = null;
              if (elementControllers && retrievalMethod === 'data') {
                value = elementControllers[require];
              }
              value = value || $element[retrievalMethod]('$' + require + 'Controller');
              if (!value && !optional) {
                throw $compileMinErr('ctreq', 'Controller \'{0}\', required by directive \'{1}\', can\'t be found!', require, directiveName);
              }
              return value;
            } else if (isArray(require)) {
              value = [];
              forEach(require, function (require) {
                value.push(getControllers(require, $element, elementControllers));
              });
            }
            return value;
          }
          function nodeLinkFn(childLinkFn, scope, linkNode, $rootElement, boundTranscludeFn) {
            var attrs, $element, i, ii, linkFn, controller, isolateScope, elementControllers = {}, transcludeFn;
            if (compileNode === linkNode) {
              attrs = templateAttrs;
            } else {
              attrs = shallowCopy(templateAttrs, new Attributes(jqLite(linkNode), templateAttrs.$attr));
            }
            $element = attrs.$$element;
            if (newIsolateScopeDirective) {
              var LOCAL_REGEXP = /^\s*([@=&])(\??)\s*(\w*)\s*$/;
              var $linkNode = jqLite(linkNode);
              isolateScope = scope.$new(true);
              if (templateDirective && templateDirective === newIsolateScopeDirective.$$originalDirective) {
                $linkNode.data('$isolateScope', isolateScope);
              } else {
                $linkNode.data('$isolateScopeNoTemplate', isolateScope);
              }
              safeAddClass($linkNode, 'ng-isolate-scope');
              forEach(newIsolateScopeDirective.scope, function (definition, scopeName) {
                var match = definition.match(LOCAL_REGEXP) || [], attrName = match[3] || scopeName, optional = match[2] == '?', mode = match[1], lastValue, parentGet, parentSet, compare;
                isolateScope.$$isolateBindings[scopeName] = mode + attrName;
                switch (mode) {
                case '@':
                  attrs.$observe(attrName, function (value) {
                    isolateScope[scopeName] = value;
                  });
                  attrs.$$observers[attrName].$$scope = scope;
                  if (attrs[attrName]) {
                    isolateScope[scopeName] = $interpolate(attrs[attrName])(scope);
                  }
                  break;
                case '=':
                  if (optional && !attrs[attrName]) {
                    return;
                  }
                  parentGet = $parse(attrs[attrName]);
                  if (parentGet.literal) {
                    compare = equals;
                  } else {
                    compare = function (a, b) {
                      return a === b;
                    };
                  }
                  parentSet = parentGet.assign || function () {
                    lastValue = isolateScope[scopeName] = parentGet(scope);
                    throw $compileMinErr('nonassign', 'Expression \'{0}\' used with directive \'{1}\' is non-assignable!', attrs[attrName], newIsolateScopeDirective.name);
                  };
                  lastValue = isolateScope[scopeName] = parentGet(scope);
                  isolateScope.$watch(function parentValueWatch() {
                    var parentValue = parentGet(scope);
                    if (!compare(parentValue, isolateScope[scopeName])) {
                      if (!compare(parentValue, lastValue)) {
                        isolateScope[scopeName] = parentValue;
                      } else {
                        parentSet(scope, parentValue = isolateScope[scopeName]);
                      }
                    }
                    return lastValue = parentValue;
                  }, null, parentGet.literal);
                  break;
                case '&':
                  parentGet = $parse(attrs[attrName]);
                  isolateScope[scopeName] = function (locals) {
                    return parentGet(scope, locals);
                  };
                  break;
                default:
                  throw $compileMinErr('iscp', 'Invalid isolate scope definition for directive \'{0}\'.' + ' Definition: {... {1}: \'{2}\' ...}', newIsolateScopeDirective.name, scopeName, definition);
                }
              });
            }
            transcludeFn = boundTranscludeFn && controllersBoundTransclude;
            if (controllerDirectives) {
              forEach(controllerDirectives, function (directive) {
                var locals = {
                    $scope: directive === newIsolateScopeDirective || directive.$$isolateScope ? isolateScope : scope,
                    $element: $element,
                    $attrs: attrs,
                    $transclude: transcludeFn
                  }, controllerInstance;
                controller = directive.controller;
                if (controller == '@') {
                  controller = attrs[directive.name];
                }
                controllerInstance = $controller(controller, locals);
                elementControllers[directive.name] = controllerInstance;
                if (!hasElementTranscludeDirective) {
                  $element.data('$' + directive.name + 'Controller', controllerInstance);
                }
                if (directive.controllerAs) {
                  locals.$scope[directive.controllerAs] = controllerInstance;
                }
              });
            }
            for (i = 0, ii = preLinkFns.length; i < ii; i++) {
              try {
                linkFn = preLinkFns[i];
                linkFn(linkFn.isolateScope ? isolateScope : scope, $element, attrs, linkFn.require && getControllers(linkFn.require, $element, elementControllers), transcludeFn);
              } catch (e) {
                $exceptionHandler(e, startingTag($element));
              }
            }
            var scopeToChild = scope;
            if (newIsolateScopeDirective && (newIsolateScopeDirective.template || newIsolateScopeDirective.templateUrl === null)) {
              scopeToChild = isolateScope;
            }
            childLinkFn && childLinkFn(scopeToChild, linkNode.childNodes, undefined, boundTranscludeFn);
            for (i = postLinkFns.length - 1; i >= 0; i--) {
              try {
                linkFn = postLinkFns[i];
                linkFn(linkFn.isolateScope ? isolateScope : scope, $element, attrs, linkFn.require && getControllers(linkFn.require, $element, elementControllers), transcludeFn);
              } catch (e) {
                $exceptionHandler(e, startingTag($element));
              }
            }
            function controllersBoundTransclude(scope, cloneAttachFn) {
              var transcludeControllers;
              if (arguments.length < 2) {
                cloneAttachFn = scope;
                scope = undefined;
              }
              if (hasElementTranscludeDirective) {
                transcludeControllers = elementControllers;
              }
              return boundTranscludeFn(scope, cloneAttachFn, transcludeControllers);
            }
          }
        }
        function markDirectivesAsIsolate(directives) {
          for (var j = 0, jj = directives.length; j < jj; j++) {
            directives[j] = inherit(directives[j], { $$isolateScope: true });
          }
        }
        function addDirective(tDirectives, name, location, maxPriority, ignoreDirective, startAttrName, endAttrName) {
          if (name === ignoreDirective)
            return null;
          var match = null;
          if (hasDirectives.hasOwnProperty(name)) {
            for (var directive, directives = $injector.get(name + Suffix), i = 0, ii = directives.length; i < ii; i++) {
              try {
                directive = directives[i];
                if ((maxPriority === undefined || maxPriority > directive.priority) && directive.restrict.indexOf(location) != -1) {
                  if (startAttrName) {
                    directive = inherit(directive, {
                      $$start: startAttrName,
                      $$end: endAttrName
                    });
                  }
                  tDirectives.push(directive);
                  match = directive;
                }
              } catch (e) {
                $exceptionHandler(e);
              }
            }
          }
          return match;
        }
        function mergeTemplateAttributes(dst, src) {
          var srcAttr = src.$attr, dstAttr = dst.$attr, $element = dst.$$element;
          forEach(dst, function (value, key) {
            if (key.charAt(0) != '$') {
              if (src[key]) {
                value += (key === 'style' ? ';' : ' ') + src[key];
              }
              dst.$set(key, value, true, srcAttr[key]);
            }
          });
          forEach(src, function (value, key) {
            if (key == 'class') {
              safeAddClass($element, value);
              dst['class'] = (dst['class'] ? dst['class'] + ' ' : '') + value;
            } else if (key == 'style') {
              $element.attr('style', $element.attr('style') + ';' + value);
              dst['style'] = (dst['style'] ? dst['style'] + ';' : '') + value;
            } else if (key.charAt(0) != '$' && !dst.hasOwnProperty(key)) {
              dst[key] = value;
              dstAttr[key] = srcAttr[key];
            }
          });
        }
        function compileTemplateUrl(directives, $compileNode, tAttrs, $rootElement, childTranscludeFn, preLinkFns, postLinkFns, previousCompileContext) {
          var linkQueue = [], afterTemplateNodeLinkFn, afterTemplateChildLinkFn, beforeTemplateCompileNode = $compileNode[0], origAsyncDirective = directives.shift(), derivedSyncDirective = extend({}, origAsyncDirective, {
              templateUrl: null,
              transclude: null,
              replace: null,
              $$originalDirective: origAsyncDirective
            }), templateUrl = isFunction(origAsyncDirective.templateUrl) ? origAsyncDirective.templateUrl($compileNode, tAttrs) : origAsyncDirective.templateUrl;
          $compileNode.empty();
          $http.get($sce.getTrustedResourceUrl(templateUrl), { cache: $templateCache }).success(function (content) {
            var compileNode, tempTemplateAttrs, $template, childBoundTranscludeFn;
            content = denormalizeTemplate(content);
            if (origAsyncDirective.replace) {
              $template = jqLite('<div>' + trim(content) + '</div>').contents();
              compileNode = $template[0];
              if ($template.length != 1 || compileNode.nodeType !== 1) {
                throw $compileMinErr('tplrt', 'Template for directive \'{0}\' must have exactly one root element. {1}', origAsyncDirective.name, templateUrl);
              }
              tempTemplateAttrs = { $attr: {} };
              replaceWith($rootElement, $compileNode, compileNode);
              var templateDirectives = collectDirectives(compileNode, [], tempTemplateAttrs);
              if (isObject(origAsyncDirective.scope)) {
                markDirectivesAsIsolate(templateDirectives);
              }
              directives = templateDirectives.concat(directives);
              mergeTemplateAttributes(tAttrs, tempTemplateAttrs);
            } else {
              compileNode = beforeTemplateCompileNode;
              $compileNode.html(content);
            }
            directives.unshift(derivedSyncDirective);
            afterTemplateNodeLinkFn = applyDirectivesToNode(directives, compileNode, tAttrs, childTranscludeFn, $compileNode, origAsyncDirective, preLinkFns, postLinkFns, previousCompileContext);
            forEach($rootElement, function (node, i) {
              if (node == compileNode) {
                $rootElement[i] = $compileNode[0];
              }
            });
            afterTemplateChildLinkFn = compileNodes($compileNode[0].childNodes, childTranscludeFn);
            while (linkQueue.length) {
              var scope = linkQueue.shift(), beforeTemplateLinkNode = linkQueue.shift(), linkRootElement = linkQueue.shift(), boundTranscludeFn = linkQueue.shift(), linkNode = $compileNode[0];
              if (beforeTemplateLinkNode !== beforeTemplateCompileNode) {
                linkNode = jqLiteClone(compileNode);
                replaceWith(linkRootElement, jqLite(beforeTemplateLinkNode), linkNode);
              }
              if (afterTemplateNodeLinkFn.transclude) {
                childBoundTranscludeFn = createBoundTranscludeFn(scope, afterTemplateNodeLinkFn.transclude);
              } else {
                childBoundTranscludeFn = boundTranscludeFn;
              }
              afterTemplateNodeLinkFn(afterTemplateChildLinkFn, scope, linkNode, $rootElement, childBoundTranscludeFn);
            }
            linkQueue = null;
          }).error(function (response, code, headers, config) {
            throw $compileMinErr('tpload', 'Failed to load template: {0}', config.url);
          });
          return function delayedNodeLinkFn(ignoreChildLinkFn, scope, node, rootElement, boundTranscludeFn) {
            if (linkQueue) {
              linkQueue.push(scope);
              linkQueue.push(node);
              linkQueue.push(rootElement);
              linkQueue.push(boundTranscludeFn);
            } else {
              afterTemplateNodeLinkFn(afterTemplateChildLinkFn, scope, node, rootElement, boundTranscludeFn);
            }
          };
        }
        function byPriority(a, b) {
          var diff = b.priority - a.priority;
          if (diff !== 0)
            return diff;
          if (a.name !== b.name)
            return a.name < b.name ? -1 : 1;
          return a.index - b.index;
        }
        function assertNoDuplicate(what, previousDirective, directive, element) {
          if (previousDirective) {
            throw $compileMinErr('multidir', 'Multiple directives [{0}, {1}] asking for {2} on: {3}', previousDirective.name, directive.name, what, startingTag(element));
          }
        }
        function addTextInterpolateDirective(directives, text) {
          var interpolateFn = $interpolate(text, true);
          if (interpolateFn) {
            directives.push({
              priority: 0,
              compile: valueFn(function textInterpolateLinkFn(scope, node) {
                var parent = node.parent(), bindings = parent.data('$binding') || [];
                bindings.push(interpolateFn);
                safeAddClass(parent.data('$binding', bindings), 'ng-binding');
                scope.$watch(interpolateFn, function interpolateFnWatchAction(value) {
                  node[0].nodeValue = value;
                });
              })
            });
          }
        }
        function getTrustedContext(node, attrNormalizedName) {
          if (attrNormalizedName == 'srcdoc') {
            return $sce.HTML;
          }
          var tag = nodeName_(node);
          if (attrNormalizedName == 'xlinkHref' || tag == 'FORM' && attrNormalizedName == 'action' || tag != 'IMG' && (attrNormalizedName == 'src' || attrNormalizedName == 'ngSrc')) {
            return $sce.RESOURCE_URL;
          }
        }
        function addAttrInterpolateDirective(node, directives, value, name) {
          var interpolateFn = $interpolate(value, true);
          if (!interpolateFn)
            return;
          if (name === 'multiple' && nodeName_(node) === 'SELECT') {
            throw $compileMinErr('selmulti', 'Binding to the \'multiple\' attribute is not supported. Element: {0}', startingTag(node));
          }
          directives.push({
            priority: 100,
            compile: function () {
              return {
                pre: function attrInterpolatePreLinkFn(scope, element, attr) {
                  var $$observers = attr.$$observers || (attr.$$observers = {});
                  if (EVENT_HANDLER_ATTR_REGEXP.test(name)) {
                    throw $compileMinErr('nodomevents', 'Interpolations for HTML DOM event attributes are disallowed.  Please use the ' + 'ng- versions (such as ng-click instead of onclick) instead.');
                  }
                  interpolateFn = $interpolate(attr[name], true, getTrustedContext(node, name));
                  if (!interpolateFn)
                    return;
                  attr[name] = interpolateFn(scope);
                  ($$observers[name] || ($$observers[name] = [])).$$inter = true;
                  (attr.$$observers && attr.$$observers[name].$$scope || scope).$watch(interpolateFn, function interpolateFnWatchAction(newValue, oldValue) {
                    if (name === 'class' && newValue != oldValue) {
                      attr.$updateClass(newValue, oldValue);
                    } else {
                      attr.$set(name, newValue);
                    }
                  });
                }
              };
            }
          });
        }
        function replaceWith($rootElement, elementsToRemove, newNode) {
          var firstElementToRemove = elementsToRemove[0], removeCount = elementsToRemove.length, parent = firstElementToRemove.parentNode, i, ii;
          if ($rootElement) {
            for (i = 0, ii = $rootElement.length; i < ii; i++) {
              if ($rootElement[i] == firstElementToRemove) {
                $rootElement[i++] = newNode;
                for (var j = i, j2 = j + removeCount - 1, jj = $rootElement.length; j < jj; j++, j2++) {
                  if (j2 < jj) {
                    $rootElement[j] = $rootElement[j2];
                  } else {
                    delete $rootElement[j];
                  }
                }
                $rootElement.length -= removeCount - 1;
                break;
              }
            }
          }
          if (parent) {
            parent.replaceChild(newNode, firstElementToRemove);
          }
          var fragment = document.createDocumentFragment();
          fragment.appendChild(firstElementToRemove);
          newNode[jqLite.expando] = firstElementToRemove[jqLite.expando];
          for (var k = 1, kk = elementsToRemove.length; k < kk; k++) {
            var element = elementsToRemove[k];
            jqLite(element).remove();
            fragment.appendChild(element);
            delete elementsToRemove[k];
          }
          elementsToRemove[0] = newNode;
          elementsToRemove.length = 1;
        }
        function cloneAndAnnotateFn(fn, annotation) {
          return extend(function () {
            return fn.apply(null, arguments);
          }, fn, annotation);
        }
      }
    ];
  }
  var PREFIX_REGEXP = /^(x[\:\-_]|data[\:\-_])/i;
  function directiveNormalize(name) {
    return camelCase(name.replace(PREFIX_REGEXP, ''));
  }
  function nodesetLinkingFn(scope, nodeList, rootElement, boundTranscludeFn) {
  }
  function directiveLinkingFn(nodesetLinkingFn, scope, node, rootElement, boundTranscludeFn) {
  }
  function tokenDifference(str1, str2) {
    var values = '', tokens1 = str1.split(/\s+/), tokens2 = str2.split(/\s+/);
    outer:
      for (var i = 0; i < tokens1.length; i++) {
        var token = tokens1[i];
        for (var j = 0; j < tokens2.length; j++) {
          if (token == tokens2[j])
            continue outer;
        }
        values += (values.length > 0 ? ' ' : '') + token;
      }
    return values;
  }
  function $ControllerProvider() {
    var controllers = {}, CNTRL_REG = /^(\S+)(\s+as\s+(\w+))?$/;
    this.register = function (name, constructor) {
      assertNotHasOwnProperty(name, 'controller');
      if (isObject(name)) {
        extend(controllers, name);
      } else {
        controllers[name] = constructor;
      }
    };
    this.$get = [
      '$injector',
      '$window',
      function ($injector, $window) {
        return function (expression, locals) {
          var instance, match, constructor, identifier;
          if (isString(expression)) {
            match = expression.match(CNTRL_REG), constructor = match[1], identifier = match[3];
            expression = controllers.hasOwnProperty(constructor) ? controllers[constructor] : getter(locals.$scope, constructor, true) || getter($window, constructor, true);
            assertArgFn(expression, constructor, true);
          }
          instance = $injector.instantiate(expression, locals);
          if (identifier) {
            if (!(locals && typeof locals.$scope == 'object')) {
              throw minErr('$controller')('noscp', 'Cannot export controller \'{0}\' as \'{1}\'! No $scope object provided via `locals`.', constructor || expression.name, identifier);
            }
            locals.$scope[identifier] = instance;
          }
          return instance;
        };
      }
    ];
  }
  function $DocumentProvider() {
    this.$get = [
      '$window',
      function (window) {
        return jqLite(window.document);
      }
    ];
  }
  function $ExceptionHandlerProvider() {
    this.$get = [
      '$log',
      function ($log) {
        return function (exception, cause) {
          $log.error.apply($log, arguments);
        };
      }
    ];
  }
  function parseHeaders(headers) {
    var parsed = {}, key, val, i;
    if (!headers)
      return parsed;
    forEach(headers.split('\n'), function (line) {
      i = line.indexOf(':');
      key = lowercase(trim(line.substr(0, i)));
      val = trim(line.substr(i + 1));
      if (key) {
        if (parsed[key]) {
          parsed[key] += ', ' + val;
        } else {
          parsed[key] = val;
        }
      }
    });
    return parsed;
  }
  function headersGetter(headers) {
    var headersObj = isObject(headers) ? headers : undefined;
    return function (name) {
      if (!headersObj)
        headersObj = parseHeaders(headers);
      if (name) {
        return headersObj[lowercase(name)] || null;
      }
      return headersObj;
    };
  }
  function transformData(data, headers, fns) {
    if (isFunction(fns))
      return fns(data, headers);
    forEach(fns, function (fn) {
      data = fn(data, headers);
    });
    return data;
  }
  function isSuccess(status) {
    return 200 <= status && status < 300;
  }
  function $HttpProvider() {
    var JSON_START = /^\s*(\[|\{[^\{])/, JSON_END = /[\}\]]\s*$/, PROTECTION_PREFIX = /^\)\]\}',?\n/, CONTENT_TYPE_APPLICATION_JSON = { 'Content-Type': 'application/json;charset=utf-8' };
    var defaults = this.defaults = {
        transformResponse: [function (data) {
            if (isString(data)) {
              data = data.replace(PROTECTION_PREFIX, '');
              if (JSON_START.test(data) && JSON_END.test(data))
                data = fromJson(data);
            }
            return data;
          }],
        transformRequest: [function (d) {
            return isObject(d) && !isFile(d) ? toJson(d) : d;
          }],
        headers: {
          common: { 'Accept': 'application/json, text/plain, */*' },
          post: copy(CONTENT_TYPE_APPLICATION_JSON),
          put: copy(CONTENT_TYPE_APPLICATION_JSON),
          patch: copy(CONTENT_TYPE_APPLICATION_JSON)
        },
        xsrfCookieName: 'XSRF-TOKEN',
        xsrfHeaderName: 'X-XSRF-TOKEN'
      };
    var interceptorFactories = this.interceptors = [];
    var responseInterceptorFactories = this.responseInterceptors = [];
    this.$get = [
      '$httpBackend',
      '$browser',
      '$cacheFactory',
      '$rootScope',
      '$q',
      '$injector',
      function ($httpBackend, $browser, $cacheFactory, $rootScope, $q, $injector) {
        var defaultCache = $cacheFactory('$http');
        var reversedInterceptors = [];
        forEach(interceptorFactories, function (interceptorFactory) {
          reversedInterceptors.unshift(isString(interceptorFactory) ? $injector.get(interceptorFactory) : $injector.invoke(interceptorFactory));
        });
        forEach(responseInterceptorFactories, function (interceptorFactory, index) {
          var responseFn = isString(interceptorFactory) ? $injector.get(interceptorFactory) : $injector.invoke(interceptorFactory);
          reversedInterceptors.splice(index, 0, {
            response: function (response) {
              return responseFn($q.when(response));
            },
            responseError: function (response) {
              return responseFn($q.reject(response));
            }
          });
        });
        function $http(requestConfig) {
          var config = {
              transformRequest: defaults.transformRequest,
              transformResponse: defaults.transformResponse
            };
          var headers = mergeHeaders(requestConfig);
          extend(config, requestConfig);
          config.headers = headers;
          config.method = uppercase(config.method);
          var xsrfValue = urlIsSameOrigin(config.url) ? $browser.cookies()[config.xsrfCookieName || defaults.xsrfCookieName] : undefined;
          if (xsrfValue) {
            headers[config.xsrfHeaderName || defaults.xsrfHeaderName] = xsrfValue;
          }
          var serverRequest = function (config) {
            headers = config.headers;
            var reqData = transformData(config.data, headersGetter(headers), config.transformRequest);
            if (isUndefined(config.data)) {
              forEach(headers, function (value, header) {
                if (lowercase(header) === 'content-type') {
                  delete headers[header];
                }
              });
            }
            if (isUndefined(config.withCredentials) && !isUndefined(defaults.withCredentials)) {
              config.withCredentials = defaults.withCredentials;
            }
            return sendReq(config, reqData, headers).then(transformResponse, transformResponse);
          };
          var chain = [
              serverRequest,
              undefined
            ];
          var promise = $q.when(config);
          forEach(reversedInterceptors, function (interceptor) {
            if (interceptor.request || interceptor.requestError) {
              chain.unshift(interceptor.request, interceptor.requestError);
            }
            if (interceptor.response || interceptor.responseError) {
              chain.push(interceptor.response, interceptor.responseError);
            }
          });
          while (chain.length) {
            var thenFn = chain.shift();
            var rejectFn = chain.shift();
            promise = promise.then(thenFn, rejectFn);
          }
          promise.success = function (fn) {
            promise.then(function (response) {
              fn(response.data, response.status, response.headers, config);
            });
            return promise;
          };
          promise.error = function (fn) {
            promise.then(null, function (response) {
              fn(response.data, response.status, response.headers, config);
            });
            return promise;
          };
          return promise;
          function transformResponse(response) {
            var resp = extend({}, response, { data: transformData(response.data, response.headers, config.transformResponse) });
            return isSuccess(response.status) ? resp : $q.reject(resp);
          }
          function mergeHeaders(config) {
            var defHeaders = defaults.headers, reqHeaders = extend({}, config.headers), defHeaderName, lowercaseDefHeaderName, reqHeaderName;
            defHeaders = extend({}, defHeaders.common, defHeaders[lowercase(config.method)]);
            execHeaders(defHeaders);
            execHeaders(reqHeaders);
            defaultHeadersIteration:
              for (defHeaderName in defHeaders) {
                lowercaseDefHeaderName = lowercase(defHeaderName);
                for (reqHeaderName in reqHeaders) {
                  if (lowercase(reqHeaderName) === lowercaseDefHeaderName) {
                    continue defaultHeadersIteration;
                  }
                }
                reqHeaders[defHeaderName] = defHeaders[defHeaderName];
              }
            return reqHeaders;
            function execHeaders(headers) {
              var headerContent;
              forEach(headers, function (headerFn, header) {
                if (isFunction(headerFn)) {
                  headerContent = headerFn();
                  if (headerContent != null) {
                    headers[header] = headerContent;
                  } else {
                    delete headers[header];
                  }
                }
              });
            }
          }
        }
        $http.pendingRequests = [];
        createShortMethods('get', 'delete', 'head', 'jsonp');
        createShortMethodsWithData('post', 'put');
        $http.defaults = defaults;
        return $http;
        function createShortMethods(names) {
          forEach(arguments, function (name) {
            $http[name] = function (url, config) {
              return $http(extend(config || {}, {
                method: name,
                url: url
              }));
            };
          });
        }
        function createShortMethodsWithData(name) {
          forEach(arguments, function (name) {
            $http[name] = function (url, data, config) {
              return $http(extend(config || {}, {
                method: name,
                url: url,
                data: data
              }));
            };
          });
        }
        function sendReq(config, reqData, reqHeaders) {
          var deferred = $q.defer(), promise = deferred.promise, cache, cachedResp, url = buildUrl(config.url, config.params);
          $http.pendingRequests.push(config);
          promise.then(removePendingReq, removePendingReq);
          if ((config.cache || defaults.cache) && config.cache !== false && config.method == 'GET') {
            cache = isObject(config.cache) ? config.cache : isObject(defaults.cache) ? defaults.cache : defaultCache;
          }
          if (cache) {
            cachedResp = cache.get(url);
            if (isDefined(cachedResp)) {
              if (cachedResp.then) {
                cachedResp.then(removePendingReq, removePendingReq);
                return cachedResp;
              } else {
                if (isArray(cachedResp)) {
                  resolvePromise(cachedResp[1], cachedResp[0], copy(cachedResp[2]));
                } else {
                  resolvePromise(cachedResp, 200, {});
                }
              }
            } else {
              cache.put(url, promise);
            }
          }
          if (isUndefined(cachedResp)) {
            $httpBackend(config.method, url, reqData, done, reqHeaders, config.timeout, config.withCredentials, config.responseType);
          }
          return promise;
          function done(status, response, headersString) {
            if (cache) {
              if (isSuccess(status)) {
                cache.put(url, [
                  status,
                  response,
                  parseHeaders(headersString)
                ]);
              } else {
                cache.remove(url);
              }
            }
            resolvePromise(response, status, headersString);
            if (!$rootScope.$$phase)
              $rootScope.$apply();
          }
          function resolvePromise(response, status, headers) {
            status = Math.max(status, 0);
            (isSuccess(status) ? deferred.resolve : deferred.reject)({
              data: response,
              status: status,
              headers: headersGetter(headers),
              config: config
            });
          }
          function removePendingReq() {
            var idx = indexOf($http.pendingRequests, config);
            if (idx !== -1)
              $http.pendingRequests.splice(idx, 1);
          }
        }
        function buildUrl(url, params) {
          if (!params)
            return url;
          var parts = [];
          forEachSorted(params, function (value, key) {
            if (value === null || isUndefined(value))
              return;
            if (!isArray(value))
              value = [value];
            forEach(value, function (v) {
              if (isObject(v)) {
                v = toJson(v);
              }
              parts.push(encodeUriQuery(key) + '=' + encodeUriQuery(v));
            });
          });
          return url + (url.indexOf('?') == -1 ? '?' : '&') + parts.join('&');
        }
      }
    ];
  }
  function createXhr(method) {
    return msie <= 8 && lowercase(method) === 'patch' ? new ActiveXObject('Microsoft.XMLHTTP') : new window.XMLHttpRequest();
  }
  function $HttpBackendProvider() {
    this.$get = [
      '$browser',
      '$window',
      '$document',
      function ($browser, $window, $document) {
        return createHttpBackend($browser, createXhr, $browser.defer, $window.angular.callbacks, $document[0]);
      }
    ];
  }
  function createHttpBackend($browser, createXhr, $browserDefer, callbacks, rawDocument) {
    var ABORTED = -1;
    return function (method, url, post, callback, headers, timeout, withCredentials, responseType) {
      var status;
      $browser.$$incOutstandingRequestCount();
      url = url || $browser.url();
      if (lowercase(method) == 'jsonp') {
        var callbackId = '_' + (callbacks.counter++).toString(36);
        callbacks[callbackId] = function (data) {
          callbacks[callbackId].data = data;
        };
        var jsonpDone = jsonpReq(url.replace('JSON_CALLBACK', 'angular.callbacks.' + callbackId), function () {
            if (callbacks[callbackId].data) {
              completeRequest(callback, 200, callbacks[callbackId].data);
            } else {
              completeRequest(callback, status || -2);
            }
            callbacks[callbackId] = angular.noop;
          });
      } else {
        var xhr = createXhr(method);
        xhr.open(method, url, true);
        forEach(headers, function (value, key) {
          if (isDefined(value)) {
            xhr.setRequestHeader(key, value);
          }
        });
        xhr.onreadystatechange = function () {
          if (xhr && xhr.readyState == 4) {
            var responseHeaders = null, response = null;
            if (status !== ABORTED) {
              responseHeaders = xhr.getAllResponseHeaders();
              response = 'response' in xhr ? xhr.response : xhr.responseText;
            }
            completeRequest(callback, status || xhr.status, response, responseHeaders);
          }
        };
        if (withCredentials) {
          xhr.withCredentials = true;
        }
        if (responseType) {
          xhr.responseType = responseType;
        }
        xhr.send(post || null);
      }
      if (timeout > 0) {
        var timeoutId = $browserDefer(timeoutRequest, timeout);
      } else if (timeout && timeout.then) {
        timeout.then(timeoutRequest);
      }
      function timeoutRequest() {
        status = ABORTED;
        jsonpDone && jsonpDone();
        xhr && xhr.abort();
      }
      function completeRequest(callback, status, response, headersString) {
        timeoutId && $browserDefer.cancel(timeoutId);
        jsonpDone = xhr = null;
        status = status === 0 ? response ? 200 : 404 : status;
        status = status == 1223 ? 204 : status;
        callback(status, response, headersString);
        $browser.$$completeOutstandingRequest(noop);
      }
    };
    function jsonpReq(url, done) {
      var script = rawDocument.createElement('script'), doneWrapper = function () {
          script.onreadystatechange = script.onload = script.onerror = null;
          rawDocument.body.removeChild(script);
          if (done)
            done();
        };
      script.type = 'text/javascript';
      script.src = url;
      if (msie && msie <= 8) {
        script.onreadystatechange = function () {
          if (/loaded|complete/.test(script.readyState)) {
            doneWrapper();
          }
        };
      } else {
        script.onload = script.onerror = function () {
          doneWrapper();
        };
      }
      rawDocument.body.appendChild(script);
      return doneWrapper;
    }
  }
  var $interpolateMinErr = minErr('$interpolate');
  function $InterpolateProvider() {
    var startSymbol = '{{';
    var endSymbol = '}}';
    this.startSymbol = function (value) {
      if (value) {
        startSymbol = value;
        return this;
      } else {
        return startSymbol;
      }
    };
    this.endSymbol = function (value) {
      if (value) {
        endSymbol = value;
        return this;
      } else {
        return endSymbol;
      }
    };
    this.$get = [
      '$parse',
      '$exceptionHandler',
      '$sce',
      function ($parse, $exceptionHandler, $sce) {
        var startSymbolLength = startSymbol.length, endSymbolLength = endSymbol.length;
        function $interpolate(text, mustHaveExpression, trustedContext) {
          var startIndex, endIndex, index = 0, parts = [], length = text.length, hasInterpolation = false, fn, exp, concat = [];
          while (index < length) {
            if ((startIndex = text.indexOf(startSymbol, index)) != -1 && (endIndex = text.indexOf(endSymbol, startIndex + startSymbolLength)) != -1) {
              index != startIndex && parts.push(text.substring(index, startIndex));
              parts.push(fn = $parse(exp = text.substring(startIndex + startSymbolLength, endIndex)));
              fn.exp = exp;
              index = endIndex + endSymbolLength;
              hasInterpolation = true;
            } else {
              index != length && parts.push(text.substring(index));
              index = length;
            }
          }
          if (!(length = parts.length)) {
            parts.push('');
            length = 1;
          }
          if (trustedContext && parts.length > 1) {
            throw $interpolateMinErr('noconcat', 'Error while interpolating: {0}\nStrict Contextual Escaping disallows ' + 'interpolations that concatenate multiple expressions when a trusted value is ' + 'required.  See http://docs.angularjs.org/api/ng.$sce', text);
          }
          if (!mustHaveExpression || hasInterpolation) {
            concat.length = length;
            fn = function (context) {
              try {
                for (var i = 0, ii = length, part; i < ii; i++) {
                  if (typeof (part = parts[i]) == 'function') {
                    part = part(context);
                    if (trustedContext) {
                      part = $sce.getTrusted(trustedContext, part);
                    } else {
                      part = $sce.valueOf(part);
                    }
                    if (part === null || isUndefined(part)) {
                      part = '';
                    } else if (typeof part != 'string') {
                      part = toJson(part);
                    }
                  }
                  concat[i] = part;
                }
                return concat.join('');
              } catch (err) {
                var newErr = $interpolateMinErr('interr', 'Can\'t interpolate: {0}\n{1}', text, err.toString());
                $exceptionHandler(newErr);
              }
            };
            fn.exp = text;
            fn.parts = parts;
            return fn;
          }
        }
        $interpolate.startSymbol = function () {
          return startSymbol;
        };
        $interpolate.endSymbol = function () {
          return endSymbol;
        };
        return $interpolate;
      }
    ];
  }
  function $IntervalProvider() {
    this.$get = [
      '$rootScope',
      '$window',
      '$q',
      function ($rootScope, $window, $q) {
        var intervals = {};
        function interval(fn, delay, count, invokeApply) {
          var setInterval = $window.setInterval, clearInterval = $window.clearInterval, deferred = $q.defer(), promise = deferred.promise, iteration = 0, skipApply = isDefined(invokeApply) && !invokeApply;
          count = isDefined(count) ? count : 0;
          promise.then(null, null, fn);
          promise.$$intervalId = setInterval(function tick() {
            deferred.notify(iteration++);
            if (count > 0 && iteration >= count) {
              deferred.resolve(iteration);
              clearInterval(promise.$$intervalId);
              delete intervals[promise.$$intervalId];
            }
            if (!skipApply)
              $rootScope.$apply();
          }, delay);
          intervals[promise.$$intervalId] = deferred;
          return promise;
        }
        interval.cancel = function (promise) {
          if (promise && promise.$$intervalId in intervals) {
            intervals[promise.$$intervalId].reject('canceled');
            clearInterval(promise.$$intervalId);
            delete intervals[promise.$$intervalId];
            return true;
          }
          return false;
        };
        return interval;
      }
    ];
  }
  function $LocaleProvider() {
    this.$get = function () {
      return {
        id: 'en-us',
        NUMBER_FORMATS: {
          DECIMAL_SEP: '.',
          GROUP_SEP: ',',
          PATTERNS: [
            {
              minInt: 1,
              minFrac: 0,
              maxFrac: 3,
              posPre: '',
              posSuf: '',
              negPre: '-',
              negSuf: '',
              gSize: 3,
              lgSize: 3
            },
            {
              minInt: 1,
              minFrac: 2,
              maxFrac: 2,
              posPre: '\xa4',
              posSuf: '',
              negPre: '(\xa4',
              negSuf: ')',
              gSize: 3,
              lgSize: 3
            }
          ],
          CURRENCY_SYM: '$'
        },
        DATETIME_FORMATS: {
          MONTH: 'January,February,March,April,May,June,July,August,September,October,November,December'.split(','),
          SHORTMONTH: 'Jan,Feb,Mar,Apr,May,Jun,Jul,Aug,Sep,Oct,Nov,Dec'.split(','),
          DAY: 'Sunday,Monday,Tuesday,Wednesday,Thursday,Friday,Saturday'.split(','),
          SHORTDAY: 'Sun,Mon,Tue,Wed,Thu,Fri,Sat'.split(','),
          AMPMS: [
            'AM',
            'PM'
          ],
          medium: 'MMM d, y h:mm:ss a',
          short: 'M/d/yy h:mm a',
          fullDate: 'EEEE, MMMM d, y',
          longDate: 'MMMM d, y',
          mediumDate: 'MMM d, y',
          shortDate: 'M/d/yy',
          mediumTime: 'h:mm:ss a',
          shortTime: 'h:mm a'
        },
        pluralCat: function (num) {
          if (num === 1) {
            return 'one';
          }
          return 'other';
        }
      };
    };
  }
  var PATH_MATCH = /^([^\?#]*)(\?([^#]*))?(#(.*))?$/, DEFAULT_PORTS = {
      'http': 80,
      'https': 443,
      'ftp': 21
    };
  var $locationMinErr = minErr('$location');
  function encodePath(path) {
    var segments = path.split('/'), i = segments.length;
    while (i--) {
      segments[i] = encodeUriSegment(segments[i]);
    }
    return segments.join('/');
  }
  function parseAbsoluteUrl(absoluteUrl, locationObj, appBase) {
    var parsedUrl = urlResolve(absoluteUrl, appBase);
    locationObj.$$protocol = parsedUrl.protocol;
    locationObj.$$host = parsedUrl.hostname;
    locationObj.$$port = int(parsedUrl.port) || DEFAULT_PORTS[parsedUrl.protocol] || null;
  }
  function parseAppUrl(relativeUrl, locationObj, appBase) {
    var prefixed = relativeUrl.charAt(0) !== '/';
    if (prefixed) {
      relativeUrl = '/' + relativeUrl;
    }
    var match = urlResolve(relativeUrl, appBase);
    locationObj.$$path = decodeURIComponent(prefixed && match.pathname.charAt(0) === '/' ? match.pathname.substring(1) : match.pathname);
    locationObj.$$search = parseKeyValue(match.search);
    locationObj.$$hash = decodeURIComponent(match.hash);
    if (locationObj.$$path && locationObj.$$path.charAt(0) != '/') {
      locationObj.$$path = '/' + locationObj.$$path;
    }
  }
  function beginsWith(begin, whole) {
    if (whole.indexOf(begin) === 0) {
      return whole.substr(begin.length);
    }
  }
  function stripHash(url) {
    var index = url.indexOf('#');
    return index == -1 ? url : url.substr(0, index);
  }
  function stripFile(url) {
    return url.substr(0, stripHash(url).lastIndexOf('/') + 1);
  }
  function serverBase(url) {
    return url.substring(0, url.indexOf('/', url.indexOf('//') + 2));
  }
  function LocationHtml5Url(appBase, basePrefix) {
    this.$$html5 = true;
    basePrefix = basePrefix || '';
    var appBaseNoFile = stripFile(appBase);
    parseAbsoluteUrl(appBase, this, appBase);
    this.$$parse = function (url) {
      var pathUrl = beginsWith(appBaseNoFile, url);
      if (!isString(pathUrl)) {
        throw $locationMinErr('ipthprfx', 'Invalid url "{0}", missing path prefix "{1}".', url, appBaseNoFile);
      }
      parseAppUrl(pathUrl, this, appBase);
      if (!this.$$path) {
        this.$$path = '/';
      }
      this.$$compose();
    };
    this.$$compose = function () {
      var search = toKeyValue(this.$$search), hash = this.$$hash ? '#' + encodeUriSegment(this.$$hash) : '';
      this.$$url = encodePath(this.$$path) + (search ? '?' + search : '') + hash;
      this.$$absUrl = appBaseNoFile + this.$$url.substr(1);
    };
    this.$$rewrite = function (url) {
      var appUrl, prevAppUrl;
      if ((appUrl = beginsWith(appBase, url)) !== undefined) {
        prevAppUrl = appUrl;
        if ((appUrl = beginsWith(basePrefix, appUrl)) !== undefined) {
          return appBaseNoFile + (beginsWith('/', appUrl) || appUrl);
        } else {
          return appBase + prevAppUrl;
        }
      } else if ((appUrl = beginsWith(appBaseNoFile, url)) !== undefined) {
        return appBaseNoFile + appUrl;
      } else if (appBaseNoFile == url + '/') {
        return appBaseNoFile;
      }
    };
  }
  function LocationHashbangUrl(appBase, hashPrefix) {
    var appBaseNoFile = stripFile(appBase);
    parseAbsoluteUrl(appBase, this, appBase);
    this.$$parse = function (url) {
      var withoutBaseUrl = beginsWith(appBase, url) || beginsWith(appBaseNoFile, url);
      var withoutHashUrl = withoutBaseUrl.charAt(0) == '#' ? beginsWith(hashPrefix, withoutBaseUrl) : this.$$html5 ? withoutBaseUrl : '';
      if (!isString(withoutHashUrl)) {
        throw $locationMinErr('ihshprfx', 'Invalid url "{0}", missing hash prefix "{1}".', url, hashPrefix);
      }
      parseAppUrl(withoutHashUrl, this, appBase);
      this.$$path = removeWindowsDriveName(this.$$path, withoutHashUrl, appBase);
      this.$$compose();
      function removeWindowsDriveName(path, url, base) {
        var windowsFilePathExp = /^\/?.*?:(\/.*)/;
        var firstPathSegmentMatch;
        if (url.indexOf(base) === 0) {
          url = url.replace(base, '');
        }
        if (windowsFilePathExp.exec(url)) {
          return path;
        }
        firstPathSegmentMatch = windowsFilePathExp.exec(path);
        return firstPathSegmentMatch ? firstPathSegmentMatch[1] : path;
      }
    };
    this.$$compose = function () {
      var search = toKeyValue(this.$$search), hash = this.$$hash ? '#' + encodeUriSegment(this.$$hash) : '';
      this.$$url = encodePath(this.$$path) + (search ? '?' + search : '') + hash;
      this.$$absUrl = appBase + (this.$$url ? hashPrefix + this.$$url : '');
    };
    this.$$rewrite = function (url) {
      if (stripHash(appBase) == stripHash(url)) {
        return url;
      }
    };
  }
  function LocationHashbangInHtml5Url(appBase, hashPrefix) {
    this.$$html5 = true;
    LocationHashbangUrl.apply(this, arguments);
    var appBaseNoFile = stripFile(appBase);
    this.$$rewrite = function (url) {
      var appUrl;
      if (appBase == stripHash(url)) {
        return url;
      } else if (appUrl = beginsWith(appBaseNoFile, url)) {
        return appBase + hashPrefix + appUrl;
      } else if (appBaseNoFile === url + '/') {
        return appBaseNoFile;
      }
    };
  }
  LocationHashbangInHtml5Url.prototype = LocationHashbangUrl.prototype = LocationHtml5Url.prototype = {
    $$html5: false,
    $$replace: false,
    absUrl: locationGetter('$$absUrl'),
    url: function (url, replace) {
      if (isUndefined(url))
        return this.$$url;
      var match = PATH_MATCH.exec(url);
      if (match[1])
        this.path(decodeURIComponent(match[1]));
      if (match[2] || match[1])
        this.search(match[3] || '');
      this.hash(match[5] || '', replace);
      return this;
    },
    protocol: locationGetter('$$protocol'),
    host: locationGetter('$$host'),
    port: locationGetter('$$port'),
    path: locationGetterSetter('$$path', function (path) {
      return path.charAt(0) == '/' ? path : '/' + path;
    }),
    search: function (search, paramValue) {
      switch (arguments.length) {
      case 0:
        return this.$$search;
      case 1:
        if (isString(search)) {
          this.$$search = parseKeyValue(search);
        } else if (isObject(search)) {
          this.$$search = search;
        } else {
          throw $locationMinErr('isrcharg', 'The first argument of the `$location#search()` call must be a string or an object.');
        }
        break;
      default:
        if (isUndefined(paramValue) || paramValue === null) {
          delete this.$$search[search];
        } else {
          this.$$search[search] = paramValue;
        }
      }
      this.$$compose();
      return this;
    },
    hash: locationGetterSetter('$$hash', identity),
    replace: function () {
      this.$$replace = true;
      return this;
    }
  };
  function locationGetter(property) {
    return function () {
      return this[property];
    };
  }
  function locationGetterSetter(property, preprocess) {
    return function (value) {
      if (isUndefined(value))
        return this[property];
      this[property] = preprocess(value);
      this.$$compose();
      return this;
    };
  }
  function $LocationProvider() {
    var hashPrefix = '', html5Mode = false;
    this.hashPrefix = function (prefix) {
      if (isDefined(prefix)) {
        hashPrefix = prefix;
        return this;
      } else {
        return hashPrefix;
      }
    };
    this.html5Mode = function (mode) {
      if (isDefined(mode)) {
        html5Mode = mode;
        return this;
      } else {
        return html5Mode;
      }
    };
    this.$get = [
      '$rootScope',
      '$browser',
      '$sniffer',
      '$rootElement',
      function ($rootScope, $browser, $sniffer, $rootElement) {
        var $location, LocationMode, baseHref = $browser.baseHref(), initialUrl = $browser.url(), appBase;
        if (html5Mode) {
          appBase = serverBase(initialUrl) + (baseHref || '/');
          LocationMode = $sniffer.history ? LocationHtml5Url : LocationHashbangInHtml5Url;
        } else {
          appBase = stripHash(initialUrl);
          LocationMode = LocationHashbangUrl;
        }
        $location = new LocationMode(appBase, '#' + hashPrefix);
        $location.$$parse($location.$$rewrite(initialUrl));
        $rootElement.on('click', function (event) {
          if (event.ctrlKey || event.metaKey || event.which == 2)
            return;
          var elm = jqLite(event.target);
          while (lowercase(elm[0].nodeName) !== 'a') {
            if (elm[0] === $rootElement[0] || !(elm = elm.parent())[0])
              return;
          }
          var absHref = elm.prop('href');
          if (isObject(absHref) && absHref.toString() === '[object SVGAnimatedString]') {
            absHref = urlResolve(absHref.animVal).href;
          }
          var rewrittenUrl = $location.$$rewrite(absHref);
          if (absHref && !elm.attr('target') && rewrittenUrl && !event.isDefaultPrevented()) {
            event.preventDefault();
            if (rewrittenUrl != $browser.url()) {
              $location.$$parse(rewrittenUrl);
              $rootScope.$apply();
              window.angular['ff-684208-preventDefault'] = true;
            }
          }
        });
        if ($location.absUrl() != initialUrl) {
          $browser.url($location.absUrl(), true);
        }
        $browser.onUrlChange(function (newUrl) {
          if ($location.absUrl() != newUrl) {
            $rootScope.$evalAsync(function () {
              var oldUrl = $location.absUrl();
              $location.$$parse(newUrl);
              if ($rootScope.$broadcast('$locationChangeStart', newUrl, oldUrl).defaultPrevented) {
                $location.$$parse(oldUrl);
                $browser.url(oldUrl);
              } else {
                afterLocationChange(oldUrl);
              }
            });
            if (!$rootScope.$$phase)
              $rootScope.$digest();
          }
        });
        var changeCounter = 0;
        $rootScope.$watch(function $locationWatch() {
          var oldUrl = $browser.url();
          var currentReplace = $location.$$replace;
          if (!changeCounter || oldUrl != $location.absUrl()) {
            changeCounter++;
            $rootScope.$evalAsync(function () {
              if ($rootScope.$broadcast('$locationChangeStart', $location.absUrl(), oldUrl).defaultPrevented) {
                $location.$$parse(oldUrl);
              } else {
                $browser.url($location.absUrl(), currentReplace);
                afterLocationChange(oldUrl);
              }
            });
          }
          $location.$$replace = false;
          return changeCounter;
        });
        return $location;
        function afterLocationChange(oldUrl) {
          $rootScope.$broadcast('$locationChangeSuccess', $location.absUrl(), oldUrl);
        }
      }
    ];
  }
  function $LogProvider() {
    var debug = true, self = this;
    this.debugEnabled = function (flag) {
      if (isDefined(flag)) {
        debug = flag;
        return this;
      } else {
        return debug;
      }
    };
    this.$get = [
      '$window',
      function ($window) {
        return {
          log: consoleLog('log'),
          info: consoleLog('info'),
          warn: consoleLog('warn'),
          error: consoleLog('error'),
          debug: function () {
            var fn = consoleLog('debug');
            return function () {
              if (debug) {
                fn.apply(self, arguments);
              }
            };
          }()
        };
        function formatError(arg) {
          if (arg instanceof Error) {
            if (arg.stack) {
              arg = arg.message && arg.stack.indexOf(arg.message) === -1 ? 'Error: ' + arg.message + '\n' + arg.stack : arg.stack;
            } else if (arg.sourceURL) {
              arg = arg.message + '\n' + arg.sourceURL + ':' + arg.line;
            }
          }
          return arg;
        }
        function consoleLog(type) {
          var console = $window.console || {}, logFn = console[type] || console.log || noop, hasApply = false;
          try {
            hasApply = !!logFn.apply;
          } catch (e) {
          }
          if (hasApply) {
            return function () {
              var args = [];
              forEach(arguments, function (arg) {
                args.push(formatError(arg));
              });
              return logFn.apply(console, args);
            };
          }
          return function (arg1, arg2) {
            logFn(arg1, arg2 == null ? '' : arg2);
          };
        }
      }
    ];
  }
  var $parseMinErr = minErr('$parse');
  var promiseWarningCache = {};
  var promiseWarning;
  function ensureSafeMemberName(name, fullExpression) {
    if (name === 'constructor') {
      throw $parseMinErr('isecfld', 'Referencing "constructor" field in Angular expressions is disallowed! Expression: {0}', fullExpression);
    }
    return name;
  }
  function ensureSafeObject(obj, fullExpression) {
    if (obj) {
      if (obj.constructor === obj) {
        throw $parseMinErr('isecfn', 'Referencing Function in Angular expressions is disallowed! Expression: {0}', fullExpression);
      } else if (obj.document && obj.location && obj.alert && obj.setInterval) {
        throw $parseMinErr('isecwindow', 'Referencing the Window in Angular expressions is disallowed! Expression: {0}', fullExpression);
      } else if (obj.children && (obj.nodeName || obj.on && obj.find)) {
        throw $parseMinErr('isecdom', 'Referencing DOM nodes in Angular expressions is disallowed! Expression: {0}', fullExpression);
      }
    }
    return obj;
  }
  var OPERATORS = {
      'null': function () {
        return null;
      },
      'true': function () {
        return true;
      },
      'false': function () {
        return false;
      },
      undefined: noop,
      '+': function (self, locals, a, b) {
        a = a(self, locals);
        b = b(self, locals);
        if (isDefined(a)) {
          if (isDefined(b)) {
            return a + b;
          }
          return a;
        }
        return isDefined(b) ? b : undefined;
      },
      '-': function (self, locals, a, b) {
        a = a(self, locals);
        b = b(self, locals);
        return (isDefined(a) ? a : 0) - (isDefined(b) ? b : 0);
      },
      '*': function (self, locals, a, b) {
        return a(self, locals) * b(self, locals);
      },
      '/': function (self, locals, a, b) {
        return a(self, locals) / b(self, locals);
      },
      '%': function (self, locals, a, b) {
        return a(self, locals) % b(self, locals);
      },
      '^': function (self, locals, a, b) {
        return a(self, locals) ^ b(self, locals);
      },
      '=': noop,
      '===': function (self, locals, a, b) {
        return a(self, locals) === b(self, locals);
      },
      '!==': function (self, locals, a, b) {
        return a(self, locals) !== b(self, locals);
      },
      '==': function (self, locals, a, b) {
        return a(self, locals) == b(self, locals);
      },
      '!=': function (self, locals, a, b) {
        return a(self, locals) != b(self, locals);
      },
      '<': function (self, locals, a, b) {
        return a(self, locals) < b(self, locals);
      },
      '>': function (self, locals, a, b) {
        return a(self, locals) > b(self, locals);
      },
      '<=': function (self, locals, a, b) {
        return a(self, locals) <= b(self, locals);
      },
      '>=': function (self, locals, a, b) {
        return a(self, locals) >= b(self, locals);
      },
      '&&': function (self, locals, a, b) {
        return a(self, locals) && b(self, locals);
      },
      '||': function (self, locals, a, b) {
        return a(self, locals) || b(self, locals);
      },
      '&': function (self, locals, a, b) {
        return a(self, locals) & b(self, locals);
      },
      '|': function (self, locals, a, b) {
        return b(self, locals)(self, locals, a(self, locals));
      },
      '!': function (self, locals, a) {
        return !a(self, locals);
      }
    };
  var ESCAPE = {
      'n': '\n',
      'f': '\f',
      'r': '\r',
      't': '\t',
      'v': '\x0B',
      '\'': '\'',
      '"': '"'
    };
  var Lexer = function (options) {
    this.options = options;
  };
  Lexer.prototype = {
    constructor: Lexer,
    lex: function (text) {
      this.text = text;
      this.index = 0;
      this.ch = undefined;
      this.lastCh = ':';
      this.tokens = [];
      var token;
      var json = [];
      while (this.index < this.text.length) {
        this.ch = this.text.charAt(this.index);
        if (this.is('"\'')) {
          this.readString(this.ch);
        } else if (this.isNumber(this.ch) || this.is('.') && this.isNumber(this.peek())) {
          this.readNumber();
        } else if (this.isIdent(this.ch)) {
          this.readIdent();
          if (this.was('{,') && json[0] === '{' && (token = this.tokens[this.tokens.length - 1])) {
            token.json = token.text.indexOf('.') === -1;
          }
        } else if (this.is('(){}[].,;:?')) {
          this.tokens.push({
            index: this.index,
            text: this.ch,
            json: this.was(':[,') && this.is('{[') || this.is('}]:,')
          });
          if (this.is('{['))
            json.unshift(this.ch);
          if (this.is('}]'))
            json.shift();
          this.index++;
        } else if (this.isWhitespace(this.ch)) {
          this.index++;
          continue;
        } else {
          var ch2 = this.ch + this.peek();
          var ch3 = ch2 + this.peek(2);
          var fn = OPERATORS[this.ch];
          var fn2 = OPERATORS[ch2];
          var fn3 = OPERATORS[ch3];
          if (fn3) {
            this.tokens.push({
              index: this.index,
              text: ch3,
              fn: fn3
            });
            this.index += 3;
          } else if (fn2) {
            this.tokens.push({
              index: this.index,
              text: ch2,
              fn: fn2
            });
            this.index += 2;
          } else if (fn) {
            this.tokens.push({
              index: this.index,
              text: this.ch,
              fn: fn,
              json: this.was('[,:') && this.is('+-')
            });
            this.index += 1;
          } else {
            this.throwError('Unexpected next character ', this.index, this.index + 1);
          }
        }
        this.lastCh = this.ch;
      }
      return this.tokens;
    },
    is: function (chars) {
      return chars.indexOf(this.ch) !== -1;
    },
    was: function (chars) {
      return chars.indexOf(this.lastCh) !== -1;
    },
    peek: function (i) {
      var num = i || 1;
      return this.index + num < this.text.length ? this.text.charAt(this.index + num) : false;
    },
    isNumber: function (ch) {
      return '0' <= ch && ch <= '9';
    },
    isWhitespace: function (ch) {
      return ch === ' ' || ch === '\r' || ch === '\t' || ch === '\n' || ch === '\x0B' || ch === '\xa0';
    },
    isIdent: function (ch) {
      return 'a' <= ch && ch <= 'z' || 'A' <= ch && ch <= 'Z' || '_' === ch || ch === '$';
    },
    isExpOperator: function (ch) {
      return ch === '-' || ch === '+' || this.isNumber(ch);
    },
    throwError: function (error, start, end) {
      end = end || this.index;
      var colStr = isDefined(start) ? 's ' + start + '-' + this.index + ' [' + this.text.substring(start, end) + ']' : ' ' + end;
      throw $parseMinErr('lexerr', 'Lexer Error: {0} at column{1} in expression [{2}].', error, colStr, this.text);
    },
    readNumber: function () {
      var number = '';
      var start = this.index;
      while (this.index < this.text.length) {
        var ch = lowercase(this.text.charAt(this.index));
        if (ch == '.' || this.isNumber(ch)) {
          number += ch;
        } else {
          var peekCh = this.peek();
          if (ch == 'e' && this.isExpOperator(peekCh)) {
            number += ch;
          } else if (this.isExpOperator(ch) && peekCh && this.isNumber(peekCh) && number.charAt(number.length - 1) == 'e') {
            number += ch;
          } else if (this.isExpOperator(ch) && (!peekCh || !this.isNumber(peekCh)) && number.charAt(number.length - 1) == 'e') {
            this.throwError('Invalid exponent');
          } else {
            break;
          }
        }
        this.index++;
      }
      number = 1 * number;
      this.tokens.push({
        index: start,
        text: number,
        json: true,
        fn: function () {
          return number;
        }
      });
    },
    readIdent: function () {
      var parser = this;
      var ident = '';
      var start = this.index;
      var lastDot, peekIndex, methodName, ch;
      while (this.index < this.text.length) {
        ch = this.text.charAt(this.index);
        if (ch === '.' || this.isIdent(ch) || this.isNumber(ch)) {
          if (ch === '.')
            lastDot = this.index;
          ident += ch;
        } else {
          break;
        }
        this.index++;
      }
      if (lastDot) {
        peekIndex = this.index;
        while (peekIndex < this.text.length) {
          ch = this.text.charAt(peekIndex);
          if (ch === '(') {
            methodName = ident.substr(lastDot - start + 1);
            ident = ident.substr(0, lastDot - start);
            this.index = peekIndex;
            break;
          }
          if (this.isWhitespace(ch)) {
            peekIndex++;
          } else {
            break;
          }
        }
      }
      var token = {
          index: start,
          text: ident
        };
      if (OPERATORS.hasOwnProperty(ident)) {
        token.fn = OPERATORS[ident];
        token.json = OPERATORS[ident];
      } else {
        var getter = getterFn(ident, this.options, this.text);
        token.fn = extend(function (self, locals) {
          return getter(self, locals);
        }, {
          assign: function (self, value) {
            return setter(self, ident, value, parser.text, parser.options);
          }
        });
      }
      this.tokens.push(token);
      if (methodName) {
        this.tokens.push({
          index: lastDot,
          text: '.',
          json: false
        });
        this.tokens.push({
          index: lastDot + 1,
          text: methodName,
          json: false
        });
      }
    },
    readString: function (quote) {
      var start = this.index;
      this.index++;
      var string = '';
      var rawString = quote;
      var escape = false;
      while (this.index < this.text.length) {
        var ch = this.text.charAt(this.index);
        rawString += ch;
        if (escape) {
          if (ch === 'u') {
            var hex = this.text.substring(this.index + 1, this.index + 5);
            if (!hex.match(/[\da-f]{4}/i))
              this.throwError('Invalid unicode escape [\\u' + hex + ']');
            this.index += 4;
            string += String.fromCharCode(parseInt(hex, 16));
          } else {
            var rep = ESCAPE[ch];
            if (rep) {
              string += rep;
            } else {
              string += ch;
            }
          }
          escape = false;
        } else if (ch === '\\') {
          escape = true;
        } else if (ch === quote) {
          this.index++;
          this.tokens.push({
            index: start,
            text: rawString,
            string: string,
            json: true,
            fn: function () {
              return string;
            }
          });
          return;
        } else {
          string += ch;
        }
        this.index++;
      }
      this.throwError('Unterminated quote', start);
    }
  };
  var Parser = function (lexer, $filter, options) {
    this.lexer = lexer;
    this.$filter = $filter;
    this.options = options;
  };
  Parser.ZERO = function () {
    return 0;
  };
  Parser.prototype = {
    constructor: Parser,
    parse: function (text, json) {
      this.text = text;
      this.json = json;
      this.tokens = this.lexer.lex(text);
      if (json) {
        this.assignment = this.logicalOR;
        this.functionCall = this.fieldAccess = this.objectIndex = this.filterChain = function () {
          this.throwError('is not valid json', {
            text: text,
            index: 0
          });
        };
      }
      var value = json ? this.primary() : this.statements();
      if (this.tokens.length !== 0) {
        this.throwError('is an unexpected token', this.tokens[0]);
      }
      value.literal = !!value.literal;
      value.constant = !!value.constant;
      return value;
    },
    primary: function () {
      var primary;
      if (this.expect('(')) {
        primary = this.filterChain();
        this.consume(')');
      } else if (this.expect('[')) {
        primary = this.arrayDeclaration();
      } else if (this.expect('{')) {
        primary = this.object();
      } else {
        var token = this.expect();
        primary = token.fn;
        if (!primary) {
          this.throwError('not a primary expression', token);
        }
        if (token.json) {
          primary.constant = true;
          primary.literal = true;
        }
      }
      var next, context;
      while (next = this.expect('(', '[', '.')) {
        if (next.text === '(') {
          primary = this.functionCall(primary, context);
          context = null;
        } else if (next.text === '[') {
          context = primary;
          primary = this.objectIndex(primary);
        } else if (next.text === '.') {
          context = primary;
          primary = this.fieldAccess(primary);
        } else {
          this.throwError('IMPOSSIBLE');
        }
      }
      return primary;
    },
    throwError: function (msg, token) {
      throw $parseMinErr('syntax', 'Syntax Error: Token \'{0}\' {1} at column {2} of the expression [{3}] starting at [{4}].', token.text, msg, token.index + 1, this.text, this.text.substring(token.index));
    },
    peekToken: function () {
      if (this.tokens.length === 0)
        throw $parseMinErr('ueoe', 'Unexpected end of expression: {0}', this.text);
      return this.tokens[0];
    },
    peek: function (e1, e2, e3, e4) {
      if (this.tokens.length > 0) {
        var token = this.tokens[0];
        var t = token.text;
        if (t === e1 || t === e2 || t === e3 || t === e4 || !e1 && !e2 && !e3 && !e4) {
          return token;
        }
      }
      return false;
    },
    expect: function (e1, e2, e3, e4) {
      var token = this.peek(e1, e2, e3, e4);
      if (token) {
        if (this.json && !token.json) {
          this.throwError('is not valid json', token);
        }
        this.tokens.shift();
        return token;
      }
      return false;
    },
    consume: function (e1) {
      if (!this.expect(e1)) {
        this.throwError('is unexpected, expecting [' + e1 + ']', this.peek());
      }
    },
    unaryFn: function (fn, right) {
      return extend(function (self, locals) {
        return fn(self, locals, right);
      }, { constant: right.constant });
    },
    ternaryFn: function (left, middle, right) {
      return extend(function (self, locals) {
        return left(self, locals) ? middle(self, locals) : right(self, locals);
      }, { constant: left.constant && middle.constant && right.constant });
    },
    binaryFn: function (left, fn, right) {
      return extend(function (self, locals) {
        return fn(self, locals, left, right);
      }, { constant: left.constant && right.constant });
    },
    statements: function () {
      var statements = [];
      while (true) {
        if (this.tokens.length > 0 && !this.peek('}', ')', ';', ']'))
          statements.push(this.filterChain());
        if (!this.expect(';')) {
          return statements.length === 1 ? statements[0] : function (self, locals) {
            var value;
            for (var i = 0; i < statements.length; i++) {
              var statement = statements[i];
              if (statement) {
                value = statement(self, locals);
              }
            }
            return value;
          };
        }
      }
    },
    filterChain: function () {
      var left = this.expression();
      var token;
      while (true) {
        if (token = this.expect('|')) {
          left = this.binaryFn(left, token.fn, this.filter());
        } else {
          return left;
        }
      }
    },
    filter: function () {
      var token = this.expect();
      var fn = this.$filter(token.text);
      var argsFn = [];
      while (true) {
        if (token = this.expect(':')) {
          argsFn.push(this.expression());
        } else {
          var fnInvoke = function (self, locals, input) {
            var args = [input];
            for (var i = 0; i < argsFn.length; i++) {
              args.push(argsFn[i](self, locals));
            }
            return fn.apply(self, args);
          };
          return function () {
            return fnInvoke;
          };
        }
      }
    },
    expression: function () {
      return this.assignment();
    },
    assignment: function () {
      var left = this.ternary();
      var right;
      var token;
      if (token = this.expect('=')) {
        if (!left.assign) {
          this.throwError('implies assignment but [' + this.text.substring(0, token.index) + '] can not be assigned to', token);
        }
        right = this.ternary();
        return function (scope, locals) {
          return left.assign(scope, right(scope, locals), locals);
        };
      }
      return left;
    },
    ternary: function () {
      var left = this.logicalOR();
      var middle;
      var token;
      if (token = this.expect('?')) {
        middle = this.ternary();
        if (token = this.expect(':')) {
          return this.ternaryFn(left, middle, this.ternary());
        } else {
          this.throwError('expected :', token);
        }
      } else {
        return left;
      }
    },
    logicalOR: function () {
      var left = this.logicalAND();
      var token;
      while (true) {
        if (token = this.expect('||')) {
          left = this.binaryFn(left, token.fn, this.logicalAND());
        } else {
          return left;
        }
      }
    },
    logicalAND: function () {
      var left = this.equality();
      var token;
      if (token = this.expect('&&')) {
        left = this.binaryFn(left, token.fn, this.logicalAND());
      }
      return left;
    },
    equality: function () {
      var left = this.relational();
      var token;
      if (token = this.expect('==', '!=', '===', '!==')) {
        left = this.binaryFn(left, token.fn, this.equality());
      }
      return left;
    },
    relational: function () {
      var left = this.additive();
      var token;
      if (token = this.expect('<', '>', '<=', '>=')) {
        left = this.binaryFn(left, token.fn, this.relational());
      }
      return left;
    },
    additive: function () {
      var left = this.multiplicative();
      var token;
      while (token = this.expect('+', '-')) {
        left = this.binaryFn(left, token.fn, this.multiplicative());
      }
      return left;
    },
    multiplicative: function () {
      var left = this.unary();
      var token;
      while (token = this.expect('*', '/', '%')) {
        left = this.binaryFn(left, token.fn, this.unary());
      }
      return left;
    },
    unary: function () {
      var token;
      if (this.expect('+')) {
        return this.primary();
      } else if (token = this.expect('-')) {
        return this.binaryFn(Parser.ZERO, token.fn, this.unary());
      } else if (token = this.expect('!')) {
        return this.unaryFn(token.fn, this.unary());
      } else {
        return this.primary();
      }
    },
    fieldAccess: function (object) {
      var parser = this;
      var field = this.expect().text;
      var getter = getterFn(field, this.options, this.text);
      return extend(function (scope, locals, self) {
        return getter(self || object(scope, locals));
      }, {
        assign: function (scope, value, locals) {
          return setter(object(scope, locals), field, value, parser.text, parser.options);
        }
      });
    },
    objectIndex: function (obj) {
      var parser = this;
      var indexFn = this.expression();
      this.consume(']');
      return extend(function (self, locals) {
        var o = obj(self, locals), i = indexFn(self, locals), v, p;
        if (!o)
          return undefined;
        v = ensureSafeObject(o[i], parser.text);
        if (v && v.then && parser.options.unwrapPromises) {
          p = v;
          if (!('$$v' in v)) {
            p.$$v = undefined;
            p.then(function (val) {
              p.$$v = val;
            });
          }
          v = v.$$v;
        }
        return v;
      }, {
        assign: function (self, value, locals) {
          var key = indexFn(self, locals);
          var safe = ensureSafeObject(obj(self, locals), parser.text);
          return safe[key] = value;
        }
      });
    },
    functionCall: function (fn, contextGetter) {
      var argsFn = [];
      if (this.peekToken().text !== ')') {
        do {
          argsFn.push(this.expression());
        } while (this.expect(','));
      }
      this.consume(')');
      var parser = this;
      return function (scope, locals) {
        var args = [];
        var context = contextGetter ? contextGetter(scope, locals) : scope;
        for (var i = 0; i < argsFn.length; i++) {
          args.push(argsFn[i](scope, locals));
        }
        var fnPtr = fn(scope, locals, context) || noop;
        ensureSafeObject(context, parser.text);
        ensureSafeObject(fnPtr, parser.text);
        var v = fnPtr.apply ? fnPtr.apply(context, args) : fnPtr(args[0], args[1], args[2], args[3], args[4]);
        return ensureSafeObject(v, parser.text);
      };
    },
    arrayDeclaration: function () {
      var elementFns = [];
      var allConstant = true;
      if (this.peekToken().text !== ']') {
        do {
          var elementFn = this.expression();
          elementFns.push(elementFn);
          if (!elementFn.constant) {
            allConstant = false;
          }
        } while (this.expect(','));
      }
      this.consume(']');
      return extend(function (self, locals) {
        var array = [];
        for (var i = 0; i < elementFns.length; i++) {
          array.push(elementFns[i](self, locals));
        }
        return array;
      }, {
        literal: true,
        constant: allConstant
      });
    },
    object: function () {
      var keyValues = [];
      var allConstant = true;
      if (this.peekToken().text !== '}') {
        do {
          var token = this.expect(), key = token.string || token.text;
          this.consume(':');
          var value = this.expression();
          keyValues.push({
            key: key,
            value: value
          });
          if (!value.constant) {
            allConstant = false;
          }
        } while (this.expect(','));
      }
      this.consume('}');
      return extend(function (self, locals) {
        var object = {};
        for (var i = 0; i < keyValues.length; i++) {
          var keyValue = keyValues[i];
          object[keyValue.key] = keyValue.value(self, locals);
        }
        return object;
      }, {
        literal: true,
        constant: allConstant
      });
    }
  };
  function setter(obj, path, setValue, fullExp, options) {
    options = options || {};
    var element = path.split('.'), key;
    for (var i = 0; element.length > 1; i++) {
      key = ensureSafeMemberName(element.shift(), fullExp);
      var propertyObj = obj[key];
      if (!propertyObj) {
        propertyObj = {};
        obj[key] = propertyObj;
      }
      obj = propertyObj;
      if (obj.then && options.unwrapPromises) {
        promiseWarning(fullExp);
        if (!('$$v' in obj)) {
          (function (promise) {
            promise.then(function (val) {
              promise.$$v = val;
            });
          }(obj));
        }
        if (obj.$$v === undefined) {
          obj.$$v = {};
        }
        obj = obj.$$v;
      }
    }
    key = ensureSafeMemberName(element.shift(), fullExp);
    obj[key] = setValue;
    return setValue;
  }
  var getterFnCache = {};
  function cspSafeGetterFn(key0, key1, key2, key3, key4, fullExp, options) {
    ensureSafeMemberName(key0, fullExp);
    ensureSafeMemberName(key1, fullExp);
    ensureSafeMemberName(key2, fullExp);
    ensureSafeMemberName(key3, fullExp);
    ensureSafeMemberName(key4, fullExp);
    return !options.unwrapPromises ? function cspSafeGetter(scope, locals) {
      var pathVal = locals && locals.hasOwnProperty(key0) ? locals : scope;
      if (pathVal == null)
        return pathVal;
      pathVal = pathVal[key0];
      if (!key1)
        return pathVal;
      if (pathVal == null)
        return undefined;
      pathVal = pathVal[key1];
      if (!key2)
        return pathVal;
      if (pathVal == null)
        return undefined;
      pathVal = pathVal[key2];
      if (!key3)
        return pathVal;
      if (pathVal == null)
        return undefined;
      pathVal = pathVal[key3];
      if (!key4)
        return pathVal;
      if (pathVal == null)
        return undefined;
      pathVal = pathVal[key4];
      return pathVal;
    } : function cspSafePromiseEnabledGetter(scope, locals) {
      var pathVal = locals && locals.hasOwnProperty(key0) ? locals : scope, promise;
      if (pathVal == null)
        return pathVal;
      pathVal = pathVal[key0];
      if (pathVal && pathVal.then) {
        promiseWarning(fullExp);
        if (!('$$v' in pathVal)) {
          promise = pathVal;
          promise.$$v = undefined;
          promise.then(function (val) {
            promise.$$v = val;
          });
        }
        pathVal = pathVal.$$v;
      }
      if (!key1)
        return pathVal;
      if (pathVal == null)
        return undefined;
      pathVal = pathVal[key1];
      if (pathVal && pathVal.then) {
        promiseWarning(fullExp);
        if (!('$$v' in pathVal)) {
          promise = pathVal;
          promise.$$v = undefined;
          promise.then(function (val) {
            promise.$$v = val;
          });
        }
        pathVal = pathVal.$$v;
      }
      if (!key2)
        return pathVal;
      if (pathVal == null)
        return undefined;
      pathVal = pathVal[key2];
      if (pathVal && pathVal.then) {
        promiseWarning(fullExp);
        if (!('$$v' in pathVal)) {
          promise = pathVal;
          promise.$$v = undefined;
          promise.then(function (val) {
            promise.$$v = val;
          });
        }
        pathVal = pathVal.$$v;
      }
      if (!key3)
        return pathVal;
      if (pathVal == null)
        return undefined;
      pathVal = pathVal[key3];
      if (pathVal && pathVal.then) {
        promiseWarning(fullExp);
        if (!('$$v' in pathVal)) {
          promise = pathVal;
          promise.$$v = undefined;
          promise.then(function (val) {
            promise.$$v = val;
          });
        }
        pathVal = pathVal.$$v;
      }
      if (!key4)
        return pathVal;
      if (pathVal == null)
        return undefined;
      pathVal = pathVal[key4];
      if (pathVal && pathVal.then) {
        promiseWarning(fullExp);
        if (!('$$v' in pathVal)) {
          promise = pathVal;
          promise.$$v = undefined;
          promise.then(function (val) {
            promise.$$v = val;
          });
        }
        pathVal = pathVal.$$v;
      }
      return pathVal;
    };
  }
  function simpleGetterFn1(key0, fullExp) {
    ensureSafeMemberName(key0, fullExp);
    return function simpleGetterFn1(scope, locals) {
      if (scope == null)
        return undefined;
      return (locals && locals.hasOwnProperty(key0) ? locals : scope)[key0];
    };
  }
  function simpleGetterFn2(key0, key1, fullExp) {
    ensureSafeMemberName(key0, fullExp);
    ensureSafeMemberName(key1, fullExp);
    return function simpleGetterFn2(scope, locals) {
      if (scope == null)
        return undefined;
      scope = (locals && locals.hasOwnProperty(key0) ? locals : scope)[key0];
      return scope == null ? undefined : scope[key1];
    };
  }
  function getterFn(path, options, fullExp) {
    if (getterFnCache.hasOwnProperty(path)) {
      return getterFnCache[path];
    }
    var pathKeys = path.split('.'), pathKeysLength = pathKeys.length, fn;
    if (!options.unwrapPromises && pathKeysLength === 1) {
      fn = simpleGetterFn1(pathKeys[0], fullExp);
    } else if (!options.unwrapPromises && pathKeysLength === 2) {
      fn = simpleGetterFn2(pathKeys[0], pathKeys[1], fullExp);
    } else if (options.csp) {
      if (pathKeysLength < 6) {
        fn = cspSafeGetterFn(pathKeys[0], pathKeys[1], pathKeys[2], pathKeys[3], pathKeys[4], fullExp, options);
      } else {
        fn = function (scope, locals) {
          var i = 0, val;
          do {
            val = cspSafeGetterFn(pathKeys[i++], pathKeys[i++], pathKeys[i++], pathKeys[i++], pathKeys[i++], fullExp, options)(scope, locals);
            locals = undefined;
            scope = val;
          } while (i < pathKeysLength);
          return val;
        };
      }
    } else {
      var code = 'var p;\n';
      forEach(pathKeys, function (key, index) {
        ensureSafeMemberName(key, fullExp);
        code += 'if(s == null) return undefined;\n' + 's=' + (index ? 's' : '((k&&k.hasOwnProperty("' + key + '"))?k:s)') + '["' + key + '"]' + ';\n' + (options.unwrapPromises ? 'if (s && s.then) {\n' + ' pw("' + fullExp.replace(/(["\r\n])/g, '\\$1') + '");\n' + ' if (!("$$v" in s)) {\n' + ' p=s;\n' + ' p.$$v = undefined;\n' + ' p.then(function(v) {p.$$v=v;});\n' + '}\n' + ' s=s.$$v\n' + '}\n' : '');
      });
      code += 'return s;';
      var evaledFnGetter = new Function('s', 'k', 'pw', code);
      evaledFnGetter.toString = valueFn(code);
      fn = options.unwrapPromises ? function (scope, locals) {
        return evaledFnGetter(scope, locals, promiseWarning);
      } : evaledFnGetter;
    }
    if (path !== 'hasOwnProperty') {
      getterFnCache[path] = fn;
    }
    return fn;
  }
  function $ParseProvider() {
    var cache = {};
    var $parseOptions = {
        csp: false,
        unwrapPromises: false,
        logPromiseWarnings: true
      };
    this.unwrapPromises = function (value) {
      if (isDefined(value)) {
        $parseOptions.unwrapPromises = !!value;
        return this;
      } else {
        return $parseOptions.unwrapPromises;
      }
    };
    this.logPromiseWarnings = function (value) {
      if (isDefined(value)) {
        $parseOptions.logPromiseWarnings = value;
        return this;
      } else {
        return $parseOptions.logPromiseWarnings;
      }
    };
    this.$get = [
      '$filter',
      '$sniffer',
      '$log',
      function ($filter, $sniffer, $log) {
        $parseOptions.csp = $sniffer.csp;
        promiseWarning = function promiseWarningFn(fullExp) {
          if (!$parseOptions.logPromiseWarnings || promiseWarningCache.hasOwnProperty(fullExp))
            return;
          promiseWarningCache[fullExp] = true;
          $log.warn('[$parse] Promise found in the expression `' + fullExp + '`. ' + 'Automatic unwrapping of promises in Angular expressions is deprecated.');
        };
        return function (exp) {
          var parsedExpression;
          switch (typeof exp) {
          case 'string':
            if (cache.hasOwnProperty(exp)) {
              return cache[exp];
            }
            var lexer = new Lexer($parseOptions);
            var parser = new Parser(lexer, $filter, $parseOptions);
            parsedExpression = parser.parse(exp, false);
            if (exp !== 'hasOwnProperty') {
              cache[exp] = parsedExpression;
            }
            return parsedExpression;
          case 'function':
            return exp;
          default:
            return noop;
          }
        };
      }
    ];
  }
  function $QProvider() {
    this.$get = [
      '$rootScope',
      '$exceptionHandler',
      function ($rootScope, $exceptionHandler) {
        return qFactory(function (callback) {
          $rootScope.$evalAsync(callback);
        }, $exceptionHandler);
      }
    ];
  }
  function qFactory(nextTick, exceptionHandler) {
    var defer = function () {
      var pending = [], value, deferred;
      deferred = {
        resolve: function (val) {
          if (pending) {
            var callbacks = pending;
            pending = undefined;
            value = ref(val);
            if (callbacks.length) {
              nextTick(function () {
                var callback;
                for (var i = 0, ii = callbacks.length; i < ii; i++) {
                  callback = callbacks[i];
                  value.then(callback[0], callback[1], callback[2]);
                }
              });
            }
          }
        },
        reject: function (reason) {
          deferred.resolve(reject(reason));
        },
        notify: function (progress) {
          if (pending) {
            var callbacks = pending;
            if (pending.length) {
              nextTick(function () {
                var callback;
                for (var i = 0, ii = callbacks.length; i < ii; i++) {
                  callback = callbacks[i];
                  callback[2](progress);
                }
              });
            }
          }
        },
        promise: {
          then: function (callback, errback, progressback) {
            var result = defer();
            var wrappedCallback = function (value) {
              try {
                result.resolve((isFunction(callback) ? callback : defaultCallback)(value));
              } catch (e) {
                result.reject(e);
                exceptionHandler(e);
              }
            };
            var wrappedErrback = function (reason) {
              try {
                result.resolve((isFunction(errback) ? errback : defaultErrback)(reason));
              } catch (e) {
                result.reject(e);
                exceptionHandler(e);
              }
            };
            var wrappedProgressback = function (progress) {
              try {
                result.notify((isFunction(progressback) ? progressback : defaultCallback)(progress));
              } catch (e) {
                exceptionHandler(e);
              }
            };
            if (pending) {
              pending.push([
                wrappedCallback,
                wrappedErrback,
                wrappedProgressback
              ]);
            } else {
              value.then(wrappedCallback, wrappedErrback, wrappedProgressback);
            }
            return result.promise;
          },
          'catch': function (callback) {
            return this.then(null, callback);
          },
          'finally': function (callback) {
            function makePromise(value, resolved) {
              var result = defer();
              if (resolved) {
                result.resolve(value);
              } else {
                result.reject(value);
              }
              return result.promise;
            }
            function handleCallback(value, isResolved) {
              var callbackOutput = null;
              try {
                callbackOutput = (callback || defaultCallback)();
              } catch (e) {
                return makePromise(e, false);
              }
              if (callbackOutput && isFunction(callbackOutput.then)) {
                return callbackOutput.then(function () {
                  return makePromise(value, isResolved);
                }, function (error) {
                  return makePromise(error, false);
                });
              } else {
                return makePromise(value, isResolved);
              }
            }
            return this.then(function (value) {
              return handleCallback(value, true);
            }, function (error) {
              return handleCallback(error, false);
            });
          }
        }
      };
      return deferred;
    };
    var ref = function (value) {
      if (value && isFunction(value.then))
        return value;
      return {
        then: function (callback) {
          var result = defer();
          nextTick(function () {
            result.resolve(callback(value));
          });
          return result.promise;
        }
      };
    };
    var reject = function (reason) {
      return {
        then: function (callback, errback) {
          var result = defer();
          nextTick(function () {
            try {
              result.resolve((isFunction(errback) ? errback : defaultErrback)(reason));
            } catch (e) {
              result.reject(e);
              exceptionHandler(e);
            }
          });
          return result.promise;
        }
      };
    };
    var when = function (value, callback, errback, progressback) {
      var result = defer(), done;
      var wrappedCallback = function (value) {
        try {
          return (isFunction(callback) ? callback : defaultCallback)(value);
        } catch (e) {
          exceptionHandler(e);
          return reject(e);
        }
      };
      var wrappedErrback = function (reason) {
        try {
          return (isFunction(errback) ? errback : defaultErrback)(reason);
        } catch (e) {
          exceptionHandler(e);
          return reject(e);
        }
      };
      var wrappedProgressback = function (progress) {
        try {
          return (isFunction(progressback) ? progressback : defaultCallback)(progress);
        } catch (e) {
          exceptionHandler(e);
        }
      };
      nextTick(function () {
        ref(value).then(function (value) {
          if (done)
            return;
          done = true;
          result.resolve(ref(value).then(wrappedCallback, wrappedErrback, wrappedProgressback));
        }, function (reason) {
          if (done)
            return;
          done = true;
          result.resolve(wrappedErrback(reason));
        }, function (progress) {
          if (done)
            return;
          result.notify(wrappedProgressback(progress));
        });
      });
      return result.promise;
    };
    function defaultCallback(value) {
      return value;
    }
    function defaultErrback(reason) {
      return reject(reason);
    }
    function all(promises) {
      var deferred = defer(), counter = 0, results = isArray(promises) ? [] : {};
      forEach(promises, function (promise, key) {
        counter++;
        ref(promise).then(function (value) {
          if (results.hasOwnProperty(key))
            return;
          results[key] = value;
          if (!--counter)
            deferred.resolve(results);
        }, function (reason) {
          if (results.hasOwnProperty(key))
            return;
          deferred.reject(reason);
        });
      });
      if (counter === 0) {
        deferred.resolve(results);
      }
      return deferred.promise;
    }
    return {
      defer: defer,
      reject: reject,
      when: when,
      all: all
    };
  }
  function $RootScopeProvider() {
    var TTL = 10;
    var $rootScopeMinErr = minErr('$rootScope');
    var lastDirtyWatch = null;
    this.digestTtl = function (value) {
      if (arguments.length) {
        TTL = value;
      }
      return TTL;
    };
    this.$get = [
      '$injector',
      '$exceptionHandler',
      '$parse',
      '$browser',
      function ($injector, $exceptionHandler, $parse, $browser) {
        function Scope() {
          this.$id = nextUid();
          this.$$phase = this.$parent = this.$$watchers = this.$$nextSibling = this.$$prevSibling = this.$$childHead = this.$$childTail = null;
          this['this'] = this.$root = this;
          this.$$destroyed = false;
          this.$$asyncQueue = [];
          this.$$postDigestQueue = [];
          this.$$listeners = {};
          this.$$listenerCount = {};
          this.$$isolateBindings = {};
        }
        Scope.prototype = {
          constructor: Scope,
          $new: function (isolate) {
            var ChildScope, child;
            if (isolate) {
              child = new Scope();
              child.$root = this.$root;
              child.$$asyncQueue = this.$$asyncQueue;
              child.$$postDigestQueue = this.$$postDigestQueue;
            } else {
              ChildScope = function () {
              };
              ChildScope.prototype = this;
              child = new ChildScope();
              child.$id = nextUid();
            }
            child['this'] = child;
            child.$$listeners = {};
            child.$$listenerCount = {};
            child.$parent = this;
            child.$$watchers = child.$$nextSibling = child.$$childHead = child.$$childTail = null;
            child.$$prevSibling = this.$$childTail;
            if (this.$$childHead) {
              this.$$childTail.$$nextSibling = child;
              this.$$childTail = child;
            } else {
              this.$$childHead = this.$$childTail = child;
            }
            return child;
          },
          $watch: function (watchExp, listener, objectEquality) {
            var scope = this, get = compileToFn(watchExp, 'watch'), array = scope.$$watchers, watcher = {
                fn: listener,
                last: initWatchVal,
                get: get,
                exp: watchExp,
                eq: !!objectEquality
              };
            lastDirtyWatch = null;
            if (!isFunction(listener)) {
              var listenFn = compileToFn(listener || noop, 'listener');
              watcher.fn = function (newVal, oldVal, scope) {
                listenFn(scope);
              };
            }
            if (typeof watchExp == 'string' && get.constant) {
              var originalFn = watcher.fn;
              watcher.fn = function (newVal, oldVal, scope) {
                originalFn.call(this, newVal, oldVal, scope);
                arrayRemove(array, watcher);
              };
            }
            if (!array) {
              array = scope.$$watchers = [];
            }
            array.unshift(watcher);
            return function () {
              arrayRemove(array, watcher);
              lastDirtyWatch = null;
            };
          },
          $watchCollection: function (obj, listener) {
            var self = this;
            var oldValue;
            var newValue;
            var changeDetected = 0;
            var objGetter = $parse(obj);
            var internalArray = [];
            var internalObject = {};
            var oldLength = 0;
            function $watchCollectionWatch() {
              newValue = objGetter(self);
              var newLength, key;
              if (!isObject(newValue)) {
                if (oldValue !== newValue) {
                  oldValue = newValue;
                  changeDetected++;
                }
              } else if (isArrayLike(newValue)) {
                if (oldValue !== internalArray) {
                  oldValue = internalArray;
                  oldLength = oldValue.length = 0;
                  changeDetected++;
                }
                newLength = newValue.length;
                if (oldLength !== newLength) {
                  changeDetected++;
                  oldValue.length = oldLength = newLength;
                }
                for (var i = 0; i < newLength; i++) {
                  if (oldValue[i] !== newValue[i]) {
                    changeDetected++;
                    oldValue[i] = newValue[i];
                  }
                }
              } else {
                if (oldValue !== internalObject) {
                  oldValue = internalObject = {};
                  oldLength = 0;
                  changeDetected++;
                }
                newLength = 0;
                for (key in newValue) {
                  if (newValue.hasOwnProperty(key)) {
                    newLength++;
                    if (oldValue.hasOwnProperty(key)) {
                      if (oldValue[key] !== newValue[key]) {
                        changeDetected++;
                        oldValue[key] = newValue[key];
                      }
                    } else {
                      oldLength++;
                      oldValue[key] = newValue[key];
                      changeDetected++;
                    }
                  }
                }
                if (oldLength > newLength) {
                  changeDetected++;
                  for (key in oldValue) {
                    if (oldValue.hasOwnProperty(key) && !newValue.hasOwnProperty(key)) {
                      oldLength--;
                      delete oldValue[key];
                    }
                  }
                }
              }
              return changeDetected;
            }
            function $watchCollectionAction() {
              listener(newValue, oldValue, self);
            }
            return this.$watch($watchCollectionWatch, $watchCollectionAction);
          },
          $digest: function () {
            var watch, value, last, watchers, asyncQueue = this.$$asyncQueue, postDigestQueue = this.$$postDigestQueue, length, dirty, ttl = TTL, next, current, target = this, watchLog = [], logIdx, logMsg, asyncTask;
            beginPhase('$digest');
            lastDirtyWatch = null;
            do {
              dirty = false;
              current = target;
              while (asyncQueue.length) {
                try {
                  asyncTask = asyncQueue.shift();
                  asyncTask.scope.$eval(asyncTask.expression);
                } catch (e) {
                  clearPhase();
                  $exceptionHandler(e);
                }
                lastDirtyWatch = null;
              }
              traverseScopesLoop:
                do {
                  if (watchers = current.$$watchers) {
                    length = watchers.length;
                    while (length--) {
                      try {
                        watch = watchers[length];
                        if (watch) {
                          if ((value = watch.get(current)) !== (last = watch.last) && !(watch.eq ? equals(value, last) : typeof value == 'number' && typeof last == 'number' && isNaN(value) && isNaN(last))) {
                            dirty = true;
                            lastDirtyWatch = watch;
                            watch.last = watch.eq ? copy(value) : value;
                            watch.fn(value, last === initWatchVal ? value : last, current);
                            if (ttl < 5) {
                              logIdx = 4 - ttl;
                              if (!watchLog[logIdx])
                                watchLog[logIdx] = [];
                              logMsg = isFunction(watch.exp) ? 'fn: ' + (watch.exp.name || watch.exp.toString()) : watch.exp;
                              logMsg += '; newVal: ' + toJson(value) + '; oldVal: ' + toJson(last);
                              watchLog[logIdx].push(logMsg);
                            }
                          } else if (watch === lastDirtyWatch) {
                            dirty = false;
                            break traverseScopesLoop;
                          }
                        }
                      } catch (e) {
                        clearPhase();
                        $exceptionHandler(e);
                      }
                    }
                  }
                  if (!(next = current.$$childHead || current !== target && current.$$nextSibling)) {
                    while (current !== target && !(next = current.$$nextSibling)) {
                      current = current.$parent;
                    }
                  }
                } while (current = next);
              if ((dirty || asyncQueue.length) && !ttl--) {
                clearPhase();
                throw $rootScopeMinErr('infdig', '{0} $digest() iterations reached. Aborting!\n' + 'Watchers fired in the last 5 iterations: {1}', TTL, toJson(watchLog));
              }
            } while (dirty || asyncQueue.length);
            clearPhase();
            while (postDigestQueue.length) {
              try {
                postDigestQueue.shift()();
              } catch (e) {
                $exceptionHandler(e);
              }
            }
          },
          $destroy: function () {
            if (this.$$destroyed)
              return;
            var parent = this.$parent;
            this.$broadcast('$destroy');
            this.$$destroyed = true;
            if (this === $rootScope)
              return;
            forEach(this.$$listenerCount, bind(null, decrementListenerCount, this));
            if (parent.$$childHead == this)
              parent.$$childHead = this.$$nextSibling;
            if (parent.$$childTail == this)
              parent.$$childTail = this.$$prevSibling;
            if (this.$$prevSibling)
              this.$$prevSibling.$$nextSibling = this.$$nextSibling;
            if (this.$$nextSibling)
              this.$$nextSibling.$$prevSibling = this.$$prevSibling;
            this.$parent = this.$$nextSibling = this.$$prevSibling = this.$$childHead = this.$$childTail = null;
          },
          $eval: function (expr, locals) {
            return $parse(expr)(this, locals);
          },
          $evalAsync: function (expr) {
            if (!$rootScope.$$phase && !$rootScope.$$asyncQueue.length) {
              $browser.defer(function () {
                if ($rootScope.$$asyncQueue.length) {
                  $rootScope.$digest();
                }
              });
            }
            this.$$asyncQueue.push({
              scope: this,
              expression: expr
            });
          },
          $$postDigest: function (fn) {
            this.$$postDigestQueue.push(fn);
          },
          $apply: function (expr) {
            try {
              beginPhase('$apply');
              return this.$eval(expr);
            } catch (e) {
              $exceptionHandler(e);
            } finally {
              clearPhase();
              try {
                $rootScope.$digest();
              } catch (e) {
                $exceptionHandler(e);
                throw e;
              }
            }
          },
          $on: function (name, listener) {
            var namedListeners = this.$$listeners[name];
            if (!namedListeners) {
              this.$$listeners[name] = namedListeners = [];
            }
            namedListeners.push(listener);
            var current = this;
            do {
              if (!current.$$listenerCount[name]) {
                current.$$listenerCount[name] = 0;
              }
              current.$$listenerCount[name]++;
            } while (current = current.$parent);
            var self = this;
            return function () {
              namedListeners[indexOf(namedListeners, listener)] = null;
              decrementListenerCount(self, 1, name);
            };
          },
          $emit: function (name, args) {
            var empty = [], namedListeners, scope = this, stopPropagation = false, event = {
                name: name,
                targetScope: scope,
                stopPropagation: function () {
                  stopPropagation = true;
                },
                preventDefault: function () {
                  event.defaultPrevented = true;
                },
                defaultPrevented: false
              }, listenerArgs = concat([event], arguments, 1), i, length;
            do {
              namedListeners = scope.$$listeners[name] || empty;
              event.currentScope = scope;
              for (i = 0, length = namedListeners.length; i < length; i++) {
                if (!namedListeners[i]) {
                  namedListeners.splice(i, 1);
                  i--;
                  length--;
                  continue;
                }
                try {
                  namedListeners[i].apply(null, listenerArgs);
                } catch (e) {
                  $exceptionHandler(e);
                }
              }
              if (stopPropagation)
                return event;
              scope = scope.$parent;
            } while (scope);
            return event;
          },
          $broadcast: function (name, args) {
            var target = this, current = target, next = target, event = {
                name: name,
                targetScope: target,
                preventDefault: function () {
                  event.defaultPrevented = true;
                },
                defaultPrevented: false
              }, listenerArgs = concat([event], arguments, 1), listeners, i, length;
            while (current = next) {
              event.currentScope = current;
              listeners = current.$$listeners[name] || [];
              for (i = 0, length = listeners.length; i < length; i++) {
                if (!listeners[i]) {
                  listeners.splice(i, 1);
                  i--;
                  length--;
                  continue;
                }
                try {
                  listeners[i].apply(null, listenerArgs);
                } catch (e) {
                  $exceptionHandler(e);
                }
              }
              if (!(next = current.$$listenerCount[name] && current.$$childHead || current !== target && current.$$nextSibling)) {
                while (current !== target && !(next = current.$$nextSibling)) {
                  current = current.$parent;
                }
              }
            }
            return event;
          }
        };
        var $rootScope = new Scope();
        return $rootScope;
        function beginPhase(phase) {
          if ($rootScope.$$phase) {
            throw $rootScopeMinErr('inprog', '{0} already in progress', $rootScope.$$phase);
          }
          $rootScope.$$phase = phase;
        }
        function clearPhase() {
          $rootScope.$$phase = null;
        }
        function compileToFn(exp, name) {
          var fn = $parse(exp);
          assertArgFn(fn, name);
          return fn;
        }
        function decrementListenerCount(current, count, name) {
          do {
            current.$$listenerCount[name] -= count;
            if (current.$$listenerCount[name] === 0) {
              delete current.$$listenerCount[name];
            }
          } while (current = current.$parent);
        }
        function initWatchVal() {
        }
      }
    ];
  }
  function $$SanitizeUriProvider() {
    var aHrefSanitizationWhitelist = /^\s*(https?|ftp|mailto|tel|file):/, imgSrcSanitizationWhitelist = /^\s*(https?|ftp|file):|data:image\//;
    this.aHrefSanitizationWhitelist = function (regexp) {
      if (isDefined(regexp)) {
        aHrefSanitizationWhitelist = regexp;
        return this;
      }
      return aHrefSanitizationWhitelist;
    };
    this.imgSrcSanitizationWhitelist = function (regexp) {
      if (isDefined(regexp)) {
        imgSrcSanitizationWhitelist = regexp;
        return this;
      }
      return imgSrcSanitizationWhitelist;
    };
    this.$get = function () {
      return function sanitizeUri(uri, isImage) {
        var regex = isImage ? imgSrcSanitizationWhitelist : aHrefSanitizationWhitelist;
        var normalizedVal;
        if (!msie || msie >= 8) {
          normalizedVal = urlResolve(uri).href;
          if (normalizedVal !== '' && !normalizedVal.match(regex)) {
            return 'unsafe:' + normalizedVal;
          }
        }
        return uri;
      };
    };
  }
  var $sceMinErr = minErr('$sce');
  var SCE_CONTEXTS = {
      HTML: 'html',
      CSS: 'css',
      URL: 'url',
      RESOURCE_URL: 'resourceUrl',
      JS: 'js'
    };
  function escapeForRegexp(s) {
    return s.replace(/([-()\[\]{}+?*.$\^|,:#<!\\])/g, '\\$1').replace(/\x08/g, '\\x08');
  }
  function adjustMatcher(matcher) {
    if (matcher === 'self') {
      return matcher;
    } else if (isString(matcher)) {
      if (matcher.indexOf('***') > -1) {
        throw $sceMinErr('iwcard', 'Illegal sequence *** in string matcher.  String: {0}', matcher);
      }
      matcher = escapeForRegexp(matcher).replace('\\*\\*', '.*').replace('\\*', '[^:/.?&;]*');
      return new RegExp('^' + matcher + '$');
    } else if (isRegExp(matcher)) {
      return new RegExp('^' + matcher.source + '$');
    } else {
      throw $sceMinErr('imatcher', 'Matchers may only be "self", string patterns or RegExp objects');
    }
  }
  function adjustMatchers(matchers) {
    var adjustedMatchers = [];
    if (isDefined(matchers)) {
      forEach(matchers, function (matcher) {
        adjustedMatchers.push(adjustMatcher(matcher));
      });
    }
    return adjustedMatchers;
  }
  function $SceDelegateProvider() {
    this.SCE_CONTEXTS = SCE_CONTEXTS;
    var resourceUrlWhitelist = ['self'], resourceUrlBlacklist = [];
    this.resourceUrlWhitelist = function (value) {
      if (arguments.length) {
        resourceUrlWhitelist = adjustMatchers(value);
      }
      return resourceUrlWhitelist;
    };
    this.resourceUrlBlacklist = function (value) {
      if (arguments.length) {
        resourceUrlBlacklist = adjustMatchers(value);
      }
      return resourceUrlBlacklist;
    };
    this.$get = [
      '$injector',
      function ($injector) {
        var htmlSanitizer = function htmlSanitizer(html) {
          throw $sceMinErr('unsafe', 'Attempting to use an unsafe value in a safe context.');
        };
        if ($injector.has('$sanitize')) {
          htmlSanitizer = $injector.get('$sanitize');
        }
        function matchUrl(matcher, parsedUrl) {
          if (matcher === 'self') {
            return urlIsSameOrigin(parsedUrl);
          } else {
            return !!matcher.exec(parsedUrl.href);
          }
        }
        function isResourceUrlAllowedByPolicy(url) {
          var parsedUrl = urlResolve(url.toString());
          var i, n, allowed = false;
          for (i = 0, n = resourceUrlWhitelist.length; i < n; i++) {
            if (matchUrl(resourceUrlWhitelist[i], parsedUrl)) {
              allowed = true;
              break;
            }
          }
          if (allowed) {
            for (i = 0, n = resourceUrlBlacklist.length; i < n; i++) {
              if (matchUrl(resourceUrlBlacklist[i], parsedUrl)) {
                allowed = false;
                break;
              }
            }
          }
          return allowed;
        }
        function generateHolderType(Base) {
          var holderType = function TrustedValueHolderType(trustedValue) {
            this.$$unwrapTrustedValue = function () {
              return trustedValue;
            };
          };
          if (Base) {
            holderType.prototype = new Base();
          }
          holderType.prototype.valueOf = function sceValueOf() {
            return this.$$unwrapTrustedValue();
          };
          holderType.prototype.toString = function sceToString() {
            return this.$$unwrapTrustedValue().toString();
          };
          return holderType;
        }
        var trustedValueHolderBase = generateHolderType(), byType = {};
        byType[SCE_CONTEXTS.HTML] = generateHolderType(trustedValueHolderBase);
        byType[SCE_CONTEXTS.CSS] = generateHolderType(trustedValueHolderBase);
        byType[SCE_CONTEXTS.URL] = generateHolderType(trustedValueHolderBase);
        byType[SCE_CONTEXTS.JS] = generateHolderType(trustedValueHolderBase);
        byType[SCE_CONTEXTS.RESOURCE_URL] = generateHolderType(byType[SCE_CONTEXTS.URL]);
        function trustAs(type, trustedValue) {
          var Constructor = byType.hasOwnProperty(type) ? byType[type] : null;
          if (!Constructor) {
            throw $sceMinErr('icontext', 'Attempted to trust a value in invalid context. Context: {0}; Value: {1}', type, trustedValue);
          }
          if (trustedValue === null || trustedValue === undefined || trustedValue === '') {
            return trustedValue;
          }
          if (typeof trustedValue !== 'string') {
            throw $sceMinErr('itype', 'Attempted to trust a non-string value in a content requiring a string: Context: {0}', type);
          }
          return new Constructor(trustedValue);
        }
        function valueOf(maybeTrusted) {
          if (maybeTrusted instanceof trustedValueHolderBase) {
            return maybeTrusted.$$unwrapTrustedValue();
          } else {
            return maybeTrusted;
          }
        }
        function getTrusted(type, maybeTrusted) {
          if (maybeTrusted === null || maybeTrusted === undefined || maybeTrusted === '') {
            return maybeTrusted;
          }
          var constructor = byType.hasOwnProperty(type) ? byType[type] : null;
          if (constructor && maybeTrusted instanceof constructor) {
            return maybeTrusted.$$unwrapTrustedValue();
          }
          if (type === SCE_CONTEXTS.RESOURCE_URL) {
            if (isResourceUrlAllowedByPolicy(maybeTrusted)) {
              return maybeTrusted;
            } else {
              throw $sceMinErr('insecurl', 'Blocked loading resource from url not allowed by $sceDelegate policy.  URL: {0}', maybeTrusted.toString());
            }
          } else if (type === SCE_CONTEXTS.HTML) {
            return htmlSanitizer(maybeTrusted);
          }
          throw $sceMinErr('unsafe', 'Attempting to use an unsafe value in a safe context.');
        }
        return {
          trustAs: trustAs,
          getTrusted: getTrusted,
          valueOf: valueOf
        };
      }
    ];
  }
  function $SceProvider() {
    var enabled = true;
    this.enabled = function (value) {
      if (arguments.length) {
        enabled = !!value;
      }
      return enabled;
    };
    this.$get = [
      '$parse',
      '$sniffer',
      '$sceDelegate',
      function ($parse, $sniffer, $sceDelegate) {
        if (enabled && $sniffer.msie && $sniffer.msieDocumentMode < 8) {
          throw $sceMinErr('iequirks', 'Strict Contextual Escaping does not support Internet Explorer version < 9 in quirks ' + 'mode.  You can fix this by adding the text <!doctype html> to the top of your HTML ' + 'document.  See http://docs.angularjs.org/api/ng.$sce for more information.');
        }
        var sce = copy(SCE_CONTEXTS);
        sce.isEnabled = function () {
          return enabled;
        };
        sce.trustAs = $sceDelegate.trustAs;
        sce.getTrusted = $sceDelegate.getTrusted;
        sce.valueOf = $sceDelegate.valueOf;
        if (!enabled) {
          sce.trustAs = sce.getTrusted = function (type, value) {
            return value;
          };
          sce.valueOf = identity;
        }
        sce.parseAs = function sceParseAs(type, expr) {
          var parsed = $parse(expr);
          if (parsed.literal && parsed.constant) {
            return parsed;
          } else {
            return function sceParseAsTrusted(self, locals) {
              return sce.getTrusted(type, parsed(self, locals));
            };
          }
        };
        var parse = sce.parseAs, getTrusted = sce.getTrusted, trustAs = sce.trustAs;
        forEach(SCE_CONTEXTS, function (enumValue, name) {
          var lName = lowercase(name);
          sce[camelCase('parse_as_' + lName)] = function (expr) {
            return parse(enumValue, expr);
          };
          sce[camelCase('get_trusted_' + lName)] = function (value) {
            return getTrusted(enumValue, value);
          };
          sce[camelCase('trust_as_' + lName)] = function (value) {
            return trustAs(enumValue, value);
          };
        });
        return sce;
      }
    ];
  }
  function $SnifferProvider() {
    this.$get = [
      '$window',
      '$document',
      function ($window, $document) {
        var eventSupport = {}, android = int((/android (\d+)/.exec(lowercase(($window.navigator || {}).userAgent)) || [])[1]), boxee = /Boxee/i.test(($window.navigator || {}).userAgent), document = $document[0] || {}, documentMode = document.documentMode, vendorPrefix, vendorRegex = /^(Moz|webkit|O|ms)(?=[A-Z])/, bodyStyle = document.body && document.body.style, transitions = false, animations = false, match;
        if (bodyStyle) {
          for (var prop in bodyStyle) {
            if (match = vendorRegex.exec(prop)) {
              vendorPrefix = match[0];
              vendorPrefix = vendorPrefix.substr(0, 1).toUpperCase() + vendorPrefix.substr(1);
              break;
            }
          }
          if (!vendorPrefix) {
            vendorPrefix = 'WebkitOpacity' in bodyStyle && 'webkit';
          }
          transitions = !!('transition' in bodyStyle || vendorPrefix + 'Transition' in bodyStyle);
          animations = !!('animation' in bodyStyle || vendorPrefix + 'Animation' in bodyStyle);
          if (android && (!transitions || !animations)) {
            transitions = isString(document.body.style.webkitTransition);
            animations = isString(document.body.style.webkitAnimation);
          }
        }
        return {
          history: !!($window.history && $window.history.pushState && !(android < 4) && !boxee),
          hashchange: 'onhashchange' in $window && (!documentMode || documentMode > 7),
          hasEvent: function (event) {
            if (event == 'input' && msie == 9)
              return false;
            if (isUndefined(eventSupport[event])) {
              var divElm = document.createElement('div');
              eventSupport[event] = 'on' + event in divElm;
            }
            return eventSupport[event];
          },
          csp: csp(),
          vendorPrefix: vendorPrefix,
          transitions: transitions,
          animations: animations,
          android: android,
          msie: msie,
          msieDocumentMode: documentMode
        };
      }
    ];
  }
  function $TimeoutProvider() {
    this.$get = [
      '$rootScope',
      '$browser',
      '$q',
      '$exceptionHandler',
      function ($rootScope, $browser, $q, $exceptionHandler) {
        var deferreds = {};
        function timeout(fn, delay, invokeApply) {
          var deferred = $q.defer(), promise = deferred.promise, skipApply = isDefined(invokeApply) && !invokeApply, timeoutId;
          timeoutId = $browser.defer(function () {
            try {
              deferred.resolve(fn());
            } catch (e) {
              deferred.reject(e);
              $exceptionHandler(e);
            } finally {
              delete deferreds[promise.$$timeoutId];
            }
            if (!skipApply)
              $rootScope.$apply();
          }, delay);
          promise.$$timeoutId = timeoutId;
          deferreds[timeoutId] = deferred;
          return promise;
        }
        timeout.cancel = function (promise) {
          if (promise && promise.$$timeoutId in deferreds) {
            deferreds[promise.$$timeoutId].reject('canceled');
            delete deferreds[promise.$$timeoutId];
            return $browser.defer.cancel(promise.$$timeoutId);
          }
          return false;
        };
        return timeout;
      }
    ];
  }
  var urlParsingNode = document.createElement('a');
  var originUrl = urlResolve(window.location.href, true);
  function urlResolve(url, base) {
    var href = url;
    if (msie) {
      urlParsingNode.setAttribute('href', href);
      href = urlParsingNode.href;
    }
    urlParsingNode.setAttribute('href', href);
    return {
      href: urlParsingNode.href,
      protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, '') : '',
      host: urlParsingNode.host,
      search: urlParsingNode.search ? urlParsingNode.search.replace(/^\?/, '') : '',
      hash: urlParsingNode.hash ? urlParsingNode.hash.replace(/^#/, '') : '',
      hostname: urlParsingNode.hostname,
      port: urlParsingNode.port,
      pathname: urlParsingNode.pathname.charAt(0) === '/' ? urlParsingNode.pathname : '/' + urlParsingNode.pathname
    };
  }
  function urlIsSameOrigin(requestUrl) {
    var parsed = isString(requestUrl) ? urlResolve(requestUrl) : requestUrl;
    return parsed.protocol === originUrl.protocol && parsed.host === originUrl.host;
  }
  function $WindowProvider() {
    this.$get = valueFn(window);
  }
  $FilterProvider.$inject = ['$provide'];
  function $FilterProvider($provide) {
    var suffix = 'Filter';
    function register(name, factory) {
      if (isObject(name)) {
        var filters = {};
        forEach(name, function (filter, key) {
          filters[key] = register(key, filter);
        });
        return filters;
      } else {
        return $provide.factory(name + suffix, factory);
      }
    }
    this.register = register;
    this.$get = [
      '$injector',
      function ($injector) {
        return function (name) {
          return $injector.get(name + suffix);
        };
      }
    ];
    register('currency', currencyFilter);
    register('date', dateFilter);
    register('filter', filterFilter);
    register('json', jsonFilter);
    register('limitTo', limitToFilter);
    register('lowercase', lowercaseFilter);
    register('number', numberFilter);
    register('orderBy', orderByFilter);
    register('uppercase', uppercaseFilter);
  }
  function filterFilter() {
    return function (array, expression, comparator) {
      if (!isArray(array))
        return array;
      var comparatorType = typeof comparator, predicates = [];
      predicates.check = function (value) {
        for (var j = 0; j < predicates.length; j++) {
          if (!predicates[j](value)) {
            return false;
          }
        }
        return true;
      };
      if (comparatorType !== 'function') {
        if (comparatorType === 'boolean' && comparator) {
          comparator = function (obj, text) {
            return angular.equals(obj, text);
          };
        } else {
          comparator = function (obj, text) {
            text = ('' + text).toLowerCase();
            return ('' + obj).toLowerCase().indexOf(text) > -1;
          };
        }
      }
      var search = function (obj, text) {
        if (typeof text == 'string' && text.charAt(0) === '!') {
          return !search(obj, text.substr(1));
        }
        switch (typeof obj) {
        case 'boolean':
        case 'number':
        case 'string':
          return comparator(obj, text);
        case 'object':
          switch (typeof text) {
          case 'object':
            return comparator(obj, text);
          default:
            for (var objKey in obj) {
              if (objKey.charAt(0) !== '$' && search(obj[objKey], text)) {
                return true;
              }
            }
            break;
          }
          return false;
        case 'array':
          for (var i = 0; i < obj.length; i++) {
            if (search(obj[i], text)) {
              return true;
            }
          }
          return false;
        default:
          return false;
        }
      };
      switch (typeof expression) {
      case 'boolean':
      case 'number':
      case 'string':
        expression = { $: expression };
      case 'object':
        for (var key in expression) {
          (function (path) {
            if (typeof expression[path] == 'undefined')
              return;
            predicates.push(function (value) {
              return search(path == '$' ? value : getter(value, path), expression[path]);
            });
          }(key));
        }
        break;
      case 'function':
        predicates.push(expression);
        break;
      default:
        return array;
      }
      var filtered = [];
      for (var j = 0; j < array.length; j++) {
        var value = array[j];
        if (predicates.check(value)) {
          filtered.push(value);
        }
      }
      return filtered;
    };
  }
  currencyFilter.$inject = ['$locale'];
  function currencyFilter($locale) {
    var formats = $locale.NUMBER_FORMATS;
    return function (amount, currencySymbol) {
      if (isUndefined(currencySymbol))
        currencySymbol = formats.CURRENCY_SYM;
      return formatNumber(amount, formats.PATTERNS[1], formats.GROUP_SEP, formats.DECIMAL_SEP, 2).replace(/\u00A4/g, currencySymbol);
    };
  }
  numberFilter.$inject = ['$locale'];
  function numberFilter($locale) {
    var formats = $locale.NUMBER_FORMATS;
    return function (number, fractionSize) {
      return formatNumber(number, formats.PATTERNS[0], formats.GROUP_SEP, formats.DECIMAL_SEP, fractionSize);
    };
  }
  var DECIMAL_SEP = '.';
  function formatNumber(number, pattern, groupSep, decimalSep, fractionSize) {
    if (isNaN(number) || !isFinite(number))
      return '';
    var isNegative = number < 0;
    number = Math.abs(number);
    var numStr = number + '', formatedText = '', parts = [];
    var hasExponent = false;
    if (numStr.indexOf('e') !== -1) {
      var match = numStr.match(/([\d\.]+)e(-?)(\d+)/);
      if (match && match[2] == '-' && match[3] > fractionSize + 1) {
        numStr = '0';
      } else {
        formatedText = numStr;
        hasExponent = true;
      }
    }
    if (!hasExponent) {
      var fractionLen = (numStr.split(DECIMAL_SEP)[1] || '').length;
      if (isUndefined(fractionSize)) {
        fractionSize = Math.min(Math.max(pattern.minFrac, fractionLen), pattern.maxFrac);
      }
      var pow = Math.pow(10, fractionSize);
      number = Math.round(number * pow) / pow;
      var fraction = ('' + number).split(DECIMAL_SEP);
      var whole = fraction[0];
      fraction = fraction[1] || '';
      var i, pos = 0, lgroup = pattern.lgSize, group = pattern.gSize;
      if (whole.length >= lgroup + group) {
        pos = whole.length - lgroup;
        for (i = 0; i < pos; i++) {
          if ((pos - i) % group === 0 && i !== 0) {
            formatedText += groupSep;
          }
          formatedText += whole.charAt(i);
        }
      }
      for (i = pos; i < whole.length; i++) {
        if ((whole.length - i) % lgroup === 0 && i !== 0) {
          formatedText += groupSep;
        }
        formatedText += whole.charAt(i);
      }
      while (fraction.length < fractionSize) {
        fraction += '0';
      }
      if (fractionSize && fractionSize !== '0')
        formatedText += decimalSep + fraction.substr(0, fractionSize);
    } else {
      if (fractionSize > 0 && number > -1 && number < 1) {
        formatedText = number.toFixed(fractionSize);
      }
    }
    parts.push(isNegative ? pattern.negPre : pattern.posPre);
    parts.push(formatedText);
    parts.push(isNegative ? pattern.negSuf : pattern.posSuf);
    return parts.join('');
  }
  function padNumber(num, digits, trim) {
    var neg = '';
    if (num < 0) {
      neg = '-';
      num = -num;
    }
    num = '' + num;
    while (num.length < digits)
      num = '0' + num;
    if (trim)
      num = num.substr(num.length - digits);
    return neg + num;
  }
  function dateGetter(name, size, offset, trim) {
    offset = offset || 0;
    return function (date) {
      var value = date['get' + name]();
      if (offset > 0 || value > -offset)
        value += offset;
      if (value === 0 && offset == -12)
        value = 12;
      return padNumber(value, size, trim);
    };
  }
  function dateStrGetter(name, shortForm) {
    return function (date, formats) {
      var value = date['get' + name]();
      var get = uppercase(shortForm ? 'SHORT' + name : name);
      return formats[get][value];
    };
  }
  function timeZoneGetter(date) {
    var zone = -1 * date.getTimezoneOffset();
    var paddedZone = zone >= 0 ? '+' : '';
    paddedZone += padNumber(Math[zone > 0 ? 'floor' : 'ceil'](zone / 60), 2) + padNumber(Math.abs(zone % 60), 2);
    return paddedZone;
  }
  function ampmGetter(date, formats) {
    return date.getHours() < 12 ? formats.AMPMS[0] : formats.AMPMS[1];
  }
  var DATE_FORMATS = {
      yyyy: dateGetter('FullYear', 4),
      yy: dateGetter('FullYear', 2, 0, true),
      y: dateGetter('FullYear', 1),
      MMMM: dateStrGetter('Month'),
      MMM: dateStrGetter('Month', true),
      MM: dateGetter('Month', 2, 1),
      M: dateGetter('Month', 1, 1),
      dd: dateGetter('Date', 2),
      d: dateGetter('Date', 1),
      HH: dateGetter('Hours', 2),
      H: dateGetter('Hours', 1),
      hh: dateGetter('Hours', 2, -12),
      h: dateGetter('Hours', 1, -12),
      mm: dateGetter('Minutes', 2),
      m: dateGetter('Minutes', 1),
      ss: dateGetter('Seconds', 2),
      s: dateGetter('Seconds', 1),
      sss: dateGetter('Milliseconds', 3),
      EEEE: dateStrGetter('Day'),
      EEE: dateStrGetter('Day', true),
      a: ampmGetter,
      Z: timeZoneGetter
    };
  var DATE_FORMATS_SPLIT = /((?:[^yMdHhmsaZE']+)|(?:'(?:[^']|'')*')|(?:E+|y+|M+|d+|H+|h+|m+|s+|a|Z))(.*)/, NUMBER_STRING = /^\-?\d+$/;
  dateFilter.$inject = ['$locale'];
  function dateFilter($locale) {
    var R_ISO8601_STR = /^(\d{4})-?(\d\d)-?(\d\d)(?:T(\d\d)(?::?(\d\d)(?::?(\d\d)(?:\.(\d+))?)?)?(Z|([+-])(\d\d):?(\d\d))?)?$/;
    function jsonStringToDate(string) {
      var match;
      if (match = string.match(R_ISO8601_STR)) {
        var date = new Date(0), tzHour = 0, tzMin = 0, dateSetter = match[8] ? date.setUTCFullYear : date.setFullYear, timeSetter = match[8] ? date.setUTCHours : date.setHours;
        if (match[9]) {
          tzHour = int(match[9] + match[10]);
          tzMin = int(match[9] + match[11]);
        }
        dateSetter.call(date, int(match[1]), int(match[2]) - 1, int(match[3]));
        var h = int(match[4] || 0) - tzHour;
        var m = int(match[5] || 0) - tzMin;
        var s = int(match[6] || 0);
        var ms = Math.round(parseFloat('0.' + (match[7] || 0)) * 1000);
        timeSetter.call(date, h, m, s, ms);
        return date;
      }
      return string;
    }
    return function (date, format) {
      var text = '', parts = [], fn, match;
      format = format || 'mediumDate';
      format = $locale.DATETIME_FORMATS[format] || format;
      if (isString(date)) {
        if (NUMBER_STRING.test(date)) {
          date = int(date);
        } else {
          date = jsonStringToDate(date);
        }
      }
      if (isNumber(date)) {
        date = new Date(date);
      }
      if (!isDate(date)) {
        return date;
      }
      while (format) {
        match = DATE_FORMATS_SPLIT.exec(format);
        if (match) {
          parts = concat(parts, match, 1);
          format = parts.pop();
        } else {
          parts.push(format);
          format = null;
        }
      }
      forEach(parts, function (value) {
        fn = DATE_FORMATS[value];
        text += fn ? fn(date, $locale.DATETIME_FORMATS) : value.replace(/(^'|'$)/g, '').replace(/''/g, '\'');
      });
      return text;
    };
  }
  function jsonFilter() {
    return function (object) {
      return toJson(object, true);
    };
  }
  var lowercaseFilter = valueFn(lowercase);
  var uppercaseFilter = valueFn(uppercase);
  function limitToFilter() {
    return function (input, limit) {
      if (!isArray(input) && !isString(input))
        return input;
      limit = int(limit);
      if (isString(input)) {
        if (limit) {
          return limit >= 0 ? input.slice(0, limit) : input.slice(limit, input.length);
        } else {
          return '';
        }
      }
      var out = [], i, n;
      if (limit > input.length)
        limit = input.length;
      else if (limit < -input.length)
        limit = -input.length;
      if (limit > 0) {
        i = 0;
        n = limit;
      } else {
        i = input.length + limit;
        n = input.length;
      }
      for (; i < n; i++) {
        out.push(input[i]);
      }
      return out;
    };
  }
  orderByFilter.$inject = ['$parse'];
  function orderByFilter($parse) {
    return function (array, sortPredicate, reverseOrder) {
      if (!isArray(array))
        return array;
      if (!sortPredicate)
        return array;
      sortPredicate = isArray(sortPredicate) ? sortPredicate : [sortPredicate];
      sortPredicate = map(sortPredicate, function (predicate) {
        var descending = false, get = predicate || identity;
        if (isString(predicate)) {
          if (predicate.charAt(0) == '+' || predicate.charAt(0) == '-') {
            descending = predicate.charAt(0) == '-';
            predicate = predicate.substring(1);
          }
          get = $parse(predicate);
        }
        return reverseComparator(function (a, b) {
          return compare(get(a), get(b));
        }, descending);
      });
      var arrayCopy = [];
      for (var i = 0; i < array.length; i++) {
        arrayCopy.push(array[i]);
      }
      return arrayCopy.sort(reverseComparator(comparator, reverseOrder));
      function comparator(o1, o2) {
        for (var i = 0; i < sortPredicate.length; i++) {
          var comp = sortPredicate[i](o1, o2);
          if (comp !== 0)
            return comp;
        }
        return 0;
      }
      function reverseComparator(comp, descending) {
        return toBoolean(descending) ? function (a, b) {
          return comp(b, a);
        } : comp;
      }
      function compare(v1, v2) {
        var t1 = typeof v1;
        var t2 = typeof v2;
        if (t1 == t2) {
          if (t1 == 'string') {
            v1 = v1.toLowerCase();
            v2 = v2.toLowerCase();
          }
          if (v1 === v2)
            return 0;
          return v1 < v2 ? -1 : 1;
        } else {
          return t1 < t2 ? -1 : 1;
        }
      }
    };
  }
  function ngDirective(directive) {
    if (isFunction(directive)) {
      directive = { link: directive };
    }
    directive.restrict = directive.restrict || 'AC';
    return valueFn(directive);
  }
  var htmlAnchorDirective = valueFn({
      restrict: 'E',
      compile: function (element, attr) {
        if (msie <= 8) {
          if (!attr.href && !attr.name) {
            attr.$set('href', '');
          }
          element.append(document.createComment('IE fix'));
        }
        if (!attr.href && !attr.xlinkHref && !attr.name) {
          return function (scope, element) {
            var href = toString.call(element.prop('href')) === '[object SVGAnimatedString]' ? 'xlink:href' : 'href';
            element.on('click', function (event) {
              if (!element.attr(href)) {
                event.preventDefault();
              }
            });
          };
        }
      }
    });
  var ngAttributeAliasDirectives = {};
  forEach(BOOLEAN_ATTR, function (propName, attrName) {
    if (propName == 'multiple')
      return;
    var normalized = directiveNormalize('ng-' + attrName);
    ngAttributeAliasDirectives[normalized] = function () {
      return {
        priority: 100,
        link: function (scope, element, attr) {
          scope.$watch(attr[normalized], function ngBooleanAttrWatchAction(value) {
            attr.$set(attrName, !!value);
          });
        }
      };
    };
  });
  forEach([
    'src',
    'srcset',
    'href'
  ], function (attrName) {
    var normalized = directiveNormalize('ng-' + attrName);
    ngAttributeAliasDirectives[normalized] = function () {
      return {
        priority: 99,
        link: function (scope, element, attr) {
          attr.$observe(normalized, function (value) {
            if (!value)
              return;
            attr.$set(attrName, value);
            if (msie)
              element.prop(attrName, attr[attrName]);
          });
        }
      };
    };
  });
  var nullFormCtrl = {
      $addControl: noop,
      $removeControl: noop,
      $setValidity: noop,
      $setDirty: noop,
      $setPristine: noop
    };
  FormController.$inject = [
    '$element',
    '$attrs',
    '$scope'
  ];
  function FormController(element, attrs) {
    var form = this, parentForm = element.parent().controller('form') || nullFormCtrl, invalidCount = 0, errors = form.$error = {}, controls = [];
    form.$name = attrs.name || attrs.ngForm;
    form.$dirty = false;
    form.$pristine = true;
    form.$valid = true;
    form.$invalid = false;
    parentForm.$addControl(form);
    element.addClass(PRISTINE_CLASS);
    toggleValidCss(true);
    function toggleValidCss(isValid, validationErrorKey) {
      validationErrorKey = validationErrorKey ? '-' + snake_case(validationErrorKey, '-') : '';
      element.removeClass((isValid ? INVALID_CLASS : VALID_CLASS) + validationErrorKey).addClass((isValid ? VALID_CLASS : INVALID_CLASS) + validationErrorKey);
    }
    form.$addControl = function (control) {
      assertNotHasOwnProperty(control.$name, 'input');
      controls.push(control);
      if (control.$name) {
        form[control.$name] = control;
      }
    };
    form.$removeControl = function (control) {
      if (control.$name && form[control.$name] === control) {
        delete form[control.$name];
      }
      forEach(errors, function (queue, validationToken) {
        form.$setValidity(validationToken, true, control);
      });
      arrayRemove(controls, control);
    };
    form.$setValidity = function (validationToken, isValid, control) {
      var queue = errors[validationToken];
      if (isValid) {
        if (queue) {
          arrayRemove(queue, control);
          if (!queue.length) {
            invalidCount--;
            if (!invalidCount) {
              toggleValidCss(isValid);
              form.$valid = true;
              form.$invalid = false;
            }
            errors[validationToken] = false;
            toggleValidCss(true, validationToken);
            parentForm.$setValidity(validationToken, true, form);
          }
        }
      } else {
        if (!invalidCount) {
          toggleValidCss(isValid);
        }
        if (queue) {
          if (includes(queue, control))
            return;
        } else {
          errors[validationToken] = queue = [];
          invalidCount++;
          toggleValidCss(false, validationToken);
          parentForm.$setValidity(validationToken, false, form);
        }
        queue.push(control);
        form.$valid = false;
        form.$invalid = true;
      }
    };
    form.$setDirty = function () {
      element.removeClass(PRISTINE_CLASS).addClass(DIRTY_CLASS);
      form.$dirty = true;
      form.$pristine = false;
      parentForm.$setDirty();
    };
    form.$setPristine = function () {
      element.removeClass(DIRTY_CLASS).addClass(PRISTINE_CLASS);
      form.$dirty = false;
      form.$pristine = true;
      forEach(controls, function (control) {
        control.$setPristine();
      });
    };
  }
  var formDirectiveFactory = function (isNgForm) {
    return [
      '$timeout',
      function ($timeout) {
        var formDirective = {
            name: 'form',
            restrict: isNgForm ? 'EAC' : 'E',
            controller: FormController,
            compile: function () {
              return {
                pre: function (scope, formElement, attr, controller) {
                  if (!attr.action) {
                    var preventDefaultListener = function (event) {
                      event.preventDefault ? event.preventDefault() : event.returnValue = false;
                    };
                    addEventListenerFn(formElement[0], 'submit', preventDefaultListener);
                    formElement.on('$destroy', function () {
                      $timeout(function () {
                        removeEventListenerFn(formElement[0], 'submit', preventDefaultListener);
                      }, 0, false);
                    });
                  }
                  var parentFormCtrl = formElement.parent().controller('form'), alias = attr.name || attr.ngForm;
                  if (alias) {
                    setter(scope, alias, controller, alias);
                  }
                  if (parentFormCtrl) {
                    formElement.on('$destroy', function () {
                      parentFormCtrl.$removeControl(controller);
                      if (alias) {
                        setter(scope, alias, undefined, alias);
                      }
                      extend(controller, nullFormCtrl);
                    });
                  }
                }
              };
            }
          };
        return formDirective;
      }
    ];
  };
  var formDirective = formDirectiveFactory();
  var ngFormDirective = formDirectiveFactory(true);
  var URL_REGEXP = /^(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?$/;
  var EMAIL_REGEXP = /^[a-z0-9!#$%&'*+/=?^_`{|}~.-]+@[a-z0-9-]+(\.[a-z0-9-]+)*$/i;
  var NUMBER_REGEXP = /^\s*(\-|\+)?(\d+|(\d*(\.\d*)))\s*$/;
  var inputType = {
      'text': textInputType,
      'number': numberInputType,
      'url': urlInputType,
      'email': emailInputType,
      'radio': radioInputType,
      'checkbox': checkboxInputType,
      'hidden': noop,
      'button': noop,
      'submit': noop,
      'reset': noop
    };
  function validate(ctrl, validatorName, validity, value) {
    ctrl.$setValidity(validatorName, validity);
    return validity ? value : undefined;
  }
  function textInputType(scope, element, attr, ctrl, $sniffer, $browser) {
    if (!$sniffer.android) {
      var composing = false;
      element.on('compositionstart', function (data) {
        composing = true;
      });
      element.on('compositionend', function () {
        composing = false;
      });
    }
    var listener = function () {
      if (composing)
        return;
      var value = element.val();
      if (toBoolean(attr.ngTrim || 'T')) {
        value = trim(value);
      }
      if (ctrl.$viewValue !== value) {
        if (scope.$$phase) {
          ctrl.$setViewValue(value);
        } else {
          scope.$apply(function () {
            ctrl.$setViewValue(value);
          });
        }
      }
    };
    if ($sniffer.hasEvent('input')) {
      element.on('input', listener);
    } else {
      var timeout;
      var deferListener = function () {
        if (!timeout) {
          timeout = $browser.defer(function () {
            listener();
            timeout = null;
          });
        }
      };
      element.on('keydown', function (event) {
        var key = event.keyCode;
        if (key === 91 || 15 < key && key < 19 || 37 <= key && key <= 40)
          return;
        deferListener();
      });
      if ($sniffer.hasEvent('paste')) {
        element.on('paste cut', deferListener);
      }
    }
    element.on('change', listener);
    ctrl.$render = function () {
      element.val(ctrl.$isEmpty(ctrl.$viewValue) ? '' : ctrl.$viewValue);
    };
    var pattern = attr.ngPattern, patternValidator, match;
    if (pattern) {
      var validateRegex = function (regexp, value) {
        return validate(ctrl, 'pattern', ctrl.$isEmpty(value) || regexp.test(value), value);
      };
      match = pattern.match(/^\/(.*)\/([gim]*)$/);
      if (match) {
        pattern = new RegExp(match[1], match[2]);
        patternValidator = function (value) {
          return validateRegex(pattern, value);
        };
      } else {
        patternValidator = function (value) {
          var patternObj = scope.$eval(pattern);
          if (!patternObj || !patternObj.test) {
            throw minErr('ngPattern')('noregexp', 'Expected {0} to be a RegExp but was {1}. Element: {2}', pattern, patternObj, startingTag(element));
          }
          return validateRegex(patternObj, value);
        };
      }
      ctrl.$formatters.push(patternValidator);
      ctrl.$parsers.push(patternValidator);
    }
    if (attr.ngMinlength) {
      var minlength = int(attr.ngMinlength);
      var minLengthValidator = function (value) {
        return validate(ctrl, 'minlength', ctrl.$isEmpty(value) || value.length >= minlength, value);
      };
      ctrl.$parsers.push(minLengthValidator);
      ctrl.$formatters.push(minLengthValidator);
    }
    if (attr.ngMaxlength) {
      var maxlength = int(attr.ngMaxlength);
      var maxLengthValidator = function (value) {
        return validate(ctrl, 'maxlength', ctrl.$isEmpty(value) || value.length <= maxlength, value);
      };
      ctrl.$parsers.push(maxLengthValidator);
      ctrl.$formatters.push(maxLengthValidator);
    }
  }
  function numberInputType(scope, element, attr, ctrl, $sniffer, $browser) {
    textInputType(scope, element, attr, ctrl, $sniffer, $browser);
    ctrl.$parsers.push(function (value) {
      var empty = ctrl.$isEmpty(value);
      if (empty || NUMBER_REGEXP.test(value)) {
        ctrl.$setValidity('number', true);
        return value === '' ? null : empty ? value : parseFloat(value);
      } else {
        ctrl.$setValidity('number', false);
        return undefined;
      }
    });
    ctrl.$formatters.push(function (value) {
      return ctrl.$isEmpty(value) ? '' : '' + value;
    });
    if (attr.min) {
      var minValidator = function (value) {
        var min = parseFloat(attr.min);
        return validate(ctrl, 'min', ctrl.$isEmpty(value) || value >= min, value);
      };
      ctrl.$parsers.push(minValidator);
      ctrl.$formatters.push(minValidator);
    }
    if (attr.max) {
      var maxValidator = function (value) {
        var max = parseFloat(attr.max);
        return validate(ctrl, 'max', ctrl.$isEmpty(value) || value <= max, value);
      };
      ctrl.$parsers.push(maxValidator);
      ctrl.$formatters.push(maxValidator);
    }
    ctrl.$formatters.push(function (value) {
      return validate(ctrl, 'number', ctrl.$isEmpty(value) || isNumber(value), value);
    });
  }
  function urlInputType(scope, element, attr, ctrl, $sniffer, $browser) {
    textInputType(scope, element, attr, ctrl, $sniffer, $browser);
    var urlValidator = function (value) {
      return validate(ctrl, 'url', ctrl.$isEmpty(value) || URL_REGEXP.test(value), value);
    };
    ctrl.$formatters.push(urlValidator);
    ctrl.$parsers.push(urlValidator);
  }
  function emailInputType(scope, element, attr, ctrl, $sniffer, $browser) {
    textInputType(scope, element, attr, ctrl, $sniffer, $browser);
    var emailValidator = function (value) {
      return validate(ctrl, 'email', ctrl.$isEmpty(value) || EMAIL_REGEXP.test(value), value);
    };
    ctrl.$formatters.push(emailValidator);
    ctrl.$parsers.push(emailValidator);
  }
  function radioInputType(scope, element, attr, ctrl) {
    if (isUndefined(attr.name)) {
      element.attr('name', nextUid());
    }
    element.on('click', function () {
      if (element[0].checked) {
        scope.$apply(function () {
          ctrl.$setViewValue(attr.value);
        });
      }
    });
    ctrl.$render = function () {
      var value = attr.value;
      element[0].checked = value == ctrl.$viewValue;
    };
    attr.$observe('value', ctrl.$render);
  }
  function checkboxInputType(scope, element, attr, ctrl) {
    var trueValue = attr.ngTrueValue, falseValue = attr.ngFalseValue;
    if (!isString(trueValue))
      trueValue = true;
    if (!isString(falseValue))
      falseValue = false;
    element.on('click', function () {
      scope.$apply(function () {
        ctrl.$setViewValue(element[0].checked);
      });
    });
    ctrl.$render = function () {
      element[0].checked = ctrl.$viewValue;
    };
    ctrl.$isEmpty = function (value) {
      return value !== trueValue;
    };
    ctrl.$formatters.push(function (value) {
      return value === trueValue;
    });
    ctrl.$parsers.push(function (value) {
      return value ? trueValue : falseValue;
    });
  }
  var inputDirective = [
      '$browser',
      '$sniffer',
      function ($browser, $sniffer) {
        return {
          restrict: 'E',
          require: '?ngModel',
          link: function (scope, element, attr, ctrl) {
            if (ctrl) {
              (inputType[lowercase(attr.type)] || inputType.text)(scope, element, attr, ctrl, $sniffer, $browser);
            }
          }
        };
      }
    ];
  var VALID_CLASS = 'ng-valid', INVALID_CLASS = 'ng-invalid', PRISTINE_CLASS = 'ng-pristine', DIRTY_CLASS = 'ng-dirty';
  var NgModelController = [
      '$scope',
      '$exceptionHandler',
      '$attrs',
      '$element',
      '$parse',
      function ($scope, $exceptionHandler, $attr, $element, $parse) {
        this.$viewValue = Number.NaN;
        this.$modelValue = Number.NaN;
        this.$parsers = [];
        this.$formatters = [];
        this.$viewChangeListeners = [];
        this.$pristine = true;
        this.$dirty = false;
        this.$valid = true;
        this.$invalid = false;
        this.$name = $attr.name;
        var ngModelGet = $parse($attr.ngModel), ngModelSet = ngModelGet.assign;
        if (!ngModelSet) {
          throw minErr('ngModel')('nonassign', 'Expression \'{0}\' is non-assignable. Element: {1}', $attr.ngModel, startingTag($element));
        }
        this.$render = noop;
        this.$isEmpty = function (value) {
          return isUndefined(value) || value === '' || value === null || value !== value;
        };
        var parentForm = $element.inheritedData('$formController') || nullFormCtrl, invalidCount = 0, $error = this.$error = {};
        $element.addClass(PRISTINE_CLASS);
        toggleValidCss(true);
        function toggleValidCss(isValid, validationErrorKey) {
          validationErrorKey = validationErrorKey ? '-' + snake_case(validationErrorKey, '-') : '';
          $element.removeClass((isValid ? INVALID_CLASS : VALID_CLASS) + validationErrorKey).addClass((isValid ? VALID_CLASS : INVALID_CLASS) + validationErrorKey);
        }
        this.$setValidity = function (validationErrorKey, isValid) {
          if ($error[validationErrorKey] === !isValid)
            return;
          if (isValid) {
            if ($error[validationErrorKey])
              invalidCount--;
            if (!invalidCount) {
              toggleValidCss(true);
              this.$valid = true;
              this.$invalid = false;
            }
          } else {
            toggleValidCss(false);
            this.$invalid = true;
            this.$valid = false;
            invalidCount++;
          }
          $error[validationErrorKey] = !isValid;
          toggleValidCss(isValid, validationErrorKey);
          parentForm.$setValidity(validationErrorKey, isValid, this);
        };
        this.$setPristine = function () {
          this.$dirty = false;
          this.$pristine = true;
          $element.removeClass(DIRTY_CLASS).addClass(PRISTINE_CLASS);
        };
        this.$setViewValue = function (value) {
          this.$viewValue = value;
          if (this.$pristine) {
            this.$dirty = true;
            this.$pristine = false;
            $element.removeClass(PRISTINE_CLASS).addClass(DIRTY_CLASS);
            parentForm.$setDirty();
          }
          forEach(this.$parsers, function (fn) {
            value = fn(value);
          });
          if (this.$modelValue !== value) {
            this.$modelValue = value;
            ngModelSet($scope, value);
            forEach(this.$viewChangeListeners, function (listener) {
              try {
                listener();
              } catch (e) {
                $exceptionHandler(e);
              }
            });
          }
        };
        var ctrl = this;
        $scope.$watch(function ngModelWatch() {
          var value = ngModelGet($scope);
          if (ctrl.$modelValue !== value) {
            var formatters = ctrl.$formatters, idx = formatters.length;
            ctrl.$modelValue = value;
            while (idx--) {
              value = formatters[idx](value);
            }
            if (ctrl.$viewValue !== value) {
              ctrl.$viewValue = value;
              ctrl.$render();
            }
          }
          return value;
        });
      }
    ];
  var ngModelDirective = function () {
    return {
      require: [
        'ngModel',
        '^?form'
      ],
      controller: NgModelController,
      link: function (scope, element, attr, ctrls) {
        var modelCtrl = ctrls[0], formCtrl = ctrls[1] || nullFormCtrl;
        formCtrl.$addControl(modelCtrl);
        scope.$on('$destroy', function () {
          formCtrl.$removeControl(modelCtrl);
        });
      }
    };
  };
  var ngChangeDirective = valueFn({
      require: 'ngModel',
      link: function (scope, element, attr, ctrl) {
        ctrl.$viewChangeListeners.push(function () {
          scope.$eval(attr.ngChange);
        });
      }
    });
  var requiredDirective = function () {
    return {
      require: '?ngModel',
      link: function (scope, elm, attr, ctrl) {
        if (!ctrl)
          return;
        attr.required = true;
        var validator = function (value) {
          if (attr.required && ctrl.$isEmpty(value)) {
            ctrl.$setValidity('required', false);
            return;
          } else {
            ctrl.$setValidity('required', true);
            return value;
          }
        };
        ctrl.$formatters.push(validator);
        ctrl.$parsers.unshift(validator);
        attr.$observe('required', function () {
          validator(ctrl.$viewValue);
        });
      }
    };
  };
  var ngListDirective = function () {
    return {
      require: 'ngModel',
      link: function (scope, element, attr, ctrl) {
        var match = /\/(.*)\//.exec(attr.ngList), separator = match && new RegExp(match[1]) || attr.ngList || ',';
        var parse = function (viewValue) {
          if (isUndefined(viewValue))
            return;
          var list = [];
          if (viewValue) {
            forEach(viewValue.split(separator), function (value) {
              if (value)
                list.push(trim(value));
            });
          }
          return list;
        };
        ctrl.$parsers.push(parse);
        ctrl.$formatters.push(function (value) {
          if (isArray(value)) {
            return value.join(', ');
          }
          return undefined;
        });
        ctrl.$isEmpty = function (value) {
          return !value || !value.length;
        };
      }
    };
  };
  var CONSTANT_VALUE_REGEXP = /^(true|false|\d+)$/;
  var ngValueDirective = function () {
    return {
      priority: 100,
      compile: function (tpl, tplAttr) {
        if (CONSTANT_VALUE_REGEXP.test(tplAttr.ngValue)) {
          return function ngValueConstantLink(scope, elm, attr) {
            attr.$set('value', scope.$eval(attr.ngValue));
          };
        } else {
          return function ngValueLink(scope, elm, attr) {
            scope.$watch(attr.ngValue, function valueWatchAction(value) {
              attr.$set('value', value);
            });
          };
        }
      }
    };
  };
  var ngBindDirective = ngDirective(function (scope, element, attr) {
      element.addClass('ng-binding').data('$binding', attr.ngBind);
      scope.$watch(attr.ngBind, function ngBindWatchAction(value) {
        element.text(value == undefined ? '' : value);
      });
    });
  var ngBindTemplateDirective = [
      '$interpolate',
      function ($interpolate) {
        return function (scope, element, attr) {
          var interpolateFn = $interpolate(element.attr(attr.$attr.ngBindTemplate));
          element.addClass('ng-binding').data('$binding', interpolateFn);
          attr.$observe('ngBindTemplate', function (value) {
            element.text(value);
          });
        };
      }
    ];
  var ngBindHtmlDirective = [
      '$sce',
      '$parse',
      function ($sce, $parse) {
        return function (scope, element, attr) {
          element.addClass('ng-binding').data('$binding', attr.ngBindHtml);
          var parsed = $parse(attr.ngBindHtml);
          function getStringValue() {
            return (parsed(scope) || '').toString();
          }
          scope.$watch(getStringValue, function ngBindHtmlWatchAction(value) {
            element.html($sce.getTrustedHtml(parsed(scope)) || '');
          });
        };
      }
    ];
  function classDirective(name, selector) {
    name = 'ngClass' + name;
    return function () {
      return {
        restrict: 'AC',
        link: function (scope, element, attr) {
          var oldVal;
          scope.$watch(attr[name], ngClassWatchAction, true);
          attr.$observe('class', function (value) {
            ngClassWatchAction(scope.$eval(attr[name]));
          });
          if (name !== 'ngClass') {
            scope.$watch('$index', function ($index, old$index) {
              var mod = $index & 1;
              if (mod !== old$index & 1) {
                var classes = flattenClasses(scope.$eval(attr[name]));
                mod === selector ? attr.$addClass(classes) : attr.$removeClass(classes);
              }
            });
          }
          function ngClassWatchAction(newVal) {
            if (selector === true || scope.$index % 2 === selector) {
              var newClasses = flattenClasses(newVal || '');
              if (!oldVal) {
                attr.$addClass(newClasses);
              } else if (!equals(newVal, oldVal)) {
                attr.$updateClass(newClasses, flattenClasses(oldVal));
              }
            }
            oldVal = copy(newVal);
          }
          function flattenClasses(classVal) {
            if (isArray(classVal)) {
              return classVal.join(' ');
            } else if (isObject(classVal)) {
              var classes = [], i = 0;
              forEach(classVal, function (v, k) {
                if (v) {
                  classes.push(k);
                }
              });
              return classes.join(' ');
            }
            return classVal;
          }
        }
      };
    };
  }
  var ngClassDirective = classDirective('', true);
  var ngClassOddDirective = classDirective('Odd', 0);
  var ngClassEvenDirective = classDirective('Even', 1);
  var ngCloakDirective = ngDirective({
      compile: function (element, attr) {
        attr.$set('ngCloak', undefined);
        element.removeClass('ng-cloak');
      }
    });
  var ngControllerDirective = [function () {
        return {
          scope: true,
          controller: '@',
          priority: 500
        };
      }];
  var ngEventDirectives = {};
  forEach('click dblclick mousedown mouseup mouseover mouseout mousemove mouseenter mouseleave keydown keyup keypress submit focus blur copy cut paste'.split(' '), function (name) {
    var directiveName = directiveNormalize('ng-' + name);
    ngEventDirectives[directiveName] = [
      '$parse',
      function ($parse) {
        return {
          compile: function ($element, attr) {
            var fn = $parse(attr[directiveName]);
            return function (scope, element, attr) {
              element.on(lowercase(name), function (event) {
                scope.$apply(function () {
                  fn(scope, { $event: event });
                });
              });
            };
          }
        };
      }
    ];
  });
  var ngIfDirective = [
      '$animate',
      function ($animate) {
        return {
          transclude: 'element',
          priority: 600,
          terminal: true,
          restrict: 'A',
          $$tlb: true,
          link: function ($scope, $element, $attr, ctrl, $transclude) {
            var block, childScope;
            $scope.$watch($attr.ngIf, function ngIfWatchAction(value) {
              if (toBoolean(value)) {
                if (!childScope) {
                  childScope = $scope.$new();
                  $transclude(childScope, function (clone) {
                    clone[clone.length++] = document.createComment(' end ngIf: ' + $attr.ngIf + ' ');
                    block = { clone: clone };
                    $animate.enter(clone, $element.parent(), $element);
                  });
                }
              } else {
                if (childScope) {
                  childScope.$destroy();
                  childScope = null;
                }
                if (block) {
                  $animate.leave(getBlockElements(block.clone));
                  block = null;
                }
              }
            });
          }
        };
      }
    ];
  var ngIncludeDirective = [
      '$http',
      '$templateCache',
      '$anchorScroll',
      '$animate',
      '$sce',
      function ($http, $templateCache, $anchorScroll, $animate, $sce) {
        return {
          restrict: 'ECA',
          priority: 400,
          terminal: true,
          transclude: 'element',
          controller: angular.noop,
          compile: function (element, attr) {
            var srcExp = attr.ngInclude || attr.src, onloadExp = attr.onload || '', autoScrollExp = attr.autoscroll;
            return function (scope, $element, $attr, ctrl, $transclude) {
              var changeCounter = 0, currentScope, currentElement;
              var cleanupLastIncludeContent = function () {
                if (currentScope) {
                  currentScope.$destroy();
                  currentScope = null;
                }
                if (currentElement) {
                  $animate.leave(currentElement);
                  currentElement = null;
                }
              };
              scope.$watch($sce.parseAsResourceUrl(srcExp), function ngIncludeWatchAction(src) {
                var afterAnimation = function () {
                  if (isDefined(autoScrollExp) && (!autoScrollExp || scope.$eval(autoScrollExp))) {
                    $anchorScroll();
                  }
                };
                var thisChangeId = ++changeCounter;
                if (src) {
                  $http.get(src, { cache: $templateCache }).success(function (response) {
                    if (thisChangeId !== changeCounter)
                      return;
                    var newScope = scope.$new();
                    ctrl.template = response;
                    var clone = $transclude(newScope, function (clone) {
                        cleanupLastIncludeContent();
                        $animate.enter(clone, null, $element, afterAnimation);
                      });
                    currentScope = newScope;
                    currentElement = clone;
                    currentScope.$emit('$includeContentLoaded');
                    scope.$eval(onloadExp);
                  }).error(function () {
                    if (thisChangeId === changeCounter)
                      cleanupLastIncludeContent();
                  });
                  scope.$emit('$includeContentRequested');
                } else {
                  cleanupLastIncludeContent();
                  ctrl.template = null;
                }
              });
            };
          }
        };
      }
    ];
  var ngIncludeFillContentDirective = [
      '$compile',
      function ($compile) {
        return {
          restrict: 'ECA',
          priority: -400,
          require: 'ngInclude',
          link: function (scope, $element, $attr, ctrl) {
            $element.html(ctrl.template);
            $compile($element.contents())(scope);
          }
        };
      }
    ];
  var ngInitDirective = ngDirective({
      priority: 450,
      compile: function () {
        return {
          pre: function (scope, element, attrs) {
            scope.$eval(attrs.ngInit);
          }
        };
      }
    });
  var ngNonBindableDirective = ngDirective({
      terminal: true,
      priority: 1000
    });
  var ngPluralizeDirective = [
      '$locale',
      '$interpolate',
      function ($locale, $interpolate) {
        var BRACE = /{}/g;
        return {
          restrict: 'EA',
          link: function (scope, element, attr) {
            var numberExp = attr.count, whenExp = attr.$attr.when && element.attr(attr.$attr.when), offset = attr.offset || 0, whens = scope.$eval(whenExp) || {}, whensExpFns = {}, startSymbol = $interpolate.startSymbol(), endSymbol = $interpolate.endSymbol(), isWhen = /^when(Minus)?(.+)$/;
            forEach(attr, function (expression, attributeName) {
              if (isWhen.test(attributeName)) {
                whens[lowercase(attributeName.replace('when', '').replace('Minus', '-'))] = element.attr(attr.$attr[attributeName]);
              }
            });
            forEach(whens, function (expression, key) {
              whensExpFns[key] = $interpolate(expression.replace(BRACE, startSymbol + numberExp + '-' + offset + endSymbol));
            });
            scope.$watch(function ngPluralizeWatch() {
              var value = parseFloat(scope.$eval(numberExp));
              if (!isNaN(value)) {
                if (!(value in whens))
                  value = $locale.pluralCat(value - offset);
                return whensExpFns[value](scope, element, true);
              } else {
                return '';
              }
            }, function ngPluralizeWatchAction(newVal) {
              element.text(newVal);
            });
          }
        };
      }
    ];
  var ngRepeatDirective = [
      '$parse',
      '$animate',
      function ($parse, $animate) {
        var NG_REMOVED = '$$NG_REMOVED';
        var ngRepeatMinErr = minErr('ngRepeat');
        return {
          transclude: 'element',
          priority: 1000,
          terminal: true,
          $$tlb: true,
          link: function ($scope, $element, $attr, ctrl, $transclude) {
            var expression = $attr.ngRepeat;
            var match = expression.match(/^\s*([\s\S]+?)\s+in\s+([\s\S]+?)(?:\s+track\s+by\s+([\s\S]+?))?\s*$/), trackByExp, trackByExpGetter, trackByIdExpFn, trackByIdArrayFn, trackByIdObjFn, lhs, rhs, valueIdentifier, keyIdentifier, hashFnLocals = { $id: hashKey };
            if (!match) {
              throw ngRepeatMinErr('iexp', 'Expected expression in form of \'_item_ in _collection_[ track by _id_]\' but got \'{0}\'.', expression);
            }
            lhs = match[1];
            rhs = match[2];
            trackByExp = match[3];
            if (trackByExp) {
              trackByExpGetter = $parse(trackByExp);
              trackByIdExpFn = function (key, value, index) {
                if (keyIdentifier)
                  hashFnLocals[keyIdentifier] = key;
                hashFnLocals[valueIdentifier] = value;
                hashFnLocals.$index = index;
                return trackByExpGetter($scope, hashFnLocals);
              };
            } else {
              trackByIdArrayFn = function (key, value) {
                return hashKey(value);
              };
              trackByIdObjFn = function (key) {
                return key;
              };
            }
            match = lhs.match(/^(?:([\$\w]+)|\(([\$\w]+)\s*,\s*([\$\w]+)\))$/);
            if (!match) {
              throw ngRepeatMinErr('iidexp', '\'_item_\' in \'_item_ in _collection_\' should be an identifier or \'(_key_, _value_)\' expression, but got \'{0}\'.', lhs);
            }
            valueIdentifier = match[3] || match[1];
            keyIdentifier = match[2];
            var lastBlockMap = {};
            $scope.$watchCollection(rhs, function ngRepeatAction(collection) {
              var index, length, previousNode = $element[0], nextNode, nextBlockMap = {}, arrayLength, childScope, key, value, trackById, trackByIdFn, collectionKeys, block, nextBlockOrder = [], elementsToRemove;
              if (isArrayLike(collection)) {
                collectionKeys = collection;
                trackByIdFn = trackByIdExpFn || trackByIdArrayFn;
              } else {
                trackByIdFn = trackByIdExpFn || trackByIdObjFn;
                collectionKeys = [];
                for (key in collection) {
                  if (collection.hasOwnProperty(key) && key.charAt(0) != '$') {
                    collectionKeys.push(key);
                  }
                }
                collectionKeys.sort();
              }
              arrayLength = collectionKeys.length;
              length = nextBlockOrder.length = collectionKeys.length;
              for (index = 0; index < length; index++) {
                key = collection === collectionKeys ? index : collectionKeys[index];
                value = collection[key];
                trackById = trackByIdFn(key, value, index);
                assertNotHasOwnProperty(trackById, '`track by` id');
                if (lastBlockMap.hasOwnProperty(trackById)) {
                  block = lastBlockMap[trackById];
                  delete lastBlockMap[trackById];
                  nextBlockMap[trackById] = block;
                  nextBlockOrder[index] = block;
                } else if (nextBlockMap.hasOwnProperty(trackById)) {
                  forEach(nextBlockOrder, function (block) {
                    if (block && block.scope)
                      lastBlockMap[block.id] = block;
                  });
                  throw ngRepeatMinErr('dupes', 'Duplicates in a repeater are not allowed. Use \'track by\' expression to specify unique keys. Repeater: {0}, Duplicate key: {1}', expression, trackById);
                } else {
                  nextBlockOrder[index] = { id: trackById };
                  nextBlockMap[trackById] = false;
                }
              }
              for (key in lastBlockMap) {
                if (lastBlockMap.hasOwnProperty(key)) {
                  block = lastBlockMap[key];
                  elementsToRemove = getBlockElements(block.clone);
                  $animate.leave(elementsToRemove);
                  forEach(elementsToRemove, function (element) {
                    element[NG_REMOVED] = true;
                  });
                  block.scope.$destroy();
                }
              }
              for (index = 0, length = collectionKeys.length; index < length; index++) {
                key = collection === collectionKeys ? index : collectionKeys[index];
                value = collection[key];
                block = nextBlockOrder[index];
                if (nextBlockOrder[index - 1])
                  previousNode = getBlockEnd(nextBlockOrder[index - 1]);
                if (block.scope) {
                  childScope = block.scope;
                  nextNode = previousNode;
                  do {
                    nextNode = nextNode.nextSibling;
                  } while (nextNode && nextNode[NG_REMOVED]);
                  if (getBlockStart(block) != nextNode) {
                    $animate.move(getBlockElements(block.clone), null, jqLite(previousNode));
                  }
                  previousNode = getBlockEnd(block);
                } else {
                  childScope = $scope.$new();
                }
                childScope[valueIdentifier] = value;
                if (keyIdentifier)
                  childScope[keyIdentifier] = key;
                childScope.$index = index;
                childScope.$first = index === 0;
                childScope.$last = index === arrayLength - 1;
                childScope.$middle = !(childScope.$first || childScope.$last);
                childScope.$odd = !(childScope.$even = (index & 1) === 0);
                if (!block.scope) {
                  $transclude(childScope, function (clone) {
                    clone[clone.length++] = document.createComment(' end ngRepeat: ' + expression + ' ');
                    $animate.enter(clone, null, jqLite(previousNode));
                    previousNode = clone;
                    block.scope = childScope;
                    block.clone = clone;
                    nextBlockMap[block.id] = block;
                  });
                }
              }
              lastBlockMap = nextBlockMap;
            });
          }
        };
        function getBlockStart(block) {
          return block.clone[0];
        }
        function getBlockEnd(block) {
          return block.clone[block.clone.length - 1];
        }
      }
    ];
  var ngShowDirective = [
      '$animate',
      function ($animate) {
        return function (scope, element, attr) {
          scope.$watch(attr.ngShow, function ngShowWatchAction(value) {
            $animate[toBoolean(value) ? 'removeClass' : 'addClass'](element, 'ng-hide');
          });
        };
      }
    ];
  var ngHideDirective = [
      '$animate',
      function ($animate) {
        return function (scope, element, attr) {
          scope.$watch(attr.ngHide, function ngHideWatchAction(value) {
            $animate[toBoolean(value) ? 'addClass' : 'removeClass'](element, 'ng-hide');
          });
        };
      }
    ];
  var ngStyleDirective = ngDirective(function (scope, element, attr) {
      scope.$watch(attr.ngStyle, function ngStyleWatchAction(newStyles, oldStyles) {
        if (oldStyles && newStyles !== oldStyles) {
          forEach(oldStyles, function (val, style) {
            element.css(style, '');
          });
        }
        if (newStyles)
          element.css(newStyles);
      }, true);
    });
  var ngSwitchDirective = [
      '$animate',
      function ($animate) {
        return {
          restrict: 'EA',
          require: 'ngSwitch',
          controller: [
            '$scope',
            function ngSwitchController() {
              this.cases = {};
            }
          ],
          link: function (scope, element, attr, ngSwitchController) {
            var watchExpr = attr.ngSwitch || attr.on, selectedTranscludes, selectedElements, selectedScopes = [];
            scope.$watch(watchExpr, function ngSwitchWatchAction(value) {
              for (var i = 0, ii = selectedScopes.length; i < ii; i++) {
                selectedScopes[i].$destroy();
                $animate.leave(selectedElements[i]);
              }
              selectedElements = [];
              selectedScopes = [];
              if (selectedTranscludes = ngSwitchController.cases['!' + value] || ngSwitchController.cases['?']) {
                scope.$eval(attr.change);
                forEach(selectedTranscludes, function (selectedTransclude) {
                  var selectedScope = scope.$new();
                  selectedScopes.push(selectedScope);
                  selectedTransclude.transclude(selectedScope, function (caseElement) {
                    var anchor = selectedTransclude.element;
                    selectedElements.push(caseElement);
                    $animate.enter(caseElement, anchor.parent(), anchor);
                  });
                });
              }
            });
          }
        };
      }
    ];
  var ngSwitchWhenDirective = ngDirective({
      transclude: 'element',
      priority: 800,
      require: '^ngSwitch',
      link: function (scope, element, attrs, ctrl, $transclude) {
        ctrl.cases['!' + attrs.ngSwitchWhen] = ctrl.cases['!' + attrs.ngSwitchWhen] || [];
        ctrl.cases['!' + attrs.ngSwitchWhen].push({
          transclude: $transclude,
          element: element
        });
      }
    });
  var ngSwitchDefaultDirective = ngDirective({
      transclude: 'element',
      priority: 800,
      require: '^ngSwitch',
      link: function (scope, element, attr, ctrl, $transclude) {
        ctrl.cases['?'] = ctrl.cases['?'] || [];
        ctrl.cases['?'].push({
          transclude: $transclude,
          element: element
        });
      }
    });
  var ngTranscludeDirective = ngDirective({
      controller: [
        '$element',
        '$transclude',
        function ($element, $transclude) {
          if (!$transclude) {
            throw minErr('ngTransclude')('orphan', 'Illegal use of ngTransclude directive in the template! ' + 'No parent directive that requires a transclusion found. ' + 'Element: {0}', startingTag($element));
          }
          this.$transclude = $transclude;
        }
      ],
      link: function ($scope, $element, $attrs, controller) {
        controller.$transclude(function (clone) {
          $element.empty();
          $element.append(clone);
        });
      }
    });
  var scriptDirective = [
      '$templateCache',
      function ($templateCache) {
        return {
          restrict: 'E',
          terminal: true,
          compile: function (element, attr) {
            if (attr.type == 'text/ng-template') {
              var templateUrl = attr.id, text = element[0].text;
              $templateCache.put(templateUrl, text);
            }
          }
        };
      }
    ];
  var ngOptionsMinErr = minErr('ngOptions');
  var ngOptionsDirective = valueFn({ terminal: true });
  var selectDirective = [
      '$compile',
      '$parse',
      function ($compile, $parse) {
        var NG_OPTIONS_REGEXP = /^\s*([\s\S]+?)(?:\s+as\s+([\s\S]+?))?(?:\s+group\s+by\s+([\s\S]+?))?\s+for\s+(?:([\$\w][\$\w]*)|(?:\(\s*([\$\w][\$\w]*)\s*,\s*([\$\w][\$\w]*)\s*\)))\s+in\s+([\s\S]+?)(?:\s+track\s+by\s+([\s\S]+?))?$/, nullModelCtrl = { $setViewValue: noop };
        return {
          restrict: 'E',
          require: [
            'select',
            '?ngModel'
          ],
          controller: [
            '$element',
            '$scope',
            '$attrs',
            function ($element, $scope, $attrs) {
              var self = this, optionsMap = {}, ngModelCtrl = nullModelCtrl, nullOption, unknownOption;
              self.databound = $attrs.ngModel;
              self.init = function (ngModelCtrl_, nullOption_, unknownOption_) {
                ngModelCtrl = ngModelCtrl_;
                nullOption = nullOption_;
                unknownOption = unknownOption_;
              };
              self.addOption = function (value) {
                assertNotHasOwnProperty(value, '"option value"');
                optionsMap[value] = true;
                if (ngModelCtrl.$viewValue == value) {
                  $element.val(value);
                  if (unknownOption.parent())
                    unknownOption.remove();
                }
              };
              self.removeOption = function (value) {
                if (this.hasOption(value)) {
                  delete optionsMap[value];
                  if (ngModelCtrl.$viewValue == value) {
                    this.renderUnknownOption(value);
                  }
                }
              };
              self.renderUnknownOption = function (val) {
                var unknownVal = '? ' + hashKey(val) + ' ?';
                unknownOption.val(unknownVal);
                $element.prepend(unknownOption);
                $element.val(unknownVal);
                unknownOption.prop('selected', true);
              };
              self.hasOption = function (value) {
                return optionsMap.hasOwnProperty(value);
              };
              $scope.$on('$destroy', function () {
                self.renderUnknownOption = noop;
              });
            }
          ],
          link: function (scope, element, attr, ctrls) {
            if (!ctrls[1])
              return;
            var selectCtrl = ctrls[0], ngModelCtrl = ctrls[1], multiple = attr.multiple, optionsExp = attr.ngOptions, nullOption = false, emptyOption, optionTemplate = jqLite(document.createElement('option')), optGroupTemplate = jqLite(document.createElement('optgroup')), unknownOption = optionTemplate.clone();
            for (var i = 0, children = element.children(), ii = children.length; i < ii; i++) {
              if (children[i].value === '') {
                emptyOption = nullOption = children.eq(i);
                break;
              }
            }
            selectCtrl.init(ngModelCtrl, nullOption, unknownOption);
            if (multiple) {
              ngModelCtrl.$isEmpty = function (value) {
                return !value || value.length === 0;
              };
            }
            if (optionsExp)
              setupAsOptions(scope, element, ngModelCtrl);
            else if (multiple)
              setupAsMultiple(scope, element, ngModelCtrl);
            else
              setupAsSingle(scope, element, ngModelCtrl, selectCtrl);
            function setupAsSingle(scope, selectElement, ngModelCtrl, selectCtrl) {
              ngModelCtrl.$render = function () {
                var viewValue = ngModelCtrl.$viewValue;
                if (selectCtrl.hasOption(viewValue)) {
                  if (unknownOption.parent())
                    unknownOption.remove();
                  selectElement.val(viewValue);
                  if (viewValue === '')
                    emptyOption.prop('selected', true);
                } else {
                  if (isUndefined(viewValue) && emptyOption) {
                    selectElement.val('');
                  } else {
                    selectCtrl.renderUnknownOption(viewValue);
                  }
                }
              };
              selectElement.on('change', function () {
                scope.$apply(function () {
                  if (unknownOption.parent())
                    unknownOption.remove();
                  ngModelCtrl.$setViewValue(selectElement.val());
                });
              });
            }
            function setupAsMultiple(scope, selectElement, ctrl) {
              var lastView;
              ctrl.$render = function () {
                var items = new HashMap(ctrl.$viewValue);
                forEach(selectElement.find('option'), function (option) {
                  option.selected = isDefined(items.get(option.value));
                });
              };
              scope.$watch(function selectMultipleWatch() {
                if (!equals(lastView, ctrl.$viewValue)) {
                  lastView = copy(ctrl.$viewValue);
                  ctrl.$render();
                }
              });
              selectElement.on('change', function () {
                scope.$apply(function () {
                  var array = [];
                  forEach(selectElement.find('option'), function (option) {
                    if (option.selected) {
                      array.push(option.value);
                    }
                  });
                  ctrl.$setViewValue(array);
                });
              });
            }
            function setupAsOptions(scope, selectElement, ctrl) {
              var match;
              if (!(match = optionsExp.match(NG_OPTIONS_REGEXP))) {
                throw ngOptionsMinErr('iexp', 'Expected expression in form of ' + '\'_select_ (as _label_)? for (_key_,)?_value_ in _collection_\'' + ' but got \'{0}\'. Element: {1}', optionsExp, startingTag(selectElement));
              }
              var displayFn = $parse(match[2] || match[1]), valueName = match[4] || match[6], keyName = match[5], groupByFn = $parse(match[3] || ''), valueFn = $parse(match[2] ? match[1] : valueName), valuesFn = $parse(match[7]), track = match[8], trackFn = track ? $parse(match[8]) : null, optionGroupsCache = [[{
                      element: selectElement,
                      label: ''
                    }]];
              if (nullOption) {
                $compile(nullOption)(scope);
                nullOption.removeClass('ng-scope');
                nullOption.remove();
              }
              selectElement.empty();
              selectElement.on('change', function () {
                scope.$apply(function () {
                  var optionGroup, collection = valuesFn(scope) || [], locals = {}, key, value, optionElement, index, groupIndex, length, groupLength, trackIndex;
                  if (multiple) {
                    value = [];
                    for (groupIndex = 0, groupLength = optionGroupsCache.length; groupIndex < groupLength; groupIndex++) {
                      optionGroup = optionGroupsCache[groupIndex];
                      for (index = 1, length = optionGroup.length; index < length; index++) {
                        if ((optionElement = optionGroup[index].element)[0].selected) {
                          key = optionElement.val();
                          if (keyName)
                            locals[keyName] = key;
                          if (trackFn) {
                            for (trackIndex = 0; trackIndex < collection.length; trackIndex++) {
                              locals[valueName] = collection[trackIndex];
                              if (trackFn(scope, locals) == key)
                                break;
                            }
                          } else {
                            locals[valueName] = collection[key];
                          }
                          value.push(valueFn(scope, locals));
                        }
                      }
                    }
                  } else {
                    key = selectElement.val();
                    if (key == '?') {
                      value = undefined;
                    } else if (key === '') {
                      value = null;
                    } else {
                      if (trackFn) {
                        for (trackIndex = 0; trackIndex < collection.length; trackIndex++) {
                          locals[valueName] = collection[trackIndex];
                          if (trackFn(scope, locals) == key) {
                            value = valueFn(scope, locals);
                            break;
                          }
                        }
                      } else {
                        locals[valueName] = collection[key];
                        if (keyName)
                          locals[keyName] = key;
                        value = valueFn(scope, locals);
                      }
                    }
                  }
                  ctrl.$setViewValue(value);
                });
              });
              ctrl.$render = render;
              scope.$watch(render);
              function render() {
                var optionGroups = { '': [] }, optionGroupNames = [''], optionGroupName, optionGroup, option, existingParent, existingOptions, existingOption, modelValue = ctrl.$modelValue, values = valuesFn(scope) || [], keys = keyName ? sortedKeys(values) : values, key, groupLength, length, groupIndex, index, locals = {}, selected, selectedSet = false, lastElement, element, label;
                if (multiple) {
                  if (trackFn && isArray(modelValue)) {
                    selectedSet = new HashMap([]);
                    for (var trackIndex = 0; trackIndex < modelValue.length; trackIndex++) {
                      locals[valueName] = modelValue[trackIndex];
                      selectedSet.put(trackFn(scope, locals), modelValue[trackIndex]);
                    }
                  } else {
                    selectedSet = new HashMap(modelValue);
                  }
                }
                for (index = 0; length = keys.length, index < length; index++) {
                  key = index;
                  if (keyName) {
                    key = keys[index];
                    if (key.charAt(0) === '$')
                      continue;
                    locals[keyName] = key;
                  }
                  locals[valueName] = values[key];
                  optionGroupName = groupByFn(scope, locals) || '';
                  if (!(optionGroup = optionGroups[optionGroupName])) {
                    optionGroup = optionGroups[optionGroupName] = [];
                    optionGroupNames.push(optionGroupName);
                  }
                  if (multiple) {
                    selected = isDefined(selectedSet.remove(trackFn ? trackFn(scope, locals) : valueFn(scope, locals)));
                  } else {
                    if (trackFn) {
                      var modelCast = {};
                      modelCast[valueName] = modelValue;
                      selected = trackFn(scope, modelCast) === trackFn(scope, locals);
                    } else {
                      selected = modelValue === valueFn(scope, locals);
                    }
                    selectedSet = selectedSet || selected;
                  }
                  label = displayFn(scope, locals);
                  label = isDefined(label) ? label : '';
                  optionGroup.push({
                    id: trackFn ? trackFn(scope, locals) : keyName ? keys[index] : index,
                    label: label,
                    selected: selected
                  });
                }
                if (!multiple) {
                  if (nullOption || modelValue === null) {
                    optionGroups[''].unshift({
                      id: '',
                      label: '',
                      selected: !selectedSet
                    });
                  } else if (!selectedSet) {
                    optionGroups[''].unshift({
                      id: '?',
                      label: '',
                      selected: true
                    });
                  }
                }
                for (groupIndex = 0, groupLength = optionGroupNames.length; groupIndex < groupLength; groupIndex++) {
                  optionGroupName = optionGroupNames[groupIndex];
                  optionGroup = optionGroups[optionGroupName];
                  if (optionGroupsCache.length <= groupIndex) {
                    existingParent = {
                      element: optGroupTemplate.clone().attr('label', optionGroupName),
                      label: optionGroup.label
                    };
                    existingOptions = [existingParent];
                    optionGroupsCache.push(existingOptions);
                    selectElement.append(existingParent.element);
                  } else {
                    existingOptions = optionGroupsCache[groupIndex];
                    existingParent = existingOptions[0];
                    if (existingParent.label != optionGroupName) {
                      existingParent.element.attr('label', existingParent.label = optionGroupName);
                    }
                  }
                  lastElement = null;
                  for (index = 0, length = optionGroup.length; index < length; index++) {
                    option = optionGroup[index];
                    if (existingOption = existingOptions[index + 1]) {
                      lastElement = existingOption.element;
                      if (existingOption.label !== option.label) {
                        lastElement.text(existingOption.label = option.label);
                      }
                      if (existingOption.id !== option.id) {
                        lastElement.val(existingOption.id = option.id);
                      }
                      if (lastElement[0].selected !== option.selected) {
                        lastElement.prop('selected', existingOption.selected = option.selected);
                      }
                    } else {
                      if (option.id === '' && nullOption) {
                        element = nullOption;
                      } else {
                        (element = optionTemplate.clone()).val(option.id).attr('selected', option.selected).text(option.label);
                      }
                      existingOptions.push(existingOption = {
                        element: element,
                        label: option.label,
                        id: option.id,
                        selected: option.selected
                      });
                      if (lastElement) {
                        lastElement.after(element);
                      } else {
                        existingParent.element.append(element);
                      }
                      lastElement = element;
                    }
                  }
                  index++;
                  while (existingOptions.length > index) {
                    existingOptions.pop().element.remove();
                  }
                }
                while (optionGroupsCache.length > groupIndex) {
                  optionGroupsCache.pop()[0].element.remove();
                }
              }
            }
          }
        };
      }
    ];
  var optionDirective = [
      '$interpolate',
      function ($interpolate) {
        var nullSelectCtrl = {
            addOption: noop,
            removeOption: noop
          };
        return {
          restrict: 'E',
          priority: 100,
          compile: function (element, attr) {
            if (isUndefined(attr.value)) {
              var interpolateFn = $interpolate(element.text(), true);
              if (!interpolateFn) {
                attr.$set('value', element.text());
              }
            }
            return function (scope, element, attr) {
              var selectCtrlName = '$selectController', parent = element.parent(), selectCtrl = parent.data(selectCtrlName) || parent.parent().data(selectCtrlName);
              if (selectCtrl && selectCtrl.databound) {
                element.prop('selected', false);
              } else {
                selectCtrl = nullSelectCtrl;
              }
              if (interpolateFn) {
                scope.$watch(interpolateFn, function interpolateWatchAction(newVal, oldVal) {
                  attr.$set('value', newVal);
                  if (newVal !== oldVal)
                    selectCtrl.removeOption(oldVal);
                  selectCtrl.addOption(newVal);
                });
              } else {
                selectCtrl.addOption(attr.value);
              }
              element.on('$destroy', function () {
                selectCtrl.removeOption(attr.value);
              });
            };
          }
        };
      }
    ];
  var styleDirective = valueFn({
      restrict: 'E',
      terminal: true
    });
  bindJQuery();
  publishExternalAPI(angular);
  jqLite(document).ready(function () {
    angularInit(document, bootstrap);
  });
}(window, document));
!angular.$$csp() && angular.element(document).find('head').prepend('<style type="text/css">@charset "UTF-8";[ng\\:cloak],[ng-cloak],[data-ng-cloak],[x-ng-cloak],.ng-cloak,.x-ng-cloak,.ng-hide{display:none !important;}ng\\:form{display:block;}</style>');
(function (window, angular, undefined) {
  'use strict';
  var ngRouteModule = angular.module('ngRoute', ['ng']).provider('$route', $RouteProvider);
  function $RouteProvider() {
    function inherit(parent, extra) {
      return angular.extend(new (angular.extend(function () {
      }, { prototype: parent }))(), extra);
    }
    var routes = {};
    this.when = function (path, route) {
      routes[path] = angular.extend({ reloadOnSearch: true }, route, path && pathRegExp(path, route));
      if (path) {
        var redirectPath = path[path.length - 1] == '/' ? path.substr(0, path.length - 1) : path + '/';
        routes[redirectPath] = angular.extend({ redirectTo: path }, pathRegExp(redirectPath, route));
      }
      return this;
    };
    function pathRegExp(path, opts) {
      var insensitive = opts.caseInsensitiveMatch, ret = {
          originalPath: path,
          regexp: path
        }, keys = ret.keys = [];
      path = path.replace(/([().])/g, '\\$1').replace(/(\/)?:(\w+)([\?\*])?/g, function (_, slash, key, option) {
        var optional = option === '?' ? option : null;
        var star = option === '*' ? option : null;
        keys.push({
          name: key,
          optional: !!optional
        });
        slash = slash || '';
        return '' + (optional ? '' : slash) + '(?:' + (optional ? slash : '') + (star && '(.+?)' || '([^/]+)') + (optional || '') + ')' + (optional || '');
      }).replace(/([\/$\*])/g, '\\$1');
      ret.regexp = new RegExp('^' + path + '$', insensitive ? 'i' : '');
      return ret;
    }
    this.otherwise = function (params) {
      this.when(null, params);
      return this;
    };
    this.$get = [
      '$rootScope',
      '$location',
      '$routeParams',
      '$q',
      '$injector',
      '$http',
      '$templateCache',
      '$sce',
      function ($rootScope, $location, $routeParams, $q, $injector, $http, $templateCache, $sce) {
        var forceReload = false, $route = {
            routes: routes,
            reload: function () {
              forceReload = true;
              $rootScope.$evalAsync(updateRoute);
            }
          };
        $rootScope.$on('$locationChangeSuccess', updateRoute);
        return $route;
        function switchRouteMatcher(on, route) {
          var keys = route.keys, params = {};
          if (!route.regexp)
            return null;
          var m = route.regexp.exec(on);
          if (!m)
            return null;
          for (var i = 1, len = m.length; i < len; ++i) {
            var key = keys[i - 1];
            var val = 'string' == typeof m[i] ? decodeURIComponent(m[i]) : m[i];
            if (key && val) {
              params[key.name] = val;
            }
          }
          return params;
        }
        function updateRoute() {
          var next = parseRoute(), last = $route.current;
          if (next && last && next.$$route === last.$$route && angular.equals(next.pathParams, last.pathParams) && !next.reloadOnSearch && !forceReload) {
            last.params = next.params;
            angular.copy(last.params, $routeParams);
            $rootScope.$broadcast('$routeUpdate', last);
          } else if (next || last) {
            forceReload = false;
            $rootScope.$broadcast('$routeChangeStart', next, last);
            $route.current = next;
            if (next) {
              if (next.redirectTo) {
                if (angular.isString(next.redirectTo)) {
                  $location.path(interpolate(next.redirectTo, next.params)).search(next.params).replace();
                } else {
                  $location.url(next.redirectTo(next.pathParams, $location.path(), $location.search())).replace();
                }
              }
            }
            $q.when(next).then(function () {
              if (next) {
                var locals = angular.extend({}, next.resolve), template, templateUrl;
                angular.forEach(locals, function (value, key) {
                  locals[key] = angular.isString(value) ? $injector.get(value) : $injector.invoke(value);
                });
                if (angular.isDefined(template = next.template)) {
                  if (angular.isFunction(template)) {
                    template = template(next.params);
                  }
                } else if (angular.isDefined(templateUrl = next.templateUrl)) {
                  if (angular.isFunction(templateUrl)) {
                    templateUrl = templateUrl(next.params);
                  }
                  templateUrl = $sce.getTrustedResourceUrl(templateUrl);
                  if (angular.isDefined(templateUrl)) {
                    next.loadedTemplateUrl = templateUrl;
                    template = $http.get(templateUrl, { cache: $templateCache }).then(function (response) {
                      return response.data;
                    });
                  }
                }
                if (angular.isDefined(template)) {
                  locals['$template'] = template;
                }
                return $q.all(locals);
              }
            }).then(function (locals) {
              if (next == $route.current) {
                if (next) {
                  next.locals = locals;
                  angular.copy(next.params, $routeParams);
                }
                $rootScope.$broadcast('$routeChangeSuccess', next, last);
              }
            }, function (error) {
              if (next == $route.current) {
                $rootScope.$broadcast('$routeChangeError', next, last, error);
              }
            });
          }
        }
        function parseRoute() {
          var params, match;
          angular.forEach(routes, function (route, path) {
            if (!match && (params = switchRouteMatcher($location.path(), route))) {
              match = inherit(route, {
                params: angular.extend({}, $location.search(), params),
                pathParams: params
              });
              match.$$route = route;
            }
          });
          return match || routes[null] && inherit(routes[null], {
            params: {},
            pathParams: {}
          });
        }
        function interpolate(string, params) {
          var result = [];
          angular.forEach((string || '').split(':'), function (segment, i) {
            if (i === 0) {
              result.push(segment);
            } else {
              var segmentMatch = segment.match(/(\w+)(.*)/);
              var key = segmentMatch[1];
              result.push(params[key]);
              result.push(segmentMatch[2] || '');
              delete params[key];
            }
          });
          return result.join('');
        }
      }
    ];
  }
  ngRouteModule.provider('$routeParams', $RouteParamsProvider);
  function $RouteParamsProvider() {
    this.$get = function () {
      return {};
    };
  }
  ngRouteModule.directive('ngView', ngViewFactory);
  ngRouteModule.directive('ngView', ngViewFillContentFactory);
  ngViewFactory.$inject = [
    '$route',
    '$anchorScroll',
    '$animate'
  ];
  function ngViewFactory($route, $anchorScroll, $animate) {
    return {
      restrict: 'ECA',
      terminal: true,
      priority: 400,
      transclude: 'element',
      link: function (scope, $element, attr, ctrl, $transclude) {
        var currentScope, currentElement, autoScrollExp = attr.autoscroll, onloadExp = attr.onload || '';
        scope.$on('$routeChangeSuccess', update);
        update();
        function cleanupLastView() {
          if (currentScope) {
            currentScope.$destroy();
            currentScope = null;
          }
          if (currentElement) {
            $animate.leave(currentElement);
            currentElement = null;
          }
        }
        function update() {
          var locals = $route.current && $route.current.locals, template = locals && locals.$template;
          if (angular.isDefined(template)) {
            var newScope = scope.$new();
            var current = $route.current;
            var clone = $transclude(newScope, function (clone) {
                $animate.enter(clone, null, currentElement || $element, function onNgViewEnter() {
                  if (angular.isDefined(autoScrollExp) && (!autoScrollExp || scope.$eval(autoScrollExp))) {
                    $anchorScroll();
                  }
                });
                cleanupLastView();
              });
            currentElement = clone;
            currentScope = current.scope = newScope;
            currentScope.$emit('$viewContentLoaded');
            currentScope.$eval(onloadExp);
          } else {
            cleanupLastView();
          }
        }
      }
    };
  }
  ngViewFillContentFactory.$inject = [
    '$compile',
    '$controller',
    '$route'
  ];
  function ngViewFillContentFactory($compile, $controller, $route) {
    return {
      restrict: 'ECA',
      priority: -400,
      link: function (scope, $element) {
        var current = $route.current, locals = current.locals;
        $element.html(locals.$template);
        var link = $compile($element.contents());
        if (current.controller) {
          locals.$scope = scope;
          var controller = $controller(current.controller, locals);
          if (current.controllerAs) {
            scope[current.controllerAs] = controller;
          }
          $element.data('$ngControllerController', controller);
          $element.children().data('$ngControllerController', controller);
        }
        link(scope);
      }
    };
  }
}(window, window.angular));
(function (window, angular, undefined) {
  'use strict';
  var ngTouch = angular.module('ngTouch', []);
  ngTouch.factory('$swipe', [function () {
      var MOVE_BUFFER_RADIUS = 10;
      function getCoordinates(event) {
        var touches = event.touches && event.touches.length ? event.touches : [event];
        var e = event.changedTouches && event.changedTouches[0] || event.originalEvent && event.originalEvent.changedTouches && event.originalEvent.changedTouches[0] || touches[0].originalEvent || touches[0];
        return {
          x: e.clientX,
          y: e.clientY
        };
      }
      return {
        bind: function (element, eventHandlers) {
          var totalX, totalY;
          var startCoords;
          var lastPos;
          var active = false;
          element.on('touchstart mousedown', function (event) {
            startCoords = getCoordinates(event);
            active = true;
            totalX = 0;
            totalY = 0;
            lastPos = startCoords;
            eventHandlers['start'] && eventHandlers['start'](startCoords, event);
          });
          element.on('touchcancel', function (event) {
            active = false;
            eventHandlers['cancel'] && eventHandlers['cancel'](event);
          });
          element.on('touchmove mousemove', function (event) {
            if (!active)
              return;
            if (!startCoords)
              return;
            var coords = getCoordinates(event);
            totalX += Math.abs(coords.x - lastPos.x);
            totalY += Math.abs(coords.y - lastPos.y);
            lastPos = coords;
            if (totalX < MOVE_BUFFER_RADIUS && totalY < MOVE_BUFFER_RADIUS) {
              return;
            }
            if (totalY > totalX) {
              active = false;
              eventHandlers['cancel'] && eventHandlers['cancel'](event);
              return;
            } else {
              event.preventDefault();
              eventHandlers['move'] && eventHandlers['move'](coords, event);
            }
          });
          element.on('touchend mouseup', function (event) {
            if (!active)
              return;
            active = false;
            eventHandlers['end'] && eventHandlers['end'](getCoordinates(event), event);
          });
        }
      };
    }]);
  ngTouch.config([
    '$provide',
    function ($provide) {
      $provide.decorator('ngClickDirective', [
        '$delegate',
        function ($delegate) {
          $delegate.shift();
          return $delegate;
        }
      ]);
    }
  ]);
  ngTouch.directive('ngClick', [
    '$parse',
    '$timeout',
    '$rootElement',
    function ($parse, $timeout, $rootElement) {
      var TAP_DURATION = 750;
      var MOVE_TOLERANCE = 12;
      var PREVENT_DURATION = 2500;
      var CLICKBUSTER_THRESHOLD = 25;
      var ACTIVE_CLASS_NAME = 'ng-click-active';
      var lastPreventedTime;
      var touchCoordinates;
      function hit(x1, y1, x2, y2) {
        return Math.abs(x1 - x2) < CLICKBUSTER_THRESHOLD && Math.abs(y1 - y2) < CLICKBUSTER_THRESHOLD;
      }
      function checkAllowableRegions(touchCoordinates, x, y) {
        for (var i = 0; i < touchCoordinates.length; i += 2) {
          if (hit(touchCoordinates[i], touchCoordinates[i + 1], x, y)) {
            touchCoordinates.splice(i, i + 2);
            return true;
          }
        }
        return false;
      }
      function onClick(event) {
        if (Date.now() - lastPreventedTime > PREVENT_DURATION) {
          return;
        }
        var touches = event.touches && event.touches.length ? event.touches : [event];
        var x = touches[0].clientX;
        var y = touches[0].clientY;
        if (x < 1 && y < 1) {
          return;
        }
        if (checkAllowableRegions(touchCoordinates, x, y)) {
          return;
        }
        event.stopPropagation();
        event.preventDefault();
        event.target && event.target.blur();
      }
      function onTouchStart(event) {
        var touches = event.touches && event.touches.length ? event.touches : [event];
        var x = touches[0].clientX;
        var y = touches[0].clientY;
        touchCoordinates.push(x, y);
        $timeout(function () {
          for (var i = 0; i < touchCoordinates.length; i += 2) {
            if (touchCoordinates[i] == x && touchCoordinates[i + 1] == y) {
              touchCoordinates.splice(i, i + 2);
              return;
            }
          }
        }, PREVENT_DURATION, false);
      }
      function preventGhostClick(x, y) {
        if (!touchCoordinates) {
          $rootElement[0].addEventListener('click', onClick, true);
          $rootElement[0].addEventListener('touchstart', onTouchStart, true);
          touchCoordinates = [];
        }
        lastPreventedTime = Date.now();
        checkAllowableRegions(touchCoordinates, x, y);
      }
      return function (scope, element, attr) {
        var clickHandler = $parse(attr.ngClick), tapping = false, tapElement, startTime, touchStartX, touchStartY;
        function resetState() {
          tapping = false;
          element.removeClass(ACTIVE_CLASS_NAME);
        }
        element.on('touchstart', function (event) {
          tapping = true;
          tapElement = event.target ? event.target : event.srcElement;
          if (tapElement.nodeType == 3) {
            tapElement = tapElement.parentNode;
          }
          element.addClass(ACTIVE_CLASS_NAME);
          startTime = Date.now();
          var touches = event.touches && event.touches.length ? event.touches : [event];
          var e = touches[0].originalEvent || touches[0];
          touchStartX = e.clientX;
          touchStartY = e.clientY;
        });
        element.on('touchmove', function (event) {
          resetState();
        });
        element.on('touchcancel', function (event) {
          resetState();
        });
        element.on('touchend', function (event) {
          var diff = Date.now() - startTime;
          var touches = event.changedTouches && event.changedTouches.length ? event.changedTouches : event.touches && event.touches.length ? event.touches : [event];
          var e = touches[0].originalEvent || touches[0];
          var x = e.clientX;
          var y = e.clientY;
          var dist = Math.sqrt(Math.pow(x - touchStartX, 2) + Math.pow(y - touchStartY, 2));
          if (tapping && diff < TAP_DURATION && dist < MOVE_TOLERANCE) {
            preventGhostClick(x, y);
            if (tapElement) {
              tapElement.blur();
            }
            if (!angular.isDefined(attr.disabled) || attr.disabled === false) {
              element.triggerHandler('click', [event]);
            }
          }
          resetState();
        });
        element.onclick = function (event) {
        };
        element.on('click', function (event, touchend) {
          scope.$apply(function () {
            clickHandler(scope, { $event: touchend || event });
          });
        });
        element.on('mousedown', function (event) {
          element.addClass(ACTIVE_CLASS_NAME);
        });
        element.on('mousemove mouseup', function (event) {
          element.removeClass(ACTIVE_CLASS_NAME);
        });
      };
    }
  ]);
  function makeSwipeDirective(directiveName, direction, eventName) {
    ngTouch.directive(directiveName, [
      '$parse',
      '$swipe',
      function ($parse, $swipe) {
        var MAX_VERTICAL_DISTANCE = 75;
        var MAX_VERTICAL_RATIO = 0.3;
        var MIN_HORIZONTAL_DISTANCE = 30;
        return function (scope, element, attr) {
          var swipeHandler = $parse(attr[directiveName]);
          var startCoords, valid;
          function validSwipe(coords) {
            if (!startCoords)
              return false;
            var deltaY = Math.abs(coords.y - startCoords.y);
            var deltaX = (coords.x - startCoords.x) * direction;
            return valid && deltaY < MAX_VERTICAL_DISTANCE && deltaX > 0 && deltaX > MIN_HORIZONTAL_DISTANCE && deltaY / deltaX < MAX_VERTICAL_RATIO;
          }
          $swipe.bind(element, {
            'start': function (coords, event) {
              startCoords = coords;
              valid = true;
            },
            'cancel': function (event) {
              valid = false;
            },
            'end': function (coords, event) {
              if (validSwipe(coords)) {
                scope.$apply(function () {
                  element.triggerHandler(eventName);
                  swipeHandler(scope, { $event: event });
                });
              }
            }
          });
        };
      }
    ]);
  }
  makeSwipeDirective('ngSwipeLeft', -1, 'swipeleft');
  makeSwipeDirective('ngSwipeRight', 1, 'swiperight');
}(window, window.angular));
(function (window, angular, undefined) {
  'use strict';
  var $sanitizeMinErr = angular.$$minErr('$sanitize');
  function $SanitizeProvider() {
    this.$get = [
      '$$sanitizeUri',
      function ($$sanitizeUri) {
        return function (html) {
          var buf = [];
          htmlParser(html, htmlSanitizeWriter(buf, function (uri, isImage) {
            return !/^unsafe/.test($$sanitizeUri(uri, isImage));
          }));
          return buf.join('');
        };
      }
    ];
  }
  function sanitizeText(chars) {
    var buf = [];
    var writer = htmlSanitizeWriter(buf, angular.noop);
    writer.chars(chars);
    return buf.join('');
  }
  var START_TAG_REGEXP = /^<\s*([\w:-]+)((?:\s+[\w:-]+(?:\s*=\s*(?:(?:"[^"]*")|(?:'[^']*')|[^>\s]+))?)*)\s*(\/?)\s*>/, END_TAG_REGEXP = /^<\s*\/\s*([\w:-]+)[^>]*>/, ATTR_REGEXP = /([\w:-]+)(?:\s*=\s*(?:(?:"((?:[^"])*)")|(?:'((?:[^'])*)')|([^>\s]+)))?/g, BEGIN_TAG_REGEXP = /^</, BEGING_END_TAGE_REGEXP = /^<\s*\//, COMMENT_REGEXP = /<!--(.*?)-->/g, DOCTYPE_REGEXP = /<!DOCTYPE([^>]*?)>/i, CDATA_REGEXP = /<!\[CDATA\[(.*?)]]>/g, NON_ALPHANUMERIC_REGEXP = /([^\#-~| |!])/g;
  var voidElements = makeMap('area,br,col,hr,img,wbr');
  var optionalEndTagBlockElements = makeMap('colgroup,dd,dt,li,p,tbody,td,tfoot,th,thead,tr'), optionalEndTagInlineElements = makeMap('rp,rt'), optionalEndTagElements = angular.extend({}, optionalEndTagInlineElements, optionalEndTagBlockElements);
  var blockElements = angular.extend({}, optionalEndTagBlockElements, makeMap('address,article,' + 'aside,blockquote,caption,center,del,dir,div,dl,figure,figcaption,footer,h1,h2,h3,h4,h5,' + 'h6,header,hgroup,hr,ins,map,menu,nav,ol,pre,script,section,table,ul'));
  var inlineElements = angular.extend({}, optionalEndTagInlineElements, makeMap('a,abbr,acronym,b,' + 'bdi,bdo,big,br,cite,code,del,dfn,em,font,i,img,ins,kbd,label,map,mark,q,ruby,rp,rt,s,' + 'samp,small,span,strike,strong,sub,sup,time,tt,u,var'));
  var specialElements = makeMap('script,style');
  var validElements = angular.extend({}, voidElements, blockElements, inlineElements, optionalEndTagElements);
  var uriAttrs = makeMap('background,cite,href,longdesc,src,usemap');
  var validAttrs = angular.extend({}, uriAttrs, makeMap('abbr,align,alt,axis,bgcolor,border,cellpadding,cellspacing,class,clear,' + 'color,cols,colspan,compact,coords,dir,face,headers,height,hreflang,hspace,' + 'ismap,lang,language,nohref,nowrap,rel,rev,rows,rowspan,rules,' + 'scope,scrolling,shape,size,span,start,summary,target,title,type,' + 'valign,value,vspace,width'));
  function makeMap(str) {
    var obj = {}, items = str.split(','), i;
    for (i = 0; i < items.length; i++)
      obj[items[i]] = true;
    return obj;
  }
  function htmlParser(html, handler) {
    var index, chars, match, stack = [], last = html;
    stack.last = function () {
      return stack[stack.length - 1];
    };
    while (html) {
      chars = true;
      if (!stack.last() || !specialElements[stack.last()]) {
        if (html.indexOf('<!--') === 0) {
          index = html.indexOf('--', 4);
          if (index >= 0 && html.lastIndexOf('-->', index) === index) {
            if (handler.comment)
              handler.comment(html.substring(4, index));
            html = html.substring(index + 3);
            chars = false;
          }
        } else if (DOCTYPE_REGEXP.test(html)) {
          match = html.match(DOCTYPE_REGEXP);
          if (match) {
            html = html.replace(match[0], '');
            chars = false;
          }
        } else if (BEGING_END_TAGE_REGEXP.test(html)) {
          match = html.match(END_TAG_REGEXP);
          if (match) {
            html = html.substring(match[0].length);
            match[0].replace(END_TAG_REGEXP, parseEndTag);
            chars = false;
          }
        } else if (BEGIN_TAG_REGEXP.test(html)) {
          match = html.match(START_TAG_REGEXP);
          if (match) {
            html = html.substring(match[0].length);
            match[0].replace(START_TAG_REGEXP, parseStartTag);
            chars = false;
          }
        }
        if (chars) {
          index = html.indexOf('<');
          var text = index < 0 ? html : html.substring(0, index);
          html = index < 0 ? '' : html.substring(index);
          if (handler.chars)
            handler.chars(decodeEntities(text));
        }
      } else {
        html = html.replace(new RegExp('(.*)<\\s*\\/\\s*' + stack.last() + '[^>]*>', 'i'), function (all, text) {
          text = text.replace(COMMENT_REGEXP, '$1').replace(CDATA_REGEXP, '$1');
          if (handler.chars)
            handler.chars(decodeEntities(text));
          return '';
        });
        parseEndTag('', stack.last());
      }
      if (html == last) {
        throw $sanitizeMinErr('badparse', 'The sanitizer was unable to parse the following block ' + 'of html: {0}', html);
      }
      last = html;
    }
    parseEndTag();
    function parseStartTag(tag, tagName, rest, unary) {
      tagName = angular.lowercase(tagName);
      if (blockElements[tagName]) {
        while (stack.last() && inlineElements[stack.last()]) {
          parseEndTag('', stack.last());
        }
      }
      if (optionalEndTagElements[tagName] && stack.last() == tagName) {
        parseEndTag('', tagName);
      }
      unary = voidElements[tagName] || !!unary;
      if (!unary)
        stack.push(tagName);
      var attrs = {};
      rest.replace(ATTR_REGEXP, function (match, name, doubleQuotedValue, singleQuotedValue, unquotedValue) {
        var value = doubleQuotedValue || singleQuotedValue || unquotedValue || '';
        attrs[name] = decodeEntities(value);
      });
      if (handler.start)
        handler.start(tagName, attrs, unary);
    }
    function parseEndTag(tag, tagName) {
      var pos = 0, i;
      tagName = angular.lowercase(tagName);
      if (tagName)
        for (pos = stack.length - 1; pos >= 0; pos--)
          if (stack[pos] == tagName)
            break;
      if (pos >= 0) {
        for (i = stack.length - 1; i >= pos; i--)
          if (handler.end)
            handler.end(stack[i]);
        stack.length = pos;
      }
    }
  }
  var hiddenPre = document.createElement('pre');
  var spaceRe = /^(\s*)([\s\S]*?)(\s*)$/;
  function decodeEntities(value) {
    if (!value) {
      return '';
    }
    var parts = spaceRe.exec(value);
    var spaceBefore = parts[1];
    var spaceAfter = parts[3];
    var content = parts[2];
    if (content) {
      hiddenPre.innerHTML = content.replace(/</g, '&lt;');
      content = 'textContent' in hiddenPre ? hiddenPre.textContent : hiddenPre.innerText;
    }
    return spaceBefore + content + spaceAfter;
  }
  function encodeEntities(value) {
    return value.replace(/&/g, '&amp;').replace(NON_ALPHANUMERIC_REGEXP, function (value) {
      return '&#' + value.charCodeAt(0) + ';';
    }).replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
  function htmlSanitizeWriter(buf, uriValidator) {
    var ignore = false;
    var out = angular.bind(buf, buf.push);
    return {
      start: function (tag, attrs, unary) {
        tag = angular.lowercase(tag);
        if (!ignore && specialElements[tag]) {
          ignore = tag;
        }
        if (!ignore && validElements[tag] === true) {
          out('<');
          out(tag);
          angular.forEach(attrs, function (value, key) {
            var lkey = angular.lowercase(key);
            var isImage = tag === 'img' && lkey === 'src' || lkey === 'background';
            if (validAttrs[lkey] === true && (uriAttrs[lkey] !== true || uriValidator(value, isImage))) {
              out(' ');
              out(key);
              out('="');
              out(encodeEntities(value));
              out('"');
            }
          });
          out(unary ? '/>' : '>');
        }
      },
      end: function (tag) {
        tag = angular.lowercase(tag);
        if (!ignore && validElements[tag] === true) {
          out('</');
          out(tag);
          out('>');
        }
        if (tag == ignore) {
          ignore = false;
        }
      },
      chars: function (chars) {
        if (!ignore) {
          out(encodeEntities(chars));
        }
      }
    };
  }
  angular.module('ngSanitize', []).provider('$sanitize', $SanitizeProvider);
  angular.module('ngSanitize').filter('linky', [
    '$sanitize',
    function ($sanitize) {
      var LINKY_URL_REGEXP = /((ftp|https?):\/\/|(mailto:)?[A-Za-z0-9._%+-]+@)\S*[^\s.;,(){}<>]/, MAILTO_REGEXP = /^mailto:/;
      return function (text, target) {
        if (!text)
          return text;
        var match;
        var raw = text;
        var html = [];
        var url;
        var i;
        while (match = raw.match(LINKY_URL_REGEXP)) {
          url = match[0];
          if (match[2] == match[3])
            url = 'mailto:' + url;
          i = match.index;
          addText(raw.substr(0, i));
          addLink(url, match[0].replace(MAILTO_REGEXP, ''));
          raw = raw.substring(i + match[0].length);
        }
        addText(raw);
        return $sanitize(html.join(''));
        function addText(text) {
          if (!text) {
            return;
          }
          html.push(sanitizeText(text));
        }
        function addLink(url, text) {
          html.push('<a ');
          if (angular.isDefined(target)) {
            html.push('target="');
            html.push(target);
            html.push('" ');
          }
          html.push('href="');
          html.push(url);
          html.push('">');
          addText(text);
          html.push('</a>');
        }
      };
    }
  ]);
}(window, window.angular));
angular.module('ajoslin.mobile-navigate', []).run([
  '$navigate',
  '$rootScope',
  function ($navigate, $rootScope) {
    document.addEventListener('deviceready', function () {
      document.addEventListener('backbutton', function () {
        $rootScope.$apply(function () {
          var backSuccess = $navigate.back();
          if (!backSuccess) {
            navigator.app.exitApp();
          }
        });
      });
    });
  }
]);
angular.module('ajoslin.mobile-navigate').provider('$change', function () {
  var transitionPresets = {
      'modal': [
        'modal',
        ''
      ],
      'none': [
        '',
        ''
      ]
    };
  var defaultOptions = { 'prefix': 'mb-' };
  var IN_CLASS = 'in';
  var OUT_CLASS = 'out';
  var REVERSE_CLASS = 'reverse';
  var DONE_CLASS = 'done';
  var ANIMATION_END = 'animationName' in document.documentElement.style ? 'animationend' : 'webkitAnimationEnd';
  this.setTransitionPreset = function (transitionName, inClass, outClass) {
    inClass = inClass || '';
    outClass = outClass || inClass;
    transitionPresets[transitionName] = [
      inClass,
      outClass
    ];
  };
  this.options = function (opts) {
    defaultOptions = angular.extend(defaultOptions, opts || {});
  };
  this.$get = [
    '$q',
    '$rootScope',
    function ($q, $rootScope) {
      return function change(next, prev, transType, reverse, options) {
        options = angular.extend(options || {}, defaultOptions);
        var deferred = $q.defer(), nextTransClass, prevTransClass;
        function buildClassString(classes) {
          return classes.reduce(function (accumulator, cls) {
            return accumulator + (cls ? ' ' + options.prefix + cls : '');
          }, '');
        }
        var transition = transitionPresets[transType] ? transitionPresets[transType] : [
            transType,
            transType
          ];
        next.css('z-index', '-100');
        next[0].offsetWidth += 0;
        var nextClasses = buildClassString([
            reverse ? OUT_CLASS : IN_CLASS,
            nextTransClass = transition[reverse ? 1 : 0],
            reverse && REVERSE_CLASS || ''
          ]);
        next.addClass(nextClasses);
        var prevClasses;
        if (prev) {
          prevClasses = buildClassString([
            reverse ? IN_CLASS : OUT_CLASS,
            prevTransClass = transition[reverse ? 0 : 1],
            reverse && REVERSE_CLASS || ''
          ]);
          prev.addClass(prevClasses);
        }
        next.css('z-index', '');
        next[0].offsetWidth += 0;
        function done() {
          $rootScope.$apply(function () {
            deferred.resolve();
          });
        }
        var boundElement;
        if (nextTransClass && nextTransClass.length) {
          (boundElement = next).bind(ANIMATION_END, done);
        } else if (prev && prevTransClass && prevTransClass.length) {
          (boundElement = prev).bind(ANIMATION_END, done);
        } else {
          deferred.resolve();
        }
        deferred.promise.then(function () {
          boundElement && boundElement.unbind(ANIMATION_END, done);
          next.removeClass(nextClasses);
          prev && prev.removeClass(prevClasses);
        });
        deferred.promise.cancel = function () {
          deferred.resolve();
        };
        return deferred.promise;
      };
    }
  ];
});
angular.module('ajoslin.mobile-navigate').provider('$navigate', function () {
  this.$get = [
    '$rootScope',
    '$location',
    '$route',
    function ($rootScope, $location, $route) {
      var nav = {}, navHistory = [];
      function Page(path, transition, isReverse) {
        var _path = path, _transition = transition || 'slide', _isReverse = isReverse, _onceTransition;
        this.transition = function () {
          var trans;
          if (_onceTransition) {
            trans = _onceTransition;
            _onceTransition = null;
          } else {
            trans = _transition;
          }
          return trans;
        };
        this.path = function () {
          return _path;
        };
        this.reverse = function () {
          return _isReverse;
        };
        this.transitionOnce = function (trans) {
          _onceTransition = trans;
        };
      }
      function navigate(destination, source, isBack) {
        $rootScope.$broadcast('$pageTransitionStart', destination, source, isBack);
        nav.current = nav.next;
      }
      nav.onRouteSuccess = null;
      function defaultRouteSuccess($event, next, last) {
        nav.current && navHistory.push(nav.current);
        nav.next = new Page($location.path());
        nav.next.transitionOnce('none');
        navigate(nav.next);
        nav.onRouteSuccess = null;
      }
      $rootScope.$on('$routeChangeSuccess', function ($event, next, last) {
        if (!next.$$route || !next.$$route.redirectTo) {
          (nav.onRouteSuccess || defaultRouteSuccess)($event, next, last);
        }
      });
      nav.go = function go(path, transition, isReverse) {
        if (typeof transition == 'boolean') {
          isReverse = transition;
          transition = null;
        }
        $location.path(path);
        nav.onRouteSuccess = function ($event, next, last) {
          nav.current && navHistory.push(nav.current);
          nav.next = new Page(path, transition || next.$$route && next.$$route.transition, isReverse);
          navigate(nav.next, nav.current, false);
        };
      };
      nav.eraseHistory = function () {
        navHistory.length = 0;
      };
      nav.back = function () {
        if (navHistory.length > 0) {
          var previous = navHistory[navHistory.length - 1];
          $location.path(previous.path());
          nav.onRouteSuccess = function () {
            navHistory.pop();
            nav.next = previous;
            navigate(nav.next, nav.current, true);
          };
          return true;
        }
        return false;
      };
      return nav;
    }
  ];
});
angular.module('ajoslin.mobile-navigate').directive('mobileView', [
  '$rootScope',
  '$compile',
  '$controller',
  '$route',
  '$change',
  '$q',
  function ($rootScope, $compile, $controller, $route, $change, $q) {
    function link(scope, viewElement, attrs) {
      function insertPage(page) {
        var current = $route.current, locals = current && current.locals;
        page.element = angular.element(document.createElement('div'));
        page.element.html(locals.$template);
        page.element.addClass('mb-page');
        page.scope = scope.$new();
        if (current.controller) {
          locals.$scope = page.scope;
          page.controller = $controller(current.controller, locals);
          page.element.contents().data('$ngControllerController', page.controller);
        }
        $compile(page.element.contents())(page.scope);
        if (locals && locals.$template) {
          viewElement.append(page.element);
        }
        page.scope.$emit('$viewContentLoaded');
        page.scope.$eval(attrs.onLoad);
        return page;
      }
      var currentTrans;
      scope.$on('$pageTransitionStart', function ($event, dest, source, reverse) {
        function changePage() {
          var current = $route.current && $route.current.$$route || {};
          var transition = reverse ? source.transition() : dest.transition();
          insertPage(dest);
          if (dest.reverse() || current.reverse) {
            reverse = !reverse;
          }
          function doTransition() {
            var promise = $change(dest.element, source ? source.element : null, transition, reverse);
            promise.then(function () {
              if (source) {
                $rootScope.$broadcast('$pageTransitionSuccess', dest, source);
                source.scope.$destroy();
                source.element.remove();
                source = undefined;
              }
            });
            return promise;
          }
          dest.element.css('display', 'none');
          var deferTransitionPromise = scope.$eval(attrs.deferTransition) || $q.when();
          deferTransitionPromise.cancel = function () {
            cancelled = true;
            dest.element.css('display', '');
          };
          var cancelled = false;
          deferTransitionPromise.then(function () {
            if (!cancelled) {
              dest.element.css('display', '');
              return doTransition();
            }
          });
          return deferTransitionPromise;
        }
        currentTrans && currentTrans.cancel();
        currentTrans = changePage(dest, source, reverse);
      });
    }
    return {
      restrict: 'EA',
      link: link
    };
  }
]).directive('scrollable', [
  '$route',
  function ($route) {
    var scrollCache = {};
    return {
      restrict: 'EA',
      link: function (scope, elm, attrs) {
        var route = $route.current ? $route.current.$$route : {};
        var template = route.templateUrl || route.template;
        var rawElm = elm[0];
        if (template) {
          setTimeout(function () {
            var oldScroll = scrollCache[template];
            if (oldScroll) {
              rawElm.scrollTop = oldScroll;
            }
          });
          scope.$on('$destroy', function () {
            scrollCache[template] = rawElm.scrollTop;
          });
        }
      }
    };
  }
]);
angular.module('pascalprecht.translate', ['ng']).run([
  '$translate',
  function ($translate) {
    var key = $translate.storageKey(), storage = $translate.storage();
    if (storage) {
      if (!storage.get(key)) {
        if (angular.isString($translate.preferredLanguage())) {
          $translate.uses($translate.preferredLanguage());
        } else {
          storage.set(key, $translate.uses());
        }
      } else {
        $translate.uses(storage.get(key));
      }
    } else if (angular.isString($translate.preferredLanguage())) {
      $translate.uses($translate.preferredLanguage());
    }
  }
]);
angular.module('pascalprecht.translate').provider('$translate', [
  '$STORAGE_KEY',
  function ($STORAGE_KEY) {
    var $translationTable = {}, $preferredLanguage, $fallbackLanguage, $uses, $nextLang, $storageFactory, $storageKey = $STORAGE_KEY, $storagePrefix, $missingTranslationHandlerFactory, $interpolationFactory, $interpolatorFactories = [], $loaderFactory, $loaderOptions, $notFoundIndicatorLeft, $notFoundIndicatorRight, NESTED_OBJECT_DELIMITER = '.';
    var translations = function (langKey, translationTable) {
      if (!langKey && !translationTable) {
        return $translationTable;
      }
      if (langKey && !translationTable) {
        if (angular.isString(langKey)) {
          return $translationTable[langKey];
        } else {
          angular.extend($translationTable, flatObject(langKey));
        }
      } else {
        if (!angular.isObject($translationTable[langKey])) {
          $translationTable[langKey] = {};
        }
        angular.extend($translationTable[langKey], flatObject(translationTable));
      }
      return this;
    };
    var flatObject = function (data, path, result, prevKey) {
      var key, keyWithPath, val;
      if (!path) {
        path = [];
      }
      if (!result) {
        result = {};
      }
      for (key in data) {
        if (!data.hasOwnProperty(key))
          continue;
        val = data[key];
        if (angular.isObject(val)) {
          flatObject(val, path.concat(key), result, key);
        } else {
          keyWithPath = path.length ? '' + path.join(NESTED_OBJECT_DELIMITER) + NESTED_OBJECT_DELIMITER + key : key;
          if (path.length && key === prevKey) {
            keyWithShortPath = '' + path.join(NESTED_OBJECT_DELIMITER);
            result[keyWithShortPath] = '@:' + keyWithPath;
          }
          result[keyWithPath] = val;
        }
      }
      return result;
    };
    this.translations = translations;
    this.addInterpolation = function (factory) {
      $interpolatorFactories.push(factory);
      return this;
    };
    this.useMessageFormatInterpolation = function () {
      return this.useInterpolation('$translateMessageFormatInterpolation');
    };
    this.useInterpolation = function (factory) {
      $interpolationFactory = factory;
      return this;
    };
    this.preferredLanguage = function (langKey) {
      if (langKey) {
        $preferredLanguage = langKey;
        return this;
      } else {
        return $preferredLanguage;
      }
    };
    this.translationNotFoundIndicator = function (indicator) {
      this.translationNotFoundIndicatorLeft(indicator);
      this.translationNotFoundIndicatorRight(indicator);
      return this;
    };
    this.translationNotFoundIndicatorLeft = function (indicator) {
      if (!indicator) {
        return $notFoundIndicatorLeft;
      }
      $notFoundIndicatorLeft = indicator;
      return this;
    };
    this.translationNotFoundIndicatorRight = function (indicator) {
      if (!indicator) {
        return $notFoundIndicatorRight;
      }
      $notFoundIndicatorRight = indicator;
      return this;
    };
    this.fallbackLanguage = function (langKey) {
      if (langKey) {
        if (typeof langKey === 'string' || angular.isArray(langKey)) {
          $fallbackLanguage = langKey;
        } else {
        }
        return this;
      } else {
        return $fallbackLanguage;
      }
    };
    this.uses = function (langKey) {
      if (langKey) {
        if (!$translationTable[langKey] && !$loaderFactory) {
          throw new Error('$translateProvider couldn\'t find translationTable for langKey: \'' + langKey + '\'');
        }
        $uses = langKey;
        return this;
      } else {
        return $uses;
      }
    };
    var storageKey = function (key) {
      if (!key) {
        if ($storagePrefix) {
          return $storagePrefix + $storageKey;
        }
        return $storageKey;
      }
      $storageKey = key;
    };
    this.storageKey = storageKey;
    this.useUrlLoader = function (url) {
      return this.useLoader('$translateUrlLoader', { url: url });
    };
    this.useStaticFilesLoader = function (options) {
      return this.useLoader('$translateStaticFilesLoader', options);
    };
    this.useLoader = function (loaderFactory, options) {
      $loaderFactory = loaderFactory;
      $loaderOptions = options || {};
      return this;
    };
    this.useLocalStorage = function () {
      return this.useStorage('$translateLocalStorage');
    };
    this.useCookieStorage = function () {
      return this.useStorage('$translateCookieStorage');
    };
    this.useStorage = function (storageFactory) {
      $storageFactory = storageFactory;
      return this;
    };
    this.storagePrefix = function (prefix) {
      if (!prefix) {
        return prefix;
      }
      $storagePrefix = prefix;
      return this;
    };
    this.useMissingTranslationHandlerLog = function () {
      return this.useMissingTranslationHandler('$translateMissingTranslationHandlerLog');
    };
    this.useMissingTranslationHandler = function (factory) {
      $missingTranslationHandlerFactory = factory;
      return this;
    };
    this.$get = [
      '$log',
      '$injector',
      '$rootScope',
      '$q',
      function ($log, $injector, $rootScope, $q) {
        var Storage, defaultInterpolator = $injector.get($interpolationFactory || '$translateDefaultInterpolation'), pendingLoader = false, interpolatorHashMap = {};
        var loadAsync = function (key) {
          if (!key) {
            throw 'No language key specified for loading.';
          }
          var deferred = $q.defer();
          $rootScope.$broadcast('$translateLoadingStart');
          pendingLoader = true;
          $injector.get($loaderFactory)(angular.extend($loaderOptions, { key: key })).then(function (data) {
            $rootScope.$broadcast('$translateLoadingSuccess');
            var translationTable = {};
            if (angular.isArray(data)) {
              angular.forEach(data, function (table) {
                angular.extend(translationTable, table);
              });
            } else {
              angular.extend(translationTable, data);
            }
            pendingLoader = false;
            deferred.resolve({
              key: key,
              table: translationTable
            });
            $rootScope.$broadcast('$translateLoadingEnd');
          }, function (key) {
            $rootScope.$broadcast('$translateLoadingError');
            deferred.reject(key);
            $rootScope.$broadcast('$translateLoadingEnd');
          });
          return deferred.promise;
        };
        if ($storageFactory) {
          Storage = $injector.get($storageFactory);
          if (!Storage.get || !Storage.set) {
            throw new Error('Couldn\'t use storage \'' + $storageFactory + '\', missing get() or set() method!');
          }
        }
        if ($interpolatorFactories.length > 0) {
          angular.forEach($interpolatorFactories, function (interpolatorFactory) {
            var interpolator = $injector.get(interpolatorFactory);
            interpolator.setLocale($preferredLanguage || $uses);
            interpolatorHashMap[interpolator.getInterpolationIdentifier()] = interpolator;
          });
        }
        var checkValidFallback = function (usesLang) {
          if (usesLang && $fallbackLanguage) {
            if (angular.isArray($fallbackLanguage)) {
              var fallbackLanguagesSize = $fallbackLanguage.length;
              for (var current = 0; current < fallbackLanguagesSize; current++) {
                if ($uses === $translationTable[$fallbackLanguage[current]]) {
                  return false;
                }
              }
              return true;
            } else {
              return usesLang !== $fallbackLanguage;
            }
          } else {
            return false;
          }
          return false;
        };
        var $translate = function (translationId, interpolateParams, interpolationId) {
          var table = $uses ? $translationTable[$uses] : $translationTable, Interpolator = interpolationId ? interpolatorHashMap[interpolationId] : defaultInterpolator;
          if (table && table.hasOwnProperty(translationId)) {
            if (angular.isString(table[translationId]) && table[translationId].substr(0, 2) === '@:') {
              return $translate(table[translationId].substr(2), interpolateParams, interpolationId);
            }
            return Interpolator.interpolate(table[translationId], interpolateParams);
          }
          if ($missingTranslationHandlerFactory && !pendingLoader) {
            $injector.get($missingTranslationHandlerFactory)(translationId, $uses);
          }
          var normatedLanguages;
          if ($uses && $fallbackLanguage && checkValidFallback($uses)) {
            if (typeof $fallbackLanguage === 'string') {
              normatedLanguages = [];
              normatedLanguages.push($fallbackLanguage);
            } else {
              normatedLanguages = $fallbackLanguage;
            }
            var fallbackLanguagesSize = normatedLanguages.length;
            for (var current = 0; current < fallbackLanguagesSize; current++) {
              if ($uses !== $translationTable[normatedLanguages[current]]) {
                var translationFromList = $translationTable[normatedLanguages[current]][translationId];
                if (translationFromList) {
                  var returnValFromList;
                  Interpolator.setLocale(normatedLanguages[current]);
                  returnValFromList = Interpolator.interpolate(translationFromList, interpolateParams);
                  Interpolator.setLocale($uses);
                  return returnValFromList;
                }
              }
            }
          }
          if ($notFoundIndicatorLeft) {
            translationId = [
              $notFoundIndicatorLeft,
              translationId
            ].join(' ');
          }
          if ($notFoundIndicatorRight) {
            translationId = [
              translationId,
              $notFoundIndicatorRight
            ].join(' ');
          }
          return translationId;
        };
        $translate.preferredLanguage = function () {
          return $preferredLanguage;
        };
        $translate.fallbackLanguage = function () {
          return $fallbackLanguage;
        };
        $translate.proposedLanguage = function () {
          return $nextLang;
        };
        $translate.storage = function () {
          return Storage;
        };
        $translate.uses = function (key) {
          if (!key) {
            return $uses;
          }
          var deferred = $q.defer();
          $rootScope.$broadcast('$translateChangeStart');
          function useLanguage(key) {
            $uses = key;
            $rootScope.$broadcast('$translateChangeSuccess');
            if ($storageFactory) {
              Storage.set($translate.storageKey(), $uses);
            }
            defaultInterpolator.setLocale($uses);
            angular.forEach(interpolatorHashMap, function (interpolator, id) {
              interpolatorHashMap[id].setLocale($uses);
            });
            deferred.resolve(key);
            $rootScope.$broadcast('$translateChangeEnd');
          }
          if (!$translationTable[key] && $loaderFactory) {
            $nextLang = key;
            loadAsync(key).then(function (translation) {
              $nextLang = undefined;
              translations(translation.key, translation.table);
              useLanguage(translation.key);
            }, function (key) {
              $nextLang = undefined;
              $rootScope.$broadcast('$translateChangeError');
              deferred.reject(key);
              $rootScope.$broadcast('$translateChangeEnd');
            });
          } else {
            useLanguage(key);
          }
          return deferred.promise;
        };
        $translate.storageKey = function () {
          return storageKey();
        };
        $translate.refresh = function (langKey) {
          if (!$loaderFactory) {
            throw new Error('Couldn\'t refresh translation table, no loader registered!');
          }
          var deferred = $q.defer();
          function onLoadSuccess() {
            deferred.resolve();
            $rootScope.$broadcast('$translateRefreshEnd');
          }
          function onLoadFailure() {
            deferred.reject();
            $rootScope.$broadcast('$translateRefreshEnd');
          }
          if (!langKey) {
            $rootScope.$broadcast('$translateRefreshStart');
            var loaders = [];
            if ($fallbackLanguage) {
              if (typeof $fallbackLanguage === 'string') {
                loaders.push(loadAsync($fallbackLanguage));
              } else {
                var fallbackLanguagesSize = $fallbackLanguage.length;
                for (var current = 0; current < fallbackLanguagesSize; current++) {
                  loaders.push(loadAsync($fallbackLanguage[current]));
                }
              }
            }
            if ($uses) {
              loaders.push(loadAsync($uses));
            }
            if (loaders.length > 0) {
              $q.all(loaders).then(function (newTranslations) {
                for (var lang in $translationTable) {
                  if ($translationTable.hasOwnProperty(lang)) {
                    delete $translationTable[lang];
                  }
                }
                for (var i = 0, len = newTranslations.length; i < len; i++) {
                  translations(newTranslations[i].key, newTranslations[i].table);
                }
                if ($uses) {
                  $translate.uses($uses);
                }
                onLoadSuccess();
              }, function (key) {
                if (key === $uses) {
                  $rootScope.$broadcast('$translateChangeError');
                }
                onLoadFailure();
              });
            } else
              onLoadSuccess();
          } else if ($translationTable.hasOwnProperty(langKey)) {
            $rootScope.$broadcast('$translateRefreshStart');
            var loader = loadAsync(langKey);
            if (langKey === $uses) {
              loader.then(function (newTranslation) {
                $translationTable[langKey] = newTranslation.table;
                $translate.uses($uses);
                onLoadSuccess();
              }, function () {
                $rootScope.$broadcast('$translateChangeError');
                onLoadFailure();
              });
            } else {
              loader.then(function (newTranslation) {
                $translationTable[langKey] = newTranslation.table;
                onLoadSuccess();
              }, onLoadFailure);
            }
          } else
            deferred.reject();
          return deferred.promise;
        };
        if ($loaderFactory) {
          if (angular.equals($translationTable, {})) {
            $translate.uses($translate.uses());
          }
          if ($fallbackLanguage) {
            if (typeof $fallbackLanguage === 'string' && !$translationTable[$fallbackLanguage]) {
              loadAsync($fallbackLanguage);
            } else {
              var fallbackLanguagesSize = $fallbackLanguage.length;
              for (var current = 0; current < fallbackLanguagesSize; current++) {
                if (!$translationTable[$fallbackLanguage[current]]) {
                  loadAsync($fallbackLanguage[current]);
                }
              }
            }
          }
        }
        return $translate;
      }
    ];
  }
]);
angular.module('pascalprecht.translate').factory('$translateDefaultInterpolation', [
  '$interpolate',
  function ($interpolate) {
    var $translateInterpolator = {}, $locale, $identifier = 'default';
    $translateInterpolator.setLocale = function (locale) {
      $locale = locale;
    };
    $translateInterpolator.getInterpolationIdentifier = function () {
      return $identifier;
    };
    $translateInterpolator.interpolate = function (string, interpolateParams) {
      return $interpolate(string)(interpolateParams);
    };
    return $translateInterpolator;
  }
]);
angular.module('pascalprecht.translate').constant('$STORAGE_KEY', 'NG_TRANSLATE_LANG_KEY');
angular.module('pascalprecht.translate').directive('translate', [
  '$filter',
  '$interpolate',
  '$parse',
  function ($filter, $interpolate, $parse) {
    var translate = $filter('translate');
    return {
      restrict: 'AE',
      scope: true,
      link: function linkFn(scope, element, attr) {
        if (attr.translateInterpolation) {
          scope.interpolation = attr.translateInterpolation;
        }
        attr.$observe('translate', function (translationId) {
          if (angular.equals(translationId, '') || translationId === undefined) {
            scope.translationId = $interpolate(element.text().replace(/^\s+|\s+$/g, ''))(scope.$parent);
          } else {
            scope.translationId = translationId;
          }
        });
        attr.$observe('translateValues', function (interpolateParams) {
          if (interpolateParams)
            scope.$parent.$watch(function () {
              scope.interpolateParams = $parse(interpolateParams)(scope.$parent);
            });
        });
        scope.$on('$translateChangeSuccess', function () {
          element.html(translate(scope.translationId, scope.interpolateParams, scope.interpolation));
        });
        scope.$watch('[translationId, interpolateParams]', function (nValue) {
          if (scope.translationId) {
            element.html(translate(scope.translationId, scope.interpolateParams, scope.interpolation));
          }
        }, true);
      }
    };
  }
]);
angular.module('pascalprecht.translate').filter('translate', [
  '$parse',
  '$translate',
  function ($parse, $translate) {
    return function (translationId, interpolateParams, interpolation) {
      if (!angular.isObject(interpolateParams)) {
        interpolateParams = $parse(interpolateParams)();
      }
      return $translate(translationId, interpolateParams, interpolation);
    };
  }
]);
function FastClick(layer) {
  'use strict';
  var oldOnClick, self = this;
  this.trackingClick = false;
  this.trackingClickStart = 0;
  this.targetElement = null;
  this.touchStartX = 0;
  this.touchStartY = 0;
  this.lastTouchIdentifier = 0;
  this.touchBoundary = 10;
  this.layer = layer;
  if (!layer || !layer.nodeType) {
    throw new TypeError('Layer must be a document node');
  }
  this.onClick = function () {
    return FastClick.prototype.onClick.apply(self, arguments);
  };
  this.onMouse = function () {
    return FastClick.prototype.onMouse.apply(self, arguments);
  };
  this.onTouchStart = function () {
    return FastClick.prototype.onTouchStart.apply(self, arguments);
  };
  this.onTouchMove = function () {
    return FastClick.prototype.onTouchMove.apply(self, arguments);
  };
  this.onTouchEnd = function () {
    return FastClick.prototype.onTouchEnd.apply(self, arguments);
  };
  this.onTouchCancel = function () {
    return FastClick.prototype.onTouchCancel.apply(self, arguments);
  };
  if (FastClick.notNeeded(layer)) {
    return;
  }
  if (this.deviceIsAndroid) {
    layer.addEventListener('mouseover', this.onMouse, true);
    layer.addEventListener('mousedown', this.onMouse, true);
    layer.addEventListener('mouseup', this.onMouse, true);
  }
  layer.addEventListener('click', this.onClick, true);
  layer.addEventListener('touchstart', this.onTouchStart, false);
  layer.addEventListener('touchmove', this.onTouchMove, false);
  layer.addEventListener('touchend', this.onTouchEnd, false);
  layer.addEventListener('touchcancel', this.onTouchCancel, false);
  if (!Event.prototype.stopImmediatePropagation) {
    layer.removeEventListener = function (type, callback, capture) {
      var rmv = Node.prototype.removeEventListener;
      if (type === 'click') {
        rmv.call(layer, type, callback.hijacked || callback, capture);
      } else {
        rmv.call(layer, type, callback, capture);
      }
    };
    layer.addEventListener = function (type, callback, capture) {
      var adv = Node.prototype.addEventListener;
      if (type === 'click') {
        adv.call(layer, type, callback.hijacked || (callback.hijacked = function (event) {
          if (!event.propagationStopped) {
            callback(event);
          }
        }), capture);
      } else {
        adv.call(layer, type, callback, capture);
      }
    };
  }
  if (typeof layer.onclick === 'function') {
    oldOnClick = layer.onclick;
    layer.addEventListener('click', function (event) {
      oldOnClick(event);
    }, false);
    layer.onclick = null;
  }
}
FastClick.prototype.deviceIsAndroid = navigator.userAgent.indexOf('Android') > 0;
FastClick.prototype.deviceIsIOS = /iP(ad|hone|od)/.test(navigator.userAgent);
FastClick.prototype.deviceIsIOS4 = FastClick.prototype.deviceIsIOS && /OS 4_\d(_\d)?/.test(navigator.userAgent);
FastClick.prototype.deviceIsIOSWithBadTarget = FastClick.prototype.deviceIsIOS && /OS ([6-9]|\d{2})_\d/.test(navigator.userAgent);
FastClick.prototype.needsClick = function (target) {
  'use strict';
  switch (target.nodeName.toLowerCase()) {
  case 'button':
  case 'select':
  case 'textarea':
    if (target.disabled) {
      return true;
    }
    break;
  case 'input':
    if (this.deviceIsIOS && target.type === 'file' || target.disabled) {
      return true;
    }
    break;
  case 'label':
  case 'video':
    return true;
  }
  return /\bneedsclick\b/.test(target.className);
};
FastClick.prototype.needsFocus = function (target) {
  'use strict';
  switch (target.nodeName.toLowerCase()) {
  case 'textarea':
    return true;
  case 'select':
    return !this.deviceIsAndroid;
  case 'input':
    switch (target.type) {
    case 'button':
    case 'checkbox':
    case 'file':
    case 'image':
    case 'radio':
    case 'submit':
      return false;
    }
    return !target.disabled && !target.readOnly;
  default:
    return /\bneedsfocus\b/.test(target.className);
  }
};
FastClick.prototype.sendClick = function (targetElement, event) {
  'use strict';
  var clickEvent, touch;
  if (document.activeElement && document.activeElement !== targetElement) {
    document.activeElement.blur();
  }
  touch = event.changedTouches[0];
  clickEvent = document.createEvent('MouseEvents');
  clickEvent.initMouseEvent(this.determineEventType(targetElement), true, true, window, 1, touch.screenX, touch.screenY, touch.clientX, touch.clientY, false, false, false, false, 0, null);
  clickEvent.forwardedTouchEvent = true;
  targetElement.dispatchEvent(clickEvent);
};
FastClick.prototype.determineEventType = function (targetElement) {
  'use strict';
  if (this.deviceIsAndroid && targetElement.tagName.toLowerCase() === 'select') {
    return 'mousedown';
  }
  return 'click';
};
FastClick.prototype.focus = function (targetElement) {
  'use strict';
  var length;
  if (this.deviceIsIOS && targetElement.setSelectionRange && targetElement.type.indexOf('date') !== 0 && targetElement.type !== 'time') {
    length = targetElement.value.length;
    targetElement.setSelectionRange(length, length);
  } else {
    targetElement.focus();
  }
};
FastClick.prototype.updateScrollParent = function (targetElement) {
  'use strict';
  var scrollParent, parentElement;
  scrollParent = targetElement.fastClickScrollParent;
  if (!scrollParent || !scrollParent.contains(targetElement)) {
    parentElement = targetElement;
    do {
      if (parentElement.scrollHeight > parentElement.offsetHeight) {
        scrollParent = parentElement;
        targetElement.fastClickScrollParent = parentElement;
        break;
      }
      parentElement = parentElement.parentElement;
    } while (parentElement);
  }
  if (scrollParent) {
    scrollParent.fastClickLastScrollTop = scrollParent.scrollTop;
  }
};
FastClick.prototype.getTargetElementFromEventTarget = function (eventTarget) {
  'use strict';
  if (eventTarget.nodeType === Node.TEXT_NODE) {
    return eventTarget.parentNode;
  }
  return eventTarget;
};
FastClick.prototype.onTouchStart = function (event) {
  'use strict';
  var targetElement, touch, selection;
  if (event.targetTouches.length > 1) {
    return true;
  }
  targetElement = this.getTargetElementFromEventTarget(event.target);
  touch = event.targetTouches[0];
  if (this.deviceIsIOS) {
    selection = window.getSelection();
    if (selection.rangeCount && !selection.isCollapsed) {
      return true;
    }
    if (!this.deviceIsIOS4) {
      if (touch.identifier === this.lastTouchIdentifier) {
        event.preventDefault();
        return false;
      }
      this.lastTouchIdentifier = touch.identifier;
      this.updateScrollParent(targetElement);
    }
  }
  this.trackingClick = true;
  this.trackingClickStart = event.timeStamp;
  this.targetElement = targetElement;
  this.touchStartX = touch.pageX;
  this.touchStartY = touch.pageY;
  if (event.timeStamp - this.lastClickTime < 200) {
    event.preventDefault();
  }
  return true;
};
FastClick.prototype.touchHasMoved = function (event) {
  'use strict';
  var touch = event.changedTouches[0], boundary = this.touchBoundary;
  if (Math.abs(touch.pageX - this.touchStartX) > boundary || Math.abs(touch.pageY - this.touchStartY) > boundary) {
    return true;
  }
  return false;
};
FastClick.prototype.onTouchMove = function (event) {
  'use strict';
  if (!this.trackingClick) {
    return true;
  }
  if (this.targetElement !== this.getTargetElementFromEventTarget(event.target) || this.touchHasMoved(event)) {
    this.trackingClick = false;
    this.targetElement = null;
  }
  return true;
};
FastClick.prototype.findControl = function (labelElement) {
  'use strict';
  if (labelElement.control !== undefined) {
    return labelElement.control;
  }
  if (labelElement.htmlFor) {
    return document.getElementById(labelElement.htmlFor);
  }
  return labelElement.querySelector('button, input:not([type=hidden]), keygen, meter, output, progress, select, textarea');
};
FastClick.prototype.onTouchEnd = function (event) {
  'use strict';
  var forElement, trackingClickStart, targetTagName, scrollParent, touch, targetElement = this.targetElement;
  if (!this.trackingClick) {
    return true;
  }
  if (event.timeStamp - this.lastClickTime < 200) {
    this.cancelNextClick = true;
    return true;
  }
  this.cancelNextClick = false;
  this.lastClickTime = event.timeStamp;
  trackingClickStart = this.trackingClickStart;
  this.trackingClick = false;
  this.trackingClickStart = 0;
  if (this.deviceIsIOSWithBadTarget) {
    touch = event.changedTouches[0];
    targetElement = document.elementFromPoint(touch.pageX - window.pageXOffset, touch.pageY - window.pageYOffset) || targetElement;
    targetElement.fastClickScrollParent = this.targetElement.fastClickScrollParent;
  }
  targetTagName = targetElement.tagName.toLowerCase();
  if (targetTagName === 'label') {
    forElement = this.findControl(targetElement);
    if (forElement) {
      this.focus(targetElement);
      if (this.deviceIsAndroid) {
        return false;
      }
      targetElement = forElement;
    }
  } else if (this.needsFocus(targetElement)) {
    if (event.timeStamp - trackingClickStart > 100 || this.deviceIsIOS && window.top !== window && targetTagName === 'input') {
      this.targetElement = null;
      return false;
    }
    this.focus(targetElement);
    if (!this.deviceIsIOS4 || targetTagName !== 'select') {
      this.targetElement = null;
      event.preventDefault();
    }
    return false;
  }
  if (this.deviceIsIOS && !this.deviceIsIOS4) {
    scrollParent = targetElement.fastClickScrollParent;
    if (scrollParent && scrollParent.fastClickLastScrollTop !== scrollParent.scrollTop) {
      return true;
    }
  }
  if (!this.needsClick(targetElement)) {
    event.preventDefault();
    this.sendClick(targetElement, event);
  }
  return false;
};
FastClick.prototype.onTouchCancel = function () {
  'use strict';
  this.trackingClick = false;
  this.targetElement = null;
};
FastClick.prototype.onMouse = function (event) {
  'use strict';
  if (!this.targetElement) {
    return true;
  }
  if (event.forwardedTouchEvent) {
    return true;
  }
  if (!event.cancelable) {
    return true;
  }
  if (!this.needsClick(this.targetElement) || this.cancelNextClick) {
    if (event.stopImmediatePropagation) {
      event.stopImmediatePropagation();
    } else {
      event.propagationStopped = true;
    }
    event.stopPropagation();
    event.preventDefault();
    return false;
  }
  return true;
};
FastClick.prototype.onClick = function (event) {
  'use strict';
  var permitted;
  if (this.trackingClick) {
    this.targetElement = null;
    this.trackingClick = false;
    return true;
  }
  if (event.target.type === 'submit' && event.detail === 0) {
    return true;
  }
  permitted = this.onMouse(event);
  if (!permitted) {
    this.targetElement = null;
  }
  return permitted;
};
FastClick.prototype.destroy = function () {
  'use strict';
  var layer = this.layer;
  if (this.deviceIsAndroid) {
    layer.removeEventListener('mouseover', this.onMouse, true);
    layer.removeEventListener('mousedown', this.onMouse, true);
    layer.removeEventListener('mouseup', this.onMouse, true);
  }
  layer.removeEventListener('click', this.onClick, true);
  layer.removeEventListener('touchstart', this.onTouchStart, false);
  layer.removeEventListener('touchmove', this.onTouchMove, false);
  layer.removeEventListener('touchend', this.onTouchEnd, false);
  layer.removeEventListener('touchcancel', this.onTouchCancel, false);
};
FastClick.notNeeded = function (layer) {
  'use strict';
  var metaViewport;
  var chromeVersion;
  if (typeof window.ontouchstart === 'undefined') {
    return true;
  }
  chromeVersion = +(/Chrome\/([0-9]+)/.exec(navigator.userAgent) || [
    ,
    0
  ])[1];
  if (chromeVersion) {
    if (FastClick.prototype.deviceIsAndroid) {
      metaViewport = document.querySelector('meta[name=viewport]');
      if (metaViewport) {
        if (metaViewport.content.indexOf('user-scalable=no') !== -1) {
          return true;
        }
        if (chromeVersion > 31 && window.innerWidth <= window.screen.width) {
          return true;
        }
      }
    } else {
      return true;
    }
  }
  if (layer.style.msTouchAction === 'none') {
    return true;
  }
  return false;
};
FastClick.attach = function (layer) {
  'use strict';
  return new FastClick(layer);
};
if (typeof define !== 'undefined' && define.amd) {
  define(function () {
    'use strict';
    return FastClick;
  });
} else if (typeof module !== 'undefined' && module.exports) {
  module.exports = FastClick.attach;
  module.exports.FastClick = FastClick;
} else {
  window.FastClick = FastClick;
}