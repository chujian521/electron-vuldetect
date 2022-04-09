const vulOptions = {
    '短信轰炸': ['repeat_with_yzmToken',],
    '短信验证码重复利用': ['sms_repeat_attack'], 
    '短信验证码未绑定': ['sms_unbind_attack', 'intercept_for_unbind'],
    '短信验证码返回前端': ['check_front'], 
    '短信内容可控': ['sms_content_control'], 
    '短信验证码可绕过': ['sms_repeat_attack', 'sms_unbind_attack', 'intercept_for_unbind', 'sms_brute_force_attack'],
    '短信验证码可爆破': ['sms_brute_force_attack'],
    '图形验证码返回前端': ['check_front'], 
    '验证码过于简单': ['sms_brute_force_attack', 'search_capic'], 
    '验证码长度可控': ['control_captcha_attack'],
    '验证码可识别': ['search_capic'], 
    '验证码重复利用': ['sms_repeat_attack'], 
    '邮件验证码安全': ['intercept_for_unbind'],
    '无验证码': ['no_captcha_check'], 
    '图形验证码可绕过': ['no_captcha_attack', 'search_capic', 'control_captcha_attack'], 
    '前端可控验证码生成': ['control_captcha_attack'],
    '登录绕过': ['interceptResponse'], 
    '密码重置无需原密码': ['change_passwd'], 
    '会话令牌写入URL': ['token_in_url'],
    '任意文件下载': ['arbitrary_file_download'],
}

export {
    vulOptions, 
}