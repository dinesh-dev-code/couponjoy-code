
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { categoriesAPI, couponsAPI, storesAPI } from '@/services/api';
import { Category, Coupon, Store } from '@/types';
import CouponCard from '@/components/coupons/CouponCard';

const Index = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [popularCoupons, setPopularCoupons] = useState<Coupon[]>([]);
  const [newCoupons, setNewCoupons] = useState<Coupon[]>([]);
  const [expiringSoon, setExpiringSoon] = useState<Coupon[]>([]);
  const [popularCategories, setPopularCategories] = useState<Category[]>([]);
  const [popularStores, setPopularStores] = useState<Store[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHomeData = async () => {
      setIsLoading(true);
      try {
        const [
          popularCouponsRes,
          newCouponsRes,
          expiringSoonRes,
          categoriesRes,
          storesRes,
        ] = await Promise.all([
          couponsAPI.getPopular(),
          couponsAPI.getRecommended(),
          couponsAPI.getExpiringSoon(),
          categoriesAPI.getAll(),
          storesAPI.getPopular(),
        ]);

        setPopularCoupons(popularCouponsRes.coupons);
        setNewCoupons(newCouponsRes.coupons);
        setExpiringSoon(expiringSoonRes.coupons);
        setPopularCategories(categoriesRes.categories.slice(0, 8));
        setPopularStores(storesRes.stores.slice(0, 8));
      } catch (error) {
        console.error('Error fetching home data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <div className="pt-4 pb-20">
      {/* Hero section */}
      <section className="py-10 md:py-16 px-4 bg-gradient-to-br from-brand-light to-white dark:from-brand-dark dark:to-background rounded-xl mb-10">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Save Money with the Best Coupons & Deals
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8">
            Find thousands of verified coupons and discounts for your favorite stores
          </p>

          <form onSubmit={handleSearch} className="max-w-xl mx-auto relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search for coupons, stores, or products..."
              className="pl-10 pr-28 h-12 text-base"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button 
              type="submit" 
              className="absolute right-1 top-1 bottom-1 px-4"
            >
              Search
            </Button>
          </form>
        </div>
      </section>

      {/* Popular Categories */}
      <section className="mb-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Popular Categories</h2>
          <Link to="/categories" className="flex items-center text-sm text-primary">
            View All <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-4">
          {isLoading ? (
            Array(8)
              .fill(0)
              .map((_, index) => (
                <div 
                  key={index} 
                  className="bg-muted animate-pulse h-24 rounded-lg"
                ></div>
              ))
          ) : (
            popularCategories.map((category) => (
              <Link
                key={category.id}
                to={`/categories/${category.id}`}
                className="flex flex-col items-center justify-center p-4 border rounded-lg hover:border-primary/50 hover:bg-accent transition-colors"
              >
                <div className="flex items-center justify-center w-10 h-10 mb-2 text-primary">
                  <img src={category.icon} alt={category.name} className="w-full h-full" />
                </div>
                <span className="text-sm font-medium text-center">
                  {category.name}
                </span>
              </Link>
            ))
          )}
        </div>
      </section>

      {/* Popular Stores */}
      <section className="mb-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Popular Stores</h2>
          <Link to="/stores" className="flex items-center text-sm text-primary">
            View All <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-4">
          {isLoading ? (
            Array(8)
              .fill(0)
              .map((_, index) => (
                <div 
                  key={index} 
                  className="bg-muted animate-pulse h-24 rounded-lg"
                ></div>
              ))
          ) : (
            popularStores.map((store) => (
              <Link
                key={store.id}
                to={`/stores/${store.id}`}
                className="flex flex-col items-center justify-center p-4 border rounded-lg hover:border-primary/50 hover:bg-accent transition-colors"
              >
                <div className="flex items-center justify-center w-10 h-10 mb-2">
                  <img src={store.logo} alt={store.name} className="w-full h-full rounded-full" />
                </div>
                <span className="text-sm font-medium text-center">
                  {store.name}
                </span>
                <span className="text-xs text-muted-foreground">
                  {store.couponCount} coupons
                </span>
              </Link>
            ))
          )}
        </div>
      </section>

      {/* Coupon Sections */}
      <section>
        <Tabs defaultValue="popular">
          <TabsList className="mb-6">
            <TabsTrigger value="popular">Popular Deals</TabsTrigger>
            <TabsTrigger value="new">Newest</TabsTrigger>
            <TabsTrigger value="expiring">Expiring Soon</TabsTrigger>
          </TabsList>
          
          <TabsContent value="popular">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {isLoading ? (
                Array(6)
                  .fill(0)
                  .map((_, index) => (
                    <div 
                      key={index} 
                      className="bg-muted animate-pulse h-64 rounded-lg"
                    ></div>
                  ))
              ) : (
                popularCoupons.map((coupon) => (
                  <CouponCard key={coupon.id} coupon={coupon} />
                ))
              )}
            </div>
            <div className="text-center mt-8">
              <Link to="/top-deals">
                <Button size="lg">View All Deals</Button>
              </Link>
            </div>
          </TabsContent>
          
          <TabsContent value="new">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {isLoading ? (
                Array(6)
                  .fill(0)
                  .map((_, index) => (
                    <div 
                      key={index} 
                      className="bg-muted animate-pulse h-64 rounded-lg"
                    ></div>
                  ))
              ) : (
                newCoupons.map((coupon) => (
                  <CouponCard key={coupon.id} coupon={coupon} />
                ))
              )}
            </div>
            <div className="text-center mt-8">
              <Link to="/new-deals">
                <Button size="lg">View All New Deals</Button>
              </Link>
            </div>
          </TabsContent>
          
          <TabsContent value="expiring">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {isLoading ? (
                Array(6)
                  .fill(0)
                  .map((_, index) => (
                    <div 
                      key={index} 
                      className="bg-muted animate-pulse h-64 rounded-lg"
                    ></div>
                  ))
              ) : (
                expiringSoon.map((coupon) => (
                  <CouponCard key={coupon.id} coupon={coupon} />
                ))
              )}
            </div>
            <div className="text-center mt-8">
              <Link to="/expiring-deals">
                <Button size="lg">View All Expiring Deals</Button>
              </Link>
            </div>
          </TabsContent>
        </Tabs>
      </section>
    </div>
  );
};

export default Index;
