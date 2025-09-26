import { baseApi } from "./baseApi";
import { API_ENDPOINTS } from "../../config/api";
import type {
  Project,
  CreateProjectRequest,
  UpdateProjectRequest,
  CompleteProjectRequest,
  ProjectWithStats,
  ProjectMember,
  GetProjectsQuery,
  ProjectsResponse,
} from "../../types";

// Projects API slice
export const projectsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get all projects with search, filter, and pagination
    getProjects: builder.query<ProjectsResponse, GetProjectsQuery>({
      query: (params = {}) => ({
        url: API_ENDPOINTS.PROJECTS.BASE,
        method: "GET",
        params,
      }),
      transformResponse: (response: any) => {
        // Extract data from the server's ApiResponse wrapper
        return response.data || response;
      },
      providesTags: ["Project"],
    }),

    // Get user's projects (projects created by or assigned to user)
    getUserProjects: builder.query<Project[], void>({
      query: () => ({
        url: `${API_ENDPOINTS.PROJECTS.BASE}/my`,
        method: "GET",
      }),
      transformResponse: (response: any) => {
        return response.data || response;
      },
      providesTags: ["Project"],
    }),

    // Get project by ID
    getProject: builder.query<ProjectWithStats, string>({
      query: (id) => ({
        url: API_ENDPOINTS.PROJECTS.BY_ID(id),
        method: "GET",
      }),
      transformResponse: (response: any) => {
        return response.data || response;
      },
      providesTags: (_result, _error, id) => [{ type: "Project", id }],
    }),

    // Create project
    createProject: builder.mutation<Project, CreateProjectRequest>({
      query: (projectData) => ({
        url: API_ENDPOINTS.PROJECTS.BASE,
        method: "POST",
        body: projectData,
      }),
      transformResponse: (response: any) => {
        return response.data || response;
      },
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
      transformResponse: (response: any) => {
        return response.data || response;
      },
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

    // Complete project
    completeProject: builder.mutation<
      Project,
      { id: string; data: CompleteProjectRequest }
    >({
      query: ({ id, data }) => ({
        url: `${API_ENDPOINTS.PROJECTS.BASE}/${id}/complete`,
        method: "POST",
        body: data,
      }),
      transformResponse: (response: any) => {
        return response.data || response;
      },
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Project", id },
        "Project",
      ],
    }),

    // Get project members
    getProjectMembers: builder.query<ProjectMember[], string>({
      query: (projectId) => ({
        url: API_ENDPOINTS.PROJECTS.MEMBERS(projectId),
        method: "GET",
      }),
      transformResponse: (response: any) => {
        return response.data || response;
      },
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
      transformResponse: (response: any) => {
        return response.data || response;
      },
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
  useGetUserProjectsQuery,
  useGetProjectQuery,
  useCreateProjectMutation,
  useUpdateProjectMutation,
  useDeleteProjectMutation,
  useCompleteProjectMutation,
  useGetProjectMembersQuery,
  useAddProjectMemberMutation,
  useRemoveProjectMemberMutation,
} = projectsApi;
