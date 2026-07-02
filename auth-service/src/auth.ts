import { GrpcMethod } from '@nestjs/microservices';
const protobuff = 'AuthService';

export interface RefreshTokenDto {
  refresh_token: string;
}

export interface RefreshTokenResponse {
  token: string;
  refresh_token: string;
}

export interface UserProfile {
  id: number;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role:string;
}

export interface User {
  id: number;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface LoginResponse {
  token: string;
  refresh_token: string;
}

export interface CreateUserDto {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface Empty {}

export interface Users {
  users: User[];
}

export interface GetUserByIdDto {
  id: number;
}
export interface LoginUserDto {
  email: string;
  password: string;
}
export interface LogoutUserDto {
  id: number;
  userId: number;
}

export interface DeleteUserDto {
  id: number;
  userId: number;
}

export interface UpdateUserDto {
  id: number;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export const AUTH_PACKAGE_NAME = 'auth';

export interface AuthServiceClient {
  refreshToken(request: RefreshTokenDto): Promise<RefreshTokenResponse>;
  registerUser(request: CreateUserDto): Promise<User>;
  getUserById(request: GetUserByIdDto): Promise<UserProfile>;
  getAllUsers(): Promise<Users>;
  login(request: LoginUserDto): Promise<LoginResponse>;
  logout(request: LogoutUserDto): Promise<Empty>;
  deleteUser(request: DeleteUserDto): Promise<Empty>;
  updateUser(request: UpdateUserDto): Promise<User>;
}

export interface AuthServiceController {
  refreshToken(request: RefreshTokenDto): Promise<RefreshTokenResponse>;
  registerUser(request: CreateUserDto): Promise<User>;
  getUserById(request: GetUserByIdDto): Promise<UserProfile>;
  getAllUsers(): Promise<Users> | Promise<User[]> | Promise<Empty>;
  login(request: LoginUserDto): Promise<LoginResponse>;
  logout(request: LogoutUserDto): Promise<Empty>;
  deleteUser(request: DeleteUserDto): Promise<Empty>;
  updateUser(request: UpdateUserDto): Promise<User>;
}

export function AuthServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = [
      'refreshToken',
      'registerUser',
      'getUserById',
      'getAllUsers',
      'login',
      'logout',
      'deleteUser',
      'updateUser',
    ];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(
        constructor.prototype,
        method,
      );
      GrpcMethod(protobuff, method)(
        constructor.prototype[method],
        method,
        descriptor,
      );
    }
  };
}
export const AUTH_SERVICE_NAME = 'AuthService';
