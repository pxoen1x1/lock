/**
 * Policy Mappings
 * (sails.config.policies)
 *
 * Policies are simple functions which run **before** your controllers.
 * You can apply one or more policies to a given controller, or protect
 * its actions individually.
 *
 * Any policy file (e.g. `api/policies/authenticated.js`) can be accessed
 * below by its filename, minus the extension, (e.g. "authenticated")
 *
 * For more information on how policies work, see:
 * http://sailsjs.org/#!/documentation/concepts/Policies
 *
 * For more information on configuring policies, check out:
 * http://sailsjs.org/#!/documentation/reference/sails.config/sails.config.policies.html
 */


module.exports.policies = {

    /***************************************************************************
     *                                                                          *
     * Default policy for all controllers and actions (`true` allows public     *
     * access)                                                                  *
     *                                                                          *
     ***************************************************************************/

    '*': ['hasJsonWebToken', 'isUserEnabled'],

    /***************************************************************************
     *                                                                          *
     * Here's an example of mapping some policies to run before a controller    *
     * and its actions                                                          *
     *                                                                          *
     ***************************************************************************/
    // RabbitController: {

    // Apply the `false` policy as the default for all of RabbitController's actions
    // (`false` prevents all access, which ensures that nothing bad happens to our rabbits)
    // '*': false,

    // For the action `nurture`, apply the 'isRabbitMother' policy
    // (this overrides `false` above)
    // nurture	: 'isRabbitMother',

    // Apply the `isNiceToAnimals` AND `hasRabbitFood` policies
    // before letting any users feed our rabbits
    // feed : ['isNiceToAnimals', 'hasRabbitFood']
    // }

    AuthController: {
        '*': true
    },

    UserController: {
        'getCurrentUser': [
            'hasJsonWebToken'
        ],
        'findServiceProviders': true
    },

    StateController: {
        'getStates': true
    },

    CityController: {
        'getCitiesByState': true
    },

    ServiceTypeController: {
        'getServiceTypes': true
    },

    LanguageController: {
        'getLanguages': true
    },


    RequestController: {
        'confirmOffer': [
            'hasJsonWebToken',
            'isUserEnabled',
            'isOfferConfirmationAllowed'
        ],
        'changeStatus': [
            'hasJsonWebToken',
            'isUserEnabled',
            'isRequestStatusChangeAllowed'
        ],
        // for homepage form
        'createRequest': 'hasJsonWebToken',
        'getAllClientRequests': 'hasJsonWebToken',
        'getClientRequestById': 'hasJsonWebToken'
    },

    FeedbackController: {
        'createFeedback': [
            'hasJsonWebToken',
            'isUserEnabled',
            'isRequestOwner',
            'isFeedbackAllowed'
        ]
    },

    ChatController: {
        '*': [
            'isSocketRequest',
            'hasJsonWebToken',
            'isUserEnabled'
        ],
        'getSpecialistChat': [
            'isSocketRequest',
            'hasJsonWebToken',
            'isUserEnabled',
            'isChatMember'
        ],
        'createChat': [
            'isSocketRequest',
            'hasJsonWebToken',
        //    'isUserEnabled', // for homepage form
            'isRequestAllowed',
            'isRequestOwner',
            'isChatUnique'
        ],
        'getClientChats': [
            'isSocketRequest',
            'hasJsonWebToken',
            'isRequestAllowed',
            'isRequestOwner',
        ],
        'subscribeToChat': [
            'isSocketRequest',
            'hasJsonWebToken',
            'isUserEnabled',
            'isChatMember'
        ],
        'joinGroupMemberToChat': [
            'isSocketRequest',
            'hasJsonWebToken',
            'isUserEnabled',
            'isChatMember',
            'isGroupMember'
        ]
    },

    BidController: {
        '*': [
            'isSocketRequest',
            'hasJsonWebToken',
            'isUserEnabled'
        ],
        'getClientBids': [
            'isSocketRequest',
            'hasJsonWebToken',
            'isUserEnabled',
            'isRequestOwner'
        ],
        'create': [
            'isSocketRequest',
            'hasJsonWebToken',
            'isUserEnabled',
            'isRequestAllowed',
            'isBidUnique'
        ],
        'refuseBidByClient': [
            'isSocketRequest',
            'hasJsonWebToken',
            'isUserEnabled',
            'isBidParticipant'
        ],
        'deleteBid': [
            'isSocketRequest',
            'hasJsonWebToken',
            'isUserEnabled',
            'isBidParticipant'
        ]
    },

    MessageController: {
        '*': [
            'isSocketRequest',
            'hasJsonWebToken',
            'isUserEnabled',
            'isChatMember'
        ],
        'createMessage': [
            'isSocketRequest',
            'hasJsonWebToken',
            'isUserEnabled',
            'isRequestAllowed',
            'isChatMember'
        ],
        'createOffer': [
            'isSocketRequest',
            'hasJsonWebToken',
            'isUserEnabled',
            'isRequestAllowed',
            'isChatMember',
            'isCreateOfferAllowed'
        ],
        'translateMessage': [
            'isSocketRequest',
            'hasJsonWebToken',
            'isUserEnabled',
            'isMessageAllowed',
            'isLanguageSupported'
        ],
        'uploadFile': [
            'hasJsonWebToken',
            'isUserEnabled',
            'isRequestAllowed',
            'isChatMember'
        ]
    },

    GroupController: {
        'getGroupMember': [
            'hasJsonWebToken',
            'isUserEnabled',
            'isGroupMember'
        ],
        'joinMember': [
            'isGroupInvitationValid'
        ],
        'removeMember': [
            'hasJsonWebToken',
            'isUserEnabled',
            'isGroupMember'
        ]
    },

    SocketController: {
        '*': [
            'isSocketRequest',
            'hasJsonWebToken'
        ]
    },

    AdminController: {
        '*': [
            'hasJsonWebToken',
            'isUserEnabled',
            'isUserAdmin'
        ]
    }
};
