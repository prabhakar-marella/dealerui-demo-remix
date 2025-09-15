import type { Route } from "./+types/home";
import { useLoaderData, Link, useNavigate } from "react-router";
import { useState, useEffect } from "react";
import { DataTable } from "../components/DataTable";
import { Button } from "../components/Button";
import { api } from "../lib/api";
import type { Vehicle, Rooftop } from "../lib/api";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Vehicle Listings - Dealer UI" },
    { name: "description", content: "Browse and manage vehicle inventory" },
  ];
}

export async function loader() {
  try {
    const [vehicles, rooftops] = await Promise.all([
      api.getVehicles(),
      api.getRooftops(),
    ]);
    return { vehicles, rooftops };
  } catch (error) {
    // Return empty arrays if API is not available
    return { vehicles: [], rooftops: [] };
  }
}

export default function Home() {
  const { vehicles: initialVehicles, rooftops } = useLoaderData<typeof loader>();
  const [vehicles, setVehicles] = useState<Vehicle[]>(initialVehicles);
  const [selectedRooftopId, setSelectedRooftopId] = useState<number | null>(null);
  const navigate = useNavigate();

  // Filter vehicles by selected rooftop
  const filteredVehicles = selectedRooftopId
    ? vehicles.filter(vehicle => vehicle.rooftop_id === selectedRooftopId)
    : vehicles;

  // Get rooftop name by ID
  const getRooftopName = (rooftopId: number) => {
    const rooftop = rooftops.find(r => r.id === rooftopId);
    return rooftop ? rooftop.name : `Rooftop ${rooftopId}`;
  };

  const columns = [
    { key: 'id' as keyof Vehicle, header: 'ID', sortable: true },
    { key: 'make' as keyof Vehicle, header: 'Make', sortable: true },
    { key: 'model' as keyof Vehicle, header: 'Model', sortable: true },
    { key: 'trim' as keyof Vehicle, header: 'Trim', sortable: true },
    { key: 'year' as keyof Vehicle, header: 'Year', sortable: true },
    { key: 'veh_listing_type' as keyof Vehicle, header: 'Type', sortable: true },
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
      <div className="container mx-auto px-2 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Vehicle Listings</h1>
          <Link to="/vehicles/create">
            <Button variant="primary" size="sm">
              + Add New Vehicle
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* Left Sidebar - Rooftops */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-2">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Rooftops</h2>
              <div className="space-y-2">
                <button
                  onClick={() => setSelectedRooftopId(null)}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-colors text-sm ${
                    selectedRooftopId === null
                      ? 'bg-blue-100 text-blue-800'
                      : 'text-gray-600 hover:bg-gray-100 cursor-pointer'
                  }`}
                >
                  All ({vehicles.length})
                </button>
                {rooftops.map((rooftop) => {
                  const count = vehicles.filter(v => v.rooftop_id === rooftop.id).length;
                  return (
                    <button
                      key={rooftop.id}
                      onClick={() => setSelectedRooftopId(rooftop.id)}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-colors text-sm ${
                        selectedRooftopId === rooftop.id
                          ? 'bg-blue-100 text-blue-800'
                          : 'text-gray-600 hover:bg-gray-100 cursor-pointer'
                      }`}
                    >
                      {rooftop.name} ({count})
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Content - Vehicle Table */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-md p-6">
              <DataTable
                data={filteredVehicles}
                columns={columns}
                actions={actions}
                searchable
                searchPlaceholder="Search vehicles..."
                itemsPerPage={10}
              />
              
              {filteredVehicles.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">No vehicles found.</p>
                  {selectedRooftopId && (
                    <p className="text-gray-400 text-sm mt-2">
                      Try selecting a different rooftop or clearing the filter.
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
