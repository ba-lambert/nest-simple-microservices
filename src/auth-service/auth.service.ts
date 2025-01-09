import { Injectable } from '@nestjs/common';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  private users: any[] = [];
  private readonly usersPath = join(process.cwd(), 'users.json');

  constructor(private jwtService: JwtService) {
    try {
      this.users = JSON.parse(readFileSync(this.usersPath, 'utf8'));
    } catch {
      writeFileSync(this.usersPath, '[]');
    }
  }

  async register(username: string, password: string) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = { id: Date.now(), username, password: hashedPassword };
    this.users.push(newUser);
    writeFileSync(this.usersPath, JSON.stringify(this.users));
    return { message: 'User registered successfully' };
  }

  async login(username: string, password: string) {
    const user = this.users.find(u => u.username === username);
    if (!user) throw new Error('User not found');

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) throw new Error('Invalid password');

    const token = this.jwtService.sign({ userId: user.id, username });
    return { token };
  }

  validateToken(token: string) {
    try {
      return this.jwtService.verify(token);
    } catch {
      return null;
    }
  }
}
