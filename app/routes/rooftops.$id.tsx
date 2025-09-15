import type { Route } from "./+types/rooftops.$id";
import { useLoaderData, Link, useNavigate } from "react-router";
import { Button } from "../components/Button";
import { DataTable } from "../components/DataTable";
import { api } from "../lib/api";
import type { Vehicle, Rooftop } from "../lib/api";

export async function loader({ params }: Route.LoaderArgs) {
  try {
    const rooftopId = parseInt(params.id);
    const [rooftop, allVehicles] = await Promise.all([
      api.getRooftop(rooftopId),
      api.getVehicles(),
    ]);
    
    // Filter vehicles for this rooftop
    const vehicles = allVehicles.filter(vehicle => vehicle.rooftop_id === rooftopId);
    
    return { rooftop, vehicles };
  } catch (error) {
    throw new Response("Rooftop not found", { status: 404 });
  }
}

export default function RooftopDetails({ params }: Route.ComponentProps) {
  const { rooftop, vehicles } = useLoaderData<typeof loader>();
  console.log("Rooftop Data:", rooftop);
  const navigate = useNavigate();

  const columns = [
    { key: 'id' as keyof Vehicle, header: 'ID', sortable: true },
    { key: 'make' as keyof Vehicle, header: 'Make', sortable: true },
    { key: 'model' as keyof Vehicle, header: 'Model', sortable: true },
    { key: 'trim' as keyof Vehicle, header: 'Trim', sortable: true },
    { key: 'year' as keyof Vehicle, header: 'Year', sortable: true },
    { key: 'veh_listing_type' as keyof Vehicle, header: 'Type', sortable: true },
    // { key: 'body_type' as keyof Vehicle, header: 'Body Type', sortable: true },
    // { key: 'ext_color' as keyof Vehicle, header: 'Color', sortable: true },
  ];

  const actions = [
    {
      label: 'View',
      onClick: (vehicle: Vehicle) => navigate(`/vehicles/${vehicle.id}`),
      className: 'bg-blue-600 text-white hover:bg-blue-700',
    },
    {
      label: 'Edit',
      onClick: (vehicle: Vehicle) => navigate(`/vehicles/${vehicle.id}/edit`),
      className: 'bg-green-600 text-white hover:bg-green-700',
    },
    {
      label: 'Delete',
      onClick: (vehicle: Vehicle) => navigate(`/vehicles/${vehicle.id}/delete`),
      className: 'bg-red-600 text-white hover:bg-red-700',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-4">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => navigate('/')}
            >
              ← Back to Listings
            </Button>
            <h1 className="text-3xl font-bold text-gray-900">{rooftop.name}</h1>
          </div>
          <Link to="/vehicles/create">
            <Button variant="primary" size="sm">
              + Add New Vehicle
            </Button>
          </Link>
        </div>

        {/* Rooftop Info Card */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <dt className="text-sm font-medium text-gray-500">Rooftop ID</dt>
              <dd className="mt-1 text-lg text-gray-900">{rooftop.id}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Rooftop Name</dt>
              <dd className="mt-1 text-lg text-gray-900">{rooftop.name}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Street</dt>
              <dd className="mt-1 text-lg text-gray-900">{rooftop.street}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">City</dt>
              <dd className="mt-1 text-lg text-gray-900">{rooftop.city}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">State</dt>
              <dd className="mt-1 text-lg text-gray-900">{rooftop.state}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Phone</dt>
              <dd className="mt-1 text-lg text-gray-900">{rooftop.phone}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Email</dt>
              <dd className="mt-1 text-lg text-gray-900">{rooftop.email}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Total Vehicles</dt>
              <dd className="mt-1 text-lg text-gray-900">{vehicles.length}</dd>
            </div>
          </div>
        </div>

        {/* Vehicles Table */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Vehicles at {rooftop.name}
          </h2>
          
          <DataTable
            data={vehicles}
            columns={columns}
            actions={actions}
            searchable
            searchPlaceholder="Search vehicles at this rooftop..."
            itemsPerPage={10}
          />
          
          {vehicles.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No vehicles found at this rooftop.</p>
              <Link to="/vehicles/create" className="mt-4 inline-block">
                <Button variant="primary">
                  Add First Vehicle
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
