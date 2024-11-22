import { useEffect } from 'react';
import { useUser } from '../contexts/UserProvider';
import useFCM from '../hooks/useFCM';

const FCMInitializer = () => {
  const { user } = useUser();
  useFCM();

  return null;
};

export default FCMInitializer;