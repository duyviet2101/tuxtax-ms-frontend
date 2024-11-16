import {toast} from "sonner";
import errorsExplain from "../constants/errorsExplain.js";

function pushToast(message, type = "success") {
  if (errorsExplain[message]) {
    message = errorsExplain[message];
  }
  toast[type](message);
}

export default pushToast;