// ✅ Full Working PackingAssistancePage with filteredItems added

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
import { useToast } from '@/hooks/use-toast';
import clothingDataRaw from '@/data/clothing.json';
import confetti from 'canvas-confetti';

const clothingData = [
  ...clothingDataRaw.items.mustBring.map(item => ({ ...item, source: 'Pack from India' as const })),
  ...clothingDataRaw.items.optional.map(item => ({ ...item, source: 'Optional' as const })),
  ...clothingDataRaw.items.buyInFrance.map(item => ({ ...item, source: 'Buy in France' as const }))
];

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
    return clothingData.map((item, index) => {
      const storeInfo = item.storeSuggestions?.length > 0
        ? item.storeSuggestions.join(', ')
        : '';

      return {
        id: `clothing-${index}`,
        name: item.name,
        category: 'clothing',
        source: item.source,
        note: item.tooltip,
        isChecked: false,
        storeInfo,
        tooltip: item.tooltip,
        studentTip: item.studentTip
      };
    });
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

  const filteredItems = packingItems.filter(item => {
    return item.category === selectedCategory && (!hidePacked || !item.isChecked);
  });

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">🎒 Packing Assistance</h1>
      <p className="mb-6 text-gray-600">Plan your luggage smartly. Know what to bring, what to skip, and what to buy locally.</p>

      <div className="mb-6">
        <label className="block mb-1 font-medium">📍 Location</label>
        <Select value={selectedLocation} onValueChange={setSelectedLocation}>
          <SelectTrigger className="w-64">
            <SelectValue placeholder="Choose a location" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Rouen">Rouen</SelectItem>
            <SelectItem value="Paris" disabled>Paris (Coming Soon)</SelectItem>
            <SelectItem value="Lyon" disabled>Lyon (Coming Soon)</SelectItem>
            <SelectItem value="Lille" disabled>Lille (Coming Soon)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="mb-6">
        <TabsList>
          <TabsTrigger value="clothing"><Shirt className="h-4 w-4 mr-1" /> Clothing</TabsTrigger>
          {/* Other categories will go here */}
        </TabsList>
      </Tabs>

      <Card className="mb-4">
        <CardContent className="p-4">
          <div className="flex justify-between mb-2">
            <span className="font-medium">Progress</span>
            <span>{checkedItems} of {totalItems} items</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </CardContent>
      </Card>

      {filteredItems.length === 0 ? (
        <p className="text-center text-gray-500">No items to show.</p>
      ) : (
        filteredItems.map(item => (
          <Card key={item.id} className="mb-3">
            <CardContent className="p-4 flex gap-4">
              <Checkbox checked={item.isChecked} onCheckedChange={(checked) => handleItemCheck(item.id, !!checked)} />
              <div>
                <div className="flex items-center gap-2">
                  <Label className={`font-semibold ${item.isChecked ? 'line-through text-gray-400' : ''}`}>{item.name}</Label>
                  <Badge>{item.source}</Badge>
                </div>
                {item.note && <p className="text-sm text-gray-600">{item.note}</p>}
                {item.storeInfo && <p className="text-xs text-gray-500"><ShoppingBag className="inline h-3 w-3 mr-1" />{item.storeInfo}</p>}
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
};
