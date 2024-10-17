var app = angular.module("app", [],function($interpolateProvider,$locationProvider,$provide){
    $interpolateProvider.startSymbol('<%');
    $interpolateProvider.endSymbol('%>');
    $locationProvider.html5Mode(true);
    var PLURAL_CATEGORY = {ZERO: "zero", ONE: "one", TWO: "two", FEW: "few", MANY: "many", OTHER: "other"};
    $provide.value("$locale", {
        "DATETIME_FORMATS": {
        "AMPMS": [
        "AM",
        "PM"
        ],
        "DAY": [
        "Minggu",
        "Senin",
        "Selasa",
        "Rabu",
        "Kamis",
        "Jumat",
        "Sabtu"
        ],
        "ERANAMES": [
        "Sebelum Masehi",
        "Masehi"
        ],
        "ERAS": [
        "SM",
        "M"
        ],
        "FIRSTDAYOFWEEK": 6,
        "MONTH": [
        "Januari",
        "Februari",
        "Maret",
        "April",
        "Mei",
        "Juni",
        "Juli",
        "Agustus",
        "September",
        "Oktober",
        "November",
        "Desember"
        ],
        "SHORTDAY": [
        "Min",
        "Sen",
        "Sel",
        "Rab",
        "Kam",
        "Jum",
        "Sab"
        ],
        "SHORTMONTH": [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "Mei",
        "Jun",
        "Jul",
        "Agt",
        "Sep",
        "Okt",
        "Nov",
        "Des"
        ],
        "STANDALONEMONTH": [
        "Januari",
        "Februari",
        "Maret",
        "April",
        "Mei",
        "Juni",
        "Juli",
        "Agustus",
        "September",
        "Oktober",
        "November",
        "Desember"
        ],
        "WEEKENDRANGE": [
        5,
        6
        ],
        "fullDate": "EEEE, dd MMMM y",
        "longDate": "d MMMM y",
        "medium": "d MMM y HH.mm.ss",
        "mediumDate": "d MMM y",
        "mediumTime": "HH.mm.ss",
        "short": "dd/MM/yy HH.mm",
        "shortDate": "dd/MM/yy",
        "shortTime": "HH.mm"
    },
    "NUMBER_FORMATS": {
        "CURRENCY_SYM": "Rp",
        "DECIMAL_SEP": ",",
        "GROUP_SEP": ".",
        "PATTERNS": [
        {
            "gSize": 3,
            "lgSize": 3,
            "maxFrac": 3,
            "minFrac": 0,
            "minInt": 1,
            "negPre": "-",
            "negSuf": "",
            "posPre": "",
            "posSuf": ""
        },
        {
            "gSize": 3,
            "lgSize": 3,
            "maxFrac": 0,
            "minFrac": 0,
            "minInt": 1,
            "negPre": "-\u00a4",
            "negSuf": "",
            "posPre": "\u00a4",
            "posSuf": ""
        }
        ]
    },
    "id": "id-id",
    "localeID": "id_ID",
    "pluralCat": function(n, opt_precision) {  return PLURAL_CATEGORY.OTHER;}
    });
});
app.factory('API', function($rootScope, $http){
    var factory = {};
    // factory.base_url = '{{ url('/') }}';
    // factory.current_year = '{{ date('Y') }}';
    // factory.current_month = '{{ date('m') }}';
    return factory;
})
app.directive('myEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if(event.which === 13) {
                scope.$apply(function (){
                    scope.$eval(attrs.myEnter);
                });

                event.preventDefault();
            }
        });
    };
});
app.directive('format', ['$filter', function ($filter) {
    return {
        require: '?ngModel',
        link: function (scope, elem, attrs, ctrl) {
            if (!ctrl) return;

            ctrl.$formatters.unshift(function (a) {
                return $filter(attrs.format)(ctrl.$modelValue)
            });

            elem.bind('blur', function(event) {
                var plainNumber = elem.val().replace(/[^\d|\-+|\.+]/g, '');
                elem.val($filter(attrs.format)(plainNumber));
            });
        }
    };
}]);
// Directive
app.directive('inputCurrency', ['$locale', '$filter', function($locale, $filter) {
    // For input validation
    var isValid = function(val) {
    return angular.isNumber(val) && !isNaN(val);
    };

    // Helper for creating RegExp's
    var toRegExp = function(val) {
    var escaped = val.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    return new RegExp(escaped, 'g');
    };

    // Saved to your $scope/model
    var toModel = function(val) {

    // Locale currency support
    var decimal = toRegExp($locale.NUMBER_FORMATS.DECIMAL_SEP);
    var group = toRegExp($locale.NUMBER_FORMATS.GROUP_SEP);
    var currency = toRegExp($locale.NUMBER_FORMATS.CURRENCY_SYM);

    // Strip currency related characters from string
    val = val.replace(decimal, '').replace(group, '').replace(currency, '').trim();

    return parseInt(val, 10);
    };

    // Displayed in the input to users
    var toView = function(val) {
    return $filter('currency')(val, '', 0);
    };

    // Link to DOM
    var link = function($scope, $element, $attrs, $ngModel) {
    $ngModel.$formatters.push(toView);
    $ngModel.$parsers.push(toModel);
    $ngModel.$validators.currency = isValid;

    $element.on('keyup', function() {
        $ngModel.$viewValue = toView($ngModel.$modelValue);
        $ngModel.$render();
    });
    };

    return {
    restrict: 'A',
    require: 'ngModel',
    link: link
    };
}]);