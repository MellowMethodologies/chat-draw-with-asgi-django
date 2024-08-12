'use client'
import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import Plane from './plane.jsx'
import { Sphere } from 'three';

const planeH = 15;
const planeW = 10;
const planeX = 0;

const Paddle = React.memo(({ position, paddleRef }) => {
  return (
    <mesh position={position} ref={paddleRef}>
      <boxGeometry args={[2, 0.2, 0.2]} />
      <meshPhongMaterial color="white" />
    </mesh>
  );
});

const ResponsiveCamera = () => {
  const { viewport, camera } = useThree()

  useFrame(() => {
    camera.aspect = viewport.width / viewport.height
    camera.updateProjectionMatrix()
  })

  return null
}

const Ball = ({ socketRef, ballRef }) => {
  useFrame(() => {
    if (ballRef.current && socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({
        type: 'ball_move',
        position: ballRef.current.position.toArray()
      }));
    }
  });

  return (
    <mesh ref={ballRef} position={[0, 0.2, 0]}>
      <sphereGeometry args={[0.2, 32, 32]} />
      <meshPhysicalMaterial
        color="white"
        roughness={0.1}
        clearcoat={1}
        clearcoatRoughness={0.1}
      />
    </mesh>
  );
};

const ThreeScene = () => {
  const [score, setScore] = useState({ player1: 0, player2: 0 });
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  });
  const socketRef = useRef(null);
  const ballRef = useRef();
  const paddle1Ref = useRef();
  const paddle2Ref = useRef();

  useEffect(() => {
    socketRef.current = new WebSocket('ws://localhost:8000/ws/game/');

    socketRef.current.onopen = () => {
      console.log('WebSocket connected');
    };

    socketRef.current.onmessage = (event) => {
      if (event.data) {
        try {
          const data = JSON.parse(event.data);
          handleGameUpdate(data);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      } else {
        console.warn('Received empty WebSocket message');
      }
    };

    socketRef.current.onclose = () => {
      console.log('WebSocket disconnected');
    };

    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, []);

  const handleGameUpdate = (data) => {
    switch(data.type) {
      case 'paddle_move':
        if (data.player === 'player1' && paddle1Ref.current) {
          paddle1Ref.current.position.x = data.paddlePos;
        } else if (data.player === 'player2' && paddle2Ref.current) {
          paddle2Ref.current.position.x = data.paddlePos;
        }
        break;
      case 'ball_move':
        if (ballRef.current) {
          ballRef.current.position.set(data.new_x, data.radius, data.new_z);
        }
        break;
      case 'score_update':
        setScore(data.score);
        break;
    }
  }

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleScoreUpdate = useCallback((newScore) => {
    setScore(newScore);
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({
        type: 'score_update',
        score: newScore
      }));
    }
  }, []);

  useEffect(() => {
    const handleKeyDown = (event) => {
      let paddleDirection = 0;
      let player = '';

      switch (event.key) {
        case 'ArrowLeft':
          paddleDirection = -1;
          player = 'player1';
          break;
        case 'ArrowRight':
          paddleDirection = 1;
          player = 'player1';
          break;
        case 'a':
          paddleDirection = -1;
          player = 'player2';
          break;
        case 'd':
          paddleDirection = 1;
          player = 'player2';
          break;
      }

      if (paddleDirection !== 0 && socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
        socketRef.current.send(JSON.stringify({
          type: 'paddle_move',
          player: player,
          direction: paddleDirection
        }));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div style={{ 
      width: '100vw', 
      height: '80vh', 
      minWidth: '500px', 
      minHeight: '500px'
    }}>
      <Canvas camera={{ fov: 45, position: [0, -20, -10] }}>
        <ResponsiveCamera />
        <OrbitControls
          enableZoom={false}
          minPolarAngle={Math.PI / 6}
          maxPolarAngle={Math.PI / 6}
        />
        <ambientLight intensity={0.4} />
        <Plane />
        <Ball socketRef={socketRef} ballRef={ballRef} />
        <Paddle position={[0, 0, 7.4]} paddleRef={paddle1Ref} />
        <Paddle position={[0, 0, -7.4]} paddleRef={paddle2Ref} />
      </Canvas>
      <div style={{ position: 'absolute', top: '10px', left: '10px', color: 'white' }}>
        Score: Player 1 - {score.player1}, Player 2 - {score.player2}
      </div>
    </div>
  );
};

export default ThreeScene;