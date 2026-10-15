/**
 * Workaround for hoisted node_modules: expo-modules-autolinking expects
 * @expo/expo-modules-macros-plugin under expo-modules-core/node_modules.
 * @see https://github.com/expo/expo/issues/46301
 */
const fs = require('fs');
const path = require('path');

const pluginSource = path.join(__dirname, '../node_modules/@expo/expo-modules-macros-plugin');
const linkParent = path.join(__dirname, '../node_modules/expo-modules-core/node_modules/@expo');
const linkTarget = path.join(linkParent, 'expo-modules-macros-plugin');

if (!fs.existsSync(pluginSource)) {
  process.exit(0);
}

if (fs.existsSync(linkTarget)) {
  process.exit(0);
}

fs.mkdirSync(linkParent, { recursive: true });
const relative = path.relative(linkParent, pluginSource);
fs.symlinkSync(relative, linkTarget, 'dir');
console.log('[postinstall] Linked expo-modules-macros-plugin for iOS Swift macros');
