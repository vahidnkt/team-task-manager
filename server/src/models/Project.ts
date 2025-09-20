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
import { User } from "./User";
import { Task } from "./Task";
import { Activity } from "./Activity";

@Table({
  tableName: "projects",
  timestamps: true,
  paranoid: true, // Enables soft delete
})
export class Project extends Model<Project> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  override id!: number;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  name!: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  description?: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    field: "created_by",
  })
  createdBy!: number;

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
  @BelongsTo(() => User, "created_by")
  creator!: User;

  @HasMany(() => Task, "project_id")
  tasks!: Task[];

  @HasMany(() => Activity, "project_id")
  activities!: Activity[];
}
