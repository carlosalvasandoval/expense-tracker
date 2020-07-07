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
				JWTAuth::setToken(JWTAuth::refresh());
				$user = JWTAuth::authenticate();
			}
			else
			{
				return response()->json([
					'code' => 3,
					'status' => 'Authorization Token not found']);
			}
		}
		$request->merge(array("access_token" => JWTAuth::getToken()->get()));
		return $next($request);

	}
}
