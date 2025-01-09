import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { BlogService } from './blog.service';

@Controller()
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @MessagePattern({ cmd: 'create_blog' })
  createBlog(data: { userId: number; username: string; title: string; content: string }) {
    return this.blogService.createBlog(
      data.userId,
      data.username,
      data.title,
      data.content
    );
  }

  @MessagePattern({ cmd: 'get_all_blogs' })
  getAllBlogs() {
    return this.blogService.getAllBlogs();
  }

  @MessagePattern({ cmd: 'get_user_blogs' })
  getUserBlogs(userId: number) {
    return this.blogService.getBlogsByUser(userId);
  }
} 