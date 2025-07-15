const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

config.resolver.alias = {
    ...config.resolver.alias,
    'structured-clone': require.resolve('structured-clone'),
};

module.exports = config;