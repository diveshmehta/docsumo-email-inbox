import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import EmailInbox from './pages/EmailInbox'
import CaseAnalytics from './pages/CaseAnalytics'
import CaseEvaluation from './pages/CaseEvaluation'
import ConfigurationTesting from './pages/ConfigurationTesting'
import Deployment from './pages/Deployment'

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/inbox" element={<EmailInbox />} />
          <Route path="/analytics" element={<CaseAnalytics />} />
          <Route path="/evaluation" element={<CaseEvaluation />} />
          <Route path="/testing" element={<ConfigurationTesting />} />
          <Route path="/deployment" element={<Deployment />} />
        </Routes>
      </Layout>
    </Router>
  )
}

export default App


