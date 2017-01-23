/* global sails, Chat, User, HelperService */

'use strict';

const RANDOM_COORDINATES_COEFFICIENT = sails.config.requests.RANDOM_COORDINATES_COEFFICIENT;

let promise = require('bluebird');
let getChatsRawQuery = `SELECT chat.id,
                       chat.createdAt,
                       chat.updatedAt,
                       request.id AS 'request.id',
                       request.distance AS 'request.distance',
                       request.description AS 'request.description',
                       request.for_date AS 'request.forDate',
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
                       request_executor.id AS 'request.executor.id',
                       request_executor.first_name AS 'request.executor.firstName',
                       request_executor.last_name AS 'request.executor.lastName',
                       CONCAT_WS(' ', request_executor.first_name, request_executor.last_name) AS
                         'request.executor.fullName',
                       request_executor.phone_number AS 'request.executor.phoneNumber',
                       request_executor.gender AS 'request.executor.gender',
                       request_executor.birthday AS 'request.executor.birthday',
                       request_executor.ssn AS 'request.executor.ssn',
                       request_executor.is_enabled AS 'request.executor.isEnabled',
                       request_executor.is_email_confirmed AS 'request.executor.isEmailConfirmed',
                       request_executor.portrait AS 'request.executor.portrait',
                       request_executor.createdAt AS 'request.executor.createdAt',
                       request_executor.updatedAt AS'request.executor.updatedAt',
                       request_executor_auth.id AS 'request.executor.auth.id',
                       request_executor_auth.email AS 'request.executor.auth.email',
                       request_executor_address.id AS 'request.executor.address.id',
                       request_executor_address.address AS 'request.executor.address.address',
                       request_executor_address.zip AS 'request.executor.address.zip',
                       request_executor_address_city.id AS 'request.executor.address.city.id',
                       request_executor_address_city.city AS 'request.executor.address.city.city',
                       request_executor_address_city.zip AS 'request.executor.address.city.zip',
                       request_executor_address_city.lat AS 'request.executor.address.city.lat',
                       request_executor_address_city.lng AS 'request.executor.address.city.lng',
                       request_executor_address_state.id AS 'request.executor.address.state.id',
                       request_executor_address_state.state AS 'request.executor.address.state.state',
                       request_executor_address_state.code AS 'request.executor.address.state.code',
                       request_executor_details.id AS 'request.executor.details.id',
                       request_executor_details.is_available AS 'request.executor.details.isAvailable',
                       request_executor_details.is_pro AS 'request.executor.details.isPro',
                       request_executor_details.car_license_plate_number AS
                            'request.executor.details.carLicensePlateNumber',
                       request_executor_details.latitude AS 'request.executor.details.latitude',
                       request_executor_details.longitude AS 'request.executor.details.longitude',
                       request_executor_details.rating AS 'request.executor.details.rating',
                       request_executor_details_workingHours.id AS 'request.executor.details.workingHours.id',
                       request_executor_details_workingHours.time_from AS
                         'request.executor.details.workingHours.timeFrom',
                       request_executor_details_workingHours.time_to AS 'request.executor.details.workingHours.timeTo',
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
        LEFT JOIN users AS request_executor ON request_executor.id = request.executor_id
        LEFT JOIN auth AS request_executor_auth ON request_executor_auth.user = request_executor.id
        LEFT JOIN addresses AS request_executor_address ON request_executor_address.user_id = request_executor.id
        LEFT JOIN cities AS request_executor_address_city
                  ON request_executor_address_city.id = request_executor_address.city_id
        LEFT JOIN states AS request_executor_address_state
                  ON request_executor_address_state.id = request_executor_address.state_id
        LEFT JOIN user_details AS request_executor_details ON request_executor_details.user_id = request_executor.id
        LEFT JOIN working_hours AS request_executor_details_workingHours
                  ON request_executor_details_workingHours.user_details_id = request_executor_details.id
        LEFT JOIN users AS owner ON owner.id = chat.owner_id
        LEFT JOIN auth AS owner_auth ON owner_auth.user = owner.id
        LEFT JOIN addresses AS owner_address ON owner_address.user_id = owner.id
        LEFT JOIN cities AS owner_address_city ON owner_address_city.id = owner_address.city_id
        LEFT JOIN states AS owner_address_state ON owner_address_state.id = owner_address.state_id`;

let getChatMembersRawQuery = `SELECT member.id,
                             member.first_name AS 'firstName',
                             member.last_name AS 'lastName',
                             CONCAT_WS(' ', member.first_name, member.last_name) AS 'fullName',
                             member.phone_number AS 'phoneNumber',
                             member.gender,
                             member.birthday,
                             member.ssn,
                             member.is_enabled AS 'isEnabled',
                             member.is_email_confirmed AS 'isEmailConfirmed',
                             member.portrait,
                             member.createdAt,
                             member.updatedAt,
                             member_auth.id AS 'auth.id',
                             member_auth.email AS 'auth.email',
                             member_address.id AS 'address.id',
                             member_address.address AS 'address.address',
                             member_address.zip AS 'address.zip',
                             member_address_city.id AS 'address.city.id',
                             member_address_city.city AS 'address.city.city',
                             member_address_city.zip AS 'address.city.zip',
                             member_address_city.lat AS 'address.city.lat',
                             member_address_city.lng AS 'address.city.lng',
                             member_address_state.id AS 'address.state.id',
                             member_address_state.state AS 'address.state.state',
                             member_address_state.code AS 'address.state.code',
                             member_details.id AS 'details.id',
                             member_details.is_available AS 'details.isAvailable',
                             member_details.is_pro AS 'details.isPro',
                             member_details.latitude AS 'details.latitude',
                             member_details.longitude AS 'details.longitude',
                             member_details.rating AS 'details.rating',
                             member_details_workingHours.id AS 'details.workingHours.id',
                             member_details_workingHours.time_from AS 'details.workingHours.timeFrom',
                             member_details_workingHours.time_to AS 'details.workingHours.timeTo'
        FROM chats AS chat
        JOIN  chat_members__user_chatmembers AS cu ON cu.chat_members = chat.id
        RIGHT JOIN users as member ON member.id = cu.user_chatMembers
        LEFT JOIN auth AS member_auth ON member_auth.user = member.id
        LEFT JOIN addresses AS member_address ON member_address.user_id = member.id
        LEFT JOIN cities AS member_address_city ON member_address_city.id = member_address.city_id
        LEFT JOIN states AS member_address_state ON member_address_state.id = member_address.state_id
        LEFT JOIN user_details AS member_details ON member_details.user_id = member.id
        LEFT JOIN working_hours AS member_details_workingHours
                  ON member_details_workingHours.user_details_id = member_details.id
        WHERE chat.id = ?`;

let ChatService = {
    getChat(chat) {
        let rawQuery = `${getChatsRawQuery} WHERE chat.id = ?`;

        let chatQueryAsync = promise.promisify(Chat.query);

        return chatQueryAsync(rawQuery, [chat.id])
            .then(
                (chat) => HelperService.formatQueryResult(chat)[0]
            );
    },
    getChatMembers(chat) {
        let rawQuery = getChatMembersRawQuery;

        let chatQueryAsync = promise.promisify(Chat.query);

        return chatQueryAsync(rawQuery, [chat.id])
            .then(
                (members) => HelperService.formatQueryResult(members)
            );
    },
    getSpecialistChatByRequest(request, member) {
        let rawQuery = `${getChatsRawQuery}
        JOIN  chat_members__user_chatmembers AS cu ON cu.user_chatMembers = ?
        WHERE chat.id = cu.chat_members AND chat.request_id = ? LIMIT 1`;

        let chatQueryAsync = promise.promisify(Chat.query);

        return chatQueryAsync(rawQuery, [member.id, request.id])
            .then(
                (chats) => {

                    return HelperService.formatQueryResult(chats)[0];
                }
            );
    },
    getChats(criteria) {

        return Chat.find(criteria)
            .populateAll();
    },
    getSpecialistChats(member) {
        let rawQuery = `${getChatsRawQuery}
        JOIN  chat_members__user_chatmembers AS cu ON cu.user_chatMembers = ?
        WHERE chat.id = cu.chat_members`;

        rawQuery = rawQuery.replace(/\s*request_location.address AS 'request.location.address',/, '');
        rawQuery = rawQuery.replace(/\s*owner.phone_number AS 'owner.phoneNumber',/, '');
        rawQuery = rawQuery.replace(/\s*owner_auth.email AS 'owner.auth.email',/, '');

        rawQuery = rawQuery.replace(
            'request_location.latitude',
            `(request_location.latitude + (2*RAND() - 1)/${RANDOM_COORDINATES_COEFFICIENT})`
        );
        rawQuery = rawQuery.replace(
            'request_location.longitude',
            `(request_location.longitude + (2*RAND()-1)/${RANDOM_COORDINATES_COEFFICIENT})`
        );

        let chatQueryAsync = promise.promisify(Chat.query);

        return chatQueryAsync(rawQuery, [member.id])
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
    },
    joinGroupMemberToChat(chat, member) {

        return Chat.findOneById(chat.id)
            .populate('members')
            .then(
                (chat) => {
                    chat.members.add(member);

                    return [User.findOneById(member.id), HelperService.saveModel(chat)];
                }
            )
            .spread(
                (user) => user
            );
    }
};

module.exports = ChatService;
