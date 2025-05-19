import { HashRouter as Router, Routes, Route } from "react-router-dom";
import RegisterForm from './component/inscription.jsx';
import LoginForm from './component/connection.jsx';
import FragmentsPage from './component/home.jsx';
import FragmentFormPage from './component/fragmentform.jsx';
import TagsPage from "./component/tags.jsx";
import Layout from './component/layout.jsx';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/register" element={<Layout minimal><RegisterForm /></Layout>} />
        <Route path="/login" element={<Layout minimal><LoginForm /></Layout>} />
        
        <Route path="/" element={<Layout><FragmentsPage /></Layout>} />
        <Route path="/fragment/new" element={<Layout><FragmentFormPage /></Layout>} />
        <Route path="/fragment/:id" element={<Layout><FragmentFormPage /></Layout>} />
        <Route path="/tags" element={<Layout><TagsPage /></Layout>} />
      </Routes>
    </Router>
  );
}
export default App;
