import ListView from "../comps/ListView.jsx";
import React, {useEffect, useState} from "react";
import {useNavigate, useSearchParams} from "react-router-dom";
import {axios} from "../services/requests.js";
import {roles} from "../constants/user.js";
import pushToast from "../helpers/sonnerToast.js";
import {useFormik} from "formik";
import * as Yup from "yup";
import {Button, FileInput, Label, Spinner, Textarea, TextInput} from "flowbite-react";
import {MdDelete, MdOutlinePublishedWithChanges} from "react-icons/md";
import {IoAddCircleOutline} from "react-icons/io5";

const presentationFields = [
  {
    key: "image",
    label: "Hình ảnh"
  },
  {
    key: "name",
    label: "Tên"
  },
  {
    key: "description",
    label: "Mô tả"
  },
]

function UpdateCategoryForm({ item }) {
  const { id } = item;
  const [category, setCategory] = useState(item);
  const [imagePreview, setImagePreview] = useState(null);
  const navigate = useNavigate();
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    const fetchCategory = async () => {
      const res = await axios.get(`/categories/${id}`);
      setCategory(res?.data?.category);
      setImagePreview(res?.data?.category?.image);
    }
    fetchCategory();
  }, [id]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: category?.name || "",
      description: category?.description || "",
      image: category?.image || "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Tên phân loại là bắt buộc"),
      description: Yup.string().required("Mô tả là bắt buộc"),
      image: Yup.string().required("Hình ảnh là bắt buộc"),
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

        await axios.patch(`/categories/${id}`, {
          name: values.name,
          description: values.description,
          image: uploadedImageUrl,
        });

        pushToast("Cập nhật danh mục thành công", "success");
        navigate(0);
      } catch (error) {
        console.error("Lỗi khi cập nhật danh mục:", error);
        pushToast(error.message, "error");
      } finally {
        setIsUploading(false);
      }
    },
  });

  const deleteCategory = async (id) => {
    try {
      const sure = window.confirm("Bạn có chắc chắn muốn xóa phân loại này?");
      if (!sure) return;

      await axios.delete(`/categories/${id}`);
      pushToast("Xóa phân loại dùng thành công", "success");
      navigate(0);
    } catch (error) {
      console.error("Error deleting user:", error);
      pushToast(error.message, "error");
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

  if (!category) return <div>Loading...</div>;

  return (
    <form onSubmit={formik.handleSubmit}>
      <div className="grid gap-4 mb-4 grid-cols-2">
        <div className="col-span-2">
          <div className="mb-2">
            <Label htmlFor="image" value="Ảnh danh mục"/>
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
        </div>
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

        <div className="col-span-2">
          <div className="mb-2">
            <Label htmlFor="name" value="Tên danh mục"/>
          </div>
          <TextInput
            type="text"
            id="name"
            name="name"
            placeholder="Tên danh mục"
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
            <Label htmlFor="description" value="Mô tả danh mục"/>
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
      </div>

      <div className={"flex gap-2"}>
        <Button type="submit" color="blue">
          <MdOutlinePublishedWithChanges className="mr-2 h-5 w-5"/>
          {isUploading ? <Spinner size="sm"/> : "Cập nhật danh mục"}
        </Button>
        <Button type="button" color="failure" onClick={() => deleteCategory(id)}>
          <MdDelete className="mr-2 h-5 w-5"/>
          Xoá phân loại
        </Button>
      </div>

    </form>
  )
}

function CreateCategoryForm() {
  const [imagePreview, setImagePreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      name: "",
      description: "",
      image: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Tên phân loại là bắt buộc"),
      description: Yup.string().required("Mô tả là bắt buộc"),
      image: Yup.string().required("Hình ảnh là bắt buộc"),
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

        await axios.post("/categories", {
          name: values.name,
          description: values.description,
          image: uploadedImageUrl,
        });

        pushToast("Tạo danh mục thành công", "success");
        navigate(0);
      } catch (error) {
        console.error("Lỗi khi tạo danh mục:", error);
        pushToast(error.message, "error");
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
  };

  return (
    <form onSubmit={formik.handleSubmit}>
      <div className="grid gap-4 mb-4 grid-cols-2">
        <div className="col-span-2">
          <div className="mb-2">
            <Label htmlFor="image" value="Ảnh danh mục"/>
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
        </div>
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

        <div className="col-span-2">
          <div className="mb-2">
            <Label htmlFor="name" value="Tên danh mục"/>
          </div>
          <TextInput
            type="text"
            id="name"
            name="name"
            placeholder="Tên danh mục"
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
            <Label htmlFor="description" value="Mô tả danh mục"/>
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
      </div>

      <Button type="submit" color="blue">
        <IoAddCircleOutline className="mr-2 h-5 w-5"/>
        {isUploading ? <Spinner size="sm"/> : "Tạo danh mục"}
      </Button>
    </form>
  )
}

export default function CategoriesManager() {
  const [categories, setCategories] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [pagination, setPagination] = useState({
    currentPage: searchParams.get("page") || 1,
    totalPages: 1
  });

  const fetchCategories = async () => {
    try {
      const res = await axios.get("/categories", {
        params: {
          page: pagination.currentPage,
          limit: 10,
          filters: searchParams.get("filters"),
          sortBy: searchParams.get("sortBy"),
          order: searchParams.get("order"),
        }
      });

      setCategories(res?.data?.docs?.map(category => ({
        ...category,
         id: category._id,
        image: <img src={category.image} alt={category.name} style={{width: 50, height: 50}}/>
      })));

      setPagination({
        ...pagination,
        currentPage: res.data.page,
        totalPages: res.data.totalPages
      })

    } catch (e) {
      pushToast(e.message, "error");
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
    fetchCategories();
  }, [pagination.currentPage, searchParams]);

  return (
    <div className="flex items-start justify-center h-full w-full">
      <ListView
        data={[...categories]}
        currentPage={pagination.currentPage}
        totalPages={pagination.totalPages}
        onPageChange={onPageChange}
        pagination={true}
        renderFilters={() => { }}
        onFilterApply={() => { }}
        renderCreator={() => { }}
        onItemSelect={() => { }}
        presntationFields={presentationFields}
        ItemModal={UpdateCategoryForm}
        CreatorModal={CreateCategoryForm}
      />
    </div>
  );
}