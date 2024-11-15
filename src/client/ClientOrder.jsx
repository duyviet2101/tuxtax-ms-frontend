import { Banner, Button, Card, Carousel, Modal, ModalBody, ModalFooter, ModalHeader, Navbar, NavbarBrand, NavbarCollapse, NavbarLink, NavbarToggle, Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow } from "flowbite-react";
import React from "react";
import { HiShoppingCart } from "react-icons/hi";
import { Link } from "react-router-dom";

function ProductCard({ name, price, image }) {
  return (
    <Card
      imgAlt="Meaningful alt text for an image that is not purely decorative"
      imgSrc={image}
    >
      <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
        {name}
      </h5>
      <p className="font-normal text-gray-700 dark:text-gray-400">
        {price}
      </p>
    </Card>
  );
}

export default function ClientOrder() {
  const [showModal, setShowModal] = React.useState(false);

  return (
    <div className="w-screen h-screen bg-gray-200 overflow-auto">
      <Navbar fluid rounded>
        <NavbarBrand as={Link} href="https://flowbite-react.com">
          <span className="text-xl font-bold text-blue-500">Order Page</span>
        </NavbarBrand>
        <Button onClick={() => setShowModal(true)}>
          <HiShoppingCart className="mr-2 h-5 w-5" />
          Cart
        </Button>
      </Navbar>

      <div className="h-56 sm:h-64 xl:h-80 2xl:h-96">
        <Carousel>
          <img src="https://flowbite.com/docs/images/carousel/carousel-1.svg" alt="..." />
          <img src="https://flowbite.com/docs/images/carousel/carousel-2.svg" alt="..." />
          <img src="https://flowbite.com/docs/images/carousel/carousel-3.svg" alt="..." />
          <img src="https://flowbite.com/docs/images/carousel/carousel-4.svg" alt="..." />
          <img src="https://flowbite.com/docs/images/carousel/carousel-5.svg" alt="..." />
        </Carousel>
      </div>

      <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <ProductCard name="Dish 1" price="10$" image="/banhmi.jpg" />
        <ProductCard name="Dish 1" price="10$" image="/banhmi.jpg" />
        <ProductCard name="Dish 1" price="10$" image="/banhmi.jpg" />
        <ProductCard name="Dish 1" price="10$" image="/banhmi.jpg" />
        <ProductCard name="Dish 1" price="10$" image="/banhmi.jpg" />
      </div>

      <Button onClick={() => setShowModal(true)} className="fixed bottom-4 right-4">
        <HiShoppingCart className="mr-2 h-5 w-5" />
        Cart
      </Button>

      <Modal show={showModal} onClose={() => setShowModal(false)}>
        <ModalHeader> Cart </ModalHeader>
        <ModalBody>
          <Table>
            <TableHead>
              <TableHeadCell>STT</TableHeadCell>
              <TableHeadCell>Product</TableHeadCell>
              <TableHeadCell>Price</TableHeadCell>
              <TableHeadCell>Quantity</TableHeadCell>
            </TableHead>

            <TableBody>
              <TableRow>
                <TableCell> 1 </TableCell>
                <TableCell> Dish 1 </TableCell>
                <TableCell> 10$ </TableCell>
                <TableCell> 2 </TableCell>
              </TableRow>

              <TableRow>
                <TableCell> 2 </TableCell>
                <TableCell> Dish 2 </TableCell>
                <TableCell> 20$ </TableCell>
                <TableCell> 3 </TableCell>
              </TableRow>

              <TableRow>
                <TableCell> 3 </TableCell>
                <TableCell> Dish 3 </TableCell>
                <TableCell> 30$ </TableCell>
                <TableCell> 1 </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </ModalBody>
        <ModalFooter>
          <Button onClick={() => setShowModal(false)}>Close</Button>
          <Button color="failure">
            <HiShoppingCart className="mr-2 h-5 w-5" />
            Order now
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}