import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";

// Validation schema using Zod
const userSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(50),
  age: z.coerce.number().int().min(3, "Age must be at least 3").max(100, "Age must be less than 100"),
  gender: z.enum(["male", "female", "other", "prefer-not-to-say"]),
  education: z.enum(["preschool", "elementary", "middle-school", "high-school", "college", "graduate", "other"]),
  hasBeenDiagnosed: z.enum(["yes", "no", "unsure"]),
});

type UserFormValues = z.infer<typeof userSchema>;

const UserProfile: React.FC = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  // Get default values from localStorage if they exist
  const getDefaultValues = (): UserFormValues => {
    const savedUser = localStorage.getItem("userProfile");
    if (savedUser) {
      try {
        return JSON.parse(savedUser);
      } catch (e) {
        console.error("Failed to parse saved user data", e);
      }
    }
    
    return {
      name: "",
      age: 0,
      gender: "prefer-not-to-say",
      education: "other",
      hasBeenDiagnosed: "unsure",
    };
  };

  const form = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: getDefaultValues(),
  });

  const onSubmit = (data: UserFormValues) => {
    // Save user data to localStorage
    localStorage.setItem("userProfile", JSON.stringify(data));
    
    toast({
      title: "Profile saved",
      description: "Your profile information has been saved successfully.",
    });
    
    // Redirect to the checklist page instead of cognitive tests
    navigate("/checklist");
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-700">User Profile</h1>
      
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Your Information</CardTitle>
          <CardDescription>
            Please provide some information about yourself to help us personalize your assessment.
            This information will be used to provide more accurate results.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Your name" {...field} />
                    </FormControl>
                    <FormDescription>
                      This is how we'll address you in the application.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="age"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Age</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="Your age" 
                        min={3} 
                        max={100} 
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      Your age helps us adjust test difficulty and interpretation.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gender</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your gender" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                        <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Gender information helps with statistical analysis.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="education"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Education Level</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your education level" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="preschool">Preschool</SelectItem>
                        <SelectItem value="elementary">Elementary School</SelectItem>
                        <SelectItem value="middle-school">Middle School</SelectItem>
                        <SelectItem value="high-school">High School</SelectItem>
                        <SelectItem value="college">College/University</SelectItem>
                        <SelectItem value="graduate">Graduate School</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Education level helps contextualize test results.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="hasBeenDiagnosed"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Have you been diagnosed with dyslexia or learning difficulties?</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select an option" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="yes">Yes</SelectItem>
                        <SelectItem value="no">No</SelectItem>
                        <SelectItem value="unsure">Unsure</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      This helps us understand your background better.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="flex justify-end">
                <Button type="submit">Save Profile</Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserProfile;
