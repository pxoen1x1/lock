/* global sails */

'use strict';

const RANDOM_COORDINATES_COEFFICIENT = sails.config.requests.RANDOM_COORDINATES_COEFFICIENT;

let crypto = require('crypto');

let HelperService = {
    generateToken() {
        let buffer = crypto.randomBytes(sails.config.application.tokenLength);

        return buffer.toString('hex');
    },
    saveModel(model){
        let promise = new Promise(
            (resolve, reject) => {
                model.save(
                    (err) => {
                        if (err) {

                            return reject(err);
                        }

                        resolve(model);
                    }
                );
            });

        return promise;
    },
    buildQuery(query, criteria, tableAlias) {
        if (!criteria || typeof criteria !== 'object') {

            return query;
        }

        let criteriaKeys = Object.keys(criteria);

        if (criteriaKeys.length === 0) {

            return query;
        }

        let whereCriteria = criteria.where || criteria;

        query = this._buildQuery(query, whereCriteria, tableAlias);

        query += criteria.sorting ? ` ORDER BY ${criteria.sorting}` : ``;
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
    hideLocation(location) {
        if(!location){

            return;
        }

        delete location.address;

        let correction = (2*Math.random() -1)/RANDOM_COORDINATES_COEFFICIENT;

        location.latitude += correction;
        location.longitude += correction;

        return location;
    },
    _buildQuery(query, criteria, tableAlias) {
        if (!criteria || typeof criteria !== 'object') {

            return typeof criteria;
        }

        query = query || ``;
        tableAlias = tableAlias ? `${tableAlias}.` : ``;

        let criteriaKeys = Object.keys(criteria);
        let index = 0;
        let whereRegex = /where/gi;
        let doesQueryContainWhereClause = whereRegex.test(query);

        if (criteriaKeys.length > 0) {
            query += doesQueryContainWhereClause ? ` AND` : ` WHERE`;

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
            query += ` IN (${criterionValues.join(',')})`;
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