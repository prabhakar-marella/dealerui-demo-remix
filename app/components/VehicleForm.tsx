import { useState } from 'react';
import { Input, Select, FormField } from './Form';
import { SaveCancelButtons } from './Button';
import type { Vehicle, Rooftop } from '../lib/api';

interface VehicleFormData {
  make: string;
  model: string;
  trim: string;
  year: string;
  veh_listing_type: 'Used' | 'New' | '';
  body_type: string;
  ext_color: string;
  rooftop_id: string;
}

interface VehicleFormErrors {
  make?: string;
  model?: string;
  trim?: string;
  year?: string;
  veh_listing_type?: string;
  body_type?: string;
  ext_color?: string;
  rooftop_id?: string;
}

interface VehicleFormProps {
  vehicle?: Vehicle;
  rooftops: Rooftop[];
  onSave: (vehicleData: Omit<Vehicle, 'id'>) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

export function VehicleForm({ 
  vehicle, 
  rooftops, 
  onSave, 
  onCancel, 
  loading = false 
}: VehicleFormProps) {
  const [formData, setFormData] = useState<VehicleFormData>({
    make: vehicle?.make || '',
    model: vehicle?.model || '',
    trim: vehicle?.trim || '',
    year: vehicle?.year?.toString() || '',
    veh_listing_type: vehicle?.veh_listing_type || '',
    body_type: vehicle?.body_type || '',
    ext_color: vehicle?.ext_color || '',
    rooftop_id: vehicle?.rooftop_id?.toString() || '',
  });

  const [errors, setErrors] = useState<VehicleFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: VehicleFormErrors = {};

    if (!formData.make.trim()) {
      newErrors.make = 'Make is required';
    }

    if (!formData.model.trim()) {
      newErrors.model = 'Model is required';
    }

    if (!formData.trim.trim()) {
      newErrors.trim = 'Trim is required';
    }

    if (!formData.year.trim()) {
      newErrors.year = 'Year is required';
    } else {
      const year = parseInt(formData.year);
      if (isNaN(year) || year < 1900 || year > new Date().getFullYear() + 2) {
        newErrors.year = 'Please enter a valid year';
      }
    }

    if (!formData.veh_listing_type) {
      newErrors.veh_listing_type = 'Listing type is required';
    }

    if (!formData.body_type.trim()) {
      newErrors.body_type = 'Body type is required';
    }

    if (!formData.ext_color.trim()) {
      newErrors.ext_color = 'Exterior color is required';
    }

    if (!formData.rooftop_id.trim()) {
      newErrors.rooftop_id = 'Rooftop is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSave({
        make: formData.make.trim(),
        model: formData.model.trim(),
        trim: formData.trim.trim(),
        year: parseInt(formData.year),
        veh_listing_type: formData.veh_listing_type as 'Used' | 'New',
        body_type: formData.body_type.trim(),
        ext_color: formData.ext_color.trim(),
        rooftop_id: parseInt(formData.rooftop_id),
      });
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof VehicleFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const listingTypeOptions = [
    { value: 'New', label: 'New' },
    { value: 'Used', label: 'Used' },
  ];

  const rooftopOptions = rooftops.map(rooftop => ({
    value: rooftop.id.toString(),
    label: rooftop.name,
  }));

  return (
    <div className="max-w-2xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Make"
          value={formData.make}
          onChange={(e) => handleInputChange('make', e.target.value)}
          error={errors.make}
          required
          disabled={loading || isSubmitting}
          placeholder="e.g., Toyota"
        />

        <Input
          label="Model"
          value={formData.model}
          onChange={(e) => handleInputChange('model', e.target.value)}
          error={errors.model}
          required
          disabled={loading || isSubmitting}
          placeholder="e.g., Camry"
        />

        <Input
          label="Trim"
          value={formData.trim}
          onChange={(e) => handleInputChange('trim', e.target.value)}
          error={errors.trim}
          required
          disabled={loading || isSubmitting}
          placeholder="e.g., LE"
        />

        <Input
          label="Year"
          type="number"
          value={formData.year}
          onChange={(e) => handleInputChange('year', e.target.value)}
          error={errors.year}
          required
          disabled={loading || isSubmitting}
          min="1900"
          max={new Date().getFullYear() + 2}
          placeholder="e.g., 2023"
        />

        <Select
          label="Listing Type"
          value={formData.veh_listing_type}
          onChange={(e) => handleInputChange('veh_listing_type', e.target.value)}
          options={listingTypeOptions}
          error={errors.veh_listing_type}
          required
          disabled={loading || isSubmitting}
          placeholder="Select listing type"
        />

        <Input
          label="Body Type"
          value={formData.body_type}
          onChange={(e) => handleInputChange('body_type', e.target.value)}
          error={errors.body_type}
          required
          disabled={loading || isSubmitting}
          placeholder="e.g., Sedan"
        />

        <Input
          label="Exterior Color"
          value={formData.ext_color}
          onChange={(e) => handleInputChange('ext_color', e.target.value)}
          error={errors.ext_color}
          required
          disabled={loading || isSubmitting}
          placeholder="e.g., White"
        />

        <Select
          label="Rooftop"
          value={formData.rooftop_id}
          onChange={(e) => handleInputChange('rooftop_id', e.target.value)}
          options={rooftopOptions}
          error={errors.rooftop_id}
          required
          disabled={loading || isSubmitting}
          placeholder="Select rooftop"
        />
      </div>

      <div className="mt-8 flex justify-end">
        <SaveCancelButtons
          onSave={handleSubmit}
          onCancel={onCancel}
          saveLabel={vehicle ? 'Update Vehicle' : 'Create Vehicle'}
          saveDisabled={loading || isSubmitting}
        />
      </div>
    </div>
  );
}
