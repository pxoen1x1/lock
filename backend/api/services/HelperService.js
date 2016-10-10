/* global sails */

'use strict';

let crypto = require('crypto');

let HelperService = {
    generateToken() {
        let buffer = crypto.randomBytes(sails.config.application.tokenLength);

        return buffer.toString('hex');
    },
    buildQuery(query, criteria, tableAlias) {
        query = query || ``;
        tableAlias = tableAlias ? `${tableAlias}.` : ``;

        if (!criteria || typeof criteria !== 'object') {

            return query;
        }

        let criteriaKeys = Object.keys(criteria);

        if (criteriaKeys.length === 0) {

            return query;
        }

        let whereCriteria = criteria.where || criteria;

        query += this._buildQuery(whereCriteria, tableAlias);

        query += criteria.sorting ? ` ORDER BY ${tableAlias}${criteria.sorting}` : ``;
        query += criteria.limit ? ` LIMIT ${criteria.limit}` : ``;
        query += criteria.skip ? ` OFFSET ${criteria.skip}` : ``;

        return query;
    },
    formatQueryResult(queryResult){
        queryResult = queryResult.map(
            (queryResultItem) => {
                let result = {};

                for (let key in queryResultItem) {
                    if (!queryResultItem.hasOwnProperty(key) || !queryResultItem[key]) {

                        continue;
                    }


                    this._convertKeyToObject(result, key, queryResultItem[key]);
                }

                return result;
            }
        );

        return queryResult;
    },
    _buildQuery(criteria, tableAlias) {
        if (!criteria || typeof criteria !== 'object') {

            return typeof criteria;
        }

        let query = ` WHERE`;

        let criteriaKeys = Object.keys(criteria);
        let index = 0;

        if (criteriaKeys.length > 0) {
            criteriaKeys.forEach(
                (key) => {
                    let criterion = {};

                    criterion[key] = criteria[key];
                    query += this._parseCriterion(criterion, tableAlias);
                    index++;

                    if (criteriaKeys[index]) {
                        query += ' AND';
                    }
                }
            );
        }

        return query;
    },
    _parseCriterion(criterion, tableAlias) {
        if (!criterion || typeof criterion !== 'object') {

            return;
        }

        let criterionKey = Object.keys(criterion)[0];

        if (!criterionKey) {

            return;
        }

        let criterionValues = criterion[criterionKey];
        let query = ` ${tableAlias}${criterionKey}`;

        if (Array.isArray(criterionValues)) {
            query += ` in (${criterionValues.join(',')})`;
        } else if (criterionValues !== null && typeof criterionValues === 'object') {
            let criterionModifiers = Object.keys(criterionValues);
            let index = 0;

            criterionModifiers.forEach(
                (criterionModifier) => {
                    let criterionValue = criterionValues[criterionModifier];

                    query += this._parseCriterionModifier(criterionModifier, criterionValue);
                    index++;

                    if (criterionModifiers[index]) {
                        query += ` AND ${tableAlias}${criterionKey}`;
                    }
                });
        } else {
            query += ` = ${criterionValues}`;
        }

        return query;
    },
    _parseCriterionModifier(criterionModifier, value) {
        let query = ``;

        if (!criterionModifier) {

            return ``;
        }

        switch (criterionModifier) {
            case '!':
                query = ` <> ${value}`;
                break;
            case 'contains':
                query = ` LIKE %${value}%`;
                break;
            case 'startsWith':
                query = ` LIKE ${value}%`;
                break;
            case 'endsWith':
                query = ` LIKE %${value}`;
                break;
            default:
                query = ` ${criterionModifier} ${value}`;
        }

        return query;
    },
    _convertKeyToObject(result, keys, value) {
        let splitKeys = keys.split('.');

        result = result || {};

        splitKeys.reduce(
            (obj, key, index, splitKeys) => {
                if (!splitKeys || splitKeys.length === 0) {

                    return obj;
                }

                if (index === splitKeys.length - 1) {
                    obj[key] = value;

                    return obj[key];
                }

                obj[key] = obj[key] || {};

                return obj[key];
            }, result
        );
    }
};

module.exports = HelperService;