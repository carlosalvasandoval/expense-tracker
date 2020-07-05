<?php

namespace App\Http\Controllers;

use App\Expense;
use App\Http\Requests\StoreExpense;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ExpenseController extends Controller
{
	/**
	 * Display a listing of the resource.
	 *
	 * @return \Illuminate\Http\Response
	 */
	public function index()
	{
		$expenses = Expense::where('user_id', Auth::id())->OrderByYearAndMonth()->get();
		return response()->json(['data' => $expenses]);
	}

	/**
	 * Update the specified resource in storage.
	 *
	 * @param  \Illuminate\Http\Request  $request
	 * @param  int  $id
	 * @return \Illuminate\Http\Response
	 */
	public function update(StoreExpense $request, Expense $expense)
	{
		$expense->update($request->validated());
		return response()->json(['status' => 'Expense updated!']);
	}

	/**
	 * Remove the specified resource from storage.
	 *
	 * @param  int  $id
	 * @return \Illuminate\Http\Response
	 */
	public function destroy($id)
	{
		//
	}

	/**
	 * Store a newly created resource in storage.
	 *
	 * @param  \Illuminate\Http\Request  $request
	 * @return \Illuminate\Http\Response
	 */
	public function store(StoreExpense $request)
	{
		$userId = Auth::id();
		$validated = $request->validated();
		$validated['user_id'] = $userId;
		Expense::create($validated);
		return response()->json(['status' => 'new expense saved!']);
	}

}
