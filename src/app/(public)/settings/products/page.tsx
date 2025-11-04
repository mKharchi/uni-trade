"use client";
import { useAuth } from '@/app/AuthContext'
import ProductItem from '@/app/components/ProductItem'
import { Loader2, X } from 'lucide-react';
import React, { useState } from 'react'
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';

// Types
type CategoryValue = 'electronics' | 'clothing' | 'home' | 'books' | 'sports' | 'other';

interface Category {
  value: CategoryValue;
  label: string;
}

interface ProductForm {
  name: string;
  description: string;
  category: CategoryValue | '';
  subcategory: string;
  price: string;
  is_exchangeable: boolean;
}

interface FormErrors {
  name?: string;
  description?: string;
  category?: string;
  subcategory?: string;
  price?: string;
  submit?: string;
}

interface Product {
  id: string | number;
  name: string;
  description: string;
  category: CategoryValue;
  subcategory: string;
  price: number;
  is_exchangeable: boolean;
}

interface AddProductProps {
  setFormOpen: (open: boolean) => void;
  onProductAdded: () => void;
  token: string;
}

// Constants
const categories: Category[] = [
  { value: 'electronics', label: 'Electronics' },
  { value: 'clothing', label: 'Clothing' },
  { value: 'home', label: 'Home & Garden' },
  { value: 'books', label: 'Books' },
  { value: 'sports', label: 'Sports & Outdoors' },
  { value: 'other', label: 'Other' }
];

const subcategories: Record<CategoryValue, string[]> = {
  electronics: ['Phones', 'Laptops', 'Accessories', 'Gaming'],
  clothing: ['Men', 'Women', 'Kids', 'Accessories'],
  home: ['Furniture', 'Decor', 'Kitchen', 'Garden'],
  books: ['Fiction', 'Non-Fiction', 'Educational', 'Comics'],
  sports: ['Equipment', 'Clothing', 'Accessories', 'Outdoor Gear'],
  other: ['Collectibles', 'Handmade', 'Vintage', 'Services']
};

const AddProduct: React.FC<AddProductProps> = ({ setFormOpen, onProductAdded, token }) => {
  const [form, setForm] = useState<ProductForm>({
    name: "",
    description: "",
    category: "",
    subcategory: "",
    price: "",
    is_exchangeable: false
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
      // Reset subcategory when category changes
      ...(name === 'category' ? { subcategory: '' } : {})
    }));
    // Clear error for this field
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = (): FormErrors => {
    const newErrors: FormErrors = {};
    if (!form.name.trim()) newErrors.name = 'Product name is required';
    if (!form.description.trim()) newErrors.description = 'Description is required';
    if (!form.category) newErrors.category = 'Category is required';
    if (!form.subcategory) newErrors.subcategory = 'Subcategory is required';
    if (!form.price || parseFloat(form.price) <= 0) newErrors.price = 'Valid price is required';
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newErrors = validate();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch('/api/users/products',
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(form)
        }
      );
      const result = await response.json();
      if (!result.success) {
        throw new Error(result.error);
      }
      toast.success(result.message);
      onProductAdded();
      setFormOpen(false);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      toast.error(`Error adding product: ${errorMessage}`);
      setErrors({ submit: 'Failed to add product. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4'>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className='w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl p-6 rounded-xl bg-white flex flex-col gap-4'
      >
        <div className='flex items-center justify-between sticky top-0 bg-white pb-2 border-b'>
          <h1 className='text-2xl font-semibold'>Add a Product</h1>
          <X className='cursor-pointer hover:bg-gray-100 rounded p-1' size={24} onClick={() => setFormOpen(false)} />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Product Name */}
          <div>
            <label htmlFor="name" className='block text-sm font-medium mb-1'>
              Product Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={form.name}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${errors.name ? 'border-red-500' : 'border-gray-300'
                }`}
              placeholder="Enter product name"
            />
            {errors.name && <p className='text-red-500 text-sm mt-1'>{errors.name}</p>}
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className='block text-sm font-medium mb-1'>
              Description *
            </label>
            <textarea
              id="description"
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={4}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none ${errors.description ? 'border-red-500' : 'border-gray-300'
                }`}
              placeholder="Describe your product"
            />
            {errors.description && <p className='text-red-500 text-sm mt-1'>{errors.description}</p>}
          </div>

          {/* Category and Subcategory */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div>
              <label htmlFor="category" className='block text-sm font-medium mb-1'>
                Category *
              </label>
              <select
                id="category"
                name="category"
                value={form.category}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${errors.category ? 'border-red-500' : 'border-gray-300'
                  }`}
              >
                <option value="">Select category</option>
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
              {errors.category && <p className='text-red-500 text-sm mt-1'>{errors.category}</p>}
            </div>

            <div>
              <label htmlFor="subcategory" className='block text-sm font-medium mb-1'>
                Subcategory *
              </label>
              <select
                id="subcategory"
                name="subcategory"
                value={form.subcategory}
                onChange={handleChange}
                disabled={!form.category}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-100 disabled:cursor-not-allowed ${errors.subcategory ? 'border-red-500' : 'border-gray-300'
                  }`}
              >
                <option value="">Select subcategory</option>
                {form.category && subcategories[form.category as CategoryValue]?.map(sub => (
                  <option key={sub} value={sub}>{sub}</option>
                ))}
              </select>
              {errors.subcategory && <p className='text-red-500 text-sm mt-1'>{errors.subcategory}</p>}
            </div>
          </div>

          {/* Price */}
          <div>
            <label htmlFor="price" className='block text-sm font-medium mb-1'>
              Price ($) *
            </label>
            <input
              type="number"
              id="price"
              name="price"
              value={form.price}
              onChange={handleChange}
              step="0.01"
              min="0"
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${errors.price ? 'border-red-500' : 'border-gray-300'
                }`}
              placeholder="0.00"
            />
            {errors.price && <p className='text-red-500 text-sm mt-1'>{errors.price}</p>}
          </div>

          {/* Exchangeable */}
          <div className='flex items-center gap-2'>
            <input
              type="checkbox"
              id="is_exchangeable"
              name="is_exchangeable"
              checked={form.is_exchangeable}
              onChange={handleChange}
              className='w-4 h-4 text-primary border-gray-300 rounded focus:ring-2 focus:ring-primary'
            />
            <label htmlFor="is_exchangeable" className='text-sm font-medium cursor-pointer'>
              Open to exchange
            </label>
          </div>

          {/* Submit Error */}
          {errors.submit && (
            <div className='p-3 bg-red-50 border border-red-200 rounded-lg'>
              <p className='text-red-600 text-sm'>{errors.submit}</p>
            </div>
          )}

          {/* Actions */}
          <div className='flex gap-3 pt-4 border-t'>
            <button
              type="button"
              onClick={() => setFormOpen(false)}
              className='flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors'
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className='flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2'
            >
              {submitting ? (
                <>
                  <Loader2 className='animate-spin' size={16} />
                  Adding...
                </>
              ) : 'Add Product'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

const Page: React.FC = () => {
  const [formOpen, setFormOpen] = useState<boolean>(false);
  const { userProducts, fetchUserProducts, loading, token } = useAuth();

  const handleProductAdded = () => {
    fetchUserProducts?.();
  };

  const shown_products: Product[] = userProducts?.slice() || [];

  return (
    <div className='w-full rounded-xl p-1 bg-gray-50'>
      <div className='max-w-7xl mx-auto min-h-screen w-full rounded-xl bg-white p-4 '>
        <div className='flex items-center justify-between mb-6'>
          <h1 className='text-3xl font-bold'>My Products</h1>
          {shown_products.length > 0 && (
            <button
              onClick={() => setFormOpen(true)}
              className='px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors'
            >
              + Add Product
            </button>
          )}
        </div>

        {loading ? (
          <div className='w-full flex items-center justify-center py-20'>
            <Loader2 className='animate-spin' size={48} />
          </div>
        ) : shown_products && shown_products.length > 0 ? (
          <div className='w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
            {shown_products.map((product) => (
              <ProductItem key={product.id} {...product} />
            ))}
          </div>
        ) : (
          <div className='w-full flex flex-col items-center justify-center gap-4 py-20'>
            <p className='text-gray-600 text-xl text-center'>No products found.</p>
            <button
              onClick={() => setFormOpen(true)}
              className='px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors'
            >
              + Add Products
            </button>
          </div>
        )}

        {formOpen && token && (
          <AddProduct
            token={token}
            setFormOpen={setFormOpen}
            onProductAdded={handleProductAdded}
          />
        )}
      </div>
    </div>
  );
};

export default Page;