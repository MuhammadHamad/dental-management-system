import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/enhanced-button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import AdminSidebar from '@/components/AdminSidebar';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { 
  Package,
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  AlertTriangle,
  TrendingDown,
  TrendingUp,
  BarChart3,
  Calendar,
  Truck,
  CheckCircle,
  XCircle,
  Download,
  Upload
} from 'lucide-react';

interface InventoryItem {
  id: string;
  item_name: string;
  category: string;
  brand?: string;
  supplier?: string;
  current_stock: number;
  minimum_stock: number;
  unit_cost: number;
  expiry_date?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export default function Inventory() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [stockFilter, setStockFilter] = useState<string>('all');
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const [formData, setFormData] = useState({
    item_name: '',
    category: '',
    brand: '',
    supplier: '',
    current_stock: '',
    minimum_stock: '',
    unit_cost: '',
    expiry_date: '',
    notes: ''
  });

  // Mock data for demonstration
  const mockInventory: InventoryItem[] = [
    {
      id: '1',
      item_name: 'Dental Gloves (Nitrile)',
      category: 'PPE',
      brand: 'MedGlove',
      supplier: 'Dental Supply Co.',
      current_stock: 250,
      minimum_stock: 100,
      unit_cost: 0.15,
      expiry_date: '2025-06-30',
      notes: 'Size Medium, Powder-free',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-15T10:30:00Z'
    },
    {
      id: '2',
      item_name: 'Composite Filling Material',
      category: 'Restorative',
      brand: '3M ESPE',
      supplier: 'Dental Materials Inc.',
      current_stock: 15,
      minimum_stock: 20,
      unit_cost: 45.99,
      expiry_date: '2024-12-31',
      notes: 'Shade A2, 4g syringes',
      created_at: '2024-01-02T00:00:00Z',
      updated_at: '2024-01-14T14:20:00Z'
    },
    {
      id: '3',
      item_name: 'Disposable Face Masks',
      category: 'PPE',
      brand: 'SafeMed',
      supplier: 'Medical Supplies Ltd.',
      current_stock: 500,
      minimum_stock: 200,
      unit_cost: 0.25,
      expiry_date: '2026-01-15',
      notes: 'Level 2 surgical masks',
      created_at: '2024-01-03T00:00:00Z',
      updated_at: '2024-01-13T09:15:00Z'
    },
    {
      id: '4',
      item_name: 'Local Anesthetic (Lidocaine)',
      category: 'Pharmaceuticals',
      brand: 'Septodont',
      supplier: 'Pharma Dental',
      current_stock: 8,
      minimum_stock: 15,
      unit_cost: 12.50,
      expiry_date: '2024-08-30',
      notes: '2% with epinephrine, 1.8ml cartridges',
      created_at: '2024-01-04T00:00:00Z',
      updated_at: '2024-01-12T16:45:00Z'
    },
    {
      id: '5',
      item_name: 'Dental Burs (Diamond)',
      category: 'Instruments',
      brand: 'Komet',
      supplier: 'Instrument Supply Co.',
      current_stock: 45,
      minimum_stock: 30,
      unit_cost: 8.75,
      notes: 'Assorted grits, FG shank',
      created_at: '2024-01-05T00:00:00Z',
      updated_at: '2024-01-11T11:30:00Z'
    },
    {
      id: '6',
      item_name: 'Impression Material (Alginate)',
      category: 'Impression',
      brand: 'Dentsply',
      supplier: 'Dental Materials Inc.',
      current_stock: 3,
      minimum_stock: 10,
      unit_cost: 28.99,
      expiry_date: '2024-09-15',
      notes: 'Fast-set, mint flavor',
      created_at: '2024-01-06T00:00:00Z',
      updated_at: '2024-01-10T13:20:00Z'
    }
  ];

  const categories = ['PPE', 'Restorative', 'Pharmaceuticals', 'Instruments', 'Impression', 'Cleaning', 'Equipment'];

  useEffect(() => {
    // Simulate loading inventory
    setTimeout(() => {
      setInventory(mockInventory);
      setLoading(false);
    }, 1000);
  }, []);

  const getStockStatus = (item: InventoryItem) => {
    if (item.current_stock <= 0) return 'out-of-stock';
    if (item.current_stock <= item.minimum_stock) return 'low-stock';
    if (item.current_stock <= item.minimum_stock * 1.5) return 'warning';
    return 'in-stock';
  };

  const getStockStatusColor = (status: string) => {
    switch (status) {
      case 'out-of-stock':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'low-stock':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'in-stock':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStockStatusIcon = (status: string) => {
    switch (status) {
      case 'out-of-stock':
        return <XCircle className="w-4 h-4" />;
      case 'low-stock':
        return <AlertTriangle className="w-4 h-4" />;
      case 'warning':
        return <TrendingDown className="w-4 h-4" />;
      case 'in-stock':
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <Package className="w-4 h-4" />;
    }
  };

  const isExpiringSoon = (expiryDate?: string) => {
    if (!expiryDate) return false;
    const expiry = new Date(expiryDate);
    const today = new Date();
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 90; // Expiring within 90 days
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const newItem: InventoryItem = {
        id: Date.now().toString(),
        item_name: formData.item_name,
        category: formData.category,
        brand: formData.brand || undefined,
        supplier: formData.supplier || undefined,
        current_stock: parseInt(formData.current_stock),
        minimum_stock: parseInt(formData.minimum_stock),
        unit_cost: parseFloat(formData.unit_cost),
        expiry_date: formData.expiry_date || undefined,
        notes: formData.notes || undefined,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      if (selectedItem) {
        // Update existing item
        setInventory(prev => prev.map(item => 
          item.id === selectedItem.id ? { ...newItem, id: selectedItem.id } : item
        ));
        toast({
          title: "Item Updated",
          description: "Inventory item has been updated successfully.",
        });
      } else {
        // Add new item
        setInventory(prev => [...prev, newItem]);
        toast({
          title: "Item Added",
          description: "New inventory item has been added successfully.",
        });
      }

      // Reset form
      setFormData({
        item_name: '',
        category: '',
        brand: '',
        supplier: '',
        current_stock: '',
        minimum_stock: '',
        unit_cost: '',
        expiry_date: '',
        notes: ''
      });
      setSelectedItem(null);
      setIsAddDialogOpen(false);
      setIsEditDialogOpen(false);

    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save inventory item.",
      });
    }
  };

  const filteredInventory = inventory.filter(item => {
    const matchesSearch = 
      item.item_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.supplier?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    
    const stockStatus = getStockStatus(item);
    const matchesStock = stockFilter === 'all' || 
      (stockFilter === 'low' && (stockStatus === 'low-stock' || stockStatus === 'out-of-stock')) ||
      (stockFilter === 'in-stock' && stockStatus === 'in-stock');
    
    return matchesSearch && matchesCategory && matchesStock;
  });

  const stats = [
    {
      title: "Total Items",
      value: inventory.length,
      icon: Package,
      color: "text-blue-600"
    },
    {
      title: "Low Stock Items",
      value: inventory.filter(item => getStockStatus(item) === 'low-stock' || getStockStatus(item) === 'out-of-stock').length,
      icon: AlertTriangle,
      color: "text-red-600"
    },
    {
      title: "Expiring Soon",
      value: inventory.filter(item => isExpiringSoon(item.expiry_date)).length,
      icon: Calendar,
      color: "text-orange-600"
    },
    {
      title: "Total Value",
      value: `$${inventory.reduce((sum, item) => sum + (item.current_stock * item.unit_cost), 0).toFixed(2)}`,
      icon: BarChart3,
      color: "text-green-600"
    }
  ];

  if (loading) {
    return (
      <div className="flex h-screen">
        <AdminSidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading inventory...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background">
      <AdminSidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-card border-b border-border p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Inventory Management</h1>
              <p className="text-muted-foreground">Track and manage dental supplies and equipment</p>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button variant="outline" size="sm">
                <Upload className="w-4 h-4 mr-2" />
                Import
              </Button>
              <Button 
                variant="medical" 
                size="sm"
                onClick={() => setIsAddDialogOpen(true)}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Item
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="p-6 border-b border-border">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <Card key={index} className="shadow-card">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">{stat.title}</p>
                        <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                      </div>
                      <Icon className={`w-8 h-8 ${stat.color}`} />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Filters and Search */}
        <div className="p-6 border-b border-border">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search inventory..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={stockFilter} onValueChange={setStockFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by stock" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Stock Levels</SelectItem>
                <SelectItem value="low">Low Stock</SelectItem>
                <SelectItem value="in-stock">In Stock</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Inventory Table */}
        <div className="flex-1 overflow-auto p-6">
          <Card className="shadow-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item Details</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Stock Level</TableHead>
                  <TableHead>Unit Cost</TableHead>
                  <TableHead>Total Value</TableHead>
                  <TableHead>Expiry</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInventory.map((item) => {
                  const stockStatus = getStockStatus(item);
                  const isExpiring = isExpiringSoon(item.expiry_date);
                  
                  return (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div className="space-y-1">
                          <p className="font-medium text-foreground">{item.item_name}</p>
                          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                            {item.brand && <span>{item.brand}</span>}
                            {item.supplier && <span>• {item.supplier}</span>}
                          </div>
                          {item.notes && (
                            <p className="text-xs text-muted-foreground truncate max-w-48">{item.notes}</p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{item.category}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <span className="font-medium">{item.current_stock}</span>
                            <span className="text-muted-foreground">/ {item.minimum_stock}</span>
                          </div>
                          <Badge className={`${getStockStatusColor(stockStatus)} border text-xs`}>
                            <div className="flex items-center space-x-1">
                              {getStockStatusIcon(stockStatus)}
                              <span className="capitalize">{stockStatus.replace('-', ' ')}</span>
                            </div>
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="font-medium">${item.unit_cost.toFixed(2)}</span>
                      </TableCell>
                      <TableCell>
                        <span className="font-medium">${(item.current_stock * item.unit_cost).toFixed(2)}</span>
                      </TableCell>
                      <TableCell>
                        {item.expiry_date ? (
                          <div className="space-y-1">
                            <p className="text-sm">{format(new Date(item.expiry_date), 'MMM dd, yyyy')}</p>
                            {isExpiring && (
                              <Badge className="bg-orange-100 text-orange-800 border-orange-200 text-xs">
                                <AlertTriangle className="w-3 h-3 mr-1" />
                                Expiring Soon
                              </Badge>
                            )}
                          </div>
                        ) : (
                          <span className="text-muted-foreground">N/A</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedItem(item);
                              setFormData({
                                item_name: item.item_name,
                                category: item.category,
                                brand: item.brand || '',
                                supplier: item.supplier || '',
                                current_stock: item.current_stock.toString(),
                                minimum_stock: item.minimum_stock.toString(),
                                unit_cost: item.unit_cost.toString(),
                                expiry_date: item.expiry_date || '',
                                notes: item.notes || ''
                              });
                              setIsEditDialogOpen(true);
                            }}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setInventory(prev => prev.filter(i => i.id !== item.id));
                              toast({
                                title: "Item Deleted",
                                description: "Inventory item has been deleted.",
                              });
                            }}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </Card>
        </div>
      </div>

      {/* Add/Edit Item Dialog */}
      <Dialog open={isAddDialogOpen || isEditDialogOpen} onOpenChange={(open) => {
        if (!open) {
          setIsAddDialogOpen(false);
          setIsEditDialogOpen(false);
          setSelectedItem(null);
          setFormData({
            item_name: '',
            category: '',
            brand: '',
            supplier: '',
            current_stock: '',
            minimum_stock: '',
            unit_cost: '',
            expiry_date: '',
            notes: ''
          });
        }
      }}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {selectedItem ? 'Edit Inventory Item' : 'Add New Inventory Item'}
            </DialogTitle>
            <DialogDescription>
              {selectedItem ? 'Update the inventory item details' : 'Add a new item to your inventory'}
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="item_name">Item Name *</Label>
                <Input
                  id="item_name"
                  value={formData.item_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, item_name: e.target.value }))}
                  required
                  placeholder="Enter item name"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select 
                  value={formData.category} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="brand">Brand</Label>
                <Input
                  id="brand"
                  value={formData.brand}
                  onChange={(e) => setFormData(prev => ({ ...prev, brand: e.target.value }))}
                  placeholder="Enter brand name"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="supplier">Supplier</Label>
                <Input
                  id="supplier"
                  value={formData.supplier}
                  onChange={(e) => setFormData(prev => ({ ...prev, supplier: e.target.value }))}
                  placeholder="Enter supplier name"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="current_stock">Current Stock *</Label>
                <Input
                  id="current_stock"
                  type="number"
                  min="0"
                  value={formData.current_stock}
                  onChange={(e) => setFormData(prev => ({ ...prev, current_stock: e.target.value }))}
                  required
                  placeholder="0"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="minimum_stock">Minimum Stock *</Label>
                <Input
                  id="minimum_stock"
                  type="number"
                  min="0"
                  value={formData.minimum_stock}
                  onChange={(e) => setFormData(prev => ({ ...prev, minimum_stock: e.target.value }))}
                  required
                  placeholder="0"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="unit_cost">Unit Cost *</Label>
                <Input
                  id="unit_cost"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.unit_cost}
                  onChange={(e) => setFormData(prev => ({ ...prev, unit_cost: e.target.value }))}
                  required
                  placeholder="0.00"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="expiry_date">Expiry Date</Label>
              <Input
                id="expiry_date"
                type="date"
                value={formData.expiry_date}
                onChange={(e) => setFormData(prev => ({ ...prev, expiry_date: e.target.value }))}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Additional notes about this item..."
                className="min-h-[80px]"
              />
            </div>
            
            <div className="flex justify-end space-x-2 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => {
                  setIsAddDialogOpen(false);
                  setIsEditDialogOpen(false);
                }}
              >
                Cancel
              </Button>
              <Button type="submit" variant="medical">
                {selectedItem ? 'Update Item' : 'Add Item'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
