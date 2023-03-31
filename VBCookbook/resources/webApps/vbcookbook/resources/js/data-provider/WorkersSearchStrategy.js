/**
 * Copyright (c)2020, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 */
/* eslint-disable class-methods-use-this */
// eslint-disable-next-line max-len
define(['./BaseJsonDataProviderSearchStrategy', 'ojs/ojconverterutils-i18n'], (BaseJsonDataProviderSearchStrategy, Converterutilsi18n) => {
  class WorkersSearchStrategy extends BaseJsonDataProviderSearchStrategy {
    /**
     * Sub-class can override in order to shape the dataset in any way.
     * @param {*} data
     * @return {*}
     */
    shapeData(data) {
      const { IntlConverterUtils } = Converterutilsi18n;
      for (let i = 0; i < data.length; i++) {
        data[i].LastName = this._fixCase(data[i].LastName);
        const startDt = IntlConverterUtils.isoToDate(data[i].StartDate);
        data[i].StartDateTS = startDt.getTime();
        if (!data[i].State) {
          data[i].State = { US: null };
        }
        if (!data[i].City) {
          data[i].City = { US: null };
        }
      }

      return data;
    }

    _fixCase(name) {
      // Last name is stored in all upper case
      const t = name.toLowerCase();

      return name[0].toUpperCase() + t.substr(1);
    }

    /**
       * @return {Map<string, Function>}
       */
    getSortComparators() {
      const genericComparator = (a, b) => {
        if (a < b) {
          return -1;
        }
        if (a > b) {
          return 1;
        }

        return 0;
      };
      const comparators = new Map();
      comparators.set('FirstName', genericComparator);
      comparators.set('MiddleName', genericComparator);
      comparators.set('LastName', genericComparator);

      return { comparators };
    }

    /**
     * @return {Array<{attribute:string, direction:string}>}
     */
    getImplicitSort() {
      return [{ attribute: 'FirstName', direction: 'ascending' },
        { attribute: 'MiddleName', direction: 'ascending' },
        { attribute: 'LastName', direction: 'ascending' }];
    }

    /**
     * @return {string|string[]}
     */
    getKeyAttributes() {
      return 'FaDocId';
    }

    /**
     * @return {string[]}
     */
    getSearchTextFilterAttributes() {
      return ['FirstName', 'MiddleName', 'LastName'];
    }

    /**
       * @return {Map<string, Function>}
       */
    getFilterChipToCriterionConverters() {
      const converters = new Map();
      converters.set('GenderSS', filterChip => ({ op: '$eq', attribute: 'Gender', value: filterChip.value }));
      converters.set('PositionSM', filterChip => {
        const criteria = [];
        const compoundFilter = {
          op: '$or',
          criteria: criteria,
        };
        for (let i = 0; i < filterChip.value.length; i++) {
          criteria.push({ op: '$eq', attribute: 'Position', value: filterChip.value[i] });
        }

        return compoundFilter;
      });
      converters.set('keyword', filterChip => {
        const compoundFilter = {
          op: '$or',
          criteria: [],
        };
        const textFilterAttributes = this.getSearchTextFilterAttributes();
        for (let i = 0; i < textFilterAttributes.length; i++) {
          compoundFilter.criteria.push({
            op: '$sw', attribute: textFilterAttributes[i], value: filterChip.value,
          });
        }

        return compoundFilter;
      });
      converters.set('SalaryRG', filterChip => {
        const compoundFilter = {
          op: '$and',
          criteria: [],
        };
        compoundFilter.criteria.push({
          op: '$ge', attribute: 'Salary', value: filterChip.value.gte,
        });
        compoundFilter.criteria.push({
          op: '$le', attribute: 'Salary', value: filterChip.value.lte,
        });

        return compoundFilter;
      });
      converters.set('StartDateRG', filterChip => {
        const compoundFilter = {
          op: '$and',
          criteria: [],
        };

        const { IntlConverterUtils } = Converterutilsi18n;
        const gte = IntlConverterUtils.isoToDate(filterChip.value.gte);
        compoundFilter.criteria.push({
          op: '$ge', attribute: 'StartDateTS', value: gte.getTime(),
        });
        const lte = IntlConverterUtils.isoToDate(filterChip.value.lte);
        compoundFilter.criteria.push({
          op: '$le', attribute: 'StartDateTS', value: lte.getTime(),
        });

        return compoundFilter;
      });
      converters.set('AwardSC', filterChip => ({
        op: '$eq', attribute: 'Award', value: filterChip.value,
      }));
      converters.set('CountrySS', filterChip => ({
        op: '$eq', value: { Country: { US: filterChip.value } },
      }));
      converters.set('StateSS', filterChip => ({
        op: '$eq', value: { State: { US: filterChip.value } },
      }));
      converters.set('CitySS', filterChip => ({
        op: '$eq', value: { City: { US: filterChip.value } },
      }));

      return converters;
    }

    /**
       * @return {Map<string, Function>}
       */
    getFilteredItemToAggregators() {
      const aggregators = new Map();
      aggregators.set('GenderSS', (item, genderMap) => {
        let genderCount = 0;
        if (genderMap.has(item.Gender)) {
          genderCount = genderMap.get(item.Gender);
        }
        genderMap.set(item.Gender, ++genderCount);
      });
      aggregators.set('PositionSM', (item, positionMap) => {
        let positionCount = 0;
        if (positionMap.has(item.Position)) {
          positionCount = positionMap.get(item.Position);
        }
        positionMap.set(item.Position, ++positionCount);
      });
      aggregators.set('autocomplete', (item, autocompleteMap) => {
        let firstNameState = { count: 0, attributeLabel: 'First Name' };
        if (autocompleteMap.has(item.FirstName)) {
          firstNameState = autocompleteMap.get(item.FirstName);
        }
        firstNameState.count += 1; 
        autocompleteMap.set(item.FirstName, firstNameState);
        let middleNameState = { count: 0, attributeLabel: 'Middle Name' };
        if (autocompleteMap.has(item.MiddleName)) {
          middleNameState = autocompleteMap.get(item.MiddleName);
        }
        middleNameState.count += 1;
        autocompleteMap.set(item.MiddleName, middleNameState);
        let lastNameState = { count: 0, attributeLabel: 'Last Name' };
        if (autocompleteMap.has(item.LastName)) {
          lastNameState = autocompleteMap.get(item.LastName);
        }
        lastNameState.count += 1;
        autocompleteMap.set(item.LastName, lastNameState);
      });
      aggregators.set('AwardSC', (item, awardMap) => {
        let awardCount = 0;
        if (awardMap.has(item.Award)) {
          awardCount = awardMap.get(item.Award);
        }
        awardMap.set(item.Award, ++awardCount);
      });
      aggregators.set('CountrySS', (item, countryMap) => {
        let countryCount = 0;
        if (countryMap.has(item.Country.US)) {
          countryCount = countryMap.get(item.Country.US);
        }
        countryMap.set(item.Country.US, ++countryCount);
      });
      aggregators.set('StateSS', (item, stateMap) => {
        if (!item.State) return;
        if (!item.State.US) return;

        let stateCount = 0;
        if (stateMap.has(item.State.US)) {
          stateCount = stateMap.get(item.State.US);
        }
        stateMap.set(item.State.US, ++stateCount);
      });
      aggregators.set('CitySS', (item, cityMap) => {
        if (!item.City) return;

        let cityCount = 0;
        if (cityMap.has(item.City.US)) {
          cityCount = cityMap.get(item.City.US);
        }
        cityMap.set(item.City.US, ++cityCount);
      });

      return aggregators;
    }
  }

  return WorkersSearchStrategy;
});
