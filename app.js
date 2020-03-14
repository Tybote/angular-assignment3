(function () {
  'use strict';

  angular.module('NarrowItDownApp', [])
  .controller('NarrowItDownController', NarrowItDownController)
  .service('MenuSearchService', MenuSearchService)
  .constant('ApiBasePath', "https://davids-restaurant.herokuapp.com")
  .directive('foundItems', FoundItemsDirective);

  function FoundItemsDirective() {
    var ddo = {
      templateUrl: 'foundItems.html',
      scope: {
        list: '<',
        onRemove: '&'
      }
    };
    return ddo;
  }

  NarrowItDownController.$inject = ['MenuSearchService'];
  function NarrowItDownController(MenuSearchService) {
    var list = this;
    var err = "Nothing Found!";
  
    list.getSearchItems = function() {
      list.error = "";
      if(list.searchTerm === undefined || list.searchTerm === ""){
        list.found = []
        list.error = err;
      }
      else {
        MenuSearchService.getMatchedMenuItems(list.searchTerm)
        .then(function(response) {
          list.found = response;
          if(list.found.length == 0){
            list.error = err;
          }
        })
        .catch(function (error) {
          console.log("Something went terribly wrong.");
        });
      }
    };

    list.removeItem = function (itemIndex) {
      list.found.splice(itemIndex, 1);
    };
  }

  MenuSearchService.$inject = ['$http', 'ApiBasePath'];
  function MenuSearchService($http, ApiBasePath) {
    var service = this;
    
    service.getMatchedMenuItems = function (shortName) {
      return $http({
        method: "GET",
        url: (ApiBasePath + "/menu_items.json")
      }).then(function(response) {
        var items = response.data.menu_items;
        var foundItems = [];
        for(var item in items){
          if(items[item].description.toLowerCase().includes(shortName.toLowerCase()))
          {
            foundItems.push(items[item]);
          }
        }
        return foundItems;
      }).catch(function(error) {
      console.log("Something went wrong");
      });
    };
  }

})();
