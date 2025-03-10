const stylelint = require('stylelint');

const ruleName = '@refrens/stylelint-logical-properties';
const messages = stylelint.utils.ruleMessages(ruleName, {
  rejected: (prop, newProp) =>
    `Unexpected physical property '${prop}'. Use '${newProp}' instead for RTL/LTR support.`,
});

/**
 *
 * @param direction
 */
function getLogicalDirection(direction) {
  switch (direction) {
    case 'top':
      return 'block-start';
    case 'bottom':
      return 'block-end';
    case 'left':
      return 'inline-start';
    case 'right':
      return 'inline-end';
    default:
      return null;
  }
}

/**
 *
 * @param direction
 */
function getBlockLogical(direction) {
  return direction === 'top' ? 'start' : 'end';
}

/**
 *
 * @param direction
 */
function getInlineLogical(direction) {
  return direction === 'left' ? 'start' : 'end';
}

/**
 *
 * @param decl
 * @param newProp
 * @param result
 */
function reportError(decl, newProp, result) {
  stylelint.utils.report({
    message: messages.rejected(decl.prop, newProp),
    node: decl,
    result,
    ruleName,
    fix: (fixer) => {
      return fixer.replaceText(
        decl,
        `${newProp}: ${decl.value}${decl.important ? ' !important' : ''};`,
      );
    },
  });
}

module.exports = stylelint.createPlugin(ruleName, () => {
  return (root, result) => {
    const validOptions = stylelint.utils.validateOptions(result, ruleName, {});

    if (!validOptions) return;

    root.walkDecls((decl) => {
      const { prop: declProp } = decl;
      const prop = declProp;
      let newProp;

      // Handle padding and margin properties
      if (prop.startsWith('padding-') || prop.startsWith('margin-')) {
        const parts = prop.split('-');
        const direction = parts[1];
        const logical = getLogicalDirection(direction);
        if (logical) {
          newProp = `${parts[0]}-${logical}`;
        }
      }

      // Handle border properties (excluding radius)
      else if (prop.startsWith('border-') && !prop.includes('radius')) {
        const parts = prop.split('-');
        const direction = parts[1];
        if (['top', 'bottom', 'left', 'right'].includes(direction)) {
          const logical = getLogicalDirection(direction);
          if (logical) {
            parts[1] = logical;
            newProp = parts.join('-');
          }
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
        reportError(decl, newProp, result);
      }
    });
  };
});

module.exports.ruleName = ruleName;
module.exports.messages = messages;
