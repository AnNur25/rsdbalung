import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";

import type { Route } from "./+types/root";
import "./app.css";
import axios from "axios";
import { Toaster } from "react-hot-toast";
import { useEffect, useState } from "react";
// import { GoogleReCaptchaProvider } from "@google-recaptcha/react";

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Rumah Sakit Daerah Balung</title>
        <Meta />
        <Links />
      </head>
      <body className="flex min-h-screen flex-col justify-between">
        {/* <GoogleReCaptchaProvider
          // explicit={{ badge: "bottomright" }}
          type="v2-checkbox"
          siteKey={import.meta.env.VITE_SITE_KEY}
          scriptProps={{
            async: true,
            defer: true,
            appendTo: "body",
          }}
        > */}
        {children}
        {/* </GoogleReCaptchaProvider> */}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  axios.defaults.headers.common["Content-Type"] = "application/json";
  axios.defaults.withCredentials = true;
  axios.defaults.baseURL = import.meta.env.VITE_API_URL;
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <>
      {isClient && (
        // <GoogleReCaptchaProvider
        //   explicit={{ badge: "bottomright" }}
        //   type="v2-invisible"
        //   siteKey={import.meta.env.VITE_SITE_KEY}
        //   scriptProps={{
        //     async: true,
        //     defer: true,
        //     appendTo: "body",
        //   }}
        //   onLoad={() => {
        //     console.log("reCAPTCHA script loaded!");
        //     // THIS IS FOR DIAGNOSTIC PURPOSES
        //     if (typeof (window as any).grecaptcha !== "undefined") {
        //       console.log("grecaptcha global object IS available.");
        //       if (typeof (window as any).grecaptcha.ready === "function") {
        //         (window as any).grecaptcha.ready(() => {
        //           console.log("grecaptcha.ready callback fired!");
        //           // Try to explicitly render a dummy widget here (for v2, even invisible)
        //           // This is a direct test of the client
        //           // It might throw if no client exists, but it will give more insight
        //           try {
        //             console.log("Dummy reCAPTCHA widget rendered with ID:");
        //             // Immediately expire it if not needed, or remove the div
        //             // (window as any).grecaptcha.reset(widgetId);
        //           } catch (e) {
        //             console.error("Error trying to render dummy widget:", e);
        //           }
        //         });
        //       } else {
        //         console.log("grecaptcha.ready function NOT available.");
        //       }
        //     } else {
        //       console.error(
        //         "grecaptcha global object is NOT available after script load.",
        //       );
        //     }
        //   }}
        // >
        <>
          <Toaster position="top-right" />
          <Outlet />
        </>
        // {/* </GoogleReCaptchaProvider> */}
      )}
    </>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="flex h-screen flex-col items-center justify-center gap-2 bg-dark-blue-900 p-4 text-white">
      <h1 className="text-4xl font-extrabold">{message}</h1>
      <p className="text-center">{details}</p>
      <a href="/" className="mt-4 rounded bg-white px-2 text-persian-blue-950">
        Home
      </a>

      {import.meta.env.DEV && (
        <p className="text-sm text-gray-400">Development Environment</p>
      )}

      {import.meta.env.DEV && stack && (
        <pre className="w-full overflow-x-auto p-4">
          <code>{stack}</code>
        </pre>
      )}

      {/* {stack && (
        <pre className="w-full overflow-x-auto p-4">
          <code>{stack}</code>
        </pre>
      )} */}
    </main>
  );
}
