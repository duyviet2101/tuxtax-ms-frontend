import React, {useEffect, useState} from "react";
import {Link, useNavigate, useSearchParams} from "react-router-dom";
import {axios} from "../services/requests.js";
import {formatVND, parseFilters, stringifyFilters} from "../helpers/parsers.js";
import moment from "moment/moment.js";
import pushToast from "../helpers/sonnerToast.js";
import ListView from "../comps/ListView.jsx";
import {FaCartArrowDown, FaHistory} from "react-icons/fa";
import {Button, Datepicker, Label, Select} from "flowbite-react";

export default function AdminOrderHistory() {
  const [orders, setOrders] = useState([]);
  const [tables, setTables] = useState([]);
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [pagination, setPagination] = useState({
    currentPage: searchParams.get("page") || 1,
    totalPages: 1
  });

  const fetchOrders = async () => {
    try {
      const res = await axios.get('/orders', {
        params: {
          page: pagination.currentPage,
          limit: 10,
          sortBy: searchParams.get("sortBy"),
          order: searchParams.get("order"),
          filters: "status:completed,isPaid:true" + (searchParams.get("filters") ? "," + searchParams.get("filters") : ""),
          search: searchParams.get("search"),
          from: moment(searchParams.get("from")).toISOString(),
          to: moment(searchParams.get("to")).toISOString()
        }
      })

      setOrders(res?.data?.docs?.map(item => ({
        _id: item?._id,
        name: item?.name || "Khách lẻ",
        phone: item?.phone || "N/A",
        billCode: item?.billCode,
        table: `${item?.table?.floor?.slug}-${item?.table?.name}`,
        total: formatVND(item?.total),
        createdAt: moment(item?.createdAt).format("HH:mm, DD/MM/YYYY"),
        paidAt: item?.paidAt ? moment(item?.paidAt).format("HH:mm, DD/MM/YYYY") : "N/A",
      })));

      setPagination({
        ...pagination,
        currentPage: res.data.page,
        totalPages: res.data.totalPages
      });
    } catch (error) {
      pushToast(error?.response?.data?.message || error?.message, "error");
    }
  }

  useEffect(() => {
    fetchOrders();
  }, [pagination.currentPage, searchParams]);

  const onPageChange = (page) => {
    setPagination({
      ...pagination,
      currentPage: page
    });
    searchParams.set("page", page);
    setSearchParams(searchParams);
  }

  useEffect(() => {
    const fetchTables = async () => {
      const res = await axios.get('/tables', {
        params: {
          limit: 100,
          page: 1
        }
      })
      res?.data?.docs.sort((a, b) => {
        if (a?.order && !b?.order) {
          return -1;
        }
        if (!a?.order && b?.order) {
          return 1;
        }
        return 0;
      });

      setTables(res?.data?.docs);
    }
    fetchTables();
  }, []);
  return (
    <div className="flex items-start justify-center h-full w-full">
      <div className="relative h-full w-full p-8">
        <div className="border-b rounded-t-lg flex mb-4">
          <Link to={"/admin/orders"}
                className="p-4 rounded-t-lg flex gap-2 hover:cursor-pointer hover:bg-gray-200">
            <FaCartArrowDown className="h-5 w-5"/>
            <h1 className="text-sm font-medium">Quản lý Orders</h1>
          </Link>
          <Link to={"/admin/orders/history"}
                className="p-4 bg-gray-200 rounded-t-lg text-cyan-600 font-medium flex gap-2 hover:cursor-pointer hover:bg-gray-200">
            <FaHistory className="h-5 w-5"/>
            <h1 className="text-sm">Lịch sử</h1>
          </Link>
        </div>
        <div className={"mb-4 flex gap-4 flex-col"}>
          <div className={"flex gap-4 items-center"}>
            <Datepicker language={"vi"} labelTodayButton={"Hôm nay"} labelClearButton={"Xoá"}
                        onChange={(value) => {
                          const from = moment(value).toISOString();
                          searchParams.set("from", from);
                          setSearchParams(searchParams);
                        }}
                        // value={new Date(searchParams.get("from") || new Date()) || null}
                        value={searchParams.get("from") ? moment(searchParams.get("from")).toDate() : null}
            />
            đến
            <Datepicker language={"vi"} labelTodayButton={"Hôm nay"} labelClearButton={"Xoá"}
                        onChange={(value) => {
                          const to = moment(value).toISOString();
                          searchParams.set("to", to);
                          setSearchParams(searchParams);
                        }}
                        // value={new Date(searchParams.get("to") || new Date()) || null}
                        value={searchParams.get("to") ? moment(searchParams.get("to")).toDate() : null}
            />
            <Button
              onClick={() => {
                searchParams.delete("from");
                searchParams.delete("to");
                setSearchParams(searchParams);
              }}
              color={"failure"}
            >Xoá</Button>
          </div>
        </div>
        <ListView
          presntationFields={presentationFields}
          data={orders}
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          onPageChange={onPageChange}
          pagination={true}
          renderFilters={() => {
            return (
              <div className={"flex flex-col gap-2 max-h-96"}>
                <Label htmlFor={"table"} value={"Bàn"} />
                <Select
                  id="table"
                  defaultValue={parseFilters(searchParams.get("filters"))?.table || ""}
                  onChange={(e) => {
                    const filterObj = parseFilters(searchParams.get("filters"));
                    if (!e.target.value) {
                      delete filterObj?.table;
                    } else {
                      filterObj.table = e.target.value;
                    }
                    searchParams.set("filters", stringifyFilters(filterObj));
                  }}
                >
                  <option value="">Tất cả</option>
                  {tables.map((table) => (
                    <option key={table._id} value={table._id}>
                      {table.floor.slug}-{table.name}
                    </option>
                  ))}
                </Select>
              </div>
            )
          }}
          onFilterApply={() => setSearchParams(searchParams)}
          renderCreator={null}
          onItemSelect={(item) => {
            navigate(`/admin/orders/${item._id}/checkout`);
          }}
          ItemModal={null}
          CreatorModal={null}
          isSearchable={true}
          onSearch={(value) => {
            searchParams.set("search", value);
            setSearchParams(searchParams);
          }}
        />
      </div>
    </div>
  )
}

const presentationFields = [
  {
    key: "billCode",
    label: "Mã HĐ",
  },
  {
    key: "name",
    label: "Khách hàng",
  },
  {
    key: "phone",
    label: "SĐT",
  },
  {
    key: "table",
    label: "Bàn",
  },
  {
    key: "total",
    label: "Tổng tiền",
  },
  {
    key: "createdAt",
    label: "Ngày tạo",
  },
  {
    key: "paidAt",
    label: "Thanh toán vào",
  },
]