<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Expense extends Model
{
	use SoftDeletes;
	protected $guarded = [];

	public function scopeOrderByYearAndMonth($query, $month, $year)
	{
        return $query
            ->whereRaw('DATE_FORMAT(created_at, "%Y") = ?', $year)
            ->whereRaw('DATE_FORMAT(created_at, "%m") = ?', $month)
			->orderBy('created_at', 'desc');
    }
    
    public function scopeYears($query)
	{
        return  $query
            ->selectRaw('DATE_FORMAT(created_at, "%Y") as year')
            ->groupBy('year')
            ->orderBy('year', 'desc');
    }
    
    public function scopeMonths($query,$year)
	{
        return   $query
            ->selectRaw('DATE_FORMAT(created_at, "%m") as month')
            ->whereRaw('DATE_FORMAT(created_at, "%Y") = ?',$year)
            ->groupBy('month')
            ->orderBy('month', 'desc');
	}
}
