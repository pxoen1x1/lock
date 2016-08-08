'use strict';

let procedureRoutes = {
    'GET /api/services/procedures':{
        controller: 'ProcedureController',
        action: 'getProceduresByService'
    }
};

module.exports.routes = procedureRoutes;
