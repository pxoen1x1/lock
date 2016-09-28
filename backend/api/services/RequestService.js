/* global Request, Feedback, UserDetailService, HelperService */

'use strict';

let promise = require('bluebird');
let getRequestsRawQuery = `SELECT request.id,
                                  request.distance,
                                  request.description,
                                  request.for_date AS 'forDate',
                                  request.is_executed AS 'isExecuted',
                                  request.cost AS 'cost',
                                  request.is_closed AS 'isClosed',
                                  request.status AS 'status',
                                  request.is_public AS 'isPublic',
                                  request.createdAt AS 'createdAt',
                                  request.updatedAt AS 'updatedAt',
                                  request_language.id AS 'language.id',
                                  request_language.name AS 'language.name',
                                  request_serviceType.id AS 'serviceType.id',
                                  request_serviceType.name AS 'serviceType.name',
                                  request_location.id AS 'request.location.id',
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
                                  executor_details_license.id AS 'executor.details.license.id',
                                  executor_details_license.number AS 'executor.details.license.number',
                                  executor_details_license.date AS 'executor.details.license.date',
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
                     LEFT JOIN licenses AS executor_details_license
                               ON executor_details_license.user_details_id = executor_details.id
                     LEFT JOIN working_hours AS executor_details_workingHours
                               ON executor_details_workingHours.user_details_id = executor_details.id`;

let RequestService = {
    getAll(criteria, sorting, pagination) {

        return Request.find(criteria)
            .sort(sorting)
            .populateAll()
            .paginate(pagination)
            .then(
                (foundRequests) => {
                    let executorDetailsPopulatePromises = foundRequests.map(
                        (foundRequest) => {
                            if (!foundRequest || !foundRequest.executor) {

                                return Promise.resolve(foundRequest);
                            }

                            return populateByUserDetails(foundRequest);
                        }
                    );

                    return Promise.all(executorDetailsPopulatePromises);
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
    createFeedback(feedback) {

        return Request.findOneById(feedback.request)
            .then(
                (request) => {
                    if (!request.isExecuted || !request.executor) {

                        return Promise.reject();
                    }

                    feedback.executor = request.executor;

                    return Feedback.create(feedback);
                }
            )
            .then(
                (createdFeedback) => createdFeedback
            );
    }
};

module.exports = RequestService;

function populateByUserDetails(request) {
    return UserDetailService.getUserDetailByUser(request.executor)
        .then(
            (userDetails) => {
                request.executor.details = userDetails;

                return request;
            }
        );
}
