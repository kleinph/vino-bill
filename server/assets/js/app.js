var invoiceApp = angular.module("invoiceApp", ["invoiceServices"]);

invoiceApp.config(function($routeProvider, $locationProvider) {
	$routeProvider.
		when("/", {templateUrl: "/static/partials/invoice.html"}).
		otherwise({redirectTo: "/"});
	
	$locationProvider.html5Mode(true);
});