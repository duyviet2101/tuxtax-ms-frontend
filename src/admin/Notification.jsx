import { Accordion, Alert } from "flowbite-react";

export default function AdminNotification() {
  return (
    <div className="h-full w-full p-6 overflow-scrool">
      <div className="grid grid-cols-1 auto-rows-max w-full gap-2">
        <Alert color="blue" className="col-span-1">
          <span className="text-xl font-bold">Notifications</span>
          <p>Notifications and alerts</p>
        </Alert>
        <Alert color="blue" className="col-span-1">
          <span className="text-xl font-bold">Notifications</span>
          <p>Notifications and alerts</p>
        </Alert>
        <Alert color="blue" className="col-span-1">
          <span className="text-xl font-bold">Notifications</span>
          <p>Notifications and alerts</p>
        </Alert>
        <Alert color="blue" className="col-span-1">
          <span className="text-xl font-bold">Notifications</span>
          <p>Notifications and alerts</p>
        </Alert>
        <Alert color="blue" className="col-span-1">
          <span className="text-xl font-bold">Notifications</span>
          <p>Notifications and alerts</p>
        </Alert>
        <Alert color="red" className="col-span-1">
          <span className="text-xl font-bold">Notifications</span>
          <p>Notifications and alerts</p>
        </Alert>
      </div>
    </div>
  )
}