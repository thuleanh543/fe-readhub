const NotificationBadge = ({ count }) => {
  if (!count) return null;
  return (
    <span className="absolute -top-1 -right-1 px-2 py-1 text-xs font-bold text-white bg-red-500 rounded-full">
      {count > 99 ? '99+' : count}
    </span>
  );
};

export default NotificationBadge;