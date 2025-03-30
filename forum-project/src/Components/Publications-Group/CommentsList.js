// /src/components/Publications/CommentsList.js
import React from 'react';
import ReplyInput from './ReplyInput';
import RepliesList from './RepliesList';
import UserProfileButton from './UserProfileButton';

export default function CommentsList({
  comments,
  postId,
  replyingTo,
  setReplyingTo,
  addReply,
  expandedReplies,
  toggleReplies,
  MAX_VISIBLE_REPLIES,
  onUserProfileClick,
}) {
  return (
    <>
      {comments.map((comment) => (
        <div key={comment.id} className="mb-4">
          <div className="flex items-start">
            {/* Clickable avatar */}
            <UserProfileButton user={comment.user} onClick={onUserProfileClick} />
            {/* Name & comment text */}
            <div className="flex-1 ml-2">
              <div className="bg-blue-50 rounded-lg p-3">
                <p className="text-sm font-medium text-blue-900">{comment.user.username}</p>
                {comment.replyTo && (
                  <p className="text-xs text-gray-500">
                    Ответ пользователю @{comment.replyTo.username}
                  </p>
                )}
                <p className="text-blue-800">{comment.text}</p>
              </div>

              {/* Reply button */}
              <button
                className="text-blue-600 text-sm mt-1"
                onClick={() => setReplyingTo({ postId, commentId: comment.id })}
              >
                Ответить
              </button>

              {/* Inline reply input for this comment */}
              {replyingTo &&
                replyingTo.postId === postId &&
                replyingTo.commentId === comment.id &&
                !replyingTo.replyId && (
                  <div className="mt-2">
                    <ReplyInput
                      inputKey={`reply-input-${postId}-${comment.id}`}
                      placeholder="Напишите ответ..."
                      onSubmit={(text) => addReply(postId, comment.id, comment.user, text)}
                    />
                  </div>
                )}

              {/* Replies (if any) */}
              {comment.replies && comment.replies.length > 0 && (
                <RepliesList
                  replies={comment.replies}
                  postId={postId}
                  parentCommentId={comment.id}
                  replyingTo={replyingTo}
                  setReplyingTo={setReplyingTo}
                  addReply={addReply}
                  expandedReplies={expandedReplies}
                  toggleReplies={toggleReplies}
                  MAX_VISIBLE_REPLIES={MAX_VISIBLE_REPLIES}
                  onUserProfileClick={onUserProfileClick}
                />
              )}
            </div>
          </div>
        </div>
      ))}
    </>
  );
}
