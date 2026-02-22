import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import US_STATES from "@/constants/states";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormDescription,
    FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { registerParent } from "@/api/userregistration";
import type { RegistrationData } from "@/api/userregistration";

const formSchema = z
    .object({
        username: z
            .string()
            .min(8, "At least 8 characters")
            .max(30, "Max 30 characters")
            .regex(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                "Must have uppercase, lowercase, number & special char"
            ),
        firstname: z.string().min(1, "First name is required"),
        lastname: z.string().min(1, "Last name is required"),
        phone: z
            .string()
            .regex(/^[0-9]{10}$/, "Phone number must be 10 digits"),
        email: z.string().email("Enter a valid email"),
        address: z
            .string()
            .min(5, "At least 5 characters"),
        city: z
            .string()
            .regex(/^[A-Za-z\s]+$/, "Letters only"),
        state: z
            .string()
            .min(1, "Please select a state"),
        zip: z
            .string()
            .regex(/^[0-9]{5,6}$/, "5-6 digits only"),
        // password: z
        //     .string()
        //     .min(8, "At least 8 characters")
        //     .regex(
        //         /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).+$/,
        //         "Must contain uppercase, lowercase, number & special char"
        //     ),
        // confirmPassword: z.string(),
    })
    // .refine((data) => data.password === data.confirmPassword, {
    //     message: "Passwords do not match",
    //     path: ["confirmPassword"],
    // })
    ;

type FormValues = z.infer<typeof formSchema>;

const ParentRegistration = () => {
    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: "",
            firstname: "",
            lastname: "",
            phone: "",
            email: "",
            address: "",
            city: "",
            state: "",
            zip: "",
            //password: "",
            //confirmPassword: "",
        },
    });

    const onSubmit = async (data: FormValues) => {

        try {
            console.log("Form data:", data);

            // Convert phone to number
            const registrationData = {
                ...data,
                phone: parseInt(data.phone, 10),  // Convert string to number
            };

            console.log("Sending to backend:", registrationData);

            const result = await registerParent(registrationData as any);
            form.reset();
            alert("Registration successful!");

        } catch (err: any) {
            const errorMessage = err.error || err.message || "Registration failed!";

            console.error("Registration error:", err);
            alert(errorMessage);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-100 via-orange-100 to-rose-200 p-4">
            <Card className="w-full max-w-2xl shadow-2xl">
                <CardHeader className="text-center">
                    <CardTitle className="text-3xl">Parent Registration</CardTitle>
                    <CardDescription>Create your account to get started</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            {/* Username */}
                            <FormField
                                control={form.control}
                                name="username"
                                render={({ field }) => (
                                    <FormItem>
                                        <Label htmlFor="username">Username</Label>
                                        <FormControl>
                                            <Input
                                                id="username"
                                                placeholder="Enter username"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            8-30 characters. Must include uppercase, lowercase, number & special character.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* First Name & Last Name */}
                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="firstname"
                                    render={({ field }) => (
                                        <FormItem>
                                            <Label htmlFor="firstname">First Name</Label>
                                            <FormControl>
                                                <Input
                                                    id="firstname"
                                                    placeholder="John"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="lastname"
                                    render={({ field }) => (
                                        <FormItem>
                                            <Label htmlFor="lastname">Last Name</Label>
                                            <FormControl>
                                                <Input
                                                    id="lastname"
                                                    placeholder="Doe"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* Phone & Email */}
                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="phone"
                                    render={({ field }) => (
                                        <FormItem>
                                            <Label htmlFor="phone">Phone Number</Label>
                                            <FormControl>
                                                <Input
                                                    id="phone"
                                                    type="tel"
                                                    placeholder="1234567890"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <Label htmlFor="email">Email</Label>
                                            <FormControl>
                                                <Input
                                                    id="email"
                                                    type="email"
                                                    placeholder="john@example.com"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* Address */}
                            <FormField
                                control={form.control}
                                name="address"
                                render={({ field }) => (
                                    <FormItem>
                                        <Label htmlFor="address">Address</Label>
                                        <FormControl>
                                            <Input
                                                id="address"
                                                placeholder="123 Main Street"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* City, State & Zip */}
                            <div className="grid grid-cols-3 gap-4">
                                <FormField
                                    control={form.control}
                                    name="city"
                                    render={({ field }) => (
                                        <FormItem>
                                            <Label htmlFor="city">City</Label>
                                            <FormControl>
                                                <Input
                                                    id="city"
                                                    placeholder="New York"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="state"
                                    render={({ field }) => (
                                        <FormItem>
                                            <Label htmlFor="state">State</Label>
                                            <FormControl>
                                                <select
                                                    id="state"
                                                    {...field}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                                >
                                                    <option value="">Select a state</option>
                                                    {US_STATES.map((state: any) => (
                                                        <option key={state.code} value={state.code}>
                                                            {state.name}
                                                        </option>
                                                    ))}
                                                </select>
                                            </FormControl>

                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="zip"
                                    render={({ field }) => (
                                        <FormItem>
                                            <Label htmlFor="zip">Zip Code</Label>
                                            <FormControl>
                                                <Input
                                                    id="zip"
                                                    placeholder="10001"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* Password & Confirm Password */}
                            {/* <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem>
                                            <Label htmlFor="password">Password</Label>
                                            <FormControl>
                                                <Input
                                                    id="password"
                                                    type="password"
                                                    placeholder="••••••••"
                                                    {...field}
                                                />
                                            </FormControl>

                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="confirmPassword"
                                    render={({ field }) => (
                                        <FormItem>
                                            <Label htmlFor="confirmPassword">Confirm Password</Label>
                                            <FormControl>
                                                <Input
                                                    id="confirmPassword"
                                                    type="password"
                                                    placeholder="••••••••"
                                                    {...field}
                                                />
                                            </FormControl>

                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                            </div>
                            <FormDescription>
                                Min 8 characters with uppercase, lowercase, number & special character.
                            </FormDescription>
                            */}
                            {/* Submit Button */}
                            <Button type="submit" variant="outline" className="w-full font-semibold py-3 text-lg rounded-lg transition-all duration-200" >
                                Register
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
};

export default ParentRegistration;