import { routes } from "./routes";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import DefaultComponent from "./components/DefaultComponents/DefaultComponents";
import { Fragment, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import * as UserService from "./services/UserService";
import { setUserInfor } from "./redux/action";
import { useDispatch, useSelector } from "react-redux";
import { isJsonString } from "./utils";

function App() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.dataUser);

  useEffect(() => {
    const { decoded, storageData } = handleDecoded();
    if (decoded?.id) {
      handleGetDetailUser(decoded?.id, storageData);
    }
  }, []);

  UserService.axiosJWT.interceptors.request.use(
    async function (config) {
      const { decoded } = handleDecoded();
      const currentTime = new Date();

      if (decoded?.exp < currentTime.getTime() / 1000) {
        // nếu thời gian hết hạn token < thời gian thực tính theo ms
        const data = await UserService.refreshToken();
        config.headers["token"] = `Bearer ${data?.access_token}`;
      }

      return config;
    },
    function (error) {
      // Do something with request error
      return Promise.reject(error);
    }
  );

  const handleDecoded = () => {
    let storageData = localStorage.getItem("access_token");
    let decoded = {};
    if (storageData && isJsonString(storageData)) {
      storageData = JSON.parse(storageData);
      decoded = jwtDecode(storageData);
    }

    return { decoded, storageData };
  };

  const handleGetDetailUser = async (id, access_token) => {
    const res = await UserService.getDetailsUser(id, access_token);
    dispatch(setUserInfor({ ...res?.data, access_token: access_token }));
  };

  return (
    <div>
      <Router>
        <Routes>
          {routes.map((route) => {
            const Page = route.page;
            const isCheckAuth = !route.isPrivate || user.isAdmin;
            const Layout = route.isShowHeader ? DefaultComponent : Fragment;
            return (
              <Route
                key={route.path}
                path={route.path} // Luôn sử dụng chuỗi cho path
                element={
                  isCheckAuth ? (
                    <Layout>
                      <Page />
                    </Layout>
                  ) : (
                    <h1>Không có gì</h1> // Hoặc một trang thông báo không có quyền truy cập
                  )
                }
              />
            );
          })}
        </Routes>
      </Router>
    </div>
  );
}

export default App;
