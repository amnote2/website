import React, { useState } from 'react';
import { Save, AlertCircle, Building2 } from 'lucide-react';
import type { CompanyInfo, FormErrors } from '../types';

const CompanyInfoTab: React.FC = () => {
  const [formData, setFormData] = useState<CompanyInfo>({
    companyName: '',
    address: '',
    taxCode: '',
    province: '',
    taxOfficeCode: '',
    phone: '',
    email: '',
    businessSector: [],
  });

  const [errors, setErrors] = useState<FormErrors>({});

  const provinces = [
    'Hà Nội', 'TP. Hồ Chí Minh', 'Đà Nẵng', 'Hải Phòng', 'Cần Thơ',
    'An Giang', 'Bà Rịa - Vũng Tàu', 'Bắc Giang', 'Bắc Kạn', 'Bạc Liêu',
    'Bắc Ninh', 'Bến Tre', 'Bình Định', 'Bình Dương', 'Bình Phước',
    'Bình Thuận', 'Cà Mau', 'Cao Bằng', 'Đắk Lắk', 'Đắk Nông',
    'Điện Biên', 'Đồng Nai', 'Đồng Tháp', 'Gia Lai', 'Hà Giang',
    'Hà Nam', 'Hà Tĩnh', 'Hải Dương', 'Hậu Giang', 'Hòa Bình',
  ];

  const businessSectors = [
    'Nông, lâm nghiệp và thủy sản',
    'Khai khoáng',
    'Công nghiệp chế biến, chế tạo',
    'Sản xuất và phân phối điện, khí đốt, nước nóng',
    'Cung cấp nước; hoạt động quản lý và xử lý rác thải',
    'Xây dựng',
    'Bán buôn và bán lẻ; sửa chữa ô tô, mô tô',
    'Vận tải, kho bãi',
    'Dịch vụ lưu trú và ăn uống',
    'Thông tin và truyền thông',
    'Hoạt động tài chính, ngân hàng và bảo hiểm',
    'Hoạt động kinh doanh bất động sản',
    'Hoạt động chuyên môn, khoa học và công nghệ',
    'Hoạt động hành chính và dịch vụ hỗ trợ',
    'Giáo dục và đào tạo',
    'Y tế và hoạt động trợ giúp xã hội',
    'Nghệ thuật, vui chơi và giải trí',
    'Hoạt động dịch vụ khác',
  ];

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.companyName.trim()) {
      newErrors.companyName = 'Tên công ty là bắt buộc';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Địa chỉ là bắt buộc';
    }

    if (!formData.taxCode.trim()) {
      newErrors.taxCode = 'Mã số thuế là bắt buộc';
    } else if (!/^\d{10}$|^\d{13}$/.test(formData.taxCode)) {
      newErrors.taxCode = 'Mã số thuế phải có 10 hoặc 13 chữ số';
    }

    if (!formData.province) {
      newErrors.province = 'Vui lòng chọn tỉnh/thành phố';
    }

    if (!formData.taxOfficeCode.trim()) {
      newErrors.taxOfficeCode = 'Mã cơ quan thuế là bắt buộc';
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
    }

    if (formData.phone && !/^[0-9+\-\s\(\)]{10,15}$/.test(formData.phone)) {
      newErrors.phone = 'Số điện thoại không hợp lệ';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      console.log('Saving company info:', formData);
      // Handle save logic here
    }
  };

  const handleInputChange = (field: keyof CompanyInfo, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSectorChange = (sector: string) => {
    const currentSectors = formData.businessSector || [];
    const updatedSectors = currentSectors.includes(sector)
      ? currentSectors.filter(s => s !== sector)
      : [...currentSectors, sector];
    
    handleInputChange('businessSector', updatedSectors);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
          <Building2 className="w-6 h-6 mr-2 text-red-600" />
          Thông tin công ty
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Required Fields Section */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="text-lg font-medium text-blue-800 mb-4 flex items-center">
              <AlertCircle className="w-5 h-5 mr-2 text-blue-600" />
              Thông tin bắt buộc
            </h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Company Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tên công ty <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.companyName}
                  onChange={(e) => handleInputChange('companyName', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                    errors.companyName ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Nhập tên công ty"
                />
                {errors.companyName && (
                  <p className="mt-1 text-sm text-red-600">{errors.companyName}</p>
                )}
              </div>

              {/* Tax Code */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mã số thuế <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.taxCode}
                  onChange={(e) => handleInputChange('taxCode', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                    errors.taxCode ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Nhập mã số thuế"
                />
                {errors.taxCode && (
                  <p className="mt-1 text-sm text-red-600">{errors.taxCode}</p>
                )}
              </div>

              {/* Address */}
              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Địa chỉ <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  rows={3}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                    errors.address ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Nhập địa chỉ công ty"
                />
                {errors.address && (
                  <p className="mt-1 text-sm text-red-600">{errors.address}</p>
                )}
              </div>

              {/* Province */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tỉnh/Thành phố <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.province}
                  onChange={(e) => handleInputChange('province', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                    errors.province ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Chọn tỉnh/thành phố</option>
                  {provinces.map((province) => (
                    <option key={province} value={province}>
                      {province}
                    </option>
                  ))}
                </select>
                {errors.province && (
                  <p className="mt-1 text-sm text-red-600">{errors.province}</p>
                )}
              </div>

              {/* Tax Office Code */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mã cơ quan thuế <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.taxOfficeCode}
                  onChange={(e) => handleInputChange('taxOfficeCode', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                    errors.taxOfficeCode ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Nhập mã cơ quan thuế"
                />
                {errors.taxOfficeCode && (
                  <p className="mt-1 text-sm text-red-600">{errors.taxOfficeCode}</p>
                )}
              </div>
            </div>
          </div>

          {/* Optional Fields Section */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h3 className="text-lg font-medium text-gray-800 mb-4">Thông tin bổ sung</h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Số điện thoại
                </label>
                <input
                  type="tel"
                  value={formData.phone || ''}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                    errors.phone ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Nhập số điện thoại"
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email || ''}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Nhập email công ty"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>

              {/* Business Sector */}
              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ngành nghề kinh doanh
                </label>
                <div className="max-h-48 overflow-y-auto border border-gray-300 rounded-md p-3 bg-white">
                  {businessSectors.map((sector) => (
                    <div key={sector} className="flex items-center mb-2">
                      <input
                        type="checkbox"
                        id={sector}
                        checked={formData.businessSector?.includes(sector) || false}
                        onChange={() => handleSectorChange(sector)}
                        className="mr-3 h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                      />
                      <label htmlFor={sector} className="text-sm text-gray-700">
                        {sector}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
            >
              <Save className="w-5 h-5 mr-2" />
              Lưu thông tin
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CompanyInfoTab;