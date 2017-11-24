$(function() {

    $('#login-form-link').click(function(e) {
        $("#login-form").delay(100).fadeIn(100);
        $("#register-form").fadeOut(100);
        $('#register-form-link').removeClass('active');
        $(this).addClass('active');
        e.preventDefault();
    });
    $('#register-form-link').click(function(e) {
        $("#register-form").delay(100).fadeIn(100);
        $("#login-form").fadeOut(100);
        $('#login-form-link').removeClass('active');
        $(this).addClass('active');
        e.preventDefault();
    });



    $('form').submit(function(e){
        e.preventDefault();
        var $this = $(this);
        var action = $this.attr('action');
        $this.parent().find('.alert').remove();
        var submit = true;
        var btn = $(this).find('button');
        $this.find('input[type="text"],input[type="password"]').attr('style','');

        $this.find('input[type="text"],input[type="password"]').each(function(){
            if($(this).val()==""){
                $(this).focus().css({'border-color':'#f44','box-shadow':'0 0 8px #f44'});
                submit = false;
                return false;
            }
        });
        if(submit == true){
            btn.button('loading');
            $.post(action,$(this).serialize(),function(data){
                if(data.error == 1){
                    $this.parent().prepend('<div class="alert alert-danger">'+data.message+'</div>');
                    if(data.focus && data.focus != "undefined"){
                        $('input[name="'+data.focus+'"]').focus().css({'border-color':'#f44','box-shadow':'0 0 8px #f44'});
                    }
                }else{
                    if(data.redir == "okk"){
                        $this.parent().prepend('<div class="alert alert-success">Login successfull, redirecting...</div>');
                        window.location = 'home.php';
                    }else{
                        $this.parent().prepend('<div class="alert alert-success">'+data.message+'</div>');
                    }
                }
            },"JSON").error(function(){
                alert('Request not complete.');
            }).always(function(){
                btn.button('reset')
            });
        }
        setTimeout(function(){

        },100)

    });
});