"use client";

import { useState } from "react";
import { Card, Input, Button, List, Avatar, message } from "antd";
import { CommentOutlined, SendOutlined, UserOutlined } from "@ant-design/icons";
import type { PhotoWithComments } from "@/lib/db";
import { formatDistanceToNow } from "date-fns";
import { apiService } from "@/services/api";

interface PhotoCardProps {
  photo: PhotoWithComments;
  onCommentAdded: () => void;
}

export function PhotoCard({ photo, onCommentAdded }: PhotoCardProps) {
  const [comment, setComment] = useState("");
  const [author, setAuthor] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showComments, setShowComments] = useState(false);

  const handleSubmitComment = async () => {
    if (!comment.trim()) {
      message.error("Please enter a comment");
      return;
    }

    setSubmitting(true);

    try {
      await apiService.addComment({
        photoId: photo.id,
        content: comment,
        author: author.trim() || "Anonymous",
      });

      message.success("Comment added!");
      setComment("");
      setAuthor("");
      onCommentAdded();
    } catch {
      message.error("Failed to add comment");
    } finally {
      setSubmitting(false);
    }
  };

  const imageUrl = `/api/file?pathname=${encodeURIComponent(photo.pathname)}`;

  return (
    <Card
      className="overflow-hidden"
      cover={
        <div className="relative aspect-video bg-gray-100">
          <img
            src={imageUrl}
            alt={photo.title || "Uploaded photo"}
            className="w-full h-full object-cover"
          />
        </div>
      }
      actions={[
        <Button
          key="comments"
          type="text"
          icon={<CommentOutlined />}
          onClick={() => setShowComments(!showComments)}
        >
          {photo.comments.length} Comments
        </Button>,
      ]}
    >
      <Card.Meta
        title={photo.title || "Untitled"}
        description={`Uploaded ${formatDistanceToNow(new Date(photo.created_at), { addSuffix: true })}`}
      />

      {showComments && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          {photo.comments.length > 0 && (
            <List
              className="mb-4"
              itemLayout="horizontal"
              dataSource={photo.comments}
              renderItem={(item) => (
                <List.Item className="!px-0">
                  <List.Item.Meta
                    avatar={<Avatar icon={<UserOutlined />} size="small" />}
                    title={
                      <span className="text-sm font-medium">{item.author}</span>
                    }
                    description={
                      <div>
                        <p className="text-gray-700 text-sm">{item.content}</p>
                        <span className="text-xs text-gray-400">
                          {formatDistanceToNow(new Date(item.created_at), {
                            addSuffix: true,
                          })}
                        </span>
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
          )}

          <div className="flex flex-col gap-2">
            <Input
              placeholder="Your name (optional)"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              size="small"
            />
            <div className="flex gap-2">
              <Input.TextArea
                placeholder="Write a comment..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                autoSize={{ minRows: 1, maxRows: 3 }}
                onPressEnter={(e) => {
                  if (!e.shiftKey) {
                    e.preventDefault();
                    handleSubmitComment();
                  }
                }}
              />
              <Button
                type="primary"
                icon={<SendOutlined />}
                onClick={handleSubmitComment}
                loading={submitting}
              />
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
