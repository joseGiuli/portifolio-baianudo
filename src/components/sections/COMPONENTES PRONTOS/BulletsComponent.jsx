import Image from 'next/image';

const BulletsComponent = () => {
  const bullets = [<></>, <></>, <></>, <></>];

  return (
    <div className="">
      {bullets.map((bullet, index) => (
        <div key={'bulletsection' + index} className="">
          <Image src={`/images//.png`} alt="" width="" height="" className="" />
          <p className="">{bullet}</p>
        </div>
      ))}
    </div>
  );
};

export default BulletsComponent;
