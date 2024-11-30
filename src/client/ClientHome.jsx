import {Button, Dropdown} from "flowbite-react";
import {Link} from "react-router-dom";
import {useTranslation} from "react-i18next";
import getFlag from "../helpers/getFlag.jsx";
import React from "react";

export default function ClientHome() {
  const { t, i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  }

  return (
    <div className="w-screen h-screen max-h-svh bg-gray-200 overflow-auto text-gray-800 relative">
      <div className={"h-full max-h-dvh flex justify-center items-center"}>
        <div className={"h-full w-full flex items-center justify-center"}>
          <div className={"border pt-16 p-8 rounded-lg relative flex flex-col gap-2 shadow-xl bg-white"}>
            <div className={"h-32 w-32 absolute top-0 -translate-x-1/2 -translate-y-1/2 left-1/2"}>
              <img src={"/Logo-tuxtax.png"}
                   className={"h-full w-full rounded-full object-contain border-gray-400 border-2"}
                   alt={"Logo tuxtax"}/>
            </div>
            <h1 className="text-center text-3xl font-bold">TUXTAX ẨM THỰC THÁI LAN</h1>
            <h2 className="text-center text-xl font-medium">17B Hàn Thuyên, Hai Bà Trưng, Hà Nội</h2>
            <h2 className="text-center text-xl font-semibold">Hotline: 0963607229</h2>
            <h2 className="text-center text-3xl font-semibold mt-8">{t('pleaseSelectTable')}</h2>
            <p className="text-center text-lg font-medium">(Dev purpose only:)</p>
            <Button color={"failure"} as={Link} to={"/67357d2583f80f347300ba5d"}>
              Bàn bất kì
            </Button>
          </div>
        </div>
      </div>

      <div className={"absolute right-0 bottom-0 m-4"}>
        <Dropdown
          placement={"top"}
          label={getFlag({lang: i18n.language})}
        >
          <Dropdown.Item onClick={() => changeLanguage('vi')} className={"flex justify-start items-center cursor-pointer"}>
            <img src={"/vietnam.png"} className={"w-5 mr-2"}/>
            VI
          </Dropdown.Item>
          <Dropdown.Item onClick={() => changeLanguage('en')} className={"flex justify-start items-center cursor-pointer"}>
            <img src={"/united-states.png"} className={"w-5 mr-2"}/>
            EN
          </Dropdown.Item>
          <Dropdown.Item onClick={() => changeLanguage('th')} className={"flex justify-start items-center cursor-pointer"}>
            <img src={"/thailand.png"} className={"w-5 mr-2"}/>
            TH
          </Dropdown.Item>
        </Dropdown>
      </div>
    </div>
  );
}