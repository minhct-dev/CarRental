import Footer from '../components/client/footer/Footer';
import Header from '../components/client/header/Header';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ClientLayout = () => {
  const profile = useSelector((state) => state.auth.profile); // role là một mảng
  // Kiểm tra nếu role chứa "carowner" hoặc "driver"
  const isCarOwner = profile?.roles?.some((r) => r === "carOwner");
  const isDriver = profile?.roles?.some((r) => r === "driver");
  
  // Nếu có role hợp lệ, điều hướng đến "/car-owner"
  if (isCarOwner) {
    return <Navigate to="/car-owner" />;
  }
  if (isDriver) {
    return <Navigate to="/driver" />;
  }
  else if(profile?.roles?.includes("admin")){
    return <Navigate to="/admin" />;
  }
  else{
    return (
      <>
        <Header />
        <Outlet />
        <Footer />
      </>
    );
  }


};

export default ClientLayout;
