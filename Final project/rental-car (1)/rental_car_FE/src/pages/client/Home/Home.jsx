import { Box } from "@mui/material";
import Header from "../../../components/client/home/headerHome/Header";
import HowItWork from "../../../components/client/home/work/HowItWork";
import { useEffect, useRef } from "react";
import AOS from "aos";
import WhyUs from "../../../components/client/home/whyus/WhyUs";
import Comment from "../../../components/client/home/Comment/Comment";
import VoucherHomePage from "../../../components/client/home/voucher/VoucherHomePage";
import { useQuery } from "@tanstack/react-query";
import { getVoucherHomePageApi } from "../../../api/homeApi";
import Loading from "../loading/Loading";
import { useLocation, useNavigate } from "react-router-dom";
const Home = () => {
  const howItWorkRef = useRef(null);
  const voucherRef = useRef(null);
  const whyUsRef = useRef(null);
  const commentRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);

  const { data, isLoading } = useQuery({
    queryKey: ["voucher-home"],
    queryFn: getVoucherHomePageApi,
  });

  useEffect(() => {
    const scrollTo = new URLSearchParams(location.search).get("scrollTo");
    if (scrollTo) {
      let ref;
      switch (scrollTo) {
        case "howItWork":
          ref = howItWorkRef;
          break;
        case "voucher":
          ref = voucherRef;
          break;
        case "whyUs":
          ref = whyUsRef;
          break;
        case "comment":
          ref = commentRef;
          break;
        default:
          break;
      }
      if (ref && ref.current) {
        ref.current.scrollIntoView({ behavior: "smooth" });
        // Xóa tham số truy vấn sau khi cuộn
        navigate("/", { replace: true });
      }
    }
  }, [location, navigate]);

  if (isLoading) {
    return <Loading></Loading>;
  }
  return (
    <Box>
      <Header></Header>
      <div ref={howItWorkRef}>
        <HowItWork />
      </div>
      <div ref={voucherRef}>
        <VoucherHomePage data={data?.listVoucherHomepage} />
      </div>
      <div ref={whyUsRef}>
        <WhyUs />
      </div>
      <div ref={commentRef}>
        <Comment />
      </div>
    </Box>
  );
};

export default Home;
