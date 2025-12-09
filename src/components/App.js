import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import only existing components
import Header from './Header';
import ArticleList from './ArticleList';
import Login from './Login';

// For missing components, create simple placeholders
const Editor = () => <div>Editor Component - Under Construction</div>;
const Register = () => <div>Register Component - Under Construction</div>;
const ArticleDetail = () => <div>Article Detail - Under Construction</div>;

const App = () => {
  return (
    <Router>
      <div>
        <Header />
        <Routes>
          <Route path="/" element={<ArticleList />} />
          <Route path="/login" element={<Login />} />
          <Route path="/editor" element={<Editor />} />
          <Route path="/register" element={<Register />} />
          <Route path="/article/:slug" element={<ArticleDetail />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
