'use strict';


// Declare app level module which depends on filters, and services

angular.module('mywebsite', [])
    .factory('locale',function () {
        return {
            lang: "fr"
        }
    })
    .factory('i18n',function($http,locale){

        function Chain() {
            var _this = this;
            this.success = undefined;
            this.error = undefined;
            this.r = { success: function (callback) {
                _this.success = callback;
                return _this.r;
            },
                error: function (callback) {
                    _this.error = callback;
                    return _this.r;
                }}

        }

        var json=undefined;
        return {
            set:function(){
                var chain = new Chain();
                $http({
                    method: "GET",
                    url:"assets/json/"+locale.lang+".json"
                }).success(function (data) {
                        json = eval(data);
                        if (typeof chain.success === "function")
                            chain.success.apply(this, arguments);
                    }).error(function(){
                        if (typeof chain.error === "function")
                            chain.error.apply(this, arguments);
                    })
                return chain.r;
            },
            lang:function(){
                return json
            }
        }
    })

.filter('translate', function (i18n){
        return function(input){
            var lang=i18n.lang();
            if(angular.isDefined(lang)){
                return lang[input];
            }
        }
    })
    .controller("website-ctrl", function ($scope,i18n,locale) {
        i18n.set();
        $scope.locale=locale;
        $scope.switchLang=function(){
            if(locale.lang=="fr")
                locale.lang="en";
            else locale.lang="fr";
            i18n.set();
        }

        $scope.lang=function(){
            return locale.lang=="fr"?"en":"fr";
        }
    });