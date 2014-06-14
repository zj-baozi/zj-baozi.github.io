var __hasProp = {}.hasOwnProperty;

(function(definition) {
  var $, exports, global, i;
  global = this;
  $ = global.jQuery;
  exports = {};
  definition(global, exports, $);
  if (global.csdn === void 0) {
    global.csdn = exports;
  }
  for (i in exports) {
    if (!__hasProp.call(exports, i)) continue;
    global[i] = global.csdn[i] = exports[i];
  }
})(function(global, exports, $) {
  var CNick, cache, cnick, _cache, _ref;
  if (global.CNick instanceof Function && global.cnick instanceof Function && ((_ref = global.csdn) != null ? _ref.cnick : void 0) instanceof Function) {
    return;
  }
  if (String.prototype.trim === void 0) {
    String.prototype.trim = function() {
      return this.replace(/^\s+|\s+$/g, '');
    };
  }
  _cache = {};
  cache = function(k, v) {
    var _ref1, _ref2;
    if (arguments.length > 1) {
      _cache[k] = v;
      return (_ref1 = global.localStorage) != null ? _ref1['cnick_' + k] = +new Date() + ',' + v : void 0;
    } else if (k != null) {
      return _cache[k] || (function(v) {
        var date, n, _ref3, _ref4;
        if (v == null) {
          return;
        }
        _ref3 = v.split(','), date = _ref3[0], n = _ref3[1];
        if ((0 < (_ref4 = new Date() - new Date(parseInt(date, 10))) && _ref4 < 2 * 24 * 60 * 60 * 1000)) {
          return n;
        } else {
          return void 0;
        }
      })((_ref2 = global.localStorage) != null ? _ref2['cnick_' + k] : void 0);
    }
  };
  exports.cnick = cnick = function(selector, ele, force) {
    var e, eles, n, nameEles, names, nick, u, users, _i, _len;
    if (selector == null) {
      selector = 'a.user_name';
    }
    if (ele == null) {
      ele = global.document;
    }
    if (force == null) {
      force = false;
    }
    eles = $(selector, ele).filter(function() {
      return force || ($(this).data('orig_username') == null);
    }).data('orig_username', '');
    names = {};
    for (_i = 0, _len = eles.length; _i < _len; _i++) {
      e = eles[_i];
      u = e.innerHTML.trim();
      if ((nick = cache(u)) != null) {
        $(e).data('orig_username', u).html(nick);
      } else {
        nameEles = names.hasOwnProperty(u) ? names[u] : names[u] = [];
        nameEles.push(e);
      }
    }
    users = (function() {
      var _results;
      _results = [];
      for (n in names) {
        if (!__hasProp.call(names, n)) continue;
        _results.push(n);
      }
      return _results;
    })();
    while (users.length > 0) {
      $.getJSON('https://passport.csdn.net/get/nick?callback=?', {
        users: users.splice(0, 100).join()
      }, function(_arg) {
        var data, status, _j, _len1, _ref1;
        status = _arg.status, data = _arg.data;
        if (status && data) {
          for (_j = 0, _len1 = data.length; _j < _len1; _j++) {
            _ref1 = data[_j], u = _ref1.u, n = _ref1.n;
            if (n === 'null') {
              n = u;
            }
            $(names[u]).data('orig_username', u).html(function(i, o) {
              return n || o;
            });
            cache(u, n);
          }
        }
      });
    }
  };
  $(function() {
    return cnick();
  });
  return global.CNick = CNick = (function() {
    function CNick(selector) {
      this.selector = selector;
    }

    CNick.prototype.showNickname = function() {
      return cnick(this.selector);
    };

    return CNick;

  })();
});
