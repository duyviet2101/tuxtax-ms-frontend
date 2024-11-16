import {
  Badge,
  Button,
  ButtonGroup,
  Checkbox,
  FloatingLabel,
  Kbd,
  Label,
  ListGroup,
  Modal,
  Pagination,
  Select,
  Table,
  Tabs,
  TextInput
} from "flowbite-react";
import { Formik } from "formik";
import { useEffect, useState } from "react";
import { HiMiniShare, HiArrowsUpDown, HiMiniAdjustmentsVertical, HiMiniPlusCircle, HiCheck } from "react-icons/hi2"
import {isEmpty} from "lodash/lang.js";
import {isBoolean, isNumber} from "lodash";
import {SiTicktick} from "react-icons/si";
import {RiCloseCircleLine} from "react-icons/ri";
import {FaSearch} from "react-icons/fa";
import {useSearchParams} from "react-router-dom";
import {HiClock} from "react-icons/hi";
import {parseFilters} from "../helpers/parsers.js";


export default function ListView({
  data, currentPage, totalPages, onPageChange, pagination,
  renderFilters, onFilterApply, renderCreator, onItemSelect,
  presntationFields: presentationFields, renderItemModal, ItemModal,
  CreatorModal,
  isSearchable = false, onSearch
}) {
  const [openShareModal, setOpenShareModal] = useState(false);
  const [openFilterModal, setOpenFilterModal] = useState(false);
  const [openTransModal, setOpenTransModal] = useState(false);
  const [openSortModal, setOpenSortModal] = useState(false);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openItemModal, setOpenItemModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();

  const filtersCount = Object.keys(parseFilters(searchParams.get("filters") || "")).length || 0;
  const isSorted = searchParams.has("sortBy") && searchParams.has("order");

  return (
    <>
      <div className="relative grid grid-rows-12 h-full w-full overflow-hidden p-8">
        {isSearchable && (
          <div className="w-full mb-2 row-end-1">
            <form id={"search-data-form"} className="relative" onSubmit={(e) => {
              e.preventDefault();
              onSearch && onSearch(document.getElementById("search-data-input").value);
            }}>
              <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                <FaSearch className="w-5 h-5 text-gray-400"/>
              </div>
              <input type="search" id="search-data-input"
                     className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                     placeholder="Tìm kiếm"
                     defaultValue={searchParams.get("search") || ""}
              />
              <button type="submit"
                      className="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                Tìm kiếm
              </button>
            </form>
          </div>
        )}
        {(filtersCount || isSorted) && <div className={"flex flex-wrap gap-2 row-end-2"}>
          {filtersCount > 0 && (
            <Badge className="text-sm" icon={HiMiniAdjustmentsVertical}>
              {filtersCount} bộ lọc
            </Badge>
          )}
          {isSorted && (
            <Badge color="pink" className="text-sm" icon={HiArrowsUpDown}>
              Đã sắp xếp
            </Badge>
          )}
        </div>}
        <div className="flex justify-between items-center px-2">
          <div className="w-16 flex justify-start py-2">
            <Button color="gray" className="w-full" onClick={() => {
              setOpenCreateModal(true);
            }}>
              <HiMiniPlusCircle className="w-5 h-5"/>
            </Button>
            {/*<ButtonGroup>*/}
            {/*  <Button color="gray" className="w-full" onClick={() => {*/}
            {/*  }}>*/}
            {/*    <HiCheck className="w-5 h-5" />*/}
            {/*  </Button>*/}
            {/*</ButtonGroup>*/}
          </div>

          <div className="w-96 flex flex-col py-2 justify-center align-middle">
            {
              pagination && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={onPageChange}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center"
                  }}
                />
              )
            }
          </div>

          <div className="w-64 flex justify-end">
            <ButtonGroup>
              <Button color="gray" className="w-full" onClick={() => {
                setOpenFilterModal(true);
              }}>
                <HiMiniAdjustmentsVertical className="w-5 h-5"/>
              </Button>
              <Button color="gray" className="w-full" onClick={() => {
                setOpenSortModal(true);
              }}>
                <HiArrowsUpDown className="w-5 h-5"/>
              </Button>
              {/*<Button color="gray" className="w-full" onClick={() => {*/}
              {/*  setOpenShareModal(true);*/}
              {/*}}>*/}
              {/*  <HiMiniShare className="w-5 h-5" />*/}
              {/*</Button>*/}
              {/*<Button color="gray" className="w-full" onClick={() => {*/}
              {/*  setOpenTransModal(true);*/}
              {/*}}>*/}
              {/*  <HiArrowsUpDown className="w-5 h-5" />*/}
              {/*</Button>*/}
            </ButtonGroup>
          </div>
        </div>
        <div className="overflow-auto row-span-11">
          <Table className="relative" striped hoverable>
            <Table.Head className="sticky">
              {
                presentationFields
                  ? presentationFields.map((field, index) => (
                    <Table.HeadCell key={index} className={"bg-blue-400 border"}>
                      {field.label}
                    </Table.HeadCell>
                  ))
                  : Object.keys(data[0]).map((key, index) => (
                    <Table.HeadCell key={index} className={"bg-blue-400 border"}>
                      {key}
                    </Table.HeadCell>
                  ))
              }
            </Table.Head>

            <Table.Body className="divide-y">
              {data?.length > 0 ?
                data.map((item, index) => (
                  <Table.Row key={index} onClick={() => {
                    onItemSelect && onItemSelect(item);
                    setSelectedItem(item);
                    setOpenItemModal(true);
                  }}>
                    {
                      presentationFields
                        ? presentationFields.map((field, index) => (
                          <Table.Cell key={index} className={"text-zinc-700 border"}>
                            {(() => {
                              const value = item[field.key];

                              if (isBoolean(value)) {
                                return value ? <SiTicktick style={{color: "green"}}/> :
                                  <RiCloseCircleLine style={{color: "red"}}/>;
                              }

                              if (isEmpty(value) && !isNumber(value)) {
                                return "Chưa cập nhật";
                              }

                              if (field.maxLength && value.length > field.maxLength) {
                                return value.substr(0, field.maxLength) + "...";
                              }
                              return value;
                            })()}
                          </Table.Cell>
                        ))
                        : Object.keys(item).map((key, index) => (
                          <Table.Cell key={index} className={"border"}>
                            {item[key]}
                          </Table.Cell>
                        ))
                    }
                  </Table.Row>
                ))
                :
                (<Table.Row>
                  <Table.Cell className={"border"} colSpan={presentationFields?.length || Object.keys(data[0]).length}>
                    <div className="flex justify-center items-center">
                      <span>Không có dữ liệu</span>
                    </div>
                  </Table.Cell>
                </Table.Row>)
              }
            </Table.Body>
          </Table>
        </div>

      </div>

      <Modal show={openShareModal} onClose={() => setOpenShareModal(false)}>
        <Modal.Header>
          Share this view (<Kbd>Ctrl</Kbd> + <Kbd>Shift</Kbd> + <Kbd>S</Kbd>)
        </Modal.Header>

        <Modal.Body>
        </Modal.Body>
        <Modal.Footer>
          <Button color="gray" onClick={() => setOpenShareModal(false)}>Close</Button>
        </Modal.Footer>
      </Modal>

      <Modal show={openFilterModal} onClose={() => setOpenFilterModal(false)}>
        <Modal.Header>
          Bộ lọc
          {/*(<Kbd>Ctrl</Kbd> + <Kbd>Shift</Kbd> + <Kbd>F</Kbd>)*/}
        </Modal.Header>

        <Modal.Body>
          {renderFilters?.()}
        </Modal.Body>
        <Modal.Footer>
          <Button color="blue" onClick={() => {
            setOpenFilterModal(false);
            onFilterApply?.();
          }}>Áp dụng</Button>
          <Button color="gray" onClick={() => setOpenFilterModal(false)}>Đóng</Button>
        </Modal.Footer>
      </Modal>

      <Modal show={openTransModal} onClose={() => setOpenTransModal(false)}>
        <Modal.Header>
          Transfer data (<Kbd>Ctrl</Kbd> + <Kbd>Shift</Kbd> + <Kbd>T</Kbd>)
        </Modal.Header>

        <Modal.Body>
          <Tabs variant="pills">
            <Tabs.Item title="Export">
              <ListGroup>
                <ListGroup.Item>
                  <span className="h-10 flex items-center">
                    <span>As JSON</span>
                  </span>
                </ListGroup.Item>
                <ListGroup.Item>
                  <span className="h-10 flex items-center">
                    <span>As CSV</span>
                  </span>
                </ListGroup.Item>
                <ListGroup.Item>
                  <span className="h-10 flex items-center">
                    <span>As Excel</span>
                  </span>
                </ListGroup.Item>
              </ListGroup>
            </Tabs.Item>
            <Tabs.Item title="Import">
              <ListGroup>
                <ListGroup.Item>
                  <span className="h-10 flex items-center">
                    <span>From JSON</span>
                  </span>
                </ListGroup.Item>
                <ListGroup.Item>
                  <span className="h-10 flex items-center">
                    <span>From CSV</span>
                  </span>
                </ListGroup.Item>
                <ListGroup.Item>
                  <span className="h-10 flex items-center">
                    <span>From Excel</span>
                  </span>
                </ListGroup.Item>
              </ListGroup>
            </Tabs.Item>
          </Tabs>
        </Modal.Body>
        <Modal.Footer>
          <Button color="gray" onClick={() => setOpenTransModal(false)}>Close</Button>
        </Modal.Footer>
      </Modal>

      <Modal show={openSortModal} onClose={() => setOpenSortModal(false)}>
        <Modal.Header>
          Sắp xếp
        </Modal.Header>

        <Modal.Body>
          {/*{renderSortModal?.()}*/}
          <div className="flex gap-2 align-middle">
            <Label htmlFor={"sortBy"} value={"Sắp xếp theo"} style={{alignContent: "center"}}/>
            <Select
              id="sortBy"
              onChange={(e) => {
                if (!e.target.value) {
                  searchParams.delete("sortBy");
                  searchParams.delete("order");
                  return;
                }
                searchParams.set("sortBy", e.target.value);
              }}
              defaultValue={searchParams.get("sortBy") || ""}
            >
              <option value={""}>Mặc định</option>
              {presentationFields.map(field => (
                <option key={field.key} value={field.key}>{field.label}</option>
              ))}
            </Select>
            <Label htmlFor={"order"} value={"Thứ tự"} style={{alignContent: "center"}}/>
            <Select
              id="order"
              onChange={(e) => {
                if (!e.target.value) {
                  searchParams.delete("order");
                  searchParams.delete("sortBy");
                  return;
                }
                searchParams.set("order", e.target.value);
              }}
              defaultValue={searchParams.get("order") || ""}
            >
              <option value={""}>Mặc định</option>
              <option value="asc">Tăng dần</option>
              <option value="desc">Giảm dần</option>
            </Select>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button color="blue" onClick={() => {
            setOpenSortModal(false);
            // onSortApply?.();
            setSearchParams(searchParams);
          }}>Áp dụng</Button>
          <Button color="gray" onClick={() => setOpenSortModal(false)}>Đóng</Button>
        </Modal.Footer>
      </Modal>

      <Modal show={openCreateModal} onClose={() => setOpenCreateModal(false)}>
        <Modal.Header>
          Tạo mới
          {/*(<Kbd>Ctrl</Kbd> + <Kbd>Shift</Kbd> + <Kbd>N</Kbd>)*/}
        </Modal.Header>

        <Modal.Body>
          {CreatorModal && <CreatorModal/>}
        </Modal.Body>
        <Modal.Footer>
          <Button color="gray" onClick={() => setOpenCreateModal(false)}>Đóng</Button>
        </Modal.Footer>
      </Modal>

      <Modal show={openItemModal} onClose={() => setOpenItemModal(false)}>
        <Modal.Header>
          Item
        </Modal.Header>

        <Modal.Body>
          {ItemModal && selectedItem && <ItemModal item={selectedItem}/>}
        </Modal.Body>
        <Modal.Footer>
          <Button color="gray" onClick={() => setOpenItemModal(false)}>Đóng</Button>
        </Modal.Footer>
      </Modal>

    </>
  )
}