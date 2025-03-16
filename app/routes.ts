import { type RouteConfig, index } from "@react-router/dev/routes";

export default [index("routes/home.tsx")] satisfies RouteConfig;

// npm i @react-router/fs-routes

// import { type RouteConfig, route } from '@react-router/dev/routes';
// import { flatRoutes } from '@react-router/fs-routes';

// export default [
//   route('/', './home.tsx'),

//   ...(await flatRoutes()),
// ] satisfies RouteConfig;
