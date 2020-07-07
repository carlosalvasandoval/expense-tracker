<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Expense extends Model
{
	use SoftDeletes;
	protected $guarded = [];

	public function scopeYears($query)
	{
		return $query
			->select('year')
			->groupBy('year')
			->orderBy('year', 'desc');
	}

	public function scopeMonths($query, $year)
	{
		return $query
			->select('month')
			->where('year', $year)
			->groupBy('month')
			->orderBy('month', 'desc');
	}
}
