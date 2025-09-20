import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  AutoIncrement,
  CreatedAt,
  BelongsTo,
  ForeignKey,
} from "sequelize-typescript";
import { Project } from "./Project";
import { Task } from "./Task";
import { User } from "./User";

@Table({
  tableName: "activities",
  timestamps: true,
})
export class Activity extends Model<Activity> {
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

  @ForeignKey(() => Task)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
    field: "task_id",
  })
  taskId?: number;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    field: "user_id",
  })
  userId!: number;

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
