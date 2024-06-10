import FlexCardLayout from '@/component/flex-card-layout';
import { Card, CardBody } from '@nextui-org/react';

const ExampleCard: React.FC<{ text: string }> = ({ text }) => {
  return (
    <div
      className='bg-white shadow-md p-4 rounded-md w-auto inline-block '
      style={{ width: 'fit-content' }}
    >
      {text}
    </div>
  );
};

const App: React.FC = () => {
  const items = Array.from({ length: 10 }, (_, index) => (
    <ExampleCard key={index} text={`Card ${index + 1}`} />
  ));

  return (
    <div className='p-4'>
      <h1 className='text-xl font-bold mb-4'>Flex Card Layout Example</h1>
      <FlexCardLayout columns={3} gap={16}>
        {items}
      </FlexCardLayout>
    </div>
  );
};

export default App;
