'use client';

import { useState } from 'react';
import Link from 'next/link';
import Swal from 'sweetalert2';
import { useAdminCategories, useCreateCategory, useUpdateCategory, useDeleteCategory } from '@/hooks/useAdmin';
import { useToast } from '@/providers/ToastProvider';
import {
  Loader2,
  Plus,
  Edit,
  Trash2,
  Tag,
  ArrowLeft,
  RefreshCw,
  X,
  Check,
  Building2,
} from 'lucide-react';

export default function AdminCategoriesPage() {
  const toast = useToast();
  const [isAdding, setIsAdding] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');

  const { data: categoriesData, isLoading, refetch } = useAdminCategories();
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();
  const deleteCategory = useDeleteCategory();

  const categories = categoriesData?.data || [];

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) {
      toast.error('Please enter a category name');
      return;
    }

    try {
      await createCategory.mutateAsync(newCategoryName.trim());
      toast.success('Category created successfully');
      setNewCategoryName('');
      setIsAdding(false);
      refetch();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to create category');
    }
  };

  const handleUpdateCategory = async (id: string) => {
    if (!editingName.trim()) {
      toast.error('Please enter a category name');
      return;
    }

    try {
      await updateCategory.mutateAsync({ id, name: editingName.trim() });
      toast.success('Category updated successfully');
      setEditingId(null);
      setEditingName('');
      refetch();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to update category');
    }
  };

  const handleDeleteCategory = async (id: string, name: string, propertyCount: number) => {
    if (propertyCount > 0) {
      toast.error(`Cannot delete "${name}" - ${propertyCount} properties use this category`);
      return;
    }

    const result = await Swal.fire({
      title: 'Delete this category?',
      text: `Are you sure you want to delete "${name}"?`,
      icon: 'warning',
      background: '#1f2937',
      color: '#f3f4f6',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#4b5563',
      confirmButtonText: 'Yes, delete it',
      cancelButtonText: 'Cancel',
      reverseButtons: true,
    });

    if (!result.isConfirmed) return;

    try {
      await deleteCategory.mutateAsync(id);
      toast.success('Category deleted successfully');
      refetch();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to delete category');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-blue-500" />
        <p className="text-gray-400 mt-4 text-sm animate-pulse">Loading categories...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <Link
              href="/admin/dashboard"
              className="p-2 bg-white rounded-xl shadow-sm hover:shadow-md transition-all"
            >
              <ArrowLeft className="w-5 h-5 text-gray-500" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Tag className="w-6 h-6 text-yellow-500" />
                Categories
              </h1>
              <p className="text-gray-500 text-sm">{categories.length} total categories</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => refetch()}
              className="px-4 py-2.5 bg-white text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors border border-gray-200 flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
            <button
              onClick={() => setIsAdding(true)}
              className="px-4 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-blue-500/30 transition-all flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add Category
            </button>
          </div>
        </div>

        {/* Add Category Form */}
        {isAdding && (
          <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6 shadow-sm">
            <form onSubmit={handleAddCategory} className="flex gap-3">
              <input
                type="text"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="Enter category name..."
                className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                autoFocus
              />
              <button
                type="submit"
                disabled={createCategory.isPending}
                className="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {createCategory.isPending ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <Check className="w-5 h-5" />
                    Add
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </form>
          </div>
        )}

        {/* Categories List */}
        {categories.length > 0 ? (
          <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Properties</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Created</th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {categories.map((category) => {
                    const isThisDeleting =
                      deleteCategory.isPending && deleteCategory.variables === category.id;
                    const isThisUpdating =
                      updateCategory.isPending && updateCategory.variables?.id === category.id;

                    return (
                      <tr key={category.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          {editingId === category.id ? (
                            <div className="flex items-center gap-2">
                              <input
                                type="text"
                                value={editingName}
                                onChange={(e) => setEditingName(e.target.value)}
                                className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                autoFocus
                              />
                              <button
                                onClick={() => handleUpdateCategory(category.id)}
                                disabled={isThisUpdating}
                                className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50"
                              >
                                {isThisUpdating ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                  <Check className="w-4 h-4" />
                                )}
                              </button>
                              <button
                                onClick={() => {
                                  setEditingId(null);
                                  setEditingName('');
                                }}
                                className="p-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 bg-yellow-50 rounded-xl flex items-center justify-center">
                                <Tag className="w-4 h-4 text-yellow-600" />
                              </div>
                              <span className="font-medium text-gray-900">{category.name}</span>
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <span className="flex items-center gap-1 text-gray-600">
                            <Building2 className="w-4 h-4 text-gray-400" />
                            {category._count?.properties || 0}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-gray-500">
                            {new Date(category.createdAt).toLocaleDateString()}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          {editingId !== category.id && (
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => {
                                  setEditingId(category.id);
                                  setEditingName(category.name);
                                }}
                                className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                                title="Edit category"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteCategory(category.id, category.name, category._count?.properties || 0)}
                                disabled={isThisDeleting}
                                className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50"
                                title="Delete category"
                              >
                                {isThisDeleting ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                  <Trash2 className="w-4 h-4" />
                                )}
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-16 text-center border border-gray-200">
            <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Tag className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700">No categories yet</h3>
            <p className="text-gray-500 mt-2">Create your first category to start organizing properties</p>
            <button
              onClick={() => setIsAdding(true)}
              className="mt-4 px-6 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-blue-500/30 transition-all"
            >
              <Plus className="w-4 h-4 inline mr-1" />
              Add Category
            </button>
          </div>
        )}
      </div>
    </div>
  );
}