"use client";

import { H2, P } from "@/components/Typography";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const FormSchema = z.object({
  code: z.string().min(1, {
    message: "Object Code must be at least 1 character long.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
});

export function PublicStartPage() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      code: "",
      email: "",
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    toast(
      `You submitted the following values: ${JSON.stringify(data, null, 2)}`
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <H2 className="text-red-500">this is not working yet</H2>
            <Separator />
            <br />
            <CardTitle>Update Location of an Object</CardTitle>
            <CardDescription>
              You not need to be signed in for this.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Object Code</FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="123XYZ" {...field} />
                  </FormControl>
                  <FormMessage />
                  <FormDescription>
                    The Object Code is a unique identifier for the object. It
                    can be found on the object itself.
                  </FormDescription>
                </FormItem>
              )}
            />

            <P>TODO: geo input</P>

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Deine Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="name@domain.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                  <FormDescription>
                    Die Email wird genutzt, um dir eine Bestätigung zu senden
                    und um anzuzeigen von wem die letzte Änderung gemacht wurde.
                    <br />
                    Die Email ist nicht öffentlich sichtbar.
                  </FormDescription>
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button type="submit">Submit Location</Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}
