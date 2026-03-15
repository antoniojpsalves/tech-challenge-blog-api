import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';

jest.mock('bcrypt', () => ({
  compare: jest.fn(),
}));

describe('AuthService', () => {
  let service: AuthService;

  const usersServiceMock = {
    findByEmail: jest.fn(),
  };

  const jwtServiceMock = {
    sign: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    service = new AuthService(
      usersServiceMock as unknown as UsersService,
      jwtServiceMock as unknown as JwtService,
    );
  });

  describe('login', () => {
    const loginDto = { email: 'test@email.com', password: '123456' };

    const userMock = {
      id: 'user-1',
      email: 'test@email.com',
      password: 'hashed_password',
      role: 'ALUNO',
    };

    it('should throw UnauthorizedException if user is not found', async () => {
      usersServiceMock.findByEmail.mockResolvedValue(null);

      await expect(service.login(loginDto)).rejects.toThrow(
        new UnauthorizedException('Invalid credentials'),
      );

      expect(usersServiceMock.findByEmail).toHaveBeenCalledWith(loginDto.email);
      expect(bcrypt.compare).not.toHaveBeenCalled();
    });

    it('should throw UnauthorizedException if password is incorrect', async () => {
      usersServiceMock.findByEmail.mockResolvedValue(userMock);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(service.login(loginDto)).rejects.toThrow(
        new UnauthorizedException('Invalid credentials'),
      );

      expect(bcrypt.compare).toHaveBeenCalledWith(
        loginDto.password,
        userMock.password,
      );
      expect(jwtServiceMock.sign).not.toHaveBeenCalled();
    });

    it('should return access_token when credentials are valid', async () => {
      usersServiceMock.findByEmail.mockResolvedValue(userMock);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      jwtServiceMock.sign.mockReturnValue('jwt_token');

      const result = await service.login(loginDto);

      expect(usersServiceMock.findByEmail).toHaveBeenCalledWith(loginDto.email);
      expect(bcrypt.compare).toHaveBeenCalledWith(
        loginDto.password,
        userMock.password,
      );
      expect(jwtServiceMock.sign).toHaveBeenCalledWith({
        sub: userMock.id,
        email: userMock.email,
        role: userMock.role,
      });
      expect(result).toEqual({ access_token: 'jwt_token' });
    });

    it('should propagate error from usersService', async () => {
      const error = new Error('database error');
      usersServiceMock.findByEmail.mockRejectedValue(error);

      await expect(service.login(loginDto)).rejects.toThrow('database error');
      expect(jwtServiceMock.sign).not.toHaveBeenCalled();
    });
  });
});
