import type { Route } from "./+types/vehicles.$id";
import { useLoaderData, Link, useNavigate } from "react-router";
import { useState, useEffect } from "react";
import { Button } from "../components/Button";
import { DataTable } from "../components/DataTable";
import { Tabs } from "../components/Tabs";
import { api } from "../lib/api";
import type { Vehicle, Rooftop, VehicleImage, VehicleVideo, Vehicle360Spin } from "../lib/api";

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

function MediaTab({ 
  vehicleId, 
  fetchData, 
  columns, 
  emptyMessage 
}: { 
  vehicleId: number;
  fetchData: (id: number) => Promise<any[]>;
  columns: any[];
  emptyMessage: string;
}) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const result = await fetchData(vehicleId);
        setData(result);
      } catch (err) {
        setError('Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [vehicleId, fetchData]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 py-8">
        {error}
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        {emptyMessage}
      </div>
    );
  }

  return (
    <DataTable
      data={data}
      columns={columns}
      searchable
      itemsPerPage={5}
    />
  );
}

export default function VehicleDetails({ params }: Route.ComponentProps) {
  const { vehicle, rooftops } = useLoaderData<typeof loader>();
  const navigate = useNavigate();
  const vehicleId = parseInt(params.id);

  // Get rooftop name
  const rooftop = rooftops.find(r => r.id === vehicle.rooftop_id);
  const rooftopName = rooftop ? rooftop.name : `Rooftop ${vehicle.rooftop_id}`;

  const imageColumns = [
    { key: 'id', header: 'ID', sortable: true },    
    { key: 'imageGroupId', header: 'Group', sortable: true },    
    { key: 'imageWidth', header: 'Width', sortable: true },
    { key: 'imageHeight', header: 'Height', sortable: true },
    { key: 'imageUrl', header: 'Image URL', sortable: false },
  ];

  const videoColumns = [
    { key: 'id', header: 'ID', sortable: true },
    { key: 'title', header: 'Title', sortable: true },
    { key: 'clipDuration', header: 'Duration(Sec)', sortable: true },
    { key: 'clipUrl', header: 'Video URL'},    
    { key: 'shortDesc', header: 'Description', sortable: true },
  ];

  const spinColumns = [
    { key: 'id', header: 'ID', sortable: true },
    { key: 'type', header: 'Type', sortable: true },
    {key: 'exteriorView',header: 'Exterior View',sortable: true},
    {key: 'interiorView',header: 'Interior View',sortable: true},
    {key: 'playerUrl',header: 'Player URL',sortable: false},
  ];

  const tabs = [
    {
      id: 'images',
      label: 'Images',
      content: (
        <MediaTab
          vehicleId={vehicleId}
          fetchData={api.getVehicleImages}
          columns={imageColumns}
          emptyMessage="No images available for this vehicle."
        />
      ),
    },
    {
      id: 'videos',
      label: 'Videos',
      content: (
        <MediaTab
          vehicleId={vehicleId}
          fetchData={api.getVehicleVideos}
          columns={videoColumns}
          emptyMessage="No videos available for this vehicle."
        />
      ),
    },
    {
      id: 'spins',
      label: '360 Spins',
      content: (
        <MediaTab
          vehicleId={vehicleId}
          fetchData={api.getVehicle360Spins}
          columns={spinColumns}
          emptyMessage="No 360° spins available for this vehicle."
        />
      ),
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
            <h1 className="text-3xl font-bold text-gray-900">
              {vehicle.year} {vehicle.make} {vehicle.model} {vehicle.trim}
            </h1>
          </div>
          <div className="flex space-x-3">
            <Button
              variant="primary"
              size="sm"
              onClick={() => navigate(`/vehicles/${vehicle.id}/edit`)}
            >
              Edit Vehicle
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={() => navigate(`/vehicles/${vehicle.id}/delete`)}
            >
              Delete Vehicle
            </Button>
          </div>
        </div>

        {/* Vehicle Details Card */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Vehicle Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <dt className="text-sm font-medium text-gray-500">ID</dt>
              <dd className="mt-1 text-sm text-gray-900">{vehicle.id}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Make</dt>
              <dd className="mt-1 text-sm text-gray-900">{vehicle.make}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Model</dt>
              <dd className="mt-1 text-sm text-gray-900">{vehicle.model}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Trim</dt>
              <dd className="mt-1 text-sm text-gray-900">{vehicle.trim}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Year</dt>
              <dd className="mt-1 text-sm text-gray-900">{vehicle.year}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Listing Type</dt>
              <dd className="mt-1 text-sm text-gray-900">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  vehicle.veh_listing_type === 'New' 
                    ? 'bg-green-100 text-green-800'
                    : 'bg-blue-100 text-blue-800'
                }`}>
                  {vehicle.veh_listing_type}
                </span>
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Body Type</dt>
              <dd className="mt-1 text-sm text-gray-900">{vehicle.body_type}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Exterior Color</dt>
              <dd className="mt-1 text-sm text-gray-900">{vehicle.ext_color}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Rooftop</dt>
              <dd className="mt-1 text-sm text-gray-900">
                <Link
                  to={`/rooftops/${vehicle.rooftop_id}`}
                  className="text-blue-600 hover:text-blue-800 underline"
                >
                  {rooftopName}
                </Link>
              </dd>
            </div>
          </div>
        </div>

        {/* Media Tabs */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Media</h2>
          <Tabs tabs={tabs} defaultActiveTab="images" />
        </div>
      </div>
    </div>
  );
}
