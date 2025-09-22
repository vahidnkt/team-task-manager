// Comment Types
export interface Comment {
  id: string;
  task_id: string;
  commenter_id: string;
  text: string;
  created_at: Date;
  updated_at: Date;
  commenter_username?: string;
  task_title?: string;
  project_name?: string;
}

export interface CreateCommentRequest {
  task_id: string;
  commenter_id: string;
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
