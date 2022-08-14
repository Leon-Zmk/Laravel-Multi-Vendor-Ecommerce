<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;


    public function section(){
        return $this->belongsTo(Section::class,"section_id")->select("id","name");
    }

    public function category(){
        return $this->belongsTo(Category::class,"category_id")->select("id","name");
    }

    public function attributes(){
        return $this->hasMany(ProductsAttribute::class);
    }
    
    public function images(){
        return $this->hasMany(ProductsImage::class);
    }

    public function attributesSizes(){
        return $this->hasMany(ProductsAttribute::class)->select("size");
    }

    public static function productCount($id){
        return $products=Product::where("category_id","$id")->get();
    }

    public function orders(){
        return $this->hasMany(Order::class);
    }

    
}
