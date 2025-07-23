import React, { useState, useRef } from 'react';
import { Save, Upload, FileSignature, Trash2, Eye } from 'lucide-react';
import type { SignatureSettings } from '../types';

const SignatureTab: React.FC = () => {
  const [formData, setFormData] = useState<SignatureSettings>({
    hasSignature: false,
    signatureFile: undefined,
    signaturePreview: undefined,
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];
      if (!allowedTypes.includes(file.type)) {
        alert('Chỉ chấp nhận file hình ảnh (PNG, JPG, JPEG)');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Kích thước file không được vượt quá 5MB');
        return;
      }

      // Create preview
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData(prev => ({
          ...prev,
          hasSignature: true,
          signatureFile: file,
          signaturePreview: event.target?.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveSignature = () => {
    setFormData({
      hasSignature: false,
      signatureFile: undefined,
      signaturePreview: undefined,
    });
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Saving signature settings:', formData);
    // Handle save logic here
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
          <FileSignature className="w-6 h-6 mr-2 text-red-600" />
          Cài đặt chữ ký điện tử
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Upload Section */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-medium text-blue-800 mb-4">Upload chữ ký điện tử</h3>
            
            {!formData.hasSignature ? (
              <div className="text-center">
                <div className="border-2 border-dashed border-red-300 rounded-lg p-8">
                  <Upload className="w-12 h-12 text-red-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">
                    Kéo và thả file chữ ký hoặc click để chọn file
                  </p>
                  <p className="text-sm text-gray-500 mb-4">
                    Hỗ trợ định dạng: PNG, JPG, JPEG (tối đa 5MB)
                  </p>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center px-4 py-2 bg-red-600 text-white font-medium rounded-md hover:bg-red-700 transition-colors duration-200"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Chọn file
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/jpg"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Signature Preview */}
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-gray-900 flex items-center">
                      <Eye className="w-4 h-4 mr-2" />
                      Xem trước chữ ký
                    </h4>
                    <div className="flex space-x-2">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="inline-flex items-center px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
                      >
                        <Upload className="w-4 h-4 mr-1" />
                        Thay đổi
                      </button>
                      <button
                        type="button"
                        onClick={handleRemoveSignature}
                        className="inline-flex items-center px-3 py-1 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors duration-200"
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Xóa
                      </button>
                    </div>
                  </div>
                  
                  {formData.signaturePreview && (
                    <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                      <img
                        src={formData.signaturePreview}
                        alt="Signature preview"
                        className="max-w-full max-h-32 mx-auto object-contain"
                      />
                    </div>
                  )}
                  
                  {formData.signatureFile && (
                    <div className="mt-3 text-sm text-gray-600">
                      <p><strong>Tên file:</strong> {formData.signatureFile.name}</p>
                      <p><strong>Kích thước:</strong> {(formData.signatureFile.size / 1024).toFixed(1)} KB</p>
                      <p><strong>Định dạng:</strong> {formData.signatureFile.type}</p>
                    </div>
                  )}
                  
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/jpg"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Signature Usage Guidelines */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h3 className="text-lg font-medium text-gray-800 mb-3">Hướng dẫn sử dụng chữ ký điện tử</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start">
                <span className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                Chữ ký điện tử sẽ được sử dụng để ký các báo cáo tài chính và thuế
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                File chữ ký nên có nền trong suốt hoặc nền trắng để hiển thị tốt nhất
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                Kích thước đề xuất: 300x150 pixels để đảm bảo chất lượng
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                Chữ ký phải rõ ràng và dễ đọc khi in trên giấy
              </li>
            </ul>
          </div>

          {/* Security Notice */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start">
              <FileSignature className="w-5 h-5 text-yellow-600 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-yellow-800 mb-1">Lưu ý bảo mật</h4>
                <p className="text-sm text-yellow-700">
                  Chữ ký điện tử được lưu trữ an toàn và chỉ được sử dụng cho các mục đích ký báo cáo chính thức. 
                  Không chia sẻ file chữ ký với bên thứ ba không được ủy quyền.
                </p>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={!formData.hasSignature}
              className={`inline-flex items-center px-6 py-3 font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors duration-200 ${
                formData.hasSignature
                  ? 'bg-red-600 text-white hover:bg-red-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              <Save className="w-5 h-5 mr-2" />
              Lưu chữ ký
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignatureTab;