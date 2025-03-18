import React from 'react';
import Link from 'next/link';
import { Edit, Trash2, Check, X, Home, MapPin, DollarSign, Clock, Eye } from 'lucide-react';

const HouseListingTable = ({ houses = [], onEdit, onDelete, onApprove, onReject }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusStyles = (status) => {
    switch (status) {
      case 'approved':
        return { bgColor: 'bg-emerald-100 dark:bg-emerald-900', textColor: 'text-emerald-800 dark:text-emerald-100', icon: <Check className="h-4 w-4 mr-1" /> };
      case 'pending':
        return { bgColor: 'bg-amber-100 dark:bg-amber-900', textColor: 'text-amber-800 dark:text-amber-100', icon: <Clock className="h-4 w-4 mr-1" /> };
      case 'rejected':
        return { bgColor: 'bg-rose-100 dark:bg-rose-900', textColor: 'text-rose-800 dark:text-rose-100', icon: <X className="h-4 w-4 mr-1" /> };
      default:
        return { bgColor: 'bg-gray-100 dark:bg-gray-800', textColor: 'text-gray-800 dark:text-gray-100', icon: null };
    }
  };

  if (!houses.length) {
    return (
      <div className="text-center py-12 px-4">
        <Home className="h-12 w-12 mx-auto text-gray-400" />
        <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-gray-100">No listings found</h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">There are no house listings available at this time.</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg dark:bg-gray-850">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">Property</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">Location</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">Price</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-900 dark:divide-gray-700">
            {houses.map((house) => {
              const statusStyle = getStatusStyles(house?.is_approved ? 'approved' : 'pending');
              return (
                <tr key={house.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-150">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">{house.title}</td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-300 flex items-center">
                    <MapPin className="h-4 w-4 text-gray-400 mr-1" /> {house.location}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">{formatCurrency(house.price)}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`px-3 py-1 inline-flex items-center text-xs font-medium rounded-full ${statusStyle.bgColor} ${statusStyle.textColor}`}>
                      {statusStyle.icon} {house?.is_approved ? 'Approved' : 'Pending'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium flex space-x-2">
                    <Link href={`/houses/${house.id}`}>
                      <p className="p-1 rounded-full text-indigo-600 hover:bg-indigo-100 dark:text-indigo-400 dark:hover:bg-indigo-900 transition-colors duration-150" title="View Details">
                        <Eye className="h-5 w-5" />
                      </p>
                    </Link>
                    {onEdit && (
                      <button onClick={() => onEdit(house)} className="p-1 rounded-full text-blue-600 hover:bg-blue-100 dark:text-blue-400 dark:hover:bg-blue-900 transition-colors duration-150" title="Edit listing">
                        <Edit className="h-5 w-5" />
                      </button>
                    )}
                    {onDelete && (
                      <button onClick={() => onDelete(house.id)} className="p-1 rounded-full text-red-600 hover:bg-red-100 dark:text-red-400 dark:hover:bg-red-900 transition-colors duration-150" title="Delete listing">
                        <Trash2 className="h-5 w-5" />
                      </button>
                    )}
                    {house.status === 'pending' && onApprove && (
                      <button onClick={() => onApprove(house.id)} className="p-1 rounded-full text-green-600 hover:bg-green-100 dark:text-green-400 dark:hover:bg-green-900 transition-colors duration-150" title="Approve listing">
                        <Check className="h-5 w-5" />
                      </button>
                    )}
                    {house.status === 'pending' && onReject && (
                      <button onClick={() => onReject(house.id)} className="p-1 rounded-full text-red-600 hover:bg-red-100 dark:text-red-400 dark:hover:bg-red-900 transition-colors duration-150" title="Reject listing">
                        <X className="h-5 w-5" />
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HouseListingTable;
