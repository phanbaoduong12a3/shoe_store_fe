import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const HeroSection = () => {
  return (
    <div className="w-full max-w-container mx-auto mb-8">
      <Swiper modules={[Pagination]} slidesPerView={1} pagination={{ clickable: true }}>
        <SwiperSlide>
          <div className=" h-80 flex items-center justify-center text-white rounded-lg overflow-hidden">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuC104btx6RhJkUVGOFYmrGEewwwYCv-JlUaTDb5bHPp84UL1yPoVslIabUmEiDIdZZ-pM9Hkw-6c9W6HYC0jQSyOPT5pnHv51UTUFQCGGz1AeT1gA3OH-zhWFPVpzf51dQ0McRHt7-WBZghJOatzAllRj8FdWF9QWaHK9OK70FnoJF5kjQYELLZ9kHikUT9u3HmdGWhpwV5feoIBGiQGf3M8PvouW0WjCkavclkTIIteIHwMzxCrsecY9CpEVFrhB8u116kwRiN7NCE"
              alt=""
              className="w-full h-full object-cover"
            />
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className=" h-80 flex items-center justify-center text-white rounded-lg overflow-hidden">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuC104btx6RhJkUVGOFYmrGEewwwYCv-JlUaTDb5bHPp84UL1yPoVslIabUmEiDIdZZ-pM9Hkw-6c9W6HYC0jQSyOPT5pnHv51UTUFQCGGz1AeT1gA3OH-zhWFPVpzf51dQ0McRHt7-WBZghJOatzAllRj8FdWF9QWaHK9OK70FnoJF5kjQYELLZ9kHikUT9u3HmdGWhpwV5feoIBGiQGf3M8PvouW0WjCkavclkTIIteIHwMzxCrsecY9CpEVFrhB8u116kwRiN7NCE"
              alt=""
              className="w-full h-full object-cover"
            />
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className=" h-80 flex items-center justify-center text-white rounded-lg overflow-hidden">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuC104btx6RhJkUVGOFYmrGEewwwYCv-JlUaTDb5bHPp84UL1yPoVslIabUmEiDIdZZ-pM9Hkw-6c9W6HYC0jQSyOPT5pnHv51UTUFQCGGz1AeT1gA3OH-zhWFPVpzf51dQ0McRHt7-WBZghJOatzAllRj8FdWF9QWaHK9OK70FnoJF5kjQYELLZ9kHikUT9u3HmdGWhpwV5feoIBGiQGf3M8PvouW0WjCkavclkTIIteIHwMzxCrsecY9CpEVFrhB8u116kwRiN7NCE"
              alt=""
              className="w-full h-full object-cover"
            />
          </div>
        </SwiperSlide>
      </Swiper>
    </div>
  );
};

export default HeroSection;
