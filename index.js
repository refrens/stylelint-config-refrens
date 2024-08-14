module.exports = {
  customSyntax: '@stylelint/postcss-css-in-js',
  plugins: ['./custom-rules/hex-rule.js'],
  rules: {
    '@refrens/stylelint-custom-hex-rule': true,
    'color-named': 'never',
    'color-hex-length': 'long',
    'color-no-hex': true,
    'color-no-invalid-hex': true,
    'function-disallowed-list': ['rgb', 'hwb', 'lch', 'hsl', 'rgba', 'hsla'],
  },
};
