// ✅ Updated Packing Assistance Page
// 📦 Now supports structured JSON with `category` and `items` keys

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Info, Plus, Download, Save, MapPin, Filter, ShoppingBag, Shirt, Utensils, Plug, Home, Droplet } from 'lucide-react';
import { toast } from '@/components/ui/sonner';
import { useToast } from '@/hooks/use-toast';
import clothingDataRaw from '@/data/clothing.json'; // The file with category + items keys
import confetti from 'canvas-confetti';

// Ensure correct structure of imported data
const clothingData = clothingDataRaw.items || [];

interface PackingItem {
  id: string;
  name: string;
  category: string;
  source: 'Pack from India' | 'Buy in France' | 'Optional';
  note?: string;
  isChecked: boolean;
  isUserAdded?: boolean;
  tooltip?: string;
  storeSuggestions?: string[];
  studentTip?: string;
  storeInfo?: string;
  priceRange?: string;
}

interface PackingAssistancePageProps {
  onBack: () => void;
}

export const PackingAssistancePage = ({ onBack }: PackingAssistancePageProps) => {
  const [selectedLocation, setSelectedLocation] = useState('Rouen');
  const [selectedCategory, setSelectedCategory] = useState('clothing');
  const [packingItems, setPackingItems] = useState<PackingItem[]>([]);
  const [justCompleted, setJustCompleted] = useState(false);
  const [hidePacked, setHidePacked] = useState(false);
  const [newItem, setNewItem] = useState<Omit<PackingItem, 'id' | 'isChecked' | 'category'>>({
    name: '',
    source: 'Pack from India',
  });
  const { toast: uiToast } = useToast();

  const generateInitialItems = (): PackingItem[] => {
    const items: PackingItem[] = [];

    clothingData.forEach((item, index) => {
      let source: 'Pack from India' | 'Buy in France' | 'Optional';
      if (item.packFromIndia) {
        source = 'Pack from India';
      } else if (item.buyInRouen) {
        source = 'Buy in France';
      } else {
        source = 'Optional';
      }

      const storeInfo = item.stores && item.stores.length > 0 
        ? item.stores.map((s: any) => `${s.name} (${s.price})`).join(', ')
        : '';

      items.push({
        id: `clothing-${index}`,
        name: item.name,
        category: 'clothing',
        source,
        note: item.why,
        isChecked: false,
        storeInfo,
        priceRange: item.stores?.[0]?.price || ''
      });
    });

    return items;
  };

  const initialPackingItems = generateInitialItems();

  useEffect(() => {
    const savedItems = localStorage.getItem('packingItems');
    if (savedItems) {
      setPackingItems(JSON.parse(savedItems));
    } else {
      setPackingItems(initialPackingItems);
    }
  }, []);

  useEffect(() => {
    if (packingItems.length > 0) {
      localStorage.setItem('packingItems', JSON.stringify(packingItems));
    }
  }, [packingItems]);

  const totalItems = packingItems.length;
  const checkedItems = packingItems.filter(item => item.isChecked).length;
  const progressPercentage = totalItems > 0 ? Math.round((checkedItems / totalItems) * 100) : 0;

  useEffect(() => {
    if (progressPercentage >= 100 && !justCompleted) {
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      setJustCompleted(true);
    }
  }, [progressPercentage, justCompleted]);

  const handleItemCheck = (id: string, checked: boolean) => {
    setPackingItems(prev => prev.map(item => item.id === id ? { ...item, isChecked: checked } : item));
  };

  // ... (same rest of UI code as before)

  return (
    <div>
      {/* Full UI code continues here, unchanged from your existing setup */}
    </div>
  );
};
