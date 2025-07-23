"use client"

import type { FormField } from "@/types/form"
import { useState, useEffect } from "react"
import { X, Save, Usb, FileText, Shield, Building2, Settings, CreditCard, FileSignature, Receipt, Check } from "lucide-react"

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

const PROVINCES = [
  "Hà Nội", "TP. Hồ Chí Minh", "Đà Nẵng", "Hải Phòng", "Cần Thơ", "Bình Dương", "Đồng Nai", "Quảng Ninh", "Thanh Hóa", "Nghệ An"
]
const INDUSTRIES = [
  "Sản xuất", "Thương mại", "Dịch vụ", "Xây dựng", "CNTT", "Vận tải", "Tài chính", "Bất động sản", "Y tế", "Giáo dục"
]
const PRICING_METHODS = [
  { value: 'bqtt', label: 'Bình quân tức thời' },
  { value: 'fifo', label: 'Phương pháp nhập trước xuất trước' },
  { value: 'bqck', label: 'Bình quân cuối kỳ' },
  { value: 'specific', label: 'Thực tế đích danh' },
];
const TAX_METHODS = [
  { value: 'accrual', label: 'Phương pháp khấu trừ' },
  { value: 'direct', label: 'Phương pháp trực tiếp' },
  { value: 'hybrid', label: 'Phương pháp hỗn hợp' },
];
const DECISION_OPTIONS = [
  { value: 'c200', label: 'Quyết định 48/2006/QĐ-BTC (C200)' },
  { value: 'c133', label: 'Thông tư 133/2016/TT-BTC (C133)' },
];

export default function CompanyFormModal({ isOpen, onClose, onSubmit, initialData = {}, mode }: CompanyFormModalProps) {
  const [formData, setFormData] = useState<any>({})
  const [activeTab, setActiveTab] = useState<'info'|'accounting'|'firmbanking'|'signature'|'invoice'>('info')
  const [activeInvoiceTab, setActiveInvoiceTab] = useState<'email'|'sms'|'digital-signature'>('email')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showAddBankModal, setShowAddBankModal] = useState(false)
  const [newBankAccount, setNewBankAccount] = useState({
    bankName: '',
    accountNumber: '',
    accountOwner: '',
    branch: ''
  })
  const [showAddSecurityModal, setShowAddSecurityModal] = useState(false)
  const [newSecurityQuestion, setNewSecurityQuestion] = useState({
    question: '',
    answer: ''
  })

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
      <div className="bg-white rounded-xl shadow-xl max-w-5xl w-full max-h-[95vh] overflow-hidden mx-2 sm:mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {mode === 'edit' ? 'Chỉnh sửa công ty' : 'Thêm mới công ty'}
              </h2>
              <p className="text-sm text-gray-500">Cập nhật thông tin và cài đặt công ty</p>
            </div>
          </div>
          <button 
            onClick={closeModal} 
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b bg-white">
          <div className="px-4 sm:px-6">
            <nav className="flex space-x-8 overflow-x-auto scrollbar-hide">
              <button
                onClick={() => setActiveTab('info')}
                className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-all duration-200 flex items-center space-x-2 ${
                  activeTab === 'info' 
                    ? 'border-blue-500 text-blue-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Building2 className="w-4 h-4" />
                <span>Thông tin công ty</span>
              </button>
              <button
                onClick={() => setActiveTab('accounting')}
                className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-all duration-200 flex items-center space-x-2 ${
                  activeTab === 'accounting' 
                    ? 'border-blue-500 text-blue-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Settings className="w-4 h-4" />
                <span>Thiết lập kế toán</span>
              </button>
              <button
                onClick={() => setActiveTab('firmbanking')}
                className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-all duration-200 flex items-center space-x-2 ${
                  activeTab === 'firmbanking' 
                    ? 'border-blue-500 text-blue-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <CreditCard className="w-4 h-4" />
                <span>Firmbanking</span>
              </button>
              <button
                onClick={() => setActiveTab('signature')}
                className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-all duration-200 flex items-center space-x-2 ${
                  activeTab === 'signature' 
                    ? 'border-blue-500 text-blue-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <FileSignature className="w-4 h-4" />
                <span>Chữ ký</span>
              </button>
              <button
                onClick={() => setActiveTab('invoice')}
                className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-all duration-200 flex items-center space-x-2 ${
                  activeTab === 'invoice' 
                    ? 'border-blue-500 text-blue-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Receipt className="w-4 h-4" />
                <span>Hóa đơn</span>
              </button>
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          <div className="h-[calc(95vh-180px)] overflow-y-auto p-4 sm:p-6 bg-gray-50">
            {/* Tab Thông tin công ty */}
            {activeTab === 'info' && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
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
            )}

          {/* Tab Thiết lập kế toán */}
          {activeTab === 'accounting' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 border-b">
                <h3 className="text-lg font-semibold text-blue-800 flex items-center space-x-2">
                  <Settings className="w-5 h-5" />
                  <span>Dữ liệu báo cáo thuế</span>
                </h3>
              </div>
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <span className="text-red-500">*</span> Mã số thuế
                      </label>
                      <input
                        type="text"
                        value={formData.taxCode}
                        onChange={(e) => setFormData({...formData, taxCode: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Loại hình doanh nghiệp
                      </label>
                      <select
                        value={formData.businessType}
                        onChange={(e) => setFormData({...formData, businessType: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="limited">Công ty TNHH</option>
                        <option value="joint-stock">Công ty cổ phần</option>
                        <option value="private">Doanh nghiệp tư nhân</option>
                      </select>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Chi cục thuế quản lý
                      </label>
                      <input
                        type="text"
                        value={formData.taxDepartment}
                        onChange={(e) => setFormData({...formData, taxDepartment: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phương pháp kế toán
                      </label>
                      <select
                        value={formData.accountingMethod}
                        onChange={(e) => setFormData({...formData, accountingMethod: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="accrual">Dồn tích</option>
                        <option value="cash">Tiền mặt</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
              {/* Quyết định/thông tư */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Quyết định/thông tư <span className="text-red-500">*</span></label>
                <select
                  value={formData.settings?.accounting?.decision || ''}
                  onChange={e => setFormData({
                    ...formData,
                    settings: {
                      ...formData.settings!,
                      accounting: {
                        ...formData.settings?.accounting,
                        decision: e.target.value
                      }
                    }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Chọn quyết định/thông tư</option>
                  {DECISION_OPTIONS.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
              {/* 2 cột: Phương pháp tính giá & Phương pháp tính thuế */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phương pháp tính giá <span className="text-red-500">*</span></label>
                  <select
                    value={formData.settings?.accounting?.pricing || ''}
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
                    <option value="">Chọn phương pháp tính giá</option>
                    {PRICING_METHODS.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phương pháp tính thuế <span className="text-red-500">*</span></label>
                  <select
                    value={formData.settings?.accounting?.tax || ''}
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
                    <option value="">Chọn phương pháp tính thuế</option>
                    {TAX_METHODS.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
              </div>
              {/* 2 cột: Phương pháp khóa sổ & Số thập phân */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phương pháp khóa sổ <span className="text-red-500">*</span></label>
                  <div className="flex gap-6 border border-gray-300 rounded px-3 py-2 bg-white">
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="lockMethod"
                        value="basic"
                        checked={formData.settings?.accounting?.lockMethod === 'basic'}
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
                        className="accent-blue-600"
                      />
                      Cơ bản
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="lockMethod"
                        value="sequence"
                        checked={formData.settings?.accounting?.lockMethod === 'sequence'}
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
                        className="accent-blue-600"
                      />
                      Trình tự
                    </label>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Số thập phân <span className="text-red-500">*</span></label>
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
                    {[0,1,2,3,4].map(n => (
                      <option key={n} value={n}>{n}</option>
                    ))}
                  </select>
                </div>
              </div>
              {/* Cài đặt bổ sung */}
              <div className="bg-gray-50 rounded-lg border p-4 mt-2">
                <div className="font-medium text-gray-700 mb-2">Cài đặt bổ sung</div>
                <label className="flex items-center gap-2">
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
                  <span className="text-sm font-medium text-gray-700">Cho phép xuất âm tồn kho</span>
                </label>
              </div>
              {/* Nút lưu */}
              <div className="flex justify-end mt-6">
                <button type="button" onClick={handleSave} className="inline-flex items-center px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200">
                  <Save className="w-5 h-5 mr-2" />
                  Lưu cài đặt
                </button>
              </div>
            </div>
          )}

          {/* Tab Firmbanking */}
          {activeTab === 'firmbanking' && (
            <div className="space-y-6">
              {/* Header và Danh sách tài khoản ngân hàng */}
              <div className="bg-blue-50 rounded-xl p-4 border">
                <div className="flex flex-col sm:flex-row items-center justify-between mb-4">
                  <div className="font-semibold text-blue-800 text-base mb-2 sm:mb-0">Quản lý tài khoản ngân hàng</div>
                  <button 
                    type="button" 
                    onClick={() => setShowAddBankModal(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg flex items-center gap-2"
                  >
                    <span className="text-lg font-bold">+</span> Thêm tài khoản
                  </button>
                </div>
                
                {/* Danh sách tài khoản ngân hàng */}
                {formData.settings?.firmbanking?.bankAccounts && formData.settings.firmbanking.bankAccounts.length > 0 ? (
                  <div className="space-y-4">
                    {formData.settings.firmbanking.bankAccounts.map((account: any, index: number) => (
                      <div key={index} className="bg-white border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 flex-1">
                            <div>
                              <label className="text-xs text-gray-500">Tên ngân hàng</label>
                              <p className="font-medium">{account.bankName}</p>
                            </div>
                            <div>
                              <label className="text-xs text-gray-500">Số tài khoản</label>
                              <p className="font-medium">{account.accountNumber}</p>
                            </div>
                            <div>
                              <label className="text-xs text-gray-500">Tên chủ tài khoản</label>
                              <p className="font-medium">{account.accountOwner}</p>
                            </div>
                            <div>
                              <label className="text-xs text-gray-500">Chi nhánh</label>
                              <p className="font-medium">{account.branch}</p>
                            </div>
                          </div>
                          <button 
                            type="button"
                            onClick={() => {
                              const newAccounts = formData.settings?.firmbanking?.bankAccounts?.filter((_: any, i: number) => i !== index) || [];
                              setFormData({
                                ...formData,
                                settings: {
                                  ...formData.settings!,
                                  firmbanking: {
                                    ...formData.settings?.firmbanking,
                                    bankAccounts: newAccounts
                                  }
                                }
                              });
                            }}
                            className="text-red-500 hover:text-red-700 ml-4"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-gray-500 py-4">Chưa có tài khoản ngân hàng nào</div>
                )}
              </div>

              {/* Modal thêm tài khoản ngân hàng */}
              {showAddBankModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[60]">
                  <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
                    <div className="flex items-center justify-between p-4 border-b border-gray-200">
                      <h3 className="text-lg font-semibold text-gray-900">Thêm tài khoản mới</h3>
                      <button 
                        type="button"
                        onClick={() => setShowAddBankModal(false)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="p-6 space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Tên ngân hàng
                          </label>
                          <input
                            type="text"
                            value={newBankAccount.bankName}
                            onChange={e => setNewBankAccount({...newBankAccount, bankName: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Nhập tên ngân hàng"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Số tài khoản
                          </label>
                          <input
                            type="text"
                            value={newBankAccount.accountNumber}
                            onChange={e => setNewBankAccount({...newBankAccount, accountNumber: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Nhập số tài khoản"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Tên chủ tài khoản
                          </label>
                          <input
                            type="text"
                            value={newBankAccount.accountOwner}
                            onChange={e => setNewBankAccount({...newBankAccount, accountOwner: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Nhập tên chủ tài khoản"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Chi nhánh
                          </label>
                          <input
                            type="text"
                            value={newBankAccount.branch}
                            onChange={e => setNewBankAccount({...newBankAccount, branch: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Nhập chi nhánh"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-end gap-3 p-4 border-t border-gray-200">
                      <button
                        type="button"
                        onClick={() => {
                          if (newBankAccount.bankName && newBankAccount.accountNumber && newBankAccount.accountOwner && newBankAccount.branch) {
                            const currentAccounts = formData.settings?.firmbanking?.bankAccounts || [];
                            setFormData({
                              ...formData,
                              settings: {
                                ...formData.settings!,
                                firmbanking: {
                                  ...formData.settings?.firmbanking,
                                  bankAccounts: [...currentAccounts, newBankAccount]
                                }
                              }
                            });
                            setNewBankAccount({ bankName: '', accountNumber: '', accountOwner: '', branch: '' });
                            setShowAddBankModal(false);
                          }
                        }}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Thêm
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setNewBankAccount({ bankName: '', accountNumber: '', accountOwner: '', branch: '' });
                          setShowAddBankModal(false);
                        }}
                        className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        Hủy
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Email/SĐT nhận OTP */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email nhận OTP</label>
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
                    placeholder="Nhập email nhận OTP"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Số điện thoại nhận OTP</label>
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
                    placeholder="Nhập số điện thoại nhận OTP"
                  />
                </div>
              </div>

              {/* Câu hỏi bảo mật */}
              <div className="bg-gray-50 rounded-xl p-4 border mt-2">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-red-600">
                      <Shield className="w-5 h-5 mr-2 text-red-600" />
                    </span>
                    <span className="font-semibold text-base">Câu hỏi bảo mật</span>
                  </div>
                  <button 
                    type="button" 
                    onClick={() => setShowAddSecurityModal(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg flex items-center gap-2"
                  >
                    <span className="text-lg font-bold">+</span> Thêm câu hỏi
                  </button>
                </div>
                
                {/* Danh sách câu hỏi bảo mật */}
                {formData.settings?.firmbanking?.securityQuestions && formData.settings.firmbanking.securityQuestions.length > 0 ? (
                  <div className="space-y-3">
                    {formData.settings.firmbanking.securityQuestions.map((item: any, index: number) => (
                      <div key={index} className="bg-white border border-gray-200 rounded-lg p-3">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="mb-2">
                              <label className="text-xs text-gray-500">Câu hỏi</label>
                              <p className="font-medium text-sm">{item.question}</p>
                            </div>
                            <div>
                              <label className="text-xs text-gray-500">Câu trả lời</label>
                              <p className="font-medium text-sm">{item.answer}</p>
                            </div>
                          </div>
                          <button 
                            type="button"
                            onClick={() => {
                              const newQuestions = formData.settings?.firmbanking?.securityQuestions?.filter((_: any, i: number) => i !== index) || [];
                              setFormData({
                                ...formData,
                                settings: {
                                  ...formData.settings!,
                                  firmbanking: {
                                    ...formData.settings?.firmbanking,
                                    securityQuestions: newQuestions
                                  }
                                }
                              });
                            }}
                            className="text-red-500 hover:text-red-700 ml-4"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-gray-500 py-4">Chưa có câu hỏi bảo mật nào</div>
                )}

                {/* Modal thêm câu hỏi bảo mật */}
                {showAddSecurityModal && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[60]">
                    <div className="bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-hidden">
                      <div className="flex items-center justify-between p-4 border-b border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900">Thêm câu hỏi bảo mật</h3>
                        <button 
                          type="button"
                          onClick={() => setShowAddSecurityModal(false)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                      <div className="p-6 space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Câu hỏi
                          </label>
                          <select
                            value={newSecurityQuestion.question}
                            onChange={e => setNewSecurityQuestion({...newSecurityQuestion, question: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value="">Chọn câu hỏi</option>
                            <option value="Tên thú cưng đầu tiên?">Tên thú cưng đầu tiên?</option>
                            <option value="Trường học cấp 3?">Trường học cấp 3?</option>
                            <option value="Cuốn sách yêu thích?">Cuốn sách yêu thích?</option>
                            <option value="Tên bạn thân nhất?">Tên bạn thân nhất?</option>
                            <option value="Nơi sinh của bạn?">Nơi sinh của bạn?</option>
                            <option value="Màu sắc yêu thích?">Màu sắc yêu thích?</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Câu trả lời
                          </label>
                          <input
                            type="text"
                            value={newSecurityQuestion.answer}
                            onChange={e => setNewSecurityQuestion({...newSecurityQuestion, answer: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Nhập câu trả lời"
                          />
                        </div>
                      </div>
                      <div className="flex justify-end gap-3 p-4 border-t border-gray-200">
                        <button
                          type="button"
                          onClick={() => {
                            if (newSecurityQuestion.question && newSecurityQuestion.answer) {
                              const currentQuestions = formData.settings?.firmbanking?.securityQuestions || [];
                              setFormData({
                                ...formData,
                                settings: {
                                  ...formData.settings!,
                                  firmbanking: {
                                    ...formData.settings?.firmbanking,
                                    securityQuestions: [...currentQuestions, newSecurityQuestion]
                                  }
                                }
                              });
                              setNewSecurityQuestion({ question: '', answer: '' });
                              setShowAddSecurityModal(false);
                            }
                          }}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          Thêm
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setNewSecurityQuestion({ question: '', answer: '' });
                            setShowAddSecurityModal(false);
                          }}
                          className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          Hủy
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Tab Chữ ký - giao diện giống hình mẫu */}
          {activeTab === 'signature' && (
            <form onSubmit={e => { e.preventDefault(); alert('Đã lưu thiết lập chữ ký số!'); }} className="space-y-6">
              <div className="bg-blue-50 rounded-lg p-4 mb-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Giám đốc</label>
                    <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="Nhập tên giám đốc" value={formData.settings?.signature?.directorName || ''} onChange={e => setFormData({
                      ...formData,
                      settings: {
                        ...formData.settings!,
                        signature: {
                          ...formData.settings?.signature,
                          directorName: e.target.value
                        }
                      }
                    })} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Kế toán trưởng</label>
                    <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="Nhập tên kế toán trưởng" value={formData.settings?.signature?.chiefAccountantName || ''} onChange={e => setFormData({
                      ...formData,
                      settings: {
                        ...formData.settings!,
                        signature: {
                          ...formData.settings?.signature,
                          chiefAccountantName: e.target.value
                        }
                      }
                    })} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Thủ quỹ</label>
                    <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="Nhập tên thủ quỹ" value={formData.settings?.signature?.treasurerName || ''} onChange={e => setFormData({
                      ...formData,
                      settings: {
                        ...formData.settings!,
                        signature: {
                          ...formData.settings?.signature,
                          treasurerName: e.target.value
                        }
                      }
                    })} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Thủ kho</label>
                    <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="Nhập tên thủ kho" value={formData.settings?.signature?.storekeeperName || ''} onChange={e => setFormData({
                      ...formData,
                      settings: {
                        ...formData.settings!,
                        signature: {
                          ...formData.settings?.signature,
                          storekeeperName: e.target.value
                        }
                      }
                    })} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Người lập biểu</label>
                    <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="Nhập tên người lập biểu" value={formData.settings?.signature?.reportMakerName || ''} onChange={e => setFormData({
                      ...formData,
                      settings: {
                        ...formData.settings!,
                        signature: {
                          ...formData.settings?.signature,
                          reportMakerName: e.target.value
                        }
                      }
                    })} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Người kiểm tra</label>
                    <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="Nhập tên người kiểm tra" value={formData.settings?.signature?.inspectorName || ''} onChange={e => setFormData({
                      ...formData,
                      settings: {
                        ...formData.settings!,
                        signature: {
                          ...formData.settings?.signature,
                          inspectorName: e.target.value
                        }
                      }
                    })} />
                  </div>
                </div>
              </div>
              {/* Bảng chức danh và upload chữ ký */}
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Chức vụ</th>
                      <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Chữ ký và dấu (Hình ảnh)</th>
                      <th className="px-4 py-2 text-center text-sm font-semibold text-gray-700">Sử dụng</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { key: 'director', label: 'Giám đốc' },
                      { key: 'chiefAccountant', label: 'Kế toán trưởng' },
                      { key: 'treasurer', label: 'Thủ quỹ' },
                      { key: 'storekeeper', label: 'Thủ kho' },
                      { key: 'reportMaker', label: 'Người lập biểu' },
                      { key: 'inspector', label: 'Người kiểm tra' },
                    ].map(({ key, label }) => (
                      <tr key={key} className="border-t border-gray-100">
                        <td className="px-4 py-2 text-sm text-gray-700">{label}</td>
                        <td className="px-4 py-2 flex items-center gap-2">
                          {formData.settings?.signature?.[`${key}SignUrl`] ? (
                            <span className="text-green-600 text-xs">Đã có</span>
                          ) : (
                            <span className="text-gray-400 text-xs italic">Chưa có</span>
                          )}
                          <label className="inline-flex items-center cursor-pointer">
                            <input type="file" accept="image/*" className="hidden" onChange={e => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onload = ev => {
                                  setFormData({
                                    ...formData,
                                    settings: {
                                      ...formData.settings!,
                                      signature: {
                                        ...formData.settings?.signature,
                                        [`${key}SignUrl`]: ev.target?.result
                                      }
                                    }
                                  });
                                };
                                reader.readAsDataURL(file);
                              }
                            }} />
                            <span className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-xs font-medium ml-2">Upload</span>
                          </label>
                          {formData.settings?.signature?.[`${key}SignUrl`] && (
                            <img src={formData.settings.signature[`${key}SignUrl`]} alt="Chữ ký" className="h-8 ml-2 border rounded shadow" />
                          )}
                        </td>
                        <td className="px-4 py-2 text-center">
                          <input type="checkbox" checked={formData.settings?.signature?.[`${key}Enabled`] ?? true} onChange={e => setFormData({
                            ...formData,
                            settings: {
                              ...formData.settings!,
                              signature: {
                                ...formData.settings?.signature,
                                [`${key}Enabled`]: e.target.checked
                              }
                            }
                          })} className="accent-blue-600 w-5 h-5" />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {/* Checkbox tuỳ chọn */}
              <div className="flex flex-col sm:flex-row gap-4 mt-4">
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={formData.settings?.signature?.printOnAllReports ?? false} onChange={e => setFormData({
                    ...formData,
                    settings: {
                      ...formData.settings!,
                      signature: {
                        ...formData.settings?.signature,
                        printOnAllReports: e.target.checked
                      }
                    }
                  })} className="accent-blue-600 w-5 h-5" />
                  <span className="text-sm text-gray-700">In trên tất cả báo cáo</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={formData.settings?.signature?.autoReportMakerName ?? false} onChange={e => setFormData({
                    ...formData,
                    settings: {
                      ...formData.settings!,
                      signature: {
                        ...formData.settings?.signature,
                        autoReportMakerName: e.target.checked
                      }
                    }
                  })} className="accent-blue-600 w-5 h-5" />
                  <span className="text-sm text-gray-700">Lấy tên người lập chứng từ theo tên người đăng nhập</span>
                </label>
              </div>
              {/* Nút lưu/hủy */}
              <div className="flex justify-end gap-3 mt-6">
                <button type="submit" className="inline-flex items-center px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200">
                  <Save className="w-5 h-5 mr-2" />
                  Lưu
                </button>
                <button type="button" onClick={closeModal} className="inline-flex items-center px-6 py-2 bg-blue-100 text-blue-700 font-medium rounded-md hover:bg-blue-200 focus:outline-none transition-colors duration-200">
                  <X className="w-5 h-5 mr-2" />
                  Hủy
                </button>
              </div>
            </form>
          )}

          {/* Tab Hóa đơn */}
          {activeTab === 'invoice' && (
            <div className="space-y-6">
              {/* Sub-tabs cho Hóa đơn */}
              <div className="border-b border-gray-200">
                <nav className="flex space-x-8">
                  <button
                    onClick={() => setActiveInvoiceTab('email')}
                    className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeInvoiceTab === 'email'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    📧 Thiết lập email gửi hóa đơn
                  </button>
                  <button
                    onClick={() => setActiveInvoiceTab('sms')}
                    className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeInvoiceTab === 'sms'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    📱 Thiết lập SMS gửi hóa đơn
                  </button>
                  <button
                    onClick={() => setActiveInvoiceTab('digital-signature')}
                    className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeInvoiceTab === 'digital-signature'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    🔐 Thiết lập chữ ký số
                  </button>
                </nav>
              </div>

              {/* Tab Thiết lập email gửi hóa đơn */}
              {activeInvoiceTab === 'email' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Nhà cung cấp</label>
                      <input
                        type="text"
                        value={formData.settings?.invoice?.email?.provider || ''}
                        onChange={e => setFormData({
                          ...formData,
                          settings: {
                            ...formData.settings!,
                            invoice: {
                              ...formData.settings?.invoice,
                              email: {
                                ...formData.settings?.invoice?.email,
                                provider: e.target.value
                              }
                            }
                          }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Nhập nhà cung cấp"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Máy chủ Mail <span className="text-red-500">*</span></label>
                      <input
                        type="text"
                        value={formData.settings?.invoice?.email?.mailServer || ''}
                        onChange={e => setFormData({
                          ...formData,
                          settings: {
                            ...formData.settings!,
                            invoice: {
                              ...formData.settings?.invoice,
                              email: {
                                ...formData.settings?.invoice?.email,
                                mailServer: e.target.value
                              }
                            }
                          }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="smtp.gmail.com"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Cổng <span className="text-red-500">*</span></label>
                      <input
                        type="number"
                        value={formData.settings?.invoice?.email?.port || ''}
                        onChange={e => setFormData({
                          ...formData,
                          settings: {
                            ...formData.settings!,
                            invoice: {
                              ...formData.settings?.invoice,
                              email: {
                                ...formData.settings?.invoice?.email,
                                port: e.target.value
                              }
                            }
                          }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="587"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Tên người gửi <span className="text-red-500">*</span></label>
                      <input
                        type="text"
                        value={formData.settings?.invoice?.email?.senderName || ''}
                        onChange={e => setFormData({
                          ...formData,
                          settings: {
                            ...formData.settings!,
                            invoice: {
                              ...formData.settings?.invoice,
                              email: {
                                ...formData.settings?.invoice?.email,
                                senderName: e.target.value
                              }
                            }
                          }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Công ty ABC"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Tên đăng nhập <span className="text-red-500">*</span></label>
                      <input
                        type="text"
                        value={formData.settings?.invoice?.email?.username || ''}
                        onChange={e => setFormData({
                          ...formData,
                          settings: {
                            ...formData.settings!,
                            invoice: {
                              ...formData.settings?.invoice,
                              email: {
                                ...formData.settings?.invoice?.email,
                                username: e.target.value
                              }
                            }
                          }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="username@example.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email gửi <span className="text-red-500">*</span></label>
                      <input
                        type="email"
                        value={formData.settings?.invoice?.email?.senderEmail || ''}
                        onChange={e => setFormData({
                          ...formData,
                          settings: {
                            ...formData.settings!,
                            invoice: {
                              ...formData.settings?.invoice,
                              email: {
                                ...formData.settings?.invoice?.email,
                                senderEmail: e.target.value
                              }
                            }
                          }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="noreply@company.com"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Mật khẩu <span className="text-red-500">*</span></label>
                    <input
                      type="password"
                      value={formData.settings?.invoice?.email?.password || ''}
                      onChange={e => setFormData({
                        ...formData,
                        settings: {
                          ...formData.settings!,
                          invoice: {
                            ...formData.settings?.invoice,
                            email: {
                              ...formData.settings?.invoice?.email,
                              password: e.target.value
                            }
                          }
                        }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Nhập mật khẩu"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phương thức bảo mật</label>
                    <div className="flex gap-6">
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="security"
                          value="none"
                          checked={formData.settings?.invoice?.email?.security === 'none'}
                          onChange={e => setFormData({
                            ...formData,
                            settings: {
                              ...formData.settings!,
                              invoice: {
                                ...formData.settings?.invoice,
                                email: {
                                  ...formData.settings?.invoice?.email,
                                  security: e.target.value
                                }
                              }
                            }
                          })}
                          className="accent-blue-600"
                        />
                        None
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="security"
                          value="ssl"
                          checked={formData.settings?.invoice?.email?.security === 'ssl'}
                          onChange={e => setFormData({
                            ...formData,
                            settings: {
                              ...formData.settings!,
                              invoice: {
                                ...formData.settings?.invoice,
                                email: {
                                  ...formData.settings?.invoice?.email,
                                  security: e.target.value
                                }
                              }
                            }
                          })}
                          className="accent-blue-600"
                        />
                        SSL
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="security"
                          value="tls"
                          checked={formData.settings?.invoice?.email?.security === 'tls'}
                          onChange={e => setFormData({
                            ...formData,
                            settings: {
                              ...formData.settings!,
                              invoice: {
                                ...formData.settings?.invoice,
                                email: {
                                  ...formData.settings?.invoice?.email,
                                  security: e.target.value
                                }
                              }
                            }
                          })}
                          className="accent-blue-600"
                        />
                        TLS
                      </label>
                    </div>
                    <button type="button" className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      Kiểm tra kết nối
                    </button>
                  </div>
                  <div className="flex gap-6">
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="emailService"
                        value="amnote"
                        checked={formData.settings?.invoice?.email?.service === 'amnote'}
                        onChange={e => setFormData({
                          ...formData,
                          settings: {
                            ...formData.settings!,
                            invoice: {
                              ...formData.settings?.invoice,
                              email: {
                                ...formData.settings?.invoice?.email,
                                service: e.target.value
                              }
                            }
                          }
                        })}
                        className="accent-blue-600"
                      />
                      Sử dụng email AMnote
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="emailService"
                        value="gmail"
                        checked={formData.settings?.invoice?.email?.service === 'gmail'}
                        onChange={e => setFormData({
                          ...formData,
                          settings: {
                            ...formData.settings!,
                            invoice: {
                              ...formData.settings?.invoice,
                              email: {
                                ...formData.settings?.invoice?.email,
                                service: e.target.value
                              }
                            }
                          }
                        })}
                        className="accent-blue-600"
                      />
                      Sử dụng gmail AMnote
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="emailService"
                        value="other"
                        checked={formData.settings?.invoice?.email?.service === 'other'}
                        onChange={e => setFormData({
                          ...formData,
                          settings: {
                            ...formData.settings!,
                            invoice: {
                              ...formData.settings?.invoice,
                              email: {
                                ...formData.settings?.invoice?.email,
                                service: e.target.value
                              }
                            }
                          }
                        })}
                        className="accent-blue-600"
                      />
                      Khác
                    </label>
                  </div>
                  <div className="flex justify-end gap-3">
                    <button type="button" className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      Lưu
                    </button>
                    <button type="button" className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
                      Hủy
                    </button>
                  </div>
                </div>
              )}

              {/* Tab Thiết lập SMS gửi hóa đơn */}
              {activeInvoiceTab === 'sms' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Api Key <span className="text-red-500">*</span></label>
                      <input
                        type="text"
                        value={formData.settings?.invoice?.sms?.apiKey || ''}
                        onChange={e => setFormData({
                          ...formData,
                          settings: {
                            ...formData.settings!,
                            invoice: {
                              ...formData.settings?.invoice,
                              sms: {
                                ...formData.settings?.invoice?.sms,
                                apiKey: e.target.value
                              }
                            }
                          }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Nhập API Key"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Secret Key <span className="text-red-500">*</span></label>
                      <input
                        type="text"
                        value={formData.settings?.invoice?.sms?.secretKey || ''}
                        onChange={e => setFormData({
                          ...formData,
                          settings: {
                            ...formData.settings!,
                            invoice: {
                              ...formData.settings?.invoice,
                              sms: {
                                ...formData.settings?.invoice?.sms,
                                secretKey: e.target.value
                              }
                            }
                          }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Nhập Secret Key"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Brand Name <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      value={formData.settings?.invoice?.sms?.brandName || ''}
                      onChange={e => setFormData({
                        ...formData,
                        settings: {
                          ...formData.settings!,
                          invoice: {
                            ...formData.settings?.invoice,
                            sms: {
                              ...formData.settings?.invoice?.sms,
                              brandName: e.target.value
                            }
                          }
                        }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Nhập Brand Name"
                    />
                  </div>
                  <div className="flex justify-end gap-3">
                    <button type="button" className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      Lưu
                    </button>
                    <button type="button" className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
                      Hủy
                    </button>
                  </div>
                </div>
              )}

              {/* Tab Thiết lập chữ ký số */}
              {activeInvoiceTab === 'digital-signature' && (
                <div className="space-y-6">
                  <div className="text-center py-12">
                    <div className="flex justify-center mb-4">
                      <Usb className="w-16 h-16 text-blue-500" />
                    </div>
                    <div className="flex justify-center mb-6">
                      <FileText className="w-16 h-16 text-blue-500" />
                    </div>
                    <div className="flex justify-end gap-3">
                      <button type="button" className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                        Lưu
                      </button>
                      <button type="button" className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
                        Hủy
                      </button>
                    </div>
                  </div>
                </div>
              )}
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
