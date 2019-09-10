/**
 * Javascript utils for the Moodle videodatabase
 *
 * @module     mod_videodatabase/videodatabase
 * @package    mod_videodatabase
 * @class      Utils
 * @copyright  2018 Niels Seidel, info@social-machinables.com
 * @license    MIT
 * @since      3.1
 */
define(['jquery', 'core/ajax'], function ($, ajax) {

    const Utils = function (dc, d3) {
        this.d3 = d3;
        this.dc = dc;

        /**
         * Obtains data from a moodle webservice
         * @param {*} ws: Name of the web service 
         * @param {*} params: Parameter to transfer 
         * @param {*} cb: Callback function 
         */
        this.get_ws = function (ws, params, cb, external) {
            external = external === undefined ? false : external;
            ajax.call([{
                methodname: external ? ws : 'format_ladtopics_' + ws,
                args: params,
                done: function (msg) {
                    if (msg.hasOwnProperty('exception')) {
                        $('#alert')
                            .html('Die Prozedur ' + ws + ' konnte nicht als Webservice geladen werden.<br>')
                            .append(JSON.stringify(msg));
                    } else {
                        cb(msg);
                    }
                },
                fail: function (e) {
                    console.log(params, ws);
                    console.error(e);
                }
            }]);
        };

        this.germanFormatters = d3.timeFormatDefaultLocale({
            "decimal": ",",
            "thousands": ".",
            "grouping": [3],
            "currency": ["€", ""],
            "dateTime": "%a %b %e %X %Y",
            "date": "%d.%m.%Y",
            "time": "%H:%M:%S",
            "periods": ["AM", "PM"],
            "days": ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"],
            "shortDays": ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"],
            "months": ["Jänner", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"],
            "shortMonths": ["Jän", "Feb", "Mär", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"]
        });

        this.customTimeFormat = function (date) {//this.germanFormatters.timeFormat.multi([
            if (date.getMinutes()) return d3.timeFormat("%I:%M")(date);
            if (date.getMilliseconds()) return d3.timeFormat(".%L")(date);
            if (date.getSeconds()) return d3.timeFormat(":%S")(date);
            if (date.getHours()) return d3.timeFormat("%Hh")(date);
            if (date.getDay()) return d3.timeFormat("%a %e.%m.")(date); // Mo 8.02.
            if (date.getMonth()) return d3.timeFormat("%B")(date); //7.12. 
            return d3.getDate("%Y");

            /*   , function (d) { return d.; }],
                [ function (d) { return d.getDay() && d.getDate() !== 1; }], 
                ["%e.%m.", function (d) { return d.getDate() != 1; }], // 
                [, function (d) { return d.; }],
                [, function () { return true; }]
                */
        };

        this.numberToWord = function (num, postfix) {
            postfix = postfix === undefined ? '' : postfix;
            switch (num) {
                case 0: return 'kein' + postfix;
                case 1: return 'ein' + postfix;
                case 2: return 'zwei' + postfix;
                case 3: return 'drei' + postfix;
                case 4: return 'vier' + postfix;
                case 5: return 'fünf' + postfix;
                case 6: return 'sechs' + postfix;
                case 7: return 'sieben' + postfix;
                case 8: return 'acht' + postfix;
                case 9: return 'neun' + postfix;
                case 10: return 'zehn' + postfix;
                case 11: return 'elf' + postfix;
                default: return num + ' ' + postfix;
            }
        };

        const locale = d3.timeFormatLocale({
            "decimal": ",",
            "thousands": ".",
            "grouping": [3],
            "currency": ["€", ""],
            "dateTime": "%a %b %e %X %Y",
            "date": "%d.%m.%Y",
            "time": "%H:%M:%S",
            "periods": ["AM", "PM"],
            "days": ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"],
            "shortDays": ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"],
            "months": ["Jänner", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"],
            "shortMonths": ["Jän", "Feb", "Mär", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"]
        });

        this.formatMillisecond = locale.format(".%L");
        this.formatSecond = locale.format(":%S");
        this.formatMinute = locale.format("%I:%M");
        this.formatHour = locale.format("%H:%M");
        this.formatDay = locale.format("%a %e.%m.");
        this.formatDate = locale.format("%d.%m.%Y");
        this.formatDate2 = locale.format("%d/%m/%Y");
        this.formatWeek = locale.format("%b %d");
        this.formatWeekNum = locale.format("%U");
        this.formatMonth = locale.format("%B");
        this.formatYear = locale.format("%Y");


        this.multiFormat = function (date) {
            return (d3.timeSecond(date) < date ? this.formatMillisecond
                : d3.timeMinute(date) < date ? this.formatSecond
                    : d3.timeHour(date) < date ? this.formatMinute
                        : d3.timeDay(date) < date ? this.formatHour
                            : d3.timeMonth(date) < date ? (d3.timeWeek(date) < date ? this.formatDay : this.formatWeek)
                                : d3.timeYear(date) < date ? this.formatMonth
                                    : this.formatYear)(date);
        };

        /**
         * DC.js util to create filter charts. 
         * @param obj (Object) chartType, selector, indepVar, depVar, colors, margins
         * @param ndx 
         */
        this.addFilterChart = function (obj, ndx) {
            const filterSingleColors = this.d3.scale.ordinal().domain([0]).range(['#e6550d']);
            const filterChartHeight = 130;
            var
                dimension = ndx.dimension(function (d) { return d[obj.indepVar]; }),
                group = dimension.group().reduceSum(function (d) { return +d[obj.depVar]; }),
                margins = obj.margins === undefined ? { top: 0, right: 5, bottom: 20, left: 2 } : obj.margins,
                colors = obj.colors === undefined ? filterSingleColors : obj.colors,
                chart = undefined
                ;
            console.log('group', group)
            console.log('dim', dimension.group())
            switch (obj.chartType) {
                case 'rowChart':
                    chart = dc.rowChart(obj.selector);
                    chart.xAxis().ticks(4);
                    chart.margins(margins)
                        .height(filterChartHeight);
                    break;
                case 'pieChart':
                    chart = dc.pieChart(obj.selector);
                    chart.innerRadius(20)
                        .height(filterChartHeight - 30); // xxx, need to be abstracted
                    break;
            }
            chart
                .dimension(dimension)
                .group(group)
                .colors(colors)
                .title(function (p) {
                    return obj.indepVar.charAt(0).toUpperCase() + obj.indepVar.slice(1, obj.indepVar.length) + ': ' + p.key + '\n' + 'Value: ' + p.value;
                })
                .label(function (d) { //if(obj.indepVar === 'g'){alert(d.key)}
                    return obj.keys[d.key] || d.key;
                })
                ;
            this.register(chart);
        };



        this.charts = [];

        this.register = function (chart) {
            this.charts.push(chart);
        };

        this.resetCharts = function () {
            for (var i = 0; i < this.charts.length; i++) {
                console.log(this.charts[i])
                this.charts[i].filterAll();
            }
            dc.redrawAll();
        };


    };

    return Utils;
});