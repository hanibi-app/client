/**
 * 상대 시간 포맷 유틸리티
 * 날짜를 "방금 전", "5분 전" 등의 상대 시간 문자열로 변환합니다.
 */

/**
 * ISO 날짜 문자열을 상대 시간 문자열로 변환
 * @param isoString ISO 8601 형식의 날짜 문자열 (예: "2025-12-02T07:27:26.420Z")
 * @returns 상대 시간 문자열 (예: "방금 전", "5분 전", "2시간 전", "3일 전")
 */
export function formatRelativeTime(isoString: string | null): string {
  if (!isoString) {
    return '마지막 신호 없음';
  }

  try {
    const date = new Date(isoString);
    if (Number.isNaN(date.getTime())) {
      return '알 수 없음';
    }

    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSeconds = Math.floor(diffMs / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffSeconds < 10) {
      return '방금 전';
    }
    if (diffSeconds < 60) {
      return `${diffSeconds}초 전`;
    }
    if (diffMinutes < 60) {
      return `${diffMinutes}분 전`;
    }
    if (diffHours < 24) {
      return `${diffHours}시간 전`;
    }
    if (diffDays < 7) {
      return `${diffDays}일 전`;
    }

    // 7일 이상이면 절대 날짜로 표시
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return '알 수 없음';
  }
}
