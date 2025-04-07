<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CommonController extends Controller
{
    public function updateStatus(Request $request)
    {
        $updatePayload = [
            $request->fieldName => $request->value
        ];
        $updatedData = DB::table($request->tableName)->where($request->whereCondition)->update($updatePayload);

        if (!$updatedData) {
            return response()->json(['status' => 'error', 'message' => 'Failed to update status']);
        }
        // flash()->success('Status updated successfully');
        return response()->json(['status' => 'success', 'message' => 'Status updated successfully']);
    }

    public function checkAdminEmail(Request $request)
    {
        $email = $request->email;
        $exists = User::where('email', $email)->exists();
        return response()->json(!$exists);
    }
}
