import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {axios} from "../services/requests.js";
import pushToast from "../helpers/sonnerToast.js";
import {Button, HR, Label, Modal, Progress, Select, TextInput} from "flowbite-react";
import {BiArrowBack, BiMinus, BiPlus} from "react-icons/bi";
import {formatVND} from "../helpers/parsers.js";
import {FaRegCheckCircle, FaSearch} from "react-icons/fa";
import {PiBowlFoodFill, PiCookingPotFill} from "react-icons/pi";
import moment from "moment";
import {MdDelete} from "react-icons/md";

function ProductOrderCard({
  product,
  orderId = null,
  fetchOrder = () => { }
}) {
  const [quantity, setQuantity] = useState(product?.quantity || 0);
  const [newPrice, setNewPrice] = useState(product?.price || 0);
  const [openModalEditPrice, setOpenModalEditPrice] = useState(false);

  useEffect(() => {
    setQuantity(product.quantity);
  }, [product.quantity]);

  const onDeleteProductInOrder = async () => {
    try {
      const res = await axios.delete(`/orders/${orderId}/products/${product.product._id}`);
      pushToast("Xoá món thành công", "success");
      await fetchOrder();
    } catch (error) {
      pushToast(error?.response?.data?.message || e?.message, "error");
    }
  }

  const onUpdateQuantityProductInOrder = async () => {
    try {
      if (isNaN(parseInt(quantity)) || parseInt(quantity) <= 0) {
        pushToast("Số lượng không hợp lệ", "error");
        return;
      }
      const res = await axios.patch(`/orders/${orderId}/products`, {
        product: product.product._id,
        quantity
      });
      pushToast("Cập nhật số lượng thành công", "success");
      await fetchOrder();
    } catch (error) {
      pushToast(error?.response?.data?.message || e?.message, "error");
    }
  }

  const onUpdatePriceProductInOrder = async (newPrice) => {
    try {
      if (isNaN(parseInt(newPrice)) || parseInt(newPrice) <= 0) {
        pushToast("Giá không hợp lệ", "error");
        return;
      }
      const res = await axios.patch(`/orders/${orderId}/products`, {
        product: product.product._id,
        price: newPrice
      });
      pushToast("Cập nhật giá thành công", "success");
      await fetchOrder();
      setOpenModalEditPrice(false);
    } catch (error) {
      pushToast(error?.response?.data?.message || e?.message, "error");
    }
  }

  const onUpdateStatusProductInOrder = async (status) => {
    try {
      const res = await axios.patch(`/orders/${orderId}/products`, {
        product: product.product._id,
        status
      });
      pushToast("Cập nhật trạng thái thành công", "success");
      await fetchOrder();
    } catch (error) {
      pushToast(error?.response?.data?.message || e?.message, "error");
    }
  }

  if (!product) return null;
  return (
    <>
      <div className="bg-blue-200 p-2 rounded-lg flex flex-col gap-2">
        <div className="flex gap-4 items-center justify-between">
          <div className="flex gap-2 items-center ml-2">
            <h1 className="text-lg font-bold">SL:</h1>
            <div className="w-32 max-w-sm relative">
              <div className="relative">
                <button
                  id="decreaseButton"
                  className="absolute right-9 top-1 rounded bg-slate-800 p-1.5 border border-transparent text-center text-sm text-white transition-all shadow-sm hover:shadow focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                  type="button"
                  onClick={() => setQuantity(quantity - 1)}
                >
                  <BiMinus className="h-4 w-4"/>
                </button>
                <input
                  id="amountInput"
                  type="number"
                  className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md pl-3 pr-20 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                />
                <button
                  id="increaseButton"
                  className="absolute right-1 top-1 rounded bg-slate-800 p-1.5 border border-transparent text-center text-sm text-white transition-all shadow-sm hover:shadow focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  <BiPlus className="h-4 w-4"/>
                </button>
              </div>
            </div>
            <h1 className="text-lg font-bold ml-4">{product.product.name}</h1>
            <span className="text-gray-800">(Loại: {product?.option || "Mặc định"})</span>
          </div>
          <div className="flex gap-2 items-center">
            <h1 className="text-lg font-bold mr-2">{formatVND(product.price * product.quantity)}</h1>
            <Button color={"failure"}
                    onClick={onDeleteProductInOrder}
            >
              <MdDelete className="h-5 w-5 mr-2"/>
              Xoá
            </Button>
          </div>
        </div>
        <div className={"flex gap-2 items-center"}>
          <h1 className="text-red-700 font-bold">Ghi chú:</h1>
          <h1 className="">{product?.note || "Không"}</h1>
        </div>
        <div className="my-4">
          <div className="grid grid-cols-[0.1fr,2fr,0.1fr,2fr,0.1fr] gap-4 items-center">
            <div className={`col-start-1 flex justify-center`}>
              <FaRegCheckCircle className={"h-7 w-7 text-blue-600"}/>
            </div>
            <div className={`col-start-2`}>
              <Progress
                className={`w-full`}
                progress={(product.status === "cooking" || product.status === "completed") ? 100 : 0}
              />
            </div>
            <div className={`col-start-3 flex justify-center`}>
              <PiCookingPotFill className={"h-7 w-7 text-blue-600"}/>
            </div>
            <div className={`col-start-4`}>
              <Progress
                className={`w-full`}
                progress={product.status === "completed" ? 100 : 0}
              />
            </div>
            <div className={`col-start-5 flex justify-center`}>
              <PiBowlFoodFill className={"h-7 w-7 text-blue-600"}/>
            </div>
          </div>
          <HR className={"my-6"}/>
          <div className={"flex gap-2 justify-center"}>
            <Button gradientDuoTone={"cyanToBlue"}
                    onClick={onUpdateQuantityProductInOrder}
            >Cập nhật số lượng</Button>
            <Button gradientDuoTone={"greenToBlue"}
                    onClick={() => setOpenModalEditPrice(true)}
            >Sửa giá</Button>
            <Button gradientDuoTone={"purpleToBlue"}
                    onClick={() => onUpdateStatusProductInOrder("cooking")}
                    disabled={product.status === "completed" || product.status === "cooking"}
            >Đang nấu</Button>
            <Button gradientDuoTone={"purpleToPink"}
                    onClick={() => onUpdateStatusProductInOrder("completed")}
                    disabled={product.status === "completed" || product.status === "pending"}
            >Trả món</Button>
          </div>
        </div>
      </div>
      <Modal show={openModalEditPrice} onClose={() => setOpenModalEditPrice(false)}>
        <Modal.Header>
          <h1 className="text-2xl font-bold">Sửa giá: {product.product.name}</h1>
        </Modal.Header>
        <Modal.Body>
          <div className="flex flex-col gap-2">
            <h1 className="text-lg text-gray-800">Giá cũ: {formatVND(product.price)}</h1>
            <div className={"flex gap-2 items-center"}>
              <Label htmlFor={"newprice"} className={"text-lg"}>Giá mới (vnđ):</Label>
              <TextInput
                type={"number"}
                id={"newprice"}
                placeholder={"Giá mới"}
                value={newPrice}
                onChange={(e) => setNewPrice(e.target.value)}
              />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button color={"blue"} onClick={() => onUpdatePriceProductInOrder(newPrice)}>Lưu</Button>
          <Button color={"gray"} onClick={() => setOpenModalEditPrice(false)}>Đóng</Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default function AdminOrderDetail() {
  const {id} = useParams();
  const [order, setOrder] = useState(null);
  const navigate = useNavigate();
  const [openModalAddProduct, setOpenModalAddProduct] = useState(false);

  const fetchOrder = async () => {
    try {
      const res = await axios.get(`/orders/${id}`);
      setOrder(res.data)
    } catch (error) {
      pushToast(error?.response?.data?.message || e?.message, "error");
    }
  }

  useEffect(() => {
    fetchOrder();
  }, []);

  if (!order) return (<div>Loading...</div>)
  return (
    <>
      <div className="p-4 bg-blue-400 grid grid-cols-3 sticky">
        <Button className="w-fit"
                onClick={() => navigate(-1)}
        >
          <BiArrowBack className={"mr-2 h-5 w-5"}/>
          Quay lại
        </Button>
        <h1 className="text-2xl font-bold text-center col-span-1">
          Bàn {order?.table?.floor?.slug}-{order?.table?.name}
        </h1>
      </div>
      <div className="flex items-start justify-center h-full w-full">
        <div className="relative w-full p-4 bg-blue-100 flex flex-col gap-4 overflow-auto">
          <div className="p-4 bg-white rounded-lg">
            <div>
              <h1 className="text-xl font-bold mb-2">
                Khách: {order?.name || "Khách lẻ"}
              </h1>
              <h1 className="text-xl font-bold mb-2">
                SĐT: {order?.phone || "N/A"}
              </h1>
              <h1 className="text-xl font-bold mb-2">
                Tổng tạm tính: {formatVND(order?.total) || formatVND(0)}
              </h1>
              <h1 className="text-lg mb-2">
                Mã HĐ: {order?.billCode}
              </h1>
              <h1 className="text-lg mb-2">
                Tên bàn: {order?.table?.floor?.slug}-{order?.table?.name}
              </h1>
              <h1 className="text-lg mb-2">
                Tầng: {order?.table?.floor?.name}
              </h1>
              <h1 className="text-lg mb-2">
                Ngày tạo: {moment(order?.createdAt).format("HH:mm DD/MM/YYYY")}
              </h1>
            </div>
            <div className={"flex gap-2"}>
              <Button className={"w-full text-lg font-bold"} size={"lg"} gradientDuoTone={"cyanToBlue"}>Thanh toán</Button>
              <Button className={"w-full text-lg font-bold"} size={"lg"} gradientDuoTone={"greenToBlue"} onClick={() => setOpenModalAddProduct(true)}>Thêm món</Button>
              <Button className={"w-full text-lg font-bold"} size={"lg"} gradientDuoTone={"purpleToBlue"}>Chuyển bàn</Button>
              <Button className={"w-full text-lg font-bold"} size={"lg"} gradientDuoTone={"purpleToPink"}>Tách bàn</Button>
            </div>
          </div>
          <div className="p-4 bg-white rounded-lg">
            <h1 className="text-xl font-bold mb-2">
              Danh sách món
            </h1>
            <div className="flex flex-col gap-2">
              {
                order?.products?.map((product) => (
                  <ProductOrderCard product={product} key={product.product._id} orderId={order._id}
                                    fetchOrder={fetchOrder}/>
                ))
              }
            </div>
          </div>
        </div>
      </div>

      <ModalAddProduct
        openModalAddProduct={openModalAddProduct}
        setOpenModalAddProduct={setOpenModalAddProduct}
        orderId={order._id}
        fetchOrder={fetchOrder}
      />
    </>
  )
}

function ModalAddProduct({
  openModalAddProduct = false,
  setOpenModalAddProduct = () => { },
  orderId = null,
  fetchOrder = () => { }
}) {
  let interval = null;
  const [products, setProducts] = useState([]);

  const fetchProducts = async (search) => {
    try {
      const res = await axios.get(`/products`, {
        params: {
          search,
          page: 1,
          limit: 100
        }
      })
      console.log(res.data)
      setProducts(res?.data?.docs)
    } catch (error) {
      pushToast(error?.response?.data?.message || e?.message, "error");
    }
  }

  const onSearchChange = (e) => {
    if (interval) {
      clearTimeout(interval);
    }
    interval = setTimeout(() => {
      fetchProducts(e.target.value);
    }, 500)
  }

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <Modal show={openModalAddProduct} onClose={() => setOpenModalAddProduct(false)}>
      <Modal.Header>
        <h1 className="text-2xl font-bold">Thêm món</h1>
      </Modal.Header>
      <Modal.Body>
        <div>
          <div className="w-full mb-2 row-end-1">
            <div className="relative">
              <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                <FaSearch className="w-5 h-5 text-gray-400"/>
              </div>
              <input type="search" id="search-data-input"
                     className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                     placeholder="Tìm kiếm"
                     onChange={onSearchChange}
              />
              <button type="button"
                      className="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                Tìm kiếm
              </button>
            </div>
          </div>
            <div className="flex flex-col gap-2 mt-8">
              {products.length > 0 ? products.map((product, index) => (
                  <div className="bg-blue-100 p-4 rounded-lg flex gap-4 text-black items-center">
                    <img src={product.image} className={"size-32 object-cover rounded-lg shadow-lg"}/>
                    <form
                      className="flex flex-col gap-1 justify-around"
                      onSubmit={async (e) => {
                        e.preventDefault();

                        const quantity = e.target[`quantity.${product._id}`].value;
                        const option = e.target[`option.${product._id}`].value;

                        if (isNaN(parseInt(quantity)) || parseInt(quantity) <= 0) {
                          pushToast("Số lượng không hợp lệ", "error");
                          return;
                        }

                        try {
                          const res = await axios.post(`/orders/${orderId}/products`, {
                            product: product._id,
                            quantity,
                            option
                          })
                          pushToast("Thêm món thành công", "success");
                          await fetchOrder();
                        }
                        catch (error) {
                          pushToast(error?.response?.data?.message || e?.message || "Lỗi!", "error");
                        }

                      }}
                    >
                      <h1 className="text-lg font-bold">{product.name}</h1>
                      <h1 className="font-bold">Giá: {formatVND(product.price)}</h1>
                      <h1>Danh mục: {product.category.name}</h1>
                      <h1>Còn: {product.quantity}</h1>
                      <div className="flex gap-2 items-center">
                        <h1>Loại:</h1>
                        <Select
                          className={"flex flex-wrap gap-2"}
                          id={`option.${product._id}`}
                        >
                          {product.options.map((option) => (
                            <option value={option} color={"blue"}>{option}</option>
                          ))}
                        </Select>
                      </div>

                      <div className={"flex gap-2"}>
                        <TextInput
                          type={"number"}
                          id={`quantity.${product._id}`}
                          placeholder={"Số lượng"}
                          className={"w-32"}
                          min={0}
                          defaultValue={1}
                        />
                        <Button type={"submit"} color={"blue"}>Thêm</Button>
                      </div>
                    </form>
                  </div>
                ))
                :
                (
                  <div className="flex items-center justify-center h-96">
                    <h1 className="text-2xl font-bold">Không có sản phẩm nào</h1>
                  </div>
                )
              }
            </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button color={"gray"} onClick={() => setOpenModalAddProduct(false)}>Đóng</Button>
      </Modal.Footer>
    </Modal>
  )
}