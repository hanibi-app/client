import React, { useEffect, useRef } from 'react';

import { ExpoWebGLRenderingContext, GLView } from 'expo-gl';
import { Renderer } from 'expo-three';
import { StyleSheet, View } from 'react-native';
import * as THREE from 'three';

import { HanibiLevel } from '@/constants/hanibiThresholds';

export type HanibiCharacter3DProps = {
  level?: HanibiLevel;
  animated?: boolean;
  size?: number;
  testID?: string;
};

// 레벨별 색상 정의
const LEVEL_COLORS: Record<HanibiLevel, string> = {
  low: '#60a5fa', // 파란색 (쾌적)
  medium: '#90EE90', // 연두색 (온보딩/기본)
  high: '#ef4444', // 빨간색 (주의)
};

export default function HanibiCharacter3D({
  level = 'medium',
  animated = true,
  size = 200,
  testID = 'hanibi-character-3d',
}: HanibiCharacter3DProps) {
  const color = LEVEL_COLORS[level];
  const animationRef = useRef<number | null>(null);
  const rendererRef = useRef<any>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const characterRef = useRef<THREE.Group | null>(null);

  useEffect(() => {
    // Cleanup animation on unmount
    return () => {
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    };
  }, []);

  // level이 변경되면 색상 업데이트
  useEffect(() => {
    if (characterRef.current) {
      // 캐릭터 색상 업데이트
      const newColor = LEVEL_COLORS[level];
      characterRef.current.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          if (child.material instanceof THREE.MeshPhongMaterial) {
            child.material.color.set(newColor);
          }
        }
      });
    }
  }, [level]);

  const onContextCreate = async (gl: ExpoWebGLRenderingContext) => {
    try {
      console.log('GLView 컨텍스트 생성 시작, size:', size);
      
      // Scene 설정
      const scene = new THREE.Scene();
      scene.background = null; // 투명 배경
      sceneRef.current = scene;

      // 실제 GLView 크기 가져오기
      const width = gl.drawingBufferWidth || size;
      const height = gl.drawingBufferHeight || size;
      
      // 크기가 0이면 문제
      if (width === 0 || height === 0) {
        console.error('GLView 크기가 0입니다!', { width, height, size });
        return;
      }
      
      console.log('GLView 컨텍스트 정보:', {
        drawingBufferWidth: gl.drawingBufferWidth,
        drawingBufferHeight: gl.drawingBufferHeight,
        size,
        width,
        height,
      });

      // Camera 설정
      const camera = new THREE.PerspectiveCamera(75, width / height || 1, 0.1, 1000);
      camera.position.z = 5;
      cameraRef.current = camera;

      // Renderer 설정 - expo-three의 Renderer 사용
      const renderer = new Renderer({ gl });
      // expo-three Renderer는 자동으로 크기를 설정하므로 명시적 설정 불필요
      rendererRef.current = renderer;
      console.log('Renderer 생성 완료', { width, height });

      // 조명 설정
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
      scene.add(ambientLight);

      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
      directionalLight.position.set(5, 10, 7.5);
      scene.add(directionalLight);

      // 한니비 캐릭터 만들기 (물방울 모양)
      const character = createHanibiCharacter(color);
      scene.add(character);
      characterRef.current = character;
      console.log('캐릭터 생성 완료', {
        색상: color,
        캐릭터위치: character.position,
        캐릭터크기: character.scale,
        카메라위치: camera.position,
      });

      // 애니메이션 변수
      let frame = 0;
      let isRunning = true;

      // 초기 렌더링 (캐릭터가 즉시 보이도록)
      try {
        // expo-three Renderer의 render 메서드 호출
        if (renderer && typeof (renderer as any).render === 'function') {
          (renderer as any).render(scene, camera);
          gl.endFrameEXP();
          console.log('초기 렌더링 완료');
        } else {
          console.warn('Renderer render 메서드를 찾을 수 없음');
        }
      } catch (renderError) {
        console.error('초기 렌더링 오류:', renderError);
        if (renderError instanceof Error) {
          console.error('렌더링 오류 상세:', renderError.message, renderError.stack);
        }
      }

      // 애니메이션 루프
      const animate = () => {
        if (!isRunning) return;

        frame += 0.03; // 애니메이션 속도

        if (animated && character) {
          // 부드러운 회전
          character.rotation.y = Math.sin(frame) * 0.3;

          // 호흡 효과 (크기 변화)
          const breathScale = 1 + Math.sin(frame * 2) * 0.05;
          character.scale.set(breathScale, breathScale, breathScale);

          // 위아래 움직임
          character.position.y = Math.sin(frame * 1.5) * 0.2;
        }

        if (renderer && scene && camera) {
          try {
            if (typeof (renderer as any).render === 'function') {
              (renderer as any).render(scene, camera);
              gl.endFrameEXP();
            }
          } catch (error) {
            console.error('애니메이션 렌더링 오류:', error);
          }
        }

        // 다음 프레임 예약
        animationRef.current = requestAnimationFrame(animate);
      };

      // 애니메이션 시작
      animationRef.current = requestAnimationFrame(animate);
      console.log('애니메이션 시작, animated:', animated);

      // Cleanup 함수 반환
      return () => {
        isRunning = false;
        if (animationRef.current !== null) {
          cancelAnimationFrame(animationRef.current);
          animationRef.current = null;
        }
      };
    } catch (error) {
      console.error('3D 캐릭터 렌더링 오류:', error);
      // 에러를 더 자세히 로그
      if (error instanceof Error) {
        console.error('에러 메시지:', error.message);
        console.error('에러 스택:', error.stack);
      }
    }
  };

  // size가 0이면 렌더링하지 않음
  if (size <= 0) {
    console.warn('HanibiCharacter3D: size가 0 이하입니다', size);
    return <View style={styles.container} testID={testID} />;
  }

  return (
    <View 
      style={[
        styles.container, 
        { 
          width: size, 
          height: size,
        }
      ]} 
      testID={testID}
    >
      <GLView
        style={[
          styles.glView, 
          { 
            width: size, 
            height: size,
          }
        ]}
        onContextCreate={onContextCreate}
        msaaSamples={0}
      />
    </View>
  );
}

/**
 * 한니비 캐릭터 3D 모델 생성
 * 물방울 모양의 귀여운 캐릭터
 */
function createHanibiCharacter(color: string): THREE.Group {
  const character = new THREE.Group();

  // 메인 바디 (물방울 모양)
  const bodyGeometry = new THREE.SphereGeometry(1, 32, 32);
  // 아래쪽을 더 뾰족하게 만들기 위해 정점 조정
  const positions = bodyGeometry.attributes.position;
  for (let i = 0; i < positions.count; i++) {
    const y = positions.getY(i);
    if (y < 0) {
      const scale = 1 - Math.abs(y) * 0.3;
      positions.setX(i, positions.getX(i) * scale);
      positions.setZ(i, positions.getZ(i) * scale);
    }
  }
  bodyGeometry.computeVertexNormals();

  const bodyMaterial = new THREE.MeshPhongMaterial({
    color: color,
    shininess: 100,
    specular: 0xffffff,
  });
  const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
  character.add(body);

  // 눈 (왼쪽)
  const eyeGeometry = new THREE.SphereGeometry(0.15, 16, 16);
  const eyeMaterial = new THREE.MeshPhongMaterial({
    color: 0x000000,
  });
  const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
  leftEye.position.set(-0.3, 0.3, 0.8);
  character.add(leftEye);

  // 눈 (오른쪽)
  const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
  rightEye.position.set(0.3, 0.3, 0.8);
  character.add(rightEye);

  // 눈 하이라이트 (왼쪽)
  const highlightGeometry = new THREE.SphereGeometry(0.06, 8, 8);
  const highlightMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const leftHighlight = new THREE.Mesh(highlightGeometry, highlightMaterial);
  leftHighlight.position.set(-0.25, 0.35, 0.85);
  character.add(leftHighlight);

  // 눈 하이라이트 (오른쪽)
  const rightHighlight = new THREE.Mesh(highlightGeometry, highlightMaterial);
  rightHighlight.position.set(0.35, 0.35, 0.85);
  character.add(rightHighlight);

  // 입 (미소)
  const smileCurve = new THREE.QuadraticBezierCurve3(
    new THREE.Vector3(-0.3, 0, 0.85),
    new THREE.Vector3(0, -0.15, 0.9),
    new THREE.Vector3(0.3, 0, 0.85),
  );
  const smilePoints = smileCurve.getPoints(20);
  const smileGeometry = new THREE.BufferGeometry().setFromPoints(smilePoints);
  const smileMaterial = new THREE.LineBasicMaterial({ color: 0x000000, linewidth: 3 });
  const smile = new THREE.Line(smileGeometry, smileMaterial);
  character.add(smile);

  // 볼 터치 (왼쪽)
  const cheekGeometry = new THREE.SphereGeometry(0.12, 16, 16);
  const cheekMaterial = new THREE.MeshPhongMaterial({
    color: 0xff9999,
    transparent: true,
    opacity: 0.6,
  });
  const leftCheek = new THREE.Mesh(cheekGeometry, cheekMaterial);
  leftCheek.position.set(-0.6, 0, 0.6);
  character.add(leftCheek);

  // 볼 터치 (오른쪽)
  const rightCheek = new THREE.Mesh(cheekGeometry, cheekMaterial);
  rightCheek.position.set(0.6, 0, 0.6);
  character.add(rightCheek);

  return character;
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: 'transparent',
    justifyContent: 'center',
    overflow: 'visible',
  },
  glView: {
    backgroundColor: 'transparent',
  },
});

