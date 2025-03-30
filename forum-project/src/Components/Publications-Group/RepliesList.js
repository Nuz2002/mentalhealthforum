// /src/components/Publications/RepliesList.js
import React from 'react';
import ReplyInput from './ReplyInput';
import UserProfileButton from './UserProfileButton';

export default function RepliesList({
  replies = [],
  postId,
  parentCommentId,
  replyingTo,
  setReplyingTo,
  addReply,
  expandedReplies,
  toggleReplies,
  MAX_VISIBLE_REPLIES,
  onUserProfileClick,
}) {
  const isExpanded = expandedReplies[parentCommentId];
  const visibleReplies = isExpanded ? replies : replies.slice(0, MAX_VISIBLE_REPLIES);

  return (
    <div className="ml-4 mt-2">
      {visibleReplies.map((reply) => (
        <div key={reply.id} className="mb-2">
          <div className="flex items-start">
            {/* Кликабельный аватар */}
            <UserProfileButton user={reply.user} onClick={onUserProfileClick} />
            <div className="flex-1 ml-2">
              <div className="bg-blue-50 rounded-lg p-3">
                <div className="flex flex-wrap items-center text-sm font-medium text-blue-900">
                  <span>{reply.user.username}</span>
                  {reply.replyTo && (
                    <span className="text-xs text-gray-500 ml-6">
                      В ответ @{reply.replyTo.username}
                    </span>
                  )}
                </div>

                <p className="text-blue-800">{reply.text}</p>
              </div>

              {/* Кнопка "Ответить" на ответ */}
              <button
                className="text-blue-600 text-sm mt-1"
                onClick={() =>
                  setReplyingTo({
                    postId,
                    commentId: parentCommentId,
                    replyId: reply.id,
                  })
                }
              >
                Ответить
              </button>

              {/* Поле ввода ответа на конкретный ответ */}
              {replyingTo &&
                replyingTo.postId === postId &&
                replyingTo.commentId === parentCommentId &&
                replyingTo.replyId === reply.id && (
                  <div className="mt-2">
                    <ReplyInput
                      inputKey={`reply-input-${postId}-${parentCommentId}-${reply.id}`}
                      placeholder="Напишите ответ..."
                      onSubmit={(text) => addReply(postId, parentCommentId, reply.user, text)}
                    />
                  </div>
                )}
            </div>
          </div>
        </div>
      ))}

      {/* Показать больше/меньше ответов */}
      {replies.length > MAX_VISIBLE_REPLIES && !isExpanded && (
        <button
          className="text-blue-600 text-sm mt-1"
          onClick={() => toggleReplies(parentCommentId)}
        >
          Показать больше ответов
        </button>
      )}
      {replies.length > MAX_VISIBLE_REPLIES && isExpanded && (
        <button
          className="text-blue-600 text-sm mt-1"
          onClick={() => toggleReplies(parentCommentId)}
        >
          Скрыть ответы
        </button>
      )}
    </div>
  );
}
