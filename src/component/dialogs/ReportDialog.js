import { useState } from "react";

const ReportDialog = ({ isOpen, onClose, onSubmit }) => {
  const [selectedReason, setSelectedReason] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [isReporting, setIsReporting] = useState(false);

  const REPORT_REASONS = [
    { value: 'INAPPROPRIATE_CONTENT', label: 'Inappropriate book forum content' },
    // Nội dung không phù hợp với sách

    { value: 'ADULT_CONTENT', label: 'Adult/NSFW content' },
    // Chứa nội dung người lớn/đồi trụy

    { value: 'SPAM', label: 'Spam/Advertising' },
    // Spam/Quảng cáo

    { value: 'HATE_SPEECH', label: 'Hate speech/Discrimination' },
    // Ngôn từ thù ghét/phân biệt đối xử

    { value: 'VIOLENCE', label: 'Violence/Dangerous content' },
    // Bạo lực/Nguy hiểm

    { value: 'COPYRIGHT', label: 'Copyright violation' },
    // Vi phạm bản quyền

    { value: 'HARASSMENT', label: 'Harassment/Threats' },
    // Quấy rối/Đe dọa người dùng khác

    { value: 'MISINFORMATION', label: 'False information about books/authors' },
    // Thông tin sai lệch về sách/tác giả

    { value: 'OFF_TOPIC', label: 'Irrelevant to books/reading' },
    // Nội dung không liên quan đến sách

    { value: 'TROLLING', label: 'Trolling/Disrupting discussions' },
    // Phá rối/Gây rối cuộc thảo luận

    { value: 'IMPERSONATION', label: 'Impersonating others' },
    // Mạo danh người khác

    { value: 'PERSONAL_INFO', label: 'Sharing personal information' },
    // Chia sẻ thông tin cá nhân

    { value: 'OTHER', label: 'Other reasons' }
    // Lý do khác
 ];

  const handleSubmit = async () => {
    if (!selectedReason) return;
    try {
      setIsReporting(true);
      await onSubmit({
        reason: selectedReason,
        additionalInfo: selectedReason === 'OTHER' ? additionalInfo : null
      });
      setIsReporting(false);
      onClose();
    } catch (error) {
      setIsReporting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96 max-h-[90vh] overflow-y-auto">
        <h3 className="text-lg font-bold mb-4">Report forum</h3>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select a reason
          </label>
          <select
            value={selectedReason}
            onChange={(e) => setSelectedReason(e.target.value)}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500">
            <option value="">-- Select a reason --</option>
            {REPORT_REASONS.map(reason => (
              <option key={reason.value} value={reason.value}>
                {reason.label}
              </option>
            ))}
          </select>
        </div>

        {selectedReason === 'OTHER' && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Additional information
            </label>
            <textarea
              value={additionalInfo}
              onChange={(e) => setAdditionalInfo(e.target.value)}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
              rows="4"
              placeholder="Vui lòng mô tả chi tiết lý do báo cáo..."
            />
          </div>
        )}

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!selectedReason || isReporting}
            className={`px-4 py-2 rounded ${
              selectedReason && !isReporting
                ? 'bg-red-600 text-white hover:bg-red-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {isReporting ? 'Reporting...' : 'Sent report'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportDialog;