<?php

namespace App\Http\Middleware;

use Closure;
use Exception;
use JWTAuth;
use Tymon\JWTAuth\Http\Middleware\BaseMiddleware;

class Jwt extends BaseMiddleware
{
	/**
	 * Handle an incoming request.
	 *
	 * @param  \Illuminate\Http\Request  $request
	 * @param  \Closure  $next
	 * @return mixed
	 */
	public function handle($request, Closure $next)
	{
		try {
			$user = JWTAuth::parseToken()->authenticate();
		}
		catch (Exception $e)
		{
			if ($e instanceof \Tymon\JWTAuth\Exceptions\TokenInvalidException)
			{
				return response()->json([
					'code' => 1,
					'status' => 'Token is Invalid']);
			}
			else if ($e instanceof \Tymon\JWTAuth\Exceptions\TokenExpiredException)
			{
				return response()->json([
					'code' => 2,
					'status' => 'Token is Expired']);
			}
			else
			{
				return response()->json([
					'code' => 3,
					'status' => 'Authorization Token not found']);
			}
		}

		return $next($request);

	}
}
