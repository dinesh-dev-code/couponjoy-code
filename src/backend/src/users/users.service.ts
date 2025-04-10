
import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { SavedCoupon } from './entities/saved-coupon.entity';
import { Coupon } from '../coupons/entities/coupon.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(SavedCoupon)
    private savedCouponsRepository: Repository<SavedCoupon>,
    @InjectRepository(Coupon)
    private couponsRepository: Repository<Coupon>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.usersRepository.findOne({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const referralCode = this.generateReferralCode(createUserDto.name);

    const user = this.usersRepository.create({
      ...createUserDto,
      password: hashedPassword,
      referralCode,
    });

    await this.usersRepository.save(user);
    delete user.password;
    return user;
  }

  async createFromSocial(socialData: {
    email: string;
    name: string;
    provider: string;
    providerId: string;
  }): Promise<User> {
    const referralCode = this.generateReferralCode(socialData.name);
    // Generate a random secure password for the user since social logins
    // don't provide passwords
    const randomPassword = uuidv4();
    const hashedPassword = await bcrypt.hash(randomPassword, 10);

    const user = this.usersRepository.create({
      email: socialData.email,
      name: socialData.name,
      password: hashedPassword,
      referralCode,
    });

    await this.usersRepository.save(user);
    delete user.password;
    return user;
  }

  private generateReferralCode(name: string): string {
    // Create a referral code based on the user's name and a random string
    const namePart = name.substr(0, 3).toUpperCase();
    const randomPart = Math.random().toString(36).substring(2, 7).toUpperCase();
    return `${namePart}${randomPart}`;
  }

  async findAll(): Promise<User[]> {
    const users = await this.usersRepository.find();
    return users.map(user => {
      delete user.password;
      return user;
    });
  }

  async findOne(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    delete user.password;
    return user;
  }

  async findOneByEmail(email: string): Promise<User> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);

    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    await this.usersRepository.update(id, updateUserDto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const result = await this.usersRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
  }

  async saveCoupon(userId: string, couponId: string): Promise<void> {
    const user = await this.findOne(userId);
    const coupon = await this.couponsRepository.findOne({
      where: { id: couponId },
    });

    if (!coupon) {
      throw new NotFoundException(`Coupon with ID ${couponId} not found`);
    }

    // Check if already saved
    const existing = await this.savedCouponsRepository.findOne({
      where: {
        user: { id: userId },
        coupon: { id: couponId },
      },
    });

    if (!existing) {
      const savedCoupon = this.savedCouponsRepository.create({
        user,
        coupon,
      });
      await this.savedCouponsRepository.save(savedCoupon);
    }
  }

  async removeSavedCoupon(userId: string, couponId: string): Promise<void> {
    const result = await this.savedCouponsRepository.delete({
      user: { id: userId },
      coupon: { id: couponId },
    });

    if (result.affected === 0) {
      throw new NotFoundException(
        `Saved coupon with userId ${userId} and couponId ${couponId} not found`,
      );
    }
  }

  async getSavedCoupons(userId: string): Promise<Coupon[]> {
    const savedCoupons = await this.savedCouponsRepository.find({
      where: { user: { id: userId } },
      relations: ['coupon', 'coupon.store', 'coupon.categories'],
    });

    return savedCoupons.map(savedCoupon => savedCoupon.coupon);
  }
}
