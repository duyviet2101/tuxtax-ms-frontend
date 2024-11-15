import { Card } from "flowbite-react";
import Chart from "react-apexcharts";

export default function AdminDashboard() {
  return (
    <div className="h-full w-full p-6 flex items-center overflow-scrool">
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 auto-rows-max w-full gap-2">
        <Card className="col-span-2 row-span-2">
          <div className="w-full h-full">
            <span className="text-xl font-bold">Income</span>
            <Chart
              options={{
                chart: {
                  id: "basic-bar"
                },
                xaxis: {
                  categories: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun", "Mon"]
                }
              }}
              series={[
                {
                  name: "series-1",
                  data: [30, 40, 45, 50, 49, 60, 70, 91]
                }
              ]}
              type="bar"
              width="100%"
              height="100%"
            />
          </div>
        </Card>

        <Card className="col-span-2 row-span-2">
          <div className="w-full h-full">
            <span className="text-xl font-bold">Orders</span>
            <Chart
              options={{
                chart: {
                  id: "basic-bar"
                },
                xaxis: {
                  categories: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun", "Mon"]
                }
              }}
              series={[
                {
                  name: "series-1",
                  data: [30, 40, 45, 50, 49, 60, 70, 91]
                }
              ]}
              type="line"
              width="100%"
              height="100%"
            />
          </div>
        </Card>

        <Card className="col-span-4 row-span-2">
          <div className="w-full h-full">
            <span className="text-xl font-bold">Customers</span>
            <Chart
              options={{
                chart: {
                  id: "basic-bar"
                },
                xaxis: {
                  categories: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun", "Mon"]
                }
              }}
              series={[
                {
                  name: "series-1",
                  data: [30, 40, 45, 50, 49, 60, 70, 91]
                }
              ]}
              type="bar"
              width="100%"
              height="100%"
            />
          </div>
        </Card>
      </div>
    </div>
  )
}