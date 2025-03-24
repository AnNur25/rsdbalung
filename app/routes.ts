import {
  type RouteConfig,
  index,
  prefix,
  route,
} from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  ...prefix("admin", [
    route("login", "routes/admin/login.tsx"),
    route("dokter", "routes/admin/home.tsx"),
  ]),
  route("profile", "routes/profile.tsx"),
  route("berita/:id", "routes/news.tsx"),
] satisfies RouteConfig;

// npm i @react-router/fs-routes

// import { type RouteConfig, route } from '@react-router/dev/routes';
// import { flatRoutes } from '@react-router/fs-routes';

// export default [
//   route('/', './home.tsx'),

//   ...(await flatRoutes()),
// ] satisfies RouteConfig;
