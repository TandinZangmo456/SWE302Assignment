import React from 'react';
import { Link } from 'react-router-dom';

const ArticlePreview = ({ article }) => {
  if (!article) return null;
  
  return (
    <div className="article-preview">
      <div className="article-meta">
        <Link to={`/@${article.author?.username || ''}`}>
          <img src={article.author?.image} alt={article.author?.username} />
        </Link>
        <div className="info">
          <Link to={`/@${article.author?.username || ''}`} className="author">
            {article.author?.username || 'Unknown'}
          </Link>
          <span className="date">
            {article.createdAt ? new Date(article.createdAt).toDateString() : ''}
          </span>
        </div>
        <button className="btn btn-outline-primary btn-sm pull-xs-right">
          <i className="ion-heart"></i> {article.favoritesCount || 0}
        </button>
      </div>
      <Link to={`/article/${article.slug || ''}`} className="preview-link">
        <h1>{article.title || 'Untitled'}</h1>
        <p>{article.description || 'No description'}</p>
        <span>Read more...</span>
        <ul className="tag-list">
          {(article.tagList || []).map(tag => (
            <li key={tag} className="tag-default tag-pill tag-outline">
              {tag}
            </li>
          ))}
        </ul>
      </Link>
    </div>
  );
};

export default ArticlePreview;
