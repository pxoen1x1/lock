/* global sails, Chat, User, HelperService */

'use strict';

const RANDOM_COORDINATES_COEFFICIENT = sails.config.requests.RANDOM_COORDINATES_COEFFICIENT;

let promise = require('bluebird');
let getSpecialistsChatsRawQuery = `SELECT chat.id,
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
                               (request_location.latitude + (2*RAND() - 1)/${RANDOM_COORDINATES_COEFFICIENT})
                                 AS 'request.location.latitude',
                               (request_location.longitude + (2*RAND() - 1)/${RANDOM_COORDINATES_COEFFICIENT})
                                 AS 'request.location.longitude',
                               owner.id AS 'owner.id',
                               owner.first_name AS 'owner.firstName',
                               owner.last_name AS 'owner.lastName',
                               CONCAT_WS(' ', owner.first_name, owner.last_name) AS 'owner.fullName',
                               owner.gender AS 'owner.gender',
                               owner.portrait AS 'owner.portrait',
                               owner.createdAt AS 'owner.createdAt',
                               owner.updatedAt AS'owner.updatedAt'
        FROM chats AS chat
        LEFT JOIN requests AS request ON request.id = chat.request_id
        LEFT JOIN languages AS request_language ON request_language.id = request.language_id
        LEFT JOIN service_types AS request_serviceType ON request_serviceType.id = request.service_type_id
        LEFT JOIN locations AS request_location ON request_location.id = request.location_id
        LEFT JOIN users AS owner ON owner.id = chat.owner_id`;

let ChatService = {
    getChat(chat) {

        return Chat.findOneById(chat.id)
            .populateAll();
    },
    getChats(criteria) {

        return Chat.find(criteria)
            .populateAll();
    },
    getSpecialistChats(member) {
        let rawQuery = `${getSpecialistsChatsRawQuery}
        JOIN  chat_members__user_chatmembers AS cu ON cu.user_chatMembers = ${member.id}
        WHERE chat.id = cu.chat_members`;

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
