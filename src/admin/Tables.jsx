import React, {useEffect, useState} from 'react';
import {Link, useNavigate, useSearchParams} from "react-router-dom";
import {axios} from "../services/requests.js";
import moment from "moment";
import pushToast from "../helpers/sonnerToast.js";
import ListView from "../comps/ListView.jsx";
import {Button, Label, Radio, Select, TextInput} from "flowbite-react";
import {parseFilters, stringifyFilters} from "../helpers/parsers.js";
import {SiTicktick} from "react-icons/si";
import {RiCloseCircleLine} from "react-icons/ri";
import {useFormik} from "formik";
import * as Yup from "yup";
import {MdDelete, MdOutlinePublishedWithChanges} from "react-icons/md";
import {FaDownload} from "react-icons/fa";
import {QRCodeCanvas, QRCodeSVG} from "qrcode.react";
import QRCode from "react-qr-code";

const presentationFields = [
  {
    key: "name",
    label: "Tên",
  },
  {
    key: "floor",
    label: "Tầng",
  },
  {
    key: "capacity",
    label: "Số chỗ",
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
  },
  {
    key: "actions",
    label: "Hành động",
  }
]

function UpdateTableForm({
  item,
  setOpenItemModal = () => { },
  fetchData = () => { }
}) {
  const { id } = item;
  const [data, setData] = useState(null);
  const navigate = useNavigate();
  const [floors, setFloors] = useState([]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`/tables/${id}`);
        setData(res.data);
      } catch (error) {
        pushToast(error?.response?.data?.message || error?.message, "error");
      }
    };
    fetchUser();
  }, [id]);

  useEffect(() => {
    const fetchFloors = async () => {
      const res = await axios.get("/floors", {
        params: {
          page: 1,
          limit: 100,
        }
      });
      setFloors(res?.data?.docs);
    }
    fetchFloors();
  }, []);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: data?.name || "",
      floor: data?.floor?._id || "",
      active: data?.active || false,
      capacity: data?.capacity || 0,
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Tên là bắt buộc"),
      floor: Yup.string().required("Tầng là bắt buộc"),
    }),
    onSubmit: async (values) => {
      try {
        await axios.patch(`/tables/${id}`, values);
        pushToast("Cập nhật thành công", "success");
        setOpenItemModal(false);
        fetchData();
      } catch (error) {
        console.error("Error updating table:", error);
        pushToast(error?.response?.data?.message || error?.message, "error");
      }
    },
  });

  const deleteTable = async (id) => {
    try {
      const sure = window.confirm("Bạn có chắc chắn muốn xóa bàn này?");
      if (!sure) return;

      await axios.delete(`/tables/${id}`);
      pushToast("Xóa bàn thành công", "success");
      setOpenItemModal(false);
      fetchData();
    } catch (error) {
      console.error("Error deleting table:", error);
      pushToast(error?.response?.data?.message || error?.message, "error");
    }
  }

  if (!data) return <div>Loading...</div>;

  return (
    <form onSubmit={formik.handleSubmit}>
      <div className="grid gap-4 mb-4 grid-cols-2">
        <div className="col-span-2">
          <div className="mb-2">
            <h1 className="text-gray-900 dark:text-white">Mã QR</h1>

            <div className="flex gap-2 items-center justify-center">
              <QRCode value={`${import.meta.env.VITE_QR_CODE_URL || "http://localhost:3056"}/${id}`} size={256}/>
              <div className={"flex flex-col gap-2"}>
                <Button
                  size={"xs"}
                  onClick={(e) => {
                    e.stopPropagation();
                    const canvas = document.getElementById(`qrcode-${id}`);
                    const pngUrl = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
                    let downloadLink = document.createElement("a");
                    downloadLink.href = pngUrl;
                    downloadLink.download = `QR-${data.name}.png`;
                    document.body.appendChild(downloadLink);
                    downloadLink.click();
                    document.body.removeChild(downloadLink);
                  }}
                >
                  <FaDownload className="mr-2 h-3 w-3"/>
                  Tải QR
                </Button>
                <Button
                  size={"xs"}
                  color={"warning"}
                  as={Link}
                  to={`/${id}`}
                  target={"_blank"}
                >
                  Trang đặt bàn
                </Button>
              </div>
            </div>
          </div>

        </div>
        <div className="col-span-2">
          <div className="mb-2">
            <Label htmlFor="name" value="Tên"/>
          </div>
          <TextInput
            type="text"
            id="name"
            name="name"
            placeholder="Tên"
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

        <div className="col-span-2 sm:col-span-1">
          <div className="mb-2">
            <Label htmlFor="capacity" value="Số chỗ"/>
          </div>
          <TextInput
            type="number"
            id="capacity"
            name="capacity"
            placeholder="Số chỗ"
            value={formik.values.capacity}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            helperText={
              formik.touched.capacity && formik.errors.capacity
                ? formik.errors.capacity
                : ""
            }
            color={
              formik.touched.capacity && formik.errors.capacity
                ? "failure"
                : "gray"
            }
          />
        </div>

        <div className="col-span-2 sm:col-span-1">
          <div className="mb-2">
            <Label htmlFor="floor" value="Tầng"/>
          </div>
          <Select
            id="floor"
            name="floor"
            value={formik.values.floor}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            helperText={
              formik.touched.floor && formik.errors.floor
                ? formik.errors.floor
                : ""
            }
            color={
              formik.touched.floor && formik.errors.floor
                ? "failure"
                : "gray"
            }
          >
            <option value="">Chọn tầng</option>
            {floors.map((floor) => (
              <option key={floor._id} value={floor._id}>
                {floor.name}
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
          <MdOutlinePublishedWithChanges className="mr-2 h-5 w-5"/>
          Cập nhật
        </Button>
        <Button type="button" color="failure" onClick={() => deleteTable(id)}>
          <MdDelete className="mr-2 h-5 w-5"/>
          Xoá
        </Button>
      </div>
    </form>
  );
}

function CreateTableForm({
                           fetchData = () => {
                           },
                           setOpenCreateModal = () => {
                           }
                         }) {
  const navigate = useNavigate();
  const [floors, setFloors] = useState([]);

  useEffect(() => {
    const fetchFloors = async () => {
      const res = await axios.get("/floors", {
        params: {
          page: 1,
          limit: 100,
        }
      });
      setFloors(res?.data?.docs);
    }
    fetchFloors();
  }, []);

  const formik = useFormik({
    initialValues: {
      name: "",
      floor: "",
      capacity: 0,
      active: false,
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Tên bàn là bắt buộc"),
      floor: Yup.string().required("Tầng là bắt buộc"),
    }),
    onSubmit: async (values) => {
      try {
        await axios.post("/tables", values);
        pushToast("Tạo bàn thành công", "success");
        setOpenCreateModal(false);
        fetchData();
      } catch (error) {
        console.error("Error creating table:", error);
        pushToast(error?.response?.data?.message || error?.message, "error");
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <div className="grid gap-4 mb-4 grid-cols-2">
        <div className="col-span-2">
          <div className="mb-2">
            <Label htmlFor="name" value="Tên"/>
          </div>
          <TextInput
            type="text"
            id="name"
            name="name"
            placeholder="Tên"
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

        <div className="col-span-2 sm:col-span-1">
          <div className="mb-2">
            <Label htmlFor="floor" value="Tầng"/>
          </div>
          <Select
            id="floor"
            name="floor"
            value={formik.values.floor}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            helperText={
              formik.touched.floor && formik.errors.floor
                ? formik.errors.floor
                : ""
            }
            color={
              formik.touched.floor && formik.errors.floor
                ? "failure"
                : "gray"
            }
          >
            <option value="">Chọn tầng</option>
            {floors.map((floor) => (
              <option key={floor._id} value={floor._id}>
                {floor.name}
              </option>
            ))}
          </Select>
        </div>

        <div className="col-span-2 sm:col-span-1">
          <div className="mb-2">
            <Label htmlFor="capacity" value="Số chỗ"/>
          </div>
          <TextInput
            type="number"
            id="capacity"
            name="capacity"
            placeholder="Số chỗ"
            value={formik.values.capacity}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            helperText={
              formik.touched.capacity && formik.errors.capacity
                ? formik.errors.capacity
                : ""
            }
            color={
              formik.touched.capacity && formik.errors.capacity
                ? "failure"
                : "gray"
            }
          />
        </div>

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
        <MdOutlinePublishedWithChanges className="mr-2 h-5 w-5"/>
        Tạo bàn
      </Button>
    </form>
  );
}

export default function TablesManager() {
  const [tables, setTables] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [pagination, setPagination] = useState({
    currentPage: searchParams.get("page") || 1,
    totalPages: 1
  });
  const [floors, setFloors] = useState([]);

  const fetchTables = async () => {
    try {
      const res = await axios.get("/tables", {
        params: {
          page: pagination.currentPage,
          limit: 10,
          filters: searchParams.get("filters"),
          sortBy: searchParams.get("sortBy") || "createdAt",
          order: searchParams.get("order") || "desc",
          search: searchParams.get("search"),
        }
      });

      setTables(res?.data?.docs?.map(table => ({
        ...table,
        id: table._id,
        floor: table.floor?.name,
        active: tableStatus[table.active],
        createdAt: moment(table.createdAt).format("HH:mm, DD/MM/YYYY"),
        updatedAt: moment(table.updatedAt).format("HH:mm, DD/MM/YYYY"),
        actions: (
          <div className={"flex gap-2 justify-center items-center"}>
            <div className={"hidden"}>
              <QRCodeCanvas id={`qrcode-${table._id}`} value={`${import.meta.env.VITE_QR_CODE_URL || "http://localhost:3056"}/${table._id}`} size={256}/>
            </div>
            <Button
              size={"xs"}
              onClick={(e) => {
                e.stopPropagation();
                const canvas = document.getElementById(`qrcode-${table._id}`);
                const pngUrl = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
                let downloadLink = document.createElement("a");
                downloadLink.href = pngUrl;
                downloadLink.download = `QR-${table.name}.png`;
                document.body.appendChild(downloadLink);
                downloadLink.click();
                document.body.removeChild(downloadLink);
              }}
            >
              <FaDownload className="mr-2 h-3 w-3"/>
              Tải QR
            </Button>
            <Button
              size={"xs"}
              color={"warning"}
              as={Link}
              to={`/${table._id}`}
              target={"_blank"}
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              Trang đặt bàn
            </Button>
          </div>
        )
      })));

      setPagination({
        ...pagination,
        currentPage: res.data.page,
        totalPages: res.data.totalPages
      })

    } catch (error) {
      pushToast(error?.response?.data?.message || error?.message, "error");
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
    fetchTables();
  }, [pagination.currentPage, searchParams]);

  useEffect(() => {
    const fetchFloors = async () => {
      const res = await axios.get("/floors", {
        params: {
          page: 1,
          limit: 100,
        }
      });
      setFloors(res?.data?.docs);
    }
    fetchFloors();
  }, []);

  return (
    <div className="flex items-start justify-center h-full w-full p-8">
      <ListView
        data={tables}
        currentPage={pagination.currentPage}
        totalPages={pagination.totalPages}
        onPageChange={onPageChange}
        pagination={true}
        renderFilters={() => {
          return (
            <div className={"flex flex-col gap-2"}>
              <Label htmlFor={"floor"} value={"Tầng"}/>
              <Select
                id="floor"
                defaultValue={parseFilters(searchParams.get("filters"))?.floor || ""}
                onChange={(e) => {
                  const filterObj = parseFilters(searchParams.get("filters"));
                  if (!e.target.value) {
                    delete filterObj?.floor;
                  } else {
                    filterObj.floor = e.target.value;
                  }
                  searchParams.set("filters", stringifyFilters(filterObj));
                }}
              >
                <option value="">Tất cả</option>
                {floors.map((floor) => (
                  <option key={floor._id} value={floor._id}>
                    {floor.name}
                  </option>
                ))}
              </Select>

              <Label htmlFor={"active"} value={"Trạng thái"}/>
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
        renderCreator={() => {
        }}
        onItemSelect={() => {
        }}
        presntationFields={presentationFields}
        ItemModal={UpdateTableForm}
        CreatorModal={CreateTableForm}
        isSearchable={true}
        onSearch={(value) => {
          searchParams.set("search", value);
          setSearchParams(searchParams);
        }}
        fetchData={fetchTables}
      />
    </div>
  );
}

const tableStatus = {
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