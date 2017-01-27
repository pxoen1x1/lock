1. скопировать locksmith/backend/config/local_dist.js в locksmith/backend/config/local.js

2. Создать приватный ключ https://test-portal.splashpayments.com/settings и
внести его значение в locksmith/backend/config/local.js splashpaymentParams.apikey

3. Создать группу https://test-portal.splashpayments.com/groups
вписать ID группы в locksmith/backend/config/local.js splashpaymentParams.merchantsGroupId

4. Выполнить запрос

GET https://test-api.splashpayments.com/vendors
HEADERS:
APIKEY:'', // splashpaymentParams.apikey

поле 'entity' - это serviceSplashPaymentEntityId для запроса ниже

2. Выполнить запрос

POST https://test-api.splashpayments.com/orgs
HEADERS:
APIKEY:'', // splashpaymentParams.apikey
Content-Type:application/json
body:
{
            "name": "group fee",
            "um": 1, //SPLASH_PAYMENT.fee.unitOfMeasure,
            "amount": 2500, // 25% SPLASH_PAYMENT.fee.amount,
            "schedule": 7, //SPLASH_PAYMENT.fee.schedule,
            "start": "YYYYMMDD", // today
            "org": sails.config.splashpaymentParams.merchantsGroupId, // id группы из п.3
            "entity": // serviceSplashPaymentEntityId из п.0
}