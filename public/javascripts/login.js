/**
 * Created by Fengjin on 2016/7/13.
 */

function loginCheck() {
    var _userName = $("#username").val();
    var _password = $("#password").val();
    if(_userName==""){
        $("#username_span").css({"color":"red"}).text("用户名不得为空!");
        return false;
    }else if(_password==""){
        $("#password_span").css({"color":"red"}).text("用户密码不得为空!");
        return false;
    }else{
        return true;
    }
}