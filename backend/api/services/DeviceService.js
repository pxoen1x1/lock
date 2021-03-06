/* global Device */

'use strict';

let DeviceService = {
    saveDevice(user, device) {
        if (device.user) {

            delete device.user;
        }

        if (user) {
            device.user = user;
        }

        return Device.findOneByUuid(device.uuid)
            .then(
                (foundDevice) => {
                    if (!foundDevice) {

                        return Device.create(device)
                            .then(
                                (createdDevice) => createdDevice
                            );
                    }

                    return Device.update({uuid: device.uuid}, device)
                        .then(
                            (updatedDevices) => updatedDevices[0]
                        );
                }
            );
    },
    removeUserFromDevice(uuid){
        if (!uuid) {

            return Promise.resolve();
        }

        let device = {
            user: null
        };

        return Device.update({uuid: uuid}, device);
    }
};

module.exports = DeviceService;