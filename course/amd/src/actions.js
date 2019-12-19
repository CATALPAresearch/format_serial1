define(["jquery", "core/ajax", "core/templates", "core/notification", "core/str", "core/url", "core/yui", "core/modal_factory", "core/modal_events", "core/key_codes"], function (a, b, c, d, e, f, g, h, i, j) {
    var k = {
        EDITINPROGRESS: "editinprogress",
        SECTIONDRAGGABLE: "sectiondraggable",
        EDITINGMOVE: "editing_move"
    },
        l = {
            ACTIVITYLI: "li.activity",
            ACTIONAREA: ".actions",
            ACTIVITYACTION: "a.cm-edit-action",
            MENU: ".moodle-actionmenu[data-enhance=moodle-core-actionmenu]",
            TOGGLE: ".toggle-display,.dropdown-toggle",
            SECTIONLI: "li.section",
            SECTIONACTIONMENU: ".section_action_menu",
            ADDSECTIONS: "#changenumsections [data-add-sections]"
        };
    g.use("moodle-course-coursebase", function () {
        var a = M.course.format.get_section_selector();
        a && (l.SECTIONLI = a)
    });
    var m = function (a) {
        var b;
        return g.use("moodle-course-util", function (c) {
            b = c.Moodle.core_course.util.cm.getId(c.Node(a.get(0)))
        }), b
    },
        n = function (a) {
            var b;
            return g.use("moodle-course-util", function (c) {
                b = c.Moodle.core_course.util.cm.getName(c.Node(a.get(0)))
            }), b
        },
        o = function (a) {
            a.addClass(k.EDITINPROGRESS);
            var b = a.find(l.ACTIONAREA).get(0);
            if (b) {
                var c = M.util.add_spinner(g, g.Node(b));
                return c.show(), c
            }
            return null
        },
        p = function (a) {
            a.addClass(k.EDITINPROGRESS);
            var b = a.find(l.SECTIONACTIONMENU).get(0);
            if (b) {
                var c = M.util.add_spinner(g, g.Node(b));
                return c.show(), c
            }
            return null
        },
        q = function (a) {
            var b = M.util.add_lightbox(g, g.Node(a.get(0)));
            return b.show(), b
        },
        r = function (a, b, c) {
            window.setTimeout(function () {
                a.removeClass(k.EDITINPROGRESS), b && b.hide()
            }, c)
        },
        s = function (a, b) {
            a && window.setTimeout(function () {
                a.hide()
            }, b)
        },
        t = function (a, b) {
            if (g.use("moodle-course-coursebase", function () {
                M.course.coursebase.invoke_function("setup_for_resource", "#" + a)
            }), M.core.actionmenu && M.core.actionmenu.newDOMNode && M.core.actionmenu.newDOMNode(g.one("#" + a)), b) {
                var c = g.one("#" + a + " " + l.MENU).one(l.TOGGLE);
                c && c.simulate && c.simulate("click")
            }
        },
        u = function (b, c) {
            var d = a("#" + b),
                e = "[data-action=" + c + "]";
            "groupsseparate" !== c && "groupsvisible" !== c && "groupsnone" !== c || (e = "[data-action=groupsseparate],[data-action=groupsvisible],[data-action=groupsnone]"), d.find(e).is(":visible") ? d.find(e).focus() : d.find(l.MENU).find(l.TOGGLE).focus()
        },
        v = function (b) {
            var c = a("a:visible"),
                d = !1,
                e = null;
            return c.each(function () {
                if (a.contains(b[0], this)) d = !0;
                else if (d) return e = this, !1
            }), e
        },
        w = function (c, e, f) {
            var g, h = f.attr("data-keepopen"),
                i = f.attr("data-action"),
                j = o(c),
                k = b.call([{
                    methodname: "core_course_edit_module",
                    args: {
                        id: e,
                        action: i,
                        sectionreturn: f.attr("data-sectionreturn") ? f.attr("data-sectionreturn") : 0
                    }
                }], !0);
            "duplicate" === i && (g = q(f.closest(l.SECTIONLI))), a.when.apply(a, k).done(function (b) {
                var d = v(c);
                c.replaceWith(b), a("<div>" + b + "</div>").find(l.ACTIVITYLI).each(function (b) {
                    t(a(this).attr("id"), h), 0 === b && (u(a(this).attr("id"), i), d = null)
                }), d && d.focus(), r(c, j, 400), s(g, 400), c.trigger(a.Event("coursemoduleedited", {
                    ajaxreturn: b,
                    action: i
                }))
            }).fail(function (b) {
                r(c, j), s(g);
                var e = a.Event("coursemoduleeditfailed", {
                    exception: b,
                    action: i
                });
                c.trigger(e), e.isDefaultPrevented() || d.exception(b)
            })
        },
        x = function (c, d, e) {
            var f = o(c),
                g = b.call([{
                    methodname: "core_course_get_module",
                    args: {
                        id: d,
                        sectionreturn: e
                    }
                }], !0);
            a.when.apply(a, g).done(function (a) {
                r(c, f, 400), C(a)
            }).fail(function () {
                r(c, f)
            })
        },
        y = function (a, b) {
            var c = a.attr("class").match(/modtype_([^\s]*)/)[1],
                f = n(a);
            e.get_string("pluginname", c).done(function (a) {
                var c = {
                    type: a,
                    name: f
                };
                e.get_strings([{
                    key: "confirm"
                }, {
                    key: null === f ? "deletechecktype" : "deletechecktypename",
                    param: c
                }, {
                    key: "yes"
                }, {
                    key: "no"
                }]).done(function (a) {
                    d.confirm(a[0], a[1], a[2], a[3], b)
                })
            })
        },
        z = function (a, b) {
            e.get_strings([{
                key: "confirm"
            }, {
                key: "yes"
            }, {
                key: "no"
            }]).done(function (c) {
                d.confirm(c[0], a, c[1], c[2], b)
            })
        },
        A = function (a, b, f, g, h, i, j) {
            var k = [{
                key: f,
                component: g
            }];
            return e.get_strings(k).then(function (d) {
                return a.find("span.menu-action-text").html(d[0]), c.renderPix(b, "core")
            }).then(function (b) {
                a.find(".icon").replaceWith(b), a.attr("data-action", j)
            })["catch"](d.exception)
        },
        B = function (b, c, d, e) {
            var f = c.attr("data-action");
            if ("hide" === f || "show" === f) {
                if ("hide" === f ? (b.addClass("hidden"), A(c, "i/show", "showfromothers", "format_" + e, null, null, "show")) : (b.removeClass("hidden"), A(c, "i/hide", "hidefromothers", "format_" + e, null, null, "hide")), void 0 !== d.modules)
                    for (var g in d.modules) C(d.modules[g]);
                void 0 !== d.section_availability && b.find(".section_availability").first().replaceWith(d.section_availability)
            } else if ("setmarker" === f) {
                var h = a(l.SECTIONLI + ".current"),
                    i = h.find(l.SECTIONACTIONMENU + " a[data-action=removemarker]");
                h.removeClass("current"), A(i, "i/marker", "highlight", "core", "markthistopic", "core", "setmarker"), b.addClass("current"), A(c, "i/marked", "highlightoff", "core", "markedthistopic", "core", "removemarker")
            } else "removemarker" === f && (b.removeClass("current"), A(c, "i/marker", "highlight", "core", "markthistopic", "core", "setmarker"))
        },
        C = function (b) {
            a("<div>" + b + "</div>").find(l.ACTIVITYLI).each(function () {
                var c = a(this).attr("id");
                a(l.ACTIVITYLI + "#" + c).replaceWith(b), t(c, !1)
            })
        },
        D = function (c, e, f, g) {
            var h = f.attr("data-action"),
                i = f.attr("data-sectionreturn") ? f.attr("data-sectionreturn") : 0,
                j = p(c),
                k = b.call([{
                    methodname: "core_course_edit_section",
                    args: {
                        id: e,
                        action: h,
                        sectionreturn: i
                    }
                }], !0),
                m = q(c);
            a.when.apply(a, k).done(function (b) {
                var d = a.parseJSON(b);
                r(c, j), s(m), c.find(l.SECTIONACTIONMENU).find(l.TOGGLE).focus();
                var e = a.Event("coursesectionedited", {
                    ajaxreturn: d,
                    action: h
                });
                c.trigger(e), e.isDefaultPrevented() || B(c, f, d, g)
            }).fail(function (b) {
                r(c, j), s(m);
                var e = a.Event("coursesectioneditfailed", {
                    exception: b,
                    action: h
                });
                c.trigger(e), e.isDefaultPrevented() || d.exception(b)
            })
        };
    return g.use("moodle-course-coursebase", function () {
        M.course.coursebase.register_module({
            set_visibility_resource_ui: function (b) {
                var c = a(b.element.getDOMNode()),
                    d = m(c);
                if (d) {
                    var e = c.find("." + k.EDITINGMOVE).attr("data-sectionreturn");
                    x(c, d, e)
                }
            }
        })
    }), {
            initCoursePage: function (b) {
                a("body").on("click keypress", l.ACTIVITYLI + " " + l.ACTIVITYACTION + "[data-action]", function (b) {
                    if ("keypress" !== b.type || 13 === b.keyCode) {
                        var c = a(this),
                            d = c.closest(l.ACTIVITYLI),
                            e = c.attr("data-action"),
                            f = m(d);
                        switch (e) {
                            case "moveleft":
                            case "moveright":
                            case "delete":
                            case "duplicate":
                            case "hide":
                            case "stealth":
                            case "show":
                            case "groupsseparate":
                            case "groupsvisible":
                            case "groupsnone":
                                break;
                            default:
                                return
                        }
                        f && (b.preventDefault(), "delete" === e ? y(d, function () {
                            w(d, f, c)
                        }) : w(d, f, c))
                    }
                }), a("body").on("click keypress", l.SECTIONLI + " " + l.SECTIONACTIONMENU + "[data-sectionid] a[data-action]", function (c) {
                    if ("keypress" !== c.type || 13 === c.keyCode) {
                        var d = a(this),
                            e = d.closest(l.SECTIONLI),
                            f = d.closest(l.SECTIONACTIONMENU).attr("data-sectionid");
                        c.preventDefault(), d.attr("data-confirm") ? z(d.attr("data-confirm"), function () {
                            D(e, f, d, b)
                        }) : D(e, f, d, b)
                    }
                }), e.get_string("numberweeks").done(function (b) {
                    var c = a(l.ADDSECTIONS),
                        d = c.attr("data-add-sections"),
                        e = c.attr("new-sections"),
                        f = a('<div><label for="add_section_numsections"></label> <input id="add_section_numsections" type="number" min="1" max="' + e + '" value="1"></div>');
                    f.find("label").html(b), h.create({
                        title: d,
                        type: h.types.SAVE_CANCEL,
                        body: f.html()
                    }, c).done(function (b) {
                        var e = a(b.getBody()).find("#add_section_numsections"),
                            f = function () {
                                "" + parseInt(e.val()) === e.val() && parseInt(e.val()) >= 1 && (document.location = c.attr("href") + "&numsections=" + parseInt(e.val()))
                            };
                        b.setSaveButtonText(d), b.getRoot().on(i.shown, function () {
                            e.focus().select().on("keydown", function (a) {
                                a.keyCode === j.enter && f()
                            })
                        }), b.getRoot().on(i.save, function (a) {
                            a.preventDefault(), f()
                        })
                    })
                })
            },
            replaceSectionActionItem: function (a, b, c, d, e, f, g, h) {
                var i = a.find(l.SECTIONACTIONMENU + " " + b);
                A(i, c, d, e, f, g, h)
            }
        }
});