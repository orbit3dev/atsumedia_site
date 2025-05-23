! function (t, e) {
    "object" == typeof exports && "object" == typeof module ? module.exports = e() : "function" == typeof define && define.amd ? define([], e) : "object" == typeof exports ? exports.AlignmentBlockTune = e() : t.AlignmentBlockTune = e()
}(self, (function () {
    return function () {
        var t = {
                966: function (t, e, n) {
                    function r(t, e) {
                        for (var n = 0; n < e.length; n++) {
                            var r = e[n];
                            r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(t, r.key, r)
                        }
                    }
                    n(548).toString();
                    var i = n(630).make,
                        a = function () {
                            function t(e) {
                                var n = e.api,
                                    r = e.data,
                                    i = e.config,
                                    a = e.block;
                                ! function (t, e) {
                                    if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function")
                                }(this, t), this.api = n, this.block = a, this.settings = i, this.data = r || {
                                    alignment: this.getAlignment()
                                }, this.alignmentSettings = [{
                                    name: "left",
                                    icon: '<svg xmlns="http://www.w3.org/2000/svg" id="Layer" enable-background="new 0 0 64 64" height="20" viewBox="0 0 64 64" width="20"><path d="m54 8h-44c-1.104 0-2 .896-2 2s.896 2 2 2h44c1.104 0 2-.896 2-2s-.896-2-2-2z"/><path d="m54 52h-44c-1.104 0-2 .896-2 2s.896 2 2 2h44c1.104 0 2-.896 2-2s-.896-2-2-2z"/><path d="m10 23h28c1.104 0 2-.896 2-2s-.896-2-2-2h-28c-1.104 0-2 .896-2 2s.896 2 2 2z"/><path d="m54 30h-44c-1.104 0-2 .896-2 2s.896 2 2 2h44c1.104 0 2-.896 2-2s-.896-2-2-2z"/><path d="m10 45h28c1.104 0 2-.896 2-2s-.896-2-2-2h-28c-1.104 0-2 .896-2 2s.896 2 2 2z"/></svg>'
                                }, {
                                    name: "center",
                                    icon: '<svg xmlns="http://www.w3.org/2000/svg" id="Layer" enable-background="new 0 0 64 64" height="20" viewBox="0 0 64 64" width="20"><path d="m54 8h-44c-1.104 0-2 .896-2 2s.896 2 2 2h44c1.104 0 2-.896 2-2s-.896-2-2-2z"/><path d="m54 52h-44c-1.104 0-2 .896-2 2s.896 2 2 2h44c1.104 0 2-.896 2-2s-.896-2-2-2z"/><path d="m46 23c1.104 0 2-.896 2-2s-.896-2-2-2h-28c-1.104 0-2 .896-2 2s.896 2 2 2z"/><path d="m54 30h-44c-1.104 0-2 .896-2 2s.896 2 2 2h44c1.104 0 2-.896 2-2s-.896-2-2-2z"/><path d="m46 45c1.104 0 2-.896 2-2s-.896-2-2-2h-28c-1.104 0-2 .896-2 2s.896 2 2 2z"/></svg>'
                                }, {
                                    name: "right",
                                    icon: '<svg xmlns="http://www.w3.org/2000/svg" id="Layer" enable-background="new 0 0 64 64" height="20" viewBox="0 0 64 64" width="20"><path d="m54 8h-44c-1.104 0-2 .896-2 2s.896 2 2 2h44c1.104 0 2-.896 2-2s-.896-2-2-2z"/><path d="m54 52h-44c-1.104 0-2 .896-2 2s.896 2 2 2h44c1.104 0 2-.896 2-2s-.896-2-2-2z"/><path d="m54 19h-28c-1.104 0-2 .896-2 2s.896 2 2 2h28c1.104 0 2-.896 2-2s-.896-2-2-2z"/><path d="m54 30h-44c-1.104 0-2 .896-2 2s.896 2 2 2h44c1.104 0 2-.896 2-2s-.896-2-2-2z"/><path d="m54 41h-28c-1.104 0-2 .896-2 2s.896 2 2 2h28c1.104 0 2-.896 2-2s-.896-2-2-2z"/></svg>'
                                }], this._CSS = {
                                    alignment: {
                                        left: "ce-tune-alignment--left",
                                        center: "ce-tune-alignment--center",
                                        right: "ce-tune-alignment--right"
                                    }
                                }
                            }
                            var e, n, a;
                            return e = t, a = [{
                                key: "DEFAULT_ALIGNMENT",
                                get: function () {
                                    return "left"
                                }
                            }, {
                                key: "isTune",
                                get: function () {
                                    return !0
                                }
                            }], (n = [{
                                key: "getAlignment",
                                value: function () {
                                    var e, n;
                                    return null !== (e = this.settings) && void 0 !== e && e.blocks && this.settings.blocks.hasOwnProperty(this.block.name) ? this.settings.blocks[this.block.name] : null !== (n = this.settings) && void 0 !== n && n.default ? this.settings.default : t.DEFAULT_ALIGNMENT
                                }
                            }, {
                                key: "wrap",
                                value: function (t) {
                                    return this.wrapper = i("div"), this.wrapper.classList.toggle(this._CSS.alignment[this.data.alignment]), this.wrapper.append(t), this.wrapper
                                }
                            }, {
                                key: "render",
                                value: function () {
                                    var t = this,
                                        e = i("div");
                                    return this.alignmentSettings.map((function (n) {
                                        var r = document.createElement("button");
                                        return r.classList.add(t.api.styles.settingsButton), r.innerHTML = n.icon, r.type = "button", r.classList.toggle(t.api.styles.settingsButtonActive, n.name === t.data.alignment), e.appendChild(r), r
                                    })).forEach((function (e, n, r) {
                                        e.addEventListener("click", (function () {
                                            t.data = {
                                                alignment: t.alignmentSettings[n].name
                                            }, r.forEach((function (e, n) {
                                                var r = t.alignmentSettings[n].name;
                                                e.classList.toggle(t.api.styles.settingsButtonActive, r === t.data.alignment), t.wrapper.classList.toggle(t._CSS.alignment[r], r === t.data.alignment)
                                            }))
                                        }))
                                    })), e
                                }
                            }, {
                                key: "save",
                                value: function () {
                                    return this.data
                                }
                            }]) && r(e.prototype, n), a && r(e, a), t
                        }();
                    t.exports = a
                },
                630: function (t, e, n) {
                    "use strict";

                    function r(t) {
                        return function (t) {
                            if (Array.isArray(t)) return i(t)
                        }(t) || function (t) {
                            if ("undefined" != typeof Symbol && Symbol.iterator in Object(t)) return Array.from(t)
                        }(t) || function (t, e) {
                            if (t) {
                                if ("string" == typeof t) return i(t, e);
                                var n = Object.prototype.toString.call(t).slice(8, -1);
                                return "Object" === n && t.constructor && (n = t.constructor.name), "Map" === n || "Set" === n ? Array.from(t) : "Arguments" === n || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? i(t, e) : void 0
                            }
                        }(t) || function () {
                            throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")
                        }()
                    }

                    function i(t, e) {
                        (null == e || e > t.length) && (e = t.length);
                        for (var n = 0, r = new Array(e); n < e; n++) r[n] = t[n];
                        return r
                    }

                    function a(t) {
                        var e, n = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : null,
                            i = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {},
                            a = document.createElement(t);
                        for (var o in Array.isArray(n) ? (e = a.classList).add.apply(e, r(n)) : n && a.classList.add(n), i) a[o] = i[o];
                        return a
                    }
                    n.r(e), n.d(e, {
                        make: function () {
                            return a
                        }
                    })
                },
                424: function (t, e, n) {
                    "use strict";
                    var r = n(645),
                        i = n.n(r)()((function (t) {
                            return t[1]
                        }));
                    i.push([t.id, ".ce-tune-alignment--right {\n    text-align: right;\n}\n.ce-tune-alignment--center {\n    text-align: center;\n}\n.ce-tune-alignment--left {\n    text-align: left;\n}", ""]), e.Z = i
                },
                645: function (t) {
                    "use strict";
                    t.exports = function (t) {
                        var e = [];
                        return e.toString = function () {
                            return this.map((function (e) {
                                var n = t(e);
                                return e[2] ? "@media ".concat(e[2], " {").concat(n, "}") : n
                            })).join("")
                        }, e.i = function (t, n, r) {
                            "string" == typeof t && (t = [
                                [null, t, ""]
                            ]);
                            var i = {};
                            if (r)
                                for (var a = 0; a < this.length; a++) {
                                    var o = this[a][0];
                                    null != o && (i[o] = !0)
                                }
                            for (var s = 0; s < t.length; s++) {
                                var c = [].concat(t[s]);
                                r && i[c[0]] || (n && (c[2] ? c[2] = "".concat(n, " and ").concat(c[2]) : c[2] = n), e.push(c))
                            }
                        }, e
                    }
                },
                548: function (t, e, n) {
                    "use strict";
                    var r = n(379),
                        i = n.n(r),
                        a = n(424);
                    i()(a.Z, {
                        insert: "head",
                        singleton: !1
                    }), a.Z.locals
                },
                379: function (t, e, n) {
                    "use strict";
                    var r, i = function () {
                            var t = {};
                            return function (e) {
                                if (void 0 === t[e]) {
                                    var n = document.querySelector(e);
                                    if (window.HTMLIFrameElement && n instanceof window.HTMLIFrameElement) try {
                                        n = n.contentDocument.head
                                    } catch (t) {
                                        n = null
                                    }
                                    t[e] = n
                                }
                                return t[e]
                            }
                        }(),
                        a = [];

                    function o(t) {
                        for (var e = -1, n = 0; n < a.length; n++)
                            if (a[n].identifier === t) {
                                e = n;
                                break
                            } return e
                    }

                    function s(t, e) {
                        for (var n = {}, r = [], i = 0; i < t.length; i++) {
                            var s = t[i],
                                c = e.base ? s[0] + e.base : s[0],
                                u = n[c] || 0,
                                l = "".concat(c, " ").concat(u);
                            n[c] = u + 1;
                            var f = o(l),
                                d = {
                                    css: s[1],
                                    media: s[2],
                                    sourceMap: s[3]
                                }; - 1 !== f ? (a[f].references++, a[f].updater(d)) : a.push({
                                identifier: l,
                                updater: g(d, e),
                                references: 1
                            }), r.push(l)
                        }
                        return r
                    }

                    function c(t) {
                        var e = document.createElement("style"),
                            r = t.attributes || {};
                        if (void 0 === r.nonce) {
                            var a = n.nc;
                            a && (r.nonce = a)
                        }
                        if (Object.keys(r).forEach((function (t) {
                                e.setAttribute(t, r[t])
                            })), "function" == typeof t.insert) t.insert(e);
                        else {
                            var o = i(t.insert || "head");
                            if (!o) throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");
                            o.appendChild(e)
                        }
                        return e
                    }
                    var u, l = (u = [], function (t, e) {
                        return u[t] = e, u.filter(Boolean).join("\n")
                    });

                    function f(t, e, n, r) {
                        var i = n ? "" : r.media ? "@media ".concat(r.media, " {").concat(r.css, "}") : r.css;
                        if (t.styleSheet) t.styleSheet.cssText = l(e, i);
                        else {
                            var a = document.createTextNode(i),
                                o = t.childNodes;
                            o[e] && t.removeChild(o[e]), o.length ? t.insertBefore(a, o[e]) : t.appendChild(a)
                        }
                    }

                    function d(t, e, n) {
                        var r = n.css,
                            i = n.media,
                            a = n.sourceMap;
                        if (i ? t.setAttribute("media", i) : t.removeAttribute("media"), a && "undefined" != typeof btoa && (r += "\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(a)))), " */")), t.styleSheet) t.styleSheet.cssText = r;
                        else {
                            for (; t.firstChild;) t.removeChild(t.firstChild);
                            t.appendChild(document.createTextNode(r))
                        }
                    }
                    var h = null,
                        p = 0;

                    function g(t, e) {
                        var n, r, i;
                        if (e.singleton) {
                            var a = p++;
                            n = h || (h = c(e)), r = f.bind(null, n, a, !1), i = f.bind(null, n, a, !0)
                        } else n = c(e), r = d.bind(null, n, e), i = function () {
                            ! function (t) {
                                if (null === t.parentNode) return !1;
                                t.parentNode.removeChild(t)
                            }(n)
                        };
                        return r(t),
                            function (e) {
                                if (e) {
                                    if (e.css === t.css && e.media === t.media && e.sourceMap === t.sourceMap) return;
                                    r(t = e)
                                } else i()
                            }
                    }
                    t.exports = function (t, e) {
                        (e = e || {}).singleton || "boolean" == typeof e.singleton || (e.singleton = (void 0 === r && (r = Boolean(window && document && document.all && !window.atob)), r));
                        var n = s(t = t || [], e);
                        return function (t) {
                            if (t = t || [], "[object Array]" === Object.prototype.toString.call(t)) {
                                for (var r = 0; r < n.length; r++) {
                                    var i = o(n[r]);
                                    a[i].references--
                                }
                                for (var c = s(t, e), u = 0; u < n.length; u++) {
                                    var l = o(n[u]);
                                    0 === a[l].references && (a[l].updater(), a.splice(l, 1))
                                }
                                n = c
                            }
                        }
                    }
                }
            },
            e = {};

        function n(r) {
            var i = e[r];
            if (void 0 !== i) return i.exports;
            var a = e[r] = {
                id: r,
                exports: {}
            };
            return t[r](a, a.exports, n), a.exports
        }
        return n.n = function (t) {
            var e = t && t.__esModule ? function () {
                return t.default
            } : function () {
                return t
            };
            return n.d(e, {
                a: e
            }), e
        }, n.d = function (t, e) {
            for (var r in e) n.o(e, r) && !n.o(t, r) && Object.defineProperty(t, r, {
                enumerable: !0,
                get: e[r]
            })
        }, n.o = function (t, e) {
            return Object.prototype.hasOwnProperty.call(t, e)
        }, n.r = function (t) {
            "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(t, Symbol.toStringTag, {
                value: "Module"
            }), Object.defineProperty(t, "__esModule", {
                value: !0
            })
        }, n(966)
    }()
}));