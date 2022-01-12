const webpush = require('web-push');
const { public_vapid_key, private_vapid_key} = require('../lib/config');

webpush.setVapidDetails('https://localhost:3000', public_vapid_key, private_vapid_key)



module.exports = webpush

