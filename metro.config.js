const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

// Add CSS support for web bundling to avoid errors with mapbox-gl CSS import
config.resolver.sourceExts.push("css");
config.transformer = {
  ...config.transformer,
  babelTransformerPath: require.resolve("react-native-css-transformer"),
};

module.exports = withNativeWind(config, { input: "./global.css" });
