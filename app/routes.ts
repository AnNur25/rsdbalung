import {
  type RouteConfig,
  index,
  layout,
  prefix,
  route,
} from "@react-router/dev/routes";

export default [
  // Public routes
  layout("routes/layout.tsx", [
    route("test", "routes/test.tsx"),
    route("api/v1", "routes/testoauth.tsx"),
    index("routes/home.tsx"),
    route("profile", "routes/profile.tsx"),
    route("berita/", "routes/news.tsx"),
    route("dokter", "routes/doctors.tsx"),
    route("dokter/:id", "routes/doctor-detail.tsx"),
    route("jadwal-dokter", "routes/schedule.tsx"),
    route("berita/:id", "routes/news-detail.tsx"),
    route("pelayanan/:id", "routes/layanan-detail.tsx"),
    route("aduan", "routes/complaint.tsx"),
  ]),
  route("reset-password", "routes/admin/reset.tsx"),

  // Admin routes
  ...prefix("humasbalung", [ //humasbalung/login
    route("login", "routes/admin/login.tsx"),
    route("logout", "routes/admin/logout.tsx"),
    layout("routes/admin/layout.tsx", [
      index("routes/admin/index.tsx"),
      route("home", "routes/admin/home.tsx"),
      ...prefix("akun", [index("routes/admin/account/index.tsx")]),
      ...prefix("berita", [
        index("routes/admin/news/index.tsx"),
        // route("detail/:id", "routes/admin/news/detail.tsx"),
        route("create", "routes/admin/news/create.tsx"),
        route("edit/:id", "routes/admin/news/edit.tsx"),
        route("galeri/:id", "routes/admin/news/gallery.tsx"),
      ]),
      ...prefix("pelayanan", [
        index("routes/admin/services/index.tsx"),
        // route("detail/:id", "routes/admin/services/detail.tsx"),
        route("create", "routes/admin/services/create.tsx"),
        route("edit/:id", "routes/admin/services/edit.tsx"),
      ]),
      ...prefix("dokter", [
        index("routes/admin/doctors/index.tsx"),
        // route("detail/:id", "routes/admin/doctors/detail.tsx"),
        route("create", "routes/admin/doctors/create.tsx"),
        route("edit/:id", "routes/admin/doctors/edit.tsx"),
      ]),
      ...prefix("poli", [
        index("routes/admin/poli/index.tsx"),
        // route("detail/:id", "routes/admin/poli/detail.tsx"),
        route("create", "routes/admin/poli/create.tsx"),
        route("edit/:id", "routes/admin/poli/edit.tsx"),
      ]),
      ...prefix("jadwal-dokter", [
        index("routes/admin/schedule/index.tsx"),
        route("create", "routes/admin/schedule/create.tsx"),
        route("edit/:id", "routes/admin/schedule/edit.tsx"),
      ]),
      ...prefix("aduan", [
        index("routes/admin/complaints/index.tsx"),
        // route("create", "routes/admin/complaints/create.tsx"),
        // route("edit/:id", "routes/admin/complaints/edit.tsx"),
      ]),
    ]),
  ]),
] satisfies RouteConfig;

// npm i @react-router/fs-routes

// import { type RouteConfig, route } from '@react-router/dev/routes';
// import { flatRoutes } from '@react-router/fs-routes';

// export default [
//   route('/', './home.tsx'),

//   ...(await flatRoutes()),
// ] satisfies RouteConfig;
