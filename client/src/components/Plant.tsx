import React, { useState, useEffect } from 'react';
import tw, { styled } from 'twin.macro';

interface PlantProps {
  progress: number;
}

const Plant: React.FC<PlantProps> = ({ progress }) => {
  // TODO: make progress adjust size of plant
  const [growing, setGrowing] = useState(true);

  useEffect(() => {
    setTimeout(() => setGrowing(false), 1000);
  }, []);

  return (
    <Container>
      <Stem $growing={growing}>
        <Leaf $position="1" $growing={growing} />
        <Leaf $position="2" $growing={growing} />
        <Leaf $position="3" $growing={growing} />
        <Leaf $position="4" $growing={growing} />
        <Leaf $position="5" $growing={growing} />
        <Leaf $position="6" $growing={growing} />
      </Stem>
      <Pot />
      <PotTop />
    </Container>
  );
};

const Container = styled.div`
  ${tw`relative block w-72 h-72`}
`;

const Pot = styled.div`
  position: absolute;
  width: 20%;
  height: 20%;
  bottom: 0;
  left: 40%;
  background: #fcaa67;
  -webkit-clip-path: polygon(0 0, 100% 0, 90% 100%, 10% 100%);
  clip-path: polygon(0 0, 100% 0, 90% 100%, 10% 100%);
  box-shadow: inset 0 10px 16px rgba(0, 0, 0, 0.3);
`;

const PotTop = styled.div`
  position: absolute;
  width: 22%;
  height: 5%;
  bottom: 17%;
  left: 39%;
  background: #fcaa67;
  border-radius: 3px;
`;

interface StyleProps {
  $growing: boolean;
}

const Stem = styled.div(({ $growing }: StyleProps) => [
  `position: absolute;
  width: 2%;
  height: 30%;
  left: 49%;
  bottom: 20%;
  background: #70b77e;
  transform-origin: bottom;`,
  $growing
    ? tw`animate-grow duration-150`
    : tw`animate-wave duration-300 ease-in-out`
]);

const LeafStyles: Record<string, string> = {
  '1': `top: 70%; left: 50%; transform: rotate(-25deg);`,
  '2': `top: 50%; right: 50%; transform: rotate(205deg);`,
  '3': `top: 30%; left: 50%; transform: rotate(-25deg);`,
  '4': `top: 20%; right: 50%; transform: rotate(205deg);`,
  '5': `top: -17%; left: -120%; transform: rotate(-60deg);`,
  '6': `top: -9%; right: 22%; transform: rotate(195deg);`
};
interface LeafProps {
  $position: string;
  $growing: boolean;
}
const Leaf = styled.div(({ $position, $growing }: LeafProps) => [
  `
    position: absolute;
    width: 700%;
    height: 10%;
    border-radius: 50%;
    background: #70b77e;
  `,
  $position && LeafStyles[$position],
  $growing && tw`animate-leafGrow duration-100`
]);
export default Plant;
