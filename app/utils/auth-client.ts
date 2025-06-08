import axios, { type AxiosInstance } from "axios";

const API_URL = import.meta.env.VITE_API_URL;

let isRefreshing = false;
let failedQueue: {
  resolve: (value: any) => void;
  reject: (reason?: any) => void;
}[] = [];

// function processQueue(error: any, tokenRefreshed: boolean) {
//   failedQueue.forEach(({ resolve, reject }) => {
//     if (tokenRefreshed) {
//       resolve(tokenRefreshed); // will retry original request
//     } else {
//       reject(error);
//     }
//   });
//   failedQueue = [];
// }
const processQueue = (error: any) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(undefined); // No need to pass token, as browser handles cookie
    }
  });
  failedQueue = [];
};
export async function createAuthenticatedClient(
  request: Request,
): Promise<AxiosInstance> {
  const client = axios.create({
    baseURL: API_URL,
    headers: {
      Cookie: request.headers.get("cookie") ?? "", // Forward cookies (server side only)
    },
    withCredentials: true,
  })

  // client.interceptors.response.use(
  //   (res) => res,
  //   async (err) => {
  //     const originalRequest = err.config;

  //     if (err.response?.status === 401 && !originalRequest._retry) {
  //       originalRequest._retry = true;

  //       if (isRefreshing) {
  //         return new Promise((resolve, reject) => {
  //           failedQueue.push({
  //             resolve: () => resolve(client(originalRequest)),
  //             reject: (error) => reject(error),
  //           });
  //         });
  //       }

  //       isRefreshing = true;

  //       try {

  //         const response = await client.post("/auth/refresh-token");
  //         // Assuming the response contains a new access token
  //         const newAccessToken = response.data.accessToken; // Adjust based on your API response structure
  //         if (newAccessToken) {
  //           // Set the new access token in the cookie header for subsequent requests
  //           client.defaults.headers.Cookie = `aksesToken=${newAccessToken}; Path=/; HttpOnly`;
  //           // Also update the original request's cookie header if present
  //           if (originalRequest.headers) {
  //             originalRequest.headers['Cookie'] = `aksesToken=${newAccessToken}; Path=/; HttpOnly`;
  //           }
  //         }
  //         processQueue(null, true);
  //         return client(originalRequest);
  //       } catch (refreshErr) {
  //         processQueue(refreshErr, false);
  //         return Promise.reject(refreshErr);
  //       } finally {
  //         isRefreshing = false;
  //       }
  //     }

  //     return Promise.reject(err);
  //   }
  // );

  // client.interceptors.response.use(
  //   (res) => res,
  //   async (err) => {
  //     const originalRequest = err.config;

  //     // Prevent infinite retry loop
  //     if (err.response?.status === 401 && !originalRequest._retry) {
  //       originalRequest._retry = true;

  //       if (isRefreshing) {
  //         // Wait for the refresh to complete
  //         return new Promise((resolve, reject) => {
  //           failedQueue.push({
  //             resolve: () => resolve(client(originalRequest)),
  //             reject: (error) => reject(error),
  //           });
  //         });
  //       }

  //       isRefreshing = true;

  //       try {
  //         await client.post("/auth/refresh-token"); // expects HttpOnly cookie

  //         processQueue(null, true);
  //         return client(originalRequest); // retry original request
  //       } catch (refreshErr) {
  //         processQueue(refreshErr, false);
  //         return Promise.reject(refreshErr);
  //       } finally {
  //         isRefreshing = false;
  //       }
  //     }

  //     return Promise.reject(err);
  //   },
  // );

  // client.interceptors.response.use(
  //   (response) => response,
  //   async (error) => {
  //     const originalRequest = error.config;

  //     // If the error is 401 (Unauthorized) and it's not the refresh token endpoint itself
  //     if (error.response.status === 401 && !originalRequest._retry) {
  //       originalRequest._retry = true; // Mark the request to prevent infinite loops

  //       if (isRefreshing) {
  //         // If a token refresh is already in progress, queue the original request
  //         return new Promise((resolve, reject) => {
  //           failedQueue.push({ resolve, reject });
  //         })
  //           .then(() => {
  //             // No need to set header; browser will send the new cookie
  //             return client(originalRequest);
  //           })
  //           .catch((err) => {
  //             return Promise.reject(err);
  //           });
  //       }

  //       isRefreshing = true; // Set flag to indicate refresh is in progress

  //       try {
  //         // Make a request to your refresh token endpoint
  //         // This request will automatically send the HttpOnly refresh token cookie
  //         // The server will set a new HttpOnly access token cookie (and refresh token cookie)
  //         await axios.post(
  //           `${import.meta.env.VITE_API_URL}/auth/refresh-token`,
  //           {},
  //           { withCredentials: true },
  //         ); // Ensure cookies are sent

  //         isRefreshing = false; // Reset refresh flag
  //         processQueue(null); // Resolve all queued requests (they will automatically pick up the new cookie)

  //         return client(originalRequest); // Retry the original request
  //       } catch (refreshError) {
  //         isRefreshing = false; // Reset refresh flag
  //         processQueue(refreshError); // Reject all queued requests

  //         // If refresh token fails (e.g., it's also expired or revoked),
  //         // redirect to login page.
  //         console.error("Refresh token failed:", refreshError);
  //         // Example: Redirect to login
  //         window.location.href = "/login";
  //         return Promise.reject(refreshError);
  //       }
  //     }

  //     return Promise.reject(error);
  //   },
  // );
  return client;
}
