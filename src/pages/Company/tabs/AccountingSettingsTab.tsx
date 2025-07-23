import React, { useState } from 'react';
import { Save, Settings2 } from 'lucide-react';
import type { AccountingSettings, FormErrors } from '../types';

const AccountingSettingsTab: React.FC = () => {
  const [formData, setFormData] = useState<AccountingSettings>({
    hasC200Data: false,
    pricingMethod: '',
    taxMethod: '',
    closingMethod: '',
    allowNegativeInventory: false,
    decimalPlaces: 2,
  });

  const [errors, setErrors] = useState<FormErrors>({});

  const pricingMethods = [
    { value: 'fifo', label: 'FIFO (First In, First Out)' },
    { value: 'lifo', label: 'LIFO (Last In, First Out)' },
    { value: 'average', label: 'Bình quân gia quyền' },
    { value: 'specific', label: 'Giá thực tế đích danh' },
  ];

  const taxMethods = [
    { value: 'accrual', label: 'Phương pháp khấu trừ' },
    { value: 'direct', label: 'Phương pháp trực tiếp' },
    { value: 'hybrid', label: 'Phương pháp hỗn hợp' },
  ];

  const closingMethods = [
    { value: 'monthly', label: 'Khóa sổ theo tháng' },
    { value: 'quarterly', label: 'Khóa sổ theo quý' },
    { value: 'yearly', label: 'Khóa sổ theo năm' },
  ];

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.pricingMethod) {
      newErrors.pricingMethod = 'Vui lòng chọn phương pháp tính giá';
    }

    if (!formData.taxMethod) {
      newErrors.taxMethod = 'Vui lòng chọn phương pháp tính thuế';
    }

    if (!formData.closingMethod) {
      newErrors.closingMethod = 'Vui lòng chọn phương pháp khóa sổ';
    }

    if (formData.decimalPlaces < 0 || formData.decimalPlaces > 4) {
      newErrors.decimalPlaces = 'Số thập phân phải từ 0 đến 4';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      console.log('Saving accounting settings:', formData);
      // Handle save logic here
    }
  };

  const handleInputChange = (field: keyof AccountingSettings, value: string | number | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
          <Settings2 className="w-6 h-6 mr-2 text-red-600" />
          Thiết lập dữ liệu kế toán
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* C200 Data Setting */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="text-lg font-medium text-blue-800 mb-4">Dữ liệu báo cáo thuế</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dữ liệu C200/133
                </label>
                <select
                  value={formData.hasC200Data ? 'yes' : 'no'}
                  onChange={(e) => handleInputChange('hasC200Data', e.target.value === 'yes')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  <option value="no">Không</option>
                  <option value="yes">Có</option>
                </select>
              </div>
            </div>
          </div>

          {/* Calculation Methods */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Pricing Method */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phương pháp tính giá <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.pricingMethod}
                onChange={(e) => handleInputChange('pricingMethod', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                  errors.pricingMethod ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Chọn phương pháp tính giá</option>
                {pricingMethods.map((method) => (
                  <option key={method.value} value={method.value}>
                    {method.label}
                  </option>
                ))}
              </select>
              {errors.pricingMethod && (
                <p className="mt-1 text-sm text-red-600">{errors.pricingMethod}</p>
              )}
            </div>

            {/* Tax Method */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phương pháp tính thuế <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.taxMethod}
                onChange={(e) => handleInputChange('taxMethod', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                  errors.taxMethod ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Chọn phương pháp tính thuế</option>
                {taxMethods.map((method) => (
                  <option key={method.value} value={method.value}>
                    {method.label}
                  </option>
                ))}
              </select>
              {errors.taxMethod && (
                <p className="mt-1 text-sm text-red-600">{errors.taxMethod}</p>
              )}
            </div>

            {/* Closing Method */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phương pháp khóa sổ <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.closingMethod}
                onChange={(e) => handleInputChange('closingMethod', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                  errors.closingMethod ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Chọn phương pháp khóa sổ</option>
                {closingMethods.map((method) => (
                  <option key={method.value} value={method.value}>
                    {method.label}
                  </option>
                ))}
              </select>
              {errors.closingMethod && (
                <p className="mt-1 text-sm text-red-600">{errors.closingMethod}</p>
              )}
            </div>

            {/* Decimal Places */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Số thập phân <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="0"
                max="4"
                value={formData.decimalPlaces}
                onChange={(e) => handleInputChange('decimalPlaces', parseInt(e.target.value))}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                  errors.decimalPlaces ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Nhập số thập phân (0-4)"
              />
              {errors.decimalPlaces && (
                <p className="mt-1 text-sm text-red-600">{errors.decimalPlaces}</p>
              )}
            </div>
          </div>

          {/* Additional Settings */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h3 className="text-lg font-medium text-gray-800 mb-4">Cài đặt bổ sung</h3>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="allowNegativeInventory"
                checked={formData.allowNegativeInventory}
                onChange={(e) => handleInputChange('allowNegativeInventory', e.target.checked)}
                className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
              />
              <label htmlFor="allowNegativeInventory" className="ml-2 text-sm text-gray-700">
                Cho phép xuất âm tồn kho
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center px-6 py-3 bg-red-600 text-white font-medium rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors duration-200"
            >
              <Save className="w-5 h-5 mr-2" />
              Lưu cài đặt
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AccountingSettingsTab;