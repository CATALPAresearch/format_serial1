/**
 * DashboardCompletion
 *
 * @module     format/ladtopics
 * @class      DashboardCompletion
 * @copyright  2020 Niels Seidel <niels.seidel@fernuni-hagen.de>
 * @description xxx
 * @license    MIT
 * @since      3.1
 * 
 * @todo
 * - display repetition of activities
 * - provide additional information for each activity using a popover or tooltip
 * - fix empty section names
 */

define([
    'jquery',
    M.cfg.wwwroot + "/course/format/ladtopics/lib/build/vue.min.js"
], function ($, Vue) {
    
    return Vue.component('dashboard-completion',
        {
            props: ['course'],

            data: function () {
                return {
                    strategyCategories: [
                        { id: 'cognitive', name: 'Kognitive Lernstrategien' },
                        { id: 'metacognitive', name: 'Metakognitive Lernstrategien' },
                        { id: 'resource', name: 'Ressourcenbezogene Lernstrategien' },
                        { id: 'misc', name: 'Sonstige' }
                    ],
                    pedagogicStrategies: [
                        { id: 'overview', name: 'Überblick', desc: 'Ein Beschreibung zum Überblick' },
                        { id: 'performance', name: 'Lernen', desc: 'Ein Beschreibung zur Lernphase' },
                        { id: 'exams', name: 'Pürfungsvorbreitung', desc: 'Ein Beschreibung zur Prüfungsvorbereitung' }
                    ],
                    strategies: [
                        { id: 'reading', pcategory:'overview', name: 'Überblick durch Lesen/Querlesen', desc: '<div>Durch schnelles Querlesen verschaffen Sie sich einen Überblick über das Themengebiet. Schauen Sie sich doch auch einmal die PQ4R-Methode an. <a href="https://www.example.com/">Details</a></div>', url: "", category: 'organization' },
                        { id: 'mindmap', pcategory: 'overview', name: 'Erzeuge Mindmap', desc: 'Eine Mindmap hilft dabei, Zusammenhänge darzustellen.', url: "", category: 'organization' },
                        { id: 'exzerpte', pcategory: 'overview', name: 'Fertige Exzerpt an', desc: 'Ein Exzerpt ist mehr als nur eine einfache Zusammenfassung der wichtigsten Inhalte.', url: "", category: 'organization' },
                        { id: 'gliederung', pcategory: 'performance', name: 'Erstelle Gliederung', desc: 'Themenfelder lassen sich mit einer Gliederung übersichtlich strukturieren.', url: "", category: 'organization' },
                        { id: 'strukturierung', pcategory: 'performance', name: 'Strukturiere Wissen', desc: 'Fachausdrücke oder Definitionen lassen sich gut in Listen oder Tabellen sammeln.', url: "", category: 'organization' },
                        { id: 'makeflashcards', pcategory: 'overview', name: 'Lernkarten erstellen', desc: 'Lernkarten kann man sehr früh digital z.B. in einer App oder auf Papier erstellen. Das erleichtert die Prüfungsvorbereitung.', url: "", category: 'organization' },


                        { id: 'transfer', pcategory: 'overview', name: 'Wende neues Wissen an', desc: 'Neues Wissen kann durch die Verknüpfung mit dem eigenen Erleben leichter veranschaulicht und gelernt werden.', url: "", category: 'elaboration' },
                        { id: 'examples', pcategory: 'overview', name: 'Übertrage Ansätze auf Berufliches', desc: 'Ein Beispiel aus dem eigenen Umfeld hilft dabei, neue Wissensschemata schneller zu lernen.', url: "", category: 'elaboration' },
                        { id: 'critical', pcategory: 'overview', name: 'Hinterfrage Inhalte kritisch', desc: 'Durch kritisches Hinterfragen kann man seine Aufmerksamkeit beim Lesen steigern.', url: "", category: 'elaboration' },
                        { id: 'structuring', pcategory: 'overview', name: 'Stelle Bezug zu anderen Fächern her', desc: 'Bekanntes Wissen und Bezüge zu anderen Kursen erleichtern das Verständnis von Zusammenhängen.', url: "", category: 'elaboration' },
                        { id: 'pq4r', pcategory: 'overview', name: 'Wende PQ4R - Methode an', desc: 'Hinter dem Kürzel verstecken sich sechs Schritte: (1) Preview – Übersicht gewinnen; (2) Questions – Fragen an den Text stellen;  (3) Read – Zweiter Leseschritt - Gründliches Lesen des Textes; (4) Reflect – Gedankliche Auseinandersetzung mit dem Text; (5) Recite – Wiederholen und aus dem Gedächtnis Verfassen; (6) Review – Rückblick und Überprüfung', url: "", category: 'elaboration' },


                        { id: 'flashcards', pcategory: 'exams', name: 'Auswendiglernen mit Lernkarten', desc: 'Mit Lernkarten kann man Dinge systematisch wiederholen bis alles für die Prüfung sitzt. ', url: "", category: 'repeatition' },
                        { id: 'repeatition', pcategory: 'exams', name: 'Repetieren', desc: 'Mit vielen Wiederholungen festigt sich das Wissen. ', url: "", category: 'repeatition' },
                        { id: 'assoc', pcategory: 'overview', name: 'Eselsbrücken', desc: 'Mit einem Reim oder einer Eselsbrücke kann man sich Begriffe oder Reihenfolgen leichter merken.', url: "", category: 'repeatition' },
                        { id: 'loci', pcategory: 'overview', name: 'Loci Methode', desc: 'Bei der Loci Methode verknüpft man Lerninhalte mit Orten oder Gegenständen. Für Abfolgen übt man eine Strecke/einen Spaziergang ein.', url: "", category: 'repeatition' }

                    ],
                    info: '',

                };
            },

            mounted: function () {},

            created: function (){
                $(function () {
                    $('#strategyTab li:first-child a').tab('show');
                });
            },

            methods: {
                strategiesByPedagogicCategory: function (cat) {
                    return this.strategies.filter(function (s) {
                        return s.pcategory === cat ? true : false;
                    });
                },
                strategyById: function (id) {
                    return JSON.parse(JSON.stringify(this.strategies.filter(function (s) {
                        return s.id === id ? true : false;
                    })[0]));
                },
            },

            template: `
            <div>
                <h4>Lernstrategien</h4>
                <div class="row">
                    <div class="col-3">
                        <div class="nav flex-column nav-pills" role="tablist" aria-orientation="vertical">
                            <a class="nav-link" v-for="pc in pedagogicStrategies" data-toggle="pill" :href="'#'+pc.id" role="tab" aria-selected="false">{{pc.name}}</a></li>
                        </div>
                    </div>
                    <div id="strategyTab" class="tab-content col-9" style="display:block;">
                        <div v-for="pc in pedagogicStrategies" :id="pc.id" class="tab-pane fade"  role="tabpanel" aria-labelledby="v-pills-home-tab">
                            <div class="row">
                                <div class="col-6">{{pc.desc}}</div>
                                <div class="col-6">
                                    <div v-for="s in strategiesByPedagogicCategory(pc.id)">
                                        {{s.name}}
                                        <button type="button" class="btn btn-sm btn-link" data-toggle="popover" :data-content="s.desc">
                                            <i class="fa fa-question"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="clearfix"></div>
                </div>
             </div>
            ` 
        });
});