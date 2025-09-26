// Comment Types
export interface Comment {
  id: string;
  taskId: string;
  commenterId: string;
  text: string;
  createdAt: string;
  updatedAt: string;
  commenter?: {
    id: string;
    username: string;
    email: string;
  };
  task?: {
    id: string;
    title: string;
  };
}

export interface CreateCommentRequest {
  taskId: string;
  text: string;
}

export interface UpdateCommentRequest {
  text: string;
}

export interface CommentWithDetails extends Comment {
  commenter?: {
    id: string;
    username: string;
    email: string;
  };
  task?: {
    id: string;
    title: string;
  };
}
