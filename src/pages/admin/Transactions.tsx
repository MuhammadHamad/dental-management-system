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
  CreditCard,
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  DollarSign,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Calendar,
  Download,
  Receipt,
  Banknote,
  Smartphone,
  Building,
  ArrowUpCircle,
  ArrowDownCircle,
  Eye
} from 'lucide-react';

interface Transaction {
  id: string;
  transaction_type: 'payment' | 'refund' | 'expense';
  payment_method: 'cash' | 'bank_transfer' | 'credit_card' | 'easypaisa' | 'jazzcash' | 'insurance';
  amount: number;
  description: string;
  transaction_date: string;
  reference_number?: string;
  patient_name?: string;
  appointment_id?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export default function Transactions() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [methodFilter, setMethodFilter] = useState<string>('all');
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  const [formData, setFormData] = useState({
    transaction_type: 'payment',
    payment_method: 'cash',
    amount: '',
    description: '',
    transaction_date: format(new Date(), 'yyyy-MM-dd'),
    reference_number: '',
    patient_name: '',
    notes: ''
  });

  // Mock data for demonstration
  const mockTransactions: Transaction[] = [
    {
      id: '1',
      transaction_type: 'payment',
      payment_method: 'cash',
      amount: 150.00,
      description: 'General Checkup and Cleaning',
      transaction_date: '2024-01-15',
      patient_name: 'Sarah Johnson',
      appointment_id: 'apt_001',
      notes: 'Regular checkup payment',
      created_at: '2024-01-15T09:30:00Z',
      updated_at: '2024-01-15T09:30:00Z'
    },
    {
      id: '2',
      transaction_type: 'payment',
      payment_method: 'easypaisa',
      amount: 300.00,
      description: 'Teeth Whitening Treatment',
      transaction_date: '2024-01-15',
      reference_number: 'EP123456789',
      patient_name: 'Michael Chen',
      appointment_id: 'apt_002',
      notes: 'EasyPaisa mobile payment',
      created_at: '2024-01-15T11:15:00Z',
      updated_at: '2024-01-15T11:15:00Z'
    },
    {
      id: '3',
      transaction_type: 'payment',
      payment_method: 'bank_transfer',
      amount: 2500.00,
      description: 'Orthodontic Treatment - Initial Payment',
      transaction_date: '2024-01-14',
      reference_number: 'BT987654321',
      patient_name: 'Emma Wilson',
      appointment_id: 'apt_003',
      notes: 'Bank transfer for braces treatment',
      created_at: '2024-01-14T14:20:00Z',
      updated_at: '2024-01-14T14:20:00Z'
    },
    {
      id: '4',
      transaction_type: 'expense',
      payment_method: 'cash',
      amount: 450.00,
      description: 'Dental Supplies Purchase',
      transaction_date: '2024-01-14',
      reference_number: 'INV-2024-001',
      notes: 'Monthly supplies from Dental Supply Co.',
      created_at: '2024-01-14T16:45:00Z',
      updated_at: '2024-01-14T16:45:00Z'
    },
    {
      id: '5',
      transaction_type: 'payment',
      payment_method: 'jazzcash',
      amount: 500.00,
      description: 'Root Canal Treatment',
      transaction_date: '2024-01-13',
      reference_number: 'JC456789123',
      patient_name: 'David Brown',
      appointment_id: 'apt_004',
      notes: 'JazzCash mobile payment',
      created_at: '2024-01-13T10:30:00Z',
      updated_at: '2024-01-13T10:30:00Z'
    },
    {
      id: '6',
      transaction_type: 'refund',
      payment_method: 'credit_card',
      amount: 200.00,
      description: 'Cancelled Cosmetic Consultation',
      transaction_date: '2024-01-13',
      reference_number: 'CC789123456',
      patient_name: 'Lisa Anderson',
      appointment_id: 'apt_005',
      notes: 'Refund for cancelled appointment',
      created_at: '2024-01-13T15:10:00Z',
      updated_at: '2024-01-13T15:10:00Z'
    },
    {
      id: '7',
      transaction_type: 'payment',
      payment_method: 'insurance',
      amount: 800.00,
      description: 'Dental Surgery - Insurance Coverage',
      transaction_date: '2024-01-12',
      reference_number: 'INS-2024-001',
      patient_name: 'Robert Taylor',
      appointment_id: 'apt_006',
      notes: 'Insurance claim processed',
      created_at: '2024-01-12T13:25:00Z',
      updated_at: '2024-01-12T13:25:00Z'
    }
  ];

  const paymentMethods = [
    { value: 'cash', label: 'Cash', icon: Banknote },
    { value: 'bank_transfer', label: 'Bank Transfer', icon: Building },
    { value: 'credit_card', label: 'Credit Card', icon: CreditCard },
    { value: 'easypaisa', label: 'EasyPaisa', icon: Smartphone },
    { value: 'jazzcash', label: 'JazzCash', icon: Smartphone },
    { value: 'insurance', label: 'Insurance', icon: Receipt }
  ];

  useEffect(() => {
    // Simulate loading transactions
    setTimeout(() => {
      setTransactions(mockTransactions);
      setLoading(false);
    }, 1000);
  }, []);

  const getTransactionTypeColor = (type: string) => {
    switch (type) {
      case 'payment':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'refund':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'expense':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTransactionTypeIcon = (type: string) => {
    switch (type) {
      case 'payment':
        return <ArrowUpCircle className="w-4 h-4" />;
      case 'refund':
        return <ArrowDownCircle className="w-4 h-4" />;
      case 'expense':
        return <ArrowDownCircle className="w-4 h-4" />;
      default:
        return <DollarSign className="w-4 h-4" />;
    }
  };

  const getPaymentMethodIcon = (method: string) => {
    const methodObj = paymentMethods.find(m => m.value === method);
    if (methodObj) {
      const Icon = methodObj.icon;
      return <Icon className="w-4 h-4" />;
    }
    return <CreditCard className="w-4 h-4" />;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const newTransaction: Transaction = {
        id: Date.now().toString(),
        transaction_type: formData.transaction_type as any,
        payment_method: formData.payment_method as any,
        amount: parseFloat(formData.amount),
        description: formData.description,
        transaction_date: formData.transaction_date,
        reference_number: formData.reference_number || undefined,
        patient_name: formData.patient_name || undefined,
        notes: formData.notes || undefined,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      setTransactions(prev => [newTransaction, ...prev]);
      
      toast({
        title: "Transaction Added",
        description: "New transaction has been recorded successfully.",
      });

      // Reset form
      setFormData({
        transaction_type: 'payment',
        payment_method: 'cash',
        amount: '',
        description: '',
        transaction_date: format(new Date(), 'yyyy-MM-dd'),
        reference_number: '',
        patient_name: '',
        notes: ''
      });
      setIsAddDialogOpen(false);

    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add transaction.",
      });
    }
  };

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = 
      transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.patient_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.reference_number?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = typeFilter === 'all' || transaction.transaction_type === typeFilter;
    const matchesMethod = methodFilter === 'all' || transaction.payment_method === methodFilter;
    
    return matchesSearch && matchesType && matchesMethod;
  });

  const totalPayments = transactions
    .filter(t => t.transaction_type === 'payment')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter(t => t.transaction_type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalRefunds = transactions
    .filter(t => t.transaction_type === 'refund')
    .reduce((sum, t) => sum + t.amount, 0);

  const netIncome = totalPayments - totalExpenses - totalRefunds;

  const stats = [
    {
      title: "Total Payments",
      value: `$${totalPayments.toFixed(2)}`,
      icon: ArrowUpCircle,
      color: "text-green-600"
    },
    {
      title: "Total Expenses",
      value: `$${totalExpenses.toFixed(2)}`,
      icon: ArrowDownCircle,
      color: "text-red-600"
    },
    {
      title: "Total Refunds",
      value: `$${totalRefunds.toFixed(2)}`,
      icon: TrendingDown,
      color: "text-orange-600"
    },
    {
      title: "Net Income",
      value: `$${netIncome.toFixed(2)}`,
      icon: BarChart3,
      color: netIncome >= 0 ? "text-green-600" : "text-red-600"
    }
  ];

  if (loading) {
    return (
      <div className="flex h-screen">
        <AdminSidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading transactions...</p>
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
              <h1 className="text-2xl font-bold text-foreground">Transaction Management</h1>
              <p className="text-muted-foreground">Track payments, expenses, and financial transactions</p>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button 
                variant="medical" 
                size="sm"
                onClick={() => setIsAddDialogOpen(true)}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Transaction
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
                  placeholder="Search transactions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="payment">Payments</SelectItem>
                <SelectItem value="expense">Expenses</SelectItem>
                <SelectItem value="refund">Refunds</SelectItem>
              </SelectContent>
            </Select>
            <Select value={methodFilter} onValueChange={setMethodFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Methods</SelectItem>
                {paymentMethods.map(method => (
                  <SelectItem key={method.value} value={method.value}>
                    {method.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="flex-1 overflow-auto p-6">
          <Card className="shadow-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Payment Method</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Reference</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span>{format(new Date(transaction.transaction_date), 'MMM dd, yyyy')}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={`${getTransactionTypeColor(transaction.transaction_type)} border`}>
                        <div className="flex items-center space-x-1">
                          {getTransactionTypeIcon(transaction.transaction_type)}
                          <span className="capitalize">{transaction.transaction_type}</span>
                        </div>
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <p className="font-medium">{transaction.description}</p>
                        {transaction.patient_name && (
                          <p className="text-sm text-muted-foreground">Patient: {transaction.patient_name}</p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {getPaymentMethodIcon(transaction.payment_method)}
                        <span className="capitalize">
                          {paymentMethods.find(m => m.value === transaction.payment_method)?.label || transaction.payment_method}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={`font-medium ${
                        transaction.transaction_type === 'payment' ? 'text-green-600' : 
                        transaction.transaction_type === 'expense' ? 'text-red-600' : 
                        'text-orange-600'
                      }`}>
                        {transaction.transaction_type === 'payment' ? '+' : '-'}${transaction.amount.toFixed(2)}
                      </span>
                    </TableCell>
                    <TableCell>
                      {transaction.reference_number ? (
                        <span className="text-sm font-mono bg-muted px-2 py-1 rounded">
                          {transaction.reference_number}
                        </span>
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
                            setSelectedTransaction(transaction);
                            setIsViewDialogOpen(true);
                          }}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setTransactions(prev => prev.filter(t => t.id !== transaction.id));
                            toast({
                              title: "Transaction Deleted",
                              description: "Transaction has been deleted.",
                            });
                          }}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </div>
      </div>

      {/* Add Transaction Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New Transaction</DialogTitle>
            <DialogDescription>
              Record a new payment, expense, or refund transaction
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="transaction_type">Transaction Type *</Label>
                <Select 
                  value={formData.transaction_type} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, transaction_type: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="payment">Payment</SelectItem>
                    <SelectItem value="expense">Expense</SelectItem>
                    <SelectItem value="refund">Refund</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="payment_method">Payment Method *</Label>
                <Select 
                  value={formData.payment_method} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, payment_method: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select method" />
                  </SelectTrigger>
                  <SelectContent>
                    {paymentMethods.map(method => (
                      <SelectItem key={method.value} value={method.value}>
                        {method.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Amount *</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.amount}
                  onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                  required
                  placeholder="0.00"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="transaction_date">Transaction Date *</Label>
                <Input
                  id="transaction_date"
                  type="date"
                  value={formData.transaction_date}
                  onChange={(e) => setFormData(prev => ({ ...prev, transaction_date: e.target.value }))}
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                required
                placeholder="Enter transaction description"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="patient_name">Patient Name</Label>
                <Input
                  id="patient_name"
                  value={formData.patient_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, patient_name: e.target.value }))}
                  placeholder="Enter patient name (if applicable)"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="reference_number">Reference Number</Label>
                <Input
                  id="reference_number"
                  value={formData.reference_number}
                  onChange={(e) => setFormData(prev => ({ ...prev, reference_number: e.target.value }))}
                  placeholder="Enter reference/transaction ID"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Additional notes about this transaction..."
                className="min-h-[80px]"
              />
            </div>
            
            <div className="flex justify-end space-x-2 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsAddDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" variant="medical">
                Add Transaction
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* View Transaction Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Transaction Details</DialogTitle>
            <DialogDescription>
              View complete transaction information
            </DialogDescription>
          </DialogHeader>
          {selectedTransaction && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Transaction Type</Label>
                  <Badge className={`${getTransactionTypeColor(selectedTransaction.transaction_type)} border mt-1`}>
                    {selectedTransaction.transaction_type}
                  </Badge>
                </div>
                <div>
                  <Label className="text-sm font-medium">Payment Method</Label>
                  <div className="flex items-center space-x-2 mt-1">
                    {getPaymentMethodIcon(selectedTransaction.payment_method)}
                    <span>{paymentMethods.find(m => m.value === selectedTransaction.payment_method)?.label}</span>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Amount</Label>
                  <p className="text-lg font-semibold text-foreground">${selectedTransaction.amount.toFixed(2)}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Date</Label>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(selectedTransaction.transaction_date), 'MMMM dd, yyyy')}
                  </p>
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium">Description</Label>
                <p className="text-sm text-muted-foreground">{selectedTransaction.description}</p>
              </div>
              {selectedTransaction.patient_name && (
                <div>
                  <Label className="text-sm font-medium">Patient Name</Label>
                  <p className="text-sm text-muted-foreground">{selectedTransaction.patient_name}</p>
                </div>
              )}
              {selectedTransaction.reference_number && (
                <div>
                  <Label className="text-sm font-medium">Reference Number</Label>
                  <p className="text-sm font-mono bg-muted px-2 py-1 rounded inline-block">
                    {selectedTransaction.reference_number}
                  </p>
                </div>
              )}
              {selectedTransaction.notes && (
                <div>
                  <Label className="text-sm font-medium">Notes</Label>
                  <p className="text-sm text-muted-foreground">{selectedTransaction.notes}</p>
                </div>
              )}
              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
