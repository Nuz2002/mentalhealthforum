import React, { useState, useEffect } from 'react';
import NewPostCard from './NewPostCard';
import PostCard from './PostCard';
import ProfileCard from './ProfileCard';
import { getUserProfile } from '../../api-calls/profileApi';
import { getAllPosts, createPost } from '../../api-calls/postApi';
import { createComment } from '../../api-calls/commentApi';
import { getUserProfileByUsername } from '../../api-calls/profileApi';

const MAX_VISIBLE_COMMENTS = 3;
const MAX_VISIBLE_REPLIES = 2;

export default function Publications() {
  const [expandedPostComments, setExpandedPostComments] = useState({});
  const [expandedReplies, setExpandedReplies] = useState({});
  const [replyingTo, setReplyingTo] = useState(null);
  const [selectedUserForProfile, setSelectedUserForProfile] = useState(null);
  const [newPost, setNewPost] = useState('');
  const [isProfileLoading, setIsProfileLoading] = useState(false);

  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userData, postsData] = await Promise.all([
          getUserProfile(),
          getAllPosts()
        ]);
        setUser(userData);
        setPosts(postsData);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handlePostSubmit = async () => {
    if (newPost.trim()) {
      try {
        const createdPost = await createPost({ text: newPost });
        setPosts(prev => [createdPost, ...prev]);
        setNewPost('');
      } catch (err) {
        console.error('Не удалось создать пост:', err);
      }
    }
  };

  const addComment = async (postId, commentText) => {
    try {
      const updatedPost = await createComment(postId, { text: commentText });
      setPosts(prevPosts =>
        prevPosts.map(post => post.id === postId ? updatedPost : post)
      );
    } catch (error) {
      console.error('Ошибка при добавлении комментария:', error);
    }
  };

  const addReply = async (postId, commentId, replyTargetUser, text) => {
    try {
      const updatedPost = await createComment(postId, {
        text: text,
        parentCommentId: commentId
      });
      setPosts(prevPosts =>
        prevPosts.map(post => post.id === postId ? updatedPost : post)
      );
      setReplyingTo(null);
    } catch (error) {
      console.error('Ошибка при добавлении ответа:', error);
    }
  };

  const togglePostComments = (postId) => {
    setExpandedPostComments((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  const toggleReplies = (commentId) => {
    setExpandedReplies((prev) => ({
      ...prev,
      [commentId]: !prev[commentId],
    }));
  };

  const handleUserProfileClick = async (clickedUser) => {
    if (!clickedUser?.username) return;

    setIsProfileLoading(true);
    try {
      const fullProfile = await getUserProfileByUsername(clickedUser.username);
      console.log('[handleUserProfileClick] Получен полный профиль:', fullProfile);
      if (fullProfile.accountType === true) {
        setSelectedUserForProfile(fullProfile);
      }
    } catch (error) {
      console.error('Не удалось загрузить профиль:', error);
    } finally {
      setIsProfileLoading(false);
    }
  };

  const closeProfileCard = () => {
    setSelectedUserForProfile(null);
  };

  if (isLoading) {
    return <div className="text-center p-4">Загрузка...</div>;
  }

  if (error) {
    return <div className="text-center p-4 text-red-500">Ошибка: {error}</div>;
  }

  if (!user) {
    return <div className="text-center p-4">Пользователь не найден</div>;
  }

  return (
    <div className="min-h-screen bg-blue-50 p-4 pt-12">
      <div className="max-w-2xl mx-auto">
        {/* Создание нового поста */}
        <NewPostCard
          user={user}
          newPost={newPost}
          setNewPost={setNewPost}
          handlePostSubmit={handlePostSubmit} 
        />

        {/* Лента постов */}
        <div className="space-y-6">
          {posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              togglePostComments={togglePostComments}
              expandedPostComments={expandedPostComments}
              MAX_VISIBLE_COMMENTS={MAX_VISIBLE_COMMENTS}
              addComment={addComment}
              replyingTo={replyingTo}
              setReplyingTo={setReplyingTo}
              addReply={addReply}
              expandedReplies={expandedReplies}
              toggleReplies={toggleReplies}
              MAX_VISIBLE_REPLIES={MAX_VISIBLE_REPLIES}
              onUserProfileClick={handleUserProfileClick}
            />
          ))}
        </div>
      </div>

      {/* Модальное окно профиля */}
      {selectedUserForProfile && (
        <ProfileCard
          user={selectedUserForProfile}
          onClose={closeProfileCard}
          isLoading={isProfileLoading}
          currentUser={user}
        />
      )}
    </div>
  );
}
