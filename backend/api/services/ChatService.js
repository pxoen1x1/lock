/* global sails, Chat, User, HelperService */

'use strict';

const RANDOM_COORDINATES_COEFFICIENT = sails.config.requests.RANDOM_COORDINATES_COEFFICIENT;

let promise = require('bluebird');
let getChatsRawQuery = `SELECT chat.id,
                               chat.createdAt,
                               chat.updatedAt,
                               request.id AS 'request.id',
                               request.for_date AS 'request.forDate',
                               request.distance AS 'request.distance',
                               request.description AS 'request.description',
                               request.cost AS 'request.cost',
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
                               owner_lastMessage.id AS 'owner.lastMessage.id',
                               owner_lastMessage.message AS 'owner.lastMessage.message',
                               owner_lastMessage.type AS 'owner.lastMessage.type',
                               owner_lastMessage.is_read AS 'owner.lastMessage.isRead',
                               owner_lastMessage.sender_id AS 'owner.lastMessage.senderId',
                               owner_lastMessage.chat_id AS 'owner.lastMessage.chatId',
                               owner_lastMessage.createdAt AS 'owner.lastMessage.createdAt',
                               owner_lastMessage.updatedAt AS 'owner.lastMessage.updatedAt'
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
        LEFT JOIN (SELECT * FROM messages
                    WHERE updatedAt IN (
                      SELECT MAX(updatedAt) FROM messages GROUP BY sender_id
                    )
                  ) AS owner_lastMessage ON owner_lastMessage.sender_id = owner.id`;

let ChatService = {
    getChat(chat) {

        return Chat.findOneById(chat.id)
            .populateAll();
    },
    getChats(criteria) {

        return Chat.find(criteria)
            .populateAll();
    },
    getSpecialistChats(criteria) {
        let tableAlias = 'chat';

        let rawQuery = HelperService.buildQuery(getChatsRawQuery, criteria, tableAlias);

        rawQuery = rawQuery.replace(/\s*request_location.address AS 'request.location.address',/, '');
        rawQuery = rawQuery.replace(/\s*owner.phone_number AS 'owner.phoneNumber',/, '');
        rawQuery = rawQuery.replace(/\s*owner_auth.id AS 'owner.auth.id',/, '');
        rawQuery = rawQuery.replace(/\s*owner_auth.email AS 'owner.auth.email',/, '');

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
    createChat(chat, member) {

        return User.findOne({id: member.id})
            .then(
                (user) => {
                    if (!user) {

                        return Promise.reject('User not found.');
                    }

                    if (user.group) {
                        chat.title = user.group.name;
                        chat.photo = user.group.photo;
                    } else {
                        chat.title = user.fullName();
                        chat.photo = user.portrait;
                    }

                    return Chat.create(chat);
                }
            )
            .then(
                (chat) => Chat.findOneById(chat.id)
                    .populateAll()
            );
    }
};

module.exports = ChatService;
