import ListView from "../comps/ListView.jsx";
import React, {useEffect, useState} from "react";
import {useNavigate, useSearchParams} from "react-router-dom";
import {axios} from "../services/requests.js";
import moment from "moment/moment.js";
import pushToast from "../helpers/sonnerToast.js";
import {SiTicktick} from "react-icons/si";
import {RiCloseCircleLine} from "react-icons/ri";
import {useFormik} from "formik";
import * as Yup from "yup";
import {Button, Label, Radio, Select, TextInput} from "flowbite-react";
import {MdDelete, MdOutlinePublishedWithChanges} from "react-icons/md";
import {parseFilters, stringifyFilters} from "../helpers/parsers.js";

const presentationFields = [
  {
    key: "name",
    label: "Tên tầng",
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

function UpdateFloorForm({item}) {
  const {id} = item;
  const [floor, setFloor] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFloor = async () => {
      try {
        const res = await axios.get(`/floors/${id}`);
        setFloor(res.data);
      } catch (error) {
        pushToast(error?.response?.data?.message || e?.message, "error");
      }
    };
    fetchFloor();
  }, [id]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: floor?.name || "",
      active: floor?.active || false,
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Tên là bắt buộc"),
    }),
    onSubmit: async (values) => {
      try {
        await axios.patch(`/floors/${id}`, values);
        pushToast("Cập nhật thành công", "success");
        navigate(0);
      } catch (error) {
        console.error("Error updating floor:", error);
        pushToast(error?.response?.data?.message || e?.message, "error");
      }
    },
  });

  const deleteFloor = async (id) => {
    try {
      const sure = window.confirm("Bạn có chắc chắn muốn xóa tầng này?");
      if (!sure) return;

      await axios.delete(`/floors/${id}`);
      pushToast("Xóa tầng thành công", "success");
      navigate(0);
    } catch (error) {
      console.error("Error deleting floor:", error);
      pushToast(error?.response?.data?.message || e?.message, "error");
    }
  }

  if (!floor) return <div>Loading...</div>;

  return (
    <form onSubmit={formik.handleSubmit}>
      <div className="grid gap-4 mb-4 grid-cols-2">
        {/* Name Field */}
        <div className="col-span-2">
          <div className="mb-2">
            <Label htmlFor="name" value="Tên tầng" />
          </div>
          <TextInput
            type="text"
            id="name"
            name="name"
            placeholder="Tên tầng"
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
            <Label htmlFor="inactive">Không hoạt động</Label>
          </div>
        </fieldset>
      </div>

      <div className={"flex gap-2"}>
        <Button type="submit" color="blue">
          <MdOutlinePublishedWithChanges className="mr-2 h-5 w-5" />
          Cập nhật
        </Button>
        <Button type="button" color="failure" onClick={() => deleteFloor(id)}>
          <MdDelete className="mr-2 h-5 w-5" />
          Xoá
        </Button>
      </div>
    </form>
  );
}

function CreateFloorForm() {
  const formik = useFormik({
    initialValues: {
      name: "",
      active: false,
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Tên là bắt buộc"),
    }),
    onSubmit: async (values) => {
      try {
        await axios.post("/floors", values);
        pushToast("Tạo tầng thành công", "success");
        window.location.reload();
      } catch (error) {
        console.error("Error creating floor:", error);
        pushToast(error?.response?.data?.message || e?.message, "error");
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <div className="grid gap-4 mb-4 grid-cols-2">
        {/* Name Field */}
        <div className="col-span-2">
          <div className="mb-2">
            <Label htmlFor="name" value="Tên tầng" />
          </div>
          <TextInput
            type="text"
            id="name"
            name="name"
            placeholder="Tên tầng"
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
            <Label htmlFor="inactive">Không hoạt động</Label>
          </div>
        </fieldset>
      </div>

      <Button type="submit" color="blue">
        <MdOutlinePublishedWithChanges className="mr-2 h-5 w-5" />
        Tạo tầng
      </Button>
    </form>
  );
}

export default function FloorManagement() {
  const [floors, setFloors] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [pagination, setPagination] = useState({
    currentPage: searchParams.get("page") || 1,
    totalPages: 1
  });

  const fetchFloors = async () => {
    try {
      const res = await axios.get("/floors", {
        params: {
          page: pagination.currentPage,
          limit: 10,
          sortBy: searchParams.get("sortBy"),
          order: searchParams.get("order"),
          filters: searchParams.get("filters"),
        }
      });

      setFloors(res?.data?.docs?.map(item => ({
        ...item,
        id: item._id,
        active: floorStatus[item.active],
        createdAt: moment(item.createdAt).format("HH:mm, DD/MM/YYYY"),
        updatedAt: moment(item.updatedAt).format("HH:mm, DD/MM/YYYY"),
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
    fetchFloors();
  }, [pagination.currentPage, searchParams]);

  return (
    <div className="flex items-start justify-center h-full w-full">
      <ListView
        data={floors}
        currentPage={pagination.currentPage}
        totalPages={pagination.totalPages}
        onPageChange={onPageChange}
        pagination={true}
        renderFilters={() => {
          return (
            <div className={"flex flex-col gap-2"}>
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
                <option value={false}>Không hoạt động</option>
              </Select>
            </div>
          )
        }}
        onFilterApply={() => {
          setSearchParams(searchParams);
        }}
        presntationFields={presentationFields}
        ItemModal={UpdateFloorForm}
        CreatorModal={CreateFloorForm}
      />
    </div>
  )
}

const floorStatus = {
  true: <div className={"flex gap-2 items-center"}>
    <SiTicktick className="text-green-500"/>
    <span>
      Đang hoạt động
    </span>
  </div>,
  false: <div className={"flex gap-2 items-center"}>
    <RiCloseCircleLine className="text-red-500"/>
    <span>
      Không hoạt động
    </span>
  </div>
}