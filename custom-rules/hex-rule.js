const stylelint = require('stylelint');
const valueParser = require('postcss-value-parser');

const ruleName = '@refrens/stylelint-custom-hex-rule';
const messages = stylelint.utils.ruleMessages(ruleName, {
  found: (color) => `"${color}" found illegal color use. Use variable from @refrens/disco instead.`,
});

module.exports = stylelint.createPlugin(ruleName, (primaryOption) => {
  return (root, result) => {
    const validOptions = stylelint.utils.validateOptions(result, ruleName, {
      actual: primaryOption,
    });

    if (!validOptions) return;

    root.walkDecls((decl) => {
      const parsedValue = valueParser(decl.value);

      parsedValue.walk((node) => {
        if (node.type === 'word' || node.type === 'function') {
          const hexColorRegex = /#([0-9A-Fa-f]{3,8})\b/g;
          const matches = node.value.match(hexColorRegex);

          if (matches) {
            matches.forEach((match) => {
              stylelint.utils.report({
                message: messages.found(match),
                node: decl,
                result,
                ruleName,
              });
            });
          }
        }
      });
    });

    // Check for hex colors in template literals
    root.walkAtRules('css', (atRule) => {
      const hexColorRegex = /#([0-9A-Fa-f]{3,8})\b/g;
      const matches = atRule.params.match(hexColorRegex);

      if (matches) {
        matches.forEach((match) => {
          stylelint.utils.report({
            message: messages.found(match),
            node: atRule,
            result,
            ruleName,
          });
        });
      }
    });
  };
});

module.exports.ruleName = ruleName;
module.exports.messages = messages;
