import React from 'react';
import { Navigate } from 'react-router-dom';
import { getSession } from '../utils/auth';

export default function ProtectedRoute({ children, adminOnly = false }) {
  const session = getSession();

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && session.role !== 'admin') {
    return <Navigate to="/blogs" replace />;
  }

  return children;
}