import { Steps } from 'antd';
import "./StepComponent.scss"
const items = [
  {
    title: 'Đăng nhập',
  },
  {
    title: 'Thanh toán',
  },
  {
    title: 'Hoàn thành',
  },
];
const StepComponent = ({stepCurrent}) => (
  <div className='step'>
    <Steps current={stepCurrent} labelPlacement="vertical" items={items} />
  </div>
);
export default StepComponent;