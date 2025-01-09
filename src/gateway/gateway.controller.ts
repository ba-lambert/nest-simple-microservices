import { Body, Controller, Get, Post, Headers, UnauthorizedException } from '@nestjs/common';
import { Client, ClientProxy, Transport } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Controller('api')
export class GatewayController {
  @Client({
    transport: Transport.TCP,
    options: { port: 3001 },
  })
  private authClient: ClientProxy;

  @Client({
    transport: Transport.TCP,
    options: { port: 3002 },
  })
  private blogClient: ClientProxy;

  // Auth endpoints
  @Post('auth/register')
  async register(@Body() data: { username: string; password: string }) {
    return firstValueFrom(
      this.authClient.send({ cmd: 'register' }, data)
    );
  }

  @Post('auth/login')
  async login(@Body() data: { username: string; password: string }) {
    return firstValueFrom(
      this.authClient.send({ cmd: 'login' }, data)
    );
  }

  // Blog endpoints
  @Post('blogs')
  async createBlog(
    @Headers('authorization') auth: string,
    @Body() data: { title: string; content: string }
  ) {
    if (!auth) throw new UnauthorizedException();
    
    const token = auth.replace('Bearer ', '');
    const user = await firstValueFrom(
      this.authClient.send({ cmd: 'validate_token' }, token)
    );

    if (!user) throw new UnauthorizedException();

    return firstValueFrom(
      this.blogClient.send(
        { cmd: 'create_blog' },
        { 
          ...data, 
          userId: user.userId,
          username: user.username 
        }
      )
    );
  }

  @Get('blogs')
  async getAllBlogs() {
    return firstValueFrom(
      this.blogClient.send({ cmd: 'get_all_blogs' }, {})
    );
  }

  @Get('blogs/my')
  async getMyBlogs(@Headers('authorization') auth: string) {
    if (!auth) throw new UnauthorizedException();
    
    const token = auth.replace('Bearer ', '');
    const user = await firstValueFrom(
      this.authClient.send({ cmd: 'validate_token' }, token)
    );

    if (!user) throw new UnauthorizedException();

    return firstValueFrom(
      this.blogClient.send({ cmd: 'get_user_blogs' }, user.userId)
    );
  }
} 