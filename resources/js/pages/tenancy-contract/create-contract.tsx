import HeadingSmall from '@/components/heading-small';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { cn } from '@/lib/utils';
import { BreadcrumbItem, TenantType, Unit, UnitType } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import axios from 'axios';
import { Check, ChevronsUpDown } from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: route('dashboard'),
    },
    {
        title: 'Tenancy Contracts',
        href: route('tenancyContract.index'),
    },
    {
        title: 'Create Contract',
        href: route('tenancyContract.create'),
    },
];

type AddUnitForm = {
    unit_type: number;
    unit_no: string;
    floor_no: number | string;
    unit_size_sqm: number | string;
    unit_min_amount: number | string;
    unit_max_amount: number | string;
    unique_tenant_id: number | string;
};

export default function CreateContract({ tenantsData, unitTypes }: { tenantsData: TenantType[]; unitTypes: UnitType[] }) {
    const [open, setOpen] = useState(false);
    const [tenantName, setTenantName] = useState('');
    // const [tenantId, setTenantId] = useState('');

    const { data, setData, get, post, processing, errors, reset } = useForm<Required<AddUnitForm>>({
        unit_type: 0,
        unit_no: '',
        floor_no: '',
        unit_size_sqm: '',
        unit_min_amount: '',
        unit_max_amount: '',
        unique_tenant_id: '',
    });

    // console.log('data=', data);

    const [unitNumbers, setUnitNumbers] = useState<Unit[]>([]);

    const getUnitsNumbers = async (unitTypeId: string) => {
        try {
            const response = await axios.get(route('getUnitsByType'), {
                params: { unitTypeId },
            });
            setData('floor_no', '');
            setData('unit_size_sqm', '');
            setData('unit_min_amount', '');
            setData('unit_max_amount', '');
            if (response.data.length > 0) {
                setUnitNumbers(response.data);
            } else {
                setUnitNumbers([]);
            }
        } catch (error) {
            console.error('Error fetching unit numbers:', error);
        }
    };

    const fillUnitdetails = (value: string) => {
        const selectedUnit = unitNumbers.find((unit) => unit.unique_unit_id === value);
        if (selectedUnit) {
            setData('floor_no', selectedUnit.floor_no);
            setData('unit_size_sqm', selectedUnit.unit_size_sqm);
            setData('unit_min_amount', selectedUnit.unit_min_amount);
            setData('unit_max_amount', selectedUnit.unit_max_amount);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Contract" />
            <div className="flex h-full flex-1 flex-col rounded-xl p-4">
                <div className="mb-3">
                    <HeadingSmall title="Create Contract" description="Create a tenancy contract." />
                </div>
                <Card>
                    <CardContent>
                        <form>
                            <div className="border-accent mb-3 border-b text-center">
                                <HeadingSmall title="Unit Details" />
                            </div>
                            <div className="grid grid-cols-2 items-start gap-6">
                                <div className="grid gap-2">
                                    <Label htmlFor="unit_type">Unit Type *</Label>
                                    <Select
                                        onValueChange={(value) => {
                                            setData('unit_type', Number(value));
                                            getUnitsNumbers(value); // Fetch unit numbers when unit type changes
                                        }}
                                    >
                                        <SelectTrigger className="mt-1 w-full">
                                            <SelectValue placeholder="Select Unit Type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                {unitTypes.map((unitType, index) => (
                                                    <SelectItem key={index} value={unitType.unit_type_id.toString()}>
                                                        {unitType.unit_name}
                                                    </SelectItem>
                                                ))}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.unit_type} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="unit_no">Unit No. *</Label>
                                    <Select
                                        onValueChange={(value) => {
                                            setData('unit_no', value);
                                            fillUnitdetails(value);
                                        }}
                                    >
                                        <SelectTrigger className="mt-1 w-full">
                                            <SelectValue placeholder="Select Unit No." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                {unitNumbers.map((unitNo, index) => (
                                                    <SelectItem key={index} value={unitNo.unique_unit_id}>
                                                        {unitNo.unit_no}
                                                    </SelectItem>
                                                ))}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.unit_no} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="floor_no">Floor No. *</Label>
                                    <Input
                                        id="floor_no"
                                        type="text"
                                        className="bg-accent mt-1 block w-full"
                                        value={data.floor_no}
                                        readOnly
                                        placeholder="4"
                                    />
                                    <InputError message={errors.floor_no} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="unit_size_sqm">Unit Size(Sq.m) *</Label>
                                    <Input
                                        id="unit_size_sqm"
                                        type="text"
                                        className="bg-accent mt-1 block w-full"
                                        value={data.unit_size_sqm}
                                        readOnly
                                        placeholder="200.1"
                                    />
                                    <InputError message={errors.unit_size_sqm} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="unit_min_amount">Minimum Amount. *</Label>
                                    <Input
                                        id="unit_min_amount"
                                        type="text"
                                        className="bg-accent mt-1 block w-full"
                                        value={data.unit_min_amount}
                                        readOnly
                                        placeholder="5000.00"
                                    />
                                    <InputError message={errors.unit_min_amount} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="unit_max_amount">Maximum Amount. *</Label>
                                    <Input
                                        id="unit_max_amount"
                                        type="text"
                                        className="bg-accent mt-1 block w-full"
                                        value={data.unit_max_amount}
                                        readOnly
                                        placeholder="8000.00"
                                    />
                                    <InputError message={errors.unit_max_amount} />
                                </div>
                            </div>
                            <div className="border-accent mt-5 mb-3 border-b text-center">
                                <HeadingSmall title="Tenant Details" />
                            </div>
                            <div className="grid grid-cols-2 items-start gap-6">
                                <div className="grid gap-2">
                                    <Label htmlFor="tenant_id">Select Tenant *</Label>
                                    <Popover open={open} onOpenChange={setOpen}>
                                        <PopoverTrigger asChild>
                                            <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between">
                                                {tenantName
                                                    ? tenantsData.find((tenantsData) => tenantsData.tenant_name === tenantName)?.tenant_name
                                                    : 'Select Tenant'}
                                                <ChevronsUpDown className="opacity-50" />
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-full p-0">
                                            <Command>
                                                <CommandInput placeholder="Search Tenant..." />
                                                <CommandList>
                                                    <CommandEmpty>No Tenant found.</CommandEmpty>
                                                    <CommandGroup>
                                                        {tenantsData.map((tenantsData, index) => (
                                                            <CommandItem
                                                                key={index}
                                                                value={tenantsData.tenant_name}
                                                                onSelect={(currentValue) => {
                                                                    setTenantName(currentValue === tenantName ? '' : currentValue);
                                                                    setData('unique_tenant_id', tenantsData.unique_tenant_id);
                                                                    setOpen(false);
                                                                }}
                                                            >
                                                                {tenantsData.tenant_name}
                                                                <Check
                                                                    className={cn(
                                                                        'ml-auto',
                                                                        tenantName === tenantsData.tenant_name ? 'opacity-100' : 'opacity-0',
                                                                    )}
                                                                />
                                                            </CommandItem>
                                                        ))}
                                                    </CommandGroup>
                                                </CommandList>
                                            </Command>
                                        </PopoverContent>
                                    </Popover>
                                    <InputError message={errors.unit_type} />
                                </div>
                            </div>
                            <div className="mt-5 flex items-center gap-4">
                                <Button disabled={processing}>Submit</Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
