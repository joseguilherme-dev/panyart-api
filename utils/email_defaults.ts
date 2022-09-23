import { TOPT_STEP } from "./otp"

// RESET PASSWORD

export const resetPasswordDefaultSubject = `PASSWORD CHANGE REQUEST`
export const resetPasswordDefaultContent = (nickname: string, otp: string) => {
    const expiratesIn: number = (TOPT_STEP / 60) // Minutes

    return `Hey, ${nickname}!</br>
            You requested a password change at panyart.studio!<br/></br/>
            In order to verify that it's you that have requested it,<br/>
            please enter this verification code when requested:<br/></br/></br/>
            ${otp}<br/></br/></br/>
            It will be available for the next ${expiratesIn} minutes.<br/>
            After that, it will be necessary to generate another verification code.<br/><br/>
            Have a nice day, sweetie!`
}