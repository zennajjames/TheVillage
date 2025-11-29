import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { searchService, SearchResults } from '../services/search.service';
import Header from '../components/layout/Header';

const Search: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [results, setResults] = useState<SearchResults | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'users' | 'posts' | 'groups' | 'messages'>('all');

  useEffect(() => {
    const q = searchParams.get('q');
    if (q) {
      setQuery(q);
      performSearch(q);
    }
  }, [searchParams]);

  const performSearch = async (searchQuery: string) => {
    if (!searchQuery.trim() || searchQuery.trim().length < 2) {
      setResults(null);
      return;
    }

    setIsLoading(true);
    try {
      const data = await searchService.search(searchQuery);
      setResults(data);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setSearchParams({ q: query.trim() });
    }
  };

  const renderResults = () => {
    if (!results) return null;

    const { users, posts, groups, messages } = results.results;

    let items: any[] = [];
    
    if (activeTab === 'all') {
      items = [
        ...users.map(u => ({ ...u, type: 'user' })),
        ...posts.map(p => ({ ...p, type: 'post' })),
        ...groups.map(g => ({ ...g, type: 'group' })),
        ...messages.map(m => ({ ...m, type: 'message' }))
      ];
    } else if (activeTab === 'users') {
      items = users;
    } else if (activeTab === 'posts') {
      items = posts;
    } else if (activeTab === 'groups') {
      items = groups;
    } else if (activeTab === 'messages') {
      items = messages;
    }

    if (items.length === 0) {
      return (
        <div className="text-center py-12 text-gray-500">
          No {activeTab === 'all' ? 'results' : activeTab} found for "{results.query}"
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {items.map((item: any) => {
          if (item.type === 'user') {
            return (
              <div
                key={item.id}
                onClick={() => navigate(`/profile/${item.id}`)}
                className="bg-white p-4 rounded-lg shadow hover:shadow-md cursor-pointer transition"
              >
                <div className="flex items-center gap-4">
                  {item.profilePicture ? (
                    <img
                      src={item.profilePicture}
                      alt={item.firstName}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-purple-200 flex items-center justify-center text-lg font-bold text-purple-600">
                      {item.firstName[0]}{item.lastName[0]}
                    </div>
                  )}
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">
                      {item.firstName} {item.lastName}
                    </h3>
                    <p className="text-sm text-gray-600">📍 {item.location}</p>
                    {item.bio && (
                      <p className="text-sm text-gray-500 mt-1 line-clamp-1">{item.bio}</p>
                    )}
                  </div>
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                    User
                  </span>
                </div>
              </div>
            );
          }

          if (item.type === 'post') {
            return (
              <div
                key={item.id}
                onClick={() => navigate(`/posts/${item.id}`)}
                className="bg-white p-4 rounded-lg shadow hover:shadow-md cursor-pointer transition"
              >
                <div className="flex justify-between items-start mb-2">
                  <span className={`text-xs font-semibold px-2 py-1 rounded ${
                    item.type === 'REQUEST' 
                      ? 'bg-purple-100 text-purple-700' 
                      : 'bg-green-100 text-green-700'
                  }`}>
                    {item.type}
                  </span>
                  <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded">
                    Post
                  </span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                <p className="text-sm text-gray-600 line-clamp-2 mb-2">{item.description}</p>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <span>📍 {item.location}</span>
                  <span>•</span>
                  <span>by {item.user.firstName} {item.user.lastName}</span>
                </div>
              </div>
            );
          }

          if (item.type === 'group') {
            return (
              <div
                key={item.id}
                onClick={() => navigate(`/groups/${item.id}`)}
                className="bg-white p-4 rounded-lg shadow hover:shadow-md cursor-pointer transition"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-gray-900">{item.name}</h3>
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                    Group
                  </span>
                </div>
                <p className="text-sm text-gray-600 line-clamp-2 mb-2">{item.description}</p>
                <div className="flex items-center gap-3 text-xs text-gray-500">
                  <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded">
                    {item.category}
                  </span>
                  <span>👥 {item._count.members} members</span>
                  {item.location && <span>📍 {item.location}</span>}
                </div>
              </div>
            );
          }

          if (item.type === 'message') {
            return (
              <div
                key={item.id}
                onClick={() => navigate(`/messages/${item.conversationId}`)}
                className="bg-white p-4 rounded-lg shadow hover:shadow-md cursor-pointer transition"
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    {item.otherUser?.profilePicture ? (
                      <img
                        src={item.otherUser.profilePicture}
                        alt={item.otherUser.firstName}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : item.otherUser ? (
                      <div className="w-8 h-8 rounded-full bg-purple-200 flex items-center justify-center text-xs font-bold text-purple-600">
                        {item.otherUser.firstName[0]}{item.otherUser.lastName[0]}
                      </div>
                    ) : null}
                    <span className="text-sm font-medium text-gray-900">
                      Conversation with {item.otherUser?.firstName} {item.otherUser?.lastName}
                    </span>
                  </div>
                  <span className="text-xs bg-pink-100 text-pink-700 px-2 py-1 rounded">
                    Message
                  </span>
                </div>
                <p className="text-sm text-gray-600 line-clamp-2">
                  <span className="font-medium">{item.sender.firstName}:</span> {item.content}
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  {new Date(item.createdAt).toLocaleDateString()}
                </p>
              </div>
            );
          }

          return null;
        })}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Search</h1>

          <form onSubmit={handleSearch} className="mb-6">
            <div className="flex gap-2">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search users, posts, groups, messages..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <button
                type="submit"
                className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition font-medium"
              >
                Search
              </button>
            </div>
          </form>

          {results && (
            <>
              <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                <button
                  onClick={() => setActiveTab('all')}
                  className={`px-4 py-2 rounded-lg font-medium transition whitespace-nowrap ${
                    activeTab === 'all'
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  All ({results.counts.total})
                </button>
                <button
                  onClick={() => setActiveTab('users')}
                  className={`px-4 py-2 rounded-lg font-medium transition whitespace-nowrap ${
                    activeTab === 'users'
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Users ({results.counts.users})
                </button>
                <button
                  onClick={() => setActiveTab('posts')}
                  className={`px-4 py-2 rounded-lg font-medium transition whitespace-nowrap ${
                    activeTab === 'posts'
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Posts ({results.counts.posts})
                </button>
                <button
                  onClick={() => setActiveTab('groups')}
                  className={`px-4 py-2 rounded-lg font-medium transition whitespace-nowrap ${
                    activeTab === 'groups'
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Groups ({results.counts.groups})
                </button>
                <button
                  onClick={() => setActiveTab('messages')}
                  className={`px-4 py-2 rounded-lg font-medium transition whitespace-nowrap ${
                    activeTab === 'messages'
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Messages ({results.counts.messages})
                </button>
              </div>
            </>
          )}

          {isLoading ? (
            <div className="text-center py-12 text-gray-600">Searching...</div>
          ) : (
            renderResults()
          )}
        </div>
      </div>
    </div>
  );
};

export default Search;