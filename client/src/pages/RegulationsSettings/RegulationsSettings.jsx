import { useState, useEffect } from 'react';
import { LuSettings, LuPlus, LuPencil } from 'react-icons/lu';
import { toast } from 'react-toastify';
import api from '../../services/api';
import PageHeader from '../../components/ui/PageHeader';
import Button from '../../components/ui/Button';
import RegulationFormModal from './RegulationFormModal';

export default function RegulationsSettings() {
  const [savingsTypes, setSavingsTypes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingType, setEditingType] = useState(null);

  const fetchSavingsTypes = async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/savings-type');
      
      const rawData = res.data?.data || res.data || res || [];
      const dataArray = Array.isArray(rawData) ? rawData : [];
      
      // Sắp xếp tự động: Không kỳ hạn lên đầu
      const sorted = [...dataArray].sort((a, b) => (a.termMonths || 0) - (b.termMonths || 0));
      setSavingsTypes(sorted);
    } catch (error) {
      console.error("Lỗi tải danh sách:", error);
      toast.error('Không thể tải danh sách quy định.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSavingsTypes();
  }, []);

  const handleEdit = (type) => {
    setEditingType(type);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setEditingType(null);
    setIsModalOpen(true);
  };

  const handleSuccess = () => {
    setIsModalOpen(false);
    fetchSavingsTypes();
  };

  return (
    <div className="p-6 relative">
      {/* --- HEADER --- */}
      <PageHeader
        icon={LuSettings}
        title="Cài đặt Quy định"
        badge="QĐ6"
        subtitle="Quản lý tham số và các loại sổ tiết kiệm hiện hành"
        action={
          <Button icon={<LuPlus size={15} />} onClick={handleAdd}>
            Thêm quy định mới
          </Button>
        }
      />


      {/* --- BODY --- */}
      {isLoading ? (
        <div className="flex flex-col justify-center items-center py-32 space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-200 border-t-blue-600"></div>
          <p className="text-gray-400 text-sm font-medium animate-pulse">Đang tải dữ liệu hệ thống...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {savingsTypes.length > 0 ? (
            savingsTypes.map((type) => (
              <div 
                key={type.id} 
                className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col"
              >
                {/* Card Header */}
                <div className="flex justify-between items-start mb-5">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-lg font-bold text-gray-800">{type.name}</h3>
                      {/* Trạng thái dạng Dot thanh lịch */}
                      <span className={`flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border ${type.isActive ? 'bg-green-50 text-green-700 border-green-100' : 'bg-gray-50 text-gray-500 border-gray-200'}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${type.isActive ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                        {type.isActive ? 'Hoạt động' : 'Tạm ngưng'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">
                      {type.termMonths === 0 ? 'Loại: Không kỳ hạn' : `Loại: Tiết kiệm có kỳ hạn (${type.termMonths} tháng)`}
                    </p>
                  </div>
                </div>

                {/* Card Data - Dạng danh sách kẻ ngang Clean UI */}
                <div className="space-y-1 flex-1">
                  <div className="flex justify-between items-center py-2.5 border-b border-gray-50">
                    <span className="text-sm text-gray-500">Lãi suất áp dụng</span>
                    <span className="text-sm font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100/50">
                      {type.interestRate}% / năm
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center py-2.5 border-b border-gray-50">
                    <span className="text-sm text-gray-500">Mở sổ tối thiểu</span>
                    <span className="text-sm font-semibold text-gray-800">{Number(type.minInitDeposit || 0).toLocaleString('vi-VN')} đ</span>
                  </div>

                  <div className="flex justify-between items-center py-2.5 border-b border-gray-50">
                    <span className="text-sm text-gray-500">Gửi thêm tối thiểu</span>
                    <span className="text-sm font-semibold text-gray-800">{Number(type.minAddDeposit || 0).toLocaleString('vi-VN')} đ</span>
                  </div>

                  <div className="flex justify-between items-center py-2.5 border-b border-gray-50">
                    <span className="text-sm text-gray-500">Quy định rút tiền</span>
                    <span className="text-sm font-semibold text-gray-800">
                      {type.termMonths === 0 ? `Giữ tối thiểu ${type.minWithdrawDays || 0} ngày` : 'Rút khi đáo hạn'}
                    </span>
                  </div>
                </div>

                {/* Card Action */}
                <div className="mt-6">
                  <Button 
                    onClick={() => handleEdit(type)} 
                    className='w-full'
                  >
                    <LuPencil size={16} /> Chỉnh sửa cấu hình
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full bg-white border border-gray-200 border-dashed rounded-2xl p-16 text-center">
              <div className="w-16 h-16 bg-gray-50 text-gray-400 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-100">
                <LuSettings size={32} />
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-1">Chưa có quy định nào</h3>
              <p className="text-sm text-gray-500">Hệ thống chưa có loại sổ tiết kiệm nào. Hãy thêm mới để bắt đầu.</p>
            </div>
          )}
        </div>
      )}

      <RegulationFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleSuccess}
        editingType={editingType}
      />
    </div>
  );
}