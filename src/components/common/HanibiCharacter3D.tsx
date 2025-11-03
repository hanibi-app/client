import React, { useEffect, useRef, useState } from 'react';

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
  medium: '#f59e0b', // 주황색 (보통)
  high: '#ef4444', // 빨간색 (주의)
};

export default function HanibiCharacter3D({
  level = 'medium',
  animated = true,
  size = 200,
  testID = 'hanibi-character-3d',
}: HanibiCharacter3DProps) {
  const [color] = useState(LEVEL_COLORS[level]);

  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    // Cleanup timeout on unmount
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const onContextCreate = async (gl: ExpoWebGLRenderingContext) => {
    // Scene 설정
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f0f0);

    // Camera 설정
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    camera.position.z = 5;

    // Renderer 설정
    const renderer = new Renderer({ gl });
    renderer.setSize(size, size);

    // 조명 설정
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 10, 7.5);
    scene.add(directionalLight);

    // 한니비 캐릭터 만들기 (물방울 모양)
    const character = createHanibiCharacter(color);
    scene.add(character);

    // 애니메이션 변수
    let animationId: number | null = null;
    let frame = 0;

    // 애니메이션 루프
    const animate = () => {
      animationId = requestAnimationFrame(animate);

      if (animated) {
        frame += 0.01;

        // 부드러운 회전
        character.rotation.y = Math.sin(frame) * 0.3;

        // 호흡 효과 (크기 변화)
        const breathScale = 1 + Math.sin(frame * 2) * 0.05;
        character.scale.set(breathScale, breathScale, breathScale);

        // 위아래 움직임
        character.position.y = Math.sin(frame * 1.5) * 0.2;
      }

      renderer.render(scene, camera);
      gl.endFrameEXP();
    };

    animate();

    // Cleanup
    return () => {
      if (animationId !== null) {
        cancelAnimationFrame(animationId);
      }
    };
  };

  return (
    <View style={[styles.container, { width: size, height: size }]} testID={testID}>
      <GLView style={{ width: size, height: size }} onContextCreate={onContextCreate} />
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
    justifyContent: 'center',
  },
});

