<?php

namespace App\Http\Controllers\AdminControllers;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Admin;
use App\Models\Vendor;
use App\Models\Vshop;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Intervention\Image\Facades\Image as FacadesImage;
use Image;

class AdminController extends Controller
{
    public function dashboard(){
        return view("admin.dashboard");
    }


    public function Register(Request $request){


        if($request->isMethod("POST")){

            $request->validate([
              
            ]);

            $vendor=new Vendor();
            $vendor->name=$request->name;
            $vendor->city=$request->city;
            $vendor->email=$request->email;
            $vendor->phone=$request->phone;
            $vendor->address=$request->address;


            $vendor->save();

            $admin=new Admin();
            $admin->name=$request->name;
            $admin->type="Vendor";
            $admin->vendor_id=$vendor->id;
            $admin->mobile=$request->phone;
            $admin->email=$request->email;
            $admin->password=Hash::make($request->password);
            $admin->status=0;

            $admin->save();

            return redirect()->route("dlogin");

        }else{

            return view("admin.register");

        }

       


    }

    public function registerShop(Request $request){


        if($request->isMethod("POST")){
            $request->validate([
                "shop_name"=>"required|max:20",
                "shop_address"=>"required",
                "shop_website"=>"nullable",
                "shop_mobile"=>"required",
                "shop_profile"=>"nullable|mimes:jpg,png|file|min:0|max:5000",
                "shop_background_profile"=>"nullable|mimes:jpg,png|file|min:0|max:5000",
                "shop_image_verification"=>"nullable|mimes:jpg,png|file|min:0|max:5000",
            ]);

            $shop=new Vshop();
            $shop->shop_name=$request->shop_name;
            $shop->shop_address=$request->shop_address;
            $shop->shop_website=$request->shop_website;
            $shop->shop_owner=Auth::guard("admin")->user()->vendor_id;
            $shop->shop_mobile=$request->shop_mobile;

            if($request->hasFile("shop_profile")){
                $img=$request->file("shop_profile");
                $newName=uniqid().Auth::guard("admin")->user()->id."shop_profile_image.".$img->extension();

                Image::make($img)->save("storage/shop_profiles/$newName");

                $shop->shop_profile=$newName;

            }
           
            if($request->hasFile("shop_background_profile")){
                $img=$request->file("shop_background_profile");
                $newName=uniqid().Auth::guard("admin")->user()->id."shop_background_image.".$img->extension();

                Image::make($img)->save("storage/shop_backgrounds/$newName");

                $shop->shop_background_profile=$newName;

            }

            if($request->hasFile("shop_image_verification")){
                $img=$request->file("shop_image_verification");
                $newName=uniqid().Auth::guard("admin")->user()->id."verification_image.".$img->extension();

                Image::make($img)->save("storage/verification_images/$newName");

                $shop->shop_image_verification=$newName;

            }
           
            $shop->save();

            return redirect()->back()->with("success_message","Shop details Register Successfully");
        
        }
        return view("vendors.register_shop");
    }

    public function login(Request $request){

        if($request->isMethod("POST")){
            $data=$request->all();
           

            if(Auth::guard("admin")->attempt(["email"=>$data['email'],"password"=>$data['password']]) && Auth::guard("admin")->user()->status==1){

                return redirect()->route("dashboard");
            }else{
                return redirect()->back()->with("status","email or password is incorrect please try again");
            }
        
        }
        return view("admin.login");
    }

    public function checkCurrentPassword(Request $request){

        $current_password=$request->current_password;
        if(Hash::check($current_password,Auth::guard("admin")->user()->password)){
            return "true";
        }else{
            return "false";
        }    
        
        
        
    }

    public function updatePassword(Request $request){

        if($request->isMethod("POST")){

            if(!Hash::check($request->current_password,Auth::guard("admin")->user()->password)){
                return redirect()->back()->with("error_message","Your current password is incorrect");
            }
            $request->validate([
             "new_password"=>"required",
             "confirm_password"=>"required|same:new_password",
            ]);

            $user=Admin::find(Auth::guard("admin")->user()->id);
            $user->password=Hash::make($request->new_password);
            $user->update();

            return redirect()->back()->with("success_message","Password updated successfully");

        };
        return view("admin.setting.admin_update_password");
    }

    public function updateDetails(Request $request){

        if($request->isMethod("POST")){

            $request->validate([
                "name"=>"nullable|regex:/^[a-zA-Z]+$/u|min:2|max:20",
                "mobile"=>"nullable|unique:admins,mobile|max:15"
        ]);

        if(!empty($request)){

           

            $user=Admin::find(Auth::guard("admin")->user()->id);
            if($request->name){
                $user->name=$request->name;
            }
            if($request->mobile){
                $user->mobile=$request->mobile;
            }

            if($request->hasFile("image")){

                $request->validate([
                    "image"=>"file|mimes:jpg,png|min:0|max:5000",
                ]);

                $img=$request->file("image");

                $newName=uniqid()."profile_photo.".$img->extension();

                Image::make($img)->save("storage/user_profile/$newName");

                $user->image=$newName;

            }

            $user->update();

            return redirect()->back()->with("success_message","Details updated successfully");

        }

        };
        return view("admin.setting.admin_update_detail");
    }



    //////////////



    public function updateVendorDetails(Request $request,$detail_type){


        if($request->isMethod("post")){
            if($detail_type=="password"){
                if(!Hash::check($request->current_password,Auth::guard("admin")->user()->password)){
                    return redirect()->back()->with("error_message","Your current password is incorrect");
                }

                $request->validate([
                    "new_password"=>"required",
                    "confirm_password"=>"required|same:new_password"
                ]);

                $user= Admin::find(Auth::guard("admin")->user()->id);
                $user->password=Hash::make($request->new_password);
                $user->update();
                return redirect()->back()->with("success_message","Password Updated Successfully");
            }
            elseif($detail_type=="personal"){

                $user=Vendor::find(Auth::guard("admin")->user()->vendor_id);

                $request->validate([
                    "name"=>"required|regex:/^[a-zA-Z]+$/u|min:2|max:15",
                    "city"=>"required",
                    "phone"=>"required|unique:vendors,phone,$user->id|max:15",
                    "address"=>"required",
                    "image"=>"nullable|mimes:jpg,png|file|min:0|max:5000",
                ]);



                $user=Vendor::find(Auth::guard("admin")->user()->vendor_id);
                $admin=Admin::find(Auth::guard("admin")->user()->id);
                $admin->name=$request->name;
                $user->name=$request->name;
                $user->city=$request->city;
                $user->phone=$request->phone;
                $admin->mobile=$request->phone;
                $user->address=$request->address;

                if($request->hasFile("image")){

                    $request->validate([
                        "image"=>"file|mimes:jpg,png|min:0|max:5000",
                    ]);
    
                    $img=$request->file("image");
    
                    $newName=uniqid()."profile_photo.".$img->extension();
    
                    Image::make($img)->save("storage/user_profile/$newName");
    
                    $admin->image=$newName;
    
                }

                $admin->update();
                $user->update();

                return redirect()->back()->with("success_message","Info Updated Successfully");
            }
            elseif($detail_type=="business"){
                $request->validate([
                    "shop_name"=>"required|max:20",
                    "shop_address"=>"required",
                    "shop_website"=>"nullable",
                    "shop_mobile"=>"required",
                    "shop_profile"=>"nullable|mimes:jpg,png|file|min:0|max:5000",
                    "shop_background_profile"=>"nullable|mimes:jpg,png|file|min:0|max:5000",
                    "shop_image_verification"=>"nullable|mimes:jpg,png|file|min:0|max:5000",
                ]);

                $shop=Vshop::find(Auth::guard("admin")->user()->vendor_id);
                $shop->shop_name=$request->shop_name;
                $shop->shop_address=$request->shop_address;
                $shop->shop_website=$request->shop_website;
                $shop->shop_mobile=$request->shop_mobile;

                if($request->hasFile("shop_profile")){
                    $img=$request->file("shop_profile");
                    $newName=uniqid().Auth::guard("admin")->user()->id."shop_profile_image.".$img->extension();

                    Image::make($img)->save("storage/shop_profiles/$newName");

                    $shop->shop_profile=$newName;

                }
               
                if($request->hasFile("shop_background_profile")){
                    $img=$request->file("shop_background_profile");
                    $newName=uniqid().Auth::guard("admin")->user()->id."shop_background_image.".$img->extension();

                    Image::make($img)->save("storage/shop_backgrounds/$newName");

                    $shop->shop_background_profile=$newName;

                }
               

                if($request->hasFile("shop_image_verification")){
                    $img=$request->file("shop_image_verification");
                    $newName=uniqid().Auth::guard("admin")->user()->id."verification_image.".$img->extension();

                    Image::make($img)->save("storage/verification_images/$newName");

                    $shop->shop_image_verification=$newName;

                }
               
                $shop->update();

                return redirect()->back()->with("success_message","Shop details updated Successfully");
            }
            else{

            }
        }

        return view("vendors.update_vendor_detail",compact("detail_type"));
    }

    /////////////// end update section


    //////start management section



    public function admins($type=null){

       if(!empty($type)){
        $usersdetail=Admin::where("type",$type)->get();
       }
       else{
        
            $type="All";
            $usersdetail=Admin::all();
       }
        return view("admin.userManagement.admins",compact("type","usersdetail"));
    }

    public function detail($id=null){

        if(!empty($id)){
            $userdetail=Admin::with("personal","business")->where("id",$id)->first();
            return view("admin.userManagement.detail",compact("userdetail"));
        }else{
            return "No User";
        }

    }

    public function status(Request $request){

            $user=Admin::find($request->admin_id);
            if($request->status=="active"){
                $user->status=0;
            }
            else{
                $user->status=1;
            }

            $user->update();

            return response($user->status);
        

    }

    /////end management section

    public function logout(){
         Auth::guard("admin")->logout();
         return redirect()->route("dlogin");
    }
}
