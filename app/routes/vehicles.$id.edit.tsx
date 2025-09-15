import type { Route } from "./+types/vehicles.$id.edit";
import { useLoaderData, useNavigate, redirect } from "react-router";
import { useState } from "react";
import { VehicleForm } from "../components/VehicleForm";
import { Button } from "../components/Button";
import { api } from "../lib/api";
import type { Vehicle } from "../lib/api";

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

export async function action({ request, params }: Route.ActionArgs) {
  if (request.method !== 'PUT') {
    throw new Response('Method not allowed', { status: 405 });
  }

  const vehicleId = parseInt(params.id);
  const formData = await request.formData();
  const vehicleData = Object.fromEntries(formData);

  try {
    await api.updateVehicle(vehicleId, {
      make: vehicleData.make as string,
      model: vehicleData.model as string,
      trim: vehicleData.trim as string,
      year: parseInt(vehicleData.year as string),
      veh_listing_type: vehicleData.veh_listing_type as 'Used' | 'New',
      body_type: vehicleData.body_type as string,
      ext_color: vehicleData.ext_color as string,
      rooftop_id: parseInt(vehicleData.rooftop_id as string),
    });
    
    return redirect(`/vehicles/${vehicleId}`);
  } catch (error) {
    return {
      error: 'Failed to update vehicle. Please try again.',
    };
  }
}

export default function EditVehicle({ params }: Route.ComponentProps) {
  const { vehicle, rooftops } = useLoaderData<typeof loader>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async (vehicleData: Omit<Vehicle, 'id'>) => {
    setLoading(true);
    setError(null);
    
    try {
      await api.updateVehicle(vehicle.id, vehicleData);
      navigate(`/vehicles/${vehicle.id}`);
    } catch (err) {
      setError('Failed to update vehicle. Please try again.');
      throw err;
    } finally {
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
          <h1 className="text-3xl font-bold text-gray-900">
            Edit {vehicle.year} {vehicle.make} {vehicle.model}
          </h1>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-lg shadow-md p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-100 border border-red-300 text-red-700 rounded-lg">
              {error}
            </div>
          )}
          
          <VehicleForm
            vehicle={vehicle}
            rooftops={rooftops}
            onSave={handleSave}
            onCancel={handleCancel}
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
}
