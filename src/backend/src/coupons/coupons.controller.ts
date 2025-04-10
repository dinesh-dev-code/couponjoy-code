
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { CouponsService } from './coupons.service';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { UpdateCouponDto } from './dto/update-coupon.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Public } from '../auth/decorators/public.decorator';

@ApiTags('coupons')
@Controller('coupons')
export class CouponsController {
  constructor(private readonly couponsService: CouponsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new coupon' })
  @ApiResponse({ status: 201, description: 'Coupon created successfully' })
  create(@Body() createCouponDto: CreateCouponDto) {
    return this.couponsService.create(createCouponDto);
  }

  @Public()
  @Get()
  @ApiOperation({ summary: 'Get all coupons with optional filters' })
  @ApiQuery({ name: 'categoryId', required: false })
  @ApiQuery({ name: 'storeId', required: false })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'isPopular', required: false, type: Boolean })
  @ApiQuery({ name: 'isNew', required: false, type: Boolean })
  @ApiQuery({ name: 'isExpiringSoon', required: false, type: Boolean })
  @ApiResponse({ status: 200, description: 'Returns all coupons matching filters' })
  findAll(
    @Query('categoryId') categoryId?: string,
    @Query('storeId') storeId?: string,
    @Query('search') search?: string,
    @Query('isPopular') isPopular?: boolean,
    @Query('isNew') isNew?: boolean,
    @Query('isExpiringSoon') isExpiringSoon?: boolean,
  ) {
    return this.couponsService.findAll({
      categoryId,
      storeId,
      search,
      isPopular,
      isNew,
      isExpiringSoon,
    });
  }

  @Public()
  @Get('popular')
  @ApiOperation({ summary: 'Get popular coupons' })
  @ApiResponse({ status: 200, description: 'Returns popular coupons' })
  findPopular() {
    return this.couponsService.findPopular();
  }

  @Public()
  @Get('recommended')
  @ApiOperation({ summary: 'Get recommended coupons (newest)' })
  @ApiResponse({ status: 200, description: 'Returns recommended coupons' })
  findRecommended() {
    return this.couponsService.findNew();
  }

  @Public()
  @Get('expiring-soon')
  @ApiOperation({ summary: 'Get coupons expiring soon' })
  @ApiResponse({ status: 200, description: 'Returns coupons expiring soon' })
  findExpiringSoon() {
    return this.couponsService.findExpiringSoon();
  }

  @Public()
  @Get('search')
  @ApiOperation({ summary: 'Search coupons by query' })
  @ApiQuery({ name: 'q', required: true })
  @ApiResponse({ status: 200, description: 'Returns coupons matching search query' })
  search(@Query('q') query: string) {
    return this.couponsService.search(query);
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Get coupon by ID' })
  @ApiResponse({ status: 200, description: 'Returns the coupon' })
  @ApiResponse({ status: 404, description: 'Coupon not found' })
  findOne(@Param('id') id: string) {
    return this.couponsService.findOne(id);
  }

  @Public()
  @Get('store/:id')
  @ApiOperation({ summary: 'Get coupons by store ID' })
  @ApiResponse({ status: 200, description: 'Returns coupons for the store' })
  @ApiResponse({ status: 404, description: 'Store not found' })
  findByStore(@Param('id') id: string) {
    return this.couponsService.findByStore(id);
  }

  @Public()
  @Get('category/:id')
  @ApiOperation({ summary: 'Get coupons by category ID' })
  @ApiResponse({ status: 200, description: 'Returns coupons for the category' })
  @ApiResponse({ status: 404, description: 'Category not found' })
  findByCategory(@Param('id') id: string) {
    return this.couponsService.findByCategory(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a coupon' })
  @ApiResponse({ status: 200, description: 'Coupon updated successfully' })
  @ApiResponse({ status: 404, description: 'Coupon not found' })
  update(@Param('id') id: string, @Body() updateCouponDto: UpdateCouponDto) {
    return this.couponsService.update(id, updateCouponDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a coupon' })
  @ApiResponse({ status: 200, description: 'Coupon deleted successfully' })
  @ApiResponse({ status: 404, description: 'Coupon not found' })
  remove(@Param('id') id: string) {
    return this.couponsService.remove(id);
  }

  @Post(':id/verify')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Verify a coupon' })
  @ApiResponse({ status: 200, description: 'Coupon verification result' })
  verify(@Param('id') id: string) {
    // In a real implementation, you would verify the coupon with the store
    return { isValid: true };
  }

  @Public()
  @Post(':id/use')
  @ApiOperation({ summary: 'Track coupon use' })
  @ApiResponse({ status: 200, description: 'Coupon use tracked' })
  trackUse(@Param('id') id: string) {
    return this.couponsService.trackCouponUse(id);
  }
}
