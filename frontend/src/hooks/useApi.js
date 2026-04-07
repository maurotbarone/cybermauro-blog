import { useState, useEffect } from 'react';
import axios from 'axios';

const API = process.env.REACT_APP_API_URL || '';

export const usePosts = (topicSlug, page = 1) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // undefined = not ready yet (topics still loading); null = explicit "All"
    if (topicSlug === undefined) return;
    setLoading(true);
    const url = topicSlug
      ? `${API}/api/posts/topic/${topicSlug}?page=${page}&limit=12`
      : `${API}/api/posts?page=${page}&limit=12`;
    axios.get(url)
      .then(res => { setData(res.data); setError(null); })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [topicSlug, page]);

  return { data, loading, error };
};

export const useTopics = () => {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${API}/api/topics`)
      .then(res => setTopics(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return { topics, loading };
};

export const usePost = (slug) => {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    axios.get(`${API}/api/posts/${slug}`)
      .then(res => { setPost(res.data); setError(null); })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [slug]);

  return { post, loading, error };
};

export { API };
