const BASE_URL = 'http://192.168.29.193:3000/api';

// Vehicle types
export interface Vehicle {
  id: number;
  make: string;
  model: string;
  trim: string;
  year: number;
  veh_listing_type: 'Used' | 'New';
  body_type: string;
  ext_color: string;
  rooftop_id: number;
}

// Rooftop types
export interface Rooftop {
  id: number;
  name: string;
  street: string;
  city: string;
  state: string;
  phone: string;
  email: string;
}

// Media types
export interface VehicleImage {
  id: number;
  url: string;
  alt?: string;
}

export interface VehicleVideo {
  id: number;
  url: string;
  title?: string;
}

export interface Vehicle360Spin {
  id: number;
  url: string;
  title?: string;
}

// API functions
export const api = {
  // Vehicles
  async getVehicles(): Promise<Vehicle[]> {
    const response = await fetch(`${BASE_URL}/vehicles`);
    if (!response.ok) throw new Error('Failed to fetch vehicles');
    return response.json();
  },

  async getVehicle(id: number): Promise<Vehicle> {
    const response = await fetch(`${BASE_URL}/vehicles/${id}`);
    if (!response.ok) throw new Error('Failed to fetch vehicle');
    return response.json();
  },

  async createVehicle(vehicle: Omit<Vehicle, 'id'>): Promise<Vehicle> {
    const response = await fetch(`${BASE_URL}/vehicles`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(vehicle),
    });
    if (!response.ok) throw new Error('Failed to create vehicle');
    return response.json();
  },

  async updateVehicle(id: number, vehicle: Omit<Vehicle, 'id'>): Promise<Vehicle> {
    const response = await fetch(`${BASE_URL}/vehicles/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(vehicle),
    });
    if (!response.ok) throw new Error('Failed to update vehicle');
    return response.json();
  },

  async deleteVehicle(id: number): Promise<void> {
    const response = await fetch(`${BASE_URL}/vehicles/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete vehicle');
  },

  // Vehicle media
  async getVehicleImages(vehicleId: number): Promise<VehicleImage[]> {
    const response = await fetch(`${BASE_URL}/images/vehicle/${vehicleId}`);
    if (!response.ok) throw new Error('Failed to fetch vehicle images');
    return response.json();
  },

  async getVehicleVideos(vehicleId: number): Promise<VehicleVideo[]> {
    const response = await fetch(`${BASE_URL}/videos/vehicle/${vehicleId}`);
    if (!response.ok) throw new Error('Failed to fetch vehicle videos');
    return response.json();
  },

  async getVehicle360Spins(vehicleId: number): Promise<Vehicle360Spin[]> {
    const response = await fetch(`${BASE_URL}/spins/vehicle/${vehicleId}`);
    if (!response.ok) throw new Error('Failed to fetch vehicle 360 spins');
    return response.json();
  },

  // Rooftops
  async getRooftops(): Promise<Rooftop[]> {
    const response = await fetch(`${BASE_URL}/rooftops`);
    if (!response.ok) throw new Error('Failed to fetch rooftops');
    return response.json();
  },

  async getRooftop(id: number): Promise<Rooftop> {
    const response = await fetch(`${BASE_URL}/rooftops/${id}`);
    if (!response.ok) throw new Error('Failed to fetch rooftop');
    return response.json();
  },
};
