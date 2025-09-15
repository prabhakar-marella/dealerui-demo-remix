export function loader({ request }: any) {
  const url = new URL(request.url);
  const path = url.pathname || "";

  if (path.startsWith("/.well-known/")) {
    return new Response(JSON.stringify({}), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }
  return new Response(JSON.stringify({ message: "Not Found" }), {
    status: 404,
    headers: { "Content-Type": "application/json" },
  });
}

export default function NotFound() {
  return (
    <div style={{ padding: 36 }}>
      <h2>404 — Page not found</h2>
      <p>The route you requested could not be found on the server.</p>
    </div>
  );
}