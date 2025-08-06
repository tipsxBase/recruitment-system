import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  Headers,
  Patch,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import {
  GetPostsRequestSchema,
  CreatePostRequestSchema,
  UpdatePostRequestSchema,
  ChangePostStatusRequestSchema,
  GetPostStatsRequestSchema,
  BatchImportPostsRequestSchema,
  type GetPostsRequest,
  type CreatePostRequest,
  type UpdatePostRequest,
  type ChangePostStatusRequest,
  type GetPostStatsRequest,
  type BatchImportPostsRequest,
} from '@recruitment/schema';

@Controller('posts')
export class PostsController {
  constructor(private postsService: PostsService) {}

  @Get()
  async getPosts(@Query() query: GetPostsRequest, @Headers() headers: any) {
    const currentUser = this.extractUserFromHeaders(headers);
    const validatedQuery = GetPostsRequestSchema.parse(query);
    return this.postsService.getPosts(validatedQuery, currentUser);
  }

  @Get('stats')
  async getPostStats(
    @Query() query: GetPostStatsRequest,
    @Headers() headers: any,
  ) {
    const currentUser = this.extractUserFromHeaders(headers);
    const validatedQuery = GetPostStatsRequestSchema.parse(query);
    return this.postsService.getPostStats(validatedQuery, currentUser);
  }

  @Get(':id')
  async getPostById(@Param('id') id: string, @Headers() headers: any) {
    const currentUser = this.extractUserFromHeaders(headers);
    return this.postsService.getPostById(id, currentUser);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createPost(
    @Body() createPostDto: CreatePostRequest,
    @Headers() headers: any,
  ) {
    const currentUser = this.extractUserFromHeaders(headers);
    const validatedData = CreatePostRequestSchema.parse(createPostDto);
    return this.postsService.createPost(validatedData, currentUser);
  }

  @Put(':id')
  async updatePost(
    @Param('id') id: string,
    @Body() updatePostDto: UpdatePostRequest,
    @Headers() headers: any,
  ) {
    const currentUser = this.extractUserFromHeaders(headers);
    const validatedData = UpdatePostRequestSchema.parse(updatePostDto);
    return this.postsService.updatePost(id, validatedData, currentUser);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deletePost(@Param('id') id: string, @Headers() headers: any) {
    const currentUser = this.extractUserFromHeaders(headers);
    return this.postsService.deletePost(id, currentUser);
  }

  @Patch(':id/status')
  async updatePostStatus(
    @Param('id') id: string,
    @Body() updateStatusDto: ChangePostStatusRequest,
    @Headers() headers: any,
  ) {
    const currentUser = this.extractUserFromHeaders(headers);
    const validatedData = ChangePostStatusRequestSchema.parse(updateStatusDto);
    return this.postsService.updatePostStatus(id, validatedData, currentUser);
  }

  @Post('batch-import')
  async batchImportPosts(
    @Body() batchImportDto: BatchImportPostsRequest,
    @Headers() headers: any,
  ) {
    const currentUser = this.extractUserFromHeaders(headers);
    const validatedData = BatchImportPostsRequestSchema.parse(batchImportDto);
    return this.postsService.batchImportPosts(validatedData, currentUser);
  }

  private extractUserFromHeaders(headers: any) {
    return {
      id: headers['x-user-id'],
      email: headers['x-user-email'],
      roles: JSON.parse(headers['x-user-roles'] || '[]'),
      departments: JSON.parse(headers['x-user-departments'] || '[]'),
    };
  }
}
