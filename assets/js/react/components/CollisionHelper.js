import * as React from "react";
import { Line } from "@react-three/drei";
import { Triangle } from "three";

/** @type React.ComponentType<{triangle: Triangle}> */
const TriangleRender = ({triangle}) => {
  const {a, b, c} = triangle;
  return <Line points={[a.toArray(), b.toArray(), c.toArray()]} color="hotpink" renderOrder={999} depthTest={false} depthWrite={false} />
}

/** @type React.ComponentType<{triangles: Triangle[]}> */
export const CollisionHelper = ({ triangles }) => {
  return (
    <>
      {triangles.map((t, index) => (
        <TriangleRender triangle={t} key={index}/>
      ))}
    </>
  );
};
