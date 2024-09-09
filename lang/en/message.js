const { talk_to_expert, brochure_download } = require("../../v1/controllers/user.controller");

module.exports = {

    'USER': {
        
        signUp_success: 'User signUp successfully.',
        login_success: 'Login successfully.',
        social_login_success: 'Social login successfully.',
        logout_success: 'Logout successfully.',
        logout_fail: 'Error while logging you out.',
        resetPassword_success: 'Your password has been updated successfully.',
        forgotPassword_success: 'Your password has been updated successfully.',
        userDetail_not_available: 'User details not available at this time.',
        invalidOldPassword: 'Please enter a valid old password.',
        passwordMinLength: 'Your password must contain at least 6 characters.',
        passwordUpdate_success: 'Your password successfully changed.',
        profile_fetch_success: 'Profile fetch successfull.',
        profile_update_success: 'Profile updated successfully.',
        email_not_found: 'Username/Email is not registered.',
        forgotPassword_email_success: 'Please check your email to reset password.',
        resend_email_success: 'Resend mail send successfully.',
        forgotPassword_email_fail: 'Error while sending link.',
        resetPassword_token_success: 'Token varified.',
        resetPassword_token_fail: 'Token expired.',
        password_update_fail: 'Error while updating password.',
        set_new_password_fail: 'Your link has been expired.',
        set_new_password_success: 'Your password has been reset successfully.',
        user_name_already_exist: 'This username has already been taken. Please enter a different username.',
        email_already_exist: 'Email already in use.',
        delete_account: 'Your account is deleted.',
        not_verify_account: 'Please verify your account.',
        deactive_account: 'Your account is deactivated by administrator.',
        inactive_account: 'Your account is deactivated by administrator.',
        account_verify_success: `Your account has been verified successfully. Please click 'Continue' in the app to proceed.`,
        account_verify_fail: 'Your account verify link expire or invalid.',
        password_mismatch: 'password and confirm password not matched.',
        invalid_username_password: "Invalid email or password.",
        invalid_password: "Invalid password.",
        user_data_retrieved_success : 'User data retrieved successfully.',
        user_activation : 'User activated successfully.',
        user_inactivation : 'User inactivated successfully.',
        user_deactivate : 'User deactivated successfully.',
        get_user_profile : 'User profile get profile.',
        user_deleted: 'User deleted successfully.',
        logout_success: "Logout successfully.",
        exist_email:'this email is already used please used another email',
        talk_to_expert:'Our representative will connect with you very soon',
        brochure_download_success:'brochure download successfully',
        fill_the_form_successfully:'your form has been successfully sumbit',
        no_image_upload:'please upload your ews certificate',
        successfully_post_your_story:'Your Story Post Successfully'
    
    },
    'GENERAL': {
        
        general_error_content: 'Something went wrong. Please try again later.',
        unauthorized_user: 'Unauthorized, please login.',
        invalid_user: 'You are not authorized to do this operation.',
        invalid_token: 'please enter a valid token',
        invalid_login: 'You are not authorized.',
        blackList_mail: `Please enter a valid email, we don't allow dummy emails.`
    },
}