/* global sails, User, AdminService */

/**
 * AdminController
 *
 * @description :: Server-side logic for managing Admin's actions
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

'use strict';

let AdminController = {
    getUsers(req, res) {
        let params = req.allParams();
        let sorting = params.order || 'createdAt DESC';

        let pagination = {};
        pagination.limit = params.limit || sails.config.application.queryLimit;
        pagination.page = params.page || 1;

        let criteria = {
            where: {},
            sorting: sorting,
            skip: (pagination.page - 1) * pagination.limit,
            limit: pagination.limit
        };
        if (params.isEnabled) {
            criteria.where = {
                is_enabled: params.isEnabled === 'true'
            }
        }

        AdminService.getUsers(criteria)
            .then(
                (users) => {

                    return [AdminService.getUsersCount(criteria.where), users];
                }
            )
            .spread(
                (totalCount, users) => res.ok({
                    items: users,
                    currentPageNumber: pagination.page,
                    totalCount: totalCount
                })
            )
            .catch(
                (err) => {
                    sails.log.error(err);

                    res.serverError();
                }
            );
    },
    deleteUser(req, res) {
        let userId = req.params.userId;

        AdminService.deleteUser(userId)
            .then(
                () => {
                    res.ok();
                }
            )
            .catch(
                (err) => {
                    sails.log.error(err);

                    res.serverError();
                }
            );
    }
};

module.exports = AdminController;

