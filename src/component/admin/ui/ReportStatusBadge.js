const ReportStatusBadge = ({ status }) => {
  const statusStyles = {
    PENDING: 'bg-yellow-100 text-yellow-800',
    RESOLVED: 'bg-green-100 text-green-800',
    REJECTED: 'bg-red-100 text-red-800',
    BANNED: 'bg-purple-100 text-purple-800',
  };

  return (
    <span className={`px-3 py-1 rounded-full text-sm ${statusStyles[status]}`}>
      {status}
    </span>
  );
};

export default ReportStatusBadge;