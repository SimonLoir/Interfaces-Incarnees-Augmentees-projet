const withTM = require('next-transpile-modules')(['@utils/global']);
module.exports = withTM({
    reactStrictMode: true,
});
