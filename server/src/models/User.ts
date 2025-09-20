import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
  CreatedAt,
  UpdatedAt,
  DeletedAt,
  HasMany,
} from "sequelize-typescript";
import { v4 as uuidv4 } from "uuid";
import { Project } from "./Project";
import { Task } from "./Task";
import { Comment } from "./Comment";
import { Activity } from "./Activity";

@Table({
  tableName: "users",
  timestamps: true,
  paranoid: true, // Enables soft delete
})
export class User extends Model<User> {
  @PrimaryKey
  @Default(() => uuidv4())
  @Column(DataType.UUID)
  override id!: string;

  @Column({
    type: DataType.STRING(50),
    allowNull: false,
    unique: true,
  })
  username!: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
    unique: true,
  })
  email!: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
    field: "password_hash",
  })
  passwordHash!: string;

  @Column({
    type: DataType.ENUM("user", "admin"),
    allowNull: false,
    defaultValue: "user",
  })
  role!: "user" | "admin";

  @CreatedAt
  @Column({
    type: DataType.DATE,
    field: "created_at",
  })
  override createdAt!: Date;

  @UpdatedAt
  @Column({
    type: DataType.DATE,
    field: "updated_at",
  })
  override updatedAt!: Date;

  @DeletedAt
  @Column({
    type: DataType.DATE,
    field: "deleted_at",
  })
  override deletedAt?: Date;

  // Associations
  @HasMany(() => Project, "created_by")
  createdProjects!: Project[];

  @HasMany(() => Task, "assignee_id")
  assignedTasks!: Task[];

  @HasMany(() => Comment, "commenter_id")
  comments!: Comment[];

  @HasMany(() => Activity, "user_id")
  activities!: Activity[];
}
