import {useForm} from "react-hook-form";
import pushToast from "../helpers/sonnerToast.js";
import {useContext} from "react";
import AuthContext from "../contexts/AuthProvider.jsx";
import {useNavigate} from "react-router-dom";

export default function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm({
    mode: "onSubmit",
    reValidateMode: "onChange",
    resolver: undefined,
    criteriaMode: "firstError"
  })

  const onSubmit = (data) => {
    login(data).then((success) => {
      if (success) {
        pushToast("Đăng nhập thành công", "success");
        navigate("/admin");
      }
    });
  }

  const onError = (errors, e) => {
    Object.values(errors).reverse().forEach((error) => {
      pushToast(error.message, "error");
    });
  }

  return (
    <div className="h-screen w-screen bg-gray-50">
      <div className="min-h-screen flex items-center justify-center w-full dark:bg-gray-950">
        <div className="bg-white dark:bg-gray-900 shadow-md rounded-lg px-8 py-6 max-w-md min-w-96">
          <h1 className="text-2xl font-bold text-center mb-4 dark:text-gray-200 text-black">Đăng nhập</h1>
          <form onSubmit={handleSubmit(onSubmit, onError)} noValidate={true}>
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email
              </label>
              <input type="email" id="email"
                     className="shadow-sm rounded-md w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-black"
                     placeholder="your@email.com" required
                     {...register("email", { required: "Email không được để trống" })}
              />
            </div>
            <div className="mb-4">
              <label htmlFor="password"
                     className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Mật khẩu
              </label>
              <input type="password" id="password"
                     className="shadow-sm rounded-md w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-black"
                     placeholder="Enter your password" required
                     {...register("password", { required: "Mật khẩu không được để trống" })}
              />
              {/*<a href="#"*/}
              {/*   className="text-xs text-gray-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"*/}
              {/*>*/}
              {/*  Forgot Password?*/}
              {/*</a>*/}
            </div>
            <button type="submit"
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              Đăng nhập
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}