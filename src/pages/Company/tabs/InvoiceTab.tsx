import React, { useState } from 'react';
import { Save, Receipt, Settings, Key, FileText } from 'lucide-react';
import type { InvoiceSettings, FormErrors } from '../types';

const InvoiceTab: React.FC = () => {
  const [formData, setFormData] = useState<InvoiceSettings>({
    apiEndpoint: '',
    apiToken: '',
    invoiceTemplate: '',
    invoiceSymbol: '',
    serialNumber: '',
    issuancePolicy: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});

  const invoiceTemplates = [
    { value: 'template01', label: 'Mẫu số 01-GT' },
    { value: 'template02', label: 'Mẫu số 02-GT' },
    { value: 'template03', label: 'Mẫu số 03-GT' },
    { value: 'template04', label: 'Mẫu số 04-GT' },
    { value: 'template06', label: 'Mẫu số 06-GT' },
  ];

  const issuancePolicies = [
    { value: 'immediate', label: 'Phát hành ngay lập tức' },
    { value: 'daily', label: 'Phát hành cuối ngày' },
    { value: 'manual', label: 'Phát hành thủ công' },
    { value: 'batch', label: 'Phát hành theo lô' },
  ];

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.apiEndpoint.trim()) {
      newErrors.apiEndpoint = 'API Endpoint là bắt buộc';
    } else if (!/^https?:\/\/.+/.test(formData.apiEndpoint)) {
      newErrors.apiEndpoint = 'API Endpoint phải bắt đầu với http:// hoặc https://';
    }

    if (!formData.apiToken.trim()) {
      newErrors.apiToken = 'API Token là bắt buộc';
    }

    if (!formData.invoiceTemplate) {
      newErrors.invoiceTemplate = 'Vui lòng chọn mẫu hóa đơn';
    }

    if (!formData.invoiceSymbol.trim()) {
      newErrors.invoiceSymbol = 'Ký hiệu hóa đơn là bắt buộc';
    }

    if (!formData.serialNumber.trim()) {
      newErrors.serialNumber = 'Số seri là bắt buộc';
    } else if (!/^\d+$/.test(formData.serialNumber)) {
      newErrors.serialNumber = 'Số seri chỉ được chứa số';
    }

    if (!formData.issuancePolicy) {
      newErrors.issuancePolicy = 'Vui lòng chọn chính sách phát hành';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      console.log('Saving invoice settings:', formData);
      // Handle save logic here
    }
  };

  const handleInputChange = (field: keyof InvoiceSettings, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const testConnection = () => {
    if (!formData.apiEndpoint || !formData.apiToken) {
      alert('Vui lòng nhập đầy đủ thông tin API để test kết nối');
      return;
    }
    
    // Simulate API test
    console.log('Testing API connection...');
    alert('Đang test kết nối API...');
    // Here you would implement actual API testing logic
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
          <Receipt className="w-6 h-6 mr-2 text-red-600" />
          Cài đặt hóa đơn điện tử
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* API Configuration */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="text-lg font-medium text-blue-800 mb-4 flex items-center">
              <Key className="w-5 h-5 mr-2" />
              Cấu hình kết nối e-Invoice
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  API Endpoint <span className="text-red-500">*</span>
                </label>
                <input
                  type="url"
                  value={formData.apiEndpoint}
                  onChange={(e) => handleInputChange('apiEndpoint', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                    errors.apiEndpoint ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="https://api.einvoice.gov.vn/..."
                />
                {errors.apiEndpoint && (
                  <p className="mt-1 text-sm text-red-600">{errors.apiEndpoint}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  API Token <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  value={formData.apiToken}
                  onChange={(e) => handleInputChange('apiToken', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                    errors.apiToken ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Nhập API Token"
                />
                {errors.apiToken && (
                  <p className="mt-1 text-sm text-red-600">{errors.apiToken}</p>
                )}
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={testConnection}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors duration-200"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Test kết nối
                </button>
              </div>
            </div>
          </div>

          {/* Invoice Configuration */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
              <FileText className="w-5 h-5 mr-2" />
              Thiết lập phát hành hóa đơn
            </h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Invoice Template */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mẫu hóa đơn <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.invoiceTemplate}
                  onChange={(e) => handleInputChange('invoiceTemplate', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                    errors.invoiceTemplate ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Chọn mẫu hóa đơn</option>
                  {invoiceTemplates.map((template) => (
                    <option key={template.value} value={template.value}>
                      {template.label}
                    </option>
                  ))}
                </select>
                {errors.invoiceTemplate && (
                  <p className="mt-1 text-sm text-red-600">{errors.invoiceTemplate}</p>
                )}
              </div>

              {/* Invoice Symbol */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ký hiệu hóa đơn <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.invoiceSymbol}
                  onChange={(e) => handleInputChange('invoiceSymbol', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                    errors.invoiceSymbol ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="VD: AA/22E"
                />
                {errors.invoiceSymbol && (
                  <p className="mt-1 text-sm text-red-600">{errors.invoiceSymbol}</p>
                )}
              </div>

              {/* Serial Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Số seri bắt đầu <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.serialNumber}
                  onChange={(e) => handleInputChange('serialNumber', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                    errors.serialNumber ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="VD: 1"
                />
                {errors.serialNumber && (
                  <p className="mt-1 text-sm text-red-600">{errors.serialNumber}</p>
                )}
              </div>

              {/* Issuance Policy */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Chính sách phát hành <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.issuancePolicy}
                  onChange={(e) => handleInputChange('issuancePolicy', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                    errors.issuancePolicy ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Chọn chính sách phát hành</option>
                  {issuancePolicies.map((policy) => (
                    <option key={policy.value} value={policy.value}>
                      {policy.label}
                    </option>
                  ))}
                </select>
                {errors.issuancePolicy && (
                  <p className="mt-1 text-sm text-red-600">{errors.issuancePolicy}</p>
                )}
              </div>
            </div>
          </div>

          {/* Additional Settings */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="text-lg font-medium text-blue-800 mb-3">Lưu ý quan trọng</h3>
            <ul className="space-y-2 text-sm text-blue-700">
              <li className="flex items-start">
                <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                Cài đặt này sẽ đồng bộ với menu phát hành hóa đơn để quản lý tổng thể
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                API Token được mã hóa và lưu trữ an toàn trên hệ thống
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                Thay đổi cài đặt có thể ảnh hưởng đến việc phát hành hóa đơn hiện tại
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                Khuyến nghị test kết nối trước khi lưu cài đặt chính thức
              </li>
            </ul>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center px-6 py-3 bg-red-600 text-white font-medium rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors duration-200"
            >
              <Save className="w-5 h-5 mr-2" />
              Lưu cài đặt hóa đơn
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InvoiceTab;