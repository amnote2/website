"use client"

import React, { useState, useCallback, useEffect } from "react"
import { X, Save, Loader2, AlertCircle, Info } from "lucide-react"
import type { Customer } from "@/types/customer"

interface CustomerFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: Customer) => Promise<void> | void
  initialData?: Customer
  mode: "add" | "edit"
}

export default function CustomerFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialData = {} as Customer,
  mode,
}: CustomerFormModalProps) {
  const [formData, setFormData] = useState<Partial<Customer>>({})
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (isOpen) {
      if (mode === "edit" && initialData) {
        setFormData(initialData)
      } else {
        setFormData({
          nameVi: "",
          nameEn: "",
          nameKo: "",
          buyerName: "",
          customerUserCode: "",
          customerType: "",
          categoryCode: "",
          taxCode: "",
          email: "",
          tel: "",
          fax: "",
          ownerName: "",
          businessType: "",
          kindBusiness: "",
          zipCode: "",
          address: "",
          notes: "",
        })
      }
      setErrors({})
    }
  }, [isOpen, mode, initialData])

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {}

    if (!formData.nameVi?.trim()) {
      newErrors.nameVi = "Tên khách hàng (Tiếng Việt) là bắt buộc"
    }

    if (!formData.customerType?.trim()) {
      newErrors.customerType = "Loại khách hàng là bắt buộc"
    } else if (!/^[0-9]$/.test(formData.customerType)) {
      newErrors.customerType = "Loại khách hàng chỉ được chứa một chữ số"
    }

    if (!formData.categoryCode?.trim()) {
      newErrors.categoryCode = "Mã danh mục là bắt buộc"
    } else if (!/^[0-9]$/.test(formData.categoryCode)) {
      newErrors.categoryCode = "Mã danh mục chỉ được chứa một chữ số"
    }

    if (!formData.taxCode?.trim()) {
      newErrors.taxCode = "Mã số thuế là bắt buộc"
    } else if (!/^[0-9]{10}$/.test(formData.taxCode)) {
      newErrors.taxCode = "Mã số thuế phải là 10 chữ số"
    }

    if (!formData.address?.trim()) {
      newErrors.address = "Địa chỉ là bắt buộc"
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Email không đúng định dạng"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      if (!validateForm()) return

      setIsSubmitting(true)
      try {
        await onSubmit(formData as Customer)
        onClose()
      } catch (error) {
        console.error("Form submission error:", error)
      } finally {
        setIsSubmitting(false)
      }
    },
    [formData, onSubmit, onClose],
  )

  const handleClose = useCallback(() => {
    if (!isSubmitting) {
      onClose()
    }
  }, [isSubmitting, onClose])

  const handleInputChange = (field: keyof Customer, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h3 className="text-xl font-semibold text-gray-900">
              {mode === "add" ? "Thêm khách hàng mới" : "Chỉnh sửa thông tin khách hàng"}
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              {mode === "add" ? "Nhập thông tin khách hàng mới" : "Cập nhật thông tin khách hàng"}
            </p>
          </div>
          <button
            onClick={handleClose}
            disabled={isSubmitting}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Thông tin cơ bản */}
          <div className="space-y-4">
            <h4 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
              Thông tin cơ bản
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tên khách hàng (Tiếng Việt) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.nameVi || ""}
                  onChange={(e) => handleInputChange("nameVi", e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.nameVi ? "border-red-300 bg-red-50" : "border-gray-300"
                  }`}
                  placeholder="Nhập tên tiếng Việt"
                />
                {errors.nameVi && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle size={14} className="mr-1" />
                    {errors.nameVi}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tên khách hàng (Tiếng Anh)
                </label>
                <input
                  type="text"
                  value={formData.nameEn || ""}
                  onChange={(e) => handleInputChange("nameEn", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Nhập tên tiếng Anh"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tên khách hàng (Tiếng Hàn)
                </label>
                <input
                  type="text"
                  value={formData.nameKo || ""}
                  onChange={(e) => handleInputChange("nameKo", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Nhập tên tiếng Hàn"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tên người mua
                </label>
                <input
                  type="text"
                  value={formData.buyerName || ""}
                  onChange={(e) => handleInputChange("buyerName", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Nhập tên người mua"
                />
              </div>
            </div>
          </div>

          {/* Thông tin phân loại */}
          <div className="space-y-4">
            <h4 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
              Thông tin phân loại
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Loại khách hàng <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.customerType || ""}
                  onChange={(e) => handleInputChange("customerType", e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.customerType ? "border-red-300 bg-red-50" : "border-gray-300"
                  }`}
                  placeholder="1 (Nội địa), 2 (Nước ngoài)"
                  maxLength={1}
                />
                {errors.customerType && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle size={14} className="mr-1" />
                    {errors.customerType}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mã danh mục <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.categoryCode || ""}
                  onChange={(e) => handleInputChange("categoryCode", e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.categoryCode ? "border-red-300 bg-red-50" : "border-gray-300"
                  }`}
                  placeholder="Mã danh mục"
                  maxLength={1}
                />
                {errors.categoryCode && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle size={14} className="mr-1" />
                    {errors.categoryCode}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mã người dùng KH
                </label>
                <input
                  type="text"
                  value={formData.customerUserCode || ""}
                  onChange={(e) => handleInputChange("customerUserCode", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Mã người dùng khách hàng"
                />
              </div>
            </div>
          </div>

          {/* Thông tin liên lạc */}
          <div className="space-y-4">
            <h4 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
              Thông tin liên lạc
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mã số thuế <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.taxCode || ""}
                  onChange={(e) => handleInputChange("taxCode", e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.taxCode ? "border-red-300 bg-red-50" : "border-gray-300"
                  }`}
                  placeholder="Nhập mã số thuế (10 chữ số)"
                  maxLength={10}
                />
                {errors.taxCode && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle size={14} className="mr-1" />
                    {errors.taxCode}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email || ""}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.email ? "border-red-300 bg-red-50" : "border-gray-300"
                  }`}
                  placeholder="Nhập địa chỉ email"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle size={14} className="mr-1" />
                    {errors.email}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Số điện thoại
                </label>
                <input
                  type="tel"
                  value={formData.tel || ""}
                  onChange={(e) => handleInputChange("tel", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Nhập số điện thoại"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fax
                </label>
                <input
                  type="text"
                  value={formData.fax || ""}
                  onChange={(e) => handleInputChange("fax", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Nhập số Fax"
                />
              </div>
            </div>
          </div>

          {/* Thông tin kinh doanh */}
          <div className="space-y-4">
            <h4 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
              Thông tin kinh doanh
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tên chủ sở hữu
                </label>
                <input
                  type="text"
                  value={formData.ownerName || ""}
                  onChange={(e) => handleInputChange("ownerName", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Nhập tên chủ sở hữu"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Loại hình kinh doanh
                </label>
                <input
                  type="text"
                  value={formData.businessType || ""}
                  onChange={(e) => handleInputChange("businessType", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Nhập loại hình kinh doanh"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ngành nghề kinh doanh
                </label>
                <input
                  type="text"
                  value={formData.kindBusiness || ""}
                  onChange={(e) => handleInputChange("kindBusiness", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Nhập ngành nghề kinh doanh"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mã bưu chính
                </label>
                <input
                  type="text"
                  value={formData.zipCode || ""}
                  onChange={(e) => handleInputChange("zipCode", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Nhập mã bưu chính"
                />
              </div>
            </div>
          </div>

          {/* Địa chỉ và ghi chú */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Địa chỉ <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.address || ""}
                onChange={(e) => handleInputChange("address", e.target.value)}
                rows={3}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.address ? "border-red-300 bg-red-50" : "border-gray-300"
                }`}
                placeholder="Nhập địa chỉ"
              />
              {errors.address && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle size={14} className="mr-1" />
                  {errors.address}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ghi chú
              </label>
              <textarea
                value={formData.notes || ""}
                onChange={(e) => handleInputChange("notes", e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Nhập ghi chú (tùy chọn)"
              />
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-4 p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={handleClose}
            disabled={isSubmitting}
            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Hủy
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>Đang lưu...</span>
              </>
            ) : (
              <>
                <Save size={16} />
                <span>{mode === "add" ? "Thêm mới" : "Cập nhật"}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}