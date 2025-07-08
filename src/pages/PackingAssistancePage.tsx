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
import { ArrowLeft, Info, Plus, Download, MapPin, ShoppingBag, Shirt, Utensils, Plug, Home, Droplet } from 'lucide-react';
import { toast } from '@/components/ui/sonner';
import { useToast } from '@/hooks/use-toast';
import clothingDataRaw from '@/data/clothing.json';
import confetti from 'canvas-confetti';

const clothingData = clothingDataRaw.items ? [
  ...(clothingDataRaw.items.mustBring || []),
  ...(clothingDataRaw.items.optional || []),
  ...(clothingDataRaw.items.buyInFrance || [])
] : [];

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
      let source: PackingItem['source'] = item.tag === 'Pack from India'
        ? 'Pack from India'
        : item.tag === 'Buy in France'
          ? 'Buy in France'
          : 'Optional';

      items.push({
        id: `clothing-${index}`,
        name: item.name,
        category: 'clothing',
        source,
        note: item.tooltip,
        isChecked: false,
        storeInfo: item.storeSuggestions?.join(', ') || '',
        studentTip: item.studentTip || '',
        priceRange: ''
      });
    });

    return items;
  };

  useEffect(() => {
    const savedItems = localStorage.getItem('packingItems');
    if (savedItems) {
      setPackingItems(JSON.parse(savedItems));
    } else {
      setPackingItems(generateInitialItems());
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

  const filteredItems = packingItems.filter(item => {
    return item.category === selectedCategory && (!hidePacked || !item.isChecked);
  });

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Packing Assistance – Clothing</h1>
      <div className="mb-4">
        <Progress value={progressPercentage} />
        <p className="text-sm text-gray-600 mt-1">{checkedItems} of {totalItems} items packed</p>
      </div>
      <div className="mb-4">
        <Checkbox id="hide-packed" checked={hidePacked} onCheckedChange={(checked) => setHidePacked(!!checked)} />
        <label htmlFor="hide-packed" className="ml-2 text-sm">Hide packed items</label>
      </div>
      {filteredItems.length === 0 ? (
        <p className="text-gray-500">No items to display.</p>
      ) : (
        filteredItems.map(item => (
          <Card key={item.id} className="mb-3">
            <CardContent className="p-4 flex items-start gap-4">
              <Checkbox 
                checked={item.isChecked} 
                onCheckedChange={(checked) => handleItemCheck(item.id, !!checked)}
              />
              <div>
                <h3 className="font-medium text-lg">{item.name}</h3>
                <p className="text-sm text-gray-600">{item.note}</p>
                {item.storeInfo && <p className="text-sm text-gray-500">Stores: {item.storeInfo}</p>}
                {item.studentTip && <p className="text-sm text-blue-600 italic">Student Tip: {item.studentTip}</p>}
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
};
