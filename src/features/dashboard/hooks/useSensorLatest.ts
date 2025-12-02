/**
 * 최신 센서 데이터 조회 React Query 훅
 * 5초마다 자동으로 최신 센서 데이터를 폴링합니다.
 */

import { useQuery } from '@tanstack/react-query';

import { fetchSensorLatest, SensorLatestResponse } from '@/api/sensors';

/**
 * 파싱된 센서 데이터 타입
 * 문자열 필드를 숫자로 변환한 형태입니다.
 */
export type ParsedSensorLatest = {
  temperature: number;
  humidity: number;
  weight: number; // kg 단위
  gas: number;
};

/**
 * 센서 응답 데이터를 파싱하여 숫자 타입으로 변환합니다.
 *
 * @param raw 원본 센서 응답 데이터
 * @returns 파싱된 센서 데이터
 */
function parseSensorLatest(raw: SensorLatestResponse): ParsedSensorLatest {
  const temperature = parseFloat(raw.temperature);
  const weightGram = parseFloat(raw.weight);
  const gas = parseFloat(raw.gas);

  return {
    temperature: Number.isFinite(temperature) ? temperature : 0,
    humidity: raw.humidity ?? 0,
    // TODO: 실제 단위가 다르면 주석으로 TODO를 남겨줘
    // 현재는 g 단위로 가정하고 kg로 변환 (실제 API 응답 단위 확인 필요)
    weight: Number.isFinite(weightGram) ? weightGram / 1000 : 0, // g -> kg 가정
    gas: Number.isFinite(gas) ? gas : 0,
  };
}

/**
 * 최신 센서 데이터를 조회하는 React Query 훅
 * 5초마다 자동으로 데이터를 갱신합니다.
 *
 * @param deviceId 조회할 기기의 ID
 * @returns useQuery 객체 - 파싱된 센서 데이터를 반환합니다.
 *
 * @example
 * ```tsx
 * function DashboardScreen() {
 *   const { data, isLoading, isError, refetch } = useSensorLatest('HANIBI-ESP32-001');
 *
 *   if (isLoading) return <Text>로딩 중...</Text>;
 *   if (isError) return <Text>에러 발생</Text>;
 *
 *   return (
 *     <View>
 *       <Text>온도: {data?.temperature}°C</Text>
 *       <Text>습도: {data?.humidity}%</Text>
 *     </View>
 *   );
 * }
 * ```
 */
export function useSensorLatest(deviceId: string) {
  return useQuery<ParsedSensorLatest>({
    queryKey: ['sensor-latest', deviceId],
    queryFn: async () => {
      const raw = await fetchSensorLatest(deviceId);
      return parseSensorLatest(raw);
    },
    refetchInterval: 5000, // 5초마다 자동 폴링
    retry: 1,
    enabled: !!deviceId, // deviceId가 있을 때만 조회
  });
}
