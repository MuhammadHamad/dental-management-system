import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/enhanced-button";
import AdminSidebar from "@/components/AdminSidebar";
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { 
  Calendar, 
  Users, 
  DollarSign, 
  TrendingUp, 
  Clock,
  AlertCircle,
  CheckCircle,
  Package,
  Activity,
  BarChart3,
  ArrowUpRight,
  Phone,
  Mail
} from "lucide-react";
import { NavLink } from "react-router-dom";

export default function Dashboard() {
  const { toast } = useToast();
  const [stats, setStats] = useState([
    {
      title: "Today's Appointments",
      value: "0",
      description: "Loading...",
      icon: Calendar,
      color: "text-blue-600"
    },
    {
      title: "Total Patients",
      value: "0",
      description: "Loading...",
      icon: Users,
      color: "text-green-600"
    },
    {
      title: "Monthly Revenue",
      value: "PKR 0",
      description: "Loading...",
      icon: DollarSign,
      color: "text-purple-600"
    },
    {
      title: "Low Stock Items",
      value: "0",
      description: "Loading...",
      icon: Package,
      color: "text-yellow-600"
    }
  ]);

  const [recentAppointments, setRecentAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const today = format(new Date(), 'yyyy-MM-dd');

      // Fetch today's appointments
      const { data: todayAppointments } = await supabase
        .from('appointments')
        .select('*')
        .eq('appointment_date', today);

      // Fetch total patients count
      const { count: patientsCount } = await supabase
        .from('patients')
        .select('*', { count: 'exact', head: true });

      // Fetch recent appointments
      const { data: appointments } = await supabase
        .from('appointments')
        .select(`
          *,
          patients!inner (
            full_name
          )
        `)
        .order('created_at', { ascending: false })
        .limit(5);

      // Fetch low stock items (items where current_stock < minimum_stock)
      const { data: inventoryItems } = await supabase
        .from('inventory')
        .select('*');
      
      const lowStock = inventoryItems?.filter(item => 
        item.current_stock < item.minimum_stock
      ) || [];

      // Update stats
      const pendingCount = todayAppointments?.filter(apt => apt.status === 'scheduled').length || 0;
      setStats([
        {
          title: "Today's Appointments",
          value: String(todayAppointments?.length || 0),
          description: `${pendingCount} pending confirmation${pendingCount !== 1 ? 's' : ''}`,
          icon: Calendar,
          color: "text-blue-600"
        },
        {
          title: "Total Patients",
          value: String(patientsCount || 0),
          description: "Registered patients",
          icon: Users,
          color: "text-green-600"
        },
        {
          title: "Total Appointments",
          value: String(appointments?.length || 0),
          description: "Recent bookings",
          icon: DollarSign,
          color: "text-purple-600"
        },
        {
          title: "Low Stock Items",
          value: String(lowStock?.length || 0),
          description: "Require restocking",
          icon: Package,
          color: "text-yellow-600"
        }
      ]);

      // Update recent appointments
      const transformedAppointments = (appointments || []).map((apt: any) => ({
        id: apt.id,
        patient: apt.patients?.full_name || 'Unknown',
        time: apt.appointment_time,
        service: 'General Consultation',
        status: apt.status,
        date: apt.appointment_date
      }));
      setRecentAppointments(transformedAppointments.slice(0, 4));

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to load dashboard data'
      });
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    {
      title: "New Appointment",
      description: "Schedule a new patient appointment",
      icon: Calendar,
      color: "bg-blue-500"
    },
    {
      title: "Add Patient",
      description: "Register a new patient record",
      icon: Users,
      color: "bg-green-500"
    },
    {
      title: "Log Transaction",
      description: "Record a payment or expense",
      icon: DollarSign,
      color: "bg-purple-500"
    },
    {
      title: "Update Inventory",
      description: "Manage supplies and equipment",
      icon: Package,
      color: "bg-orange-500"
    }
  ];

  return (
    <div className="flex h-screen bg-background">
      <AdminSidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-card border-b border-border p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
              <p className="text-muted-foreground">Welcome back! Here's what's happening today.</p>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline" size="sm">
                <BarChart3 className="w-4 h-4 mr-2" />
                Reports
              </Button>
              <Button variant="medical" size="sm">
                <Calendar className="w-4 h-4 mr-2" />
                New Appointment
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto p-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <Card key={index} className="shadow-card hover:shadow-elegant transition-smooth">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">{stat.title}</p>
                        <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                        <p className="text-xs text-muted-foreground">{stat.description}</p>
                      </div>
                      <div className="w-12 h-12 gradient-primary rounded-lg flex items-center justify-center">
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Today's Appointments */}
            <div className="lg:col-span-2">
              <Card className="shadow-card">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center space-x-2">
                        <Calendar className="w-5 h-5 text-primary" />
                        <span>Today's Appointments</span>
                      </CardTitle>
                      <CardDescription>
                        Manage your schedule for today
                      </CardDescription>
                    </div>
                    <NavLink to="/admin/appointments">
                      <Button variant="outline" size="sm">
                        View All
                        <ArrowUpRight className="w-4 h-4 ml-2" />
                      </Button>
                    </NavLink>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentAppointments.map((appointment) => (
                      <div key={appointment.id} className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-accent/50 transition-smooth">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
                            <Clock className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium text-foreground">{appointment.patient}</p>
                            <p className="text-sm text-muted-foreground">{appointment.service}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <span className="text-sm font-medium text-foreground">{appointment.time}</span>
                          <div className="flex items-center space-x-2">
                            {appointment.status === 'confirmed' ? (
                              <CheckCircle className="w-4 h-4 text-success" />
                            ) : (
                              <AlertCircle className="w-4 h-4 text-warning" />
                            )}
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              appointment.status === 'confirmed' 
                                ? 'bg-success/10 text-success' 
                                : 'bg-warning/10 text-warning'
                            }`}>
                              {appointment.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <div>
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>
                    Common tasks and shortcuts
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {quickActions.map((action, index) => {
                      const Icon = action.icon;
                      const getActionLink = (title: string) => {
                        switch (title) {
                          case "New Appointment":
                            return "/admin/appointments";
                          case "Add Patient":
                            return "/admin/patients";
                          case "Log Transaction":
                            return "/admin/transactions";
                          case "Update Inventory":
                            return "/admin/inventory";
                          default:
                            return "/admin";
                        }
                      };
                      
                      return (
                        <NavLink key={index} to={getActionLink(action.title)}>
                          <Button
                            variant="outline"
                            className="w-full justify-start h-auto p-4 text-left hover:shadow-soft"
                          >
                            <div className={`w-10 h-10 rounded-lg ${action.color} flex items-center justify-center mr-3 flex-shrink-0`}>
                              <Icon className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <p className="font-medium text-foreground">{action.title}</p>
                              <p className="text-xs text-muted-foreground">{action.description}</p>
                            </div>
                          </Button>
                        </NavLink>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card className="shadow-card mt-6">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Activity className="w-5 h-5 text-primary" />
                    <span>Recent Activity</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 text-sm">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-muted-foreground">Payment received from Sarah Johnson</span>
                    </div>
                    <div className="flex items-center space-x-3 text-sm">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-muted-foreground">New patient registered: Michael Chen</span>
                    </div>
                    <div className="flex items-center space-x-3 text-sm">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      <span className="text-muted-foreground">Low stock alert: Dental gloves</span>
                    </div>
                    <div className="flex items-center space-x-3 text-sm">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span className="text-muted-foreground">Appointment confirmed for tomorrow</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}