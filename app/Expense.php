<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Expense extends Model
{
	use SoftDeletes;
	protected $guarded = [];

	public function scopeOrderByYearAndMonth($query)
	{
		return $query
			->orderBy('created_at', 'desc')
			->orderByRaw('DATE_FORMAT(created_at, "%Y") DESC')
			->orderByRaw('DATE_FORMAT(created_at, "%m") DESC');
	}
}
