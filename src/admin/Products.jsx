import ListView from '../comps/ListView';
import React, {useEffect, useState} from "react";
import {useNavigate, useSearchParams} from "react-router-dom";
import {axios} from "../services/requests.js";
import pushToast from "../helpers/sonnerToast.js";
import {useFormik} from "formik";
import * as Yup from "yup";
import {Button, FileInput, Label, Radio, Select, Spinner, Textarea, TextInput} from "flowbite-react";
import {MdDelete, MdOutlinePublishedWithChanges} from "react-icons/md";
import {FaEye, FaEyeSlash} from "react-icons/fa";
import {parseFilters, stringifyFilters} from "../helpers/parsers.js";
import moment from "moment";
import {IoAddCircle} from "react-icons/io5";
import {FaCircleMinus} from "react-icons/fa6";

const presentationFields = [
  {
    key: "image",
    label: "Ảnh",
  },
  {
    key: "name",
    label: "Tên",
  },
  {
    key: "price",
    label: "Giá",
  },
  {
    key: "category",
    label: "Danh mục",
  },
  {
    key: "quantity",
    label: "Số lượng",
  },
  {
    key: "status",
    label: "Trạng thái",
  },
  {
    key: "createdAt",
    label: "Ngày tạo",
  },
  {
    key: "updatedAt",
    label: "Ngày cập nhật",
  }
]

function UpdateProductForm({
  item,
  setOpenItemModal = () => { },
  fetchData = () => { }
}) {
  const { id } = item;
  const [product, setProduct] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const navigate = useNavigate();
  const [isUploading, setIsUploading] = useState(false);
  const [categories, getCategories] = useState([]);
  const [options, setOptions] = useState([]);


  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`/products/${id}`);
        setProduct(res?.data);
        setImagePreview(res?.data?.image);
        setOptions(res?.data?.options);
      } catch (error) {
        console.error("Error fetching product:", error);
        pushToast(error?.response?.data?.message || error?.message, "error");
      }
    }
    fetchProduct();
  }, [id]);

  useEffect(() => {
    const fetchCategories = async () => {
      const res = await axios.get("/categories", {
        params: {
          page: 1,
          limit: 100,
        }
      });
      getCategories(res?.data?.docs);
    }
    fetchCategories();
  }, []);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: product?.name || "",
      description: product?.description || "",
      image: product?.image || "",
      price: product?.price || "",
      quantity: product?.quantity || "",
      category: product?.category?._id || "",
      status: product?.status || "",
      options: product?.options || [],
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Tên danh mục là bắt buộc"),
      description: Yup.string().required("Mô tả là bắt buộc"),
      image: Yup.string().required("Hình ảnh là bắt buộc"),
      price: Yup.number().required("Giá là bắt buộc"),
      quantity: Yup.number().required("Số lượng là bắt buộc"),
      category: Yup.string().required("Danh mục là bắt buộc"),
      status: Yup.string().required("Trạng thái là bắt buộc"),
      options: Yup.array().of(Yup.string()),
    }),
    onSubmit: async (values) => {
      setIsUploading(true);
      try {
        let uploadedImageUrl = imagePreview;

        if (values.image) {
          const formData = new FormData();
          formData.append("images", values.image);

          const uploadResponse = await axios.post("/upload/images", formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });

          uploadedImageUrl = uploadResponse?.data[0];
        }

        await axios.patch(`/products/${id}`, {
          name: values.name,
          description: values.description,
          image: uploadedImageUrl,
          price: values.price,
          quantity: values.quantity,
          category: values.category,
          status: values.status,
          options: values.options,
        });

        pushToast("Cập nhật món thành công", "success");
        setOpenItemModal(false);
        fetchData();
      } catch (error) {
        console.error("Lỗi khi cập nhật món:", error);
        pushToast(error?.response?.data?.message || error?.message, "error");
      } finally {
        setIsUploading(false);
      }
    },
  });

  const deleteProduct = async (id) => {
    try {
      const sure = window.confirm("Bạn có chắc chắn muốn xóa món này?");
      if (!sure) return;

      await axios.delete(`/products/${id}`);
      pushToast("Xóa món thành công", "success");
      setOpenItemModal(false);
      fetchData();
    } catch (error) {
      console.error("Error deleting product:", error);
      pushToast(error?.response?.data?.message || error?.message, "error");
    }
  }

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      formik.setFieldValue("image", file); // Đưa file vào Formik values
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result); // Hiển thị preview
      reader.readAsDataURL(file);
    } else {
      formik.setFieldValue("image", null);
      setImagePreview("");
    }
  };

  if (!product) return <div>Loading...</div>;

  return (
    <form onSubmit={formik.handleSubmit}>
      <div className="grid gap-4 mb-4 grid-cols-2">
        <div className="col-span-2">
          <div className="mb-2">
            <Label htmlFor="image" value="Ảnh món"/>
          </div>
          <FileInput
            id={"image"}
            name={"image"}
            onChange={handleImageChange}
            onBlur={formik.handleBlur}
            color={
              formik.touched.image && formik.errors.image
                ? "failure"
                : "gray"
            }
            helperText={
              formik.touched.image && formik.errors.image
                ? formik.errors.image
                : ""
            }
          />
          {imagePreview && (
            <div>
              <Label value="Preview"/>
              <img
                src={imagePreview}
                alt="Preview"
                className="mt-2 w-40 h-40 object-cover rounded-lg shadow-lg"
              />
            </div>
          )}
        </div>

        <div className="col-span-2">
          <div className="mb-2">
            <Label htmlFor="name" value="Tên món"/>
          </div>
          <TextInput
            type="text"
            id="name"
            name="name"
            placeholder="Tên món"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            helperText={
              formik.touched.name && formik.errors.name
                ? formik.errors.name
                : ""
            }
            color={
              formik.touched.name && formik.errors.name
                ? "failure"
                : "gray"
            }
          />
        </div>

        <div className="col-span-2">
          <div className="mb-2">
            <Label htmlFor="description" value="Mô tả"/>
          </div>
          <Textarea
            id="description"
            name="description"
            placeholder="Mô tả"
            value={formik.values.description}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            helperText={
              formik.touched.description && formik.errors.description
                ? formik.errors.description
                : ""
            }
            color={
              formik.touched.description && formik.errors.description
                ? "failure"
                : "gray"
            }
          />
        </div>

        <div className="col-span-2 sm:col-span-1">
          <div className="mb-2">
            <Label htmlFor="price" value="Giá (vnđ)"/>
          </div>
          <TextInput
            type="number"
            id="price"
            name="price"
            placeholder="Giá"
            value={formik.values.price}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            helperText={
              formik.touched.price && formik.errors.price
                ? formik.errors.price
                : ""
            }
            color={
              formik.touched.price && formik.errors.price
                ? "failure"
                : "gray"
            }
          />
        </div>

        <div className="col-span-2 sm:col-span-1">
          <div className="mb-2">
            <Label htmlFor="quantity" value="Số lượng"/>
          </div>
          <TextInput
            type="number"
            id="quantity"
            name="quantity"
            placeholder="Giá"
            value={formik.values.quantity}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            helperText={
              formik.touched.quantity && formik.errors.quantity
                ? formik.errors.quantity
                : ""
            }
            color={
              formik.touched.quantity && formik.errors.quantity
                ? "failure"
                : "gray"
            }
          />
        </div>

        <div className="col-span-2 sm:col-span-1">
          <div className="mb-2">
            <Label htmlFor="category" value="Danh mục"/>
          </div>
          <Select
            id="category"
            name="category"
            value={formik.values.category}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            helperText={
              formik.touched.category && formik.errors.category
                ? formik.errors.category
                : ""
            }
            color={
              formik.touched.category && formik.errors.category
                ? "failure"
                : "gray"
            }
          >
            <option value="">Chọn danh mục</option>
            {categories.map((category) => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </Select>
        </div>

        <fieldset className="col-span-2 sm:col-span-1">
          <legend className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Trạng thái
          </legend>
          <div className="flex items-center gap-2">
            <Radio
              id="status"
              name="status"
              value={"available"}
              checked={formik.values.status === "available"}
              onChange={() => formik.setFieldValue("status", "available")}
            />
            <Label htmlFor="active">Hiển thị</Label>
          </div>
          <div className="flex items-center gap-2">
            <Radio
              id="not_available"
              name="active"
              value="not_available"
              checked={formik.values.status === "not_available"}
              onChange={() => formik.setFieldValue("status", "not_available")}
            />
            <Label htmlFor="not_available">Ẩn</Label>
          </div>
        </fieldset>

        <div className="col-span-2">
          <div className="mb-2">
            <Label htmlFor="options" value="Tùy chọn"/>
          </div>
          <div className="grid gap-2 grid-cols-2">
            {options?.map((option, index) => (
              <div key={index} className={"flex gap-2"}>
                <TextInput
                  className="w-full"
                  type="text"
                  id={`options.${index}`}
                  name={`options.${index}`}
                  placeholder="Cay, Không cay..."
                  value={option}
                  onChange={(e) => {
                    const newOptions = [...options];
                    newOptions[index] = e.target.value;
                    setOptions(newOptions);
                    formik.setFieldValue("options", newOptions);
                  }}
                />
                <Button
                  color="failure"
                  onClick={() => {
                    const newOptions = [...options];
                    newOptions.splice(index, 1);
                    setOptions(newOptions);
                    formik.setFieldValue("options", newOptions);
                  }}
                >
                  <FaCircleMinus className="h-5 w-5"/>
                </Button>
              </div>
            ))}
            <div>
              <Button
                color="blue"
                onClick={() => {
                  setOptions([...options, ""]);
                  formik.setFieldValue("options", [...options, ""]);
                }}
              >
                <IoAddCircle className="h-5 w-5"/>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className={"flex gap-2"}>
        <Button type="submit" color="blue">
          <MdOutlinePublishedWithChanges className="mr-2 h-5 w-5"/>
          {isUploading ? <Spinner size="sm"/> : "Cập nhật"}
        </Button>
        <Button type="button" color="failure" onClick={() => deleteProduct(id)}>
          <MdDelete className="mr-2 h-5 w-5"/>
          Xoá
        </Button>
      </div>

    </form>
  )
}

function CreateProductForm({
  fetchData = () => { },
  setOpenCreateModal = () => { }
}) {
  const [imagePreview, setImagePreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [categories, getCategories] = useState([]);
  const navigate = useNavigate();
  const [options, setOptions] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      const res = await axios.get("/categories", {
        params: {
          page: 1,
          limit: 100,
        }
      });
      getCategories(res?.data?.docs);
    }
    fetchCategories();
  }, []);

  const formik = useFormik({
    initialValues: {
      name: "",
      description: "",
      image: "",
      price: "",
      quantity: "",
      category: "",
      status: "available",
      options: []
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Tên món là bắt buộc"),
      description: Yup.string().required("Mô tả là bắt buộc"),
      image: Yup.string().required("Hình ảnh là bắt buộc"),
      price: Yup.number().required("Giá là bắt buộc"),
      quantity: Yup.number().required("Số lượng là bắt buộc"),
      category: Yup.string().required("Danh mục là bắt buộc"),
      status: Yup.string().required("Trạng thái là bắt buộc"),
      options: Yup.array().of(Yup.string()),
    }),
    onSubmit: async (values) => {
      setIsUploading(true);
      try {
        const formData = new FormData();
        formData.append("images", values.image);

        const uploadResponse = await axios.post("/upload/images", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        const uploadedImageUrl = uploadResponse?.data[0];

        await axios.post("/products", {
          name: values.name,
          description: values.description,
          image: uploadedImageUrl,
          price: values.price,
          quantity: values.quantity,
          category: values.category,
          status: values.status,
          options: values.options,
        });

        pushToast("Thêm món thành công", "success");
        setOpenCreateModal(false);
        fetchData();
      } catch (error) {
        console.error("Lỗi khi thêm món:", error);
        pushToast(error?.response?.data?.message || error?.message, "error");
      } finally {
        setIsUploading(false);
      }
    },
  });

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      formik.setFieldValue("image", file); // Đưa file vào Formik values
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result); // Hiển thị preview
      reader.readAsDataURL(file);
    } else {
      formik.setFieldValue("image", null);
      setImagePreview("");
    }
  }

  return (
    <form onSubmit={formik.handleSubmit}>
      <div className="grid gap-4 mb-4 grid-cols-2">
        <div className="col-span-2">
          <div className="mb-2">
            <Label htmlFor="image" value="Ảnh món"/>
          </div>
          <FileInput
            id={"image"}
            name={"image"}
            onChange={handleImageChange}
            onBlur={formik.handleBlur}
            color={
              formik.touched.image && formik.errors.image
                ? "failure"
                : "gray"
            }
            helperText={
              formik.touched.image && formik.errors.image
                ? formik.errors.image
                : ""
            }
          />
          {imagePreview && (
            <div>
              <Label value="Preview"/>
              <img
                src={imagePreview}
                alt="Preview"
                className="mt-2 w-40 h-40 object-cover rounded-lg shadow-lg"
              />
            </div>
          )}
        </div>

        <div className="col-span-2">
          <div className="mb-2">
            <Label htmlFor="name" value="Tên món"/>
          </div>
          <TextInput
            type="text"
            id="name"
            name="name"
            placeholder="Tên món"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            helperText={
              formik.touched.name && formik.errors.name
                ? formik.errors.name
                : ""
            }
            color={
              formik.touched.name && formik.errors.name
                ? "failure"
                : "gray"
            }
          />
        </div>

        <div className="col-span-2">
          <div className="mb-2">
            <Label htmlFor="description" value="Mô tả"/>
          </div>
          <Textarea
            id="description"
            name="description"
            placeholder="Mô tả"
            value={formik.values.description}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            helperText={
              formik.touched.description && formik.errors.description
                ? formik.errors.description
                : ""
            }
            color={
              formik.touched.description && formik.errors.description
                ? "failure"
                : "gray"
            }
          />
        </div>

        <div className="col-span-2 sm:col-span-1">
          <div className="mb-2">
            <Label htmlFor="price" value="Giá (vnđ)"/>
          </div>
          <TextInput
            type="number"
            id="price"
            name="price"
            placeholder="Giá"
            value={formik.values.price}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            helperText={
              formik.touched.price && formik.errors.price
                ? formik.errors.price
                : ""
            }
            color={
              formik.touched.price && formik.errors.price
                ? "failure"
                : "gray"
            }
          />
        </div>

        <div className="col-span-2 sm:col-span-1">
          <div className="mb-2">
            <Label htmlFor="quantity" value="Số lượng"/>
          </div>
          <TextInput
            type="number"
            id="quantity"
            name="quantity"
            placeholder="Giá"
            value={formik.values.quantity}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            helperText={
              formik.touched.quantity && formik.errors.quantity
                ? formik.errors.quantity
                : ""
            }
            color={
              formik.touched.quantity && formik.errors.quantity
                ? "failure"
                : "gray"
            }
          />
        </div>

        <div className="col-span-2 sm:col-span-1">
          <div className="mb-2">
            <Label htmlFor="category" value="Danh mục"/>
          </div>
          <Select
            id="category"
            name="category"
            value={formik.values.category}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            helperText={
              formik.touched.category && formik.errors.category
                ? formik.errors.category
                : ""
            }
            color={
              formik.touched.category && formik.errors.category
                ? "failure"
                : "gray"
            }
          >
            <option value="">Chọn danh mục</option>
            {categories.map((category) => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </Select>
        </div>

        <fieldset className="col-span-2 sm:col-span-1">
          <legend className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Trạng thái
          </legend>
          <div className="flex items-center gap-2">
            <Radio
              id="status"
              name="status"
              value={"available"}
              checked={formik.values.status === "available"}
              onChange={() => formik.setFieldValue("status", "available")}
            />
            <Label htmlFor="active">Hiển thị</Label>
          </div>
          <div className="flex items-center gap-2">
            <Radio
              id="not_available"
              name="active"
              value="not_available"
              checked={formik.values.status === "not_available"}
              onChange={() => formik.setFieldValue("status", "not_available")}
            />
            <Label htmlFor="not_available">Ẩn</Label>
          </div>
        </fieldset>

        <div className="col-span-2">
          <div className="mb-2">
            <Label htmlFor="options" value="Tùy chọn"/>
          </div>
          <div className="grid gap-2 grid-cols-2">
            {options.map((option, index) => (
              <div key={index} className={"flex gap-2"}>
                <TextInput
                  className="w-full"
                  type="text"
                  id={`options.${index}`}
                  name={`options.${index}`}
                  placeholder="Cay, Không cay..."
                  value={option}
                  onChange={(e) => {
                    const newOptions = [...options];
                    newOptions[index] = e.target.value;
                    setOptions(newOptions);
                    formik.setFieldValue("options", newOptions);
                  }}
                />
                <Button
                  color="failure"
                  onClick={() => {
                    const newOptions = [...options];
                    newOptions.splice(index, 1);
                    setOptions(newOptions);
                    formik.setFieldValue("options", newOptions);
                  }}
                >
                  <FaCircleMinus className="h-5 w-5"/>
                </Button>
              </div>
            ))}
            <div>
              <Button
                color="blue"
                onClick={() => {
                  setOptions([...options, ""]);
                  formik.setFieldValue("options", [...options, ""]);
                }}
              >
                <IoAddCircle className="h-5 w-5"/>
              </Button>
            </div>
          </div>
        </div>

      </div>

      <div className={"flex gap-2"}>
        <Button type="submit" color="blue">
          <MdOutlinePublishedWithChanges className="mr-2 h-5 w-5"/>
          {isUploading ? <Spinner size="sm"/> : "Thêm"}
        </Button>
      </div>

    </form>
  )
}

export default function ProductsManager() {
  const [products, setProducts] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [pagination, setPagination] = useState({
    currentPage: searchParams.get("page") || 1,
    totalPages: 1
  });
  const [categories, setCategories] = useState([]);

  const fetchProducts = async () => {
    try {
      const res = await axios.get("/products", {
        params: {
          page: pagination.currentPage,
          limit: 10,
          filters: searchParams.get("filters"),
          sortBy: searchParams.get("sortBy"),
          order: searchParams.get("order"),
          search: searchParams.get("search"),
        }
      });

      setProducts(res?.data?.docs?.map(product => ({
        ...product,
        id: product._id,
        image: <img src={product.image} alt={product.name} style={{width: 50, height: 50}}/>,
        status: productStatus[product.status],
        category: product?.category?.name,
        createdAt: moment(product.createdAt).format("HH:mm, DD/MM/YYYY"),
        updatedAt: moment(product.updatedAt).format("HH:mm, DD/MM/YYYY"),
      })));

      setPagination({
        ...pagination,
        currentPage: res.data.page,
        totalPages: res.data.totalPages
      })

    } catch (error) {
      pushToast(error.message, "error");
    }
  };

  const onPageChange = (page) => {
    setPagination({
      ...pagination,
      currentPage: page
    });
    searchParams.set("page", page);
    setSearchParams(searchParams);
  }

  useEffect(() => {
    fetchProducts();
  }, [pagination.currentPage, searchParams]);

  useEffect(() => {
    const fetchCategories = async () => {
      const res = await axios.get("/categories", {
        params: {
          page: 1,
          limit: 100,
        }
      });
      setCategories(res?.data?.docs);
    }
    fetchCategories();
  }, []);

  return (
    <div className="flex items-start justify-center h-full w-full">
      <ListView
        data={products}
        currentPage={pagination.currentPage}
        totalPages={pagination.totalPages}
        onPageChange={onPageChange}
        pagination={true}
        renderFilters={() => {
          return (
            <div className={"flex flex-col gap-2"}>
              <Label htmlFor={"category"} value={"Danh mục"} />
              <Select
                id="category"
                defaultValue={parseFilters(searchParams.get("filters"))?.category || ""}
                onChange={(e) => {
                  const filterObj = parseFilters(searchParams.get("filters"));
                  if (!e.target.value) {
                    delete filterObj?.category;
                  } else {
                    filterObj.category = e.target.value;
                  }
                  searchParams.set("filters", stringifyFilters(filterObj));
                }}
              >
                <option value="">Tất cả</option>
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </Select>

              <Label htmlFor={"status"} value={"Trạng thái"} />
              <Select
                id="status"
                defaultValue={parseFilters(searchParams.get("filters"))?.status}
                onChange={(e) => {
                  const filterObj = parseFilters(searchParams.get("filters"));
                  if (!e.target.value) {
                    delete filterObj?.status;
                  } else {
                    filterObj.status = e.target.value;
                  }
                  searchParams.set("filters", stringifyFilters(filterObj));
                }}
              >
                <option value="">Tất cả</option>
                <option value={"available"}>Hiển thị</option>
                <option value={"not_available"}>Ẩn</option>
              </Select>
            </div>
          )
        }}
        onFilterApply={() => {
          setSearchParams(searchParams);
        }}
        renderCreator={() => { }}
        onItemSelect={() => { }}
        presntationFields={presentationFields}
        ItemModal={UpdateProductForm}
        CreatorModal={CreateProductForm}
        isSearchable={true}
        onSearch={(value) => {
          searchParams.set("search", value);
          setSearchParams(searchParams);
        }}
        fetchData={fetchProducts}
      />
    </div>
  );
}

const productStatus = {
  "available": <div className={"flex gap-2 items-center"}>
    <FaEye className="text-green-500"/>
    <span>
      Hiển thị
    </span>
  </div>,
  "not_available": <div className={"flex gap-2 items-center"}>
    <FaEyeSlash className="text-red-500"/>
    <span>
      Ẩn
    </span>
  </div>
}