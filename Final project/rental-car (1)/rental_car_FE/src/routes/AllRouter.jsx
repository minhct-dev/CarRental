import { useRoutes } from "react-router-dom";
import Auth from "../pages/client/auth/Auth";
import Home from "../pages/client/Home/Home";
import Profile from "../pages/client/profile/Profile";
import CarOwnerLayout from "../layouts/CarOwnerLayout";
import CarOwnerHome from "../pages/carOwner/home/Home";
import ActiveNotify from "../pages/client/active/ActiveNotify";
import ActiveAccount from "../pages/client/active/ActiveAccount";
import ForgotPassword from "../pages/client/forgotPassword/ForgotPassword";
import CarDetail from "../pages/client/carDetail/CarDetail";
import Wallet from "../pages/client/wallet/Wallet";
import PrivateRouter from "./PrivateRouter";
import ClientLayout from "../layouts/ClientLayout";
import CarListClient from "../pages/client/listCar/CarList";
import AddCar from "../pages/carOwner/addCar/AddCar";
import BookingList from "./../pages/client/bookingList/BookingList";
import Booking from "../pages/client/booking/Booking";
import BookingDetail from "../pages/client/bookingDetail/BookingDetail";
import WalletCarOwner from "../pages/carOwner/wallet/Wallet";
import CheckToken from "../pages/client/forgotPassword/checkToken";
import Bill from "../pages/client/bill/Bill";
import NotFound from "../components/err/NotFound";
import ProfileCarOwner from "../components/carOwner/profile/Profile";
import FeedBack from "../pages/carOwner/feedback/Feedback";
import RootBooking from "../pages/carOwner/bookingList/RootBooking";
import RequestList from "./../pages/driver/requestList/RequestList";
import AdminLayout from "../layouts/AdminLayout";
import AdminHome from "../pages/admin/Home/Home";
import BookingDetailCarOwner from "../pages/carOwner/bookingDetail/BookingDetail";
import { CarListRoot } from "../pages/carOwner/carList/CarListRoot";
import CarManagement from "../pages/admin/carManagement/CarManagement";
import BookingDetailDriver from "./../pages/driver/bookingDetail/BookingDetailDriver";
import EditRoot from "../pages/carOwner/editCar.jsx/EditRoot";
import EditDraftCar from "../pages/carOwner/editDraftCar/EditDraftCar";
import UserListDraft from "../pages/admin/userManagement/UserListDraft";
import CarDetailAdmin from "../pages/admin/carDetail/CarDetail";
import { UserListManagementRoot } from "../pages/admin/userManagement/UserManagementRoot";
import CarOwnerVoucher from "../pages/carOwner/voucher/CarOwnerVoucher";
import AddVoucher from "../components/carOwner/voucher/AddVoucher";
import EditVoucher from "../components/carOwner/voucher/EditVoucher";
import VoucherManagement from "../pages/admin/voucherManagement/VoucherManagement";
import AddVoucherAdmin from "../pages/admin/voucherManagement/AddVoucherAdmin";
import UpdateVoucherAdmin from "../pages/admin/voucherManagement/UpdateVoucherAdmin";
import ChatBoxIndex from "../pages/common";
import CarOwnerProfile from "./../pages/client/carOwnerProfile/CarOwnerProfile";
const AllRouter = () => {
  const routes = [
    {
      path: "/",
      element: <ClientLayout />,
      children: [
        {
          path: "",
          element: <Home />,
        },
        {
          path: "auth",
          element: <Auth />,
        },
        {
          path: "profile",
          element: (
            <PrivateRouter>
              <Profile></Profile>
            </PrivateRouter>
          ),
        },
        {
          path: "active-no",
          element: <ActiveNotify />,
        },
        {
          path: "active",
          element: <ActiveAccount />,
        },
        {
          path: "forgot-password",
          element: <ForgotPassword />,
        },
        {
          path: "reset",
          element: <CheckToken />,
        },
        {
          path: "car/:id",
          element: <CarDetail />,
        },
        {
          path: "search",
          element: <CarListClient />,
        },
        {
          path: "bill/:id",
          element: <Bill />,
        },
        {
          path: "wallet",
          element: (
            <PrivateRouter>
              <Wallet></Wallet>
            </PrivateRouter>
          ),
        },
        {
          path: "booking",
          element: (
            <PrivateRouter>
              <Booking></Booking>
            </PrivateRouter>
          ),
        },
        {
          path: "my-booking",
          element: (
            <PrivateRouter>
              <BookingList />
            </PrivateRouter>
          ),
        },
        {
          path: "booking/:id",
          element: (
            <PrivateRouter>
              <BookingDetail />
            </PrivateRouter>
          ),
        },
        {
          path: "chat",
          element: (
            <PrivateRouter>
              <ChatBoxIndex />
            </PrivateRouter>
          ),
        },
        {
          path: "car-owner-info/:id",
          element: <CarOwnerProfile />,
        },
      ],
    },
    {
      path: "/car-owner",
      element: (
        <PrivateRouter>
          <CarOwnerLayout />
        </PrivateRouter>
      ),
      children: [
        {
          path: "",
          element: <CarOwnerHome></CarOwnerHome>,
        },
        {
          path: "car-list",
          element: <CarListRoot></CarListRoot>,
        },
        {
          path: "add-car",
          element: <AddCar></AddCar>,
        },
        {
          path: "edit-car/:id",
          element: <EditRoot></EditRoot>,
        },
        {
          path: "edit-car-draft/:id",
          element: <EditDraftCar></EditDraftCar>,
        },
        {
          path: "profile",
          element: <ProfileCarOwner></ProfileCarOwner>,
        },
        {
          path: "wallet",
          element: <WalletCarOwner></WalletCarOwner>,
        },
        {
          path: "booking-list",
          element: <RootBooking></RootBooking>,
        },
        {
          path: "feedback-report",
          element: <FeedBack />,
        },
        {
          path: "booking/:id",
          element: <BookingDetailCarOwner />,
        },
        {
          path: "voucher",
          element: <CarOwnerVoucher />,
        },
        {
          path: "add-voucher",
          element: <AddVoucher />,
        },
        {
          path: "edit-voucher/:id",
          element: <EditVoucher />,
        },
        {
          path: "chat",
          element: <ChatBoxIndex />,
        },
      ],
    },
    {
      path: "/admin",
      element: <AdminLayout></AdminLayout>,
      children: [
        {
          path: "",
          element: <AdminHome></AdminHome>,
        },
        {
          path: "car-management",
          element: <CarManagement></CarManagement>,
        },
        {
          path: "car-detail/:id",
          element: <CarDetailAdmin></CarDetailAdmin>,
        },
        {
          path: "user-management",
          element: <UserListManagementRoot></UserListManagementRoot>,
        },
        {
          path: "user-draft",
          element: <UserListDraft></UserListDraft>,
        },
        {
          path: "voucher",
          element: <VoucherManagement></VoucherManagement>,
        },
        {
          path: "add-voucher",
          element: <AddVoucherAdmin></AddVoucherAdmin>,
        },
        {
          path: "edit-voucher/:id",
          element: <UpdateVoucherAdmin></UpdateVoucherAdmin>,
        },
        {
          path:"wallet",
          element:<Wallet></Wallet>
        }
      ],
    },
    {
      path: "/driver",
      element: (
        <PrivateRouter>
          <CarOwnerLayout />
        </PrivateRouter>
      ),
      children: [
        {
          path: "",
          element: <CarOwnerHome></CarOwnerHome>,
        },
        {
          path: "profile",
          element: <ProfileCarOwner></ProfileCarOwner>,
        },
        {
          path: "wallet",
          element: <WalletCarOwner></WalletCarOwner>,
        },
        {
          path: "request",
          element: <RequestList />,
        },
        {
          path: "request-detail/:id",
          element: <BookingDetailDriver />,
        },
      ],
    },

    {
      path: "*",
      element: <NotFound></NotFound>,
    },
  ];

  return useRoutes(routes);
};

export default AllRouter;
