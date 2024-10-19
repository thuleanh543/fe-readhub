import React, { useState } from 'react';
import { List, ListItem, ListItemText, Collapse, ListItemIcon } from '@mui/material';
import { ExpandLess, ExpandMore, Book, History, Star, TrendingUp } from '@mui/icons-material';
import { colors } from '../../../constants';

const RecommendationCategory = ({ title, icon, books }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <ListItem button onClick={() => setOpen(!open)} className="hover:bg-gray-100">
        <ListItemIcon>{icon}</ListItemIcon>
        <ListItemText primary={title} />
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItem>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {books.map((book, index) => (
            <ListItem key={index} button className="pl-8 hover:bg-gray-100">
              <ListItemText primary={book} />
            </ListItem>
          ))}
        </List>
      </Collapse>
    </>
  );
};

const BookRecommendationsSidebar = () => {
  const recentBooks = ['The Great Gatsby', 'To Kill a Mockingbird', 'Pride and Prejudice'];
  const popularAuthors = ['Jane Austen', 'Charles Dickens', 'Mark Twain'];
  const topRated = ['1984', 'The Catcher in the Rye', 'The Hobbit'];
  const trending = ['The Silent Patient', 'Where the Crawdads Sing', 'The Midnight Library'];

  return (
      <List
        component="nav"
        aria-labelledby="book-recommendations-sidebar"
        className="flex-grow p-2 h-full"
        style={{ color: colors.themeLight.textColor }}
      >
        <RecommendationCategory title="Recent Books" icon={<History size={24} />} books={recentBooks} />
        <RecommendationCategory title="Popular Authors" icon={<Star size={24} />} books={popularAuthors} />
        <RecommendationCategory title="Top Rated" icon={<TrendingUp size={24} />} books={topRated} />
        <RecommendationCategory title="Trending" icon={<Book size={24} />} books={trending} />
      </List>
  );
};

export default BookRecommendationsSidebar;