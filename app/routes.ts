import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("reservation/:id", "routes/reservation.tsx"),
  route("minha-reserva/:token", "routes/my-reservation.tsx")
] satisfies RouteConfig;
