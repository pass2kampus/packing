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
import confetti from 'canvas-confetti';

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

    // CLOTHING - MALE
    const clothingItems = {
      mustBring: [
        {
          name: "Jeans / Trousers",
          tooltip: "Jeans are expensive in France (€30–€60) and tailoring is uncommon.",
          storeSuggestions: [],
          studentTip: "Multiple students (Jay, Shravan) stressed jeans are costly and ill-fitting in France."
        },
        {
          name: "Thermal Innerwear (Top & Bottom)",
          tooltip: "Local thermals start at €7–14. Indian thermals are cheaper and effective.",
          storeSuggestions: ["Decathlon (€7–14)", "Primark (€8–15)"],
          studentTip: "Raam and Hari found Indian thermals better in value than Primark ones."
        },
        {
          name: "Underwear & Socks",
          tooltip: "Undergarments cost €10–20 per set in France. Bring enough from India.",
          storeSuggestions: [],
          studentTip: "Shravan brought 10+ to reduce laundry stress in winter."
        },
        {
          name: "Walking Shoes / Sneakers",
          tooltip: "Good shoes cost €30–60 locally (Decathlon, H&M).",
          storeSuggestions: ["Decathlon (€30–60)", "H&M (€40–70)"],
          studentTip: "Jay and Shravan regretted not packing proper walking shoes from India."
        },
        {
          name: "Flip-Flops / Slippers",
          tooltip: "Primark flip-flops start at €2. Carrefour sells better ones at €10–13.",
          storeSuggestions: ["Primark (€2)", "Carrefour (€10–13)"],
          studentTip: "Bring from India unless you want to pay €13 for slippers."
        },
        {
          name: "Light Jacket (Windbreaker/Travel)",
          tooltip: "Great for layering. Local options cost €20–30.",
          storeSuggestions: ["H&M (€25–35)", "Primark (€20–30)"],
          studentTip: "Jay wore his light jacket through autumn before buying a winter coat."
        },
        {
          name: "Umbrella / Rain Hood",
          tooltip: "Rouen has unpredictable rain. A basic umbrella costs €5–15 locally.",
          storeSuggestions: ["Primark (€5–10)", "Action (€3–8)"],
          studentTip: "Meghana and Raam emphasized this is essential from Day 1."
        }
      ],
      optional: [
        {
          name: "Hoodies / Sweatshirts",
          tooltip: "Hoodies cost €12–25 at Primark and €20–35 at H&M.",
          storeSuggestions: ["Primark (€12–25)", "H&M (€20–35)"],
          studentTip: "Jay bought one for €15 during Black Friday."
        },
        {
          name: "Formal Shirt & Pants",
          tooltip: "Not usually worn at NEOMA. Local formals start at €20–40 per set.",
          storeSuggestions: ["H&M (€25–45)"],
          studentTip: "Jay used it once for a resume-building session."
        },
        {
          name: "Track Pants / Pajamas",
          tooltip: "Available on Temu for €8–12 or Decathlon for €12–25.",
          storeSuggestions: ["Temu (€8–12)", "Decathlon (€12–25)"],
          studentTip: "Shravan ordered after arrival; long delivery times."
        },
        {
          name: "Shorts",
          tooltip: "Temu has €5–8 shorts. Local stores are more expensive.",
          storeSuggestions: ["Temu (€5–8)", "Primark (€10–15)"],
          studentTip: "Jay advised bringing at least 2 for summer/gym use."
        },
        {
          name: "Gloves, Cap, Woolen Scarf",
          tooltip: "Primark sells these for €3–10. Must-have in winter.",
          storeSuggestions: ["Primark (€3–10)", "Saint Marc Market (€1–5 used)"],
          studentTip: "Hari had trouble without gloves while carrying bags in winter."
        }
      ],
      buyInFrance: [
        {
          name: "Heavy Winter Jacket / Coat",
          tooltip: "Best quality found locally. Jackets cost €30–60 in Primark/H&M.",
          storeSuggestions: ["Primark (€30–50)", "H&M (€40–60)", "Decathlon (€50–70)"],
          studentTip: "Jay had to replace his Indian jacket with a €40 one from Primark."
        },
        {
          name: "Scarf / Stylish Layers",
          tooltip: "Helps blend in with local culture. Available affordably in Saint Marc Market.",
          storeSuggestions: ["Saint Marc Market (€1–10)", "Primark (€5–12)", "H&M (€10–20)"],
          studentTip: "Style-conscious students like Meghana and Hari preferred local scarves."
        },
        {
          name: "Boots",
          tooltip: "Not mandatory in Rouen, but available from €25–60.",
          storeSuggestions: ["Decathlon (€30–60)", "H&M (€25–50)"],
          studentTip: "Jay and Shravan used grippy sneakers instead."
        }
      ]
    };

    // Add clothing items
    clothingItems.mustBring.forEach((item, index) =>
      items.push({
        id: `clothing-must-${index}`,
        name: item.name,
        category: 'clothing',
        source: 'Pack from India',
        isChecked: false,
        tooltip: item.tooltip,
        note: item.tooltip,
        storeSuggestions: item.storeSuggestions,
        studentTip: item.studentTip
      })
    );

    clothingItems.optional.forEach((item, index) =>
      items.push({
        id: `clothing-opt-${index}`,
        name: item.name,
        category: 'clothing',
        source: 'Optional',
        isChecked: false,
        tooltip: item.tooltip,
        note: item.tooltip,
        storeSuggestions: item.storeSuggestions,
        studentTip: item.studentTip
      })
    );

    clothingItems.buyInFrance.forEach((item, index) =>
      items.push({
        id: `clothing-buy-${index}`,
        name: item.name,
        category: 'clothing',
        source: 'Buy in France',
        isChecked: false,
        tooltip: item.tooltip,
        note: item.tooltip,
        storeSuggestions: item.storeSuggestions,
        studentTip: item.studentTip
      })
    );

    // 🔜 The rest of the `generateInitialItems()` will continue in **Chunk 2**
    return items;
  };
    // FOOD & GROCERIES
    items.push(
      {
        id: 'food-0',
        name: 'Basic Spices (small packs)',
        category: 'food',
        source: 'Pack from India',
        isChecked: false,
        note: 'Garam masala, turmeric, cumin, etc.',
        studentTip: 'Many spices are available at Tang Frères or Indian grocery stores, but more expensive.',
        storeSuggestions: ['Tang Frères (Rouen)', 'Indian Mart Paris (€2–5/pack)']
      },
      {
        id: 'food-1',
        name: 'Ready-to-eat Meals / Instant Foods',
        category: 'food',
        source: 'Pack from India',
        isChecked: false,
        note: 'Useful during initial days when settling in.',
        studentTip: 'MTR and Haldiram packets were life-savers according to multiple students.',
        storeSuggestions: []
      },
      {
        id: 'food-2',
        name: 'Pickles (small jar)',
        category: 'food',
        source: 'Pack from India',
        isChecked: false,
        note: 'Comfort food for many Indian students.',
        studentTip: 'Jay and Meghana recommend packing leak-proof jars.',
        storeSuggestions: []
      },
      {
        id: 'food-3',
        name: 'Snacks',
        category: 'food',
        source: 'Optional',
        isChecked: false,
        note: 'Bring favorite snacks like Maggi, Kurkure, or biscuits.',
        studentTip: 'Jay packed 1 kg of snacks, but finished it in the first week.',
        storeSuggestions: []
      },
      {
        id: 'food-4',
        name: 'Staples (rice, dal)',
        category: 'food',
        source: 'Buy in France',
        isChecked: false,
        note: 'Available in Asian stores locally.',
        studentTip: 'Most students said no need to pack — affordable in Rouen.',
        storeSuggestions: ['Tang Frères', 'Local Asian Stores']
      }
    );

    // KITCHEN ESSENTIALS (CROUS/PRIVATE MIX)
    items.push(
      {
        id: 'kitchen-0',
        name: 'Pressure Cooker',
        category: 'kitchen',
        source: 'Pack from India',
        isChecked: false,
        tooltip: 'Not provided in CROUS or most private housing. Essential for Indian meals.',
        storeSuggestions: ['Temu (€15–25)', 'Amazon France (€30+)'],
        studentTip: 'Jay brought two — only needed one. Carry small/medium size only.'
      },
      {
        id: 'kitchen-1',
        name: 'Spatula, Spoon, Knife',
        category: 'kitchen',
        source: 'Pack from India',
        isChecked: false,
        tooltip: 'Essential items not included in CROUS housing.',
        storeSuggestions: ['Action (€1–3/item)', 'Normal'],
        studentTip: 'Hari had to borrow a knife before buying a €3 set from Action.'
      },
      {
        id: 'kitchen-2',
        name: 'Plate, Bowl, Cup, Cutlery Set',
        category: 'kitchen',
        source: 'Pack from India',
        isChecked: false,
        tooltip: 'Can be bought locally too, but you’ll need them immediately.',
        storeSuggestions: ['Action (€1–3/item)', 'Carrefour (€5–10/set)'],
        studentTip: 'Aslam found it easier to buy these locally after arrival.'
      },
      {
        id: 'kitchen-3',
        name: 'Lunchbox / Storage Containers',
        category: 'kitchen',
        source: 'Pack from India',
        isChecked: false,
        tooltip: 'Helpful for storing food or packing lunch during travel/classes.',
        storeSuggestions: ['Temu (€2–6)', 'Action (€2–5)'],
        studentTip: 'Meghana used one for storing leftover dal in the shared fridge.'
      },
      {
        id: 'kitchen-4',
        name: 'Cutting Board & Peeler',
        category: 'kitchen',
        source: 'Optional',
        isChecked: false,
        tooltip: 'Can be packed or purchased locally.',
        storeSuggestions: ['Temu (€2–5)', 'Action', 'Normal'],
        studentTip: 'Temu had a bundle for €5 with peeler and cutting board.'
      },
      {
        id: 'kitchen-5',
        name: 'Masala Dabba / Indian Spice Box',
        category: 'kitchen',
        source: 'Optional',
        isChecked: false,
        tooltip: 'Useful if you cook regularly; not easily available in France.',
        storeSuggestions: ['Temu (€5–10)', 'Amazon'],
        studentTip: 'Jay bought a local container instead — Indian ones work better.'
      },
      {
        id: 'kitchen-6',
        name: 'Cooking Pan / Frying Pan',
        category: 'kitchen',
        source: 'Buy in France',
        isChecked: false,
        tooltip: 'Available at Carrefour, Lidl, and Action.',
        storeSuggestions: ['Carrefour (€10–20)', 'Lidl (€8–15)', 'Action (€5–12)'],
        studentTip: 'Students in CROUS say one pan is enough for most daily cooking.'
      },
      {
        id: 'kitchen-7',
        name: 'Plates, Cups, Spoons (Extra)',
        category: 'kitchen',
        source: 'Buy in France',
        isChecked: false,
        tooltip: 'Affordable at Action and Normal. No need to carry full set from India.',
        storeSuggestions: ['Action (€1–3/item)', 'Normal'],
        studentTip: 'Many students bought cheap items in bulk after arrival.'
      }
    );

    // ✅ END of Chunk 2A
    // 👇 Let me know when to proceed with **Chunk 2B**:
    // 🔌 Electronics
    // 🛏️ Accommodation
    // 🧼 Toiletries & Personal Care

Let me know to continue.
    // ELECTRONICS
    items.push(
      {
        id: 'electronics-0',
        name: 'Laptop',
        category: 'electronics',
        source: 'Pack from India',
        isChecked: false,
        tooltip: 'Essential for studies. French keyboards are AZERTY.',
        studentTip: 'Buy in India to save money and get QWERTY layout.',
        storeSuggestions: ['FNAC (€500–700+)', 'Darty (€550+)']
      },
      {
        id: 'electronics-1',
        name: 'Mobile Phone (Smartphone)',
        category: 'electronics',
        source: 'Pack from India',
        isChecked: false,
        studentTip: 'Bring a spare phone if possible. Useful during transition.',
        storeSuggestions: ['FNAC (€200–500+)', 'Darty (€250+)']
      },
      {
        id: 'electronics-2',
        name: 'Power Bank',
        category: 'electronics',
        source: 'Pack from India',
        isChecked: false,
        studentTip: 'Helpful during travel and transit.',
        storeSuggestions: ['Action (€10–20)', 'Carrefour (€15–25)']
      },
      {
        id: 'electronics-3',
        name: 'Universal Plug Adapter (Type C/E/F)',
        category: 'electronics',
        source: 'Pack from India',
        isChecked: false,
        studentTip: 'French sockets differ — students struggled without these.',
        storeSuggestions: ['Amazon.in (₹400–700)', 'Carrefour (€5–15)']
      },
      {
        id: 'electronics-4',
        name: 'Earphones / Headphones',
        category: 'electronics',
        source: 'Pack from India',
        isChecked: false,
        studentTip: 'Local ones are costlier. Bring good quality from India.',
        storeSuggestions: ['FNAC (€20–60)', 'Action (€8–15)']
      },
      {
        id: 'electronics-5',
        name: 'Portable Extension Board',
        category: 'electronics',
        source: 'Pack from India',
        isChecked: false,
        studentTip: 'Charge multiple devices using one adapter.',
        storeSuggestions: ['Amazon.in (₹600–1200)', 'Action (€7–12)']
      },
      {
        id: 'electronics-6',
        name: 'Charging Cables',
        category: 'electronics',
        source: 'Pack from India',
        isChecked: false,
        studentTip: 'Cables wear out. Pack extras.',
        storeSuggestions: ['Amazon.in (₹200–600)', 'Carrefour (€5–10)']
      },
      {
        id: 'electronics-7',
        name: 'External Hard Drive / USB Drive',
        category: 'electronics',
        source: 'Optional',
        isChecked: false,
        studentTip: 'Great for backups and storage.',
        storeSuggestions: ['FNAC (€30–60)', 'Amazon.fr (€25–50)']
      },
      {
        id: 'electronics-8',
        name: 'External Keyboard (AZERTY workaround)',
        category: 'electronics',
        source: 'Optional',
        isChecked: false,
        studentTip: 'Useful if you type a lot and dislike AZERTY.',
        storeSuggestions: ['FNAC (€20–40)']
      },
      {
        id: 'electronics-9',
        name: 'Wireless Mouse',
        category: 'electronics',
        source: 'Optional',
        isChecked: false,
        studentTip: 'Improves laptop use, not mandatory.',
        storeSuggestions: ['Carrefour (€10–25)', 'FNAC (€15–30)']
      }
    );

    // ACCOMMODATION ESSENTIALS
    items.push(
      {
        id: 'accommodation-0',
        name: 'Bedsheet (Single Size)',
        category: 'accommodation',
        source: 'Pack from India',
        isChecked: false,
        studentTip: 'CROUS doesn’t provide. Bring your own.',
        storeSuggestions: ['Carrefour (€7–15)', 'Action (€5–10)']
      },
      {
        id: 'accommodation-1',
        name: 'Flush Bottle / Toilet Mug',
        category: 'accommodation',
        source: 'Pack from India',
        isChecked: false,
        studentTip: 'Unavailable locally — highly recommended.',
        storeSuggestions: []
      },
      {
        id: 'accommodation-2',
        name: 'Towel',
        category: 'accommodation',
        source: 'Pack from India',
        isChecked: false,
        studentTip: 'Bring at least one quick-dry towel.',
        storeSuggestions: ['Action (€3–6)', 'Carrefour (€5–10)']
      },
      {
        id: 'accommodation-3',
        name: 'Toiletries Starter Kit',
        category: 'accommodation',
        source: 'Pack from India',
        isChecked: false,
        studentTip: 'Carry for first week: soap, brush, nail cutter.',
        storeSuggestions: []
      },
      {
        id: 'accommodation-4',
        name: 'Laundry Bag',
        category: 'accommodation',
        source: 'Pack from India',
        isChecked: false,
        studentTip: 'Keeps laundry organized.',
        storeSuggestions: ['Action (€2–5)']
      },
      {
        id: 'accommodation-5',
        name: 'Detergent (Starter Sachet)',
        category: 'accommodation',
        source: 'Pack from India',
        isChecked: false,
        studentTip: 'Pack a few sachets for early laundry.',
        storeSuggestions: ['Lidl (€2–4)', 'Carrefour (€3–6)']
      },
      {
        id: 'accommodation-6',
        name: 'Pillow & Duvet',
        category: 'accommodation',
        source: 'Buy in France',
        isChecked: false,
        studentTip: 'Buy locally after arrival.',
        storeSuggestions: ['Leclerc (€10–30)', 'Carrefour (€15–35)', 'Action (€10–20)']
      },
      {
        id: 'accommodation-7',
        name: 'Storage Items (Bins, Hangers)',
        category: 'accommodation',
        source: 'Buy in France',
        isChecked: false,
        studentTip: 'Organize space efficiently.',
        storeSuggestions: ['Normal (€2–5)', 'Action (€1–3/item)']
      },
      {
        id: 'accommodation-8',
        name: 'Cleaning Supplies (Soap, Sponge, Mop)',
        category: 'accommodation',
        source: 'Buy in France',
        isChecked: false,
        studentTip: 'Not provided in CROUS.',
        storeSuggestions: ['Lidl (€1–3/item)', 'Carrefour (€1–5/item)']
      }
    );

    // TOILETRIES & PERSONAL CARE
    items.push(
      {
        id: 'toiletries-0',
        name: 'Toothbrush & Toothpaste',
        category: 'toiletries',
        source: 'Pack from India',
        isChecked: false,
        studentTip: 'Bring for the first month.',
        storeSuggestions: ['Carrefour (€2–3)', 'Action (€1–2)']
      },
      {
        id: 'toiletries-1',
        name: 'Soap / Body Wash',
        category: 'toiletries',
        source: 'Pack from India',
        isChecked: false,
        studentTip: 'Bring travel size for arrival days.',
        storeSuggestions: ['Normal (€1.50–3)', 'Action (€1–2)']
      },
      {
        id: 'toiletries-2',
        name: 'Shampoo & Conditioner',
        category: 'toiletries',
        source: 'Pack from India',
        isChecked: false,
        studentTip: 'Small bottles/sachets for the start.',
        storeSuggestions: ['Normal (€2–4)', 'Carrefour (€3–6)']
      },
      {
        id: 'toiletries-3',
        name: 'Hair Oil',
        category: 'toiletries',
        source: 'Pack from India',
        isChecked: false,
        studentTip: 'Indian brands are hard to find.',
        storeSuggestions: []
      },
      {
        id: 'toiletries-4',
        name: 'Moisturizer',
        category: 'toiletries',
        source: 'Pack from India',
        isChecked: false,
        studentTip: 'Carry your preferred brand.',
        storeSuggestions: ['Carrefour (€3–5)', 'Normal (€2–4)']
      },
      {
        id: 'toiletries-5',
        name: 'Razor / Trimmer',
        category: 'toiletries',
        source: 'Pack from India',
        isChecked: false,
        studentTip: 'Expensive in France. Bring a good one.',
        storeSuggestions: ['FNAC (€25–50)']
      },
      {
        id: 'toiletries-6',
        name: 'Nail Cutter',
        category: 'toiletries',
        source: 'Pack from India',
        isChecked: false,
        studentTip: 'Often overlooked — pack at least one.',
        storeSuggestions: []
      },
      {
        id: 'toiletries-7',
        name: 'Toilet Mug / Flush Bottle',
        category: 'toiletries',
        source: 'Pack from India',
        isChecked: false,
        studentTip: 'Strongly recommended. Unavailable locally.',
        storeSuggestions: []
      },
      {
        id: 'toiletries-8',
        name: 'Detergent Sachets (2–3)',
        category: 'toiletries',
        source: 'Pack from India',
        isChecked: false,
        studentTip: 'Enough until you shop locally.',
        storeSuggestions: ['Lidl (€2–4)']
      },
      {
        id: 'toiletries-9',
        name: 'Towel & Hand Towel',
        category: 'toiletries',
        source: 'Pack from India',
        isChecked: false,
        studentTip: 'Quick-dry microfiber towel is ideal.',
        storeSuggestions: ['Carrefour (€5–10)', 'Action (€3–6)']
      },
      {
        id: 'toiletries-10',
        name: 'Comb / Hair Brush',
        category: 'toiletries',
        source: 'Pack from India',
        isChecked: false,
        studentTip: 'Compact version preferred.',
        storeSuggestions: []
      },
      {
        id: 'toiletries-11',
        name: 'Lip Balm',
        category: 'toiletries',
        source: 'Optional',
        isChecked: false,
        studentTip: 'Can be bought easily at pharmacies.',
        storeSuggestions: ['Pharmacies (€1–2)']
      },
      {
        id: 'toiletries-12',
        name: 'Sunscreen',
        category: 'toiletries',
        source: 'Pack from India',
        isChecked: false,
        studentTip: 'Useful in spring/fall for outdoor trips.',
        storeSuggestions: ['Normal (€4–7)']
      },
      {
        id: 'toiletries-13',
        name: 'Perfume / Deodorant',
        category: 'toiletries',
        source: 'Optional',
        isChecked: false,
        studentTip: 'Only if you prefer specific brands.',
        storeSuggestions: ['Carrefour (€5–15)']
      },
      {
        id: 'toiletries-14',
        name: 'Sanitary Products',
        category: 'toiletries',
        source: 'Pack from India',
        isChecked: false,
        studentTip: 'Bring preferred products; local options may differ.',
        storeSuggestions: ['Carrefour (€2–5)', 'Pharmacies (€3–6)']
      }
    );

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
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      setJustCompleted(true);
    }
  }, [progressPercentage, justCompleted]);

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
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

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

  const filteredItems = packingItems.filter(item => {
    if (item.category !== selectedCategory) return false;
    if (hidePacked && item.isChecked) return false;
    return true;
  });

  const categoryIcons = {
    clothing: <Shirt className="h-5 w-5" />,
    food: <Utensils className="h-5 w-5" />,
    kitchen: <Utensils className="h-5 w-5" />,
    electronics: <Plug className="h-5 w-5" />,
    accommodation: <Home className="h-5 w-5" />,
    toiletries: <Droplet className="h-5 w-5" />
  };

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
    {/* Back Button + Header */}
    <div className="mb-6">
      <Button variant="outline" onClick={onBack} className="mb-4">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Checklist
      </Button>

      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">🎒 Packing Assistance</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Plan your luggage smartly. Know what to bring, what to skip, and what to buy locally.
        </p>
      </div>
    </div>

    {/* Progress Tracker */}
    <Card className="mb-6">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-gray-900">Your Packing Progress</h3>
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

    {/* Location Dropdown */}
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
      <div className="mt-2 text-xs text-gray-500 flex items-center gap-1">
        <Info className="h-3 w-3 mr-1" />
        More cities will be added soon. Currently optimized for students in Rouen.
      </div>
    </div>

    {/* Category Tabs */}
    <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="mb-6">
      <TabsList className="grid grid-cols-3 md:grid-cols-6">
        <TabsTrigger value="clothing" className="flex items-center gap-1 text-xs md:text-sm">
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

    {/* Filter Checkbox */}
    <div className="flex items-center mb-4">
      <Checkbox
        id="hide-packed"
        checked={hidePacked}
        onCheckedChange={(checked) => setHidePacked(!!checked)}
      />
      <label htmlFor="hide-packed" className="ml-2 text-sm text-gray-700 cursor-pointer">
        Hide packed items
      </label>
    </div>
    {/* Item Cards List */}
    {filteredItems.length === 0 ? (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-gray-500 py-4">
            {hidePacked
              ? "All items in this category are packed! 🎉"
              : "No items in this category. Add some below!"}
          </p>
        </CardContent>
      </Card>
    ) : (
      filteredItems.map((item) => (
        <Card key={item.id} className={`transition-all duration-200 ${item.isChecked ? 'bg-gray-50' : ''}`}>
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Checkbox
                id={`item-${item.id}`}
                checked={item.isChecked}
                onCheckedChange={(checked) => handleItemCheck(item.id, checked === true)}
                className="mt-1"
              />
              <div className="flex-1 min-w-0">
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
                  <div className="flex items-center text-xs text-gray-500 mb-1">
                    <ShoppingBag className="h-3 w-3 mr-1" />
                    {item.storeInfo && <span className="mr-2">{item.storeInfo}</span>}
                    {item.priceRange && <span>{item.priceRange}</span>}
                  </div>
                )}
                {item.storeSuggestions && item.storeSuggestions.length > 0 && (
                  <div className="flex items-center text-xs text-gray-500 mb-1">
                    <ShoppingBag className="h-3 w-3 mr-1" />
                    <span>{item.storeSuggestions.join(', ')}</span>
                  </div>
                )}
                {item.studentTip && (
                  <div className="bg-blue-50 p-2 rounded-md text-xs text-blue-700 mt-1">
                    <span className="font-medium">Student Tip:</span> {item.studentTip}
                  </div>
                )}
                {item.tooltip && (
                  <div className="text-xs text-gray-600 mt-1 italic">
                    {item.tooltip}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))
    )}
    {/* Add New Item */}
    <Card className="mb-8">
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
              onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="item-source" className="mb-2 block">Source</Label>
            <Select
              value={newItem.source}
              onValueChange={(value) => setNewItem({ ...newItem, source: value as PackingItem['source'] })}
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
            onChange={(e) => setNewItem({ ...newItem, note: e.target.value })}
          />
        </div>
        <Button onClick={handleAddItem} className="w-full md:w-auto">
          <Plus className="h-4 w-4 mr-2" />
          Add Item
        </Button>
      </CardContent>
    </Card>

    {/* Tips Section */}
    <Card className="bg-blue-50">
      <CardContent className="p-6">
        <h3 className="font-semibold text-blue-900 mb-3">💡 Packing Tips</h3>
        <ul className="space-y-2 text-blue-800 text-sm">
          <li>• Pack light – you can buy most things in France</li>
          <li>• Bring a universal adapter for your electronics</li>
          <li>• Consider shipping some items ahead to reduce luggage weight</li>
          <li>• Download offline translation apps before traveling</li>
          <li>• Join French student groups on social media for tips</li>
        </ul>
      </CardContent>
    </Card>

    <div className="mt-4 text-center text-sm text-gray-500 mb-8">
      Progress: {checkedItems} of {totalItems} items packed
    </div>
  </div>
);
