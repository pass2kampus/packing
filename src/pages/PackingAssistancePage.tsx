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

interface PackingItem {
  id: string;
  name: string;
  category: string;
  source: 'Pack from India' | 'Buy in France' | 'Optional';
  note?: string;
  isChecked: boolean;
  isUserAdded?: boolean;
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
  const [newItem, setNewItem] = useState<Omit<PackingItem, 'id' | 'isChecked' | 'category'>>({
    name: '',
    source: 'Pack from India',
  });
  const [hidePacked, setHidePacked] = useState(false);
  const { toast: uiToast } = useToast();

  // Initial packing items data
  const initialPackingItems: PackingItem[] = [
    // Clothing
    { id: '1', name: 'Winter Jacket', category: 'clothing', source: 'Buy in France', note: 'Decathlon has good options for €30-50', isChecked: false, storeInfo: 'Decathlon, Primark', priceRange: '€30-50' },
    { id: '2', name: 'Thermal Underwear', category: 'clothing', source: 'Buy in France', note: 'Essential for winter months (Nov-Mar)', isChecked: false, storeInfo: 'Decathlon, Uniqlo', priceRange: '€15-25' },
    { id: '3', name: 'Formal Attire (1-2 sets)', category: 'clothing', source: 'Pack from India', note: 'For presentations and formal events', isChecked: false },
    { id: '4', name: 'Casual Clothes', category: 'clothing', source: 'Pack from India', note: 'Bring basics, buy seasonal items locally', isChecked: false },
    { id: '5', name: 'Rain Jacket/Coat', category: 'clothing', source: 'Buy in France', note: 'France gets frequent rain', isChecked: false, storeInfo: 'Decathlon', priceRange: '€20-40' },
    { id: '6', name: 'Comfortable Walking Shoes', category: 'clothing', source: 'Pack from India', note: 'You\'ll walk a lot in Europe', isChecked: false },
    { id: '7', name: 'Winter Boots', category: 'clothing', source: 'Buy in France', note: 'For snow and heavy rain', isChecked: false, storeInfo: 'Decathlon, La Halle', priceRange: '€40-70' },
    { id: '8', name: 'Scarves & Gloves', category: 'clothing', source: 'Buy in France', note: 'Essential for winter', isChecked: false, storeInfo: 'Primark, H&M', priceRange: '€10-20' },
    { id: '9', name: 'Swimwear', category: 'clothing', source: 'Optional', note: 'For swimming pools or beach trips', isChecked: false },
    
    // Food & Groceries
    { id: '10', name: 'Basic Spices (small packs)', category: 'food', source: 'Pack from India', note: 'Garam masala, turmeric, cumin, etc.', isChecked: false },
    { id: '11', name: 'Instant Foods', category: 'food', source: 'Pack from India', note: 'Ready-to-eat curries, MTR packets', isChecked: false },
    { id: '12', name: 'Pickles (small jar)', category: 'food', source: 'Pack from India', note: 'Comfort food from home', isChecked: false },
    { id: '13', name: 'Snacks', category: 'food', source: 'Optional', note: 'Bring favorites for initial days', isChecked: false },
    { id: '14', name: 'Staples (rice, dal)', category: 'food', source: 'Buy in France', note: 'Available at Asian stores', isChecked: false, storeInfo: 'Tang Frères, local Asian markets', priceRange: 'Varies' },
    
    // Kitchen Essentials
    { id: '15', name: 'Pressure Cooker (small)', category: 'kitchen', source: 'Pack from India', note: 'Essential for Indian cooking, hard to find in France', isChecked: false },
    { id: '16', name: 'Small Tadka Pan', category: 'kitchen', source: 'Pack from India', note: 'For tempering spices', isChecked: false },
    { id: '17', name: 'Basic Utensils', category: 'kitchen', source: 'Buy in France', note: 'Plates, cups, cutlery', isChecked: false, storeInfo: 'Carrefour, Action', priceRange: '€15-30 total' },
    { id: '18', name: 'Rice Cooker', category: 'kitchen', source: 'Optional', note: 'Useful but takes luggage space', isChecked: false, storeInfo: 'Carrefour, Darty', priceRange: '€20-40' },
    
    // Electronics
    { id: '19', name: 'Laptop & Charger', category: 'electronics', source: 'Pack from India', note: 'Essential for studies', isChecked: false },
    { id: '20', name: 'Universal Adapter', category: 'electronics', source: 'Pack from India', note: 'France uses Type E sockets (different from India)', isChecked: false },
    { id: '21', name: 'Smartphone', category: 'electronics', source: 'Pack from India', note: 'Ensure it\'s unlocked for French SIM', isChecked: false },
    { id: '22', name: 'Headphones', category: 'electronics', source: 'Pack from India', note: 'Useful for online classes and calls', isChecked: false },
    { id: '23', name: 'Extension Board', category: 'electronics', source: 'Buy in France', note: 'Get one with French plugs', isChecked: false, storeInfo: 'Carrefour, Darty', priceRange: '€10-20' },
    
    // Accommodation Setup
    { id: '24', name: 'Bedsheets & Pillowcases', category: 'accommodation', source: 'Buy in France', note: 'French beds may have different sizes', isChecked: false, storeInfo: 'IKEA, Carrefour', priceRange: '€20-40' },
    { id: '25', name: 'Towels', category: 'accommodation', source: 'Buy in France', note: 'Save luggage space', isChecked: false, storeInfo: 'IKEA, Carrefour', priceRange: '€10-30' },
    { id: '26', name: 'Small Desk Lamp', category: 'accommodation', source: 'Buy in France', note: 'For study area', isChecked: false, storeInfo: 'IKEA, Action', priceRange: '€10-20' },
    
    // Toiletries & Personal Care
    { id: '27', name: 'Medications', category: 'toiletries', source: 'Pack from India', note: 'Bring prescription meds & basics for first month', isChecked: false },
    { id: '28', name: 'Toiletries', category: 'toiletries', source: 'Buy in France', note: 'Shampoo, soap, etc. - save luggage weight', isChecked: false, storeInfo: 'Carrefour, Monoprix', priceRange: '€10-30' },
    { id: '29', name: 'Eyeglasses/Contacts', category: 'toiletries', source: 'Pack from India', note: 'Bring extra pair & prescription', isChecked: false },
    { id: '30', name: 'Skincare Products', category: 'toiletries', source: 'Optional', note: 'Bring favorites, but French pharmacies are excellent', isChecked: false }
  ];

  // Load items from localStorage on mount
  useEffect(() => {
    const savedItems = localStorage.getItem('packingItems');
    if (savedItems) {
      setPackingItems(JSON.parse(savedItems));
    } else {
      setPackingItems(initialPackingItems);
    }
  }, []);

  // Save to localStorage whenever items change
  useEffect(() => {
    if (packingItems.length > 0) {
      localStorage.setItem('packingItems', JSON.stringify(packingItems));
    }
  }, [packingItems]);

  const handleItemCheck = (id: string, checked: boolean) => {
    setPackingItems(prev => 
      prev.map(item => 
        item.id === id ? { ...item, isChecked: checked } : item
      )
    );
  };

  const handleAddItem = () => {
    if (!newItem.name.trim()) {
      toast('Please enter an item name');
      return;
    }

    const newItemComplete: PackingItem = {
      id: Date.now().toString(),
      name: newItem.name,
      category: selectedCategory,
      source: newItem.source,
      note: newItem.note,
      isChecked: false,
      isUserAdded: true
    };

    setPackingItems(prev => [...prev, newItemComplete]);
    setNewItem({
      name: '',
      source: 'Pack from India',
      note: ''
    });

    uiToast({
      title: "Item Added",
      description: `${newItem.name} has been added to your packing list.`
    });
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(packingItems, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `packing-list-${selectedLocation}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    uiToast({
      title: "List Exported",
      description: "Your packing list has been exported as JSON."
    });
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to reset your packing list? This will remove all your customizations.')) {
      setPackingItems(initialPackingItems);
      uiToast({
        title: "List Reset",
        description: "Your packing list has been reset to default items."
      });
    }
  };

  // Filter items by current category and hide packed if needed
  const filteredItems = packingItems.filter(item => {
    if (item.category !== selectedCategory) return false;
    if (hidePacked && item.isChecked) return false;
    return true;
  });
  
  // Calculate progress
  const totalItems = packingItems.length;
  const checkedItems = packingItems.filter(item => item.isChecked).length;
  const progressPercentage = totalItems > 0 ? Math.round((checkedItems / totalItems) * 100) : 0;

  // Category icons mapping
  const categoryIcons = {
    clothing: <Shirt className="h-5 w-5" />,
    food: <Utensils className="h-5 w-5" />,
    kitchen: <Utensils className="h-5 w-5" />,
    electronics: <Plug className="h-5 w-5" />,
    accommodation: <Home className="h-5 w-5" />,
    toiletries: <Droplet className="h-5 w-5" />
  };

  // Source badge colors
  const getSourceBadgeColor = (source: string) => {
    switch (source) {
      case 'Pack from India':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Buy in France':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Optional':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <Button 
          variant="outline" 
          onClick={onBack}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Checklist
        </Button>
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🎒 Packing Assistance
          </h1>
          <p className="text-lg text-gray-600">
            Plan your luggage smartly. Know what to bring, what to skip, and what to buy locally.
          </p>
        </div>
      </div>

      {/* Progress Tracker */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-gray-900">Packing Progress</h3>
            <span className="text-sm font-medium text-blue-600">{checkedItems} of {totalItems} items</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
          <div className="flex justify-between mt-2 text-xs text-gray-500">
            <span>Not Started</span>
            <span>In Progress</span>
            <span>Complete</span>
          </div>
        </CardContent>
      </Card>

      {/* Location Filter */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <MapPin className="h-4 w-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">Location:</span>
        </div>
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
        <div className="mt-2 text-xs text-gray-500 flex items-center">
          <Info className="h-3 w-3 mr-1" />
          More cities will be added soon. Currently optimized for students in Rouen.
        </div>
      </div>

      {/* Category Tabs */}
      <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="mb-6">
        <TabsList className="grid grid-cols-3 md:grid-cols-6">
          <TabsTrigger value="clothing" className="flex items-center gap-1">
            <Shirt className="h-4 w-4" />
            <span className="hidden md:inline">Clothing</span>
          </TabsTrigger>
          <TabsTrigger value="food" className="flex items-center gap-1">
            <Utensils className="h-4 w-4" />
            <span className="hidden md:inline">Food</span>
          </TabsTrigger>
          <TabsTrigger value="kitchen" className="flex items-center gap-1">
            <Utensils className="h-4 w-4" />
            <span className="hidden md:inline">Kitchen</span>
          </TabsTrigger>
          <TabsTrigger value="electronics" className="flex items-center gap-1">
            <Plug className="h-4 w-4" />
            <span className="hidden md:inline">Electronics</span>
          </TabsTrigger>
          <TabsTrigger value="accommodation" className="flex items-center gap-1">
            <Home className="h-4 w-4" />
            <span className="hidden md:inline">Accommodation</span>
          </TabsTrigger>
          <TabsTrigger value="toiletries" className="flex items-center gap-1">
            <Droplet className="h-4 w-4" />
            <span className="hidden md:inline">Toiletries</span>
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Items List */}
      <div className="space-y-4 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            {categoryIcons[selectedCategory as keyof typeof categoryIcons]}
            {selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Items
          </h2>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button variant="outline" size="sm" onClick={handleReset}>
              Reset
            </Button>
          </div>
        </div>

        <div className="flex items-center mb-4">
          <Checkbox 
            id="hide-packed" 
            checked={hidePacked}
            onCheckedChange={(checked) => setHidePacked(!!checked)}
          />
          <label 
            htmlFor="hide-packed" 
            className="ml-2 text-sm text-gray-700 cursor-pointer"
          >
            Hide packed items
          </label>
        </div>

        {filteredItems.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-gray-500">
                {hidePacked 
                  ? "All items in this category are packed! 🎉" 
                  : "No items in this category. Add some below!"}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredItems.map(item => (
            <Card key={item.id} className={`transition-all duration-200 ${item.isChecked ? 'bg-gray-50' : ''}`}>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Checkbox 
                    id={`item-${item.id}`}
                    checked={item.isChecked}
                    onCheckedChange={(checked) => handleItemCheck(item.id, checked === true)}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <Label 
                        htmlFor={`item-${item.id}`}
                        className={`font-medium text-gray-900 ${item.isChecked ? 'line-through text-gray-500' : ''}`}
                      >
                        {item.name}
                      </Label>
                      <Badge className={`${getSourceBadgeColor(item.source)} text-xs`}>
                        {item.source}
                      </Badge>
                      {item.isUserAdded && (
                        <Badge variant="outline" className="text-xs">
                          User Added
                        </Badge>
                      )}
                    </div>
                    {item.note && (
                      <p className="text-sm text-gray-600 mb-1">{item.note}</p>
                    )}
                    {(item.storeInfo || item.priceRange) && (
                      <div className="flex items-center text-xs text-gray-500">
                        <ShoppingBag className="h-3 w-3 mr-1" />
                        {item.storeInfo && <span className="mr-2">{item.storeInfo}</span>}
                        {item.priceRange && <span>{item.priceRange}</span>}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Add New Item */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Add Your Own Item
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <Label htmlFor="item-name" className="mb-2 block">Item Name</Label>
              <Input 
                id="item-name"
                placeholder="e.g., Raincoat"
                value={newItem.name}
                onChange={(e) => setNewItem({...newItem, name: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="item-source" className="mb-2 block">Source</Label>
              <Select 
                value={newItem.source} 
                onValueChange={(value) => setNewItem({...newItem, source: value as PackingItem['source']})}
              >
                <SelectTrigger id="item-source">
                  <SelectValue placeholder="Where to get it?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pack from India">Pack from India</SelectItem>
                  <SelectItem value="Buy in France">Buy in France</SelectItem>
                  <SelectItem value="Optional">Optional</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="mb-4">
            <Label htmlFor="item-note" className="mb-2 block">Note (Optional)</Label>
            <Textarea 
              id="item-note"
              placeholder="Add any notes or reminders about this item..."
              value={newItem.note || ''}
              onChange={(e) => setNewItem({...newItem, note: e.target.value})}
            />
          </div>
          <Button onClick={handleAddItem}>
            <Plus className="h-4 w-4 mr-2" />
            Add Item
          </Button>
        </CardContent>
      </Card>

      {/* Tips Section */}
      <Card className="mt-8 bg-blue-50">
        <CardContent className="p-6">
          <h3 className="font-semibold text-blue-900 mb-3">💡 Packing Tips</h3>
          <ul className="space-y-2 text-blue-800 text-sm">
            <li>• Pack light - you can buy most things in France</li>
            <li>• Bring a universal adapter for your electronics</li>
            <li>• Consider shipping some items ahead to reduce luggage weight</li>
            <li>• Download offline translation apps before traveling</li>
            <li>• Join French student groups on social media for tips</li>
          </ul>
        </CardContent>
      </Card>

      <div className="mt-4 text-center text-sm text-gray-500">
        Progress: {checkedItems} of {totalItems} items packed
      </div>
    </div>
  );
};