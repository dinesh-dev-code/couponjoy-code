
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Clock, Copy, ExternalLink, Heart, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { Coupon } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { userAPI } from "@/services/api";
import { useAuth } from "@/contexts/AuthContext";

interface CouponCardProps {
  coupon: Coupon;
  isSaved?: boolean;
}

const CouponCard: React.FC<CouponCardProps> = ({ coupon, isSaved = false }) => {
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [saved, setSaved] = useState(isSaved);
  const [copying, setCopying] = useState(false);
  
  const formatExpiry = (date: Date) => {
    const expiryDate = new Date(date);
    const now = new Date();
    const diffTime = expiryDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "Expires today";
    if (diffDays === 1) return "Expires tomorrow";
    if (diffDays < 0) return "Expired";
    if (diffDays <= 7) return `Expires in ${diffDays} days`;
    
    return `Expires on ${expiryDate.toLocaleDateString()}`;
  };
  
  const handleCopyCode = async () => {
    setCopying(true);
    try {
      await navigator.clipboard.writeText(coupon.code);
      toast({
        title: "Code Copied!",
        description: `${coupon.code} has been copied to your clipboard.`,
      });
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Please copy the code manually.",
        variant: "destructive",
      });
    } finally {
      setCopying(false);
    }
  };
  
  const handleToggleSave = async () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please log in to save coupons.",
        variant: "default",
      });
      return;
    }
    
    try {
      if (saved) {
        await userAPI.removeSavedCoupon(coupon.id);
        setSaved(false);
        toast({
          title: "Coupon Removed",
          description: "The coupon has been removed from your saved list.",
        });
      } else {
        await userAPI.saveCoupon(coupon.id);
        setSaved(true);
        toast({
          title: "Coupon Saved",
          description: "The coupon has been added to your saved list.",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update saved coupons.",
        variant: "destructive",
      });
    }
  };
  
  return (
    <div className={cn("coupon-card", coupon.isPopular && "coupon-card-highlight")}>
      {coupon.isNew && (
        <div className="absolute top-2 left-2">
          <span className="deal-tag-new">New</span>
        </div>
      )}
      
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center">
            <div className="h-10 w-10 rounded-full overflow-hidden bg-muted flex items-center justify-center">
              <img 
                src={coupon.store.logo} 
                alt={coupon.store.name}
                className="h-full w-full object-cover" 
              />
            </div>
            <div className="ml-2">
              <Link 
                to={`/stores/${coupon.store.id}`}
                className="text-sm font-medium hover:underline"
              >
                {coupon.store.name}
              </Link>
            </div>
          </div>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    "h-8 w-8 rounded-full",
                    saved && "text-red-500 hover:text-red-600"
                  )}
                  onClick={handleToggleSave}
                >
                  <Heart className={cn("h-4 w-4", saved && "fill-current")} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {saved ? "Remove from saved" : "Save coupon"}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        
        <Link to={`/coupons/${coupon.id}`}>
          <h3 className="font-medium text-lg mb-1 line-clamp-2">
            {coupon.title}
          </h3>
        </Link>
        
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {coupon.description}
        </p>
        
        <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
          <div className="flex items-center">
            <Tag className="h-3 w-3 mr-1" />
            <span>
              {coupon.discount.type === "percentage" 
                ? `${coupon.discount.value}% Off` 
                : coupon.discount.type === "fixed"
                  ? `$${coupon.discount.value} Off`
                  : "Buy One Get One"}
            </span>
          </div>
          
          <div 
            className={cn(
              "flex items-center",
              coupon.isExpiringSoon && "text-orange-500"
            )}
          >
            <Clock className="h-3 w-3 mr-1" />
            <span>{formatExpiry(coupon.expiryDate)}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            className="flex-1 flex items-center gap-2"
            onClick={handleCopyCode}
            disabled={copying}
          >
            <Copy className="h-4 w-4" />
            <span>{copying ? "Copying..." : "Copy Code"}</span>
          </Button>
          
          {coupon.url && (
            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9"
              asChild
            >
              <a href={coupon.url} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CouponCard;
