import React from 'react';

const ArticleList = ({ articles = [], loading = false }) => {
  if (loading) {
    return <div>Loading articles...</div>;
  }
  
  if (!articles || articles.length === 0) {
    return <div>No articles are here... yet.</div>;
  }
  
  return (
    <div>
      {articles.map(article => (
        <div key={article.slug}>
          <h2>{article.title}</h2>
          <p>{article.description}</p>
          <span>By {article.author?.username}</span>
        </div>
      ))}
    </div>
  );
};

export default ArticleList;
