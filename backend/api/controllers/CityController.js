/*global sails, City, CityService*/

/**
 * CityController
 *
 * @description :: Server-side logic for managing Cities
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

'use strict';

let CityController = {
    getCitiesByState(req, res) {
        let stateId = req.params.stateId;

        if (!stateId) {

            return res.badRequest({
                message: req.__('State is not defined.')
            });
        }

        let limit = req.param('limit') || sails.config.application.queryLimit;
        let currentPageNumber = req.param('page') || 1;
        let query = req.param('query');

        let searchCriteria = {
            where: {
                state: stateId
            }
        };

        if (query && query.length >= 2) {
            searchCriteria.where.city = {
                'contains': query
            };
        }

        City.find(searchCriteria)
            .populate('state')
            .paginate(
                {
                    page: currentPageNumber,
                    limit: limit
                }
            )
            .exec(
                (err, cities) => {
                    if (err) {

                        return res.serverError();
                    }

                    CityService.getCitiesCount(searchCriteria)
                        .then((totalCount) => {

                            return res.ok({
                                items: cities,
                                currentPageNumber: currentPageNumber,
                                totalCount: totalCount
                            });
                        });
                }
            );
    }
};

module.exports = CityController;
