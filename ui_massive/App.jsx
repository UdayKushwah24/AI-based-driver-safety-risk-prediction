import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import MassiveRoutes from './routes/MassiveRoutes';
import './styles/base.css';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/ui_massive/*" element={<MassiveRoutes />} />
        <Route path="*" element={<Navigate to="/ui_massive/p1" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
