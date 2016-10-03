'use strict';

let HelperService = {
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


        let whereCriterion = criteria.where;

        if (whereCriterion) {
            query += this._buildWhereQuery(whereCriterion, tableAlias);
            query += criteria.sorting ? ` ORDER BY ${tableAlias}${criteria.sorting}` : ``;

            query += criteria.limit ? ` LIMIT ${criteria.limit}` : ``;
            query += criteria.skip ? ` OFFSET ${criteria.skip}` : ``;
        } else {
            query += this._buildQuery(criteria, tableAlias);
        }


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
    _buildQuery(criterion, tableAlias) {
        if (!criterion || typeof criterion !== 'object') {

            return;
        }

        let criterionKey = Object.keys(criterion)[0];

        if (!criterionKey) {

            return;
        }

        let criterionValues = criterion[criterionKey];
        let query = ` WHERE ${tableAlias}${criterionKey}`;

        if (Array.isArray(criterionValues)) {
            query += ` in (${criterionValues.join(',')})`;
        } else {
            query += ` = ${criterionValues}`;
        }

        return query;
    },
    _buildWhereQuery(criterion, tableAlias) {
        if (!criterion || typeof criterion !== 'object') {

            return;
        }

        let query = ``;


        let criterionKeys = Object.keys(criterion);
        let index = 0;

        if (criterionKeys.length > 0) {
            query += ` WHERE `;

            criterionKeys.forEach(
                (key) => {
                    query += `${tableAlias}${key} = ${criterion[key]}`;
                    index++;

                    if (criterionKeys[index]) {
                        query += ' AND ';
                    }
                }
            );
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