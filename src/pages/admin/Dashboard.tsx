import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/enhanced-button";
import AdminNavbar from "@/components/AdminNavbar";
import { 
  Calendar, 
  Users, 
  DollarSign, 
  TrendingUp, 
  Clock,
  AlertCircle,
  CheckCircle,
  Package
} from "lucide-react";

export default function Dashboard() {
  const stats = [
    {
      title: "Today's Appointments",
      value: "12",
      description: "3 pending confirmations",
      icon: Calendar,
      color: "text-blue-600"
    },
    {
      title: "Total Patients",
      value: "847",
      description: "+23 this month",
      icon: Users,
      color: "text-green-600"
    },
    {
      title: "Monthly Revenue",
      value: "$24,580",
      description: "+12% from last month",
      icon: DollarSign,
      color: "text-purple-600"
    },
    {
      title: "Average Rating",
      value: "4.9",
      description: "From 156 reviews",
      icon: TrendingUp,
      color: "text-yellow-600"
    }
  ];

  const recentAppointments = [
    {
      id: 1,
      patient: "Sarah Johnson",
      time: "9:00 AM",
      service: "General Checkup",
      status: "confirmed"
    },
    {
      id: 2,
      patient: "Michael Chen",
      time: "10:30 AM",
      service: "Teeth Cleaning",
      status: "confirmed"
    },
    {
      id: 3,
      patient: "Emma Wilson",
      time: "2:00 PM",
      service: "Root Canal",
      status: "pending"
    },
    {
      id: 4,
      patient: "David Brown",
      time: "3:30 PM",
      service: "Filling",
      status: "confirmed"
    }
  ];

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
    <div className="min-h-screen bg-background">
      <AdminNavbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here's what's happening today.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="shadow-card hover:shadow-elegant transition-smooth">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </CardTitle>
                  <Icon className={`w-5 h-5 ${stat.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground mb-1">
                    {stat.value}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {stat.description}
                  </p>
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
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5 text-primary" />
                  <span>Today's Appointments</span>
                </CardTitle>
                <CardDescription>
                  Manage your schedule for today
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentAppointments.map((appointment) => (
                    <div key={appointment.id} className="flex items-center justify-between p-4 rounded-lg border border-border">
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
                <div className="mt-6">
                  <Button className="w-full" variant="outline">
                    View All Appointments
                  </Button>
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
                    return (
                      <Button
                        key={index}
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
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}