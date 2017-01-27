(function () {
    'use strict';

     angular
         .module('app.core')
         .constant('defaultTranslationConstants', {
             EN: {
                 'PROFILE': 'Profile',
                 'SHOW_PUBLIC_PROFILE': 'Show public profile',
                 'CHANGE_PHOTO': 'Change photo',
                 'ACCOUNT_BALANCE': 'Account balance',
                 'WITHDRAWAL': 'Withdrawal',
                 'BANK_ACCOUNT': 'Bank account',
                 'FILL_COMPANY_INFO_BEFORE_ADDING_BANK_ACCOUNT': 'Fill Company info before adding bank account',
                 'FILL_MERCHANT_ACCOUNT_BEFORE_ADDING_BANK_ACCOUNT': 'Fill Merchant info before adding bank account',
                 'NAME': 'Name',
                 'CURRENCY': 'Currency',
                 'MODIFIED': 'Modified',
                 'STATUS': 'Status',
                 'TYPE_OF_ACCOUNT': 'Type of Account',
                 'PAYMENT_ROUTING': 'paymentRouting',
                 'PAYMENT_NUMBER': 'paymentNumber',
                 'SAVE': 'Save',
                 'CANCEL': 'Cancel',
                 'EMAIL': 'Email',
                 'PHONE': 'Phone',
                 'CAR_LICENSE_PLATE_NUMBER': 'Car license plate number',
                 'LICENSES': 'Licenses',
                 'UNTIL': 'until',
                 'SERVICES': 'Services',
                 'LANGUAGE': 'Language',
                 'FIRST_NAME': 'First name',
                 'LAST_NAME': 'Last name',
                 'INVALID_EMAIL': 'That doesn\'t look like a valid email.',
                 'EMAIL_ALREADY_EXIST': 'This email already exists.',
                 'PHONE_NUMBER': 'Phone number',
                 'INVALID_PHONE': 'That doesn\'t look like a valid phone number.',
                 'PHONE_EXIST': 'This phone number already exists.',
                 'LICENSE_INFORMATION': 'License information',
                 'LICENSE_NUMBER': 'License Number',
                 'ENTER_LICENSE': 'Please, enter a license number.',
                 'STATE': 'State',
                 'STATE_IS_REQUIRED': 'State is required.',
                 'NOT_A_DATE': 'The entered value is not a date!',
                 'DATE_IS_TOO_EARLY': 'Date is too early!',
                 'DATE_IS_TOO_LATE': 'Date is too late!',
                 'ADD_LICENSE': 'Add license',
                 'SERVICE_TYPES': 'Service types',
                 'EDIT': 'Edit',
                 'ADDRESS': 'Address',
                 'CITY': 'City',
                 'ZIP': 'ZIP',
                 'SELECT_AN_EXISTING_CITY': 'Please select an existing city.',
                 'NOT_LONG_ENOUGH': 'Your entry is not long enough.',
                 'TOO_LONG': 'Your entry is too long.',
                 'JOINED': 'Joined',
                 'FEEDBACKS': 'Feedbacks',
                 'SEND_BID': 'Send Bid',
                 'START': 'START',
                 'PAUSE': 'Pause',
                 'DONE': 'Done',
                 'NEW': 'New',
                 'CUSTOMER': 'Customer',
                 'FOR_DATE': 'For Date',
                 'TYPE_OF_SERVICE': 'Type of service',
                 'DESCRIPTION': 'Description',
                 'DISTANCE(MI)': 'Distance (mi)',
                 'CREATED': 'Created',
                 'DISTANCE': 'Distance',
                 'MI': 'mi',
                 'HISTORY': 'History',
                 'LOCATION': 'Location',
                 'COST': 'Cost',
                 'CURRENT': 'Current',
                 'DASHBOARD_CURRENT': 'Current',
                 'CHAT_HAS_NOT_BEEN_STARTED': 'Chat has not been started.',
                 'MAP': 'Map',
                 'MESSAGE': 'Message',
                 'COST_(USD)': 'Cost (USD)',
                 'SIGN_UP': 'Sign up',
                 'FIRST_NAME_IS_TOO_LONG': 'Your first name is too long.',
                 'LAST_NAME_IS_TOO_LONG': 'Your last name is too long.',
                 'PASSWORD': 'Password',
                 'PASSWORD_MUST_CONTAIN': 'Your password must contain 6 characters (at least one number and one letter).',
                 'SUBMIT': 'Submit',
                 'SIGN_IN_WITH_SOCIAL_NETWORK': 'Sign in with social network',
                 'JOIN_IN_WITH_FB': 'Join in with Facebook',
                 'JOIN_IN_WITH_G+': 'Join in with Google+',
                 'JOIN_IN_WITH_TWITTER': 'Join in with Twitter',
                 'GO_BACK': 'Go Back',
                 'REGISTRATION': 'Registration',
                 'LOG_IN': 'Log in',
                 'LOG_OUT': 'Log out',
                 'NEXT': 'Next',
                 'BACK': 'Back',
                 'I_AGREE': 'I agree',
                 'INDIVIDUAL': 'Individual',
                 'COMPANY': 'Company',
                 'COMPANY_INFO': 'Company Info',
                 'AGREEMENT': 'Agreement',
                 'PERSONAL_INFO': 'Personal information',
                 'CONTACT_INFORMATION': 'Contact information',
                 'CLIENT_REGISTRATION': 'Client Registration',
                 'PROVIDER/GROUP_REGISTRATION': 'Provider/Group Registration',
                 'PROVIDER': 'Provider',
                 'CLIENT': 'Client',
                 'GROUP': 'Group',
                 'ADMIN': 'Admin',
                 'HOME_PAGE': 'Home page',
                 'INVITE': 'Invite',
                 'EXECUTOR': 'Executor',
                 'JOIN_GROUP_MEMBER': 'Join Group Member',
                 'NAME_OR_EMAIL': 'Name or Email',
                 'GROUP_MEMBER_IS_NOT_FOUND': 'group member is not found.',
                 'MEMBER_INFO': 'Member Info',
                 'REMOVE': 'Remove',
                 'NUMBER': 'Number',
                 'DATE_EXPIRATION': 'Date Expiration',
                 'EDIT_GENERAL_INFO': 'Edit general info',
                 'ADD_A_FEEDBACK': 'Add a feedback',
                 'IT\'S_A_REQUIRED_FIELD': 'It\'s a required field.',
                 'INVITE_A_FRIEND': 'Invite a friend',
                 'FRIEND\'S_NAME': 'Friend\'s name',
                 'SEND': 'Send',
                 'REQUESTS': 'Requests',
                 'SPENT': 'Spent',
                 'CARD_NUMBER': 'Card number',
                 'CVV': 'CVV',
                 'EXPIRATION_DATE_MMYY': 'Expiration date MMYY',
                 'CHAT': 'Chat',
                 'LET\'S_CHAT_HERE': 'Let\'s chat here.',
                 'MILES_AWAY': 'miles away',
                 'ESTIMATED_TIME_OF_ARRIVAL': 'Estimated time of arrival',
                 'NEW_REQUEST': 'New request',
                 'TYPE_OF_SERVICE_NEEDED': 'Type of service needed',
                 'REQUEST_EMERGENCY': 'Emergency',
                 'I_NEED_A_LOCKSMITH_NOW': 'I need a locksmith now',
                 'I_NEED_A_LOCKSMITH_FOR_CUSTOM_DATE': 'I need a locksmith for custom date',
                 'INVALID_FORMAT': 'Invalid format',
                 'PROVIDE_LOCATION_BY_GPS': 'Provide location by GPS',
                 'YOUR_GPS_IS_WRONG': 'Your GPS is wrong. Please, enter address manually',
                 'PROVIDE_LOCATION_MANUALLY': 'Provide location manually',
                 'YOUR_ADDRESS_IS_WRONG': 'Your address is wrong. Please, check it.',
                 'TYPE_OF_REQUEST': 'Type of request',
                 'PRIVATE_REQUEST': 'Private request',
                 'PUBLIC_REQUEST': 'Public request',
                 'DETAILS(OPTIONAL)': 'Details (optional)',
                 'PROVIDER_DISTANCE_(MILES)': 'Provider distance (miles)',
                 'MINIMUM_DISTANCE': 'The minimum distance is 1 mile.',
                 'MAXIMUM_DISTANCE': 'The maximum distance is 100 miles.',
                 'REQUEST_NOTE_(OPTIONAL)': 'Request note (optional)',
                 'DO_YOU_WANT_TO_CLARIFY_SMTH': 'Do you want to clarify something?',
                 'RECOMMENDED': 'Recommended',
                 'SHOW_ONLY_AVAILABLE': 'Show only available',
                 'WORKING_HOURS': 'Working hours',
                 'CHAT_WITH_SPECIALIST': 'Chat with {{ specialist.first_name }}',
                 'REQUEST': 'Request',
                 'DETAILS': 'Details',
                 'NEEDED_SERVICE': 'Needed service',
                 'SERVICE_PROVIDER': 'Service provider',
                 'ADD_FEEDBACK': 'Add feedback',
                 'DATE': 'Date',
                 'LOGIN_WITH_FB': 'Login with Facebook',
                 'LOGIN_WITH_G+': 'Login with Google+',
                 'LOGIN_WITH_TWITTER': 'Login with Twitter',
                 'CLOSE_BID': 'Close Bid',
                 'SEND_OFFER': 'Send Offer',
                 'REQUEST_INFO': 'Request Info',
                 'CLOSE_CHAT': 'Close Chat',
                 'REVIEWS': 'Reviews',
                 'NO_REVIEWS_YET': 'No Reviews Yet',
                 'NO_RESULTS': 'No results..',
                 'DECLINED': 'Declined',
                 'DECLINE': 'Decline',
                 'START_CHAT': 'Start Chat',
                 'ACCEPT': 'Accept',
                 'ACCEPTED': 'Accepted',
                 'GROUP_MEMBER': 'Group Member',
                 'PAY_WITH_YOUR_CARD': 'Pay with your card',
                 'LINK_NEW_CARD_AND_PAY': 'Link new card and pay',
                 'EXPIRATION': 'Expiration',
                 'LICENSE_EXPIRATION': 'Expiration',
                 'PAY': 'PAY',
                 'SELECT_CONTACT_TO_START_THE_CHAT': 'Select contact to start the chat.',
                 'CHATS': 'Chats',
                 'BIDS': 'Bids',
                 'CHAT_WAS_CLOSED': 'Chat was closed.',
                 'CUSTOMER_CHOSE_ANOTHER_EXECUTOR': 'Customer chose another executor.',
                 'USERS': 'Users',
                 'PHOTO': 'Photo',
                 'REGISTRATION_DATE': 'Registration date',
                 'EMERGENCY': 'Emergency',
                 'RESIDENTIAL': 'Residential',
                 'COMMERCIAL': 'Commercial',
                 'AUTOMOBILE': 'Automobile',
                 'INSTITUTIONAL': 'Institutional',
                 'FORENSIC': 'Forensic',
                 'SPECIALIST': 'Specialist',
                 'PUBLIC': 'Public',
                 'FORGOT_YOUR_PASSWORD': 'Forgot your password?',
                 'RESET_PASSWORD': 'Reset Password',
                 'ENTER_DATE': 'Enter date',
                 'TIME': 'Time',
                 'SETTINGS': 'Settings',
                 'VIEW': 'View',
                 'GENERAL_INFO': 'General info',
                 'CONTACT_INFO': 'Contact info',
                 'PAYMENT_INFO': 'Payment info',
                 'THERE_IS_NO_CARD_INFORMATION': 'There is no card information',
                 'CLOSE': 'Close',
                 'AVAILABLE': 'Available',
                 'NOT_AVAILABLE_NOW': 'Not available now',
                 'SEARCH_THE_CHAT': 'Search the chat',
                 'TYPE_AND_HIT_ENTER_TO_SEND_MESSAGE': 'Type and hit enter to send message',
                 'TITLE': 'Title',
                 'MESSAGES': 'Messages',
                 'DASHBOARD': 'Dashboard',
                 'DASHBOARD_NEW': 'New',
                 'MEMBERS':'Members',
                 'CORPORATE_SAVINGS_ACCOUNT': 'Corporate savings account',
                 'CORPORATE_CHECKING_ACCOUNT': 'Corporate checking account',
                 'SAVINGS_ACCOUNT': 'Savings account',
                 'CHECKING_ACCOUNT': 'Checking account',
                 'SEARCH_FOR_A_GROUP_MEMBER': 'Search for a group member',
                 'NOW': 'Now',
                 'ERROR_DURING_CANCELLING_PAYMENT': 'Error during cancelling payment',
                 'PLEASE_CONTACT_SUPPORT': 'Please contact support',
                 'WITHDRAWALS_REQUEST_CREATED': 'Withdrawals request created',
                 'ERROR_DURING_WITHDRAWALS': 'Error during withdrawals',
                 'NEW_REQUESTS': 'New requests',
                 'NO_REQUESTS': 'No requests'
             }
         });
})();