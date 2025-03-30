import React, { useState, useRef, useEffect } from "react";
import { FaRegComment, FaChevronDown, FaChevronUp } from "react-icons/fa";

const defaultProfilePic = "https://i.pravatar.cc/40";

// How many comments/replies to show initially before expanding
const MAX_VISIBLE_COMMENTS = 3;
const MAX_VISIBLE_REPLIES = 2;

// A small component for inline reply input that manages its own state
const ReplyInput = ({ placeholder, onSubmit, inputKey }) => {
  const [text, setText] = useState("");
  const inputRef = useRef(null);

  // Auto-focus when the input mounts
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <input
      key={inputKey}
      ref={inputRef}
      type="text"
      className="w-full p-2 bg-blue-50 rounded-lg border border-blue-100 outline-none"
      placeholder={placeholder}
      value={text}
      onChange={(e) => setText(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === "Enter" && text.trim()) {
          onSubmit(text);
          setText("");
        }
      }}
    />
  );
};

const PublicationsDraft = () => {
  // Track whether all comments for a post are visible
  const [expandedPostComments, setExpandedPostComments] = useState({});
  // Track which comment’s replies are fully visible (keyed by comment id)
  const [expandedReplies, setExpandedReplies] = useState({});
  // State for tracking which comment/reply is being replied to.
  // It holds an object: { postId, commentId, replyId? } (replyId is only set if replying to a reply)
  const [replyingTo, setReplyingTo] = useState(null);

  // Our sample posts now have unique IDs for comments and replies.
  const [posts, setPosts] = useState([
    {
      id: 1,
      text: "Starting my mental health journey - any tips for managing anxiety?",
      comments: [
        {
          id: 101,
          text: "Mindfulness meditation helped me a lot! Start with just 5 minutes a day.",
          user: {
            name: "Sarah",
            username: "sarah_m",
            photo: "https://i.pravatar.cc/40?img=3"
          },
          replies: [
            {
              id: 201,
              text: "Second this! The Headspace app has great beginner courses.",
              user: {
                name: "Mike",
                username: "mike_t",
                photo: "https://i.pravatar.cc/40?img=4"
              }
              // Direct reply to the comment, no "replyTo" here.
            }
          ]
        },
        {
          id: 102,
          text: "Regular exercise and maintaining a sleep schedule made a big difference for me.",
          user: {
            name: "David",
            username: "david_r",
            photo: "https://i.pravatar.cc/40?img=5"
          },
          replies: [
            {
              id: 202,
              text: "How many hours of sleep do you recommend?",
              user: {
                name: "Lisa",
                username: "lisa_k",
                photo: "https://i.pravatar.cc/40?img=6"
              },
              replyTo: {
                name: "David",
                username: "david_r",
                photo: "https://i.pravatar.cc/40?img=5"
              }
            },
            {
              id: 203,
              text: "Aim for 7-9 hours. Consistency is key!",
              user: {
                name: "David",
                username: "david_r",
                photo: "https://i.pravatar.cc/40?img=5"
              },
              replyTo: {
                name: "David",
                username: "david_r",
                photo: "https://i.pravatar.cc/40?img=5"
              }
            }
          ]
        }
      ],
      user: {
        name: "Emma",
        username: "emma_j",
        photo: "https://i.pravatar.cc/40?img=1"
      }
    },
    {
      id: 2,
      text: "Celebrating 6 months of consistent therapy! 🎉 It's okay to ask for help.",
      comments: [
        {
          id: 103,
          text: "So proud of you! This is inspiring 💛",
          user: {
            name: "John",
            username: "john_d",
            photo: "https://i.pravatar.cc/40?img=7"
          },
          replies: []
        }
      ],
      user: {
        name: "Alex",
        username: "alex_m",
        photo: "https://i.pravatar.cc/40?img=2"
      }
    }
  ]);

  const [newPost, setNewPost] = useState("");
  const [user] = useState({
    name: "John Doe",
    username: "johndoe",
    photo: "https://i.pravatar.cc/40?img=8"
  });

  // Adds a new post at the top of the feed
  const handlePostSubmit = () => {
    if (newPost.trim()) {
      setPosts([
        {
          id: Date.now(),
          text: newPost,
          comments: [],
          user
        },
        ...posts
      ]);
      setNewPost("");
    }
  };

  // Adds a new comment to a post
  const addComment = (postId, comment) => {
    setPosts(
      posts.map((post) =>
        post.id === postId
          ? {
              ...post,
              comments: [
                ...post.comments,
                { id: Date.now(), text: comment, user, replies: [] }
              ]
            }
          : post
      )
    );
  };

  // Adds a reply to a comment. If replying to a reply, replyTargetUser is the user of that reply.
  const addReply = (postId, commentId, replyTargetUser, text) => {
    setPosts(
      posts.map((post) => {
        if (post.id !== postId) return post;
        return {
          ...post,
          comments: post.comments.map((comment) => {
            if (comment.id !== commentId) return comment;
            const newReply = {
              id: Date.now(),
              text,
              user,
              replyTo: replyTargetUser || null
            };
            return {
              ...comment,
              replies: [...(comment.replies || []), newReply]
            };
          })
        };
      })
    );
    setReplyingTo(null);
  };

  const togglePostComments = (postId) => {
    setExpandedPostComments((prev) => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };

  const toggleReplies = (commentId) => {
    setExpandedReplies((prev) => ({
      ...prev,
      [commentId]: !prev[commentId]
    }));
  };

  // Renders replies in a flat list (always indented one level)
  const RepliesList = ({ replies = [], postId, parentCommentId }) => {
    const visibleReplies = expandedReplies[parentCommentId]
      ? replies
      : replies.slice(0, MAX_VISIBLE_REPLIES);
    return (
      <div className="ml-4 mt-2">
        {visibleReplies.map((reply) => (
          <div key={reply.id} className="mb-2">
            <div className="flex items-start">
              <img
                src={reply.user.photo || defaultProfilePic}
                alt={reply.user.name}
                className="w-6 h-6 rounded-full mr-2"
              />
              <div className="flex-1">
                <div className="bg-blue-50 rounded-lg p-3">
                  <p className="text-sm font-medium text-blue-900">
                    {reply.user.name}
                  </p>
                  {reply.replyTo && (
                    <p className="text-xs text-gray-500">
                      Replying to @{reply.replyTo.username}
                    </p>
                  )}
                  <p className="text-blue-800">{reply.text}</p>
                </div>
                <button
                  className="text-blue-600 text-sm mt-1"
                  onClick={() =>
                    setReplyingTo({
                      postId,
                      commentId: parentCommentId,
                      replyId: reply.id
                    })
                  }
                >
                  Reply
                </button>
                {replyingTo &&
                  replyingTo.postId === postId &&
                  replyingTo.commentId === parentCommentId &&
                  replyingTo.replyId === reply.id && (
                    <div className="mt-2">
                      <ReplyInput
                        inputKey={`reply-input-${postId}-${parentCommentId}-${reply.id}`}
                        placeholder="Write a reply..."
                        onSubmit={(text) =>
                          addReply(postId, parentCommentId, reply.user, text)
                        }
                      />
                    </div>
                  )}
              </div>
            </div>
          </div>
        ))}
        {replies.length > MAX_VISIBLE_REPLIES &&
          !expandedReplies[parentCommentId] && (
            <button
              className="text-blue-600 text-sm mt-1"
              onClick={() => toggleReplies(parentCommentId)}
            >
              Show more replies
            </button>
          )}
        {replies.length > MAX_VISIBLE_REPLIES &&
          expandedReplies[parentCommentId] && (
            <button
              className="text-blue-600 text-sm mt-1"
              onClick={() => toggleReplies(parentCommentId)}
            >
              Show less replies
            </button>
          )}
      </div>
    );
  };

  // Renders top-level comments
  const CommentsList = ({ comments, postId }) => {
    return (
      <>
        {comments.map((comment) => (
          <div key={comment.id} className="mb-4">
            <div className="flex items-start">
              <img
                src={comment.user.photo || defaultProfilePic}
                alt={comment.user.name}
                className="w-6 h-6 rounded-full mr-2"
              />
              <div className="flex-1">
                <div className="bg-blue-50 rounded-lg p-3">
                  <p className="text-sm font-medium text-blue-900">
                    {comment.user.name}
                  </p>
                  {comment.replyTo && (
                    <p className="text-xs text-gray-500">
                      Replying to @{comment.replyTo.username}
                    </p>
                  )}
                  <p className="text-blue-800">{comment.text}</p>
                </div>
                <button
                  className="text-blue-600 text-sm mt-1"
                  onClick={() =>
                    setReplyingTo({ postId, commentId: comment.id })
                  }
                >
                  Reply
                </button>
                {replyingTo &&
                  replyingTo.postId === postId &&
                  replyingTo.commentId === comment.id &&
                  !replyingTo.replyId && (
                    <div className="mt-2">
                      <ReplyInput
                        inputKey={`reply-input-${postId}-${comment.id}`}
                        placeholder="Write a reply..."
                        onSubmit={(text) =>
                          addReply(postId, comment.id, comment.user, text)
                        }
                      />
                    </div>
                  )}
                {comment.replies && comment.replies.length > 0 && (
                  <RepliesList
                    replies={comment.replies}
                    postId={postId}
                    parentCommentId={comment.id}
                  />
                )}
              </div>
            </div>
          </div>
        ))}
      </>
    );
  };

  return (
    <div className="min-h-screen bg-blue-50 p-4 pt-12">
      <div className="max-w-2xl mx-auto">
        {/* New Post Card */}
        <div className="bg-white rounded-xl shadow-md p-4 mb-6 border border-blue-100">
          <div className="flex items-center mb-4">
            <img
              src={user.photo || defaultProfilePic}
              alt={user.name}
              className="w-10 h-10 rounded-full border-2 border-blue-100"
            />
            <div className="ml-3">
              <p className="font-bold text-blue-900">{user.name}</p>
              <p className="text-sm text-blue-600">@{user.username}</p>
            </div>
          </div>
          <textarea
            className="w-full p-3 bg-blue-50 rounded-lg border border-blue-100 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
            rows="3"
            placeholder="Share your thoughts..."
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
          />
          <button
            className="mt-3 w-full bg-teal-600 hover:bg-teal-700 text-white font-medium py-2 rounded-lg transition-colors shadow-md"
            onClick={handlePostSubmit}
          >
            Post
          </button>
        </div>

        {/* Posts Feed */}
        <div className="space-y-6">
          {posts.map((post) => {
            // Only show a limited number of comments unless expanded
            const visibleComments = expandedPostComments[post.id]
              ? post.comments
              : post.comments.slice(0, MAX_VISIBLE_COMMENTS);
            return (
              <div
                key={post.id}
                className="bg-white rounded-xl shadow-md p-4 border border-blue-100"
              >
                <div className="flex items-center mb-4">
                  <img
                    src={post.user.photo || defaultProfilePic}
                    alt={post.user.name}
                    className="w-10 h-10 rounded-full border-2 border-blue-100"
                  />
                  <div className="ml-3">
                    <p className="font-bold text-blue-900">
                      {post.user.name}
                    </p>
                    <p className="text-sm text-blue-600">
                      @{post.user.username}
                    </p>
                  </div>
                </div>
                <p className="text-blue-900 mb-4">{post.text}</p>

                <div className="border-t border-blue-100 pt-4">
                  <div className="flex items-center text-blue-600 mb-4">
                    <FaRegComment className="mr-2" />
                    <span className="font-medium">
                      {post.comments.length} comments
                    </span>
                  </div>

                  <CommentsList comments={visibleComments} postId={post.id} />

                  {post.comments.length > MAX_VISIBLE_COMMENTS &&
                    !expandedPostComments[post.id] && (
                      <button
                        className="text-blue-600 text-sm mt-2"
                        onClick={() => togglePostComments(post.id)}
                      >
                        Show more comments
                      </button>
                    )}
                  {post.comments.length > MAX_VISIBLE_COMMENTS &&
                    expandedPostComments[post.id] && (
                      <button
                        className="text-blue-600 text-sm mt-2"
                        onClick={() => togglePostComments(post.id)}
                      >
                        Show less comments
                      </button>
                    )}

                  <input
                    type="text"
                    className="w-full p-2 mt-4 bg-blue-50 rounded-lg border border-blue-100 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
                    placeholder="Add a comment..."
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && e.target.value.trim()) {
                        addComment(post.id, e.target.value);
                        e.target.value = "";
                      }
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PublicationsDraft;
