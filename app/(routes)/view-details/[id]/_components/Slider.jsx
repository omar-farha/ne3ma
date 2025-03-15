import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";

function Slider({ imageList }) {
  return (
    <div className="mt-5">
      {imageList ? (
        <Carousel>
          <CarouselContent>
            {imageList.map((image, index) => (
              <CarouselItem key={index}>
                <Image
                  src={image.url}
                  width={800}
                  height={300}
                  alt="image"
                  className="rounded-xl object-cover h-[360px] w-full"
                />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      ) : (
        <div className=" h-[300px] bg-slate-200 animate-pulse rounded-lg "></div>
      )}
    </div>
  );
}

export default Slider;
