// import React, { useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import {
//   Card,
//   Button,
//   Typography,
//   Descriptions,
//   Tag,
//   Avatar,
//   Modal,
//   Spin,
//   Alert,
//   Divider,
//   Row,
//   Col,
//   Statistic,
// } from "antd";
// import {
//   EditOutlined,
//   DeleteOutlined,
//   ArrowLeftOutlined,
//   UserOutlined,
//   MailOutlined,
//   CalendarOutlined,
//   CrownOutlined,
//   SafetyOutlined,
// } from "@ant-design/icons";
// import {
//   useGetUserQuery,
//   useDeleteUserMutation,
// } from "../../store/api/usersApi";
// import { useAuth } from "../../hooks";
// // Toast messages are handled by middleware
// import { format, formatDistanceToNow } from "date-fns";

// const { Title, Text } = Typography;

// const UserDetail: React.FC = () => {
//   const { id } = useParams<{ id: string }>();
//   const navigate = useNavigate();
//   const { user: currentUser, isAdmin } = useAuth();
//   const [isDeleting, setIsDeleting] = useState(false);
//   // Toast messages are handled by middleware

//   const [deleteUser] = useDeleteUserMutation();

//   const {
//     data: user,
//     isLoading,
//     error,
//     refetch,
//   } = useGetUserQuery(id!, {
//     skip: !id || isDeleting,
//   });

//   // Check if current user can view this user's details
//   const canView = isAdmin() || currentUser?.id === id;
//   const canEdit = isAdmin() || currentUser?.id === id;
//   const canDelete = isAdmin() && currentUser?.id !== id; // Admin can't delete themselves

//   // Handle delete user
//   const handleDelete = async () => {
//     if (!user) return;

//     try {
//       const result = await Modal.confirm({
//         title: "Delete User",
//         content: `Are you sure you want to delete user "${user.username}"? This action cannot be undone.`,
//         okText: "Delete",
//         okType: "danger",
//         cancelText: "Cancel",
//       });

//       // If user confirmed, proceed with deletion
//       if (result) {
//         setIsDeleting(true);
//         try {
//           await deleteUser(user.id).unwrap();
//           // Toast message is handled by middleware
//           // Navigate immediately to prevent further queries
//           navigate("/users");
//         } catch (error: any) {
//           // Error toast is handled by middleware
//           console.error("Delete error:", error);
//           setIsDeleting(false); // Reset state on error
//         }
//       }
//     } catch (error) {
//       console.error("Modal error:", error);
//     }
//   };

//   // Show access denied if user can't view this profile
//   if (!canView) {
//     return (
//       <div className="p-6">
//         <Card className="text-center">
//           <div className="py-12">
//             <div className="text-6xl mb-4">🚫</div>
//             <Title level={3} className="text-gray-600">
//               Access Denied
//             </Title>
//             <Text className="text-gray-500">
//               You don't have permission to view this user's profile.
//             </Text>
//             <div className="mt-4">
//               <Button onClick={() => navigate("/users")}>Back to Users</Button>
//             </div>
//           </div>
//         </Card>
//       </div>
//     );
//   }

//   // Loading state
//   if (isLoading) {
//     return (
//       <div className="p-6">
//         <div className="flex justify-center items-center h-64">
//           <Spin size="large" />
//         </div>
//       </div>
//     );
//   }

//   // Error state
//   if (error) {
//     return (
//       <div className="p-6">
//         <Alert
//           message="Error"
//           description="Failed to load user details. Please try again."
//           type="error"
//           showIcon
//           action={
//             <Button size="small" onClick={() => refetch()}>
//               Retry
//             </Button>
//           }
//         />
//       </div>
//     );
//   }

//   // User not found
//   if (!user) {
//     return (
//       <div className="p-6">
//         <Card className="text-center">
//           <div className="py-12">
//             <div className="text-6xl mb-4">👤</div>
//             <Title level={3} className="text-gray-600">
//               User Not Found
//             </Title>
//             <Text className="text-gray-500">
//               The user you're looking for doesn't exist or has been deleted.
//             </Text>
//             <div className="mt-4">
//               <Button onClick={() => navigate("/users")}>Back to Users</Button>
//             </div>
//           </div>
//         </Card>
//       </div>
//     );
//   }

//   return (
//     <div className="p-6">
//       {/* Header */}
//       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
//         <div className="flex items-center gap-4">
//           <Button
//             icon={<ArrowLeftOutlined />}
//             onClick={() => navigate("/users")}
//             className="flex-shrink-0"
//           >
//             Back
//           </Button>
//           <div>
//             <Title level={2} className="!mb-2">
//               User Details
//             </Title>
//             <Text className="text-gray-600">
//               View and manage user information
//             </Text>
//           </div>
//         </div>

//         <div className="flex gap-2">
//           {canEdit ? (
//             <Button
//               type="primary"
//               icon={<EditOutlined />}
//               onClick={() => navigate(`/users/${user.id}/edit`)}
//             >
//               Edit User
//             </Button>
//           ) : null}
//           {canDelete ? (
//             <Button
//               danger
//               icon={<DeleteOutlined />}
//               onClick={handleDelete}
//               loading={isDeleting}
//               disabled={isDeleting}
//             >
//               Delete User
//             </Button>
//           ) : null}
//         </div>
//       </div>

//       {/* User Profile Card */}
//       <Card className="mb-6">
//         <div className="flex flex-col sm:flex-row items-start gap-6">
//           <Avatar
//             size={120}
//             icon={<UserOutlined />}
//             className="bg-blue-500 flex-shrink-0"
//           />

//           <div className="flex-1">
//             <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
//               <div>
//                 <Title level={3} className="!mb-2">
//                   {user.username}
//                 </Title>
//                 <div className="flex items-center gap-2 mb-2">
//                   <MailOutlined className="text-gray-500" />
//                   <Text className="text-gray-600">{user.email}</Text>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <Tag
//                     color={user.role === "admin" ? "red" : "blue"}
//                     icon={
//                       user.role === "admin" ? (
//                         <CrownOutlined />
//                       ) : (
//                         <UserOutlined />
//                       )
//                     }
//                   >
//                     {user.role.toUpperCase()}
//                   </Tag>
//                   {currentUser?.id === user.id && (
//                     <Tag color="green" icon={<SafetyOutlined />}>
//                       Current User
//                     </Tag>
//                   )}
//                 </div>
//               </div>
//             </div>

//             <Divider />

//             <Row gutter={[16, 16]}>
//               <Col xs={24} sm={12} md={8}>
//                 <Statistic
//                   title="Account Created"
//                   value={format(new Date(user.createdAt), "MMM dd, yyyy")}
//                   prefix={<CalendarOutlined />}
//                 />
//               </Col>
//               <Col xs={24} sm={12} md={8}>
//                 <Statistic
//                   title="Last Updated"
//                   value={format(new Date(user.updatedAt), "MMM dd, yyyy")}
//                   prefix={<CalendarOutlined />}
//                 />
//               </Col>
//               <Col xs={24} sm={12} md={8}>
//                 <Statistic
//                   title="User ID"
//                   value={user.id}
//                   valueStyle={{ fontSize: "14px" }}
//                 />
//               </Col>
//             </Row>
//           </div>
//         </div>
//       </Card>

//       {/* Detailed Information */}
//       <Row gutter={[16, 16]}>
//         <Col xs={24} lg={12}>
//           <Card title="Account Information" className="h-full">
//             <Descriptions column={1} size="small">
//               <Descriptions.Item label="Username">
//                 <Text code>{user.username}</Text>
//               </Descriptions.Item>
//               <Descriptions.Item label="Email">
//                 <Text>{user.email}</Text>
//               </Descriptions.Item>
//               <Descriptions.Item label="Role">
//                 <Tag color={user.role === "admin" ? "red" : "blue"}>
//                   {user.role.toUpperCase()}
//                 </Tag>
//               </Descriptions.Item>
//               <Descriptions.Item label="User ID">
//                 <Text code className="text-xs">
//                   {user.id}
//                 </Text>
//               </Descriptions.Item>
//             </Descriptions>
//           </Card>
//         </Col>

//         <Col xs={24} lg={12}>
//           <Card title="Timeline" className="h-full">
//             <Descriptions column={1} size="small">
//               <Descriptions.Item label="Account Created">
//                 <div>
//                   <Text>
//                     {format(
//                       new Date(user.createdAt),
//                       "MMM dd, yyyy 'at' h:mm a"
//                     )}
//                   </Text>
//                   <br />
//                   <Text type="secondary" className="text-xs">
//                     {formatDistanceToNow(new Date(user.createdAt), {
//                       addSuffix: true,
//                     })}
//                   </Text>
//                 </div>
//               </Descriptions.Item>
//               <Descriptions.Item label="Last Updated">
//                 <div>
//                   <Text>
//                     {format(
//                       new Date(user.updatedAt),
//                       "MMM dd, yyyy 'at' h:mm a"
//                     )}
//                   </Text>
//                   <br />
//                   <Text type="secondary" className="text-xs">
//                     {formatDistanceToNow(new Date(user.updatedAt), {
//                       addSuffix: true,
//                     })}
//                   </Text>
//                 </div>
//               </Descriptions.Item>
//               {user.deletedAt && (
//                 <Descriptions.Item label="Deleted At">
//                   <Text type="danger">
//                     {format(
//                       new Date(user.deletedAt),
//                       "MMM dd, yyyy 'at' h:mm a"
//                     )}
//                   </Text>
//                 </Descriptions.Item>
//               )}
//             </Descriptions>
//           </Card>
//         </Col>
//       </Row>

//       {/* User Statistics (Placeholder for future implementation) */}
//       <Card title="User Statistics" className="mt-6">
//         <Row gutter={[16, 16]}>
//           <Col xs={24} sm={12} md={6}>
//             <Statistic title="Projects Created" value={0} suffix="projects" />
//           </Col>
//           <Col xs={24} sm={12} md={6}>
//             <Statistic title="Tasks Assigned" value={0} suffix="tasks" />
//           </Col>
//           <Col xs={24} sm={12} md={6}>
//             <Statistic title="Tasks Completed" value={0} suffix="tasks" />
//           </Col>
//           <Col xs={24} sm={12} md={6}>
//             <Statistic title="Comments Made" value={0} suffix="comments" />
//           </Col>
//         </Row>
//         <div className="mt-4">
//           <Text type="secondary" className="text-sm">
//             * Statistics will be available in a future update
//           </Text>
//         </div>
//       </Card>
//     </div>
//   );
// };

// export default UserDetail;
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  Button,
  Typography,
  Descriptions,
  Tag,
  Avatar,
  Modal,
  Spin,
  Alert,
  Divider,
  Row,
  Col,
  Statistic,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  ArrowLeftOutlined,
  UserOutlined,
  MailOutlined,
  CalendarOutlined,
  CrownOutlined,
  SafetyOutlined,
} from "@ant-design/icons";
import {
  useGetUserQuery,
  useDeleteUserMutation,
} from "../../store/api/usersApi";
import { useAuth } from "../../hooks";
import { format, formatDistanceToNow } from "date-fns";

const { Title, Text } = Typography;

const UserDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user: currentUser, isAdmin } = useAuth();
  const [isDeleting, setIsDeleting] = useState(false);

  const [deleteUser] = useDeleteUserMutation();

  const {
    data: user,
    isLoading,
    error,
    refetch,
  } = useGetUserQuery(id!, {
    skip: !id || isDeleting,
  });

  // Check if current user can view this user's details
  const canView = isAdmin() || currentUser?.id === id;
  const canEdit = isAdmin() || currentUser?.id === id;
  const canDelete = isAdmin() && currentUser?.id !== id; // Admin can't delete themselves

  // Handle delete user
  const handleDelete = async () => {
    if (!user) return;

    try {
      const result = await Modal.confirm({
        title: "Delete User",
        content: `Are you sure you want to delete user "${user.username}"? This action cannot be undone.`,
        okText: "Delete",
        okType: "danger",
        cancelText: "Cancel",
      });

      // If user confirmed, proceed with deletion
      if (result) {
        setIsDeleting(true);
        try {
          await deleteUser(user.id).unwrap();
          navigate("/users");
        } catch (error: any) {
          console.error("Delete error:", error);
          setIsDeleting(false); // Reset state on error
        }
      }
    } catch (error) {
      console.error("Modal error:", error);
    }
  };

  // Show access denied if user can't view this profile
  if (!canView) {
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

        <div className="relative z-10 -mx-2 sm:-mx-4 lg:-mx-6 -my-2 sm:-my-4 lg:-my-6 min-h-screen p-2 sm:p-4 lg:p-6">
          <div className="glass-card rounded-lg sm:rounded-xl p-6 sm:p-8 border border-white/30">
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🚫</div>
              <Title level={3} className="text-gray-800 mb-4">
                Access Denied
              </Title>
              <Text className="text-gray-600 text-base">
                You don't have permission to view this user's profile.
              </Text>
              <div className="mt-6">
                <Button
                  onClick={() => navigate("/users")}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-none"
                >
                  Back to Users
                </Button>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Loading state
  if (isLoading) {
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
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <Spin size="large" />
        </div>
      </>
    );
  }

  // Error state
  if (error) {
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
        <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
          <Alert
            message="Error"
            description="Failed to load user details. Please try again."
            type="error"
            showIcon
            action={
              <Button
                size="small"
                onClick={() => refetch()}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-none"
              >
                Retry
              </Button>
            }
          />
        </div>
      </>
    );
  }

  // User not found
  if (!user) {
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
        <div className="relative z-10 -mx-2 sm:-mx-4 lg:-mx-6 -my-2 sm:-my-4 lg:-my-6 min-h-screen p-2 sm:p-4 lg:p-6">
          <div className="glass-card rounded-lg sm:rounded-xl p-6 sm:p-8 border border-white/30">
            <div className="text-center py-12">
              <div className="text-6xl mb-4">👤</div>
              <Title level={3} className="text-gray-800 mb-4">
                User Not Found
              </Title>
              <Text className="text-gray-600 text-base">
                The user you're looking for doesn't exist or has been deleted.
              </Text>
              <div className="mt-6">
                <Button
                  onClick={() => navigate("/users")}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-none"
                >
                  Back to Users
                </Button>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      {/* Animated background with floating orbs */}
      <div className="animated-background">
        <div className="floating-orb floating-orb-1"></div>
        <div className="floating-orb floating-orb-2"></div>
        <div className="floating-orb floating-orb-3"></div>
        <div className="floating-orb floating-orb-4"></div>
        <div className="floating-orb floating-orb-5"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 -mx-2 sm:-mx-4 lg:-mx-6 -my-2 sm:-my-4 lg:-my-6 min-h-screen p-2 sm:p-4 lg:p-6">
        {/* Header Section */}
        <div className="glass-card rounded-lg sm:rounded-xl p-4 sm:p-6 mb-6 sm:mb-8 border border-white/30">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6">
            <div className="flex items-center gap-4">
              <Button
                icon={<ArrowLeftOutlined />}
                onClick={() => navigate("/users")}
                className="bg-white/60 hover:bg-white/80 border-gray-200 text-gray-700 transition-all duration-200"
                size="large"
              >
                Back
              </Button>
              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-2">
                  👤 User Details
                </h1>
                <p className="text-base sm:text-lg text-gray-800">
                  View and manage user information
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 sm:gap-3">
              {canEdit && (
                <Button
                  type="primary"
                  icon={<EditOutlined />}
                  onClick={() => navigate(`/users/${user.id}/edit`)}
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
                  Edit User
                </Button>
              )}
              {canDelete && (
                <Button
                  danger
                  icon={<DeleteOutlined />}
                  onClick={handleDelete}
                  loading={isDeleting}
                  disabled={isDeleting}
                  className="h-10 sm:h-12 px-4 sm:px-6 text-sm sm:text-base bg-red-600 hover:bg-red-700 text-white border-red-600 hover:border-red-700"
                >
                  Delete User
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* User Profile Card */}
        <div className="glass-card rounded-lg sm:rounded-xl p-4 sm:p-6 mb-6 sm:mb-8 border border-white/30">
          <div className="flex flex-col sm:flex-row items-start gap-6">
            <Avatar
              size={120}
              className="bg-gradient-to-r from-blue-500 to-purple-500 flex-shrink-0"
            >
              <span className="text-3xl font-bold text-white">
                {user.username?.charAt(0).toUpperCase() || "U"}
              </span>
            </Avatar>

            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
                <div>
                  <Title level={3} className="!mb-2 text-gray-900">
                    {user.username}
                  </Title>
                  <div className="flex items-center gap-2 mb-2">
                    <MailOutlined className="text-gray-500" />
                    <Text className="text-gray-600">{user.email}</Text>
                  </div>
                  <div className="flex items-center gap-2">
                    <Tag
                      color={user.role === "admin" ? "red" : "blue"}
                      icon={
                        user.role === "admin" ? (
                          <CrownOutlined />
                        ) : (
                          <UserOutlined />
                        )
                      }
                    >
                      {user.role.toUpperCase()}
                    </Tag>
                    {currentUser?.id === user.id && (
                      <Tag color="green" icon={<SafetyOutlined />}>
                        Current User
                      </Tag>
                    )}
                  </div>
                </div>
              </div>

              <Divider />

              <Row gutter={[16, 16]}>
                <Col xs={24} sm={12} md={8}>
                  <div className="glass-card rounded-lg p-3 sm:p-4 border border-white/30 text-center">
                    <Statistic
                      title="Account Created"
                      value={format(new Date(user.createdAt), "MMM dd, yyyy")}
                      prefix={<CalendarOutlined />}
                    />
                  </div>
                </Col>
                <Col xs={24} sm={12} md={8}>
                  <div className="glass-card rounded-lg p-3 sm:p-4 border border-white/30 text-center">
                    <Statistic
                      title="Last Updated"
                      value={format(new Date(user.updatedAt), "MMM dd, yyyy")}
                      prefix={<CalendarOutlined />}
                    />
                  </div>
                </Col>
                <Col xs={24} sm={12} md={8}>
                  <div className="glass-card rounded-lg p-3 sm:p-4 border border-white/30 text-center">
                    <Statistic
                      title="User ID"
                      value={user.id.slice(0, 8) + "..."}
                      valueStyle={{ fontSize: "14px" }}
                    />
                  </div>
                </Col>
              </Row>
            </div>
          </div>
        </div>

        {/* Detailed Information */}
        <Row gutter={[16, 16]} className="mb-6">
          <Col xs={24} lg={12}>
            <div className="glass-card rounded-lg sm:rounded-xl p-4 sm:p-6 border border-white/30 h-full">
              <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">
                📋 Account Information
              </h4>
              <Descriptions column={1} size="small">
                <Descriptions.Item label="Username">
                  <Text code>{user.username}</Text>
                </Descriptions.Item>
                <Descriptions.Item label="Email">
                  <Text>{user.email}</Text>
                </Descriptions.Item>
                <Descriptions.Item label="Role">
                  <Tag color={user.role === "admin" ? "red" : "blue"}>
                    {user.role.toUpperCase()}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="User ID">
                  <Text code className="text-xs">
                    {user.id}
                  </Text>
                </Descriptions.Item>
              </Descriptions>
            </div>
          </Col>

          <Col xs={24} lg={12}>
            <div className="glass-card rounded-lg sm:rounded-xl p-4 sm:p-6 border border-white/30 h-full">
              <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">
                ⏰ Timeline
              </h4>
              <Descriptions column={1} size="small">
                <Descriptions.Item label="Account Created">
                  <div>
                    <Text>
                      {format(
                        new Date(user.createdAt),
                        "MMM dd, yyyy 'at' h:mm a"
                      )}
                    </Text>
                    <br />
                    <Text type="secondary" className="text-xs">
                      {formatDistanceToNow(new Date(user.createdAt), {
                        addSuffix: true,
                      })}
                    </Text>
                  </div>
                </Descriptions.Item>
                <Descriptions.Item label="Last Updated">
                  <div>
                    <Text>
                      {format(
                        new Date(user.updatedAt),
                        "MMM dd, yyyy 'at' h:mm a"
                      )}
                    </Text>
                    <br />
                    <Text type="secondary" className="text-xs">
                      {formatDistanceToNow(new Date(user.updatedAt), {
                        addSuffix: true,
                      })}
                    </Text>
                  </div>
                </Descriptions.Item>
                {user.deletedAt && (
                  <Descriptions.Item label="Deleted At">
                    <Text type="danger">
                      {format(
                        new Date(user.deletedAt),
                        "MMM dd, yyyy 'at' h:mm a"
                      )}
                    </Text>
                  </Descriptions.Item>
                )}
              </Descriptions>
            </div>
          </Col>
        </Row>

        {/* User Statistics */}
        <div className="glass-card rounded-lg sm:rounded-xl p-4 sm:p-6 border border-white/30">
          <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-6">
            📈 User Statistics
          </h4>
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} md={6}>
              <div className="glass-card rounded-lg p-3 sm:p-4 border border-white/30 text-center">
                <div className="text-2xl mb-2">📁</div>
                <div className="text-lg font-semibold text-blue-600">
                  {user.statistics?.projectsCreated || 0}
                </div>
                <div className="text-xs sm:text-sm text-gray-600">
                  Projects Created
                </div>
              </div>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <div className="glass-card rounded-lg p-3 sm:p-4 border border-white/30 text-center">
                <div className="text-2xl mb-2">📋</div>
                <div className="text-lg font-semibold text-orange-600">
                  {user.statistics?.tasksAssigned || 0}
                </div>
                <div className="text-xs sm:text-sm text-gray-600">
                  Tasks Assigned
                </div>
              </div>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <div className="glass-card rounded-lg p-3 sm:p-4 border border-white/30 text-center">
                <div className="text-2xl mb-2">✅</div>
                <div className="text-lg font-semibold text-green-600">
                  {user.statistics?.tasksCompleted || 0}
                </div>
                <div className="text-xs sm:text-sm text-gray-600">
                  Tasks Completed
                </div>
              </div>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <div className="glass-card rounded-lg p-3 sm:p-4 border border-white/30 text-center">
                <div className="text-2xl mb-2">💬</div>
                <div className="text-lg font-semibold text-purple-600">
                  {user.statistics?.commentsMade || 0}
                </div>
                <div className="text-xs sm:text-sm text-gray-600">
                  Comments Made
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </div>
    </>
  );
};

export default UserDetail;
