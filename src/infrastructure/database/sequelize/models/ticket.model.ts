import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config';
import { TicketStatus } from '@domain/enums/TicketStatus';
import { UserModel } from './user.model';

export class TicketModel extends Model {
  public id!: string;
  public title!: string;
  public description!: string;
  public status!: TicketStatus;
  public clientId!: string;
  public resolvedAt!: Date | null;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

TicketModel.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM(...Object.values(TicketStatus)),
      allowNull: false,
      defaultValue: TicketStatus.PENDING
    },
    clientId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: UserModel,
        key: 'id'
      }
    },
    resolvedAt: {
      type: DataTypes.DATE,
      allowNull: true
    }
  },
  {
    sequelize,
    tableName: 'tickets',
    timestamps: true
  }
);

// Relaciones
TicketModel.belongsTo(UserModel, { foreignKey: 'clientId', as: 'client' });
TicketModel.belongsTo(UserModel, { foreignKey: 'clientId', as: 'createdBy' });
