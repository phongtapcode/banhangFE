import "./Header.scss";
import { Badge, Avatar,Popover, Drawer } from "antd";
import ItemCategory from "./components/ItemCategory/ItemCategory";
import { useState,useEffect } from "react";
import { useSelector,useDispatch } from "react-redux";
import { resetUser,valueSearch } from "../../redux/action";
import { useNavigate } from "react-router-dom";
import { UserOutlined } from "@ant-design/icons";
import Loading from "../Loading/Loading";
import * as UserService from "../../services/UserService";


const menu = [
  {
    title: "TRANG CHỦ",
    href: "/",
  },
  {
    title: "GIỚI THIỆU",
    href: "#",
  },
  {
    title: "SẢN PHẨM",
    href: "/products",
  },
  {
    title: "KINH NGHIỆM HAY",
    href: "#",
  },
  {
    title: "LIÊN HỆ",
    href: "/contact",
  },
  {
    title: "HỆ THỐNG SIÊU THỊ",
    href: "#",
  },
];

const categoryTech = [
  {
    title: "Iphone",
    children: [
      { name: "Iphone 15 Promax", href: "#" },
      { name: "Iphone 14 Promax", href: "#" },
      { name: "Iphone 12 Promax", href: "#" },
      { name: "Iphone 11 Promax", href: "#" },
      { name: "......", href: "#" },
    ],
    iconChevron: true,
    iconMain: "fa-solid fa-mobile-screen-button",
  },
  {
    title: "Samsung",
    children: [
      { name: "Samsung Galaxy S23 Ultra", href: "#" },
      { name: "Samsung Galaxy S24 Ultra", href: "#" },
      { name: "Samsung Galaxy A15", href: "#" },
      { name: "Samsung Galaxy M34", href: "#" },
      { name: "......", href: "#" },
    ],
    iconChevron: true,
    iconMain: "fa-solid fa-mobile-screen-button",
  },
  {
    title: "Xiaomi",
    children: [
      { name: "Xiaomi Redmi Note 13", href: "#" },
      { name: "Xiaomi Redmi Note 12", href: "#" },
      { name: "Xiaomi Redmi Note 12", href: "#" },
      { name: "Xiaomi 13T Pro", href: "#" },
      { name: "......", href: "#" },
    ],
    iconChevron: true,
    iconMain: "fa-solid fa-mobile-screen-button",
  },
  {
    title: "Realme",
    children: [
      { name: "realme 11 Pro", href: "#" },
      { name: "realme 11 Pro", href: "#" },
      { name: "realme C55", href: "#" },
      { name: "Realme 10", href: "#" },
      { name: "......", href: "#" },
    ],
    iconChevron: true,
    iconMain: "fa-solid fa-mobile-screen-button",
  },
  {
    title: "Oppo",
    iconChevron: false,
    iconMain: "fa-solid fa-mobile-screen-button",
  },
  {
    title: "Vivo",
    iconChevron: false,
    iconMain: "fa-solid fa-mobile-screen-button",
  },
  {
    title: "Huawei",
    iconChevron: false,
    iconMain: "fa-solid fa-mobile-screen-button",
  },
  {
    title: "Levono",
    iconChevron: false,
    iconMain: "fa-solid fa-mobile-screen-button",
  },
  {
    title: "Sony",
    iconChevron: false,
    iconMain: "fa-solid fa-mobile-screen-button",
  },
];

function Header({ isHiddenItemHeader = false }) {
  const [currentMenu, setCurrentMenu] = useState(0);
  const orderProducts = useSelector((state) => state.orderProduct);
  const valueInput = useSelector((state) => state.valueSearch);
  const dataUser = useSelector((state) => state.dataUser);
  const [hiddenCategory, setHiddenCategory] = useState(true);
  const [loadingLogout, setLoadingLogout] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onSearch = (value) => {
    dispatch(valueSearch(value));
  }

  const handleClickTitleCategory = () => {
    setHiddenCategory(!hiddenCategory);
  };

  const handleLogout = async () => {
    setLoadingLogout(true);
    localStorage.removeItem("access_token");
    await UserService.logoutUser();
    dispatch(resetUser());
    setLoadingLogout(false);
    navigate("/sign-in")
  };

  const content = (
    <div>
      <p
        onClick={() => {
          navigate("/profile");
        }}
      >
        Thông tin
      </p>
      <p
        onClick={() => {
          navigate("/my-order");
        }}
      >
        Đơn hàng của tôi
      </p>
      {dataUser?.isAdmin && (
        <p
          style={{ cursor: "pointer" }}
          onClick={() => navigate("/system/admin")}
        >
          Quản lí hệ thống
        </p>
      )}
      <p style={{ cursor: "pointer" }} onClick={handleLogout}>
        Đăng xuất
      </p>
    </div>
  );

  const onChangeSearch = (e) => {
    dispatch(valueSearch(e.target.value));
  }

  const [open, setOpen] = useState(false);

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  return (
    <header className="header">
      {!isHiddenItemHeader && (
        <div className="header__top">
          <ul className="header__top__check">
            <li>
              <a href="/">Tìm kiếm</a>
            </li>
            <li>
              <a href="/my-order">Kiểm tra đơn hàng</a>
            </li>
            <li>
              <a href="/contact">Liên hệ</a>
            </li>
          </ul>
        </div>
      )}

      <Drawer
        title="PHONE STORE"
        placement={"left"}
        closable={false}
        onClose={onClose}
        open={open}
        key="left"
      >
          <div className="drawer__cart">
              <a href="/order">
                <span>
                  GIỎ HÀNG
                  <Badge count={orderProducts?.orderItems?.length} offset={[5, -6]}>
                    <i className="fa-solid fa-cart-shopping"></i>
                  </Badge>
                </span>
              </a>
          </div>
        {
          menu.map((item,index) => (
            <div className="drawer" key={index} onClick={()=>{navigate(item.href); onClose()}}>
              {item.title}
            </div>
          ))
        }
        
      </Drawer>

      <div className="header__inner">
        <div className="header__inner--icon" onClick={() => showDrawer()}><i className="fa-solid fa-bars"></i></div>
        <div className="header__inner--logo">
          <span onClick={()=>{navigate("/")}}>Phone Store</span>
        </div>
        {!isHiddenItemHeader && (
          <div className="header__inner--search">
            <input type="text" placeholder="Search sản phẩm" onChange={onChangeSearch} value={valueInput}/>
            <i className="fa-solid fa-magnifying-glass"></i>
          </div>
        )}

        <div className="header__inner__right">
          <div className="header__inner__right--login">
            <Loading isLoading={loadingLogout}>
              <Popover content={content} trigger="click">
                {dataUser.name ? (
                  <>
                    {dataUser.avatar ? (
                      <div className="user-info">
                        <img
                          src={dataUser.avatar}
                          alt="Avatar"
                          className="avatar"
                        />
                        <a style={{ cursor: "pointer" }}>{dataUser.name}</a>
                      </div>
                    ) : (
                      <div className="user-info">
                        <Avatar size="large" icon={<UserOutlined />} />
                        <a style={{ cursor: "pointer" }}>{dataUser.name}</a>
                      </div>
                    )}
                  </>
                ) : (
                  <a href="/sign-in">ĐĂNG NHẬP/ĐĂNG KÍ</a>
                )}
              </Popover>
            </Loading>
          </div>

          {!isHiddenItemHeader && (
            <div className="header__inner__right--cart">
              <a href="/order">
                <span>
                  GIỎ HÀNG
                  <Badge count={orderProducts?.orderItems?.length} offset={[5, -6]}>
                    <i className="fa-solid fa-cart-shopping"></i>
                  </Badge>
                </span>
              </a>
            </div>
          )}
        </div>
      </div>

      {!isHiddenItemHeader && (
        <div className="header__bottom">
          <div className="header__bottom__category">
            <h1
              className="header__bottom__category--title"
              onClick={handleClickTitleCategory}
            >
              DANH MỤC ĐIỆN THOẠI
            </h1>
            <div className="header__bottom__category--content">
            {hiddenCategory ||
              categoryTech.map((category, index) => (
                <ItemCategory data={category} key={index} />
              ))}
            </div>
          </div>

          <div className="header__bottom__menu">
            {menu.map((item, index) => {
              return (
                <div key={index}>
                <a
                  href={item.href}
                  style={index === currentMenu ? { color: "#f57e20" } : {}}
                >
                  {item.title}
                </a>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;
