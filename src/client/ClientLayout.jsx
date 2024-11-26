import {
  Button, Drawer, Dropdown, Label,
  Navbar,
  NavbarBrand, Popover,
  TextInput
} from "flowbite-react";
import {Link, Outlet, useNavigate, useParams, useSearchParams} from "react-router-dom";
import {HiShoppingCart} from "react-icons/hi";
import React, {useEffect, useState} from "react";
import {axios} from "../services/requests.js";
import {FaHome, FaSearch, FaTrash} from "react-icons/fa";
import {MdOutlineShoppingCartCheckout} from "react-icons/md";
import {BiMinus, BiPlus} from "react-icons/bi";
import {IoIosCloseCircleOutline} from "react-icons/io";
import {formatVND} from "../helpers/parsers.js";
import useLocalStorageState from "use-local-storage-state";
import pushToast from "../helpers/sonnerToast.js";
import getFlag from "../helpers/getFlag.js";
import {useTranslation} from "react-i18next";

export default function ClientLayout() {
  const {id} = useParams();
  const [table, setTable] = useState(null);
  const [openCartDrawer, setOpenCartDrawer] = useState(false);
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { t, i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  }

  const [cart, setCart] = useLocalStorageState("cart", {
    defaultValue: [],
  });
  const [userInfo, setUserInfo] = useLocalStorageState("userInfo", {
    defaultValue: {},
  });
  const [orderId, setOrderId] = useLocalStorageState("orderId", {
    defaultValue: null,
  });

  const handleClose = () => setOpenCartDrawer(false);

  const fetchTable = async () => {
    try {
      const res = await axios.get(`/tables/${id}`)
      setTable(res.data);
    } catch (error) {
      console.error(error);
      navigate("/");
    }
  }

  const addToCart = ({
   product,
   price,
   quantity,
   option,
   note
  }) => {
    const productIndex = cart.findIndex(item => item.product._id === product._id && item.option === option);

    if (quantity === -1 && cart[productIndex].quantity === 1) {
      removeFromCart({productId: product._id, option});
      return;
    }
    if (quantity < 0 && productIndex === -1) {
      return;
    }

    if (productIndex !== -1) {
      cart[productIndex].quantity += quantity;
    } else {
      cart.push({
        product,
        quantity,
        price,
        option,
        note
      });
    }
    setCart(cart);
    // pushToast("Đã cập nhật giỏ hàng!", "success");
  }

  const removeFromCart = ({productId, option}) => {
    const productIndex = cart.findIndex(item => item.product._id === productId && item.option === option);
    if (productIndex !== -1) {
      cart.splice(productIndex, 1);
    }
    setCart(cart);
    // pushToast("Đã xóa khỏi giỏ hàng", "success");
  }

  const onChangeQuantity = (event, item) => {
    const value = parseInt(event.target.value);
    if (value < 1 || isNaN(value)) {
      event.target.value = 1;
    }
    addToCart({...item, quantity: parseInt(event.target.value) - item.quantity});
  }

  const onSubmitOrder = async () => {
    if (!cart.length) {
      pushToast(t("cartEmpty"), "error");
      return;
    }
    try {
      const res = await axios.post(`/orders`, {
        table: id,
        products: cart.map(item => ({
          product: item.product._id,
          option: item.option,
          note: item.note,
          quantity: item.quantity,
          price: item.price
        })),
        name: userInfo.name || null,
        phone: userInfo.phone || null
      });
      setCart([]);
      setOrderId(res.data._id);
      navigate(`/success`);
    } catch (error) {
      pushToast(t("errorPlaceOrdert"), "error");
    }
  }

  useEffect(() => {
    fetchTable();
  }, []);

  if (!table) return null;

  return (
    <div className="w-screen h-screen max-h-svh bg-gray-200 overflow-auto relative" id={"products-container"}>
      <Navbar fluid rounded>
        <NavbarBrand as={Link} to={`/${id}`}>
          <img src="/Logo-tuxtax.png" className="mr-3 h-6 sm:h-9" alt="Tuxtax logo"/>
          <div className={"flex flex-col gap-1"}>
            <span className="text-sm font-bold text-gray-800 text-wrap">{t("name")}</span>
            <span className="text-sm font-bold text-gray-800 text-wrap">Bàn: {table.floor.slug}-{table.name}</span>
          </div>
        </NavbarBrand>
        <div className={"flex gap-2"}>
          <Popover
            content={
              <TextInput
                placeholder={t("searchPlaceholder")}
                className={"w-64 border-1 border-gray-300 rounded-lg"}
                rightIcon={FaSearch}
                value={searchParams.get("search") || ""}
                onChange={(event) => {
                  if (!event.target.value) {
                    searchParams.delete("search");
                  } else {
                    searchParams.set("search", event.target.value);
                  }
                  setSearchParams(searchParams);
                }}
              />
            }
          >
            <div className={"text-black p-2 cursor-pointer hover:bg-blue-200 rounded-lg"}
                 onClick={() => {
                   navigate(`/${id}/products`);
                 }}
            >
              <FaSearch className="h-7 w-7"/>
            </div>
          </Popover>
          <div className={"flex justify-center items-center"}>
            <Dropdown
              placement={"bottom"}
              // label={getFlag({lang: i18n.language})}
              renderTrigger={() => <span>
                {getFlag({lang: i18n.language})}
              </span>}
              inline={true}
            >
              <Dropdown.Item onClick={() => changeLanguage('vi')}>🇻🇳 VI</Dropdown.Item>
              <Dropdown.Item onClick={() => changeLanguage('en')}>🇺🇸 EN</Dropdown.Item>
              <Dropdown.Item onClick={() => changeLanguage('th')}>🇹🇭 TH</Dropdown.Item>
            </Dropdown>
          </div>
          <div onClick={() => setOpenCartDrawer(true)}
               className={"text-black p-2 cursor-pointer hover:bg-blue-200 rounded-lg"}>
            <HiShoppingCart className="h-7 w-7"/>
          </div>
        </div>
      </Navbar>
      <Navbar fluid rounded className={"p-1 font-bold text-sm border-t cursor-pointer"}>
        <Link to={`/${id}`}
              className={"text-gray-800 w-1/2 h-full p-2 flex gap-2 items-center justify-center active:bg-gray-300 transition rounded py-2"}>
          <FaHome className="h-5 w-5"/>
          <h1 className={""}>{t("homepage")}</h1>
        </Link>
        <Link to={`/${id}/checkout`}
              className={"text-gray-800 w-1/2 h-full p-2 flex gap-2 items-center justify-center active:bg-gray-300 transition rounded py-2"}>
          <MdOutlineShoppingCartCheckout className="h-5 w-5"/>
          <h1 className={""}>{t("checkout.title")}</h1>
        </Link>
      </Navbar>

      {id && <Outlet context={[cart, setCart, addToCart, removeFromCart]}/>}

      <Drawer open={openCartDrawer} onClose={handleClose} position={"right"} className={"w-screen h-screen max-h-dvh"}>
        <div className={"text-gray-800 relative h-full w-full"}>
          <div className={"flex gap-2 items-center justify-between"}>
            <div className={"flex gap-2 items-center"}>
              <HiShoppingCart className="h-7 w-7"/>
              <h1 className={"text-2xl font-bold p-2"}>{t("cart.title")}</h1>
            </div>
            <div className={""} onClick={handleClose}>
              <IoIosCloseCircleOutline
                className={"text-2xl text-white bg-black p-1 rounded-full size-12 active:bg-gray-300 active:text-gray-800 transition"}/>
            </div>
          </div>
          <div className={"flex flex-col gap-2 mt-8"}>
            {cart.map((item, index) => (
              <div key={index}>
                <div className={"flex justify-between p-2"}>
                  <div className={"flex flex-col gap-1"}>
                    <span className={"font-bold text-xl"}>{item.product.name}</span>
                    <span>{item.option}</span>
                    <span>{item.note}</span>
                  </div>
                  <div className={"flex flex-col gap-1 items-end"}>
                    <div className={"flex gap-2 items-center"}>
                      <FaTrash className={"text-red-500 cursor-pointer"}
                               onClick={() => removeFromCart({productId: item.product._id, option: item.option})}/>
                      <div className="w-32 max-w-sm relative">
                        <div className="relative">
                          <button
                            id="decreaseButton"
                            className="absolute right-9 top-1 rounded bg-slate-800 p-1.5 border border-transparent text-center text-sm text-white transition-all shadow-sm hover:shadow focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                            type="button"
                            onClick={() => addToCart({...item, quantity: -1})}
                          >
                            <BiMinus className="h-4 w-4"/>
                          </button>
                          <input
                            id="amountInput"
                            type="number"
                            className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md pl-3 pr-20 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            value={item.quantity}
                            onChange={(event) => onChangeQuantity(event, item)}
                          />
                          <button
                            id="increaseButton"
                            className="absolute right-1 top-1 rounded bg-slate-800 p-1.5 border border-transparent text-center text-sm text-white transition-all shadow-sm hover:shadow focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                            type="button"
                            onClick={() => addToCart({...item, quantity: 1})}
                          >
                            <BiPlus className="h-4 w-4"/>
                          </button>
                        </div>
                      </div>
                    </div>
                    <span className={"text-xl font-bold"}>{formatVND(item.price)}</span>
                  </div>
                </div>
                <hr className={"my-2 border-0 border-dashed border-b-2 border-b-gray-400"}/>
              </div>
            ))}
          </div>
          <div className={"flex justify-between items-center p-2 text-xl font-bold"}>
            <h1 className={""}>{t("cart.total")}:</h1>
            <h1 className={""}>{cart.length} {t("cart.dishes")}  | {formatVND(cart.reduce((acc, item) => acc + (item.price * item.quantity), 0))}</h1>
          </div>
          <div className="space-y-3 p-2 mb-4">
            <div>
              <div className="mb-2 block">
                <Label htmlFor="name" value={t("cart.fullName")}/>
              </div>
              <TextInput
                id="name"
                placeholder={t("cart.fullName")}
                value={userInfo?.name}
                onChange={(event) => {
                  setUserInfo({...userInfo, name: event.target.value});
                }}
                required
              />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="phone" value={t("cart.phoneNumber")}/>
              </div>
              <TextInput
                id="phone"
                placeholder={t("cart.phoneNumber")}
                value={userInfo?.phone}
                onChange={(event) => {
                  setUserInfo({...userInfo, phone: event.target.value});
                }}
                required
              />
            </div>
          </div>
          <div className={"flex flex-col gap-2 pb-4"}>
            {!!cart?.length &&
              <Button className={"w-full"} size={"xl"} onClick={onSubmitOrder}>{t("cart.confirmOrder")}</Button>}
            <Button className={"w-full"} color={"gray"} size={"xl"} onClick={handleClose}>{t("cart.closeOrder")}</Button>
          </div>
        </div>
      </Drawer>
    </div>
  );
}