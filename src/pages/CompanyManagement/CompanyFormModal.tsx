"use client"

import type { FormField } from "@/types/form"
import React, { useState, useCallback, useEffect } from "react"
import { X, Save, Loader2, AlertCircle, Info } from "lucide-react"

interface CompanyFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: any) => Promise<void> | void
  initialData?: any
  mode: "add" | "edit"
}

const FIELDS: FormField[] = [
  { id: "name", name: "name", label: "Tên công ty", type: "text", required: true, placeholder: "Nhập tên công ty" },
  { id: "address", name: "address", label: "Địa chỉ", type: "text", required: true, placeholder: "Nhập địa chỉ" },
  { id: "taxCode", name: "taxCode", label: "Mã số thuế", type: "text", required: true, placeholder: "Nhập mã số thuế", validation: { pattern: "^\\d{10}$", maxLength: 10 }, description: "Mã số thuế phải có 10 chữ số" },
  { id: "province", name: "province", label: "Tỉnh/Thành phố", type: "select", required: true, options: [
    { value: "Hà Nội", label: "Hà Nội" },
    { value: "TP. Hồ Chí Minh", label: "TP. Hồ Chí Minh" },
    { value: "Đà Nẵng", label: "Đà Nẵng" },
    { value: "Hải Phòng", label: "Hải Phòng" },
    { value: "Cần Thơ", label: "Cần Thơ" },
    { value: "Bình Dương", label: "Bình Dương" },
    { value: "Đồng Nai", label: "Đồng Nai" },
    { value: "Quảng Ninh", label: "Quảng Ninh" },
    { value: "Thanh Hóa", label: "Thanh Hóa" },
    { value: "Nghệ An", label: "Nghệ An" },
  ], placeholder: "Chọn tỉnh/thành phố" },
  { id: "taxOfficeCode", name: "taxOfficeCode", label: "Mã cơ quan thuế", type: "text", required: false, placeholder: "Nhập mã CQ thuế" },
  { id: "phone", name: "phone", label: "Số điện thoại", type: "text", required: false, placeholder: "Nhập số điện thoại" },
  { id: "email", name: "email", label: "Email", type: "email", required: false, placeholder: "Nhập email" },
  { id: "industry", name: "industry", label: "Ngành nghề", type: "select", required: false, options: [
    { value: "Sản xuất", label: "Sản xuất" },
    { value: "Thương mại", label: "Thương mại" },
    { value: "Dịch vụ", label: "Dịch vụ" },
    { value: "Xây dựng", label: "Xây dựng" },
    { value: "CNTT", label: "CNTT" },
    { value: "Vận tải", label: "Vận tải" },
    { value: "Tài chính", label: "Tài chính" },
    { value: "Bất động sản", label: "Bất động sản" },
    { value: "Y tế", label: "Y tế" },
    { value: "Giáo dục", label: "Giáo dục" },
  ], placeholder: "Chọn ngành nghề" },
]

// --- Định nghĩa các hằng số cho tab và dữ liệu ---
import { Building2, Settings, CreditCard, FileSignature, Receipt, Check } from "lucide-react"

const PROVINCES = [
  "Hà Nội", "TP. Hồ Chí Minh", "Đà Nẵng", "Hải Phòng", "Cần Thơ", "Bình Dương", "Đồng Nai", "Quảng Ninh", "Thanh Hóa", "Nghệ An"
]
const INDUSTRIES = [
  "Sản xuất", "Thương mại", "Dịch vụ", "Xây dựng", "CNTT", "Vận tải", "Tài chính", "Bất động sản", "Y tế", "Giáo dục"
]

export default function CompanyFormModal({ isOpen, onClose, onSubmit, initialData = {}, mode }: CompanyFormModalProps) {
  const [formData, setFormData] = useState<any>({})
  const [activeTab, setActiveTab] = useState<'info'|'accounting'|'firmbanking'|'signature'|'invoice'>('info')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setActiveTab('info')
      setFormData({
        name: initialData.name || '',
        address: initialData.address || '',
        taxCode: initialData.taxCode || '',
        province: initialData.province || '',
        taxOfficeCode: initialData.taxOfficeCode || '',
        phone: initialData.phone || '',
        email: initialData.email || '',
        industry: initialData.industry || [],
        settings: initialData.settings || {},
        id: initialData.id
      })
    }
  }, [isOpen, initialData])

  // Validate tax code
  const validateTaxCode = (taxCode: string) => /^\d{10}$/.test(taxCode)

  // Validate form
  const validateForm = () => {
    if (!formData.name?.trim() || !formData.address?.trim() || !formData.taxCode?.trim() || !formData.province?.trim()) return false
    if (!validateTaxCode(formData.taxCode)) return false
    return true
  }

  const handleSave = async () => {
    if (!validateForm()) return
    setIsSubmitting(true)
    try {
      await onSubmit(formData)
      onClose()
    } finally {
      setIsSubmitting(false)
    }
  }

  const closeModal = () => {
    if (!isSubmitting) onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden mx-2 sm:mx-4">
        <div className="flex items-center justify-between p-4 sm:p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            {mode === 'edit' ? 'Chỉnh sửa công ty' : 'Thêm mới công ty'}
          </h2>
          <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b">
          <nav className="flex space-x-2 sm:space-x-8 px-4 sm:px-6 overflow-x-auto">
            <button
              onClick={() => setActiveTab('info')}
              className={`py-4 px-2 sm:px-1 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap transition-colors ${
                activeTab === 'info' 
                  ? 'border-blue-500 text-blue-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Building2 className="inline h-4 w-4 mr-1 sm:mr-2" />
              Thông tin công ty1
            </button>
            <button
              onClick={() => setActiveTab('accounting')}
              className={`py-4 px-2 sm:px-1 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap transition-colors ${
                activeTab === 'accounting' 
                  ? 'border-blue-500 text-blue-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Settings className="inline h-4 w-4 mr-1 sm:mr-2" />
              Thiết lập kế toán
            </button>
            <button
              onClick={() => setActiveTab('firmbanking')}
              className={`py-4 px-2 sm:px-1 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap transition-colors ${
                activeTab === 'firmbanking' 
                  ? 'border-blue-500 text-blue-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <CreditCard className="inline h-4 w-4 mr-1 sm:mr-2" />
              Firmbanking
            </button>
            <button
              onClick={() => setActiveTab('signature')}
              className={`py-4 px-2 sm:px-1 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap transition-colors ${
                activeTab === 'signature' 
                  ? 'border-blue-500 text-blue-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <FileSignature className="inline h-4 w-4 mr-1 sm:mr-2" />
              Chữ ký
            </button>
            <button
              onClick={() => setActiveTab('invoice')}
              className={`py-4 px-2 sm:px-1 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap transition-colors ${
                activeTab === 'invoice' 
                  ? 'border-blue-500 text-blue-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Receipt className="inline h-4 w-4 mr-1 sm:mr-2" />
              Hóa đơn
            </button>
          </nav>
        </div>

        <div className="p-4 sm:p-6 max-h-80 sm:max-h-96 overflow-y-auto">
          {/* Tab Thông tin công ty */}
          {activeTab === 'info' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tên công ty <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name || ''}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Nhập tên công ty"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mã số thuế <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.taxCode || ''}
                    onChange={e => setFormData({ ...formData, taxCode: e.target.value })}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${formData.taxCode && !validateTaxCode(formData.taxCode) ? 'border-red-300' : 'border-gray-300'}`}
                    placeholder="0123456789"
                    maxLength={10}
                  />
                  {formData.taxCode && !validateTaxCode(formData.taxCode) && (
                    <p className="text-red-500 text-xs mt-1">Mã số thuế phải có 10 chữ số</p>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Địa chỉ <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.address || ''}
                  onChange={e => setFormData({ ...formData, address: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Nhập địa chỉ đầy đủ"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tỉnh/Thành phố <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.province || ''}
                    onChange={e => setFormData({ ...formData, province: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Chọn tỉnh/thành phố</option>
                    {PROVINCES.map(province => (
                      <option key={province} value={province}>{province}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Mã cơ quan thuế</label>
                  <input
                    type="text"
                    value={formData.taxOfficeCode || ''}
                    onChange={e => setFormData({ ...formData, taxOfficeCode: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="TCT001"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Số điện thoại</label>
                  <input
                    type="tel"
                    value={formData.phone || ''}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0901234567"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={formData.email || ''}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="contact@company.com"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Ngành nghề</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-32 overflow-y-auto border border-gray-300 rounded-lg p-3">
                  {INDUSTRIES.map(industry => (
                    <label key={industry} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={formData.industry?.includes(industry) || false}
                        onChange={e => {
                          const current = formData.industry || []
                          if (e.target.checked) {
                            setFormData({ ...formData, industry: [...current, industry] })
                          } else {
                            setFormData({ ...formData, industry: current.filter((i: string) => i !== industry) })
                          }
                        }}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{industry}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Tab Thiết lập kế toán */}
          {activeTab === 'accounting' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phương pháp kế toán</label>
                  <select
                    value={formData.settings?.accounting?.method || 'C200'}
                    onChange={e => setFormData({
                      ...formData,
                      settings: {
                        ...formData.settings!,
                        accounting: {
                          ...formData.settings?.accounting,
                          method: e.target.value
                        }
                      }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="C200">C200</option>
                    <option value="133">133</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phương pháp tính giá</label>
                  <select
                    value={formData.settings?.accounting?.pricing || 'Bình quân gia quyền'}
                    onChange={e => setFormData({
                      ...formData,
                      settings: {
                        ...formData.settings!,
                        accounting: {
                          ...formData.settings?.accounting,
                          pricing: e.target.value
                        }
                      }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Bình quân gia quyền">Bình quân gia quyền</option>
                    <option value="FIFO">FIFO</option>
                    <option value="LIFO">LIFO</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phương pháp tính thuế</label>
                  <select
                    value={formData.settings?.accounting?.tax || 'Khấu trừ'}
                    onChange={e => setFormData({
                      ...formData,
                      settings: {
                        ...formData.settings!,
                        accounting: {
                          ...formData.settings?.accounting,
                          tax: e.target.value
                        }
                      }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Khấu trừ">Khấu trừ</option>
                    <option value="Khai báo">Khai báo</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phương pháp khóa sổ</label>
                  <select
                    value={formData.settings?.accounting?.lockMethod || 'Theo tháng'}
                    onChange={e => setFormData({
                      ...formData,
                      settings: {
                        ...formData.settings!,
                        accounting: {
                          ...formData.settings?.accounting,
                          lockMethod: e.target.value
                        }
                      }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Theo tháng">Theo tháng</option>
                    <option value="Theo quý">Theo quý</option>
                    <option value="Theo năm">Theo năm</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.settings?.accounting?.allowNegative || false}
                      onChange={e => setFormData({
                        ...formData,
                        settings: {
                          ...formData.settings!,
                          accounting: {
                            ...formData.settings?.accounting,
                            allowNegative: e.target.checked
                          }
                        }
                      })}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium text-gray-700">Cho phép xuất âm</span>
                  </label>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Số thập phân</label>
                  <select
                    value={formData.settings?.accounting?.decimal || 2}
                    onChange={e => setFormData({
                      ...formData,
                      settings: {
                        ...formData.settings!,
                        accounting: {
                          ...formData.settings?.accounting,
                          decimal: parseInt(e.target.value)
                        }
                      }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value={0}>0</option>
                    <option value={1}>1</option>
                    <option value={2}>2</option>
                    <option value={3}>3</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Tab Firmbanking */}
          {activeTab === 'firmbanking' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tài khoản ngân hàng</label>
                  <input
                    type="text"
                    value={formData.settings?.firmbanking?.bankAccount || ''}
                    onChange={e => setFormData({
                      ...formData,
                      settings: {
                        ...formData.settings!,
                        firmbanking: {
                          ...formData.settings?.firmbanking,
                          bankAccount: e.target.value
                        }
                      }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Nhập số tài khoản"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email OTP</label>
                  <input
                    type="email"
                    value={formData.settings?.firmbanking?.otpEmail || ''}
                    onChange={e => setFormData({
                      ...formData,
                      settings: {
                        ...formData.settings!,
                        firmbanking: {
                          ...formData.settings?.firmbanking,
                          otpEmail: e.target.value
                        }
                      }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="otp@company.com"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Số điện thoại OTP</label>
                  <input
                    type="tel"
                    value={formData.settings?.firmbanking?.otpPhone || ''}
                    onChange={e => setFormData({
                      ...formData,
                      settings: {
                        ...formData.settings!,
                        firmbanking: {
                          ...formData.settings?.firmbanking,
                          otpPhone: e.target.value
                        }
                      }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0901234567"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Câu hỏi bảo mật</label>
                  <input
                    type="text"
                    value={formData.settings?.firmbanking?.securityQuestion || ''}
                    onChange={e => setFormData({
                      ...formData,
                      settings: {
                        ...formData.settings!,
                        firmbanking: {
                          ...formData.settings?.firmbanking,
                          securityQuestion: e.target.value
                        }
                      }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Nhập câu hỏi bảo mật"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Tab Chữ ký */}
          {activeTab === 'signature' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Chữ ký số</label>
                  <select
                    value={formData.settings?.signature?.digitalSignature || ''}
                    onChange={e => setFormData({
                      ...formData,
                      settings: {
                        ...formData.settings!,
                        signature: {
                          ...formData.settings?.signature,
                          digitalSignature: e.target.value
                        }
                      }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Chọn loại chữ ký số</option>
                    <option value="Chữ ký số HSM">Chữ ký số HSM</option>
                    <option value="Chữ ký số Token">Chữ ký số Token</option>
                    <option value="Chữ ký số File">Chữ ký số File</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Chữ ký điện tử</label>
                  <select
                    value={formData.settings?.signature?.electronicSignature || ''}
                    onChange={e => setFormData({
                      ...formData,
                      settings: {
                        ...formData.settings!,
                        signature: {
                          ...formData.settings?.signature,
                          electronicSignature: e.target.value
                        }
                      }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Trạng thái cấu hình</option>
                    <option value="Đã cấu hình">Đã cấu hình</option>
                    <option value="Chưa cấu hình">Chưa cấu hình</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Tab Hóa đơn */}
          {activeTab === 'invoice' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Kết nối e-invoice</label>
                  <select
                    value={formData.settings?.invoice?.eInvoiceConnection || ''}
                    onChange={e => setFormData({
                      ...formData,
                      settings: {
                        ...formData.settings!,
                        invoice: {
                          ...formData.settings?.invoice,
                          eInvoiceConnection: e.target.value
                        }
                      }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Chọn nhà cung cấp</option>
                    <option value="VNPT">VNPT</option>
                    <option value="Viettel">Viettel</option>
                    <option value="FPT">FPT</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Cài đặt phát hành hóa đơn</label>
                  <select
                    value={formData.settings?.invoice?.invoiceSettings || ''}
                    onChange={e => setFormData({
                      ...formData,
                      settings: {
                        ...formData.settings!,
                        invoice: {
                          ...formData.settings?.invoice,
                          invoiceSettings: e.target.value
                        }
                      }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Chọn phương thức</option>
                    <option value="Tự động phát hành">Tự động phát hành</option>
                    <option value="Thủ công">Thủ công</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-end space-y-3 sm:space-y-0 sm:space-x-4 p-4 sm:p-6 border-t bg-gray-50">
          <button
            onClick={closeModal}
            className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            disabled={isSubmitting}
          >
            Hủy
          </button>
          <button
            onClick={handleSave}
            className="w-full sm:w-auto px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
            disabled={isSubmitting || !validateForm()}
          >
            <Check className="h-4 w-4" />
            <span>{mode === 'edit' ? 'Cập nhật' : 'Thêm mới'}</span>
          </button>
        </div>
      </div>
    </div>
  )
}
