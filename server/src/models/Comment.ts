import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
  CreatedAt,
  UpdatedAt,
  BelongsTo,
  ForeignKey,
} from "sequelize-typescript";
import { v4 as uuidv4 } from "uuid";
import { Task } from "./Task";
import { User } from "./User";

@Table({
  tableName: "comments",
  timestamps: true,
})
export class Comment extends Model<Comment> {
  @PrimaryKey
  @Default(() => uuidv4())
  @Column(DataType.UUID)
  override id!: string;

  @ForeignKey(() => Task)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    field: "task_id",
  })
  taskId!: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    field: "commenter_id",
  })
  commenterId!: string;

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
