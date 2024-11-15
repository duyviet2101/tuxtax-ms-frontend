import ListView from "../comps/ListView";
import React, {useEffect, useState} from "react";
import {axios} from "../services/requests.js";
import pushToast from "../helpers/sonnerToast.js";
import {roles} from "../constants/user.js";
import {MdDelete, MdOutlinePublishedWithChanges, MdPersonAdd} from "react-icons/md";
import {Button, Label, Radio, Select, TextInput} from "flowbite-react";
import {useFormik} from "formik";
import * as Yup from "yup";
import {useNavigate, useSearchParams} from "react-router-dom";
import {parseFilters, stringifyFilters} from "../helpers/filtersParser.js";
import moment from "moment";
import {SiTicktick} from "react-icons/si";
import {RiCloseCircleLine} from "react-icons/ri";

const presentationFields = [
  {
    key: "name",
    label: "Tên"
  },
  {
    key: "email",
    label: "Email"
  },
  {
    key: "phone",
    label: "SĐT",
  },
  {
    key: "role",
    label: "Vai trò",
  },
  {
    key: "active",
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

function UpdateUserForm({ item }) {
  const { id } = item;
  const [data, setData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const res = await axios.get(`/users/${id}`);
      setData(res.data);
    };
    fetchUser();
  }, [id]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: data?.name || "",
      email: data?.email || "",
      phone: data?.phone || "",
      role: data?.role || "",
      active: data?.active || false,
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Tên người dùng là bắt buộc"),
      email: Yup.string()
        .email("Email không hợp lệ")
        .required("Email là bắt buộc"),
      phone: Yup.string().required("Số điện thoại là bắt buộc"),
      role: Yup.string().required("Vai trò là bắt buộc"),
    }),
    onSubmit: async (values) => {
      try {
        await axios.patch(`/users/${id}`, values);
        pushToast("Cập nhật thành công", "success");
        navigate(0);
      } catch (error) {
        console.error("Error updating user:", error);
        pushToast(error?.response?.data?.message || e?.message, "error");
      }
    },
  });

  const deleteUser = async (id) => {
    try {
      const sure = window.confirm("Bạn có chắc chắn muốn xóa người dùng này?");
      if (!sure) return;

      await axios.delete(`/users/${id}`);
      pushToast("Xóa người dùng thành công", "success");
      navigate(0);
    } catch (error) {
      console.error("Error deleting user:", error);
      pushToast(error?.response?.data?.message || e?.message, "error");
    }
  }

  if (!data) return <div>Loading...</div>;

  return (
    <form onSubmit={formik.handleSubmit}>
      <div className="grid gap-4 mb-4 grid-cols-2">
        {/* Name Field */}
        <div className="col-span-2">
          <div className="mb-2">
            <Label htmlFor="name" value="Họ tên" />
          </div>
          <TextInput
            type="text"
            id="name"
            name="name"
            placeholder="Họ tên"
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

        {/* Email Field */}
        <div className="col-span-2 sm:col-span-1">
          <div className="mb-2">
            <Label htmlFor="email" value="Email" />
          </div>
          <TextInput
            type="email"
            id="email"
            name="email"
            placeholder="your@email.com"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            helperText={
              formik.touched.email && formik.errors.email
                ? formik.errors.email
                : ""
            }
            color={
              formik.touched.email && formik.errors.email
                ? "failure"
                : "gray"
            }
          />
        </div>

        {/* Phone Field */}
        <div className="col-span-2 sm:col-span-1">
          <div className="mb-2">
            <Label htmlFor="phone" value="SĐT" />
          </div>
          <TextInput
            type="text"
            id="phone"
            name="phone"
            placeholder="Số điện thoại"
            value={formik.values.phone}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            helperText={
              formik.touched.phone && formik.errors.phone
                ? formik.errors.phone
                : ""
            }
            color={
              formik.touched.phone && formik.errors.phone
                ? "failure"
                : "gray"
            }
          />
        </div>

        {/* Role Field */}
        <div className="col-span-2 sm:col-span-1">
          <div className="mb-2">
            <Label htmlFor="role" value="Vai trò" />
          </div>
          <Select
            id="role"
            name="role"
            value={formik.values.role}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            helperText={
              formik.touched.role && formik.errors.role
                ? formik.errors.role
                : ""
            }
            color={
              formik.touched.role && formik.errors.role
                ? "failure"
                : "gray"
            }
          >
            <option value="">Chọn vai trò</option>
            <option value="admin">Quản lý</option>
            <option value="staff">Nhân viên</option>
          </Select>
        </div>

        {/* Active Status Field */}
        <fieldset className="col-span-2 sm:col-span-1">
          <legend className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Trạng thái
          </legend>
          <div className="flex items-center gap-2">
            <Radio
              id="active"
              name="active"
              value={true}
              checked={formik.values.active === true}
              onChange={() => formik.setFieldValue("active", true)}
            />
            <Label htmlFor="active">Đang hoạt động</Label>
          </div>
          <div className="flex items-center gap-2">
            <Radio
              id="inactive"
              name="active"
              value={false}
              checked={formik.values.active === false}
              onChange={() => formik.setFieldValue("active", false)}
            />
            <Label htmlFor="inactive">Bị khoá</Label>
          </div>
        </fieldset>
      </div>

      <div className={"flex gap-2"}>
        <Button type="submit" color="blue">
          <MdOutlinePublishedWithChanges className="mr-2 h-5 w-5" />
          Cập nhật
        </Button>
        <Button type="button" color="failure" onClick={() => deleteUser(id)}>
          <MdDelete className="mr-2 h-5 w-5" />
          Xoá
        </Button>
      </div>
    </form>
  );
}

function CreateUserForm() {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      role: "",
      active: true,
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Tên người dùng là bắt buộc"),
      email: Yup.string()
        .email("Email không hợp lệ")
        .required("Email là bắt buộc"),
      phone: Yup.string().required("Số điện thoại là bắt buộc"),
      password: Yup.string().required("Mật khẩu là bắt buộc"),
      role: Yup.string().required("Vai trò là bắt buộc"),
    }),
    onSubmit: async (values) => {
      try {
        await axios.post("/users", values);
        pushToast("Tạo người dùng mới thành công", "success");
        formik.resetForm();
        navigate(0);
      } catch (error) {
        console.error("Error creating user:", error);
        pushToast(error?.response?.data?.message || e?.message, "error");
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <div className="grid gap-4 mb-4">
        {/* Name Field */}
        <div className={"col-span-2"}>
          <div className="mb-2">
            <Label htmlFor="name" value="Họ Tên"/>
          </div>
          <TextInput
            id="name"
            name="name"
            type="text"
            placeholder="Họ tên"
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

        {/* Email Field */}
        <div className={"col-span-2 sm:col-span-1"}>
          <div className="mb-2">
            <Label htmlFor="email" value="Email"/>
          </div>
          <TextInput
            id="email"
            name="email"
            type="email"
            placeholder="your@email.com"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            helperText={
              formik.touched.email && formik.errors.email
                ? formik.errors.email
                : ""
            }
            color={
              formik.touched.email && formik.errors.email
                ? "failure"
                : "gray"
            }
          />
        </div>

        {/* Phone Field */}
        <div className={"col-span-2 sm:col-span-1"}>
          <div className="mb-2">
            <Label htmlFor="phone" value="SĐT"/>
          </div>
          <TextInput
            id="phone"
            name="phone"
            type="text"
            placeholder="Số điện thoại"
            value={formik.values.phone}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            helperText={
              formik.touched.phone && formik.errors.phone
                ? formik.errors.phone
                : ""
            }
            color={
              formik.touched.phone && formik.errors.phone
                ? "failure"
                : "gray"
            }
          />
        </div>

        <div className={"col-span-2"}>
          <div className="mb-2">
            <Label htmlFor="password" value="Mật khẩu"/>
          </div>
          <TextInput
            id="password"
            name="password"
            type="password"
            placeholder="Mật khẩu"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            helperText={
              formik.touched.password && formik.errors.password
                ? formik.errors.password
                : ""
            }
            color={
              formik.touched.password && formik.errors.password
                ? "failure"
                : "gray"
            }
          />
        </div>

        {/* Role Field */}
        <div className="col-span-2 sm:col-span-1">
          <div className="mb-2">
              <Label htmlFor="role" value="Vai trò"/>
          </div>
          <Select
            id="role"
            name="role"
            value={formik.values.role}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            helperText={
              formik.touched.role && formik.errors.role
                ? formik.errors.role
                : ""
            }
            color={
              formik.touched.role && formik.errors.role
                ? "failure"
                : "gray"
            }
          >
            <option value="">Chọn vai trò</option>
            <option value="admin">Quản lý</option>
            <option value="staff">Nhân viên</option>
          </Select>
        </div>

        {/* Active Status Field */}
        <fieldset className={"col-span-2 sm:col-span-1"}>
          <legend className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Trạng thái
          </legend>
          <div className={"flex items-center gap-2"}>
            <Radio
              id="active"
              name="active"
              value={true}
              checked={formik.values.active === true}
              onChange={() => formik.setFieldValue("active", true)}
            />
            <Label htmlFor="active" value="Đang hoạt động" />
          </div>
          <div className={"flex items-center gap-2"}>
            <Radio
              id="inactive"
              name="active"
              value={false}
              checked={formik.values.active === false}
              onChange={() => formik.setFieldValue("active", false)}
            />
            <Label htmlFor="inactive" value="Bị khóa" />
          </div>
        </fieldset>
      </div>

      {/* Submit Button */}
      <Button type="submit" color="blue">
        <MdPersonAdd className="mr-2 h-5 w-5" />
        Thêm người dùng mới
      </Button>
    </form>
  );
}

export default function AdminUserManager() {
  const [users, setUsers] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [pagination, setPagination] = useState({
    currentPage: searchParams.get("page") || 1,
    totalPages: 1
  });

  const fetchUser = async () => {
    try {
      const res = await axios.get("/users", {
        params: {
          page: pagination.currentPage,
          limit: 10,
          filters: searchParams.get("filters"),
          sortBy: searchParams.get("sortBy"),
          order: searchParams.get("order"),
        }
      });
      setUsers(res.data.docs.map(user => ({
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: roles[user.role],
        active: userStatus[user.active],
        createdAt: moment(user.createdAt).format("HH:mm, DD/MM/YYYY"),
        updatedAt: moment(user.updatedAt).format("HH:mm, DD/MM/YYYY"),
      })));

      setPagination({
        ...pagination,
        currentPage: res.data.page,
        totalPages: res.data.totalPages
      })

    } catch (error) {
      pushToast(error?.response?.data?.message || e?.message, "error");
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
    fetchUser();
  }, [pagination.currentPage, searchParams]);

  return (
    <div className="flex items-start justify-center h-full w-full">
      <ListView
        data={[...users]}
        currentPage={pagination.currentPage}
        totalPages={pagination.totalPages}
        onPageChange={onPageChange}
        pagination={true}
        renderFilters={() => {
          return (
            <div className={"flex flex-col gap-2"}>
              <Label htmlFor={"role"} value={"Vai trò"} />
              <Select
                id="role"
                defaultValue={parseFilters(searchParams.get("filters"))?.role || ""}
                onChange={(e) => {
                  const filterObj = parseFilters(searchParams.get("filters"));
                  if (!e.target.value) {
                    delete filterObj?.role;
                  } else {
                    filterObj.role = e.target.value;
                  }
                  searchParams.set("filters", stringifyFilters(filterObj));
                }}
              >
                <option value="">Tất cả</option>
                <option value="admin">Quản lý</option>
                <option value="staff">Nhân viên</option>
              </Select>

              <Label htmlFor={"active"} value={"Trạng thái"} />
              <Select
                id="active"
                defaultValue={parseFilters(searchParams.get("filters"))?.active}
                onChange={(e) => {
                  const filterObj = parseFilters(searchParams.get("filters"));
                  if (!e.target.value) {
                    delete filterObj?.active;
                  } else {
                    filterObj.active = e.target.value;
                  }
                  searchParams.set("filters", stringifyFilters(filterObj));
                }}
              >
                <option value="">Tất cả</option>
                <option value={true}>Đang hoạt động</option>
                <option value={false}>Bị khoá</option>
              </Select>
            </div>
          )
        }}
        onFilterApply={() => {
          setSearchParams(searchParams);
        }}
        onSortApply={() => {
          setSearchParams(searchParams);
        }}
        renderCreator={() => { }}
        onItemSelect={() => { }}
        presntationFields={presentationFields}
        ItemModal={UpdateUserForm}
        CreatorModal={CreateUserForm}
      />
    </div>
  )
}

const userStatus = {
  true: <div className={"flex gap-2 items-center"}>
    <SiTicktick className="text-green-500"/>
    <span>
      Đang hoạt động
    </span>
  </div>,
  false: <div className={"flex gap-2 items-center"}>
    <RiCloseCircleLine className="text-red-500"/>
    <span>
      Bị khoá
    </span>
  </div>
}