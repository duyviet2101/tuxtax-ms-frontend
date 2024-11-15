import ListView from "../comps/ListView";
import { faker } from "@faker-js/faker";

const TEST_USERDATA = [
  ...Array.from({ length: 1000 }, (_, i) => ({
    customer: faker.person.firstName() + " " + faker.person.lastName(),
    email: faker.internet.email(),
    phone: "00000000",
    address: faker.location.streetAddress(),
  })),
]

export default function AdminOrders() {
  return (
    <div className="flex items-start justify-center h-full w-full">
      <ListView
        data={[...TEST_USERDATA]}
        currentPage={1}
        totalPages={100}
        onPageChange={() => { }}
        pagination={true}
        renderFilters={() => { }}
        onFilterApply={() => { }}
        renderCreator={() => { }}
        onItemSelect={() => { }}
        presntationFields={[
          {
            key: "customer",
            label: "Customer"
          },
          {
            key: "email",
            label: "Email"
          },
          {
            key: "phone",
            label: "Phone"
          },
          {
            key: "address",
            label: "Address"
          }
        ]}
        renderItemModal={() => { }}
      />
    </div>
  )
}