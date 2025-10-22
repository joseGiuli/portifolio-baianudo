import Image from 'next/image';

function BannerComponent() {
  return (
    <div className="w-full flex md:grid md:grid-cols-2">
      {[0, 1, 2, 3, 4].map(item => (
        <div
          className={`w-full overflow-hidden ${item === 4 ? 'lg:hidden' : ''}`}
          key={'bannercomponent' + item}
        >
          <Image
            src={`/images//banner/${item}.png`}
            alt=""
            width=""
            height=""
            className="w-full hover:scale-125 transition-transform duration-500 ease-in-out"
          />
        </div>
      ))}
    </div>
  );
}

export default BannerComponent;
