import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Button,
  Input,
  List,
  Avatar,
  Spin,
  Alert,
  Empty,
  message,
  Dropdown,
  Modal,
} from "antd";
import {
  ArrowLeftOutlined,
  SendOutlined,
  MoreOutlined,
  EditOutlined,
  DeleteOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import { useGetTaskQuery } from "../../store/api/tasksApi";
import {
  useGetCommentsByTaskQuery,
  useCreateCommentMutation,
  useUpdateCommentMutation,
  useDeleteCommentMutation,
} from "../../store/api/commentsApi";
import { useAuth } from "../../hooks";
import { ROUTES } from "../../utils/constants";
import { formatRelativeTime } from "../../utils/dateUtils";

const { TextArea } = Input;

const TaskComments: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  const [newComment, setNewComment] = useState("");
  const [editingComment, setEditingComment] = useState<string | null>(null);
  const [editText, setEditText] = useState("");

  const { data: task, isLoading: isLoadingTask } = useGetTaskQuery(id!);
  const {
    data: commentsData,
    isLoading: isLoadingComments,
    error,
    refetch: refetchComments,
  } = useGetCommentsByTaskQuery(id!);

  // Ensure comments is always an array
  const comments = Array.isArray(commentsData) ? commentsData : [];

  // Debug logging
  console.log("Task ID:", id);
  console.log("Comments data:", commentsData);
  console.log("Comments array:", comments);
  console.log("Comments length:", comments.length);
  console.log(
    "API endpoint being called:",
    `/api/comments/tasks/${id}/comments`
  );
  const [createComment, { isLoading: isCreatingComment }] =
    useCreateCommentMutation();
  const [updateComment, { isLoading: isUpdatingComment }] =
    useUpdateCommentMutation();
  const [deleteComment, { isLoading: isDeletingComment }] =
    useDeleteCommentMutation();

  const handleBack = () => {
    navigate(ROUTES.TASK_DETAIL(id!));
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) {
      message.warning("Please enter a comment!");
      return;
    }

    if (!id) {
      message.error("Task ID is missing!");
      return;
    }

    try {
      console.log("Creating comment with:", {
        taskId: id,
        text: newComment.trim(),
      });
      const result = await createComment({
        taskId: id,
        text: newComment.trim(),
      }).unwrap();
      console.log("Comment created successfully:", result);
      message.success("Comment added successfully!");
      setNewComment("");

      // Manually refetch comments to ensure they appear immediately
      await refetchComments();
    } catch (error: any) {
      console.error("Comment creation error:", error);
      message.error(
        error?.data?.message || error?.message || "Failed to add comment"
      );
    }
  };

  const handleEditComment = (comment: any) => {
    setEditingComment(comment.id);
    setEditText(comment.text);
  };

  const handleUpdateComment = async () => {
    if (!editText.trim()) {
      message.warning("Please enter a comment!");
      return;
    }

    if (!editingComment) {
      message.error("No comment selected for editing!");
      return;
    }

    try {
      await updateComment({
        id: editingComment,
        data: { text: editText.trim() },
      }).unwrap();
      message.success("Comment updated successfully!");
      setEditingComment(null);
      setEditText("");

      // Manually refetch comments to ensure they appear immediately
      await refetchComments();
    } catch (error: any) {
      message.error(
        error?.data?.message || error?.message || "Failed to update comment"
      );
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    Modal.confirm({
      title: "Delete Comment",
      content: "Are you sure you want to delete this comment?",
      okText: "Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk: async () => {
        try {
          await deleteComment(commentId).unwrap();
          message.success("Comment deleted successfully!");

          // Manually refetch comments to ensure they appear immediately
          await refetchComments();
        } catch (error: any) {
          message.error(
            error?.data?.message || error?.message || "Failed to delete comment"
          );
        }
      },
    });
  };

  const handleCancelEdit = () => {
    setEditingComment(null);
    setEditText("");
  };

  if (isLoadingTask || isLoadingComments) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <Alert
          message="Error"
          description="Failed to load comments"
          type="error"
          showIcon
        />
        <Button
          onClick={handleBack}
          className="mt-4 h-10 px-6 text-sm rounded-lg text-white font-medium border-none shadow-lg hover:shadow-xl transition-all duration-200"
          style={{
            background: "linear-gradient(to right, #2563eb, #9333ea)",
            border: "none",
            color: "white",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background =
              "linear-gradient(to right, #1d4ed8, #7c3aed)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background =
              "linear-gradient(to right, #2563eb, #9333ea)";
          }}
        >
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <>
      {/* Animated background */}
      <div className="animated-background">
        <div className="floating-orb floating-orb-1"></div>
        <div className="floating-orb floating-orb-2"></div>
        <div className="floating-orb floating-orb-3"></div>
        <div className="floating-orb floating-orb-4"></div>
        <div className="floating-orb floating-orb-5"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 -mx-2 sm:-mx-4 lg:-mx-6 -my-2 sm:-my-4 lg:-my-6 min-h-screen p-2 sm:p-4 lg:p-6">
        {/* Header */}
        <div className="glass-card rounded-lg sm:rounded-xl p-3 sm:p-4 lg:p-6 mb-4 sm:mb-6 border border-white/30">
          <div className="flex items-center gap-3 sm:gap-4">
            <Button
              type="text"
              icon={<ArrowLeftOutlined />}
              onClick={handleBack}
              className="text-gray-600 hover:text-gray-800"
            />
            <div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 mb-1 sm:mb-2">
                💬 Comments
              </h1>
              <p className="text-sm sm:text-base text-gray-800">
                {task?.title ? `Comments for "${task.title}"` : "Task Comments"}
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Add Comment Form */}
          <div className="glass-card rounded-lg sm:rounded-xl p-4 sm:p-6 mb-4 sm:mb-6 border border-white/30">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <span className="text-lg">💬</span>
              Add a Comment
            </h3>
            <div className="space-y-4">
              <TextArea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="✨ Write your comment here..."
                rows={4}
                className="rounded-lg border-gray-200 focus:border-blue-500 focus:ring-blue-500 bg-white/80 backdrop-blur-sm transition-all duration-200 shadow-sm hover:shadow-md resize-none"
              />
              <div className="flex justify-end mt-3">
                <Button
                  type="primary"
                  icon={<SendOutlined />}
                  onClick={handleAddComment}
                  loading={isCreatingComment}
                  className="h-10 sm:h-12 px-4 sm:px-6 text-sm sm:text-base rounded-lg text-white font-medium border-none shadow-lg hover:shadow-xl transition-all duration-200"
                  style={{
                    background: "linear-gradient(to right, #2563eb, #9333ea)",
                    border: "none",
                    color: "white",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background =
                      "linear-gradient(to right, #1d4ed8, #7c3aed)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background =
                      "linear-gradient(to right, #2563eb, #9333ea)";
                  }}
                >
                  <span className="hidden sm:inline">Post Comment</span>
                  <span className="sm:hidden">Post</span>
                </Button>
              </div>
            </div>
          </div>

          {/* Comments List */}
          <div className="glass-card rounded-lg sm:rounded-xl p-3 sm:p-4 lg:p-6 border border-white/30">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                Comments ({comments.length})
              </h3>
              <Button
                type="text"
                size="small"
                icon={<ReloadOutlined />}
                onClick={() => refetchComments()}
                loading={isLoadingComments}
                className="text-gray-500 hover:text-gray-700"
                title="Refresh comments"
              />
            </div>

            {comments.length === 0 ? (
              <Empty
                description="No comments yet"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                className="text-gray-400 py-8"
              >
                <p className="text-sm text-gray-500">
                  Be the first to add a comment!
                </p>
              </Empty>
            ) : (
              <List
                dataSource={comments}
                renderItem={(comment: any) => {
                  // Safety check for comment data
                  if (!comment || typeof comment !== "object") {
                    return null;
                  }

                  return (
                    <List.Item className="!px-0 !py-4 border-b border-gray-200/50 last:border-b-0">
                      <List.Item.Meta
                        avatar={
                          <Avatar
                            size="large"
                            className="bg-gradient-to-r from-blue-500 to-purple-500"
                          >
                            {comment.commenter?.username
                              ?.charAt(0)
                              .toUpperCase() || "U"}
                          </Avatar>
                        }
                        title={
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-gray-900">
                                {comment.commenter?.username || "Unknown User"}
                              </span>
                              <span className="text-xs text-gray-500">
                                {formatRelativeTime(comment.createdAt)}
                              </span>
                            </div>
                            {(user?.id === comment.commenterId ||
                              isAdmin()) && (
                              <Dropdown
                                menu={{
                                  items: [
                                    {
                                      key: "edit",
                                      label: "Edit",
                                      icon: <EditOutlined />,
                                      onClick: () => handleEditComment(comment),
                                    },
                                    {
                                      key: "delete",
                                      label: "Delete",
                                      icon: <DeleteOutlined />,
                                      danger: true,
                                      onClick: () =>
                                        handleDeleteComment(comment.id),
                                    },
                                  ],
                                }}
                                trigger={["click"]}
                              >
                                <Button
                                  type="text"
                                  size="small"
                                  icon={<MoreOutlined />}
                                  className="text-gray-400 hover:text-gray-600"
                                />
                              </Dropdown>
                            )}
                          </div>
                        }
                        description={
                          <div className="mt-2">
                            {editingComment === comment.id ? (
                              <div className="space-y-2">
                                <TextArea
                                  value={editText}
                                  onChange={(e) => setEditText(e.target.value)}
                                  rows={3}
                                  className="rounded-lg border-gray-200 focus:border-blue-500 focus:ring-blue-500 bg-white/80 backdrop-blur-sm"
                                />
                                <div className="flex gap-2">
                                  <Button
                                    type="primary"
                                    size="small"
                                    onClick={handleUpdateComment}
                                    loading={isUpdatingComment}
                                    className="h-8 px-4 text-xs rounded-lg text-white font-medium border-none shadow-lg hover:shadow-xl transition-all duration-200"
                                    style={{
                                      background:
                                        "linear-gradient(to right, #2563eb, #9333ea)",
                                      border: "none",
                                      color: "white",
                                    }}
                                    onMouseEnter={(e) => {
                                      e.currentTarget.style.background =
                                        "linear-gradient(to right, #1d4ed8, #7c3aed)";
                                    }}
                                    onMouseLeave={(e) => {
                                      e.currentTarget.style.background =
                                        "linear-gradient(to right, #2563eb, #9333ea)";
                                    }}
                                  >
                                    Save
                                  </Button>
                                  <Button
                                    size="small"
                                    onClick={handleCancelEdit}
                                    className="h-8 px-4 text-xs rounded-lg bg-white/60 hover:bg-white/80 border-gray-200 text-gray-700 font-medium transition-all duration-200"
                                  >
                                    Cancel
                                  </Button>
                                </div>
                              </div>
                            ) : (
                              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                                {comment.text}
                              </p>
                            )}
                          </div>
                        }
                      />
                    </List.Item>
                  );
                }}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default TaskComments;
