"use client"

import React, { useState, useCallback, useEffect } from "react"
import { X, Save, Loader2, AlertCircle, Info } from "lucide-react"

interface BankAccount {
  id: string
  bankCode: string
  bankName: string
  accountNumber: string
  accountName: string
  balance: number
  createdDate: string
}

interface BankFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: BankAccount) => Promise<void> | void
  initialData?: BankAccount
  mode: "add" | "edit"
}

const bankOptions = [
  { value: "Vietcombank", label: "Ngân hàng TMCP Ngoại thương Việt Nam (Vietcombank)" },
  { value: "BIDV", label: "Ngân hàng TMCP Đầu tư và Phát triển Việt Nam (BIDV)" },
  { value: "Agribank", label: "Ngân hàng Nông nghiệp và Phát triển Nông thôn Việt Nam (Agribank)" },
  { value: "Techcombank", label: "Ngân hàng TMCP Kỹ thương Việt Nam (Techcombank)" },
  { value: "VPBank", label: "Ngân hàng TMCP Việt Nam Thịnh vượng (VPBank)" },
  { value: "ACB", label: "Ngân hàng TMCP Á Châu (ACB)" },
  { value: "MBBank", label: "Ngân hàng TMCP Quân đội (MBBank)" },
  { value: "Sacombank", label: "Ngân hàng TMCP Sài Gòn Thương tín (Sacombank)" },
]

export default function BankFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialData = {} as BankAccount,
  mode,
}: BankFormModalProps) {
  const [formData, setFormData] = useState<Partial<BankAccount>>({})
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (isOpen) {
      if (mode === "edit" && initialData) {
        setFormData(initialData)
      } else {
        setFormData({
          bankCode: "",
          bankName: "",
          accountNumber: "",
          accountName: "",
          balance: 0,
        })
      }
      setErrors({})
    }
  }, [isOpen, mode, initialData])

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {}

    if (!formData.bankCode?.trim()) {
      newErrors.bankCode = "Mã ngân hàng là bắt buộc"
    } else if (!/^[A-Z0-9]+$/.test(formData.bankCode)) {
      newErrors.bankCode = "Mã ngân hàng chỉ được chứa chữ cái viết hoa và số"
    }

    if (!formData.bankName?.trim()) {
      newErrors.bankName = "Tên ngân hàng là bắt buộc"
    }

    if (!formData.accountNumber?.trim()) {
      newErrors.accountNumber = "Số tài khoản là bắt buộc"
    } else if (!/^[0-9]+$/.test(formData.accountNumber)) {
      newErrors.accountNumber = "Số tài khoản chỉ được chứa số"
    } else if (formData.accountNumber.length < 8 || formData.accountNumber.length > 20) {
      newErrors.accountNumber = "Số tài khoản phải từ 8-20 ký tự"
    }

    if (!formData.accountName?.trim()) {
      newErrors.accountName = "Tên tài khoản là bắt buộc"
    }

    if (formData.balance !== undefined && formData.balance < 0) {
      newErrors.balance = "Số dư không được âm"
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
        await onSubmit(formData as BankAccount)
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

  const handleInputChange = (field: keyof BankAccount, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h3 className="text-xl font-semibold text-gray-900">
              {mode === "add" ? "Thêm tài khoản ngân hàng" : "Chỉnh sửa tài khoản ngân hàng"}
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              {mode === "add" ? "Nhập thông tin tài khoản ngân hàng mới" : "Cập nhật thông tin tài khoản ngân hàng"}
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
                Mã ngân hàng <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.bankCode || ""}
                onChange={(e) => handleInputChange("bankCode", e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.bankCode ? "border-red-300 bg-red-50" : "border-gray-300"
                }`}
                placeholder="Ví dụ: VCB001"
              />
              {errors.bankCode && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle size={14} className="mr-1" />
                  {errors.bankCode}
                </p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                Mã ngân hàng chỉ được chứa chữ cái viết hoa và số
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tên ngân hàng <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.bankName || ""}
                onChange={(e) => handleInputChange("bankName", e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.bankName ? "border-red-300 bg-red-50" : "border-gray-300"
                }`}
              >
                <option value="">Chọn ngân hàng</option>
                {bankOptions.map((bank) => (
                  <option key={bank.value} value={bank.value}>
                    {bank.label}
                  </option>
                ))}
              </select>
              {errors.bankName && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle size={14} className="mr-1" />
                  {errors.bankName}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Số tài khoản <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.accountNumber || ""}
                onChange={(e) => handleInputChange("accountNumber", e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.accountNumber ? "border-red-300 bg-red-50" : "border-gray-300"
                }`}
                placeholder="Nhập số tài khoản"
              />
              {errors.accountNumber && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle size={14} className="mr-1" />
                  {errors.accountNumber}
                </p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                Số tài khoản chỉ được chứa số, từ 8-20 ký tự
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tên tài khoản <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.accountName || ""}
                onChange={(e) => handleInputChange("accountName", e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.accountName ? "border-red-300 bg-red-50" : "border-gray-300"
                }`}
                placeholder="Nhập tên tài khoản"
              />
              {errors.accountName && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle size={14} className="mr-1" />
                  {errors.accountName}
                </p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Số dư (VND)
              </label>
              <input
                type="number"
                value={formData.balance || 0}
                onChange={(e) => handleInputChange("balance", Number(e.target.value))}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.balance ? "border-red-300 bg-red-50" : "border-gray-300"
                }`}
                placeholder="0"
                min="0"
              />
              {errors.balance && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle size={14} className="mr-1" />
                  {errors.balance}
                </p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                Số dư hiện tại của tài khoản
              </p>
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