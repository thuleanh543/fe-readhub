import React, { useState, useEffect, useRef, useCallback } from 'react';
import { getToken, onMessage } from 'firebase/messaging';
import { messaging } from '../../../config/firebase'; // Import từ file config
import {
  Bell,
  Flag,
  AlertTriangle,
  Ban,
  MessageCircle,
  UserPlus,
  X,
  Check,
  ExternalLink
} from 'lucide-react';
import { format } from 'date-fns';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast, Slide, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../css/NotificationDropdown.css';
import axios from 'axios';

const useNotificationCount = () => {
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchUnreadCount = useCallback(async () => {
    try {
      const response = await axios.get(
        'http://localhost:8080/api/v1/notifications/unread-notifications-count',
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      if (response.data.success) {
        setUnreadCount(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  }, []);

  useEffect(() => {
    fetchUnreadCount();
    const unsubscribe = onMessage(messaging, (payload) => {
      setUnreadCount(prev => prev + 1);
    });

    return () => {
      unsubscribe();
    };
  }, [fetchUnreadCount]);

  return [unreadCount, setUnreadCount, fetchUnreadCount];
};

const getNotificationLink = (notification) => {
  switch (notification.type) {
    case 'FORUM_REPORT':
      return '/admin/forum-reports';
    case 'USER_BANNED':
      return `/admin/users/${notification.data.userId}`;
    case 'NEW_COMMENT':
      return `/forums/${notification.data.forumId}`;
    case 'NEW_MEMBER':
      return `/forums/${notification.data.forumId}/members`;
    default:
      return null;
  }
};

const NotificationDropdown = () => {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount, refreshUnreadCount] = useNotificationCount();
  const dropdownRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const userId = localStorage.getItem('userId');
  const navigate = useNavigate();

  useEffect(() => {
    const initializeNotifications = async () => {
      try {
        setLoading(true);

        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
          const unsubscribe = onMessage(messaging, (payload) => {
            console.log('Received foreground message:', payload);

            const newNotification = {
              id: Date.now().toString(),
              title: payload.notification.title,
              message: payload.notification.body,
              type: payload.data?.type || 'DEFAULT',
              data: payload.data || {},
              createdAt: new Date().toISOString(),
              read: false
            };

            // Show toast notification
            toast(
              <div
                onClick={() => {
                  const link = getNotificationLink(newNotification);
                  if (link) navigate(link);
                }}
                className="cursor-pointer"
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-1">
                    {getNotificationIcon(newNotification.type)}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm mb-1">
                      {newNotification.title}
                    </h4>
                    <p className="text-sm opacity-90">
                      {newNotification.message}
                    </p>
                  </div>
                </div>
              </div>,
              {
                containerId: "root",
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                className: `toast-notification ${getToastClassName(newNotification.type)}`,
                icon: false,
              }
            );

            setNotifications(prev => [newNotification, ...prev]);
            setUnreadCount(prev => prev + 1);
          });

          return () => {
            unsubscribe();
          };
        }
      } catch (error) {
        console.error('Error initializing notifications:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeNotifications();
  }, [navigate]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/notifications`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        console.log('API Response:', data);
        setNotifications(data.data);
        setUnreadCount(data.data.filter(n => !n.read).length);
      }
    } catch (error) {
      console.error('Error loading notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/notifications/${notificationId}/read`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      if (response.ok) {
        setNotifications(prev =>
          prev.map(notification =>
            notification.id === notificationId
              ? { ...notification, read: true }
              : notification
          )
        );
        refreshUnreadCount();
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/notifications/mark-all-read`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      if (response.ok) {
        setNotifications(prev =>
          prev.map(notification => ({ ...notification, read: true }))
        );
        setUnreadCount(0);
      }
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'FORUM_REPORT':
        return <Flag className="w-5 h-5 text-red-500" />;
      case 'WARNING':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'USER_BANNED':
        return <Ban className="w-5 h-5 text-purple-500" />;
      case 'NEW_COMMENT':
        return <MessageCircle className="w-5 h-5 text-blue-500" />;
      case 'NEW_MEMBER':
        return <UserPlus className="w-5 h-5 text-green-500" />;
      default:
        return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  const getNotificationLink = (notification) => {
    switch (notification.type) {
      case 'FORUM_REPORT':
        return `/admin/forum-reports`;
      case 'USER_BANNED':
        return `/admin/users/${notification.data.userId}`;
      case 'NEW_COMMENT':
        return `/forums/${notification.data.forumId}`;
      case 'NEW_MEMBER':
        return `/forum-discussion/${notification.data.forumId}`;
      default:
        return null;
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadNotifications();
    }
  }, [isOpen]);

  const getToastClassName = (type) => {
    switch (type) {
      case 'FORUM_REPORT':
        return 'bg-red-50 border-l-4 border-red-500';
      case 'WARNING':
        return 'bg-yellow-50 border-l-4 border-yellow-500';
      case 'USER_BANNED':
        return 'bg-purple-50 border-l-4 border-purple-500';
      case 'NEW_COMMENT':
        return 'bg-blue-50 border-l-4 border-blue-500';
      case 'NEW_MEMBER':
        return 'bg-green-50 border-l-4 border-green-500';
      default:
        return 'bg-gray-50 border-l-4 border-gray-500';
    }
  };

  const handleNotificationClick = (notification) => {
    if (!notification.read) {
      markAsRead(notification.id);
    }
    const link = getNotificationLink(notification);
    if (link) {
      navigate(link);
      setIsOpen(false);
    }
  };

  return (
    <><div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-full"
      >
        <Bell className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs flex items-center justify-center rounded-full">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-xl z-50 border border-gray-200"
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Notification</h3>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-sm text-blue-600 hover:text-blue-800"
                    title="Đánh dấu tất cả là đã đọc"
                  >
                    <Check className="w-5 h-5" />
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="overflow-y-auto max-h-96">
              {loading ? (
                <div className="flex justify-center items-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
                </div>
              ) : notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-gray-500">
                  <Bell className="w-12 h-12 mb-2" />
                  <p>No have notifications</p>
                </div>
              ) : (
                notifications.map((notification) => {
                  const notificationLink = getNotificationLink(notification);
                  const NotificationWrapper = notificationLink ? Link : 'div';
                  const wrapperProps = notificationLink ? { to: notificationLink } : {};

                  return (
                    <NotificationWrapper
                      key={notification.id}
                      {...wrapperProps}
                      className={`p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors block
                        ${!notification.read ? 'bg-blue-50' : ''}`}
                        onClick={() => handleNotificationClick(notification)}
                    >
                      <div className="flex gap-3">
                        <div className="flex-shrink-0 mt-1">
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <p className="text-sm font-semibold text-gray-900">
                              {notification.title}
                            </p>
                            <span className="text-xs text-gray-500">
                              {format(new Date(notification.createdAt), 'dd/MM/yyyy HH:mm')}
                            </span>
                          </div>
                          <p className="mt-1 text-sm text-gray-600 text-left">
                            {notification.message}
                          </p>
                        </div>
                      </div>
                    </NotificationWrapper>
                  );
                })
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>

    </>
  );
};

export default NotificationDropdown;