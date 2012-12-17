angular.module("invoiceServices", ["ngResource"]).
factory("Category", function($resource) {
	return $resource("api/v1/category/:id", {id: "@id"},
		{query: {method: "GET", isArray: false},
		create: {method: "POST"},
		save: {method: "PUT"}}
	);
}).factory("Wine", function($resource) {
	return $resource("api/v1/wine/:id", {id: "@id"},
		{query: {method: "GET", isArray: false},
		create: {method: "POST"},
		save: {method: "PUT"}}
	);
}).factory("Invoice", function($resource) {
	return $resource("api/v1/invoice/:id", {id: "@id"},
		{query: {method: "GET", isArray: false},
		create: {method: "POST"},
		save: {method: "PUT"}}
	);
}).factory("InvoicePosition", function($resource) {
	return $resource("api/v1/invoiceposition/:id", {id: "@id"},
		{query: {method: "GET", isArray: false},
		create: {method: "POST"},
		save: {method: "PUT"}}
	);
}).factory("PrintService", function($resource) {
	return $resource("print/:id", {id: "@id"},
		{print: {method: "GET"}}
	);
});
