import React from 'react';
import tw, { styled } from 'twin.macro';

interface PlantProps {
  progress: number;
}

const Plant: React.FC<PlantProps> = () => {
  // TODO: make progress adjust size of plant
  return (
    <Container>
      <Stem>
        <Leaf $position="1" />
        <Leaf $position="2" />
        <Leaf $position="3" />
        <Leaf $position="4" />
        <Leaf $position="5" />
        <Leaf $position="6" />
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

const Stem = styled.div`
  position: absolute;
  width: 2%;
  height: 30%;
  left: 49%;
  bottom: 20%;
  background: #70b77e;
  transform-origin: bottom;
  ${tw`animate-wave duration-300 ease-in-out`}
`;

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
}
const Leaf = styled.div(({ $position }: LeafProps) => [
  `
    position: absolute;
    width: 700%;
    height: 10%;
    border-radius: 50%;
    background: #70b77e;
  `,
  $position && LeafStyles[$position]
]);
export default Plant;
