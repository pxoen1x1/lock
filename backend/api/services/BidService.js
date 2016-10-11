/* global sails, Request, Bid, HelperService */

'use strict';

const RANDOM_COORDINATES_COEFFICIENT = sails.config.requests.RANDOM_COORDINATES_COEFFICIENT;

let promise = require('bluebird');
let getBidRawQuery = `SELECT bid.id,
                               bid.message,
                               bid.cost,
                               bid.createdAt,
                               bid.updatedAt,
                               bid.is_refused AS 'isRefused',
                               request.id AS 'request.id',
                               request.for_date AS 'request.forDate',
                               request.distance AS 'request.distance',
                               request.description AS 'request.description',
                               request.is_executed AS 'request.isExecuted',
                               request.cost AS 'request.cost',
                               request.is_closed AS 'request.isClosed',
                               request.status AS 'request.status',
                               request.is_public AS 'request.isPublic',
                               request.createdAt AS 'request.createdAt',
                               request.updatedAt AS 'request.updatedAt',
                               request_language.id AS 'request.language.id',
                               request_language.name AS 'request.language.name',
                               request_serviceType.id AS 'request.serviceType.id',
                               request_serviceType.name AS 'request.serviceType.name',
                               request_location.id AS 'request.location.id',
                               request_location.address AS 'request.location.address',
                               request_location.latitude AS 'request.location.latitude',
                               request_location.longitude AS 'request.location.longitude',
                               client.id AS 'client.id',
                               client.first_name AS 'client.firstName',
                               client.last_name AS 'client.lastName',
                               CONCAT_WS(' ', client.first_name, client.last_name) AS 'client.fullName',
                               client.phone_number AS 'client.phoneNumber',
                               client.gender AS 'client.gender',
                               client.birthday AS 'client.birthday',
                               client.ssn AS 'client.ssn',
                               client.is_enabled AS 'client.isEnabled',
                               client.is_email_confirmed AS 'client.isEmailConfirmed',
                               client.portrait AS 'client.portrait',
                               client.createdAt AS 'client.createdAt',
                               client.updatedAt AS'client.updatedAt',
                               client_auth.id AS 'client.auth.id',
                               client_auth.email AS 'client.auth.email',
                               client_address.id AS 'client.address.id',
                               client_address.address AS 'client.address.address',
                               client_address.zip AS 'client.address.zip',
                               client_address_city.id AS 'client.address.city.id',
                               client_address_city.city AS 'client.address.city.city',
                               client_address_city.zip AS 'client.address.city.zip',
                               client_address_city.lat AS 'client.address.city.lat',
                               client_address_city.lng AS 'client.address.city.lng',
                               client_address_state.id AS 'client.address.state.id',
                               client_address_state.state AS 'client.address.state.state',
                               client_address_state.code AS 'client.address.state.code',
                               specialist.id AS 'specialist.id',
                               specialist.first_name AS 'specialist.firstName',
                               specialist.last_name AS 'specialist.lastName',
                               CONCAT_WS(' ', specialist.first_name, specialist.last_name) AS 'specialist.fullName',
                               specialist.phone_number AS 'specialist.phoneNumber',
                               specialist.gender AS 'specialist.gender',
                               specialist.birthday AS 'specialist.birthday',
                               specialist.ssn AS 'specialist.ssn',
                               specialist.is_enabled AS 'specialist.isEnabled',
                               specialist.is_email_confirmed AS 'specialist.isEmailConfirmed',
                               specialist.portrait AS 'specialist.portrait',
                               specialist.createdAt AS 'specialist.createdAt',
                               specialist.updatedAt AS'specialist.updatedAt',
                               specialist_auth.id AS 'specialist.auth.id',
                               specialist_auth.email AS 'specialist.auth.email',
                               specialist_address.id AS 'specialist.address.id',
                               specialist_address.address AS 'specialist.address.address',
                               specialist_address.zip AS 'specialist.address.zip',
                               specialist_address_city.id AS 'specialist.address.city.id',
                               specialist_address_city.city AS 'specialist.address.city.city',
                               specialist_address_city.zip AS 'specialist.address.city.zip',
                               specialist_address_city.lat AS 'specialist.address.city.lat',
                               specialist_address_city.lng AS 'specialist.address.city.lng',
                               specialist_address_state.id AS 'specialist.address.state.id',
                               specialist_address_state.state AS 'specialist.address.state.state',
                               specialist_address_state.code AS 'specialist.address.state.code',
                               specialist_details.id AS 'specialist.details.id',
                               specialist_details.is_available AS 'specialist.details.isAvailable',
                               specialist_details.is_pro AS 'specialist.details.isPro',
                               specialist_details.latitude AS 'specialist.details.latitude',
                               specialist_details.longitude AS 'specialist.details.longitude',
                               specialist_details.rating AS 'specialist.details.rating',
                               specialist_details_license.id AS 'specialist.details.license.id',
                               specialist_details_license.number AS 'specialist.details.license.number',
                               specialist_details_license.date AS 'specialist.details.license.date',
                               specialist_details_workingHours.id AS 'specialist.details.workingHours.id',
                               specialist_details_workingHours.time_from AS 'specialist.details.workingHours.timeFrom',
                               specialist_details_workingHours.time_to AS 'specialist.details.workingHours.timeTo'
        FROM bids AS bid
        LEFT JOIN requests AS request ON request.id = bid.request_id
        LEFT JOIN languages AS request_language ON request_language.id = request.language_id
        LEFT JOIN service_types AS request_serviceType ON request_serviceType.id = request.service_type_id
        LEFT JOIN locations AS request_location ON request_location.id = request.location_id
        LEFT JOIN users AS client ON client.id = bid.client_id
        LEFT JOIN auth AS client_auth ON client_auth.user = client.id
        LEFT JOIN addresses AS client_address ON client_address.user_id = client.id
        LEFT JOIN cities AS client_address_city ON client_address_city.id = client_address.city_id
        LEFT JOIN states AS client_address_state ON client_address_state.id = client_address.state_id
        LEFT JOIN users AS specialist ON specialist.id = bid.specialist_id
        LEFT JOIN auth AS specialist_auth ON specialist_auth.user = specialist.id
        LEFT JOIN addresses AS specialist_address ON specialist_address.user_id = specialist.id
        LEFT JOIN cities AS specialist_address_city ON specialist_address_city.id = specialist_address.city_id
        LEFT JOIN states AS specialist_address_state ON specialist_address_state.id = specialist_address.state_id
        LEFT JOIN user_details AS specialist_details ON specialist_details.user_id = specialist.id
        LEFT JOIN licenses AS specialist_details_license
                  ON specialist_details_license.user_details_id = specialist_details.id
        LEFT JOIN working_hours AS specialist_details_workingHours
                  ON specialist_details_workingHours.user_details_id = specialist_details.id`;

let BidService = {
    getBid(bid) {
        let rawQuery = `${getBidRawQuery} WHERE bid.id = ?`;

        let bidQueryAsync = promise.promisify(Bid.query);

        return bidQueryAsync(rawQuery, [bid.id])
            .then(
                (bids) => {

                    return HelperService.formatQueryResult(bids)[0];
                }
            );
    },
    getClientBids(params) {
        let rawQuery = `${getBidRawQuery} WHERE bid.request_id = ? AND bid.is_refused <> true`;

        let bidQueryAsync = promise.promisify(Bid.query);

        return bidQueryAsync(rawQuery, [params.request])
            .then(
                (bids) => {

                    return HelperService.formatQueryResult(bids);
                }
            );
    },
    getSpecialistBids(criteria) {
        let tableAlias = 'bid';
        let rawQuery = HelperService.buildQuery(getBidRawQuery, criteria, tableAlias);

        rawQuery = rawQuery.replace(/\s*request_location.address AS 'request.location.address',/, '');

        rawQuery = rawQuery.replace(
            'request_location.latitude',
            `(request_location.latitude + (2*RAND() - 1)/${RANDOM_COORDINATES_COEFFICIENT})`
        );
        rawQuery = rawQuery.replace(
            'request_location.longitude',
            `(request_location.longitude + (2*RAND()-1)/${RANDOM_COORDINATES_COEFFICIENT})`
        );

        let getBidQueryAsync = promise.promisify(Bid.query);

        return getBidQueryAsync(rawQuery)
            .then(
                (bids) => HelperService.formatQueryResult(bids)
            );
    },
    create(bid) {

        return Request.findOneById(bid.request.id)
            .then(
                (request) => {
                    bid.client = request.owner;

                    return Bid.create(bid);
                }
            );
    }
};

module.exports = BidService;