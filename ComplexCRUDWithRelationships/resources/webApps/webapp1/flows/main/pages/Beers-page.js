/* jshint esversion: 6 */
define([], function() {
  'use strict';

  var PageModule = function PageModule() {};

  PageModule.prototype.getQueryCondition = function(filter) {
    // default data restriction; dummy in this case:
    let condition = 'id is not null';

    if (filter.name && filter.name.length > 0) {
      const val = filter.name.toUpperCase();
      condition = `${condition} AND UPPER(name) LIKE '*${val}*'`;
    }

    if (filter.minAlcohol) {
      condition = `${condition} AND alcoholPercentage >= ${filter.minAlcohol}`;
    }

    if (filter.maxAlcohol) {
      condition = `${condition} AND alcoholPercentage <= ${filter.maxAlcohol}`;
    }

    if (filter.selectedTypes && filter.selectedTypes.length > 0) {
      let val = filter.selectedTypes.reduce((prev, curr) => prev + (", " + curr));
      condition = `${condition} AND beerTypeObject.id in (${val})`;
    }

    if (filter.selectedCountries && filter.selectedCountries.length > 0) {
      let val = filter.selectedCountries.reduce((prev, curr) => prev + (", " + curr));
      condition = `${condition} AND countryObject.id in (${val})`;
    }

    if (filter.selectedQualities && filter.selectedQualities.length > 0) {
      let val = filter.selectedQualities.reduce((prev, curr) => prev + (", " + curr));
      condition = `${condition} AND beerQualityCollection.qualityObject.id in (${val})`;
    }
    
    return condition;
  };


  return PageModule;
});