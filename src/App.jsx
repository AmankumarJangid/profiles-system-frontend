import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import ProfilesPage from './pages/ProfilesPage';
import CreateProfilePage from './pages/CreateProfilePage';
import ProfileDetailPage from './pages/ProfileDetailPage';
import EditProfilePage from './pages/EditProfilePage';
import NotFoundPage from './pages/NotFoundPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/profiles" replace />} />
          <Route path="profiles" element={<ProfilesPage />} />
          <Route path="profiles/new" element={<CreateProfilePage />} />
          <Route path="profiles/:id" element={<ProfileDetailPage />} />
          <Route path="profiles/:id/edit" element={<EditProfilePage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
