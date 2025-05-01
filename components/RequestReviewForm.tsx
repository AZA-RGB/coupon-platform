import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

export function RequestReviewForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col  items-center h-20 text-center">
                <div className="h-full">
                  <Avatar className="h-full w-full">
                    <AvatarImage
                      src="https://github.com/shadcn.png"
                      alt="@shadcn"
                    />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                </div>
                <h1 className="text-2xl font-bold">Provider Name</h1>
              </div>
              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  disabled
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="email">Phone number</Label>
                <Input type="email" placeholder="+963950501812" disabled />
              </div>
              <div className="grid gap-3">
                <Input disabled />
              </div>
              <div className="flex place-content-start gap-8">
                <Button type="submit">Accept request</Button>
                <Button
                  type="submit"
                  className="hover:bg-chart-5 bg-destructive"
                >
                  Cancle
                </Button>
              </div>
            </div>
          </form>
          <div className="bg-muted relative hidden md:block">
            <img
              src="../request.jpeg"
              alt="Image"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.9] "
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
