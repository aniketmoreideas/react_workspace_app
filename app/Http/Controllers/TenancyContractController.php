<?php

namespace App\Http\Controllers;

use App\Models\Unit;
use App\Models\Tenant;
use App\Models\UnitType;
use Illuminate\Http\Request;
use App\Models\TenancyContract;
use Illuminate\Support\Facades\Auth;
use App\Http\Requests\TenancyContract\TenancyContractRequest;

class TenancyContractController extends Controller
{
    public function index()
    {
        $tenancyContractData = TenancyContract::with(['tenant', 'unit.unitType'])
            ->orderByDesc('contract_id')
            ->paginate(10);

        return inertia('tenancy-contract/contract-list', [
            'tenancyContractData' => $tenancyContractData,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $unitTypes = UnitType::where('status', 1)->get();
        $tenantsData = Tenant::where(['status' => 1])->get();
        return inertia('tenancy-contract/create-contract', [
            'tenantsData' => $tenantsData,
            'unitTypes' => $unitTypes,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(TenancyContractRequest $request)
    {
        $data = $request->validated();

        $data['unique_contract_no'] = $this->generateUniqueIds();
        $data['created_by'] = Auth::id();

        $createContract = TenancyContract::create($data);

        if ($createContract && isset($data['unique_unit_id'])) {
            Unit::where('unique_unit_id', $data['unique_unit_id'])->update(['status' => 0]);
        }

        return redirect()
            ->route('tenancyContract.index')
            ->with('success', 'Tenancy Contract Created Successfully');
    }


    /**
     * Display the specified resource.
     */
    public function show($unique_contract_no)
    {
        $tenancyContractData = TenancyContract::with(['tenant.created_user', 'unit.unitType', 'created_by_user'])
            ->where('unique_contract_no', $unique_contract_no)
            ->first();
        // dd($tenancyContractData);
        if (!$tenancyContractData) {
            return redirect()->route('tenancyContract.index')->with('error', 'Tenancy Contract Not Found');
        }
        return inertia('tenancy-contract/view-contract', [
            'tenancyContractData' => $tenancyContractData,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
