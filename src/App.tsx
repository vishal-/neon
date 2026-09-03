import { Routes, Route } from 'react-router-dom'
import { HomePage } from './components/pages/home'
import { LoginPage } from './components/pages/login'
import { ProfilePage } from './components/pages/profile'
import { QuizPlayerPage } from './components/pages/quiz'
import {
  BossDashboard,
  ManageQuizzesPage,
  EditQuizPage,
  ManageQuestionsPage,
  EditQuestionPage,
  ManageTagsPage,
} from './components/pages/boss'

export function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/quiz/:slug" element={<QuizPlayerPage />} />

      {/* Boss Admin Suite Routes */}
      <Route path="/boss" element={<BossDashboard />} />
      <Route path="/boss/quizzes" element={<ManageQuizzesPage />} />
      <Route path="/boss/quiz/:id" element={<EditQuizPage />} />
      <Route path="/boss/questions" element={<ManageQuestionsPage />} />
      <Route path="/boss/question/:id" element={<EditQuestionPage />} />
      <Route path="/boss/tags" element={<ManageTagsPage />} />
    </Routes>
  )
}

