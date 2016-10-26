'use strict';

module.exports = function (req, res, next) {
    if(req.isAuthenticated()){

        return next();
    } else {

        return res.forbidden({
            message: req.__('You are not permitted to perform this action.')
        });
    }
};