/* global sails, Request, HelperService */

'use strict';

const RANDOM_COORDINATES_COEFFICIENT = sails.config.requests.RANDOM_COORDINATES_COEFFICIENT;

let promise = require('bluebird');
let getRequestsRawQuery = `SELECT request.id,
                                  request.distance,
                                  request.description,
                                  request.for_date AS 'forDate',
                                  request.cost AS 'cost',
                                  request.status AS 'status',
                                  request.is_public AS 'isPublic',
                                  request.createdAt AS 'createdAt',
                                  request.updatedAt AS 'updatedAt',
                                  request_language.id AS 'language.id',
                                  request_language.name AS 'language.name',
                                  request_serviceType.id AS 'serviceType.id',
                                  request_serviceType.name AS 'serviceType.name',
                                  request_location.id AS 'location.id',
                                  request_location.address AS 'location.address',
                                  request_location.latitude AS 'location.latitude',
                                  request_location.longitude AS 'location.longitude',
                                  owner.id AS 'owner.id',
                                  owner.first_name AS 'owner.firstName',
                                  owner.last_name AS 'owner.lastName',
                                  CONCAT_WS(' ', owner.first_name, owner.last_name) AS 'owner.fullName',
                                  owner.phone_number AS 'owner.phoneNumber',
                                  owner.gender AS 'owner.gender',
                                  owner.birthday AS 'owner.birthday',
                                  owner.ssn AS 'owner.ssn',
                                  owner.is_enabled AS 'owner.isEnabled',
                                  owner.is_email_confirmed AS 'owner.isEmailConfirmed',
                                  owner.portrait AS 'owner.portrait',
                                  owner.createdAt AS 'owner.createdAt',
                                  owner.updatedAt AS'owner.updatedAt',
                                  owner_auth.id AS 'owner.auth.id',
                                  owner_auth.email AS 'owner.auth.email',
                                  owner_address.id AS 'owner.address.id',
                                  owner_address.address AS 'owner.address.address',
                                  owner_address.zip AS 'owner.address.zip',
                                  owner_address_city.id AS 'owner.address.city.id',
                                  owner_address_city.city AS 'owner.address.city.city',
                                  owner_address_city.zip AS 'owner.address.city.zip',
                                  owner_address_city.lat AS 'owner.address.city.lat',
                                  owner_address_city.lng AS 'owner.address.city.lng',
                                  owner_address_state.id AS 'owner.address.state.id',
                                  owner_address_state.state AS 'owner.address.state.state',
                                  owner_address_state.code AS 'owner.address.state.code',
                                  executor.id AS 'executor.id',
                                  executor.first_name AS 'executor.firstName',
                                  executor.last_name AS 'executor.lastName',
                                  CONCAT_WS(' ', executor.first_name, executor.last_name) AS 'executor.fullName',
                                  executor.phone_number AS 'executor.phoneNumber',
                                  executor.gender AS 'executor.gender',
                                  executor.birthday AS 'executor.birthday',
                                  executor.ssn AS 'executor.ssn',
                                  executor.is_enabled AS 'executor.isEnabled',
                                  executor.is_email_confirmed AS 'executor.isEmailConfirmed',
                                  executor.portrait AS 'executor.portrait',
                                  executor.createdAt AS 'executor.createdAt',
                                  executor.updatedAt AS'executor.updatedAt',
                                  executor_auth.id AS 'executor.auth.id',
                                  executor_auth.email AS 'executor.auth.email',
                                  executor_address.id AS 'executor.address.id',
                                  executor_address.address AS 'executor.address.address',
                                  executor_address.zip AS 'executor.address.zip',
                                  executor_address_city.id AS 'executor.address.city.id',
                                  executor_address_city.city AS 'executor.address.city.city',
                                  executor_address_city.zip AS 'executor.address.city.zip',
                                  executor_address_city.lat AS 'executor.address.city.lat',
                                  executor_address_city.lng AS 'executor.address.city.lng',
                                  executor_address_state.id AS 'executor.address.state.id',
                                  executor_address_state.state AS 'executor.address.state.state',
                                  executor_address_state.code AS 'executor.address.state.code',
                                  executor_details.id AS 'executor.details.id',
                                  executor_details.is_available AS 'executor.details.isAvailable',
                                  executor_details.is_pro AS 'executor.details.isPro',
                                  executor_details.latitude AS 'executor.details.latitude',
                                  executor_details.longitude AS 'executor.details.longitude',
                                  executor_details.rating AS 'executor.details.rating',
                                  executor_details_workingHours.id AS 'executor.details.workingHours.id',
                                  executor_details_workingHours.time_from AS 'executor.details.workingHours.timeFrom',
                                  executor_details_workingHours.time_to AS 'executor.details.workingHours.timeTo'
                     FROM requests AS request
                     LEFT JOIN languages AS request_language ON request_language.id = request.language_id
                     LEFT JOIN service_types AS request_serviceType ON request_serviceType.id = request.service_type_id
                     LEFT JOIN locations AS request_location ON request_location.id = request.location_id
                     LEFT JOIN users AS owner ON owner.id = request.owner_id
                     LEFT JOIN auth AS owner_auth ON owner_auth.user = owner.id
                     LEFT JOIN addresses AS owner_address ON owner_address.user_id = owner.id
                     LEFT JOIN cities AS owner_address_city ON owner_address_city.id = owner_address.city_id
                     LEFT JOIN states AS owner_address_state ON owner_address_state.id = owner_address.state_id
                     LEFT JOIN users AS executor ON executor.id = request.executor_id
                     LEFT JOIN auth AS executor_auth ON executor_auth.user = executor.id
                     LEFT JOIN addresses AS executor_address ON executor_address.user_id = executor.id
                     LEFT JOIN cities AS executor_address_city ON executor_address_city.id = executor_address.city_id
                     LEFT JOIN states AS executor_address_state ON executor_address_state.id = executor_address.state_id
                     LEFT JOIN user_details AS executor_details ON executor_details.user_id = executor.id
                     LEFT JOIN working_hours AS executor_details_workingHours
                               ON executor_details_workingHours.user_details_id = executor_details.id`;

let RequestService = {
    getAll(criteria) {
        let tableAlias = 'request';

        if (criteria.sorting) {
            criteria.sorting = criteria.sorting.indexOf('serviceType') !== -1 ?
                criteria.sorting.replace('serviceType', 'request_serviceType.name') : criteria.sorting;
        }

        let rawQuery = HelperService.buildQuery(getRequestsRawQuery, criteria, tableAlias);

        let getRequestQueryAsync = promise.promisify(Request.query);

        return getRequestQueryAsync(rawQuery)
            .then(
                (requests) => HelperService.formatQueryResult(requests)
            );
    },
    getSpecialistNewRequests(criteria) {
        let tableAlias = 'request';
        let rawQuery = HelperService.buildQuery(getRequestsRawQuery, criteria, tableAlias);

        rawQuery = rawQuery.replace(/\s*request_location.address AS 'location.address',/, '');
        rawQuery = rawQuery.replace(/\s*owner.phone_number AS 'owner.phoneNumber',/, '');

        rawQuery = rawQuery.replace(
            'request_location.latitude',
            `(request_location.latitude + (2*RAND() - 1)/${RANDOM_COORDINATES_COEFFICIENT})`
        );
        rawQuery = rawQuery.replace(
            'request_location.longitude',
            `(request_location.longitude + (2*RAND()-1)/${RANDOM_COORDINATES_COEFFICIENT})`
        );

        let getRequestQueryAsync = promise.promisify(Request.query);

        return getRequestQueryAsync(rawQuery)
            .then(
                (requests) => HelperService.formatQueryResult(requests)
            );
    },
    getGroupRequests(user, filters) {
        let tableAlias = 'request';

        let criteria = {
            where: {},
            sorting: filters.sorting,
            skip: (filters.pagination.page - 1) * filters.pagination.limit,
            limit: filters.pagination.limit
        };

        if (filters.status) {
            if (filters.status.indexOf('!') === 0) {
                criteria.where.status = {
                    '!': filters.status.replace('!', '')
                };
            } else {
                criteria.where.status = filters.status;
            }
        }

        let getGroupRequestsRawQuery = `${getRequestsRawQuery} JOIN groups AS gr ON gr.admin_id = ?
            JOIN group_members__user_groupmembers AS gu ON gu.group_members = gr.id
            WHERE request.executor_id = gu.user_groupMembers`;

        let rawQuery = HelperService.buildQuery(getGroupRequestsRawQuery, criteria, tableAlias);

        let getSpecialistsRequestsQueryAsync = promise.promisify(Request.query);

        return getSpecialistsRequestsQueryAsync(rawQuery, [user.id])
            .then(
                (requests) => {
                    let data = [user.id];

                    rawQuery = rawQuery.replace(/^SELECT[\s|\S]*FROM/i, 'SELECT COUNT (*) FROM');
                    rawQuery = rawQuery.replace(/LEFT JOIN [\s|\S]*executor_details.id/i, '');
                    rawQuery = rawQuery.replace(/\sOFFSET \d+/i, '');

                    return [HelperService.formatQueryResult(requests), this._getRequestsCountBYQuery(rawQuery, data)];
                }
            )
            .spread(
                (requests, count) => {

                    return {
                        items: requests,
                        count: count
                    };
                }
            );
    },
    getRequestById(request){
        let rawQuery = `${getRequestsRawQuery} WHERE request.id = ?`;

        let getRequestQueryAsync = promise.promisify(Request.query);

        return getRequestQueryAsync(rawQuery, [request.id])
            .then(
                (requests) => HelperService.formatQueryResult(requests)[0]
            );
    },
    getRequestsCount(criteria) {

        return Request.count(criteria)
            .then(
                (count) => count
            );
    },
    createRequest(request) {

        return Request.create(request)
            .then(
                (createdRequest) => createdRequest
            );
    },
    updateRequest(request) {

        return Request.update({id: request.id}, request)
            .then(
                (updatedRequests) => this.getRequestById(updatedRequests[0])
            );
    },
    _getRequestsCountBYQuery(rawQuery, data){
        data = data || [];

        if (!rawQuery || !Array.isArray((data))) {

            return Promise.reject(new Error('Query or data is empty.'));
        }

        let getRequestsCountQueryAsync = promise.promisify(Request.query);

        return getRequestsCountQueryAsync(rawQuery, data)
            .then(
                (requestsCount) => {
                    if (!requestsCount || requestsCount.length === 0) {
                        return 0;
                    }

                    requestsCount = requestsCount[0];

                    return Object.keys(requestsCount)
                        .map(key => requestsCount[key])[0];
                }
            );
    },
};

module.exports = RequestService;
