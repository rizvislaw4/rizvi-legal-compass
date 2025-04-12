
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import GoogleButton from "./GoogleButton";
import { LoginForm, LoginFormValues } from "./LoginForm";
import { useToast } from "@/components/ui/toast";

export function AuthTabs() {
  const { toast } = useToast();

  const handleClientLogin = (data: LoginFormValues) => {
    console.log("Client login", data);
    toast({
      title: "Login Attempt",
      description: "This would authenticate a client in a real application",
    });
  };

  return (
    <Tabs defaultValue="staff" className="w-full max-w-md">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="staff" className="text-sm">Staff</TabsTrigger>
        <TabsTrigger value="client" className="text-sm">Client</TabsTrigger>
        <TabsTrigger value="admin" className="text-sm">Admin</TabsTrigger>
        <TabsTrigger value="lawyer" className="text-sm">Lawyer</TabsTrigger>
      </TabsList>
      <TabsContent value="staff" className="mt-4">
        <div className="space-y-4">
          <div className="text-center">
            <h3 className="font-semibold">Staff Login</h3>
            <p className="text-sm text-muted-foreground">
              For employees of Mahboob Rizvi Law Associates
            </p>
          </div>
          <GoogleButton />
        </div>
      </TabsContent>
      <TabsContent value="client" className="mt-4">
        <div className="space-y-4">
          <div className="text-center">
            <h3 className="font-semibold">Client Login</h3>
            <p className="text-sm text-muted-foreground">
              Use the login credentials provided by your lawyer
            </p>
          </div>
          <LoginForm onSubmit={handleClientLogin} />
        </div>
      </TabsContent>
      <TabsContent value="admin" className="mt-4">
        <div className="space-y-4">
          <div className="text-center">
            <h3 className="font-semibold">Admin Login</h3>
            <p className="text-sm text-muted-foreground">
              For administrative staff only
            </p>
          </div>
          <GoogleButton />
        </div>
      </TabsContent>
      <TabsContent value="lawyer" className="mt-4">
        <div className="space-y-4">
          <div className="text-center">
            <h3 className="font-semibold">Lawyer Login</h3>
            <p className="text-sm text-muted-foreground">
              For attorneys of Mahboob Rizvi Law Associates
            </p>
          </div>
          <GoogleButton />
        </div>
      </TabsContent>
    </Tabs>
  );
}
