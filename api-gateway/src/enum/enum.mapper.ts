import { Status } from '../order/order';
import { Size } from '../catalog/catalog';

export const mapOrderStatus = (status: number) => Status[status];

export const mapSize = (size: number) => Size[size];
