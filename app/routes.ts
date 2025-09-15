import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  // Home/Vehicle listing page
  index("routes/home.tsx"),
  
  // Vehicle routes
  route("/vehicles/create", "routes/vehicles.create.tsx"),
  route("/vehicles/:id", "routes/vehicles.$id.tsx"),
  route("/vehicles/:id/edit", "routes/vehicles.$id.edit.tsx"),
  route("/vehicles/:id/delete", "routes/vehicles.$id.delete.tsx"),
  
  // Rooftop routes
  route("/rooftops/:id", "routes/rooftops.$id.tsx"),
] satisfies RouteConfig;
