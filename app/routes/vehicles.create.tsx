import type { Route } from "./+types/vehicles.create";
import { useLoaderData, useNavigate, redirect } from "react-router";
import { useState } from "react";
import { VehicleForm } from "../components/VehicleForm";
import { Button } from "../components/Button";
import { api } from "../lib/api";
import type { Vehicle } from "../lib/api";

export async function loader() {
  try {
    const rooftops = await api.getRooftops();
    return { rooftops };
  } catch (error) {
    return { rooftops: [] };
  }
}

export async function action({ request }: Route.ActionArgs) {
  if (request.method !== 'POST') {
    throw new Response('Method not allowed', { status: 405 });
  }

  const formData = await request.formData();
  const vehicleData = Object.fromEntries(formData);

  try {
    const vehicle = await api.createVehicle({
      make: vehicleData.make as string,
      model: vehicleData.model as string,
      trim: vehicleData.trim as string,
      year: parseInt(vehicleData.year as string),
      veh_listing_type: vehicleData.veh_listing_type as 'Used' | 'New',
      body_type: vehicleData.body_type as string,
      ext_color: vehicleData.ext_color as string,
      rooftop_id: parseInt(vehicleData.rooftop_id as string),
    });
    let vehicleId = vehicle.data.id;
    return redirect(`/vehicles/${vehicleId}`);
  } catch (error) {
    return {
      error: 'Failed to create vehicle. Please try again.',
    };
  }
}

export default function CreateVehicle() {
  const { rooftops } = useLoaderData<typeof loader>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async (vehicleData: Omit<Vehicle, 'id'>) => {
    setLoading(true);
    setError(null);
    
    try {
      const vehicle = await api.createVehicle(vehicleData);
      let vehicleId = vehicle.data.id;
      navigate(`/vehicles/${vehicleId}`);
    } catch (err) {
      setError('Failed to create vehicle. Please try again.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-8">
          <Button
            variant="secondary"
            onClick={() => navigate('/')}
          >
            ← Back to Listings
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Create New Vehicle</h1>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-lg shadow-md p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-100 border border-red-300 text-red-700 rounded-lg">
              {error}
            </div>
          )}
          
          <VehicleForm
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
