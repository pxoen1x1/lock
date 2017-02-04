/* global sails, Group, GroupInvitation, AuthService, UserService, MailerService, HelperService */

/**
 * GroupService
 */

'use strict';

let promise = require('bluebird');
let tokenExpirationTime = sails.config.application.tokenExpirationTime;

let getGroupMembersRawQuery = `SELECT user.id,
                                      user.first_name AS firstName,
                                      user.last_name,
                                      CONCAT_WS(' ', user.first_name, user.last_name) AS fullName,
                                      user.phone_number AS phoneNumber,
                                      user.gender,
                                      user.birthday,
                                      user.ssn,
                                      user.is_enabled AS isEnabled,
                                      user.is_email_confirmed AS isEmailConfirmed,
                                      user.portrait,
                                      user.createdAt,
                                      user.updatedAt,
                                      auth.id AS 'auth.id',
                                      auth.email AS 'auth.email',
                                      address.id AS 'address.id',
                                      address.address AS 'address.address',
                                      address.zip AS 'address.zip',
                                      address_city.id AS 'address.city.id',
                                      address_city.city AS 'address.city.city',
                                      address_city.zip AS 'address.city.zip',
                                      address_city.lat AS 'address.city.lat',
                                      address_city.lng AS 'address.city.lng',
                                      address_state.id AS 'address.state.id',
                                      address_state.state AS 'address.state.state',
                                      address_state.code AS 'address.state.code',
                                      details.id AS 'details.id',
                                      details.is_available AS 'details.isAvailable',
                                      details.is_pro AS 'details.isPro',
                                      details.car_license_plate_number AS 'details.carLicensePlateNumber',
                                      details.latitude AS 'details.latitude',
                                      details.longitude AS 'details.longitude',
                                      details.rating AS 'details.rating',
                                      details.is_bg_check_completed AS 'details.isBGCheckCompleted',
                                      details_workingHours.id AS 'details.workingHours.id',
                                      details_workingHours.time_from AS 'details.workingHours.timeFrom',
                                      details_workingHours.time_to AS 'details.workingHours.timeTo'
    FROM groups AS gr
    JOIN group_members__user_groupmembers AS gu ON gu.group_members = gr.id
    RIGHT JOIN users AS user ON user.id = gu.user_groupMembers
    LEFT JOIN auth ON auth.user = user.id
    LEFT JOIN addresses AS address ON address.user_id = user.id
    LEFT JOIN cities AS address_city ON address_city.id = address.city_id
    LEFT JOIN states AS address_state ON address_state.id = address.state_id
    LEFT JOIN user_details AS details ON details.user_id = user.id
    LEFT JOIN working_hours AS details_workingHours ON details_workingHours.id = details.id`;

let GroupService = {
    getGroupMembers(user, filters) {
        let tableAlias = 'gr';
        if (!user || !user.id) {

            return Promise.reject(new Error('User is not defined.'));
        }

        let criteria = {
            where: {
                admin_id: user.id
            },
            sorting: filters.sorting,
            skip: (filters.pagination.page - 1) * filters.pagination.limit,
            limit: filters.pagination.limit
        };

        let rawQuery = HelperService.buildQuery(getGroupMembersRawQuery, criteria, tableAlias);

        let getGroupMembersQueryAsync = promise.promisify(Group.query);

        return getGroupMembersQueryAsync(rawQuery)
            .then(
                (members) => {
                    rawQuery = rawQuery.replace(/^SELECT[\s|\S]*FROM/i, 'SELECT COUNT (*) FROM');
                    rawQuery = rawQuery.replace(/LEFT JOIN [\s|\S]*WHERE/i, 'WHERE');
                    rawQuery = rawQuery.replace(/\sOFFSET \d+/i, '');

                    return [HelperService.formatQueryResult(members), this._getGroupMembersCount(rawQuery)];
                }
            )
            .spread(
                (members, count) => {

                    return {
                        items: members,
                        count: count
                    };
                }
            );
    },
    searchGroupMember(user, query, pagination) {
        let offset = (pagination.page - 1) * pagination.limit;

        let rawQuery = `${getGroupMembersRawQuery} WHERE gr.admin_id = ${user.id} AND
            (user.first_name LIKE '${query}%' OR user.last_name LIKE '${query}%' OR auth.email LIKE '${query}%')
            LIMIT ${pagination.limit} OFFSET ${offset}`;

        let searchGroupMemberQueryAsync = promise.promisify(Group.query);

        return searchGroupMemberQueryAsync(rawQuery)
            .then(
                (members) => {
                    rawQuery = rawQuery.replace(/^SELECT[\s|\S]*FROM/i, 'SELECT COUNT (*) FROM');
                    rawQuery = rawQuery.replace(/\sOFFSET \d+/i, '');

                    return [HelperService.formatQueryResult(members), this._getGroupMembersCount(rawQuery)];
                }
            )
            .spread(
                (members, count) => {

                    return {
                        items: members,
                        count: count
                    };
                }
            );
    },
    joinMember(token) {

        return GroupInvitation.findOneByToken(token)
            .then(
                (invitation) => {

                    return [invitation, Group.findOneById(invitation.group)];
                }
            )
            .spread(
                (invitation, group) => {
                    group.members.add(invitation.user);

                    return [invitation, HelperService.saveModel(group)];
                }
            )
            .spread(
                (invitation, group) => {

                    return [group, GroupInvitation.destroy({id: invitation.id})];
                }
            )
            .spread(
                (group) => (group)
            );
    },
    inviteMember(user, email) {
        let error = new Error();

        return AuthService.findAuth({email: email})
            .then(
                (auth) => {
                    if (!auth) {
                        error.message = `User not found.`;
                        error.isToSend = true;

                        return Promise.reject(error);
                    }

                    return [
                        UserService.getUser({id: auth.user}),
                        Group.findOneByAdmin(user.id)
                            .populate('members')
                    ];
                }
            )
            .spread(
                (user, group) => {
                    if (!user.details) {
                        error.message = `User is not specialist.`;
                        error.isToSend = true;

                        return Promise.reject(error);
                    }

                    let isGroupMember = group.members.some(
                        (member) => member.id === user.id
                    );

                    if (isGroupMember) {
                        error.message = `User is member of group already.`;
                        error.isToSend = true;

                        return Promise.reject(error);
                    }

                    let token = HelperService.generateToken();
                    let tokenExpiration = (new Date(Date.now() + tokenExpirationTime)).toISOString();

                    let groupInvitation = {
                        token: token,
                        group: group,
                        user: user,
                        expiration: tokenExpiration
                    };

                    return [
                        user,
                        group,
                        GroupInvitation.findOrCreate({user: groupInvitation.user.id}, groupInvitation)
                    ];
                }
            )
            .spread(
                (user, group, invitation) => {

                    return MailerService.sendGroupInvitation(user, group, invitation);
                }
            );
    },
    removeMember(user, member) {

        return Group.findOneByAdmin(user.id)
            .populate('members')
            .then(
                (group) => {
                    group.members.remove(member.id);

                    return HelperService.saveModel(group);
                }
            );
    },
    _getGroupMembersCount(rawQuery, data){
        data = data || [];

        if (!rawQuery || !Array.isArray((data))) {

            return Promise.reject(new Error('Query or data is empty.'));
        }

        let getGroupMembersCountQueryAsync = promise.promisify(Group.query);

        return getGroupMembersCountQueryAsync(rawQuery, data)
            .then(
                (count) => {
                    if (!count || count.length === 0) {
                        return 0;
                    }

                    count = count[0];

                    return Object.keys(count)
                        .map(key => count[key])[0];
                }
            );
    },
    getAdminsGroup(user) {

        return Group.findOneByAdmin(user.id)
            .populate('licenses');
    },
};

module.exports = GroupService;

