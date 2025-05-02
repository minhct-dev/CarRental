import { useRef, useMemo, useState } from "react";
import { Box, IconButton } from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { Navigation } from "swiper/modules";
import VoucherDetail from "./VoucherDetail";
import image from "../../../../assets/coupon.png";
const VoucherCarousel = ({ data }) => {
  const swiperRef = useRef(null);
  const [open, setOpen] = useState(false)
  const [selectVoucher, setSelectVoucher] = useState(null)
  const handleColose = () => {
    setSelectVoucher(null)
    setOpen(false)
  }
  const handleOpen = (item) => {
    setSelectVoucher(item)
    setOpen(true)
  }

  const handleNext = () => {
    if (swiperRef.current && swiperRef.current.swiper) {
      swiperRef.current.swiper.slideNext();
    }
  };

  const handlePrev = () => {
    if (swiperRef.current && swiperRef.current.swiper) {
      swiperRef.current.swiper.slidePrev();
    }
  };

  const swiperConfig = useMemo(() => {
    if (data.length === 1) {
      return { slidesPerView: 1, spaceBetween: 0 };
    } else if (data.length === 2) {
      return { slidesPerView: 2, spaceBetween: 30 };
    } else {
      return { slidesPerView: 3, spaceBetween: 30 };
    }
  }, [data.length]);

  return (
    <Box sx={{ width: "100%", mt: 5, position: "relative", display: "flex", justifyContent: "center" }}>
      <Box sx={{ width: swiperConfig.slidesPerView * 350 + (swiperConfig.slidesPerView - 1) * swiperConfig.spaceBetween }}>
        <Swiper
          ref={swiperRef}
          slidesPerView={swiperConfig.slidesPerView}
          spaceBetween={swiperConfig.spaceBetween}
          modules={[Navigation]}
          navigation={false}
        >
          {data.map((item) => (
            <SwiperSlide key={item.id}>
              <Box
                sx={{
                  width: "350px",
                  height: "230px",
                  cursor:"pointer"
                }}
                onClick={() => handleOpen(item)}
              >
                <img
                  style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius:"10px" }}
                  src={item.voucherImageUrl ||image }
                  alt=""
                />
              </Box>
            </SwiperSlide>
          ))}
        </Swiper>
        {data.length > 3 && (
          <>
            <IconButton
              onClick={handlePrev}
              sx={{
                position: "absolute",
                top: "50%",
                left: "-40px",
                transform: "translateY(-50%)",
                zIndex: 10,
              }}
            >
              <ArrowBackIosIcon />
            </IconButton>
            <IconButton
              onClick={handleNext}
              sx={{
                position: "absolute",
                top: "50%",
                right: "-40px",
                transform: "translateY(-50%)",
                zIndex: 10,
              }}
            >
              <ArrowForwardIosIcon />
            </IconButton>
          </>
        )}
        <VoucherDetail open={open} handleClose={handleColose} data={selectVoucher}></VoucherDetail>
      </Box>
    </Box>
  );
};

export default VoucherCarousel;