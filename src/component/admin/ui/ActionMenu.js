import React, { useState, useEffect } from 'react';
import { Flag, Check, X, AlertCircle, Clock, Ban, Bell } from 'lucide-react';
import { toast } from 'react-toastify';
import { format } from 'date-fns';

const ActionMenu = ({ onSelect }) => {
  const actions = [
    { id: 'dismiss', label: 'Dismiss Report', icon: <X className="w-4 h-4" /> },
    { id: 'warn', label: 'Warn User', icon: <AlertCircle className="w-4 h-4" /> },
    { id: 'ban_1h', label: 'Ban Forum Creation (1h)', icon: <Clock className="w-4 h-4" /> },
    { id: 'ban_3h', label: 'Ban Forum Creation (3h)', icon: <Clock className="w-4 h-4" /> },
    { id: 'ban_24h', label: 'Ban Forum Creation (24h)', icon: <Clock className="w-4 h-4" /> },
    { id: 'ban_permanent', label: 'Permanent Ban', icon: <Ban className="w-4 h-4" /> },
  ];

  return (
    <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
      <div className="py-1" role="menu">
        {actions.map((action) => (
          <button
            key={action.id}
            onClick={() => onSelect(action.id)}
            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            role="menuitem"
          >
            {action.icon}
            <span className="ml-2">{action.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ActionMenu;
