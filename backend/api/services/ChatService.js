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
                               owner_details.id AS 'owner.details.id',
                               owner_details.is_available AS 'owner.details.isAvailable',
                               owner_details.is_pro AS 'owner.details.isPro',
                               owner_details_location.id AS 'owner.details.location.id',
                               owner_details_location.address AS 'owner.details.location.address',
                               owner_details_location.latitude AS 'owner.details.location.latitude',
                               owner_details_location.longitude AS 'owner.details.location.longitude',
                               owner_details_license.id AS 'owner.details.license.id',
                               owner_details_license.number AS 'owner.details.license.number',
                               owner_details_license.date AS 'owner.details.license.date',
                               owner_details_workingHours.id AS 'owner.details.workingHours.id',
                               owner_details_workingHours.time_from AS 'owner.details.workingHours.timeFrom',
                               owner_details_workingHours.time_to AS 'owner.details.workingHours.timeTo',
                               owner_lastMessage.id AS 'owner.lastMessage.id',
                               owner_lastMessage.text AS 'owner.lastMessage.text',
                               owner_lastMessage.isOffer AS 'owner.lastMessage.isOffer',
                               owner_lastMessage.isAgreement AS 'owner.lastMessage.isAgreement',
                               owner_lastMessage.isRead AS 'owner.lastMessage.isRead',
                               owner_lastMessage.owner_id AS 'owner.lastMessage.ownerId',
                               owner_lastMessage.recipient_id AS 'owner.lastMessage.recipientId',
                               owner_lastMessage.chat_id AS 'owner.lastMessage.chatId',
                               owner_lastMessage.createdAt AS 'owner.lastMessage.createdAt',
                               owner_lastMessage.updatedAt AS 'owner.lastMessage.updatedAt',
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
                               contact_lastMessage.text AS 'contact.lastMessage.text',
                               contact_lastMessage.isOffer AS 'contact.lastMessage.isOffer',
                               contact_lastMessage.isAgreement AS 'contact.lastMessage.isAgreement',
                               contact_lastMessage.isRead AS 'contact.lastMessage.isRead',
                               contact_lastMessage.owner_id AS 'contact.lastMessage.ownerId',
                               contact_lastMessage.recipient_id AS 'contact.lastMessage.recipientId',
                               contact_lastMessage.chat_id AS 'contact.lastMessage.chatId',
                               contact_lastMessage.createdAt AS 'contact.lastMessage.createdAt',
                               contact_lastMessage.updatedAt AS 'contact.lastMessage.updatedAt'
        FROM chats AS chat
        LEFT JOIN requests AS request ON request.id = chat.request_id
        LEFT JOIN languages AS request_language ON request_language.id = request.language_id
        LEFT JOIN service_types AS request_serviceType ON request_serviceType.id = request.service_type_id
        LEFT JOIN locations AS request_location ON request_location.id = request.location_id
        LEFT JOIN users AS owner ON owner.id = chat.owner_id
        LEFT JOIN auth AS owner_auth ON owner_auth.user = owner.id
        LEFT JOIN addresses AS owner_address ON owner_address.user_id = owner.id
        LEFT JOIN cities AS owner_address_city ON owner_address_city.id = owner_address.city_id
        LEFT JOIN states AS owner_address_state ON owner_address_state.id = owner_address.state_id
        LEFT JOIN user_details AS owner_details ON owner_details.user_id = owner.id
        LEFT JOIN locations AS owner_details_location ON owner_details_location.id = owner_details.location_id
        LEFT JOIN licenses AS owner_details_license ON owner_details_license.user_details_id = owner_details.id
        LEFT JOIN working_hours AS owner_details_workingHours
                                                        ON owner_details_workingHours.user_details_id = owner_details.id
        LEFT JOIN (SELECT * FROM messages
                    WHERE updatedAt IN (
                      SELECT MAX(updatedAt) FROM messages GROUP BY owner_id
                    )
                  ) AS owner_lastMessage ON owner_lastMessage.owner_id = owner.id
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
                      SELECT MAX(updatedAt) FROM messages GROUP BY owner_id
                    )
                  ) AS contact_lastMessage ON contact_lastMessage.owner_id = contact.id
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
