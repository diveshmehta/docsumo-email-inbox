import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { EmailInbox } from './pages/EmailInbox'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/inbox" replace />} />
        <Route path="/inbox" element={<EmailInbox />} />
      </Routes>
    </Router>
  )
}

export default App
