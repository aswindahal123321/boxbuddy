import React, { useState, useEffect } from 'react';
import type { Product } from '../types';

interface ProductFormProps {
  product: Product | null;
  onSave: (product: Product) => void;
  onCancel: () => void;
}

const emptyProduct: Omit<Product, 'id'> = {
  name: '',
  description: '',
  price: 0,
  imageUrl: '',
  category: 'Chicken',
};

export const ProductForm: React.FC<ProductFormProps> = ({ product, onSave, onCancel }) => {
  const [formData, setFormData] = useState(product || emptyProduct);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    const initialData = product || emptyProduct;
    setFormData(initialData);
    setImagePreview(initialData.imageUrl || null);
  }, [product]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'price' ? parseFloat(value) : value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64String = reader.result as string;
            setFormData(prev => ({ ...prev, imageUrl: base64String }));
            setImagePreview(base64String);
        };
        reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.imageUrl) {
        alert('Please upload an image for the meal.');
        return;
    }
    onSave({ ...formData, id: product?.id || 0 });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2 className="text-2xl font-bold mb-6 text-slate-800">{product ? 'Edit Meal' : 'Create New Meal'}</h2>
      <div className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-slate-700">Name</label>
          <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} required className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm" />
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-slate-700">Description</label>
          <textarea name="description" id="description" value={formData.description} onChange={handleChange} required rows={3} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm" />
        </div>
        <div className="grid grid-cols-2 gap-4">
            <div>
                <label htmlFor="price" className="block text-sm font-medium text-slate-700">Price</label>
                <input type="number" name="price" id="price" value={formData.price} onChange={handleChange} required step="0.01" className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm" />
            </div>
            <div>
                <label htmlFor="category" className="block text-sm font-medium text-slate-700">Category</label>
                <select id="category" name="category" value={formData.category} onChange={handleChange} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm">
                    <option>Vegan</option>
                    <option>Chicken</option>
                    <option>Beef</option>
                    <option>Fish</option>
                </select>
            </div>
        </div>
        <div>
            <label htmlFor="image" className="block text-sm font-medium text-slate-700">Product Image</label>
            <div className="mt-1 flex items-center space-x-4">
                {imagePreview ? (
                    <img src={imagePreview} alt="Meal preview" className="h-24 w-24 object-cover rounded-md" />
                ) : (
                    <div className="h-24 w-24 bg-slate-100 rounded-md flex items-center justify-center text-slate-400">
                        <span className="text-xs text-center">No Image</span>
                    </div>
                )}
                <input 
                    type="file" 
                    name="image" 
                    id="image" 
                    accept="image/png, image/jpeg, image/webp"
                    onChange={handleFileChange} 
                    className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
                />
            </div>
        </div>
      </div>
      <div className="mt-8 flex justify-end space-x-3">
        <button type="button" onClick={onCancel} className="bg-white py-2 px-4 border border-slate-300 rounded-md shadow-sm text-sm font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500">Cancel</button>
        <button type="submit" className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500">Save</button>
      </div>
    </form>
  );
};