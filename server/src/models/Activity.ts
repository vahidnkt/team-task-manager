import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
  CreatedAt,
  BelongsTo,
  ForeignKey,
} from "sequelize-typescript";
import { v4 as uuidv4 } from "uuid";
import { Project } from "./Project";
import { Task } from "./Task";
import { User } from "./User";

@Table({
  tableName: "activities",
  timestamps: true,
})
export class Activity extends Model<Activity> {
  @PrimaryKey
  @Default(() => uuidv4())
  @Column(DataType.UUID)
  override id!: string;

  @ForeignKey(() => Project)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    field: "project_id",
  })
  projectId!: string;

  @ForeignKey(() => Task)
  @Column({
    type: DataType.UUID,
    allowNull: true,
    field: "task_id",
  })
  taskId?: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    field: "user_id",
  })
  userId!: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
  })
  action!: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  description?: string;

  @CreatedAt
  @Column({
    type: DataType.DATE,
    field: "created_at",
  })
  override createdAt!: Date;

  // Associations
  @BelongsTo(() => Project, "project_id")
  project!: Project;

  @BelongsTo(() => Task, "task_id")
  task?: Task;

  @BelongsTo(() => User, "user_id")
  user!: User;
}
