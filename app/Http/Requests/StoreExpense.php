<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Validation\Rule;

class StoreExpense extends FormRequest
{
	/**
	 * Determine if the user is authorized to make this request.
	 *
	 * @return bool
	 */
	public function authorize()
	{
		return true;
	}

	/**
	 * Get the validation rules that apply to the request.
	 *
	 * @return array
	 */
	public function rules()
	{
		return [
			'item' => 'required|max:255',
			'year' => 'digits:4',
			'month'=> 'min:1|max:12',
			'cost' => 'required|numeric|max:99999999',
		];
	}

	protected function failedValidation(Validator $validator)
	{
		throw new HttpResponseException(response()->json($validator->errors()->all(), 422));
	}
}
