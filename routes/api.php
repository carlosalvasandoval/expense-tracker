<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
 */

Route::group([
	'middleware' => 'api',
	'prefix' => 'v1',
], function ($router)
{
	Route::post('auth/login', 'AuthController@login');
	Route::post('auth/logout', 'AuthController@logout');
	Route::post('auth/refresh', 'AuthController@refresh');
    Route::post('auth/me', 'AuthController@me');
});

Route::group([
	'middleware' => 'jwt.verify',
	'prefix' => 'v1',
], function ($router)
{
    Route::apiResource('expenses', 'ExpenseController')->except('show','index');
    Route::get('expenses/list-years', 'ExpenseController@listYears');
    Route::get('expenses/list-months/{year}', 'ExpenseController@listMonths');
    Route::get('expenses/{month?}/{year?}', 'ExpenseController@index');
});
