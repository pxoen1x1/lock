/* global sails, DeviceService*/

/**
 * DeviceController
 *
 * @description :: Server-side logic for managing Devices
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

'use strict';

let DeviceController = {
    saveDevice(req, res){
        let user = req.session.user;
        let params = req.body;

        let device = params.device;

        if (!device || !device.token || !device.uuid || !device.platform) {

            return res.badRequest({
                message: req.__('Submitted data is invalid.')
            });
        }

        DeviceService.saveDevice(user, device)
            .then(
                (device) => res.created(
                    {
                        device: device
                    }
                )
            )
            .catch(
                (err) => {
                    sails.log.error(err);

                    return res.serverError();
                }
            );
    }
};

module.exports = DeviceController;