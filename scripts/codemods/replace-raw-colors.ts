/**
 * 코드모드: 원시 색상 리터럴을 테마 토큰으로 자동 변환
 *
 * 기존 코드의 색상 리터럴을 테마 토큰으로 자동 변환합니다.
 */

import * as fs from 'fs';
import * as path from 'path';

// 색상 매핑 테이블
const colorMapping: Record<string, string> = {
  // 브랜드 색상
  '#007AFF': 'brand.primary',
  '#0056CC': 'brand.primaryDark',
  '#4A90E2': 'brand.primaryLight',
  '#FF6B35': 'brand.secondary',
  '#E55A2B': 'brand.secondaryDark',
  '#FF8A65': 'brand.secondaryLight',

  // 텍스트 색상
  '#000000': 'text.primary',
  '#FFFFFF': 'text.inverse',
  '#8E8E93': 'text.muted',
  '#C7C7CC': 'text.disabled',

  // 상태 색상
  '#FF3B30': 'state.error',
  '#34C759': 'state.success',
  '#FF9500': 'state.warning',
  '#5AC8FA': 'state.info',
  '#FF2D92': 'state.danger',
  '#FFCC00': 'state.caution',

  // 표면 색상
  '#F2F2F7': 'surface.background',
  '#FFFFFF': 'surface.card',
  '#E5E5EA': 'surface.border',
  '#F8F8F8': 'surface.elevated',

  // 차트 색상
  '#FF6B6B': 'chart.temperature',
  '#4ECDC4': 'chart.humidity',
  '#45B7D1': 'chart.metal',
  '#96CEB4': 'chart.voc',
  '#FFEAA7': 'chart.warning',
  '#DDA0DD': 'chart.info',

  // 액션 색상
  '#007AFF': 'action.primary',
  '#8E8E93': 'action.secondary',
  '#FF3B30': 'action.danger',
  '#34C759': 'action.success',
};

// 투명도가 포함된 색상 매핑
const alphaColorMapping: Record<string, { token: string; opacity: number }> = {
  '#007AFF20': { token: 'brand.primary', opacity: 0.12 },
  '#007AFF40': { token: 'brand.primary', opacity: 0.25 },
  '#FF3B3020': { token: 'state.error', opacity: 0.12 },
  '#FF3B3040': { token: 'state.error', opacity: 0.25 },
  '#34C75920': { token: 'state.success', opacity: 0.12 },
  '#34C75940': { token: 'state.success', opacity: 0.25 },
  '#FF950020': { token: 'state.warning', opacity: 0.12 },
  '#FF950040': { token: 'state.warning', opacity: 0.25 },
};

/**
 * 색상 리터럴을 테마 토큰으로 변환
 */
function replaceColorLiteral(match: string, color: string): string {
  // 투명도가 포함된 색상 처리
  if (alphaColorMapping[color]) {
    const { token, opacity } = alphaColorMapping[color];
    return `theme.tokens.${token} + '${Math.round(opacity * 255)
      .toString(16)
      .padStart(2, '0')}'`;
  }

  // 일반 색상 매핑
  if (colorMapping[color]) {
    return `theme.tokens.${colorMapping[color]}`;
  }

  // 매핑되지 않은 색상은 팔레트에서 가장 가까운 색상 찾기
  const closestToken = findClosestColor(color);
  if (closestToken) {
    return `theme.tokens.${closestToken}`;
  }

  // 매핑할 수 없는 색상은 그대로 유지
  return match;
}

/**
 * 가장 가까운 색상 찾기
 */
function findClosestColor(hexColor: string): string | null {
  // 간단한 색상 거리 계산
  const hex = hexColor.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);

  let minDistance = Infinity;
  let closestToken: string | null = null;

  for (const [mappedColor, token] of Object.entries(colorMapping)) {
    const mappedHex = mappedColor.replace('#', '');
    const mr = parseInt(mappedHex.substr(0, 2), 16);
    const mg = parseInt(mappedHex.substr(2, 2), 16);
    const mb = parseInt(mappedHex.substr(4, 2), 16);

    const distance = Math.sqrt(Math.pow(r - mr, 2) + Math.pow(g - mg, 2) + Math.pow(b - mb, 2));

    if (distance < minDistance) {
      minDistance = distance;
      closestToken = token;
    }
  }

  return minDistance < 50 ? closestToken : null; // 임계값 50
}

/**
 * 파일의 색상 리터럴을 변환
 */
function transformFile(filePath: string): { content: string; changes: number } {
  const content = fs.readFileSync(filePath, 'utf8');
  let changes = 0;

  // hex 색상 패턴
  const hexPattern = /#([0-9a-fA-F]{3,8})/g;
  let newContent = content.replace(hexPattern, (match, hex) => {
    const fullHex =
      hex.length === 3
        ? hex
            .split('')
            .map((c: string) => c + c)
            .join('')
        : hex;
    const color = `#${fullHex}`;
    const replacement = replaceColorLiteral(match, color);
    if (replacement !== match) changes++;
    return replacement;
  });

  // rgb/rgba 패턴
  const rgbPattern = /rgb\(a\)?\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*([\d.]+))?\s*\)/g;
  newContent = newContent.replace(rgbPattern, (match, r, g, b, _a) => {
    const hex = `#${parseInt(r).toString(16).padStart(2, '0')}${parseInt(g).toString(16).padStart(2, '0')}${parseInt(b).toString(16).padStart(2, '0')}`;
    const replacement = replaceColorLiteral(match, hex);
    if (replacement !== match) changes++;
    return replacement;
  });

  return { content: newContent, changes };
}

/**
 * 디렉토리 내 모든 파일 변환
 */
function transformDirectory(dirPath: string): {
  files: string[];
  totalChanges: number;
} {
  const files: string[] = [];
  let totalChanges = 0;

  function walkDir(currentPath: string) {
    const items = fs.readdirSync(currentPath);

    for (const item of items) {
      const fullPath = path.join(currentPath, item);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        // node_modules, .git 등 제외
        if (!item.startsWith('.') && item !== 'node_modules') {
          walkDir(fullPath);
        }
      } else if (item.endsWith('.tsx') || item.endsWith('.ts')) {
        const result = transformFile(fullPath);
        if (result.changes > 0) {
          files.push(fullPath);
          totalChanges += result.changes;
          fs.writeFileSync(fullPath, result.content);
        }
      }
    }
  }

  walkDir(dirPath);
  return { files, totalChanges };
}

/**
 * 메인 실행 함수
 */
function main() {
  const projectRoot = process.cwd();
  const srcPath = path.join(projectRoot, 'src');

  console.log('🎨 색상 리터럴을 테마 토큰으로 변환 중...');

  const result = transformDirectory(srcPath);

  console.log(`✅ 변환 완료!`);
  console.log(`📁 처리된 파일: ${result.files.length}개`);
  console.log(`🔄 총 변경사항: ${result.totalChanges}개`);

  if (result.files.length > 0) {
    console.log('\n📝 변환된 파일들:');
    result.files.forEach(file => {
      console.log(`  - ${path.relative(projectRoot, file)}`);
    });
  }

  console.log('\n⚠️  수동 검토가 필요한 항목들:');
  console.log('  - 변환된 색상이 의도한 대로 작동하는지 확인');
  console.log('  - 테마 토큰이 올바르게 import되었는지 확인');
  console.log('  - 런타임에서 색상이 올바르게 표시되는지 확인');
}

// 스크립트 실행
if (require.main === module) {
  main();
}

export { replaceColorLiteral, transformDirectory, transformFile };
