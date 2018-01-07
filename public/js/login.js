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



    $('form.jQuery').submit(function(e){
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
                    if(data.redir == "ok"){
                        $this.parent().prepend('<div class="alert alert-success">Login successfull, redirecting...</div>');
                        window.location = '/user/';
                    }else{
                        $this.parent().prepend('<div class="alert alert-success">'+data.message+'</div>');
                    }
                }
            },"JSON").fail(function(){
                alert('Request not complete.');
            }).always(function(){
                btn.button('reset')
            });
        }

    });
var btn;
$('form.upload').ajaxForm({
    dataType:'json',
    beforeSubmit: function(arr,$form) {
      var submit = true;
      $('.frm').remove();
      btn = $form.find('button');
      $form.find('input[type="text"],input[type="password"],input[type="file"]').attr('style','');
      $form.find('input[type="text"],input[type="password"],input[type="file"]').each(function(){
          if($(this).val()==""){
              $(this).focus().css({'border-color':'#f44','box-shadow':'0 0 8px #f44'});
              submit = false;
              return false;
          }
      });
      if(!submit) return false;
      btn.button('loading');
    },
    uploadProgress: function(event, position, total, percentComplete) {

    },
    success: function(data) {
      if(data && data.error == 0){
        $('form.upload').prepend('<div class="alert alert-success frm">'+data.msg+'</div> ');
        var time = new Date().getTime();
        $('#userpic').attr('src',$('#userpic').attr('src')+'?'+time);
      }else{
        $('form.upload').prepend('<div class="alert alert-danger frm">'+data.msg+'</div> ');
      }
    },
	complete: function(xhr) {
    btn.button('reset');
	}
});

});
