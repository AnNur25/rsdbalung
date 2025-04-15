import loginImage from "~/assets/loginimage.jpg";

export default function LoginAdmin() {
  return (
    <>
      <div className="flex min-h-screen items-center justify-center">
        <div
          className="hidden h-[100vh] bg-cover bg-center py-10 text-center text-white shadow-md lg:block lg:w-1/4"
          style={{
            backgroundImage: `url(${loginImage})`,
            // backgroundColor: "rgba(0, 0, 0, 0.5)",
            // backgroundBlendMode: "darken",
          }}
        ></div>
        <div className="mt-12 flex w-min flex-1 flex-col justify-center px-6 pt-8 pb-12 lg:px-8">
          <h2 className="text-center text-2xl font-bold tracking-tight text-gray-900">
            Halo
          </h2>
          <p className="text-center text-sm text-gray-600">Selamat datang</p>

          <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
            <form action="#" method="POST" className="space-y-6">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm/6 font-medium text-gray-900"
                >
                  Email
                </label>
                <div className="mt-2">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    // required
                    autoComplete="email"
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600 sm:text-sm/6"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="block text-sm/6 font-medium text-gray-900"
                  >
                    Password
                  </label>
                  <div className="text-sm">
                    <a
                      href="#"
                      className="font-semibold text-blue-600 hover:text-blue-500"
                    >
                      Lupa password?
                    </a>
                  </div>
                </div>
                <div className="mt-2">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    // required
                    autoComplete="current-password"
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600 sm:text-sm/6"
                  />
                </div>
              </div>

              <div></div>
            </form>
            <a href="/admin/">
              <button
                type="button"
                className="flex w-full justify-center rounded-md bg-blue-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-blue-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
              >
                Masuk
              </button>
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
