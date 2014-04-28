var eventMethod = window.addEventListener ? "addEventListener" : "attachEvent";
var eventer = window[eventMethod];
var messageEvent = eventMethod == "attachEvent" ? "onmessage" : "message";
eventer(messageEvent, function (e) {
    if (e.origin.indexOf("widgets.ign.com") == -1) return;
    if (typeof e.data.method == "undefined") return;
    var methods = {
        pagetype: function () {
            if (typeof window.IGN == "undefined" || typeof window.IGN.pagetype == "undefined") return;
            var returnData = {
                method: "pagetype",
                data: {
                    pagetype: IGN.pagetype
                }
            };
            e.source.postMessage(returnData, e.origin)
        },
        "igndrones.async.push": function () {
            var data = e.data.data;
            igndrones = igndrones || {};
            igndrones.async = igndrones.async || [];
            igndrones.async.push(data)
        },
        "_gaq.push": function () {
            var data = e.data.data;
            _gaq = _gaq || [];
            _gaq.push(data)
        },
        methodExists: function () {
            var returnData = {
                method: "methodExists",
                data: {
                    method: e.data.data,
                    exists: false
                }
            };
            if (typeof methods[e.data.data] != "undefined") {
                returnData.data.exists = true
            }
            e.source.postMessage(returnData, e.origin)
        }
    };
    if (typeof methods[e.data.method] != "undefined") {
        methods[e.data.method]()
    }
}, false);
!
function (a) {
    function E(a, b, c, d) {
        var e = c.lang();
        return e[a].call ? e[a](c, d) : e[a][b]
    }
    function F(a, b) {
        return function (c) {
            return K(a.call(this, c), b)
        }
    }
    function G(a) {
        return function (b) {
            var c = a.call(this, b);
            return c + this.lang().ordinal(c)
        }
    }
    function H(a, b, c) {
        this._d = a, this._isUTC = !! b, this._a = a._a || null, this._lang = c || !1
    }
    function I(a) {
        var b = this._data = {},
            c = a.years || a.y || 0,
            d = a.months || a.M || 0,
            e = a.weeks || a.w || 0,
            f = a.days || a.d || 0,
            g = a.hours || a.h || 0,
            h = a.minutes || a.m || 0,
            i = a.seconds || a.s || 0,
            j = a.milliseconds || a.ms || 0;
        this._milliseconds = j + i * 1e3 + h * 6e4 + g * 36e5, this._days = f + e * 7, this._months = d + c * 12, b.milliseconds = j % 1e3, i += J(j / 1e3), b.seconds = i % 60, h += J(i / 60), b.minutes = h % 60, g += J(h / 60), b.hours = g % 24, f += J(g / 24), f += e * 7, b.days = f % 30, d += J(f / 30), b.months = d % 12, c += J(d / 12), b.years = c, this._lang = !1
    }
    function J(a) {
        return a < 0 ? Math.ceil(a) : Math.floor(a)
    }
    function K(a, b) {
        var c = a + "";
        while (c.length < b) c = "0" + c;
        return c
    }
    function L(a, b, c) {
        var d = b._milliseconds,
            e = b._days,
            f = b._months,
            g;
        d && a._d.setTime(+a + d * c), e && a.date(a.date() + e * c), f && (g = a.date(), a.date(1).month(a.month() + f * c).date(Math.min(g, a.daysInMonth())))
    }
    function M(a) {
        return Object.prototype.toString.call(a) === "[object Array]"
    }
    function N(a, b) {
        var c = Math.min(a.length, b.length),
            d = Math.abs(a.length - b.length),
            e = 0,
            f;
        for (f = 0; f < c; f++)~~a[f] !== ~~b[f] && e++;
        return e + d
    }
    function O(a, b, c, d) {
        var e, f, g = [];
        for (e = 0; e < 7; e++) g[e] = a[e] = a[e] == null ? e === 2 ? 1 : 0 : a[e];
        return a[7] = g[7] = b, a[8] != null && (g[8] = a[8]), a[3] += c || 0, a[4] += d || 0, f = new Date(0), b ? (f.setUTCFullYear(a[0], a[1], a[2]), f.setUTCHours(a[3], a[4], a[5], a[6])) : (f.setFullYear(a[0], a[1], a[2]), f.setHours(a[3], a[4], a[5], a[6])), f._a = g, f
    }
    function P(a, c) {
        var d, e, g = [];
        !c && h && (c = require("./lang/" + a));
        for (d = 0; d < i.length; d++) c[i[d]] = c[i[d]] || f.en[i[d]];
        for (d = 0; d < 12; d++) e = b([2e3, d]), g[d] = new RegExp("^" + (c.months[d] || c.months(e, "")) + "|^" + (c.monthsShort[d] || c.monthsShort(e, "")).replace(".", ""), "i");
        return c.monthsParse = c.monthsParse || g, f[a] = c, c
    }
    function Q(a) {
        var c = typeof a == "string" && a || a && a._lang || null;
        return c ? f[c] || P(c) : b
    }
    function R(a) {
        return a.match(/\[.*\]/) ? a.replace(/^\[|\]$/g, "") : a.replace(/\\/g, "")
    }
    function S(a) {
        var b = a.match(k),
            c, d;
        for (c = 0, d = b.length; c < d; c++) D[b[c]] ? b[c] = D[b[c]] : b[c] = R(b[c]);
        return function (e) {
            var f = "";
            for (c = 0; c < d; c++) f += typeof b[c].call == "function" ? b[c].call(e, a) : b[c];
            return f
        }
    }
    function T(a, b) {
        function d(b) {
            return a.lang().longDateFormat[b] || b
        }
        var c = 5;
        while (c-- && l.test(b)) b = b.replace(l, d);
        return A[b] || (A[b] = S(b)), A[b](a)
    }
    function U(a) {
        switch (a) {
        case "DDDD":
            return p;
        case "YYYY":
            return q;
        case "S":
        case "SS":
        case "SSS":
        case "DDD":
            return o;
        case "MMM":
        case "MMMM":
        case "dd":
        case "ddd":
        case "dddd":
        case "a":
        case "A":
            return r;
        case "Z":
        case "ZZ":
            return s;
        case "T":
            return t;
        case "MM":
        case "DD":
        case "YY":
        case "HH":
        case "hh":
        case "mm":
        case "ss":
        case "M":
        case "D":
        case "d":
        case "H":
        case "h":
        case "m":
        case "s":
            return n;
        default:
            return new RegExp(a.replace("\\", ""))
        }
    }
    function V(a, b, c, d) {
        var e, f;
        switch (a) {
        case "M":
        case "MM":
            c[1] = b == null ? 0 : ~~b - 1;
            break;
        case "MMM":
        case "MMMM":
            for (e = 0; e < 12; e++) if (Q().monthsParse[e].test(b)) {
                c[1] = e, f = !0;
                break
            }
            f || (c[8] = !1);
            break;
        case "D":
        case "DD":
        case "DDD":
        case "DDDD":
            b != null && (c[2] = ~~b);
            break;
        case "YY":
            c[0] = ~~b + (~~b > 70 ? 1900 : 2e3);
            break;
        case "YYYY":
            c[0] = ~~Math.abs(b);
            break;
        case "a":
        case "A":
            d.isPm = (b + "").toLowerCase() === "pm";
            break;
        case "H":
        case "HH":
        case "h":
        case "hh":
            c[3] = ~~b;
            break;
        case "m":
        case "mm":
            c[4] = ~~b;
            break;
        case "s":
        case "ss":
            c[5] = ~~b;
            break;
        case "S":
        case "SS":
        case "SSS":
            c[6] = ~~ (("0." + b) * 1e3);
            break;
        case "Z":
        case "ZZ":
            d.isUTC = !0, e = (b + "").match(x), e && e[1] && (d.tzh = ~~e[1]), e && e[2] && (d.tzm = ~~e[2]), e && e[0] === "+" && (d.tzh = -d.tzh, d.tzm = -d.tzm)
        }
        b == null && (c[8] = !1)
    }
    function W(a, b) {
        var c = [0, 0, 1, 0, 0, 0, 0],
            d = {
                tzh: 0,
                tzm: 0
            },
            e = b.match(k),
            f, g;
        for (f = 0; f < e.length; f++) g = (U(e[f]).exec(a) || [])[0], g && (a = a.slice(a.indexOf(g) + g.length)), D[e[f]] && V(e[f], g, c, d);
        return d.isPm && c[3] < 12 && (c[3] += 12), d.isPm === !1 && c[3] === 12 && (c[3] = 0), O(c, d.isUTC, d.tzh, d.tzm)
    }
    function X(a, b) {
        var c, d = a.match(m) || [],
            e, f = 99,
            g, h, i;
        for (g = 0; g < b.length; g++) h = W(a, b[g]), e = T(new H(h), b[g]).match(m) || [], i = N(d, e), i < f && (f = i, c = h);
        return c
    }
    function Y(a) {
        var b = "YYYY-MM-DDT",
            c;
        if (u.exec(a)) {
            for (c = 0; c < 4; c++) if (w[c][1].exec(a)) {
                b += w[c][0];
                break
            }
            return s.exec(a) ? W(a, b + " Z") : W(a, b)
        }
        return new Date(a)
    }
    function Z(a, b, c, d, e) {
        var f = e.relativeTime[a];
        return typeof f == "function" ? f(b || 1, !! c, a, d) : f.replace(/%d/i, b || 1)
    }
    function $(a, b, c) {
        var e = d(Math.abs(a) / 1e3),
            f = d(e / 60),
            g = d(f / 60),
            h = d(g / 24),
            i = d(h / 365),
            j = e < 45 && ["s", e] || f === 1 && ["m"] || f < 45 && ["mm", f] || g === 1 && ["h"] || g < 22 && ["hh", g] || h === 1 && ["d"] || h <= 25 && ["dd", h] || h <= 45 && ["M"] || h < 345 && ["MM", d(h / 30)] || i === 1 && ["y"] || ["yy", i];
        return j[2] = b, j[3] = a > 0, j[4] = c, Z.apply({}, j)
    }
    function _(a, c) {
        b.fn[a] = function (a) {
            var b = this._isUTC ? "UTC" : "";
            return a != null ? (this._d["set" + b + c](a), this) : this._d["get" + b + c]()
        }
    }
    function ab(a) {
        b.duration.fn[a] = function () {
            return this._data[a]
        }
    }
    function bb(a, c) {
        b.duration.fn["as" + a] = function () {
            return +this / c
        }
    }
    var b, c = "1.7.2",
        d = Math.round,
        e, f = {},
        g = "en",
        h = typeof module != "undefined" && module.exports,
        i = "months|monthsShort|weekdays|weekdaysShort|weekdaysMin|longDateFormat|calendar|relativeTime|ordinal|meridiem".split("|"),
        j = /^\/?Date\((\-?\d+)/i,
        k = /(\[[^\[]*\])|(\\)?(Mo|MM?M?M?|Do|DDDo|DD?D?D?|ddd?d?|do?|w[o|w]?|YYYY|YY|a|A|hh?|HH?|mm?|ss?|SS?S?|zz?|ZZ?|.)/g,
        l = /(\[[^\[]*\])|(\\)?(LT|LL?L?L?)/g,
        m = /([0-9a-zA-Z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)/gi,
        n = /\d\d?/,
        o = /\d{1,3}/,
        p = /\d{3}/,
        q = /\d{1,4}/,
        r = /[0-9a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+/i,
        s = /Z|[\+\-]\d\d:?\d\d/i,
        t = /T/i,
        u = /^\s*\d{4}-\d\d-\d\d(T(\d\d(:\d\d(:\d\d(\.\d\d?\d?)?)?)?)?([\+\-]\d\d:?\d\d)?)?/,
        v = "YYYY-MM-DDTHH:mm:ssZ",
        w = [
            ["HH:mm:ss.S", /T\d\d:\d\d:\d\d\.\d{1,3}/],
            ["HH:mm:ss", /T\d\d:\d\d:\d\d/],
            ["HH:mm", /T\d\d:\d\d/],
            ["HH", /T\d\d/]
        ],
        x = /([\+\-]|\d\d)/gi,
        y = "Month|Date|Hours|Minutes|Seconds|Milliseconds".split("|"),
        z = {
            Milliseconds: 1,
            Seconds: 1e3,
            Minutes: 6e4,
            Hours: 36e5,
            Days: 864e5,
            Months: 2592e6,
            Years: 31536e6
        },
        A = {},
        B = "DDD w M D d".split(" "),
        C = "M D H h m s w".split(" "),
        D = {
            M: function () {
                return this.month() + 1
            },
            MMM: function (a) {
                return E("monthsShort", this.month(), this, a)
            },
            MMMM: function (a) {
                return E("months", this.month(), this, a)
            },
            D: function () {
                return this.date()
            },
            DDD: function () {
                var a = new Date(this.year(), this.month(), this.date()),
                    b = new Date(this.year(), 0, 1);
                return ~~ ((a - b) / 864e5 + 1.5)
            },
            d: function () {
                return this.day()
            },
            dd: function (a) {
                return E("weekdaysMin", this.day(), this, a)
            },
            ddd: function (a) {
                return E("weekdaysShort", this.day(), this, a)
            },
            dddd: function (a) {
                return E("weekdays", this.day(), this, a)
            },
            w: function () {
                var a = new Date(this.year(), this.month(), this.date() - this.day() + 5),
                    b = new Date(a.getFullYear(), 0, 4);
                return ~~ ((a - b) / 864e5 / 7 + 1.5)
            },
            YY: function () {
                return K(this.year() % 100, 2)
            },
            YYYY: function () {
                return K(this.year(), 4)
            },
            a: function () {
                return this.lang().meridiem(this.hours(), this.minutes(), !0)
            },
            A: function () {
                return this.lang().meridiem(this.hours(), this.minutes(), !1)
            },
            H: function () {
                return this.hours()
            },
            h: function () {
                return this.hours() % 12 || 12
            },
            m: function () {
                return this.minutes()
            },
            s: function () {
                return this.seconds()
            },
            S: function () {
                return ~~ (this.milliseconds() / 100)
            },
            SS: function () {
                return K(~~ (this.milliseconds() / 10), 2)
            },
            SSS: function () {
                return K(this.milliseconds(), 3)
            },
            Z: function () {
                var a = -this.zone(),
                    b = "+";
                return a < 0 && (a = -a, b = "-"), b + K(~~ (a / 60), 2) + ":" + K(~~a % 60, 2)
            },
            ZZ: function () {
                var a = -this.zone(),
                    b = "+";
                return a < 0 && (a = -a, b = "-"), b + K(~~ (10 * a / 6), 4)
            }
        };
    while (B.length) e = B.pop(), D[e + "o"] = G(D[e]);
    while (C.length) e = C.pop(), D[e + e] = F(D[e], 2);
    D.DDDD = F(D.DDD, 3), b = function (c, d) {
        if (c === null || c === "") return null;
        var e, f;
        return b.isMoment(c) ? new H(new Date(+c._d), c._isUTC, c._lang) : (d ? M(d) ? e = X(c, d) : e = W(c, d) : (f = j.exec(c), e = c === a ? new Date : f ? new Date(+f[1]) : c instanceof Date ? c : M(c) ? O(c) : typeof c == "string" ? Y(c) : new Date(c)), new H(e))
    }, b.utc = function (a, c) {
        return M(a) ? new H(O(a, !0), !0) : (typeof a == "string" && !s.exec(a) && (a += " +0000", c && (c += " Z")), b(a, c).utc())
    }, b.unix = function (a) {
        return b(a * 1e3)
    }, b.duration = function (a, c) {
        var d = b.isDuration(a),
            e = typeof a == "number",
            f = d ? a._data : e ? {} : a,
            g;
        return e && (c ? f[c] = a : f.milliseconds = a), g = new I(f), d && (g._lang = a._lang), g
    }, b.humanizeDuration = function (a, c, d) {
        return b.duration(a, c === !0 ? null : c).humanize(c === !0 ? !0 : d)
    }, b.version = c, b.defaultFormat = v, b.lang = function (a, c) {
        var d;
        if (!a) return g;
        (c || !f[a]) && P(a, c);
        if (f[a]) {
            for (d = 0; d < i.length; d++) b[i[d]] = f[a][i[d]];
            b.monthsParse = f[a].monthsParse, g = a
        }
    }, b.langData = Q, b.isMoment = function (a) {
        return a instanceof H
    }, b.isDuration = function (a) {
        return a instanceof I
    }, b.lang("en", {
        months: "January_February_March_April_May_June_July_August_September_October_November_December".split("_"),
        monthsShort: "Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec".split("_"),
        weekdays: "Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),
        weekdaysShort: "Sun_Mon_Tue_Wed_Thu_Fri_Sat".split("_"),
        weekdaysMin: "Su_Mo_Tu_We_Th_Fr_Sa".split("_"),
        longDateFormat: {
            LT: "h:mm A",
            L: "MM/DD/YYYY",
            LL: "MMMM D YYYY",
            LLL: "MMMM D YYYY LT",
            LLLL: "dddd, MMMM D YYYY LT"
        },
        meridiem: function (a, b, c) {
            return a > 11 ? c ? "pm" : "PM" : c ? "am" : "AM"
        },
        calendar: {
            sameDay: "[Today at] LT",
            nextDay: "[Tomorrow at] LT",
            nextWeek: "dddd [at] LT",
            lastDay: "[Yesterday at] LT",
            lastWeek: "[last] dddd [at] LT",
            sameElse: "L"
        },
        relativeTime: {
            future: "in %s",
            past: "%s ago",
            s: "a few seconds",
            m: "a minute",
            mm: "%d minutes",
            h: "an hour",
            hh: "%d hours",
            d: "a day",
            dd: "%d days",
            M: "a month",
            MM: "%d months",
            y: "a year",
            yy: "%d years"
        },
        ordinal: function (a) {
            var b = a % 10;
            return ~~ (a % 100 / 10) === 1 ? "th" : b === 1 ? "st" : b === 2 ? "nd" : b === 3 ? "rd" : "th"
        }
    }), b.fn = H.prototype = {
        clone: function () {
            return b(this)
        },
        valueOf: function () {
            return +this._d
        },
        unix: function () {
            return Math.floor(+this._d / 1e3)
        },
        toString: function () {
            return this._d.toString()
        },
        toDate: function () {
            return this._d
        },
        toArray: function () {
            var a = this;
            return [a.year(), a.month(), a.date(), a.hours(), a.minutes(), a.seconds(), a.milliseconds(), !! this._isUTC]
        },
        isValid: function () {
            return this._a ? this._a[8] != null ? !! this._a[8] : !N(this._a, (this._a[7] ? b.utc(this._a) : b(this._a)).toArray()) : !isNaN(this._d.getTime())
        },
        utc: function () {
            return this._isUTC = !0, this
        },
        local: function () {
            return this._isUTC = !1, this
        },
        format: function (a) {
            return T(this, a ? a : b.defaultFormat)
        },
        add: function (a, c) {
            var d = c ? b.duration(+c, a) : b.duration(a);
            return L(this, d, 1), this
        },
        subtract: function (a, c) {
            var d = c ? b.duration(+c, a) : b.duration(a);
            return L(this, d, -1), this
        },
        diff: function (a, c, e) {
            var f = this._isUTC ? b(a).utc() : b(a).local(),
                g = (this.zone() - f.zone()) * 6e4,
                h = this._d - f._d - g,
                i = this.year() - f.year(),
                j = this.month() - f.month(),
                k = this.date() - f.date(),
                l;
            return c === "months" ? l = i * 12 + j + k / 30 : c === "years" ? l = i + (j + k / 30) / 12 : l = c === "seconds" ? h / 1e3 : c === "minutes" ? h / 6e4 : c === "hours" ? h / 36e5 : c === "days" ? h / 864e5 : c === "weeks" ? h / 6048e5 : h, e ? l : d(l)
        },
        from: function (a, c) {
            return b.duration(this.diff(a)).lang(this._lang).humanize(!c)
        },
        fromNow: function (a) {
            return this.from(b(), a)
        },
        calendar: function () {
            var a = this.diff(b().sod(), "days", !0),
                c = this.lang().calendar,
                d = c.sameElse,
                e = a < -6 ? d : a < -1 ? c.lastWeek : a < 0 ? c.lastDay : a < 1 ? c.sameDay : a < 2 ? c.nextDay : a < 7 ? c.nextWeek : d;
            return this.format(typeof e == "function" ? e.apply(this) : e)
        },
        isLeapYear: function () {
            var a = this.year();
            return a % 4 === 0 && a % 100 !== 0 || a % 400 === 0
        },
        isDST: function () {
            return this.zone() < b([this.year()]).zone() || this.zone() < b([this.year(), 5]).zone()
        },
        day: function (a) {
            var b = this._isUTC ? this._d.getUTCDay() : this._d.getDay();
            return a == null ? b : this.add({
                d: a - b
            })
        },
        startOf: function (a) {
            switch (a.replace(/s$/, "")) {
            case "year":
                this.month(0);
            case "month":
                this.date(1);
            case "day":
                this.hours(0);
            case "hour":
                this.minutes(0);
            case "minute":
                this.seconds(0);
            case "second":
                this.milliseconds(0)
            }
            return this
        },
        endOf: function (a) {
            return this.startOf(a).add(a.replace(/s?$/, "s"), 1).subtract("ms", 1)
        },
        sod: function () {
            return this.clone().startOf("day")
        },
        eod: function () {
            return this.clone().endOf("day")
        },
        zone: function () {
            return this._isUTC ? 0 : this._d.getTimezoneOffset()
        },
        daysInMonth: function () {
            return b.utc([this.year(), this.month() + 1, 0]).date()
        },
        lang: function (b) {
            return b === a ? Q(this) : (this._lang = b, this)
        }
    };
    for (e = 0; e < y.length; e++) _(y[e].toLowerCase(), y[e]);
    _("year", "FullYear"), b.duration.fn = I.prototype = {
        weeks: function () {
            return J(this.days() / 7)
        },
        valueOf: function () {
            return this._milliseconds + this._days * 864e5 + this._months * 2592e6
        },
        humanize: function (a) {
            var b = +this,
                c = this.lang().relativeTime,
                d = $(b, !a, this.lang()),
                e = b <= 0 ? c.past : c.future;
            return a && (typeof e == "function" ? d = e(d) : d = e.replace(/%s/i, d)), d
        },
        lang: b.fn.lang
    };
    for (e in z) z.hasOwnProperty(e) && (bb(e, z[e]), ab(e.toLowerCase()));
    bb("Weeks", 6048e5), h && (module.exports = b), typeof ender == "undefined" && (this.moment = b), typeof define == "function" && define.amd && define("moment", [], function () {
        return b
    })
}.call(this);
!
function () {
    var e = this,
        t = e._,
        n = {},
        r = Array.prototype,
        i = Object.prototype,
        s = Function.prototype,
        o = r.push,
        u = r.slice,
        a = r.concat,
        f = r.unshift,
        l = i.toString,
        c = i.hasOwnProperty,
        h = r.forEach,
        p = r.map,
        d = r.reduce,
        v = r.reduceRight,
        m = r.filter,
        g = r.every,
        y = r.some,
        b = r.indexOf,
        w = r.lastIndexOf,
        E = Array.isArray,
        S = Object.keys,
        x = s.bind,
        T = function (e) {
            if (e instanceof T) return e;
            if (!(this instanceof T)) return new T(e);
            this._wrapped = e
        };
    typeof exports != "undefined" ? (typeof module != "undefined" && module.exports && (exports = module.exports = T), exports._ = T) : e._ = T, T.VERSION = "1.4.0";
    var N = T.each = T.forEach = function (e, t, r) {
            if (h && e.forEach === h) e.forEach(t, r);
            else if (e.length === +e.length) {
                for (var i = 0, s = e.length; i < s; i++) if (t.call(r, e[i], i, e) === n) return
            } else for (var o in e) if (T.has(e, o) && t.call(r, e[o], o, e) === n) return
        };
    T.map = T.collect = function (e, t, n) {
        var r = [];
        return p && e.map === p ? e.map(t, n) : (N(e, function (e, i, s) {
            r[r.length] = t.call(n, e, i, s)
        }), r)
    }, T.reduce = T.foldl = T.inject = function (e, t, n, r) {
        var i = arguments.length > 2;
        if (d && e.reduce === d) return r && (t = T.bind(t, r)), i ? e.reduce(t, n) : e.reduce(t);
        N(e, function (e, s, o) {
            i ? n = t.call(r, n, e, s, o) : (n = e, i = !0)
        });
        if (!i) throw new TypeError("Reduce of empty array with no initial value");
        return n
    }, T.reduceRight = T.foldr = function (e, t, n, r) {
        var i = arguments.length > 2;
        if (v && e.reduceRight === v) return r && (t = T.bind(t, r)), arguments.length > 2 ? e.reduceRight(t, n) : e.reduceRight(t);
        var s = e.length;
        if (s !== +s) {
            var o = T.keys(e);
            s = o.length
        }
        N(e, function (u, a, f) {
            a = o ? o[--s] : --s, i ? n = t.call(r, n, e[a], a, f) : (n = e[a], i = !0)
        });
        if (!i) throw new TypeError("Reduce of empty array with no initial value");
        return n
    }, T.find = T.detect = function (e, t, n) {
        var r;
        return C(e, function (e, i, s) {
            if (t.call(n, e, i, s)) return r = e, !0
        }), r
    }, T.filter = T.select = function (e, t, n) {
        var r = [];
        return m && e.filter === m ? e.filter(t, n) : (N(e, function (e, i, s) {
            t.call(n, e, i, s) && (r[r.length] = e)
        }), r)
    }, T.reject = function (e, t, n) {
        var r = [];
        return N(e, function (e, i, s) {
            t.call(n, e, i, s) || (r[r.length] = e)
        }), r
    }, T.every = T.all = function (e, t, r) {
        t || (t = T.identity);
        var i = !0;
        return g && e.every === g ? e.every(t, r) : (N(e, function (e, s, o) {
            if (!(i = i && t.call(r, e, s, o))) return n
        }), !! i)
    };
    var C = T.some = T.any = function (e, t, r) {
            t || (t = T.identity);
            var i = !1;
            return y && e.some === y ? e.some(t, r) : (N(e, function (e, s, o) {
                if (i || (i = t.call(r, e, s, o))) return n
            }), !! i)
        };
    T.contains = T.include = function (e, t) {
        var n = !1;
        return b && e.indexOf === b ? e.indexOf(t) != -1 : (n = C(e, function (e) {
            return e === t
        }), n)
    }, T.invoke = function (e, t) {
        var n = u.call(arguments, 2);
        return T.map(e, function (e) {
            return (T.isFunction(t) ? t : e[t]).apply(e, n)
        })
    }, T.pluck = function (e, t) {
        return T.map(e, function (e) {
            return e[t]
        })
    }, T.where = function (e, t) {
        return T.isEmpty(t) ? [] : T.filter(e, function (e) {
            for (var n in t) if (t[n] !== e[n]) return !1;
            return !0
        })
    }, T.max = function (e, t, n) {
        if (!t && T.isArray(e) && e[0] === +e[0] && e.length < 65535) return Math.max.apply(Math, e);
        if (!t && T.isEmpty(e)) return -Infinity;
        var r = {
            computed: -Infinity
        };
        return N(e, function (e, i, s) {
            var o = t ? t.call(n, e, i, s) : e;
            o >= r.computed && (r = {
                value: e,
                computed: o
            })
        }), r.value
    }, T.min = function (e, t, n) {
        if (!t && T.isArray(e) && e[0] === +e[0] && e.length < 65535) return Math.min.apply(Math, e);
        if (!t && T.isEmpty(e)) return Infinity;
        var r = {
            computed: Infinity
        };
        return N(e, function (e, i, s) {
            var o = t ? t.call(n, e, i, s) : e;
            o < r.computed && (r = {
                value: e,
                computed: o
            })
        }), r.value
    }, T.shuffle = function (e) {
        var t, n = 0,
            r = [];
        return N(e, function (e) {
            t = T.random(n++), r[n - 1] = r[t], r[t] = e
        }), r
    };
    var k = function (e) {
            return T.isFunction(e) ? e : function (t) {
                return t[e]
            }
        };
    T.sortBy = function (e, t, n) {
        var r = k(t);
        return T.pluck(T.map(e, function (e, t, i) {
            return {
                value: e,
                index: t,
                criteria: r.call(n, e, t, i)
            }
        }).sort(function (e, t) {
            var n = e.criteria,
                r = t.criteria;
            if (n !== r) {
                if (n > r || n === void 0) return 1;
                if (n < r || r === void 0) return -1
            }
            return e.index < t.index ? -1 : 1
        }), "value")
    };
    var L = function (e, t, n, r) {
            var i = {},
                s = k(t);
            return N(e, function (t, o) {
                var u = s.call(n, t, o, e);
                r(i, u, t)
            }), i
        };
    T.groupBy = function (e, t, n) {
        return L(e, t, n, function (e, t, n) {
            (T.has(e, t) ? e[t] : e[t] = []).push(n)
        })
    }, T.countBy = function (e, t, n) {
        return L(e, t, n, function (e, t, n) {
            T.has(e, t) || (e[t] = 0), e[t]++
        })
    }, T.sortedIndex = function (e, t, n, r) {
        n = n == null ? T.identity : k(n);
        var i = n.call(r, t),
            s = 0,
            o = e.length;
        while (s < o) {
            var u = s + o >>> 1;
            n.call(r, e[u]) < i ? s = u + 1 : o = u
        }
        return s
    }, T.toArray = function (e) {
        return e ? e.length === +e.length ? u.call(e) : T.values(e) : []
    }, T.size = function (e) {
        return e.length === +e.length ? e.length : T.keys(e).length
    }, T.first = T.head = T.take = function (e, t, n) {
        return t != null && !n ? u.call(e, 0, t) : e[0]
    }, T.initial = function (e, t, n) {
        return u.call(e, 0, e.length - (t == null || n ? 1 : t))
    }, T.last = function (e, t, n) {
        return t != null && !n ? u.call(e, Math.max(e.length - t, 0)) : e[e.length - 1]
    }, T.rest = T.tail = T.drop = function (e, t, n) {
        return u.call(e, t == null || n ? 1 : t)
    }, T.compact = function (e) {
        return T.filter(e, function (e) {
            return !!e
        })
    };
    var A = function (e, t, n) {
            return N(e, function (e) {
                T.isArray(e) ? t ? o.apply(n, e) : A(e, t, n) : n.push(e)
            }), n
        };
    T.flatten = function (e, t) {
        return A(e, t, [])
    }, T.without = function (e) {
        return T.difference(e, u.call(arguments, 1))
    }, T.uniq = T.unique = function (e, t, n, r) {
        var i = n ? T.map(e, n, r) : e,
            s = [],
            o = [];
        return N(i, function (n, r) {
            if (t ? !r || o[o.length - 1] !== n : !T.contains(o, n)) o.push(n), s.push(e[r])
        }), s
    }, T.union = function () {
        return T.uniq(a.apply(r, arguments))
    }, T.intersection = function (e) {
        var t = u.call(arguments, 1);
        return T.filter(T.uniq(e), function (e) {
            return T.every(t, function (t) {
                return T.indexOf(t, e) >= 0
            })
        })
    }, T.difference = function (e) {
        var t = a.apply(r, u.call(arguments, 1));
        return T.filter(e, function (e) {
            return !T.contains(t, e)
        })
    }, T.zip = function () {
        var e = u.call(arguments),
            t = T.max(T.pluck(e, "length")),
            n = new Array(t);
        for (var r = 0; r < t; r++) n[r] = T.pluck(e, "" + r);
        return n
    }, T.object = function (e, t) {
        var n = {};
        for (var r = 0, i = e.length; r < i; r++) t ? n[e[r]] = t[r] : n[e[r][0]] = e[r][1];
        return n
    }, T.indexOf = function (e, t, n) {
        var r = 0,
            i = e.length;
        if (n) {
            if (typeof n != "number") return r = T.sortedIndex(e, t), e[r] === t ? r : -1;
            r = n < 0 ? Math.max(0, i + n) : n
        }
        if (b && e.indexOf === b) return e.indexOf(t, n);
        for (; r < i; r++) if (e[r] === t) return r;
        return -1
    }, T.lastIndexOf = function (e, t, n) {
        if (w && e.lastIndexOf === w) return e.lastIndexOf(t, n);
        var r = n != null ? n : e.length;
        while (r--) if (e[r] === t) return r;
        return -1
    }, T.range = function (e, t, n) {
        arguments.length <= 1 && (t = e || 0, e = 0), n = arguments[2] || 1;
        var r = Math.max(Math.ceil((t - e) / n), 0),
            i = 0,
            s = new Array(r);
        while (i < r) s[i++] = e, e += n;
        return s
    };
    var O = function () {};
    T.bind = function (t, n) {
        var r, i;
        if (t.bind === x && x) return x.apply(t, u.call(arguments, 1));
        if (!T.isFunction(t)) throw new TypeError;
        return i = u.call(arguments, 2), r = function () {
            if (this instanceof r) {
                O.prototype = t.prototype;
                var e = new O,
                    s = t.apply(e, i.concat(u.call(arguments)));
                return Object(s) === s ? s : e
            }
            return t.apply(n, i.concat(u.call(arguments)))
        }
    }, T.bindAll = function (e) {
        var t = u.call(arguments, 1);
        return t.length == 0 && (t = T.functions(e)), N(t, function (t) {
            e[t] = T.bind(e[t], e)
        }), e
    }, T.memoize = function (e, t) {
        var n = {};
        return t || (t = T.identity), function () {
            var r = t.apply(this, arguments);
            return T.has(n, r) ? n[r] : n[r] = e.apply(this, arguments)
        }
    }, T.delay = function (e, t) {
        var n = u.call(arguments, 2);
        return setTimeout(function () {
            return e.apply(null, n)
        }, t)
    }, T.defer = function (e) {
        return T.delay.apply(T, [e, 1].concat(u.call(arguments, 1)))
    }, T.throttle = function (e, t) {
        var n, r, i, s, o, u, a = T.debounce(function () {
            o = s = !1
        }, t);
        return function () {
            n = this, r = arguments;
            var f = function () {
                    i = null, o && (u = e.apply(n, r)), a()
                };
            return i || (i = setTimeout(f, t)), s ? o = !0 : (s = !0, u = e.apply(n, r)), a(), u
        }
    }, T.debounce = function (e, t, n) {
        var r, i;
        return function () {
            var s = this,
                o = arguments,
                u = function () {
                    r = null, n || (i = e.apply(s, o))
                },
                a = n && !r;
            return clearTimeout(r), r = setTimeout(u, t), a && (i = e.apply(s, o)), i
        }
    }, T.once = function (e) {
        var t = !1,
            n;
        return function () {
            return t ? n : (t = !0, n = e.apply(this, arguments), e = null, n)
        }
    }, T.wrap = function (e, t) {
        return function () {
            var n = [e];
            return o.apply(n, arguments), t.apply(this, n)
        }
    }, T.compose = function () {
        var e = arguments;
        return function () {
            var t = arguments;
            for (var n = e.length - 1; n >= 0; n--) t = [e[n].apply(this, t)];
            return t[0]
        }
    }, T.after = function (e, t) {
        return e <= 0 ? t() : function () {
            if (--e < 1) return t.apply(this, arguments)
        }
    }, T.keys = S ||
    function (e) {
        if (e !== Object(e)) throw new TypeError("Invalid object");
        var t = [];
        for (var n in e) T.has(e, n) && (t[t.length] = n);
        return t
    }, T.values = function (e) {
        var t = [];
        for (var n in e) T.has(e, n) && t.push(e[n]);
        return t
    }, T.pairs = function (e) {
        var t = [];
        for (var n in e) T.has(e, n) && t.push([n, e[n]]);
        return t
    }, T.invert = function (e) {
        var t = {};
        for (var n in e) T.has(e, n) && (t[e[n]] = n);
        return t
    }, T.functions = T.methods = function (e) {
        var t = [];
        for (var n in e) T.isFunction(e[n]) && t.push(n);
        return t.sort()
    }, T.extend = function (e) {
        return N(u.call(arguments, 1), function (t) {
            for (var n in t) e[n] = t[n]
        }), e
    }, T.pick = function (e) {
        var t = {},
            n = a.apply(r, u.call(arguments, 1));
        return N(n, function (n) {
            n in e && (t[n] = e[n])
        }), t
    }, T.omit = function (e) {
        var t = {},
            n = a.apply(r, u.call(arguments, 1));
        for (var i in e) T.contains(n, i) || (t[i] = e[i]);
        return t
    }, T.defaults = function (e) {
        return N(u.call(arguments, 1), function (t) {
            for (var n in t) e[n] == null && (e[n] = t[n])
        }), e
    }, T.clone = function (e) {
        return T.isObject(e) ? T.isArray(e) ? e.slice() : T.extend({}, e) : e
    }, T.tap = function (e, t) {
        return t(e), e
    };
    var M = function (e, t, n, r) {
            if (e === t) return e !== 0 || 1 / e == 1 / t;
            if (e == null || t == null) return e === t;
            e instanceof T && (e = e._wrapped), t instanceof T && (t = t._wrapped);
            var i = l.call(e);
            if (i != l.call(t)) return !1;
            switch (i) {
            case "[object String]":
                return e == String(t);
            case "[object Number]":
                return e != +e ? t != +t : e == 0 ? 1 / e == 1 / t : e == +t;
            case "[object Date]":
            case "[object Boolean]":
                return +e == +t;
            case "[object RegExp]":
                return e.source == t.source && e.global == t.global && e.multiline == t.multiline && e.ignoreCase == t.ignoreCase
            }
            if (typeof e != "object" || typeof t != "object") return !1;
            var s = n.length;
            while (s--) if (n[s] == e) return r[s] == t;
            n.push(e), r.push(t);
            var o = 0,
                u = !0;
            if (i == "[object Array]") {
                o = e.length, u = o == t.length;
                if (u) while (o--) if (!(u = M(e[o], t[o], n, r))) break
            } else {
                var a = e.constructor,
                    f = t.constructor;
                if (a !== f && !(T.isFunction(a) && a instanceof a && T.isFunction(f) && f instanceof f)) return !1;
                for (var c in e) if (T.has(e, c)) {
                    o++;
                    if (!(u = T.has(t, c) && M(e[c], t[c], n, r))) break
                }
                if (u) {
                    for (c in t) if (T.has(t, c) && !o--) break;
                    u = !o
                }
            }
            return n.pop(), r.pop(), u
        };
    T.isEqual = function (e, t) {
        return M(e, t, [], [])
    }, T.isEmpty = function (e) {
        if (e == null) return !0;
        if (T.isArray(e) || T.isString(e)) return e.length === 0;
        for (var t in e) if (T.has(e, t)) return !1;
        return !0
    }, T.isElement = function (e) {
        return !!e && e.nodeType === 1
    }, T.isArray = E ||
    function (e) {
        return l.call(e) == "[object Array]"
    }, T.isObject = function (e) {
        return e === Object(e)
    }, N(["Arguments", "Function", "String", "Number", "Date", "RegExp"], function (e) {
        T["is" + e] = function (t) {
            return l.call(t) == "[object " + e + "]"
        }
    }), T.isArguments(arguments) || (T.isArguments = function (e) {
        return !!e && !! T.has(e, "callee")
    }), typeof / . / != "function" && (T.isFunction = function (e) {
        return typeof e == "function"
    }), T.isFinite = function (e) {
        return T.isNumber(e) && isFinite(e)
    }, T.isNaN = function (e) {
        return T.isNumber(e) && e != +e
    }, T.isBoolean = function (e) {
        return e === !0 || e === !1 || l.call(e) == "[object Boolean]"
    }, T.isNull = function (e) {
        return e === null
    }, T.isUndefined = function (e) {
        return e === void 0
    }, T.has = function (e, t) {
        return c.call(e, t)
    }, T.noConflict = function () {
        return e._ = t, this
    }, T.identity = function (e) {
        return e
    }, T.times = function (e, t, n) {
        for (var r = 0; r < e; r++) t.call(n, r)
    }, T.random = function (e, t) {
        return t == null && (t = e, e = 0), e + (0 | Math.random() * (t - e + 1))
    };
    var _ = {
        escape: {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#x27;",
            "/": "&#x2F;"
        }
    };
    _.unescape = T.invert(_.escape);
    var D = {
        escape: new RegExp("[" + T.keys(_.escape).join("") + "]", "g"),
        unescape: new RegExp("(" + T.keys(_.unescape).join("|") + ")", "g")
    };
    T.each(["escape", "unescape"], function (e) {
        T[e] = function (t) {
            return t == null ? "" : ("" + t).replace(D[e], function (t) {
                return _[e][t]
            })
        }
    }), T.result = function (e, t) {
        if (e == null) return null;
        var n = e[t];
        return T.isFunction(n) ? n.call(e) : n
    }, T.mixin = function (e) {
        N(T.functions(e), function (t) {
            var n = T[t] = e[t];
            T.prototype[t] = function () {
                var e = [this._wrapped];
                return o.apply(e, arguments), F.call(this, n.apply(T, e))
            }
        })
    };
    var P = 0;
    T.uniqueId = function (e) {
        var t = P++;
        return e ? e + t : t
    }, T.templateSettings = {
        evaluate: /<%([\s\S]+?)%>/g,
        interpolate: /<%=([\s\S]+?)%>/g,
        escape: /<%-([\s\S]+?)%>/g
    };
    var H = /(.)^/,
        B = {
            "'": "'",
            "\\": "\\",
            "\r": "r",
            "\n": "n",
            "	": "t",
            "\u2028": "u2028",
            "\u2029": "u2029"
        },
        j = /\\|'|\r|\n|\t|\u2028|\u2029/g;
    T.template = function (e, t, n) {
        n = T.defaults({}, n, T.templateSettings);
        var r = new RegExp([(n.escape || H).source, (n.interpolate || H).source, (n.evaluate || H).source].join("|") + "|$", "g"),
            i = 0,
            s = "__p+='";
        e.replace(r, function (t, n, r, o, u) {
            s += e.slice(i, u).replace(j, function (e) {
                return "\\" + B[e]
            }), s += n ? "'+\n((__t=(" + n + "))==null?'':_.escape(__t))+\n'" : r ? "'+\n((__t=(" + r + "))==null?'':__t)+\n'" : o ? "';\n" + o + "\n__p+='" : "", i = u + t.length
        }), s += "';\n", n.variable || (s = "with(obj||{}){\n" + s + "}\n"), s = "var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};\n" + s + "return __p;\n";
        try {
            var o = new Function(n.variable || "obj", "_", s)
        } catch (u) {
            throw u.source = s, u
        }
        if (t) return o(t, T);
        var a = function (e) {
                return o.call(this, e, T)
            };
        return a.source = "function(" + (n.variable || "obj") + "){\n" + s + "}", a
    }, T.chain = function (e) {
        return T(e).chain()
    };
    var F = function (e) {
            return this._chain ? T(e).chain() : e
        };
    T.mixin(T), N(["pop", "push", "reverse", "shift", "sort", "splice", "unshift"], function (e) {
        var t = r[e];
        T.prototype[e] = function () {
            var n = this._wrapped;
            return t.apply(n, arguments), (e == "shift" || e == "splice") && n.length === 0 && delete n[0], F.call(this, n)
        }
    }), N(["concat", "join", "slice"], function (e) {
        var t = r[e];
        T.prototype[e] = function () {
            return F.call(this, t.apply(this._wrapped, arguments))
        }
    }), T.extend(T.prototype, {
        chain: function () {
            return this._chain = !0, this
        },
        value: function () {
            return this._wrapped
        }
    })
}.call(this);
!
function (window, document, $, undefined) {
    "use strict";
    var W = $(window),
        D = $(document),
        F = $.fancybox = function () {
            F.open.apply(this, arguments)
        },
        didUpdate = null,
        isTouch = document.createTouch !== undefined,
        isQuery = function (obj) {
            return obj && obj.hasOwnProperty && obj instanceof $
        },
        isString = function (str) {
            return str && $.type(str) === "string"
        },
        isPercentage = function (str) {
            return isString(str) && str.indexOf("%") > 0
        },
        isScrollable = function (el) {
            return el && !(el.style.overflow && el.style.overflow === "hidden") && (el.clientWidth && el.scrollWidth > el.clientWidth || el.clientHeight && el.scrollHeight > el.clientHeight)
        },
        getScalar = function (orig, dim) {
            var value = parseInt(orig, 10) || 0;
            if (dim && isPercentage(orig)) {
                value = F.getViewport()[dim] / 100 * value
            }
            return Math.ceil(value)
        },
        getValue = function (value, dim) {
            return getScalar(value, dim) + "px"
        };
    $.extend(F, {
        version: "2.1.3",
        defaults: {
            padding: 15,
            margin: 20,
            width: 800,
            height: 600,
            minWidth: 100,
            minHeight: 100,
            maxWidth: 9999,
            maxHeight: 9999,
            autoSize: true,
            autoHeight: false,
            autoWidth: false,
            autoResize: true,
            autoCenter: !isTouch,
            fitToView: true,
            aspectRatio: false,
            topRatio: .5,
            leftRatio: .5,
            scrolling: "auto",
            wrapCSS: "",
            arrows: true,
            closeBtn: true,
            closeClick: false,
            nextClick: false,
            mouseWheel: true,
            autoPlay: false,
            playSpeed: 3e3,
            preload: 3,
            modal: false,
            loop: true,
            ajax: {
                dataType: "html",
                headers: {
                    "X-fancyBox": true
                }
            },
            iframe: {
                scrolling: "auto",
                preload: true
            },
            swf: {
                wmode: "transparent",
                allowfullscreen: "true",
                allowscriptaccess: "always"
            },
            keys: {
                next: {
                    13: "left",
                    34: "up",
                    39: "left",
                    40: "up"
                },
                prev: {
                    8: "right",
                    33: "down",
                    37: "right",
                    38: "down"
                },
                close: [27],
                play: [32],
                toggle: [70]
            },
            direction: {
                next: "left",
                prev: "right"
            },
            scrollOutside: true,
            index: 0,
            type: null,
            href: null,
            content: null,
            title: null,
            tpl: {
                wrap: '<div class="fancybox-wrap" tabIndex="-1"><div class="fancybox-skin"><div class="fancybox-outer"><div class="fancybox-inner"></div></div></div></div>',
                image: '<img class="fancybox-image" src="{href}" alt="" />',
                iframe: '<iframe id="fancybox-frame{rnd}" name="fancybox-frame{rnd}" class="fancybox-iframe" frameborder="0" vspace="0" hspace="0" webkitAllowFullScreen mozallowfullscreen allowFullScreen' + ($.browser.msie ? ' allowtransparency="true"' : "") + "></iframe>",
                error: '<p class="fancybox-error">The requested content cannot be loaded.<br/>Please try again later.</p>',
                closeBtn: '<a title="Close" class="fancybox-item fancybox-close" href="javascript:;"></a>',
                next: '<a title="Next" class="fancybox-nav fancybox-next" href="javascript:;"><span></span></a>',
                prev: '<a title="Previous" class="fancybox-nav fancybox-prev" href="javascript:;"><span></span></a>'
            },
            openEffect: "fade",
            openSpeed: 250,
            openEasing: "swing",
            openOpacity: true,
            openMethod: "zoomIn",
            closeEffect: "fade",
            closeSpeed: 250,
            closeEasing: "swing",
            closeOpacity: true,
            closeMethod: "zoomOut",
            nextEffect: "elastic",
            nextSpeed: 250,
            nextEasing: "swing",
            nextMethod: "changeIn",
            prevEffect: "elastic",
            prevSpeed: 250,
            prevEasing: "swing",
            prevMethod: "changeOut",
            helpers: {
                overlay: true,
                title: true
            },
            onCancel: $.noop,
            beforeLoad: $.noop,
            afterLoad: $.noop,
            beforeShow: $.noop,
            afterShow: $.noop,
            beforeChange: $.noop,
            beforeClose: $.noop,
            afterClose: $.noop
        },
        group: {},
        opts: {},
        previous: null,
        coming: null,
        current: null,
        isActive: false,
        isOpen: false,
        isOpened: false,
        wrap: null,
        skin: null,
        outer: null,
        inner: null,
        player: {
            timer: null,
            isActive: false
        },
        ajaxLoad: null,
        imgPreload: null,
        transitions: {},
        helpers: {},
        open: function (group, opts) {
            if (!group) {
                return
            }
            if (!$.isPlainObject(opts)) {
                opts = {}
            }
            if (false === F.close(true)) {
                return
            }
            if (!$.isArray(group)) {
                group = isQuery(group) ? $(group).get() : [group]
            }
            $.each(group, function (i, element) {
                var obj = {},
                    href, title, content, type, rez, hrefParts, selector;
                if ($.type(element) === "object") {
                    if (element.nodeType) {
                        element = $(element)
                    }
                    if (isQuery(element)) {
                        obj = {
                            href: element.data("fancybox-href") || element.attr("href"),
                            title: element.data("fancybox-title") || element.attr("title"),
                            isDom: true,
                            element: element
                        };
                        if ($.metadata) {
                            $.extend(true, obj, element.metadata())
                        }
                    } else {
                        obj = element
                    }
                }
                href = opts.href || obj.href || (isString(element) ? element : null);
                title = opts.title !== undefined ? opts.title : obj.title || "";
                content = opts.content || obj.content;
                type = content ? "html" : opts.type || obj.type;
                if (!type && obj.isDom) {
                    type = element.data("fancybox-type");
                    if (!type) {
                        rez = element.prop("class").match(/fancybox\.(\w+)/);
                        type = rez ? rez[1] : null
                    }
                }
                if (isString(href)) {
                    if (!type) {
                        if (F.isImage(href)) {
                            type = "image"
                        } else if (F.isSWF(href)) {
                            type = "swf"
                        } else if (href.charAt(0) === "#") {
                            type = "inline"
                        } else if (isString(element)) {
                            type = "html";
                            content = element
                        }
                    }
                    if (type === "ajax") {
                        hrefParts = href.split(/\s+/, 2);
                        href = hrefParts.shift();
                        selector = hrefParts.shift()
                    }
                }
                if (!content) {
                    if (type === "inline") {
                        if (href) {
                            content = $(isString(href) ? href.replace(/.*(?=#[^\s]+$)/, "") : href)
                        } else if (obj.isDom) {
                            content = element
                        }
                    } else if (type === "html") {
                        content = href
                    } else if (!type && !href && obj.isDom) {
                        type = "inline";
                        content = element
                    }
                }
                $.extend(obj, {
                    href: href,
                    type: type,
                    content: content,
                    title: title,
                    selector: selector
                });
                group[i] = obj
            });
            F.opts = $.extend(true, {}, F.defaults, opts);
            if (opts.keys !== undefined) {
                F.opts.keys = opts.keys ? $.extend({}, F.defaults.keys, opts.keys) : false
            }
            F.group = group;
            return F._start(F.opts.index)
        },
        cancel: function () {
            var coming = F.coming;
            if (!coming || false === F.trigger("onCancel")) {
                return
            }
            F.hideLoading();
            if (F.ajaxLoad) {
                F.ajaxLoad.abort()
            }
            F.ajaxLoad = null;
            if (F.imgPreload) {
                F.imgPreload.onload = F.imgPreload.onerror = null
            }
            if (coming.wrap) {
                coming.wrap.stop(true, true).trigger("onReset").remove()
            }
            F.coming = null;
            if (!F.current) {
                F._afterZoomOut(coming)
            }
        },
        close: function (event) {
            F.cancel();
            if (false === F.trigger("beforeClose")) {
                return
            }
            F.unbindEvents();
            if (!F.isActive) {
                return
            }
            if (!F.isOpen || event === true) {
                $(".fancybox-wrap").stop(true).trigger("onReset").remove();
                F._afterZoomOut()
            } else {
                F.isOpen = F.isOpened = false;
                F.isClosing = true;
                $(".fancybox-item, .fancybox-nav").remove();
                F.wrap.stop(true, true).removeClass("fancybox-opened");
                F.transitions[F.current.closeMethod]()
            }
        },
        play: function (action) {
            var clear = function () {
                    clearTimeout(F.player.timer)
                },
                set = function () {
                    clear();
                    if (F.current && F.player.isActive) {
                        F.player.timer = setTimeout(F.next, F.current.playSpeed)
                    }
                },
                stop = function () {
                    clear();
                    $("body").unbind(".player");
                    F.player.isActive = false;
                    F.trigger("onPlayEnd")
                },
                start = function () {
                    if (F.current && (F.current.loop || F.current.index < F.group.length - 1)) {
                        F.player.isActive = true;
                        $("body").bind({
                            "afterShow.player onUpdate.player": set,
                            "onCancel.player beforeClose.player": stop,
                            "beforeLoad.player": clear
                        });
                        set();
                        F.trigger("onPlayStart")
                    }
                };
            if (action === true || !F.player.isActive && action !== false) {
                start()
            } else {
                stop()
            }
        },
        next: function (direction) {
            var current = F.current;
            if (current) {
                if (!isString(direction)) {
                    direction = current.direction.next
                }
                F.jumpto(current.index + 1, direction, "next")
            }
        },
        prev: function (direction) {
            var current = F.current;
            if (current) {
                if (!isString(direction)) {
                    direction = current.direction.prev
                }
                F.jumpto(current.index - 1, direction, "prev")
            }
        },
        jumpto: function (index, direction, router) {
            var current = F.current;
            if (!current) {
                return
            }
            index = getScalar(index);
            F.direction = direction || current.direction[index >= current.index ? "next" : "prev"];
            F.router = router || "jumpto";
            if (current.loop) {
                if (index < 0) {
                    index = current.group.length + index % current.group.length
                }
                index = index % current.group.length
            }
            if (current.group[index] !== undefined) {
                F.cancel();
                F._start(index)
            }
        },
        reposition: function (e, onlyAbsolute) {
            var current = F.current,
                wrap = current ? current.wrap : null,
                pos;
            if (wrap) {
                pos = F._getPosition(onlyAbsolute);
                if (e && e.type === "scroll") {
                    delete pos.position;
                    wrap.stop(true, true).animate(pos, 200)
                } else {
                    wrap.css(pos);
                    current.pos = $.extend({}, current.dim, pos)
                }
            }
        },
        update: function (e) {
            var type = e && e.type,
                anyway = !type || type === "orientationchange";
            if (anyway) {
                clearTimeout(didUpdate);
                didUpdate = null
            }
            if (!F.isOpen || didUpdate) {
                return
            }
            didUpdate = setTimeout(function () {
                var current = F.current;
                if (!current || F.isClosing) {
                    return
                }
                F.wrap.removeClass("fancybox-tmp");
                if (anyway || type === "load" || type === "resize" && current.autoResize) {
                    F._setDimension()
                }
                if (!(type === "scroll" && current.canShrink)) {
                    F.reposition(e)
                }
                F.trigger("onUpdate");
                didUpdate = null
            }, anyway && !isTouch ? 0 : 300)
        },
        toggle: function (action) {
            if (F.isOpen) {
                F.current.fitToView = $.type(action) === "boolean" ? action : !F.current.fitToView;
                if (isTouch) {
                    F.wrap.removeAttr("style").addClass("fancybox-tmp");
                    F.trigger("onUpdate")
                }
                F.update()
            }
        },
        hideLoading: function () {
            D.unbind(".loading");
            $("#fancybox-loading").remove()
        },
        showLoading: function () {
            var el, viewport;
            F.hideLoading();
            el = $('<div id="fancybox-loading"><div></div></div>').click(F.cancel).appendTo("body");
            D.bind("keydown.loading", function (e) {
                if ((e.which || e.keyCode) === 27) {
                    e.preventDefault();
                    F.cancel()
                }
            });
            if (!F.defaults.fixed) {
                viewport = F.getViewport();
                el.css({
                    position: "absolute",
                    top: viewport.h * .5 + viewport.y,
                    left: viewport.w * .5 + viewport.x
                })
            }
        },
        getViewport: function () {
            var locked = F.current && F.current.locked || false,
                rez = {
                    x: W.scrollLeft(),
                    y: W.scrollTop()
                };
            if (locked) {
                rez.w = locked[0].clientWidth;
                rez.h = locked[0].clientHeight
            } else {
                rez.w = isTouch && window.innerWidth ? window.innerWidth : W.width();
                rez.h = isTouch && window.innerHeight ? window.innerHeight : W.height()
            }
            return rez
        },
        unbindEvents: function () {
            if (F.wrap && isQuery(F.wrap)) {
                F.wrap.unbind(".fb")
            }
            D.unbind(".fb");
            W.unbind(".fb")
        },
        bindEvents: function () {
            var current = F.current,
                keys;
            if (!current) {
                return
            }
            W.bind("orientationchange.fb" + (isTouch ? "" : " resize.fb") + (current.autoCenter && !current.locked ? " scroll.fb" : ""), F.update);
            keys = current.keys;
            if (keys) {
                D.bind("keydown.fb", function (e) {
                    var code = e.which || e.keyCode,
                        target = e.target || e.srcElement;
                    if (code === 27 && F.coming) {
                        return false
                    }
                    if (!e.ctrlKey && !e.altKey && !e.shiftKey && !e.metaKey && !(target && (target.type || $(target).is("[contenteditable]")))) {
                        $.each(keys, function (i, val) {
                            if (current.group.length > 1 && val[code] !== undefined) {
                                F[i](val[code]);
                                e.preventDefault();
                                return false
                            }
                            if ($.inArray(code, val) > -1) {
                                F[i]();
                                e.preventDefault();
                                return false
                            }
                        })
                    }
                })
            }
            if ($.fn.mousewheel && current.mouseWheel) {
                F.wrap.bind("mousewheel.fb", function (e, delta, deltaX, deltaY) {
                    var target = e.target || null,
                        parent = $(target),
                        canScroll = false;
                    while (parent.length) {
                        if (canScroll || parent.is(".fancybox-skin") || parent.is(".fancybox-wrap")) {
                            break
                        }
                        canScroll = isScrollable(parent[0]);
                        parent = $(parent).parent()
                    }
                    if (delta !== 0 && !canScroll) {
                        if (F.group.length > 1 && !current.canShrink) {
                            if (deltaY > 0 || deltaX > 0) {
                                F.prev(deltaY > 0 ? "down" : "left")
                            } else if (deltaY < 0 || deltaX < 0) {
                                F.next(deltaY < 0 ? "up" : "right")
                            }
                            e.preventDefault()
                        }
                    }
                })
            }
        },
        trigger: function (event, o) {
            var ret, obj = o || F.coming || F.current;
            if (!obj) {
                return
            }
            if ($.isFunction(obj[event])) {
                ret = obj[event].apply(obj, Array.prototype.slice.call(arguments, 1))
            }
            if (ret === false) {
                return false
            }
            if (obj.helpers) {
                $.each(obj.helpers, function (helper, opts) {
                    if (opts && F.helpers[helper] && $.isFunction(F.helpers[helper][event])) {
                        opts = $.extend(true, {}, F.helpers[helper].defaults, opts);
                        F.helpers[helper][event](opts, obj)
                    }
                })
            }
            $.event.trigger(event + ".fb")
        },
        isImage: function (str) {
            return isString(str) && str.match(/(^data:image\/.*,)|(\.(jp(e|g|eg)|gif|png|bmp|webp)((\?|#).*)?$)/i)
        },
        isSWF: function (str) {
            return isString(str) && str.match(/\.(swf)((\?|#).*)?$/i)
        },
        _start: function (index) {
            var coming = {},
                obj, href, type, margin, padding;
            index = getScalar(index);
            obj = F.group[index] || null;
            if (!obj) {
                return false
            }
            coming = $.extend(true, {}, F.opts, obj);
            margin = coming.margin;
            padding = coming.padding;
            if ($.type(margin) === "number") {
                coming.margin = [margin, margin, margin, margin]
            }
            if ($.type(padding) === "number") {
                coming.padding = [padding, padding, padding, padding]
            }
            if (coming.modal) {
                $.extend(true, coming, {
                    closeBtn: false,
                    closeClick: false,
                    nextClick: false,
                    arrows: false,
                    mouseWheel: false,
                    keys: null,
                    helpers: {
                        overlay: {
                            closeClick: false
                        }
                    }
                })
            }
            if (coming.autoSize) {
                coming.autoWidth = coming.autoHeight = true
            }
            if (coming.width === "auto") {
                coming.autoWidth = true
            }
            if (coming.height === "auto") {
                coming.autoHeight = true
            }
            coming.group = F.group;
            coming.index = index;
            F.coming = coming;
            if (false === F.trigger("beforeLoad")) {
                F.coming = null;
                return
            }
            type = coming.type;
            href = coming.href;
            if (!type) {
                F.coming = null;
                if (F.current && F.router && F.router !== "jumpto") {
                    F.current.index = index;
                    return F[F.router](F.direction)
                }
                return false
            }
            F.isActive = true;
            if (type === "image" || type === "swf") {
                coming.autoHeight = coming.autoWidth = false;
                coming.scrolling = "visible"
            }
            if (type === "image") {
                coming.aspectRatio = true
            }
            if (type === "iframe" && isTouch) {
                coming.scrolling = "scroll"
            }
            coming.wrap = $(coming.tpl.wrap).addClass("fancybox-" + (isTouch ? "mobile" : "desktop") + " fancybox-type-" + type + " fancybox-tmp " + coming.wrapCSS).appendTo(coming.parent || "body");
            $.extend(coming, {
                skin: $(".fancybox-skin", coming.wrap),
                outer: $(".fancybox-outer", coming.wrap),
                inner: $(".fancybox-inner", coming.wrap)
            });
            $.each(["Top", "Right", "Bottom", "Left"], function (i, v) {
                coming.skin.css("padding" + v, getValue(coming.padding[i]))
            });
            F.trigger("onReady");
            if (type === "inline" || type === "html") {
                if (!coming.content || !coming.content.length) {
                    return F._error("content")
                }
            } else if (!href) {
                return F._error("href")
            }
            if (type === "image") {
                F._loadImage()
            } else if (type === "ajax") {
                F._loadAjax()
            } else if (type === "iframe") {
                F._loadIframe()
            } else {
                F._afterLoad()
            }
        },
        _error: function (type) {
            $.extend(F.coming, {
                type: "html",
                autoWidth: true,
                autoHeight: true,
                minWidth: 0,
                minHeight: 0,
                scrolling: "no",
                hasError: type,
                content: F.coming.tpl.error
            });
            F._afterLoad()
        },
        _loadImage: function () {
            var img = F.imgPreload = new Image;
            img.onload = function () {
                this.onload = this.onerror = null;
                F.coming.width = this.width;
                F.coming.height = this.height;
                F._afterLoad()
            };
            img.onerror = function () {
                this.onload = this.onerror = null;
                F._error("image")
            };
            img.src = F.coming.href;
            if (img.complete !== true) {
                F.showLoading()
            }
        },
        _loadAjax: function () {
            var coming = F.coming;
            F.showLoading();
            F.ajaxLoad = $.ajax($.extend({}, coming.ajax, {
                url: coming.href,
                error: function (jqXHR, textStatus) {
                    if (F.coming && textStatus !== "abort") {
                        F._error("ajax", jqXHR)
                    } else {
                        F.hideLoading()
                    }
                },
                success: function (data, textStatus) {
                    if (textStatus === "success") {
                        coming.content = data;
                        F._afterLoad()
                    }
                }
            }))
        },
        _loadIframe: function () {
            var coming = F.coming,
                iframe = $(coming.tpl.iframe.replace(/\{rnd\}/g, (new Date).getTime())).attr("scrolling", isTouch ? "auto" : coming.iframe.scrolling).attr("src", coming.href);
            $(coming.wrap).bind("onReset", function () {
                try {
                    $(this).find("iframe").hide().attr("src", "//about:blank").end().empty()
                } catch (e) {}
            });
            if (coming.iframe.preload) {
                F.showLoading();
                iframe.one("load", function () {
                    $(this).data("ready", 1);
                    if (!isTouch) {
                        $(this).bind("load.fb", F.update)
                    }
                    $(this).parents(".fancybox-wrap").width("100%").removeClass("fancybox-tmp").show();
                    F._afterLoad()
                })
            }
            coming.content = iframe.appendTo(coming.inner);
            if (!coming.iframe.preload) {
                F._afterLoad()
            }
        },
        _preloadImages: function () {
            var group = F.group,
                current = F.current,
                len = group.length,
                cnt = current.preload ? Math.min(current.preload, len - 1) : 0,
                item, i;
            for (i = 1; i <= cnt; i += 1) {
                item = group[(current.index + i) % len];
                if (item.type === "image" && item.href) {
                    (new Image).src = item.href
                }
            }
        },
        _afterLoad: function () {
            var coming = F.coming,
                previous = F.current,
                placeholder = "fancybox-placeholder",
                current, content, type, scrolling, href, embed;
            F.hideLoading();
            if (!coming || F.isActive === false) {
                return
            }
            if (false === F.trigger("afterLoad", coming, previous)) {
                coming.wrap.stop(true).trigger("onReset").remove();
                F.coming = null;
                return
            }
            if (previous) {
                F.trigger("beforeChange", previous);
                previous.wrap.stop(true).removeClass("fancybox-opened").find(".fancybox-item, .fancybox-nav").remove()
            }
            F.unbindEvents();
            current = coming;
            content = coming.content;
            type = coming.type;
            scrolling = coming.scrolling;
            $.extend(F, {
                wrap: current.wrap,
                skin: current.skin,
                outer: current.outer,
                inner: current.inner,
                current: current,
                previous: previous
            });
            href = current.href;
            switch (type) {
            case "inline":
            case "ajax":
            case "html":
                if (current.selector) {
                    content = $("<div>").html(content).find(current.selector)
                } else if (isQuery(content)) {
                    if (!content.data(placeholder)) {
                        content.data(placeholder, $('<div class="' + placeholder + '"></div>').insertAfter(content).hide())
                    }
                    content = content.show().detach();
                    current.wrap.bind("onReset", function () {
                        if ($(this).find(content).length) {
                            content.hide().replaceAll(content.data(placeholder)).data(placeholder, false)
                        }
                    })
                }
                break;
            case "image":
                content = current.tpl.image.replace("{href}", href);
                break;
            case "swf":
                content = '<object id="fancybox-swf" classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" width="100%" height="100%"><param name="movie" value="' + href + '"></param>';
                embed = "";
                $.each(current.swf, function (name, val) {
                    content += '<param name="' + name + '" value="' + val + '"></param>';
                    embed += " " + name + '="' + val + '"'
                });
                content += '<embed src="' + href + '" type="application/x-shockwave-flash" width="100%" height="100%"' + embed + "></embed></object>";
                break
            }
            if (!(isQuery(content) && content.parent().is(current.inner))) {
                current.inner.append(content)
            }
            F.trigger("beforeShow");
            current.inner.css("overflow", scrolling === "yes" ? "scroll" : scrolling === "no" ? "hidden" : scrolling);
            F._setDimension();
            F.reposition();
            F.isOpen = false;
            F.coming = null;
            F.bindEvents();
            if (!F.isOpened) {
                $(".fancybox-wrap").not(current.wrap).stop(true).trigger("onReset").remove()
            } else if (previous.prevMethod) {
                F.transitions[previous.prevMethod]()
            }
            F.transitions[F.isOpened ? current.nextMethod : current.openMethod]();
            F._preloadImages()
        },
        _setDimension: function () {
            var viewport = F.getViewport(),
                steps = 0,
                canShrink = false,
                canExpand = false,
                wrap = F.wrap,
                skin = F.skin,
                inner = F.inner,
                current = F.current,
                width = current.width,
                height = current.height,
                minWidth = current.minWidth,
                minHeight = current.minHeight,
                maxWidth = current.maxWidth,
                maxHeight = current.maxHeight,
                scrolling = current.scrolling,
                scrollOut = current.scrollOutside ? current.scrollbarWidth : 0,
                margin = current.margin,
                wMargin = getScalar(margin[1] + margin[3]),
                hMargin = getScalar(margin[0] + margin[2]),
                wPadding, hPadding, wSpace, hSpace, origWidth, origHeight, origMaxWidth, origMaxHeight, ratio, width_, height_, maxWidth_, maxHeight_, iframe, body;
            wrap.add(skin).add(inner).width("auto").height("auto").removeClass("fancybox-tmp");
            wPadding = getScalar(skin.outerWidth(true) - skin.width());
            hPadding = getScalar(skin.outerHeight(true) - skin.height());
            wSpace = wMargin + wPadding;
            hSpace = hMargin + hPadding;
            origWidth = isPercentage(width) ? (viewport.w - wSpace) * getScalar(width) / 100 : width;
            origHeight = isPercentage(height) ? (viewport.h - hSpace) * getScalar(height) / 100 : height;
            if (current.type === "iframe") {
                iframe = current.content;
                if (current.autoHeight && iframe.data("ready") === 1) {
                    try {
                        if (iframe[0].contentWindow.document.location) {
                            inner.width(origWidth).height(9999);
                            body = iframe.contents().find("body");
                            if (scrollOut) {
                                body.css("overflow-x", "hidden")
                            }
                            origHeight = body.height()
                        }
                    } catch (e) {}
                }
            } else if (current.autoWidth || current.autoHeight) {
                inner.addClass("fancybox-tmp");
                if (!current.autoWidth) {
                    inner.width(origWidth)
                }
                if (!current.autoHeight) {
                    inner.height(origHeight)
                }
                if (current.autoWidth) {
                    origWidth = inner.width()
                }
                if (current.autoHeight) {
                    origHeight = inner.height()
                }
                inner.removeClass("fancybox-tmp")
            }
            width = getScalar(origWidth);
            height = getScalar(origHeight);
            ratio = origWidth / origHeight;
            minWidth = getScalar(isPercentage(minWidth) ? getScalar(minWidth, "w") - wSpace : minWidth);
            maxWidth = getScalar(isPercentage(maxWidth) ? getScalar(maxWidth, "w") - wSpace : maxWidth);
            minHeight = getScalar(isPercentage(minHeight) ? getScalar(minHeight, "h") - hSpace : minHeight);
            maxHeight = getScalar(isPercentage(maxHeight) ? getScalar(maxHeight, "h") - hSpace : maxHeight);
            origMaxWidth = maxWidth;
            origMaxHeight = maxHeight;
            if (current.fitToView) {
                maxWidth = Math.min(viewport.w - wSpace, maxWidth);
                maxHeight = Math.min(viewport.h - hSpace, maxHeight)
            }
            maxWidth_ = viewport.w - wMargin;
            maxHeight_ = viewport.h - hMargin;
            if (current.aspectRatio) {
                if (width > maxWidth) {
                    width = maxWidth;
                    height = getScalar(width / ratio)
                }
                if (height > maxHeight) {
                    height = maxHeight;
                    width = getScalar(height * ratio)
                }
                if (width < minWidth) {
                    width = minWidth;
                    height = getScalar(width / ratio)
                }
                if (height < minHeight) {
                    height = minHeight;
                    width = getScalar(height * ratio)
                }
            } else {
                width = Math.max(minWidth, Math.min(width, maxWidth));
                if (current.autoHeight && current.type !== "iframe") {
                    inner.width(width);
                    height = inner.height()
                }
                height = Math.max(minHeight, Math.min(height, maxHeight))
            }
            if (current.fitToView) {
                inner.width(width).height(height);
                wrap.width(width + wPadding);
                width_ = wrap.width();
                height_ = wrap.height();
                if (current.aspectRatio) {
                    while ((width_ > maxWidth_ || height_ > maxHeight_) && width > minWidth && height > minHeight) {
                        if (steps++ > 19) {
                            break
                        }
                        height = Math.max(minHeight, Math.min(maxHeight, height - 10));
                        width = getScalar(height * ratio);
                        if (width < minWidth) {
                            width = minWidth;
                            height = getScalar(width / ratio)
                        }
                        if (width > maxWidth) {
                            width = maxWidth;
                            height = getScalar(width / ratio)
                        }
                        inner.width(width).height(height);
                        wrap.width(width + wPadding);
                        width_ = wrap.width();
                        height_ = wrap.height()
                    }
                } else {
                    width = Math.max(minWidth, Math.min(width, width - (width_ - maxWidth_)));
                    height = Math.max(minHeight, Math.min(height, height - (height_ - maxHeight_)))
                }
            }
            if (scrollOut && scrolling === "auto" && height < origHeight && width + wPadding + scrollOut < maxWidth_) {
                width += scrollOut
            }
            inner.width(width).height(height);
            wrap.width(width + wPadding);
            width_ = wrap.width();
            height_ = wrap.height();
            canShrink = (width_ > maxWidth_ || height_ > maxHeight_) && width > minWidth && height > minHeight;
            canExpand = current.aspectRatio ? width < origMaxWidth && height < origMaxHeight && width < origWidth && height < origHeight : (width < origMaxWidth || height < origMaxHeight) && (width < origWidth || height < origHeight);
            $.extend(current, {
                dim: {
                    width: getValue(width_),
                    height: getValue(height_)
                },
                origWidth: origWidth,
                origHeight: origHeight,
                canShrink: canShrink,
                canExpand: canExpand,
                wPadding: wPadding,
                hPadding: hPadding,
                wrapSpace: height_ - skin.outerHeight(true),
                skinSpace: skin.height() - height
            });
            if (!iframe && current.autoHeight && height > minHeight && height < maxHeight && !canExpand) {
                inner.height("auto")
            }
        },
        _getPosition: function (onlyAbsolute) {
            var current = F.current,
                viewport = F.getViewport(),
                margin = current.margin,
                width = F.wrap.width() + margin[1] + margin[3],
                height = F.wrap.height() + margin[0] + margin[2],
                rez = {
                    position: "absolute",
                    top: margin[0],
                    left: margin[3]
                };
            if (current.autoCenter && current.fixed && !onlyAbsolute && height <= viewport.h && width <= viewport.w) {
                rez.position = "fixed"
            } else if (!current.locked) {
                rez.top += viewport.y;
                rez.left += viewport.x
            }
            rez.top = getValue(Math.max(rez.top, rez.top + (viewport.h - height) * current.topRatio));
            rez.left = getValue(Math.max(rez.left, rez.left + (viewport.w - width) * current.leftRatio));
            return rez
        },
        _afterZoomIn: function () {
            var current = F.current;
            if (!current) {
                return
            }
            F.isOpen = F.isOpened = true;
            F.wrap.css("overflow", "visible").addClass("fancybox-opened");
            F.update();
            if (current.closeClick || current.nextClick && F.group.length > 1) {
                F.inner.css("cursor", "pointer").bind("click.fb", function (e) {
                    if (!$(e.target).is("a") && !$(e.target).parent().is("a")) {
                        e.preventDefault();
                        F[current.closeClick ? "close" : "next"]()
                    }
                })
            }
            if (current.closeBtn) {
                $(current.tpl.closeBtn).appendTo(F.skin).bind(isTouch ? "touchstart.fb" : "click.fb", function (e) {
                    e.preventDefault();
                    F.close()
                })
            }
            if (current.arrows && F.group.length > 1) {
                if (current.loop || current.index > 0) {
                    $(current.tpl.prev).appendTo(F.outer).bind("click.fb", F.prev)
                }
                if (current.loop || current.index < F.group.length - 1) {
                    $(current.tpl.next).appendTo(F.outer).bind("click.fb", F.next)
                }
            }
            F.trigger("afterShow");
            if (!current.loop && current.index === current.group.length - 1) {
                F.play(false)
            } else if (F.opts.autoPlay && !F.player.isActive) {
                F.opts.autoPlay = false;
                F.play()
            }
        },
        _afterZoomOut: function (obj) {
            obj = obj || F.current;
            $(".fancybox-wrap").trigger("onReset").remove();
            $.extend(F, {
                group: {},
                opts: {},
                router: false,
                current: null,
                isActive: false,
                isOpened: false,
                isOpen: false,
                isClosing: false,
                wrap: null,
                skin: null,
                outer: null,
                inner: null
            });
            F.trigger("afterClose", obj)
        }
    });
    F.transitions = {
        getOrigPosition: function () {
            var current = F.current,
                element = current.element,
                orig = current.orig,
                pos = {},
                width = 50,
                height = 50,
                hPadding = current.hPadding,
                wPadding = current.wPadding,
                viewport = F.getViewport();
            if (!orig && current.isDom && element.is(":visible")) {
                orig = element.find("img:first");
                if (!orig.length) {
                    orig = element
                }
            }
            if (isQuery(orig)) {
                pos = orig.offset();
                if (orig.is("img")) {
                    width = orig.outerWidth();
                    height = orig.outerHeight()
                }
            } else {
                pos.top = viewport.y + (viewport.h - height) * current.topRatio;
                pos.left = viewport.x + (viewport.w - width) * current.leftRatio
            }
            if (F.wrap.css("position") === "fixed" || current.locked) {
                pos.top -= viewport.y;
                pos.left -= viewport.x
            }
            pos = {
                top: getValue(pos.top - hPadding * current.topRatio),
                left: getValue(pos.left - wPadding * current.leftRatio),
                width: getValue(width + wPadding),
                height: getValue(height + hPadding)
            };
            return pos
        },
        step: function (now, fx) {
            var ratio, padding, value, prop = fx.prop,
                current = F.current,
                wrapSpace = current.wrapSpace,
                skinSpace = current.skinSpace;
            if (prop === "width" || prop === "height") {
                ratio = fx.end === fx.start ? 1 : (now - fx.start) / (fx.end - fx.start);
                if (F.isClosing) {
                    ratio = 1 - ratio
                }
                padding = prop === "width" ? current.wPadding : current.hPadding;
                value = now - padding;
                F.skin[prop](getScalar(prop === "width" ? value : value - wrapSpace * ratio));
                F.inner[prop](getScalar(prop === "width" ? value : value - wrapSpace * ratio - skinSpace * ratio))
            }
        },
        zoomIn: function () {
            var current = F.current,
                startPos = current.pos,
                effect = current.openEffect,
                elastic = effect === "elastic",
                endPos = $.extend({
                    opacity: 1
                }, startPos);
            delete endPos.position;
            if (elastic) {
                startPos = this.getOrigPosition();
                if (current.openOpacity) {
                    startPos.opacity = .1
                }
            } else if (effect === "fade") {
                startPos.opacity = .1
            }
            F.wrap.css(startPos).animate(endPos, {
                duration: effect === "none" ? 0 : current.openSpeed,
                easing: current.openEasing,
                step: elastic ? this.step : null,
                complete: F._afterZoomIn
            })
        },
        zoomOut: function () {
            var current = F.current,
                effect = current.closeEffect,
                elastic = effect === "elastic",
                endPos = {
                    opacity: .1
                };
            if (elastic) {
                endPos = this.getOrigPosition();
                if (current.closeOpacity) {
                    endPos.opacity = .1
                }
            }
            F.wrap.animate(endPos, {
                duration: effect === "none" ? 0 : current.closeSpeed,
                easing: current.closeEasing,
                step: elastic ? this.step : null,
                complete: F._afterZoomOut
            })
        },
        changeIn: function () {
            var current = F.current,
                effect = current.nextEffect,
                startPos = current.pos,
                endPos = {
                    opacity: 1
                },
                direction = F.direction,
                distance = 200,
                field;
            startPos.opacity = .1;
            if (effect === "elastic") {
                field = direction === "down" || direction === "up" ? "top" : "left";
                if (direction === "down" || direction === "right") {
                    startPos[field] = getValue(getScalar(startPos[field]) - distance);
                    endPos[field] = "+=" + distance + "px"
                } else {
                    startPos[field] = getValue(getScalar(startPos[field]) + distance);
                    endPos[field] = "-=" + distance + "px"
                }
            }
            if (effect === "none") {
                F._afterZoomIn()
            } else {
                F.wrap.css(startPos).animate(endPos, {
                    duration: current.nextSpeed,
                    easing: current.nextEasing,
                    complete: function () {
                        setTimeout(F._afterZoomIn, 20)
                    }
                })
            }
        },
        changeOut: function () {
            var previous = F.previous,
                effect = previous.prevEffect,
                endPos = {
                    opacity: .1
                },
                direction = F.direction,
                distance = 200;
            if (effect === "elastic") {
                endPos[direction === "down" || direction === "up" ? "top" : "left"] = (direction === "up" || direction === "left" ? "-" : "+") + "=" + distance + "px"
            }
            previous.wrap.animate(endPos, {
                duration: effect === "none" ? 0 : previous.prevSpeed,
                easing: previous.prevEasing,
                complete: function () {
                    $(this).trigger("onReset").remove()
                }
            })
        }
    };
    F.helpers.overlay = {
        defaults: {
            closeClick: true,
            speedOut: 200,
            showEarly: true,
            css: {},
            locked: !isTouch,
            fixed: true
        },
        overlay: null,
        fixed: false,
        create: function (opts) {
            opts = $.extend({}, this.defaults, opts);
            if (this.overlay) {
                this.close()
            }
            this.overlay = $('<div class="fancybox-overlay"></div>').appendTo("body");
            this.fixed = false;
            if (opts.fixed && F.defaults.fixed) {
                this.overlay.addClass("fancybox-overlay-fixed");
                this.fixed = true
            }
        },
        open: function (opts) {
            var that = this;
            opts = $.extend({}, this.defaults, opts);
            if (this.overlay) {
                this.overlay.unbind(".overlay").width("auto").height("auto")
            } else {
                this.create(opts)
            }
            if (!this.fixed) {
                W.bind("resize.overlay", $.proxy(this.update, this));
                this.update()
            }
            if (opts.closeClick) {
                this.overlay.bind("click.overlay", function (e) {
                    if ($(e.target).hasClass("fancybox-overlay")) {
                        if (F.isActive) {
                            F.close()
                        } else {
                            that.close()
                        }
                    }
                })
            }
            this.overlay.css(opts.css).show()
        },
        close: function () {
            $(".fancybox-overlay").remove();
            W.unbind("resize.overlay");
            this.overlay = null;
            if (this.margin !== false) {
                $("body").css("margin-right", this.margin);
                this.margin = false
            }
            if (this.el) {
                this.el.removeClass("fancybox-lock")
            }
        },
        update: function () {
            var width = "100%",
                offsetWidth;
            this.overlay.width(width).height("100%");
            if ($.browser.msie) {
                offsetWidth = Math.max(document.documentElement.offsetWidth, document.body.offsetWidth);
                if (D.width() > offsetWidth) {
                    width = D.width()
                }
            } else if (D.width() > W.width()) {
                width = D.width()
            }
            this.overlay.width(width).height(D.height())
        },
        onReady: function (opts, obj) {
            $(".fancybox-overlay").stop(true, true);
            if (!this.overlay) {
                this.margin = D.height() > W.height() || $("body").css("overflow-y") === "scroll" ? $("body").css("margin-right") : false;
                this.el = document.all && !document.querySelector ? $("html") : $("body");
                this.create(opts)
            }
            if (opts.locked && this.fixed) {
                obj.locked = this.overlay.append(obj.wrap);
                obj.fixed = false
            }
            if (opts.showEarly === true) {
                this.beforeShow.apply(this, arguments)
            }
        },
        beforeShow: function (opts, obj) {
            if (obj.locked) {
                this.el.addClass("fancybox-lock");
                if (this.margin !== false) {
                    $("body").css("margin-right", getScalar(this.margin) + obj.scrollbarWidth)
                }
            }
            this.open(opts)
        },
        onUpdate: function () {
            if (!this.fixed) {
                this.update()
            }
        },
        afterClose: function (opts) {
            if (this.overlay && !F.isActive) {
                this.overlay.fadeOut(opts.speedOut, $.proxy(this.close, this))
            }
        }
    };
    F.helpers.title = {
        defaults: {
            type: "float",
            position: "bottom"
        },
        beforeShow: function (opts) {
            var current = F.current,
                text = current.title,
                type = opts.type,
                title, target;
            if ($.isFunction(text)) {
                text = text.call(current.element, current)
            }
            if (!isString(text) || $.trim(text) === "") {
                return
            }
            title = $('<div class="fancybox-title fancybox-title-' + type + '-wrap">' + text + "</div>");
            switch (type) {
            case "inside":
                target = F.skin;
                break;
            case "outside":
                target = F.wrap;
                break;
            case "over":
                target = F.inner;
                break;
            default:
                target = F.skin;
                title.appendTo("body");
                if ($.browser.msie) {
                    title.width(title.width())
                }
                title.wrapInner('<span class="child"></span>');
                F.current.margin[2] += Math.abs(getScalar(title.css("margin-bottom")));
                break
            }
            title[opts.position === "top" ? "prependTo" : "appendTo"](target)
        }
    };
    $.fn.fancybox = function (options) {
        var index, that = $(this),
            selector = this.selector || "",
            run = function (e) {
                var what = $(this).blur(),
                    idx = index,
                    relType, relVal;
                if (!(e.ctrlKey || e.altKey || e.shiftKey || e.metaKey) && !what.is(".fancybox-wrap")) {
                    relType = options.groupAttr || "data-fancybox-group";
                    relVal = what.attr(relType);
                    if (!relVal) {
                        relType = "rel";
                        relVal = what.get(0)[relType]
                    }
                    if (relVal && relVal !== "" && relVal !== "nofollow") {
                        what = selector.length ? $(selector) : that;
                        what = what.filter("[" + relType + '="' + relVal + '"]');
                        idx = what.index(this)
                    }
                    options.index = idx;
                    if (F.open(what, options) !== false) {
                        e.preventDefault()
                    }
                }
            };
        options = options || {};
        index = options.index || 0;
        if (!selector || options.live === false) {
            that.unbind("click.fb-start").bind("click.fb-start", run)
        } else {
            D.undelegate(selector, "click.fb-start").delegate(selector + ":not('.fancybox-item, .fancybox-nav')", "click.fb-start", run)
        }
        this.filter("[data-fancybox-start=1]").trigger("click");
        return this
    };
    D.ready(function () {
        if ($.scrollbarWidth === undefined) {
            $.scrollbarWidth = function () {
                var parent = $('<div style="width:50px;height:50px;overflow:auto"><div/></div>').appendTo("body"),
                    child = parent.children(),
                    width = child.innerWidth() - child.height(99).innerWidth();
                parent.remove();
                return width
            }
        }
        if ($.support.fixedPosition === undefined) {
            $.support.fixedPosition = function () {
                var elem = $('<div style="position:fixed;top:20px;"></div>').appendTo("body"),
                    fixed = elem[0].offsetTop === 20 || elem[0].offsetTop === 15;
                elem.remove();
                return fixed
            }()
        }
        $.extend(F.defaults, {
            scrollbarWidth: $.scrollbarWidth(),
            fixed: $.support.fixedPosition,
            parent: $("body")
        })
    })
}(window, document, jQuery);
!
function (a, b) {
    "use strict";
    var c = a.console || b,
        d = a.document,
        e = a.navigator,
        f = a.sessionStorage || !1,
        g = a.setTimeout,
        h = a.clearTimeout,
        i = a.setInterval,
        j = a.clearInterval,
        k = a.JSON,
        l = a.alert,
        m = a.History = a.History || {},
        n = a.history;
    k.stringify = k.stringify || k.encode, k.parse = k.parse || k.decode;
    if (typeof m.init != "undefined") throw new Error("History.js Core has already been loaded...");
    m.init = function () {
        return typeof m.Adapter == "undefined" ? !1 : (typeof m.initCore != "undefined" && m.initCore(), typeof m.initHtml4 != "undefined" && m.initHtml4(), !0)
    }, m.initCore = function () {
        if (typeof m.initCore.initialized != "undefined") return !1;
        m.initCore.initialized = !0, m.options = m.options || {}, m.options.hashChangeInterval = m.options.hashChangeInterval || 100, m.options.safariPollInterval = m.options.safariPollInterval || 500, m.options.doubleCheckInterval = m.options.doubleCheckInterval || 500, m.options.storeInterval = m.options.storeInterval || 1e3, m.options.busyDelay = m.options.busyDelay || 250, m.options.debug = m.options.debug || !1, m.options.initialTitle = m.options.initialTitle || d.title, m.intervalList = [], m.clearAllIntervals = function () {
            var a, b = m.intervalList;
            if (typeof b != "undefined" && b !== null) {
                for (a = 0; a < b.length; a++) j(b[a]);
                m.intervalList = null
            }
        }, m.debug = function () {
            (m.options.debug || !1) && m.log.apply(m, arguments)
        }, m.log = function () {
            var a = typeof c != "undefined" && typeof c.log != "undefined" && typeof c.log.apply != "undefined",
                b = d.getElementById("log"),
                e, f, g, h, i;
            a ? (h = Array.prototype.slice.call(arguments), e = h.shift(), typeof c.debug != "undefined" ? c.debug.apply(c, [e, h]) : c.log.apply(c, [e, h])) : e = "\n" + arguments[0] + "\n";
            for (f = 1, g = arguments.length; f < g; ++f) {
                i = arguments[f];
                if (typeof i == "object" && typeof k != "undefined") try {
                    i = k.stringify(i)
                } catch (j) {}
                e += "\n" + i + "\n"
            }
            return b ? (b.value += e + "\n-----\n", b.scrollTop = b.scrollHeight - b.clientHeight) : a || l(e), !0
        }, m.getInternetExplorerMajorVersion = function () {
            var a = m.getInternetExplorerMajorVersion.cached = typeof m.getInternetExplorerMajorVersion.cached != "undefined" ? m.getInternetExplorerMajorVersion.cached : function () {
                    var a = 3,
                        b = d.createElement("div"),
                        c = b.getElementsByTagName("i");
                    while ((b.innerHTML = "<!--[if gt IE " + ++a + "]><i></i><![endif]-->") && c[0]);
                    return a > 4 ? a : !1
                }();
            return a
        }, m.isInternetExplorer = function () {
            var a = m.isInternetExplorer.cached = typeof m.isInternetExplorer.cached != "undefined" ? m.isInternetExplorer.cached : Boolean(m.getInternetExplorerMajorVersion());
            return a
        }, m.emulated = {
            pushState: !Boolean(a.history && a.history.pushState && a.history.replaceState && !/ Mobile\/([1-7][a-z]|(8([abcde]|f(1[0-8]))))/i.test(e.userAgent) && !/AppleWebKit\/5([0-2]|3[0-2])/i.test(e.userAgent)),
            hashChange: Boolean(!("onhashchange" in a || "onhashchange" in d) || m.isInternetExplorer() && m.getInternetExplorerMajorVersion() < 8)
        }, m.enabled = !m.emulated.pushState, m.bugs = {
            setHash: Boolean(!m.emulated.pushState && e.vendor === "Apple Computer, Inc." && /AppleWebKit\/5([0-2]|3[0-3])/.test(e.userAgent)),
            safariPoll: Boolean(!m.emulated.pushState && e.vendor === "Apple Computer, Inc." && /AppleWebKit\/5([0-2]|3[0-3])/.test(e.userAgent)),
            ieDoubleCheck: Boolean(m.isInternetExplorer() && m.getInternetExplorerMajorVersion() < 8),
            hashEscape: Boolean(m.isInternetExplorer() && m.getInternetExplorerMajorVersion() < 7)
        }, m.isEmptyObject = function (a) {
            for (var b in a) return !1;
            return !0
        }, m.cloneObject = function (a) {
            var b, c;
            return a ? (b = k.stringify(a), c = k.parse(b)) : c = {}, c
        }, m.getRootUrl = function () {
            var a = d.location.protocol + "//" + (d.location.hostname || d.location.host);
            if (d.location.port || !1) a += ":" + d.location.port;
            return a += "/", a
        }, m.getBaseHref = function () {
            var a = d.getElementsByTagName("base"),
                b = null,
                c = "";
            return a.length === 1 && (b = a[0], c = b.href.replace(/[^\/]+$/, "")), c = c.replace(/\/+$/, ""), c && (c += "/"), c
        }, m.getBaseUrl = function () {
            var a = m.getBaseHref() || m.getBasePageUrl() || m.getRootUrl();
            return a
        }, m.getPageUrl = function () {
            var a = m.getState(!1, !1),
                b = (a || {}).url || d.location.href,
                c;
            return c = b.replace(/\/+$/, "").replace(/[^\/]+$/, function (a, b, c) {
                return /\./.test(a) ? a : a + "/"
            }), c
        }, m.getBasePageUrl = function () {
            var a = d.location.href.replace(/[#\?].*/, "").replace(/[^\/]+$/, function (a, b, c) {
                return /[^\/]$/.test(a) ? "" : a
            }).replace(/\/+$/, "") + "/";
            return a
        }, m.getFullUrl = function (a, b) {
            var c = a,
                d = a.substring(0, 1);
            return b = typeof b == "undefined" ? !0 : b, /[a-z]+\:\/\//.test(a) || (d === "/" ? c = m.getRootUrl() + a.replace(/^\/+/, "") : d === "#" ? c = m.getPageUrl().replace(/#.*/, "") + a : d === "?" ? c = m.getPageUrl().replace(/[\?#].*/, "") + a : b ? c = m.getBaseUrl() + a.replace(/^(\.\/)+/, "") : c = m.getBasePageUrl() + a.replace(/^(\.\/)+/, "")), c.replace(/\#$/, "")
        }, m.getShortUrl = function (a) {
            var b = a,
                c = m.getBaseUrl(),
                d = m.getRootUrl();
            return m.emulated.pushState && (b = b.replace(c, "")), b = b.replace(d, "/"), m.isTraditionalAnchor(b) && (b = "./" + b), b = b.replace(/^(\.\/)+/g, "./").replace(/\#$/, ""), b
        }, m.store = {}, m.idToState = m.idToState || {}, m.stateToId = m.stateToId || {}, m.urlToId = m.urlToId || {}, m.storedStates = m.storedStates || [], m.savedStates = m.savedStates || [], m.normalizeStore = function () {
            m.store.idToState = m.store.idToState || {}, m.store.urlToId = m.store.urlToId || {}, m.store.stateToId = m.store.stateToId || {}
        }, m.getState = function (a, b) {
            typeof a == "undefined" && (a = !0), typeof b == "undefined" && (b = !0);
            var c = m.getLastSavedState();
            return !c && b && (c = m.createStateObject()), a && (c = m.cloneObject(c), c.url = c.cleanUrl || c.url), c
        }, m.getIdByState = function (a) {
            var b = m.extractId(a.url),
                c;
            if (!b) {
                c = m.getStateString(a);
                if (typeof m.stateToId[c] != "undefined") b = m.stateToId[c];
                else if (typeof m.store.stateToId[c] != "undefined") b = m.store.stateToId[c];
                else {
                    for (;;) {
                        b = (new Date).getTime() + String(Math.random()).replace(/\D/g, "");
                        if (typeof m.idToState[b] == "undefined" && typeof m.store.idToState[b] == "undefined") break
                    }
                    m.stateToId[c] = b, m.idToState[b] = a
                }
            }
            return b
        }, m.normalizeState = function (a) {
            var b, c;
            if (!a || typeof a != "object") a = {};
            if (typeof a.normalized != "undefined") return a;
            if (!a.data || typeof a.data != "object") a.data = {};
            b = {}, b.normalized = !0, b.title = a.title || "", b.url = m.getFullUrl(m.unescapeString(a.url || d.location.href)), b.hash = m.getShortUrl(b.url), b.data = m.cloneObject(a.data), b.id = m.getIdByState(b), b.cleanUrl = b.url.replace(/\??\&_suid.*/, ""), b.url = b.cleanUrl, c = !m.isEmptyObject(b.data);
            if (b.title || c) b.hash = m.getShortUrl(b.url).replace(/\??\&_suid.*/, ""), /\?/.test(b.hash) || (b.hash += "?"), b.hash += "&_suid=" + b.id;
            return b.hashedUrl = m.getFullUrl(b.hash), (m.emulated.pushState || m.bugs.safariPoll) && m.hasUrlDuplicate(b) && (b.url = b.hashedUrl), b
        }, m.createStateObject = function (a, b, c) {
            var d = {
                data: a,
                title: b,
                url: c
            };
            return d = m.normalizeState(d), d
        }, m.getStateById = function (a) {
            a = String(a);
            var c = m.idToState[a] || m.store.idToState[a] || b;
            return c
        }, m.getStateString = function (a) {
            var b, c, d;
            return b = m.normalizeState(a), c = {
                data: b.data,
                title: a.title,
                url: a.url
            }, d = k.stringify(c), d
        }, m.getStateId = function (a) {
            var b, c;
            return b = m.normalizeState(a), c = b.id, c
        }, m.getHashByState = function (a) {
            var b, c;
            return b = m.normalizeState(a), c = b.hash, c
        }, m.extractId = function (a) {
            var b, c, d;
            return c = /(.*)\&_suid=([0-9]+)$/.exec(a), d = c ? c[1] || a : a, b = c ? String(c[2] || "") : "", b || !1
        }, m.isTraditionalAnchor = function (a) {
            var b = !/[\/\?\.]/.test(a);
            return b
        }, m.extractState = function (a, b) {
            var c = null,
                d, e;
            return b = b || !1, d = m.extractId(a), d && (c = m.getStateById(d)), c || (e = m.getFullUrl(a), d = m.getIdByUrl(e) || !1, d && (c = m.getStateById(d)), !c && b && !m.isTraditionalAnchor(a) && (c = m.createStateObject(null, null, e))), c
        }, m.getIdByUrl = function (a) {
            var c = m.urlToId[a] || m.store.urlToId[a] || b;
            return c
        }, m.getLastSavedState = function () {
            return m.savedStates[m.savedStates.length - 1] || b
        }, m.getLastStoredState = function () {
            return m.storedStates[m.storedStates.length - 1] || b
        }, m.hasUrlDuplicate = function (a) {
            var b = !1,
                c;
            return c = m.extractState(a.url), b = c && c.id !== a.id, b
        }, m.storeState = function (a) {
            return m.urlToId[a.url] = a.id, m.storedStates.push(m.cloneObject(a)), a
        }, m.isLastSavedState = function (a) {
            var b = !1,
                c, d, e;
            return m.savedStates.length && (c = a.id, d = m.getLastSavedState(), e = d.id, b = c === e), b
        }, m.saveState = function (a) {
            return m.isLastSavedState(a) ? !1 : (m.savedStates.push(m.cloneObject(a)), !0)
        }, m.getStateByIndex = function (a) {
            var b = null;
            return typeof a == "undefined" ? b = m.savedStates[m.savedStates.length - 1] : a < 0 ? b = m.savedStates[m.savedStates.length + a] : b = m.savedStates[a], b
        }, m.getHash = function () {
            var a = m.unescapeHash(d.location.hash);
            return a
        }, m.unescapeString = function (b) {
            var c = b,
                d;
            for (;;) {
                d = a.unescape(c);
                if (d === c) break;
                c = d
            }
            return c
        }, m.unescapeHash = function (a) {
            var b = m.normalizeHash(a);
            return b = m.unescapeString(b), b
        }, m.normalizeHash = function (a) {
            var b = a.replace(/[^#]*#/, "").replace(/#.*/, "");
            return b
        }, m.setHash = function (a, b) {
            var c, e, f;
            return b !== !1 && m.busy() ? (m.pushQueue({
                scope: m,
                callback: m.setHash,
                args: arguments,
                queue: b
            }), !1) : (c = m.escapeHash(a), m.busy(!0), e = m.extractState(a, !0), e && !m.emulated.pushState ? m.pushState(e.data, e.title, e.url, !1) : d.location.hash !== c && (m.bugs.setHash ? (f = m.getPageUrl(), m.pushState(null, null, f + "#" + c, !1)) : d.location.hash = c), m)
        }, m.escapeHash = function (b) {
            var c = m.normalizeHash(b);
            return c = a.escape(c), m.bugs.hashEscape || (c = c.replace(/\%21/g, "!").replace(/\%26/g, "&").replace(/\%3D/g, "=").replace(/\%3F/g, "?")), c
        }, m.getHashByUrl = function (a) {
            var b = String(a).replace(/([^#]*)#?([^#]*)#?(.*)/, "$2");
            return b = m.unescapeHash(b), b
        }, m.setTitle = function (a) {
            var b = a.title,
                c;
            b || (c = m.getStateByIndex(0), c && c.url === a.url && (b = c.title || m.options.initialTitle));
            try {
                d.getElementsByTagName("title")[0].innerHTML = b.replace("<", "&lt;").replace(">", "&gt;").replace(" & ", " &amp; ")
            } catch (e) {}
            return d.title = b, m
        }, m.queues = [], m.busy = function (a) {
            typeof a != "undefined" ? m.busy.flag = a : typeof m.busy.flag == "undefined" && (m.busy.flag = !1);
            if (!m.busy.flag) {
                h(m.busy.timeout);
                var b = function () {
                        var a, c, d;
                        if (m.busy.flag) return;
                        for (a = m.queues.length - 1; a >= 0; --a) {
                            c = m.queues[a];
                            if (c.length === 0) continue;
                            d = c.shift(), m.fireQueueItem(d), m.busy.timeout = g(b, m.options.busyDelay)
                        }
                    };
                m.busy.timeout = g(b, m.options.busyDelay)
            }
            return m.busy.flag
        }, m.busy.flag = !1, m.fireQueueItem = function (a) {
            return a.callback.apply(a.scope || m, a.args || [])
        }, m.pushQueue = function (a) {
            return m.queues[a.queue || 0] = m.queues[a.queue || 0] || [], m.queues[a.queue || 0].push(a), m
        }, m.queue = function (a, b) {
            return typeof a == "function" && (a = {
                callback: a
            }), typeof b != "undefined" && (a.queue = b), m.busy() ? m.pushQueue(a) : m.fireQueueItem(a), m
        }, m.clearQueue = function () {
            return m.busy.flag = !1, m.queues = [], m
        }, m.stateChanged = !1, m.doubleChecker = !1, m.doubleCheckComplete = function () {
            return m.stateChanged = !0, m.doubleCheckClear(), m
        }, m.doubleCheckClear = function () {
            return m.doubleChecker && (h(m.doubleChecker), m.doubleChecker = !1), m
        }, m.doubleCheck = function (a) {
            return m.stateChanged = !1, m.doubleCheckClear(), m.bugs.ieDoubleCheck && (m.doubleChecker = g(function () {
                return m.doubleCheckClear(), m.stateChanged || a(), !0
            }, m.options.doubleCheckInterval)), m
        }, m.safariStatePoll = function () {
            var b = m.extractState(d.location.href),
                c;
            if (!m.isLastSavedState(b)) c = b;
            else return;
            return c || (c = m.createStateObject()), m.Adapter.trigger(a, "popstate"), m
        }, m.back = function (a) {
            return a !== !1 && m.busy() ? (m.pushQueue({
                scope: m,
                callback: m.back,
                args: arguments,
                queue: a
            }), !1) : (m.busy(!0), m.doubleCheck(function () {
                m.back(!1)
            }), n.go(-1), !0)
        }, m.forward = function (a) {
            return a !== !1 && m.busy() ? (m.pushQueue({
                scope: m,
                callback: m.forward,
                args: arguments,
                queue: a
            }), !1) : (m.busy(!0), m.doubleCheck(function () {
                m.forward(!1)
            }), n.go(1), !0)
        }, m.go = function (a, b) {
            var c;
            if (a > 0) for (c = 1; c <= a; ++c) m.forward(b);
            else {
                if (!(a < 0)) throw new Error("History.go: History.go requires a positive or negative integer passed.");
                for (c = -1; c >= a; --c) m.back(b)
            }
            return m
        };
        if (m.emulated.pushState) {
            var o = function () {};
            m.pushState = m.pushState || o, m.replaceState = m.replaceState || o
        } else m.onPopState = function (b, c) {
            var e = !1,
                f = !1,
                g, h;
            return m.doubleCheckComplete(), g = m.getHash(), g ? (h = m.extractState(g || d.location.href, !0), h ? m.replaceState(h.data, h.title, h.url, !1) : (m.Adapter.trigger(a, "anchorchange"), m.busy(!1)), m.expectedStateId = !1, !1) : (e = m.Adapter.extractEventData("state", b, c) || !1, e ? f = m.getStateById(e) : m.expectedStateId ? f = m.getStateById(m.expectedStateId) : f = m.extractState(d.location.href), f || (f = m.createStateObject(null, null, d.location.href)), m.expectedStateId = !1, m.isLastSavedState(f) ? (m.busy(!1), !1) : (m.storeState(f), m.saveState(f), m.setTitle(f), m.Adapter.trigger(a, "statechange"), m.busy(!1), !0))
        }, m.Adapter.bind(a, "popstate", m.onPopState), m.pushState = function (b, c, d, e) {
            if (m.getHashByUrl(d) && m.emulated.pushState) throw new Error("History.js does not support states with fragement-identifiers (hashes/anchors).");
            if (e !== !1 && m.busy()) return m.pushQueue({
                scope: m,
                callback: m.pushState,
                args: arguments,
                queue: e
            }), !1;
            m.busy(!0);
            var f = m.createStateObject(b, c, d);
            return m.isLastSavedState(f) ? m.busy(!1) : (m.storeState(f), m.expectedStateId = f.id, n.pushState(f.id, f.title, f.url), m.Adapter.trigger(a, "popstate")), !0
        }, m.replaceState = function (b, c, d, e) {
            if (m.getHashByUrl(d) && m.emulated.pushState) throw new Error("History.js does not support states with fragement-identifiers (hashes/anchors).");
            if (e !== !1 && m.busy()) return m.pushQueue({
                scope: m,
                callback: m.replaceState,
                args: arguments,
                queue: e
            }), !1;
            m.busy(!0);
            var f = m.createStateObject(b, c, d);
            return m.isLastSavedState(f) ? m.busy(!1) : (m.storeState(f), m.expectedStateId = f.id, n.replaceState(f.id, f.title, f.url), m.Adapter.trigger(a, "popstate")), !0
        };
        if (f) {
            try {
                m.store = k.parse(f.getItem("History.store")) || {}
            } catch (p) {
                m.store = {}
            }
            m.normalizeStore()
        } else m.store = {}, m.normalizeStore();
        m.Adapter.bind(a, "beforeunload", m.clearAllIntervals), m.Adapter.bind(a, "unload", m.clearAllIntervals), m.saveState(m.storeState(m.extractState(d.location.href, !0))), f && (m.onUnload = function () {
            var a, b;
            try {
                a = k.parse(f.getItem("History.store")) || {}
            } catch (c) {
                a = {}
            }
            a.idToState = a.idToState || {}, a.urlToId = a.urlToId || {}, a.stateToId = a.stateToId || {};
            for (b in m.idToState) {
                if (!m.idToState.hasOwnProperty(b)) continue;
                a.idToState[b] = m.idToState[b]
            }
            for (b in m.urlToId) {
                if (!m.urlToId.hasOwnProperty(b)) continue;
                a.urlToId[b] = m.urlToId[b]
            }
            for (b in m.stateToId) {
                if (!m.stateToId.hasOwnProperty(b)) continue;
                a.stateToId[b] = m.stateToId[b]
            }
            m.store = a, m.normalizeStore(), f.setItem("History.store", k.stringify(a))
        }, m.intervalList.push(i(m.onUnload, m.options.storeInterval)), m.Adapter.bind(a, "beforeunload", m.onUnload), m.Adapter.bind(a, "unload", m.onUnload));
        if (!m.emulated.pushState) {
            m.bugs.safariPoll && m.intervalList.push(i(m.safariStatePoll, m.options.safariPollInterval));
            if (e.vendor === "Apple Computer, Inc." || (e.appCodeName || "") === "Mozilla") m.Adapter.bind(a, "hashchange", function () {
                m.Adapter.trigger(a, "popstate")
            }), m.getHash() && m.Adapter.onDomLoad(function () {
                m.Adapter.trigger(a, "hashchange")
            })
        }
    }, m.init()
}(window);
!
function (a, b) {
    "use strict";
    var c = a.History = a.History || {},
        d = a.jQuery;
    if (typeof c.Adapter != "undefined") throw new Error("History.js Adapter has already been loaded...");
    c.Adapter = {
        bind: function (a, b, c) {
            d(a).bind(b, c)
        },
        trigger: function (a, b, c) {
            d(a).trigger(b, c)
        },
        extractEventData: function (a, c, d) {
            var e = c && c.originalEvent && c.originalEvent[a] || d && d[a] || b;
            return e
        },
        onDomLoad: function (a) {
            d(a)
        }
    }, typeof c.init != "undefined" && c.init()
}(window);
!
function () {
    window.ignmobile = {
        ua: {
            isIos: function () {
                return /iP(hone|ad|od)/i.test(window.navigator.userAgent)
            },
            isIphoneIpod: function () {
                return /iP(hone|od)/i.test(window.navigator.userAgent)
            },
            isIpad: function () {
                return /iPad/i.test(window.navigator.userAgent)
            },
            isAndroid: function () {
                return /Android/i.test(window.navigator.userAgent)
            },
            isTv: function () {
                return /GoogleTV|Xbox|WiiU/i.test(window.navigator.userAgent)
            },
            isMobileRedirect: function () {
                return /iP(hone|od)|((Android).*(Mobile))|Nintendo 3DS/i.test(window.navigator.userAgent)
            },
            isHtml5Video: function () {
                return /(iP(hone|ad|od))|webOS|Android|Xbox|WiiU/i.test(window.navigator.userAgent)
            }
        },
        domains: {
            www: "m",
            uk: "m.uk",
            au: "m.au",
            ie: "m.ie",
            ca: "m.ca"
        },
        translateDomain: function (hostname) {
            var matches, translated;
            matches = hostname.match(/^((?:[a-z]+\.)*)([a-z]{2,3})\.ign\.com$/i);
            if (matches.length < 3) {
                return
            }
            if (!(translated = this.domains[matches[2]])) {
                return
            }
            return matches[1] + translated + ".ign.com"
        },
        redirect: function (path) {
            var mobileDomain;
            if (document.cookie.indexOf("mobile_redirect=") != -1) {
                return
            }
            if (!this.ua.isMobileRedirect()) {
                return
            }
            if (!(mobileDomain = this.translateDomain(window.location.hostname))) {
                return
            }
            window.location = window.location.protocol + "//" + mobileDomain + path
        }
    }
}();
SugarAds = {
    adDivCssClassName: "sugarad",
    adDivIdPrefix: "sugarad-",
    adIframeIdSuffix: "-iframe",
    analytics: false,
    fifurl: "/sugarfif.html?9",
    urlRandLength: 12,
    urlRandNum: 0,
    adsData: {},
    adCreatives: {},
    adJsUrls: {},
    adSlots: new Array,
    stitialOverlayId: "sugarad-stitial-overlay",
    stitialHtmlElementClass: "sugarad-stitial-open",
    stitialTimeout: 18e3,
    stitialAdType: false,
    outOfPageContent: "",
    gptReady: false,
    refreshAdSlots: new Array,
    adServer: "ignadwrapper",
    dfp: {
        getUrl: function (sugar, adsToFetch) {
            slot1 = "";
            slot2 = "";
            dfpAdUnit1 = "IGN";
            if (sugar.adsData.channel_id) {
                switch (sugar.adsData.channel_id) {
                case "58":
                    dfpAdUnit2 = "homepage";
                    break;
                case "568":
                    dfpAdUnit2 = "blogs";
                    break;
                case "472":
                    dfpAdUnit2 = "bluray";
                    break;
                case "541":
                    dfpAdUnit2 = "comics";
                    break;
                case "72":
                    dfpAdUnit2 = "dvd";
                    break;
                case "66":
                    dfpAdUnit2 = "movies";
                    break;
                case "241":
                    dfpAdUnit2 = "music";
                    break;
                case "566":
                    dfpAdUnit2 = "my_ign";
                    break;
                case "59":
                    dfpAdUnit2 = "pc";
                    break;
                case "515":
                    dfpAdUnit2 = "psp";
                    break;
                case "70":
                    dfpAdUnit2 = "ps2";
                    break;
                case "543":
                    dfpAdUnit2 = "ps3";
                    break;
                case "557":
                    dfpAdUnit2 = "stars";
                    break;
                case "550":
                    dfpAdUnit2 = "tv";
                    break;
                case "549":
                    dfpAdUnit2 = "videos";
                    break;
                case "547":
                    dfpAdUnit2 = "wii";
                    break;
                case "256":
                    dfpAdUnit2 = "wireless";
                    break;
                case "73":
                    dfpAdUnit2 = "xbox";
                    break;
                case "542":
                    dfpAdUnit2 = "xbox_360";
                    break;
                case "532":
                    dfpAdUnit2 = "ds";
                    break;
                case "573":
                    dfpAdUnit2 = "vita";
                    break;
                case "544":
                    dfpAdUnit2 = "xbox_live";
                    break;
                case "500":
                    dfpAdUnit1 = "GAMESPY";
                    dfpAdUnit2 = "Homepage";
                    break;
                case "508":
                    dfpAdUnit1 = "GAMESPY";
                    dfpAdUnit2 = "";
                    break;
                case "275":
                    dfpAdUnit1 = "GAMESTATS";
                    dfpAdUnit2 = "";
                    break;
                default:
                    dfpAdUnit2 = "";
                    break
                }
                if (sugar.adsData.network == "gamespy") {
                    dfpAdUnit1 = "GAMESPY";
                    dfpAdUnit2 = ""
                }
                channel_id = sugar.adsData.channel_id
            } else {
                dfpAdUnit1 = "IGN";
                if (sugar.adsData.resource) {
                    if (sugar.adsData.resource == "root" && sugar.adsData.pagetype == "channel") {
                        dfpAdUnit2 = "homepage"
                    } else if (sugar.adsData.pagetype == "m_index" || sugar.adsData.pagetype == "m_content") {
                        dfpAdUnit2 = "m_ign"
                    } else {
                        dfpAdUnit2 = sugar.adsData.resource;
                        dfpAdUnit2 = dfpAdUnit2.replace("-", "_")
                    }
                    channel_id = sugar.adsData.resource
                } else {
                    dfpAdUnit2 = sugar.adsData.route;
                    channel_id = sugar.adsData.route
                }
            }
            googletag.cmd.push(function () {
                googletag.pubads().enableAsyncRendering();
                var referrer = document.referrer;
                var locationPath = location.pathname;
                googletag.pubads().setTargeting("locationpath", locationPath);
                if (referrer != "") {
                    var r = "";
                    if (/(.+)\.alphabirdnetwork\.com/.test(document.referrer.split("/")[2])) {
                        r = "alphabirdnetwork.com"
                    } else if (/(.+)\.ign\.com/.test(document.referrer.split("/")[2])) {
                        r = "ign.com"
                    } else if (/(.+)\.gamespy\.com/.test(document.referrer.split("/")[2])) {
                        r = "gamespy.com"
                    } else {
                        r = escape(document.referrer)
                    }
                } else {
                    var r = "none"
                }
                googletag.pubads().setTargeting("r", r);
                var currentPageUrl = document.location;
                if (currentPageUrl.search.indexOf("special") != -1) {
                    var queryParams = currentPageUrl.search.substr(1).split("&");
                    for (var i = 0, len = queryParams.length; i < len; i++) {
                        if (queryParams[i].indexOf("special") != -1) {
                            url = queryParams[i].split("=")[1];
                            googletag.pubads().setTargeting("special", url)
                        } else {
                            url = queryParams[i].split("=")[1];
                            googletag.pubads().setTargeting("extras", url)
                        }
                    }
                }
                for (k in sugar.adsData) {
                    googletag.pubads().setTargeting(k, sugar.adsData[k].toString())
                }
                var rsi_segs = [];
                var segs_beg = document.cookie.indexOf("rsi_segs=");
                if (segs_beg >= 0) {
                    segs_beg = document.cookie.indexOf("=", segs_beg) + 1;
                    if (segs_beg > 0) {
                        var segs_end = document.cookie.indexOf(";", segs_beg);
                        if (segs_end == -1) segs_end = document.cookie.length;
                        rsi_segs = document.cookie.substring(segs_beg, segs_end).split("|")
                    }
                }
                var segLen = 20;
                var segQS = "";
                var segQS_array = new Array;
                if (rsi_segs.length < segLen) {
                    segLen = rsi_segs.length
                }
                for (var i = 0; i < segLen; i++) {
                    segQS_array.push(rsi_segs[i])
                }
                googletag.pubads().setTargeting("rsi_segs", segQS_array.join());
                if (dfpAdUnit2 != "") {
                    dfpAdUnits = "/5691/" + dfpAdUnit1 + "/" + dfpAdUnit2
                } else {
                    dfpAdUnits = "/5691/" + dfpAdUnit1
                }
                for (k in adsToFetch) {
                    switch (adsToFetch[k]) {
                    case "prestitial":
                        sugar.adSlots[adsToFetch[k]] = googletag.defineOutOfPageSlot(dfpAdUnits, "sugarad-1x1").addService(googletag.pubads());
                        break;
                    case "728x90":
                        sugar.adSlots[adsToFetch[k]] = googletag.defineSlot(dfpAdUnits, [
                            [728, 90]
                        ], "sugarad-728x90").addService(googletag.pubads()).setTargeting("pos", "top");
                        break;
                    case "300x250":
                    case "halfpage":
                        sugar.adSlots[adsToFetch[k]] = googletag.defineSlot(dfpAdUnits, [
                            [300, 250]
                        ], "sugarad-300x250").addService(googletag.pubads()).setTargeting("pos", "top");
                        break;
                    case "featured":
                    case "300x100":
                        sugar.adSlots[adsToFetch[k]] = googletag.defineSlot(dfpAdUnits, [
                            [300, 100]
                        ], "sugarad-300x100").addService(googletag.pubads());
                        break;
                    case "side300x250":
                        sugar.adSlots[adsToFetch[k]] = googletag.defineSlot(dfpAdUnits, [
                            [300, 250]
                        ], "sugarad-side300x250").addService(googletag.pubads()).setTargeting("pos", "bottom");
                        break;
                    case "s728x90":
                        sugar.adSlots[adsToFetch[k]] = googletag.defineSlot(dfpAdUnits, [
                            [728, 90]
                        ], "sugarad-s728x90").addService(googletag.pubads()).setTargeting("pos", "bottom");
                        break;
                    case "2x2":
                        sugar.adSlots[adsToFetch[k]] = googletag.defineSlot(dfpAdUnits, [
                            [2, 2]
                        ], "sugarad-2x2").addService(googletag.pubads()).setTargeting("pos", "bottom");
                        break;
                    case "3x3":
                        sugar.adSlots[adsToFetch[k]] = googletag.defineSlot(dfpAdUnits, [
                            [3, 3]
                        ], "sugarad-3x3").addService(googletag.pubads()).setTargeting("pos", "bottom");
                        break;
                    case "4x4":
                        sugar.adSlots[adsToFetch[k]] = googletag.defineSlot(dfpAdUnits, [
                            [4, 4]
                        ], "sugarad-4x4").addService(googletag.pubads()).setTargeting("pos", "bottom");
                        break;
                    case "320x50":
                        sugar.adSlots[adsToFetch[k]] = googletag.defineSlot(dfpAdUnits, [
                            [320, 50]
                        ], "sugarad-320x50").addService(googletag.pubads()).setTargeting("pos", "top");
                        break;
                    default:
                        break
                    }
                    if (adsToFetch[k] != "prestitial") {
                        sugar.refreshAdSlots.push(sugar.adSlots[adsToFetch[k]])
                    }
                }
                if (dfpAdUnit1 == "IGN" && sugar.adSlots["prestitial"] != undefined) {
                    googletag.pubads().disableInitialLoad()
                }
                googletag.enableServices();
                if (dfpAdUnit1 == "IGN" && sugar.adSlots["prestitial"] != undefined) {
                    var refresh1x1 = new Array;
                    refresh1x1.push(sugar.adSlots["prestitial"]);
                    !
                    function refresh1x1UponGptReady(i) {
                        setTimeout(function () {
                            googletag.pubads().refresh(refresh1x1);
                            if (sugar.gptReady) {
                                !
                                function refreshAdSlotsIfEmpty1x1(i) {
                                    setTimeout(function () {
                                        is1x1IframeEmpty = find1x1IframeIsEmpty();
                                        if (is1x1IframeEmpty && i == 1) {
                                            sugar.dfp._refreshRemainingAdSlots()
                                        }
                                        if (!is1x1IframeEmpty) {
                                            return
                                        }
                                        if (--i) refreshAdSlotsIfEmpty1x1(i)
                                    }, 100)
                                }(15);
                                return
                            }
                            if (--i) refresh1x1UponGptReady(i)
                        }, 100)
                    }(100)
                }
            })
        },
        jsonpCallback: function (sugar, adsToRender) {
            return function (json) {}
        },
        _refreshRemainingAdSlots: function () {
            googletag.pubads().refresh(SugarAds.refreshAdSlots)
        },
        _ajaxRefreshByPagetype: function () {
            jQuery(".ign-blogrollMainFilters a, .ign-blogrollFilters a, .inc-blogrollv2articles .ign-blogrollFiltersContainer a, a.imageGalleryThumbLink, #searchContent a.tablink, #productPlatforms a.filter-js, #video-blogroll a.filter-lnk").live("click", function () {
                var refreshAdSlots = new Array;
                switch (SugarAds.adsData.pagetype) {
                case "channel":
                case "section":
                    refreshAdSlots.push(SugarAds.adSlots["728x90"]);
                    refreshAdSlots.push(SugarAds.adSlots["300x250"]);
                    break;
                case "mediaimgviewer":
                    refreshAdSlots.push(SugarAds.adSlots["728x90"]);
                    refreshAdSlots.push(SugarAds.adSlots["300x250"]);
                    break;
                case "search_result_object":
                case "search_result_article":
                case "search_result_video":
                case "search_index":
                    refreshAdSlots.push(SugarAds.adSlots["728x90"]);
                    refreshAdSlots.push(SugarAds.adSlots["300x250"]);
                    break;
                case "channel_video":
                    refreshAdSlots.push(SugarAds.adSlots["728x90"]);
                    refreshAdSlots.push(SugarAds.adSlots["300x250"]);
                    break;
                default:
                    break
                }
                googletag.cmd.push(function () {
                    googletag.pubads().refresh(refreshAdSlots);
                    document.body.style.background = "";
                    document.body.style.backgroundColor = "#F4F4F4";
                    jQuery("#sugarad-728x90").removeAttr("style");
                    jQuery("#sugarad-728x90 iframe:eq(0)").attr("style", "border: 0px")
                })
            })
        }
    },
    adServers: {
        ignadwrapper: {
            getUrl: function (sugar, adsToFetch) {
                var data = sugar.adsData;
                var url = "http://wrapper.ign.com/services/ads/pagetype/" + data.pagetype + "/sizes/" + adsToFetch.toString() + ".js?callback=?";
                var currentPageUrl = document.location;
                if (currentPageUrl.search.indexOf("special") != -1) {
                    var queryParams = currentPageUrl.search.substr(1).split("&");
                    for (var i = 0, len = queryParams.length; i < len; i++) {
                        if (queryParams[i].indexOf("special") != -1) {
                            url += "&" + queryParams[i]
                        }
                    }
                }
                if (currentPageUrl != "") {
                    url += "&url=" + encodeURIComponent(currentPageUrl)
                }
                for (var param in data) {
                    if (param == "pagetype") {
                        continue
                    }
                    var val = data[param];
                    if (sugar._isArray(val)) {
                        for (var i = 0, len = val.length; i < len; i++) {
                            url += "&" + param + "=" + encodeURIComponent(val[i])
                        }
                    } else {
                        url += "&" + param + "=" + encodeURIComponent(val)
                    }
                }
                var referrer = document.referrer;
                if (referrer != "") {
                    url += "&r=" + encodeURIComponent(referrer)
                }
                return url
            },
            jsonpCallback: function (sugar, adsToRender) {
                return function (json) {
                    var stitialSize = "prestitial";
                    for (var i = 0, len = json.length; i < len; i++) {
                        if (json[i].size.substr(-7) == "stitial") {
                            var realStitialRe = /^\s*$/;
                            if (json[i].impressionTracker == false && realStitialRe.test(json[i].creative) !== true) {
                                sugar.stitialAdType = stitialSize;
                                sugar.adCreatives[stitialSize] = json[i].creative
                            } else {
                                sugar.adCreatives[stitialSize] = ""
                            }
                        } else {
                            sugar.adCreatives[json[i].size] = json[i].creative
                        }
                    }
                    sugar._fetchAdsCallback(adsToRender)
                }
            }
        },
        freewheel: {
            getUrl: function (sugar, adsToFetch) {
                var data = sugar.adsData;
                var url = "http://1ee2c.v.fwmrm.net//ad//g//1?flag=ptil&nw=126511&pvrn=" + Math.floor(Math.random() * 1e5);
                url += "&csid=m_ign.com&resp=json&cbfn=?;;ptgt=s&envp=g_js&slau=320x50_Mobile_Display|300x50_Mobile_Display&cd=320,50|300,50slot&w=320&h=50";
                for (var param in data) {
                    var val = data[param];
                    if (sugar._isArray(val)) {
                        for (var i = 0, len = val.length; i < len; i++) {
                            url += "&" + param + "=" + encodeURIComponent(val[i])
                        }
                    } else {
                        url += "&" + param + "=" + encodeURIComponent(val)
                    }
                }
                return url
            },
            jsonpCallback: function (sugar, adsToRender) {
                return function (json) {
                    if (json["ads"]["ads"][0]["creatives"][0]["creativeRenditions"][0]["asset"]["content"]) {
                        var trackerCode = "";
                        var eventCallbacks = json["siteSection"]["adSlots"][0]["selectedAds"][0]["eventCallbacks"];
                        if (eventCallbacks) {
                            for (var i = 0, j = eventCallbacks.length; i < j; i++) {
                                if (eventCallbacks[i]["name"] == "defaultImpression") {
                                    trackerCode = 'var i = new Image();i.src = "' + eventCallbacks[i]["url"] + '";';
                                    break
                                }
                            }
                        }
                        sugar.adCreatives[adsToRender[0]] = '<script type="text/javascript">' + json["ads"]["ads"][0]["creatives"][0]["creativeRenditions"][0]["asset"]["content"] + trackerCode + "</script>"
                    }
                    sugar._fetchAdsCallback(adsToRender)
                }
            }
        }
    },
    renderAds: function (adsToRender) {
        if (typeof adsToRender == "string") {
            adsToRender = new Array(adsToRender)
        }
        if (this.adServer != false) {
            this._renderAdCreatives(adsToRender)
        } else {
            this._renderAdJsUrls(adsToRender)
        }
    },
    showStitial: function () {
        var htmlElement = document.getElementsByTagName("html")[0];
        var stitialOverlayElement = document.getElementById(this.stitialOverlayId);
        htmlElement.className = this.stitialHtmlElementClass;
        stitialOverlayElement.style.display = "block";
        this.stitialSetTimeout = setTimeout(function (sugar) {
            return function () {
                sugar.hideStitial()
            }
        }(this), this.stitialTimeout)
    },
    hideStitial: function () {
        clearTimeout(this.stitialSetTimeout);
        var htmlElement = document.getElementsByTagName("html")[0];
        var stitialOverlayElement = document.getElementById(this.stitialOverlayId);
        htmlElement.className = "";
        stitialOverlayElement.style.display = "none";
        this.renderAdsDelayedByStitial()
    },
    renderAdsDelayedByStitial: function () {},
    setFifDim: function (frameElement, w, h) {
        if (typeof w == "number" && typeof h == "number") {
            frameElement.style.cssText += ";width:" + w + "px;height:" + h + "px;";
            frameElement.parentNode.style.cssText = ";width:" + w + "px;height:auto;" + (w == 0 && h == 0 ? "display:none;" : "")
        }
    },
    fifOnload: function (frameWindow) {
        var timerStop = (new Date).getTime();
        if (this.analytics) {
            _gaq.push(["_trackEvent", "Sugar Ads", frameWindow.frameElement.adtype, frameWindow.frameElement.adjsurl, timerStop - frameWindow.sugarTimerStart])
        }
    },
    _flushAndPlaceAds: function (adTypes) {
        for (var i = 0, len = adTypes.length; i < len; i++) {
            var adType = adTypes[i];
            if (this.adServer == false && !(adType in this.adJsUrls)) {
                this._warn('Failed to render sugar ad. No ad js url has been defined for ad type "' + adType + '".');
                continue
            }
            if (this.adServer != false && !(adType in this.adCreatives)) {
                this._warn('Failed to render sugar ad. No ad creative has been defined for ad type "' + adType + '".');
                continue
            }
            this._createAndAppendFriendlyIframe(adType)
        }
    },
    _createAndAppendFriendlyIframe: function (adType) {
        var adDivDomId = this.adDivIdPrefix + adType;
        var adContainer = document.getElementById(adDivDomId);
        if (typeof adContainer == "undefined" || adContainer == null) {
            this._warn('Failed to render sugar ad. No dom element with id "' + adDivDomId + '" exists.');
            return false
        }
        var adContainerIframe = document.getElementById(adDivDomId + this.adIframeIdSuffix);
        if (typeof adContainerIframe != "undefined" && adContainerIframe != null) {
            adContainer.style.height = adContainerIframe.offsetHeight + "px"
        }
        adContainer.innerHTML = "";
        if (this.adServer != false && this.adCreatives[adType] == "") {
            delete this.adCreatives[adType];
            return
        }
        var adIframeId = adDivDomId + this.adIframeIdSuffix;
        var iframe = document.createElement("iframe");
        iframe.id = adIframeId;
        iframe.name = adIframeId;
        iframe.src = this.fifurl;
        iframe.style.border = "none";
        iframe.style.width = adContainer.offsetWidth + "px";
        iframe.style.height = adContainer.offsetHeight + "px";
        iframe.scrolling = "no";
        iframe.seamless = "seamless";
        iframe.adtype = adType;
        if (this.adServer != false) {
            iframe.adcreative = this.adCreatives[adType];
            delete this.adCreatives[adType]
        } else {
            iframe.adjsurl = this.adJsUrls[adType]
        }
        if (navigator.userAgent.indexOf("MSIE") != -1) {
            iframe.frameBorder = "0";
            iframe.allowTransparency = "true"
        }
        adContainer.appendChild(iframe)
    },
    _renderAdCreatives: function (adsToRender) {
        var adsToFetch = [];
        for (var i = 0, len = adsToRender.length; i < len; i++) {
            if (!(adsToRender[i] in this.adCreatives)) {
                adsToFetch.push(adsToRender[i])
            }
        }
        if (this.adServer == "freewheel") {
            if (adsToFetch.length > 0) {
                this._jsonp(this.adServers[this.adServer].getUrl(this, adsToFetch), this.adServers[this.adServer].jsonpCallback(this, adsToRender))
            } else {
                this._fetchAdsCallback(adsToRender)
            }
        } else {
            if (typeof this.adsData.channel_id == "undefined" && typeof this.adsData.route == "undefined" && typeof this.adsData.resource == "undefined") {
                this.adsData.resource = "legacy"
            }
            this.dfp.getUrl(this, adsToFetch)
        }
    },
    _renderAdJsUrls: function (adsToRender) {
        this._randomizeAdJsUrls();
        this._flushAndPlaceAds(adsToRender)
    },
    _fetchAdsCallback: function (adsToRender) {
        if (this.stitialAdType != false) {
            var delayedAdsToRender = [];
            for (var i = 0, len = adsToRender.length; i < len; i++) {
                var adToRender = adsToRender[i];
                if (adToRender != this.stitialAdType) {
                    delayedAdsToRender.push(adToRender)
                }
            }
            this.renderAdsDelayedByStitial = function (sugar) {
                return function () {
                    sugar._flushAndPlaceAds(delayedAdsToRender)
                }
            }(this);
            this._flushAndPlaceAds([this.stitialAdType]);
            this.stitialAdType = false;
            this.showStitial()
        } else {
            this._flushAndPlaceAds(adsToRender)
        }
    },
    _randomizeAdJsUrls: function () {
        if (this.urlRandNum == 0) {
            this.urlRandNum = Math.floor(Math.random() * Math.pow(10, this.urlRandLength))
        } else {
            this.urlRandNum++
        }
        var randQsKey = "sugar-rand";
        var newQsKeyValue = randQsKey + "=" + this.urlRandNum;
        var searchRegexp = new RegExp(randQsKey + "=\\d{" + this.urlRandLength + "}", "g");
        for (adType in this.adJsUrls) {
            var adJsUrl = this.adJsUrls[adType];
            var randQsKeyValue = adJsUrl.match(searchRegexp);
            if (randQsKeyValue != null) {
                this.adJsUrls[adType] = adJsUrl.replace(randQsKeyValue[0], newQsKeyValue)
            } else {
                var questionPos = adJsUrl.search(/\?/);
                if (questionPos != -1) {
                    this.adJsUrls[adType] = adJsUrl.replace("?", "?" + newQsKeyValue + "&")
                } else {
                    this.adJsUrls[adType] = adJsUrl.replace(/&*$/, "&" + newQsKeyValue)
                }
            }
        }
    },
    _jsonp: function (url, callback) {
        if (url.indexOf("=?") == -1) {
            this._warn("The sugar jsonp url must specify the callback function in the query string i.e. callback=?");
            return
        }
        if (typeof callback != "function") {
            this._warn("The sugar jsonp callback must be a function");
            return
        }
        var randFunctionName = "jsonp" + Math.floor(Math.random() * 1e10);
        window[randFunctionName] = function (json) {
            callback(json);
            try {
                delete window[randFunctionName]
            } catch (e) {
                window[randFunctionName] = undefined
            }
        };
        var jsonp = document.createElement("script");
        jsonp.src = url.split("=?").join("=" + randFunctionName);
        document.getElementsByTagName("head")[0].appendChild(jsonp)
    },
    _isArray: function (o) {
        return Object.prototype.toString.call(o) === "[object Array]"
    },
    _warn: function (msg) {
        if (window.console && console.warn) {
            console.warn(msg)
        }
    }
};

function find1x1IframeIsEmpty() {
    outOfPageContent = jQuery("#sugarad-1x1 iframe:eq(0)").contents().find("body:first").html();
    if (outOfPageContent == null || outOfPageContent == "") {
        return true
    }
    return false
}!
function () {}();
var IGNVideoPlayer = {
    currentState: "notLoaded",
    hooks: {},
    playerType: "flash",
    setState: function (state) {
        this.currentState = state;
        if (this.hooks[state]) {
            for (var i = this.hooks[state].length - 1; i >= 0; i--) {
                this.hooks[state][i].call()
            }
        }
    },
    on: function (state, cb) {
        if (this.hooks[state]) {
            this.hooks[state].push(cb)
        } else {
            this.hooks[state] = [cb]
        }
    }
};
window.onPlayerWorkflowStateChange = function (state) {
    IGNVideoPlayer.setState(state)
};
!
function () {
    var disqusLoaded = false;
    var disqus = function () {
            if (disqusLoaded || typeof window.disqusShortname === "undefined") {
                return
            }
            disqusLoaded = true;
            clearTimeout(disqusTimer);
            var dsq = document.createElement("script");
            dsq.type = "text/javascript";
            dsq.async = true;
            dsq.src = "http://" + window.disqusShortname + ".disqus.com/embed.js";
            (document.getElementsByTagName("head")[0] || document.getElementsByTagName("body")[0]).appendChild(dsq)
        };
    window.IGNVideoPlayer.on("PlayerState_PreRoll", disqus);
    var disqusTimer = setTimeout(disqus, 3e3)
}();
!
function ($) {
    window.IGN = window.IGN || {};
    var IGN = window.IGN,
        moment = window.moment,
        ageGatedContent = [],
        minYear = 1900,
        restrictedHtml = '<div class="age-gate">' + '<div id="age-gate-form" class="age-gate-form">' + '<div class="age-gate-title">WHOOPS</div>' + '<div class="age-gate-subtitle">You are not old enough to access this content.</div>' + "</div>" + "</div>",
        formHtml = '<div class="age-gate">' + '<div id="age-gate-form" class="age-gate-form">' + '<div class="age-gate-title">AGE-RESTRICTED</div>' + '<div class="age-gate-subtitle">What is your birthdate?</div>' + '<div class="age-gate-input">' + '<form name="agForm">' + '<input type="text" name="month" maxlength="2" size="2" placeholder="MM" class="string input-month">/' + '<input type="text" name="day" maxlength="2" size="2" placeholder="DD" class="string input-day">/' + '<input type="text" name="year" maxlength="4" size="4" placeholder="YEAR" class="string input-year">' + '<button type="button">DONE</button>' + "</form>" + "</div>" + '<span class="age-gate-footer">MONTH / DAY / YEAR</span>' + "</div>" + "</div>";
    IGN.ageGate = {
        check: function (container, ageGate, callback) {
            var $container = $(container),
                age;
            if (!callback) {
                var content = $container.html();
                callback = function () {
                    $container.html(content)
                }
            }
            ageGatedContent.push({
                container: $container,
                callback: callback,
                ageGate: ageGate
            });
            age = parseInt(getCookie("user-age"), 10);
            if (age) {
                checkAccess(age)
            } else {
                $container.html(formHtml);
                var $agForm = $container.find('form[name="agForm"]');
                var submitForm = function (e) {
                        var month = parseInt($agForm.children('input[name="month"]').val(), 10),
                            year = parseInt($agForm.children('input[name="year"]').val(), 10),
                            day = parseInt($agForm.children('input[name="day"]').val(), 10);
                        e.preventDefault();
                        if (isNaN(year) || isNaN(month) || isNaN(day)) {
                            return
                        }
                        if (year < minYear || !moment([year, month - 1, day]).isValid()) {
                            $container.find(".age-gate-subtitle").text("Please enter a valid date.");
                            return
                        }
                        age = getAge(year, month, day);
                        setCookie("user-age", age, 2);
                        checkAccess(age)
                    };
                $agForm.children("button").click(submitForm);
                $agForm.children('input[name="year"]').keypress(function (e) {
                    if (e.which == 13) {
                        submitForm(e)
                    }
                })
            }
        }
    };
    var checkAccess = function (age) {
            for (var i = 0, len = ageGatedContent.length; i < len; i++) {
                if (age >= ageGatedContent[i].ageGate) {
                    ageGatedContent[i].callback.call()
                } else {
                    ageGatedContent[i].container.html(restrictedHtml)
                }
            }
            ageGatedContent = []
        };
    var getAge = function (year, month, day) {
            var today = moment(),
                birthDate = moment([year, month - 1, day]);
            return Math.floor(today.diff(birthDate, "years", true))
        };
    var getCookie = function (key) {
            var cookies = document.cookie.split(";");
            for (var i = cookies.length - 1; i >= 0; i--) {
                var arr = cookies[i].split("=");
                if (arr[0].indexOf(key) != -1) {
                    return arr[1]
                }
            }
        };
    var setCookie = function (key, value, hours) {
            var exDate = new Date;
            exDate.setHours(exDate.getHours() + hours);
            document.cookie = key + "=" + value + "; expires=" + exDate.toUTCString() + "; path=/"
        }
}(jQuery);
!
function ($) {
    var attachLoadMoreEvent = function () {
            $(".load-more-articles").click(function (e) {
                var url = $(this).attr("href"),
                    page = $(this).data("page"),
                    self = $(this);
                $(this).html("Loading...").addClass("loading");
                $.ajax({
                    type: "GET",
                    url: url,
                    data: {
                        page: page
                    },
                    success: function (response) {
                        self.replaceWith(response);
                        attachLoadMoreEvent();
                        if (window.History.enabled) {
                            window.History.pushState(null, null, window.location.href.split("?")[0] + "?page=" + page)
                        }
                    }
                });
                e.preventDefault();
                e.stopPropagation()
            })
        };
    $(document).ready(function () {
        attachLoadMoreEvent()
    })
}(jQuery);
!
function ($) {
    var delay = 2e3,
        customVars = {};
    $(document).ready(function () {
        try {
            var customVarsString = "custom_vars";
            if (window.igndrones._data.ga[customVarsString]) {
                var customVarsArr = window.igndrones._data.ga[customVarsString];
                for (var i = customVarsArr.length - 1; i >= 0; i--) {
                    customVars[customVarsArr[i][1]] = customVarsArr[i][2]
                }
            }
        } catch (e) {}
        var createRecircModules = function () {
                $(".create-recirc-module").each(function () {
                    var $this = $(this),
                        query = $this.data("query"),
                        url = location.origin + "/ajax/recirc",
                        data = {
                            title: $this.data("title"),
                            type: $this.data("type"),
                            count: $this.data("count"),
                            columnCount: $this.data("columncount"),
                            divId: $this.attr("id")
                        };
                    if (query !== "") {
                        url += "?" + query
                    }
                    if (customVars && customVars["object-id"]) {
                        data.objectId = customVars["object-id"]
                    }
                    $.ajax({
                        type: "GET",
                        url: url,
                        data: data,
                        success: function (response) {
                            $this.replaceWith(response)
                        }
                    })
                })
            };
        setTimeout(createRecircModules, delay)
    })
}(jQuery);