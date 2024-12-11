import React, { useState, useRef, useEffect } from "react";
import { IconButton, Avatar } from "@mui/material";
import {
  ArrowBack,
  BookmarkBorder,
  Bookmark,
  ViewListRounded,
  Settings,
  Person,
  AutoStories,
  Logout,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useUser } from "../../../contexts/UserProvider";

const ReaderHeader = ({
  onBack,
  onToggleNotes,
  onToggleSettings,
  user,
  onToggleBookmark,
  hasBookmark,
  currentLocation,
  title,
}) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { logoutUser} = useUser();
  const profileRef = useRef(null);

  const handleLogout = () => {
    logoutUser();
    toast.success("Logged out successfully");
  };

  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function stringAvatar(name) {
    return {
      sx: {
        bgcolor: stringToColor(name),
        width: 32,
        height: 32,
        fontSize: "14px",
        cursor: "pointer",
        "&:hover": {
          opacity: 0.9,
        },
      },
      children: `${name.split(" ")[0][0]}${name.split(" ")[1][0]}`,
    };
  }

  function stringToColor(string) {
    let hash = 0;
    for (let i = 0; i < string.length; i++) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }
    let color = "#";
    for (let i = 0; i < 3; i++) {
      const value = (hash >> (i * 8)) & 0xff;
      color += `00${value.toString(16)}`.slice(-2);
    }
    return color;
  }

  const profileMenuItems = [
    {
      label: "Profile",
      icon: <Person className="w-4 h-4" />,
      path: "/profile",
    },
    {
      label: "My Library",
      icon: <AutoStories className="w-4 h-4" />,
      path: "/saved-books",
    },
  ];

  return (
    <div
      className="sticky top-0 left-0 right-0 z-50 h-16 flex items-center px-4"
      style={{
        background:
          "linear-gradient(180deg, rgba(24, 24, 27, 0.95) 0%, rgba(24, 24, 27, 0.85) 100%)",
        backdropFilter: "blur(12px)",
        boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
        borderBottom: "1px solid rgba(63, 63, 70, 0.4)",
      }}
    >
      <IconButton
        onClick={onBack}
        sx={{
          color: "rgba(250, 250, 250, 0.9)",
          padding: "10px",
          transition: "all 0.2s ease",
          "&:hover": {
            background: "rgba(250, 250, 250, 0.08)",
            transform: "translateX(-2px)",
          },
        }}
      >
        <ArrowBack sx={{ fontSize: 20 }} />
      </IconButton>

      <div className="flex-1 flex justify-center">
        <h1 className="text-gray-100 font-medium text-sm">{title}</h1>
      </div>

      <div className="flex items-center gap-2">
        {user && (
          <IconButton
            onClick={() => onToggleBookmark(currentLocation)}
            sx={{
              color: "rgba(250, 250, 250, 0.9)",
              padding: "8px",
              "&:hover": {
                background: "rgba(250, 250, 250, 0.08)",
              },
            }}
          >
            {hasBookmark ? (
              <Bookmark sx={{ fontSize: 20 }} />
            ) : (
              <BookmarkBorder sx={{ fontSize: 20 }} />
            )}
          </IconButton>
        )}
        {user && (
          <IconButton
            onClick={onToggleNotes}
            sx={{
              color: "rgba(250, 250, 250, 0.9)",
              padding: "8px",
              "&:hover": {
                background: "rgba(250, 250, 250, 0.08)",
              },
            }}
          >
            <ViewListRounded sx={{ fontSize: 20 }} />
          </IconButton>
        )}
        <IconButton
          onClick={onToggleSettings}
          sx={{
            color: "rgba(250, 250, 250, 0.9)",
            padding: "8px",
            "&:hover": {
              background: "rgba(250, 250, 250, 0.08)",
            },
          }}
        >
          <Settings sx={{ fontSize: 20 }} />
        </IconButton>

        <div className="relative" ref={profileRef}>
          {user ? (
            <div onClick={() => setIsProfileOpen(!isProfileOpen)}>
              {user?.urlAvatar ? (
                <Avatar
                  sx={{
                    width: 32,
                    height: 32,
                    cursor: "pointer",
                    "&:hover": { opacity: 0.9 },
                  }}
                  src={user.urlAvatar}
                  alt={user.fullName}
                />
              ) : (
                <Avatar {...stringAvatar(user.fullName)} />
              )}
            </div>
          ) : (
            <button
              onClick={() => {
                setIsProfileOpen(!isProfileOpen);
                navigate("/login-account");
              }}
              className="text-sm text-gray-200 hover:text-gray-100 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
            >
              Login
            </button>
          )}

          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-zinc-800/95 backdrop-blur-md rounded-lg shadow-lg py-1 border border-zinc-700">
              {user ? (
                <>
                  <div className="px-4 py-2 border-b border-zinc-700">
                    <p className="text-sm font-medium text-gray-200">
                      {user.fullName}
                    </p>
                    <p className="text-xs text-gray-400">{user.email}</p>
                  </div>
                  {profileMenuItems.map((item, index) => (
                    <a
                      key={index}
                      href={item.path}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:bg-white/5"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      {item.icon}
                      <span>{item.label}</span>
                    </a>
                  ))}
                  <button
                    onClick={() => {
                      setIsProfileOpen(false);
                      handleLogout();
                      navigate("/");
                    }}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:bg-white/5"
                  >
                    <Logout className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <div className="py-2">
                  <button
                    onClick={() => setIsProfileOpen(false)}
                    className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-white/5"
                  >
                    Login to ReadHub
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReaderHeader;
