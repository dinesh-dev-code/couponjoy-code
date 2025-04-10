
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('users')
@Controller('user')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('profile')
  @ApiOperation({ summary: 'Get user profile' })
  @ApiResponse({ status: 200, description: 'Returns the user profile' })
  getProfile(@Request() req) {
    return req.user;
  }

  @Patch('profile')
  @ApiOperation({ summary: 'Update user profile' })
  @ApiResponse({ status: 200, description: 'Profile updated successfully' })
  update(@Request() req, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(req.user.id, updateUserDto);
  }

  @Get('saved-coupons')
  @ApiOperation({ summary: 'Get user saved coupons' })
  @ApiResponse({ status: 200, description: 'Returns saved coupons' })
  getSavedCoupons(@Request() req) {
    return this.usersService.getSavedCoupons(req.user.id);
  }

  @Post('saved-coupons/:id')
  @ApiOperation({ summary: 'Save a coupon' })
  @ApiResponse({ status: 201, description: 'Coupon saved successfully' })
  saveCoupon(@Request() req, @Param('id') couponId: string) {
    return this.usersService.saveCoupon(req.user.id, couponId);
  }

  @Delete('saved-coupons/:id')
  @ApiOperation({ summary: 'Remove a saved coupon' })
  @ApiResponse({ status: 200, description: 'Coupon removed from saved' })
  removeSavedCoupon(@Request() req, @Param('id') couponId: string) {
    return this.usersService.removeSavedCoupon(req.user.id, couponId);
  }
}
