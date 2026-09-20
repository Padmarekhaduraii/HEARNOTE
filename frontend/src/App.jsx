import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import LiveLecture from './pages/LiveLecture';
import LectureReview from './pages/LectureReview';
import PreviousLectures from './pages/PreviousLectures';

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-[#0b0f19] text-slate-100 selection:bg-cyan-500/30 selection:text-cyan-200">
        <Navbar />
        <main className="flex-1 flex flex-col">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/live" element={<LiveLecture />} />
            <Route path="/review/:id" element={<LectureReview />} />
            <Route path="/review" element={<LectureReview />} />
            <Route path="/lectures" element={<PreviousLectures />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
