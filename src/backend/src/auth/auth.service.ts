
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findOneByEmail(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id };
    return {
      user,
      token: this.jwtService.sign(payload),
    };
  }

  async register(createUserDto: CreateUserDto) {
    const user = await this.usersService.create(createUserDto);
    return this.login(user);
  }

  async socialLogin(provider: string, token: string) {
    // In a real implementation, you would verify the token with the provider
    // and extract user information (email, name, etc.).
    const userData = await this.verifyExternalToken(provider, token);

    // Check if user exists
    let user = await this.usersService.findOneByEmail(userData.email);

    // If not, create a new user
    if (!user) {
      user = await this.usersService.createFromSocial({
        email: userData.email,
        name: userData.name,
        provider,
        providerId: userData.id,
      });
    }

    return this.login(user);
  }

  private async verifyExternalToken(
    provider: string,
    token: string,
  ): Promise<any> {
    // In a real implementation, you would verify the token with the provider
    // For simplicity, we'll just return mock data
    return {
      id: '123',
      email: 'user@example.com',
      name: 'Social User',
    };
  }
}
