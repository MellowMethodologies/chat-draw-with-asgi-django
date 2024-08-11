'use client'
import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, OrbitControls, useTexture } from '@react-three/drei';
import * as THREE from 'three'
import { Html } from '@react-three/drei';

const planeH = 15;
const planeW = 10;

const SuperBall = ({ data , socketRef}) => {
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
        ballRef.current.position.set(socketRef.current.JSON.parse().data.new_x, 0.2, data.new_z);
    });
  
    return (
      <>
        <Sphere ref={ballRef} args={[0.2, 32, 32]} position={[0, 0.2, 0]}>
          <meshPhysicalMaterial 
            color="white" 
            roughness={0.1}
            clearcoat={1}
            clearcoatRoughness={0.1}
          />
        </Sphere>

      </>
    );
  }

export default SuperBall;