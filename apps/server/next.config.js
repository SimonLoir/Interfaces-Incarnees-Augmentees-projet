const withTM = require('next-transpile-modules')([
    '@utils/global',
    '@components/global',
]);
module.exports = withTM({
    reactStrictMode: true,
});
