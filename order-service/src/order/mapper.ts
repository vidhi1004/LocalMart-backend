import { Status as DbStatus } from '../enum/status.enum';
import { Status as GrpcStatus } from '../order';

export function mapGrpcStatus(status: GrpcStatus): DbStatus {
  switch (status) {
    case GrpcStatus.PENDING:
      return DbStatus.PENDING;

    case GrpcStatus.CONFIRMED:
      return DbStatus.CONFIRMED;

    case GrpcStatus.PAID:
      return DbStatus.PAID;

    case GrpcStatus.SHIPPED:
      return DbStatus.SHIPPED;

    case GrpcStatus.DELIVERED:
      return DbStatus.DELIVERED;

    case GrpcStatus.CANCELLED:
      return DbStatus.CANCELLED;

    default:
      throw new Error('Invalid status');
  }
}
