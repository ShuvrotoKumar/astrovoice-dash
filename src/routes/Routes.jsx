import { createBrowserRouter, Navigate } from "react-router-dom";
import SignInPage from "../pages/auth/SignInPage";
import ForgetPassword from "../pages/auth/ForgetPassword";
import VerificationCode from "../pages/auth/VerificationCode";
import ResetPassword from "../pages/auth/ResetPassword";
import MainLayout from "../layout/MainLayout";
import DashboardPage from "../pages/dashboard/DashboardPage";
import PrivacyPolicy from "../pages/Privacy Policy/PrivacyPolicy";
import TermsCondition from "../pages/Terms Condition/TermsCondition";
import UserDetails from "../pages/userDetails/UserDetails";
import CreateUser from "../pages/userDetails/CreateUser";
import ProfilePage from "../pages/profile/ProfilePage";
import Settings from "../pages/Settings/Settings";
import ChangePass from "../pages/profile/ChangePass";
import AboutUs from "../pages/optional/AboutUs";
import EditProfile from "../pages/profile/EditProfile";
import CreateAdmin from "../pages/Create Admin/CreateAdmin";
import AddAdmin from "../pages/Add Admin/AddAdmin"
import Categories from "../pages/Categories/Categories";
import Earnings from "../pages/Earnings/Earnings";
import Notifications from "../pages/Notifications/Notifications";
import Subscriptions from "../pages/subscriptions/Subscriptions";
import Chat from "../pages/Chat/Chat";
import Blogs from "../pages/Blogs/Blogs";
import Reports from "../pages/Reports/Reports";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/sign-in" replace />,
  },
  {
    path: "/sign-in",
    element: <SignInPage />,
  },
  {
    path: "/forget-password",
    element: <ForgetPassword />,
  },
  {
    path: "/verification-code",
    element: <VerificationCode />,
  },
  {
    path: "/new-password",
    element: <ResetPassword />,
  },

  {
    path: "/dashboard",
    element: <MainLayout />,
    children: [
      {
        path: "",
        element: <DashboardPage />,
      },
      {
        path: "user-details",
        element: <UserDetails />,
      },

    
     
      {
        path: "create-user",
        element: <CreateUser />,
      },

      // settings
      {
        path: "privacy-policy",
        element: <PrivacyPolicy />,
      },
      {
        path: "terms-and-condition",
        element: <TermsCondition />,
      },
      {
        path: "blogs",
        element: <Blogs />,
      },
      {
        path: "reports",
        element: <Reports />,
      },
      {
        path: "settings",
        element: <Settings />,
      },
      {
        path: "edit-profile",
        element: <EditProfile />,
      },
      {
        path: "change-password",
        element: <ChangePass />,
      },
      {
        path: "about-us",
        element: <AboutUs />,
      },
      {
        path: "create-admin",
        element: <CreateAdmin />,
      },
      {
        path: "add-admin",
        element: <AddAdmin />,
      },
      {
        path: "chat",
        element: <Chat />,
      },
      {
        path: "notifications",
        element: <Notifications />,
      },
      {
        path: "profile",
        element: <ProfilePage />,
      },
  
      {
        path:"categories",
        element:<Categories/>
      },
      {
        path:"earnings",
        element:<Earnings/>
      }, 
      {
        path:"subscriptions",
        element:<Subscriptions/>
      }, 
      // {
      //   path:"/chat",
      //   element:<Chat/>
      // },
    ],
  },
]);

export default router;
