module.exports = {
  customSyntax: 'postcss-styled-syntax',
  plugins: ['./custom-rules/hex-rule.js', './custom-rules/logical-properties.js'],
  rules: {
    '@refrens/stylelint-custom-hex-rule': true,
    '@refrens/stylelint-logical-properties': false,
    'color-named': 'never',
    'color-hex-length': 'long',
    'color-no-hex': true,
    'color-no-invalid-hex': true,
    'function-disallowed-list': ['rgb', 'hwb', 'lch', 'hsl', 'rgba', 'hsla'],
  },
};
