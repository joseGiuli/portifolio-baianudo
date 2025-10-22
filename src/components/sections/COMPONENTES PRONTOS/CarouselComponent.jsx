// pnpm dlx shadcn@latest init
// pnpm dlx shadcn@latest add carousel

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

const CarouselComponent = () => {
  const item = [<></>, <></>, <></>, <></>];

  return (
    <Carousel className="">
      <CarouselContent className="">
        {item.map((bullet, index) => (
          <CarouselItem key={'carousel' + index} className="">
            <Image
              src={`/images//.png`}
              alt=""
              width=""
              height=""
              className=""
            />
            <p className="">{bullet}</p>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
};

export default CarouselComponent;
