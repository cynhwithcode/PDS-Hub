import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import ComponentRegistry from './pages/ComponentRegistry';
import ComponentDetail from './pages/ComponentDetail';
import ComponentNew from './pages/ComponentNew';
import TokenManager from './pages/TokenManager';
import TokenDetail from './pages/TokenDetail';
import Changelog from './pages/Changelog';
import Search from './pages/Search';
import Foundation from './pages/foundation/Foundation';
import FoundationColor from './pages/foundation/FoundationColor';
import FoundationTypography from './pages/foundation/FoundationTypography';
import FoundationSpacing from './pages/foundation/FoundationSpacing';
import FoundationIconography from './pages/foundation/FoundationIconography';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/components" element={<ComponentRegistry />} />
          <Route path="/components/new" element={<ComponentNew />} />
          <Route path="/components/:id" element={<ComponentDetail />} />
          <Route path="/tokens" element={<TokenManager />} />
          <Route path="/tokens/:id" element={<TokenDetail />} />
          <Route path="/changelog" element={<Changelog />} />
          <Route path="/search" element={<Search />} />
          <Route path="/foundation" element={<Foundation />} />
          <Route path="/foundation/color" element={<FoundationColor />} />
          <Route path="/foundation/typography" element={<FoundationTypography />} />
          <Route path="/foundation/spacing" element={<FoundationSpacing />} />
          <Route path="/foundation/iconography" element={<FoundationIconography />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
