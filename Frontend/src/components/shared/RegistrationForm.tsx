import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast, Toaster } from 'sonner';
import US_STATES from '@/constants/states';
import { useEffect, useState } from 'react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormDescription,
  FormMessage,
} from '@/components/ui/form';
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from '@/components/ui/card';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  registerParent,
  registerEmployee,
  getFosterHomes,
  type FosterHome,
  type RegistrationData,
} from '@/api/userregistration';
import { supabaseClient } from '@/lib/supabaseclient';
import { getUserByEmail } from '@/api/user';
import useGlobalContext from '@/hooks/useGlobalContext';
import { useNavigate } from 'react-router-dom';

const baseSchema = z.object({
  firstname: z.string().min(1, 'First name is required'),
  lastname: z.string().min(1, 'Last name is required'),
  phone: z
    .string()
    .regex(/^[0-9]{3}-?[0-9]{3}-?[0-9]{4}$/, 'Enter a valid phone number (e.g. 123-456-7890)'),
  email: z.string().email('Enter a valid email'),
  address: z.string().min(5, 'At least 5 characters'),
  city: z.string().regex(/^[A-Za-z\s]+$/, 'Letters only'),
  state: z.string().min(1, 'Please select a state'),
  zip: z.string().regex(/^[0-9]{5,6}$/, '5-6 digits only'),
  password: z
    .string()
    .min(8, 'At least 8 characters')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).+$/,
      'Must contain uppercase, lowercase, number & special char'
    ),
  confirmPassword: z.string(),
});

const parentSchema = baseSchema
  .extend({
    fosterHomeId: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

const employeeSchema = baseSchema.refine(
  (data) => data.password === data.confirmPassword,
  {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  }
);

type ParentFormValues = z.infer<typeof parentSchema>;
type EmployeeFormValues = z.infer<typeof employeeSchema>;
type FormValues = ParentFormValues | EmployeeFormValues;

interface RegistrationFormProps {
  variant: 'parent' | 'employee';
  title: string;
  description: string;
}

const RegistrationForm = ({ variant, title, description }: RegistrationFormProps) => {
  const { setUser } = useGlobalContext();
  const navigate = useNavigate();

  const schema = variant === 'parent' ? parentSchema : employeeSchema;

  const defaultValues =
    variant === 'parent'
      ? {
          firstname: '',
          lastname: '',
          phone: '',
          email: '',
          address: '',
          city: '',
          state: '',
          zip: '',
          fosterHomeId: '',
          password: '',
          confirmPassword: '',
        }
      : {
          firstname: '',
          lastname: '',
          phone: '',
          email: '',
          address: '',
          city: '',
          state: '',
          zip: '',
          password: '',
          confirmPassword: '',
        };

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const onSubmit = async (data: FormValues) => {
    try {
      const registrationData: RegistrationData = {
        firstname: data.firstname,
        lastname: data.lastname,
        email: data.email,
        phone: data.phone.replace(/-/g, ''),
        address: data.address,
        city: data.city,
        state: data.state,
        zip: data.zip,
        ...(variant === 'parent' && 'fosterHomeId' in data
          ? { fosterHomeId: data.fosterHomeId }
          : {}),
      };

      if (variant === 'parent') {
        const result = await registerParent(registrationData);
        if (result === false) {
          toast.error('Selected foster home is full!');
          return;
        }
      } else {
        await registerEmployee(registrationData);
      }

      const supabaseResponse = await supabaseClient.auth.signUp({
        email: data.email,
        password: data.password,
      });

      if (supabaseResponse.error) {
        console.error('Supabase signUp error:', supabaseResponse.error);
        toast.error('Account creation failed: ' + supabaseResponse.error.message);
        return;
      }

      if (variant === 'parent') {
        const userData = await getUserByEmail(data.email);
        if (userData) {
          setUser(userData);
          form.reset();
          toast.success('Application submitted! An employee will review your application soon.', { duration: 5000 });
          setTimeout(() => navigate('/login'), 3000);
          return;
        }
      }

      form.reset();
      toast.success(`${data.firstname} ${data.lastname} successfully registered!`);
    } catch (err) {
      console.error('Registration error:', err);
      toast.error('Registration failed!');
    }
  };

  const [fosterHomes, setFosterHomes] = useState<FosterHome[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (variant !== 'parent') return;

    const loadFosterHomes = async () => {
      try {
        setLoading(true);
        const homes = await getFosterHomes();
        setFosterHomes(homes);
      } catch (error) {
        console.error('Error fetching foster homes:', error);
      } finally {
        setLoading(false);
      }
    };

    loadFosterHomes();
  }, [variant]);

  return (
    <>
      <Toaster richColors position="top-center" />
      <Card className="w-full max-w-2xl overflow-hidden rounded-2xl border-0 py-0 gap-0 shadow-xl">
        <div className="bg-gray-800 px-6 py-8">
          <CardTitle className="text-2xl font-extrabold text-white">
            {title}
          </CardTitle>
          <CardDescription className="mt-1 text-gray-400">
            {description}
          </CardDescription>
        </div>
        <CardContent className="px-6 py-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* First Name & Last Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="firstname"
                  render={({ field }) => (
                    <FormItem>
                      <Label htmlFor="firstname" className="text-gray-800 font-semibold">
                        First Name
                      </Label>
                      <FormControl>
                        <Input
                          id="firstname"
                          placeholder="John"
                          className="border-gray-300 bg-white focus-visible:ring-amber-500"
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
                      <Label htmlFor="lastname" className="text-gray-800 font-semibold">
                        Last Name
                      </Label>
                      <FormControl>
                        <Input
                          id="lastname"
                          placeholder="Doe"
                          className="border-gray-300 bg-white focus-visible:ring-amber-500"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Phone & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <Label htmlFor="phone" className="text-gray-800 font-semibold">
                        Phone Number
                      </Label>
                      <FormControl>
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="123-456-7890"
                          className="border-gray-300 bg-white focus-visible:ring-amber-500"
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
                      <Label htmlFor="email" className="text-gray-800 font-semibold">
                        Email
                      </Label>
                      <FormControl>
                        <Input
                          id="email"
                          type="email"
                          placeholder="john@example.com"
                          className="border-gray-300 bg-white focus-visible:ring-amber-500"
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
                    <Label htmlFor="address" className="text-gray-800 font-semibold">
                      Address
                    </Label>
                    <FormControl>
                      <Input
                        id="address"
                        placeholder="123 Main Street"
                        className="border-gray-300 bg-white focus-visible:ring-amber-500"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* City, State & Zip */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <Label htmlFor="city" className="text-gray-800 font-semibold">
                        City
                      </Label>
                      <FormControl>
                        <Input
                          id="city"
                          placeholder="New York"
                          className="border-gray-300 bg-white focus-visible:ring-amber-500"
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
                      <Label htmlFor="state" className="text-gray-800 font-semibold">
                        State
                      </Label>
                      <FormControl>
                        <select
                          id="state"
                          {...field}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500"
                        >
                          <option value="">Select a state</option>
                          {US_STATES.map((state) => (
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
                      <Label htmlFor="zip" className="text-gray-800 font-semibold">
                        Zip Code
                      </Label>
                      <FormControl>
                        <Input
                          id="zip"
                          placeholder="10001"
                          className="border-gray-300 bg-white focus-visible:ring-amber-500"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Foster Home (parent variant only) */}
              {variant === 'parent' && (
                <FormField
                  control={form.control}
                  name={'fosterHomeId' as any}
                  render={({ field }) => (
                    <FormItem>
                      <Label htmlFor="fosterHomeId" className="text-gray-800 font-semibold">
                        Foster Home
                      </Label>
                      <FormControl>
                        <select
                          {...field}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500"
                          disabled={loading}
                        >
                          <option value="">Select a Foster Home</option>
                          {fosterHomes.length > 0 ? (
                            fosterHomes.map((fh) => (
                              <option key={fh.id} value={fh.id}>
                                {fh.homeName}
                              </option>
                            ))
                          ) : (
                            <option value="">No foster homes available</option>
                          )}
                        </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {/* Password & Confirm Password */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <Label htmlFor="password" className="text-gray-800 font-semibold">
                        Password
                      </Label>
                      <FormControl>
                        <Input
                          id="password"
                          type="password"
                          placeholder="••••••••"
                          className="border-gray-300 bg-white focus-visible:ring-amber-500"
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
                      <Label htmlFor="confirmPassword" className="text-gray-800 font-semibold">
                        Confirm Password
                      </Label>
                      <FormControl>
                        <Input
                          id="confirmPassword"
                          type="password"
                          placeholder="••••••••"
                          className="border-gray-300 bg-white focus-visible:ring-amber-500"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormDescription>
                Min 8 characters with uppercase, lowercase, number & special
                character.
              </FormDescription>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-gray-800 text-white font-bold hover:bg-gray-900"
              >
                Register
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </>
  );
};

export default RegistrationForm;
