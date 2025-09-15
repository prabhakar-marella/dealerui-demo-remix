import type { Route } from "./+types/vehicles.$id.delete";
import { useLoaderData, useNavigate, redirect } from "react-router";
import { useState } from "react";
import { Button } from "../components/Button";
import { api } from "../lib/api";
import type { Vehicle, Rooftop } from "../lib/api";

export async function loader({ params }: Route.LoaderArgs) {
  try {
    const vehicleId = parseInt(params.id);
    const [vehicle, rooftops] = await Promise.all([
      api.getVehicle(vehicleId),
      api.getRooftops(),
    ]);
    return { vehicle, rooftops };
  } catch (error) {
    throw new Response("Vehicle not found", { status: 404 });
  }
}

export async function action({ params }: Route.ActionArgs) {
  const vehicleId = parseInt(params.id);
  
  try {
    await api.deleteVehicle(vehicleId);
    return redirect('/');
  } catch (error) {
    return {
      error: 'Failed to delete vehicle. Please try again.',
    };
  }
}

export default function DeleteVehicle({ params }: Route.ComponentProps) {
  const { vehicle, rooftops } = useLoaderData<typeof loader>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get rooftop name
  const rooftop = rooftops.find(r => r.id === vehicle.rooftop_id);
  const rooftopName = rooftop ? rooftop.name : `Rooftop ${vehicle.rooftop_id}`;

  const handleDelete = async () => {
    setLoading(true);
    setError(null);
    
    try {
      await api.deleteVehicle(vehicle.id);
      navigate('/');
    } catch (err) {
      setError('Failed to delete vehicle. Please try again.');
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate(`/vehicles/${vehicle.id}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-8">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => navigate(`/vehicles/${vehicle.id}`)}
          >
            ← Back to Vehicle
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Delete Vehicle</h1>
        </div>

        {/* Confirmation Card */}
        <div className="bg-white rounded-lg shadow-md p-8 max-w-2xl mx-auto">
          {error && (
            <div className="mb-6 p-4 bg-red-100 border border-red-300 text-red-700 rounded-lg">
              {error}
            </div>
          )}
          
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-full bg-red-100">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Are you sure?</h2>
            <p className="text-gray-600 mb-6">
              This action cannot be undone. The vehicle will be permanently removed from the system.
            </p>
          </div>

          {/* Vehicle Details */}
          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <h3 className="font-semibold text-gray-900 mb-4">Vehicle to be deleted:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-500">Vehicle:</span>
                <span className="ml-2 text-gray-900">
                  {vehicle.year} {vehicle.make} {vehicle.model} {vehicle.trim}
                </span>
              </div>
              <div>
                <span className="font-medium text-gray-500">ID:</span>
                <span className="ml-2 text-gray-900">{vehicle.id}</span>
              </div>
              <div>
                <span className="font-medium text-gray-500">Type:</span>
                <span className="ml-2">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    vehicle.veh_listing_type === 'New' 
                      ? 'bg-green-100 text-green-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {vehicle.veh_listing_type}
                  </span>
                </span>
              </div>
              <div>
                <span className="font-medium text-gray-500">Rooftop:</span>
                <span className="ml-2 text-gray-900">{rooftopName}</span>
              </div>
              <div>
                <span className="font-medium text-gray-500">Body Type:</span>
                <span className="ml-2 text-gray-900">{vehicle.body_type}</span>
              </div>
              <div>
                <span className="font-medium text-gray-500">Color:</span>
                <span className="ml-2 text-gray-900">{vehicle.ext_color}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center space-x-4">
            <Button
              variant="secondary"
              size="lg"
              onClick={handleCancel}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              size="lg"
              onClick={handleDelete}
              disabled={loading}
            >
              {loading ? 'Deleting...' : 'Delete Vehicle'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
