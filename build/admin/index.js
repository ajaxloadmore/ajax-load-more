var ajaxloadmore;
/******/ (function() { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 283:
/***/ (function() {

var drops = drops || {};
jQuery(document).ready(function ($) {
  'use strict';

  drops.dropdown = function (e) {
    var el = e.parent();
    var text = $('input[type="text"]', el);
    if ($(el).hasClass('active')) {
      //If is currently active, hide it
      el.removeClass('active');
      $('.alm-dropdown', el).removeClass('active');
      return false;
    } else if ($('.alm-dropdown').hasClass('active')) {
      $('.alm-dropdown').each(function (i) {
        $(this).removeClass('active');
        $(this).parent().removeClass('active');
      });
    }
    $('.alm-dropdown').removeClass('active'); //remove active states from currently open dropdowns
    el.addClass('active');
    $('.alm-dropdown', el).addClass('active');
    text.focus(); //Focus on input boxes

    // Bind click event to window.
    $(window).unbind('click').bind('click', drops.closeDropDown);
  };
  drops.closeDropDown = function () {
    $('.alm-dropdown').each(function () {
      $(this).removeClass('active');
      $(this).parent().removeClass('active');
    });
  };

  //Dropdown links
  $(document).on('click', '.alm-drop-btn a.target', function () {
    var e = $(this);
    drops.dropdown(e);
    return false;
  });
});

/***/ }),

/***/ 324:
/***/ (function() {

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
/* Tooltipster v3.3.0 */;
(function (e, t, n) {
  function s(t, n) {
    this.bodyOverflowX;
    this.callbacks = {
      hide: [],
      show: []
    };
    this.checkInterval = null;
    this.Content;
    this.$el = e(t);
    this.$elProxy;
    this.elProxyPosition;
    this.enabled = true;
    this.options = e.extend({}, i, n);
    this.mouseIsOverProxy = false;
    this.namespace = "tooltipster-" + Math.round(Math.random() * 1e5);
    this.Status = "hidden";
    this.timerHide = null;
    this.timerShow = null;
    this.$tooltip;
    this.options.iconTheme = this.options.iconTheme.replace(".", "");
    this.options.theme = this.options.theme.replace(".", "");
    this._init();
  }
  function o(t, n) {
    var r = true;
    e.each(t, function (e, i) {
      if (typeof n[e] === "undefined" || t[e] !== n[e]) {
        r = false;
        return false;
      }
    });
    return r;
  }
  function f() {
    return !a && u;
  }
  function l() {
    var e = n.body || n.documentElement,
      t = e.style,
      r = "transition";
    if (typeof t[r] == "string") {
      return true;
    }
    v = ["Moz", "Webkit", "Khtml", "O", "ms"], r = r.charAt(0).toUpperCase() + r.substr(1);
    for (var i = 0; i < v.length; i++) {
      if (typeof t[v[i] + r] == "string") {
        return true;
      }
    }
    return false;
  }
  var r = "tooltipster",
    i = {
      animation: "fade",
      arrow: true,
      arrowColor: "",
      autoClose: true,
      content: null,
      contentAsHTML: false,
      contentCloning: true,
      debug: true,
      delay: 200,
      minWidth: 0,
      maxWidth: null,
      functionInit: function functionInit(e, t) {},
      functionBefore: function functionBefore(e, t) {
        t();
      },
      functionReady: function functionReady(e, t) {},
      functionAfter: function functionAfter(e) {},
      hideOnClick: false,
      icon: "(?)",
      iconCloning: true,
      iconDesktop: false,
      iconTouch: false,
      iconTheme: "tooltipster-icon",
      interactive: false,
      interactiveTolerance: 350,
      multiple: false,
      offsetX: 0,
      offsetY: 0,
      onlyOne: false,
      position: "top",
      positionTracker: false,
      positionTrackerCallback: function positionTrackerCallback(e) {
        if (this.option("trigger") == "hover" && this.option("autoClose")) {
          this.hide();
        }
      },
      restoration: "current",
      speed: 350,
      timer: 0,
      theme: "tooltipster-default",
      touchDevices: true,
      trigger: "hover",
      updateAnimation: true
    };
  s.prototype = {
    _init: function _init() {
      var t = this;
      if (n.querySelector) {
        var r = null;
        if (t.$el.data("tooltipster-initialTitle") === undefined) {
          r = t.$el.attr("title");
          if (r === undefined) r = null;
          t.$el.data("tooltipster-initialTitle", r);
        }
        if (t.options.content !== null) {
          t._content_set(t.options.content);
        } else {
          t._content_set(r);
        }
        var i = t.options.functionInit.call(t.$el, t.$el, t.Content);
        if (typeof i !== "undefined") t._content_set(i);
        t.$el.removeAttr("title").addClass("tooltipstered");
        if (!u && t.options.iconDesktop || u && t.options.iconTouch) {
          if (typeof t.options.icon === "string") {
            t.$elProxy = e('<span class="' + t.options.iconTheme + '"></span>');
            t.$elProxy.text(t.options.icon);
          } else {
            if (t.options.iconCloning) t.$elProxy = t.options.icon.clone(true);else t.$elProxy = t.options.icon;
          }
          t.$elProxy.insertAfter(t.$el);
        } else {
          t.$elProxy = t.$el;
        }
        if (t.options.trigger == "hover") {
          t.$elProxy.on("mouseenter." + t.namespace, function () {
            if (!f() || t.options.touchDevices) {
              t.mouseIsOverProxy = true;
              t._show();
            }
          }).on("mouseleave." + t.namespace, function () {
            if (!f() || t.options.touchDevices) {
              t.mouseIsOverProxy = false;
            }
          });
          if (u && t.options.touchDevices) {
            t.$elProxy.on("touchstart." + t.namespace, function () {
              t._showNow();
            });
          }
        } else if (t.options.trigger == "click") {
          t.$elProxy.on("click." + t.namespace, function () {
            if (!f() || t.options.touchDevices) {
              t._show();
            }
          });
        }
      }
    },
    _show: function _show() {
      var e = this;
      if (e.Status != "shown" && e.Status != "appearing") {
        if (e.options.delay) {
          e.timerShow = setTimeout(function () {
            if (e.options.trigger == "click" || e.options.trigger == "hover" && e.mouseIsOverProxy) {
              e._showNow();
            }
          }, e.options.delay);
        } else e._showNow();
      }
    },
    _showNow: function _showNow(n) {
      var r = this;
      r.options.functionBefore.call(r.$el, r.$el, function () {
        if (r.enabled && r.Content !== null) {
          if (n) r.callbacks.show.push(n);
          r.callbacks.hide = [];
          clearTimeout(r.timerShow);
          r.timerShow = null;
          clearTimeout(r.timerHide);
          r.timerHide = null;
          if (r.options.onlyOne) {
            e(".tooltipstered").not(r.$el).each(function (t, n) {
              var r = e(n),
                i = r.data("tooltipster-ns");
              e.each(i, function (e, t) {
                var n = r.data(t),
                  i = n.status(),
                  s = n.option("autoClose");
                if (i !== "hidden" && i !== "disappearing" && s) {
                  n.hide();
                }
              });
            });
          }
          var i = function i() {
            r.Status = "shown";
            e.each(r.callbacks.show, function (e, t) {
              t.call(r.$el);
            });
            r.callbacks.show = [];
          };
          if (r.Status !== "hidden") {
            var s = 0;
            if (r.Status === "disappearing") {
              r.Status = "appearing";
              if (l()) {
                r.$tooltip.clearQueue().removeClass("tooltipster-dying").addClass("tooltipster-" + r.options.animation + "-show");
                if (r.options.speed > 0) r.$tooltip.delay(r.options.speed);
                r.$tooltip.queue(i);
              } else {
                r.$tooltip.stop().fadeIn(i);
              }
            } else if (r.Status === "shown") {
              i();
            }
          } else {
            r.Status = "appearing";
            var s = r.options.speed;
            r.bodyOverflowX = e("body").css("overflow-x");
            e("body").css("overflow-x", "hidden");
            var o = "tooltipster-" + r.options.animation,
              a = "-webkit-transition-duration: " + r.options.speed + "ms; -webkit-animation-duration: " + r.options.speed + "ms; -moz-transition-duration: " + r.options.speed + "ms; -moz-animation-duration: " + r.options.speed + "ms; -o-transition-duration: " + r.options.speed + "ms; -o-animation-duration: " + r.options.speed + "ms; -ms-transition-duration: " + r.options.speed + "ms; -ms-animation-duration: " + r.options.speed + "ms; transition-duration: " + r.options.speed + "ms; animation-duration: " + r.options.speed + "ms;",
              f = r.options.minWidth ? "min-width:" + Math.round(r.options.minWidth) + "px;" : "",
              c = r.options.maxWidth ? "max-width:" + Math.round(r.options.maxWidth) + "px;" : "",
              h = r.options.interactive ? "pointer-events: auto;" : "";
            r.$tooltip = e('<div class="tooltipster-base ' + r.options.theme + '" style="' + f + " " + c + " " + h + " " + a + '"><div class="tooltipster-content"></div></div>');
            if (l()) r.$tooltip.addClass(o);
            r._content_insert();
            r.$tooltip.appendTo("body");
            r.reposition();
            r.options.functionReady.call(r.$el, r.$el, r.$tooltip);
            if (l()) {
              r.$tooltip.addClass(o + "-show");
              if (r.options.speed > 0) r.$tooltip.delay(r.options.speed);
              r.$tooltip.queue(i);
            } else {
              r.$tooltip.css("display", "none").fadeIn(r.options.speed, i);
            }
            r._interval_set();
            e(t).on("scroll." + r.namespace + " resize." + r.namespace, function () {
              r.reposition();
            });
            if (r.options.autoClose) {
              e("body").off("." + r.namespace);
              if (r.options.trigger == "hover") {
                if (u) {
                  setTimeout(function () {
                    e("body").on("touchstart." + r.namespace, function () {
                      r.hide();
                    });
                  }, 0);
                }
                if (r.options.interactive) {
                  if (u) {
                    r.$tooltip.on("touchstart." + r.namespace, function (e) {
                      e.stopPropagation();
                    });
                  }
                  var p = null;
                  r.$elProxy.add(r.$tooltip).on("mouseleave." + r.namespace + "-autoClose", function () {
                    clearTimeout(p);
                    p = setTimeout(function () {
                      r.hide();
                    }, r.options.interactiveTolerance);
                  }).on("mouseenter." + r.namespace + "-autoClose", function () {
                    clearTimeout(p);
                  });
                } else {
                  r.$elProxy.on("mouseleave." + r.namespace + "-autoClose", function () {
                    r.hide();
                  });
                }
                if (r.options.hideOnClick) {
                  r.$elProxy.on("click." + r.namespace + "-autoClose", function () {
                    r.hide();
                  });
                }
              } else if (r.options.trigger == "click") {
                setTimeout(function () {
                  e("body").on("click." + r.namespace + " touchstart." + r.namespace, function () {
                    r.hide();
                  });
                }, 0);
                if (r.options.interactive) {
                  r.$tooltip.on("click." + r.namespace + " touchstart." + r.namespace, function (e) {
                    e.stopPropagation();
                  });
                }
              }
            }
          }
          if (r.options.timer > 0) {
            r.timerHide = setTimeout(function () {
              r.timerHide = null;
              r.hide();
            }, r.options.timer + s);
          }
        }
      });
    },
    _interval_set: function _interval_set() {
      var t = this;
      t.checkInterval = setInterval(function () {
        if (e("body").find(t.$el).length === 0 || e("body").find(t.$elProxy).length === 0 || t.Status == "hidden" || e("body").find(t.$tooltip).length === 0) {
          if (t.Status == "shown" || t.Status == "appearing") t.hide();
          t._interval_cancel();
        } else {
          if (t.options.positionTracker) {
            var n = t._repositionInfo(t.$elProxy),
              r = false;
            if (o(n.dimension, t.elProxyPosition.dimension)) {
              if (t.$elProxy.css("position") === "fixed") {
                if (o(n.position, t.elProxyPosition.position)) r = true;
              } else {
                if (o(n.offset, t.elProxyPosition.offset)) r = true;
              }
            }
            if (!r) {
              t.reposition();
              t.options.positionTrackerCallback.call(t, t.$el);
            }
          }
        }
      }, 200);
    },
    _interval_cancel: function _interval_cancel() {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    },
    _content_set: function _content_set(e) {
      if (_typeof(e) === "object" && e !== null && this.options.contentCloning) {
        e = e.clone(true);
      }
      this.Content = e;
    },
    _content_insert: function _content_insert() {
      var e = this,
        t = this.$tooltip.find(".tooltipster-content");
      if (typeof e.Content === "string" && !e.options.contentAsHTML) {
        t.text(e.Content);
      } else {
        t.empty().append(e.Content);
      }
    },
    _update: function _update(e) {
      var t = this;
      t._content_set(e);
      if (t.Content !== null) {
        if (t.Status !== "hidden") {
          t._content_insert();
          t.reposition();
          if (t.options.updateAnimation) {
            if (l()) {
              t.$tooltip.css({
                width: "",
                "-webkit-transition": "all " + t.options.speed + "ms, width 0ms, height 0ms, left 0ms, top 0ms",
                "-moz-transition": "all " + t.options.speed + "ms, width 0ms, height 0ms, left 0ms, top 0ms",
                "-o-transition": "all " + t.options.speed + "ms, width 0ms, height 0ms, left 0ms, top 0ms",
                "-ms-transition": "all " + t.options.speed + "ms, width 0ms, height 0ms, left 0ms, top 0ms",
                transition: "all " + t.options.speed + "ms, width 0ms, height 0ms, left 0ms, top 0ms"
              }).addClass("tooltipster-content-changing");
              setTimeout(function () {
                if (t.Status != "hidden") {
                  t.$tooltip.removeClass("tooltipster-content-changing");
                  setTimeout(function () {
                    if (t.Status !== "hidden") {
                      t.$tooltip.css({
                        "-webkit-transition": t.options.speed + "ms",
                        "-moz-transition": t.options.speed + "ms",
                        "-o-transition": t.options.speed + "ms",
                        "-ms-transition": t.options.speed + "ms",
                        transition: t.options.speed + "ms"
                      });
                    }
                  }, t.options.speed);
                }
              }, t.options.speed);
            } else {
              t.$tooltip.fadeTo(t.options.speed, .5, function () {
                if (t.Status != "hidden") {
                  t.$tooltip.fadeTo(t.options.speed, 1);
                }
              });
            }
          }
        }
      } else {
        t.hide();
      }
    },
    _repositionInfo: function _repositionInfo(e) {
      return {
        dimension: {
          height: e.outerHeight(false),
          width: e.outerWidth(false)
        },
        offset: e.offset(),
        position: {
          left: parseInt(e.css("left")),
          top: parseInt(e.css("top"))
        }
      };
    },
    hide: function hide(n) {
      var r = this;
      if (n) r.callbacks.hide.push(n);
      r.callbacks.show = [];
      clearTimeout(r.timerShow);
      r.timerShow = null;
      clearTimeout(r.timerHide);
      r.timerHide = null;
      var i = function i() {
        e.each(r.callbacks.hide, function (e, t) {
          t.call(r.$el);
        });
        r.callbacks.hide = [];
      };
      if (r.Status == "shown" || r.Status == "appearing") {
        r.Status = "disappearing";
        var s = function s() {
          r.Status = "hidden";
          if (_typeof(r.Content) == "object" && r.Content !== null) {
            r.Content.detach();
          }
          r.$tooltip.remove();
          r.$tooltip = null;
          e(t).off("." + r.namespace);
          e("body").off("." + r.namespace).css("overflow-x", r.bodyOverflowX);
          e("body").off("." + r.namespace);
          r.$elProxy.off("." + r.namespace + "-autoClose");
          r.options.functionAfter.call(r.$el, r.$el);
          i();
        };
        if (l()) {
          r.$tooltip.clearQueue().removeClass("tooltipster-" + r.options.animation + "-show").addClass("tooltipster-dying");
          if (r.options.speed > 0) r.$tooltip.delay(r.options.speed);
          r.$tooltip.queue(s);
        } else {
          r.$tooltip.stop().fadeOut(r.options.speed, s);
        }
      } else if (r.Status == "hidden") {
        i();
      }
      return r;
    },
    show: function show(e) {
      this._showNow(e);
      return this;
    },
    update: function update(e) {
      return this.content(e);
    },
    content: function content(e) {
      if (typeof e === "undefined") {
        return this.Content;
      } else {
        this._update(e);
        return this;
      }
    },
    reposition: function reposition() {
      var n = this;
      if (e("body").find(n.$tooltip).length !== 0) {
        var H = function H() {
          var n = e(t).scrollLeft();
          if (A - n < 0) {
            r = A - n;
            A = n;
          }
          if (A + o - n > i) {
            r = A - (i + n - o);
            A = i + n - o;
          }
        };
        var B = function B(n, r) {
          if (s.offset.top - e(t).scrollTop() - a - _ - 12 < 0 && r.indexOf("top") > -1) {
            P = n;
          }
          if (s.offset.top + s.dimension.height + a + 12 + _ > e(t).scrollTop() + e(t).height() && r.indexOf("bottom") > -1) {
            P = n;
            M = s.offset.top - a - _ - 12;
          }
        };
        n.$tooltip.css("width", "");
        n.elProxyPosition = n._repositionInfo(n.$elProxy);
        var r = null,
          i = e(t).width(),
          s = n.elProxyPosition,
          o = n.$tooltip.outerWidth(false),
          u = n.$tooltip.innerWidth() + 1,
          a = n.$tooltip.outerHeight(false);
        if (n.$elProxy.is("area")) {
          var f = n.$elProxy.attr("shape"),
            l = n.$elProxy.parent().attr("name"),
            c = e('img[usemap="#' + l + '"]'),
            h = c.offset().left,
            p = c.offset().top,
            d = n.$elProxy.attr("coords") !== undefined ? n.$elProxy.attr("coords").split(",") : undefined;
          if (f == "circle") {
            var v = parseInt(d[0]),
              m = parseInt(d[1]),
              g = parseInt(d[2]);
            s.dimension.height = g * 2;
            s.dimension.width = g * 2;
            s.offset.top = p + m - g;
            s.offset.left = h + v - g;
          } else if (f == "rect") {
            var v = parseInt(d[0]),
              m = parseInt(d[1]),
              y = parseInt(d[2]),
              b = parseInt(d[3]);
            s.dimension.height = b - m;
            s.dimension.width = y - v;
            s.offset.top = p + m;
            s.offset.left = h + v;
          } else if (f == "poly") {
            var w = [],
              E = [],
              S = 0,
              x = 0,
              T = 0,
              N = 0,
              C = "even";
            for (var k = 0; k < d.length; k++) {
              var L = parseInt(d[k]);
              if (C == "even") {
                if (L > T) {
                  T = L;
                  if (k === 0) {
                    S = T;
                  }
                }
                if (L < S) {
                  S = L;
                }
                C = "odd";
              } else {
                if (L > N) {
                  N = L;
                  if (k == 1) {
                    x = N;
                  }
                }
                if (L < x) {
                  x = L;
                }
                C = "even";
              }
            }
            s.dimension.height = N - x;
            s.dimension.width = T - S;
            s.offset.top = p + x;
            s.offset.left = h + S;
          } else {
            s.dimension.height = c.outerHeight(false);
            s.dimension.width = c.outerWidth(false);
            s.offset.top = p;
            s.offset.left = h;
          }
        }
        var A = 0,
          O = 0,
          M = 0,
          _ = parseInt(n.options.offsetY),
          D = parseInt(n.options.offsetX),
          P = n.options.position;
        if (P == "top") {
          var j = s.offset.left + o - (s.offset.left + s.dimension.width);
          A = s.offset.left + D - j / 2;
          M = s.offset.top - a - _ - 12;
          H();
          B("bottom", "top");
        }
        if (P == "top-left") {
          A = s.offset.left + D;
          M = s.offset.top - a - _ - 12;
          H();
          B("bottom-left", "top-left");
        }
        if (P == "top-right") {
          A = s.offset.left + s.dimension.width + D - o;
          M = s.offset.top - a - _ - 12;
          H();
          B("bottom-right", "top-right");
        }
        if (P == "bottom") {
          var j = s.offset.left + o - (s.offset.left + s.dimension.width);
          A = s.offset.left - j / 2 + D;
          M = s.offset.top + s.dimension.height + _ + 12;
          H();
          B("top", "bottom");
        }
        if (P == "bottom-left") {
          A = s.offset.left + D;
          M = s.offset.top + s.dimension.height + _ + 12;
          H();
          B("top-left", "bottom-left");
        }
        if (P == "bottom-right") {
          A = s.offset.left + s.dimension.width + D - o;
          M = s.offset.top + s.dimension.height + _ + 12;
          H();
          B("top-right", "bottom-right");
        }
        if (P == "left") {
          A = s.offset.left - D - o - 12;
          O = s.offset.left + D + s.dimension.width + 12;
          var F = s.offset.top + a - (s.offset.top + s.dimension.height);
          M = s.offset.top - F / 2 - _;
          if (A < 0 && O + o > i) {
            var I = parseFloat(n.$tooltip.css("border-width")) * 2,
              q = o + A - I;
            n.$tooltip.css("width", q + "px");
            a = n.$tooltip.outerHeight(false);
            A = s.offset.left - D - q - 12 - I;
            F = s.offset.top + a - (s.offset.top + s.dimension.height);
            M = s.offset.top - F / 2 - _;
          } else if (A < 0) {
            A = s.offset.left + D + s.dimension.width + 12;
            r = "left";
          }
        }
        if (P == "right") {
          A = s.offset.left + D + s.dimension.width + 12;
          O = s.offset.left - D - o - 12;
          var F = s.offset.top + a - (s.offset.top + s.dimension.height);
          M = s.offset.top - F / 2 - _;
          if (A + o > i && O < 0) {
            var I = parseFloat(n.$tooltip.css("border-width")) * 2,
              q = i - A - I;
            n.$tooltip.css("width", q + "px");
            a = n.$tooltip.outerHeight(false);
            F = s.offset.top + a - (s.offset.top + s.dimension.height);
            M = s.offset.top - F / 2 - _;
          } else if (A + o > i) {
            A = s.offset.left - D - o - 12;
            r = "right";
          }
        }
        if (n.options.arrow) {
          var R = "tooltipster-arrow-" + P;
          if (n.options.arrowColor.length < 1) {
            var U = n.$tooltip.css("background-color");
          } else {
            var U = n.options.arrowColor;
          }
          if (!r) {
            r = "";
          } else if (r == "left") {
            R = "tooltipster-arrow-right";
            r = "";
          } else if (r == "right") {
            R = "tooltipster-arrow-left";
            r = "";
          } else {
            r = "left:" + Math.round(r) + "px;";
          }
          if (P == "top" || P == "top-left" || P == "top-right") {
            var z = parseFloat(n.$tooltip.css("border-bottom-width")),
              W = n.$tooltip.css("border-bottom-color");
          } else if (P == "bottom" || P == "bottom-left" || P == "bottom-right") {
            var z = parseFloat(n.$tooltip.css("border-top-width")),
              W = n.$tooltip.css("border-top-color");
          } else if (P == "left") {
            var z = parseFloat(n.$tooltip.css("border-right-width")),
              W = n.$tooltip.css("border-right-color");
          } else if (P == "right") {
            var z = parseFloat(n.$tooltip.css("border-left-width")),
              W = n.$tooltip.css("border-left-color");
          } else {
            var z = parseFloat(n.$tooltip.css("border-bottom-width")),
              W = n.$tooltip.css("border-bottom-color");
          }
          if (z > 1) {
            z++;
          }
          var X = "";
          if (z !== 0) {
            var V = "",
              J = "border-color: " + W + ";";
            if (R.indexOf("bottom") !== -1) {
              V = "margin-top: -" + Math.round(z) + "px;";
            } else if (R.indexOf("top") !== -1) {
              V = "margin-bottom: -" + Math.round(z) + "px;";
            } else if (R.indexOf("left") !== -1) {
              V = "margin-right: -" + Math.round(z) + "px;";
            } else if (R.indexOf("right") !== -1) {
              V = "margin-left: -" + Math.round(z) + "px;";
            }
            X = '<span class="tooltipster-arrow-border" style="' + V + " " + J + ';"></span>';
          }
          n.$tooltip.find(".tooltipster-arrow").remove();
          var K = '<div class="' + R + ' tooltipster-arrow" style="' + r + '">' + X + '<span style="border-color:' + U + ';"></span></div>';
          n.$tooltip.append(K);
        }
        n.$tooltip.css({
          top: Math.round(M) + "px",
          left: Math.round(A) + "px"
        });
      }
      return n;
    },
    enable: function enable() {
      this.enabled = true;
      return this;
    },
    disable: function disable() {
      this.hide();
      this.enabled = false;
      return this;
    },
    destroy: function destroy() {
      var t = this;
      t.hide();
      if (t.$el[0] !== t.$elProxy[0]) {
        t.$elProxy.remove();
      }
      t.$el.removeData(t.namespace).off("." + t.namespace);
      var n = t.$el.data("tooltipster-ns");
      if (n.length === 1) {
        var r = null;
        if (t.options.restoration === "previous") {
          r = t.$el.data("tooltipster-initialTitle");
        } else if (t.options.restoration === "current") {
          r = typeof t.Content === "string" ? t.Content : e("<div></div>").append(t.Content).html();
        }
        if (r) {
          t.$el.attr("title", r);
        }
        t.$el.removeClass("tooltipstered").removeData("tooltipster-ns").removeData("tooltipster-initialTitle");
      } else {
        n = e.grep(n, function (e, n) {
          return e !== t.namespace;
        });
        t.$el.data("tooltipster-ns", n);
      }
      return t;
    },
    elementIcon: function elementIcon() {
      return this.$el[0] !== this.$elProxy[0] ? this.$elProxy[0] : undefined;
    },
    elementTooltip: function elementTooltip() {
      return this.$tooltip ? this.$tooltip[0] : undefined;
    },
    option: function option(e, t) {
      if (typeof t == "undefined") return this.options[e];else {
        this.options[e] = t;
        return this;
      }
    },
    status: function status() {
      return this.Status;
    }
  };
  e.fn[r] = function () {
    var t = arguments;
    if (this.length === 0) {
      if (typeof t[0] === "string") {
        var n = true;
        switch (t[0]) {
          case "setDefaults":
            e.extend(i, t[1]);
            break;
          default:
            n = false;
            break;
        }
        if (n) return true;else return this;
      } else {
        return this;
      }
    } else {
      if (typeof t[0] === "string") {
        var r = "#*$~&";
        this.each(function () {
          var n = e(this).data("tooltipster-ns"),
            i = n ? e(this).data(n[0]) : null;
          if (i) {
            if (typeof i[t[0]] === "function") {
              var s = i[t[0]](t[1], t[2]);
            } else {
              throw new Error('Unknown method .tooltipster("' + t[0] + '")');
            }
            if (s !== i) {
              r = s;
              return false;
            }
          } else {
            throw new Error("You called Tooltipster's \"" + t[0] + '" method on an uninitialized element');
          }
        });
        return r !== "#*$~&" ? r : this;
      } else {
        var o = [],
          u = t[0] && typeof t[0].multiple !== "undefined",
          a = u && t[0].multiple || !u && i.multiple,
          f = t[0] && typeof t[0].debug !== "undefined",
          l = f && t[0].debug || !f && i.debug;
        this.each(function () {
          var n = false,
            r = e(this).data("tooltipster-ns"),
            i = null;
          if (!r) {
            n = true;
          } else if (a) {
            n = true;
          } else if (l) {
            console.log('Tooltipster: one or more tooltips are already attached to this element: ignoring. Use the "multiple" option to attach more tooltips.');
          }
          if (n) {
            i = new s(this, t[0]);
            if (!r) r = [];
            r.push(i.namespace);
            e(this).data("tooltipster-ns", r);
            e(this).data(i.namespace, i);
          }
          o.push(i);
        });
        if (a) return o;else return this;
      }
    }
  };
  var u = !!("ontouchstart" in t);
  var a = false;
  e("body").one("mousemove", function () {
    a = true;
  });
})(jQuery, window, document);

/***/ }),

/***/ 445:
/***/ (function() {

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
/*
SELECT 2 FORM REPLACEMNT
*/
(function (a) {
  a.fn.each2 === void 0 && a.fn.extend({
    each2: function each2(b) {
      for (var c = a([0]), d = -1, e = this.length; e > ++d && (c.context = c[0] = this[d]) && b.call(c[0], d, c) !== !1;);
      return this;
    }
  });
})(jQuery), function (a, b) {
  "use strict";

  function k(a, b) {
    for (var c = 0, d = b.length; d > c; c += 1) if (l(a, b[c])) return c;
    return -1;
  }
  function l(a, c) {
    return a === c ? !0 : a === b || c === b ? !1 : null === a || null === c ? !1 : a.constructor === String ? a + "" == c + "" : c.constructor === String ? c + "" == a + "" : !1;
  }
  function m(b, c) {
    var d, e, f;
    if (null === b || 1 > b.length) return [];
    for (d = b.split(c), e = 0, f = d.length; f > e; e += 1) d[e] = a.trim(d[e]);
    return d;
  }
  function n(a) {
    return a.outerWidth(!1) - a.width();
  }
  function o(c) {
    var d = "keyup-change-value";
    c.bind("keydown", function () {
      a.data(c, d) === b && a.data(c, d, c.val());
    }), c.bind("keyup", function () {
      var e = a.data(c, d);
      e !== b && c.val() !== e && (a.removeData(c, d), c.trigger("keyup-change"));
    });
  }
  function p(c) {
    c.bind("mousemove", function (c) {
      var d = i;
      (d === b || d.x !== c.pageX || d.y !== c.pageY) && a(c.target).trigger("mousemove-filtered", c);
    });
  }
  function q(a, c, d) {
    d = d || b;
    var e;
    return function () {
      var b = arguments;
      window.clearTimeout(e), e = window.setTimeout(function () {
        c.apply(d, b);
      }, a);
    };
  }
  function r(a) {
    var c,
      b = !1;
    return function () {
      return b === !1 && (c = a(), b = !0), c;
    };
  }
  function s(a, b) {
    var c = q(a, function (a) {
      b.trigger("scroll-debounced", a);
    });
    b.bind("scroll", function (a) {
      k(a.target, b.get()) >= 0 && c(a);
    });
  }
  function t(a) {
    a[0] !== document.activeElement && window.setTimeout(function () {
      var d,
        b = a[0],
        c = a.val().length;
      a.focus(), a.is(":visible") && b === document.activeElement && (b.setSelectionRange ? b.setSelectionRange(c, c) : b.createTextRange && (d = b.createTextRange(), d.collapse(!1), d.select()));
    }, 0);
  }
  function u(a) {
    a.preventDefault(), a.stopPropagation();
  }
  function v(a) {
    a.preventDefault(), a.stopImmediatePropagation();
  }
  function w(b) {
    if (!h) {
      var c = b[0].currentStyle || window.getComputedStyle(b[0], null);
      h = a(document.createElement("div")).css({
        position: "absolute",
        left: "-10000px",
        top: "-10000px",
        display: "none",
        fontSize: c.fontSize,
        fontFamily: c.fontFamily,
        fontStyle: c.fontStyle,
        fontWeight: c.fontWeight,
        letterSpacing: c.letterSpacing,
        textTransform: c.textTransform,
        whiteSpace: "nowrap"
      }), h.attr("class", "select2-sizer"), a("body").append(h);
    }
    return h.text(b.val()), h.width();
  }
  function x(b, c, d) {
    var e,
      g,
      f = [];
    e = b.attr("class"), e && (e = "" + e, a(e.split(" ")).each2(function () {
      0 === this.indexOf("select2-") && f.push(this);
    })), e = c.attr("class"), e && (e = "" + e, a(e.split(" ")).each2(function () {
      0 !== this.indexOf("select2-") && (g = d(this), g && f.push(this));
    })), b.attr("class", f.join(" "));
  }
  function y(a, c, d, e) {
    var f = a.toUpperCase().indexOf(c.toUpperCase()),
      g = c.length;
    return 0 > f ? (d.push(e(a)), b) : (d.push(e(a.substring(0, f))), d.push("<span class='select2-match'>"), d.push(e(a.substring(f, f + g))), d.push("</span>"), d.push(e(a.substring(f + g, a.length))), b);
  }
  function z(b) {
    var c,
      d = 0,
      e = null,
      f = b.quietMillis || 100,
      g = b.url,
      h = this;
    return function (i) {
      window.clearTimeout(c), c = window.setTimeout(function () {
        d += 1;
        var c = d,
          f = b.data,
          j = g,
          k = b.transport || a.ajax,
          l = b.type || "GET",
          m = {};
        f = f ? f.call(h, i.term, i.page, i.context) : null, j = "function" == typeof j ? j.call(h, i.term, i.page, i.context) : j, null !== e && e.abort(), b.params && (a.isFunction(b.params) ? a.extend(m, b.params.call(h)) : a.extend(m, b.params)), a.extend(m, {
          url: j,
          dataType: b.dataType,
          data: f,
          type: l,
          cache: !1,
          success: function success(a) {
            if (!(d > c)) {
              var e = b.results(a, i.page);
              i.callback(e);
            }
          }
        }), e = k.call(h, m);
      }, f);
    };
  }
  function A(c) {
    var e,
      f,
      d = c,
      g = function g(a) {
        return "" + a.text;
      };
    a.isArray(d) && (f = d, d = {
      results: f
    }), a.isFunction(d) === !1 && (f = d, d = function d() {
      return f;
    });
    var h = d();
    return h.text && (g = h.text, a.isFunction(g) || (e = d.text, g = function g(a) {
      return a[e];
    })), function (c) {
      var _h,
        e = c.term,
        f = {
          results: []
        };
      return "" === e ? (c.callback(d()), b) : (_h = function h(b, d) {
        var f, i;
        if (b = b[0], b.children) {
          f = {};
          for (i in b) b.hasOwnProperty(i) && (f[i] = b[i]);
          f.children = [], a(b.children).each2(function (a, b) {
            _h(b, f.children);
          }), (f.children.length || c.matcher(e, g(f), b)) && d.push(f);
        } else c.matcher(e, g(b), b) && d.push(b);
      }, a(d().results).each2(function (a, b) {
        _h(b, f.results);
      }), c.callback(f), b);
    };
  }
  function B(c) {
    var d = a.isFunction(c);
    return function (e) {
      var f = e.term,
        g = {
          results: []
        };
      a(d ? c() : c).each(function () {
        var a = this.text !== b,
          c = a ? this.text : this;
        ("" === f || e.matcher(f, c)) && g.results.push(a ? this : {
          id: this,
          text: this
        });
      }), e.callback(g);
    };
  }
  function C(b) {
    if (a.isFunction(b)) return !0;
    if (!b) return !1;
    throw Error("formatterName must be a function or a falsy value");
  }
  function D(b) {
    return a.isFunction(b) ? b() : b;
  }
  function E(b) {
    var c = 0;
    return a.each(b, function (a, b) {
      b.children ? c += E(b.children) : c++;
    }), c;
  }
  function F(a, c, d, e) {
    var h,
      i,
      j,
      k,
      m,
      f = a,
      g = !1;
    if (!e.createSearchChoice || !e.tokenSeparators || 1 > e.tokenSeparators.length) return b;
    for (;;) {
      for (i = -1, j = 0, k = e.tokenSeparators.length; k > j && (m = e.tokenSeparators[j], i = a.indexOf(m), !(i >= 0)); j++);
      if (0 > i) break;
      if (h = a.substring(0, i), a = a.substring(i + m.length), h.length > 0 && (h = e.createSearchChoice(h, c), h !== b && null !== h && e.id(h) !== b && null !== e.id(h))) {
        for (g = !1, j = 0, k = c.length; k > j; j++) if (l(e.id(h), e.id(c[j]))) {
          g = !0;
          break;
        }
        g || d(h);
      }
    }
    return f !== a ? a : b;
  }
  function G(b, c) {
    var d = function d() {};
    return d.prototype = new b(), d.prototype.constructor = d, d.prototype.parent = b.prototype, d.prototype = a.extend(d.prototype, c), d;
  }
  if (window.Select2 === b) {
    var c, d, e, f, g, h, i, j;
    c = {
      TAB: 9,
      ENTER: 13,
      ESC: 27,
      SPACE: 32,
      LEFT: 37,
      UP: 38,
      RIGHT: 39,
      DOWN: 40,
      SHIFT: 16,
      CTRL: 17,
      ALT: 18,
      PAGE_UP: 33,
      PAGE_DOWN: 34,
      HOME: 36,
      END: 35,
      BACKSPACE: 8,
      DELETE: 46,
      isArrow: function isArrow(a) {
        switch (a = a.which ? a.which : a) {
          case c.LEFT:
          case c.RIGHT:
          case c.UP:
          case c.DOWN:
            return !0;
        }
        return !1;
      },
      isControl: function isControl(a) {
        var b = a.which;
        switch (b) {
          case c.SHIFT:
          case c.CTRL:
          case c.ALT:
            return !0;
        }
        return a.metaKey ? !0 : !1;
      },
      isFunctionKey: function isFunctionKey(a) {
        return a = a.which ? a.which : a, a >= 112 && 123 >= a;
      }
    }, j = a(document), g = function () {
      var a = 1;
      return function () {
        return a++;
      };
    }(), j.bind("mousemove", function (a) {
      i = {
        x: a.pageX,
        y: a.pageY
      };
    }), d = G(Object, {
      bind: function bind(a) {
        var b = this;
        return function () {
          a.apply(b, arguments);
        };
      },
      init: function init(c) {
        var d,
          e,
          f = ".select2-results";
        this.opts = c = this.prepareOpts(c), this.id = c.id, c.element.data("select2") !== b && null !== c.element.data("select2") && this.destroy(), this.enabled = !0, this.container = this.createContainer(), this.containerId = "s2id_" + (c.element.attr("id") || "autogen" + g()), this.containerSelector = "#" + this.containerId.replace(/([;&,\.\+\*\~':"\!\^#$%@\[\]\(\)=>\|])/g, "\\$1"), this.container.attr("id", this.containerId), this.body = r(function () {
          return c.element.closest("body");
        }), x(this.container, this.opts.element, this.opts.adaptContainerCssClass), this.container.css(D(c.containerCss)), this.container.addClass(D(c.containerCssClass)), this.elementTabIndex = this.opts.element.attr("tabIndex"), this.opts.element.data("select2", this).addClass("select2-offscreen").bind("focus.select2", function () {
          a(this).select2("focus");
        }).attr("tabIndex", "-1").before(this.container), this.container.data("select2", this), this.dropdown = this.container.find(".select2-drop"), this.dropdown.addClass(D(c.dropdownCssClass)), this.dropdown.data("select2", this), this.results = d = this.container.find(f), this.search = e = this.container.find("input.select2-input"), e.attr("tabIndex", this.elementTabIndex), this.resultsPage = 0, this.context = null, this.initContainer(), p(this.results), this.dropdown.delegate(f, "mousemove-filtered touchstart touchmove touchend", this.bind(this.highlightUnderEvent)), s(80, this.results), this.dropdown.delegate(f, "scroll-debounced", this.bind(this.loadMoreIfNeeded)), a.fn.mousewheel && d.mousewheel(function (a, b, c, e) {
          var f = d.scrollTop();
          e > 0 && 0 >= f - e ? (d.scrollTop(0), u(a)) : 0 > e && d.get(0).scrollHeight - d.scrollTop() + e <= d.height() && (d.scrollTop(d.get(0).scrollHeight - d.height()), u(a));
        }), o(e), e.bind("keyup-change input paste", this.bind(this.updateResults)), e.bind("focus", function () {
          e.addClass("select2-focused");
        }), e.bind("blur", function () {
          e.removeClass("select2-focused");
        }), this.dropdown.delegate(f, "mouseup", this.bind(function (b) {
          a(b.target).closest(".select2-result-selectable").length > 0 && (this.highlightUnderEvent(b), this.selectHighlighted(b));
        })), this.dropdown.bind("click mouseup mousedown", function (a) {
          a.stopPropagation();
        }), a.isFunction(this.opts.initSelection) && (this.initSelection(), this.monitorSource()), (c.element.is(":disabled") || c.element.is("[readonly='readonly']")) && this.disable();
      },
      destroy: function destroy() {
        var a = this.opts.element.data("select2");
        this.propertyObserver && (delete this.propertyObserver, this.propertyObserver = null), a !== b && (a.container.remove(), a.dropdown.remove(), a.opts.element.removeClass("select2-offscreen").removeData("select2").unbind(".select2").attr({
          tabIndex: this.elementTabIndex
        }).show());
      },
      prepareOpts: function prepareOpts(c) {
        var d, e, f, g;
        if (d = c.element, "select" === d.get(0).tagName.toLowerCase() && (this.select = e = c.element), e && a.each(["id", "multiple", "ajax", "query", "createSearchChoice", "initSelection", "data", "tags"], function () {
          if (this in c) throw Error("Option '" + this + "' is not allowed for Select2 when attached to a <select> element.");
        }), c = a.extend({}, {
          populateResults: function populateResults(d, e, f) {
            var _g,
              k = this.opts.id,
              l = this;
            _g = function g(d, e, h) {
              var i, j, m, n, o, p, q, r, s, t;
              for (d = c.sortResults(d, e, f), i = 0, j = d.length; j > i; i += 1) m = d[i], o = m.disabled === !0, n = !o && k(m) !== b, p = m.children && m.children.length > 0, q = a("<li></li>"), q.addClass("select2-results-dept-" + h), q.addClass("select2-result"), q.addClass(n ? "select2-result-selectable" : "select2-result-unselectable"), o && q.addClass("select2-disabled"), p && q.addClass("select2-result-with-children"), q.addClass(l.opts.formatResultCssClass(m)), r = a(document.createElement("div")), r.addClass("select2-result-label"), t = c.formatResult(m, r, f, l.opts.escapeMarkup), t !== b && r.html(t), q.append(r), p && (s = a("<ul></ul>"), s.addClass("select2-result-sub"), _g(m.children, s, h + 1), q.append(s)), q.data("select2-data", m), e.append(q);
            }, _g(e, d, 0);
          }
        }, a.fn.select2.defaults, c), "function" != typeof c.id && (f = c.id, c.id = function (a) {
          return a[f];
        }), a.isArray(c.element.data("select2Tags"))) {
          if ("tags" in c) throw "tags specified as both an attribute 'data-select2-tags' and in options of Select2 " + c.element.attr("id");
          c.tags = c.element.data("select2Tags");
        }
        if (e ? (c.query = this.bind(function (c) {
          var g,
            h,
            _i,
            e = {
              results: [],
              more: !1
            },
            f = c.term;
          _i = function i(a, b) {
            var d;
            a.is("option") ? c.matcher(f, a.text(), a) && b.push({
              id: a.attr("value"),
              text: a.text(),
              element: a.get(),
              css: a.attr("class"),
              disabled: l(a.attr("disabled"), "disabled")
            }) : a.is("optgroup") && (d = {
              text: a.attr("label"),
              children: [],
              element: a.get(),
              css: a.attr("class")
            }, a.children().each2(function (a, b) {
              _i(b, d.children);
            }), d.children.length > 0 && b.push(d));
          }, g = d.children(), this.getPlaceholder() !== b && g.length > 0 && (h = g[0], "" === a(h).text() && (g = g.not(h))), g.each2(function (a, b) {
            _i(b, e.results);
          }), c.callback(e);
        }), c.id = function (a) {
          return a.id;
        }, c.formatResultCssClass = function (a) {
          return a.css;
        }) : "query" in c || ("ajax" in c ? (g = c.element.data("ajax-url"), g && g.length > 0 && (c.ajax.url = g), c.query = z.call(c.element, c.ajax)) : "data" in c ? c.query = A(c.data) : "tags" in c && (c.query = B(c.tags), c.createSearchChoice === b && (c.createSearchChoice = function (a) {
          return {
            id: a,
            text: a
          };
        }), c.initSelection === b && (c.initSelection = function (d, e) {
          var f = [];
          a(m(d.val(), c.separator)).each(function () {
            var d = this,
              e = this,
              g = c.tags;
            a.isFunction(g) && (g = g()), a(g).each(function () {
              return l(this.id, d) ? (e = this.text, !1) : b;
            }), f.push({
              id: d,
              text: e
            });
          }), e(f);
        }))), "function" != typeof c.query) throw "query function not defined for Select2 " + c.element.attr("id");
        return c;
      },
      monitorSource: function monitorSource() {
        var b,
          a = this.opts.element;
        a.bind("change.select2", this.bind(function () {
          this.opts.element.data("select2-change-triggered") !== !0 && this.initSelection();
        })), b = this.bind(function () {
          var a, b;
          a = "disabled" !== this.opts.element.attr("disabled"), b = "readonly" === this.opts.element.attr("readonly"), a = a && !b, this.enabled !== a && (a ? this.enable() : this.disable()), x(this.container, this.opts.element, this.opts.adaptContainerCssClass), this.container.addClass(D(this.opts.containerCssClass)), x(this.dropdown, this.opts.element, this.opts.adaptDropdownCssClass), this.dropdown.addClass(D(this.opts.dropdownCssClass));
        }), a.bind("propertychange.select2 DOMAttrModified.select2", b), "undefined" != typeof WebKitMutationObserver && (this.propertyObserver && (delete this.propertyObserver, this.propertyObserver = null), this.propertyObserver = new WebKitMutationObserver(function (a) {
          a.forEach(b);
        }), this.propertyObserver.observe(a.get(0), {
          attributes: !0,
          subtree: !1
        }));
      },
      triggerChange: function triggerChange(b) {
        b = b || {}, b = a.extend({}, b, {
          type: "change",
          val: this.val()
        }), this.opts.element.data("select2-change-triggered", !0), this.opts.element.trigger(b), this.opts.element.data("select2-change-triggered", !1), this.opts.element.click(), this.opts.blurOnChange && this.opts.element.blur();
      },
      enable: function enable() {
        this.enabled || (this.enabled = !0, this.container.removeClass("select2-container-disabled"), this.opts.element.removeAttr("disabled"));
      },
      disable: function disable() {
        this.enabled && (this.close(), this.enabled = !1, this.container.addClass("select2-container-disabled"), this.opts.element.attr("disabled", "disabled"));
      },
      opened: function opened() {
        return this.container.hasClass("select2-dropdown-open");
      },
      positionDropdown: function positionDropdown() {
        var o,
          p,
          q,
          b = this.container.offset(),
          c = this.container.outerHeight(!1),
          d = this.container.outerWidth(!1),
          e = this.dropdown.outerHeight(!1),
          f = a(window).scrollLeft() + a(window).width(),
          g = a(window).scrollTop() + a(window).height(),
          h = b.top + c,
          i = b.left,
          j = g >= h + e,
          k = b.top - e >= this.body().scrollTop(),
          l = this.dropdown.outerWidth(!1),
          m = f >= i + l,
          n = this.dropdown.hasClass("select2-drop-above");
        "static" !== this.body().css("position") && (o = this.body().offset(), h -= o.top, i -= o.left), n ? (p = !0, !k && j && (p = !1)) : (p = !1, !j && k && (p = !0)), m || (i = b.left + d - l), p ? (h = b.top - e, this.container.addClass("select2-drop-above"), this.dropdown.addClass("select2-drop-above")) : (this.container.removeClass("select2-drop-above"), this.dropdown.removeClass("select2-drop-above")), q = a.extend({
          top: h,
          left: i,
          width: d
        }, D(this.opts.dropdownCss)), this.dropdown.css(q);
      },
      shouldOpen: function shouldOpen() {
        var b;
        return this.opened() ? !1 : (b = a.Event("opening"), this.opts.element.trigger(b), !b.isDefaultPrevented());
      },
      clearDropdownAlignmentPreference: function clearDropdownAlignmentPreference() {
        this.container.removeClass("select2-drop-above"), this.dropdown.removeClass("select2-drop-above");
      },
      open: function open() {
        return this.shouldOpen() ? (window.setTimeout(this.bind(this.opening), 1), !0) : !1;
      },
      opening: function opening() {
        function h() {
          return {
            width: Math.max(document.documentElement.scrollWidth, a(window).width()),
            height: Math.max(document.documentElement.scrollHeight, a(window).height())
          };
        }
        var f,
          b = this.containerId,
          c = "scroll." + b,
          d = "resize." + b,
          e = "orientationchange." + b;
        this.clearDropdownAlignmentPreference(), this.container.addClass("select2-dropdown-open").addClass("select2-container-active"), this.dropdown[0] !== this.body().children().last()[0] && this.dropdown.detach().appendTo(this.body()), this.updateResults(!0), f = a("#select2-drop-mask"), 0 == f.length && (f = a(document.createElement("div")), f.attr("id", "select2-drop-mask").attr("class", "select2-drop-mask"), f.hide(), f.appendTo(this.body()), f.bind("mousedown touchstart", function () {
          var d,
            c = a("#select2-drop");
          c.length > 0 && (d = c.data("select2"), d.opts.selectOnBlur && d.selectHighlighted({
            noFocus: !0
          }), d.close());
        })), this.dropdown.prev()[0] !== f[0] && this.dropdown.before(f), a("#select2-drop").removeAttr("id"), this.dropdown.attr("id", "select2-drop"), f.css(h()), f.show(), this.dropdown.show(), this.positionDropdown(), this.dropdown.addClass("select2-drop-active"), this.ensureHighlightVisible();
        var g = this;
        this.container.parents().add(window).each(function () {
          a(this).bind(d + " " + c + " " + e, function () {
            a("#select2-drop-mask").css(h()), g.positionDropdown();
          });
        }), this.focusSearch();
      },
      close: function close() {
        if (this.opened()) {
          var b = this.containerId,
            c = "scroll." + b,
            d = "resize." + b,
            e = "orientationchange." + b;
          this.container.parents().add(window).each(function () {
            a(this).unbind(c).unbind(d).unbind(e);
          }), this.clearDropdownAlignmentPreference(), a("#select2-drop-mask").hide(), this.dropdown.removeAttr("id"), this.dropdown.hide(), this.container.removeClass("select2-dropdown-open"), this.results.empty(), this.clearSearch(), this.search.removeClass("select2-active"), this.opts.element.trigger(a.Event("close"));
        }
      },
      clearSearch: function clearSearch() {},
      getMaximumSelectionSize: function getMaximumSelectionSize() {
        return D(this.opts.maximumSelectionSize);
      },
      ensureHighlightVisible: function ensureHighlightVisible() {
        var d,
          e,
          f,
          g,
          h,
          i,
          j,
          c = this.results;
        if (e = this.highlight(), !(0 > e)) {
          if (0 == e) return c.scrollTop(0), b;
          d = this.findHighlightableChoices(), f = a(d[e]), g = f.offset().top + f.outerHeight(!0), e === d.length - 1 && (j = c.find("li.select2-more-results"), j.length > 0 && (g = j.offset().top + j.outerHeight(!0))), h = c.offset().top + c.outerHeight(!0), g > h && c.scrollTop(c.scrollTop() + (g - h)), i = f.offset().top - c.offset().top, 0 > i && "none" != f.css("display") && c.scrollTop(c.scrollTop() + i);
        }
      },
      findHighlightableChoices: function findHighlightableChoices() {
        return this.results.find(".select2-result-selectable:not(.select2-selected):not(.select2-disabled)"), this.results.find(".select2-result-selectable:not(.select2-selected):not(.select2-disabled)");
      },
      moveHighlight: function moveHighlight(b) {
        for (var c = this.findHighlightableChoices(), d = this.highlight(); d > -1 && c.length > d;) {
          d += b;
          var e = a(c[d]);
          if (e.hasClass("select2-result-selectable") && !e.hasClass("select2-disabled") && !e.hasClass("select2-selected")) {
            this.highlight(d);
            break;
          }
        }
      },
      highlight: function highlight(c) {
        var e,
          f,
          d = this.findHighlightableChoices();
        return 0 === arguments.length ? k(d.filter(".select2-highlighted")[0], d.get()) : (c >= d.length && (c = d.length - 1), 0 > c && (c = 0), this.results.find(".select2-highlighted").removeClass("select2-highlighted"), e = a(d[c]), e.addClass("select2-highlighted"), this.ensureHighlightVisible(), f = e.data("select2-data"), f && this.opts.element.trigger({
          type: "highlight",
          val: this.id(f),
          choice: f
        }), b);
      },
      countSelectableResults: function countSelectableResults() {
        return this.findHighlightableChoices().length;
      },
      highlightUnderEvent: function highlightUnderEvent(b) {
        var c = a(b.target).closest(".select2-result-selectable");
        if (c.length > 0 && !c.is(".select2-highlighted")) {
          var d = this.findHighlightableChoices();
          this.highlight(d.index(c));
        } else 0 == c.length && this.results.find(".select2-highlighted").removeClass("select2-highlighted");
      },
      loadMoreIfNeeded: function loadMoreIfNeeded() {
        var c,
          a = this.results,
          b = a.find("li.select2-more-results"),
          e = this.resultsPage + 1,
          f = this,
          g = this.search.val(),
          h = this.context;
        0 !== b.length && (c = b.offset().top - a.offset().top - a.height(), this.opts.loadMorePadding >= c && (b.addClass("select2-active"), this.opts.query({
          element: this.opts.element,
          term: g,
          page: e,
          context: h,
          matcher: this.opts.matcher,
          callback: this.bind(function (c) {
            f.opened() && (f.opts.populateResults.call(this, a, c.results, {
              term: g,
              page: e,
              context: h
            }), f.postprocessResults(c, !1, !1), c.more === !0 ? (b.detach().appendTo(a).text(f.opts.formatLoadMore(e + 1)), window.setTimeout(function () {
              f.loadMoreIfNeeded();
            }, 10)) : b.remove(), f.positionDropdown(), f.resultsPage = e, f.context = c.context);
          })
        })));
      },
      tokenize: function tokenize() {},
      updateResults: function updateResults(c) {
        function m() {
          e.scrollTop(0), d.removeClass("select2-active"), h.positionDropdown();
        }
        function n(a) {
          e.html(a), m();
        }
        var g,
          i,
          d = this.search,
          e = this.results,
          f = this.opts,
          h = this,
          j = d.val(),
          k = a.data(this.container, "select2-last-term");
        if ((c === !0 || !k || !l(j, k)) && (a.data(this.container, "select2-last-term", j), c === !0 || this.showSearchInput !== !1 && this.opened())) {
          var o = this.getMaximumSelectionSize();
          if (o >= 1 && (g = this.data(), a.isArray(g) && g.length >= o && C(f.formatSelectionTooBig, "formatSelectionTooBig"))) return n("<li class='select2-selection-limit'>" + f.formatSelectionTooBig(o) + "</li>"), b;
          if (d.val().length < f.minimumInputLength) return C(f.formatInputTooShort, "formatInputTooShort") ? n("<li class='select2-no-results'>" + f.formatInputTooShort(d.val(), f.minimumInputLength) + "</li>") : n(""), b;
          if (f.maximumInputLength && d.val().length > f.maximumInputLength) return C(f.formatInputTooLong, "formatInputTooLong") ? n("<li class='select2-no-results'>" + f.formatInputTooLong(d.val(), f.maximumInputLength) + "</li>") : n(""), b;
          f.formatSearching && 0 === this.findHighlightableChoices().length && n("<li class='select2-searching'>" + f.formatSearching() + "</li>"), d.addClass("select2-active"), i = this.tokenize(), i != b && null != i && d.val(i), this.resultsPage = 1, f.query({
            element: f.element,
            term: d.val(),
            page: this.resultsPage,
            context: null,
            matcher: f.matcher,
            callback: this.bind(function (g) {
              var i;
              return this.opened() ? (this.context = g.context === b ? null : g.context, this.opts.createSearchChoice && "" !== d.val() && (i = this.opts.createSearchChoice.call(null, d.val(), g.results), i !== b && null !== i && h.id(i) !== b && null !== h.id(i) && 0 === a(g.results).filter(function () {
                return l(h.id(this), h.id(i));
              }).length && g.results.unshift(i)), 0 === g.results.length && C(f.formatNoMatches, "formatNoMatches") ? (n("<li class='select2-no-results'>" + f.formatNoMatches(d.val()) + "</li>"), b) : (e.empty(), h.opts.populateResults.call(this, e, g.results, {
                term: d.val(),
                page: this.resultsPage,
                context: null
              }), g.more === !0 && C(f.formatLoadMore, "formatLoadMore") && (e.append("<li class='select2-more-results'>" + h.opts.escapeMarkup(f.formatLoadMore(this.resultsPage)) + "</li>"), window.setTimeout(function () {
                h.loadMoreIfNeeded();
              }, 10)), this.postprocessResults(g, c), m(), this.opts.element.trigger({
                type: "loaded",
                data: g
              }), b)) : (this.search.removeClass("select2-active"), b);
            })
          });
        }
      },
      cancel: function cancel() {
        this.close();
      },
      blur: function blur() {
        this.opts.selectOnBlur && this.selectHighlighted({
          noFocus: !0
        }), this.close(), this.container.removeClass("select2-container-active"), this.search[0] === document.activeElement && this.search.blur(), this.clearSearch(), this.selection.find(".select2-search-choice-focus").removeClass("select2-search-choice-focus");
      },
      focusSearch: function focusSearch() {
        t(this.search);
      },
      selectHighlighted: function selectHighlighted(a) {
        var b = this.highlight(),
          c = this.results.find(".select2-highlighted"),
          d = c.closest(".select2-result").data("select2-data");
        d && (this.highlight(b), this.onSelect(d, a));
      },
      getPlaceholder: function getPlaceholder() {
        return this.opts.element.attr("placeholder") || this.opts.element.attr("data-placeholder") || this.opts.element.data("placeholder") || this.opts.placeholder;
      },
      initContainerWidth: function initContainerWidth() {
        function c() {
          var c, d, e, f, g;
          if ("off" === this.opts.width) return null;
          if ("element" === this.opts.width) return 0 === this.opts.element.outerWidth(!1) ? "auto" : this.opts.element.outerWidth(!1) + "px";
          if ("copy" === this.opts.width || "resolve" === this.opts.width) {
            if (c = this.opts.element.attr("style"), c !== b) for (d = c.split(";"), f = 0, g = d.length; g > f; f += 1) if (e = d[f].replace(/\s/g, "").match(/width:(([-+]?([0-9]*\.)?[0-9]+)(px|em|ex|%|in|cm|mm|pt|pc))/), null !== e && e.length >= 1) return e[1];
            return "resolve" === this.opts.width ? (c = this.opts.element.css("width"), c.indexOf("%") > 0 ? c : 0 === this.opts.element.outerWidth(!1) ? "auto" : this.opts.element.outerWidth(!1) + "px") : null;
          }
          return a.isFunction(this.opts.width) ? this.opts.width() : this.opts.width;
        }
        var d = c.call(this);
        null !== d && this.container.css("width", d);
      }
    }), e = G(d, {
      createContainer: function createContainer() {
        var b = a(document.createElement("div")).attr({
          "class": "select2-container"
        }).html(["<a href='javascript:void(0)' onclick='return false;' class='select2-choice' tabindex='-1'>", "   <span></span><abbr class='select2-search-choice-close' style='display:none;'></abbr>", "   <div><b></b></div>", "</a>", "<input class='select2-focusser select2-offscreen' type='text'/>", "<div class='select2-drop' style='display:none'>", "   <div class='select2-search'>", "       <input type='text' autocomplete='off' class='select2-input'/>", "   </div>", "   <ul class='select2-results'>", "   </ul>", "</div>"].join(""));
        return b;
      },
      disable: function disable() {
        this.enabled && (this.parent.disable.apply(this, arguments), this.focusser.attr("disabled", "disabled"));
      },
      enable: function enable() {
        this.enabled || (this.parent.enable.apply(this, arguments), this.focusser.removeAttr("disabled"));
      },
      opening: function opening() {
        this.parent.opening.apply(this, arguments), this.focusser.attr("disabled", "disabled"), this.opts.element.trigger(a.Event("open"));
      },
      close: function close() {
        this.opened() && (this.parent.close.apply(this, arguments), this.focusser.removeAttr("disabled"), t(this.focusser));
      },
      focus: function focus() {
        this.opened() ? this.close() : (this.focusser.removeAttr("disabled"), this.focusser.focus());
      },
      isFocused: function isFocused() {
        return this.container.hasClass("select2-container-active");
      },
      cancel: function cancel() {
        this.parent.cancel.apply(this, arguments), this.focusser.removeAttr("disabled"), this.focusser.focus();
      },
      initContainer: function initContainer() {
        var d,
          e = this.container,
          f = this.dropdown,
          h = !1;
        this.showSearch(this.opts.minimumResultsForSearch >= 0), this.selection = d = e.find(".select2-choice"), this.focusser = e.find(".select2-focusser"), this.focusser.attr("id", "s2id_autogen" + g()), a("label[for='" + this.opts.element.attr("id") + "']").attr("for", this.focusser.attr("id")), this.search.bind("keydown", this.bind(function (a) {
          if (this.enabled) {
            if (a.which === c.PAGE_UP || a.which === c.PAGE_DOWN) return u(a), b;
            switch (a.which) {
              case c.UP:
              case c.DOWN:
                return this.moveHighlight(a.which === c.UP ? -1 : 1), u(a), b;
              case c.TAB:
              case c.ENTER:
                return this.selectHighlighted(), u(a), b;
              case c.ESC:
                return this.cancel(a), u(a), b;
            }
          }
        })), this.search.bind("blur", this.bind(function () {
          document.activeElement === this.body().get(0) && window.setTimeout(this.bind(function () {
            this.search.focus();
          }), 0);
        })), this.focusser.bind("keydown", this.bind(function (a) {
          return !this.enabled || a.which === c.TAB || c.isControl(a) || c.isFunctionKey(a) || a.which === c.ESC ? b : this.opts.openOnEnter === !1 && a.which === c.ENTER ? (u(a), b) : a.which == c.DOWN || a.which == c.UP || a.which == c.ENTER && this.opts.openOnEnter ? (this.open(), u(a), b) : a.which == c.DELETE || a.which == c.BACKSPACE ? (this.opts.allowClear && this.clear(), u(a), b) : b;
        })), o(this.focusser), this.focusser.bind("keyup-change input", this.bind(function (a) {
          this.opened() || (this.open(), this.showSearchInput !== !1 && this.search.val(this.focusser.val()), this.focusser.val(""), u(a));
        })), d.delegate("abbr", "mousedown", this.bind(function (a) {
          this.enabled && (this.clear(), v(a), this.close(), this.selection.focus());
        })), d.bind("mousedown", this.bind(function (a) {
          h = !0, this.opened() ? this.close() : this.enabled && this.open(), u(a), h = !1;
        })), f.bind("mousedown", this.bind(function () {
          this.search.focus();
        })), d.bind("focus", this.bind(function (a) {
          u(a);
        })), this.focusser.bind("focus", this.bind(function () {
          this.container.addClass("select2-container-active");
        })).bind("blur", this.bind(function () {
          this.opened() || this.container.removeClass("select2-container-active");
        })), this.search.bind("focus", this.bind(function () {
          this.container.addClass("select2-container-active");
        })), this.initContainerWidth(), this.setPlaceholder();
      },
      clear: function clear(a) {
        var b = this.selection.data("select2-data");
        b && (this.opts.element.val(""), this.selection.find("span").empty(), this.selection.removeData("select2-data"), this.setPlaceholder(), a !== !1 && (this.opts.element.trigger({
          type: "removed",
          val: this.id(b),
          choice: b
        }), this.triggerChange({
          removed: b
        })));
      },
      initSelection: function initSelection() {
        if ("" === this.opts.element.val() && "" === this.opts.element.text()) this.close(), this.setPlaceholder();else {
          var c = this;
          this.opts.initSelection.call(null, this.opts.element, function (a) {
            a !== b && null !== a && (c.updateSelection(a), c.close(), c.setPlaceholder());
          });
        }
      },
      prepareOpts: function prepareOpts() {
        var b = this.parent.prepareOpts.apply(this, arguments);
        return "select" === b.element.get(0).tagName.toLowerCase() ? b.initSelection = function (b, c) {
          var d = b.find(":selected");
          a.isFunction(c) && c({
            id: d.attr("value"),
            text: d.text(),
            element: d
          });
        } : "data" in b && (b.initSelection = b.initSelection || function (c, d) {
          var e = c.val(),
            f = null;
          b.query({
            matcher: function matcher(a, c, d) {
              var g = l(e, b.id(d));
              return g && (f = d), g;
            },
            callback: a.isFunction(d) ? function () {
              d(f);
            } : a.noop
          });
        }), b;
      },
      getPlaceholder: function getPlaceholder() {
        return this.select && "" !== this.select.find("option").first().text() ? b : this.parent.getPlaceholder.apply(this, arguments);
      },
      setPlaceholder: function setPlaceholder() {
        var a = this.getPlaceholder();
        if ("" === this.opts.element.val() && a !== b) {
          if (this.select && "" !== this.select.find("option:first").text()) return;
          this.selection.find("span").html(this.opts.escapeMarkup(a)), this.selection.addClass("select2-default"), this.selection.find("abbr").hide();
        }
      },
      postprocessResults: function postprocessResults(a, c, d) {
        var e = 0,
          f = this,
          g = !0;
        if (this.findHighlightableChoices().each2(function (a, c) {
          return l(f.id(c.data("select2-data")), f.opts.element.val()) ? (e = a, !1) : b;
        }), d !== !1 && this.highlight(e), c === !0) {
          var h = this.opts.minimumResultsForSearch;
          g = 0 > h ? !1 : E(a.results) >= h, this.showSearch(g);
        }
      },
      showSearch: function showSearch(b) {
        this.showSearchInput = b, this.dropdown.find(".select2-search")[b ? "removeClass" : "addClass"]("select2-search-hidden"), a(this.dropdown, this.container)[b ? "addClass" : "removeClass"]("select2-with-searchbox");
      },
      onSelect: function onSelect(a, b) {
        var c = this.opts.element.val();
        this.opts.element.val(this.id(a)), this.updateSelection(a), this.opts.element.trigger({
          type: "selected",
          val: this.id(a),
          choice: a
        }), this.close(), b && b.noFocus || this.selection.focus(), l(c, this.id(a)) || this.triggerChange();
      },
      updateSelection: function updateSelection(a) {
        var d,
          c = this.selection.find("span");
        this.selection.data("select2-data", a), c.empty(), d = this.opts.formatSelection(a, c), d !== b && c.append(this.opts.escapeMarkup(d)), this.selection.removeClass("select2-default"), this.opts.allowClear && this.getPlaceholder() !== b && this.selection.find("abbr").show();
      },
      val: function val() {
        var a,
          c = !1,
          d = null,
          e = this;
        if (0 === arguments.length) return this.opts.element.val();
        if (a = arguments[0], arguments.length > 1 && (c = arguments[1]), this.select) this.select.val(a).find(":selected").each2(function (a, b) {
          return d = {
            id: b.attr("value"),
            text: b.text(),
            element: b.get(0)
          }, !1;
        }), this.updateSelection(d), this.setPlaceholder(), c && this.triggerChange();else {
          if (this.opts.initSelection === b) throw Error("cannot call val() if initSelection() is not defined");
          if (!a && 0 !== a) return this.clear(c), c && this.triggerChange(), b;
          this.opts.element.val(a), this.opts.initSelection(this.opts.element, function (a) {
            e.opts.element.val(a ? e.id(a) : ""), e.updateSelection(a), e.setPlaceholder(), c && e.triggerChange();
          });
        }
      },
      clearSearch: function clearSearch() {
        this.search.val(""), this.focusser.val("");
      },
      data: function data(a) {
        var c;
        return 0 === arguments.length ? (c = this.selection.data("select2-data"), c == b && (c = null), c) : (a && "" !== a ? (this.opts.element.val(a ? this.id(a) : ""), this.updateSelection(a)) : this.clear(), b);
      }
    }), f = G(d, {
      createContainer: function createContainer() {
        var b = a(document.createElement("div")).attr({
          "class": "select2-container select2-container-multi"
        }).html(["    <ul class='select2-choices'>", "  <li class='select2-search-field'>", "    <input type='text' autocomplete='off' class='select2-input'>", "  </li>", "</ul>", "<div class='select2-drop select2-drop-multi' style='display:none;'>", "   <ul class='select2-results'>", "   </ul>", "</div>"].join(""));
        return b;
      },
      prepareOpts: function prepareOpts() {
        var b = this.parent.prepareOpts.apply(this, arguments);
        return "select" === b.element.get(0).tagName.toLowerCase() ? b.initSelection = function (a, b) {
          var c = [];
          a.find(":selected").each2(function (a, b) {
            c.push({
              id: b.attr("value"),
              text: b.text(),
              element: b[0]
            });
          }), b(c);
        } : "data" in b && (b.initSelection = b.initSelection || function (c, d) {
          var e = m(c.val(), b.separator),
            f = [];
          b.query({
            matcher: function matcher(c, d, g) {
              var h = a.grep(e, function (a) {
                return l(a, b.id(g));
              }).length;
              return h && f.push(g), h;
            },
            callback: a.isFunction(d) ? function () {
              d(f);
            } : a.noop
          });
        }), b;
      },
      initContainer: function initContainer() {
        var e,
          d = ".select2-choices";
        this.searchContainer = this.container.find(".select2-search-field"), this.selection = e = this.container.find(d), this.search.attr("id", "s2id_autogen" + g()), a("label[for='" + this.opts.element.attr("id") + "']").attr("for", this.search.attr("id")), this.search.bind("input paste", this.bind(function () {
          this.enabled && (this.opened() || this.open());
        })), this.search.bind("keydown", this.bind(function (a) {
          if (this.enabled) {
            if (a.which === c.BACKSPACE && "" === this.search.val()) {
              this.close();
              var d,
                f = e.find(".select2-search-choice-focus");
              if (f.length > 0) return this.unselect(f.first()), this.search.width(10), u(a), b;
              d = e.find(".select2-search-choice:not(.select2-locked)"), d.length > 0 && d.last().addClass("select2-search-choice-focus");
            } else e.find(".select2-search-choice-focus").removeClass("select2-search-choice-focus");
            if (this.opened()) switch (a.which) {
              case c.UP:
              case c.DOWN:
                return this.moveHighlight(a.which === c.UP ? -1 : 1), u(a), b;
              case c.ENTER:
              case c.TAB:
                return this.selectHighlighted(), u(a), b;
              case c.ESC:
                return this.cancel(a), u(a), b;
            }
            if (a.which !== c.TAB && !c.isControl(a) && !c.isFunctionKey(a) && a.which !== c.BACKSPACE && a.which !== c.ESC) {
              if (a.which === c.ENTER) {
                if (this.opts.openOnEnter === !1) return;
                if (a.altKey || a.ctrlKey || a.shiftKey || a.metaKey) return;
              }
              this.open(), (a.which === c.PAGE_UP || a.which === c.PAGE_DOWN) && u(a), a.which === c.ENTER && u(a);
            }
          }
        })), this.search.bind("keyup", this.bind(this.resizeSearch)), this.search.bind("blur", this.bind(function (a) {
          this.container.removeClass("select2-container-active"), this.search.removeClass("select2-focused"), this.opened() || this.clearSearch(), a.stopImmediatePropagation();
        })), this.container.delegate(d, "mousedown", this.bind(function (b) {
          this.enabled && (a(b.target).closest(".select2-search-choice").length > 0 || (this.clearPlaceholder(), this.open(), this.focusSearch(), b.preventDefault()));
        })), this.container.delegate(d, "focus", this.bind(function () {
          this.enabled && (this.container.addClass("select2-container-active"), this.dropdown.addClass("select2-drop-active"), this.clearPlaceholder());
        })), this.initContainerWidth(), this.clearSearch();
      },
      enable: function enable() {
        this.enabled || (this.parent.enable.apply(this, arguments), this.search.removeAttr("disabled"));
      },
      disable: function disable() {
        this.enabled && (this.parent.disable.apply(this, arguments), this.search.attr("disabled", !0));
      },
      initSelection: function initSelection() {
        if ("" === this.opts.element.val() && "" === this.opts.element.text() && (this.updateSelection([]), this.close(), this.clearSearch()), this.select || "" !== this.opts.element.val()) {
          var c = this;
          this.opts.initSelection.call(null, this.opts.element, function (a) {
            a !== b && null !== a && (c.updateSelection(a), c.close(), c.clearSearch());
          });
        }
      },
      clearSearch: function clearSearch() {
        var a = this.getPlaceholder();
        a !== b && 0 === this.getVal().length && this.search.hasClass("select2-focused") === !1 ? (this.search.val(a).addClass("select2-default"), this.search.width(this.getMaxSearchWidth())) : this.search.val("").width(10);
      },
      clearPlaceholder: function clearPlaceholder() {
        this.search.hasClass("select2-default") && this.search.val("").removeClass("select2-default");
      },
      opening: function opening() {
        this.clearPlaceholder(), this.resizeSearch(), this.parent.opening.apply(this, arguments), this.focusSearch(), this.opts.element.trigger(a.Event("open"));
      },
      close: function close() {
        this.opened() && this.parent.close.apply(this, arguments);
      },
      focus: function focus() {
        this.close(), this.search.focus();
      },
      isFocused: function isFocused() {
        return this.search.hasClass("select2-focused");
      },
      updateSelection: function updateSelection(b) {
        var c = [],
          d = [],
          e = this;
        a(b).each(function () {
          0 > k(e.id(this), c) && (c.push(e.id(this)), d.push(this));
        }), b = d, this.selection.find(".select2-search-choice").remove(), a(b).each(function () {
          e.addSelectedChoice(this);
        }), e.postprocessResults();
      },
      tokenize: function tokenize() {
        var a = this.search.val();
        a = this.opts.tokenizer(a, this.data(), this.bind(this.onSelect), this.opts), null != a && a != b && (this.search.val(a), a.length > 0 && this.open());
      },
      onSelect: function onSelect(a, b) {
        this.addSelectedChoice(a), this.opts.element.trigger({
          type: "selected",
          val: this.id(a),
          choice: a
        }), (this.select || !this.opts.closeOnSelect) && this.postprocessResults(), this.opts.closeOnSelect ? (this.close(), this.search.width(10)) : this.countSelectableResults() > 0 ? (this.search.width(10), this.resizeSearch(), this.getMaximumSelectionSize() > 0 && this.val().length >= this.getMaximumSelectionSize() && this.updateResults(!0), this.positionDropdown()) : (this.close(), this.search.width(10)), this.triggerChange({
          added: a
        }), b && b.noFocus || this.focusSearch();
      },
      cancel: function cancel() {
        this.close(), this.focusSearch();
      },
      addSelectedChoice: function addSelectedChoice(c) {
        var j,
          d = !c.locked,
          e = a("<li class='select2-search-choice'>    <div></div>    <a href='#' onclick='return false;' class='select2-search-choice-close' tabindex='-1'></a></li>"),
          f = a("<li class='select2-search-choice select2-locked'><div></div></li>"),
          g = d ? e : f,
          h = this.id(c),
          i = this.getVal();
        j = this.opts.formatSelection(c, g.find("div")), j != b && g.find("div").replaceWith("<div>" + this.opts.escapeMarkup(j) + "</div>"), d && g.find(".select2-search-choice-close").bind("mousedown", u).bind("click dblclick", this.bind(function (b) {
          this.enabled && (a(b.target).closest(".select2-search-choice").fadeOut("fast", this.bind(function () {
            this.unselect(a(b.target)), this.selection.find(".select2-search-choice-focus").removeClass("select2-search-choice-focus"), this.close(), this.focusSearch();
          })).dequeue(), u(b));
        })).bind("focus", this.bind(function () {
          this.enabled && (this.container.addClass("select2-container-active"), this.dropdown.addClass("select2-drop-active"));
        })), g.data("select2-data", c), g.insertBefore(this.searchContainer), i.push(h), this.setVal(i);
      },
      unselect: function unselect(a) {
        var c,
          d,
          b = this.getVal();
        if (a = a.closest(".select2-search-choice"), 0 === a.length) throw "Invalid argument: " + a + ". Must be .select2-search-choice";
        c = a.data("select2-data"), c && (d = k(this.id(c), b), d >= 0 && (b.splice(d, 1), this.setVal(b), this.select && this.postprocessResults()), a.remove(), this.opts.element.trigger({
          type: "removed",
          val: this.id(c),
          choice: c
        }), this.triggerChange({
          removed: c
        }));
      },
      postprocessResults: function postprocessResults() {
        var a = this.getVal(),
          b = this.results.find(".select2-result"),
          c = this.results.find(".select2-result-with-children"),
          d = this;
        b.each2(function (b, c) {
          var e = d.id(c.data("select2-data"));
          k(e, a) >= 0 && (c.addClass("select2-selected"), c.find(".select2-result-selectable").addClass("select2-selected"));
        }), c.each2(function (a, b) {
          b.is(".select2-result-selectable") || 0 !== b.find(".select2-result-selectable:not(.select2-selected)").length || b.addClass("select2-selected");
        }), -1 == this.highlight() && d.highlight(0);
      },
      getMaxSearchWidth: function getMaxSearchWidth() {
        return this.selection.width() - n(this.search);
      },
      resizeSearch: function resizeSearch() {
        var a,
          b,
          c,
          d,
          e,
          f = n(this.search);
        a = w(this.search) + 10, b = this.search.offset().left, c = this.selection.width(), d = this.selection.offset().left, e = c - (b - d) - f, a > e && (e = c - f), 40 > e && (e = c - f), 0 >= e && (e = a), this.search.width(e);
      },
      getVal: function getVal() {
        var a;
        return this.select ? (a = this.select.val(), null === a ? [] : a) : (a = this.opts.element.val(), m(a, this.opts.separator));
      },
      setVal: function setVal(b) {
        var c;
        this.select ? this.select.val(b) : (c = [], a(b).each(function () {
          0 > k(this, c) && c.push(this);
        }), this.opts.element.val(0 === c.length ? "" : c.join(this.opts.separator)));
      },
      val: function val() {
        var c,
          d = !1,
          f = this;
        if (0 === arguments.length) return this.getVal();
        if (c = arguments[0], arguments.length > 1 && (d = arguments[1]), !c && 0 !== c) return this.opts.element.val(""), this.updateSelection([]), this.clearSearch(), d && this.triggerChange(), b;
        if (this.setVal(c), this.select) this.opts.initSelection(this.select, this.bind(this.updateSelection)), d && this.triggerChange();else {
          if (this.opts.initSelection === b) throw Error("val() cannot be called if initSelection() is not defined");
          this.opts.initSelection(this.opts.element, function (b) {
            var c = a(b).map(f.id);
            f.setVal(c), f.updateSelection(b), f.clearSearch(), d && f.triggerChange();
          });
        }
        this.clearSearch();
      },
      onSortStart: function onSortStart() {
        if (this.select) throw Error("Sorting of elements is not supported when attached to <select>. Attach to <input type='hidden'/> instead.");
        this.search.width(0), this.searchContainer.hide();
      },
      onSortEnd: function onSortEnd() {
        var b = [],
          c = this;
        this.searchContainer.show(), this.searchContainer.appendTo(this.searchContainer.parent()), this.resizeSearch(), this.selection.find(".select2-search-choice").each(function () {
          b.push(c.opts.id(a(this).data("select2-data")));
        }), this.setVal(b), this.triggerChange();
      },
      data: function data(c) {
        var e,
          d = this;
        return 0 === arguments.length ? this.selection.find(".select2-search-choice").map(function () {
          return a(this).data("select2-data");
        }).get() : (c || (c = []), e = a.map(c, function (a) {
          return d.opts.id(a);
        }), this.setVal(e), this.updateSelection(c), this.clearSearch(), b);
      }
    }), a.fn.select2 = function () {
      var d,
        g,
        h,
        i,
        c = Array.prototype.slice.call(arguments, 0),
        j = ["val", "destroy", "opened", "open", "close", "focus", "isFocused", "container", "onSortStart", "onSortEnd", "enable", "disable", "positionDropdown", "data"];
      return this.each(function () {
        if (0 === c.length || "object" == _typeof(c[0])) d = 0 === c.length ? {} : a.extend({}, c[0]), d.element = a(this), "select" === d.element.get(0).tagName.toLowerCase() ? i = d.element.attr("multiple") : (i = d.multiple || !1, "tags" in d && (d.multiple = i = !0)), g = i ? new f() : new e(), g.init(d);else {
          if ("string" != typeof c[0]) throw "Invalid arguments to select2 plugin: " + c;
          if (0 > k(c[0], j)) throw "Unknown method: " + c[0];
          if (h = b, g = a(this).data("select2"), g === b) return;
          if (h = "container" === c[0] ? g.container : g[c[0]].apply(g, c.slice(1)), h !== b) return !1;
        }
      }), h === b ? this : h;
    }, a.fn.select2.defaults = {
      width: "copy",
      loadMorePadding: 0,
      closeOnSelect: !0,
      openOnEnter: !0,
      containerCss: {},
      dropdownCss: {},
      containerCssClass: "",
      dropdownCssClass: "",
      formatResult: function formatResult(a, b, c, d) {
        var e = [];
        return y(a.text, c.term, e, d), e.join("");
      },
      formatSelection: function formatSelection(a) {
        return a ? a.text : b;
      },
      sortResults: function sortResults(a) {
        return a;
      },
      formatResultCssClass: function formatResultCssClass() {
        return b;
      },
      formatNoMatches: function formatNoMatches() {
        return "No matches found";
      },
      formatInputTooShort: function formatInputTooShort(a, b) {
        var c = b - a.length;
        return "Please enter " + c + " more character" + (1 == c ? "" : "s");
      },
      formatInputTooLong: function formatInputTooLong(a, b) {
        var c = a.length - b;
        return "Please delete " + c + " character" + (1 == c ? "" : "s");
      },
      formatSelectionTooBig: function formatSelectionTooBig(a) {
        return "You can only select " + a + " item" + (1 == a ? "" : "s");
      },
      formatLoadMore: function formatLoadMore() {
        return "Loading more results...";
      },
      formatSearching: function formatSearching() {
        return "Searching...";
      },
      minimumResultsForSearch: 0,
      minimumInputLength: 0,
      maximumInputLength: null,
      maximumSelectionSize: 0,
      id: function id(a) {
        return a.id;
      },
      matcher: function matcher(a, b) {
        return ("" + b).toUpperCase().indexOf(("" + a).toUpperCase()) >= 0;
      },
      separator: ",",
      tokenSeparators: [],
      tokenizer: F,
      escapeMarkup: function escapeMarkup(a) {
        var b = {
          "\\": "&#92;",
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&apos;",
          "/": "&#47;"
        };
        return (a + "").replace(/[&<>"'\/\\]/g, function (a) {
          return b[a[0]];
        });
      },
      blurOnChange: !1,
      selectOnBlur: !1,
      adaptContainerCssClass: function adaptContainerCssClass(a) {
        return a;
      },
      adaptDropdownCssClass: function adaptDropdownCssClass() {
        return null;
      }
    }, window.Select2 = {
      query: {
        ajax: z,
        local: A,
        tags: B
      },
      util: {
        debounce: q,
        markMatch: y
      },
      "class": {
        "abstract": d,
        single: e,
        multi: f
      }
    };
  }
}(jQuery);

/***/ }),

/***/ 116:
/***/ (function() {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ 379:
/***/ (function(module) {

"use strict";


var stylesInDOM = [];
function getIndexByIdentifier(identifier) {
  var result = -1;
  for (var i = 0; i < stylesInDOM.length; i++) {
    if (stylesInDOM[i].identifier === identifier) {
      result = i;
      break;
    }
  }
  return result;
}
function modulesToDom(list, options) {
  var idCountMap = {};
  var identifiers = [];
  for (var i = 0; i < list.length; i++) {
    var item = list[i];
    var id = options.base ? item[0] + options.base : item[0];
    var count = idCountMap[id] || 0;
    var identifier = "".concat(id, " ").concat(count);
    idCountMap[id] = count + 1;
    var indexByIdentifier = getIndexByIdentifier(identifier);
    var obj = {
      css: item[1],
      media: item[2],
      sourceMap: item[3],
      supports: item[4],
      layer: item[5]
    };
    if (indexByIdentifier !== -1) {
      stylesInDOM[indexByIdentifier].references++;
      stylesInDOM[indexByIdentifier].updater(obj);
    } else {
      var updater = addElementStyle(obj, options);
      options.byIndex = i;
      stylesInDOM.splice(i, 0, {
        identifier: identifier,
        updater: updater,
        references: 1
      });
    }
    identifiers.push(identifier);
  }
  return identifiers;
}
function addElementStyle(obj, options) {
  var api = options.domAPI(options);
  api.update(obj);
  var updater = function updater(newObj) {
    if (newObj) {
      if (newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap && newObj.supports === obj.supports && newObj.layer === obj.layer) {
        return;
      }
      api.update(obj = newObj);
    } else {
      api.remove();
    }
  };
  return updater;
}
module.exports = function (list, options) {
  options = options || {};
  list = list || [];
  var lastIdentifiers = modulesToDom(list, options);
  return function update(newList) {
    newList = newList || [];
    for (var i = 0; i < lastIdentifiers.length; i++) {
      var identifier = lastIdentifiers[i];
      var index = getIndexByIdentifier(identifier);
      stylesInDOM[index].references--;
    }
    var newLastIdentifiers = modulesToDom(newList, options);
    for (var _i = 0; _i < lastIdentifiers.length; _i++) {
      var _identifier = lastIdentifiers[_i];
      var _index = getIndexByIdentifier(_identifier);
      if (stylesInDOM[_index].references === 0) {
        stylesInDOM[_index].updater();
        stylesInDOM.splice(_index, 1);
      }
    }
    lastIdentifiers = newLastIdentifiers;
  };
};

/***/ }),

/***/ 569:
/***/ (function(module) {

"use strict";


var memo = {};

/* istanbul ignore next  */
function getTarget(target) {
  if (typeof memo[target] === "undefined") {
    var styleTarget = document.querySelector(target);

    // Special case to return head of iframe instead of iframe itself
    if (window.HTMLIFrameElement && styleTarget instanceof window.HTMLIFrameElement) {
      try {
        // This will throw an exception if access to iframe is blocked
        // due to cross-origin restrictions
        styleTarget = styleTarget.contentDocument.head;
      } catch (e) {
        // istanbul ignore next
        styleTarget = null;
      }
    }
    memo[target] = styleTarget;
  }
  return memo[target];
}

/* istanbul ignore next  */
function insertBySelector(insert, style) {
  var target = getTarget(insert);
  if (!target) {
    throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");
  }
  target.appendChild(style);
}
module.exports = insertBySelector;

/***/ }),

/***/ 216:
/***/ (function(module) {

"use strict";


/* istanbul ignore next  */
function insertStyleElement(options) {
  var element = document.createElement("style");
  options.setAttributes(element, options.attributes);
  options.insert(element, options.options);
  return element;
}
module.exports = insertStyleElement;

/***/ }),

/***/ 565:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


/* istanbul ignore next  */
function setAttributesWithoutAttributes(styleElement) {
  var nonce =  true ? __webpack_require__.nc : 0;
  if (nonce) {
    styleElement.setAttribute("nonce", nonce);
  }
}
module.exports = setAttributesWithoutAttributes;

/***/ }),

/***/ 795:
/***/ (function(module) {

"use strict";


/* istanbul ignore next  */
function apply(styleElement, options, obj) {
  var css = "";
  if (obj.supports) {
    css += "@supports (".concat(obj.supports, ") {");
  }
  if (obj.media) {
    css += "@media ".concat(obj.media, " {");
  }
  var needLayer = typeof obj.layer !== "undefined";
  if (needLayer) {
    css += "@layer".concat(obj.layer.length > 0 ? " ".concat(obj.layer) : "", " {");
  }
  css += obj.css;
  if (needLayer) {
    css += "}";
  }
  if (obj.media) {
    css += "}";
  }
  if (obj.supports) {
    css += "}";
  }
  var sourceMap = obj.sourceMap;
  if (sourceMap && typeof btoa !== "undefined") {
    css += "\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))), " */");
  }

  // For old IE
  /* istanbul ignore if  */
  options.styleTagTransform(css, styleElement, options.options);
}
function removeStyleElement(styleElement) {
  // istanbul ignore if
  if (styleElement.parentNode === null) {
    return false;
  }
  styleElement.parentNode.removeChild(styleElement);
}

/* istanbul ignore next  */
function domAPI(options) {
  if (typeof document === "undefined") {
    return {
      update: function update() {},
      remove: function remove() {}
    };
  }
  var styleElement = options.insertStyleElement(options);
  return {
    update: function update(obj) {
      apply(styleElement, options, obj);
    },
    remove: function remove() {
      removeStyleElement(styleElement);
    }
  };
}
module.exports = domAPI;

/***/ }),

/***/ 589:
/***/ (function(module) {

"use strict";


/* istanbul ignore next  */
function styleTagTransform(css, styleElement) {
  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = css;
  } else {
    while (styleElement.firstChild) {
      styleElement.removeChild(styleElement.firstChild);
    }
    styleElement.appendChild(document.createTextNode(css));
  }
}
module.exports = styleTagTransform;

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	!function() {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = function(module) {
/******/ 			var getter = module && module.__esModule ?
/******/ 				function() { return module['default']; } :
/******/ 				function() { return module; };
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	!function() {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = function(exports, definition) {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	!function() {
/******/ 		__webpack_require__.o = function(obj, prop) { return Object.prototype.hasOwnProperty.call(obj, prop); }
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	!function() {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = function(exports) {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/nonce */
/******/ 	!function() {
/******/ 		__webpack_require__.nc = undefined;
/******/ 	}();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
!function() {
"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXTERNAL MODULE: ./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js
var injectStylesIntoStyleTag = __webpack_require__(379);
var injectStylesIntoStyleTag_default = /*#__PURE__*/__webpack_require__.n(injectStylesIntoStyleTag);
// EXTERNAL MODULE: ./node_modules/style-loader/dist/runtime/styleDomAPI.js
var styleDomAPI = __webpack_require__(795);
var styleDomAPI_default = /*#__PURE__*/__webpack_require__.n(styleDomAPI);
// EXTERNAL MODULE: ./node_modules/style-loader/dist/runtime/insertBySelector.js
var insertBySelector = __webpack_require__(569);
var insertBySelector_default = /*#__PURE__*/__webpack_require__.n(insertBySelector);
// EXTERNAL MODULE: ./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js
var setAttributesWithoutAttributes = __webpack_require__(565);
var setAttributesWithoutAttributes_default = /*#__PURE__*/__webpack_require__.n(setAttributesWithoutAttributes);
// EXTERNAL MODULE: ./node_modules/style-loader/dist/runtime/insertStyleElement.js
var insertStyleElement = __webpack_require__(216);
var insertStyleElement_default = /*#__PURE__*/__webpack_require__.n(insertStyleElement);
// EXTERNAL MODULE: ./node_modules/style-loader/dist/runtime/styleTagTransform.js
var styleTagTransform = __webpack_require__(589);
var styleTagTransform_default = /*#__PURE__*/__webpack_require__.n(styleTagTransform);
// EXTERNAL MODULE: ./node_modules/mini-css-extract-plugin/dist/loader.js??ruleSet[1].rules[2].use[1]!./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??ruleSet[1].rules[2].use[3]!./src/admin/scss/admin.scss
var admin = __webpack_require__(116);
var admin_default = /*#__PURE__*/__webpack_require__.n(admin);
;// CONCATENATED MODULE: ./src/admin/scss/admin.scss

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (styleTagTransform_default());
options.setAttributes = (setAttributesWithoutAttributes_default());

      options.insert = insertBySelector_default().bind(null, "head");
    
options.domAPI = (styleDomAPI_default());
options.insertStyleElement = (insertStyleElement_default());

var update = injectStylesIntoStyleTag_default()((admin_default()), options);




       /* harmony default export */ var scss_admin = ((admin_default()) && (admin_default()).locals ? (admin_default()).locals : undefined);

;// CONCATENATED MODULE: ./src/admin/js/index.js
__webpack_require__(283);
__webpack_require__(324);
__webpack_require__(445);

var ajax_load_more = ajax_load_more || {};
jQuery(document).ready(function ($) {
  'use strict';

  ajax_load_more.options = {
    speed: 200
  };

  /**
   * Test REST API access
   *
   * @since 5.1.1
   */
  if ($('.restapi-access').length) {
    $.ajax({
      type: 'GET',
      url: alm_admin_localize.restapi.url + alm_admin_localize.restapi.namespace + '/test/',
      dataType: 'json',
      success: function success(data) {
        if (data.success) {
          console.log('Ajax Load More successfully connected to the WordPress REST API.');
        }
      },
      error: function error(status) {
        console.warn(status);
        $('.restapi-access').fadeIn();
      }
    });
  }

  /**
   * Build the header admin menu based on the sidebar.
   */
  function createAdminMenu() {
    var adminmenu = document.querySelector('#adminmenu .toplevel_page_ajax-load-more > ul');
    if (!adminmenu) {
      return;
    }
    var alm_header = document.querySelector('.ajax-load-more header.header-wrap');
    if (!alm_header) {
      return;
    }
    var menu = adminmenu.cloneNode(true);
    menu.setAttribute('class', '');
    var nav = document.createElement('nav');
    nav.appendChild(menu);
    alm_header.appendChild(nav);
  }
  createAdminMenu();

  /**
   * Tabbed Navigation Elements
   *
   * @since 5.4
   */
  var ACTIVE_TAB_CLASS = 'active';
  function openTabbedItem(button, almTabbedWrapper) {
    var activeBtn = document.querySelector('.alm-tabbed-wrapper--nav button.active'); // Get Currently Active Button.
    var id = button.dataset.id;

    // Remove currently active button.
    if (activeBtn) {
      activeBtn.classList.remove(ACTIVE_TAB_CLASS);
    }

    // Add Button Active Class.
    button.classList.add(ACTIVE_TAB_CLASS);

    // Activate Current Section
    if (almTabbedWrapper) {
      var currentActive = almTabbedWrapper.querySelector('.alm-tabbed-wrapper--section.' + ACTIVE_TAB_CLASS);
      var section = almTabbedWrapper.querySelector('.alm-tabbed-wrapper--section#' + id);
      if (currentActive && section) {
        currentActive.classList.remove(ACTIVE_TAB_CLASS);
        section.classList.add(ACTIVE_TAB_CLASS);
        section.focus({
          preventScroll: true
        });
        $('html, body').animate({
          scrollTop: $('.alm-tabbed-wrapper--sections').offset().top - 120
        }, 400, function () {
          history.replaceState({}, '', '#' + id);
        });
      }
    }
  }
  var almTabbedWrapper = document.querySelector('.alm-tabbed-wrapper');
  if (almTabbedWrapper) {
    var current = almTabbedWrapper.querySelector('.alm-tabbed-wrapper--section');
    if (current) {
      current.classList.add(ACTIVE_TAB_CLASS);
    }
    var tabbedNav = almTabbedWrapper.querySelectorAll('.alm-tabbed-wrapper--nav button');
    if (tabbedNav) {
      tabbedNav.forEach(function (item, index) {
        item.addEventListener('click', function () {
          openTabbedItem(this, almTabbedWrapper);
        });
      });
    }

    // Open section from hash.
    var hash = window.location.hash;
    if (hash) {
      hash = hash.replace('#', '');
      var targetBtn = document.querySelector('.alm-tabbed-wrapper--nav button[data-id="' + hash + '"]');
      if (targetBtn) {
        targetBtn.click();
      }
    } else {
      document.querySelector('.alm-tabbed-wrapper--nav button').classList.add(ACTIVE_TAB_CLASS);
    }
  }

  /**
   * Save Repeater Templates with cmd + s and ctrl + s
   *
   * @since 5.1
   */
  document.addEventListener('keydown', function (e) {
    if ((window.navigator.platform.match('Mac') ? e.metaKey : e.ctrlKey) && e.keyCode === 83) {
      if (e.target.nodeName === 'TEXTAREA' && $(e.target).closest('.repeater-wrap')) {
        var btn = $(e.target).closest('.repeater-wrap').find('input.save-repeater');
        if (btn) {
          btn.click();
        }
      }
      e.preventDefault();
    }
  }, false);

  /*
   *  Set focus in code mirror editor
   *  @since 5.1
   */
  $('label.trigger-codemirror').on('click', function () {
    var el = $(this);
    var id = el.data('id');
    var cm = window['editor_' + id];
    if (cm) {
      cm.focus();
      cm.setCursor(cm.lineCount(), 0);
    }
  });

  /**
   * Setting panel save actions.
   *
   * @since 3.2.0
   */
  var almSettings = $('#alm_OptionsForm'),
    savingSettings = false,
    settingsForm = document.querySelector('#alm_OptionsForm'),
    settingsTarget = document.querySelector('.alm-settings-feedback');
  if (settingsForm) {
    document.body.appendChild(settingsTarget);
  }
  ajax_load_more.saveSettings = function () {
    if (savingSettings) {
      return false;
    }
    savingSettings = true;
    settingsForm.classList.add('--saving');
    settingsTarget.classList.add('--saving');
    settingsTarget.innerHTML = alm_admin_localize.settings_saving;
    almSettings.ajaxSubmit({
      // Success
      success: function success() {
        // Delay for effect
        setTimeout(function () {
          settingsTarget.classList.remove('--saving');
          settingsTarget.classList.add('--saved');
          settingsTarget.innerHTML = alm_admin_localize.settings_saved;
          settingsForm.classList.remove('--saving');
          savingSettings = false;
          setTimeout(function () {
            settingsTarget.classList.remove('--saved');
          }, 2500);
        }, 500);
      },
      // Error
      error: function error() {
        // Delay for effect
        setTimeout(function () {
          settingsTarget.classList.remove('--saving');
          settingsTarget.classList.add('--error');
          settingsTarget.innerHTML = alm_admin_localize.settings_error;
          settingsForm.classList.remove('--saving');
          console.warn(alm_admin_localize.ajax_load_more + ' - ' + alm_admin_localize.settings_error);
          savingSettings = false;
          setTimeout(function () {
            settingsTarget.classList.remove('--error');
          }, 2500);
        }, 500);
      }
    });
    return false;
  };

  // On Change, save the settings
  var settingsTimer;
  $(document).on('change', '#alm_OptionsForm input, #alm_OptionsForm textarea, #alm_OptionsForm select', function () {
    // Set a timer to avoid updating settings to frequently
    if (settingsTimer) clearTimeout(settingsTimer);
    settingsTimer = setTimeout(function () {
      ajax_load_more.saveSettings();
    }, 500);
  });

  /**
   * Download Repeater Template
   * Trigger the download of a repeater template from the admin
   *
   * @since 3.6
   */
  $('.download-repeater').on('click', function () {
    this.closest('form').submit();
  });

  /**
   * Tooltipster
   *
   * @see http://iamceege.github.io/tooltipster/
   * @since 2.8.4
   */
  $('.ajax-load-more-inner-wrapper').on('mouseenter', '.tooltip:not(.tooltipstered)', function () {
    $(this).tooltipster({
      delay: 125,
      speed: 125,
      maxWidth: 325
    }).tooltipster('show');
  });

  /**
   * Button preview pane
   * Found on Settings and Shortcode Builder.
   *
   * @since 2.8.4
   */
  $('select#alm_settings_btn_color').on('change', function () {
    var color = jQuery(this).val();
    // Remove other colors
    var wrap = $('.ajax-load-more-wrap');
    wrap.attr('class', '');
    wrap.addClass('ajax-load-more-wrap');
    wrap.addClass(color);
    $('#test-alm-button', wrap).removeClass('loading');

    // Add loading class if Infinite loading style
    if (color.indexOf('infinite') >= 0) {
      $('#test-alm-button', wrap).addClass('loading');
    }
  });
  $('select#alm_settings_btn_color').click(function (e) {
    e.preventDefault();
  });
  $('.alm-template-listing li a').click(function (e) {
    e.preventDefault();
    var el = $(this),
      val = el.data('path');
    el.parent().parent().next('.template-selection').val(val);
  });
  $('.alm-template-section-nav li a').click(function (e) {
    e.preventDefault();
    var el = $(this),
      index = el.parent().index(),
      parent = el.parent().parent().parent('.repeater-wrap');
    if (!el.hasClass('active')) {
      el.parent().addClass('active').siblings().removeClass('active');
      $('.alm-template-toggle', parent).hide();
      $('.alm-template-toggle', parent).eq(index).show();
    }
  });

  // Copy to Clipboard
  $('.copy-to-clipboard').on('click', function () {
    var btn = $(this).get(0);
    var input = document.querySelector('#shortcode_output');
    if (input && btn) {
      var old_txt = btn.innerHTML;
      var copied_txt = btn.dataset.copied ? btn.dataset.copied : old_txt;
      input.select();
      document.execCommand('copy');
      input.disabled = true;
      btn.disabled = true;
      input.focus();

      // Set Text of Button
      btn.innerHTML = copied_txt;
      setTimeout(function () {
        btn.innerHTML = old_txt;
        input.disabled = false;
        btn.disabled = false;
      }, 2500);
    }
  });
  ajax_load_more.copyToClipboard = function (text) {
    window.prompt('Copy link to your clipboard: Press Ctrl + C then hit Enter to copy.', text);
  };

  // Copy link on repeater templates
  $('.alm-dropdown button.copy').click(function () {
    var container = $(this).closest('.repeater-wrap'),
      // find closet wrap
      el = container.data('name'); // get template name

    if (el === 'default') el = 'template-default';
    var c = $('#' + el).val(); // Get textarea val()
    ajax_load_more.copyToClipboard(c);
  });

  /*
   *  Expand/Collapse shortcode headings
   *
   *  @since 2.0.0
   */

  $(document).on('click', 'h3.heading', function () {
    var el = $(this);
    if ($(el).hasClass('open')) {
      $(el).next('.expand-wrap').slideDown(ajax_load_more.options.speed, 'alm_easeInOutQuad', function () {
        $(el).removeClass('open');
      });
    } else {
      $(el).next('.expand-wrap').slideUp(ajax_load_more.options.speed, 'alm_easeInOutQuad', function () {
        $(el).addClass('open');
      });
    }
  });

  // Toggle Links.
  $(document).on('click', '.toggle-all', function () {
    var el = $(this);
    if (el.hasClass('closed')) {
      el.removeClass('closed');
      $('h3.heading, h2.shortcode-title').removeClass('open');
      $('.section-wrap').slideDown(ajax_load_more.options.speed, 'alm_easeInOutQuad');
      $('.expand-wrap').slideDown(ajax_load_more.options.speed, 'alm_easeInOutQuad');
    } else {
      el.addClass('closed');
      $('h3.heading, h2.shortcode-title').addClass('open');
      $('.section-wrap').slideUp(ajax_load_more.options.speed, 'alm_easeInOutQuad');
      $('.expand-wrap').slideUp(ajax_load_more.options.speed, 'alm_easeInOutQuad');
    }
  });

  // Trigger click events on enter/return
  $('h3.heading, h2.shortcode-title').on('keypress', function (e) {
    var key = e.which;
    if (key == 13) {
      // the enter key code
      $(this).click();
      return false;
    }
  });

  /**
   * Activate License.
   *
   * @since 2.8.3
   */
  var almActivating = false;
  $(document).on('click', '.license-btn', function (e) {
    e.preventDefault();
    if (!almActivating) {
      $('.license-btn-wrap .msg').remove();
      almActivating = true;
      var el = $(this),
        wrap = el.closest('.license-btn-wrap'),
        parent = el.closest('.license'),
        type = el.data('type'),
        item = wrap.data('name'),
        url = wrap.data('url'),
        upgrade = wrap.data('upgrade-url'),
        status = wrap.data('option-status'),
        key = wrap.data('option-key'),
        license = parent.find('input[type=text]').val();
      $('.loading', parent).fadeIn(300);

      // Get value from Ajax
      $.ajax({
        type: 'GET',
        url: alm_admin_localize.ajax_admin_url,
        dataType: 'json',
        data: {
          action: 'alm_license_activation',
          nonce: alm_admin_localize.alm_admin_nonce,
          type: type,
          item: item,
          status: status,
          url: url,
          upgrade: upgrade,
          key: key,
          license: license
        },
        success: function success(data) {
          if (data.msg) {
            $('.license-btn-wrap', parent).append('<div class="msg">' + data.msg + '</div>');
          }
          if (data.license === 'valid') {
            $('.license-key-field .status', parent).addClass('active').removeClass('inactive').text(alm_admin_localize.active);
            $('.license-title .status', parent).addClass('valid').removeClass('invalid');
            $('.activate.license-btn', parent).addClass('hide');
            $('.check-licence.license-btn', parent).addClass('hide');
            $('.deactivate.license-btn', parent).removeClass('hide');
            $('.renew-btn', parent).addClass('hide');
            $('.no-license', parent).slideUp(200);
          } else {
            $('.license-key-field .status', parent).removeClass('active').addClass('inactive').text(alm_admin_localize.inactive);
            $('.license-title .status', parent).removeClass('valid').addClass('invalid');
            $('.activate.license-btn', parent).removeClass('hide');
            $('.check-licence.license-btn', parent).addClass('hide');
            $('.deactivate.license-btn', parent).addClass('hide');
            $('.no-license', parent).slideDown(200);
          }
          $('.loading', parent).delay(250).fadeOut(300);
          almActivating = false;
        },
        error: function error(status, _error) {
          console.warn(status, _error);
          $('.loading', parent).delay(250).fadeOut(300);
          almActivating = false;
        }
      });
    }
  });

  /**
   * Get layout value via Ajax and inject into template.
   *
   * @since 2.8.7
   */
  $(document).on('click', '.alm-layout-selection li .layout', function (e) {
    e.preventDefault();
    var el = $(this),
      type = el.data('type'),
      custom = el.hasClass('custom') ? 'true' : 'false',
      textarea = el.closest('.repeater-wrap').find('.CodeMirror'),
      layout_btn_text = el.html(),
      name = el.closest('.repeater-wrap').data('name');
    if (!el.hasClass('updating')) {
      el.addClass('updating');
      $('span', el).text(alm_admin_localize.applying_layout + '...');
      textarea.addClass('loading');

      // Get Codemirror Editor ID
      var eid = '';
      if (name === 'default') {
        // Default Template
        eid = window.editor_default;
      } else {
        // Repeater Templates
        eid = window['editor_' + name];
      }

      // Get value from Ajax
      $.ajax({
        type: 'GET',
        url: alm_admin_localize.ajax_admin_url,
        data: {
          action: 'alm_get_layout',
          type: type,
          custom: custom,
          nonce: alm_admin_localize.alm_admin_nonce
        },
        dataType: 'JSON',
        success: function success(data) {
          eid.setValue(data.value);

          // Clear button styles
          setTimeout(function () {
            $('span', el).text(alm_admin_localize.template_updated).blur();
            setTimeout(function () {
              el.removeClass('updating').html(layout_btn_text).blur(); // Close drop menu.
              el.closest('.alm-drop-btn').trigger('click');
              textarea.removeClass('loading');
            }, 400);
          }, 400);
        },
        error: function error(status) {
          console.warn(status);
          textarea.removeClass('loading');
        }
      });
    }
  });

  /**
   * Set Transient (Transient).
   *
   * @since 4.0
   */
  $(document).on('click', '.alm-transient button.notice-dismiss', function (e) {
    e.preventDefault();
    var el = $(this),
      container = el.parent('.alm-transient'),
      transient_name = container.data('transient'),
      duration = container.data('duration');

    // Get value from Ajax
    $.ajax({
      type: 'POST',
      url: alm_admin_localize.ajax_admin_url,
      data: {
        action: 'alm_set_transient',
        nonce: alm_admin_localize.alm_admin_nonce,
        transient_name: transient_name,
        duration: duration
      },
      success: function success(data) {
        container.fadeOut();
      },
      error: function error(xhr, status, _error2) {
        console.warn(status);
      }
    });
  });

  /**
   * Scroll to setting section.
   *
   * @since 2.7.3
   */
  $(document).on('change', '#alm-settings-nav', function (e) {
    e.preventDefault();
    var el = $(this),
      index = $('option:selected', el).index();
    if (index !== '#') {
      index = index - 1;
      $('html, body').animate({
        scrollTop: $('#alm_OptionsForm h2').eq(index).offset().top - 40
      }, 500);
    }
  });
});
}();
ajaxloadmore = __webpack_exports__;
/******/ })()
;