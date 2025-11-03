import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import Landing from './Pages/Landing.tsx';
import News from './Pages/News.tsx';
import ArticleEditor from './Pages/ArticleEditor.tsx';
import ArticlePage from './Pages/ArticlePage.tsx';
import Login from './Pages/Login.tsx';
import AdminDashboard from './Pages/AdminDashboard.tsx';
import ProtectedRoute from './components/ProtectedRoute.tsx';
import Header from './components/Header.tsx';
import Footer from './components/Footer.jsx';
import SignUp from './Pages/SignUp.tsx';
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Toaster position="top-right" />
        <Header/>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/news" element={<News />} />
          <Route path="/article/:id" element={<ArticlePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />

          <Route
            path="/admin"
            element={
                <AdminDashboard />
            }
          />
          <Route
            path="/admin/article/new"
            element={
              <ProtectedRoute>
                <ArticleEditor />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/article/:id"
            element={
              <ProtectedRoute>
                <ArticleEditor />
              </ProtectedRoute>
            }
          />
        </Routes>
        <Footer></Footer>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;