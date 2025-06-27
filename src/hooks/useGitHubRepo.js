import { useState, useEffect } from 'react';

const useGitHubRepo = (username) => {
  const [latestRepo, setLatestRepo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!username) {
      setLoading(false);
      return;
    }

    const fetchLatestRepo = async () => {
      try {
        setLoading(true);
        // Fetch user's repositories sorted by updated date
        const response = await fetch(
          `https://api.github.com/users/${username}/repos?sort=updated&per_page=1`
        );
        
        if (!response.ok) {
          throw new Error('Failed to fetch repositories');
        }
        
        const repos = await response.json();
        
        if (repos.length > 0) {
          setLatestRepo(repos[0]);
        } else {
          setError('No repositories found');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLatestRepo();
  }, [username]);

  return { latestRepo, loading, error };
};

export default useGitHubRepo; 