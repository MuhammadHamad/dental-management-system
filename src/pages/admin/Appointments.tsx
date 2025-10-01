import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
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
  Calendar,
  Clock,
  User,
  Phone,
  Mail,
  Search,
  Filter,
  MoreHorizontal,
  CheckCircle,
  XCircle,
  AlertCircle,
  Edit,
  Trash2,
  Plus,
  Eye,
  Download
} from 'lucide-react';

interface Appointment {
  id: string;
  appointment_date: string;
  appointment_time: string;
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'no_show';
  patient_name: string;
  patient_phone?: string;
  patient_email?: string;
  service: string;
  notes?: string;
  diagnosis?: string;
  treatment_plan?: string;
  created_at: string;
}

export default function Appointments() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  // Fetch real appointments from Supabase
  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('appointments')
        .select(`
          *,
          patients!inner (
            full_name,
            phone,
            email
          )
        `)
        .order('appointment_date', { ascending: false })
        .order('appointment_time', { ascending: true });

      if (error) {
        console.error('Error fetching appointments:', error);
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to load appointments. Please try again.'
        });
        setAppointments([]);
      } else {
        // Transform the data to match our Appointment interface
        const transformedData = (data || []).map((apt: any) => ({
          id: apt.id,
          appointment_date: apt.appointment_date,
          appointment_time: apt.appointment_time,
          status: apt.status,
          patient_name: apt.patients?.full_name || 'Unknown Patient',
          patient_phone: apt.patients?.phone,
          patient_email: apt.patients?.email,
          service: 'General Consultation',
          notes: apt.notes,
          diagnosis: apt.diagnosis,
          treatment_plan: apt.treatment_plan,
          created_at: apt.created_at
        }));
        setAppointments(transformedData);
      }
    } catch (error) {
      console.error('Error:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'An unexpected error occurred.'
      });
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'scheduled':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'no_show':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="w-4 h-4" />;
      case 'scheduled':
        return <Clock className="w-4 h-4" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4" />;
      case 'no_show':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const handleStatusUpdate = async (appointmentId: string, newStatus: string) => {
    try {
      // Update appointment status
      setAppointments(prev => 
        prev.map(apt => 
          apt.id === appointmentId 
            ? { ...apt, status: newStatus as any }
            : apt
        )
      );

      toast({
        title: "Status Updated",
        description: `Appointment status changed to ${newStatus}`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update appointment status",
      });
    }
  };

  const filteredAppointments = appointments.filter(appointment => {
    const matchesSearch = 
      appointment.patient_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.patient_email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || appointment.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const stats = [
    {
      title: "Today's Appointments",
      value: appointments.filter(apt => apt.appointment_date === format(new Date(), 'yyyy-MM-dd')).length,
      icon: Calendar,
      color: "text-blue-600"
    },
    {
      title: "Pending Approvals",
      value: appointments.filter(apt => apt.status === 'scheduled').length,
      icon: Clock,
      color: "text-orange-600"
    },
    {
      title: "Confirmed Today",
      value: appointments.filter(apt => 
        apt.status === 'confirmed' && 
        apt.appointment_date === format(new Date(), 'yyyy-MM-dd')
      ).length,
      icon: CheckCircle,
      color: "text-green-600"
    },
    {
      title: "Completed This Week",
      value: appointments.filter(apt => apt.status === 'completed').length,
      icon: User,
      color: "text-purple-600"
    }
  ];

  if (loading) {
    return (
      <div className="flex h-screen">
        <AdminSidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading appointments...</p>
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
              <h1 className="text-2xl font-bold text-foreground">Appointment Management</h1>
              <p className="text-muted-foreground">Manage and track all patient appointments</p>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button variant="medical" size="sm">
                <Plus className="w-4 h-4 mr-2" />
                New Appointment
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
                  placeholder="Search appointments..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
                <SelectItem value="no_show">No Show</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Appointments Table */}
        <div className="flex-1 overflow-auto p-6">
          <Card className="shadow-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Patient</TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Service</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAppointments.map((appointment) => (
                  <TableRow key={appointment.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                          <User className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{appointment.patient_name}</p>
                          <p className="text-sm text-muted-foreground">ID: {appointment.id}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <p className="font-medium">{format(new Date(appointment.appointment_date), 'MMM dd, yyyy')}</p>
                          <p className="text-sm text-muted-foreground">{appointment.appointment_time}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="font-medium">{appointment.service}</p>
                      {appointment.notes && (
                        <p className="text-sm text-muted-foreground truncate max-w-32">{appointment.notes}</p>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge className={`${getStatusColor(appointment.status)} border`}>
                        <div className="flex items-center space-x-1">
                          {getStatusIcon(appointment.status)}
                          <span className="capitalize">{appointment.status}</span>
                        </div>
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        {appointment.patient_phone && (
                          <div className="flex items-center space-x-1 text-sm">
                            <Phone className="w-3 h-3 text-muted-foreground" />
                            <span>{appointment.patient_phone}</span>
                          </div>
                        )}
                        {appointment.patient_email && (
                          <div className="flex items-center space-x-1 text-sm">
                            <Mail className="w-3 h-3 text-muted-foreground" />
                            <span className="truncate max-w-32">{appointment.patient_email}</span>
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedAppointment(appointment);
                            setIsViewDialogOpen(true);
                          }}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        {appointment.status === 'scheduled' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleStatusUpdate(appointment.id, 'confirmed')}
                            className="text-green-600 hover:text-green-700"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedAppointment(appointment);
                            setIsEditDialogOpen(true);
                          }}
                        >
                          <Edit className="w-4 h-4" />
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

      {/* View Appointment Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Appointment Details</DialogTitle>
            <DialogDescription>
              View complete appointment information
            </DialogDescription>
          </DialogHeader>
          {selectedAppointment && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Patient Name</Label>
                  <p className="text-sm text-muted-foreground">{selectedAppointment.patient_name}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Status</Label>
                  <Badge className={`${getStatusColor(selectedAppointment.status)} border mt-1`}>
                    {selectedAppointment.status}
                  </Badge>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Date</Label>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(selectedAppointment.appointment_date), 'MMMM dd, yyyy')}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Time</Label>
                  <p className="text-sm text-muted-foreground">{selectedAppointment.appointment_time}</p>
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium">Service</Label>
                <p className="text-sm text-muted-foreground">{selectedAppointment.service}</p>
              </div>
              {selectedAppointment.notes && (
                <div>
                  <Label className="text-sm font-medium">Notes</Label>
                  <p className="text-sm text-muted-foreground">{selectedAppointment.notes}</p>
                </div>
              )}
              {selectedAppointment.diagnosis && (
                <div>
                  <Label className="text-sm font-medium">Diagnosis</Label>
                  <p className="text-sm text-muted-foreground">{selectedAppointment.diagnosis}</p>
                </div>
              )}
              {selectedAppointment.treatment_plan && (
                <div>
                  <Label className="text-sm font-medium">Treatment Plan</Label>
                  <p className="text-sm text-muted-foreground">{selectedAppointment.treatment_plan}</p>
                </div>
              )}
              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
                  Close
                </Button>
                <Button 
                  variant="medical"
                  onClick={() => {
                    setIsViewDialogOpen(false);
                    setIsEditDialogOpen(true);
                  }}
                >
                  Edit Appointment
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
