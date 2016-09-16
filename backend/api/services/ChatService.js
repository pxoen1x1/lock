/* global Chat, HelperService */

'use strict';

let promise = require('bluebird');

let ChatService = {
    getChats(params) {
        let rawQuery = `SELECT chat.id AS 'id',
                               chat.is_accepted_by_client AS 'isAcceptedByClient',
                               chat.is_accepted_by_specialist AS 'isAcceptedBySpecialist',
                               chat.createdAt AS 'createdAt',
                               chat.updatedAt AS 'updatedAt',
                               request.id AS 'request.id',
                               request.forDate AS 'request.forDate',
                               request.distance AS 'request.distance',
                               request.description AS 'request.description',
                               request.executed AS 'request.executed',
                               request.cost AS 'request.cost',
                               request.closed AS 'request.closed',
                               request.status AS 'request.status',
                               request.is_public AS 'request.isPublic',
                               request.confirmed_by_customer AS 'request.confirmedByCustomer',
                               request.confirmed_by_specialist AS 'request.confirmedBySpecialist',
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
                               client_details.id AS 'client.details.id',
                               client_details.is_available AS 'client.details.isAvailable',
                               client_details.is_pro AS 'client.details.isPro',
                               client_details_location.id AS 'client.details.location.id',
                               client_details_location.address AS 'client.details.location.address',
                               client_details_location.latitude AS 'client.details.location.latitude',
                               client_details_location.longitude AS 'client.details.location.longitude',
                               client_details_license.id AS 'client.details.license.id',
                               client_details_license.number AS 'client.details.license.number',
                               client_details_license.date AS 'client.details.license.date',
                               client_details_workingHours.id AS 'client.details.workingHours.id',
                               client_details_workingHours.time_from AS 'client.details.workingHours.timeFrom',
                               client_details_workingHours.time_to AS 'client.details.workingHours.timeTo',
                               client_lastMessage.id AS 'client.lastMessage.id',
                               client_lastMessage.message AS 'client.lastMessage.message',
                               client_lastMessage.type AS 'client.lastMessage.type',
                               client_lastMessage.is_read AS 'client.lastMessage.isRead',
                               client_lastMessage.sender_id AS 'client.lastMessage.senderId',
                               client_lastMessage.recipient_id AS 'client.lastMessage.recipientId',
                               client_lastMessage.chat_id AS 'client.lastMessage.chatId',
                               client_lastMessage.createdAt AS 'client.lastMessage.createdAt',
                               client_lastMessage.updatedAt AS 'client.lastMessage.updatedAt',
                               contact.id AS 'contact.id',
                               contact.first_name AS 'contact.firstName',
                               contact.last_name AS 'contact.lastName',
                               CONCAT_WS(' ', contact.first_name, contact.last_name) AS 'contact.fullName',
                               contact.phone_number AS 'contact.phoneNumber',
                               contact.gender AS 'contact.gender',
                               contact.birthday AS 'contact.birthday',
                               contact.ssn AS 'contact.ssn',
                               contact.is_enabled AS 'contact.isEnabled',
                               contact.is_email_confirmed AS 'contact.isEmailConfirmed',
                               contact.portrait AS 'contact.portrait',
                               contact.createdAt AS 'contact.createdAt',
                               contact.updatedAt AS'contact.updatedAt',
                               contact_auth.id AS 'contact.auth.id',
                               contact_auth.email AS 'contact.auth.email',
                               contact_address.id AS 'contact.address.id',
                               contact_address.address AS 'contact.address.address',
                               contact_address.zip AS 'contact.address.zip',
                               contact_address_city.id AS 'contact.address.city.id',
                               contact_address_city.city AS 'contact.address.city.city',
                               contact_address_city.zip AS 'contact.address.city.zip',
                               contact_address_city.lat AS 'contact.address.city.lat',
                               contact_address_city.lng AS 'contact.address.city.lng',
                               contact_address_state.id AS 'contact.address.state.id',
                               contact_address_state.state AS 'contact.address.state.state',
                               contact_address_state.code AS 'contact.address.state.code',
                               contact_details.id AS 'contact.details.id',
                               contact_details.is_available AS 'contact.details.isAvailable',
                               contact_details.is_pro AS 'contact.details.isPro',
                               contact_details_location.id AS 'contact.details.location.id',
                               contact_details_location.address AS 'contact.details.location.address',
                               contact_details_location.latitude AS 'contact.details.location.latitude',
                               contact_details_location.longitude AS 'contact.details.location.longitude',
                               contact_details_license.id AS 'contact.details.license.id',
                               contact_details_license.number AS 'contact.details.license.number',
                               contact_details_license.date AS 'contact.details.license.date',
                               contact_details_workingHours.id AS 'contact.details.workingHours.id',
                               contact_details_workingHours.time_from AS 'contact.details.workingHours.timeFrom',
                               contact_details_workingHours.time_to AS 'contact.details.workingHours.timeTo',
                               contact_lastMessage.id AS 'contact.lastMessage.id',
                               contact_lastMessage.message AS 'contact.lastMessage.message',
                               contact_lastMessage.type AS 'contact.lastMessage.type',
                               contact_lastMessage.is_read AS 'contact.lastMessage.isRead',
                               contact_lastMessage.sender_id AS 'contact.lastMessage.senderId',
                               contact_lastMessage.recipient_id AS 'contact.lastMessage.recipientId',
                               contact_lastMessage.chat_id AS 'contact.lastMessage.chatId',
                               contact_lastMessage.createdAt AS 'contact.lastMessage.createdAt',
                               contact_lastMessage.updatedAt AS 'contact.lastMessage.updatedAt'
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
        LEFT JOIN user_details AS client_details ON client_details.user_id = client.id
        LEFT JOIN locations AS client_details_location ON client_details_location.id = client_details.location_id
        LEFT JOIN licenses AS client_details_license ON client_details_license.user_details_id = client_details.id
        LEFT JOIN working_hours AS client_details_workingHours
                                                      ON client_details_workingHours.user_details_id = client_details.id
        LEFT JOIN (SELECT * FROM messages
                    WHERE updatedAt IN (
                      SELECT MAX(updatedAt) FROM messages GROUP BY sender_id
                    )
                  ) AS client_lastMessage ON client_lastMessage.sender_id = client.id
        LEFT JOIN users AS contact ON contact.id = chat.contact_id
        LEFT JOIN auth AS contact_auth ON contact_auth.user = contact.id
        LEFT JOIN addresses AS contact_address ON contact_address.user_id = contact.id
        LEFT JOIN cities AS contact_address_city ON contact_address_city.id = contact_address.city_id
        LEFT JOIN states AS contact_address_state ON contact_address_state.id = contact_address.state_id
        LEFT JOIN user_details AS contact_details ON contact_details.user_id = contact.id
        LEFT JOIN locations AS contact_details_location ON contact_details_location.id = contact_details.location_id
        LEFT JOIN licenses AS contact_details_license ON contact_details_license.user_details_id = contact_details.id
        LEFT JOIN working_hours AS contact_details_workingHours
                                                    ON contact_details_workingHours.user_details_id = contact_details.id
        LEFT JOIN (SELECT * FROM messages
                    WHERE updatedAt IN (
                      SELECT MAX(updatedAt) FROM messages GROUP BY sender_id
                    )
                  ) AS contact_lastMessage ON contact_lastMessage.sender_id = contact.id
        WHERE chat.request_id = ?`;

        let chatQueryAsync = promise.promisify(Chat.query);

        return chatQueryAsync(rawQuery, [params.request])
            .then(
                (chats) => {

                    return HelperService.formatObject(chats);
                }
            );
    }
};

module.exports = ChatService;
