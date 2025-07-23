"use client"

import React, { useState, useCallback, useEffect } from "react"
import { X, Save, Loader2, AlertCircle, Info } from "lucide-react"

interface DoiTuongTapHopChiPhi {
  id: string
  code: string
  nameVi: string
  nameEn: string
  nameKo: string
  parentObject: string
  notes: string
  createdDate: string
  status: "active" | "inactive"
}

interface CostCenterFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: DoiTuongTapHopChiPhi) => Promise<void> | void
  initialData?: DoiTuongTapHopChiPhi
  mode: "add" | "edit"
  existingData?: DoiTuongTapHopChiPhi[]
}

export default function CostCenterFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialData = {} as DoiTuongTapHopChiPhi,
  mode,
  existingData = [],
}: CostCenterFormModalProps) {
  const [formData, setFormData] = useState<Partial<DoiTuongTapHopChiPhi>>({})
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (isOpen) {
      if (mode === "edit" && initialData) {
        setFormData(initialData)
      } else {
        setFormData({
          code: "",
          nameVi: "",
          nameEn: "",
          nameKo: "",
          parentObject: "0",
          notes: "",
          status: "active",
        })
      }
      setErrors({})
    }
  }, [isOpen, mode, initialData])

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {}

    if (!formData.code?.trim()) {
      newErrors.code = "Mã đối tượng là bắt buộc"
    } else if (!/^[A-Z0-9]+$/.test(formData.code)) {
      newErrors.code = "Mã đối tượng chỉ được chứa chữ cái viết hoa và số"
    } else {
      // Check for duplicate codes
      const duplicateItem = existingData.find((item) => item.code === formData.code && item.id !== formData.id)
      if (duplicateItem) {
        newErrors.code = `Mã đối tượng "${formData.code}" đã tồn tại trong hệ thống`
      }
    }

    if (!formData.nameVi?.trim()) {
      newErrors.nameVi = "Tên tiếng Việt là bắt buộc"
    }

    if (formData.parentObject && formData.parentObject !== "0") {
      // Check if parent exists
      const parentExists = existingData.find((item) => item.id === formData.parentObject)
      if (!parentExists) {
        newErrors.parentObject = "Đối tượng gốc được chọn không tồn tại"
      }

      // Prevent self-reference
      if (formData.parentObject === formData.id) {
        newErrors.parentObject = "Không thể chọn chính mình làm đối tượng gốc"
      }
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
        await onSubmit(formData as DoiTuongTapHopChiPhi)
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

  const handleInputChange = (field: keyof DoiTuongTapHopChiPhi, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  // Prepare parent options
  const parentOptions = [
    { value: "0", label: "Không có cha (đối tượng gốc)" },
    ...existingData
      .filter((item) => item.id !== formData.id)
      .map((item) => ({
        value: item.id,
        label: `${item.code} - ${item.nameVi}`,
      })),
  ]

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h3 className="text-xl font-semibold text-gray-900">
              {mode === "add" ? "Thêm đối tượng tập hợp chi phí" : "Chỉnh sửa đối tượng tập hợp chi phí"}
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              {mode === "add" ? "Nhập thông tin đối tượng mới" : "Cập nhật thông tin đối tượng"}
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mã đối tượng <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.code || ""}
                onChange={(e) => handleInputChange("code", e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.code ? "border-red-300 bg-red-50" : "border-gray-300"
                }`}
                placeholder="Ví dụ: CC001"
              />
              {errors.code && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle size={14} className="mr-1" />
                  {errors.code}
                </p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                Mã đối tượng chỉ được chứa chữ cái viết hoa và số
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tên tiếng Việt <span className="text-red-500">*</span>
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
                Tên tiếng Anh
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
                Tên tiếng Hàn
              </label>
              <input
                type="text"
                value={formData.nameKo || ""}
                onChange={(e) => handleInputChange("nameKo", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Nhập tên tiếng Hàn"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Đối tượng gốc
              </label>
              <select
                value={formData.parentObject || "0"}
                onChange={(e) => handleInputChange("parentObject", e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.parentObject ? "border-red-300 bg-red-50" : "border-gray-300"
                }`}
              >
                {parentOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {errors.parentObject && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle size={14} className="mr-1" />
                  {errors.parentObject}
                </p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                Chọn đối tượng cha (để trống nếu là đối tượng gốc)
              </p>
            </div>

            <div className="md:col-span-2">
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