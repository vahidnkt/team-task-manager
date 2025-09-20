import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  AutoIncrement,
  CreatedAt,
  UpdatedAt,
  DeletedAt,
  BelongsTo,
  HasMany,
  ForeignKey,
} from "sequelize-typescript";
import { Project } from "./Project";
import { User } from "./User";
import { Comment } from "./Comment";
import { Activity } from "./Activity";

@Table({
  tableName: "tasks",
  timestamps: true,
  paranoid: true, // Enables soft delete
})
export class Task extends Model<Task> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  override id!: number;

  @ForeignKey(() => Project)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    field: "project_id",
  })
  projectId!: number;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  title!: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  description?: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
    field: "assignee_id",
  })
  assigneeId?: number;

  @Column({
    type: DataType.ENUM("todo", "in-progress", "done"),
    allowNull: false,
    defaultValue: "todo",
  })
  status!: "todo" | "in-progress" | "done";

  @Column({
    type: DataType.ENUM("low", "medium", "high"),
    allowNull: false,
    defaultValue: "medium",
  })
  priority!: "low" | "medium" | "high";

  @Column({
    type: DataType.DATEONLY,
    allowNull: true,
    field: "due_date",
  })
  dueDate?: Date;

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
  @BelongsTo(() => Project, "project_id")
  project!: Project;

  @BelongsTo(() => User, "assignee_id")
  assignee?: User;

  @HasMany(() => Comment, "task_id")
  comments!: Comment[];

  @HasMany(() => Activity, "task_id")
  activities!: Activity[];
}
