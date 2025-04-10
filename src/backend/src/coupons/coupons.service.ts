
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan, MoreThan, In, Like } from 'typeorm';
import { Coupon } from './entities/coupon.entity';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { UpdateCouponDto } from './dto/update-coupon.dto';
import { Store } from '../stores/entities/store.entity';
import { Category } from '../categories/entities/category.entity';

@Injectable()
export class CouponsService {
  constructor(
    @InjectRepository(Coupon)
    private couponsRepository: Repository<Coupon>,
    @InjectRepository(Store)
    private storesRepository: Repository<Store>,
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
  ) {}

  async create(createCouponDto: CreateCouponDto): Promise<Coupon> {
    const store = await this.storesRepository.findOne({
      where: { id: createCouponDto.storeId },
    });
    
    if (!store) {
      throw new NotFoundException(`Store with ID ${createCouponDto.storeId} not found`);
    }
    
    let categories = [];
    if (createCouponDto.categoryIds && createCouponDto.categoryIds.length > 0) {
      categories = await this.categoriesRepository.find({
        where: { id: In(createCouponDto.categoryIds) },
      });
    }
    
    const coupon = this.couponsRepository.create({
      ...createCouponDto,
      store,
      categories,
      expiryDate: new Date(createCouponDto.expiryDate),
      isNew: true, // Mark as new by default
    });
    
    await this.couponsRepository.save(coupon);
    
    // Update coupon count for store
    store.couponCount = await this.couponsRepository.count({
      where: { store: { id: store.id } },
    });
    
    await this.storesRepository.save(store);
    
    return coupon;
  }

  async findAll(filters?: {
    categoryId?: string;
    storeId?: string;
    search?: string;
    isPopular?: boolean;
    isNew?: boolean;
    isExpiringSoon?: boolean;
  }): Promise<{ coupons: Coupon[]; total: number }> {
    const queryBuilder = this.couponsRepository
      .createQueryBuilder('coupon')
      .leftJoinAndSelect('coupon.store', 'store')
      .leftJoinAndSelect('coupon.categories', 'category');
      
    if (filters) {
      if (filters.categoryId) {
        queryBuilder.andWhere('category.id = :categoryId', {
          categoryId: filters.categoryId,
        });
      }
      
      if (filters.storeId) {
        queryBuilder.andWhere('store.id = :storeId', {
          storeId: filters.storeId,
        });
      }
      
      if (filters.search) {
        queryBuilder.andWhere(
          '(coupon.title LIKE :search OR coupon.description LIKE :search OR store.name LIKE :search)',
          { search: `%${filters.search}%` },
        );
      }
      
      if (filters.isPopular) {
        queryBuilder.andWhere('coupon.isPopular = :isPopular', {
          isPopular: filters.isPopular,
        });
      }
      
      if (filters.isNew) {
        queryBuilder.andWhere('coupon.isNew = :isNew', {
          isNew: filters.isNew,
        });
      }
      
      if (filters.isExpiringSoon) {
        queryBuilder.andWhere('coupon.isExpiringSoon = :isExpiringSoon', {
          isExpiringSoon: filters.isExpiringSoon,
        });
      }
    }
    
    const [coupons, total] = await queryBuilder
      .orderBy('coupon.createdAt', 'DESC')
      .getManyAndCount();
      
    return { coupons, total };
  }

  async findOne(id: string): Promise<Coupon> {
    const coupon = await this.couponsRepository.findOne({
      where: { id },
      relations: ['store', 'categories'],
    });
    
    if (!coupon) {
      throw new NotFoundException(`Coupon with ID ${id} not found`);
    }
    
    return coupon;
  }

  async findByStore(storeId: string): Promise<{ coupons: Coupon[]; store: Store }> {
    const store = await this.storesRepository.findOne({
      where: { id: storeId },
    });
    
    if (!store) {
      throw new NotFoundException(`Store with ID ${storeId} not found`);
    }
    
    const coupons = await this.couponsRepository.find({
      where: { store: { id: storeId } },
      relations: ['store', 'categories'],
      order: { createdAt: 'DESC' },
    });
    
    return { coupons, store };
  }

  async findByCategory(categoryId: string): Promise<{ coupons: Coupon[]; category: Category }> {
    const category = await this.categoriesRepository.findOne({
      where: { id: categoryId },
    });
    
    if (!category) {
      throw new NotFoundException(`Category with ID ${categoryId} not found`);
    }
    
    const coupons = await this.couponsRepository
      .createQueryBuilder('coupon')
      .leftJoinAndSelect('coupon.store', 'store')
      .leftJoinAndSelect('coupon.categories', 'category')
      .where('category.id = :categoryId', { categoryId })
      .orderBy('coupon.createdAt', 'DESC')
      .getMany();
      
    return { coupons, category };
  }

  async findPopular(): Promise<{ coupons: Coupon[] }> {
    const coupons = await this.couponsRepository.find({
      where: { isPopular: true },
      relations: ['store', 'categories'],
      order: { usedCount: 'DESC' },
      take: 12,
    });
    
    return { coupons };
  }

  async findNew(): Promise<{ coupons: Coupon[] }> {
    const coupons = await this.couponsRepository.find({
      where: { isNew: true },
      relations: ['store', 'categories'],
      order: { createdAt: 'DESC' },
      take: 12,
    });
    
    return { coupons };
  }

  async findExpiringSoon(): Promise<{ coupons: Coupon[] }> {
    const coupons = await this.couponsRepository.find({
      where: { isExpiringSoon: true },
      relations: ['store', 'categories'],
      order: { expiryDate: 'ASC' },
      take: 12,
    });
    
    return { coupons };
  }

  async search(query: string): Promise<{ coupons: Coupon[]; total: number }> {
    const [coupons, total] = await this.couponsRepository.findAndCount({
      where: [
        { title: Like(`%${query}%`) },
        { description: Like(`%${query}%`) },
      ],
      relations: ['store', 'categories'],
      order: { createdAt: 'DESC' },
    });
    
    return { coupons, total };
  }

  async update(id: string, updateCouponDto: UpdateCouponDto): Promise<Coupon> {
    const coupon = await this.findOne(id);
    
    if (updateCouponDto.storeId) {
      const store = await this.storesRepository.findOne({
        where: { id: updateCouponDto.storeId },
      });
      
      if (!store) {
        throw new NotFoundException(`Store with ID ${updateCouponDto.storeId} not found`);
      }
      
      coupon.store = store;
    }
    
    if (updateCouponDto.categoryIds) {
      const categories = await this.categoriesRepository.find({
        where: { id: In(updateCouponDto.categoryIds) },
      });
      coupon.categories = categories;
    }
    
    // Update other fields
    Object.assign(coupon, updateCouponDto);
    
    return this.couponsRepository.save(coupon);
  }

  async remove(id: string): Promise<void> {
    const result = await this.couponsRepository.delete(id);
    
    if (result.affected === 0) {
      throw new NotFoundException(`Coupon with ID ${id} not found`);
    }
  }

  async trackCouponUse(id: string): Promise<void> {
    const coupon = await this.findOne(id);
    coupon.usedCount += 1;
    
    // If coupon is used a lot, mark it as popular
    if (coupon.usedCount > 50) {
      coupon.isPopular = true;
    }
    
    await this.couponsRepository.save(coupon);
  }

  async updateExpiringSoonStatus(): Promise<void> {
    // Get current date and date 7 days from now
    const currentDate = new Date();
    const sevenDaysLater = new Date();
    sevenDaysLater.setDate(currentDate.getDate() + 7);
    
    // Update expiring soon status
    await this.couponsRepository
      .createQueryBuilder()
      .update(Coupon)
      .set({ isExpiringSoon: true })
      .where('expiryDate > :currentDate', { currentDate })
      .andWhere('expiryDate <= :sevenDaysLater', { sevenDaysLater })
      .execute();
      
    // Reset status for coupons that are not expiring soon
    await this.couponsRepository
      .createQueryBuilder()
      .update(Coupon)
      .set({ isExpiringSoon: false })
      .where('expiryDate > :sevenDaysLater', { sevenDaysLater })
      .orWhere('expiryDate <= :currentDate', { currentDate })
      .execute();
  }
}
