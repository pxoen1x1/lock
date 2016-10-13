/* global sails, Chat, HelperService */

'use strict';

const RANDOM_COORDINATES_COEFFICIENT = sails.config.requests.RANDOM_COORDINATES_COEFFICIENT;

let promise = require('bluebird');
let getChatsRawQuery = `SELECT chat.id,
                               chat.is_accepted_by_client AS 'isAcceptedByClient',
                               chat.is_accepted_by_specialist AS 'isAcceptedBySpecialist',
                               chat.createdAt,
                               chat.updatedAt,
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
                               client_lastMessage.id AS 'client.lastMessage.id',
                               client_lastMessage.message AS 'client.lastMessage.message',
                               client_lastMessage.type AS 'client.lastMessage.type',
                               client_lastMessage.is_read AS 'client.lastMessage.isRead',
                               client_lastMessage.sender_id AS 'client.lastMessage.senderId',
                               client_lastMessage.recipient_id AS 'client.lastMessage.recipientId',
                               client_lastMessage.chat_id AS 'client.lastMessage.chatId',
                               client_lastMessage.createdAt AS 'client.lastMessage.createdAt',
                               client_lastMessage.updatedAt AS 'client.lastMessage.updatedAt',
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
                               specialist_details_workingHours.time_to AS 'specialist.details.workingHours.timeTo',
                               specialist_lastMessage.id AS 'specialist.lastMessage.id',
                               specialist_lastMessage.message AS 'specialist.lastMessage.message',
                               specialist_lastMessage.type AS 'specialist.lastMessage.type',
                               specialist_lastMessage.is_read AS 'specialist.lastMessage.isRead',
                               specialist_lastMessage.sender_id AS 'specialist.lastMessage.senderId',
                               specialist_lastMessage.recipient_id AS 'specialist.lastMessage.recipientId',
                               specialist_lastMessage.chat_id AS 'specialist.lastMessage.chatId',
                               specialist_lastMessage.createdAt AS 'specialist.lastMessage.createdAt',
                               specialist_lastMessage.updatedAt AS 'specialist.lastMessage.updatedAt'
        FROM chats AS chat
        LEFT JOIN requests AS request ON request.id = chat.request_id
        LEFT JOIN languages AS request_language ON request_language.id = request.language_id
        LEFT JOIN service_types AS request_serviceType ON request_serviceType.id = request.service_type_id
        LEFT JOIN locations AS request_location ON request_location.id = request.location_id
        LEFT JOIN users AS client ON client.id = chat.client_id
        LEFT JOIN auth AS client_auth ON client_auth.user = client.id
        LEFT JOIN addresses AS client_address ON client_address.user_id = client.id
        LEFT JOIN cities AS client_address_city ON client_address_city.id = client_address.city_id
        LEFT JOIN states AS client_address_state ON client_address_state.id = client_address.state_id
        LEFT JOIN (SELECT * FROM messages
                    WHERE updatedAt IN (
                      SELECT MAX(updatedAt) FROM messages GROUP BY sender_id
                    )
                  ) AS client_lastMessage ON client_lastMessage.sender_id = client.id
        LEFT JOIN users AS specialist ON specialist.id = chat.specialist_id
        LEFT JOIN auth AS specialist_auth ON specialist_auth.user = specialist.id
        LEFT JOIN addresses AS specialist_address ON specialist_address.user_id = specialist.id
        LEFT JOIN cities AS specialist_address_city ON specialist_address_city.id = specialist_address.city_id
        LEFT JOIN states AS specialist_address_state ON specialist_address_state.id = specialist_address.state_id
        LEFT JOIN user_details AS specialist_details ON specialist_details.user_id = specialist.id
        LEFT JOIN licenses AS specialist_details_license
                  ON specialist_details_license.user_details_id = specialist_details.id
        LEFT JOIN working_hours AS specialist_details_workingHours
                  ON specialist_details_workingHours.user_details_id = specialist_details.id
        LEFT JOIN (SELECT * FROM messages
                    WHERE updatedAt IN (
                      SELECT MAX(updatedAt) FROM messages GROUP BY sender_id
                    )
                  ) AS specialist_lastMessage ON specialist_lastMessage.sender_id = specialist.id`;

let ChatService = {
    getChat(chat) {
        let rawQuery = `${getChatsRawQuery} WHERE chat.id = ?`;

        let chatQueryAsync = promise.promisify(Chat.query);

        return chatQueryAsync(rawQuery, [chat.id])
            .then(
                (chats) => {

                    return HelperService.formatQueryResult(chats)[0];
                }
            );
    },
    getChats(criteria) {
        let tableAlias = 'chat';
        let rawQuery = HelperService.buildQuery(getChatsRawQuery, criteria, tableAlias);

        let chatQueryAsync = promise.promisify(Chat.query);

        return chatQueryAsync(rawQuery)
            .then(
                (chats) => {

                    return HelperService.formatQueryResult(chats);
                }
            );
    },
    getSpecialistChats(criteria) {
        let tableAlias = 'chat';

        let rawQuery = HelperService.buildQuery(getChatsRawQuery, criteria, tableAlias);

        rawQuery = rawQuery.replace(/\s*request_location.address AS 'request.location.address',/, '');
        rawQuery = rawQuery.replace(/\s*client.phone_number AS 'client.phoneNumber',/, '');
        rawQuery = rawQuery.replace(/\s*client_auth.id AS 'client.auth.id',/, '');
        rawQuery = rawQuery.replace(/\s*client_auth.email AS 'client.auth.email',/, '');

        rawQuery = rawQuery.replace(
            'request_location.latitude',
            `(request_location.latitude + (2*RAND() - 1)/${RANDOM_COORDINATES_COEFFICIENT})`
        );
        rawQuery = rawQuery.replace(
            'request_location.longitude',
            `(request_location.longitude + (2*RAND() - 1)/${RANDOM_COORDINATES_COEFFICIENT})`
        );

        let chatQueryAsync = promise.promisify(Chat.query);

        return chatQueryAsync(rawQuery)
            .then(
                (chats) => {

                    return HelperService.formatQueryResult(chats);
                }
            );
    },
    createChat(chat) {

        return Chat.create(chat)
            .then(
                (chat) => this.getChat(chat)
            );
    }
};

module.exports = ChatService;
