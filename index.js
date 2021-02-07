module.exports = {
  extends: 'stylelint-config-recommended',
  rules: {
    'selector-pseudo-class-no-unknown': [
      true,
      {
        ignorePseudoClasses: ['global', 'root'],
      },
    ],
    'no-descending-specificity': null,
    'color-no-hex': true,
    'font-weight-notation': 'numeric',
    'number-max-precision': 3,
    'unit-allowed-list': ['px', '%', 'rem', 's', 'vw'],
    'value-no-vendor-prefix': true,
    'declaration-block-no-redundant-longhand-properties': true,
    'declaration-block-single-line-max-declarations': 1,
    'media-feature-name-allowed-list': ['max-width', 'min-width'],
    'no-unknown-animations': true,
    'color-hex-case': 'lower',
    'function-comma-space-after': 'always',
    'function-comma-space-before': 'never',
    'number-leading-zero': 'always',
    'number-no-trailing-zeros': true,
    'string-quotes': 'double',
    'unit-case': 'lower',
    'value-keyword-case': 'lower',
    'property-case': 'lower',
    'selector-attribute-brackets-space-inside': 'never',
    'indentation': 2,
    'max-empty-lines': 1,
    'no-eol-whitespace': true,
    'no-missing-end-of-source-newline': true,
    'no-empty-first-line': true,
  },
};
