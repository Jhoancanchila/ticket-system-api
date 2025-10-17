import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config';
import { UserModel } from './user.model';
import { TicketModel } from './ticket.model';

export class CommentModel extends Model {
  public id!: string;
  public ticketId!: string;
  public userId!: string;
  public content!: string;
  public isInternal!: boolean;
  public readonly createdAt!: Date;
}

CommentModel.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    ticketId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: TicketModel,
        key: 'id'
      }
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: UserModel,
        key: 'id'
      }
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    isInternal: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  },
  {
    sequelize,
    tableName: 'comments',
    timestamps: true,
    updatedAt: false
  }
);

// Relaciones
CommentModel.belongsTo(TicketModel, { foreignKey: 'ticketId' });
CommentModel.belongsTo(UserModel, { foreignKey: 'userId' });