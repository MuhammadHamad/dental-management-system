import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { CLINIC_CONFIG } from '@/config/clinic';
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/enhanced-button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { RefreshCw, User, Shield, Database, CheckCircle } from 'lucide-react';

export default function AuthDebug() {
  const { user, userRole, createAdminUser } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [debugInfo, setDebugInfo] = useState<any>(null);

  const fetchDebugInfo = async () => {
    setLoading(true);
    try {
      if (!user) {
        setDebugInfo({ error: 'No user logged in' });
        return;
      }

      // Check user in auth.users
      const { data: authUser } = await supabase.auth.getUser();
      
      // Check user_roles table
      const { data: roles, error: rolesError } = await supabase
        .from('user_roles')
        .select('*')
        .eq('user_id', user.id);

      // Check profiles table
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id);

      // Check all users in user_roles (to see if table is empty)
      const { data: allRoles, error: allRolesError } = await supabase
        .from('user_roles')
        .select('*');

      setDebugInfo({
        authUser: authUser.user,
        currentUserRole: userRole,
        userRoles: roles,
        rolesError,
        profile,
        profileError,
        allRoles,
        allRolesError,
        userId: user.id
      });

    } catch (error) {
      setDebugInfo({ error: error.message });
    } finally {
      setLoading(false);
    }
  };

  const fixAdminRole = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      toast({
        title: "Manual Fix Required",
        description: "Please follow the manual steps below to assign admin role."
      });
      
      // Show manual instructions
      console.log("=== MANUAL ADMIN ROLE ASSIGNMENT ===");
      console.log("1. Go to Supabase Dashboard: https://supabase.com/dashboard");
      console.log("2. Select your project");
      console.log("3. Go to Table Editor");
      console.log("4. Open 'user_roles' table");
      console.log("5. Click 'Insert' -> 'Insert row'");
      console.log("6. Fill in the following values:");
      console.log(`   - user_id: ${user.id}`);
      console.log(`   - clinic_id: 123e4567-e89b-12d3-a456-426614174000`);
      console.log(`   - role: admin`);
      console.log("7. Click 'Save'");
      console.log("8. Refresh this page and try again");
      console.log("=====================================");
      
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to assign admin role"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Authentication Debug Panel
            </CardTitle>
            <CardDescription>
              Debug authentication and role assignment issues
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Button onClick={fetchDebugInfo} disabled={loading}>
                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Fetch Debug Info
              </Button>
              
              {user && (
                <Button onClick={fixAdminRole} disabled={loading} variant="medical">
                  <Shield className="w-4 h-4 mr-2" />
                  Assign Admin Role
                </Button>
              )}
            </div>

            {/* Current Status */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">User Status</span>
                    <Badge variant={user ? "default" : "destructive"}>
                      {user ? "Logged In" : "Not Logged In"}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">User Role</span>
                    <Badge variant={userRole === 'admin' ? "default" : "secondary"}>
                      {userRole || "No Role"}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Admin Access</span>
                    <Badge variant={userRole === 'admin' ? "default" : "destructive"}>
                      {userRole === 'admin' ? "Granted" : "Denied"}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Debug Information */}
            {debugInfo && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="w-5 h-5" />
                    Debug Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <pre className="bg-muted p-4 rounded-lg text-sm overflow-auto max-h-96">
                    {JSON.stringify(debugInfo, null, 2)}
                  </pre>
                </CardContent>
              </Card>
            )}

            {/* Quick Actions */}
            {user && userRole !== 'admin' && (
              <Card className="border-orange-200 bg-orange-50">
                <CardContent className="pt-4">
                  <div className="flex items-start gap-3">
                    <Shield className="w-5 h-5 text-orange-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-orange-800">Admin Role Missing - Manual Fix Required</h4>
                      <p className="text-sm text-orange-700 mt-1 mb-3">
                        Due to Row Level Security policies, we need to manually assign the admin role through Supabase Dashboard.
                      </p>
                      
                      <div className="bg-white p-3 rounded border text-xs">
                        <h5 className="font-medium text-orange-800 mb-2">Manual Steps:</h5>
                        <ol className="list-decimal list-inside space-y-1 text-orange-700">
                          <li>Go to <a href="https://supabase.com/dashboard" target="_blank" className="underline">Supabase Dashboard</a></li>
                          <li>Select your project: <code className="bg-orange-100 px-1 rounded">ecelipqxiqgzkvroahbq</code></li>
                          <li>Go to <strong>Table Editor</strong></li>
                          <li>Open <strong>user_roles</strong> table</li>
                          <li>Click <strong>Insert</strong> → <strong>Insert row</strong></li>
                          <li>Fill in these values:</li>
                        </ol>
                        <div className="mt-2 ml-4 bg-orange-50 p-2 rounded text-xs">
                          <div><strong>user_id:</strong> <code className="bg-white px-1">{user.id}</code></div>
                          <div><strong>clinic_id:</strong> <code className="bg-white px-1">{CLINIC_CONFIG.id}</code></div>
                          <div><strong>role:</strong> <code className="bg-white px-1">admin</code></div>
                        </div>
                        <ol start={7} className="list-decimal list-inside space-y-1 text-orange-700 mt-2">
                          <li>Click <strong>Save</strong></li>
                          <li>Refresh this page and check if role appears</li>
                        </ol>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {userRole === 'admin' && (
              <Card className="border-green-200 bg-green-50">
                <CardContent className="pt-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-green-800">Admin Access Ready</h4>
                      <p className="text-sm text-green-700 mt-1">
                        You have admin role assigned. You should be able to access the admin dashboard.
                      </p>
                      <Button 
                        className="mt-2" 
                        onClick={() => window.location.href = '/admin'}
                        size="sm"
                      >
                        Go to Admin Dashboard
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
