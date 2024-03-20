import { useEffect} from "react";
import {Route, Routes, useLocation, useNavigate, useParams} from "react-router-dom";
import Dashboard from "./pages/dashboard";
import Profile from "./components/profile";
import Layout from "./components/layout";
import Myurl from "./components/myurl";
import Login from "./features/auth/login";
import Register from "./features/auth/register";
import FingerprintJS from "@fingerprintjs/fingerprintjs";
import Report from "./pages/test";
import ProtectedRoutes from "./Utils/protectedRoutes";
import Pricing from "./pages/pricing";
import Checkout from "./components/checkout";
import { useIdentifyUserMutation } from "./app/services/auth";
import { setCredentials } from "./features/auth/authslice";
import useLocalStorage from "./Utils/hooks/use-local-storage";
import { useAppDispatch } from "./app/hook";
import AdminLayout from "./components/admin-layout";
import Landing from "./pages/landing";
import Setting from "./pages/setting";
import Subscription from "./components/subscription";
import LinkInBio from "./pages/link-in-bio";
import LinksInBio from "./pages/links-in-bio";
import ManageLinkInBio from "./pages/manage-link-in-bio";

function App() {
  const {pathname} = useLocation();
  const Navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [values, setValue] = useLocalStorage("token", "");
  const [identify] = useIdentifyUserMutation();
  const fpPromise = FingerprintJS.load();

  useEffect(() => {
    const getUser = async () => {
      const fp = await fpPromise;
      const result = await fp.get();
      try {
        const data = await identify(result).unwrap();
        data.token && setValue(JSON.stringify(data.token));
        dispatch(
          setCredentials({
            user: {
              username: data.user.username,
              email: data.user.email,
              stripe_account_id: data.user.stripe_account_id,
              isVerified: data.user.isVerified,
            },
          })
        );

        if(data.user.username !== 'Guest' &&
            (pathname === '/'
                || pathname === '/pricing'
                || pathname === '/checkout'
                || pathname === '/yoururl' ))
        {
          Navigate("/links");
        }
      } catch (error) {
        console.log(error);
      }
    };
    getUser();
  }, []);

  return (
    <div className="bg-[radial-gradient(circle,rgba(2,_0,_36,_0)_0%,#fafafa_100%)] dark:bg-[radial-gradient(circle,rgba(2,_0,_36,_0)_0%,#010101_100%)]">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/:slug" element={<LinksInBio />} />

        <Route element={<Layout />}>
          <Route path="/test" element={<Report />} />
          <Route path="/pricing" element={<Pricing />}>
            <Route path="checkout" element={<Checkout />} />
          </Route>
          <Route path="/" element={<Landing />}>
            <Route path="/yoururl" element={<Myurl />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoutes />}>
          <Route  element={<AdminLayout />}>
            <Route path="/links" element={<Dashboard />} />
            <Route path="/link-in-bio" element={<LinkInBio />} />
            <Route path="/link-in-bio/:id" element={<ManageLinkInBio />} />
            <Route path="/setting" element={<Setting />}>
              <Route index element={<Profile />} />
              <Route path='subscription' element={<Subscription />} />
            </Route>
          </Route>
        </Route>
      </Routes>
    </div>
  );
}

export default App;
