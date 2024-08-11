'use client'
import React, { useRef,useState, useEffect, useCallback } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import Plane from './plane.jsx'
import { Sphere } from 'three';
import Background from 'three/examples/jsm/renderers/common/Background.js';

const planeH = 15;
const planeW = 10;
const planeX = 0;

const Paddle = React.memo(({position}) => {
  return (
    <mesh position={position}>
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

const ThreeScene = () => {
  const [score, setScore] = useState({ player1: 0, player2: 0 });
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  });
  const socketRef = useRef(null);
  const ballRef = useRef();

  //backend
  useEffect(()=>{
    socketRef.current = new WebSocket('ws://localhost:8000/ws/game/');

    socketRef.current.onopen = () => {
      console.log('WebSoket connected');
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
      console.log('disconnect webs');
    };

    return () =>{
      if(socketRef.current){
        socketRef.current.close();
      }
    };

  }, []);

  const handleGameUpdate = (data) => {
    switch(data.type) {
      case 'paddle_move':
        if(data.player == 'player1')
          setPaddle2Pos(data.paddlePos);
        else if(data.player == 'player2')
          setPaddle2Pos(data.paddlePos);
        break;
      case 'ball_move':
        const ballRef = useRef();
 
        useFrame(() => {
            //backend
            if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
              socketRef.current.send(JSON.stringify({
                type: 'ball_move',
                position: ballRef.current.position
              }));
            }    
            // Update position
            ballRef.current.position.set(data.new_x, data.radius, data.new_z);
        });
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

  //backend 
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
    let paddle1Direction = 0;
    let paddle2Direction = 0;

    const handleKeyDown = (event) => {
      switch (event.key) {
        case 'ArrowLeft':
          paddle1Direction = 1;
          break;
        case 'ArrowRight':
          paddle1Direction = -1;
          break;
        case 'a':
          paddle2Direction = 1;
          break;
        case 'd':
          paddle2Direction = -1;
          break;
      }
    };

    const handleKeyUp = (event) => {
      switch (event.key) {
        case 'ArrowLeft':
        case 'ArrowRight':
          paddle1Direction = 0;
          break;
        case 'a':
        case 'd':
          paddle2Direction = 0;
          break;
      }
    };


    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
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
          enableZoomv={false}
          minPolarAngle={Math.PI / 6}
          maxPolarAngle={Math.PI / 6}
        />
        <ambientLight intensity={0.4} />
        <Plane />
        <mesh ref={ballRef} position={[0, 0.2, 0]} args={[0.2, 32, 32]}>
          <meshPhysicalMaterial
            color="white"
            roughness={0.1}
            clearcoat={1}
            clearcoatRoughness={0.1}
          />
        </mesh>
        <Paddle position={[0,0,7.4]} />
        <Paddle position={[0,0,-7.4]} />
      </Canvas>
    </div>
  );
};

export default ThreeScene;
