import React from "react";

export default function getFlag({lang}) {
  switch (lang) {
    case 'vi':
      return (<img src={"/vietnam.png"} className={"w-5 mr-2 cursor-pointer"}/>);
    case 'en':
      return (<img src={"/united-states.png"} className={"w-5 mr-2 cursor-pointer"}/>);
    case 'th':
      return (<img src={"/thailand.png"} className={"w-5 mr-2 cursor-pointer"}/>);
    default:
      return (<img src={"/globe-icon.svg"} className={"w-5 mr-2 cursor-pointer"}/>);
  }
}