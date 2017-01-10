/* global sails, GroupService, UserService */
/**
 * GroupController
 *
 * @description :: Server-side logic for managing Groups
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

'use strict';

let GroupController = {
    getAdminsGroup(req, res) {
        let user = req.session.user;

        GroupService.getAdminsGroup(user)
            .then(
                (foundGroup) => {

                    return res.ok(
                        {
                            group: foundGroup
                        }
                    );
                }
            )
            .catch(
                (err) => {
                    sails.log.error(err);

                    return res.serverError();
                }
            );
    },
    getGroupMember(req, res){
        let memberId = req.params.memberId;

        if (!memberId) {

            return res.badRequest(
                {
                    message: req.__('Submitted data is invalid.')
                }
            );
        }

        UserService.getUser({id: memberId})
            .then(
                (foundUser) => res.ok(
                    {
                        user: foundUser
                    }
                )
            )
            .catch(
                (err) => {
                    sails.log.error(err);

                    return res.serverError();
                }
            );
    },
    getGroupMembers(req, res) {
        let params = req.allParams();

        let user = req.session.user;

        let sorting = params.order || 'updatedAt DESC';
        let pagination = {};

        pagination.limit = params.limit || sails.config.application.queryLimit;
        pagination.page = params.page || 1;

        let filters = {
            sorting: sorting,
            pagination: pagination
        };

        GroupService.getGroupMembers(user, filters)
            .then(
                (members) => res.ok({
                    items: members.items,
                    currentPageNumber: +pagination.page,
                    totalCount: members.count
                })
            )
            .catch(
                (err) => {
                    sails.log.error(err);

                    return res.serverError();
                }
            );
    },
    searchGroupMember(req, res) {
        let params = req.allParams();
        let query = params.query;

        if (!query || query.length < 3) {

            return res.badRequest(
                {
                    message: req.__('Submitted data is invalid.')
                }
            );
        }

        let user = req.session.user;

        let pagination = {};

        pagination.limit = params.limit || sails.config.application.queryLimit;
        pagination.page = params.page || 1;

        GroupService.searchGroupMember(user, query, pagination)
            .then(
                (members) => res.ok(
                    {
                        items: members.items,
                        currentPageNumber: +pagination.page,
                        totalCount: members.count
                    }
                )
            )
            .catch(
                (err) => {
                    sails.log.error(err);

                    return res.serverError();
                }
            );
    },
    joinMember(req, res) {
        let token = req.param('token');

        if (!token) {

            return res.badRequest(
                {
                    message: req.__('Submitted data is invalid.')
                }
            );
        }

        GroupService.joinMember(token)
            .then(
                (group) => res.render(
                    'joinMember',
                    {
                        group: group,
                        homePage: sails.config.homePage
                    }
                )
            )
            .catch(
                (err) => {
                    sails.log.error(err);

                    return res.serverError();
                }
            );
    },
    inviteMember(req, res) {
        let email = req.body.email;
        let user = req.session.user;

        if (!email) {

            return res.badRequest(
                {
                    message: req.__('Submitted data is invalid.')
                }
            );
        }

        GroupService.inviteMember(user, email)
            .then(
                (groupInvitation) => res.created(
                    {
                        invitation: groupInvitation
                    }
                )
            )
            .catch(
                (err) => {
                    sails.log.error(err);

                    let message = err.isToSend ? {message: req.__(err.message)} : null;

                    return res.serverError(message);
                }
            );
    },
    removeMember(req, res) {
        let memberId = parseInt(req.params.memberId, 10);
        let user = req.session.user;

        let member = {
            id: memberId
        };

        GroupService.removeMember(user, member)
            .then(
                () => res.ok(
                    {
                        user: member
                    }
                )
            )
            .catch(
                (err) => {
                    sails.log.error(err);

                    let message = err.isToSend ? {message: req.__(err.message)} : null;

                    return res.serverError(message);
                }
            );
    }
};

module.exports = GroupController;
