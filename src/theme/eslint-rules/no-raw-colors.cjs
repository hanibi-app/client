/**
 * ESLint 규칙: 원시 색상 리터럴 금지
 *
 * hex, rgb, rgba 등의 원시 색상 리터럴 사용을 금지하고
 * 테마 토큰 사용을 강제합니다.
 */

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: '원시 색상 리터럴 사용을 금지하고 테마 토큰 사용을 강제합니다',
      category: 'Best Practices',
      recommended: true,
    },
    fixable: 'code',
    schema: [],
    messages: {
      noRawColors: '원시 색상 리터럴을 사용하지 마세요. 테마 토큰을 사용하세요: {{suggestion}}',
    },
  },

  create(context) {
    // 금지된 색상 패턴들
    const rawColorPatterns = [
      /#[0-9a-fA-F]{3,8}/g, // hex colors
      /rgb\s*\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)/g, // rgb
      /rgba\s*\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*,\s*[\d.]+\s*\)/g, // rgba
      /hsl\s*\(\s*\d+\s*,\s*\d+%\s*,\s*\d+%\s*\)/g, // hsl
      /hsla\s*\(\s*\d+\s*,\s*\d+%\s*,\s*\d+%\s*,\s*[\d.]+\s*\)/g, // hsla
    ];

    // 허용된 색상들 (예외 처리)
    const allowedColors = ['transparent', 'inherit', 'currentColor'];

    function checkStringLiteral(node) {
      if (typeof node.value !== 'string') return;

      const value = node.value;

      // 허용된 색상인지 확인
      if (allowedColors.includes(value.toLowerCase())) return;

      // 금지된 패턴 검사
      for (const pattern of rawColorPatterns) {
        if (pattern.test(value)) {
          context.report({
            node,
            messageId: 'noRawColors',
            data: {
              suggestion: `theme.tokens.${getSuggestedToken(value)}`,
            },
            fix(fixer) {
              return fixer.replaceText(node, `theme.tokens.${getSuggestedToken(value)}`);
            },
          });
        }
      }
    }

    function getSuggestedToken(colorValue) {
      // 간단한 색상 매핑 테이블
      const colorMap = {
        '#007AFF': 'brand.primary',
        '#8E8E93': 'text.muted',
        '#FF3B30': 'state.error',
        '#34C759': 'state.success',
        '#FF9500': 'state.warning',
        '#5AC8FA': 'state.info',
        '#000000': 'text.primary',
        '#FFFFFF': 'text.inverse',
        '#F2F2F7': 'surface.background',
        '#E5E5EA': 'surface.border',
      };

      return colorMap[colorValue] || 'text.primary';
    }

    return {
      Literal: checkStringLiteral,
      TemplateLiteral(node) {
        if (node.quasis) {
          node.quasis.forEach(quasi => {
            if (quasi.value) {
              checkStringLiteral(quasi);
            }
          });
        }
      },
    };
  },
};
