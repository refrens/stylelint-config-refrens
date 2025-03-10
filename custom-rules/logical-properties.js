const stylelint = require('stylelint');

const ruleName = '@refrens/stylelint-logical-properties';
const messages = stylelint.utils.ruleMessages(ruleName, {
  rejected: (prop, newProp) =>
    `Unexpected physical property '${prop}'. Use '${newProp}' instead for better RTL/LTR support.`,
});

const meta = {
  fixable: 'code',
  docs: {
    description: 'Enforces logical properties for better RTL/LTR support.',
    url: 'https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Logical_Properties',
  },
};

/**
 * Converts physical directions (top, right, bottom, left) to logical equivalents.
 * @param {string} direction
 * @returns {string|null}
 */
function getLogicalDirection(direction) {
  const map = {
    top: 'block-start',
    bottom: 'block-end',
    left: 'inline-start',
    right: 'inline-end',
  };
  return map[direction] || null;
}

/**
 * Converts block-based border-radius directions.
 * @param {string} direction
 * @returns {string}
 */
function getBlockLogical(direction) {
  return direction === 'top' ? 'start' : 'end';
}

/**
 * Converts inline-based border-radius directions.
 * @param {string} direction
 * @returns {string}
 */
function getInlineLogical(direction) {
  return direction === 'left' ? 'start' : 'end';
}

module.exports = stylelint.createPlugin(
  ruleName,
  (primaryOption, secondaryOptions, context) => {
    return (root, result) => {
      const validOptions = stylelint.utils.validateOptions(result, ruleName, {});

      if (!validOptions) return;

      root.walkDecls((decl) => {
        const { prop } = decl;
        let newProp = null;

        // Handle padding and margin properties
        if (prop.startsWith('padding-') || prop.startsWith('margin-')) {
          const parts = prop.split('-');
          const logical = getLogicalDirection(parts[1]);
          if (logical) {
            newProp = `${parts[0]}-${logical}`;
          }
        }

        // Handle border properties (excluding radius)
        else if (prop.startsWith('border-') && !prop.includes('radius')) {
          const parts = prop.split('-');
          const logical = getLogicalDirection(parts[1]);
          if (logical) {
            parts[1] = logical;
            newProp = parts.join('-');
          }
        }

        // Handle border-radius properties
        else if (prop.startsWith('border-') && prop.endsWith('-radius')) {
          const matches = prop.match(/^border-(top|bottom)-(left|right)-radius$/);
          if (matches) {
            const [blockDir, inlineDir] = matches.slice(1);
            newProp = `border-${getBlockLogical(blockDir)}-${getInlineLogical(inlineDir)}-radius`;
          }
        }

        if (newProp) {
          if (context.fix) {
            // Autofix: Modify the AST directly
            decl.prop = newProp;
          } else {
            // Report an error without modifying the AST
            stylelint.utils.report({
              message: messages.rejected(prop, newProp),
              node: decl,
              result,
              ruleName,
            });
          }
        }
      });
    };
  },
  { ruleName, messages, meta },
);
