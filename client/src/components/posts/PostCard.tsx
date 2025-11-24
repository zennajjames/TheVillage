import React from 'react';
import { Post, PostType } from '../../types';
import { useNavigate } from 'react-router-dom';

interface PostCardProps {
  post: Post;
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const navigate = useNavigate();

  const isRequest = post.type === PostType.REQUEST;
  const bgColor = isRequest ? 'bg-purple-50' : 'bg-green-50';
  const borderColor = isRequest ? 'border-purple-200' : 'border-green-200';
  const textColor = isRequest ? 'text-purple-700' : 'text-green-700';

  return (
    <div
      className={`${bgColor} ${borderColor} border rounded-lg p-4 cursor-pointer hover:shadow-md transition`}
      onClick={() => navigate(`/posts/${post.id}`)}
    >
      <div className="flex justify-between items-start mb-2">
        <span className={`${textColor} font-semibold text-sm`}>
          {post.type === PostType.REQUEST ? '🙋‍♀️ REQUEST' : '💝 OFFER'}
        </span>
        <span className="text-xs text-gray-500">
          {new Date(post.createdAt).toLocaleDateString()}
        </span>
      </div>

      <h3 className="text-lg font-bold text-gray-900 mb-2">{post.title}</h3>
      
      <p className="text-gray-700 mb-3 line-clamp-2">{post.description}</p>

      <div className="flex justify-between items-center text-sm">
        <span className="text-gray-600">
          📍 {post.location}
        </span>
        <div className="flex items-center gap-2">
          {(post.user as any).profilePicture ? (
            <img
              src={(post.user as any).profilePicture}
              alt={post.user.firstName}
              className="w-6 h-6 rounded-full object-cover border border-gray-300"
            />
          ) : (
            <div className="w-6 h-6 rounded-full bg-purple-200 flex items-center justify-center text-xs font-bold text-purple-600">
              {post.user.firstName[0]}{post.user.lastName[0]}
            </div>
          )}
          <span className="text-gray-600">
            {post.user.firstName} {post.user.lastName}
          </span>
        </div>
      </div>
    </div>
  );
};

export default PostCard;