import React from 'react';
import ListView from '../comps/ListView';

const TEST_PRODUCTS = [
  // Generate some test data
  ...Array.from({ length: 100 }, (_, i) => (
    {
      name: `Product ${i + 1}`,
      price: 100,
      stock: 10,
      category: ["Category 1", "Category 2"],
      description: "Description 1",
      image: "https://via.placeholder.com/150",
    }))
]


export default function ProductsManager() {
  return (
    <div className="flex items-start justify-center h-full w-full">
      <ListView
        data={[...TEST_PRODUCTS]}
        currentPage={1}
        totalPages={100}
        onPageChange={() => { }}
        pagination={true}
        renderFilters={() => { }}
        onFilterApply={() => { }}
        renderCreator={() => { }}
        onItemSelect={() => { }}
        presntationFields={[
          { key: "name", label: "Name" },
          { key: "price", label: "Price" },
          { key: "stock", label: "Stock" },
          { key: "description", label: "Description" },
        ]}
        renderItemModal={(item) => {
            console.log(item)
        }}
      />
    </div>
  );
}