(function ($) {
    "use strict";
    
    // Dropdown on mouse hover
    $(document).ready(function () {
        function toggleNavbarMethod() {
            if ($(window).width() > 992) {
                $('.navbar .dropdown').on('mouseover', function () {
                    $('.dropdown-toggle', this).trigger('click');
                }).on('mouseout', function () {
                    $('.dropdown-toggle', this).trigger('click').blur();
                });
            } else {
                $('.navbar .dropdown').off('mouseover').off('mouseout');
            }
        }
        toggleNavbarMethod();
        $(window).resize(toggleNavbarMethod);
    });
    
    
    // Back to top button
    $(window).scroll(function () {
        if ($(this).scrollTop() > 100) {
            $('.back-to-top').fadeIn('slow');
        } else {
            $('.back-to-top').fadeOut('slow');
        }
    });
    $('.back-to-top').click(function () {
        $('html, body').animate({scrollTop: 0}, 1500, 'easeInOutExpo');
        return false;
    });


    // Vendor carousel
    $('.vendor-carousel').owlCarousel({
        loop: false,
        margin: 29,
        nav: false,
        autoplay: true,
        smartSpeed: 1000,
        responsive: {
            0:{
                items:2
            },
            576:{
                items:3
            },
            768:{
                items:4
            },
            992:{
                items:5
            },
            1200:{
                items:6
            }
        }
    });


    // Related carousel
    $('.related-carousel').owlCarousel({
        loop: false,
        margin: 29,
        nav: false,
        autoplay: true,
        smartSpeed: 1000,
        responsive: {
            0:{
                items:1
            },
            576:{
                items:2
            },
            768:{
                items:3
            },
            992:{
                items:4
            }
        }
    });


    // Product Quantity



   
  
    
  
})(jQuery);


   let quantity=0


    $(".brand").on("click",function(){

        let brand=get_brand_filter();
        let color=get_color_filter();
        let size=get_size_filter();
        let locat=$("#url").val();
        
        $.ajax({
            method:"post",
            url:locat,
            data:{
                "brand":brand,
                "color":color,
                "size":size,
                "_token":$("#csrf").val()
            },
            success:function(data){
                $(".test").html(data);
            }
        })

    })

    $(".size").on("click",function(){

        let brand=get_brand_filter();
        let color=get_color_filter();
        let size=get_size_filter();
        let locat=$("#url").val();
        
        $.ajax({
            method:"post",
            url:locat,
            data:{
                "brand":brand,
                "color":color,
                "size":size,
                "_token":$("#csrf").val()
            },
            success:function(data){
                $(".test").html(data);
            }
        })

    })

    $(".color").on("click",function(){

        let color=get_color_filter();
        let brand=get_brand_filter();
        let size=get_size_filter();
        let locat=$("#url").val();
        
        $.ajax({
            method:"post",
            url:locat,
            data:{
                "color":color,
                "brand":brand,
                "size":size,
                "_token":$("#csrf").val()
            },
            success:function(data){
                $(".test").html(data);
            }
        })

    })



    function get_brand_filter(){
         var filter=[]
        $("."+"brand:checked").each(function(){
            filter.push($(this).val())
        })

        return filter;
        
    }

    
    function get_size_filter(){
        var filter=[]
       $("."+"size:checked").each(function(){
           filter.push($(this).val())
       })

       return filter;
       
   }


    function get_color_filter(){
        var filter=[]
       $("."+"color:checked").each(function(){
           filter.push($(this).val())
       })

       return filter;
       
   }


 


   if(document.getElementById("quantityinput")){
        $(".quantity button").prop("disabled",true);
        $(".quantity button").parent().parent().find('input').prop("disabled",true);
        $(".addtocart").prop("disabled",true);


        $(".size-radio").on("click",function(){

            $(".quantity button").prop("disabled",false);
            $(".quantity button").parent().parent().find('input').prop("disabled",false);
            $(".addtocart").prop("disabled",false);
        
            $(".quantity button").parent().parent().find('input').removeClass("cartinput");
            
        
                 let product_attribute_id=$(this).val()
                 let product_id=$("#product_id").val();
                 let url=$("#quantity_url").val();
                 $.ajax({
                     method:"post",
                     url:url,
                     data:{
                        product_attribute_id:product_attribute_id,
                        product_id:product_id,
                        "_token":$("#csrf").val(),
                     },
        
                     success:function(response){
                        
                        $("#itemprice").html(response["price"])
                        quantity=response["stock"]

                       
                        $(".quantity button").parent().parent().find('input').prop("min",1,true);
                        $(".quantity button").parent().parent().find('input').prop("max",quantity,true);
        
                     }
                     
                 })
        
           })
        
        
        
           $('.quantity button').on('click', function () {
            var button = $(this);
            var plusBtn=$(".btn-plus");
            var oldValue = button.parent().parent().find('input').val();
           
            if (button.hasClass('btn-plus')) {
        
                
                 var newVal = parseFloat(oldValue) + 1;
        
                if(newVal >= quantity){
                    
                    plusBtn.prop("disabled",true)
                    var newVal=quantity;
                }
                
                
            } else {
        
                plusBtn.prop("disabled",false)
                $(".quantity button").parent().parent().find('input').prop("disabled",false);
        
        
                if (oldValue > 1) {
                    var newVal = parseFloat(oldValue) - 1;
                }else{
                    newVal=1;
                }
            }
        
            
            button.parent().parent().find('input').val(newVal);
        });
        
        
        
        
           document.getElementById("quantityinput").addEventListener("keyup",function(event){
              
                if(!$("#quantityinput").val()){
                    $("#quantityinput").val(1)
                }
        
               if(event.which != 8 && isNaN(String.fromCharCode(event.which))){

                    event.preventDefault(); //stop character from entering input

                }else{
                    if(quantity){
                        let value=$("#quantityinput").val();
                        if(Number(value) >= Number(quantity)){
                            $("#quantityinput").val(quantity)
                            $(".btn-plus").prop("disabled",true);
        
                        }
                        else if(value[0]==0){
                            let newValue= value.replace(/^0+/, '');
                            $("#quantityinput").val(newValue)
        
                        }
                        else{
                           
                           
                        }
        
        
                    }
                }
              
           })
        
           $("#quantityinput").on("blur",  function() { 
            if(!$("#quantityinput").val()){
                $("#quantityinput").val(1);
            }
        });
        
        
        $(".addtocart").on("click",function(){
            let product_id=$("#product_id").val();
            let sku=$("#sku").val();
        
        })

        
   }else{
    $(".quantity button").prop("disabled",false);
    $(".quantity button").parent().parent().find('input').prop("disabled",false);
    $(".addtocart").prop("disabled",false);

    let btns=document.querySelectorAll('.btn-plus')
    let inputs=document.querySelectorAll(".quantityinput");


    // for(let i=0;i < btns.length ; i++){
    //     if(inputs[i].value >= $("#order_quantity").val()){

    //         btns[i].setAttribute("disabled",true);
    //     }
    // }

   
 

       $(".quantity button").on('click', function () {

            var button = $(this);
            var oldValue = $(this).parent().parent().find('input').val();
            var currentTr = $(this).parent().parent().parent().parent().attr("order_id");
            var order_price = $(this).parent().parent().parent().parent().attr("order_price");
            var order_quantity = $(this).parent().parent().parent().parent().attr("order_stock");

            
            var plusBtn=$(".btn-plus"+currentTr);

            let url=$("#url").val();
            var currentorderid = $(this).parent().parent().parent().parent().attr("order_id");

    
            if (button.hasClass("btn-plus"+currentTr)) {
        
                
                 if(oldValue == order_quantity){

                    var newVal=order_quantity
                 }else{
                    var newVal = parseFloat(oldValue) + 1;
                 }
    
    
                 
    
                if(newVal >= order_quantity){
    
                    $(this).parent().parent().find('input').val(order_quantity);
                    $("#totalPrice"+currentTr).html(newVal * order_price);

                    $("#totalPrice"+currentTr).html(newVal * order_price);

                    $("#totalPrice"+currentTr).html(newVal * order_price);

                    let itemtotalpricearray=[]
                    let tprices=document.querySelectorAll(".totalPrice")
                    for(let i=0;i<tprices.length;i++){

                       
                           if(tprices.length==1){

                            $("#itemtotal").html(tprices[i].innerHTML)
                            $(".itemtotal").val(tprices[i].innerHTML)
                            $("#alltotal").html(tprices[i].innerHTML);
                            $(".alltotal").val(tprices[i].innerHTML);


                           }else{

                            itemtotalpricearray.push(tprices[i].innerHTML)

                            console.log(itemtotalpricearray);
                            $("#itemtotal").html(itemtotalpricearray.reduce((s,l) => Number(s)+Number(l)))
                            $(".itemtotal").val(itemtotalpricearray.reduce((s,l) => Number(s)+Number(l)))

                            let itemtotalprice=$("#itemtotal").html();
                            let shippingprice=$("#shipping").html();

                            $("#alltotal").html(Number(itemtotalprice)+Number(shippingprice));
                            $(".alltotal").val(Number(itemtotalprice)+Number(shippingprice));

                           }
                       
                        

                    }
                    plusBtn.prop("disabled",true)

                    let totalitemfee= $("#totalPrice"+currentTr).html();

                    $.ajax({
                        method:"post",
                        url:url,
                        data:{
                           order_id:currentorderid,
                           newVal:newVal,
                           "_token":$("#csrf").val(),
                        },
           
                        success:function(response){
                            
                            
        
                        }    
                        
                    })
    
                }else{

                  

                    $("#totalPrice"+currentTr).html(newVal * order_price);

                    let totalitemfee= $("#totalPrice"+currentTr).html();

                    $.ajax({
                        method:"post",
                        url:url,
                        data:{
                           order_id:currentorderid,
                           newVal:newVal,
                           "_token":$("#csrf").val(),
                        },
           
                        success:function(response){
                            
                            
        
                        }    
                        
                    })

                    let itemtotalpricearray=[]

                    let tprices=document.querySelectorAll(".totalPrice")
                    for(let i=0;i<tprices.length;i++){

                       
                           if(tprices.length==1){

                            $("#itemtotal").html(tprices[i].innerHTML)
                            $(".itemtotal").val(tprices[i].innerHTML)
                            $("#alltotal").html(tprices[i].innerHTML);
                            $(".alltotal").val(tprices[i].innerHTML);


                           }else{

                            itemtotalpricearray.push(tprices[i].innerHTML)

                            console.log(itemtotalpricearray);
                            $("#itemtotal").html(itemtotalpricearray.reduce((s,l) => Number(s)+Number(l)))
                            $(".itemtotal").val(itemtotalpricearray.reduce((s,l) => Number(s)+Number(l)))

                            let itemtotalprice=$("#itemtotal").html();
                            let shippingprice=$("#shipping").html();

                            $("#alltotal").html(Number(itemtotalprice)+Number(shippingprice));
                            $(".alltotal").val(Number(itemtotalprice)+Number(shippingprice));


                           }
                       
                        

                    }
                }

               

    
               
                
            } else {
        
        
                if (oldValue > 1) {
                    var newVal = parseFloat(oldValue) - 1;
                }else{
                    newVal=1;
                }
    
                plusBtn.prop("disabled",false)
                $(".quantity button").parent().parent().find('input').prop("disabled",false);
               
    
                
                $("#totalPrice"+currentTr).html(newVal * order_price);

                let itemtotalpricearray=[]

                let tprices=document.querySelectorAll(".totalPrice")
                for(let i=0;i<tprices.length;i++){

                   
                       if(tprices.length==1){

                        $("#itemtotal").html(tprices[i].innerHTML)
                        $(".itemtotal").val(tprices[i].innerHTML)
                        $("#alltotal").html(tprices[i].innerHTML);
                        $(".alltotal").val(tprices[i].innerHTML);


                       }else{

                        itemtotalpricearray.push(tprices[i].innerHTML)

                        console.log(itemtotalpricearray);
                        $("#itemtotal").html(itemtotalpricearray.reduce((s,l) => Number(s)+Number(l)))
                        $(".itemtotal").val(itemtotalpricearray.reduce((s,l) => Number(s)+Number(l)))


                        let itemtotalprice=$("#itemtotal").html();
                        let shippingprice=$("#shipping").html();

                        $("#alltotal").html(Number(itemtotalprice)+Number(shippingprice));
                        $(".alltotal").val(Number(itemtotalprice)+Number(shippingprice));


                       }
                   
                    

                }

                let totalitemfee= $("#totalPrice"+currentTr).html();
    
                $.ajax({
                    method:"post",
                    url:url,
                    data:{
                       order_id:currentorderid,
                       newVal:newVal,
                       "_token":$("#csrf").val(),
                    },
       
                    success:function(response){
       
    
                    }
                    
                })
            }
        
            
           button.parent().parent().find("input").val(newVal);
        });
        


    
       



    for(let i=0;i < inputs.length;i++){
        inputs[i].addEventListener("keyup",function(event){


            

            var pressed=false;

            window.addEventListener("keydown",function(){
                if(!pressed){
                    pressed=true;
                }
            })



            window.addEventListener("keyup",function(){
                pressed=false
            })
            
            let input_quantity=$(this).val()
            let order_id=$(this).parent().parent().parent().attr("order_id");
            let order_price=$(this).parent().parent().parent().attr("order_price");
            let order_quantity=$(this).parent().parent().parent().attr("order_stock");
            let url=$("#url").val();

            
            if(event.which != 8 && isNaN(String.fromCharCode(event.which))){
                

               
                 event.preventDefault(); //stop character from entering input
    
                 
         
                 
                 
             }else{ 


            
                

                    if(Number(input_quantity) <= Number(order_quantity)){



                        // here can insert fail code blur that i remove
                                                                                                                                                                                                                        
                    

                      inputs[i].addEventListener("blur",  function() { 
                    if($(this).val()){

                                        let newValue=$(this).val();

                                        
                                        
                                        $(this).parent().parent().next().html($(this).val() * order_price);


                                        
                                        $(this).val(newValue)
                                    $(this).parent().parent().next().html($(this).val() * order_price);


                                    let itemtotalpricearray=[]

                                    let tprices=document.querySelectorAll(".totalPrice")
                                    for(let i=0;i<tprices.length;i++){

                                        
                                            if(tprices.length==1){

                                            $("#itemtotal").html(tprices[i].innerHTML)
                                            $(".itemtotal").val(tprices[i].innerHTML)
                                            $("#alltotal").html(tprices[i].innerHTML);
                                            $(".alltotal").val(tprices[i].innerHTML);


                                            }else{

                                            itemtotalpricearray.push(tprices[i].innerHTML)

                                            console.log(itemtotalpricearray);
                                            $("#itemtotal").html(itemtotalpricearray.reduce((s,l) => Number(s)+Number(l)))
                                            $(".itemtotal").val(itemtotalpricearray.reduce((s,l) => Number(s)+Number(l)))


                                            let itemtotalprice=$("#itemtotal").html();
                                            let shippingprice=$("#shipping").html();

                                            $("#alltotal").html(Number(itemtotalprice)+Number(shippingprice));
                                            $(".alltotal").val(Number(itemtotalprice)+Number(shippingprice));


                                            }
                                        
                                        

                                    }


                        $.ajax({
                        method:"post",
                        url:url,
                        data:{
                            order_id:order_id,
                            newVal:newValue,
                            "_token":$("#csrf").val(),
                        },

                        success:function(response){
                            
                            

                        }    
                        
                    })
                    }else{
                                        let newValue= 1;

                                        
                                        $(this).parent().parent().next().html($(this).val() * order_price);


                                        
                                        $(this).val(1)
                                    $(this).parent().parent().next().html($(this).val() * order_price);


                                    let itemtotalpricearray=[]

                                    let tprices=document.querySelectorAll(".totalPrice")
                                    for(let i=0;i<tprices.length;i++){

                                        
                                            if(tprices.length==1){

                                            $("#itemtotal").html(tprices[i].innerHTML)
                                            $(".itemtotal").val(tprices[i].innerHTML)

                                            }else{

                                            itemtotalpricearray.push(tprices[i].innerHTML)

                                            console.log(itemtotalpricearray);
                                            $("#itemtotal").html(itemtotalpricearray.reduce((s,l) => Number(s)+Number(l)))
                                            $(".itemtotal").val(itemtotalpricearray.reduce((s,l) => Number(s)+Number(l)))


                                            let itemtotalprice=$("#itemtotal").html();
                                            let shippingprice=$("#shipping").html();

                                            $("#alltotal").html(Number(itemtotalprice)+Number(shippingprice));
                                            $(".alltotal").val(Number(itemtotalprice)+Number(shippingprice));


                                            }
                                        
                                        

                                    }


                        $.ajax({
                        method:"post",
                        url:url,
                        data:{
                            order_id:order_id,
                            newVal:newValue,
                            "_token":$("#csrf").val(),
                        },

                        success:function(response){
                            
                            

                        }    
                        
                    })
                    }


});

   




 





                     
                        
                        $(this).parent().parent().next().html(input_quantity * order_price);

                        let itemtotalpricearray=[]

                        let tprices=document.querySelectorAll(".totalPrice")
                        for(let i=0;i<tprices.length;i++){
    
                           
                               if(tprices.length==1){
    
                                $("#itemtotal").html(tprices[i].innerHTML)
                                $(".itemtotal").val(tprices[i].innerHTML)
    
                               }else{
    
                                itemtotalpricearray.push(tprices[i].innerHTML)
    
                                console.log(itemtotalpricearray);
                                $("#itemtotal").html(itemtotalpricearray.reduce((s,l) => Number(s)+Number(l)))
                                $(".itemtotal").val(itemtotalpricearray.reduce((s,l) => Number(s)+Number(l)))


                                let itemtotalprice=$("#itemtotal").html();
                                let shippingprice=$("#shipping").html();
    
                                $("#alltotal").html(Number(itemtotalprice)+Number(shippingprice));
                                $(".alltotal").val(Number(itemtotalprice)+Number(shippingprice));

    
                               }
                           
                            
    
                        }

                        $.ajax({
                            method:"post",
                            url:url,
                            data:{
                               order_id:order_id,
                               newVal:input_quantity,
                               "_token":$("#csrf").val(),
                            },
               
                            success:function(response){
                                
                                
            
                            }    
                            
                        })
             
                     }
                       if(Number(input_quantity) >= Number(order_quantity)){


                             $(this).val(order_quantity)
                             $(this).parent().parent().next().html($(this).val() * order_price);


                             let itemtotalpricearray=[]

                             let tprices=document.querySelectorAll(".totalPrice")
                             for(let i=0;i<tprices.length;i++){
         
                                
                                    if(tprices.length==1){
         
                                     $("#itemtotal").html(tprices[i].innerHTML)
                                     $(".itemtotal").val(tprices[i].innerHTML)
         
                                    }else{
         
                                     itemtotalpricearray.push(tprices[i].innerHTML)
         
                                     console.log(itemtotalpricearray);
                                     $("#itemtotal").html(itemtotalpricearray.reduce((s,l) => Number(s)+Number(l)))
                                     $(".itemtotal").val(itemtotalpricearray.reduce((s,l) => Number(s)+Number(l)))


                                     let itemtotalprice=$("#itemtotal").html();
                                     let shippingprice=$("#shipping").html();
         
                                     $("#alltotal").html(Number(itemtotalprice)+Number(shippingprice));
                                     $(".alltotal").val(Number(itemtotalprice)+Number(shippingprice));

                                    }
                                
                                 
         
                             }
                             $(".btn-plus"+order_id).prop("disabled",true);


                             $.ajax({
                                method:"post",
                                url:url,
                                data:{
                                   order_id:order_id,
                                   newVal:$(this).val(),
                                   "_token":$("#csrf").val(),
                                },
                   
                                success:function(response){
                                    
                                    
                
                                }    
                                
                            })
        
        
         
                         }
                         else if(Number(input_quantity)==0){

                             let newValue= input_quantity.replace(/^0+/, 1);
                             $(this).val(newValue)
                            $(this).parent().parent().next().html($(this).val() * order_price);


                            let itemtotalpricearray=[]

                            let tprices=document.querySelectorAll(".totalPrice")
                            for(let i=0;i<tprices.length;i++){
        
                               
                                   if(tprices.length==1){
        
                                    $("#itemtotal").html(tprices[i].innerHTML)
                                    $(".itemtotal").val(tprices[i].innerHTML)
        
                                   }else{
        
                                    itemtotalpricearray.push(tprices[i].innerHTML)
        
                                    console.log(itemtotalpricearray);
                                    $("#itemtotal").html(itemtotalpricearray.reduce((s,l) => Number(s)+Number(l)))
                                    $(".itemtotal").val(itemtotalpricearray.reduce((s,l) => Number(s)+Number(l)))

                                    let itemtotalprice=$("#itemtotal").html();
                                    let shippingprice=$("#shipping").html();
        
                                    $("#alltotal").html(Number(itemtotalprice)+Number(shippingprice));
                                    $(".alltotal").val(Number(itemtotalprice)+Number(shippingprice));

        
                                   }
                               
                                
        
                            }


                             $.ajax({
                                method:"post",
                                url:url,
                                data:{
                                   order_id:order_id,
                                   newVal:newValue,
                                   "_token":$("#csrf").val(),
                                },
                   
                                success:function(response){
                                    
                                    
                
                                }    
                                
                            })
         
                         }
                         else if(input_quantity.length){

                            
        
                        }
                         else if(Number(input_quantity) < Number(order_quantity)){
        
                            $(".btn-plus"+order_id).prop("disabled",false);
        
                        }else{
                            
                            $(this).val(1)

        
                         }
                     
                     
                    
     
     
                 
             }
           
        })
    }

 
    

   }


// let profileInput=document.getElementById("profileinput");
// let profile=document.getElementById("profile");


// profile.addEventListener('click',function(){
//     profileInput.click();
// })


// profileInput.addEventListener("change",function(){

//     let img=profileInput.files[0]
//     let reader=new FileReader();
//     reader.addEventListener("load",function(){
//         profile.src=reader.result;
//     })
//     reader.readAsDataURL(img);

// })







   



// fail code blur
  



