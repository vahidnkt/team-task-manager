import { baseApi } from "./baseApi";
import { API_ENDPOINTS } from "../../config/api";
import type {
  Project,
  CreateProjectRequest,
  UpdateProjectRequest,
  ProjectWithStats,
  ProjectMember,
} from "../../types";

// Projects API slice
export const projectsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get all projects
    getProjects: builder.query<
      Project[],
      { page?: number; limit?: number; search?: string }
    >({
      query: (params = {}) => ({
        url: API_ENDPOINTS.PROJECTS.BASE,
        method: "GET",
        params,
      }),
      providesTags: ["Project"],
    }),

    // Get project by ID
    getProject: builder.query<ProjectWithStats, string>({
      query: (id) => ({
        url: API_ENDPOINTS.PROJECTS.BY_ID(id),
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [{ type: "Project", id }],
    }),

    // Create project
    createProject: builder.mutation<Project, CreateProjectRequest>({
      query: (projectData) => ({
        url: API_ENDPOINTS.PROJECTS.BASE,
        method: "POST",
        body: projectData,
      }),
      invalidatesTags: ["Project"],
    }),

    // Update project
    updateProject: builder.mutation<
      Project,
      { id: string; data: UpdateProjectRequest }
    >({
      query: ({ id, data }) => ({
        url: API_ENDPOINTS.PROJECTS.UPDATE(id),
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Project", id },
        "Project",
      ],
    }),

    // Delete project
    deleteProject: builder.mutation<void, string>({
      query: (id) => ({
        url: API_ENDPOINTS.PROJECTS.DELETE(id),
        method: "DELETE",
      }),
      invalidatesTags: ["Project"],
    }),

    // Get project members
    getProjectMembers: builder.query<ProjectMember[], string>({
      query: (projectId) => ({
        url: API_ENDPOINTS.PROJECTS.MEMBERS(projectId),
        method: "GET",
      }),
      providesTags: (_result, _error, projectId) => [
        { type: "Project", id: projectId },
        "User",
      ],
    }),

    // Add project member
    addProjectMember: builder.mutation<
      ProjectMember,
      { projectId: string; userId: string; role: string }
    >({
      query: ({ projectId, userId, role }) => ({
        url: API_ENDPOINTS.PROJECTS.ADD_MEMBER(projectId),
        method: "POST",
        body: { userId, role },
      }),
      invalidatesTags: (_result, _error, { projectId }) => [
        { type: "Project", id: projectId },
        "User",
      ],
    }),

    // Remove project member
    removeProjectMember: builder.mutation<
      void,
      { projectId: string; userId: string }
    >({
      query: ({ projectId, userId }) => ({
        url: API_ENDPOINTS.PROJECTS.REMOVE_MEMBER(projectId, userId),
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, { projectId }) => [
        { type: "Project", id: projectId },
        "User",
      ],
    }),
  }),
});

// Export hooks for usage in components
export const {
  useGetProjectsQuery,
  useGetProjectQuery,
  useCreateProjectMutation,
  useUpdateProjectMutation,
  useDeleteProjectMutation,
  useGetProjectMembersQuery,
  useAddProjectMemberMutation,
  useRemoveProjectMemberMutation,
} = projectsApi;
