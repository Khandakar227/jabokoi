import Layout from "@/components/common/Layout";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tabs } from "@radix-ui/react-tabs";

function Login() {
  return (
    <Layout>
      <main className="p-5 w-full flex justify-center items-center min-h-[90vh]">
      <Tabs defaultValue="Login" className="md:w-[400px]">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="Login">Login</TabsTrigger>
        <TabsTrigger value="Register">Register</TabsTrigger>
      </TabsList>
      <TabsContent value="Login">
        <Card>
          <CardHeader>
            <CardTitle>Login</CardTitle>
            <CardDescription>Login to track your memories</CardDescription>
          </CardHeader>
          <CardContent>
            <form>
              <div className="grid w-full items-center gap-4">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="user@gmail.com" />
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" type="password" placeholder="********" />
                </div>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button>Login</Button>
            <button>Forgot password?</button>
          </CardFooter>
        </Card>
      </TabsContent>
      <TabsContent value="Register">
        <Card>
          <CardHeader>
            <CardTitle>Register</CardTitle>
            <CardDescription>Don't have an account? Create one now!</CardDescription>
          </CardHeader>
          <CardContent>
            <form>
              <div className="grid w-full items-center gap-4">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" type="name" placeholder="Your User Name" />
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="user@gmail.com" />
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" type="password" placeholder="********" />
                </div>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button>Create Now</Button>
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
      </main>
    </Layout>
  );
}

export default Login;
