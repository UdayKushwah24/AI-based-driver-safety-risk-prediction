import { Navigate, NavLink, Route, Routes } from 'react-router-dom';
import ScalePage01 from '../pages/ScalePage01.jsx';
import ScalePage02 from '../pages/ScalePage02.jsx';
import ScalePage03 from '../pages/ScalePage03.jsx';
import ScalePage04 from '../pages/ScalePage04.jsx';
import ScalePage05 from '../pages/ScalePage05.jsx';
import ScalePage06 from '../pages/ScalePage06.jsx';
import ScalePage07 from '../pages/ScalePage07.jsx';
import ScalePage08 from '../pages/ScalePage08.jsx';
import ScalePage09 from '../pages/ScalePage09.jsx';
import ScalePage10 from '../pages/ScalePage10.jsx';
import ScalePage11 from '../pages/ScalePage11.jsx';
import ScalePage12 from '../pages/ScalePage12.jsx';
import ScalePage13 from '../pages/ScalePage13.jsx';
import ScalePage14 from '../pages/ScalePage14.jsx';
import ScalePage15 from '../pages/ScalePage15.jsx';
import ScalePage16 from '../pages/ScalePage16.jsx';
import ScalePage17 from '../pages/ScalePage17.jsx';
import ScalePage18 from '../pages/ScalePage18.jsx';
import ScalePage19 from '../pages/ScalePage19.jsx';
import ScalePage20 from '../pages/ScalePage20.jsx';
import ScalePage21 from '../pages/ScalePage21.jsx';
import ScalePage22 from '../pages/ScalePage22.jsx';
import ScalePage23 from '../pages/ScalePage23.jsx';
import ScalePage24 from '../pages/ScalePage24.jsx';
import ScalePage25 from '../pages/ScalePage25.jsx';
import ScalePage26 from '../pages/ScalePage26.jsx';
import ScalePage27 from '../pages/ScalePage27.jsx';
import ScalePage28 from '../pages/ScalePage28.jsx';
import ScalePage29 from '../pages/ScalePage29.jsx';
import ScalePage30 from '../pages/ScalePage30.jsx';
import '../styles/massiveBase.css';

export default function MassiveRoutes() {
  return (
    <div className="massive-routes-shell">
      <div className="massive-route-nav">
          <NavLink key="01" to="/scale/p01" style={({ isActive }) => ({ padding: '6px 9px', borderRadius: 8, background: isActive ? 'rgba(0,229,255,0.24)' : 'rgba(255,255,255,0.07)' })}>P01</NavLink>
          <NavLink key="02" to="/scale/p02" style={({ isActive }) => ({ padding: '6px 9px', borderRadius: 8, background: isActive ? 'rgba(0,229,255,0.24)' : 'rgba(255,255,255,0.07)' })}>P02</NavLink>
          <NavLink key="03" to="/scale/p03" style={({ isActive }) => ({ padding: '6px 9px', borderRadius: 8, background: isActive ? 'rgba(0,229,255,0.24)' : 'rgba(255,255,255,0.07)' })}>P03</NavLink>
          <NavLink key="04" to="/scale/p04" style={({ isActive }) => ({ padding: '6px 9px', borderRadius: 8, background: isActive ? 'rgba(0,229,255,0.24)' : 'rgba(255,255,255,0.07)' })}>P04</NavLink>
          <NavLink key="05" to="/scale/p05" style={({ isActive }) => ({ padding: '6px 9px', borderRadius: 8, background: isActive ? 'rgba(0,229,255,0.24)' : 'rgba(255,255,255,0.07)' })}>P05</NavLink>
          <NavLink key="06" to="/scale/p06" style={({ isActive }) => ({ padding: '6px 9px', borderRadius: 8, background: isActive ? 'rgba(0,229,255,0.24)' : 'rgba(255,255,255,0.07)' })}>P06</NavLink>
          <NavLink key="07" to="/scale/p07" style={({ isActive }) => ({ padding: '6px 9px', borderRadius: 8, background: isActive ? 'rgba(0,229,255,0.24)' : 'rgba(255,255,255,0.07)' })}>P07</NavLink>
          <NavLink key="08" to="/scale/p08" style={({ isActive }) => ({ padding: '6px 9px', borderRadius: 8, background: isActive ? 'rgba(0,229,255,0.24)' : 'rgba(255,255,255,0.07)' })}>P08</NavLink>
          <NavLink key="09" to="/scale/p09" style={({ isActive }) => ({ padding: '6px 9px', borderRadius: 8, background: isActive ? 'rgba(0,229,255,0.24)' : 'rgba(255,255,255,0.07)' })}>P09</NavLink>
          <NavLink key="10" to="/scale/p10" style={({ isActive }) => ({ padding: '6px 9px', borderRadius: 8, background: isActive ? 'rgba(0,229,255,0.24)' : 'rgba(255,255,255,0.07)' })}>P10</NavLink>
          <NavLink key="11" to="/scale/p11" style={({ isActive }) => ({ padding: '6px 9px', borderRadius: 8, background: isActive ? 'rgba(0,229,255,0.24)' : 'rgba(255,255,255,0.07)' })}>P11</NavLink>
          <NavLink key="12" to="/scale/p12" style={({ isActive }) => ({ padding: '6px 9px', borderRadius: 8, background: isActive ? 'rgba(0,229,255,0.24)' : 'rgba(255,255,255,0.07)' })}>P12</NavLink>
          <NavLink key="13" to="/scale/p13" style={({ isActive }) => ({ padding: '6px 9px', borderRadius: 8, background: isActive ? 'rgba(0,229,255,0.24)' : 'rgba(255,255,255,0.07)' })}>P13</NavLink>
          <NavLink key="14" to="/scale/p14" style={({ isActive }) => ({ padding: '6px 9px', borderRadius: 8, background: isActive ? 'rgba(0,229,255,0.24)' : 'rgba(255,255,255,0.07)' })}>P14</NavLink>
          <NavLink key="15" to="/scale/p15" style={({ isActive }) => ({ padding: '6px 9px', borderRadius: 8, background: isActive ? 'rgba(0,229,255,0.24)' : 'rgba(255,255,255,0.07)' })}>P15</NavLink>
          <NavLink key="16" to="/scale/p16" style={({ isActive }) => ({ padding: '6px 9px', borderRadius: 8, background: isActive ? 'rgba(0,229,255,0.24)' : 'rgba(255,255,255,0.07)' })}>P16</NavLink>
          <NavLink key="17" to="/scale/p17" style={({ isActive }) => ({ padding: '6px 9px', borderRadius: 8, background: isActive ? 'rgba(0,229,255,0.24)' : 'rgba(255,255,255,0.07)' })}>P17</NavLink>
          <NavLink key="18" to="/scale/p18" style={({ isActive }) => ({ padding: '6px 9px', borderRadius: 8, background: isActive ? 'rgba(0,229,255,0.24)' : 'rgba(255,255,255,0.07)' })}>P18</NavLink>
          <NavLink key="19" to="/scale/p19" style={({ isActive }) => ({ padding: '6px 9px', borderRadius: 8, background: isActive ? 'rgba(0,229,255,0.24)' : 'rgba(255,255,255,0.07)' })}>P19</NavLink>
          <NavLink key="20" to="/scale/p20" style={({ isActive }) => ({ padding: '6px 9px', borderRadius: 8, background: isActive ? 'rgba(0,229,255,0.24)' : 'rgba(255,255,255,0.07)' })}>P20</NavLink>
          <NavLink key="21" to="/scale/p21" style={({ isActive }) => ({ padding: '6px 9px', borderRadius: 8, background: isActive ? 'rgba(0,229,255,0.24)' : 'rgba(255,255,255,0.07)' })}>P21</NavLink>
          <NavLink key="22" to="/scale/p22" style={({ isActive }) => ({ padding: '6px 9px', borderRadius: 8, background: isActive ? 'rgba(0,229,255,0.24)' : 'rgba(255,255,255,0.07)' })}>P22</NavLink>
          <NavLink key="23" to="/scale/p23" style={({ isActive }) => ({ padding: '6px 9px', borderRadius: 8, background: isActive ? 'rgba(0,229,255,0.24)' : 'rgba(255,255,255,0.07)' })}>P23</NavLink>
          <NavLink key="24" to="/scale/p24" style={({ isActive }) => ({ padding: '6px 9px', borderRadius: 8, background: isActive ? 'rgba(0,229,255,0.24)' : 'rgba(255,255,255,0.07)' })}>P24</NavLink>
          <NavLink key="25" to="/scale/p25" style={({ isActive }) => ({ padding: '6px 9px', borderRadius: 8, background: isActive ? 'rgba(0,229,255,0.24)' : 'rgba(255,255,255,0.07)' })}>P25</NavLink>
          <NavLink key="26" to="/scale/p26" style={({ isActive }) => ({ padding: '6px 9px', borderRadius: 8, background: isActive ? 'rgba(0,229,255,0.24)' : 'rgba(255,255,255,0.07)' })}>P26</NavLink>
          <NavLink key="27" to="/scale/p27" style={({ isActive }) => ({ padding: '6px 9px', borderRadius: 8, background: isActive ? 'rgba(0,229,255,0.24)' : 'rgba(255,255,255,0.07)' })}>P27</NavLink>
          <NavLink key="28" to="/scale/p28" style={({ isActive }) => ({ padding: '6px 9px', borderRadius: 8, background: isActive ? 'rgba(0,229,255,0.24)' : 'rgba(255,255,255,0.07)' })}>P28</NavLink>
          <NavLink key="29" to="/scale/p29" style={({ isActive }) => ({ padding: '6px 9px', borderRadius: 8, background: isActive ? 'rgba(0,229,255,0.24)' : 'rgba(255,255,255,0.07)' })}>P29</NavLink>
          <NavLink key="30" to="/scale/p30" style={({ isActive }) => ({ padding: '6px 9px', borderRadius: 8, background: isActive ? 'rgba(0,229,255,0.24)' : 'rgba(255,255,255,0.07)' })}>P30</NavLink>
      </div>
      <div className="massive-route-content">
        <Routes>
          <Route path="p01" element={<ScalePage01 />} />
          <Route path="p02" element={<ScalePage02 />} />
          <Route path="p03" element={<ScalePage03 />} />
          <Route path="p04" element={<ScalePage04 />} />
          <Route path="p05" element={<ScalePage05 />} />
          <Route path="p06" element={<ScalePage06 />} />
          <Route path="p07" element={<ScalePage07 />} />
          <Route path="p08" element={<ScalePage08 />} />
          <Route path="p09" element={<ScalePage09 />} />
          <Route path="p10" element={<ScalePage10 />} />
          <Route path="p11" element={<ScalePage11 />} />
          <Route path="p12" element={<ScalePage12 />} />
          <Route path="p13" element={<ScalePage13 />} />
          <Route path="p14" element={<ScalePage14 />} />
          <Route path="p15" element={<ScalePage15 />} />
          <Route path="p16" element={<ScalePage16 />} />
          <Route path="p17" element={<ScalePage17 />} />
          <Route path="p18" element={<ScalePage18 />} />
          <Route path="p19" element={<ScalePage19 />} />
          <Route path="p20" element={<ScalePage20 />} />
          <Route path="p21" element={<ScalePage21 />} />
          <Route path="p22" element={<ScalePage22 />} />
          <Route path="p23" element={<ScalePage23 />} />
          <Route path="p24" element={<ScalePage24 />} />
          <Route path="p25" element={<ScalePage25 />} />
          <Route path="p26" element={<ScalePage26 />} />
          <Route path="p27" element={<ScalePage27 />} />
          <Route path="p28" element={<ScalePage28 />} />
          <Route path="p29" element={<ScalePage29 />} />
          <Route path="p30" element={<ScalePage30 />} />
          <Route path="*" element={<Navigate to="/scale/p01" replace />} />
        </Routes>
      </div>
    </div>
  );
}
