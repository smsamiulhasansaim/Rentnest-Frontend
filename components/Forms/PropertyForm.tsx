'use client';

import { useState, useEffect } from 'react';
import { useCategories } from '@/hooks/useProperties';
import { CreatePropertyData, UpdatePropertyData } from '@/types/property';
import { useToast } from '@/providers/ToastProvider';
import { Loader2 } from 'lucide-react';

interface PropertyFormProps {
  initialData?: Partial<CreatePropertyData> & { id?: string };
  onSubmit: (data: CreatePropertyData | UpdatePropertyData) => void;
  isSubmitting?: boolean;
  submitLabel?: string;
}

export const PropertyForm = ({
  initialData = {},
  onSubmit,
  isSubmitting = false,
  submitLabel = 'Create Property',
}: PropertyFormProps) => {
  const { data: categoriesData, isLoading: categoriesLoading } = useCategories();
  const { toast } = useToast();

  const [formData, setFormData] = useState<CreatePropertyData>({
    title: '',
    description: '',
    address: '',
    city: '',
    price: 0,
    bedrooms: 0,
    bathrooms: 0,
    amenities: [],
    images: [],
    categoryId: '',
    ...initialData,
  });

  const [amenitiesInput, setAmenitiesInput] = useState(
    initialData.amenities?.join(', ') || ''
  );
  const [imagesInput, setImagesInput] = useState(
    initialData.images?.join(', ') || ''
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate
    if (!formData.title.trim()) {
      toast.error('Title is required');
      return;
    }
    if (!formData.description.trim()) {
      toast.error('Description is required');
      return;
    }
    if (!formData.address.trim()) {
      toast.error('Address is required');
      return;
    }
    if (!formData.city.trim()) {
      toast.error('City is required');
      return;
    }
    if (formData.price <= 0) {
      toast.error('Price must be greater than 0');
      return;
    }
    if (!formData.categoryId) {
      toast.error('Please select a category');
      return;
    }

    // Parse amenities and images
    const amenities = amenitiesInput
      .split(',')
      .map((a) => a.trim())
      .filter((a) => a.length > 0);
    const images = imagesInput
      .split(',')
      .map((i) => i.trim())
      .filter((i) => i.length > 0);

    const submitData = {
      ...formData,
      amenities,
      images,
    };

    onSubmit(submitData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Title *
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Beautiful Apartment"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Price (USD) *
          </label>
          <input
            type="number"
            name="price"
            value={formData.price || ''}
            onChange={handleChange}
            placeholder="1000"
            min="0"
            step="1"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Address *
          </label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="123 Main Street"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            City *
          </label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            placeholder="Dhaka"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Bedrooms
          </label>
          <input
            type="number"
            name="bedrooms"
            value={formData.bedrooms || ''}
            onChange={handleChange}
            placeholder="2"
            min="0"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Bathrooms
          </label>
          <input
            type="number"
            name="bathrooms"
            value={formData.bathrooms || ''}
            onChange={handleChange}
            placeholder="1"
            min="0"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Category *
        </label>
        <select
          name="categoryId"
          value={formData.categoryId}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        >
          <option value="">Select a category</option>
          {categoriesData?.data?.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description *
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Describe your property..."
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Amenities (comma separated)
        </label>
        <input
          type="text"
          value={amenitiesInput}
          onChange={(e) => setAmenitiesInput(e.target.value)}
          placeholder="Parking, WiFi, AC, Pool"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <p className="text-xs text-gray-500 mt-1">
          Separate amenities with commas
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Images (URLs - comma separated)
        </label>
        <input
          type="text"
          value={imagesInput}
          onChange={(e) => setImagesInput(e.target.value)}
          placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <p className="text-xs text-gray-500 mt-1">
          Separate image URLs with commas
        </p>
      </div>

      <button
        type="submit"
        disabled={isSubmitting || categoriesLoading}
        className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Saving...
          </>
        ) : (
          submitLabel
        )}
      </button>
    </form>
  );
};

export default PropertyForm;