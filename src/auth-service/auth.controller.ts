import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { AuthService } from './auth.service';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern({ cmd: 'register' })
  register(data: { username: string; password: string }) {
    return this.authService.register(data.username, data.password);
  }

  @MessagePattern({ cmd: 'login' })
  login(data: { username: string; password: string }) {
    return this.authService.login(data.username, data.password);
  }

  @MessagePattern({ cmd: 'validate_token' })
  validateToken(token: string) {
    return this.authService.validateToken(token);
  }
}
