import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { X } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTranslations } from "next-intl";

interface FilterSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  minPrice: number | '';
  maxPrice: number | '';
  sortOrder: 'asc' | 'desc' | '';
  onApplyFilters: (min: number | '', max: number | '', sort: 'asc' | 'desc' | '') => void;
}

export default function FilterSidebar({ isOpen, onClose, minPrice, maxPrice, sortOrder, onApplyFilters }: FilterSidebarProps) {
  const [localMinPrice, setLocalMinPrice] = useState(minPrice);
  const [localMaxPrice, setLocalMaxPrice] = useState(maxPrice);
  const [localSortOrder, setLocalSortOrder] = useState<'asc' | 'desc' | 'default' | ''>(sortOrder || 'default');

  useEffect(() => {
    setLocalSortOrder(sortOrder || 'default');
    setLocalMinPrice(minPrice);
    setLocalMaxPrice(maxPrice);
  }, [minPrice, maxPrice, sortOrder]);

  const handleApply = () => {
    const finalSortOrder = localSortOrder === 'default' ? '' : localSortOrder;
    onApplyFilters(localMinPrice, localMaxPrice, finalSortOrder as 'asc' | 'desc' | '');
    onClose();
  };

  const handleClear = () => {
    setLocalMinPrice('');
    setLocalMaxPrice('');
    setLocalSortOrder('default');
    onApplyFilters('', '', '');
    onClose();
  };
  const t = useTranslations("FilterSidebar");


  return (
    <div className={`fixed inset-y-0 right-0 w-80 bg-white shadow-lg p-6 transform ${isOpen ? "translate-x-0" : "translate-x-full"} transition-transform duration-300 ease-in-out z-40`}>
      <div className="flex justify-between items-center mb-6 mt-14">
        <h2 className="text-xl font-semibold">{t("filters")}</h2>
      <Button variant="ghost" onClick={onClose} className="text-gray-700 hover:text-gray-900"><X /></Button>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">{t("amountRange")}</h3>
        <div className="flex space-x-2">
          <div className="flex-1">
            <Label className="mb-4" htmlFor="minPrice">{t("minAmount")}</Label>
            <Input
              id="minPrice"
              type="number"
              value={localMinPrice}
              onChange={(e) => setLocalMinPrice(e.target.value === '' ? '' : parseFloat(e.target.value))}
              placeholder="Min"
            />
          </div>
          <div className="flex-1">
            <Label className="mb-4" htmlFor="maxPrice">{t("maxAmount")}</Label>
            <Input
              id="maxPrice"
              type="number"
              value={localMaxPrice}
              onChange={(e) => setLocalMaxPrice(e.target.value === '' ? '' : parseFloat(e.target.value))}
              placeholder="Max"
            />
          </div>
        </div>

        <h3 className="text-lg font-medium">{t("order")}</h3>
        <Select 
          onValueChange={(value) => setLocalSortOrder(value as 'asc' | 'desc' | 'default')} 
          value={localSortOrder}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Sıralama Seçiniz" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="default">{t("notSelected")}</SelectItem>
            <SelectItem value="asc">{t("orderAsc")}</SelectItem>
            <SelectItem value="desc">{t("orderDesc")}</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="mt-6 flex flex-col gap-3">
        <Button 
          variant="outline" 
          className="w-full"
          onClick={handleClear}
        >
          {t("cleanFilter")}
        </Button>

        <Button onClick={handleApply} className="w-full">
          {t("send")}
        </Button>
      </div>
    </div>
  );
}
