import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  AutoIncrement,
  CreatedAt,
  UpdatedAt,
  BelongsTo,
  ForeignKey,
} from "sequelize-typescript";
import { Task } from "./Task";
import { User } from "./User";

@Table({
  tableName: "comments",
  timestamps: true,
})
export class Comment extends Model<Comment> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  override id!: number;

  @ForeignKey(() => Task)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    field: "task_id",
  })
  taskId!: number;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    field: "commenter_id",
  })
  commenterId!: number;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  text!: string;

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

  // Associations
  @BelongsTo(() => Task, "task_id")
  task!: Task;

  @BelongsTo(() => User, "commenter_id")
  commenter!: User;
}
