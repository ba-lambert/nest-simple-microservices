import { Injectable } from '@nestjs/common';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

@Injectable()
export class BlogService {
  private blogs: any[] = [];
  private readonly blogsPath = join(process.cwd(), 'blogs.json');

  constructor() {
    try {
      this.blogs = JSON.parse(readFileSync(this.blogsPath, 'utf8'));
    } catch {
      writeFileSync(this.blogsPath, '[]');
    }
  }

  createBlog(userId: number, username: string, title: string, content: string) {
    const newBlog = {
      id: Date.now(),
      userId,
      postedBy: username,
      title,
      content,
      createdAt: new Date(),
    };
    this.blogs.push(newBlog);
    writeFileSync(this.blogsPath, JSON.stringify(this.blogs));
    return newBlog;
  }

  getAllBlogs() {
    return this.blogs;
  }

  getBlogsByUser(userId: number) {
    return this.blogs.filter(blog => blog.userId === userId);
  }
} 