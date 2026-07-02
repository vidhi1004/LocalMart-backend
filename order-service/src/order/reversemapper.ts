import { Status as DbStatus } from '../enum/status.enum';
import { Status as GrpcStatus } from '../order';

export function mapDbStatus(status: DbStatus): GrpcStatus {
  switch (status) {
    case DbStatus.PENDING:
      return GrpcStatus.PENDING;

    case DbStatus.CONFIRMED:
      return GrpcStatus.CONFIRMED;

    case DbStatus.PAID:
      return GrpcStatus.PAID;

    case DbStatus.SHIPPED:
      return GrpcStatus.SHIPPED;

    case DbStatus.DELIVERED:
      return GrpcStatus.DELIVERED;

    case DbStatus.CANCELLED:
      return GrpcStatus.CANCELLED;

    default:
      throw new Error('Invalid status');
  }
}
