/* global sails, GroupService, UserService */
/**
 * GroupController
 *
 * @description :: Server-side logic for managing Groups
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

'use strict';

let GroupController = {
    getGroupMember(req, res){
        let memberId = req.params.memberId;

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
    }
};

module.exports = GroupController;
