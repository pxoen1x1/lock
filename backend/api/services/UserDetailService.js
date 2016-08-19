/* global UserDetail */

'use strict';

let UserDetailService = {
    getUserDetailByUser(user) {

        return UserDetail.findOneByUser(user.id)
            .populateAll()
            .then(
                (foundUserDetail) => {

                    return foundUserDetail;
                }
            )
            .catch(
                (err) => err
            );
    }
};

module.exports = UserDetailService;