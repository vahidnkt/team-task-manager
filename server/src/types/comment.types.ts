// Comment Types
export interface Comment {
  id: number;
  task_id: number;
  commenter_id: number;
  text: string;
  created_at: Date;
  updated_at: Date;
}

export interface CreateCommentRequest {
  text: string;
}

export interface UpdateCommentRequest {
  text: string;
}

export interface CommentWithDetails extends Comment {
  commenter?: {
    id: number;
    username: string;
    email: string;
  };
  task?: {
    id: number;
    title: string;
  };
}
